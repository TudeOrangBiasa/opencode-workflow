---
name: dev-workflow
description: Development workflow for the opencode-workflow repo itself. Walks through adding skills, modifying agents, syncing from upstream, and committing. Auto-loads docs/development.md. Triggers on "add skill to opencode-workflow", "new bucket", "sync from upstream", "update agent", "bump version", or any work that modifies this repo.
---

# OpenCode Workflow — Development Workflow

This skill walks through how to develop the `opencode-workflow` repo itself. It is **not** for using the workflow kit on projects — see the kit's docs for that.

**The canonical reference is [`docs/development.md`](../../docs/development.md) in this repo.** This skill auto-loads that doc and walks you through the relevant section based on your intent.

## When to Activate

Use this skill when the user wants to:

- Add a new skill to opencode-workflow (from upstream, from global, or from scratch)
- Modify an existing agent file (`agents/*.md`)
- Move a skill between buckets
- Add a new bucket (engineering, productivity, misc, personal, in-progress, deprecated)
- Sync a skill from its upstream
- Update `link-skills.sh`
- Update CHANGELOG.md
- Commit and push changes
- Bump a version / tag a release
- Debug a broken symlink, missing skill, or stale config

## Workflow

### 1. Read the canonical reference

First, read `docs/development.md` at the repo root. It contains the full development workflow: setup, layout, decision trees for adding skills, modifying agents, syncing, testing, committing, releasing.

### 2. Identify the intent

Based on the user's request, jump to the relevant section:

| User intent | Section in `docs/development.md` |
|-------------|----------------------------------|
| "add skill X" / "new skill" | "Adding a Skill" |
| "sync from upstream" / "update drawio" | "Syncing from Upstream" |
| "change orchestrator" / "modify agent" | "Modifying an Agent" |
| "new bucket" / "reorganize" | "Repository Layout" → bucket decision tree |
| "bump version" / "tag release" | "Releasing a Version" |
| "link not working" / "skill not loading" | "When Things Go Wrong" |
| "how to commit" | "Commit Conventions" + "CHANGELOG Conventions" |

### 3. Walk through the steps

For each intent, follow the steps in the doc. The doc is the source of truth — don't re-derive the workflow here.

### 4. Verify before commit

Before any commit:

1. `./scripts/link-skills.sh` runs clean (exit 0)
2. New symlinks exist in `~/.config/opencode/skills/`
3. Restart OpenCode, no errors
4. The skill/agent behaves as expected (test with a small task if UI-affecting)

### 5. Commit + push

Follow the commit conventions in the doc:

- One logical change per commit
- Conventional prefix: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `cleanup:`
- Multi-line body for non-obvious changes
- Reference upstream version when syncing

After commit, push: `git push origin main`

## Bucket Decision Tree (Quick Reference)

The full tree is in `docs/development.md`. Quick version:

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
