---
name: extraction-criteria
description: When to extract a skill to its own repository vs keep it in opencode-workflow. Use when deciding where a new skill should live, or when auditing existing skills.
---

# Skill Extraction Criteria

A skill should be extracted to its own repository if it meets **3 or more** of the following criteria:

## The 5-point checklist

- [ ] **External dependencies > 4** (MCP servers, CLI tools, libraries)
- [ ] **Needs additional skills to function** (composition, e.g., document-writing depends on officecli)
- [ ] **Fully automates a task** (not just a helper — produces complete deliverable)
- [ ] **Has multiple patterns/templates** (style presets, diagram templates, common workflows)
- [ ] **Updates frequently independent of workflow releases** (independent cadence)

## Examples

### Passes (extract)

- **documents-kit-skills** — 4 deps (officecli MCP, pandoc, python-docx, drawio), 4 coupled skills, 5 style presets, 5 diagram templates, fully automates document creation. Score: 5/5.

### Fails (keep inline)

- **write-a-skill** — 0 deps, no composition, just principles. Score: 0/5.
- **grill-with-docs** — 0 deps, single function, no templates. Score: 0/5.

### Borderline (judgment call)

- **dev-workflow** — 0 external deps, but composed of multiple sub-commands. Could be a skill or a script. Decision: keep as skill (composition is internal).
- **memory-dreaming** — single function, but operates on multiple skills. Keep inline.

## How to extract

1. Create new repo (e.g., `documents-kit-skills/`)
2. Add skill files at `skills/skill-name/`
3. Add `install.sh` (curl-friendly) and `setup.sh` (local)
4. Add README with deps + usage
5. Add GitHub Actions for tests
6. In opencode-workflow: create symlink under `skills/personal/package-name/`
7. Update `scripts/setup-<package>.sh` to create symlinks
8. Update `docs/integrations/<package>.md`

See [integrations/documents-kit.md](../integrations/documents-kit.md) as reference.

## Reference

- **write-a-skill** — skill structure principles
- **skill-author** — meta-skill for creating skills
- [architecture.md](../architecture.md) — overall layout
- [anti-hardcoded-pattern.md](anti-hardcoded-pattern.md) — portability for extracted packages
