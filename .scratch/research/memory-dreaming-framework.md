# Memory & Dreaming Framework for Self-Learning Agents

Deep research report extracting the theoretical framework from Anthropic's "Memory and dreaming for self-learning agents" talk (Code w/ Claude 2026, May 6, Mahesh Murag) and mapping it to our OpenCode workflow architecture.

---

## 1. Video Content Reconstruction

**Source:** "Memory and dreaming for self-learning agents" — Code w/ Claude 2026, San Francisco, May 6, 2026. Speaker: Mahesh Murag, Member of Technical Staff, Anthropic.

No transcript available. Framework reconstructed from:
- Anthropic blog posts (May 8 + April 23, 2026)
- Official API docs (platform.claude.com/docs)
- Workshop repo (anthropics/cwc-workshops/agents-that-remember)
- VentureBeat, ZDNET, The New Stack, DEV.to, Dotzlaw, Refactix, MindStudio, Girish Sahu coverage
- Karpathy's llm-wiki gist (June 2026) and downstream analysis

### 1.1 What "Memory" Means (vs Traditional DB)

**Not a vector store. Not a database. A filesystem.**

Anthropic's memory is a **workspace-scoped collection of text documents** mounted as a directory (`/mnt/memory/`) inside the agent's sandbox. The agent reads and writes memory using the same `bash`, `read`, `write`, `edit`, `glob`, `grep` tools it uses for everything else.

> "We found that agents are most effective with memory when it builds on the tools they already use. Memory on Managed Agents mounts directly onto a filesystem, so Claude can rely on the same bash and code execution capabilities that make it effective at agentic tasks." — [Anthropic blog, April 23, 2026](https://claude.com/blog/claude-managed-agents-memory)

Key properties:
- **Files, not embeddings.** Each memory is a text file (≤100KB), addressed by path. No vector DB, no semantic search infrastructure.
- **Filesystem-native.** Agent uses standard file tools. No dedicated memory API to learn.
- **Versioned.** Every mutation creates an immutable `memver_...` snapshot. Full audit trail.
- **Scoped.** Up to 8 stores per session. Stores can be `read_only` (shared reference) or `read_write` (per-agent).
- **Observable.** All changes tracked with audit logs. You can see which agent wrote what, roll back, redact.

This is closer to **Karpathy's LLM Wiki pattern** than to RAG. The memory is a compiled, structured artifact — not raw documents indexed for retrieval.

### 1.2 What "Dreaming" Means

**Offline consolidation of memory between sessions. Not retraining. Not fine-tuning. Structured note-taking on a schedule.**

Dreaming is a scheduled async job that:
1. **Reads** the existing memory store + 1-100 past session transcripts
2. **Extracts** patterns, recurring mistakes, convergent workflows, shared preferences
3. **Reconciles** — merges duplicates, resolves contradictions (latest wins), corrects stale beliefs
4. **Prunes** — drops entries that are stale or superseded
5. **Writes** a new output memory store (input is never modified)

> "Dreaming is a process that looks for patterns and mistakes across your recent agent sessions and their transcripts and automatically produces organized and up-to-date memory content." — Mahesh Murag, Code w/ Claude 2026

> "Dreaming comprehensively looks through recent transcripts, looks for common mistakes, things that a bunch of agents are doing like a failed tool call or strategies that are working out for them, and finds opportunities to update the memory state that will improve it in the future." — Murag, same talk

**The neuroscience mapping is explicit, not metaphorical:**

| Biological Brain | Claude Dreaming |
|---|---|
| Runs during sleep, offline | Runs between sessions, async |
| Replays recent experiences | Reads recent session transcripts |
| Finds patterns across days | Finds patterns across sessions |
| Consolidates into long-term memory | Writes reorganized memory store |
| Original experience not modified | Original memory store untouched |
| You wake up having learned | Agent starts next session having learned |

**The four-phase pipeline** (from InventiveHQ's detailed breakdown):
1. **Review** — read existing store + batch of transcripts
2. **Extract** — identify recurring patterns, facts, preferences, outcomes
3. **Reconcile** — merge duplicates, resolve contradictions (latest value wins), correct wrong beliefs
4. **Prune** — drop stale/superseded entries, keep store compact

**Two modes:**
- **Automatic** — writes consolidated memory back without human approval
- **Review-before-write** — surfaces changes for human accept/edit/discard

### 1.3 How Memory Is Verified

The video and docs emphasize that dreaming is a **verification pass**, not just reorganization:

- **Fact-checking across sessions.** If Session 3 contradicts Session 1's memory entry, dreaming resolves in favor of Session 3 (latest value).
- **Staleness detection.** Entries that haven't been referenced or confirmed get flagged. A "temporary experiment" note shouldn't override a confirmed older policy (this was a real bug Anthropic found — fixed by labeling notes as `confirmed` vs `experimental`).
- **Contradiction merging.** When two agents independently learn different things about the same topic, dreaming reconciles.
- **Non-destructive.** Input store is never modified. Output is a separate store. Enterprise can review, reject, or discard.

From Refactix's production analysis:
> "Dreaming works at a higher level of abstraction than session memory. Session memory captures what happened in one conversation. Dreaming finds patterns across many conversations. You need both."

### 1.4 How Memory Is Enriched

Enrichment happens during the extract/reconcile phases:

- **Pattern surfacing.** Recurring mistakes across agents become explicit "don't do X" entries.
- **Convergent workflow detection.** When multiple agents independently discover the same strategy, dreaming crystallizes it into a playbook.
- **Cross-agent learning.** Agent B benefits from Agent A's lessons without direct communication.
- **Backfilling.** Missing context (dates, identifiers, file paths) gets added from transcripts.
- **Organization.** Flat memory files get restructured into topic-based pages with cross-references.

From the CWC workshop:
> "It'll look through each one, do again fact-checking, enriching with additional details, maybe dates, specific identifiers, and then it will also organize those memory files and see if there's any duplicates."

### 1.5 The Self-Learning Loop

**When does the agent learn?** Three triggers:

1. **During session (online).** Agent writes to memory store as it works. Incremental, local, immediate.
2. **Between sessions (dreaming).** Async consolidation finds cross-session patterns. Scheduled, global, deferred.
3. **At session start (recall).** New session reads consolidated memory store. Gets compiled context from moment zero.

**The loop:**
```
Session reads Memory → Session produces logs → Dreaming compiles logs into Memory → Next session reads improved Memory
```

> "The ultimate goal of dreaming is continuous self-learning and self-improvement where the next day's agents automatically get better based on the learnings and the work of the previous day's experience." — Murag

**Harvey (legal AI) production results:**
- Completion rates went up ~6x after enabling dreaming
- Agents remembered filetype workarounds and tool-specific patterns between sessions
- Multi-agent orchestration + dreaming = agents that verify their own work

**Wisedocs (document verification):**
- Cross-session memory for recurring document issues
- 30% speedup in verification

### 1.6 Production Details

- **Supported models:** claude-opus-4-8, claude-opus-4-7, claude-sonnet-4-6
- **Async execution:** minutes to tens of minutes depending on input size
- **Input:** memory store + 1-100 session transcripts
- **Output:** new memory store (non-destructive)
- **Instructions field:** 4,096 chars of steering guidance ("focus on coding-style preferences, ignore one-off debugging notes")
- **Observable:** streaming events during dream execution, session archived (not deleted) after completion
- **Access:** research preview, request required (as of June 2026)

---

## 2. Academic Foundations

### 2.1 Complementary Learning Systems (CLS) — The Direct Inspiration

Anthropic's dreaming is explicitly modeled on the CLS theory of hippocampal memory consolidation.

**Core paper:** McClelland, J.L., McNaughton, B.L., & O'Reilly, R.C. (1995). "Why There Are Complementary Learning Systems in the Hippocampus and Neocortex: Insights from the Successes and Failures of Connectionist Models of Learning and Memory." *Psychological Review*, 102(3), 419–457.

**The theory:** The brain has two complementary learning systems:
- **Hippocampus** — fast learning, stores individual episodes, pattern-separated
- **Neocortex** — slow learning, extracts generalizations, interleaved learning

During sleep, hippocampal replay "teaches" the neocortex by reactivating recent experiences interleaved with older memories, gradually integrating new knowledge without catastrophic interference.

**Updated review:** Kumaran, D., Hassabis, D., & McClelland, J.L. (2016). "What Learning Systems do Intelligent Agents Need? Complementary Learning Systems Theory Updated." *Trends in Cognitive Sciences*, 20(7), 512–534.

Key extension: replay isn't just for consolidation — it allows **goal-dependent weighting** of experience. Important/salient events get replayed more.

**The mapping to Claude Dreaming:**

| CLS Theory | Claude Dreaming |
|---|---|
| Hippocampus (fast learning, episodes) | Session memory (agent writes as it works) |
| Neocortex (slow learning, generalizations) | Memory store (compiled, structured knowledge) |
| Hippocampal replay during sleep | Dreaming reads session transcripts |
| Interleaved learning (avoid catastrophic interference) | Merging new lessons with existing store |
| Systems-level consolidation | Cross-session pattern extraction |
| Sharp-wave ripples (SWR) trigger replay | Scheduled async trigger |

### 2.2 Experience Replay in Reinforcement Learning

**Foundational paper:** Mnih, V., Kavukcuoglu, K., Silver, D. et al. (2015). "Human-level control through deep reinforcement learning." *Nature*, 518, 529–533.

DQN's experience replay stores `(state, action, reward, next_state)` tuples in a replay buffer and samples randomly during training. This:
- Removes correlations in sequential data
- Smooths training distribution
- Allows each experience to be used in many weight updates

> "Disabling this function caused a severe deterioration in performance." — Google Research blog on DQN

**The connection to agent memory:** DQN's replay buffer is the RL analog of Anthropic's session transcripts. Both store raw experiences for later offline processing. The difference: DQN replays for weight updates (model learning); Anthropic replays for memory curation (knowledge management).

**Prioritized experience replay:** Schaul, T., Quan, J., Antonoglou, I., & Silver, D. (2015). "Prioritized Experience Replay." *arXiv:1511.05952.*

Not all experiences are equal. Prioritized replay samples important transitions more frequently. This maps to Anthropic's `instructions` field in dreaming — steering which patterns to focus on.

### 2.3 Episodic vs Semantic Memory (Tulving's Framework)

**Original framework:** Tulving, E. (1972). "Episodic and Semantic Memory." In *Organization of Memory* (pp. 381–403).

- **Episodic memory** — what happened, when, where (autobiographical, time-stamped)
- **Semantic memory** — general knowledge, facts, concepts (abstracted, time-independent)

**Mapping to agent architecture:**

| Memory Type | Anthropic | Our System |
|---|---|---|
| Episodic | Session transcripts (raw logs) | OpenViking `viking://agent/projects/<project>` entries |
| Semantic | Memory store (compiled knowledge) | OpenViking `viking://agent/patterns/<category>` entries |
| Procedural | Skills, system prompts | `AGENTS.md`, skill files, orchestrator rules |

### 2.4 Karpathy's LLM Wiki Pattern (June 2026)

**Source:** [github.com/karpathy/llm-wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

Karpathy's gist (5,000+ stars, 4,000+ forks) describes the same architecture Anthropic shipped as a platform primitive:

> "Instead of just retrieving from raw documents at query time, the LLM incrementally builds and maintains a persistent wiki — a structured, interlinked collection of markdown files that sits between you and the raw sources."

Three layers:
1. **Raw sources** — immutable input (session logs, documents)
2. **Wiki** — LLM-compiled, interlinked markdown (the memory store)
3. **Schema** — `AGENTS.md` / `CLAUDE.md` that tells the LLM how to maintain the wiki

Dotzlaw Consulting's analysis nailed it: "Memory and Dreaming address the semantic layer: the compiled, queryable representation of what the agent team has learned. Memory is the query-time interface. Dreaming is the compile-time interface."

### 2.5 Generative Agents (Park et al., 2023)

**Paper:** Park, J.S., O'Brien, J.C., Cai, C.J. et al. (2023). "Generative Agents: Interactive Simulacra of Human Behavior." *UIST 2023*.

Key insight: agents need a **reflection** mechanism that periodically synthesizes observations into higher-level insights. Without reflection, agents accumulate raw observations but never abstract. The reflection tree fires when accumulated importance crosses a threshold — analogous to Anthropic's scheduled dreaming trigger.

### 2.6 Letta (MemGPT) — Sleep-Time Agent

**Paper:** Packer, C., Fang, V., Patil, S.G. et al. (2023). "MemGPT: Towards LLMs as Operating Systems." *arXiv:2310.08560*.

Letta implements a "sleep-time agent" that consolidates memory during idle periods — closest prior art to Anthropic's dreaming. Trigger: every N steps (configurable). The dreaming primitive in Managed Agents is the production-shipped version of this pattern.

---

## 3. Mapping to Our System (OpenCode Workflow Kit)

### 3.1 Current Architecture

```
Orchestrator (primary, expensive model)
├── builder (subagent, cheap)
├── reviewer (subagent, cheap)
├── browser-qa (subagent, cheap)
├── explore (built-in)
└── scout (built-in)
```

**Current memory:** OpenViking (persistent semantic memory via `ov find` / `ov remember`).

**Current pain (Issue 14):** Subagent context loss. Builder in session N learns something; builder in session N+1 re-learns it from scratch. Same 11 writing rules repeated 3 times.

**Current fix (Issue 01):** Orchestrator does `ov find` at task start, `ov remember` at task end. Subagents don't yet have this.

### 3.2 What "Memory" Means for Our System

**For the orchestrator:**
- `viking://agent/projects/<project>` — project-specific lessons (what worked, what to avoid)
- `viking://agent/patterns/<category>` — tool failure patterns, workarounds, conventions
- `viking://agent/domains/<domain>` — domain knowledge that persists across projects

**For each subagent (builder, reviewer, browser-qa):**
- `viking://agent/projects/<project>/lessons` — lessons from prior sessions on this project
- `viking://agent/roles/<role>` — role-specific patterns (e.g., builder knows officecli pitfalls)

**The filesystem analogy holds.** OpenViking already stores structured knowledge. The gap isn't storage — it's **consolidation and cross-session retrieval**.

### 3.3 What "Memory" Means for Each Subagent

| Agent | Memory Input | Memory Output |
|---|---|---|
| **Orchestrator** | Project history, routing decisions, task outcomes | Project lessons, routing heuristics |
| **Builder** | Prior build patterns, tool failures, style mappings | Build lessons, code conventions |
| **Reviewer** | Prior review findings, common issues, review patterns | Review checklists, issue patterns |
| **Browser-qa** | Prior browser issues, snapshot patterns, test failures | QA patterns, browser quirks |

### 3.4 Where "Dreaming" Fits

**NOT end-of-session (too frequent, too noisy).** Anthropic's dreaming runs on a schedule, not per-session.

**Our options:**

1. **Pre-session (recommended for v1).** Before starting work, orchestrator runs a lightweight consolidation:
   ```
   ov find "viking://agent/projects/<project>/lessons" → apply
   ov find "viking://agent/patterns/*" → apply relevant
   ```
   This is what Issue 14 already proposes. It's recall, not consolidation.

2. **End-of-day / end-of-sprint (the actual dreaming).** After N sessions accumulate, run consolidation:
   - Read all session logs from the day
   - Extract recurring patterns
   - Merge duplicates in OpenViking
   - Flag stale entries
   - Update project lessons

3. **Post-task (lightweight).** After each completed task, the orchestrator stores a 1-2 sentence lesson. This is the "online" memory write — the hippocampal encoding.

**The key insight from Anthropic:** Dreaming is NOT the same as writing memory. Writing is local, incremental, during-session. Dreaming is global, cross-session, between-sessions. You need both.

### 3.5 What "Self-Learning" Looks Like

In our context, self-learning means:

1. **Builder doesn't repeat the same officecli workaround.** It reads lessons at task start, applies them.
2. **Reviewer catches patterns the builder keeps missing.** Cross-agent memory: reviewer's findings feed into builder's lessons.
3. **Orchestrator routes better over time.** It remembers which subagent performed best on which task type.
4. **Tool failures get resolved faster.** Pattern is stored once, applied everywhere.

**Concrete loop:**
```
Task arrives → Orchestrator recalls relevant lessons → Delegates to subagent
→ Subagent executes, writes incremental lessons → Task completes
→ Orchestrator stores outcome → After N tasks, consolidation runs
→ Patterns extracted, duplicates merged, stale entries pruned
→ Next cycle starts with improved memory
```

### 3.6 Design Proposal

#### BUILD (Priority Order)

**P0: Issue 14 — Subagent lessons persistence** (already scoped, ~20 min)
- Add `ov find` for project lessons to orchestrator's delegation protocol
- Add `ov find` / `ov remember` to each subagent's task start/end
- This is the "hippocampal encoding" — the online write layer

**P1: Lightweight dreaming skill** (new skill, ~2 hours)
- `skills/engineering/memory-dreaming/SKILL.md`
- Trigger: user says "consolidate memory", "dream", "clean up lessons"
- What it does:
  1. `ov find "viking://agent/projects/*"` → list all project entries
  2. Identify duplicates (same lesson stored 3x from 3 sessions)
  3. Identify contradictions (lesson from project A conflicts with project B)
  4. Suggest merges/deletions to user
  5. User approves → `ov remember` consolidated version
- This is manual-trigger dreaming. Start here before automating.

**P2: Cross-agent memory sharing** (orchestrator rule, ~30 min)
- When reviewer finds an issue, orchestrator stores it in builder's lessons too
- When builder discovers a tool workaround, orchestrator stores it in reviewer's context
- Pattern: orchestrator as the "neocortex" — receives replay from all agents, integrates

#### DON'T BUILD (YAGNI)

- **Automated scheduling.** OpenCode has no session-start hook, no cron. Manual trigger is enough.
- **Vector search over memories.** OpenViking's `ov find` is semantic search. Good enough.
- **Memory versioning/rollback.** OpenViking already versions. Don't add another layer.
- **Dreaming confidence scores.** Over-engineering. Human review is the quality gate.
- **Separate memory stores per subagent type.** One `viking://agent/projects/<project>/lessons` shared across agents is simpler. Differentiate by content, not by storage.

### 3.7 Implementation Sketch

**Issue 14 (orchestrator rule addition):**
```markdown
## Delegation Protocol (add to orchestrator.md)

Before delegating to any subagent, include in the task prompt:
```
Prior lessons for this project:
$(ov find "viking://agent/projects/<project>/lessons" 2>/dev/null || echo "No prior lessons.")
Apply these. Do not re-derive what's already known.
```

After task completion, store outcome:
```
ov remember "viking://agent/projects/<project>/lessons" "<1-sentence: what was learned>"
```
```

**Dreaming skill (SKILL.md skeleton):**
```markdown
# Memory Dreaming Skill

## Trigger
User says "consolidate memory", "clean up lessons", "dream"

## Protocol
1. List all project lessons: `ov find "viking://agent/projects/*/lessons"`
2. Read each entry, identify:
   - Duplicates (same lesson, different wording)
   - Contradictions (lesson A says X, lesson B says not-X)
   - Stale entries (referenced project no longer active)
3. Present consolidation plan to user
4. On approval:
   - Merge duplicates → single canonical entry
   - Resolve contradictions → keep latest, archive older
   - Archive stale entries
5. Report: "Consolidated N entries into M. K entries archived."
```

---

## Sources

### Anthropic Official
- [Built-in memory for Claude Managed Agents](https://claude.com/blog/claude-managed-agents-memory) — April 23, 2026
- [New in Claude Managed Agents: dreaming, outcomes, and multiagent orchestration](https://claude.com/blog/new-in-claude-managed-agents) — May 19, 2026
- [Dreams API documentation](https://platform.claude.com/docs/en/managed-agents/dreams.md)
- [Using agent memory — API docs](https://platform.claude.com/docs/en/managed-agents/memory)
- [Claude Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview)
- [CWC workshop: Agents that remember](https://github.com/anthropics/cwc-workshops/tree/main/agents-that-remember) — May 6, 2026
- [Code w/ Claude session page](https://claude.com/code-with-claude/session/sf-memory-and-dreaming-for-self-learning-agents) — Speaker: Mahesh Murag

### Coverage & Analysis
- [VentureBeat: Anthropic introduces "dreaming"](https://venturebeat.com/technology/anthropic-introduces-dreaming-a-system-that-lets-ai-agents-learn-from-their-own-mistakes) — Michael Nuñez, May 8, 2026
- [ZDNET: Your Claude agents can 'dream' now](https://www.zdnet.com/article/your-claude-agents-can-dream-now-how-anthropics-new-feature-works/) — May 6, 2026
- [The New Stack: Anthropic will let its managed agents dream](https://thenewstack.io/anthropic-managed-agents-dreaming-outcomes/) — Frederic Lardinois, May 6, 2026
- [DEV.to: What That Means for Your Architecture](https://dev.to/techsifted/anthropics-dreaming-lets-claude-agents-learn-from-their-own-mistakes-heres-what-that-means-30a1) — May 13, 2026
- [Dotzlaw: Memory and Dreaming — The Karpathy Wiki Pattern](https://dotzlaw.com/insights/ai-08-memory-and-dreaming/) — June 17, 2026
- [Refactix: Claude Dreaming memory consolidation](https://refactix.com/ai-development-engineering/claude-dreaming-agent-memory-consolidation) — May 15, 2026
- [MindStudio: What Is Claude Dreaming?](https://www.mindstudio.ai/blog/what-is-claude-dreaming-anthropic-agent-memory) — May 9, 2026
- [Girish Sahu: Claude is Dreaming](https://www.girishsahu.com/blog/Claude-is-Dreaming) — May 22, 2026
- [Digital Applied: AI Agent Memory 2026](https://www.digitalapplied.com/blog/ai-agent-memory-vector-graph-episodic-2026) — May 23, 2026
- [InventiveHQ: Claude's Dreaming Explained](https://inventivehq.com/blog/claude-agents-dreaming-explained) — June 9, 2026
- [Claude Lab: Wiring Claude's Dreaming](https://claudelab.net/en/articles/api-sdk/claude-dreaming-memory-hygiene-long-running-agents) — June 14, 2026
- [Medium: Anthropic Dreaming Is a Markdown Rewriter](https://medium.com/@wasowski.jarek/anthropic-dreaming-is-a-markdown-rewriter-the-vendor-lock-in-is-real-1d5f44d290bf) — May 27, 2026

### Academic
- McClelland, J.L., McNaughton, B.L., & O'Reilly, R.C. (1995). "Why There Are Complementary Learning Systems in the Hippocampus and Neocortex." *Psychological Review*, 102(3), 419–457. [PDF](https://stanford.edu/~jlmcc/papers/McCMcNaughtonOReilly95.pdf)
- Kumaran, D., Hassabis, D., & McClelland, J.L. (2016). "What Learning Systems do Intelligent Agents Need?" *Trends in Cognitive Sciences*, 20(7), 512–534. [PDF](http://stanford.edu/~jlmcc/papers/KumaranHassabisMcClelland16FinalMS.pdf)
- O'Reilly, R.C. et al. (2014). "Computational Cognitive Neuroscience." [PDF](https://ccnlab.org/papers/OReillyBhattacharyyaHowardEtAl14.pdf)
- Mnih, V. et al. (2015). "Human-level control through deep reinforcement learning." *Nature*, 518, 529–533. [PDF](https://deepmind-media.storage.googleapis.com/dqn/DQNNaturePaper.pdf)
- Schaul, T. et al. (2015). "Prioritized Experience Replay." *arXiv:1511.05952*.
- Park, J.S. et al. (2023). "Generative Agents: Interactive Simulacra of Human Behavior." *UIST 2023*.
- Packer, C. et al. (2023). "MemGPT: Towards LLMs as Operating Systems." *arXiv:2310.08560*.
- Tulving, E. (1972). "Episodic and Semantic Memory." In *Organization of Memory*.
- Lin, L.J. (1992). "Self-improving reactive agents based on reinforcement learning, planning and teaching." *Machine Learning*, 8(3-4), 293–321. (Original experience replay paper)

### Karpathy
- [llm-wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — June 21, 2026
- [AAIF: Karpathy's LLM Wiki as Agent Memory](https://aaif.io/blog/karpathys-llm-wiki-as-agent-memory/) — Angie Jones, June 8, 2026

### Our System
- [Issue 01: OpenViking memory protocol](../../.scratch/issues/01-openviking-memory-protocol.md)
- [Issue 14: Subagent lessons persistence](../../.scratch/issues/14-subagent-lessons-persistence.md)
- `agents/orchestrator.md` — existing Memory Protocol section (lines 9-22)

---

## Addendum: OpenViking VLM Discovery (2026-06-23)

User clarified: their OpenViking setup has TWO backends, not one.

```json
// /home/todayz/.openviking/ov.conf
{
  "embedding": {
    "provider": "ollama",
    "model": "qwen3-embedding:0.6b",
    "api_base": "http://localhost:11434/v1"
  },
  "vlm": {
    "provider": "openai",                              // 9router
    "model": "gemini/gemini-3.1-flash-lite-preview",
    "api_base": "http://localhost:20128/v1",
    "max_concurrent": 32
  }
}
```

**What this means for the self-learning pipeline:**

- **Text path** (already designed): `ov find "<query>"` → qwen 0.6b embeds query + vectors → semantic search
- **Visual path** (NEW capability, not in v1): `ov add-resource <image>` → Gemini via 9router auto-describes → description indexed → `ov find "screenshot of X"` returns the image

**3 Gemini accounts via 9router** = round-robin for VLM rate-limit safety. The `max_concurrent: 32` setting means OpenViking can fire 32 parallel VLM calls during bulk indexing (e.g., end-of-month dreaming on 200+ screenshots).

**Net effect for self-learning (v1.5, not v1):**

| Phase | Text only (v1) | Text + Visual (v1.5) |
|-------|----------------|----------------------|
| Online (Phase 1) | text lessons | text lessons + screenshots (VLM auto-describes) |
| Dreaming (Phase 2) | text dedup, reconcile | text dedup + visual pattern grouping (VLM similarity) |
| Recall (Phase 3) | text rules | text rules + reference images ("this is what good looks like") |

**Why YAGNI for v1, extendable for v1.5**: text path is 80% of self-learning value. Visual path is 5x richer but adds complexity. Ship text path first, validate, then add visual.

**Implementation note for future**: the `ov remember` command in P1 of Issue 18 should support `--image <path>` flag. The dreaming skill should call VLM via OpenViking's built-in handling (no separate VLM API call needed from the skill).
