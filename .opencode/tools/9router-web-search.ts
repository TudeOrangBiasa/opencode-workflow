import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Search web via 9router AI gateway. Multi-provider round-robin: tavily, exa, brave-search, serper, perplexity, linkup, search-combo (auto-fallback).",
  args: {
    query: tool.schema.string().describe("Search query"),
    model: tool.schema.string().default("search-combo").describe("Provider: tavily, exa, brave-search, serper, perplexity, linkup, search-combo"),
    max_results: tool.schema.number().default(5).describe("Results count (1-20)"),
  },
  async execute(args) {
    const base = process.env.NINEROUTER_URL || "http://localhost:20128"
    const key = process.env.NINEROUTER_KEY
    if (!key) throw new Error("NINEROUTER_KEY not set")

    const res = await fetch(`${base}/v1/search`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: args.model, query: args.query, max_results: args.max_results }),
    })
    if (!res.ok) throw new Error(`9router search ${res.status}: ${await res.text()}`)

    const data = await res.json() as { results?: Array<{ title?: string; url?: string; content?: string }> }
    if (!data.results?.length) return "No results found."

    return data.results.map((r, i) =>
      `[${i + 1}] ${r.title || "Untitled"}\n    URL: ${r.url || "N/A"}\n    ${(r.content || "").slice(0, 500)}`
    ).join("\n\n")
  },
})
