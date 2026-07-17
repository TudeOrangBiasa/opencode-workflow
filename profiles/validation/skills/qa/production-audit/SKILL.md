---
name: production-audit
description: Use when local-evidence production readiness audit — security, data integrity, operations, payments, UX. Score + blockers + next action. Use only for explicit launch/ship/prod readiness questions, not ordinary review.
---

# Production Audit

Adapted from ECC's `production-audit` skill (MIT).

Use this skill when the user asks whether an application is ready to ship, what
could break in production, or what must be fixed before a launch. This is a
maintainer-safe rewrite of the stale community production-audit idea: it keeps
the useful production-readiness lens and removes unpinned external execution and
third-party data sharing.

## When to Use

- The user asks "is this production-ready", "what would break in prod", "what
  did we miss", "audit this repo", or "ready to ship?"
- A feature was merged and needs a pre-deploy or post-merge risk pass.
- A public launch, demo, customer rollout, or investor walkthrough is close.
- CI is green but the user wants production risk, not only test status.
- A deployed URL, release branch, PR, or current checkout is available for
  evidence gathering.

## When Not to Use

- During active implementation when the right lens is line-level secure coding;
  use `security-review` first.
- For pure libraries, templates, docs-only repos, or scaffolds unless the user
  wants packaging/release readiness rather than application readiness.
- When the user asks for a formal compliance audit. This skill is engineering
  triage, not legal, financial, medical, or regulatory certification.
- When the only available evidence is a product idea with no repo, deployment,
  CI, or runtime surface.

## How It Works

Build the audit from local and user-authorized evidence. Do not run unpinned
remote code, upload repository contents to third-party services, or call
external scanners unless the user explicitly approves that specific tool and
data flow.

Full details in [REFERENCE.md](REFERENCE.md).

## How It Works

Use this order:

1. Establish the release surface.
2. Read recent changes and current branch state.
3. Inspect runtime, auth, data, payment, background-job, AI, and deployment
   boundaries that actually exist in the repo.
4. Check CI, tests, migrations, environment documentation, and rollback path.
5. Produce a short ship/block recommendation with specific fixes.

## REFERENCE.md Contents

| Section | Description |
|---------|-------------|
| [Evidence Checklist](REFERENCE.md#evidence-checklist) | What to inspect |
| [Risk Lenses](REFERENCE.md#risk-lenses) | Security, data, payments, ops, UX |
| [Scoring](REFERENCE.md#scoring) | Score bands and caps |
| [Output Format & Example](REFERENCE.md#output-format) | Response template |
| [Anti-Patterns](REFERENCE.md#anti-patterns) | What to avoid |
