---
name: youtube-transcript
description: Extract clean transcript text from a YouTube URL. Use when the user shares a YouTube link and wants to teach from it, build a skill from it, summarize it, extract a tutorial, or use the content as context for an improvement. Wraps yt-dlp.
---

# YouTube Transcript

Pull plain-text transcript from a YouTube URL using the local `yt-transcript` wrapper. No API key, no MCP, no paid service. Pure stdlib + `yt-dlp`.

## Install

The script is at `scripts/yt-transcript` in this skill folder. Two install options:

**Option A — install to PATH** (matches local install):
```bash
cp scripts/yt-transcript ~/.local/bin/
chmod +x ~/.local/bin/yt-transcript
```

**Option B — call directly** (no install):
```bash
./scripts/yt-transcript <url>
```

Requires: Python 3.10+ (uses `from __future__ import annotations` and match-statement-compatible argparse) and `yt-dlp` on PATH.

## When to use

- User pastes a YouTube link with intent to **teach, summarize, extract, or build** something from it
- User says "watch this", "summarize this video", "extract the steps from this tutorial"
- User asks to "make a skill from this video" or "what does this video teach"
- Working on a research task and YouTube is the source

## When NOT to use

- The video is a **code demo or live screen recording** — transcript is partial; ask user for clip + manual notes instead, or note the limitation
- The user just wants a **link or title** — `webfetch` on the YouTube page is enough, no transcript needed
- The video is **age-restricted, private, or region-locked** — `yt-transcript` will fail; tell user immediately and ask for an alternative

## Tool

```
yt-transcript <url> [lang-priority] [-o outfile]
```

- `lang-priority` default: `id,en` (Indonesian first, English fallback)
- Add more langs: `yt-transcript <url> "id,en,jp,ko"`
- Save to file for long videos: `yt-transcript <url> id,en -o /tmp/transcript.txt`

The wrapper dedupes consecutive caption lines, strips VTT timestamps and tags, and outputs clean text. Exit codes: 0 ok, 2 yt-dlp error, 3 no subs found.

Script location: `scripts/yt-transcript` (relative to this skill folder).

## Workflow

1. **Detect intent**: User pastes a YouTube URL OR says words like "watch", "summarize", "teach me from", "extract", "what does this video…"
2. **Call the tool**: `yt-transcript <url>` — capture stdout to a file if the video is long (>15 min, transcript > 50 KB).
3. **Acknowledge source**: Note the detected language (printed to stderr) so user knows what they got.
4. **Process the content** based on intent:
   - **Teach**: walk through the video section by section, surface the key claims and steps
   - **Skill extraction**: identify the reusable pattern, propose a draft skill
   - **Improvement context**: extract concrete pain points, metrics, or quotes
   - **Summary**: structure by chapter/topic, not chronologically
5. **Cite the source**: include video title + URL + timestamp of the section you used

## Long-video handling

For videos >30 min:

```bash
yt-transcript <url> id,en -o /tmp/transcript.txt
wc -l /tmp/transcript.txt   # quick size check
```

Then `read` the file in chunks. Do NOT paste the whole transcript into your reply — summarize, then quote specific sections when needed.

## Failure modes

| Symptom | Cause | Action |
|---|---|---|
| exit 2, "Sign in to confirm you're not a bot" | YouTube anti-bot | Tell user the video is gated; suggest manual paste of transcript from YouTube's "Show transcript" button |
| exit 3, "No subtitles found" | Video has no captions at all | Tell user; offer to use `yt-dlp --dump-json` to extract title/description/chapters instead |
| empty / very short output | Auto-captions incomplete (common for music, code demos) | Note the limitation; ask user what they actually wanted from the video |
| exit 2, HTTP 429 | Rate limited | Wait 30s, retry once. If still fails, surface to user |
| Wrong language in output | yt-dlp picked fallback | Re-run with explicit lang: `yt-transcript <url> en` |

## Patterns that emerge

- **Teachable moment**: user pastes a YouTube link with no other words → assume "teach me". Confirm after the summary what angle they want.
- **Skill source**: user pastes a YouTube link and the video is a tutorial → propose extracting the pattern as a skill at the end.
- **Quote with timestamp**: when citing a specific moment, format as `[mm:ss]` so user can jump to it.

## Reference

- Script location: `scripts/yt-transcript` (in this skill folder)
- Underlying: `yt-dlp --write-auto-sub --write-sub --sub-langs <langs> --sub-format vtt --skip-download`
- Language codes: ISO 639-1 (`id`, `en`, `ja`, `ko`, `zh`, `es`, `pt`, etc.)
