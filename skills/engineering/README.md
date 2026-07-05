# Engineering

Skills I use daily for code work, organized into 4 sub-directories:

## planning/

- **[to-prd](./planning/to-prd/SKILL.md)** — Turn the current conversation context into a PRD and publish it to the configured project issue tracker.
- **[to-issues](./planning/to-issues/SKILL.md)** — Break any plan, spec, or PRD into independently-grabbable issue slices for the configured tracker, defaulting to local markdown issues.
- **[triage](./planning/triage/SKILL.md)** — Triage issues through a state machine of triage roles.

## design/

- **[architecture-decision-records](./design/architecture-decision-records/SKILL.md)** — Capture architectural decisions as structured ADRs — context, alternatives, rationale, consequences.
- **[design](./design/SKILL.md)** — Full-stack design skill for frontend interfaces. 22 sub-commands (craft, shape, audit, critique, adapt, animate, etc.). Merges former impeccable + emil-design-eng skills. Motion authority via emil's Animation Decision Framework.
- **[grill-with-docs](./design/grill-with-docs/SKILL.md)** — Grilling session that challenges your plan against the existing domain model, sharpens terminology, and updates `CONTEXT.md` and ADRs inline.
- **[improve-codebase-architecture](./design/improve-codebase-architecture/SKILL.md)** — Find deepening opportunities in a codebase, informed by the domain language in `CONTEXT.md` and the decisions in `docs/adr/`.

## quality/

- **[ai-regression-testing](./quality/ai-regression-testing/SKILL.md)** — Regression testing for AI-assisted dev — sandbox-mode API testing, AI blind-spot patterns. Use only when AI agents modified API routes or after bug fixes.
- **[diagnose](./quality/diagnose/SKILL.md)** — Disciplined diagnosis loop for hard bugs and performance regressions: reproduce → minimise → hypothesise → instrument → fix → regression-test.
- **[ponytail](./quality/ponytail/SKILL.md)** — Forces the laziest solution that actually works. YAGNI → stdlib → native → one line → minimum. Levels: lite/full/ultra. Companion skills: [audit](./quality/ponytail/audit/SKILL.md), [debt](./quality/ponytail/debt/SKILL.md), [gain](./quality/ponytail/gain/SKILL.md), [help](./quality/ponytail/help/SKILL.md), [review](./quality/ponytail/review/SKILL.md). From [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail).
- **[production-audit](./quality/production-audit/SKILL.md)** — Local-evidence production readiness audit — security, data integrity, operations, payments, UX.
- **[review](./quality/review/SKILL.md)** — Compact branch/PR/WIP review since a fixed point using parallel Behavior and ambitious Change Health passes.
- **[tdd](./quality/tdd/SKILL.md)** — Test-driven development with a red-green-refactor loop. Builds features or fixes bugs one vertical slice at a time.
- **[team-handoff-quality](./quality/team-handoff-quality/SKILL.md)** — Team-ready handoff checklist for changes, verification evidence, version bump decisions, changelog entries, migration notes, rollback notes, next-owner actions.
- **[verify-evidence](./quality/verify-evidence/SKILL.md)** — Tool-based verification checklist for acceptance criteria, test evidence, stuck-loop detection, and AFK/high-risk review.

## workflow/

- **[canary-watch](./workflow/canary-watch/SKILL.md)** — Post-deploy monitoring for deployed URLs — HTTP status, console errors, static assets, performance, API health, SSE streams.
- **[codebase-onboarding](./workflow/codebase-onboarding/SKILL.md)** — Analyze unfamiliar codebases and generate structured onboarding guides — architecture map, key entry points, conventions.
- **[context-budget](./workflow/context-budget/SKILL.md)** — Audit OpenCode context overhead across agents, skills, MCP servers, and repo instructions.
- **[deployment-patterns](./workflow/deployment-patterns/SKILL.md)** — Deployment workflows — strategies (rolling, blue-green, canary), Docker multi-stage builds, CI/CD pipelines, health checks, rollback.
- **[git-workflow](./workflow/git-workflow/SKILL.md)** — Git branching strategies, commit conventions, merge vs rebase, PR workflow, conflict resolution, release management.
- **[github-ops](./workflow/github-ops/SKILL.md)** — GitHub operations — issue triage, PR management, CI/CD debugging, release management, security monitoring via gh CLI.
- **[memory-dreaming](./workflow/memory-dreaming/SKILL.md)** — Consolidate lessons across sessions — find duplicates, merge, archive stale entries. 2-phase pipeline. Trigger: consolidate, dream, clean up lessons, memory hygiene.
- **[prototype](./workflow/prototype/SKILL.md)** — Build a throwaway prototype to flesh out a design — either a runnable terminal app for state/business-logic questions, or several radically different UI variations toggleable from one route.
- **[search-first](./workflow/search-first/SKILL.md)** — Research-before-coding for external dependency, integration, or custom utility decisions. Searches npm/PyPI, MCP servers, GitHub, web. Decision matrix: adopt → extend → compose → build.
- **[setup-matt-pocock-skills](./workflow/setup-matt-pocock-skills/SKILL.md)** — Scaffold the per-repo config (issue tracker, triage label vocabulary, domain doc layout) that the other engineering skills consume.
- **[skill-author](./workflow/skill-author/SKILL.md)** — Meta-skill for creating new skills.
- **[zoom-out](./workflow/zoom-out/SKILL.md)** — Tell the agent to zoom out and give broader context or a higher-level perspective on an unfamiliar section of code.
