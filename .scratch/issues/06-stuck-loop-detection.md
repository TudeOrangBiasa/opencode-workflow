# Issue 6: Stuck-loop detection mechanism — SKIPPED (YAGNI)

## Status

**Skipped.** Decision: don't build. Reasoning below.

## Why skipped

Three questions, three "no":

### 1. Is the problem real?

Data: **1 session out of 965** (linkbook UI/UX) had 271 identical bash calls = $19.21 wasted.

- 0.1% of sessions affected
- Average waste: $0.02/session
- Not a pattern, a 1-off

### 2. Does the existing system already cover it?

Yes. 8 separate rules already address stuck-loop patterns:

| Rule | Location |
|------|----------|
| One retry max, then escalate | `agents/builder.md` |
| Re-snapshot on chrome-devtools failure | `agents/browser-qa.md` |
| 0 results × 3 → STOP, delegate to `explore` | `agents/orchestrator.md` |
| Same builder fails 2x → BLOCKED | `agents/orchestrator.md` |
| No output growth × 3 → load `verify-evidence` | `agents/orchestrator.md` |
| Hard limit: 2 retries per subagent | `agents/orchestrator.md` |
| Pattern repeats 3+ → flag systemic | `agents/reviewer.md` |
| Tool efficiency (circuit breaker) | `agents/reviewer.md` |

Adding a 9th rule (now a skill) = more config, not less complexity.

### 3. Does the 01/08/09 fix already help?

Yes, indirectly. The new openviking PROTOCOL step 3:

> **Before retrying a tool that failed** — check for known patterns:
> ```bash
> ov find "viking://agent/patterns/tool-failures/<tool>"
> ```

The 271-call case would have stopped at iteration 2-3 if the agent had checked tool-failure patterns before retrying.

## What this issue would have built (if we did)

Convert the 8 scattered rules into 1 `stuck-loop` skill:

- 1 trigger on keywords: `stuck`, `loop`, `retry`, `same error`, `BLOCKED`, `failing again`, `still failing`
- ~50 lines in SKILL.md
- 4 detection patterns (tool-call repeat, bash same-output, no-output-growth, builder-fail-repeat)
- Same pattern as Issues 01, 08, 09

Cost: 30 minutes of work, but adds config maintenance burden.

## When to revisit

If we see ≥5 stuck-loop sessions in a 30-day window, reopen this issue. Until then, leave it.

Ponytail principle: "Question whether the task needs to exist at all." Answer: not now.
