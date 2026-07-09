---
name: rust
description: Use only when writing or testing Rust code — ownership/borrowing, error handling (thiserror/anyhow), trait design, concurrency (Tokio), unit/integration/doc tests, rstest, mockall, property-based testing, and benchmarking.
---

# Rust

Adapted from ECC's `rust-patterns`, `rust-testing` skills (MIT).

Idiomatic Rust patterns for safe, performant, maintainable applications.

## When to Use

- Writing new Rust code
- Designing crate structure and module layout
- Error handling with thiserror/anyhow
- Concurrency with async/await and Tokio
- Testing: unit, integration, doc-tests, rstest, mockall, proptest, Criterion

## Sections

- [Development Patterns](REFERENCE.md#development-patterns) — ownership, error handling, enums, traits, concurrency, unsafe, modules
- [Testing Patterns](REFERENCE.md#testing-patterns) — TDD, unit, integration, async, rstest, proptest, mockall, Criterion, coverage
