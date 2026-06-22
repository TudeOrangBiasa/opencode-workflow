# Issue 9: Skill intent-based triggers — fixed

## Status

**Resolved.** Root cause: 20+ impeccable sub-commands listed in `opencode.json` skill_triggers, but the loader pulls the parent skill. The parent skill's protocol was passive ("If the user invoked a sub-command, load its reference") — agents didn't drill into `reference/<sub>.md`. Result: 43 generic `impeccable` loads, 0 sub-command loads.

## Fix (ponytail cut)

Add a **ROUTING TABLE** at the top of `~/.config/opencode/skills/impeccable/SKILL.md`:

- One row per sub-command: intent → `reference/<file>.md` link → sub-command name
- 22 rows covering all sub-commands
- Imperative language: "Do not proceed with generic design advice — load the sub-command file first"
- Disambiguation rule: "If user's intent is unclear, ask one question, then route"

When `impeccable` skill auto-loads (via trigger), the agent sees the routing table at the top, identifies intent, reads the right `reference/X.md`.

## Mechanism vs Rule

Still a prompt rule — but with an **explicit lookup table** at the top. Previous rule was "load sub-command if user mentioned one" (agent has to remember sub-commands exist). New rule is "read this table, find the row matching user intent, follow the link" (mechanical lookup).

## Verification

- Restart opencode
- Say "audit my UI" → `impeccable` skill loads → check that `reference/audit.md` is read
- Say "make this bolder" → check that `reference/bolder.md` is read
- Count: 0 sub-command loads → expected ~80%

## Out of scope

- Convert sub-commands to separate skills (overhead too high — 20+ new skills, 20+ new triggers, more config to maintain)
- Auto-detect intent via LLM (current approach is keyword + table lookup, simple enough)
- Routing for other multi-sub-command skills (most are simpler; only impeccable has 20+ sub-commands)

## Notes

The original Issue 9 had 4 acceptance criteria including "Test all 20+ impeccable sub-commands load correct reference file". The fix has 1 acceptance criterion: "ROUTING TABLE exists in parent SKILL.md with 22 rows". Live-test in next session.
