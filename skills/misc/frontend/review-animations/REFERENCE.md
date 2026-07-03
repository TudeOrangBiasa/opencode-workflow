# Reviewing Animations — Reference

> Full standards and escalation criteria. See SKILL.md for operating posture.

## The Ten Non-Negotiable Standards

1. **Justified motion.** Every animation must answer "why does this animate?" — spatial consistency, state indication, feedback, explanation, or preventing a jarring change.
2. **Frequency-appropriate.** Match motion to how often it's seen. Keyboard-initiated and 100+/day actions get no animation.
3. **Responsive easing.** Entering/exiting elements use `ease-out` or strong custom curve. `ease-in` on UI is a block.
4. **Sub-300ms UI.** UI animations stay under 300ms; anything slower needs justification.
5. **Origin & physical correctness.** Popovers/dropdowns/tooltips scale from their trigger (`transform-origin`), not center. Never animate from `scale(0)`.
6. **Interruptibility.** Rapidly-triggered motion must be interruptible — CSS transitions or springs that retarget from current state.
7. **GPU-only properties.** Animate `transform` and `opacity` only.
8. **Accessibility.** `prefers-reduced-motion` honored; hover animations gated behind `@media (hover: hover) and (pointer: fine)`.
9. **Asymmetric enter/exit.** Deliberate actions animate slower; system responses snap.
10. **Cohesion.** Motion matches component personality and product style.

## Aggressive Escalation Triggers

- `transition: all` (unbounded property animation)
- `scale(0)` or pure-fade entrances with no initial transform
- `ease-in` on any UI interaction; weak built-in easing
- Animation on keyboard shortcut, command-palette toggle, or 100+/day action
- UI duration > 300ms with no stated reason
- `transform-origin: center` on trigger-anchored popover/dropdown/tooltip
- Keyframes on toasts, toggles, or rapidly triggered elements
- Animating layout properties (`width`/`height`/`margin`/`padding`/`top`/`left`)
- Framer Motion x/y/scale on motion while page is busy
- Updating CSS variable on parent to drive child transform
- Missing `prefers-reduced-motion` on movement
- Ungated `:hover` motion
- Symmetric enter/exit timing on press-and-release or hold
- Everything-at-once entrance where 30–80ms stagger belongs

## Remedial Preference Hierarchy

1. Delete the animation
2. Reduce it — shorter duration, smaller transform
3. Fix the easing
4. Fix the origin/physicality
5. Make it interruptible
6. Move it to the GPU
7. Asymmetric timing
8. Polish — blur, stagger, @starting-style, spring
9. Accessibility & cohesion

## Required Output Format

### Part 1 — Findings table

One row per issue with Before, After, and Why columns.

### Part 2 — Verdict

Group by impact tier: Feel-breaking regressions, Missed simplifications, Performance, Interruptibility & timing, Origin/physicality/cohesion, Accessibility.

Close with explicit decision: Block or Approve. Cite `file:line`. Use exact values from STANDARDS.md.

## Guidelines

Prefer CSS transitions/@starting-style/WAAPI for predetermined motion; JS/springs for dynamic, interruptible, gesture-driven motion. When unsure, recommend reviewing in slow motion with fresh eyes next day.
