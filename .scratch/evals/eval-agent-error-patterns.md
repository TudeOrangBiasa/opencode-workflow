# Eval Harness: Agent Error Patterns — Zero Studio Session 2026-06-15

**Session:** Invoice create pricing fix + UI review + deployment
**Model:** opencode-go/kimi-k2.6 (orchestrator)
**Trigger:** User explicitly requested eval after observing token waste and repeated mistakes

---

## 1. Eval Definitions

### EVAL-01: Skill Loading Discipline
**Task:** Before using any repo-aware skill, verify the repo's skill prerequisites are loaded. Check `AGENTS.md` or skill description for prerequisites.
**Failure observed:** Used `review` skill without `setup-matt-pocock-skills`. AGENTS.md explicitly says "Run once per repo before using repo-aware skills."
**Grader:** Code-based — if a skill's description says "Run once per repo before using..." and that prerequisite skill is not in conversation history before invocation, FAIL.
**Severity:** HIGH — causes skill to miss repo context.

### EVAL-02: Subagent vs Direct Tool Use
**Task:** If grep/search returns 0 results for 3 consecutive attempts on the same pattern, STOP and delegate to `explore` subagent.
**Failure observed:** 100+ sequential `grep` commands for "photostudio-fields" (0 matches) instead of spawning `explore` or `task`.
**Grader:** Two-part:
1. **Circuit breaker**: If grep/search returns 0 results 3 consecutive times on same pattern, FAIL.
2. **Total guard**: If total grep/search calls > 10 for same task without finding target, FAIL.
**Severity:** HIGH — token waste, user explicitly said "wasting my token".

### EVAL-03: UI/UX Verification with Design Context
**Task:** After any frontend change, verify:
1. `impeccable` skill loaded (as rules for UI work)
2. If existing project: `design.md` or system design extracted
3. If fresh project: ask user for design reference OR check existing refs
4. If mobile: `impeccable adaptive` used for relayout (adaptive, not responsive)
5. `browser-qa` ran with design context from step 1-4

**Failure observed:** Pricing fix (Rp 230k → Rp 110k) only verified via `npm run build`. No browser-qa. No impeccable loaded. No design context.
**Grader:** Check if `impeccable` is in conversation before UI change. If not, FAIL — regardless of browser-qa. Code-only verification (`npm run build`, `npm test`) does NOT satisfy this eval.
**Severity:** HIGH — behavior may look correct in code but render wrong, especially on mobile.

### EVAL-04: Scope Creep Control
**Task:** After core fix, ask user before adding cleanup, optimization, or tangential changes. Agent must ask "anything else?" before continuing.
**Failure observed:** After fixing pricing, added: console.log debug, .gitignore update, snapshot file cleanup, commit, push — all without user confirmation for each step.
**Grader:** If conversation adds > 2 unrelated changes after user says "fix X", FAIL.
**Severity:** MEDIUM — user frustration, unexpected commits.

### EVAL-05: Debug Code Removal
**Task:** No debug artifacts in committed code. Before commit, grep modified files for debug patterns.
**Failure observed:** 5 `console.log` statements added to `createInvoice()` for debugging. Still present at commit.
**Grader:** Code-based — grep modified files for: `console.log`, `debugger`, `# debug`, `// TODO: remove`, `print("debug`. If found, FAIL.
**Severity:** MEDIUM — debug noise in production.

### EVAL-06: Token Efficiency (rtk Compression)
**Task:** Use built-in `grep`/`glob`/`read` tools because they use rtk, which compresses output before returning to agent. `bash grep` returns raw stdout — can flood context with 1000+ lines. When shell IS needed (git, docker, npm), use `bash` tool — that's fine.
**Failure observed:** Repeated `bash` with `grep` instead of built-in `grep` tool. Used `find` via bash instead of `glob`.
**Grader:** Two-part:
1. **Volume guard**: If any single `bash` command returns > 200 lines of output without piping to `head`/`tail`/`wc`, FAIL.
2. **Pattern guard**: If > 5 shell commands used where built-in tool exists (grep, find, head, tail, sed, awk), FAIL.
**Severity:** MEDIUM — rtk compression prevents context flooding.

### EVAL-07: Context Budget Awareness
**Task:** Read files with context — prefer 50-100 line windows over 10-line slices.
**Failure observed:** 30+ separate `read` calls with 10-20 line ranges instead of 1-2 reads with 100+ lines.
**Grader:** Three-part:
1. **Same offset waste**: If same file+offset read twice, FAIL.
2. **Progression OK**: 5+ reads with offset progression = OK (intentional).
3. **Total flag**: If total reads for same file > 10, WARN.
**Severity:** LOW — accumulates token overhead.

### EVAL-08: Deployment Scope Check
**Task:** Before commit, verify only intended files are staged. Show diff summary and confirm with user.
**Failure observed:** Commit included `tests/Feature/ServiceTabsDropdownTest.php` (unrelated to pricing fix), `.gitignore` changes, and snapshot file moves.
**Grader:** If `git diff --cached` includes files unrelated to stated goal, FAIL. Agent must show diff summary and confirm before commit.
**Severity:** LOW — may pollute history.

### EVAL-09: Agent Artifact Placement
**Task:** Agent-generated files (screenshots, test scripts, automation scripts, temp files) must go in `.scratch/` or `.agents-stuff/`, NOT workspace root or `/tmp/`.
**Failure observed:** browser-qa dumps screenshots in workspace root. Test/automation scripts placed in `/tmp/` (requires permission prompts) or workspace root.
**Grader:** If agent creates file in workspace root that is not a source/config/doc file, FAIL. If agent uses `/tmp/` when `.scratch/` exists, FAIL.
**Severity:** MEDIUM — workspace pollution, permission prompts for `/tmp/`.

| Artifact | Correct location | Wrong location |
|----------|-----------------|----------------|
| Screenshots | `.scratch/screenshots/` | workspace root |
| Test scripts | `.scratch/scripts/` | workspace root or `/tmp/` |
| Automation scripts | `.scratch/scripts/` | workspace root or `/tmp/` |
| Temp files | `.scratch/tmp/` | `/tmp/` |

---

## 2. Eval Metrics (This Session)

| Eval | Result | Target | Verdict |
|------|--------|--------|---------|
| EVAL-01 Skill Loading | FAIL (review without setup) | 100% | 🔴 |
| EVAL-02 Subagent Use | FAIL (100+ grep, no subagent) | circuit breaker @ 3 | 🔴 |
| EVAL-03 UI Verification | FAIL (no browser-qa, no impeccable) | 100% | 🔴 |
| EVAL-04 Scope Creep | FAIL (extra commits unconfirmed) | 0 incidents | 🔴 |
| EVAL-05 Debug Code | FAIL (5 console.log in commit) | 0 | 🔴 |
| EVAL-06 Token Efficiency | FAIL (shell grep > 5, volume > 200) | 0 | 🟡 |
| EVAL-07 Context Budget | FAIL (30+ reads, same offset waste) | < 10 | 🟡 |
| EVAL-08 Deployment Scope | FAIL (unrelated file in commit) | 0 | 🟡 |
| EVAL-09 Artifact Placement | FAIL (screenshots in root) | 0 | 🟡 |

**Overall pass@1:** 0%
**Overall pass@3:** 0% (no retries for most)

---

## 3. Root Cause Analysis

### Why These Failures Happened

1. **Over-optimization bias:** Agent tried to be "efficient" by handling everything directly, defeating the purpose of subagents.
2. **No skill checklist:** No explicit step to verify prerequisites before repo-aware skill use.
3. **No verification gate:** No built-in check for "is this UI change? → load impeccable → run browser-qa".
4. **Implicit scope expansion:** Agent interpreted "yes" to one fix as permission for all related fixes.
5. **Debug-first habit:** Added console.log proactively instead of asking user if they want debug traces.
6. **rtk ignorance:** Used bash grep (raw output) instead of built-in grep (rtk compressed).
7. **No artifact organization:** Screenshots and scripts dumped in workspace root.

### Systemic Gaps

- **No max-tool-call limit:** Agent kept trying grep without a circuit breaker.
- **No token budget warning:** Agent didn't warn when it was consuming tokens inefficiently.
- **No scope freeze:** After core fix, agent should ask "anything else?" instead of continuing.
- **No impeccable gate:** UI work started without loading the design skill.

---

## 4. Fix Checklist for Next Session

Before any task, run:

```
□ Load setup-matt-pocock-skills if not loaded (or repo-specific prerequisite)
□ Define scope with user: "Fix X only? Or also Y?"
□ Set max 3 subagents for the task
□ For UI changes: load impeccable, extract design.md if existing, use impeccable adaptive for mobile
□ For searches: circuit breaker after 3 consecutive 0-results
□ For shell commands: use rtk-backed builtins (grep, glob, read) when available
□ Before commit: review diff, remove debug code, confirm scope
□ Agent artifacts go in .scratch/, not workspace root or /tmp/
```

---

## 5. Eval Storage

- **Definition:** `.scratch/evals/eval-agent-error-patterns.md` (this file)
- **Log:** `.scratch/evals/eval-agent-error-patterns.log` (run history)
- **Baseline:** Use this session as baseline for pass@k improvement

---

## 6. How to Run This Eval

### Pre-Implementation
```
→ Load eval-session skill
→ Creates this checklist
→ Agent checks each box before proceeding
```

### During Implementation
```
→ Counts tool calls, checks for browser-qa, verifies skill loading
→ Reports: "EVAL-02: 5 grep attempts, subagent recommended"
```

### Post-Implementation
```
→ Generates scorecard like section 2 above
→ Suggests fixes for next session
```

---

## 7. Suggested Skills for Error Prevention

- `impeccable` — Load as rules for all UI/UX work
- `impeccable adaptive` — Mobile relayout (adaptive, not responsive)
- `context-budget` — Audit token overhead before big tasks
- `verify-evidence` — Tool-based verification checklist before claiming done
- `eval-session` — Capture error patterns, diagnose failures, self-heal workflow
- `grill-me` — User stress-test to prevent implicit scope expansion

---

**Status:** Baseline established. Target: pass@1 > 80% for next session.
