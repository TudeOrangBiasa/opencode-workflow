# Misc

Specialist domain skills organized by technology area. Load only when the specific domain appears.

## When to use

You are working with a specific framework, database, language, platform, security pattern, or ML pipeline. Each skill in Misc targets one technology or class of technologies — load the skill when you touch that tech.

## Boundary with sibling buckets

**Misc** covers specialist skills grouped by domain (frontend, backend, languages, security, ML, mobile, devops, data). These are NOT daily drivers — you load them when a specific technology appears in the task. Use **Engineering** for pipeline skills used daily (planning, review, TDD, diagnose). Use **Productivity** for non-code workflow tools (documents, research, handoffs). If a skill is named after a framework (Angular, Django, Spring Boot) or a technology (PostgreSQL, Docker, PyTorch), it belongs in Misc.

## Structure

8 domain sub-directories:

- **frontend/** — UI frameworks, accessibility, testing, animation review
- **backend/** — Server frameworks and API patterns
- **languages/** — Language-specific conventions and testing (11 languages/tools)
- **security/** — EVM, AMM, bounty hunting
- **data/** — Data collection and scraping
- **ml/** — PyTorch and deep learning patterns
- **mobile/** — Android, iOS, Flutter, Compose Multiplatform
- **devops/** — Infrastructure, databases, deployment, containerization

### frontend/

- [accessibility](accessibility/SKILL.md) — Frontend accessibility patterns for forms, ARIA, keyboard nav, screen readers.
- [angular-developer](angular-developer/SKILL.md) — Angular code generation, signals, forms, DI, routing, SSR, testing.
- [nextjs-turbopack](nextjs-turbopack/SKILL.md) — Next.js with Turbopack — config, loaders, migration.
- [nuxt4-patterns](nuxt4-patterns/SKILL.md) — Nuxt 4 patterns — hydration safety, route rules, data fetching, lazy loading.
- [react-patterns](react-patterns/SKILL.md) — React 18/19 patterns: hooks, RSC boundaries, Suspense, forms, state management.
- [react-performance](react-performance/SKILL.md) — React/Next.js performance: waterfalls, bundle size, re-renders, Web Vitals.
- [react-testing](react-testing/SKILL.md) — React testing with RTL, Vitest, MSW, and axe — behavior-focused tests.
- [review-animations](review-animations/SKILL.md) — Reviews animation and motion code against a high craft bar.
- [ui-to-vue](ui-to-vue/SKILL.md) — Convert mockups/screenshots into Vue SFC components.
- [vite-patterns](vite-patterns/SKILL.md) — Vite build tool patterns — config, plugins, HMR, env vars, proxy, SSR.

### backend/

- [api-connector-builder](api-connector-builder/SKILL.md) — Build API connectors matching the host repo's existing integration pattern.
- [api-design](api-design/SKILL.md) — REST/API design checklist for endpoint naming, status codes, pagination, errors.
- [backend-patterns](backend-patterns/SKILL.md) — Backend architecture patterns — API design, repo/service layers, caching, error handling, auth.
- [ddev](ddev/SKILL.md) — DDEV workflow for PHP/Laravel — Composer, Artisan, PHPUnit, database commands.
- [django](django/SKILL.md) — Django: architecture, DRF, Celery, security, TDD, verification (merged from 5 skills).
- [dotnet-patterns](dotnet-patterns/SKILL.md) — C#/.NET patterns, DI, EF Core, Minimal APIs.
- [fastapi-patterns](fastapi-patterns/SKILL.md) — FastAPI project structure, Pydantic v2, DI, auth, testing.
- [hexagonal-architecture](hexagonal-architecture/SKILL.md) — Ports & Adapters architecture design and refactoring.
- [jpa-patterns](jpa-patterns/SKILL.md) — JPA/Hibernate entity mapping, fetch strategies, caching.
- [laravel](laravel/SKILL.md) — Laravel: architecture, Eloquent, security, verification (merged from 3 skills).
- [mcp-server-patterns](mcp-server-patterns/SKILL.md) — Build MCP servers with Node/TS SDK — tools, resources, prompts.
- [modular-monolith](modular-monolith/SKILL.md) — Modular monolith architecture: decision framework (when/why to evolve) + implementation patterns (domain separation, Client/Implementation, ArchUnit).
- [nestjs-patterns](nestjs-patterns/SKILL.md) — NestJS modules, controllers, DTOs, guards, interceptors.
- [php-review](php-review/SKILL.md) — PHP/Laravel review checklist for framework correctness, security.
- [quarkus](quarkus/SKILL.md) — Quarkus: CDI, Panache, Camel, security, TDD, verification (merged from 4 skills).
- [springboot](springboot/SKILL.md) — Spring Boot: REST APIs, JPA, security, TDD, verification (merged from 4 skills).

### languages/

- [bun-runtime](bun-runtime/SKILL.md) — Bun as JS/TS runtime, package manager, bundler, test runner.
- [coding-standards](coding-standards/SKILL.md) — Baseline coding conventions (naming, readability, immutability).
- [cpp](cpp/SKILL.md) — C++: modern idioms, RAII, smart pointers, GoogleTest, CMake/CTest (merged from 2 skills).
- [csharp-testing](csharp-testing/SKILL.md) — C# testing with xUnit, NUnit, Moq, FluentAssertions.
- [fsharp-testing](fsharp-testing/SKILL.md) — F# testing with Expecto, FsCheck, NUnit.
- [golang](golang/SKILL.md) — Go: idioms, concurrency, error handling, testing (merged from 2 skills).
- [java-coding-standards](java-coding-standards/SKILL.md) — Java 17+ conventions for Spring Boot and Quarkus.
- [kotlin](kotlin/SKILL.md) — Kotlin: idioms, coroutines, Exposed ORM, Ktor, testing (merged from 5 skills).
- [perl](perl/SKILL.md) — Perl: modern conventions, security, testing (merged from 3 skills).
- [python](python/SKILL.md) — Python: idioms, type hints, async, pytest (merged from 2 skills).
- [rust](rust/SKILL.md) — Rust: ownership, error handling, Tokio, testing (merged from 2 skills).

### security/

- [defi-amm-security](defi-amm-security/SKILL.md) — Security checklist for Solidity AMM contracts.
- [evm-token-decimals](evm-token-decimals/SKILL.md) — ERC-20 decimal handling — runtime lookup, chain-aware caching.
- [nodejs-keccak256](nodejs-keccak256/SKILL.md) — Ethereum Keccak-256 hashing in JS/TS.
- [prediction-market-risk-review](prediction-market-risk-review/SKILL.md) — Review prediction-market/trading workflows for compliance.
- [security-bounty-hunter](security-bounty-hunter/SKILL.md) — Web app auditing for bug bounty programs.

### data/

- [data-scraper-agent](data-scraper-agent/SKILL.md) — Build AI-powered data collection agents for public sources.

### ml/

- [pytorch-patterns](pytorch-patterns/SKILL.md) — PyTorch training loops, data loading, GPU optimization.

### mobile/

- [android-clean-architecture](android-clean-architecture/SKILL.md) — Clean Architecture for Android/KMP.
- [compose-multiplatform-patterns](compose-multiplatform-patterns/SKILL.md) — Compose Multiplatform state management, navigation, theming.
- [dart-flutter-patterns](dart-flutter-patterns/SKILL.md) — Dart/Flutter null safety, BLoC/Riverpod, GoRouter, Dio.
- [flutter-dart-code-review](flutter-dart-code-review/SKILL.md) — Flutter/Dart code review — widgets, state, null safety.
- [ios-icon-gen](ios-icon-gen/SKILL.md) — Generate iOS app icons at all required sizes.
- [swift-actor-persistence](swift-actor-persistence/SKILL.md) — Swift actor-based persistence (SwiftData, Core Data).
- [swift-concurrency-6-2](swift-concurrency-6-2/SKILL.md) — Swift 6.x concurrency, Sendable, actor isolation.
- [swift-protocol-di-testing](swift-protocol-di-testing/SKILL.md) — Swift protocol-based DI and testing.
- [swiftui-patterns](swiftui-patterns/SKILL.md) — SwiftUI @Observable, navigation, view composition.

### devops/

- [clickhouse-io](clickhouse-io/SKILL.md) — ClickHouse schema design, queries, partitioning, ingestion.
- [database-migrations](database-migrations/SKILL.md) — Safe, reversible database migration patterns (moved from backend/).
- [database-review](database-review/SKILL.md) — Database review checklist for schema, indexes, RLS, transactions (moved from backend/).
- [docker-patterns](docker-patterns/SKILL.md) — Docker Compose, multi-stage builds, networking, volumes, security.
- [flox-environments](flox-environments/SKILL.md) — Reproducible dev environments with Flox.
- [herdr](herdr/SKILL.md) — Control Herdr terminal multiplexer — panes, tabs, agent coordination.
- [kubernetes-patterns](kubernetes-patterns/SKILL.md) — K8s workload patterns, probes, RBAC, HPA.
- [mysql-patterns](mysql-patterns/SKILL.md) — MySQL/MariaDB schema, indexing, queries, transactions.
- [postgres-patterns](postgres-patterns/SKILL.md) — PostgreSQL schema, indexing, RLS, queries.
- [prisma-patterns](prisma-patterns/SKILL.md) — Prisma ORM patterns — schema, queries, transactions, pagination.
- [redis-patterns](redis-patterns/SKILL.md) — Redis data structures, caching, distributed locks, rate limiting.
- [shared-hosting-deployment](shared-hosting-deployment/SKILL.md) — Shared hosting/cPanel deployment workflow.
