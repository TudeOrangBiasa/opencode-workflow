---
name: diagnosing-bugs
description: Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", or reports something broken/throwing/failing/slow.
---

A discipline for hard bugs. Skip phases only when explicitly justified.

When exploring the codebase, read `CONTEXT.md` (if exists) for mental model of relevant modules, and check ADRs in the area you're touching.

## Phase 1 — Build a feedback loop

**This is the skill.** Everything else is mechanical. A fast, deterministic, agent-runnable pass/fail signal for the bug — you will find the cause. No signal, no amount of staring at code will save you.

Spend disproportionate effort here. **Be aggressive. Be creative. Refuse to give up.**

See [REFERENCE.md](REFERENCE.md) for 10 ways to construct feedback loops, tightening strategies, non-deterministic bugs, and when to stop.

Do not proceed to Phase 2 until you have a loop you believe in.

## Phase 2 — Reproduce + minimise

Run the loop. Watch the bug appear.

Confirm:
- [ ] Loop produces the failure mode the **user** described — not a different nearby failure
- [ ] Failure reproducible across multiple runs (or high enough rate for non-deterministic)
- [ ] Exact symptom captured (error message, wrong output, slow timing)

### Minimise

Shrink repro to smallest scenario that still goes red. Cut inputs, callers, config, data, steps one at a time, re-running after each cut. Done when every remaining element is load-bearing.

## Phase 3 — Hypothesise

Generate **3–5 ranked hypotheses** before testing any. Each must be **falsifiable**: state the prediction.

> Format: "If <X> is the cause, then <changing Y> will make the bug disappear / <changing Z> will make it worse."

**Show ranked list to user before testing.** They may have domain knowledge. Don't block if AFK.

## Phase 4 — Instrument

Each probe maps to a specific prediction. **Change one variable at a time.**

Tool preference: 1. Debugger/REPL, 2. Targeted logs, 3. Never "log everything and grep".

**Tag every debug log** with unique prefix, e.g. `[DEBUG-a4f2]`. Cleanup = one grep.

**Perf branch:** For perf regressions, logs are usually wrong. Establish baseline measurement, then bisect. Measure first, fix second.

## Phase 5 — Fix + regression test

Write regression test **before** fix — but only if correct seam exists.

1. Turn minimised repro into failing test at that seam.
2. Watch it fail.
3. Apply fix.
4. Watch it pass.
5. Re-run Phase 1 feedback loop against original (un-minimised) scenario.

If no correct seam exists, note it — that itself is the finding.

## Phase 6 — Cleanup + post-mortem

- [ ] Original repro no longer reproduces (re-run Phase 1 loop)
- [ ] Regression test passes (or absence of seam documented)
- [ ] All `[DEBUG-...]` instrumentation removed
- [ ] Throwaway prototypes deleted
- [ ] Correct hypothesis stated in commit/PR message — next debugger learns

**Then ask: what would have prevented this bug?** If architectural change (no good test seam, tangled callers, hidden coupling), hand off to `/improve-codebase-architecture` with specifics.
