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
