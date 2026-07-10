---
name: setup-matt-pocock-skills
description: Use when first-time setup of repo-aware engineering skills (diagnose, tdd, triage, to-prd, to-issues, improve-codebase-architecture, zoom-out). Use when user says setup matt pocock, set up engineering skills, configure repo skills. Run once per repo to write `## Agent skills` block in AGENTS.md and `docs/agents/` layout.
disable-model-invocation: true
---
# Setup Matt Pocock's Skills

This is a prompt-driven skill, not a deterministic script. Explore, present what you found, confirm with the user, then write.

Scaffold the per-repo configuration that the engineering skills assume:

- **Issue tracker** — where issues live (GitHub by default; local markdown is also supported out of the box)
- **Triage labels** — the strings used for the five canonical triage roles
- **Domain docs** — where `CONTEXT.md` and ADRs live, and the consumer rules for reading them
- **Design reference** — `design.md` with tokens, anti-patterns, and component rules that builder, reviewer, and validator load before any UI work

For full process details and templates, see [REFERENCE.md](REFERENCE.md).

## REFERENCE.md Contents

| Section                                                       | Description                                |
| ------------------------------------------------------------- | ------------------------------------------ |
| [Explore](REFERENCE.md#1-explore)                                | Checklist of files to read                 |
| [Issue Tracker](REFERENCE.md#section-a--issue-tracker)           | GitHub vs GitLab vs Local vs Other         |
| [Triage Labels](REFERENCE.md#section-b--triage-label-vocabulary) | Five canonical role labels                 |
| [Domain Docs](REFERENCE.md#section-c--domain-docs)               | Single vs multi-context                    |
| [Design Reference](REFERENCE.md#section-d--design-reference)     | Single vs multi-domain, design              |
| [Write](REFERENCE.md#4-write)                                    | AGENTS.md block + docs files               |
| [Pre-flight](REFERENCE.md#tool-pre-flight-checks)                | OfficeCLI, chrome-devtools, exa rate limit |

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

If the project uses `validator` with chrome-devtools MCP, add this to the same preflight doc:

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
