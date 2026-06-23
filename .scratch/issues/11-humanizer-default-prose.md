# Issue 11: Default humanizer + caveman for prose writing

## Status

Done. Implemented in same commit cycle as Issues 01/08/09 root-cause fix.

## Pain (verified with data)

In `dbl-data-management` project, user had to manually list 22 forbidden AI words in 3 separate BAB-building prompts:

> "No 'stands as', 'serves as', em dashes (—), 'pivotal', 'vibrant', 'intricate', 'tapestry', 'testament', 'enduring', 'underscores', 'highlights', 'evolving landscape'..."

The `humanizer` skill **exists** at `~/.config/opencode/skills/humanizer/` but was **not in `opencode.json` `skill_triggers`**. Same anti-pattern as Issue 01 (openviking 0% firing).

Analysis of actual generated content (`KONTEN_BAB_V_VI_VII.md`, 522 lines):
- 22 banned words count: **0** (humanizer rules worked WHEN applied)
- 7 sentences appeared 2+ times (repetition slop — humanizer doesn't catch this)

User philosophy: "Human itu mahluk simple, baca hal yang ringkas to the point."

## Fix

### 1. Add `humanizer` to `skill_triggers` (1 config line)

27 prose-intent keywords:
```
write, edit, draft, tulis, nulis, buat, readme, docs, documentation,
dokumentasi, laporan, dokumen, essay, paper, artikel, bab, konten,
paragraph, prose, narasi, rangkum, summarize, explain, jelaskan,
caption, label, description
```

Auto-loads when user says "tulis README", "buat laporan", "edit docs", etc.

### 2. Extend humanizer SKILL.md (5 lines added)

Added "Quick Reference: Top 12 Patterns to Avoid" at the top — minimum rules the agent must follow when skill loads. Plus "Repetition Check" section with `sort | uniq -d` bash one-liner.

### 3. Add prose-default rule to `agents/builder.md` + `agents/orchestrator.md`

- **builder.md**: "For prose writing (docs, README, reports, articles, captions, labels): default to humanizer + caveman style. DO NOT humanize: code, SQL, JSON, YAML, commit messages, legal/contracts."
- **orchestrator.md**: "Prose writing (README, docs, articles, captions, labels) → humanizer (auto-loads on write/edit intent, default to caveman style). Diagram creation (.drawio) → drawio (terse labels, no decorative text)."

### 4. Update docs template

`docs/templates/opencode.primitive-agents.jsonc` updated to match.

## What this is NOT

- Not a new skill. Use existing humanizer.
- Not a rewrite of humanizer. Just adds 1 section + extends description.
- Not a hard default. Smart default: applies to human-facing prose, NOT code/SQL/JSON.
- Not a plugin. caveman is already a global plugin (`"plugin": ["caveman"]` in `opencode.json`); the gap was that prose-writing didn't reach that code path.

## Verification

- Restart opencode
- Say "tulis README untuk X" → `humanizer` should auto-load → check that forbidden words don't appear
- Say "buat laporan BAB X" → check for repetition (sort | uniq -d on sentences)
- Build a React component → should NOT trigger humanizer (code, not prose)

## Files

| File | Change |
|------|--------|
| `~/.config/opencode/opencode.json` | +1 trigger (humanizer, 27 keywords) |
| `~/.config/opencode/skills/humanizer/SKILL.md` | +Quick Reference section, +Repetition section, +Default Style section, updated description (LOCAL — not in repo) |
| `docs/templates/opencode.primitive-agents.jsonc` | +1 trigger |
| `agents/orchestrator.md` | +humanizer in skill_triggers table, +prose default in delegation heuristic |
| `agents/builder.md` | +prose default in "Read Context" section |
| `CHANGELOG.md` | +Unreleased entry |

**Note**: `humanizer` is not in this repo — it's a separately-installed skill at `~/.config/opencode/skills/humanizer/`. The SKILL.md change is local-only and will be lost if humanizer is reinstalled. To make it durable, future work: copy `~/.config/opencode/skills/humanizer/SKILL.md` to `skills/misc/humanizer/SKILL.md` in repo, add to `scripts/link-skills.sh`. Out of scope for this fix.

## Out of scope

- Drawing skill labels: mentioned in orchestrator delegation heuristic but not enforced via drawio skill update (skip for now, can add later if needed)
- Auto-humanize on commit messages: explicitly excluded (conventional commit style, not humanizer)
- Diagram text style enforcement: mentioned but not in drawio skill yet

## Notes

ROI: 1-time cost ~15 min, saves ~25 lines of user manual correction per BAB session. Break-even after 1 session.
