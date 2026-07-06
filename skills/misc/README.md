# Misc

Specialist domain skills organized by technology area. Load only when the specific domain appears.

## When to use

You are working with a specific framework, database, language, platform, security pattern, or ML pipeline. Each skill in Misc targets one technology or class of technologies — load the skill when you touch that tech.

## Boundary with sibling buckets

**Misc** covers specialist skills grouped by domain (frontend, backend, languages, security, ML, mobile, devops, data). These are NOT daily drivers — you load them when a specific technology appears in the task. Use **Engineering** for pipeline skills used daily (planning, review, TDD, diagnose). Use **Productivity** for non-code workflow tools (documents, research, handoffs). If a skill is named after a framework (Angular, Django, Spring Boot) or a technology (PostgreSQL, Docker, PyTorch), it belongs in Misc.

## Structure

8 domain sub-directories:

- **frontend/** — UI frameworks, accessibility, testing, animation review
- **backend/** — Server frameworks, databases, auth, API patterns
- **languages/** — Language-specific conventions and testing (21 languages/tools)
- **security/** — Security review, EVM, AMM, bounty hunting
- **data/** — Data collection and scraping
- **ml/** — PyTorch and deep learning patterns
- **mobile/** — Android, iOS, Flutter, Compose Multiplatform
- **devops/** — Infrastructure, databases, deployment, containerization

### frontend/

- **accessibility** — Frontend accessibility patterns for forms, ARIA, keyboard nav, screen readers.
- **angular-developer** — Angular code generation, signals, forms, DI, routing, SSR, testing.
- **click-path-audit** — Trace button click paths for sequential-undo, race, stale-closure, dead-path bugs.
- **design-system** — Generate, audit, or review design systems for visual consistency.
- **nextjs-turbopack** — Next.js with Turbopack — config, loaders, migration.
- **nuxt4-patterns** — Nuxt 4 patterns — hydration safety, route rules, data fetching, lazy loading.
- **react-patterns** — React 18/19 patterns: hooks, RSC boundaries, Suspense, forms, state management.
- **react-performance** — React/Next.js performance: waterfalls, bundle size, re-renders, Web Vitals.
- **react-testing** — React testing with RTL, Vitest, MSW, and axe — behavior-focused tests.
- **review-animations** — Reviews animation and motion code against a high craft bar.
- **ui-to-vue** — Convert mockups/screenshots into Vue SFC components.
- **vite-patterns** — Vite build tool patterns — config, plugins, HMR, env vars, proxy, SSR.

### backend/

- **api-connector-builder** — Build API connectors matching the host repo's existing integration pattern.
- **api-design** — REST/API design checklist for endpoint naming, status codes, pagination, errors.
- **backend-patterns** — Backend architecture patterns — API design, repo/service layers, caching, error handling, auth.
- **database-migrations** — Safe, reversible database migration patterns.
- **database-review** — Database review checklist for schema, indexes, RLS, transactions, performance.
- **django-celery** — Django + Celery async task patterns and testing.
- **django-patterns** — Django architecture, DRF, ORM, caching, signals.
- **django-security** — Django security — auth, CSRF, XSS, SQL injection, headers.
- **django-tdd** — Django testing with pytest-django, factory_boy, TDD.
- **django-verification** — Django pre-deployment verification loop.
- **dotnet-patterns** — C#/.NET patterns, DI, EF Core, Minimal APIs.
- **error-handling** — Error-handling review checklist for typed errors, retries, safe messages.
- **fastapi-patterns** — FastAPI project structure, Pydantic v2, DI, auth, testing.
- **hexagonal-architecture** — Ports & Adapters architecture design and refactoring.
- **jpa-patterns** — JPA/Hibernate entity mapping, fetch strategies, caching.
- **laravel-patterns** — Laravel app structure, Eloquent, routing, form requests, API resources.
- **laravel-security** — Laravel security — auth, Eloquent safety, CSRF, XSS, file uploads.
- **laravel-verification** — Laravel verification loop — env checks, Pint, PHPStan, tests.
- **mcp-server-patterns** — Build MCP servers with Node/TS SDK — tools, resources, prompts.
- **modular-monolith-decisions** — Architecture decision framework for backend evolution (6-stage).
- **modular-monolith-patterns** — Modular monolith architecture — domain separation, ArchUnit enforcement.
- **nestjs-patterns** — NestJS modules, controllers, DTOs, guards, interceptors.
- **php-review** — PHP/Laravel review checklist for framework correctness, security.
- **quarkus-patterns** — Quarkus CDI, Panache, RESTEasy Reactive, Camel.
- **quarkus-security** — Quarkus security — JWT, @RolesAllowed, CORS, validation.
- **quarkus-tdd** — Quarkus TDD with REST Assured, Camel testing, JaCoCo.
- **quarkus-verification** — Quarkus pre-deployment verification loop.
- **springboot-patterns** — Spring Boot REST APIs, JPA, caching, validation.
- **springboot-security** — Spring Boot security — JWT, CORS, CSRF, secrets.
- **springboot-tdd** — Spring Boot TDD with JUnit 5, Mockito, MockMvc.
- **springboot-verification** — Spring Boot pre-deployment verification.

### languages/

- **bun-runtime** — Bun as JS/TS runtime, package manager, bundler, test runner.
- **coding-standards** — Baseline coding conventions (naming, readability, immutability).
- **cpp-coding-standards** — Modern C++17/20 conventions, RAII, smart pointers.
- **cpp-testing** — C++ testing with GoogleTest, CMake/CTest, sanitizers.
- **csharp-testing** — C# testing with xUnit, NUnit, Moq, FluentAssertions.
- **fsharp-testing** — F# testing with Expecto, FsCheck, NUnit.
- **golang-patterns** — Idiomatic Go patterns, error handling, concurrency.
- **golang-testing** — Go testing — table-driven tests, benchmarks, fuzzing.
- **java-coding-standards** — Java 17+ conventions for Spring Boot and Quarkus.
- **kotlin-patterns** — Idiomatic Kotlin patterns, null safety, sealed classes.
- **kotlin-ktor-patterns** — Ktor HTTP API patterns with Koin DI.
- **kotlin-coroutines-flows** — Kotlin coroutines and Flow structured concurrency.
- **kotlin-exposed-patterns** — JetBrains Exposed ORM patterns.
- **kotlin-testing** — Kotlin testing with Kotest, MockK, Kover.
- **perl-patterns** — Modern Perl conventions, Moose/Moo, DBI, testing.
- **perl-security** — Perl security — taint mode, SQL injection, XSS.
- **perl-testing** — Perl testing with Test::More, TAP, mocking.
- **python-patterns** — Idiomatic Python patterns, type hints, decorators.
- **python-testing** — Python testing with pytest, fixtures, mocking.
- **rust-patterns** — Idiomatic Rust patterns, ownership, error handling.
- **rust-testing** — Rust testing with rstest, mockall, proptest, coverage.

### security/

- **defi-amm-security** — Security checklist for Solidity AMM contracts.
- **evm-token-decimals** — ERC-20 decimal handling — runtime lookup, chain-aware caching.
- **nodejs-keccak256** — Ethereum Keccak-256 hashing in JS/TS.
- **prediction-market-risk-review** — Review prediction-market/trading workflows for compliance.
- **security-bounty-hunter** — Web app auditing for bug bounty programs.
- **security-review** — Security review checklist for auth, input handling, secrets, PII.

### data/

- **data-scraper-agent** — Build AI-powered data collection agents for public sources.

### ml/

- **pytorch-patterns** — PyTorch training loops, data loading, GPU optimization.

### mobile/

- **android-clean-architecture** — Clean Architecture for Android/KMP.
- **compose-multiplatform-patterns** — Compose Multiplatform state management, navigation, theming.
- **dart-flutter-patterns** — Dart/Flutter null safety, BLoC/Riverpod, GoRouter, Dio.
- **flutter-dart-code-review** — Flutter/Dart code review — widgets, state, null safety.
- **ios-icon-gen** — Generate iOS app icons at all required sizes.
- **swift-actor-persistence** — Swift actor-based persistence (SwiftData, Core Data).
- **swift-concurrency-6-2** — Swift 6.x concurrency, Sendable, actor isolation.
- **swift-protocol-di-testing** — Swift protocol-based DI and testing.
- **swiftui-patterns** — SwiftUI @Observable, navigation, view composition.

### devops/

- **clickhouse-io** — ClickHouse schema design, queries, partitioning, ingestion.
- **docker-patterns** — Docker Compose, multi-stage builds, networking, volumes, security.
- **flox-environments** — Reproducible dev environments with Flox.
- **kubernetes-patterns** — K8s workload patterns, probes, RBAC, HPA.
- **mysql-patterns** — MySQL/MariaDB schema, indexing, queries, transactions.
- **postgres-patterns** — PostgreSQL schema, indexing, RLS, queries.
- **prisma-patterns** — Prisma ORM patterns — schema, queries, transactions, pagination.
- **redis-patterns** — Redis data structures, caching, distributed locks, rate limiting.
- **shared-hosting-deployment** — Shared hosting/cPanel deployment workflow.
