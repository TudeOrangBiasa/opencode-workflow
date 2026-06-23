# Issue 18: Self-Learning via Memory + Dreaming (from Anthropic's framework)

## Status

New. Source: Anthropic's "Memory and dreaming for self-learning agents" talk (Code w/ Claude 2026, May 6, Mahesh Murag). Full research at `.scratch/research/memory-dreaming-framework.md` (423 lines).

## Pain

Repetitive errors. Same officecli workaround learned 3x. Same 11 writing rules re-typed in 3 BAB sessions. Same numbering fix in 4 sessions. The agent re-derives what should already be known.

## The Framework (Anthropic's design)

Three layers:

| Layer | What | When | Analogy |
|-------|------|------|---------|
| **Memory** | Workspace-scoped text files (filesystem-mounted, not vector DB) | During session (online write) | Hippocampal encoding |
| **Dreaming** | Async consolidation: review → extract → reconcile → prune → write | Between sessions (scheduled) | Sleep consolidation (CLS theory) |
| **Recall** | Read consolidated memory at session start | At session start | Wake-up with yesterday's learning |

Production data:
- Harvey (legal AI): 6x completion rate improvement
- Wisedocs: 30% verification speedup
- Memory = filesystem, not embeddings (Anthropic's explicit choice)

## What We Already Have (from prior Issues)

- **OpenViking** = the filesystem-equivalent memory store (viking:// URIs, semantic search, persistent)
- **Issue 01**: orchestrator memory protocol (auto-loads openviking skill on task verbs)
- **Issue 14**: subagent lessons persistence (P0, still open) — this is the "hippocampal encoding" layer
- **All 17 prior issues** are PAIN that this system would prevent

## What's Missing (Priority Order)

### P0: Issue 14 (already scoped, 20 min)

Subagent `ov find` / `ov remember` at task start/end. Same pattern as Issue 01, applied to subagent context. This is the **online write layer** — agent learns as it works.

### P1: `memory-dreaming` skill (NEW, ~2 hours)

Manual-trigger consolidation. User says "consolidate memory" or "clean up lessons" → skill runs:

1. `ov find "viking://agent/projects/*/lessons"` — list all project lessons
2. Identify duplicates (same lesson, different wording across sessions)
3. Identify contradictions (A says X, B says not-X)
4. Identify stale (referenced project no longer active)
5. Present consolidation plan to user
6. On approval: merge / archive / update
7. Report: "Consolidated N → M entries, K archived"

**Why manual, not automatic**: opencode has no session-start hook, no cron. Manual trigger = explicit human review = quality gate. YAGNI on automation.

**Why this isn't Issue 14**: Issue 14 is the WRITE layer (every subagent writes incrementally). This is the CONSOLIDATION layer (occasional, batch, user-triggered). Different cadence, different scope.

### P2: Cross-agent memory sharing (~30 min)

Orchestrator as the "neocortex" — receives replay from all subagents, integrates:

- When reviewer finds issue → orchestrator stores in builder's lessons too
- When builder discovers workaround → orchestrator stores in reviewer's context
- When browser-qa catches UI bug → orchestrator stores in builder + design.md

Single rule in orchestrator: "When a subagent reports a pattern, mirror it to all other relevant subagents' lesson stores."

## YAGNI (Don't Build)

- **Automated scheduling** — no session-start hook, no cron. Manual trigger is enough for v1.
- **Vector search over memories** — OpenViking's `ov find` is already semantic. Good enough.
- **Memory versioning/rollback** — OpenViking already versions. Don't add another layer.
- **Dreaming confidence scores** — over-engineering. Human review is the quality gate.
- **Separate memory stores per subagent type** — one shared `viking://agent/projects/<project>/lessons` is simpler. Differentiate by content.

## Visual Memory (EXTENDABLE — not for v1)

User's OpenViking setup (discovered 2026-06-23) has TWO backends:

```json
{
  "embedding": { "model": "qwen3-embedding:0.6b" },   // text → vector (LOCAL via Ollama)
  "vlm":        { "model": "gemini-3.1-flash-lite" }   // image understanding (via 9router, 3 accts)
}
```

**Implication**: OpenViking can index images, not just text. When `ov add-resource <screenshot.png>`:
1. VLM (Gemini via 9router) auto-describes the image
2. Description stored as searchable vector
3. Image stored as bytes
4. `ov find "screenshot of good table"` returns the image

### For v1 (P0, P1 text-only)

Don't add visual handling yet. Text-only path is enough for 80% of self-learning value.

### For v1.5 (after P0+P1 ship)

When consolidating in memory-dreaming skill:

```markdown
1. Group screenshots by VLM-described similarity
2. Identify "good" vs "bad" examples (by description or user signal)
3. Keep 1 canonical example per pattern
4. Archive the rest
5. Store pattern as: text description + reference image

ov remember "viking://.../patterns/visual/<name>" \
  --image <path> \
  --description "<text pattern>"
```

**Concrete value for dbl-data-management**: agent would learn "good table style" by SEEING the BAB V good example, not just reading "use 1F4E5F shading". Visual pattern is faster to recognize than text rule.

### 3 Gemini accounts via 9router (why smart)

User's `max_concurrent: 32` for VLM + 3-account round-robin = no rate-limit throttling for bulk indexing. When end-of-month dreaming runs on 200+ screenshots, the 3 accounts share the load.

**YAGNI** for v1: don't add visual handling to P0/P1. **Extendable** via the v1.5 design above.

## Acceptance Criteria

### P0 (Issue 14, ~20 min)

- [ ] Orchestrator's Delegation Protocol includes `ov find` for project lessons in every subagent task prompt
- [ ] Each subagent (`builder`, `reviewer`, `browser-qa`) has "Apply prior lessons" rule
- [ ] Each subagent has "Store what you learned" rule at task end
- [ ] Manual test: 2 sequential builder tasks on same project, 2nd task retrieves 1st task's lesson

### P1 (memory-dreaming skill, ~2 hours)

- [ ] `skills/engineering/memory-dreaming/SKILL.md` created
- [ ] Trigger keywords: "consolidate", "dream", "clean up lessons", "memory hygiene"
- [ ] Skill lists all project lessons, identifies duplicates/contradictions/stale
- [ ] Skill presents plan to user BEFORE writing back
- [ ] User can accept/edit/discard proposed changes
- [ ] Skill reports stats: "Consolidated N → M, K archived"

### P2 (cross-agent sharing, ~30 min)

- [ ] Orchestrator has rule: "When subagent X reports a pattern, store in subagent Y's lesson context if relevant"
- [ ] Manual test: reviewer catches bug → next builder task on same project gets the lesson auto-applied

## Out of Scope (defer)

- Per-agent memory stores (over-engineering for v1)
- Cross-project memory sharing (different problem — currently each project has its own lessons)
- Memory TTL/expiration (OpenViking has it, we don't need another layer)
- Vector DB integration (OpenViking's semantic search is enough)

## Notes

The framework from Anthropic is mature, production-tested (Harvey, Wisedocs), and has academic foundations (CLS theory, experience replay, generative agents). We don't need to invent — we need to apply the pattern to our existing infrastructure (OpenViking + subagent architecture).

Ponytail cut: 3 priority levels, ~2.5 hours total. No new framework. Use existing OpenViking, subagent delegation, skill triggers.

This issue is the foundation. Without it, Issue 14 alone gives us 80% of the benefit. With P1, we get the consolidation that prevents lesson-staleness. With P2, we get cross-agent learning.

## References

- Full research: `.scratch/research/memory-dreaming-framework.md` (423 lines)
- 12 Anthropic official sources (blog, docs, workshop)
- 5 academic papers (McClelland 1995, Mnih 2015, Tulving 1972, Park 2023, Packer 2023)
- Karpathy llm-wiki (June 2026) — parallel architecture
