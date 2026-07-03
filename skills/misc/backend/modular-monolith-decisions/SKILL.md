---
name: modular-monolith-decisions
description: Architecture decision framework for backend evolution, extracted from a hands-on teaching video. Walks a Google Drive clone from single server → stateless+DB → load balancer → API gateway → microservices → object storage+broker → cache+CDN. Use when designing backend architecture, deciding monolith vs microservices, planning scaling evolution, or teaching modular monolith thinking. Emphasizes context-dependent decisions, separation of concerns, and avoiding premature optimization.
---

# Modular Monolith Decisions

Decision framework for backend architecture evolution. Each stage solves a specific pain; promote to the next stage only when the pain appears.

## When to Use

- Designing a new backend and unsure where to start
- Deciding when to split a monolith into services
- Reviewing an architecture that feels over- or under-engineered
- Stuck on "should I add Kafka / gateway / cache layer?"
- Teaching modular monolith thinking to a team

## The 6-Stage Progression

| Stage | Add | Solves | Trigger to promote |
|---|---|---|---|
| 0 | Single server, data in process | — | Server dies = data lost |
| 1 | Decoupled relational DB | Data loss | Multi-server sync issue |
| 2 | Load balancer + horizontal scale | Capacity ceiling | Hiring more engineers + slow endpoints |
| 3 | API gateway | Domain routing, edge auth, private network | Need async / event-driven flows |
| 4 | Object storage + broker | Sync calls = lost side effects | 500+ users hitting same expensive endpoint |
| 5 | Cache + CDN + rate limit | Repeated work, geographic latency, abuse | Only when scale actually hurts |

**Rule:** If you can't name the pain, you don't need the stage.

## The 5 Decision Heuristics

1. **Don't promote until you feel the pain.** "An architecture might be the best for you at the current stage of the company."
2. **Premature optimization = overengineering.** Most teams don't need Kafka at launch.
3. **Separation of concerns applies at every scale.** Server↔DB (Stage 1), broker↔consumer (Stage 4), cache↔DB (Stage 5).
4. **LB vs gateway**: LB routes by health/URL prefix; gateway routes by domain, handles auth, aggregates responses.
5. **Architecture = "thinking in systems", not infrastructure.** Includes algorithms, product decisions, DB choice.

## When NOT to Use

- You know which stage you're in and need implementation details → use `modular-monolith-patterns` (structure) or `backend-patterns` (general)
- Greenfield prototype, no traffic expectations → start at Stage 1, skip the rest
- Distributed systems theory (consensus, CAP, sagas) → use a dedicated DS resource

## Companion Skills

- `modular-monolith-patterns` — *how* to structure a modular monolith (Client/Implementation, domain separation)
- `backend-patterns` — API design, repository, validation, error handling
- `api-design` — REST/GraphQL contract patterns
- `architecture-decision-records` — capture the decisions you make

## Reference

- Source video: https://youtu.be/Qa-7iWxDz1A
- Source transcript: 47KB, 1252 lines, English auto-generated subs
- Concept origin: Martin Fowler on architecture
- See [REFERENCE.md](REFERENCE.md) for full stage-by-stage detail, code patterns, and key quotes with timestamps.
