---
name: github-ops
description: Use when gitHub operations — issue triage, PR management, CI/CD debugging, release management, and security monitoring via gh CLI. Use only when managing GitHub issues, PRs, CI status, releases, contributors, stale items, or security alerts.
---

# GitHub Operations

Adapted from ECC's `github-ops` skill (MIT).

Manage GitHub repositories with a focus on community health, CI reliability, and contributor experience.

## When to Activate

- Triaging issues (classifying, labeling, responding, deduplicating)
- Managing PRs (review status, CI checks, stale PRs, merge readiness)
- Debugging CI/CD failures
- Preparing releases and changelogs
- Monitoring Dependabot and security alerts
- Managing contributor experience on open-source projects
- User says "check GitHub", "triage issues", "review PRs", "merge", "release", "CI is broken"

## Tool Requirements

- **gh CLI** for all GitHub API operations
- Repository access configured via `gh auth login`


See [REFERENCE.md](REFERENCE.md) for detailed content: examples, patterns, anti-patterns, and reference tables.
