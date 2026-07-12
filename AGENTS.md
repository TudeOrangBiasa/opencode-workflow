1. OpenCode Workflow Kit
2. This repo is developed for OpenCode only. Do not add compatibility surfaces for other agent runtimes unless a task explicitly asks for it.

## Role

opencode-workflow is the **personal dotfiles + workflow pipeline**. It contains:

The AI agent's core workflow management skills

Personal setup scripts (install, hooks, audit)

Documentation for project decisions

Symlinks to heavy skills that live in their own repos (e.g., `documents-kit-skills/`)

Heavy skills (4+ external deps, fully automates a task, multiple patterns) live in their own repos and integrate via symlinks. See [docs/architecture.md](docs/architecture.md) and [docs/skills/extraction-criteria.md](docs/skills/extraction-criteria.md).

## Scope

- Source of truth for OpenCode agents in `agents/`.
- Source of truth for **pipeline-level** skills in `skills/` (write-a-skill, skill-author, dev-workflow, etc.)
- Source of truth for OpenCode plugins in `.opencode/plugins/` (repair-harness, taste, lesson-injector, ov-helper).
- Project boundaries in `.out-of-scope/` — what this repo does NOT do (see [boundary notes](../.out-of-scope/README.md)).
- Documentation for local installation and model routing in `docs/`.
- Symlinks to external skill packages in `skills/personal/`.
- Do not edit `~/.config/opencode` while maturing changes here unless the user explicitly asks to install or activate them.

## Skill authoring

All skill writing MUST follow **write-a-skill** principles:

- Description ≤ 1024 chars with "Use when..." triggers
- SKILL.md ≤ 100 lines (detail in REFERENCE.md)
- No time-sensitive info (dates, version refs)
- No "If X then Y" English if-statements — extract to `scripts/`
- Cross-skill references by name, not absolute path
- Deterministic work in scripts, not in skill prose

Before creating or modifying a skill, load: **write-a-skill** + **skill-author**.

Project-specific decisions (where to put a skill, portability rules):

- [docs/skills/extraction-criteria.md](docs/skills/extraction-criteria.md)
- [docs/skills/anti-hardcoded-pattern.md](docs/skills/anti-hardcoded-pattern.md)

Enforcement:

- `scripts/check-portable.sh` — hardcoded path lint
- `scripts/check-skill-structure.sh` — write-a-skill compliance
- `scripts/audit-skill.sh <path>` — full single-skill audit
- `scripts/pre-commit.sh` — runs all before commit (install with `scripts/install-hooks.sh`)

## Skill Buckets

Skills are organized into bucket folders under `skills/`:

- `engineering/` — daily code work, with 4 sub-directories: `planning/` (to-prd, to-issues, triage), `design/` (architecture-decision-records, design, grill-with-docs, improve-codebase-architecture), `quality/` (ai-regression-testing, diagnose, ponytail, production-audit, review, tdd, team-handoff-quality, verify-evidence), `workflow/` (canary-watch, codebase-onboarding, context-budget, deployment-patterns, git-workflow, github-ops, memory-dreaming, prototype, search-first, setup-matt-pocock-skills, skill-author, zoom-out).
- `productivity/` — daily non-code workflow tools. Includes `documents-kit/` sub-package (10 sub-skills + 15 tools + assets for document/presentation/diagram workflows).
- `misc/` — specialist domain skills, grouped into sub-directories (`frontend`, `backend`, `languages`, `security`, `ml`, `mobile`, `devops`, `data`).
- `personal/` — tied to personal setup, not promoted. Has 2 sub-areas: `workflow/` (dev-workflow, eval, idea-fragments, workflow-audit), `tools/` (ddev, openviking).
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

## Agent skills

- [Issue Tracker](docs/agents/issue-tracker.md) — local markdown issue layout
- [Triage Labels](docs/agents/triage-labels.md) — canonical role labels
- [Domain Docs](docs/agents/domain.md) — domain language + CONTEXT.md rules
- [Design Reference](docs/agents/design.md) — design tokens, anti-patterns, component rules
- [Invocation Rules](docs/agents/invocation.md) — model-invoked vs user-invoked skills
- [Writing Docs](docs/agents/writing-docs.md) — publishing skill docs to aihero.dev

### Delegation protocol

When delegating work to a subagent, always pass:
1. Task description + acceptance criteria
2. Relevant skills from `## Agent skills` above
3. Prior lessons from `ov find`
4. End instruction: "Store learnings via `ov add-memory`"

### Pre-flight checks

Before delegating tool-dependent work, verify:
- OfficeCLI: `.docx`/`.pptx`/`.xlsx` work → `officecli --version`
- Browser QA: UI validation → chrome-devtools MCP connected
- Web search: research → exa MCP rate limit (max 10/session)
- Drawing: diagrams → drawio desktop CLI
- Memory: OpenViking health check

### Skill integration flow

```
external skills repo → opencode-workflow/skills/<bucket>/<leaf>/<skill>
                    → ~/.config/opencode/skills/<bucket>/<leaf>/<skill>
                    → loaded by OpenCode via skill_triggers
```

All config changes (paths, triggers, MCP, plugins) MUST go through `opencode-workflow` first, never edited directly in `~/.config/opencode/`. See [docs/architecture.md](docs/architecture.md) for full details.

### Skills deployment to ~/.config/opencode/

`scripts/link-skills.sh` creates symlinks that preserve the bucket category structure, not flat:

```
~/.config/opencode/skills/
├── engineering/quality/diagnose/         → repo/engineering/quality/diagnose/
├── engineering/workflow/prototype/       → repo/engineering/workflow/prototype/
├── productivity/documents-kit/skills/drawio/  → external symlink via repo/
├── personal/workflow/eval/              → repo/personal/workflow/eval/
└── misc/frontend/accessibility/         → repo/misc/frontend/accessibility/
```

OpenCode scans 1 level deep per configured path. To match the bucket structure, `opencode.json` uses multiple leaf paths — one per sub-bucket that contains skills. `link-skills.sh` manages this automatically on install/update.

When adding a new external skill package:
1. Symlink it into `opencode-workflow/skills/<bucket>/<leaf>/`
2. Add `skill_triggers` entry to `opencode-workflow`'s agent config
3. Add MCP/plugin wiring to `opencode-workflow`'s install docs
4. Run `scripts/link-skills.sh` to update `~/.config/opencode/`

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

## Maintenance

### Bulk skill cleanup pattern (parallel subagents)

When fixing many skills at once for write-a-skill violations (P1: file size, P2: trigger):

Run `scripts/check-skill-structure.sh` to find affected skills

Split the list into 3 batches (~35 skills each)

Spawn 3 `builder` subagents in parallel, one per batch

Each subagent: read SKILL.md → pick split point → create REFERENCE.md → trim SKILL.md → add `Use when` to description if missing → verify

Re-run audit; expect 0 remaining issues for active skills

A single bash script with `sed`/awk can do the same work mechanically but loses context-aware decisions about where to split. Subagents are ~3x slower wall-clock but ~100% correct. Reserve scripts for deterministic ops (e.g., the audit itself), not creative refactors.

### Recent cleanup (2026-06-26)

- 104 active skills: 101 P1 (SKILL.md >100 lines) + 56 P2 (missing `Use when` trigger) + 50 both = 107 issues → 0 remaining
- 3 skills in `deprecated/` excluded by design
- SKILL.md average: 377 lines → 27 lines; 98 new REFERENCE.md created
- Done with 3 parallel builder subagents in 3 batches
- `check-skill-structure.sh` regex updated to `Use[ a-z]+when|use[ a-z]+when` (matches "Use only when", "Use whenever", etc.)
