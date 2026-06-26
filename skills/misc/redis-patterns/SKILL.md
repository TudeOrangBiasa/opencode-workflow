---
name: redis-patterns
description: Use when redis data structures, caching strategies, distributed locks, rate limiting, pub/sub, streams, and connection management for production. Use only when adding caching, rate limiting, distributed coordination, or messaging with Redis.
---

# Redis Patterns

Adapted from ECC's `redis-patterns` skill (MIT).

Quick reference for Redis best practices across common backend use cases.

## How It Works

Redis is an in-memory data structure store that supports strings, hashes, lists, sets, sorted sets, streams, and more. Individual Redis commands are atomic on a single instance; multi-step workflows require Lua scripts, MULTI/EXEC transactions, or explicit synchronization to stay atomic. Data is optionally persisted via RDB snapshots or AOF logs. Clients communicate over TCP using the RESP protocol; connection pools are essential to avoid per-request handshake overhead.

## When to Activate

- Adding caching to an application
- Implementing rate limiting or throttling
- Building distributed locks or coordination
- Setting up session or token storage
- Using Pub/Sub or Redis Streams for messaging
- Configuring Redis in production (pooling, eviction, clustering)

For full patterns, code examples, and anti-patterns, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Adding caching to an application
- Implementing rate limiting or throttling
- Building distributed locks or coordination
- Setting up session or token storage
- Using Pub/Sub or Redis Streams for messaging
- Configuring Redis in production (pooling, eviction, clustering)

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Data Structures](REFERENCE.md#data-structure-cheat-sheet) | String, Hash, Set, Sorted Set, Stream, HyperLogLog |
| [Core Patterns](REFERENCE.md#core-patterns) | Cache-aside, write-through, invalidation, sessions |
| [Rate Limiting](REFERENCE.md#rate-limiting) | Fixed window, sliding window Lua |
| [Distributed Locks](REFERENCE.md#distributed-locks) | SET NX PX, Redlock |
| [Pub/Sub & Streams](REFERENCE.md#pubsub--streams) | Fire-and-forget vs durable queues |
| [Key Design](REFERENCE.md#key-design) | Naming conventions, TTL strategy |
| [Connection Mgmt](REFERENCE.md#connection-management) | Pooling, cluster, sentinel |
| [Eviction Policies](REFERENCE.md#eviction-policies) | LRU, LFU, TTL-based |
| [Anti-Patterns](REFERENCE.md#anti-patterns) | Common mistakes, stampede prevention |
| [Examples](REFERENCE.md#examples) | Use case recipes |
