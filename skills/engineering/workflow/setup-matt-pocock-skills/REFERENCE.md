# Setup Matt Pocock's Skills — Reference

> Full process details. See SKILL.md for quick start.

## Process

### 1. Explore

Look at the current repo to understand its starting state. Read whatever exists; don't assume:

- `git remote -v` and `.git/config` — is this a GitHub repo? Which one?
- `AGENTS.md` and `CLAUDE.md` at the repo root — does either exist? Is there already an `## Agent skills` section in either?
- `CONTEXT.md` and `CONTEXT-MAP.md` at the repo root
- `docs/adr/` and any `src/*/docs/adr/` directories
- `docs/agents/` — does this skill's prior output already exist?
- `.scratch/` — sign that a local-markdown issue tracker convention is already in use

### 2. Present findings and ask

Summarise what's present and what's missing. Walk user through four decisions **one at a time** — present a section, get answer, then move to next. Don't dump all at once.

Assume the user does not know what these terms mean. Each section starts with a short explainer (what it is, why these skills need it, what changes if they pick differently). Then show the choices and the default.

**Section A — Issue tracker.** GitHub (default if remote is GitHub), GitLab, Local markdown, or Other. If GitHub/GitLab, ask follow-up about PRs as a request surface.

**Section B — Triage label vocabulary.** Five canonical roles: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. User can override strings. Default: each role's string equals its name.

**Section C — Domain docs.** Single-context (one CONTEXT.md) or multi-context (CONTEXT-MAP.md + per-context files).

**Section D — Design reference.** Single-domain or multi-domain. Prefer `design teach` or `design document`. Fallback: seed template.

### 3. Confirm and edit

Show the user a draft of:
- The `## Agent skills` block to add to AGENTS.md
- The contents of `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`

Let them edit before writing.

### 4. Write

**Pick the file to edit:**
- If `CLAUDE.md` exists, edit it.
- Else if `AGENTS.md` exists, edit it.
- If neither exists, ask the user which one to create — don't pick for them.

Never create `AGENTS.md` when `CLAUDE.md` already exists (or vice versa) — always edit the one that's already there.

If an `## Agent skills` block already exists in the chosen file, update its contents in-place rather than appending a duplicate. Don't overwrite user edits to the surrounding sections.

Then write the three docs files using seed templates.

### 5. Done

Tell the user setup is complete and which engineering skills will now read from these files. Mention they can edit `docs/agents/*.md` directly later — re-running this skill is only necessary if they want to switch issue trackers or restart from scratch.

## Tool Pre-flight Checks

Add pre-flight sections to docs/agents/preflight.md for OfficeCLI, chrome-devtools, exa MCP rate limiting.

## Seed Templates

- issue-tracker-github.md — GitHub issue tracker setup
- issue-tracker-gitlab.md — GitLab
- issue-tracker-local.md — local markdown
- triage-labels.md — label mapping
- domain.md — domain doc consumer rules
- design.md — design reference seed template
