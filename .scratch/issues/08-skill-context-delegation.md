# Issue 8: Pass skill context in subagent delegations

## What to build

Update `agents/orchestrator.md` delegation protocol to **always include relevant skill context** when delegating to subagents. Currently the orchestrator delegates to `builder`, `browser-qa`, etc. but the subagent starts "fresh" without knowing which skills are relevant.

The protocol should:
1. Detect when delegation task matches a skill trigger
2. Inline a brief skill summary in the delegation prompt
3. Tell subagent "load skill X first before doing Y"

Current state: orchestrator delegates without context. Subagent has to discover skills on its own — usually doesn't.

## Acceptance criteria

- [ ] Orchestrator delegation protocol updated with skill-context-injection step
- [ ] Document the format: "Delegation prompt should include [skill trigger] + [1-sentence skill summary] + [reference to skill name for deeper load]"
- [ ] Test scenario: delegate "fix this UI" → delegation prompt should mention impeccable craft
- [ ] Test scenario: delegate "review for security" → delegation prompt should mention security-review

## Blocked by

None — can start immediately.

## Notes

This is a key Phase 1 fix that was committed but not tested. The mechanic exists in `agents/orchestrator.md` "Delegation Protocol" section, but agents may still not follow it.
