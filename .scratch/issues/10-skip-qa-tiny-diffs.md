# Issue 10: Skip browser-qa for tiny diffs — Ponytail cut

## Status

In progress. Was blocked by Issue 5 (ship gate first). Now actionable. Ponytail principle: no new skill, no new framework, no test-scenario spec. Just 5 lines added to the existing ship gate.

## Original pain

PWEB-Swarakarna: 9+ builder→browser-qa→fix→browser-qa cycles per project. For tiny edits (3-line CSS color change, typo fix, copy edit), browser-qa's visual check adds zero signal. Wasted time.

## Ponytail cut (the whole thing)

Add to `agents/orchestrator.md` "Ship Verification Gate → File-type classification" — one row:

| `git diff --shortstat` < 10 changes AND 1 file changed | Skip browser-qa, walk verify-evidence checklist only |
| Everything else | Run browser-qa or officecli view screenshot per file type |

That's it. 2 lines of markdown table, 5 lines including header.

## Why this works

- **Tiny diffs are visual tweaks**: CSS color, spacing, copy text, single-line type fix. Browser-qa "sees what user sees" — for these, git diff + verify-evidence already see it.
- **Tests catch logic bugs, not browser-qa.** If a tiny diff breaks something subtle, it's a logic bug, caught by tests. Browser-qa is for visual regressions, which need bigger diffs to manifest.
- **`git diff --shortstat` is the cheapest possible signal.** Stdlib, no parser, no new dependency.
- **Doesn't touch docs.** Doc verification (officecli view screenshot) is fast and cheap — always run it for docx/pptx/xlsx. The skip is only for browser-qa on UI.

## What this is NOT

- Not a "tiny diff detector" skill. The detection is one bash call.
- Not a new framework. It's a row in the existing table.
- Not a test suite. Live-test in next session.
- Not a definition of "tiny" in terms of semantic significance. Lines + file count. Done.

## Acceptance criteria

- [ ] `agents/orchestrator.md` "Ship Verification Gate" section has a new row in the file-type classification table for tiny diffs
- [ ] Row reads: < 10 changes AND 1 file → skip browser-qa, walk verify-evidence
- [ ] Row has a "reasoning" line: "visual check is unreliable for tiny edits; verify-evidence catches the rest"
- [ ] No new skill, no new file
- [ ] Manual test in next session: edit one CSS line, declare "ship", verify no browser-qa runs

## Out of scope

- Tunable threshold (10 lines is fine, don't parameterize)
- Semantic detection (don't parse logic keywords — start with line count, refine if false negatives appear)
- Per-project thresholds (one rule, all projects)

## Notes

The original Issue 10 had 3 design questions, 4 acceptance criteria, and 1 test scenario — 25 lines of spec for what's actually 2 lines of table. Ponytail cut saves 23 lines of process and ships faster.
