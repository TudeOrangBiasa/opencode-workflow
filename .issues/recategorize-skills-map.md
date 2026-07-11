---
title: "Recategorize SKILLS-MAP.md — 3 functional bucket fixes"
status: open
priority: medium
labels: ["recategorize", "skills-map"]
created: 2026-07-10
---

## Problem

SKILLS-MAP.md (`docs/SKILLS-MAP.md`) has 3 functional bucket misplacements that don't match what skills actually do.

## Fixes

### 1. Dissolve mixed `## memory` bucket

`## memory` section mixed 5 skills from 3 different functions. Returned to functional homes:
- `eval` → `personal/workflow` (session evaluation = workflow concern)
- `verify-evidence` → `engineering/quality` (quality gate, not memory)
- `workflow-audit` → `personal/workflow` (repo audit = workflow concern)
- `memory-dreaming` → stays in `## memory` (true memory function)
- `openviking` → stays in `## memory` (true memory function)

**Files changed:** `docs/SKILLS-MAP.md`

### 2. Move `coding-standards` → engineering/quality

`coding-standards` is framework-agnostic code quality baseline. Fits functionally with quality skills (review, diagnose, tdd), not language-specific skills.

- From: `misc/languages`
- To: `engineering/quality`
- Note: language-specific variants stay (e.g., `java-coding-standards` in `misc/languages`)

**Files changed:** `docs/SKILLS-MAP.md`

### 3. Move `handoff` → engineering/workflow

`handoff` is context compaction between agents — a workflow/operations tool, not a productivity/document tool.

- From: `productivity`
- To: `engineering/workflow`

**Files changed:** `docs/SKILLS-MAP.md`

## Verification

- [ ] `docs/SKILLS-MAP.md` has `coding-standards` under `engineering/quality`, not `misc/languages`
- [ ] `docs/SKILLS-MAP.md` has `handoff` under `engineering/workflow`, not `productivity`
- [ ] `docs/SKILLS-MAP.md` `## memory` section has only `memory-dreaming` + `openviking`
- [ ] `eval`, `verify-evidence`, `workflow-audit` appear in correct functional buckets
- [ ] No skills duplicated across sections

## Related

- Follow-up: Update agent skill lists (`## Agents` section) after recategorization complete
