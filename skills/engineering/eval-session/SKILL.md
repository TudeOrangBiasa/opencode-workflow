---
name: eval-session
description: Use when analyzing a session for agent errors, user frustration, repeated mistakes, or token waste. Detects stuck patterns, scope drift, tool misuse. Creates evals with deterministic graders. Triggers on "eval session", "evaluate this", "what went wrong", "diagnose session", "self-heal", "check mistakes".
---

# Eval Session

Analyze the current session for agent failures, user frustration, and repeated mistakes. Detect stuck patterns, scope drift, and tool misuse. Create evals with deterministic graders. Uses `eval-harness` framework for pass@k metrics.

Key insight: LLMs cannot reliably self-correct via prompt alone. Deterministic graders (code-based) and structured state are essential.

## When to Activate

- User says "eval session", "what went wrong", "diagnose session"
- User expresses frustration ("wasting token", "kok gini", "kenapa", "lagi", "sudah gw bilang")
- Session has repeated tool failures or scope creep
- User wants to capture lessons learned for self-healing

## Workflow

### 1. Detect Stuck Patterns

Based on OpenHands stuck detector — 5 pattern types:

**Pattern 1: Repeating Action-Observation Cycles**
- Same action → same result, 4+ times
- Example: grep "foo" → 0 results, grep "foo" → 0 results, grep "foo" → 0 results
- Detection: count consecutive tool calls with identical 0-result output

**Pattern 2: Repeating Action-Error Cycles**
- Same action → same error, 3+ times
- Example: npm install → ERESOLVE, npm install → ERESOLVE, npm install → ERESOLVE
- Detection: count consecutive tool calls with identical error output

**Pattern 3: Agent Monologue**
- Consecutive messages without progress, 3+
- Example: agent explains what it will do, explains again, explains again
- Detection: count tool calls between user interactions

**Pattern 4: Alternating Ping-Pong**
- Two actions alternating, 6+ cycles
- Example: edit file A → edit file B → edit file A → edit file B...
- Detection: detect alternating tool call patterns

**Pattern 5: Context Window Errors**
- Memory management failure
- Example: agent forgets earlier decisions, repeats resolved questions
- Detection: agent references already-resolved items

### 2. Detect Scope Drift

Based on Hawkeye DriftDetect — heuristic + LLM scoring:

**Heuristic signals:**
- Files changed beyond stated goal
- Unrelated code modified
- New dependencies added without user request
- Cleanup/optimization without asking

**User signals:**
- "kok tambah banyak" (why more changes)
- "itu bukan yang gw minta" (that's not what I asked)
- "focus" / "fokus" / "stay on track"
- Short impatient replies after agent adds changes

### 3. Detect Tool Misuse

**Token waste patterns:**
- bash grep when built-in grep available (rtk compresses output)
- Same file+offset read twice
- find via bash when glob tool exists
- head/tail/sed/awk via bash when read/grep tools exist

**Circuit breaker missing:**
- grep/search with 0 results > 3 consecutive times
- Total grep/search calls > 10 for same task without finding target

**Recovery hierarchy not followed** (from self-healing research):
1. Argument repair — fix malformed tool arguments
2. Retry with backoff — transient failures
3. Tool substitution — swap to equivalent tool
4. Retrieval refresh — stale context
5. Replanning — full plan re-derivation
6. Graceful degradation — reduced capability
7. Model escalation — switch provider
8. Human escalation — page operator

If agent jumps from failure directly to human escalation without trying intermediate steps, flag.

### 4. Classify Findings

| Dimension | Options |
|-----------|---------|
| Severity | HIGH / MEDIUM / LOW |
| Category | stuck-pattern, scope-drift, tool-misuse, missing-skill, debug-leftover, verification-gap, token-waste, recovery-gap |
| Repeat | First time / Repeated |
| Grader | Code-based (deterministic) / Model-based (judgment) / Human |

### 5. Create Eval Definition

Create file: `.scratch/evals/<session-name>.md`

Use `eval-harness` grader types:
- **Code-based**: grep, test, build — deterministic, preferred
- **Model-based**: LLM judges output quality — for subjective evals
- **Human**: flag for manual review — ambiguous cases

Use `eval-harness` metrics:
- pass@1: first attempt success rate
- pass@3: success within 3 attempts
- pass^3: all k trials succeed (critical paths)

### 6. Apply Fixes

For each HIGH severity finding:
1. Identify which agent/skill needs updating
2. Make the fix (update agent rules, add checklist, adjust skill)
3. Verify fix works
4. Log in Self-Healing table

### 7. Self-Heal

If a finding is repeated (seen in previous evals):
- Previous fix didn't work — escalate
- Update agent/skill more aggressively
- Consider creating new dedicated skill if pattern persists

## Output Format

```markdown
# Session Eval: <name>

**Date:** YYYY-MM-DD
**Model:** <model>
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

## Fixes Applied

| Finding | Fix | Agent/Skill Updated |
|---------|-----|---------------------|
| ... | ... | orchestrator.md |

## Self-Healing Log

| Date | Finding | Fix Attempted | Result |
|------|---------|---------------|--------|
| | | | |
```

## Integration

- `eval-harness` — Grader types, pass@k metrics, eval workflow
- `verify-evidence` — Tool-based verification checklist
- `context-budget` — Token overhead audit
- `diagnose` — Diagnosis loop (same pattern: reproduce → hypothesize → instrument → fix)
- `impeccable` — UI/UX gate
- `reviewer` — Loads this skill for session behavior audits

## References

- OpenHands Stuck Detector: 5 pattern types with semantic comparison
- AgentRx: 10-category failure taxonomy (Microsoft)
- Hawkeye DriftDetect: heuristic + LLM scope drift scoring
- Circuit Breaker: 3-state (CLOSED/OPEN/HALF-OPEN) per tool
- Recovery Hierarchy: 8 levels from argument repair to human escalation
- Reflexion (Shinn et al.): verbal self-reflection → episodic memory
- Self-Refine (Madaan et al.): iterative generate → feedback → refine
- CRITIC (Gou et al.): tool-interactive verification loop
