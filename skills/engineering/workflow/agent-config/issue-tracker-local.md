# Issue tracker: Local Markdown

Issues and PRDs for this repo live as markdown files in `.scratch/issues/`.

## Conventions

- One issue per file: `.scratch/issues/<NN>-<slug>.md`, numbered from `01`
- The index is `.scratch/issues/00-index.md` — dependency graph, status overview
- Triage state is a `Status:` line near the top (see `triage-labels.md` for role strings)
- Comments append under a `## Comments` heading

## Scratch workspace

The agent workspace at `.scratch/` has multiple buckets:

| Bucket | Purpose |
|--------|---------|
| `issues/` | Issue tracker — tickets, PRDs |
| `kanban/` | Kanban board — columns, cards |
| `spec/` | Specs — *.md, *.xml, *.html |
| `evals/` | Session evaluation reports |
| `verification/` | Verification evidence per change |
| `out-of-scope/` | Boundary decisions |

## When a skill says "publish to the issue tracker"

Create `.scratch/issues/<NN>-<slug>.md` and update `00-index.md`.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. User passes path or issue number.

## Wayfinding operations

- **Map**: `.scratch/<effort>/map.md` — Notes / Decisions-so-far / Fog body
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`. `Type:` line (`research`/`prototype`/`grilling`/`task`), `Status:` line (`claimed`/`resolved`)
- **Blocking**: `Blocked by: NN, NN` near top. Unblocked when all named files are `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for open + unblocked + unclaimed; first by number.
- **Claim**: set `Status: claimed`.
- **Resolve**: append answer under `## Answer`, set `Status: resolved`, append context pointer to map Decisions-so-far.
