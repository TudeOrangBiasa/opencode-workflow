---
name: database-migrations
description: Use when safe, reversible database migration patterns — schema changes, data backfills, zero-downtime expand-contract, ORM-specific workflows. Use only when creating or reviewing database migrations.
---

# Database Migration Patterns

Adapted from ECC's `database-migrations` skill (MIT).

Safe, reversible database schema changes for production systems.

## When to Activate

- Creating or altering database tables
- Adding/removing columns or indexes
- Running data migrations (backfill, transform)
- Planning zero-downtime schema changes
- Setting up migration tooling for a new project

## Core Principles

1. **Every change is a migration** — never alter production databases manually
2. **Migrations are forward-only in production** — rollbacks use new forward migrations
3. **Schema and data migrations are separate** — never mix DDL and DML in one migration
4. **Test migrations against production-sized data** — a migration that works on 100 rows may lock on 10M
5. **Migrations are immutable once deployed** — never edit a migration that has run in production

## Migration Safety Checklist

Before applying any migration:

- [ ] Migration has both UP and DOWN (or is explicitly marked irreversible)
- [ ] No full table locks on large tables (use concurrent operations)
- [ ] New columns have defaults or are nullable (never add NOT NULL without default)
- [ ] Indexes created concurrently (not inline with CREATE TABLE for existing tables)
- [ ] Data backfill is a separate migration from schema change
- [ ] Tested against a copy of production data
- [ ] Rollback plan documented

See [REFERENCE.md](REFERENCE.md) for PostgreSQL patterns, Prisma/Drizzle/Kysely/Django/golang-migrate workflows, zero-downtime expand-contract strategy, and anti-patterns.
