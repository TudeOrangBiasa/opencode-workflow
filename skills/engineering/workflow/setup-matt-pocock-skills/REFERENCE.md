# Setup Matt Pocock's Skills — Reference

> Full process details. See SKILL.md for quick start.

## Process

### 1. Explore

Look at current repo. Read whatever exists; don't assume:

- `git remote -v` and `.git/config` — is this a GitHub repo?
- `AGENTS.md` and `CLAUDE.md` — which exists? Has `## Agent skills` section?
- `CONTEXT.md` and `CONTEXT-MAP.md`
- `docs/adr/` and any `src/*/docs/adr/`
- `docs/agents/` — prior output from this skill?
- `.scratch/` — local-markdown issue tracker sign
- `skills/` and `.opencode/` — meta-repo detection triggers

### 2. Present findings and ask

Summarise what's present and missing. Walk user through decisions **one at a time**. Start each with plain-language explainer. Show choices and default.

**Section A — Issue tracker.** GitHub (default if remote is GitHub), GitLab, Local markdown, or Other.

**Section B — Triage labels.** Five canonical roles: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. User can override strings.

**Section C — Domain docs.** Single-context (one CONTEXT.md) or multi-context (CONTEXT-MAP.md + per-context files).

**Section D — Design reference.** Single-domain or multi-domain. Mandatory — scaffold `design.md` even if minimal.

If meta-repo mode detected, ask one more section:

**Section E — Meta-repo config.** Skill_triggers, plugin health, agent sync, bucket README links.

### 3. Confirm and edit

Show draft of:
- `## Agent skills` block for AGENTS.md
- Contents of `docs/agents/issue-tracker.md`, `triage-labels.md`, `domain.md`, `design.md`

Let them edit before writing.

### 4. Write

**Pick file:** edit `CLAUDE.md` if exists, else `AGENTS.md`. Never create one if other exists.

If `## Agent skills` block exists, update in-place. Don't overwrite surrounding sections.

Write docs files using seed templates.

**Meta-repo mode:** JANGAN overwrite existing user-modified files. Insert only. Report gaps in config audit.

### 5. Done

Tell user setup complete. Mention they can edit `docs/agents/*.md` directly later.

---

## Standard Mode

Default behavior. Scaffolds:

- `docs/agents/issue-tracker.md` — from issue-tracker-{github,gitlab,local}.md template
- `docs/agents/triage-labels.md` — from triage-labels.md template
- `docs/agents/domain.md` — from domain.md template
- `docs/agents/design.md` — from design.md template
- `## Agent skills` block in AGENTS.md

---

## Meta-Repo Mode

Detected when: repo has **both** top-level `skills/` directory AND `.opencode/` directory.

### Exploration Checklist (additional)

1. **Plugins** (`ls .opencode/plugins/`):
   - Raw `.ts` without compiled `.js` in `out/`? → warn: OpenCode only loads `.js`
   - Helpers/tests in root plugins/ (not `internal/`)? → warn: auto-discover will fail
   - Shared helpers in `internal/`? → OK if present

2. **Agent files** (`ls agents/` vs `~/.config/opencode/agents/`):
   - Files match? If diverged, report sync status

3. **opencode.json skill_triggers**:
   - Common expected: diagnose, tdd, verify-evidence, openviking, security-review, humanizer, memory-dreaming
   - Often missing: triage, to-spec, to-tickets, wayfinder, zoom-out, improve-codebase-architecture

4. **docs/agents/ existing**:
   - Files present vs expected. Report discrepancies.
   - invocation.md, writing-docs.md = custom additions → preserve

5. **Issue tracker**:
   - `.scratch/issues/` structure: inbox/active/done
   - `00-index.md` dependency graph
   - Pending inbox items

6. **Pre-flight tools** (check if possible):
   - officecli, drawio, chrome-devtools MCP, OpenViking, exa web search

### Write Behavior

- **AGENTS.md**: INSERT `## Agent skills` block after `## OpenCode Compatibility` section. Do NOT overwrite existing sections.
- **docs/agents/**: Only create missing files. Report discrepancy if domain.md contains design content. Leave invocation.md, writing-docs.md untouched.
- **opencode.json**: Do NOT edit. Report missing skill_triggers only.
- **Agent files**: Do NOT edit. Report sync status.

### Config Audit Output

Print end-of-setup audit:

```
## Setup Complete — Meta-Repo Audit

### Config
- [OK]  agents/ → ~/.config/opencode/agents/ — in sync
- [OK]  opencode.json plugins — N registered
- [WARN] skill_triggers missing: [list]
- [OK]  docs/agents/ — N files present, N missing (created)
- [OK]  0 broken symlinks in ~/.config/opencode/skills/

### Plugin health
- [OK]  taste.js — compiled
- [OK]  lesson-injector.js — compiled
- [OK]  internal/ helpers — not auto-discovered
- [INFO] No raw .ts without compiled .js in plugins/ root

### Pre-flight
- [OK]  OpenViking — connected
- [UNCHECKED] officecli, chrome-devtools, drawio, exa
```

### Edge Cases

- **False positive**: repo has `skills/` but not for skill management → confirm with user before meta-repo mode
- **Ambiguous**: repo has `.opencode/` but no `skills/` → standard mode (correct)
- **Existing block**: if `## Agent skills` exists, update in-place; do NOT duplicate

---

## Pre-flight Checks

Add pre-flight sections to `docs/agents/preflight.md` (or AGENTS.md if skipping docs layout).

### OfficeCLI (`.docx`/`.pptx`/`.xlsx`)

```markdown
## OfficeCLI preflight

Before delegating any `.docx`/`.pptx`/`.xlsx` work, verify OfficeCLI:

```bash
officecli --version       # or: officecli mcp
```

If `Could not load file or assembly 'DocumentFormat.OpenXml.Framework'`:
- Install: `dotnet tool install --global OpenXml.Framework`
- Re-verify before proceeding
```
```

Why: missing .NET deps cascade into bash workarounds (unzip → sed → python3+lxml).

### Browser-QA re-snapshot

If project uses `validator` with chrome-devtools MCP:

```markdown
## Browser-QA re-snapshot

On chrome-devtools click/fill failure, ALWAYS re-snapshot first.
Element uid is stale after page state changes. Do NOT retry cached uid.
```

### exa MCP rate-limiting

If scout/orchestrator uses `exa_web_search_exa`:

```markdown
## exa MCP rate limit

Max 10 calls per session. After limit, fall back to `webfetch`
with cached URL (check OpenViking `viking://cache/web/...`).
```

---

## Seed Templates

### Standard Mode

- `issue-tracker-github.md` — GitHub issue tracker
- `issue-tracker-gitlab.md` — GitLab
- `issue-tracker-local.md` — local markdown
- `triage-labels.md` — label mapping
- `domain.md` — domain doc consumer rules
- `design.md` — design reference seed template

### Meta-Repo Mode

Same templates but with meta-repo adjustments:

- **issue-tracker-local.md** — `.scratch/issues/<NN>-<slug>.md` layout with index and dependency graph
- **triage-labels.md** — canonical 5 roles + done, with mapping column
- **domain.md** — domain language + ADR only (separate from design)
- **design.md** — minimal: principles + anti-patterns + consumer rules. No tokens (meta-repo has no UI project unless specified)
