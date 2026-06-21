# Issue 5: Browser-QA mandatory before "ship"/"done" intent — HITL

## What to build

Make browser-qa mandatory before any "ship", "done", "merge", or "deploy" intent. Currently hackathon projects (geopredict) shipped without visual QA — 1 browser-qa for 21 builder sessions.

This is a **HITL slice** because it requires a design decision:
- What exactly counts as "ship" intent? (words, context, etc.)
- What if there's no UI to QA? (e.g. pure backend change)
- Should it be blocking or warning?

The orchestrator needs a rule that detects ship intent and triggers browser-qa if any UI files were changed.

## Acceptance criteria

- [ ] Orchestrator prompt: "When user says ship/done/merge/deploy, AND any UI files changed in this session, run browser-qa on affected views"
- [ ] Define "UI files changed" — heuristic: .tsx, .vue, .css, .scss, .html, .blade.php, etc.
- [ ] Define "ship intent" — keywords: ship, done, finish, merge, deploy, push, release
- [ ] If no UI files changed, skip browser-qa (avoid unnecessary overhead)
- [ ] Browser-qa runs on auto-detected affected views

## Blocked by

- Issue 4 (re-snapshot rule should work first to avoid 20% error rate in browser-qa itself)

## Notes

Geopredict shipped with 1 browser-qa for 21 builder sessions — visual issues went uncaught. This is the fix.
