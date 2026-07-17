---
name: springboot
description: Use only when building, securing, testing, or verifying Spring Boot services — REST APIs, layered architecture, JPA, caching, async, Spring Security, JWT, CORS, TDD with JUnit 5/Mockito/Testcontainers, and pre-deployment verification.
---

# Spring Boot

Adapted from ECC's `springboot-patterns`, `springboot-security`, `springboot-tdd`, `springboot-verification` skills (MIT).

Production-grade Spring Boot patterns for scalable, secure, testable services.

## When to Use

- Building REST APIs with Spring MVC or WebFlux
- Structuring controller → service → repository layers
- Spring Data JPA, caching, async, validation, exception handling
- Security: JWT, OAuth2, CORS, CSRF, rate limiting, secrets
- TDD: JUnit 5, Mockito, MockMvc, Testcontainers, JaCoCo
- Pre-deployment verification: build, static analysis, tests, security scan

## Sections

- [Architecture & Patterns](REFERENCE.md#architecture--development-patterns) — REST API, repository, service layer, DTOs, caching, async, logging
- [Security](REFERENCE.md#security) — auth, authorization, CORS, CSRF, secrets, rate limiting, headers
- [TDD Workflow](REFERENCE.md#tdd-workflow) — unit, web, integration, persistence, Testcontainers, JaCoCo
- [Verification Loop](REFERENCE.md#verification-loop) — 6-phase pre-deployment pipeline
