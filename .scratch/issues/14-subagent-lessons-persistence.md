# Issue 14: Subagent lessons persistence via OpenViking (P0 IMPLEMENTED + VERIFIED)

## Status

**DONE (P0).** Implemented and verified 2026-06-23 after opencode restart. Issue 18 P1+P2 still open.

## CRITICAL FIX (post-restart verification)

Initial implementation had HALLUCINATED commands. Discovered during restart verification:

| What I wrote | What actually works in OpenViking v0.3.25 |
|--------------|---------------------------------------------|
| `ov remember "viking://agent/projects/<p>/lessons" "..."` | **DOES NOT EXIST** — unknown command |
| `viking://agent/projects/<p>/...` URI | **INVALID** — `agent` scope is READ-ONLY ("Invalid scope 'agent'. Must be one of: resources") |
| `ov add-memory "text"` | Real command, auto-routes to `viking://agent/default/memories/` |
| `ov find "<query>"` (semantic search) | Real command, natural language query |
| `ov add-resource <path> --to <uri>` | Real, but URI must be in `resources/` scope |

**Bonus discovery**: OpenViking AUTO-SUMMARIZES session events to `viking://user/default/memories/events/YYYY/MM/DD/<event>.md`. Past lessons are already captured without explicit commands.

## What was implemented (corrected)

### 1. Orchestrator delegation protocol updated

`agents/orchestrator.md` Delegation Protocol section now includes:
- Mandatory `Project: <project-name>` line in every subagent task prompt
- Mandatory `Prior lessons for this project:` section (orchestrator runs `ov find "<project-name> lessons"` before delegating, includes result in prompt)
- Mandatory instruction to subagent: "At task end, store what you learned via `ov add-memory`"

### 2. Each subagent has memory rules (with correct commands)

**`agents/builder.md`**: New section `-1. Apply Prior Lessons (from OpenViking)`
- `ov find "<project-name> lessons"` at task start (semantic search)
- Apply each lesson
- `ov add-memory "<lesson with project name for searchability>"` at task end

**`agents/reviewer.md`**: New section `Prior Lessons (from OpenViking)`
- `ov find "<project-name> review patterns"` + `ov add-memory` at end

**`agents/browser-qa.md`**: New section `Prior Lessons (from OpenViking)`
- `ov find "<project-name> browser quirks"` + `ov add-memory` at end

### 3. openviking SKILL.md corrected (CRITICAL)

`skills/misc/devops/openviking/SKILL.md` rewritten:
- Removed all `ov remember` references
- Added "Critical: `ov remember` is NOT a real command" warning
- Real commands: `ov add-memory`, `ov add-resource`, `ov find`, `ov read`
- URI scheme updated: `agent/` is READ-ONLY, `resources/` is writeable
- Auto-summarization section added

## Verification (live, 2026-06-23)

```bash
# Test write
$ ov add-memory "dbl-data-management test: P0 self-learning online write layer uses ov add-memory..."
OK

# Test read (semantic search)
$ ov find "P0 self-learning online write layer"
1. viking://user/default/memories/events/2026/06/23/dbl_data_management_test.md (score 0.674)
   "The user verified that the P0 self-learning online write layer uses the 'ov add-memory' command..."
2. viking://user/default/memories/events/2026/06/23/openviking_version_update.md
3. viking://agent/default/memories/identity.md
...
```

Cycle confirmed: write via `ov add-memory`, retrieve via `ov find`.

## Acceptance criteria

- [x] Orchestrator's Delegation Protocol includes `ov find` for project lessons in every subagent task prompt
- [x] Each subagent (`builder`, `reviewer`, `browser-qa`) has "Apply prior lessons" rule
- [x] Each subagent has "Store what you learned" rule at task end (via `ov add-memory`, NOT `ov remember`)
- [x] Real OpenViking commands used (verified via `ov --help` and live test)
- [ ] Live test in next session: 2 sequential builder tasks on same project, 2nd task retrieves 1st's lesson

## Files changed (in this fix)

- `agents/orchestrator.md` — Delegation Protocol (corrected: `ov add-memory` not `ov remember`)
- `agents/builder.md` — Prior Lessons section (corrected)
- `agents/reviewer.md` — Prior Lessons section (corrected)
- `agents/browser-qa.md` — Prior Lessons section (corrected)
- `skills/misc/devops/openviking/SKILL.md` — full rewrite (corrected API reference)

## Remaining (Issue 18 P1 + P2)

- P1: `memory-dreaming` skill (manual-trigger consolidation, ~2 hours) — designed in Issue 18
- P2: Cross-agent memory sharing (orchestrator mirrors reviewer→builder lessons, ~30 min) — designed in Issue 18

## Lesson learned

**Always verify API commands with `ov --help` and live test BEFORE writing agent prompts.** The first P0 implementation had fake commands that would have caused "Unknown command" errors on every subagent run. Restart + verify caught this.

This is the value of "manual test" in acceptance criteria — the OpenViking test took 2 min, found the bug, fixed 5 files.
