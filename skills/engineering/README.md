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

- [ask-matt](ask-matt/SKILL.md) — Research skill: ask Matt Pocock about skill design, workflow, or coding patterns.
- [to-prd](to-prd/SKILL.md) — Turn current conversation context into a PRD and publish it to the configured project issue tracker.
- [to-issues](to-issues/SKILL.md) — Break any plan, spec, or PRD into independently-grabbable issue slices for the configured tracker, defaulting to local markdown issues.
- [to-spec](to-spec/SKILL.md) — Turn a sharp idea into a structured specification document (upstream replacement for to-prd).
- [to-tickets](to-tickets/SKILL.md) — Break specs into independently-grabbable tickets (upstream replacement for to-issues).
- [triage](triage/SKILL.md) — Triage issues through a state machine of triage roles.
- [wayfinder](wayfinder/SKILL.md) — Plan big work: decide what to build and how to sequence it.

### design/

- [architecture-decision-records](architecture-decision-records/SKILL.md) — Capture architectural decisions as structured ADRs — context, alternatives, rationale, consequences.
- [codebase-design](codebase-design/SKILL.md) — Design interfaces for modules using parallel sub-agent pattern (design-it-twice).
- [design](design/SKILL.md) — Full-stack design skill for frontend interfaces. 22 sub-commands (craft, shape, audit, critique, adapt, animate, etc.). Merges former impeccable + emil-design-eng skills.
- [design-system](design-system/SKILL.md) — Generate, audit, or review design systems for visual consistency (moved from misc/frontend/).
- [domain-modeling](domain-modeling/SKILL.md) — Extract sharp domain terms and update CONTEXT.md + ADR docs as decisions crystallize.
- [grill-with-docs](grill-with-docs/SKILL.md) — Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates CONTEXT.md and ADRs inline.
- [improve-codebase-architecture](improve-codebase-architecture/SKILL.md) — Find deepening opportunities in a codebase, informed by the domain language in CONTEXT.md and the decisions in docs/adr/.

### quality/

- [ai-regression-testing](ai-regression-testing/SKILL.md) — Regression testing for AI-assisted dev — sandbox-mode API testing, AI blind-spot patterns.
- [click-path-audit](click-path-audit/SKILL.md) — Trace button click paths for sequential-undo, race, stale-closure, dead-path bugs (moved from misc/frontend/).
- [code-review](code-review/SKILL.md) — Behavior + Change Health diff review (upstream replacement for review).
- [diagnose](diagnose/SKILL.md) — Disciplined diagnosis loop for hard bugs and performance regressions: reproduce → minimise → hypothesise → instrument → fix → regression-test.
- [diagnosing-bugs](diagnosing-bugs/SKILL.md) — Upstream replacement for diagnose with hitl-loop template.
- [error-handling](error-handling/SKILL.md) — Error-handling review checklist for typed errors, retries, safe messages (moved from misc/backend/).
- [ponytail](ponytail/SKILL.md) — Forces the laziest solution that actually works (npm plugin, auto-injects on every turn). `/ponytail [lite|full|ultra|off]`. Companion: `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-help`, `/ponytail-gain`.
- [ponytail-gain](ponytail-gain/SKILL.md) — One-shot scoreboard: ponytail's measured impact (less code, less cost, faster). `/ponytail-gain`. Restored from git history; not in npm package.
- [production-audit](production-audit/SKILL.md) — Local-evidence production readiness audit — security, data integrity, operations, payments, UX.
- [review](review/SKILL.md) — Compact branch/PR/WIP review since a fixed point using parallel Behavior and ambitious Change Health passes.
- [security-review](security-review/SKILL.md) — Security review checklist for auth, input handling, secrets, PII (moved from misc/security/).
- [tdd](tdd/SKILL.md) — Test-driven development with a red-green-refactor loop.
- [team-handoff-quality](team-handoff-quality/SKILL.md) — Team-ready handoff checklist for changes, verification evidence, version bump, changelog, migration notes.
- [verify-evidence](verify-evidence/SKILL.md) — Tool-based verification checklist for acceptance criteria, test evidence, stuck-loop detection, and AFK/high-risk review.

### workflow/

- [canary-watch](canary-watch/SKILL.md) — Post-deploy monitoring for deployed URLs — HTTP status, console errors, static assets, performance, API health, SSE streams.
- [codebase-onboarding](codebase-onboarding/SKILL.md) — Analyze unfamiliar codebases and generate structured onboarding guides.
- [context-budget](context-budget/SKILL.md) — Audit OpenCode context overhead across agents, skills, MCP servers, and repo instructions.
- [deployment-patterns](deployment-patterns/SKILL.md) — Deployment workflows — strategies, Docker multi-stage, CI/CD, health checks, rollback.
- [git-workflow](git-workflow/SKILL.md) — Git branching strategies, commit conventions, merge vs rebase, PR workflow, conflict resolution.
- [github-ops](github-ops/SKILL.md) — GitHub operations — issue triage, PR management, CI/CD debugging, release management, security monitoring.
- [implement](implement/SKILL.md) — Implement a specific, well-defined piece of code from a spec or ticket.
- [memory-dreaming](memory-dreaming/SKILL.md) — Consolidate lessons across sessions — find duplicates, merge, archive stale entries.
- [prototype](prototype/SKILL.md) — Build a throwaway prototype to flesh out a design — terminal app or UI variations.
- [research](research/SKILL.md) — Research a topic using web search MCP and synthesize findings.
- [resolving-merge-conflicts](resolving-merge-conflicts/SKILL.md) — Step-by-step guide for resolving git merge conflicts.
- [search-first](search-first/SKILL.md) — Research-before-coding for external dependency, integration, or custom utility decisions.
- [setup-matt-pocock-skills](setup-matt-pocock-skills/SKILL.md) — Scaffold the per-repo config (issue tracker, triage labels, domain docs) that other engineering skills consume.
- [skill-author](skill-author/SKILL.md) — Meta-skill for creating new skills.
- [zoom-out](zoom-out/SKILL.md) — Tell the agent to zoom out and give broader context on an unfamiliar section of code.
