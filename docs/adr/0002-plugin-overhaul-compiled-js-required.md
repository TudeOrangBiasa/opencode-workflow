# ADR-0002: Plugin Overhaul — Compiled JS Required, Dead Plugins Removed

**Date**: 2026-07-09
**Status**: accepted
**Deciders**: user + orchestrator

## Context

Audit of 744 OpenCode sessions (Jun 10–Jul 9 2026) revealed that 3 of 4 plugins in `.opencode/plugins/` never loaded:

- `repair-harness.ts`, `taste.ts`, `lesson-injector.ts` — all `.ts` files silently skipped because OpenCode plugin loader requires compiled `.js` files
- `caveman` — ERROR LOAD (`Plugin export is not a function`) — old install broken
- `opencode-codex-usage` — ERROR LOAD (`eventType.startsWith not a function`) — incompatible with current plugin API

Only `rtk.ts` was actually active during that period. All previous work (named export fixes, preamble-strip logic) had zero effect because plugins never ran.

## Decision

1. **Delete `repair-harness.ts`** — not useful for OpenCode; its repair patterns (null drop, markdown strip) are handled by OpenCode's native tool-call handling
2. **Delete `opencode-codex-usage`** — npm package removed, entry removed from `opencode.jsonc`
3. **Replace `caveman` with `opencode-caveman`** — npm package (`opencode-caveman`) with proper plugin export (`default: { id, server }`). Commands and skills symlinked from npm package
4. **Keep `taste.ts` + `lesson-injector.ts` as is** — will fix via dedicated issues (compile `.ts` → `.js` so they actually load)

## Alternatives Considered

### Alternative 1: Keep repair-harness and fix it
- **Pros**: Already has test coverage (81 tests), catches malformed tool args
- **Cons**: Patterns (null-drop, markdown strip) are OpenCode-native now; no evidence it was useful in 744 sessions
- **Why not**: Dead code. Better to delete than maintain unused functionality.

### Alternative 2: Use JuliusBrussee/caveman canonical installer
- **Pros**: Official install from upstream, handles all agents
- **Cons**: Over-engineered for just OpenCode; install script touches Claude Code/Gemini config unnecessarily
- **Why not**: `opencode-caveman` npm package is cleaner — single purpose, proper plugin export

## Consequences

### Positive
- Plugin system now actually loads: `opencode-caveman` verified as correctly exported (`{id, server}`)
- Fewer plugin entries in config (4 → 3)
- Dead code removed (repair-harness: 209 lines + tests, opencode-codex-usage: whole npm package)
- Caveman commands and skills properly linked from npm package

### Negative
- `taste.ts` and `lesson-injector.ts` still not loaded — pending issues
- Full path to npm package in `opencode.json` is brittle (`fnm` version path)

### Risks
- `opencode-caveman` npm package uses `~/.config/opencode/caveman.json` for config — must create if missing
- Taste + lesson-injector fix requires TypeScript compile step or `.js` rewrite
