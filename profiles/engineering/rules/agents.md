# Engineering Rules

- Read before edit
- Smallest safe change
- Run tests after change
- No debug artifacts
- Ask before guessing

## Design Pipeline

1. **Design phase**: `/design build --document` creates `DESIGN.md` + tokens
2. **Implementation**: frontend-dev reads `DESIGN.md`, builds with design tokens
3. **Validation**: `/design audit --polish` checks consistency, accessibility, AI slop

Never implement UI without `DESIGN.md`. If missing, run design phase first.
