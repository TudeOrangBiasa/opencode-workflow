# DBL Data Management — Writing Quality Analysis

**Analyzed:** 2026-06-23
**Sources:** `Laporan-UAS-Bahan.docx` (BAB V-VII prose), `KONTEN_BAB_V_VI_VII.md`, 10 session prompts from OpenCode SQLite DB
**Method:** officecli extraction + Python NLP + session prompt review

---

## 1. Per-File Quality Score Table

| Metric | UAS docx (BAB V-VII) | KONTEN_BAB.md (source) | Notes |
|---|---|---|---|
| **Total prose words** | 2,928 | 4,015 | KONTEN includes SQL code, markdown formatting |
| **AI slop count** | 4 | 1 | Very low — user corrections worked |
| **Duplicate sentences** | 6 (3 unique × 2 each) | 5 (5 unique × 2 each) | Same sentences repeated verbatim |
| **Mean sentence length** | 11.5 words | 14.2 words | Target: 15-25 (Indonesian academic) |
| **Very short sents (<=8w)** | 55 (30%) | 41 (21%) | Too many sentence fragments |
| **Em dashes (—)** | 0 | 0 | Per user instruction — clean |
| **Curly quotes** | 0 | 0 | Clean |
| **Format compliance** | ~85% | N/A (source file) | See §5 |

### BAB-level sentence stats

| BAB | Sentences | Mean | Median | Range | % Very short |
|-----|-----------|------|--------|-------|-------------|
| BAB V (Index) | 82 | 14.0 | 13 | 3-44 | 23% |
| BAB VI (JSON) | 56 | 10.1 | 10 | 3-32 | 38% |
| BAB VII (Replication) | 47 | 10.4 | 10 | 3-22 | 32% |

**BAB VI and VII are notably choppier** than BAB V. The mean sentence length drops below 11 words, with 1 in 3 sentences being 8 words or fewer. This is below the 15-25 word range for formal Indonesian academic prose.

---

## 2. Top 20 Slop Instances

Low absolute count thanks to explicit user instructions. All 4 found in UAS docx:

| # | Phrase | File | Context |
|---|--------|------|---------|
| 1 | `berfungsi sebagai` | UAS docx (BAB I, para 1.1) | "...basis data **berfungsi sebagai** pusat penyimpanan informasi..." |
| 2 | `berfungsi sebagai` | UAS docx (BAB III, para 3.1) | "...safety net. Trigger ini **berfungsi sebagai**..." |
| 3 | `Berikut adalah` | UAS docx (BAB V §5.4 intro) | "**Berikut adalah** implementasi lima index pada db_stok_umkm..." |
| 4 | `dalam konteks` | UAS docx (BAB I, para 1.1) | "**Dalam konteks** sistem manajemen stok UMKM..." |

### In KONTEN_BAB.md source

| # | Phrase | Context |
|---|--------|---------|
| 1 | `robust` | "sistem ini dirancang sederhana namun **robust**..." |

**Verdict:** The user's explicit "no AI patterns" instructions in sessions `ses_1170760e1ffe7xIttcIl6prDHu` and `ses_116fa5aa1ffeZnpjXAzF1wF4BX` were effective. Almost no slop made it through. The 4 instances are all in BAB I (pre-existing UTS content, not AI-generated) or the user explicitly caught the "Berikut adalah" and it persisted anyway.

---

## 3. Top 10 Duplicate Sentences

### In UAS docx (BAB V-VII prose)

| # | Count | Sentence | Section |
|---|-------|----------|---------|
| 1 | 2x | "Syntax: JSON_EXTRACT(kolom, '$.path') atau shorthand kolom->'$.path'." | BAB VI §6.3.1 + §6.3.2 |
| 2 | 2x | "Berguna saat data JSON perlu digabung dengan tabel lain menggunakan JOIN." | BAB VI §6.3.3 intro + body |
| 3 | 2x | "Fungsi ini membuat data JSON bisa diquery seperti tabel biasa." | BAB VI §6.3.3 (same pair as above) |
| 4 | 2x | "Write ke primary otomatis tereplikasi ke replica." | BAB VII §7.5 + §7.6 |
| 5 | 2x | "Read scaling mengurangi beban primary dengan mengarahkan query laporan ke replica." | BAB VII §7.5 + §7.6 |
| 6 | 2x | "Backup tanpa lock menjaga ketersediaan primary." | BAB VII §7.5 + §7.6 |

### In KONTEN_BAB.md source

| # | Count | Sentence |
|---|-------|----------|
| 1-5 | 2x each | Same 5 duplicates as above (syntax, JSON_TABLE × 2, replication triplet) |

**Pattern:** The replication triplet ("Write ke primary...", "Read scaling...", "Backup tanpa lock...") appears identically in §7.5 and §7.6. This is the most visible repetition — the conclusion literally echoes the previous section verbatim.

The JSON_TABLE description repeats the same 2 sentences in immediate succession (heading description + body).

---

## 4. Style Register Analysis

### 4.1 Formal vs Informal

The prose is **consistently formal Indonesian academic** — no slang, no first-person pronouns, no contractions. Good.

**Formal markers found:**
- "sehingga" — 8 occurrences
- "adalah" — 12 occurrences  
- "yaitu" — 2 occurrences
- "yakni" — 1 occurrence
- "merupakan" — 1 occurrence

**Informal markers:** None detected.

### 4.2 English Code-Switching

**215 English technical terms** used across BAB V-VII. This is appropriate for a database report — terms like "query", "index", "SELECT", "JOIN", "failover", "replica" are domain-standard.

However, some code-switching is unnecessary:
- "Use case: backup tanpa membebani primary" — could be "Kegunaan: backup..."
- "best practice" — could be "praktik terbaik" (used inconsistently)
- "bitmap-like behavior" — mixed English-Indonesian suffix

### 4.3 Passive Voice

32 passive markers found ("dapat", "dilakukan", "digunakan", "dibuat", etc.). This is normal for academic Indonesian but slightly high. The agent was told to write in "caveman mode" (active, terse) but the original academic register defaults to passive.

### 4.4 "berfungsi sebagai" (AI filler)

2 occurrences. This phrase is a common Indonesian AI crutch — the model uses it to smuggle purpose statements. Both are in BAB I (pre-existing UTS content, not agent-generated).

### 4.5 Caveman Mode Compliance

The agent was instructed **three separate times** (BAB V revision, BAB VI build, BAB VII build) to write in caveman mode: "terse, direct, no fluff". Outcome:

- **BAB V** (after revision): Mostly compliant. Short declarative sentences. Examples of good caveman: "Bitmap index menyimpan satu bit per baris untuk setiap nilai unik." "Oracle mendukung bitmap index secara native sejak versi 7."
- **BAB VI**: Less compliant. Weaker sentence variety, more "yang" clauses, more passive constructions.
- **BAB VII**: Mixed. Opening sections (7.1-7.3) are tight. Implementation sections (7.4-7.6) get verbose with run-on replication descriptions.

The caveman instruction degraded over time — each new BAB was built with a fresh agent that had less context pressure.

---

## 5. Format Compliance vs design.md

### 5.1 Heading Structure

| Rule (design.md) | Actual | Status |
|---|---|---|
| BAB: 16pt bold center | 16pt bold center | COMPLIANT |
| Sub-bab: 13pt bold left, prefix `  1.1. ` | 13pt bold left, prefix `  1.1. ` | COMPLIANT |
| Sub-sub-bab: 12pt bold left, prefix `  1.1.1. ` | `11pt italic` with indent (per user override in session) | **MODIFIED** |
| Body: 12pt regular justify | 12pt XDPrime regular | COMPLIANT |
| Footer: [PAGE] field | [PAGE] field present | COMPLIANT |

### 5.2 Anti-Pattern Compliance (from design.md)

| Anti-Pattern | Status | Detail |
|---|---|---|
| No trailing spaces in headings | **VIOLATED** | `evt_cek_stok_harian ` and `evt_bersihkan_log_lama ` have trailing spaces (BAB IV, pre-existing) |
| No BAB heading split into 2 paragraphs | COMPLIANT | All BAB headings use single paragraph with `<w:br/>` |
| No sub-bab numbering `1.x` when not BAB I | COMPLIANT | 5.1, 6.1, 7.1 all correct |
| No color in body text | COMPLIANT | Black only |
| No manual page numbers | COMPLIANT | [PAGE] field used |

### 5.3 SQL Code Block Format

| Rule (design.md) | Actual | Status |
|---|---|---|
| 1×1 table with border | Border removed per user instruction | MODIFIED |
| Shading `#F0F4F4` | Present | COMPLIANT |
| XDPrime 9pt on ALL paragraphs | **PARTIAL** | Early versions had font cascade bug (9pt on first para only, rest inherited 11pt). Fixed by session `ses_1172d4791ffemrzmY6JoEOu2ZW` |
| No SQL comments in docx | COMPLIANT | All `--` comment lines removed by strip sessions `ses_10fd4ad1bffeRHsY31HCCopt1x` and `ses_10fc58057ffeeTVp5d4R7zUMtP` |

### 5.4 Design.doc vs design.md Mismatch

The `design.md` specifies:
- **Sub-sub-bab (Heading 3):** 12pt bold, prefix `  1.1.1. `

But the user explicitly overrode this in session `ses_1170760e1ffe7xIttcIl6prDHu`:
> "H3 (5.3.1, 5.3.2, 5.3.3): change to **11pt italic, with 0.5cm left indent**"

This was then propagated to all subsequent BABs. The design.md is **out of date** — it still says 12pt bold. The actual reference docx uses 11pt italic.

---

## 6. SQL Code Style Issues

### 6.1 In Docx (After Strip Sessions)
- Clean: no remaining `--` comment lines
- Simulated EXPLAIN output (`-- +----+...`) removed per second strip session
- Format: all SQL in 1×1 tables with F0F4F4 shading

### 6.2 In KONTEN_BAB.md (Source File)
- **24 SQL code blocks** total
- **Heavy comment usage:** Blocks 10 (EXPLAIN output), 20 (Master-Slave), 21 (Master-Master), 22 (Semi-Sync) are **entirely comments** with no executable SQL
- **Nested comments:** Block 1 has `-- -- Oracle Database...` (double `--`), suggesting the original generation had comment headers that were then commented out
- **Inconsistent indentation:** Blocks 14 and 17 mix 0-space and 4-space indent
- **70+ SQL comment lines** total across the 24 blocks

The KONTEN_BAB.md uses SQL code blocks as documentation containers, often putting prose explanations inside `--` comments rather than in surrounding markdown. This is a **structural anti-pattern** — code blocks should contain runnable SQL, not embedded prose.

### 6.3 Most Egregious Example

Block 20-22 (BAB VII replication strategies) contain **zero executable SQL** — they are 100% prose wrapped in `--` comments:

```sql
-- Master-Slave replication adalah arsitektur replikasi
-- paling umum. Primary menerima semua operasi tulis.
-- Replica menerima salinan data dari primary dan dapat
-- melayani query baca. Replikasi dilakukan secara
-- asynchronous melalui binary log. Use case: backup
-- tanpa membebani primary, read scaling, dan failover.
```

This text should be markdown prose, not SQL comments. The design.md specifies "SQL code block" for code only, but the KONTEN_BAB source file abuses the pattern.

---

## 7. User's Explicit Style Preferences

### From session `ses_1170760e1ffe7xIttcIl6prDHu` (Comprehensive BAB V revision)

The user provided a **detailed 11-point writing rule set**:

1. **Terse:** "short sentences, direct statements. No 'in order to', 'due to the fact that', 'it is important to note that'."
2. **No fluff words:** Banned list includes "stands as", "serves as", "underscores", "highlights", "pivotal", "vibrant", "intricate", "landscape", "tapestry", "testament", "enduring", "evolving"
3. **No rule of three:** "Don't force 3-item lists. Use 1, 2, 4 — whatever fits."
4. **No negative parallelisms:** "Avoid 'not just X, but Y' / 'it's not about X, it's about Y'."
5. **No em dashes (—).** "Replace with periods, commas, or restructure."
6. **No curly quotes** if possible
7. **No fragmented headers:** "Heading + 1-line restatement of heading is bad. Jump into content."
8. **No signposting:** "Don't say 'Berikut adalah...', 'Let's dive into...', 'Sekarang kita akan...'. Just write."
9. **Vary sentence length:** "Mix short and long."
10. **Specific details over vague:** "'MariaDB 10.6+ uses BTREE' not 'modern databases use indexing'."
11. **Bahasa Indonesia academic:** "Formal tapi ga kaku, ga bloated."

### From session `ses_116fa5aa1ffeZnpjXAzF1wF4BX` (BAB VI build)

Added **10 "Lessons from BAB V"** — essentially the same rules but framed as operational instructions:
- Heading styleId mapping (763/764/779)
- Numbering scheme (numId per BAB)
- Heading run structure with bookmarks
- Spacing (spaceAfter=6pt)
- Code block font rules (9pt XDPrime on ALL paragraphs)
- **No regression on existing content**

### From session `ses_116edbe39ffekCoPsx8EIY3dlZ` (BAB VII build)

Same 10 lessons, with updated numId=22 for BAB VII.

### Key pattern: Repetitive Lesson Transfer

The user had to repeat the same writing rules across **3 separate sessions** because each subagent started fresh. The lessons were not stored in a reusable format (like a project-level AGENTS.md or a style guide).

---

## 8. Pattern Summary: 5 Most Common Writing Failures

### Failure 1: Verbatim Sentence Repetition (Cross-Section)

**What:** The exact same 3 sentences appear in §7.5 and §7.6 (Kesimpulan). Also, 2 JSON_TABLE sentences repeat within §6.3.3.

**Root cause:** Agent generates content section-by-section without cross-referencing earlier output in the same session. The conclusion paragraph simply reuses the summary paragraph's wording.

**Evidence:**
```
§7.5: "Write ke primary otomatis tereplikasi ke replica. Read scaling mengurangi beban primary dengan mengarahkan query laporan ke replica. Backup tanpa lock menjaga ketersediaan primary."
§7.6: "Write ke primary otomatis tereplikasi ke replica. Read scaling mengurangi beban primary dengan mengarahkan query laporan ke replica. Backup tanpa lock menjaga ketersediaan primary."
```

**Suggested fix:** Add a "no verbatim repetition from earlier paragraphs" rule. When generating conclusion text, instruct the agent to rephrase, not reuse.

---

### Failure 2: Choppy Sentence Length (BAB VI, VII)

**What:** Mean sentence length drops to 10 words (BAB VI) and 10.4 words (BAB VII), with 1 in 3 sentences being 8+ words. Well below the 15-25 word academic target.

**Root cause:** Caveman mode "short sentences" instruction over-applied. The user said "terse, short sentences" and the agent interpreted this as "every sentence must be short" — losing the natural variety of academic prose.

**Evidence:**
- BAB VI: "JSON_OBJECT membuat objek JSON dari pasangan key-value." (7 words)
- BAB VII: "Replikasi dilakukan secara asynchronous melalui binary log." (6 words)
- Versus BAB V (after revision): "Index adalah struktur tambahan yang menyimpan salinan nilai kolom tertentu dalam format terurut (B-Tree)." (16 words — better)

**Suggested fix:** Reframe the style instruction: "Vary sentence length between 10-25 words. Some 5-word sentences are fine for emphasis, but sustained passages of 8-word sentences read like notes, not prose."

---

### Failure 3: Signposting Survivor ("Berikut adalah")

**What:** Despite explicit "no Berikut adalah" rule, the phrase appears in §5.4 intro.

**Root cause:** The agent-generated KONTEN_BAB.md source file (which was written before the user issued the "no signposting" rule for the docx revision). The docx revision session (`ses_1170760e1ffe7xIttcIl6prDHu`) was supposed to rewrite all body text, but the "Berikut adalah" sentence was not flagged.

**Evidence:**
```
"Berikut adalah implementasi lima index pada db_stok_umkm yang mencakup berbagai pola indexing: composite B-tree, covering index, dan index merge."
```

**Suggested fix:** Add "Berikut adalah" and "Berikut ini" to the automated slop scanner. The humanizer skill already flags it but the agent did not run the scan on this specific paragraph.

---

### Failure 4: Code Block as Documentation Container

**What:** 3 of 7 BAB VII code blocks (42%) contain no executable SQL — only prose wrapped in `--` SQL comments. The KONTEN_BAB.md file uses code blocks as a documentation vehicle rather than reserving them for runnable code.

**Root cause:** The design.md says "Code Block (SQL)" as a pattern, and the KONTEN_BAB.md was generated by an agent that treated `--` comment blocks inside SQL fences as a valid way to embed explanatory text. The design.md does not explicitly prohibit this.

**Evidence:**
```sql
-- Master-Slave replication adalah arsitektur replikasi
-- paling umum. Primary menerima semua operasi tulis.
```

This is a 6-line code block that is 100% prose comments. The surrounding markdown already has the same content as body text.

**Suggested fix:** Add to design.md: "SQL code blocks must contain valid, runnable MariaDB SQL. Do not use `--` comments to embed prose that belongs in body paragraphs."

---

### Failure 5: Inconsistent Heading 3 Style (design.md vs actual)

**What:** design.md specifies Heading 3 as `12pt bold left`, but the actual docx uses `11pt italic left` (per user override). The design.md was never updated after the user's styling decision.

**Root cause:** No process for updating design.md after deviations. The user made a real-time styling decision ("make H3 11pt italic to visually distinguish from H2") but did not retroactively update design.md. The design.md was supposed to be the "source of truth" per AGENTS.md.

**Evidence:**
- design.md line 30: "Sub-sub-bab (Heading 3) | 12pt | bold | left"
- Actual docx: 11pt italic with 360 twips left indent

**Suggested fix:** Add a process rule: "When `officecli set` changes a style, update design.md tokens in the same session."

---

## Summary Verdict

**Writing quality is good-to-very-good** — significantly better than typical AI-generated academic content. The user's detailed style rules and multiple revision cycles eliminated most AI slop. Remaining issues are structural (repetition across sections, choppy sentence length in later BABs) rather than vocabulary-based.

The agent's compliance with the "no em dash" rule is **perfect** (0 instances across 2,928 words). The "no AI vocabulary" rule is **nearly perfect** (4 instances, all in pre-existing UTS content or survivors from before the rule was applied).

**Priority fixes for future work:**
1. Add "no verbatim repetition" to writing rules
2. Set minimum sentence length floor (8 words) alongside the existing ceiling guidance
3. Ban prose-in-comment-blocks in SQL code blocks
4. Keep design.md in sync with actual styling decisions
