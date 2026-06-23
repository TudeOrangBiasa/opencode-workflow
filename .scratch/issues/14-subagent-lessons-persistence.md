# Issue 14: Subagent lessons persistence via OpenViking (BIGGEST IMPACT)

## Status

New. Source: dbl-data-management 3-angle synthesis. Pattern #10 hit 3x: user repeated 11 writing rules across 3 BAB building prompts. **This is the biggest ROI issue of the 6**.

## Pain

In dbl-data-management:
- User wrote 11 writing rules in BAB V prompt
- User wrote 11 writing rules AGAIN in BAB VI prompt
- User wrote 11 writing rules AGAIN in BAB VII prompt
- Each subagent session starts fresh, has no memory of the previous session

Same pattern: subagent context loss. Issues 01/08/09 fixed it for the orchestrator. Now we need it for subagents.

## Fix (ponytail)

Extend openviking PROTOCOL with subagent-specific step:

**Currently (Issue 01)**: orchestrator at task start does `ov find "viking://agent/projects/<project>"`

**Add**: every subagent (builder, reviewer, browser-qa, scout) at task start:
```bash
# In the subagent's task prompt, the orchestrator includes:
ov find "viking://agent/projects/<project>/lessons" 2>/dev/null && apply || echo "no prior lessons"
```

And at task end:
```bash
ov remember "viking://agent/projects/<project>/lessons" "<1-sentence: what was learned>"
```

**Concrete example** for dbl-data-management:
- BAB V lesson stored: "BAB numbering: use officecli add with --num-id N, never raw-set on numbering.xml"
- BAB VI builder: `ov find` at start → gets this lesson → applies from start
- BAB VII builder: same → doesn't repeat the mistake

**Implementation**:
- Add a rule to orchestrator's "Delegation Protocol" section: "For all subagent tasks, include `ov find 'viking://agent/projects/<name>/lessons'` in the task prompt. Include the result in the subagent's context."
- Add a rule to `agents/builder.md` and others: "Before starting, run `ov find ...` for project lessons. Apply. At end, store what you learned."

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

This is the **single biggest improvement** available. Without it, the same 11 writing rules will be re-typed by user in EVERY project's EVERY subagent session. With it, the lessons compound.

Ponytail cut: extend openviking PROTOCOL (which already exists from Issue 01) with 1 line per subagent.
