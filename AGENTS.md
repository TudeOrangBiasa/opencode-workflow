1. OpenCode Workflow Kit — Profile-Based Agent Teams
2. Augmented > Automated. This is user's right hand, not automation. Skills wait for user.
3. This repo is developed for OpenCode only. Do not add compatibility surfaces for other agent runtimes unless a task explicitly asks for it.

## Role

Source of truth for OpenCode agent profiles in `profiles/` and shared config in `shared/`. 4 profiles, 10 agents, skills per profile, Herdr orchestration.

## Scope

- Profile configs in `profiles/`, shared config in `shared/`.
- Plugins live globally (`~/.config/opencode`). No plugins in this repo.
- Do not edit `~/.config/opencode` unless user asks.

## Model Routing

| Profile | Model | Role |
|---------|-------|------|
| orchestrator | `9router/oc-free-orchest` | Delegation, coordination |
| planning | `9router/oc-go-plan` | Specs, research, architecture |
| engineering | `9router/oc-go-eng` | Code execution |
| validation | `9router/oc-go-valid` | QA, security, design audit |

## MCP Per Profile

| Profile | MCP |
|---------|-----|
| orchestrator | openviking (memory) |
| planning | exa (research), openviking (memory) |
| engineering | browser-use, openviking (memory) |
| validation | browser-use, openviking (memory) |

## Engineering Principles

- **Ponytail**: no boilerplate comments, code is documentation, shortest diff. YAGNI always.
- **OSS-first**: prefer existing open source over custom builds. Use opensrc (vercel-labs/opensrc) to find packages.
- **Frontend UI**: SHADCN, Material UI, dashboard templates. Never implement UI without DESIGN.md.
- **PR workflow**: branch → PR → main. No direct pushes to main.
- **Documentation**: agents write markdown to `docs/` — docsify + Redoc for rendering. User has ADHD/dyslexia — docs must be clear, bulleted, short.
- **design-skill**: kills AI slop. Auto-invoke before any frontend work.

## Config Merging

OpenCode configs merge, not replace. Precedence: Global → Profile config. Profile overrides global on conflicts.

## Herdr Communication

Orchestrator communicates with profiles via Herdr:
- `herdr pane send-text <id> <text>` — send work
- `herdr pane read <id>` — read results
- `herdr wait output <id> --match <text>` — wait for completion

See `.scratch/spec/hierarchical-team-design.md` for full spec.
