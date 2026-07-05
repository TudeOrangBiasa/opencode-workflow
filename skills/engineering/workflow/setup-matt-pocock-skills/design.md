# Design Reference (Seed Template)

This is a starter template for the project's `design.md`. The setup-matt-pocock-skills skill scaffolds this on first run; agents (builder, browser-qa, reviewer) read it before any UI work.

## Design Principles

- [Mood/tone — e.g. calm, technical, editorial, playful]
- [Restraint vs. density — e.g. whitespace-first, information-rich]
- [Voice — e.g. opinionated, neutral, warm]

## Tokens (use these exact values)

### Colors
- bg: `#____`
- surface: `#____`
- text-primary: `#____`
- text-secondary: `#____`
- border: `#____`
- accent (primary): `#____`
- accent (secondary): `#____`
- success/warning/error: `#____` / `#____` / `#____`

### Typography
- font-family: `____` (body) / `____` (display) / `____` (mono)
- scale: `12 / 14 / 16 / 18 / 20 / 24 / 32 / 40 / 48` (use ONLY these sizes)
- weight: body `400`, headings `600` or `700`
- line-height: body `1.6`, headings `1.2-1.4`

### Spacing
- Scale: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64` (use ONLY these values)
- Section padding: `64px` vertical
- Content max-width: `____px`

### Border Radius
- sm: `4px`, md: `8px`, lg: `12px`, full: `9999px` (pill)

### Elevation
- Borders: ALWAYS `1px solid`, color `border`. NEVER `2px`.
- Shadows: `none` for cards (use border + bg surface instead). Reserved for floating elements only (modals, dropdowns).

## Component Patterns

### Cards
- Background: `surface`
- Border: `1px solid border`
- Border-radius: `md` (8px)
- Padding: `lg` (16-24px)
- No box-shadow (use border + bg)

### Buttons
- Primary: bg `accent`, text `white`, radius `sm`, padding `8px 16px`
- Secondary: bg `surface`, border `1px border`, text `text-primary`
- Height: `40px` (touch target)

### Forms / Inputs
- Height: `40px`
- Border: `1px border`, focus state = `2px accent` (exception to 1px rule)
- Border-radius: `sm` (4px)
- Padding: `8px 12px`

### Layout
- Grid gap: `lg` (24px) horizontal, `xl` (32-48px) vertical
- Section spacing: `64px` between major sections
- Container max-width: `1200px` centered

## Anti-Patterns (NEVER generate these)

- ❌ Box-shadow on cards (use 1px border instead)
- ❌ Hex colors in class names (always use token names)
- ❌ Nested cards (card inside a card)
- ❌ Font sizes outside the defined scale
- ❌ Colors outside the defined token list
- ❌ Border widths other than `1px` (exception: input focus state)
- ❌ Border-radius values other than `4 / 8 / 12 / 9999`
- ❌ Spacing values other than `4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64`

## Reference Examples

- Good: `[path/to/screenshot-or-page]`
- Bad: `[path/to/anti-pattern-example]`

## Notes

- This file is read by builder, browser-qa, and reviewer before any UI work
- Edit this file when adding new tokens or component patterns
- Browser-qa uses this to judge taste/aesthetic, not generic "good UI"
- If multi-domain (e.g. admin vs. public site), create per-domain `design.md` files and point to them from a `design-map.md` at the project root
