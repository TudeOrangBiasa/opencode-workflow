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
- **quality/** — code-review, tdd, diagnosing-bugs, audit, verify
- **workflow/** — meta-workflow: prototyping, memory, setup, skill-authoring

### planning/

- [ask-matt](ask-matt/SKILL.md) — Research skill: ask Matt Pocock about skill design, workflow, or coding patterns.
- [to-spec](to-spec/SKILL.md) — Turn a sharp idea into a structured specification document.
- [to-tickets](to-tickets/SKILL.md) — Break specs into independently-grabbable tickets.
- [triage](triage/SKILL.md) — Triage issues through a state machine of triage roles.
- [wayfinder](wayfinder/SKILL.md) — Plan big work: decide what to build and how to sequence it.

### design/

- [architecture-decision-records](architecture-decision-records/SKILL.md) — Capture architectural decisions as structured ADRs — context, alternatives, rationale, consequences.
- [design-skill](design/design-skill/SKILL.md) — Full-stack design skill for frontend interfaces. 22 sub-commands (craft, shape, audit, critique, adapt, animate, etc.). Merges former impeccable + emil-design-eng skills. Own repo: `~/Workspace/personal/agents/design-skill`.
- [design-system](design-system/SKILL.md) — Generate, audit, or review design systems for visual consistency (moved from misc/frontend/).
- [grill-with-docs](grill-with-docs/SKILL.md) — Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates CONTEXT.md and ADRs inline.
- [improve-codebase-architecture](improve-codebase-architecture/SKILL.md) — Find deepening opportunities in a codebase, informed by the domain language in CONTEXT.md and the decisions in docs/adr/.

### quality/

- [ai-regression-testing](ai-regression-testing/SKILL.md) — Regression testing for AI-assisted dev — sandbox-mode API testing, AI blind-spot patterns.
- [click-path-audit](click-path-audit/SKILL.md) — Trace button click paths for sequential-undo, race, stale-closure, dead-path bugs (moved from misc/frontend/).
- [code-review](code-review/SKILL.md) — Behavior + Change Health diff review.
- [diagnosing-bugs](diagnosing-bugs/SKILL.md) — Disciplined diagnosis loop for hard bugs and performance regressions.
- [error-handling](error-handling/SKILL.md) — Error-handling review checklist for typed errors, retries, safe messages (moved from misc/backend/).
- [ponytail](ponytail/SKILL.md) — Forces the laziest solution that actually works (npm plugin, auto-injects on every turn). `/ponytail [lite|full|ultra|off]`. Companion skills below.
- [ponytail-audit](ponytail-audit/SKILL.md) — Whole-repo audit for over-engineering. `/ponytail-audit`.
- [ponytail-debt](ponytail-debt/SKILL.md) — Harvest `ponytail:` comments into a debt ledger. `/ponytail-debt`.
- [ponytail-gain](ponytail-gain/SKILL.md) — One-shot scoreboard: ponytail's measured impact. `/ponytail-gain`.
- [ponytail-help](ponytail-help/SKILL.md) — Quick-reference card for all ponytail modes, skills, commands. `/ponytail-help`.
- [ponytail-review](ponytail-review/SKILL.md) — Code review focused on over-engineering. `/ponytail-review`.
- [production-audit](production-audit/SKILL.md) — Local-evidence production readiness audit.
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
- [openviking](openviking/SKILL.md) — Persist agent memory across sessions with OpenViking store/retrieve/search.
- [prototype](prototype/SKILL.md) — Build a throwaway prototype to flesh out a design — terminal app or UI variations.
- [search-first](search-first/SKILL.md) — Research-before-coding for external dependency, integration, or custom utility decisions. Also covers general open-ended research.
- [agent-config](agent-config/SKILL.md) — Scaffold the per-repo config (issue tracker, triage labels, domain docs, workspace skill symlinks) that other engineering skills consume.
- [skill-author](skill-author/SKILL.md) — Meta-skill for creating new skills.

