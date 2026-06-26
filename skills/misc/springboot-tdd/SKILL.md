---
name: springboot-tdd
description: Use only when doing TDD for Spring Boot — JUnit 5, Mockito, MockMvc, Testcontainers, JaCoCo, and 80%+ coverage targets.
---

# Spring Boot TDD Workflow

Adapted from ECC's `springboot-tdd` skill (MIT).

For full test examples and configuration, see [REFERENCE.md](REFERENCE.md).

## When to Use

- New features or endpoints
- Bug fixes or refactors
- Adding data access logic or security rules

## Workflow

1. Write tests first (they should fail)
2. Implement minimal code to pass
3. Refactor with tests green
4. Enforce coverage (JaCoCo)

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Unit Tests](REFERENCE.md#unit-tests-junit-5--mockito) | JUnit 5 + Mockito |
| [Web Layer](REFERENCE.md#web-layer-tests-mockmvc) | MockMvc |
| [Integration](REFERENCE.md#integration-tests-springboottest) | SpringBootTest |
| [Persistence](REFERENCE.md#persistence-tests-datajpatest) | DataJpaTest |
| [Testcontainers](REFERENCE.md#testcontainers) | Containers, @DynamicPropertySource |
| [JaCoCo](REFERENCE.md#coverage-jacoco) | Maven coverage config |
| [Assertions & Builders](REFERENCE.md#assertions) | AssertJ, jsonPath, test data builders |
| [CI Commands](REFERENCE.md#ci-commands) | Maven, Gradle |
