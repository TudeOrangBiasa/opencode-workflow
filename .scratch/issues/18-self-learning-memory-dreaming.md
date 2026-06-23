# Issue 18: Self-Learning via Memory + Dreaming (from Anthropic's framework)

## Status

**Done (P0+P1+P2 shipped in `b7a764d`)**. Source: Anthropic's "Memory and dreaming for self-learning agents" talk (Code w/ Claude 2026, May 6, Mahesh Murag). Full research at `.scratch/research/memory-dreaming-framework.md` (423 lines, ready to delete per AGENTS.md — content promoted to this issue + memory-dreaming skill).

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
- **Issue 14**: subagent lessons persistence (P0, done in 58ad71a + 2dacac8) — this is the "hippocampal encoding" layer
- **All 17 prior issues** are PAIN that this system would prevent

## What's Missing (Priority Order)

### P0: Issue 14 (DONE in 58ad71a + 2dacac8, P0 leftover in orchestrator fixed in b7a764d)

Subagent `ov find` / `ov add-memory` at task start/end. Same pattern as Issue 01, applied to subagent context. This is the **online write layer** — agent learns as it works.

**P0 leftover fix (b7a764d)**: `agents/orchestrator.md` Memory Protocol still used hallucinated `ov remember` command in 4 sites (lines 19, 20, 28, 235). P0 fix in 2dacac8 updated subagent files but missed the orchestrator's own protocol. Replaced with `ov add-memory` + `[project:...]` / `[pattern:...]` / `[tool-failure:...]` / `[cache-web:...]` text prefixes. Without this fix, the orchestrator would re-create `ov remember` calls that fail silently, re-introducing the P0 critical bug.

### P1: `memory-dreaming` skill (DONE in b7a764d, 95 lines)

Manual-trigger consolidation. User says "consolidate" / "dream" / "clean up lessons" / "memory hygiene" → skill runs (2-phase, YAGNI-cut from the original 4-phase Anthropic spec):

1. **Phase 1: Review** — `ov find "<project>" -n 100 --output json` (single broad query covers all subagent namespaces)
2. **Phase 2: Present + Merge** — per-entry diff (URI + content + proposed action: merge-into / archive / keep) → user approval gate → `ov add-memory` for merged entries → `ov rm` for archived (with graceful fallback if rm fails)

**YAGNI cuts from spec**: collapsed 4 phases → 2 phases. Dropped stale detection (>30d), contradiction as a built-in primitive, and "K archived" stats. Single broad query replaces 3 per-namespace queries. Spec itself said "TTL handles cleanup" — contradicts the archive phase, so the archive phase is gone. Total: 95 lines vs 200-300 spec estimate.

**Why manual, not automatic**: opencode has no session-start hook, no cron. Manual trigger = explicit human review = quality gate. YAGNI on automation.

**Why this isn't Issue 14**: Issue 14 is the WRITE layer (every subagent writes incrementally). This is the CONSOLIDATION layer (occasional, batch, user-triggered). Different cadence, different scope.

### P2: Cross-agent memory sharing (DONE in b7a764d, 1 line in orchestrator)

Orchestrator as the "neocortex" — receives replay from all subagents, integrates. Implemented as a single line change in `agents/orchestrator.md`: the orchestrator's `ov find` query for the delegation prompt drops the subagent namespace suffix (`<project> lessons` → `<project>`). One broad query returns lessons from all subagent namespaces (builder `lessons`, reviewer `review patterns`, browser-qa `browser quirks`).

- Empirically tested: `ov find "opencode-workflow lessons"` and `ov find "opencode-workflow"` return near-identical results (9 vs 8). The suffix added noise, not signal.
- No subagent-side change needed. Semantic search handles cross-namespace retrieval for free.
- Ponytail: 1 line of orchestrator + 1 explanatory paragraph = full P2. Original spec called for an orchestrator rule that detects categories and adds hints — collapsed to "use the broad query, trust semantic search".

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

### P0 (Issue 14, ~20 min) — DONE

- [x] Orchestrator's Delegation Protocol includes `ov find` for project lessons in every subagent task prompt
- [x] Each subagent (`builder`, `reviewer`, `browser-qa`) has "Apply prior lessons" rule
- [x] Each subagent has "Store what you learned" rule at task end
- [x] Manual test: 2 sequential builder tasks on same project, 2nd task retrieves 1st task's lesson
- [x] **P0 leftover fix (b7a764d)**: orchestrator's own Memory Protocol updated to use `ov add-memory` (no `ov remember`)

### P1 (memory-dreaming skill, ~2 hours) — DONE (YAGNI cut to 95 lines)

- [x] `skills/engineering/memory-dreaming/SKILL.md` created
- [x] Trigger keywords: "consolidate", "dream", "clean up lessons", "memory hygiene"
- [x] Skill lists all project lessons (single broad query)
- [x] Skill identifies duplicates (per-entry diff; stale + contradiction YAGNI'd per spec contradictions)
- [x] Skill presents plan to user BEFORE writing back
- [x] User can accept/edit/discard proposed changes
- [x] Skill reports "Consolidated N → M" (YAGNI: dropped "K archived" stat)
- [x] Verified live: "consolidate opencode-workflow lessons" → 11 entries, 0 dupes, 0 contradictions, honest "no action needed"

### P2 (cross-agent sharing, ~30 min) — DONE (1 line)

- [x] Orchestrator has rule: "Use bare project name in `ov find` (no subagent suffix). Single broad query covers all namespaces."
- [x] Empirical test confirmed: 9 vs 8 results between narrow/broad query → suffix adds noise, not signal
- [x] Manual test: subagent lessons stored via `ov add-memory` are findable by other subagents via the orchestrator's broad query in next delegation

## Out of Scope (defer)

- Per-agent memory stores (over-engineering for v1)
- Cross-project memory sharing (different problem — currently each project has its own lessons)
- Memory TTL/expiration (OpenViking has it, we don't need another layer)
- Vector DB integration (OpenViking's semantic search is enough)
- **v1.5 — Visual Memory (OpenViking VLM via Gemini/9router)**: deferred. Text path (P0+P1+P2) ships first. Add image indexing once text path validates. See "Visual Memory (EXTENDABLE — not for v1)" section above for v1.5 design.

## Ship Record

- **Commit**: `b7a764d` — "feat: Issue 18 P1+P2 — memory-dreaming skill + cross-agent sharing"
- **Files changed**: 4 (3 modified, 1 new)
  - `agents/orchestrator.md` (P0 leftover fix + P2 broad query)
  - `skills/engineering/memory-dreaming/SKILL.md` (new, 95 lines)
  - `README.md` (top-level, +1 entry)
  - `skills/engineering/README.md` (+1 entry)
  - `~/.config/opencode/opencode.json` (16th skill trigger, 4 keywords — local config, not in repo)
- **Live test**: "consolidate opencode-workflow lessons" → skill auto-loaded, 11 entries returned, 0 dupes, honest "no action needed"
- **Real impact**: P0 verified, P1+p2 ready for use. Lesson count will need to grow to ~15-20 before the dreaming skill has meaningful work to do.

## Notes

The framework from Anthropic is mature, production-tested (Harvey, Wisedocs), and has academic foundations (CLS theory, experience replay, generative agents). We don't need to invent — we need to apply the pattern to our existing infrastructure (OpenViking + subagent architecture).

Ponytail cut: 3 priority levels, ~2.5 hours total. No new framework. Use existing OpenViking, subagent delegation, skill triggers. P1 ended up at 95 lines (vs 200-300 spec estimate) by collapsing 4 phases → 2 and dropping speculative features (stale detection, contradiction primitive, per-namespace queries, "K archived" stat).

This issue is the foundation. Without it, Issue 14 alone gives us 80% of the benefit. With P1, we get the consolidation that prevents lesson-staleness. With P2, we get cross-agent learning. All three shipped in `b7a764d`.

### Rubber Duck Synthesis (process log)

Before building P1, spawned 3 parallel `explore` subagents with different lenses:
- **YAGNI / ponytail**: 4-phase pipeline is over-engineered for the 0 actual lessons we have. `ov rm` is unverified risk. Spec itself contradicts its own archive phase ("TTL handles cleanup" vs explicit prune). Recommendation: collapse 4 → 2 phases.
- **User pain**: real pain is past (P0 solved it today). Current pain: 0 lessons. The 4-phase pipeline solves an enterprise-scale problem; user is solo with <10 sessions/week. False-merge risk is the killer issue (merged output loses edge case, user loses trust in memory system entirely). Recommendation: skeleton, 40-60 lines.
- **Integration**: `agents/orchestrator.md` lines 17-29 still used hallucinated `ov remember` (P0 leftover). `ov add-memory` only appends; `ov rm` works on auto-routed entries (verified). Skill output has no hook back to orchestrator state. Recommendation: fix P0 leftover, single broad query to cover all subagent namespaces.

**Middle ground adopted**: 2-phase skeleton, 95 lines, single broad query, P0 leftover fixed, P2 = 1 orchestrator line. P1 finished + shipped in same session as the synthesis.

## References

- Full research: `.scratch/research/memory-dreaming-framework.md` (423 lines)
- 12 Anthropic official sources (blog, docs, workshop)
- 5 academic papers (McClelland 1995, Mnih 2015, Tulving 1972, Park 2023, Packer 2023)
- Karpathy llm-wiki (June 2026) — parallel architecture
