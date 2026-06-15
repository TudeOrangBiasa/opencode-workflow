# Install

This repo is the source of truth for local OpenCode workflow agents and selected skills.

Do not run these steps while still maturing the repo. Activation writes symlinks into `~/.config/opencode`; keep development repo-only until ready.

## Link Agents

```bash
./scripts/link-agents.sh
```

Links `agents/*.md` into `~/.config/opencode/agents`.

## Link Skills

```bash
./scripts/link-skills.sh
```

Links only the active workflow skills into `~/.config/opencode/skills`.

The script is non-destructive. If a target skill already exists as a real directory, the script stops instead of deleting it. Keep existing global skill dirs when they contain local customizations.

Active repo skills:

- `diagnose`
- `grill-with-docs`
- `triage`
- `improve-codebase-architecture`
- `setup-matt-pocock-skills`
- `tdd`
- `to-issues`
- `to-prd`
- `zoom-out`
- `prototype`
- `review`
- `accessibility`
- `ai-regression-testing`
- `android-clean-architecture`
- `angular-developer`
- `api-connector-builder`
- `api-design`
- `architecture-decision-records`
- `backend-patterns`
- `bun-runtime`
- `canary-watch`
- `click-path-audit`
- `clickhouse-io`
- `codebase-onboarding`
- `coding-standards`
- `compose-multiplatform-patterns`
- `context-budget`
- `cpp-coding-standards`
- `cpp-testing`
- `csharp-testing`
- `dart-flutter-patterns`
- `data-scraper-agent`
- `database-migrations`
- `database-review`
- `deep-research`
- `defi-amm-security`
- `deployment-patterns`
- `design-system`
- `django-celery`
- `django-patterns`
- `django-security`
- `django-tdd`
- `django-verification`
- `docker-patterns`
- `dotnet-patterns`
- `error-handling`
- `evm-token-decimals`
- `fastapi-patterns`
- `flox-environments`
- `flutter-dart-code-review`
- `fsharp-testing`
- `git-workflow`
- `github-ops`
- `golang-patterns`
- `golang-testing`
- `hexagonal-architecture`
- `ios-icon-gen`
- `java-coding-standards`
- `jpa-patterns`
- `kotlin-coroutines-flows`
- `kotlin-exposed-patterns`
- `kotlin-ktor-patterns`
- `kotlin-patterns`
- `kotlin-testing`
- `kubernetes-patterns`
- `laravel-patterns`
- `laravel-security`
- `laravel-verification`
- `mcp-server-patterns`
- `mysql-patterns`
- `nestjs-patterns`
- `nextjs-turbopack`
- `nodejs-keccak256`
- `nuxt4-patterns`
- `perl-patterns`
- `perl-security`
- `perl-testing`
- `php-review`
- `postgres-patterns`
- `prediction-market-risk-review`
- `prisma-patterns`
- `production-audit`
- `python-patterns`
- `python-testing`
- `pytorch-patterns`
- `quarkus-patterns`
- `quarkus-security`
- `quarkus-tdd`
- `quarkus-verification`
- `react-patterns`
- `react-performance`
- `react-testing`
- `redis-patterns`
- `rust-patterns`
- `rust-testing`
- `search-first`
- `security-bounty-hunter`
- `security-review`
- `shared-hosting-deployment`
- `springboot-patterns`
- `springboot-security`
- `springboot-tdd`
- `springboot-verification`
- `swift-actor-persistence`
- `swift-concurrency-6-2`
- `swift-protocol-di-testing`
- `swiftui-patterns`
- `team-handoff-quality`
- `ui-to-vue`
- `verify-evidence`
- `vite-patterns`
- `grill-me`
- `handoff`
- `write-a-skill`

Global-only skills such as `humanizer` and `impeccable` stay in `~/.config/opencode/skills`. Personal repo skills such as `openviking` and `ddev` live under `skills/personal/` and are not linked by the default active-skill script. OpenViking is optional; the workflow continues without it.

## OpenCode Restart

OpenCode loads config, agents, skills, and plugins at startup. Quit and restart OpenCode after linking or editing these files.

## Config Template

Use [`docs/templates/opencode.primitive-agents.jsonc`](./templates/opencode.primitive-agents.jsonc) as a manual merge template for `~/.config/opencode/opencode.json` when activating this workflow. Replace model IDs with exact IDs from `opencode models`.

The template includes MCP examples for Exa, Chrome DevTools, and optional OpenViking. Enable only the MCP servers you actually run.

See [`docs/models.md`](./models.md) for model tier guidance.

See [`docs/workflow.md`](./workflow.md) for routing rules, primitive agents, AFK session log, and optional OpenViking integration.

## Secret Safety

Do not commit `~/.config/opencode/opencode.json`. It can contain provider API keys.
