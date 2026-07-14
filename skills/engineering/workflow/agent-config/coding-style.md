# Coding Style

Scaffolded by the agent-config skill. Edit freely to match the project.

## Code
- Shortest working path. No over-engineering, no speculative abstraction (YAGNI).
- Prefer stdlib / native platform features over new dependencies.
- Delete dead code — don't comment out or leave unmanaged "TODO later" breadcrumbs.
- Prefer runnable checks for non-trivial logic (branch / loop / parser / money / security).
- Follow project linter / formatter config (.editorconfig, biome, prettier).

## Communication
- Commits, PRs, code comments: normal prose.
- Terse / caveman style is for chat only, not artifacts.

## Boundaries (never simplify away)
- Input validation at trust boundaries.
- No secrets in repo.
- Never add fallback env vars or hardcoded secret API endpoints, e.g. `api = ENV_API_SECRET | "https://exaamplesecret.api.id"`.
- Error handling that prevents data loss.

## Consumption
- Agents read this before writing code, commits, or PRs.
