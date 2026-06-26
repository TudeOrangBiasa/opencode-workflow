---
name: springboot-security
description: Use only when adding auth or hardening Spring Boot security — Spring Security, JWT, CORS, CSRF, validation, secrets, rate limiting, and dependency scanning.
---

# Spring Boot Security Review

Adapted from ECC's `springboot-security` skill (MIT).

Use when adding auth, handling input, creating endpoints, or dealing with secrets.

## When to Activate

- Adding authentication (JWT, OAuth2, session-based)
- Implementing authorization (@PreAuthorize, role-based access)
- Validating user input (Bean Validation, custom validators)
- Configuring CORS, CSRF, or security headers
- Managing secrets (Vault, environment variables)
- Adding rate limiting or brute-force protection
- Scanning dependencies for CVEs

For full code examples and patterns, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Adding authentication (JWT, OAuth2, session-based)
- Implementing authorization (@PreAuthorize, role-based access)
- Validating user input (Bean Validation, custom validators)
- Configuring CORS, CSRF, or security headers
- Managing secrets (Vault, environment variables)
- Adding rate limiting or brute-force protection
- Scanning dependencies for CVEs

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Authentication](REFERENCE.md#authentication) | JWT filter, stateless tokens |
| [Authorization](REFERENCE.md#authorization) | @PreAuthorize, method security |
| [Input Validation](REFERENCE.md#input-validation) | Bean Validation, sanitization |
| [SQL Injection Prevention](REFERENCE.md#sql-injection-prevention) | Parameterized queries |
| [Password Encoding](REFERENCE.md#password-encoding) | BCryptPasswordEncoder |
| [CSRF & CORS](REFERENCE.md#csrf-protection) | CSRF decisions, CORS config |
| [Secrets](REFERENCE.md#secrets-management) | Environment variables, Vault |
| [Security Headers](REFERENCE.md#security-headers) | CSP, X-Frame-Options, HSTS |
| [Rate Limiting](REFERENCE.md#rate-limiting) | Bucket4j, client IP |
| [Dependencies & Checklist](REFERENCE.md#dependency-security) | OWASP, release checklist |
