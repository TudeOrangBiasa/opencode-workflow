# Diagnosing Bugs — Reference

See [SKILL.md](SKILL.md) for the full diagnosis loop: build feedback loop, reproduce, hypothesise, instrument, fix, cleanup.

## Phase 1 — Build a Feedback Loop (Detailed)

**Ways to construct one — try in roughly this order:**

1. **Failing test** at whatever seam reaches the bug — unit, integration, e2e.
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with fixture input, diff stdout against known-good snapshot.
4. **Headless browser script** (Playwright / Puppeteer) — drives UI, asserts on DOM/console/network.
5. **Replay a captured trace.** Save real network request/payload/event log to disk; replay through code path in isolation.
6. **Throwaway harness.** Minimal subset of system (one service, mocked deps) exercising bug code path with single function call.
7. **Property / fuzz loop.** If "sometimes wrong output", run 1000 random inputs, look for failure mode.
8. **Bisection harness.** If bug appeared between two known states (commit, dataset, version), automate "boot at state X, check, repeat" for `git bisect run`.
9. **Differential loop.** Same input through old-vs-new (or two configs), diff outputs.
10. **HITL bash script.** Last resort. If human must click, drive them with `scripts/hitl-loop.template.sh`.

### Iterate on the loop
- Faster? (Cache setup, skip unrelated init, narrow test scope)
- Sharper signal? (Assert on specific symptom, not "didn't crash")
- More deterministic? (Pin time, seed RNG, isolate FS, freeze network)

### Non-deterministic bugs
Goal: higher reproduction rate, not clean repro. Loop 100x, parallelise, add stress, narrow timing windows. 50%-flake is debuggable; 1% is not.

### When you genuinely cannot build a loop
Stop and say so. List what you tried. Ask for: (a) access to reproducing environment, (b) captured artifact (HAR, log dump, core dump, screen recording), or (c) permission for temp production instrumentation.

### Completion criterion
A **tight** loop that is: red-capable (drives actual bug code path, asserts exact symptom), deterministic (or high repro rate), fast (seconds), agent-runnable.

## Phase 2 — Reproduce + Minimise (Detailed)

Minimise: shrink repro to smallest scenario that still goes red. Cut inputs, callers, config, data, steps one at a time, re-run after each cut. Every remaining element must be load-bearing — removing any makes loop go green.

## Phase 5 — Fix + Regression Test (Detailed)

1. Turn minimised repro into failing test at correct seam.
2. Watch it fail.
3. Apply fix.
4. Watch it pass.
5. Re-run Phase 1 feedback loop against original (un-minimised) scenario.

If no correct seam exists, note it — that itself is the finding. Codebase architecture preventing bug from being locked down.

## Phase 6 — Cleanup (Detailed)

- [ ] Original repro no longer reproduces
- [ ] Regression test passes (or absence of seam documented)
- [ ] All `[DEBUG-...]` instrumentation removed (grep the prefix)
- [ ] Throwaway prototypes deleted (or moved to clearly-marked debug location)
- [ ] Correct hypothesis stated in commit/PR message
- [ ] What would have prevented this bug?
