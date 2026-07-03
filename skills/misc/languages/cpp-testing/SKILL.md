---
name: cpp-testing
description: Use only when writing/updating/fixing C++ tests, configuring GoogleTest/CTest, diagnosing failing tests, or adding coverage/sanitizers.
---

# C++ Testing (Agent Skill)

Adapted from ECC's `cpp-testing` skill (MIT).

Agent-focused testing workflow for modern C++ (C++17/20) using GoogleTest/GoogleMock with CMake/CTest.

## When to Use

- Writing new C++ tests or fixing existing tests
- Designing unit/integration test coverage for C++ components
- Adding test coverage, CI gating, or regression protection
- Configuring CMake/CTest workflows for consistent execution
- Investigating test failures or flaky behavior
- Enabling sanitizers for memory/race diagnostics

### When NOT to Use

- Implementing new product features without test changes
- Large-scale refactors unrelated to test coverage or failures
- Performance tuning without test regressions to validate
- Non-C++ projects or non-test tasks

