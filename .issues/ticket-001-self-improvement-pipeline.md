---
title: "Self-improvement pipeline: eval → workflow-audit → verify-evidence"
status: open
priority: high
labels: ["pipeline", "self-improvement", "quality"]
created: 2026-07-10
updated: 2026-07-10 (post-reviewer: eval-first sequencing)
---

## Problem

Three skills (eval, workflow-audit, verify-evidence) form natural self-improvement pipeline but operate in isolation:

- **eval** scores session quality — what went wrong, user frustration, repeated errors, scope drift
- **workflow-audit** scores repo health — sync status, symlink integrity, config drift
- **verify-evidence** gates delivery quality — acceptance criteria, test evidence, AFK gate

No documented flow connects them. eval output has no consumer. verify-evidence doesn't ingest eval data. workflow-audit runs standalone.

**Reviewer correction**: Pipeline doc requires real eval data. Currently zero eval reports in `.scratch/evals/`. Documenting abstract pipeline without data = premature.

## Goal

Phase 1: Run eval on real sessions → produce structured data. Phase 2: Document pipeline with concrete examples.

## Tasks

### Phase 1: Eval Data ✅

- [x] Define eval output format schema (YAML frontmatter + markdown) — `eval/REFERENCE.md`
- [x] Run eval on 4 past sessions + 1 current session → 5 reports in `.scratch/evals/`
- [x] Minimum data threshold: 5 reports met

### Phase 2: Pipeline Doc (1 minor item pending)

- [x] Map data flow: eval output fields → verify-evidence consumable format
- [x] Map data flow: workflow-audit output → eval scoring input
- [x] Create 1 concrete eval→verify mapping example in pipeline doc
- [x] Wire memory protocol: eval → `[workflow:eval]`, verify → `[workflow:verify]`, audit → `[workflow:audit]`
- [x] Document pipeline in `docs/engineering/self-improvement-pipeline.md`
- [x] Add cross-references in each skill's SKILL.md (eval, verify-evidence, workflow-audit)
- [x] Update orchestrator.md verification gate to reference pipeline
- [ ] Verify: eval report findable by verify-evidence via OpenViking

### Phase 3: Quick Fixes ✅

- [x] Add REFERENCE.md to verify-evidence (write-a-skill compliance) — includes 5 test scenarios
- [x] Define 3-5 test scenarios per skill for improvement baseline (in REFERENCE.md: silent upload, broken render, rate limiter, null handling, input validation)

## Dependencies

- ticket-002 blocked until Phase 1 complete (need eval data for SkillOpt prototype)

## Success Criteria

- 5 eval reports exist in `.scratch/evals/` with consistent format
- Pipeline doc readable without reading skill impl
- eval output format documented for verify-evidence consumer
- verify-evidence has REFERENCE.md

## Related

- ADR-0003: Skills Recategorization & Memory Protocol
- `.issues/ticket-002-skillopt-integration.md`
