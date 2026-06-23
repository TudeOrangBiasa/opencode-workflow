---
name: database-review
description: Database review checklist for SQL, migrations, schema design, indexes, RLS, transactions, query performance, and data integrity. Use only when a diff touches database structure, database queries, policies, or persistence semantics.
---

# Database Review

Use as a focused add-on to `review` or `reviewer`. Keep findings tied to changed persistence behavior.

## Checks

- **Schema**: correct types, `text` vs artificial varchar limits, timezone-aware timestamps, `numeric` for money, proper nullability/defaults.
- **Indexes**: foreign keys, `WHERE`/`JOIN` columns, composite order (equality first, range after), avoid unused duplicate indexes.
- **Constraints**: primary keys, unique constraints, foreign keys, check constraints, not just app-level validation.
- **RLS / tenancy**: policies enabled where needed, policy columns indexed, no app-only tenant filtering for sensitive data.
- **Transactions**: related writes atomic, locks held briefly, no external calls inside transactions.
- **Queries**: N+1 risks, unbounded scans, offset pagination on large tables, unsafe raw SQL, missing `EXPLAIN` for complex queries.
- **Migrations**: reversible where expected, safe for existing data, no destructive changes without migration plan.

## Commands

Use project-specific DB tooling. When safe and available:

```bash
EXPLAIN ANALYZE <query>;
```

Do not run destructive SQL. Do not connect to production databases.

## Output

```markdown
## Database Review

Risk: low | medium | high | critical

### Blockers
- [file:line] issue. Fix direction.

### Notes
- [file:line] issue. Fix direction.

Evidence reviewed: [migration/query/schema/test evidence]
```

For safe migration creation patterns, see `database-migrations`.
