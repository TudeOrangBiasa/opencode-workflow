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
