# OpenCode Workflow Kit

OpenCode-first agents, skills, and docs for primitive-agent engineering workflow.

This repo is for maturing workflow/config locally before anything is installed into `~/.config/opencode`.

### Principles

- **Cheap-first**: cheap models for exploration and execution; expensive models for planning, routing, review.
- **Maintainable**: compact agent files, precise skill triggers, minimal docs. No duplicated rules.
- **Team-friendly**: real project output (PRs, issues, changelogs) over ephemeral agent artifacts.
- **Anti-tech-debt**: every slice leaves the codebase no worse than found.
- **Real project output**: durable artifacts (PRs, commits, ADRs, verified tests) over agent-to-agent handoffs.

## Key Docs

- [`AGENTS.md`](./AGENTS.md) — repo rules for agents working here.
- [`docs/install.md`](./docs/install.md) — manual activation steps for OpenCode.
- [`docs/workflow.md`](./docs/workflow.md) — architecture, agents, skills, routing, AFK session log.
- [`docs/models.md`](./docs/models.md) — model tiers, candidates, parallelism rules.
- [`CONTEXT.md`](./CONTEXT.md) — domain language for this workflow kit.
- [`.out-of-scope/`](./.out-of-scope/) — rejected or deferred feature notes.

## Primitive Agents

OpenCode agent files live in [`agents/`](./agents/). They use OpenCode-compatible frontmatter only.

- `orchestrator` — primary router and final synthesizer.
- `planner` — read-only planning specialist.
- `builder` — narrow execution agent for bounded code changes.
- `reviewer` — Behavior + Change Health diff review with specialist escalation hints.
- `explore` — built-in OpenCode read-only discovery agent.
- `scout` — built-in OpenCode external docs, dependency source, and upstream API research.
- `browser-qa` — browser QA for responsive layout, spacing, broken UI, full-page coverage, and frontend data consistency.

> **Verifier**: No dedicated primitive agent. Use `verify-evidence` on-demand skill (misc) for tool-based verification in AFK, high-risk, or evidence-gap scenarios. See [Verification Agent Decision](./AGENTS.md#verification-agent-decision).

## Persistent Memory

OpenViking is the agent's persistent memory — used for self-learning, self-healing, and durable context across sessions. It is standard practice, but not required.

### When OpenViking is running

The orchestrator auto-triggers OpenViking on:
- User preferences ("gw suka X", "jangan Y")
- User corrections ("sudah gw bilang", "kok salah")
- Agent learning a pattern (3+ confirmations)
- Manual user triggers ("remember this", "what did we decide")

### When OpenViking is NOT running

The workflow continues without it. The agent skips memory triggers and uses local files only. No errors, no blocking. To enable, run:

```bash
openviking-server &
```

### Setup

OpenViking requires the `openviking` skill (linked to `~/.config/opencode/skills/`) and an OpenViking server. See [openviking skill](./skills/personal/openviking/SKILL.md) for namespace details, cleanup rules, and anti-patterns.

### Specialist Capabilities

Specialist prompts are skills, not agents. Occasional review skills live under `misc`; daily engineering workflows stay under `engineering` (see [`docs/workflow.md`](./docs/workflow.md#on-demand-skills-and-promotion-rule)).
`shared-hosting-deployment` and `team-handoff-quality` fit personal/team workflow needs under misc.

## Reference

### Engineering

Skills I use daily for code work.

- **[diagnose](./skills/engineering/diagnose/SKILL.md)** — Disciplined diagnosis loop for hard bugs and performance regressions: reproduce → minimise → hypothesise → instrument → fix → regression-test.
- **[grill-with-docs](./skills/engineering/grill-with-docs/SKILL.md)** — Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates `CONTEXT.md` and ADRs inline.
- **[triage](./skills/engineering/triage/SKILL.md)** — Triage issues through a state machine of triage roles.
- **[improve-codebase-architecture](./skills/engineering/improve-codebase-architecture/SKILL.md)** — Find deepening opportunities in a codebase, informed by the domain language in `CONTEXT.md` and the decisions in `docs/adr/`.
- **[setup-matt-pocock-skills](./skills/engineering/setup-matt-pocock-skills/SKILL.md)** — Scaffold the per-repo config (issue tracker, triage label vocabulary, domain doc layout) that the other engineering skills consume. Run once per repo before using `to-issues`, `to-prd`, `triage`, `diagnose`, `tdd`, `improve-codebase-architecture`, or `zoom-out`.
- **[tdd](./skills/engineering/tdd/SKILL.md)** — Test-driven development with a red-green-refactor loop. Builds features or fixes bugs one vertical slice at a time.
- **[to-issues](./skills/engineering/to-issues/SKILL.md)** — Break any plan, spec, or PRD into independently-grabbable issue slices for the configured tracker, defaulting to local markdown issues.
- **[to-prd](./skills/engineering/to-prd/SKILL.md)** — Turn the current conversation context into a PRD and publish it to the configured project issue tracker. No interview — just synthesizes what you've already discussed.
- **[zoom-out](./skills/engineering/zoom-out/SKILL.md)** — Tell the agent to zoom out and give broader context or a higher-level perspective on an unfamiliar section of code.
- **[prototype](./skills/engineering/prototype/SKILL.md)** — Build a throwaway prototype to flesh out a design — either a runnable terminal app for state/business-logic questions, or several radically different UI variations toggleable from one route.
- **[review](./skills/engineering/review/SKILL.md)** — Compact branch/PR/WIP review since a fixed point using parallel Behavior and ambitious Change Health passes.

### Productivity

General workflow tools, not code-specific.

- **[grill-me](./skills/productivity/grill-me/SKILL.md)** — Get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved.
- **[handoff](./skills/productivity/handoff/SKILL.md)** — Compact the current conversation into a handoff document so another agent can continue the work.
- **[write-a-skill](./skills/productivity/write-a-skill/SKILL.md)** — Create new skills with proper structure, progressive disclosure, and bundled resources.

### Misc

- **[accessibility](./skills/misc/accessibility/SKILL.md)** — Frontend accessibility patterns.
- **[ai-regression-testing](./skills/misc/ai-regression-testing/SKILL.md)** — Regression testing for AI-assisted dev.
- **[android-clean-architecture](./skills/misc/android-clean-architecture/SKILL.md)** — Clean Architecture for Android/KMP.
- **[angular-developer](./skills/misc/angular-developer/SKILL.md)** — Angular development, signals, forms, DI, routing. Use only when working in Angular projects.
- **[api-connector-builder](./skills/misc/api-connector-builder/SKILL.md)** — Build API connectors.
- **[api-design](./skills/misc/api-design/SKILL.md)** — REST/API design checklist.
- **[architecture-decision-records](./skills/misc/architecture-decision-records/SKILL.md)** — Capture ADRs.
- **[backend-patterns](./skills/misc/backend-patterns/SKILL.md)** — Backend architecture patterns.
- **[bun-runtime](./skills/misc/bun-runtime/SKILL.md)** — Bun runtime, package manager, bundler. Use only when adopting Bun.
- **[canary-watch](./skills/misc/canary-watch/SKILL.md)** — Post-deploy monitoring.
- **[click-path-audit](./skills/misc/click-path-audit/SKILL.md)** — Trace button click paths.
- **[clickhouse-io](./skills/misc/clickhouse-io/SKILL.md)** — ClickHouse schema, queries, partitioning. Use only when working with ClickHouse.
- **[codebase-onboarding](./skills/misc/codebase-onboarding/SKILL.md)** — Analyze unfamiliar codebases.
- **[coding-standards](./skills/misc/coding-standards/SKILL.md)** — Baseline coding conventions. Use only when enforcing coding standards.
- **[compose-multiplatform-patterns](./skills/misc/compose-multiplatform-patterns/SKILL.md)** — Compose Multiplatform patterns.
- **[context-budget](./skills/misc/context-budget/SKILL.md)** — OpenCode context overhead audit.
- **[cpp-coding-standards](./skills/misc/cpp-coding-standards/SKILL.md)** — Modern C++ conventions. Use only when writing C++ code.
- **[cpp-testing](./skills/misc/cpp-testing/SKILL.md)** — C++ testing with GoogleTest/CTest. Use only when writing C++ tests.
- **[csharp-testing](./skills/misc/csharp-testing/SKILL.md)** — C# testing with xUnit, Moq. Use only when writing C# tests.
- **[dart-flutter-patterns](./skills/misc/dart-flutter-patterns/SKILL.md)** — Dart/Flutter patterns.
- **[drawio](./skills/misc/drawio/SKILL.md)** — Professional diagrams from natural language via draw.io — architecture, ERD, UML, flowchart, ML/DL models. Exports PNG/SVG/PDF/JPG. Requires draw.io desktop CLI.
- **[data-scraper-agent](./skills/misc/data-scraper-agent/SKILL.md)** — Build AI data collection agents.
- **[database-migrations](./skills/misc/database-migrations/SKILL.md)** — Safe database migrations.
- **[database-review](./skills/misc/database-review/SKILL.md)** — Database review checklist.
- **[deep-research](./skills/misc/deep-research/SKILL.md)** — Multi-source deep research.
- **[defi-amm-security](./skills/misc/defi-amm-security/SKILL.md)** — DeFi AMM security checklist.
- **[deployment-patterns](./skills/misc/deployment-patterns/SKILL.md)** — Deployment workflows.
- **[design-system](./skills/misc/design-system/SKILL.md)** — Design system audit/review.
- **[django-celery](./skills/misc/django-celery/SKILL.md)** — Django + Celery async tasks. Use only when adding background jobs to Django.
- **[django-patterns](./skills/misc/django-patterns/SKILL.md)** — Django architecture and DRF. Use only when building Django applications.
- **[django-security](./skills/misc/django-security/SKILL.md)** — Django security hardening. Use only when hardening Django.
- **[django-tdd](./skills/misc/django-tdd/SKILL.md)** — Django testing with pytest-django. Use only when writing Django tests.
- **[django-verification](./skills/misc/django-verification/SKILL.md)** — Django pre-deployment verification. Use only when verifying Django.
- **[docker-patterns](./skills/misc/docker-patterns/SKILL.md)** — Docker patterns.
- **[dotnet-patterns](./skills/misc/dotnet-patterns/SKILL.md)** — C#/.NET patterns. Use only when building .NET applications.
- **[emil-design-eng](./skills/misc/emil-design-eng/SKILL.md)** — Emil Kowalski's design engineering: UI polish, animation decisions, easing curves, springs, gestures. Use when building polished interfaces with intentional motion.
- **[error-handling](./skills/misc/error-handling/SKILL.md)** — Error-handling review checklist.
- **[evm-token-decimals](./skills/misc/evm-token-decimals/SKILL.md)** — ERC-20 decimal handling.
- **[fastapi-patterns](./skills/misc/fastapi-patterns/SKILL.md)** — FastAPI patterns and project structure. Use only when building FastAPI backends.
- **[flox-environments](./skills/misc/flox-environments/SKILL.md)** — Reproducible dev environments with Flox. Use only when managing Flox environments.
- **[flutter-dart-code-review](./skills/misc/flutter-dart-code-review/SKILL.md)** — Flutter/Dart code review. Use only when reviewing Flutter/Dart code.
- **[fsharp-testing](./skills/misc/fsharp-testing/SKILL.md)** — F# testing with Expecto, FsCheck. Use only when writing F# tests.
- **[git-workflow](./skills/misc/git-workflow/SKILL.md)** — Branching and commit conventions.
- **[github-ops](./skills/misc/github-ops/SKILL.md)** — GitHub CLI operations.
- **[golang-patterns](./skills/misc/golang-patterns/SKILL.md)** — Idiomatic Go patterns. Use only when writing Go code.
- **[golang-testing](./skills/misc/golang-testing/SKILL.md)** — Go testing patterns. Use only when writing Go tests.
- **[hexagonal-architecture](./skills/misc/hexagonal-architecture/SKILL.md)** — Ports & Adapters architecture. Use only when designing hexagonal architecture.
- **[ios-icon-gen](./skills/misc/ios-icon-gen/SKILL.md)** — iOS app icon generation. Use only when generating iOS icons.
- **[java-coding-standards](./skills/misc/java-coding-standards/SKILL.md)** — Java conventions for Spring Boot and Quarkus. Use only when writing Java code.
- **[jpa-patterns](./skills/misc/jpa-patterns/SKILL.md)** — JPA/Hibernate patterns. Use only when working with JPA.
- **[kotlin-coroutines-flows](./skills/misc/kotlin-coroutines-flows/SKILL.md)** — Kotlin coroutines and Flow. Use only when working with Kotlin coroutines.
- **[kotlin-exposed-patterns](./skills/misc/kotlin-exposed-patterns/SKILL.md)** — JetBrains Exposed ORM. Use only when using Exposed.
- **[kotlin-ktor-patterns](./skills/misc/kotlin-ktor-patterns/SKILL.md)** — Ktor HTTP API patterns. Use only when building Ktor applications.
- **[kotlin-patterns](./skills/misc/kotlin-patterns/SKILL.md)** — Idiomatic Kotlin patterns. Use only when writing Kotlin code.
- **[kotlin-testing](./skills/misc/kotlin-testing/SKILL.md)** — Kotlin testing with Kotest, MockK. Use only when writing Kotlin tests.
- **[kubernetes-patterns](./skills/misc/kubernetes-patterns/SKILL.md)** — K8s manifests and debugging. Use only when writing K8s manifests.
- **[laravel-patterns](./skills/misc/laravel-patterns/SKILL.md)** — Laravel app structure.
- **[laravel-security](./skills/misc/laravel-security/SKILL.md)** — Laravel security.
- **[laravel-verification](./skills/misc/laravel-verification/SKILL.md)** — Laravel verification loop.
- **[mcp-server-patterns](./skills/misc/mcp-server-patterns/SKILL.md)** — Build MCP servers.
- **[mysql-patterns](./skills/misc/mysql-patterns/SKILL.md)** — MySQL/MariaDB patterns.
- **[modular-monolith-patterns](./skills/misc/modular-monolith-patterns/SKILL.md)** — Modular monolith architecture — domain separation, Client/Implementation pattern, ArchUnit enforcement.
- **[nestjs-patterns](./skills/misc/nestjs-patterns/SKILL.md)** — NestJS module architecture. Use only when building NestJS APIs.
- **[nextjs-turbopack](./skills/misc/nextjs-turbopack/SKILL.md)** — Next.js with Turbopack. Use only when using Next.js + Turbopack.
- **[nodejs-keccak256](./skills/misc/nodejs-keccak256/SKILL.md)** — Ethereum hashing in Node.js. Use only when computing Ethereum hashes.
- **[nuxt4-patterns](./skills/misc/nuxt4-patterns/SKILL.md)** — Nuxt 4 patterns.
- **[perl-patterns](./skills/misc/perl-patterns/SKILL.md)** — Modern Perl conventions. Use only when writing Perl code.
- **[perl-security](./skills/misc/perl-security/SKILL.md)** — Perl security hardening. Use only when hardening Perl.
- **[perl-testing](./skills/misc/perl-testing/SKILL.md)** — Perl testing with Test::More. Use only when writing Perl tests.
- **[php-review](./skills/misc/php-review/SKILL.md)** — PHP/Laravel review checklist.
- **[postgres-patterns](./skills/misc/postgres-patterns/SKILL.md)** — PostgreSQL patterns.
- **[prediction-market-risk-review](./skills/misc/prediction-market-risk-review/SKILL.md)** — Prediction market risk review.
- **[prisma-patterns](./skills/misc/prisma-patterns/SKILL.md)** — Prisma ORM patterns.
- **[production-audit](./skills/misc/production-audit/SKILL.md)** — Production readiness audit.
- **[python-patterns](./skills/misc/python-patterns/SKILL.md)** — Idiomatic Python patterns. Use only when writing Python code.
- **[python-testing](./skills/misc/python-testing/SKILL.md)** — Python testing with pytest. Use only when writing Python tests.
- **[pytorch-patterns](./skills/misc/pytorch-patterns/SKILL.md)** — PyTorch deep learning patterns. Use only when building PyTorch pipelines.
- **[quarkus-patterns](./skills/misc/quarkus-patterns/SKILL.md)** — Quarkus CDI, Panache, Camel. Use only when building Quarkus services.
- **[quarkus-security](./skills/misc/quarkus-security/SKILL.md)** — Quarkus security. Use only when securing Quarkus applications.
- **[quarkus-tdd](./skills/misc/quarkus-tdd/SKILL.md)** — Quarkus TDD. Use only when doing TDD for Quarkus.
- **[quarkus-verification](./skills/misc/quarkus-verification/SKILL.md)** — Quarkus pre-deployment verification. Use only when verifying Quarkus.
- **[react-patterns](./skills/misc/react-patterns/SKILL.md)** — React 18/19 patterns.
- **[react-performance](./skills/misc/react-performance/SKILL.md)** — React/Next.js performance.
- **[react-testing](./skills/misc/react-testing/SKILL.md)** — React testing with RTL.
- **[redis-patterns](./skills/misc/redis-patterns/SKILL.md)** — Redis patterns.
- **[review-animations](./skills/misc/review-animations/SKILL.md)** — Reviews animation and motion code against Emil Kowalski's craft bar. Block/approve verdict with findings table. Companion to emil-design-eng.
- **[rust-patterns](./skills/misc/rust-patterns/SKILL.md)** — Idiomatic Rust patterns. Use only when writing Rust code.
- **[rust-testing](./skills/misc/rust-testing/SKILL.md)** — Rust testing. Use only when writing Rust tests.
- **[search-first](./skills/misc/search-first/SKILL.md)** — Research-before-coding workflow.
- **[security-bounty-hunter](./skills/misc/security-bounty-hunter/SKILL.md)** — Bug bounty testing. Use only when auditing for bounties.
- **[security-review](./skills/misc/security-review/SKILL.md)** — Security review checklist.
- **[shared-hosting-deployment](./skills/misc/shared-hosting-deployment/SKILL.md)** — Shared hosting deployment.
- **[springboot-patterns](./skills/misc/springboot-patterns/SKILL.md)** — Spring Boot patterns. Use only when building Spring Boot services.
- **[springboot-security](./skills/misc/springboot-security/SKILL.md)** — Spring Boot security. Use only when hardening Spring Boot.
- **[springboot-tdd](./skills/misc/springboot-tdd/SKILL.md)** — Spring Boot TDD. Use only when doing TDD for Spring Boot.
- **[springboot-verification](./skills/misc/springboot-verification/SKILL.md)** — Spring Boot verification. Use only when verifying Spring Boot.
- **[swift-actor-persistence](./skills/misc/swift-actor-persistence/SKILL.md)** — Swift actor-based persistence. Use only when implementing actor-based persistence.
- **[swift-concurrency-6-2](./skills/misc/swift-concurrency-6-2/SKILL.md)** — Swift 6.x concurrency. Use only when working with Swift 6.x.
- **[swift-protocol-di-testing](./skills/misc/swift-protocol-di-testing/SKILL.md)** — Swift protocol DI and testing. Use only when designing Swift DI.
- **[swiftui-patterns](./skills/misc/swiftui-patterns/SKILL.md)** — SwiftUI patterns. Use only when building SwiftUI views.
- **[team-handoff-quality](./skills/misc/team-handoff-quality/SKILL.md)** — Team handoff checklist.
- **[ui-to-vue](./skills/misc/ui-to-vue/SKILL.md)** — Convert UI designs to Vue. Use only when converting designs to Vue.
- **[verify-evidence](./skills/misc/verify-evidence/SKILL.md)** — Verification evidence checklist.
- **[vite-patterns](./skills/misc/vite-patterns/SKILL.md)** — Vite build tool patterns.
