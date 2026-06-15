# Issue 0001 — Fix README tracker wording for `to-issues`

## Problem

`README.md` describes `to-issues` as creating GitHub issues, but this repo's `docs/agents/issue-tracker.md` says local markdown issues are default unless target project says otherwise.

## Acceptance Criteria

- `README.md` no longer implies `to-issues` always creates GitHub issues.
- Wording matches configured issue tracker behavior: local markdown by default, GitHub/other trackers only when target repo config says so.
- No unrelated README changes.

## Verification

- Read changed README line.
- Inspect diff for unrelated changes.

## Result

- Updated `README.md` and `skills/engineering/README.md` `to-issues` descriptions to use configured-tracker wording with local markdown default.
- Verification evidence: grep found tracker-neutral `to-issues` wording in both files and local markdown default in `docs/agents/issue-tracker.md`.
- Review verdict: approve, no findings.
