---
name: idea-fragments
description: Grilling session that mines the user for raw project idea fragments: problems, user pains, hackathon angles, MVP possibilities, domain unknowns, weird observations, and feasibility questions. Use when the user wants to explore fresh project ideas before planning, PRD, prototype, or implementation.
---

# Idea Fragments

## What to do

Run a grilling session that produces project idea fragments. Interview the user relentlessly about whatever idea, domain, pain point, or hackathon direction they are exploring.

Do not impose phases, PRDs, outlines, or implementation plans. This skill captures raw material before structure.

As fragments emerge from either side of the conversation, append them to a single markdown file. The user may edit this file during the session; always re-read it before writing so their edits are preserved.

If the user did not pass a path, ask once where to save the document, then remember it for the rest of the session.

Capture fragments from the first thing the user says, including the initial prompt.

On first write, put a single H1 at the top with a working idea title and nothing else. No metadata, no TOC, no date.

## What is an idea fragment

An idea fragment is any piece of text that might survive into a future project concept, prototype, PRD, workshop, hackathon build, or research plan. It must be readable by the user, but it does not need to be validated, complete, or understandable to a cold reader.

Fragments are deliberately heterogeneous. Examples:

- A user pain or complaint.
- A hackathon theme angle.
- A possible MVP feature.
- A domain unknown to research later.
- A weird observation or analogy.
- A competitor or market suspicion.
- A constraint: time, team, stack, API, data source, demo requirement.
- A risk: too hard, too boring, no data, bad UX, unclear user.
- A one-line pitch that is not ready yet.
- A learning, workshop, or curriculum idea that should become a separate skill later.

The inventor's notebook is the model: unstructured noticings that later get mined for project direction.

## File format

```markdown
# Working idea

A first idea fragment lives here.

---

A second fragment.

---

- A cluster of related observations
- That hang together by feel
- And want to be near each other
```

Fragments are separated by a horizontal rule (`\n---\n`). No headings inside the body. No tags. No forced order beyond the order they were added.

## Writing rhythm

- Append silently. Do not ask permission for each fragment.
- Mention what you added in passing, but do not interrupt the conversation with save dialogs.
- Before every write: re-read the file from disk.
- Never overwrite the file. Only append, unless the user asks to edit a specific fragment in place.
- The user can say "cut the last one", "rewrite that sharper", or "merge those two" at any time. Treat those as first-class instructions.

## Next steps after fragments

When the user wants to move from fragments to execution, route to existing workflow skills instead of continuing this skill:

- `grill-me` — stress-test the idea.
- `prototype` — make a throwaway playable version or UI options.
- `to-prd` — turn a chosen idea into a product requirement.
- `to-issues` — split a PRD/plan into implementation slices.

Curriculum, learning-material, or workshop design should be handled by a separate future skill, not this one.
