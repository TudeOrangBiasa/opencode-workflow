# Issue 2: OfficeCLI pre-flight + .NET dependency check

## What to build

Add an OfficeCLI pre-flight check to `skills/engineering/setup-matt-pocock-skills/SKILL.md` and `docs/development.md` so the agent verifies OfficeCLI works BEFORE delegating docx work.

The check should:
1. Run `officecli --version` (or equivalent health check)
2. If it fails, surface the specific error (especially `DocumentFormat.OpenXml.Framework` missing .NET dep)
3. Provide a remediation step: install missing .NET package via `dotnet tool install --global <package>` or similar
4. Block docx delegation until pre-flight passes

This addresses the `DocumentFormat.OpenXml.Framework` error seen 5x in UMKM-Laporan sessions.

## Acceptance criteria

- [ ] Pre-flight check added to `setup-matt-pocock-skills/SKILL.md` Section D or new section
- [ ] Remediation commands documented in `docs/development.md` under "When Things Go Wrong"
- [ ] Orchestrator prompt includes "verify officecli works before docx delegation" rule
- [ ] CHANGELOG entry

## Blocked by

None — can start immediately.

## Notes

`.NET Framework` missing causes 5/17 officecli errors. Single fix would eliminate 30% of officecli failures.
