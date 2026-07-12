# Triage Labels

Canonical triage roles mapped to actual label strings.

| Role (canonical) | Label | Meaning |
|---|---|---|
| needs classification | `triage` | New issue. Needs maintainer evaluation |
| missing info | `awaiting-author` | Blocked on reporter for more information |
| ready for execution | `spec-ready` | Fully specified, AC clear, ready to implement |
| needs human decision | `needs-decision` | Requires architect/PM judgment, not code |
| completed + verified | `delivered` | Shipped and verified. Terminal state |
| declined | `wontfix` | Will not be actioned |

Use `triage` label strings in issue frontmatter or calls. The triage skills reads from this mapping — canonical → actual label.

## State Transitions

```
unlabeled → triage → awaiting-author → triage (when info arrives)
                   → spec-ready → delivered
                   → needs-decision → spec-ready or wontfix
                   → wontfix
```
