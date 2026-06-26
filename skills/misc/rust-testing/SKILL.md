---
name: rust-testing
description: Use only when testing Rust code: unit tests, integration tests, doc-tests, property-based testing, mocking, and benchmark patterns.
---

# Rust Testing Patterns

Adapted from ECC's `rust-testing` skill (MIT).

For full patterns, examples, and configuration, see [REFERENCE.md](REFERENCE.md).

## When to Use

- Writing new Rust functions, methods, or traits
- Adding test coverage to existing code
- Creating benchmarks for performance-critical code
- Implementing property-based tests for input validation
- Following TDD workflow in Rust projects

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [TDD Workflow](REFERENCE.md#tdd-workflow-for-rust) | RED-GREEN-REFACTOR cycle |
| [Unit Tests](REFERENCE.md#unit-tests) | Module-level tests, assertions |
| [Error/Panic Tests](REFERENCE.md#error-and-panic-testing) | Result returns, should_panic |
| [Integration Tests](REFERENCE.md#integration-tests) | tests/ directory structure |
| [Async Tests](REFERENCE.md#async-tests) | tokio::test, timeouts |
| [rstest](REFERENCE.md#test-organization-patterns) | Parameterized tests, fixtures |
| [proptest](REFERENCE.md#property-based-testing-with-proptest) | Property-based, custom strategies |
| [mockall](REFERENCE.md#mocking-with-mockall) | Trait-based mocking |
| [Doc Tests](REFERENCE.md#doc-tests) | Executable documentation |
| [Criterion](REFERENCE.md#benchmarking-with-criterion) | Performance benchmarks |
| [Coverage](REFERENCE.md#test-coverage) | cargo-llvm-cov, targets |
| [Commands](REFERENCE.md#testing-commands) | cargo test flags |

