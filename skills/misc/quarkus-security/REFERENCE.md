# Quarkus Security Review — Reference

> Full code examples and patterns. See SKILL.md for when-to-use.

## Authentication

JWT authentication with JsonWebToken, SecurityIdentity injection. OIDC configuration with auth-server-url and client-id.

Custom authentication filter with `ContainerRequestFilter`.

## Authorization

Role-based access control with `@RolesAllowed`. Programmatic security with `SecurityIdentity`.

## Input Validation

Bean Validation on DTOs (`@NotBlank`, `@Email`, `@Size`, `@Pattern`). Custom validators with `ConstraintValidator`.

## SQL Injection Prevention

Panache parameterized queries (`?1`, `:email`), native queries with `setParameter`.

## Password Hashing

BCrypt hashing with `BcryptUtil.bcryptHash()`, service-layer authentication.

## CORS Configuration

application.properties with origins, methods, headers, max-age.

## Secrets Management

Environment variables, Vault integration. No secrets in application.properties.

## Rate Limiting

Bucket4j rate limiting with `ContainerRequestFilter`. Remote address identification (trusted proxy setup).

## Security Headers

X-Frame-Options, X-Content-Type-Options, HSTS, CSP headers via `ContainerResponseFilter`.

## Audit Logging

AuditService for tracking resource access with user identity.

## Dependency Security Scanning

OWASP Dependency Check, Gradle equivalent.

## Best Practices

HTTPS, JWT/OIDC, @RolesAllowed, Bean Validation, BCrypt, parameterized queries, security headers, rate limiting, audit logging.
