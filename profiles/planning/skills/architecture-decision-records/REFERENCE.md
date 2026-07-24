# Architecture Decision Records — Reference

## ADR Format Template

```markdown
# ADR-NNNN: [Decision Title]

**Date**: YYYY-MM-DD
**Status**: proposed | accepted | deprecated | superseded by ADR-NNNN
**Deciders**: [who was involved]

## Context

What is the issue that we're seeing that is motivating this decision or change?

[2-5 sentences describing the situation, constraints, and forces at play]

## Decision

What is the change that we're proposing and/or doing?

[1-3 sentences stating the decision clearly]

## Alternatives Considered

### Alternative 1: [Name]
- **Pros**: [benefits]
- **Cons**: [drawbacks]
- **Why not**: [specific reason this was rejected]

### Alternative 2: [Name]
- **Pros**: [benefits]
- **Cons**: [drawbacks]
- **Why not**: [specific reason this was rejected]

## Consequences

### Positive
- [benefit 1]
- [benefit 2]

### Negative
- [trade-off 1]
- [trade-off 2]

### Risks
- [risk and mitigation]
```

## Workflow

### Capturing a New ADR

1. **Initialize** (first time only) — if `docs/adr/` does not exist, ask user for confirmation before creating the directory, `README.md` with index table header, and `template.md`. Do not create files without explicit consent.
2. **Identify the decision** — extract the core architectural choice being made.
3. **Gather context** — what problem prompted this? What constraints exist?
4. **Document alternatives** — what other options were considered? Why were they rejected?
5. **State consequences** — what are the trade-offs? What becomes easier/harder?
6. **Assign a number** — scan existing ADRs in `docs/adr/` and increment.
7. **Confirm and write** — present draft to user for review. Write to `docs/adr/NNNN-decision-title.md` only after explicit approval. If declined, discard without writing.
8. **Update the index** — append to `docs/adr/README.md`.

### Reading Existing ADRs

1. Check if `docs/adr/` exists. If not, respond: "No ADRs found. Would you like to start recording?"
2. Scan `docs/adr/README.md` index for relevant entries.
3. Read matching ADR files, present Context and Decision sections.
4. If no match: "No ADR found for that decision. Would you like to record one now?"

### Directory Structure

```
docs/adr/
├── README.md              ← index of all ADRs
├── 0001-use-nextjs.md
├── 0002-postgres-over-mongo.md
└── template.md
```

### ADR Index Format

```markdown
| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](0001-use-nextjs.md) | Use Next.js | accepted | 2026-01-15 |
```

## Decision Detection Signals

**Explicit signals** (record immediately):
- "Let's go with X", "We should use X instead of Y"
- "The trade-off is worth it because..."
- "Record this as an ADR"

**Implicit signals** (suggest recording, do not auto-create):
- Comparing two frameworks/libraries and reaching a conclusion
- Database schema design choice with stated rationale
- Architecture pattern decision (monolith vs microservices, REST vs GraphQL)
- Auth/authorization strategy decision
- Deployment infrastructure selection after evaluating alternatives

## What Makes a Good ADR

### Do
- Be specific — "Use Prisma ORM" not "use an ORM"
- Record the why — rationale matters more than the what
- Include rejected alternatives
- State consequences honestly
- Keep it short — readable in 2 minutes
- Use present tense — "We use X" not "We will use X"

### Don't
- Record trivial decisions (variable naming, formatting)
- Write essays (context section >10 lines is too long)
- Omit alternatives
- Backfill without marking original date
- Let ADRs go stale — superseded decisions reference their replacement

## Categories of Decisions Worth Recording

| Category | Examples |
|----------|---------|
| **Technology choices** | Framework, language, database, cloud provider |
| **Architecture patterns** | Monolith vs microservices, event-driven, CQRS |
| **API design** | REST vs GraphQL, versioning, auth mechanism |
| **Data modeling** | Schema design, caching strategy |
| **Infrastructure** | Deployment, CI/CD, monitoring |
| **Security** | Auth strategy, encryption, secret management |
| **Testing** | Framework, coverage targets, E2E vs integration |
| **Process** | Branching strategy, review process, release cadence |

## Integration with Other Skills

- **Planning-lead agent**: when proposing architecture changes, suggest creating an ADR
- **Validation-lead agent**: flag PRs with architectural changes missing an ADR
- **Engineering backend skills** — ADR decisions map to these implementation guides:

| ADR Category | Engineering Skill | Role |
|-------------|-------------------|------|
| Module boundaries, hexagonal arch | `modular-monolith` | Module design, ports/adapters, 6-stage progression |
| Layered arch, error handling, logging | `backend-patterns` | Service layer, caching, middleware, API patterns |
| REST/GraphQL API design | `api-connector-builder` | Endpoint structure, connector patterns |
| FastAPI project structure | `fastapi-patterns` | Pydantic v2, DI, async handlers, auth |
| MCP server architecture | `mcp-server-patterns` | Tools, resources, transport (stdio/HTTP) |
| Laravel architecture | `laravel` | Eloquent, queues, events, security |
| Django architecture | `django` | DRF, ORM, Celery, TDD |
| DB schema, migrations, caching | `database-patterns`, `database-migrations`, `database-review` | Schema design, zero-downtime, review checklist |
| Container/deploy strategy | `containers`, `shared-hosting-deployment` | Docker, K8s, cPanel, rollback |
| Dev environment, reproducibility | `flox-environments` | Declarative manifests, cross-platform |
| Frontend framework, component arch | `react-patterns`, `angular-developer`, `vite-patterns` | Component design, build tooling |
| SSR, routing, hydration | `nextjs-turbopack`, `nuxt4-patterns` | Route rules, data fetching, hydration safety |
| UI/UX design system | `design-skill`, `accessibility`, `ui-to-vue` | Tokens, a11y, mockup → code |

When an ADR is accepted, reference the matching engineering skill in its "Consequences" section so the implementing team knows which patterns to follow.
