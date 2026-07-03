# Spring Boot Security — Reference

> Full code examples. See SKILL.md for when-to-use.

## Authentication

JWT auth filter with OncePerRequestFilter, stateless tokens, httpOnly/Secure/SameSite cookies.

## Authorization

@EnableMethodSecurity, @PreAuthorize with role checks or custom @authz beans. Deny by default.

## Input Validation

@Valid + Bean Validation constraints (@NotBlank, @Email, @Size). Custom validators. HTML sanitization.

## SQL Injection Prevention

Spring Data derived queries (auto-parameterized), @Query with :param bindings. Never string concatenation.

## Password Encoding

BCryptPasswordEncoder (cost factor 12) or Argon2. Never plaintext.

## CSRF Protection

Keep enabled for browser session apps, disable for stateless bearer token APIs.

## Secrets Management

Environment variables, Spring Cloud Vault. No secrets in source.

## Security Headers

CSP, X-Frame-Options, XSS protection via http.headers() DSL.

## CORS Configuration

CorsConfigurationSource bean, restrict origins, never * in production.

## Rate Limiting

Bucket4j filter, use getRemoteAddr() with proper ForwardedHeaderFilter setup for trusted proxies.

## Dependency Security

OWASP Dependency Check / Snyk in CI.

## Logging and PII

Never log secrets, tokens, passwords. Redact sensitive fields in structured JSON logs.

## File Uploads

Validate size, content type, extension. Store outside web root.

## Checklist Before Release

Auth tokens validated, authorization guards, input validation, no string-concatenated SQL, CSRF correct, secrets externalized, security headers, rate limiting, dependencies scanned, logs clean.
