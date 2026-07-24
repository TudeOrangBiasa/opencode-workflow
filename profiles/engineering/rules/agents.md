# Engineering Rules

- Ponytail: no boilerplate comments, code is documentation, shortest diff. YAGNI — don't build what existing OSS provides
- Caveman: terse, no filler, fragments OK, technical terms exact
- Use 9router-web-fetch for API docs / library lookups, 9router-web-search for finding solutions
- Use browser-use MCP (initialize_browser, go_to_url, click_element, inspect_page) for frontend QA and browser testing
- Read before edit
- Smallest safe change
- Run tests after change
- No debug artifacts
- Ask before guessing. If spec/tickets unclear or docs insufficient → stop, ask orchestrator. Don't guess.
- Install opensrc (`npx @opensrc/cli`) — use it to find existing OSS before building anything from scratch

## Coding Style & Taste
- Follow `CODING_STANDARDS.md` in repo root. If repo has its own `CONTRIBUTING.md` or `CODING_STANDARDS.md`, that wins.
- If no repo standards exist → apply `CODING_STANDARDS.md` defaults (ponytail: shortest diff, no boilerplate, YAGNI).

## Design & UI
- Never implement UI without DESIGN.md. If missing, run `/design build --document` first.
- Prefer SHADCN, Material UI, or similar component libraries. Use dashboard/admin templates when applicable.
- For finding OSS packages/docs: use opensrc — search before building.
- design-skill kills AI slop — auto-invoke before any frontend work.

## PR Workflow
- Work on branch, submit PR to main. Never push/commit directly to main unless user explicitly says so.
- Use conventional commits for PR titles.
- Include DESIGN.md evidence in frontend PRs.
- **Engineering never closes tickets.** Change code → submit PR → mark as ready for review. Orchestrator handles ticket closure and validation routing.

## Wiki & Docs
- **Stack**: docsify (render markdown) + Redoc (render openapi.yaml → API docs). Deploy via GitHub Pages from `docs/`.
- **After implementing a feature** → write `docs/guides/<feature>.md`. Format: `## What → ## How → ## Example`. Bullets, short, consistent.
- **API docs**: update `docs/api/openapi.yaml`. Redoc renders automatically.
- **Sidebar**: update `docs/_sidebar.md` if adding new page.
- **No extra LLM calls for docs.** Agents write markdown directly — they already have code context.
- **ADHD-friendly**: bullets, max 3 lines per bullet, bold key terms, `→ Next:` at end.
- **CodeWiki alternate**: for batch wiki generation from large codebase if needed. But daily docs = agents write inline.

## Init (once)
```bash
npx docsify-cli init ./docs
# creates: index.html, README.md, .nojekyll
```

## Deploy
GitHub Pages → source `docs/` folder. No build step required.
