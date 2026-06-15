# Docs and Research Boundaries

## Boundary

Docs should stay compact and operational. Research is temporary until promoted.

## Current Docs Shape

Top-level docs stay small:

- `docs/install.md` — activation steps
- `docs/workflow.md` — agents, skills, routing, AFK checkpoints
- `docs/models.md` — model tiers and routing candidates

Repo context stays in:

- `AGENTS.md` — working rules
- `CONTEXT.md` — domain language
- `docs/agents/` — Matt-skill tracker/domain config

## Out of Scope

- Splitting every decision into a separate top-level doc.
- Keeping sandbox research after decisions are promoted.
- Adding compatibility docs for non-OpenCode runtimes.
- Large research dumps in active docs.
- Mission-control/app design docs unless we decide to build that product.

## Rule

When research produces a decision:

1. Promote the decision into `docs/agents/`, `skills/`, `AGENTS.md`, `CONTEXT.md`, or `docs/workflow.md`.
2. Delete sandbox research files.
3. Add an out-of-scope boundary note only if future agents are likely to re-propose the rejected path.
