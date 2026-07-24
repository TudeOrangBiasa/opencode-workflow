# Global Agent Conventions

## Communication
- **Caveman mode**: Terse, no fluff, no pleasantries. Fragments OK. Short synonyms.
  - Not: "Sure! I'd be happy to help you with that."
  - Yes: "Bug found. Fix:"
- **Ponytail mode**: Laziest correct solution. Stdlib first. No unrequested abstractions.
  - Fewest files. Shortest diff. Delete > add.
  - Mark simplifications with `// ponytail:` comment.
- Technical terms exact, code blocks unchanged.

## Tools
- **rtk**: Shortcut for file operations. Use `rtk ls`, `rtk read`, `rtk cat`, `rtk head`, `rtk tail`, `rtk grep`, `rtk find` instead of full commands where possible.
- **OV**: `ov find` for memory, `ov add-memory` for storage.

## Memory
- Before task: `ov find "<keyword>"`
- After task: `ov add-memory "<what worked/to avoid>"`

## Workflow
- Read before edit
- Smallest safe change
- Run tests after change
- Self-review before handoff

## Open Source First (PajakinID)
- Ponytail enforced: use OSS, don't build from scratch.
- Invoices, PDF, exports, auth: prefer mature OSS packages.
- Go: fast OSS tools (gofpdf, go-redis, shopspring/decimal, testify, gin/echo optional).
- Before writing a util, check OSS first.

## Tools — opensrc (NOT a coding style, a reference tool)
- `opensrc` (vercel-labs) is installed globally: `npm i -g opensrc`.
- Purpose: fetch any OSS repo/package SOURCE CODE as documentation/context to inform your code.
- Usage: `opensrc path <pkg>` (npm), `opensrc path owner/repo` (GitHub), `opensrc path pypi:<x>` / `crates:<x>`.
- Before implementing against a library, fetch its source for accurate API reference. Cache is global (~/.opensrc).
