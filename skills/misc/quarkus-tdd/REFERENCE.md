# Quarkus TDD Workflow — Reference

> Full test code examples. See SKILL.md for when-to-use.

## Unit Tests with @Nested Organization

Comprehensive unit test patterns using MockitoExtension, @Nested, @DisplayName, givenX_whenY_thenZ naming.

### Key Testing Patterns

1. @Nested Classes: Group tests by method being tested
2. @DisplayName: Readable test descriptions
3. AAA Pattern: // ARRANGE, // ACT, // ASSERT
4. @BeforeEach: Common test data setup
5. assertDoesNotThrow, assertThrows
6. Verify interactions with Mockito verify()
7. never() for error scenarios

## Testing Camel Routes

Full QuarkusTest examples with AdviceWith, MockEndpoint, route mocking for business-rules-publisher and document-processing routes.

## Testing Event Services

EventService unit tests with Mockito, argThat for complex argument matching, @ParameterizedTest for invalid inputs.

## Testing CompletableFuture

FileStorageService async tests with synchronous execution simulation, LogContext propagation verification.

## Resource Layer Tests (REST Assured)

DocumentResource API tests with given()/when()/then() REST Assured fluent API.

## Integration Tests with Real Database

@QuarkusTest, @TestProfile, @Transactional for end-to-end API tests.

## Coverage with JaCoCo

Complete Maven configuration with 80% line coverage, 70% branch coverage thresholds.

## Test Dependencies

quarkus-junit5, mockito-core, assertj-core, rest-assured, camel-quarkus-junit5 Maven declarations.

## Best Practices

Test organization, structure, coverage targets, assertions, integration, event-driven, Camel route, async, performance, Quarkus-specific, verification.
