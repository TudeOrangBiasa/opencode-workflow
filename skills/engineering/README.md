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

- **ask-matt** — Research skill: ask Matt Pocock about skill design, workflow, or coding patterns.
- **to-prd** — Turn current conversation context into a PRD and publish it to the configured project issue tracker.
- **to-issues** — Break any plan, spec, or PRD into independently-grabbable issue slices for the configured tracker, defaulting to local markdown issues.
- **to-spec** — Turn a sharp idea into a structured specification document (upstream replacement for to-prd).
- **to-tickets** — Break specs into independently-grabbable tickets (upstream replacement for to-issues).
- **triage** — Triage issues through a state machine of triage roles.
- **wayfinder** — Plan big work: decide what to build and how to sequence it.

### design/

- **architecture-decision-records** — Capture architectural decisions as structured ADRs — context, alternatives, rationale, consequences.
- **codebase-design** — Design interfaces for modules using parallel sub-agent pattern (design-it-twice).
- **design** — Full-stack design skill for frontend interfaces. 22 sub-commands (craft, shape, audit, critique, adapt, animate, etc.). Merges former impeccable + emil-design-eng skills.
- **design-system** — Generate, audit, or review design systems for visual consistency (moved from misc/frontend/).
- **domain-modeling** — Extract sharp domain terms and update CONTEXT.md + ADR docs as decisions crystallize.
- **grill-with-docs** — Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates CONTEXT.md and ADRs inline.
- **improve-codebase-architecture** — Find deepening opportunities in a codebase, informed by the domain language in CONTEXT.md and the decisions in docs/adr/.

### quality/

- **ai-regression-testing** — Regression testing for AI-assisted dev — sandbox-mode API testing, AI blind-spot patterns.
- **click-path-audit** — Trace button click paths for sequential-undo, race, stale-closure, dead-path bugs (moved from misc/frontend/).
- **code-review** — Behavior + Change Health diff review (upstream replacement for review).
- **diagnose** — Disciplined diagnosis loop for hard bugs and performance regressions: reproduce → minimise → hypothesise → instrument → fix → regression-test.
- **diagnosing-bugs** — Upstream replacement for diagnose with hitl-loop template.
- **error-handling** — Error-handling review checklist for typed errors, retries, safe messages (moved from misc/backend/).
- **ponytail** — Forces the laziest solution that actually works (npm plugin, auto-injects on every turn). `/ponytail [lite|full|ultra|off]`. Companion: `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-help`, `/ponytail-gain`.
- **ponytail-gain** — One-shot scoreboard: ponytail's measured impact (less code, less cost, faster). `/ponytail-gain`. Restored from git history; not in npm package.
- **production-audit** — Local-evidence production readiness audit — security, data integrity, operations, payments, UX.
- **review** — Compact branch/PR/WIP review since a fixed point using parallel Behavior and ambitious Change Health passes.
- **security-review** — Security review checklist for auth, input handling, secrets, PII (moved from misc/security/).
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
- **implement** — Implement a specific, well-defined piece of code from a spec or ticket.
- **memory-dreaming** — Consolidate lessons across sessions — find duplicates, merge, archive stale entries.
- **prototype** — Build a throwaway prototype to flesh out a design — terminal app or UI variations.
- **research** — Research a topic using web search MCP and synthesize findings.
- **resolving-merge-conflicts** — Step-by-step guide for resolving git merge conflicts.
- **search-first** — Research-before-coding for external dependency, integration, or custom utility decisions.
- **setup-matt-pocock-skills** — Scaffold the per-repo config (issue tracker, triage labels, domain docs) that other engineering skills consume.
- **skill-author** — Meta-skill for creating new skills.
- **zoom-out** — Tell the agent to zoom out and give broader context on an unfamiliar section of code.
