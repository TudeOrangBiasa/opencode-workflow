# OpenCode Workflow Kit

This repo is developed for OpenCode only. Do not add compatibility surfaces for other agent runtimes unless a task explicitly asks for it.

## Scope

- Source of truth for OpenCode agents in `agents/`.
- Source of truth for selected workflow skills in `skills/`.
- Documentation for local installation and model routing in `docs/`.
- Do not edit `~/.config/opencode` while maturing changes here unless the user explicitly asks to install or activate them.

## Skill Buckets

Skills are organized into bucket folders under `skills/`:

- `engineering/` — daily code work.
- `productivity/` — daily non-code workflow tools.
- `misc/` — kept around but rarely used.
- `personal/` — tied to personal setup, not promoted.
- `in-progress/` — drafts not ready to ship.
- `deprecated/` — no longer active.

Every skill in `engineering/`, `productivity/`, or `misc/` must have a reference in the top-level `README.md` and the relevant bucket `README.md`.

Skills in `personal/`, `in-progress/`, and `deprecated/` must not appear in the top-level active skill reference.

Each skill entry in the top-level `README.md` must link the skill name to its `SKILL.md`.

Each bucket folder has a `README.md` that lists every active skill in the bucket with a one-line description, with the skill name linked to its `SKILL.md`.

## OpenCode Agents

Agent files live in `agents/*.md` and use OpenCode-compatible frontmatter only.

Rules:

- `mode` must be `primary`, `subagent`, or `all`.
- `color` must be one of `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`, or a `#RRGGBB` hex color.
- Omit `model` in repo agent files unless pinning a real provider/model id. Do not use `model: inherit`.
- Prefer model routing in install docs or local user config, not hard-coded repo agent files.

## OpenCode Compatibility

- Prefer OpenCode paths: `~/.config/opencode/agents` and `~/.config/opencode/skills`.
- Keep install scripts non-destructive.
- OpenCode loads config, agents, and skills at startup; restart required after activation.
- Do not store secrets or provider keys in this repo.

## Workflow Principles

- **Cheap-first**: prefer cheap models for exploration and execution; reserve expensive models for planning, routing, review.
- **Maintainable**: keep agent files compact, skill triggers precise, docs minimal. Avoid duplicated rules.
- **Team-friendly**: conventions favor real project output (PRs, issues, changelogs) over ephemeral agent artifacts.
- **Anti-tech-debt**: every slice leaves the codebase no worse than found. Reject hacks, stubs, and workarounds.
- **Real project output**: prefer durable artifacts (PRs, commits, ADRs, verified test results) over agent-to-agent handoffs.

### Sandbox Research Lifecycle

- Sandbox research in `sandbox/` is temporary. Once decisions are promoted to `docs/agents/`, `skills/`, or `AGENTS.md`, delete the corresponding sandbox files.
- Do not treat sandbox findings as active policy until promoted.

### Verification Agent Decision

- Do not add `verifier` as a primitive agent until sustained usage proves an agent is needed.
- Start with `verify-evidence` on-demand skill (in `skills/misc/`). Load it for tool-based verification in AFK, high-risk, or evidence-gap scenarios.
- Promote to dedicated agent only if the skill is used in >50% of sessions and its routing/context cost justifies a separate agent file.

## Out-of-Scope Notes

`.out-of-scope/` contains rejected or intentionally deferred feature requests. It is not runtime config and not part of installation. Use it as maintainer context when similar requests reappear.
