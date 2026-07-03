---
name: kotlin-patterns
description: Use only when writing Kotlin code: idiomatic Kotlin, coroutines, flows, sealed classes, extension functions, and project conventions.
---

# Kotlin Development Patterns

Adapted from ECC's `kotlin-patterns` skill (MIT).

Idiomatic Kotlin patterns and best practices for building robust, efficient, and maintainable applications.

## When to Use

- Writing new Kotlin code
- Reviewing Kotlin code
- Refactoring existing Kotlin code
- Designing Kotlin modules or libraries
- Configuring Gradle Kotlin DSL builds

## How It Works

This skill enforces idiomatic Kotlin conventions across seven key areas: null safety using the type system and safe-call operators, immutability via `val` and `copy()` on data classes, sealed classes and interfaces for exhaustive type hierarchies, structured concurrency with coroutines and `Flow`, extension functions for adding behaviour without inheritance, type-safe DSL builders using `@DslMarker` and lambda receivers, and Gradle Kotlin DSL for build configuration.


See [REFERENCE.md](REFERENCE.md) for detailed content: examples, patterns, anti-patterns, and reference tables.
