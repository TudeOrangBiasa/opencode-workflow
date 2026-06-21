# Issue 7: URL cache + scout rate-limiting + batch questions

## What to build

Three related fixes for scout/research workflows:

1. **URL cache in OpenViking**: when webfetch returns 200, cache URL. When scout needs to fetch the same URL again, check cache first.
2. **Scout rate-limiting**: max N exa calls per session (e.g. 10) to avoid MCP timeouts. After hitting limit, fall back to webfetch with cache.
3. **Batch scout questions**: instead of N parallel scout calls, batch related questions into 1-2 calls. Detect when multiple scout calls in same minute are about same topic.

Current state in geopredict:
- 82 exa calls in 1 day → 7 MCP timeouts
- 3 webfetch 404s (tilecloud, NASA datasets, earthdata)
- 11 scout calls in 1 hour with no consolidation

## Acceptance criteria

- [ ] OpenViking protocol updated: "On successful webfetch, store URL in `viking://cache/web/...`"
- [ ] Scout prompt: "If you need to make >3 webfetch calls in same session, check OpenViking cache first"
- [ ] Orchestrator prompt: "If user wants to do research, batch questions into 1-3 scout calls, not 10+"
- [ ] Exa rate limit rule: "After 10 exa calls, fall back to webfetch"

## Blocked by

None — can start immediately.

## Notes

URL cache is bonus. Rate-limiting and batch are the real wins.
