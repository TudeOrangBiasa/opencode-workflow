#!/usr/bin/env bash
# pre-commit.sh — Run all checks before commit.
# Installed by scripts/install-hooks.sh to .git/hooks/pre-commit.
#
# When run from .git/hooks/, this script's location is NOT the source scripts/.
# Use git rev-parse to find the project root, then locate scripts/ from there.
#
# Runs:
#   - check-skill-structure.sh (write-a-skill compliance)
#
# Skip with: git commit --no-verify

set -euo pipefail

# Get the project root (top-level of git repo), not this script's location
ROOT="$(git rev-parse --show-toplevel)"
SCRIPTS_DIR="$ROOT/scripts"

echo "=== pre-commit checks ==="
echo "Project root: $ROOT"
echo

# Check 1: Skill structure
if ! "$SCRIPTS_DIR/check-skill-structure.sh" "$ROOT/skills" 2>&1; then
  echo
  echo "FAIL: skill structure check"
  echo "Fix skill structure or use 'git commit --no-verify' to skip"
  exit 1
fi

echo
echo "=== All pre-commit checks passed ==="
exit 0
