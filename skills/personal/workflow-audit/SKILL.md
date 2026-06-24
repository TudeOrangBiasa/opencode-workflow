---
name: workflow-audit
description: Use when audit the opencode-workflow state — read opencode.json, verify symlinks, check repo sync, analyze recent sessions, surface mismatches. Use when user says audit, workflow status, check changes, verify sync, what did I change, opencode config status, lint workflow.
---

# Workflow Audit

Audit the current state of the opencode-workflow setup:

1. OpenCode config in `~/.config/opencode/`
2. Repo sync in `opencode-workflow/`
3. Recent session activity from the local DB
4. Cross-reference: drift between repo and global config

This is **observation only**. It does not fix anything. Use the findings to decide what to fix.

## When to Activate

Use this skill when the user wants to know:

- "What did I change in my opencode config?"
- "Is opencode-workflow in sync with global?"
- "What skills/agents are active right now?"
- "What did recent sessions cost?"
- "Any drift between repo and global?"
- "Are there broken symlinks?"

## Workflow

### 1. OpenCode Config Audit

Read `~/.config/opencode/opencode.json` and report:

- **Default agent**: `[name]`
- **Active agents**: `[list]`
- **Models**: primary `[model]`, small `[model]`
- **Skill triggers**: `[list with keywords]`
- **MCP servers**: `[list]`
- **Plugins**: `[list]`

Then list the symlinks in `~/.config/opencode/agents/` and `~/.config/opencode/skills/`:

```bash
ls -la ~/.config/opencode/agents/
ls -la ~/.config/opencode/skills/
```

Check if symlinks resolve to paths in this repo. Flag any that:
- Are not symlinks (regular files = broken)
- Point to non-existent paths
- Point to paths outside this repo (unless intentional)

### 2. Repo Sync Audit

In the `opencode-workflow/` repo:

```bash
git log --oneline -10
git status --short
git log origin/main..HEAD --oneline   # unpushed commits
```

Report:

- **Last commit**: `[hash]` `[message]`
- **Unpushed**: `[N commits or "in sync"]`
- **Uncommitted**: `[N files or "clean"]`
- **Branch**: `[name]`

### 3. Skill/Agent Match Check

Cross-reference:

- Agents in `opencode.json` ↔ `agents/*.md` files
- Skills in `~/.config/opencode/skills/` symlinks ↔ entries in `link-skills.sh` `ACTIVE_SKILLS` array
- `link-skills.sh` `ACTIVE_SKILLS` ↔ actual `skills/**/SKILL.md` files

Flag mismatches:
- Agent defined in config but no `agents/<name>.md` file
- Skill in `link-skills.sh` but no `skills/<path>/SKILL.md`
- Symlink points to deleted/moved path
- Bucket README doesn't list an active skill

### 4. Recent Session Activity

Query `~/.local/share/opencode/opencode.db` for the last 5 paid sessions:

```python
import sqlite3
conn = sqlite3.connect('/home/todayz/.local/share/opencode/opencode.db')
cursor = conn.execute('''
    SELECT s.title, s.agent, p.worktree, s.cost, s.tokens_input, s.tokens_output, s.time_created
    FROM session s
    JOIN project p ON s.project_id = p.id
    WHERE s.cost > 0
    ORDER BY s.time_created DESC
    LIMIT 5
''')
```

Report as a table with: date, project, agent, cost, input tokens, output tokens.

Then look for pain patterns:

- **OpenViking usage**: How many recent sessions invoked `ov find` or `ov remember`?
- **Stuck loops**: Sessions with 8+ consecutive same-tool calls (query `part` table)
- **Skill invocation gaps**: Sessions that touched UI but didn't invoke `impeccable` or `emil-design-eng`

### 5. Output Format

Print to terminal in this structure:

```markdown
# Workflow Audit — [YYYY-MM-DD HH:MM]

## 1. OpenCode Config
- Default agent: orchestrator
- Primary model: opencode-go/minimax-m3
- Active agents: orchestrator, builder, reviewer, browser-qa, explore, scout
- Skill triggers: [list]
- MCP: exa, chrome-devtools, openviking, officecli
- Plugins: caveman

## 2. Symlink Health
- [N] agents symlinked, [N] valid, [N] broken
- [N] skills symlinked, [N] valid, [N] broken
- Issues: [list or "none"]

## 3. Repo Sync
- Last commit: [hash] [message]
- Unpushed: [N or "in sync"]
- Uncommitted: [N files or "clean"]
- Branch: main

## 4. Match Check
- Agent config ↔ files: [N match / N mismatch]
- link-skills.sh ↔ symlinks: [N match / N mismatch]
- link-skills.sh ↔ SKILL.md files: [N match / N mismatch]
- Issues: [list or "none"]

## 5. Recent Sessions (last 5 paid)
| Date | Project | Agent | Cost | In | Out |
|------|---------|-------|------|-----|-----|
| ... | ... | ... | ... | ... | ... |

## 6. Issues / Recommendations
- [actionable items, e.g. "skill X is in link-skills.sh but no SKILL.md exists — remove it"]
- [cost concerns, e.g. "session Y cost $Z — review for stuck loops"]
- [drift, e.g. "opencode.json skill_triggers lists 8 skills, but link-skills.sh only has 6 in ACTIVE_SKILLS"]
```

## Rules

- **Read-only** — never edit files. Report only.
- **Use the live state** — query DB, read files, check symlinks. Don't rely on cached knowledge.
- **Be specific** — point to files, line numbers, hashes. Not "the skill is broken" but "skills/misc/foo/SKILL.md is missing, referenced by link-skills.sh line 47".
- **Actionable** — every issue should have a suggested next step.
- **If the user asked about a specific thing** (e.g. "what did I change in opencode.json?"), lead with that, not the full audit.
