#!/usr/bin/env bash
# audit-skill.sh — Run full write-a-skill audit on a single skill.
# Combines portability + structure checks with detailed report.
#
# Usage: ./scripts/audit-skill.sh <path-to-skill>
#   path-to-skill: path to a skill directory (e.g., skills/engineering/skill-author)

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <path-to-skill>"
  echo "Example: $0 skills/engineering/skill-author"
  exit 2
fi

SKILL_PATH="$1"

if [[ ! -d "$SKILL_PATH" ]]; then
  echo "Error: $SKILL_PATH is not a directory"
  exit 2
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SKILL_NAME=$(basename "$SKILL_PATH")

echo "=== Audit: $SKILL_NAME ==="
echo "Path: $SKILL_PATH"
echo

# Check 1: Has SKILL.md
echo "--- File presence ---"
if [[ -f "$SKILL_PATH/SKILL.md" ]]; then
  echo "[OK] SKILL.md exists"
else
  echo "[FAIL] SKILL.md missing"
  exit 1
fi

# Check 2: Frontmatter
echo
echo "--- Frontmatter ---"
if head -20 "$SKILL_PATH/SKILL.md" | grep -q "^name: $SKILL_NAME"; then
  echo "[OK] name matches directory"
else
  echo "[WARN] name in frontmatter doesn't match directory"
fi
if head -20 "$SKILL_PATH/SKILL.md" | grep -qE "^description:.*Use when"; then
  echo "[OK] description has 'Use when' trigger"
else
  echo "[WARN] description missing 'Use when' trigger"
fi

# Check 3: Line count
echo
echo "--- Length ---"
LINE_COUNT=$(wc -l < "$SKILL_PATH/SKILL.md")
if [[ $LINE_COUNT -le 100 ]]; then
  echo "[OK] SKILL.md is $LINE_COUNT lines (≤ 100)"
else
  echo "[FAIL] SKILL.md is $LINE_COUNT lines (> 100, split to REFERENCE.md)"
fi

# Check 4: Has REFERENCE.md (if SKILL.md is short enough, optional)
if [[ -f "$SKILL_PATH/REFERENCE.md" ]]; then
  REF_COUNT=$(wc -l < "$SKILL_PATH/REFERENCE.md")
  echo "[OK] REFERENCE.md exists ($REF_COUNT lines)"
else
  if [[ $LINE_COUNT -gt 80 ]]; then
    echo "[WARN] SKILL.md approaching 100-line limit, consider splitting to REFERENCE.md"
  else
    echo "[INFO] no REFERENCE.md (acceptable for short skills)"
  fi
fi

# Check 5: Hardcoded paths in skill
echo
echo "--- Portability ---"
HARDCODED=$(grep -rE '/home/[^/]+/|/Users/[^/]+/|/workspace/|\$HOME/Workspace/' \
            "$SKILL_PATH" --include="*.md" --include="*.sh" --include="*.py" 2>/dev/null || true)
if [[ -n "$HARDCODED" ]]; then
  echo "[FAIL] Hardcoded paths found:"
  echo "$HARDCODED" | sed 's/^/  /'
else
  echo "[OK] no hardcoded paths"
fi

# Check 6: Cross-references use skill name (not absolute path)
echo
echo "--- References ---"
ABS_PATH_REFS=$(grep -rE '~/.config/opencode/skills/|/home/.*/skills/' \
                "$SKILL_PATH" --include="*.md" 2>/dev/null | grep -vE 'readlink|ln -s|symlink' || true)
if [[ -n "$ABS_PATH_REFS" ]]; then
  echo "[WARN] References to absolute paths (use skill name):"
  echo "$ABS_PATH_REFS" | sed 's/^/  /'
else
  echo "[OK] references use skill name (no absolute paths)"
fi

echo
echo "=== Done ==="
echo "For skill writing principles, see **write-a-skill** skill"
