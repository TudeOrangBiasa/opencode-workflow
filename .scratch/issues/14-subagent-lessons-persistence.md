# Issue 14: Subagent lessons persistence via OpenViking (still OPEN)

## Status

**STILL OPEN.** Different scope from Issues 12/13/15/16/17. This is about **subagent memory across sessions**, NOT about document writing. Document-writing skill does not solve this.

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
