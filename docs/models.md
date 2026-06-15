# Model Routing

Use expensive models for judgement. Use cheap/free models for bounded execution.

See [`docs/templates/opencode.primitive-agents.jsonc`](./templates/opencode.primitive-agents.jsonc) for a local config template with model routing.

## Expensive / Judgement Tier

Use for `orchestrator`, `planner`, and deep `reviewer` runs. These handle planning, routing, hard review, and tradeoffs.

Candidate model families:

- Mimo v2.5 Pro
- Kimi K2.6
- DeepSeek v4 Pro
- Qwen 3.7
- MiniMax M3

## Cheap / Execution Tier

Use for `builder`, `explore`, `scout`, and low-risk quick review. These receive bounded tasks with acceptance criteria and verification commands.

Candidate model families:

- DeepSeek v4 Flash
- Mimo v2.5
- ther fast/free text models that follow narrow instructions

## Browser / Multimodal Tier

Use for `browser-qa`. Browser QA is separate because screenshots, DOM snapshots, page sweeps, and console/network evidence are token-heavy. Do not route browser work to models that cannot handle visual/browser evidence well.

Candidate model families:

- Mimo v2.5 Pro
- Qwen multimodal-capable model, if available

## Parallelism

- Parallel read-only exploration is safe when questions are independent.
- Parallel browser QA/evidence is safe when pages or symptoms are independent.
- Parallel implementation is unsafe unless files and state are provably disjoint.
- Related failing tests should be handled sequentially until one root cause is ruled out.
- Max 3 parallel agents total.

## Rule

Keep repo agent files model-free. Exact model IDs live in local config templates or `~/.config/opencode/opencode.json` during activation. Use exact IDs from `opencode models` — names above are template candidates that may need provider-specific adjustment.
