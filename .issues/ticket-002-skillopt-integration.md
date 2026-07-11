---
title: "SkillOpt integration: train skills from eval data"
status: open
priority: high
labels: ["skillopt", "self-improvement", "research"]
created: 2026-07-10
updated: 2026-07-10 (post-reviewer: dependency on ticket-001 eval data, verify-evidence as prototype)
---

## Problem

Skills are static markdown+scripts. No mechanism to improve them from usage data. Microsoft SkillOpt (github.com/microsoft/SkillOpt) offers automated skill optimization via training loop: rollout → reflect → aggregate → select → update → gate.

Initial evaluation (ADR-0003) deferred adoption: ~$1-5/skill per training run, unknown yield for OpenCode skill format.

**Reviewer correction**: (1) SkillOpt v0.2.0 (2026-07-02) more mature — Claude plugin shell + SkillOpt-Sleep (nightly evolution) may lower adoption cost. (2) verify-evidence is better prototype candidate than eval — structured output (VERIFIED/FAILED/BLOCKED) fits SkillOpt's score loop. (3) BLOCKED until ticket-001 Phase 1 (5 eval reports).

## Goal

Re-evaluate SkillOpt with prototype on verify-evidence. Measure cost, yield, integration effort.

## Dependencies

- **BLOCKED**: Needs ticket-001 Phase 1 complete (minimum 5 eval reports with consistent format)
- Needs test scenarios defined per skill (ticket-001 Phase 3) for measuring improvement

## Tasks

### Phase 1: Research

- [ ] Deep-dive SkillOpt v0.2.0 codebase (github.com/microsoft/SkillOpt)
  - [ ] Understand training loop: rollout → reflect → aggregate → select → update → gate
  - [ ] Evaluate Claude plugin shell — can OpenCode consume trained skill directly?
  - [ ] Evaluate SkillOpt-Sleep (nightly evolution) — matches our memory-dreaming pattern?
  - [ ] Check input format: can we map SKILL.md + REFERENCE.md + scripts/ to SkillOpt expected format?
- [ ] Assess SkillOpt cost model for our scale (140 skills, ~$1-5/skill)
- [ ] Set explicit scale ceiling: manual optimization until >5 skills/quarter need improvement

### Phase 2: Prototype

- [ ] Candidate: verify-evidence (structured output, easier to score)
- [ ] Define 3-5 test scenarios for verify-evidence improvement baseline
- [ ] Run minimal SkillOpt training run on verify-evidence
  - [ ] Cost: actual $ spent
  - [ ] Yield: does improved variant pass same test scenarios?
  - [ ] Revert cost: can we rollback if worse?

### Phase 3: Decision

- [ ] Document findings in `docs/adr/` as ADR amendment or new ADR
- [ ] Decide: adopt, adopt with caveats (e.g., only for structured-output skills), or reject

## Success Criteria

- Prototype run completed with real cost data
- Clear go/no-go recommendation based on yield vs cost
- Scale ceiling documented in ADR

## Related

- ADR-0003: Skills Recategorization & Memory Protocol (SkillOpt section)
- github.com/microsoft/SkillOpt
- `.issues/ticket-001-self-improvement-pipeline.md`
