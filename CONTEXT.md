# OpenCode Workflow Kit

An OpenCode-first workflow repo containing agent prompts, selected workflow skills, and docs for multi-model orchestration.

## Language

**Issue tracker**:
The tool that hosts a repo's issues — GitHub Issues, Linear, a local `.scratch/` markdown convention, or similar. Skills like `to-tickets`, `to-spec`, `triage`, and `qa` read from and write to it.
_Avoid_: backlog manager, backlog backend, issue host

**Issue**:
A single tracked unit of work inside an **Issue tracker** — a bug, task, PRD, or slice produced by `to-tickets`.
_Avoid_: ticket (use only when quoting external systems that call them tickets)

**Triage role**:
A canonical state-machine label applied to an **Issue** during triage (e.g. `needs-triage`, `ready-for-afk`). Each role maps to a real label string in the **Issue tracker** via `docs/agents/triage-labels.md`.

**Activation**:
Manual step that links or copies repo agents/skills into `~/.config/opencode`. Activation is separate from development; do not activate until changes are mature.

**Out-of-scope note**:
Maintainer note under `.scratch/out-of-scope/` explaining a rejected or deferred feature request. Not runtime config and not installed into OpenCode.

**Plugin**:
A TypeScript module that intercepts OpenCode hooks (tool execution, chat messages). Runs on every call to the hooked event, unlike **On-demand skills**. Loaded via `~/.config/opencode/opencode.json`.

**Primitive agent**:
A narrow, single-responsibility agent — either repo-defined (`agents/*.md`) or a built-in OpenCode primitive used by routing. Examples: repo-defined `planner`, `builder`, `reviewer`, `advisor` and built-in `explore`, `scout`. Primitive agents are always active and part of the routing table. Not to be confused with **On-demand skills**.

**On-demand skill**:
A `SKILL.md` file under `skills/` loaded only when the domain matches. Not an agent — no agent file, no frontmatter `mode`. Loaded via skill tool when the task fits.

**Verification evidence**:
Tool-produced output (test results, lint output, diff stats, console logs) collected by the `verify-evidence` skill. Feeds `reviewer` context. Distinct from `reviewer`'s own judgment pass.

**AFK session**:
Unattended orchestrator run against a set of issues. Logged to `.scratch/afk-sessions/` with checkpoints, stuck-loop detection, and human escalation gates.

**OpenViking**:
Persistent memory store for the agent. URI scheme: `viking://user/preferences/`, `viking://user/lessons/`, `viking://agent/patterns/`, `viking://resources/projects/<name>/`. Auto-triggers on user preference, user correction, and repeated agent patterns. Cleanup rules enforce TTL and max entries to prevent context pollution.

**Artifact repo**:
Private production artifact repository that excludes environment files and secrets. Holds compiled JS, vendor deps, and deployable code only. Never committed to the development source repo.

**Public artifact**:
The subset of the **Artifact repo** that a `public_html` symlink points to when deploying to shared hosting. Represents the document root visible to the public.

**Team handoff**:
Durable summary (changes, verification evidence, version bump, changelog, migration notes, rollback notes, next-owner actions) produced by the `team-handoff-quality` skill for human team members or scheduled handoffs.

## Relationships

- An **Issue tracker** holds many **Issues**
- An **Issue** carries one **Triage role** at a time
- **Activation** installs selected repo assets into local OpenCode config
- **Out-of-scope notes** preserve product/development decisions
- A **Primitive agent** is always active; an **On-demand skill** loads only when triggered
- A **Plugin** hooks into runtime events (loaded via `~/.config/opencode/opencode.json`); an **On-demand skill** is loaded only when the domain matches
- **Verification evidence** is collected by `verify-evidence` skill and consumed by `reviewer` — reviewer remains the judgment gate
- `reviewer` is the review gate; `verify-evidence` provides independent evidence, not a separate active agent
- An **Artifact repo** excludes env/secrets; a `public_html` symlink points at the **Public artifact** only
- A **Team handoff** bundles verification evidence, changelog, and next-owner actions for durable transfer
- **OpenViking** stores user preferences (durable), user lessons (TTL 90d), agent patterns (TTL 60d), and project context (manual cleanup)

## Flagged ambiguities

- "backlog" was previously used to mean both the *tool* hosting issues and the *body of work* inside it — resolved: the tool is the **Issue tracker**; "backlog" is no longer used as a domain term.
- "backlog backend" / "backlog manager" — resolved: collapsed into **Issue tracker**.
