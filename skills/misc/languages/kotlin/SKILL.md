---
name: kotlin
description: Use only when writing or testing Kotlin code — idiomatic patterns, coroutines/Flow, JetBrains Exposed ORM, Ktor server, testing with Kotest/MockK, and Gradle Kotlin DSL builds.
---

# Kotlin

Adapted from ECC's `kotlin-patterns`, `kotlin-coroutines-flows`, `kotlin-exposed-patterns`, `kotlin-ktor-patterns`, `kotlin-testing` skills (MIT).

Idiomatic Kotlin patterns for building robust, efficient, maintainable applications.

## When to Use

- Writing new Kotlin code
- Working with coroutines, Flow, StateFlow, SharedFlow
- Database access with JetBrains Exposed ORM
- Building Ktor HTTP servers
- Testing with Kotest and MockK (TDD workflow)

## Sections

- [Development Patterns](REFERENCE.md#development-patterns) — null safety, immutability, sealed classes, extension functions, DSL builders, Gradle
- [Coroutines & Flows](REFERENCE.md#coroutines--flows) — structured concurrency, Flow operators, StateFlow, testing
- [Exposed ORM](REFERENCE.md#exposed-orm) — table definitions, DSL queries, transactions, DAO, migrations
- [Ktor Server](REFERENCE.md#ktor-server) — routes, plugins, auth, content negotiation, testing
- [Testing Patterns](REFERENCE.md#testing-patterns) — Kotest specs, MockK, coroutine testing, Kover coverage
