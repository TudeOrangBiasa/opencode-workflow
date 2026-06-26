---
name: springboot-patterns
description: Use only when building Spring Boot services — REST APIs, layered services, JPA repositories, caching, async processing, validation, and logging.
---

# Spring Boot Development Patterns

Adapted from ECC's `springboot-patterns` skill (MIT).

Spring Boot architecture and API patterns for scalable, production-grade services.

## When to Activate

- Building REST APIs with Spring MVC or WebFlux
- Structuring controller → service → repository layers
- Configuring Spring Data JPA, caching, or async processing
- Adding validation, exception handling, or pagination
- Setting up profiles for dev/staging/production environments
- Implementing event-driven patterns with Spring Events or Kafka

For full code examples and patterns, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Building REST APIs with Spring MVC or WebFlux
- Structuring controller → service → repository layers
- Configuring Spring Data JPA, caching, or async processing
- Adding validation, exception handling, or pagination
- Setting up profiles for dev/staging/production environments
- Implementing event-driven patterns with Spring Events or Kafka

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [REST API](REFERENCE.md#rest-api-structure) | Controller patterns, pagination |
| [Repository](REFERENCE.md#repository-pattern-spring-data-jpa) | JPA query methods |
| [Service Layer](REFERENCE.md#service-layer-with-transactions) | @Transactional, DI |
| [DTOs & Validation](REFERENCE.md#dtos-and-validation) | Records, Bean Validation |
| [Exception Handling](REFERENCE.md#exception-handling) | @ControllerAdvice, RFC 7807 |
| [Caching & Async](REFERENCE.md#caching) | @Cacheable, @Async |
| [Logging & Filters](REFERENCE.md#logging-slf4j) | Structured logging, OncePerRequestFilter |
| [Rate Limiting](REFERENCE.md#rate-limiting-filter--bucket4j) | Bucket4j, trusted proxy notes |
| [Production Defaults](REFERENCE.md#production-defaults) | DI, pool tuning, null-safety |
