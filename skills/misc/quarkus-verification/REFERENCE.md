# Quarkus Verification Loop — Reference

> Full verification phases. See SKILL.md for when-to-use.

## Phase 1: Build

```bash
mvn clean verify -DskipTests
./gradlew clean assemble -x test
```

## Phase 2: Static Analysis

Checkstyle, PMD, SpotBugs, SonarQube commands and common issues to address.

## Phase 3: Tests + Coverage

Unit tests with Mockito, integration tests with Testcontainers, API tests with REST Assured. JaCoCo coverage (80%+ lines, 70%+ branches).

## Phase 4: Security Scanning

OWASP Dependency Check, Quarkus audit, OWASP ZAP API scan. Common security checks checklist.

## Phase 5: Native Compilation

GraalVM native image build, troubleshooting reflection/resources/JNI issues.

## Phase 6: Performance Testing

K6 load testing script, metrics to monitor (response time, throughput, error rate, memory, CPU).

## Phase 7: Health Checks

Liveness, readiness, metrics endpoints with expected JSON response.

## Phase 8: Container Image Build

Container build with quarkus-container-image, Trivy/Grype security scan.

## Phase 9: Configuration Validation

quarkus:info, environment-specific checks.

## Phase 10: Documentation Review

OpenAPI/Swagger, README, API docs, migration guide.

## Verification Checklist

Code quality, testing, security, deployment, native image checklists.

## Automated Verification Script

Complete bash script running all phases.

## CI/CD Integration

GitHub Actions workflow example with build, test, security scan, coverage upload.

## Best Practices

Run before every PR, automate in CI, fix immediately, keep 80%+ coverage.
