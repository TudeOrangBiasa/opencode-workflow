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

## [0.6.0] - 2026-06-18

- Feature: OpenViking as standard practice, not optional
- Feature: modular-monolith-patterns skill from YouTube architectural video
- Feature: eval skill — session analysis for agent errors, stuck patterns, scope drift
- Feature: link personal skills to `~/.config/opencode/skills`
- Fix: shorten personal skill descriptions for OpenCode loading
- Fix: orchestrator frontmatter typo + strengthen delegation rules
