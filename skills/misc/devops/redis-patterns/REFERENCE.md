# Redis Patterns — Reference

> Full patterns, code examples, and anti-patterns. See SKILL.md for when-to-use.

## Data Structure Cheat Sheet

| Use Case | Structure | Example Key |
|---|---|---|
| Simple cache | String | `product:123` |
| User session | Hash | `session:abc` |
| Leaderboard | Sorted Set | `scores:weekly` |
| Unique visitors | Set | `visitors:2024-01-01` |
| Activity feed | List | `feed:user:456` |
| Event stream | Stream | `events:orders` |
| Counters/rate limits | String (INCR) | `ratelimit:user:123` |

## Core Patterns

Cache-aside (lazy loading), write-through cache, tag-based cache invalidation, session storage.

## Rate Limiting

Fixed window (simple pipeline), sliding window (Lua atomic script).

## Distributed Locks

Single-node with SET NX PX, release with Lua script. Redlock for multi-node.

## Pub/Sub & Streams

Pub/Sub for fire-and-forget. Redis Streams for durable queue with consumer groups, at-least-once delivery, replay.

## Key Design

Naming conventions: `resource:id:field` or `namespace:resource:id`. TTL strategy table (session 24h, API cache 5-15 min, rate limit = window size).

## Connection Management

Connection pooling, cluster mode, Sentinel for high availability.

## Eviction Policies

noeviction (queues), allkeys-lru (cache), volatile-lru (mixed), allkeys-lfu (skewed access), volatile-ttl (prioritize long-lived).

## Anti-Patterns

Keys with no TTL, KEYS *, large blobs, single Redis for everything, ignoring pool limits, cache miss stampede, FLUSHALL.

## Examples

Add caching to API endpoint, rate-limit by user, coordinate background jobs with locks, fan-out notifications.
