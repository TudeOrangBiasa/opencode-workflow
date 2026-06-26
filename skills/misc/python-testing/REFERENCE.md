# Python Testing Patterns — Reference

> Full patterns, examples, and configuration. See SKILL.md for when-to-use.

## Core Testing Philosophy

### Test-Driven Development (TDD)

1. **RED**: Write a failing test for the desired behavior
2. **GREEN**: Write minimal code to make the test pass
3. **REFACTOR**: Improve code while keeping tests green

### Coverage Requirements

- **Target**: 80%+ code coverage
- **Critical paths**: 100% coverage required
- Use `pytest --cov` to measure coverage

## pytest Fundamentals

Basic test structure, assertions (equality, truthiness, membership, exceptions).

## Fixtures

Basic fixture usage, setup/teardown with `yield`, fixture scopes (function/module/session), parameterized fixtures, multiple fixtures, autouse fixtures, conftest.py shared fixtures.

## Parametrization

Basic parametrization, multiple parameters, parametrize with IDs, parametrized fixtures.

## Markers and Test Selection

Custom markers (slow, integration, unit), running specific tests, configuring markers in pytest.ini.

## Mocking and Patching

Mocking functions with `@patch`, mocking return values, mocking exceptions, mocking context managers, using autospec, mock class instances, mock properties.

## Testing Async Code

Async tests with pytest-asyncio, async fixtures, mocking async functions.

## Testing Exceptions

Testing expected exceptions with `pytest.raises`, testing exception attributes.

## Testing Side Effects

Testing file operations with tempfile, tmp_path, tmpdir fixtures.

## Test Organization

Directory structure (unit/integration/e2e), test classes.

## Best Practices

DOs: follow TDD, test one thing, descriptive names, fixtures, mock externals, test edge cases, 80%+ coverage, fast tests.
DON'Ts: test implementation, complex conditionals, ignore failures, test third-party code, share state, catch exceptions in tests, use print, brittle tests.

## Common Patterns

Testing API endpoints (FastAPI/Flask), testing database operations, testing class methods.

## pytest Configuration

pytest.ini and pyproject.toml configuration examples, running tests commands.

## Quick Reference

| Pattern | Usage |
|---------|-------|
| `pytest.raises()` | Test expected exceptions |
| `@pytest.fixture()` | Create reusable test fixtures |
| `@pytest.mark.parametrize()` | Run tests with multiple inputs |
| `@pytest.mark.slow` | Mark slow tests |
| `@patch()` | Mock functions and classes |
| `tmp_path` fixture | Automatic temp directory |
| `pytest --cov` | Generate coverage report |
