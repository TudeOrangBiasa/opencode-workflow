# Spring Boot TDD — Reference

> Full test examples. See SKILL.md for when-to-use.

## Unit Tests (JUnit 5 + Mockito)

@ExtendWith(MockitoExtension.class), @Mock, @InjectMocks. Arrange-Act-Assert. @ParameterizedTest for variants. Avoid partial mocks.

## Web Layer Tests (MockMvc)

@WebMvcTest, @MockBean, MockMvc with jsonPath assertions.

## Integration Tests (SpringBootTest)

@SpringBootTest, @AutoConfigureMockMvc, @ActiveProfiles("test").

## Persistence Tests (DataJpaTest)

@DataJpaTest with @AutoConfigureTestDatabase and TestContainersConfig.

## Testcontainers

Reusable containers for Postgres/Redis. @DynamicPropertySource for auto-configuration.

## Coverage (JaCoCo)

Maven plugin with prepare-agent and report goals. 80%+ target.

## Assertions

Prefer AssertJ (assertThat). jsonPath for JSON. assertThatThrownBy for exceptions.

## Test Data Builders

Fluent builder classes for complex test data.

## CI Commands

mvn -T 4 test, mvn verify, ./gradlew test jacocoTestReport.
