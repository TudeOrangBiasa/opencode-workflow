---
name: to-tickets
description: Break plan/spec into tracer-bullet tickets with blocking edges. Publishes to tracker (local file or real tracker). Use when user wants to convert plan into issues.
disable-model-invocation: true
---

Break a plan, spec, or conversation into **tickets** — tracer-bullet vertical slices, each declaring tickets that **block** it.

The issue tracker and triage label vocabulary should have been provided — run `/agent-config` if not.

## Process

### 1. Gather context

Work from whatever is in the conversation context. If user passes a reference (spec path, issue URL), fetch and read its full body and comments.

### 2. Explore the codebase (optional)

If not already explored, do so. Use project's domain glossary in ticket titles/descriptions. Respect ADRs in area touched. Look for prefactoring opportunities — "make the change easy, then make the easy change."

### 3. Draft vertical slices

Break work into **tracer bullet** tickets:

- Each slice cuts a narrow but **complete** path through every layer (schema, API, UI, tests) — vertical, not horizontal
- A completed slice is demoable or verifiable on its own
- Each slice fits in a single fresh context window
- Prefactoring done first

Give each ticket its **blocking edges**. A ticket with no blockers starts immediately.

**Wide refactors** (one mechanical change, blast radius across codebase) break the vertical-slice rule. Sequence as **expand-contract**: add new form beside old → migrate call sites per-package → delete old form.

### 4. Quiz the user

Present proposed breakdown as numbered list. For each ticket: title, blocked-by list, what-it-delivers. Ask:

- Granularity right? (too coarse / too fine)
- Blocking edges correct?
- Merge or split any?

Iterate until user approves.

### 5. Publish to configured tracker

- **Local files** → one `tickets.md` in repo root, dependency order (blockers first).
- **Real tracker (GitHub, Linear...)** → one issue per ticket, use native blocking where available. Apply `ready-for-agent` label unless instructed otherwise.

Do NOT close or modify parent issue.

See [REFERENCE.md](REFERENCE.md) for templates.

Work the frontier one ticket at a time with `/implement`, clearing context between tickets.
