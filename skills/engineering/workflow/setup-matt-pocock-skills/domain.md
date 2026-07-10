# Domain Docs — Design Reference

## What this file is

The project's **design taste reference** — concrete design tokens, anti-patterns, and component rules that AI agents (builder, reviewer, validator) load before any UI work. Captures the "why" behind visual decisions so agents produce work that matches the existing design language.

This file is the consumer rule: every UI-touching skill/agent reads this before generating or critiquing code.

## When to use

- Before any new UI component, page, or view
- Before any visual change (color, typography, spacing, layout)
- When critiquing existing UI for taste/aesthetic
- When refactoring view files
- When onboarding to a new repo (read this first to learn the design language)

## What goes here

A `design.md` (or `docs/agents/design.md`) per project containing:

1. **Design principles** — the "why" behind decisions (mood, intent, restraint vs. density)
2. **Tokens** — concrete values (colors, type scales, spacing, radii) in machine-parseable format
3. **Anti-patterns** — explicit things to never generate
4. **Component patterns** — how specific UI elements should look
5. **Reference examples** — links to good/bad examples in the codebase

If multi-domain (e.g. monorepo with separate frontend/backend, or multiple product surfaces), use `design-map.md` at the root pointing to per-domain `design.md` files.

## Layout

- **Single-domain**: one `design.md` at project root (or `docs/agents/design.md`)
- **Multi-domain**: `design-map.md` at project root + per-domain `design.md` files

## Consumer rules

- **builder** — reads `design.md` before any UI generation. Applies tokens, avoids anti-patterns, follows component rules.
- **validator** — reads `design.md` before UI critique. Judges against project's design language.
- **reviewer** — references `design.md` when reviewing UI changes for design consistency.
- **scout** — references design tokens when researching external UI patterns to match style.

## How this was created

Run the `setup-matt-pocock-skills` skill in this repo. It will scaffold:

- `docs/agents/issue-tracker.md` — where issues live
- `docs/agents/triage-labels.md` — triage label vocabulary
- `docs/agents/domain.md` — this file (and `design.md` / `design-map.md`)
- An `## Agent skills` block in `AGENTS.md` pointing to all three

For an existing `design.md`, the skill will preserve it. To rewrite, delete the file and re-run the skill.
