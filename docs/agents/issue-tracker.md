# Issue Tracker

This workflow repo uses local markdown issues unless a target project says otherwise.

## Local Layout

- `.scratch/issues/inbox/` — untriaged
- `.scratch/issues/inprogress/` — actively being worked on
- `.scratch/issues/done/` — completed

## Related

- `.scratch/issues/` is the canonical agent issue tracker.
- All issue tracking uses `.scratch/issues/` — no separate `.issues/` directory.

## Rules

- One issue per independently verifiable slice.
- Include acceptance criteria and verification commands.
- Keep PRDs separate from implementation slices when scope is large.
- Do not assume GitHub Issues or Linear unless the target repo config says so.
