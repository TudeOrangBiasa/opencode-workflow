---
name: dependency-audit
description: Scan project dependencies for known vulnerabilities using Trivy. Use when reviewing PRs, before deployment, or when user asks "are our deps safe?"
---

# Dependency Audit

Scan dependencies for known CVEs using Trivy. Run before deployment and on PR review.

## Process

1. Check which stack the project uses (package.json, requirements.txt, composer.json, go.mod, Dockerfile)
2. Run Trivy:
   ```bash
   trivy fs . --scanners vuln --severity CRITICAL,HIGH
   ```
3. If Trivy not installed, fall back:
   - Node: `npm audit`
   - Python: `pip-audit`
   - PHP: `composer audit`
4. Report findings with severity, package, CVE link, and fix version

## Output

| Severity | Package | Current | Fixed | CVE |
|----------|---------|---------|-------|-----|
| CRITICAL | lodash | 4.17.20 | 4.17.21 | CVE-2021-23337 |

If no vulns found → report "No high/critical vulnerabilities found."
If vulns found → include in handoff evidence. Critical = block merge.
