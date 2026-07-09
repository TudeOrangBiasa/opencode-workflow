# Spring Boot — Reference

This reference is adapted from ECC's springboot-patterns, springboot-security, springboot-tdd, and springboot-verification skills.


## Architecture & Development Patterns

# Spring Boot Patterns — Reference

> Full code examples. See SKILL.md for when-to-use.

## REST API Structure

Controller with @RestController, @RequestMapping, pagination with PageRequest, validation with @Valid, HATEOAS URI creation.

## Repository Pattern (Spring Data JPA)

Interface-based repositories with @Query, parameterized queries, derived query methods.

## Service Layer with Transactions

@Service with @Transactional, constructor injection (preferred over field injection).

## DTOs and Validation

Records with Bean Validation (@NotBlank, @Size, @Email, @FutureOrPresent). Use response DTOs, avoid leaking entities.

## Exception Handling

@ControllerAdvice with @ExceptionHandler for validation, access denied, generic errors. Spring Boot 3+ RFC 7807 support.

## Caching

@EnableCaching, @Cacheable, @CacheEvict patterns.

## Async Processing

@EnableAsync, @Async for fire-and-forget operations.

## Logging (SLF4J)

Structured logging with placeholders ({}) not string concatenation. Log event names for searchability.

## Middleware / Filters

OncePerRequestFilter for request logging, rate limiting.

## Pagination and Sorting

PageRequest.of(page, size, Sort.by(...)).

## Error-Resilient External Calls

Exponential backoff retry with configurable max attempts.

## Rate Limiting (Bucket4j)

Security note on X-Forwarded-For and trusted proxy configuration. ForwardedHeaderFilter registration.

## Background Jobs

@Scheduled or queue integration (Kafka, SQS, RabbitMQ). Idempotent handlers.

## Observability

Micrometer + Prometheus/OTel for metrics, Micrometer Tracing for distributed tracing.

## Production Defaults

Constructor injection, RFC 7807 errors (spring.mvc.problemdetails.enabled=true), HikariCP tuning, @Transactional(readOnly = true) for queries, null-safety with @NonNull and Optional.

## Security

# Spring Boot Security — Reference

> Full code examples. See SKILL.md for when-to-use.

## Authentication

JWT auth filter with OncePerRequestFilter, stateless tokens, httpOnly/Secure/SameSite cookies.

## Authorization

@EnableMethodSecurity, @PreAuthorize with role checks or custom @authz beans. Deny by default.

## Input Validation

@Valid + Bean Validation constraints (@NotBlank, @Email, @Size). Custom validators. HTML sanitization.

## SQL Injection Prevention

Spring Data derived queries (auto-parameterized), @Query with :param bindings. Never string concatenation.

## Password Encoding

BCryptPasswordEncoder (cost factor 12) or Argon2. Never plaintext.

## CSRF Protection

Keep enabled for browser session apps, disable for stateless bearer token APIs.

## Secrets Management

Environment variables, Spring Cloud Vault. No secrets in source.

## Security Headers

CSP, X-Frame-Options, XSS protection via http.headers() DSL.

## CORS Configuration

CorsConfigurationSource bean, restrict origins, never * in production.

## Rate Limiting

Bucket4j filter, use getRemoteAddr() with proper ForwardedHeaderFilter setup for trusted proxies.

## Dependency Security

OWASP Dependency Check / Snyk in CI.

## Logging and PII

Never log secrets, tokens, passwords. Redact sensitive fields in structured JSON logs.

## File Uploads

Validate size, content type, extension. Store outside web root.

## Checklist Before Release

Auth tokens validated, authorization guards, input validation, no string-concatenated SQL, CSRF correct, secrets externalized, security headers, rate limiting, dependencies scanned, logs clean.

## TDD Workflow

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

## Verification Loop

# Spring Boot Verification — Reference

> Full verification phases. See SKILL.md for when-to-use.

## Phase 1: Build

mvn -T 4 clean verify -DskipTests or ./gradlew clean assemble -x test.

## Phase 2: Static Analysis

spotbugs:check, pmd:check, checkstyle:check.

## Phase 3: Tests + Coverage

mvn -T 4 test, jacoco:report (verify 80%+). Unit, integration (Testcontainers), and API (MockMvc) test examples.

## Phase 4: Security Scan

OWASP Dependency Check, secrets grep in source/git history. Common security finding checks.

## Phase 5: Lint/Format (optional)

spotless:apply.

## Phase 6: Diff Review

git diff --stat + checklist: no debug logs, meaningful errors, transactions present, config changes documented.

## Output Template

VERIFICATION REPORT with Build/Static/Tests/Security/Diff pass/fail status and issues list.

## Continuous Mode

Re-run phases every 30-60 min. Keep short loop: mvn -T 4 test + spotbugs.
