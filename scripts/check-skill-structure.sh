#!/usr/bin/env bash
# check-skill-structure.sh — Verify each skill follows write-a-skill principles.
#
# Checks for each skill in skills/:
#   1. Has SKILL.md
#   2. SKILL.md has frontmatter (name + description)
#   3. Description has "Use when..." triggers
#   4. SKILL.md < 100 lines (concise, detail in REFERENCE.md)
#   5. No time-sensitive info (date stamps, version refs)
#
# Exits 1 if any check fails, 0 if all pass.
#
# Usage: ./scripts/check-skill-structure.sh [skills-dir]
#   skills-dir: directory containing skills (default: opencode-workflow/skills)

set -euo pipefail

SKILLS_DIR="${1:-$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )/skills}"

# Excluded dirs (not skills)
EXCLUDES=(
  "documents-kit-skills"  # symlink to external package
  "deprecated"            # old skills
  "in-progress"           # WIP skills
  "personal"              # personal skills (may have OS-specific paths)
  "misc"                  # legacy skills (not actively maintained)
)

FAIL=0
TOTAL=0
PASS=0

echo "=== Skill Structure Check ==="
echo "Scanning: $SKILLS_DIR"
echo

# Build find -prune expression for excluded dirs
PRUNE_EXPR=""
for excl in "${EXCLUDES[@]}"; do
  PRUNE_EXPR="$PRUNE_EXPR -o -name \"$excl\""
done

# Find all skills (directories containing SKILL.md), excluding EXCLUDES
while IFS= read -r skill_md; do
  TOTAL=$((TOTAL + 1))
  skill_dir=$(dirname "$skill_md")

  # Check if skill is in an excluded dir
  skip=false
  for excl in "${EXCLUDES[@]}"; do
    if [[ "$skill_dir" == *"/$excl" || "$skill_dir" == *"/skills/$excl" ]]; then
      skip=true
      break
    fi
  done
  if [[ "$skip" == "true" ]]; then
    echo "[SKIP] $(basename "$skill_dir")"
    continue
  fi

  # Check 1: SKILL.md exists
  if [[ ! -f "$skill_md" ]]; then
    echo "[FAIL] $(basename "$skill_dir") - no SKILL.md"
    FAIL=$((FAIL + 1))
    continue
  fi

  # Check 2-3: Frontmatter with name + description containing "Use when"
  if ! head -20 "$skill_md" | grep -q "^name:"; then
    echo "[FAIL] $(basename "$skill_dir") - missing 'name:' in frontmatter"
    FAIL=$((FAIL + 1))
    continue
  fi
  if ! head -20 "$skill_md" | grep -q "^description:"; then
    echo "[FAIL] $(basename "$skill_dir") - missing 'description:' in frontmatter"
    FAIL=$((FAIL + 1))
    continue
  fi
  if ! grep -qE "Use when|use when" "$skill_md"; then
    echo "[WARN] $(basename "$skill_dir") - no 'Use when' trigger in description"
    # Warning, not fail
  fi

  # Check 4: SKILL.md < 100 lines
  line_count=$(wc -l < "$skill_md")
  if [[ $line_count -gt 100 ]]; then
    echo "[FAIL] $(basename "$skill_dir") - SKILL.md is $line_count lines (> 100, split to REFERENCE.md)"
    FAIL=$((FAIL + 1))
    continue
  fi

  # Check 5: No time-sensitive info
  if grep -qE "as of [0-9]{4}|v[0-9]+\.[0-9]+\.[0-9]+ \(2[0-9]{3}\)" "$skill_md"; then
    echo "[WARN] $(basename "$skill_dir") - possible time-sensitive info (date/version stamp)"
    # Warning
  fi

  echo "[OK] $(basename "$skill_dir") ($line_count lines)"
  PASS=$((PASS + 1))
done < <(find "$SKILLS_DIR" -type f -name "SKILL.md" 2>/dev/null)

echo
echo "=== Summary ==="
echo "Passed: $PASS / $TOTAL"
echo "Failed: $FAIL / $TOTAL"

if [[ $FAIL -gt 0 ]]; then
  echo
  echo "See https://github.com/.../write-a-skill for principles"
  exit 1
fi
exit 0
