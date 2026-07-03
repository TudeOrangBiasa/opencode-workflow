---
name: quarkus-patterns
description: Use only when building Quarkus applications: REST endpoints, CDI beans, Panache repositories, reactive streams, and application configuration.
---

# Quarkus Development Patterns

Adapted from ECC's `quarkus-patterns` skill (MIT).

Quarkus 3.x architecture and API patterns for cloud-native, event-driven services with Apache Camel.

## When to Activate

- Building REST APIs with JAX-RS or RESTEasy Reactive
- Structuring resource → service → repository layers
- Implementing event-driven patterns with Apache Camel and RabbitMQ
- Configuring Hibernate Panache, caching, or reactive streams
- Adding validation, exception mapping, or pagination
- Setting up profiles for dev/staging/production environments (YAML config)
- Custom logging with LogContext and Logback/Logstash encoder
- Working with CompletableFuture for async operations
- Implementing conditional flow processing
- Working with GraalVM native compilation

For full code examples, patterns, and configuration, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Building REST APIs with JAX-RS or RESTEasy Reactive
- Structuring resource → service → repository layers
- Implementing event-driven patterns with Apache Camel and RabbitMQ
- Configuring Hibernate Panache, caching, or reactive streams
- Adding validation, exception mapping, or pagination
- Setting up profiles for dev/staging/production environments (YAML config)
- Custom logging with LogContext and Logback/Logstash encoder
- Working with CompletableFuture for async operations
- Implementing conditional flow processing
- Working with GraalVM native compilation

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Service Layer](REFERENCE.md#service-layer-with-multiple-dependencies) | Injectable services with validation and events |
| [Logging Context](REFERENCE.md#custom-logging-context-pattern-logback) | LogContext + Logstash |
| [Event Service](REFERENCE.md#event-service-pattern) | Success/error event tracking |
| [Camel Messaging](REFERENCE.md#camel-message-publishing-rabbitmq) | RabbitMQ + direct routes |
| [REST API](REFERENCE.md#rest-api-structure) | JAX-RS resources |
| [Panache Repository](REFERENCE.md#repository-pattern-panache-repository) | Data access layer |
| [DTOs & Validation](REFERENCE.md#dtos-and-validation) | Records, Bean Validation |
| [Exception Mapping](REFERENCE.md#exception-mapping) | Error response providers |
| [Async](REFERENCE.md#completablefuture-async-operations) | CompletableFuture |
| [Caching & Config](REFERENCE.md#caching) | Cache annotations, YAML config |
| [Health Checks](REFERENCE.md#health-checks) | Liveness/Readiness |
| [Best Practices](REFERENCE.md#best-practices) | Architecture, testing, Quarkus-specific |
