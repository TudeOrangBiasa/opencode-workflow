# Issue 10: Skip QA dance for tiny diffs — HITL

## What to build

The browser-qa/builder 3-step dance (qa → fix → qa) repeats 9+ times per project. For tiny diffs, this is overkill. Need a way to skip the second qa when the diff is small.

This is a **HITL slice** because it requires:
- Definition of "tiny diff" (lines changed? files changed? semantic significance?)
- Decision on what to skip (just verification? full QA?)
- Edge cases (what if "tiny" diff breaks something subtle?)

## Acceptance criteria

- [ ] Orchestrator prompt: "If builder output is a <10-line edit to a single file, skip the verification browser-qa"
- [ ] Define "tiny diff" criteria: e.g. <10 lines, single file, no logic change
- [ ] For non-tiny diffs: continue current 3-step dance
- [ ] Test scenario: simple CSS color change → skip second qa. Logic change → keep second qa.

## Blocked by

- Issue 5 (browser-qa mandatory framework first)

## Notes

9+ cycles in PWEB-Swarakarna is wasteful. Even skipping 30% of them would save significant time.
