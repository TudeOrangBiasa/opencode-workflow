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

- **accessibility** — Frontend accessibility patterns for forms, ARIA, keyboard nav, screen readers.
- **angular-developer** — Angular code generation, signals, forms, DI, routing, SSR, testing.
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
- **django** — Django: architecture, DRF, Celery, security, TDD, verification (merged from 5 skills).
- **dotnet-patterns** — C#/.NET patterns, DI, EF Core, Minimal APIs.
- **fastapi-patterns** — FastAPI project structure, Pydantic v2, DI, auth, testing.
- **hexagonal-architecture** — Ports & Adapters architecture design and refactoring.
- **jpa-patterns** — JPA/Hibernate entity mapping, fetch strategies, caching.
- **laravel** — Laravel: architecture, Eloquent, security, verification (merged from 3 skills).
- **mcp-server-patterns** — Build MCP servers with Node/TS SDK — tools, resources, prompts.
- **modular-monolith-decisions** — Architecture decision framework for backend evolution (6-stage).
- **modular-monolith-patterns** — Modular monolith architecture — domain separation, ArchUnit enforcement.
- **nestjs-patterns** — NestJS modules, controllers, DTOs, guards, interceptors.
- **php-review** — PHP/Laravel review checklist for framework correctness, security.
- **quarkus** — Quarkus: CDI, Panache, Camel, security, TDD, verification (merged from 4 skills).
- **springboot** — Spring Boot: REST APIs, JPA, security, TDD, verification (merged from 4 skills).

### languages/

- **bun-runtime** — Bun as JS/TS runtime, package manager, bundler, test runner.
- **coding-standards** — Baseline coding conventions (naming, readability, immutability).
- **cpp** — C++: modern idioms, RAII, smart pointers, GoogleTest, CMake/CTest (merged from 2 skills).
- **csharp-testing** — C# testing with xUnit, NUnit, Moq, FluentAssertions.
- **fsharp-testing** — F# testing with Expecto, FsCheck, NUnit.
- **golang** — Go: idioms, concurrency, error handling, testing (merged from 2 skills).
- **java-coding-standards** — Java 17+ conventions for Spring Boot and Quarkus.
- **kotlin** — Kotlin: idioms, coroutines, Exposed ORM, Ktor, testing (merged from 5 skills).
- **perl** — Perl: modern conventions, security, testing (merged from 3 skills).
- **python** — Python: idioms, type hints, async, pytest (merged from 2 skills).
- **rust** — Rust: ownership, error handling, Tokio, testing (merged from 2 skills).

### security/

- **defi-amm-security** — Security checklist for Solidity AMM contracts.
- **evm-token-decimals** — ERC-20 decimal handling — runtime lookup, chain-aware caching.
- **nodejs-keccak256** — Ethereum Keccak-256 hashing in JS/TS.
- **prediction-market-risk-review** — Review prediction-market/trading workflows for compliance.
- **security-bounty-hunter** — Web app auditing for bug bounty programs.

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
- **database-migrations** — Safe, reversible database migration patterns (moved from backend/).
- **database-review** — Database review checklist for schema, indexes, RLS, transactions (moved from backend/).
- **docker-patterns** — Docker Compose, multi-stage builds, networking, volumes, security.
- **flox-environments** — Reproducible dev environments with Flox.
- **kubernetes-patterns** — K8s workload patterns, probes, RBAC, HPA.
- **mysql-patterns** — MySQL/MariaDB schema, indexing, queries, transactions.
- **postgres-patterns** — PostgreSQL schema, indexing, RLS, queries.
- **prisma-patterns** — Prisma ORM patterns — schema, queries, transactions, pagination.
- **redis-patterns** — Redis data structures, caching, distributed locks, rate limiting.
- **shared-hosting-deployment** — Shared hosting/cPanel deployment workflow.
