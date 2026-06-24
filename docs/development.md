# Development Workflow

How to develop the opencode-workflow repo itself — adding skills, modifying agents, updating the link script, syncing from upstream, and releasing.

This doc is for maintainers of the opencode-workflow repo. For the workflow that agents follow when *using* the kit, see [`docs/workflow.md`](./workflow.md).

## Setup

### First time (clone + install)

```bash
git clone git@github.com:TudeOrangBiasa/opencode-workflow.git
cd opencode-workflow
# Review and run the link script — symlinks active skills to ~/.config/opencode/skills
./scripts/link-skills.sh
# Review and apply local opencode.json — agents, models, permissions
cp .opencode/opencode.json.example ~/.config/opencode/opencode.json  # or merge
```

The link script is **non-destructive** — it only creates/updates symlinks. It refuses to write into the repo itself.

### Daily

```bash
# Check what changed
git status
# See what skills are linked
ls -la ~/.config/opencode/skills/ | grep opencode-workflow
# See uncommitted or unpushed work
git log origin/main..HEAD
```

## Repository Layout

```
opencode-workflow/
├── agents/                    # Source of truth for OpenCode agent files (symlinked)
│   ├── orchestrator.md        # primary router
│   ├── builder.md             # code edits
│   ├── browser-qa.md          # visual QA
│   └── reviewer.md            # audit/security
├── skills/
│   ├── engineering/           # daily code work — promoted
│   ├── productivity/          # daily non-code work — promoted
│   ├── misc/                  # specialist / on-demand — promoted
│   ├── personal/              # tied to personal workflow — not promoted
│   ├── in-progress/           # drafts — not promoted
│   └── deprecated/            # retired — not promoted
├── docs/                      # documentation (workflow, models, install, dev)
├── scripts/
│   └── link-skills.sh         # symlink active skills to ~/.config/opencode/skills
├── .opencode/                 # local config template (commit history reference)
├── CHANGELOG.md               # user-facing changes
├── AGENTS.md                  # repo rules
├── README.md                  # user-facing
└── docs/development.md        # this file
```

**Buckets**:
- `engineering/`, `productivity/`, `misc/` — promoted in top-level README + bucket READMEs
- `personal/`, `in-progress/`, `deprecated/` — NOT promoted

Every skill in `engineering/`, `productivity/`, `misc/` must have an entry in:
- The top-level `README.md` (linked to `SKILL.md`)
- The relevant bucket's `README.md`

## Adding a Skill

### Source: from upstream (sync a known skill)

Example: `drawio` from `Agents365-ai/drawio-skill`.

```bash
# 1. Clone upstream to a temp dir
git clone --depth 1 https://github.com/Agents365-ai/drawio-skill.git /tmp/drawio-upstream

# 2. Pick the bucket (engineering, productivity, misc, personal)
# Use the bucket's existing README for convention.
# - If it's a daily code skill: engineering/
# - If it's a general non-code tool: productivity/
# - If it's a specialist/on-demand: misc/
# - If it's tied to your personal setup: personal/

# 3. Copy the SKILL.md (and bundled resources) into the bucket
mkdir -p skills/misc/drawio
cp -r /tmp/drawio-upstream/skills/drawio-skill/* skills/misc/drawio/

# 4. Update link-skills.sh to include the new path
# Edit scripts/link-skills.sh — add 'skills/misc/drawio' to ACTIVE_SKILLS array

# 5. Update bucket README + top-level README
# Edit skills/misc/README.md — add the skill entry
# Edit README.md — add the skill entry

# 6. Install and verify
./scripts/link-skills.sh
ls -la ~/.config/opencode/skills/drawio

# 7. Commit
git add skills/misc/drawio scripts/link-skills.sh skills/misc/README.md README.md
git commit -m "feat: drawio skill (synced from upstream v1.14.0)"

# 8. If also changing local config (skill_triggers in opencode.json),
# note it in the commit but commit config change separately
```

### Source: from your global `~/.agents/skills/`

Example: `officecli` you already have globally.

```bash
# 1. Pick the bucket (see bucket rules above)
mkdir -p skills/productivity/officecli

# 2. Copy the SKILL.md (and bundled resources)
cp -r ~/.agents/skills/officecli/* skills/productivity/officecli/

# 3. Update link-skills.sh
# 4. Update READMEs
# 5. Run link-skills.sh
# 6. Commit
```

### Source: from scratch

```bash
# 1. Pick the bucket
mkdir -p skills/engineering/my-new-skill

# 2. Write SKILL.md with frontmatter:
cat > skills/engineering/my-new-skill/SKILL.md <<'EOF'
---
name: my-new-skill
description: >
  What it does. When to use it. What it returns.
argument-hint: "[optional args]"
license: MIT
---

# My New Skill

## When to use
- Trigger condition 1
- Trigger condition 2

## Workflow
### Step 1
...

## Output format
...
EOF

# 3. Update link-skills.sh
# 4. Update bucket README + top-level README
# 5. Run link-skills.sh
# 6. Restart OpenCode
# 7. Commit
```

### Picking a bucket — decision tree

```
Is the skill used daily for code work?
  YES → engineering/
  NO ↓
Is it a general non-code tool (handoff, write-a-skill, officecli)?
  YES → productivity/
  NO ↓
Is it a specialist / on-demand (PHP, React, Swift, security)?
  YES → misc/
  NO ↓
Is it tied to your personal OpenCode setup (openviking, ddev)?
  YES → personal/
  NO ↓
Is it still being designed / a draft?
  YES → in-progress/
  NO → deprecated/  (only if replacing a retired skill)
```

## Modifying an Agent

Agent files live in `agents/<name>.md`. They are symlinked to `~/.config/opencode/agents/`.

```bash
# 1. Read the current state
cat agents/builder.md

# 2. Edit the file
$EDITOR agents/builder.md

# 3. Update the related entry in link-skills.sh? No — link-skills.sh handles skills, not agents.
# Agents are symlinked via a different mechanism (or manually).

# 4. Restart OpenCode for the change to take effect
# (OpenCode loads agents at startup)

# 5. Test the change with a small task before committing

# 6. Commit
git add agents/builder.md
git commit -m "refactor(builder): add design.md reference for UI work"
```

**Rules**:
- Frontmatter must use OpenCode-compatible keys only (`mode`, `color`, `description`, `permission`).
- Do NOT add `model` in repo agent files unless pinning a real provider/model id. (Model routing is local-config concern.)
- If a model pin is needed, document why in a comment.
- Keep prompts compact — reference docs/skills rather than duplicating rules.

## Modifying the Link Script

`scripts/link-skills.sh` is the single source of truth for which skills are active.

```bash
# 1. Add a new path to ACTIVE_SKILLS array
$EDITOR scripts/link-skills.sh
# Add: skills/engineering/my-new-skill

# 2. Run it
./scripts/link-skills.sh

# 3. Verify the symlink was created
ls -la ~/.config/opencode/skills/my-new-skill

# 4. Commit
git add scripts/link-skills.sh
git commit -m "chore: link my-new-skill"
```

**Rules**:
- The script refuses to write into the repo itself. Don't bypass that check.
- If a skill moves between buckets, update the path AND the bucket README AND the top-level README in one commit.
- Do not add personal/in-progress/deprecated skills to ACTIVE_SKILLS.

## CHANGELOG Conventions

`CHANGELOG.md` follows Keep-a-Changelog-ish style. Sections in order:

```markdown
## [Unreleased]
- Feature: <one-line>
- Fix: <one-line>
- Cleanup: <one-line>
- Refactor: <one-line>
- Wire: <one-line>
- Documentation: <one-line>

## [X.Y.Z] - YYYY-MM-DD
- ...
```

**Categories**:
- `Feature` — new skill, new agent, new bucket
- `Fix` — bug fix, quality issue, broken behavior
- `Cleanup` — remove dead code, unused files, stale config
- `Refactor` — restructure without behavior change
- `Wire` — connect existing components (e.g. skill trigger, agent permission)
- `Documentation` — doc changes only

When adding to `[Unreleased]`, prefix with the category. When releasing, group the items into a dated version section.

## Commit Conventions

- One logical change per commit
- Conventional prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `cleanup:`
- Reference upstream/source when syncing (e.g. `feat: drawio (synced from v1.14.0)`)
- Multi-line commit body for non-obvious changes — explain *why*, not *what*

```bash
git commit -m "feat: officecli skill (productivity)

- Copied from ~/.agents/skills/officecli/
- Updated link-skills.sh + bucket README
- Added orchestrator skill_trigger for .docx/.pptx/.xlsx keywords"
```

## Testing Changes

Before pushing, verify:

1. **Link script runs clean**: `./scripts/link-skills.sh` exits 0
2. **Symlinks point to repo**: `ls -la ~/.config/opencode/skills/` shows opencode-workflow paths
3. **OpenCode starts**: restart, no errors
4. **Skill loads**: invoke the skill via `/skill-name` or trigger keyword
5. **Agent behavior**: run a small task through the agent

## Backup + Clean Procedure

Protect original files before edits. Delete backups after verification — `.bak` files in skill folders get symlinked to `~/.config/opencode/` and leak into `git status`.

### Before editing

Create a timestamped backup in the **same directory** as the file being edited:

```bash
cp target-file target-file.bak-YYYY-MM-DD
# Second edit same day:
cp target-file target-file.bak-YYYY-MM-DD-2
```

The timestamp links the backup to the session. The `-N` suffix avoids overwriting if multiple edit rounds happen same day.

**Why same directory**: `link-skills.sh` creates symlinks from `~/.config/opencode/skills/*/` into the repo. If you edit a symlinked file and create `.bak` beside it, the backup also lives under the symlink path. Putting `.bak` in `/tmp/` or elsewhere defeats the purpose — it won't shadow `git status`.

### After verification

Before `git add`, delete all `.bak` files:

```bash
# Delete from repo root
find . -name "*.bak-*" -type f -delete
# Also check ~/.config/opencode/ (config backups, not in git, but good hygiene)
find ~/.config/opencode -name "*.bak-*" -type f -delete 2>/dev/null || true
```

Add this to your pre-commit checklist.

### Why

- `.bak` files in `skills/*/` are visible at `~/.config/opencode/skills/*/` via symlink
- They show up in `git status` as untracked files with foreign timestamps
- Committing them bloats the repo with redundant state
- Naming inconsistency (.bak-2024-01-01 vs 2024-01-01.bak) makes cleanup scripts unreliable — standardize on **suffix format** (`.bak-YYYY-MM-DD`)

### Naming convention

Always use **suffix format**: `file.bak-YYYY-MM-DD`. Not `file.YYYY-MM-DD.bak`, not `file.bak`.

- `target-file` → `target-file.bak-2026-06-24` ✓
- `target-file.bak-2026-06-24-2` ✓ (same day, second edit)
- `target-file.2026-06-24.bak` ✗ (harder to glob: `find . -name "*.bak-*"`)
- `SKILL.md.bak` ✗ (no date — ambiguous, stale)

Cross-reference: `../skills/personal/dev-workflow/REFERENCE.md`.

## Local Config vs Template

The actual `opencode.json` (`~/.config/opencode/opencode.json`) is local-only and **never committed** (it may contain API keys). But the routing config (model assignments, permissions, skill triggers, MCP, disabled built-ins) should be shared — otherwise new clones start with defaults and lose your carefully tuned setup.

**Solution**: the canonical config template lives at `docs/templates/opencode.primitive-agents.jsonc`. It has the same content as your local `opencode.json` but with `REPLACE_WITH_YOUR_KEY` placeholders. This is the versioned source of truth for shared config.

When you change `opencode.json` locally:

1. Edit `~/.config/opencode/opencode.json`
2. Mirror the change in `docs/templates/opencode.primitive-agents.jsonc` (replace any new keys with `REPLACE_WITH_YOUR_KEY`)
3. Commit the template change with a `Wire:` or `Cleanup:` prefix in CHANGELOG
4. Do NOT commit the local `opencode.json` itself

On a new machine, copy the template to `~/.config/opencode/opencode.json` and fill in your keys. The workflow will work identically.

## Syncing from Upstream

When a skill's upstream releases a new version:

```bash
# 1. Clone upstream shallow
git clone --depth 1 <upstream-url> /tmp/<skill>-upstream

# 2. Diff against current version
diff -r skills/misc/drawio /tmp/drawio-upstream/skills/drawio-skill/

# 3. Apply relevant changes
# Don't blindly copy — review diffs, especially for:
# - Frontmatter changes (description, version, license)
# - New sections that change trigger behavior
# - Removed content we may still want

# 4. Update CHANGELOG and commit
```

For drawing diagrams or visualizations of the routing, see [docs/diagrams/](./diagrams/) if it exists.

## Releasing a Version

The repo doesn't currently tag releases. When you decide to tag:

1. Move `[Unreleased]` items into a new dated section
2. Bump nothing automatically — version is a manual decision
3. Tag: `git tag -a v0.X.Y -m "..."`
4. Push: `git push origin v0.X.Y`

## When Things Go Wrong

### Skill doesn't load
- Check `link-skills.sh` is up to date and was run
- Check the symlink in `~/.config/opencode/skills/` points to the right path
- Restart OpenCode

### Agent behavior changes unexpectedly
- Check if `opencode.json` `prompt` field was added (should NOT be — use `agents/*.md` instead)
- Check that the agent file frontmatter is valid
- Restart OpenCode

### Symlink broken
- Re-run `link-skills.sh`
- If the script is missing, the skill isn't active — add it to `ACTIVE_SKILLS`

### Repo out of sync with global config
- Run `link-skills.sh` to re-link
- Check the local `opencode.json` for changes that should be ported to repo

## Periodic Quality Audit

After ~10 commits of rapid growth, drift accumulates: stale agent references in docs, missing skill triggers in tables, orphan issue files, dead empty directories. Run this audit periodically.

**When to run**:
- Every 10 commits since last audit
- Before any version release
- After merging a large feature (3+ issues resolved in one go)

**How to run**: Spawn 1 `explore` subagent with the audit checklist from `.scratch/audit/quality-audit-2026-06-23.md`. The audit takes ~5 min and produces a ranked list of actionable items + YAGNI deferrals.

**7-check audit checklist** (synthesized from Issue 14 follow-up audit):

1. **Agent file bloat** — Are agent files < 600 lines? Sections duplicating? Stale agent references (e.g., `planner` after removal)?
2. **Skill triggers consistency** — `opencode.json` `skill_triggers` field, `agents/orchestrator.md` Skill Triggers table, `docs/templates/opencode.primitive-agents.jsonc`. All three must list the same skills with same keywords.
3. **Skill file consistency** — All SKILL.md structured the same? Description in frontmatter matches description in skill_triggers? Dead empty dirs?
4. **Issue tracking** — `.scratch/issues/00-index.md` matches reality? Done issues in `done/` subfolder? No orphan files?
5. **Link integrity** — All symlinks in `~/.config/opencode/{skills,agents}/` valid? `link-skills.sh` covers all active skills?
6. **Documentation sync** — `docs/workflow.md`, `CONTEXT.md`, `README.md`, bucket READMEs reference current agent set (no deprecated agents like `planner`)?
7. **YAGNI check** — Anything we added that doesn't fire / doesn't get used? Skills that could be removed? Agent rules that contradict each other? Over-engineered patterns?

**Output format**: Report at `.scratch/audit/quality-audit-YYYY-MM-DD.md` with:
- Per-check status (OK / ISSUE / DRIFT / INCONSISTENT) + severity
- Top 10 actionable items ranked
- Quick wins (< 5 min each)
- Defer (YAGNI) — items that look like issues but don't matter
- Score summary (e.g., 7.5/10)

**Ponytail principle**: Audit finds real issues. Fix the actionable. Defer the rest. Don't audit for the sake of auditing.

**Reference**: First audit at `.scratch/audit/quality-audit-2026-06-23.md` (323 lines, 7.5/10 baseline). Established the pattern.
