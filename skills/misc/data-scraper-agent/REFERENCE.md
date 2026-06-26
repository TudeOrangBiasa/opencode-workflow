# Data Scraper Agent — Reference

## Architecture
```
COLLECT → ENRICH → STORE
 Scraper    AI (LLM)  Database
```

## Free Stack
| Tool | Why |
|---|---|
| requests + BeautifulSoup | Free, covers 80% of sites |
| Playwright | JS-rendered sites |
| Gemini Flash API | 500 req/day free |
| Notion / Sheets / Supabase | Free tier storage |
| GitHub Actions cron | Free for public repos |

## AI Model Fallback Chain
```
gemini-2.0-flash-lite (30 RPM) → gemini-2.0-flash (15 RPM) → gemini-2.5-flash (10 RPM) → flash-lite-latest
```

## Directory Structure
```
my-agent/
├── config.yaml              # User customises
├── profile/context.md       # User context for AI
├── scraper/main.py          # Orchestrator
├── scraper/sources/         # One file per source
├── ai/client.py             # Gemini REST client (with fallback)
├── ai/pipeline.py           # Batch AI analysis
├── ai/memory.py             # Learn from feedback
├── storage/notion_sync.py   # Or sheets_sync / supabase_sync
├── data/feedback.json       # Decision history
└── .github/workflows/scraper.yml
```

## Key Patterns
- **Batch AI calls**: Never one LLM call per item — batch 5+ items per call
- **Deduplication**: Check URL before every push
- **Config-driven**: All settings in config.yaml, not code
- **Feedback learning**: Store user decisions, bias future scoring

## Scraping Patterns
- REST API: `requests.get(url, params={"q": query})`
- HTML: `BeautifulSoup(resp.text, "lxml")` + CSS selectors
- RSS: `xml.etree.ElementTree` parsing
- Paginated: loop with `has_more` flag
- JS-rendered: Playwright → BeautifulSoup

## Anti-Patterns
- One LLM call per item → batch 5+
- Hardcoded keywords → config.yaml
- No rate limiting → IP ban
- Storing secrets in code → .env + GitHub Secrets
- No deduplication → duplicate rows
- Ignoring robots.txt → legal risk

## Quality Checklist
- [ ] config.yaml controls all user-facing settings
- [ ] Deduplication by URL before every push
- [ ] Gemini client has model fallback chain (4 models)
- [ ] Batch size ≤ 5 items per API call
- [ ] `.env` in `.gitignore`, `.env.example` provided
- [ ] GitHub Actions workflow commits feedback.json
