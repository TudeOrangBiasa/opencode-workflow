# Issue 9: Skill intent-based triggers — verify complete

## What to build

Verify the impeccable sub-commands wiring done in commit `10b5ceb` is complete and works. Currently:
- 20+ impeccable sub-commands listed in `opencode.json` skill_triggers
- orchestrator, builder, browser-qa updated with sub-command tables
- setup-matt-pocock-skills recommends impeccable teach/document

**Verify by**:
- Test triggers fire correctly (e.g. "audit my UI" → loads impeccable audit, not generic impeccable)
- Test sub-commands are picked correctly (e.g. "impeccable craft" loads craft.md)
- Confirm setup-matt-pocock recommends impeccable teach on new projects

## Acceptance criteria

- [ ] Test all 20+ impeccable sub-commands load correct reference file
- [ ] Test 4 design-related skills (emil-design-eng, design-system, ui-to-vue, review-animations) trigger correctly
- [ ] Confirm setup-matt-pocock recommends impeccable teach / document
- [ ] Update CHANGELOG with verification

## Blocked by

None — can start immediately.

## Notes

Already implemented in `10b5ceb`. This is verification + gap-filling.
