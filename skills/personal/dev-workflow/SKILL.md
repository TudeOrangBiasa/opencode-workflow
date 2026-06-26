---
name: dev-workflow
description: Use when develop the opencode-workflow repo itself — add skills, modify agents, sync from upstream, commit changes. Use when user says add skill to opencode-workflow, new bucket, sync from upstream, update agent, bump version, modify this repo.
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

See [REFERENCE.md](REFERENCE.md) for full workflow steps, bucket decision tree, changelog conventions, and rules.

### Quick Steps

1. Read `docs/development.md` — it's the canonical reference
2. Identify intent (add skill, modify agent, sync, release, etc.)
3. Walk through steps from the doc
4. Run `scripts/link-skills.sh`, verify symlinks, test
5. Commit + push (one logical change per commit)
