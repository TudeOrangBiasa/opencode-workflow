---
name: eval-session
description: Use when capturing agent error patterns from a session, creating eval definitions, logging eval runs, or diagnosing eval failures for self-healing. Triggers on "create eval", "evaluate session", "eval this", "run eval", "self-heal", "diagnose eval".
---

# Eval Session

Create and manage workspace-local evals from session observations. Evals live in `.scratch/evals/` — each workspace tracks its own agent performance.

## When to Activate

- User observed agent mistakes and wants to capture them as evals
- User says "create eval", "evaluate this session", "eval this"
- User wants to diagnose why an eval failed and fix the workflow
- User wants self-healing: update evals/harness based on what worked

## Quick Start

```
User: "eval session ini, gw buang banyak token di grep"
→ Capture error pattern → create eval definition → store in .scratch/evals/
```

## Workflow

### 1. Capture Error Pattern

Ask user (or observe from conversation):
- What went wrong? (token waste, scope creep, missing verification, etc.)
- What should have happened instead?
- How to grade it? (code-based deterministic, or model-based)

### 2. Create Eval Definition

Create file: `.scratch/evals/<session-name>.md`

Template:

```markdown
# Eval: <session-name>

**Session:** <brief description>
**Date:** YYYY-MM-DD
**Model:** <model used>

## Evals

### EVAL-01: <error-pattern-name>
**Task:** What the agent should do
**Failure observed:** What actually happened
**Grader:** How to check (code-based or model-based)
**Severity:** HIGH / MEDIUM / LOW

### EVAL-02: ...
(repeat for each error pattern)

## Metrics

| Eval | Result | Target | Verdict |
|------|--------|--------|---------|
| EVAL-01 | FAIL | 100% | 🔴 |
| ... | ... | ... | ... |

**Overall pass@1:** X%

## Fix Checklist

□ Action 1
□ Action 2
□ Action 3

## Self-Healing Log

| Date | Eval | Fix Applied | Result |
|------|------|-------------|--------|
| | | | |
```

### 3. Diagnose Failures

When an eval fails, run diagnosis loop:

1. **Reproduce**: What exact agent behavior triggered the failure?
2. **Root cause**: Is it a skill gap, tool misuse, or prompt issue?
3. **Fix**: Update skill, add checklist item, or adjust eval grader
4. **Verify**: Re-run eval to confirm fix works
5. **Log**: Record in Self-Healing Log table

### 4. Update Harness

If diagnosis reveals a systemic gap:
- Update the relevant skill (e.g., add checklist to `diagnose`, `review`)
- Or create a new skill if no existing skill covers the gap
- Record the change in the eval's Self-Healing Log

## Eval Conventions

### Severity Levels

| Level | Meaning | Action |
|-------|---------|--------|
| HIGH | Token waste > 50%, user frustration, broken output | Fix immediately, add skill guardrail |
| MEDIUM | Suboptimal but functional, minor waste | Fix in next session |
| LOW | Cosmetic, preference, minor overhead | Track, fix opportunistically |

### Grader Types

- **Code-based**: Deterministic (grep, test, build). Preferred.
- **Model-based**: LLM judges output quality. Use for subjective evals.
- **Human**: Flag for manual review. Use for ambiguous cases.

### pass@k Targets

- Capability evals: pass@3 >= 90%
- Regression evals: pass^3 = 100% for critical paths
- Agent behavior evals: pass@1 >= 80% after self-healing

## Storage

```
.scratch/
  evals/
    <session-name>.md       # Eval definition + metrics + self-healing log
    <session-name>.log      # Raw run history (optional)
```

Evals are workspace-local. Each project tracks its own agent performance patterns.

## Integration with Existing Skills

- `eval-harness` — Theory and formal framework for eval-driven development
- `verify-evidence` — Tool-based verification checklist (feeds eval graders)
- `context-budget` — Token overhead audit (feeds token-waste evals)
- `diagnose` — Diagnosis loop for hard bugs (same pattern for eval failures)

## Example: Token Waste Eval

User observes: "I used 100+ grep calls searching for a pattern that didn't exist"

Created eval:
```markdown
### EVAL-02: Search Circuit Breaker
**Task:** If grep/search returns 0 results for 3 consecutive attempts on same pattern, STOP and delegate to `explore` subagent.
**Failure observed:** 100+ sequential grep commands, 0 matches, no subagent
**Grader:** Two-part:
1. Circuit breaker: 3 consecutive 0-results = FAIL.
2. Total guard: > 10 grep/search calls for same task without finding target = FAIL.
**Severity:** HIGH — token waste, user explicitly complained
```

Self-healing: After creating this eval, the agent's `AGENTS.md` or relevant skill could be updated with:
> "If 3+ search attempts return 0 results, stop and delegate to `explore` subagent."

## Corrected Eval Patterns

See `.scratch/evals/eval-agent-error-patterns.md` for grilled eval definitions with corrected graders. Key corrections applied to agent files:

- **Skill prerequisite**: Universal check in orchestrator/reviewer — verify repo prerequisites before repo-aware skills
- **Circuit breaker**: In orchestrator — 3 consecutive 0-results = stop, delegate to explore
- **impeccable gate**: In orchestrator/reviewer — load impeccable before UI work, extract design.md for existing projects
- **rtk preference**: In AGENTS.md — use built-in grep/glob/read over shell equivalents
- **Scope freeze**: In orchestrator — ask "anything else?" before adding unrelated changes
- **Debug removal**: In builder — grep modified files for debug artifacts before commit
- **Commit hygiene**: In orchestrator — show diff summary, confirm only intended files staged
- **Artifact placement**: In builder — .scratch/ not workspace root or /tmp/
