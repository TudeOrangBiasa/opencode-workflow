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
