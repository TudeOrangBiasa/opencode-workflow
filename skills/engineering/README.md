# Engineering

Daily code-work skills — planning, design, quality, and workflow management.

## When to use

You are building, reviewing, testing, diagnosing, deploying, or planning code projects. This bucket is the daily driver for any code task.

## Boundary with sibling buckets

**Engineering** covers pipeline/code-work skills used daily: planning features, designing architecture, reviewing PRs, TDD, debugging, CI/CD. Use **Productivity** for non-code workflow tools (documents, research, handoffs). Use **Misc** for specialist domain skills (frameworks, databases, languages) — skills you load only when working in that specific tech. Use **Personal** for setup-specific tools tied to this machine. If a skill affects code output quality but isn't domain-specific, it belongs in Engineering.

## Structure

4 sub-directories:

- **planning/** — turning conversation into artifacts (PRDs, issues, triage)
- **design/** — architecture and UI design decisions
- **quality/** — review, test, diagnose, audit, verify
- **workflow/** — meta-workflow: prototyping, memory, setup, skill-authoring

### planning/

- **to-prd** — Turn current conversation context into a PRD and publish it to the configured project issue tracker.
- **to-issues** — Break any plan, spec, or PRD into independently-grabbable issue slices for the configured tracker, defaulting to local markdown issues.
- **triage** — Triage issues through a state machine of triage roles.

### design/

- **architecture-decision-records** — Capture architectural decisions as structured ADRs — context, alternatives, rationale, consequences.
- **design** — Full-stack design skill for frontend interfaces. 22 sub-commands (craft, shape, audit, critique, adapt, animate, etc.). Merges former impeccable + emil-design-eng skills.
- **grill-with-docs** — Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates CONTEXT.md and ADRs inline.
- **improve-codebase-architecture** — Find deepening opportunities in a codebase, informed by the domain language in CONTEXT.md and the decisions in docs/adr/.

### quality/

- **ai-regression-testing** — Regression testing for AI-assisted dev — sandbox-mode API testing, AI blind-spot patterns.
- **diagnose** — Disciplined diagnosis loop for hard bugs and performance regressions: reproduce → minimise → hypothesise → instrument → fix → regression-test.
- **ponytail** — Forces the laziest solution that actually works. YAGNI → stdlib → native → one line → minimum. Levels: lite/full/ultra. Companion skills: audit, debt, gain, help, review.
- **production-audit** — Local-evidence production readiness audit — security, data integrity, operations, payments, UX.
- **review** — Compact branch/PR/WIP review since a fixed point using parallel Behavior and ambitious Change Health passes.
- **tdd** — Test-driven development with a red-green-refactor loop.
- **team-handoff-quality** — Team-ready handoff checklist for changes, verification evidence, version bump, changelog, migration notes.
- **verify-evidence** — Tool-based verification checklist for acceptance criteria, test evidence, stuck-loop detection, and AFK/high-risk review.

### workflow/

- **canary-watch** — Post-deploy monitoring for deployed URLs — HTTP status, console errors, static assets, performance, API health, SSE streams.
- **codebase-onboarding** — Analyze unfamiliar codebases and generate structured onboarding guides.
- **context-budget** — Audit OpenCode context overhead across agents, skills, MCP servers, and repo instructions.
- **deployment-patterns** — Deployment workflows — strategies, Docker multi-stage, CI/CD, health checks, rollback.
- **git-workflow** — Git branching strategies, commit conventions, merge vs rebase, PR workflow, conflict resolution.
- **github-ops** — GitHub operations — issue triage, PR management, CI/CD debugging, release management, security monitoring.
- **memory-dreaming** — Consolidate lessons across sessions — find duplicates, merge, archive stale entries.
- **prototype** — Build a throwaway prototype to flesh out a design — terminal app or UI variations.
- **search-first** — Research-before-coding for external dependency, integration, or custom utility decisions.
- **setup-matt-pocock-skills** — Scaffold the per-repo config (issue tracker, triage labels, domain docs) that other engineering skills consume.
- **skill-author** — Meta-skill for creating new skills.
- **zoom-out** — Tell the agent to zoom out and give broader context on an unfamiliar section of code.
