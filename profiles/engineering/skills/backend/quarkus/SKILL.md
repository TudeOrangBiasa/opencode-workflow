---
name: quarkus
description: Use only when building, securing, testing, or verifying Quarkus applications — RESTEasy Reactive, CDI beans, Panache repositories, Camel messaging, security (JWT/OIDC, @RolesAllowed), TDD with REST Assured, and pre-deployment verification including native compilation.
---

# Quarkus

Adapted from ECC's `quarkus-patterns`, `quarkus-security`, `quarkus-tdd`, `quarkus-verification` skills (MIT).

Production-grade Quarkus patterns for cloud-native, secure, testable services.

## When to Use

- Building REST APIs with JAX-RS or RESTEasy Reactive
- CDI beans, Panache repositories, reactive streams, Camel messaging
- Security: JWT, OIDC, @RolesAllowed, CORS, rate limiting, secrets
- TDD: JUnit 5, REST Assured, Camel route testing, JaCoCo
- Pre-deployment verification including native compilation and container build

## Sections

- [Architecture & Patterns](REFERENCE.md#architecture--development-patterns) — REST API, Panache, Camel, logging, health checks
- [Security](REFERENCE.md#security) — auth, authorization, CORS, secrets, rate limiting, audit logging
- [TDD Workflow](REFERENCE.md#tdd-workflow) — unit, Camel, event, API, integration tests, JaCoCo
- [Verification Loop](REFERENCE.md#verification-loop) — 10-phase pre-deployment pipeline
