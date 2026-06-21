# Issue 3: OfficeCLI smart fallback (skill auto-load, no bash hacks)

## What to build

Replace the bash-hack fallback pattern (unzip → sed → python3+lxml) with proper OfficeCLI skill usage. When officecli tool fails, agent should:
1. Load the `officecli` skill (if not already loaded)
2. Read the error message carefully
3. If error is "Unknown tool: raw-set" → use `set` instead
4. If error is "--index must be non-negative" → check element exists first
5. If error is "Cannot add 'run' under /body" → use correct XML node
6. If error is "Path not found" → verify table structure first
7. Only fall back to bash if all officecli approaches fail

**This addresses 238 python3+lxml bash workarounds in UMKM-Laporan sessions.**

## Acceptance criteria

- [ ] Orchestrator prompt updated: "On officecli error, load officecli skill and follow documented patterns before falling back to bash"
- [ ] Builder agent prompt: "When officecli fails, do NOT immediately fall back to bash. Load officecli skill, read error, try alternative command"
- [ ] officecli skill includes error → solution table (5 known errors with their fixes)
- [ ] Test scenario: simulate officecli failure, verify skill loads and proper retry happens

## Blocked by

- Issue 2 (pre-flight check should pass first, otherwise skill is just treating symptoms)

## Notes

Critical: 314 bash workarounds in current state. Each failed officecli call triggers ~18 bash calls. Fix the cascade, not the trigger.
