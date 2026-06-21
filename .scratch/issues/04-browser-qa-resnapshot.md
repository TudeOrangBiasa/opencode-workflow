# Issue 4: Browser-QA re-snapshot on click failure

## What to build

Update `agents/browser-qa.md` to add a hard rule: when chrome-devtools tool fails (especially `click`, `fill`, `fill_form`), always re-snapshot the page before retrying. The previous uid is stale.

Current state: 16 chrome-devtools errors from "Element uid X no longer exists" across PWEB-Swarakarna browser-qa sessions.

## Acceptance criteria

- [ ] browser-qa.md updated with: "On click/fill failure: re-snapshot → find new uid → retry. Do NOT retry with cached uid."
- [ ] Test scenario: simulate page state change, verify re-snapshot happens
- [ ] Reduce chrome-devtools error rate by ~70% (target: <5% from current ~20%)

## Blocked by

None — can start immediately.

## Notes

Single-line rule change. Should be a quick win. Also applies to any tool that takes element references (most chrome-devtools tools).
