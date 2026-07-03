# Rust Development Patterns — Reference

> Full patterns and examples. See SKILL.md for when-to-use.

## Core Principles

Ownership and borrowing: pass `&T` when you don't need ownership, take ownership only to store/consume, avoid unnecessary cloning. Use `Cow` for flexible ownership.

## Error Handling

`Result` and `?` — never `unwrap()` in production. `thiserror` for libraries (structured, typed), `anyhow` for applications (flexible). `Option` combinators over nested matching.

## Enums and Pattern Matching

Model states as enums (make illegal states unrepresentable). Exhaustive matching — no catch-all for business logic.

## Traits and Generics

Accept generics (`impl Read`), return concrete types. Trait objects (`Box<dyn Handler>`) for dynamic dispatch. Newtype pattern for type safety.

## Structs and Data Modeling

Builder pattern for complex construction.

## Iterators and Closures

Prefer iterator chains over manual loops. Use `collect()` with type annotation.

## Concurrency

`Arc<Mutex<T>>` for shared mutable state. Channels (`mpsc`) for message passing. Async with Tokio.

## Unsafe Code

Acceptable: FFI boundary with Safety comments, performance-critical path with proof. Not acceptable: bypassing borrow checker, convenience, transmuting unrelated types.

## Module System

Organize by domain, not by type. Expose minimally — `pub(crate)` for internal sharing, re-export public API from lib.rs.

## Tooling Integration

Essential commands: cargo build, check, clippy, fmt, test, audit, tree, bench.

## Idioms

Borrow don't clone, make illegal states unrepresentable, `?` over unwrap, parse don't validate, newtype, iterators over loops, `#[must_use]`, `Cow`, exhaustive matching, minimal `pub` surface.

## Anti-Patterns

unwrap() in production, clone() without understanding, `String` when `&str` suffices, `Box<dyn Error>` in libraries, ignoring must_use, blocking in async context.
