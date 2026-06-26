#!/usr/bin/env bash
# generate-issues.sh — Generate per-skill cleanup issue files.
# Reads /tmp/audit.txt and /tmp/skills.txt, creates .scratch/cleanup-issues/<skill>.md

set -euo pipefail

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
ISSUES_DIR="$ROOT/.scratch/cleanup-issues"
AUDIT_FILE="${AUDIT_FILE:-/tmp/audit.txt}"

if [[ ! -f "$AUDIT_FILE" ]]; then
  echo "Error: $AUDIT_FILE not found. Run scripts/check-skill-structure.sh first."
  exit 1
fi

mkdir -p "$ISSUES_DIR"

# Known forks
declare -A FORKS=(
  ["mattpocock"]="https://github.com/mattpocock/skills"
  ["affaan-m"]="https://github.com/affaan-m/ecc"
)

# Process each issue
while IFS= read -r line; do
  # Parse [LEVEL] skill - issue
  if [[ "$line" =~ ^\[([A-Z]+)\]\ ([^ ]+)\ -\ (.*) ]]; then
    level="${BASH_REMATCH[1]}"
    skill="${BASH_REMATCH[2]}"
    issue="${BASH_REMATCH[3]}"

    issue_file="$ISSUES_DIR/${skill}.md"
    echo "Creating: $issue_file"

    # Determine fork attribution
    fork_note=""
    skill_path=$(find "$ROOT/skills" -type d -name "$skill" 2>/dev/null | head -1)
    if [[ -n "$skill_path" ]]; then
      # Check parent dir for fork
      parent_dir=$(basename "$(dirname "$skill_path")")
      if [[ "$parent_dir" == "engineering" ]]; then
        fork_note="**Forked from**: [mattpocock/skills](${FORKS[mattpocock]}) (Matt Pocock's opencode skills)
- **License**: MIT
- Add attribution to REFERENCE.md
"
      elif [[ "$parent_dir" == "misc" ]]; then
        fork_note="**Forked from**: [affaan-m/ecc](${FORKS[affaan-m]}) (Ecosystem skills collection)
- **License**: MIT
- Add attribution to REFERENCE.md
"
      fi
    fi

    # Determine priority
    priority="P2"
    if [[ "$level" == "FAIL" && "$issue" == *"name:"* ]]; then
      priority="P0"
    elif [[ "$level" == "FAIL" ]]; then
      priority="P1"
    fi

    # Extract line count if available
    line_count=""
    if [[ "$issue" =~ SKILL.md\ is\ ([0-9]+) ]]; then
      line_count="${BASH_REMATCH[1]}"
    fi

    # Generate issue file
    cat > "$issue_file" <<EOF
# Cleanup: \`$skill\`

**Priority**: $priority
**Location**: \`$skill_path\`
**Issue(s)**: $issue

---

## Rules (per **write-a-skill**)

This skill must follow [write-a-skill]($ROOT/skills/engineering/write-a-skill/SKILL.md) principles.

### Check list

EOF

    if [[ "$priority" == "P0" ]]; then
      cat >> "$issue_file" <<EOF
- [ ] **Frontmatter missing \`name:\`** — skill won't load. Add to frontmatter:
  \`\`\`yaml
  ---
  name: $skill
  description: [what it does]. Use when [triggers].
  ---
  \`\`\`
EOF
    fi

    if [[ -n "$line_count" ]]; then
      cat >> "$issue_file" <<EOF
- [ ] **SKILL.md is $line_count lines** (limit: ≤100). **Split to REFERENCE.md** per write-a-skill.
  - Keep in SKILL.md: description (frontmatter), title, "When to use", quick start, "Reference" pointer
  - Move to REFERENCE.md: detailed patterns, code examples, deep dives, alternatives
  - SKILL.md should be ~50-80 lines (dispatcher)
EOF
    fi

    if [[ "$issue" == *"no 'Use when'"* ]]; then
      cat >> "$issue_file" <<EOF
- [ ] **Description missing "Use when..." trigger**. Add specific trigger keywords to description:
  \`\`\`yaml
  description: [what it does in 1 sentence]. Use when [user says X, Y, or Z; mentions topic A, B, or C].
  \`\`\`
EOF
    fi

    if [[ -n "$fork_note" ]]; then
      cat >> "$issue_file" <<EOF

---

## Attribution

$fork_note

Add this to the top of REFERENCE.md after splitting:
\`\`\`markdown
## Attribution

Forked from [source](URL). License: MIT.
Original: [commit/ref].
Modifications: [date] — split to SKILL.md + REFERENCE.md per write-a-skill.
\`\`\`
EOF
    fi

    cat >> "$issue_file" <<EOF

---

## How to fix

\`\`\`bash
# 1. Read current SKILL.md
cat $skill_path/SKILL.md

# 2. Identify dispatcher content (keep) vs detail (move to REFERENCE.md)
#    - Keep: frontmatter, title, "When to use", "Quick start" (3-5 steps), "Reference" pointer
#    - Move: detailed patterns, code examples, alternatives, edge cases

# 3. Write new SKILL.md (≤100 lines)
# 4. Create REFERENCE.md with full content + attribution

# 5. Verify
$ROOT/scripts/audit-skill.sh $skill_path
\`\`\`

EOF
  fi
done < "$AUDIT_FILE"

echo
echo "=== Generated $(ls "$ISSUES_DIR" | wc -l) issue files ==="
ls -la "$ISSUES_DIR" | head -10
