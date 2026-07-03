---
name: data-scraper-agent
description: Use when build AI-powered data collection agents for public sources — scrapes on schedule, enriches with free-tier LLM (e.g. Gemini Flash), stores to Notion/Sheets/Supabase or equivalent, learns from feedback. Runs free on GitHub Actions/cron/queue scheduler. Use only when the user wants to monitor, collect, or track public data automatically.
---

# Data Scraper Agent

Adapted from ECC's `data-scraper-agent` skill (MIT).

Build a production-ready, AI-powered data collection agent for any public data source.
Runs on a schedule, enriches results with a free LLM, stores to a database, and improves over time.

**Stack: Python · Gemini Flash (free) · GitHub Actions (free) · Notion / Sheets / Supabase**

## When to Activate

- User wants to scrape or monitor any public website or API
- User says "build a bot that checks...", "monitor X for me", "collect data from..."
- User wants to track jobs, prices, news, repos, sports scores, events, listings

See [REFERENCE.md](REFERENCE.md) for architecture, code examples, workflow steps, feedback learning, storage patterns, GitHub Actions, and quality checklist.
