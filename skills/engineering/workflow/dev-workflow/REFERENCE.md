# Dev Workflow — Reference

## Full Workflow Steps

### 1. Read the canonical reference

First, read `docs/development.md` at the repo root. It contains the full development workflow: setup, layout, decision trees for adding skills, modifying agents, syncing, testing, committing, releasing.

### 2. Identify the intent

| User intent | Section in `docs/development.md` |
|-------------|----------------------------------|
| "add skill X" / "new skill" | "Adding a Skill" |
| "sync from upstream" / "update drawio" | "Syncing from Upstream" |
| "change planner" / "modify agent" | "Modifying an Agent" |
| "new bucket" / "reorganize" | "Repository Layout" → bucket decision tree |
| "bump version" / "tag release" | "Releasing a Version" |
| "link not working" / "skill not loading" | "When Things Go Wrong" |
| "how to commit" | "Commit Conventions" + "CHANGELOG Conventions" |

### 3. Walk through the steps

For each intent, follow the steps in the doc. The doc is the source of truth — don't re-derive the workflow here.

### 4. Verify before commit

1. `./scripts/link-skills.sh` runs clean (exit 0)
2. New symlinks exist in `~/.config/opencode/skills/`
3. Restart OpenCode, no errors
4. The skill/agent behaves as expected (test with a small task if UI-affecting)
5. Clean `.bak-*` files: `find . -name "*.bak-*" -type f -delete`

### 5. Commit + push

- One logical change per commit
- Conventional prefix: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `cleanup:`
- Multi-line body for non-obvious changes
- Reference upstream version when syncing
- After commit: `git push origin main`

## Bucket Decision Tree

- Daily code work → `engineering/`
- General non-code tool → `productivity/`
- Specialist / on-demand → `misc/`
- Personal OpenCode setup → `personal/`
- Draft / WIP → `in-progress/`
- Retired → `deprecated/`

**Promotion rules**:
- `engineering/`, `productivity/`, `misc/` → listed in top-level `README.md` + bucket `README.md`
- `personal/`, `in-progress/`, `deprecated/` → NOT in top-level README; only in bucket README

## CHANGELOG Conventions

Categories: `Feature`, `Fix`, `Cleanup`, `Refactor`, `Wire`, `Documentation`.

Format: prefix each item with the category. Group released items under a dated version section. Unreleased items stay under `[Unreleased]`.

## Local vs Repo

**In repo** (versioned, shared):
- `agents/*.md` (source of truth for agent files)
- `skills/**/SKILL.md` (source of truth for skills)
- `scripts/link-skills.sh`
- `docs/**`
- `CHANGELOG.md`, `README.md`, `AGENTS.md`

**Local only** (`~/.config/opencode/`):
- `opencode.json` — model routing, permissions, skill triggers
- Symlinks to repo paths (created by `link-skills.sh`)

If you change `opencode.json` locally, that change is **not** in the repo. If it should be persistent, document it in `docs/install.md` or commit a config template to `.opencode/opencode.json.example`.

## Rules

- Never commit `opencode.json` (local config)
- Never commit agent `prompt` fields into `opencode.json` (use `agents/*.md`)
- The link script is non-destructive — don't bypass the safety check
- Test before pushing (run link-skills.sh, restart OpenCode, smoke test)
- One logical change per commit
- Update CHANGELOG with every change
- When in doubt, read `docs/development.md` first
