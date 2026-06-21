# PRD: OpenCode Workflow Pain Points — Hardening Agent Behavior

## Problem Statement

As an OpenCode user running complex coding tasks (refactors, migrations, docx work, UI changes), I want my AI agents to:

1. Load the right skill BEFORE making tool calls
2. Recover from tool failures instead of falling back to bash hacks
3. Detect and break stuck loops
4. Actually consult persistent memory (OpenViking) for context
5. Use taste references (design.md, impeccable sub-commands) on UI work
6. Avoid wasteful patterns (3-step QA dance, scout swarm, per-page delegation)

The current state: across 3 analyzed projects (erp-system: 423 sessions, geopredict: 39 sessions, UMKM-Laporan/BAB V/VII: 14 sessions), the workflow exhibits:

- **99% of sessions never consult OpenViking** despite it being configured
- **5% officecli failure rate** cascading into 314 bash workarounds (238 of which are python3+lxml docx hacks)
- **0 officecli skill auto-loads** in 14 docx sessions — the skill exists but didn't fire early enough
- **7 exa MCP timeouts + 3 webfetch 404s** in geopredict from un-rate-limited research
- **16 chrome-devtools click/viewport errors** from "Element uid X no longer exists" — browser-qa doesn't re-snapshot before retry
- **Only 7 skill invocations** across 39 geopredict sessions — skill triggers not firing
- **9+ browser-qa/builder 3-step dance cycles** in PWEB-Swarakarna — no way to skip when diff is tiny
- **11 scout calls in 1 hour** in geopredict with no consolidation/merge

The user has been suffering through these repeatedly. The harness rules exist in some places but don't fire when needed.

## Solution

From the user's perspective:

**Harden agent behavior in `opencode-workflow` so that:**

1. **Skills auto-load reliably** when keywords match (not just at orchestrator but at subagent level)
2. **Tool failures trigger smart fallback**, not bash hacks — load troubleshooting skill on first failure
3. **OfficeCLI pre-flight check** runs before any docx/pptx/xlsx work
4. **Browser-qa re-snapshots** on click failure (recover from stale uid)
5. **OpenViking lookup is mandatory** at task start
6. **Stuck loops are detected** (8+ same-tool calls → escalate)
7. **Taste references load** for UI work (impeccable sub-commands, design.md)
8. **URL cache** prevents repeated webfetch 404s
9. **Visual QA is mandatory** before "ship" / "done" intent

## User Stories

### Memory & OpenViking
1. As an orchestrator, I want to **always `ov find` at task start** so I can apply past lessons before starting work, even if the task looks simple.
2. As an orchestrator, I want to **always `ov remember` at task end** so lessons learned are saved for future sessions.
3. As a builder, I want to **check OpenViking for known tool failure patterns** before retrying the same failed call, so I don't waste 18+ cycles on a known broken approach.
4. As the harness, I want to **observe** which OpenViking lookups actually changed agent behavior, so I can measure whether the rule is effective.

### Skill Triggers & Auto-load
5. As the orchestrator, I want **impeccable sub-commands to fire by intent** (craft, audit, adapt, live, polish) — not just the generic `impeccable` keyword, so the right sub-command is loaded.
6. As the orchestrator, I want **officecli skill to auto-load BEFORE the first docx tool call**, not after it fails, so the agent knows the proper workflow.
7. As the orchestrator, I want **skill context passed to subagent delegations**, so when I delegate to `builder`, the builder already knows which skills to use.
8. As a user, I want **skill triggers to be discoverable** (e.g. when I say "audit", "craft", "polish", the right sub-command loads).

### Tool Failure Recovery
9. As a builder, when `officecli` tool fails, I want to **automatically load the officecli troubleshooting skill** (not fall back to bash), so I don't waste 238 python3+lxml calls on docx hacks.
10. As a builder, when any tool fails 2+ times consecutively with the same error, I want to **stop and check OpenViking for known patterns** before retrying.
11. As the orchestrator, I want a **pre-flight check for officecli** before delegating docx work — run `officecli --version` to verify .NET deps are present, fail early if not.
12. As a builder, when `chrome-devtools_click` fails, I want to **re-snapshot the page and find the new uid** before retrying, so I don't loop on stale element references.

### Browser-QA & Visual Loop
13. As a browser-qa, I want to **always re-snapshot before retry** any chrome-devtools interaction, because pages change during interaction.
14. As a user, I want **mandatory browser-qa before "ship" / "done" / "merge" intent**, so visual issues are caught before completion.
15. As a user, I want the **3-step QA dance (qa → fix → qa) to be skippable** when the diff is tiny, so I don't burn cycles on trivial changes.
16. As a browser-qa, I want to use `impeccable audit` for taste review and `impeccable critique` for design critique, not generic checks, so I catch taste issues not just functional issues.

### Stuck Loop Detection
17. As the harness, I want to **detect when the same tool is called 8+ times consecutively**, and force a check-in (not just a prompt rule that the model can ignore).
18. As a builder, I want to **break the loop when bash gives the same output 3+ times**, so I don't waste 271 calls on a stuck grep.

### URL & Web Research
19. As a scout, I want to **cache successful URLs in OpenViking** so I don't re-fetch dead links and waste time.
20. As a scout, I want **rate-limit exa calls** (e.g. max 10 per session) so I don't hit MCP timeouts like the 7 in geopredict.
21. As a scout, I want to **batch related questions** so 11 parallel calls become 2-3 batched calls.

### Design.md & Taste
22. As a builder, I want to **read `design.md` before any UI generation** so I don't invent hex values or break the design system.
23. As a browser-qa, I want to **judge taste against the project's design language** (design.md + impeccable), not generic "good UI" standards.
24. As a user, I want `setup-matt-pocock-skills` to **recommend `impeccable teach` for new projects and `impeccable document` for existing apps** so the design reference is auto-generated, not manually filled.

### OfficeCLI Specifically
25. As a user, I want the **officecli .NET dependency check** in the workflow setup, so I don't lose hours to `DocumentFormat.OpenXml.Framework` errors.
26. As a builder, I want to **use `officecli set` correctly** (not `raw-set` which doesn't exist), so I don't get the "Unknown tool" error.
27. As a builder, I want to **verify the docx structure** before mutating it, so I don't get `Cannot add 'run' under /body` errors.

## Implementation Decisions

### Phase 1: Orchestrator prompt rules (low effort, immediate impact)
- Add OpenViking memory protocol (already done in commit `7303ffe`)
- Add preflight checks (already done)
- Add reviewer cadence (already done)
- Add browser-qa before ship (already done)
- Add skill triggers including 20+ impeccable sub-commands (already done in `10b5ceb`)
- Add error pattern tracking via OpenViking (already done in `370a440`)

### Phase 2: Agent file updates
- Update `agents/builder.md`:
  - Read design.md before UI work
  - Load impeccable craft/adapt sub-commands by intent
  - Use officecli troubleshooting on first failure
- Update `agents/browser-qa.md`:
  - Load impeccable audit/critique by intent
  - Re-snapshot before retry on click failure
- Update `agents/orchestrator.md`:
  - Pass skill context in delegations
  - Force browser-qa before ship intent

### Phase 3: Skill improvements
- Enhance `impeccable` skill context (already updated)
- Add `officecli` troubleshooting sub-skill or enhance existing one
- Add stuck-loop detection (the model-level, not prompt-level)
- Add URL cache to OpenViking protocol

### Phase 4: Verification mechanism
- Add a way to **observe** whether the rules actually fire (track tool calls, skill loads, errors)
- Maybe add a `eval` skill invocation after sessions to grade

## Testing Decisions

What makes a good test for this:
- **Test the rules fire**: simulate a session with known triggers, verify skill loads
- **Test the fallback**: simulate officecli failure, verify bash fallback is avoided
- **Test the loop detection**: simulate 8+ same-tool calls, verify escalation
- **Test the QA loop**: simulate 3-step cycle, verify diff-tiny path skips

What modules to test:
- Orchestrator prompt (smoke test: "audit my UI" → loads impeccable audit)
- Builder agent (smoke test: "fix this button" → reads design.md, uses design tokens)
- Browser-qa agent (smoke test: "verify this page" → uses impeccable audit, re-snapshots on click fail)

Prior art: the `eval` skill (already in repo) can be used post-session to grade behavior.

## Out of Scope

- **Migrating to a different agent runtime** (Claude Code, etc.) — this is OpenCode-only per repo rules
- **Replacing OpenViking** with another memory system
- **Building a new UI design tool** — we use existing ones (impeccable, design.md)
- **Tasteful-design plugin** — incompatible with OpenCode, use impeccable instead

## Further Notes

This PRD is the result of analyzing ~500 sessions across 3 projects (erp-system, geopredict, UMKM-Laporan/BAB V/VII). The pain points are not theoretical — they're observed behaviors with specific error counts and cost impact.

Some fixes are already in flight (Phase 1 in commits `7303ffe`, `370a440`, `29098e7`). This PRD captures the full set of changes needed, prioritized by user impact.

Once this PRD is approved, it should be broken into issues using `to-issues` skill, with each issue scoped to one fix.
