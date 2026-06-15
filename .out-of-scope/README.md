# Out of Scope

Architecture boundary notes for this OpenCode workflow kit.

Purpose:

- Define where this repo stops.
- Prevent agent/skill sprawl.
- Preserve decisions that should not be re-litigated every session.
- Guide future agents when they propose new agents, nested orchestration, broad skills, or extra docs.

This directory is maintainer context only. It is not runtime config, not installed by scripts, and not part of activation.

## Current Boundary Notes

- [`agent-boundaries.md`](./agent-boundaries.md) — when not to add new agents.
- [`orchestration-boundaries.md`](./orchestration-boundaries.md) — no nested agents, no autonomous mega-orchestration.
- [`skill-placement-boundaries.md`](./skill-placement-boundaries.md) — where specific skills belong.
- [`docs-and-research-boundaries.md`](./docs-and-research-boundaries.md) — docs stay compact; sandbox is temporary.
- [`setup-skill-verify-mode.md`](./setup-skill-verify-mode.md) — no separate verify/check mode for setup skill.
- [`question-limits.md`](./question-limits.md) — no hard question caps for grilling; use natural-language steering.
- [`mainstream-issue-trackers-only.md`](./mainstream-issue-trackers-only.md) — issue-tracker integrations stay mainstream or local markdown.
