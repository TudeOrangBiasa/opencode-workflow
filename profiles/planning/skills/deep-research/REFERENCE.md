# Deep Research — Reference

## Required Tools

- **9router-web-search** — web search (round-robin: Tavily, Exa, Brave, Serper, Perplexity, Linkup)
- **9router-web-fetch** — URL → markdown (Jina Reader, Firecrawl, Tavily, Exa)

Both available in all profiles. See `.opencode/tools/`.

## Full Workflow

### Step 1: Understand the Goal

Ask 1-2 quick clarifying questions:
- "What's your goal — learning, making a decision, or writing something?"
- "Any specific angle or depth you want?"

If the user says "just research it" — skip ahead with reasonable defaults.

### Step 2: Plan the Research

Break the topic into 3-5 research sub-questions. Example for "Impact of AI on healthcare":
- What are the main AI applications in healthcare today?
- What clinical outcomes have been measured?
- What are the regulatory challenges?
- What companies are leading this space?
- What's the market size and growth trajectory?

### Step 3: Execute Multi-Source Search

For each sub-question, use `9router-web-search`:
```
9router-web-search: query="<sub-question keywords>" max_results=5
```

Search strategy:
- Use 2-3 different keyword variations per sub-question
- Mix general and topic-specific queries
- Aim for 10-20 unique sources total
- Prioritize: official docs, academic, reputable news > blogs > forums

### Step 4: Deep-Read Key Sources

For the most promising URLs, fetch full content with `9router-web-fetch`:
```
9router-web-fetch: url="<url>" format="markdown"
```

Use `model="firecrawl"` for JS-rendered pages, `model="jina-reader"` for fastest. Read 3-5 key sources in full.

### Step 5: Synthesize and Write Report

```markdown
# [Topic]: Research Report
*Generated: [date] | Sources: [N] | Confidence: [High/Medium/Low]*

## Executive Summary
[3-5 sentence overview of key findings]

## 1. [First Major Theme]
[Findings with inline citations]

## 2. [Second Major Theme]
...

## 3. [Third Major Theme]
...

## Key Takeaways
- [Actionable insight 1]
- [Actionable insight 2]

## Sources
1. [Title](url) — [one-line summary]

## Methodology
Searched [N] queries across multiple search providers. Analyzed [M] sources.
```

### Step 6: Deliver

- **Short topics**: Post full report in chat
- **Long reports**: Post executive summary + key takeaways, save full report to file

## Parallel Research with Subagents

For broad topics, parallelize with `task` tool:

```
Agent 1: Research sub-questions 1-2
Agent 2: Research sub-questions 3-4
Agent 3: Research sub-question 5 + cross-cutting themes
```

Each agent uses 9router-web-search/fetch. Main session synthesizes final report.

## Example Queries

```
"Research the current state of nuclear fusion energy"
"Deep dive into Rust vs Go for backend services in 2026"
"Research the best strategies for bootstrapping a SaaS business"
"What's happening with the US housing market right now?"
"Investigate the competitive landscape for AI code editors"
```
