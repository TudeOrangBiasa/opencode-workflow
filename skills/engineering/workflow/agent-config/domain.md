# Domain Docs

## What this file is

The project's **domain language and decision record** — shared vocabulary (`CONTEXT.md`) and architecture decisions (`docs/adr/`). Agents read this before touching any area of the codebase to use consistent terminology and respect past design decisions.

This file defines consumer rules for domain docs. The actual domain language lives in `CONTEXT.md` (or multi-context files per `CONTEXT-MAP.md`).

## When to use

- Before any feature work — read `CONTEXT.md` for vocabulary, check `docs/adr/` for relevant decisions
- When terminology is ambiguous or overloaded — use `/grill-with-docs`
- Before making a hard-to-reverse decision — write an ADR
- When onboarding — read this first to learn the domain language

## What goes here (consumer rules)

- **All agents** — use `CONTEXT.md` vocabulary in code, tickets, and comments. Check `docs/adr/` for decisions in the area you're touching.
- **planner** — references domain terms when routing work. Ensures tickets use project language.
- **builder** — reads `CONTEXT.md` before implementing. Uses exact domain terms in code.
- **reviewer** — checks code uses project domain language, not invented alternatives.
- **advisor** — references domain model when giving architecture advice.

## Layout

- **Single-context**: one `CONTEXT.md` at project root
- **Multi-context**: `CONTEXT-MAP.md` at root pointing to per-area `CONTEXT.md` files

ADRs in `docs/adr/` numbered `NNNN-short-title.md`.

## How this was created

Run the `/agent-config` skill. It scaffolds:

- `docs/agents/issue-tracker.md` — where issues live
- `docs/agents/triage-labels.md` — triage label vocabulary
- `docs/agents/domain.md` — this file
- `docs/agents/design.md` — UI tokens (if frontend detected)
- An `## Agent skills` block in `AGENTS.md`
- `.opencode/skills/` — workspace skill symlinks

For existing files, the skill preserves them. To rewrite, delete and re-run.
