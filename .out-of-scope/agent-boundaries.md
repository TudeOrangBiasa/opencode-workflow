# Agent Boundaries

## Boundary

Do not add a new primitive agent unless it has a durable boundary that cannot be handled by an existing primitive agent plus an on-demand skill.

## Current Primitive Agents

- `orchestrator` — route, scope, synthesize
- `builder` — bounded edits and self-verification
- `reviewer` — Behavior + Change Health review gate
- `browser-qa` — runtime browser/UI evidence
- built-in `explore` — local repo discovery
- built-in `scout` — external docs/dependency/upstream source research

## Out of Scope

- Specialist agents for PHP, database, security, Laravel, React, Docker, API design, etc.
- `verifier` as a primitive agent for now.
- Separate E2E agent while `tdd` + `browser-qa` cover test creation and browser evidence.
- Architecture-review agent while `improve-codebase-architecture` exists.
- Duplicate custom `explore` or `scout` agents.

## Preferred Pattern

Specialist need → on-demand skill under `skills/misc/` or `skills/engineering/`.

Promote skill → agent only when all are true:

- Used in >50% of real sessions.
- Needs distinct permissions/tool access/model routing.
- Existing agent + skill pattern causes repeated failures.
- Added routing cost is justified.
