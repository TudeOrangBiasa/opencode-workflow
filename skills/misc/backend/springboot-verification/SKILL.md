---
name: springboot-verification
description: Use only when running pre-deployment verification for Spring Boot projects — build, static analysis, tests with coverage, security scan, and diff review.
---

# Spring Boot Verification Loop

Adapted from ECC's `springboot-verification` skill (MIT).

Run before PRs, after major changes, and pre-deploy.

## When to Activate

- Before opening a pull request for a Spring Boot service
- After major refactoring or dependency upgrades
- Pre-deployment verification for staging or production
- Running full build → lint → test → security scan pipeline
- Validating test coverage meets thresholds

For full verification phases, commands, and test examples, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Before opening a pull request for a Spring Boot service
- After major refactoring or dependency upgrades
- Pre-deployment verification for staging or production
- Running full build → lint → test → security scan pipeline
- Validating test coverage meets thresholds

## REFERENCE.md Contents

| Phase | Description |
|-------|-------------|
| [Build](REFERENCE.md#phase-1-build) | Maven/Gradle build |
| [Static Analysis](REFERENCE.md#phase-2-static-analysis) | SpotBugs, PMD, Checkstyle |
| [Tests + Coverage](REFERENCE.md#phase-3-tests--coverage) | Unit, integration, API tests, JaCoCo |
| [Security Scan](REFERENCE.md#phase-4-security-scan) | OWASP, secrets grep |
| [Lint/Format](REFERENCE.md#phase-5-lintformat-optional-gate) | Spotless |
| [Diff Review](REFERENCE.md#phase-6-diff-review) | Checklist, output template |
