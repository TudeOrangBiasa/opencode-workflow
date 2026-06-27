# Setup Matt Pocock's Skills — Reference

> Full process details. See SKILL.md for quick start.

## Process

### 1. Explore

Read current repo state: git remote, AGENTS.md, CONTEXT.md, design.md, docs/adr/, docs/agents/, .scratch/, framework indicators.

### 2. Present findings and ask

Walk user through four decisions one at a time:

**Section A — Issue tracker.** GitHub (default if remote is GitHub), GitLab, Local markdown, or Other.

**Section B — Triage label vocabulary.** Five canonical roles: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. User can override strings.

**Section C — Domain docs.** Single-context (one CONTEXT.md) or multi-context (CONTEXT-MAP.md + per-context files).

**Section D — Design reference.** Single-domain or multi-domain. Prefer `design teach` or `design document`. Fallback: seed template.

### 3. Confirm and edit

Show draft of `## Agent skills` block and docs files.

### 4. Write

Edit or create AGENTS.md. Write docs/agents/ files using seed templates.

## Tool Pre-flight Checks

Add pre-flight sections to docs/agents/preflight.md for OfficeCLI, chrome-devtools, exa MCP rate limiting.

## Seed Templates

- issue-tracker-github.md — GitHub issue tracker setup
- issue-tracker-gitlab.md — GitLab
- issue-tracker-local.md — local markdown
- triage-labels.md — label mapping
- domain.md — domain doc consumer rules
- design.md — design reference seed template
