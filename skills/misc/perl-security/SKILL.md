---
name: perl-security
description: Use only when hardening Perl applications — taint mode, SQL injection prevention, XSS, input validation, secure file handling, and dependency auditing.
---

# Perl Security Patterns

Adapted from ECC's `perl-security` skill (MIT).

Comprehensive security guidelines for Perl applications covering input validation, injection prevention, and secure coding practices.

## When to Activate

- Handling user input in Perl applications
- Building Perl web applications (CGI, Mojolicious, Dancer2, Catalyst)
- Reviewing Perl code for security vulnerabilities
- Performing file operations with user-supplied paths
- Executing system commands from Perl
- Writing DBI database queries

## How It Works

Start with taint-aware input boundaries, then move outward: validate and untaint inputs, keep filesystem and process execution constrained, and use parameterized DBI queries everywhere. The examples below show the safe defaults this skill expects you to apply before shipping Perl code that touches user input, the shell, or the network.


See [REFERENCE.md](REFERENCE.md) for detailed content: examples, patterns, anti-patterns, and reference tables.
