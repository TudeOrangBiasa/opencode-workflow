#!/usr/bin/env bash
# fix-skill-frontmatter.sh — Add `name:` to frontmatter if missing.
# Usage: ./scripts/fix-skill-frontmatter.sh <skill-path>

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <skill-path>"
  exit 2
fi

SKILL_MD="$1/SKILL.md"
[[ ! -f "$SKILL_MD" ]] && { echo "Error: $SKILL_MD not found"; exit 2; }

# Check if name is already there
if head -20 "$SKILL_MD" | grep -q "^name:"; then
  echo "name already exists, skipping"
  exit 0
fi

# Get skill name from directory
SKILL_NAME=$(basename "$1")

# Check if frontmatter exists (--- markers)
if head -1 "$SKILL_MD" | grep -q "^---$"; then
  # Frontmatter exists, add name after first ---
  sed -i "0,/^---$/{s/^---$/---\nname: $SKILL_NAME/}" "$SKILL_MD"
else
  # No frontmatter, add it
  TMP=$(mktemp)
  cat > "$TMP" <<EOF
---
name: $SKILL_NAME
description: TODO
---

EOF
  cat "$SKILL_MD" >> "$TMP"
  mv "$TMP" "$SKILL_MD"
fi

echo "Added name: $SKILL_NAME to $SKILL_MD"
