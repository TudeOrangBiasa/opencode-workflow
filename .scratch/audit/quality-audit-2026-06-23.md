# Quality Audit — opencode-workflow

**Date**: 2026-06-23
**Scope**: ~20 commits of rapid growth. 15 repo skills, 4 agent files, 18 issues.
**Method**: Read-only cross-reference of repo files, local config, symlinks.

---

## 1. Agent File Bloat (orchestrator.md = 507 lines)

**Status: ISSUE** — Severity: medium

### Structural issues

1. **Two sources of truth for skill triggers** — orchestrator.md lines 133-148 has a "Skill Triggers" table with 13 entries. opencode.json (and its template) have 16 entries. The orchestrator.md table MISSES:
   - `design-system` (line 67 in opencode.json)
   - `ui-to-vue` (line 68 in opencode.json)
   - `review-animations` (line 69 in opencode.json)

   These 3 DO appear in orchestrator.md's "Other design skills" section (lines 296-301) but that's a narrative paragraph, not the trigger table. An agent reading the trigger table won't know these skills auto-load.

2. **Section boundary bleed** — The document has inconsistent section spacing. Some sections end with no blank line before next heading (e.g. line 22 flows into line 23 without a blank separator). The "Rules" section (lines 500-507) starts with no clear relationship to the preceding section.

3. **Duplication with subagent files** — "Preflight Checks" (orchestrator.md lines 50-56) overlaps with `builder.md` lines 33-35 ("Read Context") and lines 57-61 ("Read Before Edit"). Same rule in two places — will drift.

4. **Contradiction** — Line 374 says "Delegate, don't do. Orchestrator routes and synthesizes. It does NOT do exploration, building, or browser-qa work itself." But line 405 says "Direct read/grep for trivial lookups. Do not subagent these." These are compatible but close to contradictory — orchestrator does non-subagent work (trivial lookups).

5. **Dead reference** — Line 309 still lists `planner` as a primitive agent. `planner` was removed from `agents/` and disabled in config. CHANGELOG line 13 confirms cleanup. The docs/workflow.md also still refers to planner (line 20, 128).

6. **Scattered skill references** — `design-system`, `ui-to-vue`, `review-animations` are mentioned in the body (lines 296-301) but excluded from the skill triggers table (lines 133-148). An agent scanning triggers won't find them.

### What's OK

- The file is internally consistent despite length. No section contradicts another section on the same topic.
- The table of contents is implicit (section headings) but clear enough.
- The 507-line length is justified given breadth of content. Not bloat — but could benefit from splitting into reference docs.

---

## 2. Skill Triggers Consistency

**Status: DRIFT** — Severity: high

### opencode.json (live) vs docs/templates/opencode.primitive-agents.jsonc

**MATCH** — All 16 trigger entries identical. Keywords identical. Template is in sync with live config.

| Skill | opencode.json | Template | Match? |
|-------|--------------|----------|--------|
| officecli | 6 keywords | 6 keywords | OK |
| document-writing | 16 keywords | 16 keywords | OK |
| ponytail | 7 keywords | 7 keywords | OK |
| diagnose | 6 keywords | 6 keywords | OK |
| tdd | 4 keywords | 4 keywords | OK |
| verify-evidence | 17 keywords | 17 keywords | OK |
| openviking | 18 keywords | 18 keywords | OK |
| humanizer | 27 keywords | 27 keywords | OK |
| impeccable | 22 keywords | 22 keywords | OK |
| emil-design-eng | 6 keywords | 6 keywords | OK |
| design-system | 3 keywords | 3 keywords | OK |
| ui-to-vue | 3 keywords | 3 keywords | OK |
| review-animations | 3 keywords | 3 keywords | OK |
| php-review | 4 keywords | 4 keywords | OK |
| security-review | 5 keywords | 5 keywords | OK |

### orchestrator.md Skill Triggers table vs opencode.json

**DRIFT** — 13 entries in orchestrator.md table vs 16 in config. Missing:
- `design-system` (config line 67-68)
- `ui-to-vue` (config line 68-69)
- `review-animations` (config line 69-70)
- `openviking` description in table says "memory, remember, store, retrieve..." but config has 18 keywords including "search memory" and "openviking" — minor verbal mismatch

### Trigger keyword overlap

- `laporan` appears in: `officecli`, `document-writing`, `humanizer` — TRIPLE overlap. Intentional? If user says "bikin laporan", 3 skills fire.
- `docx` appears in: `officecli` AND `document-writing` — DOUBLE overlap.
- `bab` appears in: `document-writing` AND `humanizer` — DOUBLE overlap.
- `review` appears in: `ponytail` (orchestrator level) AND `ponytail` (reviewer level) — OK, different agents.

### Broad keywords that may fire too often

- `openviking` triggers on: `start`, `begin`, `task`, `fix`, `implement`, `build`, `create`, `update`, `modify`, `refactor`, `add`, `find` — these are universal task verbs. Almost every task will trigger openviking load. This is intentional (openviking auto-loads on every task) but worth noting.
- `humanizer` triggers on: `write`, `edit`, `draft`, `buat` — every writing task fires humanizer. Intentional but aggressive.
- `impeccable` triggers on: `ui`, `frontend`, `layout`, `design`, `polish`, `visual` — extremely broad. Almost every user message mentioning "design" or "layout" will trigger.

---

## 3. Skill File Consistency

**Status: OK** — with 1 dead file. Severity: low

### Structure check (frontmatter)

All 127+ SKILL.md files in the repo have proper YAML frontmatter with `name` and `description`. No structural drift between skills of same bucket.

### Description vs skill_triggers descriptions

Cross-check of trigger skill descriptions vs SKILL.md frontmatter descriptions:
- All match in intent. No discrepancies in what the skill does.
- Example: `document-writing` trigger says "laporan, dokumen, docx..." and SKILL.md says "academic reports, technical docs, READMEs, BAB sections" — consistent.

### Bucket README coverage

- `engineering/README.md`: Lists all 12 skills with SKILL.md. OK.
- `productivity/README.md`: Lists all 5 skills (includes `document-writing`). OK.
- `misc/README.md`: Lists all 104 skills with SKILL.md. OK.
- `personal/README.md`: Lists all 6 skills (includes `dev-workflow`, `workflow-audit`). OK.

### Top-level README coverage

Lists all active skills (engineering + productivity + misc). OK.

### Dead skill

- `skills/misc/windows-desktop-e2e/` — EMPTY DIRECTORY. No SKILL.md. Not in link-skills.sh. Not in any README. Not symlinked. Exists as a vestige (likely created then abandoned). Should be deleted.

### Skills not in repo (local only)

- `humanizer` — exists at `~/.config/opencode/skills/humanizer/` with its own `.git/` directory. NOT a symlink. Independently managed outside repo.
- `impeccable` — exists at `~/.config/opencode/skills/impeccable/` with its own SKILL.md + reference/ + scripts/ + agents/ subdirs. NOT a symlink. Independently managed.

This means `humanizer` and `impeccable` are NOT versioned in the repo. If the repo is cloned fresh, these skills are missing. The install docs don't mention this gap.

---

## 4. Issue Tracking Drift

**Status: ISSUE** — Severity: medium

### 00-index.md vs actual issue files

All 18 numbered issue files present (01-18). Index list matches file count. Status column matches self-reported status in each file. OK.

### Orphan issue

- `.scratch/issues/done/0001-readme-to-issues-tracker-wording.md` exists but is NOT referenced in `00-index.md`. This was likely created via external tooling (the to-issues workflow) and never tracked in the manual index. Minor.

### Status accuracy

| # | Index Status | File Status | Match? |
|---|-------------|-------------|--------|
| 01 | Skill added... | Protocol added | OK |
| 02 | Implemented in 8a8cd80 | Implemented | OK |
| 03 | Implemented in 8a8cd80 | Implemented | OK |
| 04 | Implemented in 8a8cd80 | Implemented | OK |
| 05 | Implemented in 9f9524c | Implemented | OK |
| 06 | Skipped (YAGNI) | Skipped (YAGNI) | OK |
| 07 | Implemented in 15ff44c | Implemented | OK |
| 08 | Delegation Protocol format | Implemented | OK |
| 09 | ROUTING TABLE added | Implemented | OK |
| 10 | Implemented in 45d02ea | Implemented | OK |
| 11 | humanizer added to skill_triggers | Implemented | OK |
| 12 | Done (by skill) | RESOLVED by skill | OK |
| 13 | Done (by skill) | RESOLVED by skill | OK |
| 14 | **Done (P0, verified)** | DONE (P0) | OK |
| 15 | Done (by skill) | RESOLVED by skill | OK |
| 16 | Done (by skill) | RESOLVED by skill | OK |
| 17 | Done (by skill) | RESOLVED by skill | OK |
| 18 | New (P0+P1+P2) | New | OK |

### Stale issues

- Issues 12/13/15/16/17 are "Done (by skill)" — they are resolved by `document-writing` skill v2. These could be archived to `done/` to reduce clutter. Currently they sit alongside open issues.

### Cross-references

- Issue 14 cross-refs Issue 18 — correctly noted in 14's content ("Issue 18 P1+P2 still open").
- Issue 18 cross-refs Issue 14 — correctly noted ("P0=Issue 14").
- Issues 12/13/15/16/17 cross-ref the `document-writing` skill — correctly done.

### Editable structure

The `doing/`, `done/`, `inbox/`, `ready/` directories exist but are empty (except `done/` with the orphan issue). This Kanban-style structure is not used by the 01-18 numbered issues. Two parallel organizational systems — confusing but not harmful.

---

## 5. Link Integrity

**Status: OK** — Severity: low

### Symlinks in ~/.config/opencode/skills/

All 104 repo-to-global symlinks verified valid. Every link points to a directory with SKILL.md. No broken links.

### Symlinks in ~/.config/opencode/agents/

All 4 links valid:
- `orchestrator.md` -> `agents/orchestrator.md` (92B link, file exists)
- `builder.md` -> `agents/builder.md` (87B link, file exists)
- `reviewer.md` -> `agents/reviewer.md` (88B link, file exists)
- `browser-qa.md` -> `agents/browser-qa.md` (90B link, file exists)

### link-skills.sh ACTIVE_SKILLS vs repo

128 entries in the script. Cross-checked against all active buckets — all engineering (12), productivity (5), misc (104 minus 1 dead = potentially 103), personal (6) — rough total ~127 active + 1 dead perms. The script lists all linked skills correctly. windows-desktop-e2e is correctly excluded.

### link-agents.sh

Simple loop over `agents/*.md`. No hardcoded list. Won't drift as agent files are added/removed. OK.

---

## 6. Documentation Sync

**Status: DRIFT** — Severity: medium

### CHANGELOG.md [Unreleased] section

Accurate. Lines 5-50 cover all recent features, fixes, and cleanups. No missing entries. Format is consistent.

### README.md (top-level)

All skills in engineering/productivity/misc buckets are listed. OK.

### docs/development.md

Does NOT mention:
- `dev-workflow` skill (personal) — the skill that documents repo development workflow
- `workflow-audit` skill (personal) — the skill that audits opencode config state

However, per AGENTS.md rules: personal skills are NOT promoted in top-level docs. So this is INTENTIONAL exclusion, not drift. Mark as OK under current policy.

### docs/workflow.md

- Still references `planner` as a primitive agent (line 20, 128) — `planner` was removed from config (CHANGELOG line 13). DEAD REFERENCE.
- Does NOT reference `document-writing`, `dev-workflow`, or `workflow-audit` skills. But these are skill-level tools, workflow.md is about architecture, not skill catalog — acceptable.

### Sandbox cleanup

AGENTS.md line 59: "Once decisions are promoted to docs/agents/, skills/, or AGENTS.md, delete the corresponding sandbox files."

- `.scratch/issues/` has 18 issue files that were promoted — the original sandbox research files (`.scratch/prd-workflow-pain-points.md` etc.) should be checked.
- `.scratch/research/memory-dreaming-framework.md` (423 lines) — the research that led to Issue 18. Should this be deleted since Issue 18 is promoted? AGENTS.md rule says yes.

---

## 7. YAGNI / Ponytail Check

**Status: ISSUE** — Severity: medium

### Dead weight

1. **`skills/misc/windows-desktop-e2e/`** — Empty directory. No SKILL.md. Not linked. Not referenced. Dead. Delete.

2. **`planner` agent references** — `docs/workflow.md` line 20, 128, and `CONTEXT.md` line 25 still reference `planner` as a primitive agent. Planner was removed from config and agents/. These are stale docs.

3. **Issue 06 (stuck-loop detection)** — Correctly marked as YAGNI (line 24 of 00-index). 0.1% occurrence rate. 8 rules already cover it. No action needed.

### Redundant rules

4. **"Read Before Edit" rule in 3 places** — orchestrator.md (lines 50-56), builder.md (lines 33-35, 57-61). Three copies of essentially the same rule. If one gets updated, the other two drift.

5. **Skill trigger table in orchestrator.md** (lines 133-148) vs opencode.json — the orchestrator table duplicates config. The config is the real trigger. The table is documentation. It's already drifted (missing 3 skills). Either sync it or remove it and point to the config file.

### Contradictory agent rules

6. **Builder "Never plan or design"** (builder.md line 121) vs **builder also reads design.md and picks impeccable sub-commands** (builder.md lines 40-48). Reading design.md and picking sub-commands IS design work. Minor tension, not a blocker.

7. **Orchestrator "delegate, don't do"** (line 374) vs **orchestrator does direct read/grep for trivial lookups** (line 405) — compatible but the line 374 rule is stated absolutely ("It does NOT do..."). Should qualify: "No exploration, building, or browser-qa work directly."

8. **Reviewer "BLOCK" for missing impeccable load on frontend diffs** (reviewer.md line 129). This is aggressive — if reviewer doesn't know whether impeccable was loaded, it defaults to BLOCK. Could cause false positives for minor CSS tweaks.

### Over-engineered patterns

9. **5 "Done by skill" issues (12/13/15/16/17) retained as separate files** — They were consolidated into `document-writing` skill. Keeping them as separate issue files in the same directory as open issues is clutter. The index correctly marks them, but the files themselves could be archived.

10. **Parallel Kanban issue structure** (doing/, done/, inbox/, ready/) — unused except for 1 orphan done file. The 01-18 numbered files use a flat structure. Two organizational systems for issues. Low-harm but unnecessary.

---

## Top 10 Actionable Items (Ranked by Severity)

| # | Severity | Item | File | Fix |
|---|----------|------|------|-----|
| 1 | HIGH | orchestrator.md skill trigger table missing 3 entries (design-system, ui-to-vue, review-animations) | `agents/orchestrator.md` lines 133-148 | Add missing 3 rows, or remove table and point to opencode.json |
| 2 | HIGH | `planner` agent referenced in docs but removed from config | `docs/workflow.md` lines 20, 128; `CONTEXT.md` line 25 | Remove or update to note planner is deprecated |
| 3 | MEDIUM | `skills/misc/windows-desktop-e2e/` empty dir with no SKILL.md | `skills/misc/windows-desktop-e2e/` | Delete directory |
| 4 | MEDIUM | orchestrator.md Preflight Checks duplicate builder.md Read Before Edit | `agents/orchestrator.md` lines 50-56 vs `agents/builder.md` lines 33-61 | Deduplicate: keep in builder.md only, reference from orchestrator |
| 5 | MEDIUM | 5 "Done by skill" issue files clutter index alongside open issues | `.scratch/issues/12,13,15,16,17` | Archive to `.scratch/issues/done/` |
| 6 | MEDIUM | `humanizer` and `impeccable` skills not in repo — fresh clone loses them | Not in repo (local only) | Either add to repo or document in install.md |
| 7 | MEDIUM | Orphan issue not in 00-index | `.scratch/issues/done/0001-readme-to-issues-tracker-wording.md` | Add to index or move to appropriate location |
| 8 | LOW | README still references planner | `docs/workflow.md` line 20 | Update to current agent set |
| 9 | LOW | "Read before edit" triplicated across 2 agent files | orchestrator.md + builder.md | Remove from orchestrator, keep in builder |
| 10 | LOW | Sandbox research file not cleaned up per AGENTS.md | `.scratch/research/memory-dreaming-framework.md` (423 lines) | Delete after verifying content promoted to Issue 18 |

---

## Quick Wins (< 5 min each)

1. **Delete empty dir**: `rm -rf skills/misc/windows-desktop-e2e/`
2. **Fix orchestrator trigger table**: Add 3 missing rows (design-system, ui-to-vue, review-animations) at `agents/orchestrator.md` line 133-148 table
3. **Archive 5 done issues**: `mv .scratch/issues/{12,13,15,16,17}*.md .scratch/issues/done/`
4. **Delete planner reference in workflow.md**: `docs/workflow.md` line 20 — change to "(no longer active)"
5. **Delete planner reference in CONTEXT.md**: `CONTEXT.md` line 25
6. **Add orphan issue to 00-index**: Line for 0001 in `.scratch/issues/00-index.md`
7. **Remove duplicate "Read Before Edit" from orchestrator.md**: lines 50-56, already covered by builder.md

---

## Defer (YAGNI — Looks Like Issues But Don't Matter)

1. **Trigger keyword overlap** — `laporan`, `docx`, `bab` appearing in multiple trigger lists. This is intentional defense-in-depth for the operator's Indonesian-language workflow. Firing 2-3 skills on the same keyword is cheap and harmless.
2. **openviking broad triggers** (fix, implement, build, create...) — Intentional. OpenViking should always be available. The cost of an extra skill load is near-zero.
3. **Kanban issue subdirectories unused** — The `doing/`, `ready/`, `inbox/` dirs are scaffolding for future use. Harmless.
4. **Planner in docs/workflow.md flow diagram** (line 128) — The diagram shows planner as optional, not required. Acceptable as aspirational.
5. **`humanizer` and `impeccable` not in repo** — These are large, independently-developed skills. Vendor-locking them into the repo adds maintenance cost. Documenting the gap is better.

---

## Score Summary

| Category | Score | Notes |
|----------|-------|-------|
| Agent file consistency | 7/10 | orchestrator.md is long but coherent. 3 missing trigger rows. Some duplication with subagents. |
| Skill triggers | 6/10 | Trigger list DRIFT between orchestrator.md table and opencode.json. Template matches live config. |
| Skill file structure | 9/10 | All SKILL.md files properly structured. 1 empty dir (dead). |
| Issue tracking | 7/10 | 18 issues correctly tracked. 1 orphan. 5 archival candidates. |
| Link integrity | 10/10 | All symlinks valid. Link scripts correct. |
| Documentation sync | 7/10 | CHANGELOG accurate. workflow.md has stale planner refs. |
| YAGNI discipline | 6/10 | Empty dir, triplicated rules, stale docs references. |

**Overall: 7.5/10** — Functional but showing growing pains from 20 commits of rapid growth. 7 actionable issues found, 5 of which are < 5 min each. The biggest risk is the drift between the orchestrator.md trigger table and the actual opencode.json triggers (3 missing skills means orchestrator won't know design-system/ui-to-vue/review-animations auto-load).
