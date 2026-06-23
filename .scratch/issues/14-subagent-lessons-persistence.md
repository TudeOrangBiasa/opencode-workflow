# Issue 14: Subagent lessons persistence via OpenViking (P0 IMPLEMENTED)

## Status

**DONE (P0).** Implemented 2026-06-23. Issue 18 P1+P2 (dreaming skill, cross-agent) still open.

## What was implemented

### 1. Orchestrator delegation protocol updated

`agents/orchestrator.md` Delegation Protocol section now includes:
- Mandatory `Project: <name>` line in every subagent task prompt
- Mandatory `Prior lessons for this project:` section (orchestrator runs `ov find` before delegating, includes result in prompt)
- Mandatory instruction to subagent: "At task end, store what you learned via `ov remember`"

### 2. Each subagent has memory rules

**`agents/builder.md`**: New section `-1. Apply Prior Lessons (from OpenViking)`
- Run `ov find "viking://agent/projects/<project>/lessons"` at task start
- Apply each lesson
- At task end, store via `ov remember`

**`agents/reviewer.md`**: New section `Prior Lessons (from OpenViking)`
- Run `ov find` for project lessons + review-failures patterns
- Apply each
- Store at end

**`agents/browser-qa.md`**: New section `Prior Lessons (from OpenViking)`
- Run `ov find` for project lessons + browser-quirks patterns
- Apply each
- Store at end

## Acceptance criteria

- [x] Orchestrator's Delegation Protocol includes `ov find` for project lessons in every subagent task prompt
- [x] Each subagent (`builder`, `reviewer`, `browser-qa`) has "Apply prior lessons" rule
- [x] Each subagent has "Store what you learned" rule at task end
- [ ] Manual test: 2 sequential builder tasks on same project, 2nd task retrieves 1st task's lesson (verify in next session)

## Remaining (Issue 18 P1 + P2)

- P1: `memory-dreaming` skill (manual-trigger consolidation, ~2 hours) — designed in Issue 18
- P2: Cross-agent memory sharing (orchestrator mirrors reviewer→builder lessons, ~30 min) — designed in Issue 18

## Notes

P0 is the **online write layer** of the self-learning loop. Text lessons are now stored per-session. The full loop (online + dream + recall) is complete when P1 ships.

**Visual memory (v1.5)** is in Issue 18's "EXTENDABLE" section — not in P0 scope.

## Files

- `agents/orchestrator.md` (line 151-194, Delegation Protocol)
- `agents/builder.md` (line 11-26, Prior Lessons section)
- `agents/reviewer.md` (line 11-29, Prior Lessons section)
- `agents/browser-qa.md` (line 11-29, Prior Lessons section)

All files are symlinked to `~/.config/opencode/agents/`. Restart opencode to take effect.

## Scope difference

| | Issues 12/13/15/16/17 | Issue 14 |
|---|---------------------|----------|
| **Concern** | How agent writes documents | How agent remembers lessons between sessions |
| **Resolved by** | `document-writing` skill | NOT covered by document-writing skill |
| **Mechanism** | Workflow + rules | OpenViking protocol extension |

## Pain (re-stated)

In dbl-data-management, user repeated 11 writing rules in 3 BAB building prompts. Each subagent session starts fresh, no memory of previous session. Document-writing skill fixes the writing, but doesn't fix the FORGETTING.

Example: 
- BAB V builder gets styleId mapping
- BAB VI builder re-discovers the same mapping
- BAB VII builder re-discovers again
- All because each subagent session has no memory of the previous

## Why not consolidated

Document-writing skill is loaded on demand when the user wants to write. The lessons persistence is a BACKGROUND mechanism — runs at subagent start/end regardless of what task.

Different layer. Different scope.

## Fix (ponytail)

Extend openviking PROTOCOL with subagent-specific steps:

**Currently (Issue 01)**: orchestrator at task start does `ov find "viking://agent/projects/<project>"`

**Add**: every subagent (builder, reviewer, browser-qa, scout) at task start:
```bash
ov find "viking://agent/projects/<project>/lessons" 2>/dev/null && apply || echo "no prior lessons"
```

At task end:
```bash
ov remember "viking://agent/projects/<project>/lessons" "<1-sentence: what was learned>"
```

**Implementation**:
- Add rule to orchestrator's "Delegation Protocol" section: "For all subagent tasks, include `ov find` for project lessons in the task prompt."
- Add rule to `agents/builder.md` and others: "Before starting, run `ov find` for project lessons. Apply. At end, store what you learned."

## Acceptance criteria

- [ ] Orchestrator's Delegation Protocol includes `ov find` for project lessons
- [ ] `agents/builder.md` has "Apply prior lessons" rule at start
- [ ] `agents/reviewer.md` same
- [ ] `agents/browser-qa.md` same
- [ ] Manual test: 2 sequential builder tasks on same project, verify 2nd task retrieves 1st task's lessons

## Out of scope

- Cross-project lesson sharing (different problem)
- Automatic lesson extraction from session log (over-engineering for v1)
- Lesson expiration (TTL — defer to later)

## Notes

The **single biggest improvement** still available. Without it, the same lessons re-learned every project. With it, lessons compound.

Effort: ~20 min for the orchestrator rule + agent prompts. Same pattern as Issue 01 but applied to subagent context.
