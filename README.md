# OpenCode Workflow Kit

> Augmented, not automated. User-in-the-loop profile system. Invoke profiles on demand via SDLC patterns (plan → build → validate). No blind loops, no agentic spirals.

## Philosophy

You at the top. Profiles are tools you invoke — not autonomous workers.

- **Augmented over automated** — AI assists thinking, doesn't replace it
- **You invoke** — decide when to engage each profile
- **SDLC patterns** — planning → engineering → validation, not random looping
- **Observability** — inspect any profile's status via Herdr
- **Token control** — cheap models for planning/validation, powerful ones for engineering
- **Skills on-demand** — user-invocable (`/design audit`) + agent-invoked for repetitive patterns

Inspired by Cloudflare Software Factory, Pi Agents Maker, indydevdan, mattpocock.

## Structure

```
opencode-workflow/
├── profiles/
│   ├── orchestrator/       ← Right hand. Delegates via Herdr.
│   ├── planning/           ← Specs, architecture, research.
│   ├── engineering/        ← Code: frontend/backend/platform.
│   └── validation/         ← QA, security, UI audit.
├── shared/
│   ├── opencode.json       ← Plugins (caveman, ponytail) + 9router provider
│   ├── rules/agents.md     ← Global conventions
│   └── skills/openviking/  ← Shared memory skill
├── .opencode/tools/        ← 9router web search/fetch (symlinked into profiles)
├── install.sh              ← Symlinks + shell aliases
├── spawn-team.zsh          ← Herdr workspace + Ghostty launch
└── AGENTS.md / CODING_STANDARDS.md
```

## Agent Teams

Each profile has a lead + subagents:

```
orchestrator (delegates to all profiles via Herdr)
├── (no subagents — orchestration only)

planning (gpt-5.6-sol)
├── planning-lead
├── product-manager    → to-spec, to-tickets, handoff, write-a-skill
└── ux-researcher      → deep-research, research, handoff

engineering (claude-sonnet-5)
├── engineering-lead
├── frontend-dev       → react, angular, vue, a11y, nextjs, nuxt, vite, design-skill
└── backend-dev        → laravel, django, fastapi, api-connector, tdd, modular-monolith, containers, database-*

validation (gpt-5.6-terra)
├── validation-lead
├── qa-engineer        → tdd, code-review, diagnosing-bugs, ai-regression, click-path-audit
└── security-reviewer  → security-review, bounty-hunter, defi-amm, evm-token, nodejs-keccak256
```

## Model Routing

| Profile | Model | Role |
|---------|-------|------|
| orchestrator | `claude-fable-5` | Delegation, coordination |
| planning | `gpt-5.6-sol` | Specs, research, architecture |
| engineering | `claude-sonnet-5` | Code execution |
| validation | `gpt-5.6-terra` | QA, security, design audit |

All models via 9router gateway (localhost:20128).

## MCP Per Profile

| Profile | MCP |
|---------|-----|
| orchestrator | openviking (memory) |
| planning | openviking (memory) |
| engineering | browser-use, openviking (memory) |
| validation | browser-use, openviking (memory) |

## Custom Tools

| Tool | What | Via |
|------|------|-----|
| `9router-web-search` | Web search (Tavily, Exa, Brave, etc.) | 9router round-robin |
| `9router-web-fetch` | URL → markdown (Jina, Firecrawl, etc.) | 9router round-robin |

Built-in `websearch`/`webfetch` disabled. All profiles use 9router custom tools.

## Plugins

Defined in `shared/opencode.json`, inherited by all profiles:

- **opencode-caveman** — ultra-terse communication mode (token savings)
- **opencode-ponytail** — lazy senior dev style (YAGNI, shortest diff)

## Skills Count

| Profile | Skills |
|---------|--------|
| orchestrator | 18 (workflow-audit, eval, memory-dreaming, setup-matt, etc.) |
| planning | 15 (deep-research, to-spec, to-tickets, domain-modeling, teach, etc.) |
| engineering | 22 (frontend: 8, backend: 13, platform: 6) |
| validation | 20 (qa: 12, security: 7, design-skill) |

## Installation

```bash
# Install profile configs + shell aliases
./install.sh

# Restart shell, then invoke profiles:
oc-orchestrator   # Delegate to others
oc-planning       # Write specs
oc-engineering    # Implement
oc-validation     # Review & audit
```

`install.sh` symlinks profiles to `~/.config/opencode-profiles/` and adds shell aliases.

## Spawning Team Workspace

```bash
# Spawn all profiles in Herdr workspace + Ghostty terminal
./spawn-team.zsh <label> <project-dir>

# Example
./spawn-team.zsh my-project /path/to/project
```

Opens Ghostty with 3 panes (planning | engineering | validation) managed by Herdr.

## Herdr Communication

Orchestrator communicates with profiles via Herdr:

```bash
herdr pane send-text <id> <text>    # send work
herdr pane read <id>                # read results
herdr wait output <id> --match <text>  # wait for completion
```

## Config Merging

OpenCode configs merge, not replace. Precedence: Global → Profile config. Profile overrides global on conflicts.

## Coding Standards

See `CODING_STANDARDS.md` — Ponytail style, OSS-first, no boilerplate, shortest diff wins.

## License

MIT
