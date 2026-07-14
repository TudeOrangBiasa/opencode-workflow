# ADR-0003: Skills Recategorization, SKILLS-MAP.md, and Cross-Agent Memory Protocol

**Date**: 2026-07-10
**Status**: accepted
**Deciders**: user + planner + reviewer
**Updated**: 2026-07-14 — deferred physical move completed: `personal/` bucket dissolved; `eval`/`workflow-audit` → `engineering/workflow`, `openviking` → `engineering/workflow`. `(from personal/workflow)` annotations above are now historical context.

## Context

Three structural problems emerged as the skill count grew past 140 active entries:

1. **Agent files had hardcoded skill names.** Every agent file (`planner.md`, `builder.md`, `reviewer.md`) listed which skills to load. Every recategorization or new skill required touching 4+ agent files. Easy to forget one. Hard to keep consistent.

2. **Skills scattered across buckets without clear functional homes.** The `memory` bucket was created as a temporary catch-all for eval, workflow-audit, verify-evidence, memory-dreaming, and openviking — but these skills serve different purposes (session evaluation, repo audit, verification gate, memory consolidation, OpenViking adapter). Grouping by "uses OpenViking" was wrong: it's an implementation detail, not a function.

3. **No cross-agent memory protocol.** Builder, reviewer, and validator all store lessons to OpenViking but used inconsistent category prefixes. No shared schema for what to store or how to retrieve. Lessons from one agent were invisible to others.

## Decision

### 1. Create SKILLS-MAP.md as single source of truth

- One registry file at `docs/SKILLS-MAP.md` listing all active skills by bucket (scratch doc only — see Amendment below)
- Bucket READMEs (`skills/engineering/README.md`, `skills/productivity/README.md`, etc.) serve as context maps for human readers
- `skill_triggers` in `opencode.json` remains the native auto-load mechanism (machine-config, not agent-prose)

> **Amendment (2026-07-10)**: SKILLS-MAP.md is a scratch doc for recategorization planning, NOT persistent agent reference. Agent files do NOT reference SKILLS-MAP.md. They use `opencode.json` skill_triggers directly. SKILLS-MAP.md served its purpose (figure out bucket assignments) and is not maintained as living artifact.

### 2. Standardized Memory Protocol categories

All agents use these 6 categories for `ov add-memory`:

- `[agent:<name>]` — agent behavior lessons (e.g., `[agent:builder] always snapshot before edit`)
- `[skill:<name>]` — skill-specific patterns (e.g., `[skill:officecli] use batch for 3+ mutations`)
- `[workflow:<phase>]` — phase-level lessons (e.g., `[workflow:review] check design.md before UI critique`)
- `[project:<name>]` — project-specific context (e.g., `[project:opencode-workflow] ADR-0002 plugin decisions`)
- `[tool-failure:<tool>]` — non-obvious tool workarounds (e.g., `[tool-failure:officecli] raw-set not valid, use set`)
- `[pattern:<domain>]` — reusable patterns (e.g., `[pattern:docx-edit] cell-by-cell verify ALL cells`)

Cross-agent retrieval: planner does wide `ov find "<project-name>"` before delegating, surfacing lessons from ALL agent namespaces.

### 3. Bucket recategorization

| Skill | From | To | Rationale |
|-------|------|----|-----------|
| coding-standards | misc/languages | engineering/quality | Language-agnostic convention enforcer, not a language skill |
| handoff | productivity | engineering/workflow | Session handoff is engineering workflow, not productivity tool |
| verify-evidence | memory | engineering/quality | Verification gate belongs with quality, not memory |
| eval | memory → personal/workflow | engineering/workflow | Session evaluation is self-improvement infra, not personal tool |
| workflow-audit | memory → personal/workflow | engineering/workflow | Repo audit is self-improvement infra, not personal tool |
| memory-dreaming | engineering/workflow | memory | Memory consolidation belongs with storage — one bucket for persistence |
| openviking | personal/tools | memory | OpenViking adapter is the storage backend for memory subsystem |

**memory bucket** shrinks to just `memory-dreaming` + `openviking` — the pure storage/consolidation pair. All functional skills (evaluation, verification, audit) live in their domain buckets.

**Physical directory move**: eval and workflow-audit remain at `skills/personal/workflow/` for now. SKILLS-MAP.md references them with `(from personal/workflow)` cross-ref tags. Physical move deferred — no runtime impact since SKILLS-MAP.md is the binding.

### 4. Self-improvement pipeline (future)

eval, workflow-audit, and verify-evidence form a natural pipeline:
- eval scores session quality
- workflow-audit scores repo health
- verify-evidence gates delivery quality

Reviewed Microsoft SkillOpt (github.com/microsoft/SkillOpt) for automated skill optimization. Decision: **not adopt yet**. Cost ~$1-5/skill per training run. Unknown yield for OpenCode skill format. Gap identified: no automated benchmark eval for running skills against test scenarios. If eval produces enough structured session data, reconsider SkillOpt-style training loop for frequently-used skills.

## Alternatives Considered

### Alternative 1: Keep hardcoded skill lists in agent files
- **Why not**: Every recategorization requires 4+ agent file edits. High maintenance cost for 140+ skills. Inevitable drift.

### Alternative 2: Use opencode.json `skill_triggers` as sole mechanism
- **Why not**: `skill_triggers` maps keywords → auto-load, not bucket → discoverability. Orchestrator needs to know WHICH skills exist per domain, not just keyword-triggered ones.

### Alternative 3: Merge eval + workflow-audit into single "self-improve" skill
- **Why not**: Reviewer evaluated and rejected. eval = session scoring (micro, per-turn). workflow-audit = repo health (macro, whole-repo). Different scope, different audience. Merging would create a bloated skill with two orthogonal concerns.

## Consequences

### Positive
- Single file (`SKILLS-MAP.md`) defines all skill membership; agent files stay clean
- Memory protocol enables cross-agent lesson sharing without hardcoded routing
- Skills now grouped by function, not implementation detail (memory bucket no longer a grab-bag)
- eval + workflow-audit move to engineering/workflow signals they are first-class infra, not personal toys

### Negative
- SKILLS-MAP.md must be kept in sync with actual skill directories (automated verification not yet in place)
- eval and workflow-audit physically still in `personal/workflow/` — potential confusion unless the `(from personal/workflow)` annotation is noticed
- Reviewer agent still has `eval` in its hardcoded skill list (in `docs/SKILLS-MAP.md` Agents section) — needs updating if agent files are also cleaned

### Risks
- SKILLS-MAP.md drifts from reality if skill additions skip the map update step
- Physical directory moves may be forgotten; cross-ref annotations may be missed
- SkillOpt-style automation may waste money if eval data quality is low
