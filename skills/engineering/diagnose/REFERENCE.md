# Diagnose — Reference

See [SKILL.md](SKILL.md) for the full diagnosis loop: building a feedback loop, reproduce, hypothesise, instrument, fix, cleanup.

## Phase 1 — Build a Feedback Loop (Detailed)

**Ways to construct one — try in roughly this order:**

1. **Failing test** at whatever seam reaches the bug — unit, integration, e2e.
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with a fixture input, diffing stdout against a known-good snapshot.
4. **Headless browser script** (Playwright / Puppeteer) — drives the UI, asserts on DOM/console/network.
5. **Replay a captured trace.** Save a real network request / payload / event log to disk; replay it through the code path in isolation.
6. **Throwaway harness.** Spin up a minimal subset of the system (one service, mocked deps) that exercises the bug code path with a single function call.
7. **Property / fuzz loop.** If the bug is "sometimes wrong output", run 1000 random inputs and look for the failure mode.
8. **Bisection harness.** If the bug appeared between two known states (commit, dataset, version), automate "boot at state X, check, repeat" so you can `git bisect run` it.
9. **Differential loop.** Run the same input through old-version vs new-version (or two configs) and diff outputs.
10. **HITL bash script.** Last resort. If a human must click, drive _them_ with `scripts/hitl-loop.template.sh`.

### Iterate on the loop itself
- Can I make it faster?
- Can I make the signal sharper?
- Can I make it more deterministic?

### Non-deterministic bugs
Goal: higher reproduction rate, not clean repro. Loop 100x, parallelise, add stress.

### When you genuinely cannot build a loop
Stop and say so. List what you tried. Ask for: (a) access to reproducing environment, (b) captured artifact, or (c) permission for temp production instrumentation.

## Phase 2 — Reproduce (Detailed)

- [ ] Loop produces the failure mode the user described
- [ ] Failure is reproducible across multiple runs
- [ ] Exact symptom captured (error message, wrong output, slow timing)

## Phase 3 — Hypothesise (Detailed)

Generate **3-5 ranked hypotheses** before testing any. Each must be **falsifiable**.

> Format: "If <X> is the cause, then <changing Y> will make the bug disappear / <changing Z> will make it worse."

Show ranked list to user before testing.

## Phase 4 — Instrument (Detailed)

Each probe maps to a specific prediction. Change one variable at a time.
Tool preference: 1. Debugger/REPL, 2. Targeted logs, 3. Never "log everything and grep".
**Tag every debug log** with unique prefix, e.g. `[DEBUG-a4f2]`.

For performance regressions: establish baseline measurement, then bisect. Measure first, fix second.

## Phase 5 — Fix + Regression Test (Detailed)

1. Turn minimised repro into a failing test at the correct seam.
2. Watch it fail.
3. Apply fix.
4. Watch it pass.
5. Re-run Phase 1 feedback loop against original (un-minimised) scenario.

If no correct seam exists, note it — that itself is the finding.

## Phase 6 — Cleanup (Detailed)

- [ ] Original repro no longer reproduces
- [ ] Regression test passes (or absence of seam documented)
- [ ] All `[DEBUG-...]` instrumentation removed
- [ ] Throwaway prototypes deleted
- [ ] Correct hypothesis stated in commit/PR message
- [ ] What would have prevented this bug?
