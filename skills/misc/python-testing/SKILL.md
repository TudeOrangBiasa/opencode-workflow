---
name: python-testing
description: Use only when testing Python code: pytest fixtures/parametrization, unittest, mocking, coverage, and async testing patterns.
---

# Python Testing Patterns

Adapted from ECC's `python-testing` skill (MIT).

For full patterns, examples, configuration, and commands, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Writing new Python code (follow TDD: red, green, refactor)
- Designing test suites for Python projects
- Reviewing Python test coverage
- Setting up testing infrastructure

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Core Philosophy](REFERENCE.md#core-testing-philosophy) | TDD cycle, coverage requirements |
| [pytest Fundamentals](REFERENCE.md#pytest-fundamentals) | Basic structure, assertions |
| [Fixtures](REFERENCE.md#fixtures) | Setup/teardown, scopes, parametrization, conftest |
| [Parametrization](REFERENCE.md#parametrization) | @pytest.mark.parametrize patterns |
| [Markers](REFERENCE.md#markers-and-test-selection) | Custom markers, test filtering |
| [Mocking](REFERENCE.md#mocking-and-patching) | @patch, mock classes, properties |
| [Async Testing](REFERENCE.md#testing-async-code) | pytest-asyncio, async fixtures |
| [Exceptions & Side Effects](REFERENCE.md#testing-exceptions) | raises, temp files, tmp_path |
| [Organization](REFERENCE.md#test-organization) | Directory structure, test classes |
| [Patterns](REFERENCE.md#common-patterns) | API, DB, class method testing |
| [Configuration](REFERENCE.md#pytest-configuration) | pytest.ini, pyproject.toml |
| [Commands & Quick Ref](REFERENCE.md#running-tests) | CLI commands, quick reference table |
