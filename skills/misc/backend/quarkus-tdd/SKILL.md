---
name: quarkus-tdd
description: Use only when doing TDD for Quarkus services: JUnit 5, Mockito, REST Assured, Camel routes, JaCoCo coverage, and event-driven service testing.
---

# Quarkus TDD Workflow

Adapted from ECC's `quarkus-tdd` skill (MIT).

TDD guidance for Quarkus 3.x services with 80%+ coverage (unit + integration). Optimized for event-driven architectures with Apache Camel.

## When to Use

- New features or REST endpoints
- Bug fixes or refactors
- Adding data access logic, security rules, or reactive streams
- Testing Apache Camel routes and event handlers
- Testing event-driven services with RabbitMQ
- Testing conditional flow logic
- Validating CompletableFuture async operations
- Testing LogContext propagation

## Workflow

1. Write tests first (they should fail)
2. Implement minimal code to pass
3. Refactor with tests green
4. Enforce coverage with JaCoCo (80%+ target)

For full test code examples and patterns, see [REFERENCE.md](REFERENCE.md).

## When to Use

- New features or REST endpoints
- Bug fixes or refactors
- Adding data access logic, security rules, or reactive streams
- Testing Apache Camel routes and event handlers
- Testing event-driven services with RabbitMQ
- Testing conditional flow logic
- Validating CompletableFuture async operations
- Testing LogContext propagation

## Workflow

1. Write tests first (they should fail)
2. Implement minimal code to pass
3. Refactor with tests green
4. Enforce coverage with JaCoCo (80%+ target)

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Unit Tests](REFERENCE.md#unit-tests-with-nested-organization) | @Nested, Mockito patterns |
| [Camel Route Tests](REFERENCE.md#testing-camel-routes) | AdviceWith, MockEndpoint |
| [Event Service Tests](REFERENCE.md#testing-event-services) | Argument matchers, parameterized |
| [Async Tests](REFERENCE.md#testing-completablefuture) | CompletableFuture, LogContext |
| [API Tests](REFERENCE.md#resource-layer-tests-rest-assured) | REST Assured, @InjectMock |
| [Integration Tests](REFERENCE.md#integration-tests-with-real-database) | @QuarkusTest, TestProfile |
| [JaCoCo Coverage](REFERENCE.md#coverage-with-jacoco) | Maven config, thresholds |
| [Test Dependencies](REFERENCE.md#test-dependencies) | Maven POM declarations |
| [Best Practices](REFERENCE.md#best-practices) | Organization, assertions, testing tips |
