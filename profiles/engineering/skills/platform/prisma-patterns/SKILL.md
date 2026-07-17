---
name: prisma-patterns
description: Use when prisma ORM patterns for TypeScript backends — schema design, queries, transactions, pagination, soft delete, serverless pools, and critical traps. Use only when designing Prisma schemas, writing queries, or planning migrations.
---

# Prisma Patterns

Adapted from ECC's `prisma-patterns` skill (MIT).

Production patterns and non-obvious traps for Prisma ORM in TypeScript backends.
Tested against Prisma 5.x and 6.x. Some behaviors differ from Prisma 4.

Check the Prisma version before applying version-specific patterns:

```bash
npx prisma --version
```

Check the Prisma version before applying version-specific patterns:

```bash
npx prisma --version
```

For full patterns, code examples, and anti-patterns, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Designing or modifying Prisma schema models and relations
- Writing queries, transactions, or pagination logic
- Using `updateMany`, `deleteMany`, or any bulk operation
- Running or planning database migrations
- Deploying to serverless environments (Vercel, Lambda, Cloudflare Workers)
- Implementing soft delete or multi-tenant row filtering

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Core Concepts](REFERENCE.md#core-concepts) | ID strategy, schema defaults, include vs select, transactions, singleton, N+1 |
| [Code Examples](REFERENCE.md#code-examples) | Cursor pagination, soft delete, error handling, serverless pool |
| [Anti-Patterns](REFERENCE.md#anti-patterns) | updateMany trap, transaction timeouts, migrate dev risks, soft delete edge cases |
| [Best Practices](REFERENCE.md#best-practices) | Quick rules table |
| [Related Skills](REFERENCE.md#related-skills) | Cross-references
