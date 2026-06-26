---
name: quarkus-security
description: Use only when securing Quarkus applications: authentication, authorization, JWT/OIDC, CORS, CSRF, security annotations, and production hardening.
---

# Quarkus Security Review

Adapted from ECC's `quarkus-security` skill (MIT).

Best practices for securing Quarkus applications with authentication, authorization, and input validation.

## When to Activate

- Adding authentication (JWT, OIDC, Basic Auth)
- Implementing authorization with @RolesAllowed or SecurityIdentity
- Validating user input (Bean Validation, custom validators)
- Configuring CORS or security headers
- Managing secrets (Vault, environment variables, config sources)
- Adding rate limiting or brute-force protection
- Scanning dependencies for CVEs
- Working with MicroProfile JWT or SmallRye JWT

For full code examples and patterns, see [REFERENCE.md](REFERENCE.md).

## When to Activate

- Adding authentication (JWT, OIDC, Basic Auth)
- Implementing authorization with @RolesAllowed or SecurityIdentity
- Validating user input (Bean Validation, custom validators)
- Configuring CORS or security headers
- Managing secrets (Vault, environment variables, config sources)
- Adding rate limiting or brute-force protection
- Scanning dependencies for CVEs
- Working with MicroProfile JWT or SmallRye JWT

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Authentication](REFERENCE.md#authentication) | JWT, OIDC, custom auth filter |
| [Authorization](REFERENCE.md#authorization) | @RolesAllowed, programmatic security |
| [Input Validation](REFERENCE.md#input-validation) | Bean Validation, custom validators |
| [SQL Injection Prevention](REFERENCE.md#sql-injection-prevention) | Panache, parameterized queries |
| [Password Hashing](REFERENCE.md#password-hashing) | BCrypt with BcryptUtil |
| [CORS & Secrets](REFERENCE.md#cors-configuration) | CORS config, Vault, env vars |
| [Rate Limiting](REFERENCE.md#rate-limiting) | RateLimitFilter, trusted proxy notes |
| [Security Headers](REFERENCE.md#security-headers) | CSP, HSTS, X-Frame-Options |
| [Audit & Dependencies](REFERENCE.md#audit-logging) | Audit logging, dependency scanning |

- Always use HTTPS in production
- Enable JWT or OIDC for stateless authentication
- Use `@RolesAllowed` for declarative authorization
- Validate all input with Bean Validation
- Hash passwords with BCrypt (never plaintext)
- Store secrets in Vault or environment variables
- Use parameterized queries to prevent SQL injection
- Add security headers to all responses
- Implement rate limiting for public endpoints
- Audit sensitive operations
- Keep dependencies updated and scan for CVEs
- Use SecurityIdentity for programmatic checks
- Set appropriate CORS policies
- Test authentication and authorization paths
