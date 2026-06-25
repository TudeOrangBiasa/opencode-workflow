#!/usr/bin/env bash
# check-portable.sh — Scan skills/scripts for hardcoded absolute paths.
# Use to ensure skills are portable across machines and OSes.
#
# Excluded paths:
#   - personal/ (personal skills, may have OS-specific paths)
#   - misc/ (legacy, not actively maintained)
#   - .scratch/ (local workspace)
#   - .git/ (git internals)
#   - CHANGELOG.md (historical, not actionable)
#   - The script itself (contains the patterns it flags)
#   - AGENTS.md / README.md (documentation that may reference paths as examples)
#   - documents-kit-skills/ (symlink to external package, not our code)
#
# Exits 1 if hardcoded paths found, 0 if clean.
#
# Usage: ./scripts/check-portable.sh [path]
#   path: directory to scan (default: opencode-workflow root)

set -euo pipefail

ROOT="${1:-$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )}"
SELF="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/check-portable.sh"

# Hardcoded path patterns to flag (Linux/macOS specific)
# These match paths that should be replaced with $XDG_DATA_HOME or $HOME
PATTERNS=(
  '/home/[^/]+/'           # /home/user/, etc.
  '/Users/[^/]+/'          # macOS user home
  '/workspace/'
  'C:\\\\Users\\\\'        # Windows user home (escaped)
  '\$HOME/Workspace/'      # absolute $HOME/ paths
)

# Paths to exclude from scan
EXCLUDES=(
  "$SELF"                  # this script (contains patterns as data)
  "CHANGELOG.md"           # historical file
  "AGENTS.md"              # documentation (may reference paths as examples)
  "README.md"              # documentation
  "documents-kit-skills/"  # symlink to external package
  "personal/"              # personal skills (may have OS-specific paths)
  "misc/"                  # legacy skills (not actively maintained)
  ".scratch/"              # local workspace
  ".git/"                  # git internals
)

OFFENDERS=()

# Find all source files (excluding directories in EXCLUDES)
for pattern in "${PATTERNS[@]}"; do
  while IFS= read -r match; do
    # Check exclusion
    skip=false
    for excl in "${EXCLUDES[@]}"; do
      if [[ "$match" == *"$excl"* ]]; then
        skip=true
        break
      fi
    done
    [[ "$skip" == "true" ]] && continue

    OFFENDERS+=("$match")
  done < <(grep -rE "$pattern" "$ROOT" \
              --include="*.md" --include="*.sh" --include="*.py" \
              --include="*.yml" --include="*.yaml" \
              --include="*.json" --include="*.toml" \
              -l 2>/dev/null \
            | grep -v "/.git/" \
            | grep -v "/.scratch/" \
            | grep -v "/personal/" \
            | grep -v "/misc/" \
            | grep -v "CHANGELOG.md" \
            | grep -v "/AGENTS.md" \
            | grep -v "/README.md" \
            | grep -v "/documents-kit-skills/" \
            | grep -v "/check-portable.sh" \
            || true)
done

if [[ ${#OFFENDERS[@]} -gt 0 ]]; then
  echo "FAIL: Hardcoded paths found in ${#OFFENDERS[@]} file(s):"
  for f in "${OFFENDERS[@]}"; do
    echo "  - $f"
  done
  echo
  echo "Fix: use env vars (\$XDG_DATA_HOME, \$HOME) or relative paths."
  echo "Override detection via env var: e.g., DOCUMENTS_KIT_DIR=/custom/path"
  exit 1
fi

echo "PASS: No hardcoded paths found"
exit 0
