---
name: setup-matt-pocock-skills
description: Proactive onboarding for all agent profiles. Asks about each profile's needs (coding style, DESIGN.md, test framework, CI/CD, issue tracker, domain docs) one at a time before writing configs. Run when starting a new project or when profiles are missing context.
disable-model-invocation: true
---

# Setup Matt Pocock's Skills — Profile Onboarding

Proactive setup for all 4 agent profiles. Walk through each section **one at a time**. Explain what it is, why profiles need it, show choices + default, then ask before writing.

---

## Section A — Project Basics

> Explainer: Profiles need to know basic project info to route work correctly.

Ask one at a time:

1. **Project name** — used for OV memory tags (`<project-name>:agent-name:`) and workspace labels
2. **Package manager** — npm, yarn, pnpm, or bun (affects backend-dev dependency commands)
3. **Language** — TypeScript, Python, PHP, Go, Rust, or mixed (affects which engineering skills load)
4. **Frontend framework** — React, Vue, Next.js, Nuxt, none, or mixed
5. **Backend framework** — Laravel, Django, FastAPI, Express, none, or mixed

---

## Section B — Coding Style (Engineering Profile)

> Explainer: frontend-dev and backend-dev need to know your coding conventions so they generate consistent code. Backend-dev enforces TDD for logical code. Frontend-dev runs `/design audit --polish` before handoff.

Ask one at a time:

1. **Naming conventions** — camelCase, PascalCase, snake_case, kebab-case
2. **CSS approach** — Tailwind, CSS Modules, styled-components, vanilla CSS, none
3. **Import style** — absolute paths, relative paths, barrel exports
4. **Error handling pattern** — try/catch, Result types, custom error classes
5. **API style** — REST, GraphQL, tRPC, custom

If the user is unsure, propose defaults:
- camelCase for JS/TS variables/functions
- PascalCase for components/classes
- Tailwind for CSS
- REST for APIs
- try/catch for error handling

---

## Section C — DESIGN.md (Frontend Projects)

> Explainer: frontend-dev reads DESIGN.md as a mandatory reference. If design tokens are missing, frontend-dev reports "BLOCKED: missing design token". The UX researcher writes the UX section. The design-skill (`/design build --document`) can generate one from your codebase.

Ask:

1. **Does this project need DESIGN.md?** (y/n)
2. **If yes**: Who creates the initial design tokens? (design-skill, manual, or existing file)
3. **Design token format** — CSS variables, JSON tokens, Tailwind config, or existing standard

If the user isn't ready for DESIGN.md, note: "You can generate it later with `/design build --document` inside the engineering profile."

---

## Section D — Test Framework (Engineering + Validation)

> Explainer: backend-dev uses TDD (red-green-refactor). QA-engineer writes integration + E2E tests. Frontend-dev writes unit tests. Profiles need to know which tools to use.

Ask one at a time:

1. **Unit test framework** — vitest, jest, pytest, PHPUnit, none
2. **E2E test framework** — Playwright, Cypress, none
3. **Test runner command** — `npm test`, `npm run test`, `pytest`, `php artisan test`, custom
4. **Coverage target** — percentage (default: 80%)

---

## Section E — Issue Tracker (Planning Profile)

> Explainer: The "issue tracker" is where issues live for this repo. Skills like `to-spec`, `triage`, `to-tickets`, and `wayfinder` read from and write to it. Pick the place you actually track work.

Default: GitHub (if `git remote` points to GitHub). Offer options:

- **GitHub** — `gh` CLI (default if GitHub remote)
- **GitLab** — `glab` CLI (if GitLab remote)
- **Local markdown** — files under `.scratch/<feature>/` (solo projects)
- **Other** (Jira, Linear) — describe workflow in one paragraph

When user picks an option, write `docs/agents/issue-tracker.md` using the relevant template.

---

## Section F — Triage Labels (Planning Profile)

> Explainer: The `triage` skill moves issues through a state machine. It needs labels that match your actual issue tracker config. Defaults work for most repos.

Five canonical roles (default = each equals its name):

- `needs-triage` — maintainer needs to evaluate
- `needs-info` — waiting on reporter
- `ready-for-agent` — fully specified, AFK-ready
- `ready-for-human` — needs human implementation
- `wontfix` — will not be actioned

Ask: "Any overrides?" If existing labels differ, map them. Defaults are fine otherwise.

Write `docs/agents/triage-labels.md`.

---

## Section G — Domain Docs (Planning + Engineering)

> Explainer: Skills like `improve-codebase-architecture`, `domain-modeling`, and `grill-with-docs` read CONTEXT.md for domain language and ADRs for past decisions. They need to know the layout.

Confirm:
- **Single-context** — one CONTEXT.md at root. Default for most repos.
- **Multi-context** — CONTEXT-MAP.md at root, per-context files in subdirs. For monorepos.

Write `docs/agents/domain.md`.

---

## Section H — CI/CD Setup (Engineering + Validation)

> Explainer: Engineering-lead and validation-lead need to know how this project ships. QA-engineer runs tests before deploy. Security-reviewer needs access to secrets scanning.

Ask one at a time:

1. **CI platform** — GitHub Actions, GitLab CI, local scripts, none
2. **Deploy command** — `npm run deploy`, `vite build && rsync`, custom, manual
3. **Pre-deploy checks** — lint → test → build → deploy, or custom pipeline
4. **Secrets management** — env vars, vault, CI secrets, none

---

## Section I — Memory & Workspace (Orchestrator)

> Explainer: The orchestrator uses OV memory tagged with `<project-name>:orchestrator:`. Herdr workspaces use the project label. Profile access uses `oc-<name>` aliases.

Ask:

1. **Herdr workspace label** — defaults to project name
2. **OV memory namespace** — defaults to project name slug

These are usually fine with defaults.

---

## Section J — Confirm and write

Show the user a draft of:

1. `docs/agents/issue-tracker.md`
2. `docs/agents/triage-labels.md`
3. `docs/agents/domain.md`
4. `.opencode/opencode.json` — if this repo has one, update agent config with paths

Let them edit before writing.

Then write all files and report:
```
Profile setup complete.

Planner: issue tracker + triage labels + domain docs → docs/agents/
Engineer: coding style + DESIGN.md hint + test framework → (applied when delegating)
Validator: CI/CD + security checklist → docs/agents/security-review.md

You can edit these at any time in docs/agents/.
Re-run this skill to change any setting.
```
