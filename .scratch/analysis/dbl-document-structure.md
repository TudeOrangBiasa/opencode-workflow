# DBL Document Structure Analysis

**Project:** dbl-data-management
**Date:** 2026-06-23
**Source Files:**
- `Laporan-UAS-Bahan.docx` — final working file (682KB, 360 paragraphs, 57 tables)
- `Laporan-UAS-Bahan copy.docx` — copy variant (682KB, 364 paragraphs, 57 tables)
- `LaporanUTSManajemenUMKM.docx` — UTS source (148 paragraphs, 28 tables)
- `Template Laporan BDL Krisna Ariwidnyana.docx` — reference template (85 paragraphs, 0 tables)
- `KONTEN_BAB_V_VI_VII.md` — content source (522 lines)
- `docs/agents/design.md` — format specification (187 lines)

---

## 1. Document Anatomy

### 1.1 Laporan-UAS-Bahan.docx (final working file)

| Metric | Count |
|---|---|
| Total paragraphs | 360 |
| Tables | 57 |
| Images | 4 (1 logo + 3 drawio diagrams) |
| Content controls (SDT) | 1 (Daftar Isi) |
| Footer | `[PAGE]` field (auto page number, center) |

**Heading distribution:**

| Heading Level | Style | Count |
|---|---|---|
| H1 (BAB) | Heading 1 | 9 |
| H2 (Sub-bab) | Heading 2 | 35 |
| H3 (Sub-sub-bab) | Heading 3 | 23 |
| TOC heading | TOC Heading | 1 |
| TOC H1 entries | toc 1 | 9 |
| TOC H2 entries | toc 2 | 35 |
| Body | Normal | 248 |

**StyleId mapping (discovered during fix sessions):**
- `Heading 1` -> styleId `779` (BAB titles)
- `Heading 2` -> styleId `778` (sub-bab)
- `Heading 3` -> styleId `889` (sub-sub-bab)
- `toc 1` -> styleId `945` (BAB entries in TOC)
- `toc 2` -> styleId `952` (sub-bab entries in TOC)
- `Hyperlink` -> styleId `946` (TOC hyperlink character style)
- `Normal` -> styleId `937`

**Font usage:** XDPrime (primary, embedded), 1473 runs total in copy variant
**Size distribution:** 11pt (761 runs), 12pt (429), 13pt (170), 16pt (61), 14pt (35), 18pt (17)
**Estimated pages:** ~27-30 (based on paragraph count, footer page numbers up to "14" in BAB IV)

### 1.2 UTS vs UAS comparison

| Feature | UTS (`LaporanUTSManajemenUMKM.docx`) | UAS (`Laporan-UAS-Bahan.docx`) |
|---|---|---|
| Paragraphs | 148 | 360 |
| Tables | 28 | 57 |
| H1 (BAB) | 6 | 9 |
| H2 (Sub-bab) | 17 | 35 |
| H3 (Sub-sub-bab) | 0 | 23 |
| TOC entries | 22 | 44 |
| Images | 1 (logo) | 4 (+3 diagrams) |

**Key difference:** UTS had no H3 at all. UAS added 23 H3 entries for sub-sub-bab in BAB V/VI/VII (5.3.1-5.3.3, 5.4.1-5.4.5, 6.3.1-6.3.3, 6.5.1-6.5.4, 7.2.1-7.2.3, 7.4.1-7.4.5).

### 1.3 Krisna Template

| Metric | Count |
|---|---|
| Paragraphs | 85 |
| Tables | 0 (template, no content) |
| Images | 7 (Primakara logo variants) |
| H1 | 8 (Daftar Isi + BAB I-VII) |
| Font | XDPrime + fallback |

**Note:** Krisna template uses `heading 1` (lowercase) styleId, not `Heading 1` (capitalized). The template has 39 empty paragraphs (vertical spacing placeholders). Used only as format reference for header shading color (`#1A7A7A` teal) and Properti/Nilai table styling.

---

## 2. TOC Issues (Chronological)

### 2.1 Session Timeline

| # | Session | Time | Cost | Issue Addressed |
|---|---|---|---|---|
| 1 | `ses_116fa5aa1ffeZnpjXAzF1wF4BX` | 15:12-15:24 | $0 | Build BAB VI JSON section (initial content) |
| 2 | `ses_116edbe39ffekCoPsx8EIY3dlZ` | 15:25-15:43 | $0 | Build BAB VII Replication section |
| 3 | `ses_1105b959bffeBEy7MtswSm1Ahr` | 22:03-02:29 | $1.33 | Design analysis ($1.33 cost, 1.9M input tokens) |
| 4 | `ses_11044ab7bffezCCiZXjlq2aSXN` | 22:28-22:44 | $0 | Add BAB V/VI/VII to docx (initial insert) |
| 5 | `ses_110278bbdffeiW1uIICdClxiqE` | 23:00-23:07 | $0 | **Add TOC entries** (first attempt) |
| 6 | `ses_11009ca57ffeMuuwKz6wOhT8EQ` | 23:32-23:46 | $0 | **Fix H1/H2/H3 styles + TOC + bookmarks** |
| 7 | `ses_10ff79a2affeqEbGhkuML5hucv` | 23:52-00:02 | $0 | Fix numId and table styling |
| 8 | `ses_10fec986affeJz7T59gCzGaXTu` | 00:04-00:05 | $0 | Apply full header shading to 5 tables |
| 9 | `ses_10fe2612cffeDzrjlcsGXc2HqG` | 00:15-00:18 | $0 | Match reference Properti table styling |
| 10 | `ses_10fd4ad1bffeRHsY31HCCopt1x` | 00:30-00:41 | $0 | Strip SQL comments (first pass) |
| 11 | `ses_10fc58057ffeeTVp5d4R7zUMtP` | 00:47-00:49 | $0 | Strip all SQL comments (second pass) |
| 12 | `ses_10f9b8233ffe3tkJm8VD06I1Kz` | 01:32-01:37 | $0 | **Rebuild 21 TOC entries with PAGEREF + tabs** |
| 13 | `ses_10f9669e8ffedsphf2iWzBrceZ` | 01:38-01:44 | $0 | **Fix TOC title truncation** |
| 14 | `ses_10f86116bffep7pH6qrvwnGfS0` | 01:56-02:00 | $0 | Fix BAB I-IV sub-bab auto-numbering bug |

### 2.2 TOC Issue #1: Missing entries (session 5 to 6)

**Scenario:** Agent added BAB V/VI/VII content paragraphs with `style=Normal` (run-level override for font/size) instead of `style=Heading 1/2/3`.

**What happened:**
1. Session `ses_11044ab7bffezCCiZXjlq2aSXN` added content but set style to Normal + run-level font/size overrides
2. Session `ses_110278bbdffeiW1uIICdClxiqE` added 21 TOC entries inside the SDT with hyperlinks to bookmarks
3. **User opened in OnlyOffice** - OnlyOffice refreshed the TOC field, scanned for `style=Heading 1/2`, found none for BAB V/VI/VII -> TOC reverted to BAB I-IV only
4. All 21 new bookmark entries (`_Toc23`-`_Toc43`) were dropped by OnlyOffice save process

**Root cause:** `style=Normal` instead of `style=Heading 1/2/3`. Heading styles are required for:
- Outline view recognition
- TOC field auto-scan
- Bookmark preservation across Office saves

**Fix (session 6):** Reset style to `Heading 1/2/3` (styleId 779/778/889) for all 44 headings. Re-added 21 bookmarks + 21 TOC entries.

**Officecli evidence:**
```
H1 (Heading 1) | 6 (Daftar Isi + BAB I-IV) -> 9 (Daftar Isi + 7 BAB)
H2 (Heading 2) | 17 -> 35
H3 (Heading 3) | 0 -> 23
Bookmark _Toc1-22 | 22 -> 22 (preserved)
Bookmark _Toc23-43 | 0 -> 21 (added)
TOC entries | 21 (BAB I-IV only) -> 42 (BAB I-VII)
```

### 2.3 TOC Issue #2: Missing PAGEREF + tab stops (session 6 to 12)

**What happened:** Session 6 added TOC entries as simple text hyperlinks without:
- PAGEREF field (no `PAGEREF _TocN \h` field code)
- Tab stops (no `right` tab at `9026` twips)
- Dot leader (no `leader=dot`)
- Hyperlink character style (`rStyle 946`)

**Result:** TOC showed "BAB V Index" without page number, without dot leader, without right-alignment.

**Fixed in session 12:** Rebuilt all 21 entries with proper XML structure:
```xml
<w:pPr>
  <w:pStyle w:val="952" />  <!-- toc 2 style -->
  <w:tabs>
    <w:tab w:val="left" w:leader="none" w:pos="850" />
    <w:tab w:val="right" w:leader="dot" w:pos="9026" />
  </w:tabs>
</w:pPr>
<w:r/>
<w:hyperlink w:anchor="_Toc24">
  <w:r><w:t>5.1.</w:t></w:r>                    <!-- NUMBER -->
  <w:r><w:tab/></w:r>                            <!-- TAB AFTER NUMBER -->
  <w:r><w:rPr><w:rStyle w:val="946"/></w:rPr></w:r>
  <w:r><w:rPr><w:rStyle w:val="946"/></w:rPr><w:t>Title</w:t></w:r>  <!-- TITLE -->
  <w:r><w:rPr><w:rStyle w:val="946"/></w:rPr></w:r>
  <w:r><w:tab/></w:r>                            <!-- TAB BEFORE PAGEREF -->
  <w:r>
    <w:fldChar w:fldCharType="begin"/>
    <w:instrText> PAGEREF _Toc24 \h </w:instrText>
    <w:fldChar w:fldCharType="separate"/>
    <w:t>14</w:t>                                 <!-- CACHED PAGE NUMBER -->
    <w:fldChar w:fldCharType="end"/>
  </w:r>
</w:hyperlink>
```

**Officecli evidence (before fix):**
```
PAGEREF count: 22 (BAB I-IV only)
Tab count in new entries: 0
```

**Officecli evidence (after fix):**
```
PAGEREF count: 43 (BAB I-VII) - all 43 PAGEREFs unique
```

### 2.4 TOC Issue #3: Title truncation (session 12 to 13)

**What happened:** After session 12 rebuilt the entries, the rendered TOC showed truncated titles:
```
5.1. Pe14    (expected: "5.1. Pengertian Index    14")
5.2. Bit14   (expected: "5.2. Bitmap Index...    14")
7.1. Pe22    (expected: "7.1. Pengertian Data Terdistribusi    22")
```

**Root cause:** The title text and number were in a single run inside the hyperlink (`<w:t>5.1. Pengertian Index</w:t>`). Office rendering clipped the title because the hyperlink field structure was incorrect.

Specifically, the XML structure had:
```xml
<w:hyperlink ...>
  <w:r><w:rPr><w:rStyle w:val="946"/></w:rPr><w:t>5.1. Pengertian Index</w:t></w:r>
  <w:r><w:tab/></w:r>
  <w:r>... PAGEREF ...</w:r>
</w:hyperlink>
```

**Fix (session 13):** Split into separate runs:
1. Number run (`5.1.`) outside hyperlink style, plain XDPrime
2. Tab run
3. Empty run with `rStyle=946`
4. Title run with `rStyle=946` + `rFonts=XDPrime`
5. Empty run with `rStyle=946`
6. Tab run
7. PAGEREF field

**Officecli evidence (after fix):**
```
[/body/sdt[1]/p[@paraId=7FEA11B4]] [sdt] 5.1. Pengertian Index     14
[/body/sdt[1]/p[@paraId=7FEA11B7]] [sdt] 5.2. Bitmap Index (Konsep dan Referensi Native)   14
```
Full titles rendered. No truncation.

### 2.5 TOC Pattern Assessment

| Issue | Occurrences | Recurring? |
|---|---|---|
| Wrong style (Normal vs Heading) | 2 distinct sessions | **Yes** - fundamental misunderstanding of Heading style requirement |
| Missing PAGEREF field | 1 (first TOC attempt) | No, fixed permanently after session 12 |
| Missing tab stops / dot leader | 1 | No |
| Title truncation | 1 (after PAGEREF fix) | No, fixed in session 13 |
| Bookmark dropped by Office | 1 (OnlyOffice save) | Environmental, not agent error |

**Overall:** TOC issues required 4 dedicated sessions (5, 6, 12, 13) to resolve. The core failure was treating TOC entries as simple text hyperlinks instead of structured fields with PAGEREF, tab stops, and proper run-level XML.

---

## 3. Heading Issues

### 3.1 StyleId Mapping Discovery

The agent discovered styleId values by inspecting raw XML:

| Style Name | StyleId | Used For |
|---|---|---|
| Heading 1 | 779 | BAB titles (center, 16pt bold XDPrime) |
| Heading 2 | 778 | Sub-bab (left, 13pt bold XDPrime) |
| Heading 3 | 889 | Sub-sub-bab (left, 12pt bold XDPrime) |
| Normal | 937 | Body text |
| toc 1 | 945 | BAB entries in TOC |
| toc 2 | 952 | Sub-bab entries in TOC |
| Hyperlink | 946 | Character style for TOC hyperlink |

**Session evidence:** `ses_11009ca57ffeMuuwKz6wOhT8EQ` reasoning:
> "44 style fix semua H1/H2/H3 baru di-set style=Heading 1/2/3 (styleId 779/778/889). Sebelumnya style=Normal + run-level override."

### 3.2 BAB Numbering Structure

**Correct pattern (applied in final version):**
```
BAB V
Index                       <- H1, center, 16pt bold, line break inside paragraph
  5.1. Pengertian Index     <- H2, left, 13pt bold, literal prefix "  5.1. "
  5.2. Bitmap Index         <- H2
  5.3. Best Practice...     <- H2
    5.3.1. Composite B-tree <- H3, left, 12pt bold, literal prefix "  5.3.1. "
    5.3.2. Covering index   <- H3
```

**Prefix format:** `  N.N. ` (2 spaces + number + dot + space) for H2, `  N.N.N. ` (2 spaces + 3-level number + dot + space) for H3.

**H1 line break format:** Single paragraph with `<w:br/>` between "BAB V" and "Index", NOT two separate paragraphs.

### 3.3 Auto-Numbering Conflict (numId=11)

**The Bug:** When H2/H3 paragraphs had `style=Heading 2/3`, they inherited `numId=11` from the style definition. This auto-numbering prefixed each paragraph with an automatic counter like "1.11." on top of the literal text "5.3.3.".

**Rendered output (broken):**
```
1.11.   5.3.3. Index merge (MySQL runtime bitmap AND/OR)
```

**Root cause:** The `Heading 2` and `Heading 3` styles baked in `numId=11` with automatic decimal numbering. Existing BAB I-IV H2 used the same style but relied on this auto-numbering (their literal text omitted the number prefix). BAB V/VI/VII had both auto-numbering AND literal prefix.

**Fix (session 7):** Set `numId=0 numLevel=0` on all 41 H2/H3 paragraphs in BAB V/VI/VII to disable auto-numbering. 17 additional paragraphs in BAB I-IV were also fixed later (session 14).

**Session evidence (ses_10ff79a2affeqEbGhkuML5hucv reasoning):**
> "H3 5.4.1: now numId=0 numLevel=0 (was numId=11 numInherited=true)"

### 3.4 BAB I-IV Numbering Bug

**The Bug:** BAB II/III/IV sub-babs showed as `1.1.`, `1.2.` instead of `2.1.`, `3.1.`, `4.1.` because the auto-numbering (`numId=11`) reset to `1.x` for every BAB.

**Root cause:** The numbering definition in `numbering.xml` had `lvl=1 format=decimal` but no "BAB-level" counter above it. Each BAB's first H2 paragraph restarted the counter.

**Fix (session 14):** Replaced auto-numbering with literal text prefix + `numId=0` for all 17 H2 paragraphs in BAB I-IV, matching the BAB V/VI/VII pattern. This made all 7 BABs consistent.

**Before/after comparison:**
```
BAB II (before): 1.1. sp_transaksi_masuk, 1.2. sp_transaksi_keluar
BAB II (after):   2.1. sp_transaksi_masuk, 2.2. sp_transaksi_keluar

BAB III (before): 1.1. Pengertian Trigger, 1.2. trg_log_stok_masuk
BAB III (after):   3.1. Pengertian Trigger, 3.2. trg_log_stok_masuk
```

### 3.5 Heading Issues Summary

| Issue | Session | Root Cause | Recurring? |
|---|---|---|---|
| Wrong style (Normal vs Heading) | `ses_11044ab7bffezCCiZXjlq2aSXN` -> `ses_11009ca57ffeMuuwKz6wOhT8EQ` | Style confusion - run-level override vs style-level | Pre-existing in template extension pattern |
| Double numbering (numId conflict) | `ses_10ff79a2affeqEbGhkuML5hucv` | Inherited numId from Heading style + literal text prefix | Easy one-off fix |
| BAB I-IV wrong sub-bab numbers | `ses_10f86116bffep7pH6qrvwnGfS0` | Auto-numbering reset at each BAB | Pre-existing in UTS template, known anti-pattern |
| Empty H1 paragraph (BAB III) | UTS source | Source document had empty H1 between BAB II/III | UTS defect, not agent error |

---

## 4. Table Issues

### 4.1 Table Categories

The document has 57 tables in 3 categories:

| Category | Count | Style | Location |
|---|---|---|---|
| Parameter tables (4-column) | 5 | `#1A7A7A` header, `#CCCCCC` border | BAB V 5.4.1-5.4.5 |
| Properti/Nilai tables (2-column) | 7 | `#1A7A7A` header, `#CCCCCC` border | BAB I-IV (pre-existing) |
| SQL code block tables (1x1, shaded) | 45 | `#CCCCCC` border, `#F0F4F4` bg, no padding | All BABs |

### 4.2 Header Shading Evolution

**Initial state (session 4):** All 5 parameter tables in BAB V had plain black borders (`#000000`), no header shading.

**First fix (session 8):** Agent applied `#1F4E5F` (dark navy) to header cells - but only applied to first cell (`tc[1]`) of first table. Other 3 cells and other 4 tables got no shading.

**Officecli evidence (session 8 reasoning):**
> "tbl[34] tc[1] got shading=1F4E5F. tr[1]/tc[2] (Kolom) has bold=true but NO shading. tr[1]/tc[3] (Tipe) has bold=true but NO shading. tr[1]/tc[4] (Fungsi) has bold=true but NO shading."

**Root cause:** Batch command failed due to XPath mismatch each table had unique path, batch was not iterating correctly.

**Final fix (session 9):** Applied reference Properti table styling:
- Header bg: `#1A7A7A` (lighter teal, matching Krisna template)
- Header text: white bold, center-aligned (not left)
- Border: `#CCCCCC` (not `#000000`)
- Cell padding: `top=80 bottom=80 left=120 right=120` (was 0)
- Cell valign: `center`

**Comparison table:**

| Property | Initial (session 4) | After session 8 | Final (session 9) |
|---|---|---|---|
| Header bg | None | `#1F4E5F` (dark navy) | `#1A7A7A` (lighter teal) |
| Header align | left | left | center |
| Border color | `#000000` | `#000000` | `#CCCCCC` |
| Cell padding | 0 | 0 | 80/80/120/120 |
| Valign | default | default | center |
| Body alternating | none | none | none (1 body row only) |

### 4.3 SQL Code Block Tables

45 code block tables follow a consistent pattern:
- 1 column x 1 row
- Border: `#CCCCCC` `single` `sz=4`
- Cell shading: `#F0F4F4`
- Padding: `top=0 bottom=0 left=0 right=0`
- Width: `8340` dxa
- Indent: `686` dxa

**Issue with empty blocks:** 3 SQL code blocks in BAB VII (7.2.1-7.2.3) became empty after SQL comments were stripped (sessions 10-11). These rendered as thin horizontal lines ("text box kosong"). Removed reducing table count from 60 to 57.

### 4.4 Table Issues Summary

| Issue | Session | Root Cause | Recurring? |
|---|---|---|---|
| Wrong header color (`#1F4E5F` vs `#1A7A7A`) | `ses_10fec986affeJz7T59gCzGaXTu` | Agent guessed color instead of reading reference | No, fixed by matching Krisna template |
| Header shading only on first cell | `ses_10fec986affeJz7T59gCzGaXTu` | Batch iteration bug in XPath | No |
| Wrong border color (`#000000` vs `#CCCCCC`) | `ses_10fec986affeJz7T59gCzGaXTu` | Default border assumed | No |
| Cell padding missing | `ses_10fec986affeJz7T59gCzGaXTu` | Not specified in initial design | No |
| Header alignment left vs center | `ses_10fe2612cffeDzrjlcsGXc2HqG` | Default left assumed | No |
| Empty code blocks | `ses_10fd4ad1bffeRHsY31HCCopt1x` + `ses_10fc58057ffeeTVp5d4R7zUMtP` | Content source had only comments in 3 SQL blocks | Edge case |

---

## 5. Templating Issues

### 5.1 UTS-to-UAS Extension

**What was extended:**
- UTS had BAB I-IV (4 BABs, 17 H2 sub-babs, 0 H3)
- UAS extended with BAB V-VII (3 new BABs, 18 new H2, 23 new H3)
- UTS tables (28) preserved exactly

**What was inherited from UTS:**
- Style definitions (Heading 1/2/3 styleIds, numId, font config)
- TOC SDT (structure + first 22 bookmark references)
- Table styling (Properti/Nilai pattern)
- Code block styling (1x1 with `#F0F4F4`)
- Footer (PAGE field)
- Cover page (logo + title block)

**What was NOT inherited:**
- TOC entries for new BABs (had to be added to SDT)
- Bookmarks for new headings (had to be added)
- numId management (UTS used auto-numbering, UAS switched to literal prefix)

### 5.2 Krisna Reference Template Usage

The Krisna template was used as **one-time visual reference** only. It was NOT used as a source template for content generation.

**Usage pattern:**
1. Session `ses_10fe2612cffeDzrjlcsGXc2HqG` compared the parameter table styling with the `Properti/Nilai` table
2. Agent extracted exact styling values from the Properti table (header bg `#1A7A7A`, border `#CCCCCC`, center alignment, padding)
3. Applied those values to the 5 new parameter tables

**Evidence from session reasoning:**
> "Reference table (Properti/Nilai) properties: Header bg: #1A7A7A (lighter teal) - NOT #1F4E5F. Border: single sz=4 color=CCCCCC (light gray, not black). Header align: center."

**Template usage was ad-hoc, not systematic.** No automated template comparison or style inheritance was implemented.

### 5.3 Style Inheritance Issues

| Inherited Property | Source | Target | Status |
|---|---|---|---|
| Font (XDPrime) | UTS design | BAB V/VI/VII content | Correctly inherited |
| Heading style IDs | UTS style definitions | New H1/H2/H3 | Correct after fix |
| numId (auto-numbering) | UTS Heading 2/3 style | New H2/H3 | Caused double numbering (fixed) |
| Table border & shading | UTS Properti table | New parameter tables | Had to re-apply manually (3 attempts) |
| TOC tab stops & PAGEREF structure | UTS TOC entries | New TOC entries | Had to rebuild from scratch (2 attempts) |
| Hyperlink character style (rStyle 946) | UTS TOC entries | New TOC entries | Missing initially (fixed) |

---

## 6. Pattern Summary: Top Structural Failures

### Failure #1: Style vs Run-level Formatting Confusion
**Frequency:** 4 sessions (initial insert, TOC fix, numbering fix, table styling)
**Root cause:** Agent treated heading formatting as run-level font/size overrides on `style=Normal` instead of applying `style=Heading 1/2/3`
**Impact:** TOC field scan failed, outline view blank, bookmarks dropped by Office
**Fix:** Apply `style=Heading 1/2/3` to all heading paragraphs. Never override heading style with run-level formatting.
**Lesson:** In OOXML heading detection (TOC scan, outline view, accessibility) depends on `pStyle`, not run-level font properties.

### Failure #2: TOC Entry Structure Incomplete
**Frequency:** 2 sessions (initial TOC + PAGEREF rebuild)
**Root cause:** Agent assumed TOC entry = text + hyperlink. Missing: PAGEREF field, tab stops, dot leader, hyperlink character style.
**Impact:** Page numbers blank, no dot leader, no right-aligned column. Manual "Update Field" in Word could not populate.
**Fix:** Each TOC entry must have: tab stops in pPr, hyperlink with anchor, separate runs for number/title/tabs, PAGEREF field with `\h` switch, rStyle=946 on title runs.
**Lesson:** TOC in OOXML is a complex field structure, not text. Must clone existing entry XML exactly.

### Failure #3: Auto-numbering (numId) Conflict
**Frequency:** 2 sessions (BAB V/VI/VII + BAB I-IV)
**Root cause:** Heading 2/3 style baked in `numId=11` auto-numbering. New paragraphs inherited it causing double prefix with literal text.
**Impact:** "1.11. 5.3.3. Index merge" auto-numbering "1.11." + literal "5.3.3."
**Fix:** Set `numId=0 numLevel=0` on all H2/H3 paragraphs. Convert all sub-babs to literal text prefix.
**Lesson:** Never mix auto-numbering with literal text prefix. Either use one or the other. The UTS source used auto-numbering but it was broken across BABs (BAB II showed 1.x instead of 2.x).

### Failure #4: Table Styling Multiple Iterations
**Frequency:** 3 sessions (numId fix + shading + match reference)
**Root cause:** Agent did not inspect the reference Properti table's exact XML properties before generating. Guessed colors, borders, padding.
**Impact:** Wrong header color (`#1F4E5F` instead of `#1A7A7A`), wrong border (`#000000` instead of `#CCCCCC`), wrong alignment (left instead of center), no cell padding.
**Fix:** Use `officecli get` to extract exact cell properties from reference table, then batch-apply.
**Lesson:** Always extract reference styling via raw XML inspection before generation. Do not assume defaults.

### Failure #5: Office Environment Interaction
**Frequency:** 1 (OnlyOffice save caused TOC revert)
**Root cause:** OnlyOffice re-generated TOC from heading styles when saving, which stripped entries whose headings had `style=Normal`.
**Impact:** 21 TOC entries + 21 bookmarks lost. User thought agent's work was lost.
**Fix:** Correct heading styles + re-add bookmarks + re-add TOC entries.
**Lesson:** Any Office suite (Word, LibreOffice, OnlyOffice) can re-write the TOC field on save/open. The only way to make entries persist is to ensure heading styles are correct so the TOC field regenerator re-discovers them.

---

## 7. Key Officecli Commands Used

```bash
# View structure
officecli view Laporan-UAS-Bahan.docx outline
officecli view Laporan-UAS-Bahan.docx stats
officecli view Laporan-UAS-Bahan.docx issues

# Query
officecli query Laporan-UAS-Bahan.docx "heading"
officecli query Laporan-UAS-Bahan.docx "table"
officecli query Laporan-UAS-Bahan.docx "bookmark"

# Add elements
officecli add Laporan-UAS-Bahan.docx /body/p[@paraId=XXX] --type bookmark --prop name=_Toc23
officecli add Laporan-UAS-Bahan.docx /body/sdt[1] --type paragraph --prop style="toc 1"

# Set properties
officecli set Laporan-UAS-Bahan.docx /body/p[@paraId=XXX] --prop style="Heading 1"
officecli set Laporan-UAS-Bahan.docx /body/p[@paraId=XXX] --prop numId=0 --prop numLevel=0

# Batch operations
officecli batch Laporan-UAS-Bahan.docx batch.json

# Raw XML operations
officecli raw Laporan-UAS-Bahan.docx --part word/document.xml --xpath /w:document/w:body/w:sdt/w:sdtContent --action append --xml "<w:p>...</w:p>"
```

## 8. Remaining Issues (unresolved)

1. **58 consecutive-space issues** reported by `officecli view issues` - all heading paragraphs have `  X.Y. ` (2 leading spaces). These are intentional per `docs/agents/design.md` ("2 spaces + number + dot").
2. **TOC page numbers are cached** - need Word F9 "Update entire table" to populate accurate page numbers.
3. **Trailing spaces** in `evt_cek_stok_harian ` and `evt_bersihkan_log_lama ` (BAB IV) - pre-existing UTS defect, explicitly preserved per anti-pattern note.
4. **Empty H1 paragraph** between BAB II and BAB III - pre-existing UTS source defect.
5. **Font substitution** possible if XDPrime is not installed on the user's machine (fallback to Times New Roman).
