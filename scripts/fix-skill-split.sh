#!/usr/bin/env bash
# fix-skill-split.sh — Mechanically split a >100 line SKILL.md into SKILL.md + REFERENCE.md.
# Per write-a-skill pattern:
#   - SKILL.md (≤100 lines): frontmatter + title + dispatcher sections
#   - REFERENCE.md (rest): detail, examples, attribution
#
# Usage: ./scripts/fix-skill-split.sh <skill-path> [--dry-run]
#
# Strategy:
#   1. Find natural split point (after "## When to use" or "## Quick start" or "## Workflow")
#   2. Keep frontmatter + first dispatcher section in SKILL.md
#   3. Move everything else to REFERENCE.md
#   4. Add "See REFERENCE.md for full content" section at end of SKILL.md
#   5. Add attribution if skill is in engineering/ or misc/

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <skill-path> [--dry-run]"
  exit 2
fi

SKILL_PATH="$1"
DRY_RUN=false
[[ "${2:-}" == "--dry-run" ]] && DRY_RUN=true

if [[ ! -d "$SKILL_PATH" ]]; then
  echo "Error: $SKILL_PATH not a directory"
  exit 2
fi

SKILL_MD="$SKILL_PATH/SKILL.md"
REFERENCE_MD="$SKILL_PATH/REFERENCE.md"

if [[ ! -f "$SKILL_MD" ]]; then
  echo "Error: $SKILL_MD not found"
  exit 2
fi

LINE_COUNT=$(wc -l < "$SKILL_MD")
if [[ $LINE_COUNT -le 100 ]]; then
  echo "SKIP: $SKILL_MD is $LINE_COUNT lines (already ≤100)"
  exit 0
fi

SKILL_NAME=$(basename "$SKILL_PATH")
PARENT_DIR=$(basename "$(dirname "$SKILL_PATH")")

echo "Splitting: $SKILL_MD ($LINE_COUNT lines)"

# Determine attribution based on parent dir
case "$PARENT_DIR" in
  engineering)
    ATTRIB='## Attribution

Forked from [mattpocock/skills](https://github.com/mattpocock/skills). License: MIT.

Modifications:
- Split to SKILL.md + REFERENCE.md per write-a-skill
'
    ;;
  misc)
    ATTRIB='## Attribution

Forked from [affaan-m/ecc](https://github.com/affaan-m/ecc). License: MIT.

Modifications:
- Split to SKILL.md + REFERENCE.md per write-a-skill
'
    ;;
  *)
    ATTRIB=""
    ;;
esac

# Find split point: after first "## " section that looks like a dispatcher
# (e.g., "## When to use", "## Quick start", "## Workflow")
# Fallback: after line 80
SPLIT_LINE=$(awk '
  /^## / {
    # Found a section header
    if (found == 0 && ($0 ~ /When to use|Quick start|Workflow|Usage|Basic/)) {
      # Skip to end of this section
      found = 1
      in_dispatcher = 1
    } else if (found == 1 && $0 ~ /^## / && $0 !~ /When to use|Quick start|Workflow|Usage|Basic/) {
      # End of dispatcher section, this is where detail starts
      print NR - 1
      exit
    }
  }
  END {
    if (found == 1) {
      # Never found a clear end, use line 80
      print 80
    } else {
      # Never found a dispatcher section, use line 80
      print 80
    }
  }
' "$SKILL_MD")

# Make sure SKILL.md stays valid (≥30 lines, has frontmatter end)
if [[ $SPLIT_LINE -lt 30 ]]; then
  SPLIT_LINE=80
fi

# Add 5 lines of buffer for "See REFERENCE.md" section
SPLIT_LINE=$((SPLIT_LINE + 5))

echo "Split point: line $SPLIT_LINE"

if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DRY-RUN] Would split at line $SPLIT_LINE"
  exit 0
fi

# Backup
cp "$SKILL_MD" "$SKILL_PATH/SKILL.md.bak"

# Create new SKILL.md (frontmatter + dispatcher)
head -n $SPLIT_LINE "$SKILL_PATH/SKILL.md.bak" > "$SKILL_MD"

# Add "See REFERENCE.md" section at end of SKILL.md if not present
if ! grep -q "REFERENCE.md" "$SKILL_MD"; then
  cat >> "$SKILL_MD" <<EOF

## See also

For full content, examples, and detailed patterns, see [REFERENCE.md](REFERENCE.md).
EOF
fi

# Create REFERENCE.md (rest + attribution)
cat > "$REFERENCE_MD" <<EOF
# $SKILL_NAME — Reference

Full content extracted from original SKILL.md. This file contains detailed patterns, examples, and reference material.

$ATTRIB
---

EOF

# Append everything after split point from original
tail -n +$((SPLIT_LINE + 1)) "$SKILL_PATH/SKILL.md.bak" >> "$REFERENCE_MD"

# Remove backup
rm "$SKILL_PATH/SKILL.md.bak"

NEW_LINE_COUNT=$(wc -l < "$SKILL_MD")
REF_LINE_COUNT=$(wc -l < "$REFERENCE_MD")

echo "Done: SKILL.md is now $NEW_LINE_COUNT lines, REFERENCE.md is $REF_LINE_COUNT lines"
