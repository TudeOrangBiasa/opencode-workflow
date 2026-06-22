---
name: setup-matt-pocock-skills
description: Sets up an `## Agent skills` block in AGENTS.md and `docs/agents/` so the engineering skills know this repo's issue tracker (GitHub or local markdown), triage label vocabulary, domain doc layout, and design reference. Run before first use of `to-issues`, `to-prd`, `triage`, `diagnose`, `tdd`, `improve-codebase-architecture`, `zoom-out`, or any UI work — or if those skills appear to be missing context about the issue tracker, triage labels, domain docs, or design tokens.
disable-model-invocation: true
---

# Setup Matt Pocock's Skills

Scaffold the per-repo configuration that the engineering skills assume:

- **Issue tracker** — where issues live (GitHub by default; local markdown is also supported out of the box)
- **Triage labels** — the strings used for the five canonical triage roles
- **Domain docs** — where `CONTEXT.md` and ADRs live, and the consumer rules for reading them
- **Design reference** — `design.md` with tokens, anti-patterns, and component rules that builder, browser-qa, and reviewer load before any UI work

This is a prompt-driven skill, not a deterministic script. Explore, present what you found, confirm with the user, then write.

## Process

### 1. Explore

Look at the current repo to understand its starting state. Read whatever exists; don't assume:

- `git remote -v` and `.git/config` — is this a GitHub repo? Which one?
- `AGENTS.md` at the repo root — does it exist? Is there already an `## Agent skills` section?
- `CONTEXT.md` and `CONTEXT-MAP.md` at the repo root
- `design.md` at the repo root or in `docs/agents/` — does it already exist? If so, preserve it.
- `docs/adr/` and any `src/*/docs/adr/` directories
- `docs/agents/` — does this skill's prior output already exist?
- `.scratch/` — sign that a local-markdown issue tracker convention is already in use
- Framework indicators: `tailwind.config.*`, `sass/_variables.scss`, `theme.json`, `bootstrap` import — these tell us the design token source

### 2. Present findings and ask

Summarise what's present and what's missing. Then walk the user through the four decisions **one at a time** — present a section, get the user's answer, then move to the next. Don't dump all four at once.

Assume the user does not know what these terms mean. Each section starts with a short explainer (what it is, why these skills need it, what changes if they pick differently). Then show the choices and the default.

**Section A — Issue tracker.**

> Explainer: The "issue tracker" is where issues live for this repo. Skills like `to-issues`, `triage`, `to-prd`, and `qa` read from and write to it — they need to know whether to call `gh issue create`, write a markdown file under `.scratch/`, or follow some other workflow you describe. Pick the place you actually track work for this repo.

Default posture: these skills were designed for GitHub. If a `git remote` points at GitHub, propose that. If a `git remote` points at GitLab (`gitlab.com` or a self-hosted host), propose GitLab. Otherwise (or if the user prefers), offer:

- **GitHub** — issues live in the repo's GitHub Issues (uses the `gh` CLI)
- **GitLab** — issues live in the repo's GitLab Issues (uses the [`glab`](https://gitlab.com/gitlab-org/cli) CLI)
- **Local markdown** — issues live as files under `.scratch/<feature>/` in this repo (good for solo projects or repos without a remote)
- **Other** (Jira, Linear, etc.) — ask the user to describe the workflow in one paragraph; the skill will record it as freeform prose

**Section B — Triage label vocabulary.**

> Explainer: When the `triage` skill processes an incoming issue, it moves it through a state machine — needs evaluation, waiting on reporter, ready for an AFK agent to pick up, ready for a human, or won't fix. To do that, it needs to apply labels (or the equivalent in your issue tracker) that match strings *you've actually configured*. If your repo already uses different label names (e.g. `bug:triage` instead of `needs-triage`), map them here so the skill applies the right ones instead of creating duplicates.

The five canonical roles:

- `needs-triage` — maintainer needs to evaluate
- `needs-info` — waiting on reporter
- `ready-for-agent` — fully specified, AFK-ready (an agent can pick it up with no human context)
- `ready-for-human` — needs human implementation
- `wontfix` — will not be actioned

Default: each role's string equals its name. Ask the user if they want to override any. If their issue tracker has no existing labels, the defaults are fine.

**Section C — Domain docs.**

> Explainer: Some skills (`improve-codebase-architecture`, `diagnose`, `tdd`) read a `CONTEXT.md` file to learn the project's domain language, and `docs/adr/` for past architectural decisions. They need to know whether the repo has one global context or multiple (e.g. a monorepo with separate frontend/backend contexts) so they look in the right place.

Confirm the layout:

- **Single-context** — one `CONTEXT.md` + `docs/adr/` at the repo root. Most repos are this.
- **Multi-context** — `CONTEXT-MAP.md` at the root pointing to per-context `CONTEXT.md` files (typically a monorepo).

**Section D — Design reference.**

> Explainer: When builder, browser-qa, or reviewer touch UI, they need to know the project's design tokens, anti-patterns, and component rules. Without a design reference, they invent generic "AI slop" UI. The `design.md` file is the canonical place for this — it's loaded as context before any UI work.

**Prefer the `impeccable` skill for this.** It has sub-commands that auto-generate the design reference:

- `impeccable teach` — gathers context (PRODUCT.md + DESIGN.md) for greenfield / new project
- `impeccable document` — auto-extracts DESIGN.md from existing app (screenshot / CSS / codebase)

These are richer than filling the template manually. Recommend them first.

Fallback (if user can't / doesn't want to run impeccable): the design.md seed template in this skill folder.

Confirm:

- **Single-domain** — one `design.md` at repo root or in `docs/agents/`. One design language covers the whole repo.
- **Multi-domain** — `design-map.md` at the root + per-domain `design.md` files (e.g. admin vs. public site, or monorepo with separate frontend apps).

If the repo already has a `design.md`, preserve it. Otherwise, choose:

- **Recommended**: run `impeccable teach` (greenfield) or `impeccable document` (existing app)
- **Fallback**: seed from the design template in this skill folder and ask the user to fill in the tokens

Other extractable sources (handy if `impeccable` is unavailable):

- Tailwind config → extract color, spacing, radius tokens
- Sass/SCSS variables → same
- CSS custom properties (`--bs-*`, `--primary`, etc.) → same
- shadcn/ui config → extract from `components.json`
- Bootstrap 5.3+ → read CSS variables from compiled stylesheet

### 3. Confirm and edit

Show the user a draft of:

- The `## Agent skills` block to add to `AGENTS.md`
- The contents of `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`, and (if creating) `docs/agents/design.md` or `design-map.md`

Let them edit before writing.

### 4. Write

**Pick the file to edit:**

- If `AGENTS.md` exists, edit it.
- If it does not exist, create `AGENTS.md`.

Do not create or edit instruction files for other agent runtimes in this OpenCode workflow repo.

If an `## Agent skills` block already exists in the chosen file, update its contents in-place rather than appending a duplicate. Don't overwrite user edits to the surrounding sections.

The block:

```markdown
## Agent skills

### Issue tracker

[one-line summary of where issues are tracked]. See `docs/agents/issue-tracker.md`.

### Triage labels

[one-line summary of the label vocabulary]. See `docs/agents/triage-labels.md`.

### Domain docs

[one-line summary of layout — "single-context" or "multi-context"]. See `docs/agents/domain.md`.

### Design reference

[one-line summary — "single-domain" or "multi-domain"]. See `docs/agents/design.md` (or `docs/agents/design-map.md` for multi-domain).
```

Then write the docs files using the seed templates in this skill folder as a starting point:

- [issue-tracker-github.md](./issue-tracker-github.md) — GitHub issue tracker
- [issue-tracker-gitlab.md](./issue-tracker-gitlab.md) — GitLab issue tracker
- [issue-tracker-local.md](./issue-tracker-local.md) — local-markdown issue tracker
- [triage-labels.md](./triage-labels.md) — label mapping
- [domain.md](./domain.md) — domain doc consumer rules + layout
- [design.md](./design.md) — design reference (tokens, anti-patterns, components) — seed template

For "other" issue trackers, write `docs/agents/issue-tracker.md` from scratch using the user's description.

If multi-domain design, also write `docs/agents/design-map.md` as a pointer file with the list of per-domain `design.md` paths.

### 5. Done

Tell the user the setup is complete and which engineering skills will now read from these files. Mention they can edit `docs/agents/*.md` directly later — re-running this skill is only necessary if they want to switch issue trackers, add a new design domain, or restart from scratch.

After setup, the `builder`, `browser-qa`, and `reviewer` agents will auto-read `design.md` before any UI work. The `impeccable` and `emil-design-eng` skills are loaded alongside as UI craft context.

## Tool Pre-flight Checks

Some external tools the agents depend on (OfficeCLI, drawio desktop, exa MCP, chrome-devtools) have prerequisite checks that should pass before delegating work that uses them. Add a "Pre-flight" section to `docs/agents/preflight.md` for each tool your project uses.

### OfficeCLI (`.docx`/`.pptx`/`.xlsx` work)

Add a `## OfficeCLI preflight` section in the project's `docs/agents/preflight.md` (or `AGENTS.md` if you skip the docs layout):

```markdown
## OfficeCLI preflight

Before delegating any `.docx`/`.pptx`/`.xlsx` work, verify OfficeCLI is working:

```bash
officecli --version       # or: officecli mcp
```

If this fails with `Could not load file or assembly 'DocumentFormat.OpenXml.Framework'`:
- The .NET OfficeCLI tool is missing the OpenXml framework dependency
- Install: `dotnet tool install --global OpenXml.Framework` (or per the tool's install docs)
- Re-verify with the version check above
- Do NOT proceed with .docx delegation until pre-flight passes
```

Why: missing .NET deps cascade into 100+ bash workarounds per session (unzip → sed → python3+lxml) because the agent doesn't know officecli is broken until the first call fails. The pre-flight catches it BEFORE delegation.

### Browser-QA re-snapshot (chrome-devtools)

If the project uses `browser-qa` with chrome-devtools MCP, add this to the same preflight doc:

```markdown
## Browser-QA re-snapshot rule

On chrome-devtools click/fill/fill_form failure, ALWAYS re-snapshot the page first.
The element uid is stale after page state changes (load, animation, scroll). Do
NOT retry with the cached uid — that loops on "Element uid X no longer exists".
```

### exa MCP rate-limiting

If scout or orchestrator uses `exa_web_search_exa`, add:

```markdown
## exa MCP rate limit

Max 10 `exa_web_search_exa` calls per session. After hitting the limit, fall back
to `webfetch` with a cached URL (check OpenViking `viking://cache/web/...` first).
```

These pre-flight checks are agent-facing — the orchestrator should read them before delegating.
