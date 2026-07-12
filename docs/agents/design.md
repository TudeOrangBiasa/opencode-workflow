# Design Reference

Design principles, anti-patterns, and consumer rules for UI work.

## Design Principles

- [Placeholder — mood/tone]
- [Placeholder — restraint vs density]
- [Placeholder — voice]

## Anti-Patterns (NEVER generate)

- Box-shadow on cards (use 1px border instead)
- Hex colors directly in class names (use token names)
- Font sizes outside defined scale
- Spacing values outside defined scale
- Border widths other than 1px (exception: input focus)

## Consumer Rules

- **builder** — reads this before any UI generation. Applies tokens, avoids anti-patterns.
- **validator** — reads this before UI critique. Judges against project's design language.
- **reviewer** — references this when reviewing UI changes for design consistency.

## Notes

- Edit this file when adding tokens or component patterns
- If multi-domain (e.g. admin vs public site), create per-domain design files + `design-map.md`
