---
name: write-a-skill
description: Create new agent skills with proper structure, progressive disclosure, and bundled resources. Use when user wants to create, write, or build a new skill.
---

# Writing Skills

## Process

1. **Gather requirements** - ask user about:
   - What task/domain does the skill cover?
   - What specific use cases should it handle?
   - Does it need executable scripts or just instructions?
   - Any reference materials to include?
2. **Classify each requirement as deterministic or judgement**:
   - **Deterministic** (script work): file ops, table lookup, fixed command sequence, presence checks (`test -f`, env vars, tool installed). These run the same way every time.
   - **Judgement** (skill work): ambiguous user intent, code-aware decisions, design tradeoffs, qualitative synthesis. These need LLM context.
   - **Rule of thumb**: if a requirement can be expressed as "If [checkable condition] then [command]", it's deterministic. Extract to a script. The skill only describes the script's purpose and routes the call.

3. **Draft the skill** - create:
   - SKILL.md with concise instructions
   - Additional reference files if content exceeds 500 lines
   - Utility scripts if deterministic operations needed

4. **Review with user** - present draft and ask:
   - Does this cover your use cases?
   - Anything missing or unclear?
   - Should any section be more/less detailed?

## Skill Structure

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── REFERENCE.md       # Detailed docs (if needed)
├── EXAMPLES.md        # Usage examples (if needed)
└── scripts/           # Utility scripts (if needed)
    └── helper.js
```

## SKILL.md Template

```md
---
name: skill-name
description: Brief description of capability. Use when [specific triggers].
---

# Skill Name

## Quick start

[Minimal working example]

## Workflows

[Step-by-step processes with checklists for complex tasks]

## Advanced features

[Link to separate files: See [REFERENCE.md](REFERENCE.md)]
```

## Description Requirements

The description is **the only thing your agent sees** when deciding which skill to load. It's surfaced in the system prompt alongside all other installed skills. Your agent reads these descriptions and picks the relevant skill based on the user's request.

**Goal**: Give your agent just enough info to know:

1. What capability this skill provides
2. When/why to trigger it (specific keywords, contexts, file types)

**Format**:

- Max 1024 chars
- Write in third person
- First sentence: what it does
- Second sentence: "Use when [specific triggers]"

**Good example**:

```
Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when user mentions PDFs, forms, or document extraction.
```

**Bad example**:

```
Helps with documents.
```

The bad example gives your agent no way to distinguish this from other document skills.

## When to Add Scripts

**Default: extract deterministic logic to a script.** The skill stays a thin dispatcher; the script does the work. Pay the cost once at script-write time, not on every LLM call.

Add utility scripts when:

- Operation is deterministic (validation, formatting, file ops, presence checks)
- Same code would be generated repeatedly across sessions
- Errors need explicit handling
- The skill text contains "If [checkable condition] then [command]" — that line is a script in disguise. Extract it.

**Anti-pattern to avoid**: writing skill text that says "If `X` exists, do A. If not, do B. If `Y`, do C..." for conditions a shell can test. The LLM re-evaluates this on every call, burning tokens and producing non-deterministic output for what should be deterministic work.

**Examples of deterministic → script:**

| Skill says (anti-pattern) | Should be |
|---|---|
| "If `AGENTS.md` exists, edit it. If not, create it." | `test -f AGENTS.md && edit \|\| create` in script |
| "If `design.md` is present, read it; otherwise ask the user" | Script: emit JSON `{design_md: "path-or-null"}`; skill reads JSON |
| "Run pandoc with these flags, or with --csl if a CSL file exists" | Script: `discover_format()` returns flag set; pandoc call assembled from that |

**When NOT to script**: judgement-heavy decisions (which approach to take, what design fits the project, how to phrase user-facing copy). Scripts don't have context.

Scripts save tokens and improve reliability vs generated code. The LLM should invoke a script, not re-derive its logic from English prose.

## When to Split Files

Split into separate files when:

- SKILL.md exceeds 100 lines
- Content has distinct domains (finance vs sales schemas)
- Advanced features are rarely needed

## Review Checklist

After drafting, verify:

- [ ] Description includes triggers ("Use when...")
- [ ] SKILL.md under 100 lines
- [ ] No time-sensitive info
- [ ] Consistent terminology
- [ ] Concrete examples included
- [ ] References one level deep
- [ ] No "If [checkable condition] then [command]" English if-statements. Every such line has a shell-testable condition → move to script.
- [ ] Deterministic work (file ops, table lookups, fixed command sequences) lives in `scripts/`, not in skill prose. The skill dispatches; the script executes.
