---
name: eval-session
description: Use when analyzing a session for agent errors, user frustration, repeated mistakes, or token waste. Scans conversation history, detects patterns, creates evals in .scratch/evals/. Triggers on "eval session", "evaluate this", "what went wrong", "diagnose session", "self-heal", "check mistakes".
---

# Eval Session

Analyze the current session for agent failures, user frustration, and repeated mistakes. Dynamically create evals from observed patterns. Uses `eval-harness` framework for grader types and pass@k metrics.

## When to Activate

- User says "eval session", "what went wrong", "diagnose session"
- User expresses frustration ("wasting token", "kok gini", "kenapa", "lagi")
- Session has repeated tool failures or scope creep
- User wants to capture lessons learned for self-healing

## Workflow

### 1. Scan Session

Analyze conversation history for these signals:

**User Frustration Signals:**
- Explicit: "wasting token", "sia-sia", "buang token", "boros", "kok gini", "kenapa", "lagi lagi"
- Implicit: repeated corrections, "sudah gw bilang", "itu tadi", short impatient replies
- Silence: user stops responding after agent mistakes

**Agent Error Patterns:**
- Tool loops: > 3 grep/search with 0 results (circuit breaker missing)
- Scope creep: agent added changes user didn't ask for
- Missing skills: agent worked on UI without loading `impeccable`
- Debug leftovers: console.log, debugger, temp code in commits
- Token waste: bash grep instead of built-in grep (rtk), repeated small reads
- File pollution: screenshots/scripts in workspace root or /tmp/
- Missing verification: UI changes without browser-qa

**Log Sources (if available):**
- `.scratch/afk-sessions/` — AFK session logs
- `.scratch/evals/` — previous eval definitions
- `git log --oneline -10` — recent commit patterns
- `git diff --stat HEAD~1` — what changed recently

### 2. Classify Findings

For each finding, classify:

| Dimension | Options |
|-----------|---------|
| Severity | HIGH (token waste > 50%, user frustrated, broken output) / MEDIUM / LOW |
| Category | tool-misuse, scope-creep, missing-skill, debug-leftover, verification-gap, token-waste |
| Repeat | First time / Repeated (seen in previous evals) |
| Grader | Code-based (deterministic) / Model-based (judgment) / Human |

### 3. Create Eval Definition

Create file: `.scratch/evals/<session-name>.md`

Use `eval-harness` grader types:
- **Code-based**: grep, test, build — deterministic, preferred
- **Model-based**: LLM judges output quality — for subjective evals
- **Human**: flag for manual review — ambiguous cases

Use `eval-harness` metrics:
- pass@1: first attempt success rate
- pass@3: success within 3 attempts
- pass^3: all k trials succeed (critical paths)

### 4. Apply Fixes

For each HIGH severity finding:
1. Identify which agent/skill needs updating
2. Make the fix (update agent rules, add checklist, adjust skill)
3. Verify fix works
4. Log in Self-Healing table

For MEDIUM/LOW:
- Log for tracking, fix opportunistically

### 5. Self-Heal

If a finding is repeated (seen in previous evals):
- The previous fix didn't work — escalate
- Update the agent/skill more aggressively
- Consider creating a new dedicated skill if pattern persists

## Output Format

```markdown
# Session Eval: <name>

**Date:** YYYY-MM-DD
**Model:** <model>
**Session summary:** <what user was trying to do>

## Findings

### [SEVERITY] <finding-name>
- **Category:** tool-misuse / scope-creep / missing-skill / etc.
- **Evidence:** <what happened in conversation>
- **Impact:** <token waste, user frustration, broken output>
- **Grader:** code-based / model-based / human
- **Repeat:** first / repeated

(repeat for each finding)

## Metrics

| Finding | Severity | Category | Repeat | Verdict |
|---------|----------|----------|--------|---------|
| ... | HIGH | tool-misuse | first | 🔴 |

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

- `eval-harness` — Grader types, pass@k metrics, eval workflow (define → implement → evaluate → report)
- `verify-evidence` — Tool-based verification checklist
- `context-budget` — Token overhead audit
- `diagnose` — Diagnosis loop for hard bugs
- `impeccable` — UI/UX gate (load before any frontend work)

## Example: Session Analysis

User says: "eval session ini, gw buang banyak token di grep"

Skill scans conversation:
- Finds: 47 grep calls, 0 results, no explore subagent
- Finds: user said "wasting my token" at turn 12
- Finds: agent added console.log to 3 files without asking
- Finds: no browser-qa after CSS change

Creates eval:
```markdown
### Search Circuit Breaker Missing
- **Category:** tool-misuse
- **Evidence:** 47 grep calls with 0 results, no circuit breaker
- **Impact:** HIGH — token waste, user explicitly frustrated
- **Grader:** code-based (count grep calls with 0 results)
- **Fix:** Add circuit breaker rule to orchestrator.md
```
