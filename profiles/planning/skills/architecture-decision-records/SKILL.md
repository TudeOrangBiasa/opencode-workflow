---
name: architecture-decision-records
description: Use when capture architectural decisions as structured ADRs — context, alternatives, rationale, consequences. Use only when a decision between significant alternatives is made or when reading existing ADRs.
---

# Architecture Decision Records

Adapted from ECC's `architecture-decision-records` skill (MIT).

Capture architectural decisions as they happen during coding sessions. Instead of decisions living only in Slack threads, PR comments, or someone's memory, this skill produces structured ADR documents that live alongside the code.

## When to Activate

- User explicitly says "let's record this decision" or "ADR this"
- User chooses between significant alternatives (framework, library, pattern, database, API design)
- User says "we decided to..." or "the reason we're doing X instead of Y is..."
- User asks "why did we choose X?" (read existing ADRs)
- During planning phases when architectural trade-offs are discussed

See [REFERENCE.md](REFERENCE.md) for ADR format template, full workflow details, decision detection signals, best practices, and category reference.

Decisions documented here affect all layers:

| Layer | Skills |
|-------|--------|
| **Backend** | `modular-monolith`, `backend-patterns`, `api-connector-builder`, `fastapi-patterns`, `mcp-server-patterns`, `laravel`, `django` |
| **Database/Platform** | `database-patterns`, `database-migrations`, `database-review`, `containers`, `flox-environments`, `shared-hosting-deployment` |
| **Frontend** | `react-patterns`, `angular-developer`, `nextjs-turbopack`, `nuxt4-patterns`, `vite-patterns`, `accessibility`, `design-skill`, `ui-to-vue` |

When writing ADRs, check these skills for existing patterns to avoid re-deciding settled questions. New architecture decisions may require updating the matching skill.

## ADR Lifecycle

```
proposed → accepted → [deprecated | superseded by ADR-NNNN]
```

- **proposed**: decision is under discussion, not yet committed
- **accepted**: decision is in effect and being followed
- **deprecated**: decision is no longer relevant (e.g., feature removed)
- **superseded**: a newer ADR replaces this one (always link the replacement)
