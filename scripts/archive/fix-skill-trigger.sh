#!/usr/bin/env bash
# fix-skill-trigger.sh — Add "Use when..." trigger to skill description.
# Usage: ./scripts/fix-skill-trigger.sh <skill-path>
#
# Heuristic: derive triggers from skill name + existing description.
# Example: skill "php-review" with desc "Reviews PHP code" →
#   "Reviews PHP code. Use when reviewing PHP code, working on PHP projects, or auditing PHP quality."

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <skill-path>"
  exit 2
fi

SKILL_MD="$1/SKILL.md"
[[ ! -f "$SKILL_MD" ]] && { echo "Error: $SKILL_MD not found"; exit 2; }

# Check if already has "Use when"
if grep -qE "Use when|use when" "$SKILL_MD"; then
  echo "Use when already present, skipping"
  exit 0
fi

SKILL_NAME=$(basename "$1")

# Extract current description (between `description:` and closing quote on same line)
current_desc=$(grep -m 1 "^description:" "$SKILL_MD" | sed -E 's/^description:[[:space:]]*//' | tr -d '"' | tr -d "'")

if [[ -z "$current_desc" || "$current_desc" == "TODO" ]]; then
  echo "No current description to extend, skipping"
  exit 0
fi

# Derive triggers from skill name (replace - with space, remove common prefixes)
trigger_phrase=$(echo "$SKILL_NAME" | tr '-' ' ' | sed 's/^review$//;s/^patterns$//;s/^guide$//' | xargs)

# Build new description
new_desc="$current_desc. Use when working with $trigger_phrase."

# Update description line in place
sed -i "s|^description:.*|description: $new_desc|" "$SKILL_MD"

echo "Added Use when to $SKILL_MD"
echo "New: $new_desc"
