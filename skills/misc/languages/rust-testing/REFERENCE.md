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
