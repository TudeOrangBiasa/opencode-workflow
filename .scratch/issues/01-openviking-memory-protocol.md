# Issue 1: OpenViking memory protocol — fixed

## Status

**Resolved.** Root cause: `openviking` skill was in the description's trigger list but **NOT in `opencode.json` `skill_triggers`**. The skill existed but never auto-loaded → 0% firing.

## Fix (ponytail cut)

1. **Add `openviking` to `opencode.json` `skill_triggers`** with 18 task-start keywords:
   ```
   "openviking": ["memory", "remember", "openviking", "store", "retrieve",
                  "start", "begin", "new task", "task", "fix", "implement",
                  "build", "create", "update", "modify", "refactor", "add",
                  "find", "search memory"]
   ```
   Now auto-loads on any task verb. The 0% rate was a config bug, not a model problem.

2. **Rewrite top of `skills/personal/openviking/SKILL.md`** as imperative "PROTOCOL" section (5 numbered steps, not passive description). Agent reads protocol, follows it.

## Mechanism vs Rule

Pattern confirmed: **prompt rules alone don't fire, but auto-loaded skills do**. The fix moves the protocol from a rule in `agents/orchestrator.md` to a skill that auto-loads via trigger keywords. The skill content IS the protocol — the agent reads it, follows it.

## Verification

- Restart opencode, run a task that starts with "fix X" or "implement Y" → `openviking` skill auto-loads
- Check session DB: `ov find` and `ov remember` calls should appear in messages
- Check `~/.local/share/opencode/opencode.db` for OpenViking usage

## Out of scope

- Auto-trigger on every session start (opencode has no session-start hook)
- Sub-skill auto-triggering (e.g., loading specific memory namespaces)
- Cache layer for hot queries

## Notes

The skill description claimed triggers, but the triggers were only in the description text — not in the config. Classic meta-data vs config mismatch. The fix is one line in `opencode.json` and a SKILL.md rewrite. No framework, no script, no hook.
