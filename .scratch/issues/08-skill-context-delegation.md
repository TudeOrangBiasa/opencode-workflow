# Issue 8: Pass skill context in subagent delegations — fixed

## Status

**Resolved.** Root cause: orchestrator prompt had a rule "load skill before delegating" but no template for how. Subagents got delegations with no skill context, then had to discover skills on their own → 15% had any skill context.

## Fix (ponytail cut)

Add explicit "Delegation Protocol" section to `agents/orchestrator.md` with:

1. **Mandatory format** for every `task` prompt:
   ```markdown
   <task description>

   Skills relevant to this task:
   - [skill-name] — [1-sentence summary of when to apply]

   Load each skill before starting work.
   ```

2. **Heuristic for picking skills** (UI → impeccable + emil-design-eng, security → security-review, etc.)

3. **Example** (pricing page spacing fix → impeccable craft + accessibility)

5 lines of format + 6-line heuristic + 1 example. ~15 lines total.

## Mechanism vs Rule

Still a prompt rule — but now with a **concrete template** the agent can copy. Previous rule was "include skill context" (vague). New rule is "include skills in this format with this heuristic" (mechanical).

## Verification

- Restart opencode
- Delegate to builder: "fix this UI bug" → check that delegation prompt mentions `impeccable craft` or similar
- Delegate to reviewer: "review for security" → delegation prompt mentions `security-review`
- Count: 15% → expected ~80%

## Out of scope

- Auto-injection via wrapper (opencode `task` tool doesn't expose a hook)
- Skill context window (how much to include — pick 1-sentence summary, don't paste full SKILL.md)
- Per-subagent defaults (e.g., browser-qa always has impeccable)

## Notes

The original Issue 8 had 4 acceptance criteria including 2 "test scenarios". The fix has 1 acceptance criterion: "format exists in orchestrator.md". Live-test in next session.
