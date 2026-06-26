---
name: rust-patterns
description: Use only when writing Rust code: ownership/borrowing patterns, error handling, trait design, concurrency, and idiomatic Rust conventions.
---

# Rust Development Patterns

Adapted from ECC's `rust-patterns` skill (MIT).

Idiomatic Rust patterns and best practices for building safe, performant, and maintainable applications.

## When to Use

- Writing new Rust code
- Reviewing Rust code
- Refactoring existing Rust code
- Designing crate structure and module layout

## How It Works

This skill enforces idiomatic Rust conventions across six key areas: ownership and borrowing to prevent data races at compile time, `Result`/`?` error propagation with `thiserror` for libraries and `anyhow` for applications, enums and exhaustive pattern matching to make illegal states unrepresentable, traits and generics for zero-cost abstraction, safe concurrency via `Arc<Mutex<T>>`, channels, and async/await, and minimal `pub` surfaces organized by domain.

For full patterns, examples, and anti-patterns, see [REFERENCE.md](REFERENCE.md).

## When to Use

- Writing new Rust code
- Reviewing Rust code
- Refactoring existing Rust code
- Designing crate structure and module layout

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Core Principles](REFERENCE.md#core-principles) | Ownership, borrowing, Cow |
| [Error Handling](REFERENCE.md#error-handling) | Result, thiserror, anyhow, combinators |
| [Enums & Pattern Matching](REFERENCE.md#enums-and-pattern-matching) | State modeling, exhaustive matching |
| [Traits & Generics](REFERENCE.md#traits-and-generics) | Generic params, trait objects, newtype |
| [Builder Pattern](REFERENCE.md#structs-and-data-modeling) | Complex construction |
| [Iterators](REFERENCE.md#iterators-and-closures) | Chains, collect, closures |
| [Concurrency](REFERENCE.md#concurrency) | Arc<Mutex>, channels, async Tokio |
| [Unsafe Code](REFERENCE.md#unsafe-code) | When acceptable, when not |
| [Module System](REFERENCE.md#module-system-and-crate-structure) | Domain organization, visibility |
| [Tooling](REFERENCE.md#tooling-integration) | cargo commands, CI |
| [Idioms & Anti-Patterns](REFERENCE.md#quick-reference-rust-idioms) | Reference table, common mistakes |
