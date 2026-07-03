# Spring Boot Verification — Reference

> Full verification phases. See SKILL.md for when-to-use.

## Phase 1: Build

mvn -T 4 clean verify -DskipTests or ./gradlew clean assemble -x test.

## Phase 2: Static Analysis

spotbugs:check, pmd:check, checkstyle:check.

## Phase 3: Tests + Coverage

mvn -T 4 test, jacoco:report (verify 80%+). Unit, integration (Testcontainers), and API (MockMvc) test examples.

## Phase 4: Security Scan

OWASP Dependency Check, secrets grep in source/git history. Common security finding checks.

## Phase 5: Lint/Format (optional)

spotless:apply.

## Phase 6: Diff Review

git diff --stat + checklist: no debug logs, meaningful errors, transactions present, config changes documented.

## Output Template

VERIFICATION REPORT with Build/Static/Tests/Security/Diff pass/fail status and issues list.

## Continuous Mode

Re-run phases every 30-60 min. Keep short loop: mvn -T 4 test + spotbugs.
