---
name: eval-reference
description: Detailed reference for Session Eval.
---

# Session Eval — Reference


## Workflow

### 1. Scan Session

Analyze conversation history for these signals:

**User Frustration Signals:**

- Explicit: "wasting token", "sia-sia", "buang token", "boros", "kok gini", "kenapa", "lagi lagi"
- Implicit: repeated corrections, "sudah gw bilang", "itu tadi", short impatient replies
- Silence: user stops responding after agent mistakes

### 2. Detect Stuck Patterns

Based on OpenHands stuck detector — 5 pattern types:

| Pattern                      | Threshold                    | Example                      |
| ---------------------------- | ---------------------------- | ---------------------------- |
| Repeating Action-Observation | 4+ same result               | grep "foo" → 0 results × 4 |
| Repeating Action-Error       | 3+ same error                | npm install → ERESOLVE × 3 |
| Agent Monologue              | 3+ messages without progress | explains, explains, explains |
| Alternating Ping-Pong        | 6+ alternating actions       | edit A → edit B → edit A   |
| Context Window Errors        | memory failure               | forgets earlier decisions    |

### 3. Detect Scope Drift

**Heuristic signals:**

- Files changed beyond stated goal
- Unrelated code modified
- New dependencies added without user request
- Cleanup/optimization without asking

**User signals (Indonesian + English):**

- "kok tambah banyak" (why more changes)
- "itu bukan yang gw minta" (that's not what I asked)
- "focus" / "fokus" / "stay on track"

### 4. Detect Tool Misuse

**Token waste patterns:**

- bash grep when built-in grep available (rtk compresses output)
- Same file+offset read twice
- find via bash when glob tool exists
- head/tail/sed/awk via bash when read/grep tools exist

**Circuit breaker missing:**

- grep/search with 0 results > 3 consecutive times
- Total grep/search calls > 10 for same task without finding target

**Recovery hierarchy not followed:**

1. Argument repair → 2. Retry with backoff → 3. Tool substitution → 4. Retrieval refresh → 5. Replanning → 6. Graceful degradation → 7. Model escalation → 8. Human escalation

If agent jumps from failure directly to human escalation without trying intermediate steps, flag.

### 5. Classify Findings

| Dimension | Options                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------- |
| Severity  | HIGH / MEDIUM / LOW                                                                                                 |
| Category  | stuck-pattern, scope-drift, tool-misuse, missing-skill, debug-leftover, verification-gap, token-waste, recovery-gap |
| Repeat    | First time / Repeated                                                                                               |
| Grader    | Code-based (deterministic) / Model-based (judgment) / Human                                                         |

### 6. Create Eval Report

**IMPORTANT:** Always create report in the opencode-workflow repo, regardless of current workspace:

```
~/Workspace/personal/dev/ai-kit/opencode/opencode-workflow/.scratch/evals/<session-name>.md
```

This is the single source of truth for all eval reports across all workspaces.

### 7. Suggest Planning

After creating report, suggest:

```
Eval report created: .scratch/evals/<session-name>.md

Next steps:
1. Review the report
2. Load grill-with-docs or grill-me to plan fixes
3. Apply fixes to agents/skills after planning
```

Never fix directly. Always plan first.

## Output Format

```markdown
# Session Eval: <name>

**Date:** YYYY-MM-DD
**Model:** <model>
**Workspace:** <where user was working>
**Session summary:** <what user was trying to do>

## Stuck Patterns Detected

| Pattern | Type | Count | Evidence |
|---------|------|-------|----------|
| grep loop | Repeating Action-Observation | 47 | grep "foo" → 0 results × 47 |

## Scope Drift

| Signal | Type | Evidence |
|--------|------|----------|
| Unrelated files changed | Heuristic | 3 files beyond stated goal |
| User said "fokus" | User signal | Turn 15 |

## Tool Misuse

| Pattern | Impact | Evidence |
|---------|--------|----------|
| bash grep instead of built-in | Token waste | 20 calls, raw stdout |
| No circuit breaker | Token waste | 47 × 0 results |

## Findings

### [SEVERITY] <finding-name>
- **Category:** stuck-pattern / scope-drift / tool-misuse / etc.
- **Evidence:** <what happened>
- **Impact:** <token waste, user frustration, broken output>
- **Grader:** code-based / model-based / human
- **Repeat:** first / repeated

## Metrics

| Finding | Severity | Category | Repeat | Verdict |
|---------|----------|----------|--------|---------|
| ... | HIGH | stuck-pattern | first | 🔴 |

**pass@1:** X%

## Self-Healing Log

| Date | Finding | Fix Attempted | Result |
|------|---------|---------------|--------|
| | | | |

## Next Steps

1. Review this report
2. Load `grill-with-docs` or `grill-me` to plan fixes
3. Apply fixes to agents/skills after planning
```

## Grader Types

From `eval-harness` framework:

- **Code-based**: Deterministic (grep, test, build). Preferred.
- **Model-based**: LLM judges output quality. For subjective evals.
- **Human**: Flag for manual review. Ambiguous cases.

## Metrics

From `eval-harness` framework:

- **pass@1**: First attempt success rate
- **pass@3**: Success within 3 attempts (target: > 90%)
- **pass^3**: All k trials succeed (critical paths: 100%)

## Integration

- `grill-with-docs` — Plan fixes against domain model, sharpen terminology
- `grill-me` — Stress-test fix plans before implementing
- `eval-harness` — Grader types, pass@k metrics (theory)
- `verify-evidence` — Tool-based verification checklist
- `context-budget` — Token overhead audit
- `diagnose` — Diagnosis loop for hard bugs
- `design` — UI/UX gate
- `reviewer` — Can load this skill for session behavior audits

## References

- OpenHands Stuck Detector: 5 pattern types
- AgentRx: 10-category failure taxonomy (Microsoft)
- Hawkeye DriftDetect: heuristic + LLM scope drift scoring
- Circuit Breaker: 3-state (CLOSED/OPEN/HALF-OPEN)
- Recovery Hierarchy: 8 levels
- Reflexion (Shinn et al.): verbal self-reflection
- Self-Refine (Madaan et al.): iterative generate → feedback → refine
- CRITIC (Gou et al.): tool-interactive verification
