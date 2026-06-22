# Issue 5: Ship Verification Gate — UI + Docs (reopened with officecli support)

## Status

Reopened. Original issue was HITL because of missing tool for doc verification. With iOfficeAI/OfficeCLI v1.0.116 installed (commit 6ddf742), doc verification is now possible via `officecli view screenshot`. Issue is now actionable.

## Original pain (verified)

Geopredict hackathon: **1 browser-qa for 21 builder sessions** — visual issues went uncaught, project shipped with broken UI.

The existing orchestrator prompt rule:

```
## Browser-QA Before Ship
Before any deploy/build/ship intent:
1. Run browser-qa on the affected views (auto-detect from edited files)
2. Skip only if changes are config-only with no UI impact
3. If browser-qa finds issues, route to builder for fix, then re-verify
```

**Did not fire** — same pattern as Issues 01, 08, 09: prompt rules alone don't reliably trigger. The geopredict session had this rule in scope but skipped it.

## Expanded scope

Original issue covered **UI files only** (`.tsx`, `.vue`, `.css`, etc.). With officecli installed, the same verification gate now covers **document files** (`.docx`, `.pptx`, `.xlsx`):

| Changed file | Verification |
|--------------|--------------|
| `.tsx`, `.vue`, `.svelte`, `.css`, `.scss`, `.html`, `.blade.php` | `browser-qa` (chrome-devtools screenshot + DOM check) |
| `.docx`, `.pptx`, `.xlsx` | `officecli view screenshot` (PNG, no Office required) |
| `.json`, `.yaml`, `.toml`, `.env`, `.sh` (config-only) | Skip visual QA, still run `verify-evidence` for correctness |
| Mixed (UI + config) | Run all applicable checks |
| No changes / docs-only | Run `verify-evidence` for correctness + checklist |

## Ship intent detection

Keywords (case-insensitive, any position in user message):

- `ship`, `ship it`, `let's ship`
- `done`, `done?`, `is it done?`
- `finish`, `finished`, `finito`
- `merge`, `merge it`, `pr ready`
- `deploy`, `deploy it`, `push to prod`
- `push` (when in deploy context)
- `release`, `cut release`, `tag release`

Slash commands (always ship intent):

- `/ship`, `/ship-it`
- `/yeet` (existing, but should also trigger verification)

## Architecture fix (mechanism, not just rule)

Verified pattern from Issues 01, 08, 09: **prompt rules alone don't reliably fire.** The fix is multi-layer:

1. **Skill trigger** — add `verify-evidence` to `skill_triggers` in `opencode.json` with ship keywords. This auto-loads the skill when ship intent is detected, putting the checklist in context.

2. **Explicit checklist in orchestrator prompt** — replace the 5-line rule with a 20+ line checklist that:
   - Names the ship keywords
   - Names the file extensions (UI vs docs vs config)
   - Names the exact verification commands (`browser-qa` subagent, `officecli view screenshot`)
   - Names the skip condition explicitly
   - Names the failure-handling step

3. **Use the `verify-evidence` skill content** as the canonical verification workflow. Don't duplicate the checklist in the agent prompt — point to the skill.

4. **Visual evidence requirement** — for any UI/doc change, the verification result MUST include a screenshot path. No screenshot = unverified.

## Acceptance criteria

- [ ] `opencode.json` `skill_triggers.orchestrator.verify-evidence` includes ship keywords
- [ ] `agents/orchestrator.md` "Browser-QA Before Ship" section replaced with:
  - Explicit ship intent keywords (15+ listed)
  - Explicit UI extension list (8+)
  - Explicit doc extension list (3)
  - Explicit config-only extension list (5)
  - Skip conditions named
  - Failure handling (route to builder, re-verify)
  - Visual evidence requirement (screenshot path)
- [ ] `agents/orchestrator.md` references `verify-evidence` skill as the source of truth (not duplicating content)
- [ ] `docs/templates/opencode.primitive-agents.jsonc` updated to match
- [ ] CHANGELOG entry under Unreleased
- [ ] Test: ship intent with no changes → runs verify-evidence → declares "config-only" with checklist
- [ ] Test: ship intent with UI changes → runs browser-qa → requires screenshot
- [ ] Test: ship intent with docx changes → runs officecli view screenshot → requires PNG

## Out of scope

- Hard enforcement via hook (opencode does not yet have a clean pre-tool hook for ship detection)
- Auto-block on `git push` if no verification evidence (could be a follow-up git hook in the repo, not the workflow kit)

## Notes

The geopredict pain was 1 browser-qa / 21 builder sessions. If this fix works, the ratio should jump to ~1 browser-qa per ship intent (not per builder session). A geopredict-style 21-builder session with 1 final ship would have 1 browser-qa (not 21). A 21-builder session with 5 internal "done?" checkpoints would have 5 browser-qa — appropriate.

Visual evidence (screenshots) should be saved under `.scratch/verification/<date>-<ship>/` so they're auditable later.
