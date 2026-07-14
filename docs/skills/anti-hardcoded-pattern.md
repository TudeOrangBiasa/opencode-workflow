---
name: anti-hardcoded-pattern
description: Rules for writing portable skills that work across machines, OSes, and users. Use when writing or reviewing any skill, script, or tool. Enforced by pre-commit hook (skill-structure check) and manual review.
---

# Anti-Hardcoded Pattern

Skills and tools must be **portable** — installable by anyone on any machine. No hardcoded paths, OS assumptions, or user-specific defaults.

## 7 rules

### 1. Use XDG path conventions (Linux/macOS)

```bash
# Good
SKILLS_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/my-skill"

# Bad
SKILLS_DIR="/home/user/.local/share/my-skill"
```

### 2. Use env var override pattern

Every path must be overridable:
```bash
# Good
KIT_DIR="${MY_SKILL_DIR:-$HOME/.local/share/my-skill}"

# Bad (hardcoded default, no override)
KIT_DIR="/home/user/Workspace/ai-kit/my-skill"
```

### 3. No absolute paths in source

```bash
# Good (env var, relative, or detected)
SKILL_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

# Bad
SKILL_PATH="/home/user/opencode-workflow/skills"
```

### 4. Detect OS at install time

```bash
# Good
case "$(uname -s)" in
  Linux*)  INSTALL_DIR="$HOME/.local/share" ;;
  Darwin*) INSTALL_DIR="$HOME/Library/Application Support" ;;
  *)       echo "Unsupported OS" >&2; exit 1 ;;
esac
```

### 5. Quote variables in shell

```bash
# Good
rm -rf "$KIT_DIR/skills/$skill"

# Bad
rm -rf $KIT_DIR/skills/$skill
```

### 6. Document every dependency

```markdown
# In README or SKILL.md
## Dependencies
- officecli MCP (required for .docx manipulation)
- pandoc (required for md → docx)
- python3 with python-docx (fallback)
```

### 7. Use relative references in docs

```markdown
# Good
See **write-a-skill** for skill structure.

# Bad
See [write-a-skill](~/.config/opencode/skills/write-a-skill/SKILL.md)
```

## Enforced by

- `scripts/check-skill-structure.sh` — verifies skill structure
- `scripts/pre-commit.sh` — runs skill-structure check before commit

## Good vs Bad example

**Good** (portable):
```bash
#!/usr/bin/env bash
KIT_DIR="${MY_SKILL_DIR:-$HOME/.local/share/my-skill}"
SKILLS_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/opencode/skills"
ln -s "$KIT_DIR/skills/my-skill" "$SKILLS_DIR/my-skill"
```

**Bad** (hardcoded):
```bash
#!/usr/bin/env bash
KIT_DIR="/home/user/Workspace/ai-kit/my-skill"
SKILLS_DIR="/home/user/.config/opencode/skills"
ln -s "$KIT_DIR/skills/my-skill" "$SKILLS_DIR/my-skill"
```

## Reference

- **write-a-skill** — skill structure principles
- **skill-author** — meta-skill for creating skills
- [extraction-criteria.md](extraction-criteria.md) — when to extract
- [architecture.md](../architecture.md) — overall layout
