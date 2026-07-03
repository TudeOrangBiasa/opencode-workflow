---
name: quarkus-verification
description: Use only when verifying Quarkus applications: smoke tests, integration tests, native compilation checks, health checks, and production readiness.
---

# Quarkus Verification Loop

Adapted from ECC's `quarkus-verification` skill (MIT).

Run before PRs, after major changes, and pre-deploy.

## When to Activate

- Before opening a pull request for a Quarkus service
- After major refactoring or dependency upgrades
- Pre-deployment verification for staging or production
- Running full build → lint → test → security scan → native compilation pipeline
- Validating test coverage meets thresholds (80%+)
- Testing native image compatibility

For full verification phases, commands, and examples, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Before opening a pull request for a Quarkus service
- After major refactoring or dependency upgrades
- Pre-deployment verification for staging or production
- Running full build → lint → test → security scan → native compilation pipeline
- Validating test coverage meets thresholds (80%+)
- Testing native image compatibility

## REFERENCE.md Contents

| Phase | Description |
|-------|-------------|
| [Build](REFERENCE.md#phase-1-build) | Maven/Gradle build |
| [Static Analysis](REFERENCE.md#phase-2-static-analysis) | Checkstyle, PMD, SpotBugs |
| [Tests + Coverage](REFERENCE.md#phase-3-tests--coverage) | Unit, integration, API tests, JaCoCo |
| [Security Scanning](REFERENCE.md#phase-4-security-scanning) | OWASP, Quarkus audit, ZAP |
| [Native Compilation](REFERENCE.md#phase-5-native-compilation) | GraalVM, troubleshooting |
| [Performance Testing](REFERENCE.md#phase-6-performance-testing) | K6 load testing |
| [Health Checks](REFERENCE.md#phase-7-health-checks) | Liveness, readiness endpoints |
| [Container Build](REFERENCE.md#phase-8-container-image-build) | Container image, Trivy scan |
| [Configuration Validation](REFERENCE.md#phase-9-configuration-validation) | Environment-specific checks |
| [Documentation Review](REFERENCE.md#phase-10-documentation-review) | OpenAPI, README |
| [Checklist & CI/CD](REFERENCE.md#verification-checklist) | Full checklist, automation script |
