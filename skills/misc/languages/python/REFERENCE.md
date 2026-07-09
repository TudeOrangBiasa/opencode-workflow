# Python — Reference

This reference is adapted from ECC's python-patterns and python-testing skills.

## Development Patterns

# Python Development Patterns — Reference

> Full patterns and examples. See SKILL.md for when-to-use.

## Core Principles

### 1. Readability Counts

```python
# Good: Clear and readable
def get_active_users(users: list[User]) -> list[User]:
    """Return only active users from the provided list."""
    return [user for user in users if user.is_active]
```

### 2. Explicit is Better Than Implicit

```python
# Good: Explicit configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
```

### 3. EAFP

```python
def get_value(dictionary: dict, key: str, default_value: Any = None) -> Any:
    try:
        return dictionary[key]
    except KeyError:
        return default_value
```

## Type Hints

See SKILL.md for basic type annotations, modern type hints (Python 3.9+), type aliases/TypeVar, and protocol-based duck typing — full examples in the original skill file.

## Error Handling Patterns

- Specific exception handling with chain
- Custom exception hierarchies

## Context Managers

- Resource management with `with`
- Custom context managers via `@contextmanager`
- Context manager classes

## Comprehensions and Generators

- List comprehensions for simple transformations
- Generator expressions for lazy evaluation
- Generator functions for large files

## Data Classes and Named Tuples

- `@dataclass` with default factories
- `__post_init__` validation
- `NamedTuple` for immutable data

## Decorators

- Function decorators with `@functools.wraps`
- Parameterized decorators
- Class-based decorators

## Concurrency Patterns

- Threading for I/O-bound tasks
- Multiprocessing for CPU-bound tasks
- Async/await for concurrent I/O

## Package Organization

Standard project layout under `src/`, import conventions, `__init__.py` exports.

## Memory and Performance

- `__slots__` for memory efficiency
- Generators for large data
- Avoid string concatenation in loops

## Python Tooling Integration

Essential commands (black, ruff, mypy, pytest, bandit) and `pyproject.toml` configuration.

## Quick Reference: Python Idioms

| Idiom | Description |
|-------|-------------|
| EAFP | Easier to Ask Forgiveness than Permission |
| Context managers | Use `with` for resource management |
| List comprehensions | For simple transformations |
| Generators | For lazy evaluation and large datasets |
| Type hints | Annotate function signatures |
| Dataclasses | For data containers with auto-generated methods |
| `__slots__` | For memory optimization |
| f-strings | For string formatting (Python 3.6+) |
| `pathlib.Path` | For path operations (Python 3.4+) |
| `enumerate` | For index-element pairs in loops |

## Anti-Patterns to Avoid

```python
# Bad: Mutable default arguments
def append_to(item, items=[]):  # Use None instead

# Bad: Checking type with type()
if type(obj) == list:  # Use isinstance

# Bad: Comparing to None with ==
if value == None:  # Use is

# Bad: from module import *
# Bad: Bare except
# Bad: String concatenation in loops
```

## Testing Patterns

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
