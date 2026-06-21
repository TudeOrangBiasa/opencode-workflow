# Changelog

## [Unreleased]

- Feature: emil-design-eng skill — Emil Kowalski's design engineering for UI animation, easing, springs, gestures (misc)
- Feature: review-animations skill — review motion/animation code against high craft bar (misc)
- Feature: ponytail skill + 5 companions — lazy dev ruleset (YAGNI/stdlib/native), review, audit, debt, gain, help (personal)
- Fix: review-animations — restore STANDARDS.md reference + create standards file from upstream
- Fix: ponytail companions — restore `/ponytail-*` command triggers from upstream
- Fix: drawio — sync with upstream v1.14.0 (references/, scripts/, data/, styles/)
- Cleanup: move ponytail skill family from personal → engineering bucket
- Feature: officecli skill — Office document (.docx/.xlsx/.pptx) create/inspect/modify via officecli CLI (productivity)
- Cleanup: trim `planner` agent from local config (1 session ever, orchestrator plans inline)
- Wire: reviewer auto-invokes ponytail skill (YAGNI review for security audit)
- Wire: orchestrator auto-invokes officecli skill for .docx/.pptx/.xlsx tasks
- Routing: scout → 9router/oc/mimo-v2.5-free (multimodal for external docs with images)
- Cleanup: delete 462 stale sessions from old configs (implementer, browser-extractor, sdd-*, etc.); 23K messages + 105K parts removed; DB 3.6GB → 3.2GB
- Wire: orchestrator error pattern tracking via OpenViking — auto-store tool failure workarounds to avoid repeating them
- Phase 1 fixes (from session pain analysis): orchestrator prompt now includes:
  - Memory protocol: mandatory `ov find` at task start, `ov remember` at end
  - Preflight checks: read before edit/write (kills 9.8%/7.5% error rates)
  - Reviewer cadence: auto-trigger every 5 builder sessions or on issue close
  - Browser-QA before ship: auto-verify UI on deploy intent
  - Skill triggers: auto-load officecli/ponytail/diagnose/tdd on keyword match
- Refactor: move Phase 1 prompt from `opencode.json` `prompt` field to `agents/orchestrator.md` — agent behavior lives in agent files, JSON only carries routing config
- Cleanup: delete unused `agents/planner.md` (removed from config earlier)
- Feature: design.md workflow — `setup-matt-pocock-skills` now scaffolds `design.md` (or `design-map.md` for multi-domain) with tokens, anti-patterns, component rules. `builder` and `browser-qa` read it before any UI work and auto-load `impeccable` (+ `emil-design-eng` for motion). Orchestrator refuses to delegate UI work without a design reference.
- Feature: `dev-workflow` skill — development workflow for the opencode-workflow repo itself. Walks through adding skills, modifying agents, syncing from upstream, committing. References `docs/development.md`.
- Feature: `workflow-audit` skill — audit opencode config, symlink health, repo sync, and recent session activity. Read-only, surfaces mismatches.
- Documentation: `docs/development.md` — full dev workflow for the opencode-workflow repo (setup, layout, add-skill decision tree, agent edits, link script, changelog, commit, testing, releasing).
- Fix: `docs/templates/opencode.primitive-agents.jsonc` — updated to match current config. Removed stale `planner` agent, added `skill_triggers` (8 skills), updated scout to mimo (multimodal), added `officecli` MCP. Local `opencode.json` never committed (has API keys); this template is the versioned source of truth.
- Wire: impeccable sub-commands — `skill_triggers` now includes all 20+ impeccable sub-commands (teach, document, craft, audit, critique, adapt, live, polish, bolder, quieter, colorize, optimize, harden, typeset, delight, distill, clarify, shape, extract, onboard, overdrive). orchestrator, builder, browser-qa agents now reference the right sub-command by intent (not just "impeccable" generically). `setup-matt-pocock-skills` now recommends `impeccable teach` / `impeccable document` to auto-generate DESIGN.md instead of manual template fill. Added `design-system` and `review-animations` triggers; `ui-to-vue` is Vue-specific.

## [0.6.0] - 2026-06-18

- Feature: OpenViking as standard practice, not optional
- Feature: modular-monolith-patterns skill from YouTube architectural video
- Feature: eval skill — session analysis for agent errors, stuck patterns, scope drift
- Feature: link personal skills to `~/.config/opencode/skills`
- Fix: shorten personal skill descriptions for OpenCode loading
- Fix: orchestrator frontmatter typo + strengthen delegation rules
