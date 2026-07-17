# Quarkus — Reference

This reference is adapted from ECC's quarkus-patterns, quarkus-security, quarkus-tdd, and quarkus-verification skills.


## Architecture & Development Patterns

# Quarkus Development Patterns — Reference

> Full code examples and configuration. See SKILL.md for when-to-use.

## Service Layer with Multiple Dependencies

```java
@Slf4j
@ApplicationScoped
@RequiredArgsConstructor
public class OrderProcessingService {
    private final OrderValidator orderValidator;
    private final EventService eventService;
    private final OrderRepository orderRepository;
    private final FulfillmentPublisher fulfillmentPublisher;
    private final AuditPublisher auditPublisher;

    @Transactional
    public OrderReceipt process(CreateOrderCommand command) {
        ValidationResult validation = orderValidator.validate(command);
        if (!validation.valid()) {
            eventService.createErrorEvent(command, "ORDER_REJECTED", validation.message());
            throw new WebApplicationException(validation.message(), Response.Status.BAD_REQUEST);
        }
        Order order = Order.from(command);
        orderRepository.persist(order);
        OrderReceipt receipt = OrderReceipt.from(order);
        fulfillmentPublisher.publishAsync(receipt);
        auditPublisher.publish("ORDER_ACCEPTED", receipt);
        eventService.createSuccessEvent(receipt, "ORDER_ACCEPTED");
        log.info("Processed order {}", order.id);
        return receipt;
    }
}
```

**Key Patterns:** `@RequiredArgsConstructor`, `@Slf4j`, `@Transactional`, validate before persist/publish, event tracking.

## Custom Logging Context Pattern (Logback)

Java code with LogContext propagation and LogstashEncoder configuration.

## Event Service Pattern

Success/error event creation with JSON serialization and repository persistence.

## Camel Message Publishing (RabbitMQ)

ProducerTemplate + RouteBuilder for RabbitMQ integration.

## Camel Direct Routes (In-Memory)

Document processing pipeline with error handling, conditional routing.

## Camel File Processing

File monitoring with move/moveFailed strategies.

## REST API Structure

JAX-RS resource with GET/POST endpoints, pagination, validation, URI creation.

## Repository Pattern (Panache Repository)

findByStatus, findByReferenceNumber, countByStatusAndDate.

## Service Layer with Transactions

Service methods with `@Transactional`, event publishing.

## DTOs and Validation

Record-based DTOs with Bean Validation annotations.

## Exception Mapping

ValidationExceptionMapper, GenericExceptionMapper with structured error responses.

## CompletableFuture Async Operations

Async S3 upload with LogContext propagation.

## Caching

@CacheResult, @CacheInvalidate, @CacheInvalidateAll.

## Configuration as YAML

Profile-aware application.yml for dev/test/prod with RabbitMQ and datasource config.

## Health Checks

DatabaseHealthCheck (Readiness), CamelHealthCheck (Liveness).

## Dependencies (Maven)

Quarkus BOM, Camel BOM, Lombok, Logback/Logstash dependency declarations.

## Best Practices

Architecture, event-driven, logging, async, configuration, validation, transactions, testing, Quarkus-specific.

## Security

# Quarkus Security Review — Reference

> Full code examples and patterns. See SKILL.md for when-to-use.

## Authentication

JWT authentication with JsonWebToken, SecurityIdentity injection. OIDC configuration with auth-server-url and client-id.

Custom authentication filter with `ContainerRequestFilter`.

## Authorization

Role-based access control with `@RolesAllowed`. Programmatic security with `SecurityIdentity`.

## Input Validation

Bean Validation on DTOs (`@NotBlank`, `@Email`, `@Size`, `@Pattern`). Custom validators with `ConstraintValidator`.

## SQL Injection Prevention

Panache parameterized queries (`?1`, `:email`), native queries with `setParameter`.

## Password Hashing

BCrypt hashing with `BcryptUtil.bcryptHash()`, service-layer authentication.

## CORS Configuration

application.properties with origins, methods, headers, max-age.

## Secrets Management

Environment variables, Vault integration. No secrets in application.properties.

## Rate Limiting

Bucket4j rate limiting with `ContainerRequestFilter`. Remote address identification (trusted proxy setup).

## Security Headers

X-Frame-Options, X-Content-Type-Options, HSTS, CSP headers via `ContainerResponseFilter`.

## Audit Logging

AuditService for tracking resource access with user identity.

## Dependency Security Scanning

OWASP Dependency Check, Gradle equivalent.

## Best Practices

HTTPS, JWT/OIDC, @RolesAllowed, Bean Validation, BCrypt, parameterized queries, security headers, rate limiting, audit logging.

## TDD Workflow

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

## Verification Loop

# Quarkus Verification Loop — Reference

> Full verification phases. See SKILL.md for when-to-use.

## Phase 1: Build

```bash
mvn clean verify -DskipTests
./gradlew clean assemble -x test
```

## Phase 2: Static Analysis

Checkstyle, PMD, SpotBugs, SonarQube commands and common issues to address.

## Phase 3: Tests + Coverage

Unit tests with Mockito, integration tests with Testcontainers, API tests with REST Assured. JaCoCo coverage (80%+ lines, 70%+ branches).

## Phase 4: Security Scanning

OWASP Dependency Check, Quarkus audit, OWASP ZAP API scan. Common security checks checklist.

## Phase 5: Native Compilation

GraalVM native image build, troubleshooting reflection/resources/JNI issues.

## Phase 6: Performance Testing

K6 load testing script, metrics to monitor (response time, throughput, error rate, memory, CPU).

## Phase 7: Health Checks

Liveness, readiness, metrics endpoints with expected JSON response.

## Phase 8: Container Image Build

Container build with quarkus-container-image, Trivy/Grype security scan.

## Phase 9: Configuration Validation

quarkus:info, environment-specific checks.

## Phase 10: Documentation Review

OpenAPI/Swagger, README, API docs, migration guide.

## Verification Checklist

Code quality, testing, security, deployment, native image checklists.

## Automated Verification Script

Complete bash script running all phases.

## CI/CD Integration

GitHub Actions workflow example with build, test, security scan, coverage upload.

## Best Practices

Run before every PR, automate in CI, fix immediately, keep 80%+ coverage.
