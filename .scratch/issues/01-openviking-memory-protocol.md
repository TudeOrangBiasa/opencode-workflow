# Issue 1: OpenViking memory protocol — verify it fires

## What to build

Verify that the OpenViking memory protocol added in `agents/orchestrator.md` (memory protocol section) actually fires in real sessions. This is a verification issue, not a build issue.

The protocol requires:
- `ov find "<task-keyword>"` at task start
- `ov remember` at task end (with `viking://agent/projects/<name>` or `viking://agent/patterns/<category>`)
- Check known tool failure patterns before retrying

**Verify by**:
- Run a few real sessions and check the DB for `ov` calls
- Confirm OpenViking usage goes from 0% to meaningful
- Confirm lessons get stored

## Acceptance criteria

- [ ] Query OpenViking usage from `~/.local/share/opencode/opencode.db` after running 5+ sessions
- [ ] Confirm `ov find` and `ov remember` calls appear in messages
- [ ] Confirm patterns stored at `viking://agent/patterns/tool-failures/*`
- [ ] Update CHANGELOG with verification results

## Blocked by

None — can start immediately.

## Notes

Already implemented in commit `3703ffe` and `efc2146`. This is verification only.
