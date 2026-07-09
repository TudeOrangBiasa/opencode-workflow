# Rust — Reference

This reference is adapted from ECC's rust-patterns and rust-testing skills.

## Development Patterns

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

## Testing Patterns

# Rust Testing Patterns — Reference

> Full patterns, examples, and configuration. See SKILL.md for when-to-use.

## TDD Workflow for Rust

RED → Write failing test (use `todo!()` as placeholder)
GREEN → Write minimal code to pass
REFACTOR → Improve while keeping tests green

## Unit Tests

Module-level test organization with `#[cfg(test)]`, assertion macros (assert_eq!, assert_ne!, assert!, custom messages).

## Error and Panic Testing

Testing `Result` returns with `is_err()` / `matches!()`, testing panics with `#[should_panic]`.

## Integration Tests

File structure: `tests/` directory, each file is a separate test binary. `tests/common/` for shared utilities.

## Async Tests

With Tokio: `#[tokio::test]`, timeout handling.

## Test Organization Patterns

Parameterized tests with `rstest`, custom test helpers/fixtures.

## Property-Based Testing with proptest

Basic property tests (roundtrip, sort preserves length, sort produces ordered output). Custom strategies for valid inputs.

## Mocking with mockall

`#[automock]` for trait-based mocking, `expect_*` methods, `returning`, `times`, `with`.

## Doc Tests

Executable documentation with `/// # Examples` code blocks. `no_run` for code that compiles but shouldn't execute.

## Benchmarking with Criterion

Cargo.toml setup, bench function with `black_box`, `criterion_group!`, `criterion_main!`.

## Test Coverage

cargo-llvm-cov for coverage (summary, HTML, LCOV, fail-under-lines).

## Testing Commands

cargo test with flags: --nocapture, --lib, --test, --doc, --no-fail-fast, --ignored.

## Best Practices

DO: Write tests first, #[cfg(test)] modules, test behavior not implementation, descriptive names, assert_eq!, `?` in Result tests, keep tests independent.
DON'T: should_panic when is_err works, mock everything, ignore flaky tests, use sleep() in tests, skip error path testing.

## CI Integration

GitHub Actions with dtolnay/rust-toolchain, cargo fmt --check, cargo clippy, cargo test, cargo-llvm-cov.
