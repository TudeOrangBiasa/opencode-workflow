import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Fetch URL content as markdown via 9router AI gateway. Providers: jina-reader (fastest, free), firecrawl (JS-rendered), tavily (bulk), exa (pre-indexed), fetch-combo (auto-fallback).",
  args: {
    url: tool.schema.string().describe("URL to fetch"),
    model: tool.schema.string().default("jina-reader").describe("Provider: jina-reader, firecrawl, tavily, exa, fetch-combo"),
    format: tool.schema.string().default("markdown").describe("markdown, text, html"),
  },
  async execute(args) {
    const base = process.env.NINEROUTER_URL || "http://localhost:20128"
    const key = process.env.NINEROUTER_KEY
    if (!key) throw new Error("NINEROUTER_KEY not set")

    const res = await fetch(`${base}/v1/web/fetch`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: args.model, url: args.url, format: args.format }),
    })
    if (!res.ok) throw new Error(`9router fetch ${res.status}: ${await res.text()}`)
    return await res.text()
  },
})
