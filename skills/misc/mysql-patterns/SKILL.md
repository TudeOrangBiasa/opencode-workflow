---
name: mysql-patterns
description: Use when mySQL/MariaDB schema, indexing, queries, transactions, replication, and connection pool patterns for production backends. Use only when designing tables, reviewing migrations, debugging slow queries, or configuring database pools.
---

# MySQL Patterns

Adapted from ECC's `mysql-patterns` skill (MIT).

Use this skill when working on MySQL or MariaDB schema design, migrations,
slow-query investigation, queue-style transactions, connection pools, or
production database configuration. Prefer exact version checks before applying a
feature-specific pattern because MySQL and MariaDB have diverged in several SQL
details.

## Activation

- Designing MySQL or MariaDB tables, indexes, and constraints
- Reviewing migrations before they run on large production tables
- Debugging slow queries, lock waits, deadlocks, or connection exhaustion
- Adding keyset pagination, upserts, full-text search, JSON columns, or queues
- Configuring application connection pools, read replicas, TLS, or slow logs

## Version Check

Start by identifying the engine and version:

See [REFERENCE.md](REFERENCE.md) for detailed content: examples, patterns, anti-patterns, and reference tables.
