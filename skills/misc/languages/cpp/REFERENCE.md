# C++ — Reference

This reference is adapted from ECC's cpp-coding-standards and cpp-testing skills.

## Coding Standards

# C++ Coding Standards — Reference

## Cross-Cutting Principles
1. RAII everywhere (P.8, R.1, E.6, CP.20)
2. Immutability by default (P.10, Con.1-5, ES.25)
3. Type safety (P.4, I.4, ES.46-49, Enum.3)
4. Express intent (P.3, F.1, NL.1-2, T.10)
5. Minimize complexity (F.2-3, ES.5, Per.4-5)
6. Value semantics over pointer semantics (C.10, R.3-5, F.20, CP.31)

## Philosophy & Interfaces (P.*, I.*)

| Rule | Summary |
|------|---------|
| P.1 | Express ideas directly in code |
| P.3 | Express intent |
| P.4 | Statically type safe |
| P.5 | Prefer compile-time to run-time checking |
| P.8 | Don't leak resources |
| P.10 | Prefer immutable data |
| I.1 | Make interfaces explicit |
| I.2 | Avoid non-const globals |
| I.4 | Precisely and strongly typed interfaces |
| I.11 | Never transfer ownership via raw pointer |
| I.23 | Keep function arguments few |

## Functions (F.*)
- F.1: Package meaningful operations as named functions
- F.2: Single logical operation per function
- F.3: Keep functions short
- F.4: Use `constexpr` when possible
- F.6: Use `noexcept` if function must not throw
- F.8: Prefer pure functions
- F.16: Pass cheap types by value, others by `const&`
- F.20: Return values, not output parameters
- F.21: Return struct for multiple values
- F.43: Never return pointer/reference to local

### Anti-Patterns
- Returning `T&&` from functions (F.45)
- `va_arg` / C-style variadics (F.55)
- Capturing by reference in cross-thread lambdas (F.53)
- Returning `const T` (inhibits move) (F.49)

## Classes (C.*)
- C.2: `class` if invariant, `struct` if data varies independently
- C.9: Minimize member exposure
- C.20: Rule of Zero (let compiler generate)
- C.21: Rule of Five (handle all or none)
- C.35: Base destructor: public virtual or protected non-virtual
- C.41: Constructor creates fully initialized object
- C.46: Single-arg constructors `explicit`
- C.67: Polymorphic class suppresses public copy/move
- C.128: One of `virtual`/`override`/`final`

## Resource Management (R.*)
- R.1: RAII — bind resource to object lifetime
- R.3: Raw `T*` is non-owning
- R.5: Prefer scoped objects, don't heap-allocate unnecessarily
- R.10: Avoid `malloc`/`free`
- R.11: Avoid naked `new`/`delete`
- R.20: `unique_ptr` or `shared_ptr` for ownership
- R.21: Prefer `unique_ptr` over `shared_ptr`
- R.22: Use `make_shared`

## Expressions & Statements (ES.*)
- ES.5: Keep scopes small
- ES.20: Always initialize
- ES.23: Prefer `{}` initializer
- ES.25: `const`/`constexpr` by default
- ES.28: Lambdas for complex const init
- ES.45: No magic numbers, use symbolic constants
- ES.46: No narrowing conversions
- ES.47: Use `nullptr`, not `0`/`NULL`
- ES.48: Avoid casts
- ES.50: Don't cast away `const`

## Error Handling (E.*)
- E.1: Error-handling strategy early
- E.2: Throw to signal failure
- E.6: RAII prevents leaks
- E.12: `noexcept` when throwing impossible
- E.14: Custom exception types
- E.15: Throw by value, catch by reference
- E.16: Destructors/swap must never fail
- E.17: Don't catch every exception

## Immutability (Con.*)
- Con.1: Immutable by default
- Con.2: Member functions `const` by default
- Con.3: Pass by const reference
- Con.4: `const` for values that don't change
- Con.5: `constexpr` for compile-time values

## Concurrency (CP.*)
- CP.2: Avoid data races
- CP.3: Minimize writable shared data
- CP.4: Tasks over threads
- CP.8: No `volatile` for sync
- CP.20: RAII locks, never plain lock/unlock
- CP.21: `scoped_lock` for multiple mutexes
- CP.22: Don't call unknown code while holding lock
- CP.42: Always wait with a condition
- CP.44: Name your `lock_guard`s
- CP.100: No lock-free without expertise

## Templates (T.*)
- T.1: Templates to raise abstraction level
- T.10: Concepts for all template args
- T.11: Use standard concepts first
- T.43: `using` over `typedef`
- T.144: Don't specialize function templates

## Standard Library (SL.*) & Enums (Enum.*)
- SL.1: Use libraries
- SL.con.1: `array`/`vector` over C arrays
- SL.str.1: `string` to own, `string_view` to observe
- SL.io.50: `'\n'` not `endl`
- Enum.3: `enum class` over plain `enum`

## Source Files (SF.*, NL.*)
- SF.1: `.cpp` for code, `.h` for interfaces
- SF.7: No `using namespace` in headers at global scope
- SF.8: Include guards on all headers
- NL.10: `underscore_style` names

## Checklist
- [ ] No raw `new`/`delete` (R.11)
- [ ] Objects initialized at declaration (ES.20)
- [ ] `const`/`constexpr` by default (Con.1)
- [ ] Member functions `const` where possible (Con.2)
- [ ] `enum class` not plain `enum` (Enum.3)
- [ ] `nullptr` not `0`/`NULL` (ES.47)
- [ ] No narrowing conversions (ES.46)
- [ ] No C-style casts (ES.48)
- [ ] Single-arg constructors `explicit` (C.46)
- [ ] Rule of Zero or Five (C.20, C.21)
- [ ] Base destructors correct (C.35)
- [ ] Templates constrained (T.10)
- [ ] No `using namespace` in header scope (SF.7)
- [ ] Headers guarded (SF.8)
- [ ] Locks use RAII (CP.20)
- [ ] Exception types custom, thrown by value (E.14, E.15)
- [ ] `'\n'` not `endl` (SL.io.50)
- [ ] No magic numbers (ES.45)

## Testing Patterns

# C++ Testing — Reference

## TDD Workflow
RED → GREEN → REFACTOR loop:
1. Write failing test (RED)
2. Implement smallest change to pass (GREEN)
3. Clean up while tests green (REFACTOR)

## Code Examples

### Unit Test (gtest)
```cpp
#include <gtest/gtest.h>
int Add(int a, int b);
TEST(CalculatorTest, AddsTwoNumbers) { EXPECT_EQ(Add(2, 3), 5); }
```

### Fixture (gtest)
```cpp
class UserStoreTest : public ::testing::Test {
protected:
    void SetUp() override { store = std::make_unique<UserStore>(":memory:"); store->Seed({{"alice"}, {"bob"}}); }
    std::unique_ptr<UserStore> store;
};
TEST_F(UserStoreTest, FindsExistingUser) { auto user = store->Find("alice"); ASSERT_TRUE(user.has_value()); EXPECT_EQ(user->name, "alice"); }
```

### Mock (gmock)
```cpp
class MockNotifier : public Notifier { public: MOCK_METHOD(void, Send, (const std::string &message), (override)); };
TEST(ServiceTest, SendsNotifications) { MockNotifier notifier; Service service(notifier); EXPECT_CALL(notifier, Send("hello")).Times(1); service.Publish("hello"); }
```

### CMake/CTest Setup
```cmake
include(FetchContent)
set(GTEST_VERSION v1.17.0)
FetchContent_Declare(googletest URL https://github.com/google/googletest/archive/refs/tags/${GTEST_VERSION}.zip)
FetchContent_MakeAvailable(googletest)
enable_testing()
include(GoogleTest)
gtest_discover_tests(example_tests)
```

## Running Tests
```bash
ctest --test-dir build --output-on-failure
ctest --test-dir build -R ClampTest
./build/example_tests --gtest_filter=ClampTest.*
```

## Coverage
```cmake
option(ENABLE_COVERAGE "Enable coverage flags" OFF)
if(ENABLE_COVERAGE AND CMAKE_CXX_COMPILER_ID MATCHES "GNU")
  target_compile_options(example_tests PRIVATE --coverage)
  target_link_options(example_tests PRIVATE --coverage)
endif()
```

## Sanitizers (ASan/UBSan/TSan)
```cmake
option(ENABLE_ASAN "Enable AddressSanitizer" OFF)
if(ENABLE_ASAN)
  add_compile_options(-fsanitize=address -fno-omit-frame-pointer)
  add_link_options(-fsanitize=address)
endif()
```

## Best Practices
**DO**: Keep tests deterministic, use DI, ASSERT for preconditions, EXPECT for multiple checks, separate unit/integration, run sanitizers in CI.
**DON'T**: Depend on real time/network in unit tests, use sleep for sync, over-mock simple values.

## Common Pitfalls
- Fixed temp paths → unique per test
- Wall clock time → inject/fake clock
- Flaky concurrency → condition variables
- Hidden global state → reset in fixtures
- Missing sanitizer runs → add to CI

## Fuzzing
```cpp
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    std::string input(reinterpret_cast<const char *>(data), size);
    return 0;
}
```

## Alternatives
- Catch2: header-only, expressive matchers
- doctest: lightweight, minimal compile overhead
