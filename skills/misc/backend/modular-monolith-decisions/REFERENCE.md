# Modular Monolith Decisions — Reference

Deep dive on each stage, the patterns to reach it, and the key quotes from the source video that justify each decision.

Source: https://youtu.be/Qa-7iWxDz1A (47KB transcript, 1252 lines)

## Stage 0: Single server, data coupled

**Setup**: All state lives in the process (e.g. `map[ID]Location` in Go). One machine, no replication.

**Code smell**:
```go
var files = map[string]string{}  // data coupled to process
http.HandleFunc("/upload", uploadHandler)
```

**Pain that forces promotion**: Server dies → all data lost. Cannot scale to multiple servers (each has its own copy, no sync).

**Quote**: *"Data coupled to the machine = no scale and no resilience."*

**When to ship Stage 0**: Hackathon, throwaway prototype, < 100 users. Otherwise, skip directly to Stage 1.

---

## Stage 1: Stateless server + decoupled DB

**Setup**: Server holds no state. Relational DB owns the data. App can restart freely.

**Pattern**:
```
[ Client ] → [ Stateless Server ] → [ DB ]
```

**What changes**: Move state from in-memory map to DB rows. Server becomes replaceable.

**Pain that forces promotion**: Adding a second server instance causes sync issues (writes to one don't appear on the other).

**Key insight**: This is **separation of concerns** at the infrastructure level. Server is concerned with serving; DB is concerned with storing. They don't know about each other's lifecycle beyond a connection string.

**Quote**: *"The server is concerned with serving the user while the database is concerned with storing the data."*

**Heuristic**: If your data lives in process memory, you are at Stage 0. Promote immediately.

---

## Stage 2: Load balancer + horizontal scaling

**Setup**: LB in front of N stateless app instances. Single DB remains.

**Pattern**:
```
[ Client ] → [ LB ] → [ App×N ] → [ DB ]
```

**Load balancer algorithms** (pick by use case):

| Algorithm | When |
|---|---|
| Round-robin | Default, simple, equal-cost requests |
| Weighted round-robin | Heterogeneous machines (small vs large) |
| Sticky sessions | Per-user state on server (cache, in-flight work). Demo uses cookie-based session affinity via NGINX `upstream` blocks |
| Least-connections | Long-lived connections, uneven request duration |

**Vertical vs horizontal scaling**: Use both. Vertical = bigger machine (more RAM/CPU/disk). Horizontal = more machines. Auto-scaling policy: `min: 2, max: 10`, etc.

**Pre-gateway hint**: A load balancer can already route by URL prefix. `POST /upload` → specialized server. This is a hint of the gateway pattern, but it can't aggregate responses or do auth at edge.

**Pain that forces promotion**: Hiring more engineers + some endpoints slowing down. Team boundaries start to want service boundaries.

**Quote**: *"We have the power of the load balancer unlocked."*

---

## Stage 3: API gateway + service separation

**Setup**: Gateway becomes the single entry point. Auth, routing, response aggregation. Internal services live in a private network (VPC).

**Pattern**:
```
[ Client ] → [ Gateway ] → [ Auth Service ]
                         → [ Files Service ]
                         → [ Notifications Service ]
                         → [ Realtime Service ]
```

**Gateway responsibilities**:
- Route by domain (which service)
- Auth at edge (validate JWT, 401 if invalid)
- Aggregate responses (e.g. profile + auth in one call)
- Be the only public-facing surface (services are not exposed)

**Why gateway, not LB**: A load balancer can route by URL prefix but cannot aggregate responses, do auth at edge, or hide services behind a private network.

**Scaling**: The gateway itself can sit behind its own LB (it's now the bottleneck and SPOF).

**Pain that forces promotion**: Need async work, event-driven flows, side effects that must not be lost.

**Quote**: *"It's not just about codes, it's about thinking in systems."*

**Auth layering** (important nuance): You can validate token at gateway (no network call) and still have an auth service for login/refresh. The auth service signs tokens with a private key.

---

## Stage 4: Object storage + broker (event-driven)

**Setup**: Client gets a signed URL from the API, uploads directly to object storage (S3/GCS). Bucket emits event → broker (Kafka/RabbitMQ) → consumers fan out.

**Pattern**:
```
[ Client ] → [ Gateway ] → [ Files Service ] → [ DB: metadata ]
                         ← signed URL
[ Client ] → [ Object Storage ] (direct upload)
[ Object Storage ] → [ Broker ] → [ Thumbnail Service ]
                                → [ Realtime Service ]
                                → [ Notifications Service ]
```

**Why direct upload, not via server**:
- Relational DBs are not for blobs (200MB image, 20GB movie)
- Streaming through app server wastes memory and CPU
- Avoids timeout, prevents abuse

**Why broker, not direct service call**:
- **Durability**: message survives consumer crash
- **Retry**: redeliver on ack timeout
- **Fan-out**: one event → many consumers without producer knowing them
- **Dead letter queue**: surface what failed, alert to Slack/Discord

**What breaks with direct call**: `if thumbnail service is down → upload has no thumbnail → you don't know why`. Sync calls lose side effects on consumer failure.

**Pain that forces promotion**: 500+ users hitting the same expensive endpoint. The service is the bottleneck.

**Quote**: *"This is again just like the beginning of a server and a database. This is again separation of concerns but at a bigger scale."*

---

## Stage 5: Cache + CDN + rate limiting

### Cache (Redis)

**Cache metadata, not bytes.** RAM is expensive and finite. A 20MB video in Redis is wrong.

**Pattern**:
```
GET file:123
  → if cache hit: return
  → if miss: DB → cache.set → return
```

CDN: For large/static assets, geographic distribution. Edge hit bypasses the whole cluster. First user in Lisbon fetches from origin; next 499 users in Lisbon hit the CDN.

### Rate limiting

At the gateway or edge, count requests per user/IP in cache. Return `429 Too Many Requests` on threshold. Required before exposing anything at scale, otherwise malicious users exhaust resources.

**Quote**: *"You should not premature optimize. This is a whole overengineer problem on its own."*

**Trigger**: Don't add cache/CDN/rate limit at MVP. Add when scale actually hurts (10k+ MAU, repeated expensive queries, abuse signals).

---

## The 5 Decision Heuristics (verbatim from video)

1. **Context wins** — *"An architecture might be the best for you at the current stage of the company you're working at or it might not be. So this is really where decision comes in."*
2. **Don't overengineer** — *"I don't want to overengineer and I want to kind of teach you the intentional process of decision making."*
3. **Premature optimization is the enemy** — *"You should not premature optimize. This is a whole overengineer problem on its own."*
4. **Separation of concerns, at every scale** — Server↔DB, broker↔consumer, cache↔DB. Same pattern, bigger blast radius.
5. **Architecture is systems thinking** — *"It's not just about the codes, it's about thinking in systems... understanding the problem, the domain and then building some software solution that is going to solve that in the best way and that is going to scale in the future."*

---

## What This Skill Does NOT Cover

- **Implementation patterns** for modular monolith (Client/Implementation, domain separation, ArchUnit) → see `modular-monolith-patterns`
- **API design** (REST/GraphQL contracts, versioning) → see `api-design`
- **General backend patterns** (validation, error handling, logging) → see `backend-patterns`
- **Distributed systems theory** (consensus, CAP, sagas, exactly-once delivery) → use a dedicated DS resource
- **Specific tech tutorials** (Kafka setup, Redis cluster, NGINX config) — search the ecosystem

---

## Extraction Notes

- The video uses Go for code examples; the patterns are language-agnostic
- The "Google Drive clone" framing is scaffolding for the progression, not the point
- The video is opinionated but grounded — every stage has a stated trigger symptom
- The progression roughly matches: MVP → growth → scale → distributed
