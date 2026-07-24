# Coding Standards

## Ponytail Style
- No boilerplate comments. Code is documentation, not comments.
- No docblocks for trivial code (getters, simple props, obvious params).
- Shortest correct diff wins. Deletion over addition.
- YAGNI — no speculative abstractions, no interfaces with one implementation, no config for values that never change.
- Boring over clever. Clever is what someone decodes at 3am.

## OSS-First
- Prefer existing open source over custom builds. Use opensrc (`npx @opensrc/cli search <need>`) to find packages before building.
- Build from scratch only when user explicitly says so or no existing OSS fits.

## File Organization
- Files do one thing. If a file has multiple responsibilities, split it.
- Names reveal intent. Function/variable/type names say what they do or hold.
- Group by domain, not by technical role (e.g. `features/auth/` not `controllers/`).

## Naming Conventions
- Files: kebab-case (`user-service.ts`)
- Functions/variables: camelCase (`getUserById`)
- Types/interfaces: PascalCase (`UserProfile`)
- Constants: UPPER_SNAKE_CASE only for truly immutable global values (`MAX_RETRY_COUNT`)
- Booleans: prefix with `is`, `has`, `should`, `can` (`isActive`, `hasPermission`)

## Imports
- No deep relative imports (`../../../utils/helper`). Use path aliases or import from public API.
- Group: external → internal → relative. Blank line between groups.
- No unused imports. Clean on save.

## Error Handling
- Errors are typed, not strings. Use Result/Option pattern or custom error classes.
- Never swallow errors. If you catch, do something (log, retry, transform, rethrow).
- User-facing messages are actionable: tell what broke, why, what next.

## Testing
- Test behavior, not implementation. Tests survive refactors.
- One assertion concept per test. Multiple assertions on same thing is fine.
- Prefer public API testing over mocking internals.
- TDD: red → green → refactor. Write failing test first.

## Documentation
- Code explains itself. Comments say WHY, not WHAT.
- API contracts, DB schemas, deployment steps in `docs/`.
- Wiki stack: docsify (markdown render) + Redoc (API docs from openapi.yaml).
- Feature docs: `docs/guides/<feature>.md` — What → How → Example, bullets, short.
- Update `docs/_sidebar.md` when adding pages.
- ADRs in `docs/adr/` for architecture decisions.

## Security
- Validate input at trust boundaries. Sanitize output.
- No secrets in code, config, or logs. Use env vars or secret manager.
- Principle of least privilege for API endpoints and DB queries.
