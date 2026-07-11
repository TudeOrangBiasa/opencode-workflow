#!/usr/bin/env bash
set -euo pipefail

# aggregate-eval.sh — Aggregate findings from eval reports into priority fix list
#
# Usage:
#   ./scripts/aggregate-eval.sh                    # scan .scratch/evals/
#   ./scripts/aggregate-eval.sh .scratch/evals/     # custom path
#   ./scripts/aggregate-eval.sh --json              # JSON output
#   ./scripts/aggregate-eval.sh --help              # this help

# Parse args (--json can be $1 or $2)
EVAL_DIR=".scratch/evals"
MODE="text"

for arg in "$@"; do
  case "$arg" in
    --json) MODE="json" ;;
    --help|-h) sed -n '3,12p' "$0"; exit 0 ;;
    *) EVAL_DIR="$arg" ;;
  esac
done

if [ ! -d "$EVAL_DIR" ]; then
  echo "Error: $EVAL_DIR not found" >&2
  exit 1
fi

if [ -z "$(ls -A "$EVAL_DIR"/*.md 2>/dev/null)" ]; then
  echo "No eval reports found in $EVAL_DIR"
  exit 0
fi

# YAML frontmatter parser: extracts a field value from YAML frontmatter
# Usage: parse_yaml <file> <field>
parse_yaml() {
  awk -v field="$2" '
    /^---$/ { if (found) exit; found=1; next }
    found && /^---$/ { exit }
    found && tolower($0) ~ "^" tolower(field) ":" {
      sub(/^[^:]+:[[:space:]]*/, "")
      print
    }
  ' "$1"
}

# Parse list items under a finding field
# Usage: parse_list <file> <section> <field>
parse_list() {
  awk -v section="$2" -v field="$3" '
    /^---$/ { if (in_frontmatter) exit; in_frontmatter=1; next }
    in_frontmatter && /^---$/ { in_frontmatter=0; next }
    in_frontmatter && tolower($0) ~ "^" tolower(section) ":" { target=1; next }
    in_frontmatter && target && /^  [a-z]/ && !/^  -/ { target=0 }
    in_frontmatter && target && tolower($0) ~ "^  " tolower(field) ":" {
      gsub(/^[^:]+:[[:space:]]*/, "")
      print
    }
  ' "$1"
}

# Parse findings array items
parse_findings() {
  awk '
    /^---$/ { if (in_fm) exit; in_fm=1; next }
    in_fm && /^---$/ { in_fm=0; next }
    in_fm && /^findings:/ { in_findings=1; next }
    in_fm && in_findings && /^  - / {
      split($0, a, ": ")
      key = a[1]
      gsub(/^  - /, "", key)
      gsub(/^[[:space:]]+/, "")
      gsub(/:$/, "")
      current_finding_key = $0
      sub(/^[[:space:]]*- /, "", current_finding_key)
      sub(/:$/, "", current_finding_key)
      gsub(/[[:space:]]/, "_", current_finding_key)
    }
    in_fm && in_findings && /^    [a-z]/ {
      key = $0
      sub(/^[[:space:]]+/, "", key)
      val_start = index($0, ": ")
      if (val_start > 0) {
        key = substr($0, 1, val_start - 1)
        val = substr($0, val_start + 2)
        gsub(/^[[:space:]]+/, "", key)
        gsub(/^[[:space:]]+/, "", val)
        if (current_finding_key != "") {
          print current_finding_key "|" key "|" val
        }
      }
    }
  ' "$1"
}

declare -A TARGETS       # target -> severity counts
declare -A CATEGORIES    # category -> count
declare -A ALL_TARGETS   # target -> summary/fix details
declare -A ALL_FINDINGS  # id -> full text

TOTAL=0
PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

for report in "$EVAL_DIR"/*.md; do
  [ -f "$report" ] || continue

  # Extract metrics
  PASS_AT_1=$(parse_yaml "$report" "pass_at_1" || echo "")
  PASS_AT_1="${PASS_AT_1:-unknown}"

  # Use awk to parse full findings
  while IFS='|' read -r finding_id key val; do
    [ -z "$finding_id" ] && continue
    [ -z "$key" ] && continue

    case "$key" in
      severity)
        CURRENT_SEV="$val"
        CURRENT_FINDING_ID="$finding_id"
        ;;
      category)
        CURRENT_CAT="$val"
        ;;
      target)
        CURRENT_TARGET="$val"
        ;;
      verdict)
        CURRENT_VERDICT="$val"
        ;;
      summary)
        CURRENT_SUMMARY="$val"
        ;;
      fix)
        CURRENT_FIX="$val"

        # Record
        if [ -n "$CURRENT_TARGET" ]; then
          SEV_KEY="${CURRENT_SEV:-unknown}"
          key="${CURRENT_TARGET}:${SEV_KEY}"
          TARGETS["$key"]=$(( ${TARGETS["$key"]:-0} + 1 ))

          detail="${ALL_TARGETS["${CURRENT_TARGET}_details"]:-}"
          ALL_TARGETS["${CURRENT_TARGET}_details"]="${detail}  - ${CURRENT_VERDICT:-?} | ${CURRENT_SEV:-?} | ${CURRENT_CAT:-?} | ${CURRENT_SUMMARY:-?} | ${CURRENT_FIX:-?}\n"
        fi

        if [ -n "$CURRENT_CAT" ]; then
          CATEGORIES["$CURRENT_CAT"]=$(( ${CATEGORIES["$CURRENT_CAT"]:-0} + 1 ))
        fi

        TOTAL=$((TOTAL + 1))
        case "${CURRENT_VERDICT:-}" in
          fail) FAIL_COUNT=$((FAIL_COUNT + 1)) ;;
          warn) WARN_COUNT=$((WARN_COUNT + 1)) ;;
          pass) PASS_COUNT=$((PASS_COUNT + 1)) ;;
        esac

        # Reset per-finding state
        CURRENT_SEV=""; CURRENT_CAT=""; CURRENT_TARGET=""
        CURRENT_VERDICT=""; CURRENT_SUMMARY=""
        ;;
    esac
  done < <(parse_findings "$report")
done

# === OUTPUT ===

if [ "$MODE" = "json" ]; then
  # JSON output
  echo "{"
  echo "  \"total_findings\": $TOTAL,"
  echo "  \"verdicts\": { \"pass\": $PASS_COUNT, \"fail\": $FAIL_COUNT, \"warn\": $WARN_COUNT },"
  echo "  \"category_distribution\": {"
  first=1
  for cat in "${!CATEGORIES[@]}"; do
    [ "$first" = 1 ] && first=0 || echo ","
    echo -n "    \"$cat\": ${CATEGORIES[$cat]}"
  done
  echo ""
  echo "  },"
  echo "  \"target_priority\": ["
  # Sort targets by severity weight
  first=1
  for key in "${!TARGETS[@]}"; do
    target="${key%%:*}"
    sev="${key##*:}"
    weight=0
    case "$sev" in
      CRITICAL) weight=5 ;;
      HIGH) weight=4 ;;
      MEDIUM) weight=2 ;;
      LOW) weight=1 ;;
    esac
    count="${TARGETS[$key]}"
    echo "  $target|$sev|$count|$weight"
  done | sort -t'|' -k4 -rn -k3 -rn | while IFS='|' read -r target sev count weight; do
    [ "$first" = 1 ] && first=0 || echo ","
    echo -n "    { \"target\": \"$target\", \"severity\": \"$sev\", \"count\": $count }"
  done
  echo ""
  echo "  ]"
  echo "}"
else
  # Text output
  echo "=========================================="
  echo "  Eval Report Aggregation"
  echo "  Source: $EVAL_DIR"
  echo "  Reports: $(ls -1 "$EVAL_DIR"/*.md 2>/dev/null | wc -l) files"
  echo "=========================================="
  echo ""
  echo "Findings: $TOTAL total ($PASS_COUNT pass, $FAIL_COUNT fail, $WARN_COUNT warn)"
  echo ""

  # Category distribution
  echo "--- Category Distribution ---"
  if [ ${#CATEGORIES[@]} -eq 0 ]; then
    echo "  (none)"
  else
    for cat in "${!CATEGORIES[@]}"; do
      echo "  $cat: ${CATEGORIES[$cat]}"
    done | sort -t':' -k2 -rn
  fi
  echo ""

  # Target priority (sorted by severity weight * count)
  echo "--- Target Priority (fail+warn findings) ---"
  if [ ${#TARGETS[@]} -eq 0 ]; then
    echo "  (none)"
  else
    # Build severity-weighted sort
    tmpfile=$(mktemp)
    for key in "${!TARGETS[@]}"; do
      target="${key%%:*}"
      sev="${key##*:}"
      weight=0
      case "$sev" in
        CRITICAL) weight=5 ;;
        HIGH) weight=4 ;;
        MEDIUM) weight=2 ;;
        LOW) weight=1 ;;
      esac
      count="${TARGETS[$key]}"
      score=$((weight * count))
      echo "$score|$target|$sev|$count" >> "$tmpfile"
    done
    sort -t'|' -k1 -rn "$tmpfile" | while IFS='|' read -r score target sev count; do
      printf "  %-25s %-10s %3d findings (score: %d)\n" "$target" "$sev" "$count" "$score"
    done
    rm -f "$tmpfile"
  fi
  echo ""

  # Details per target
  echo "--- Details ---"
  if [ ${#ALL_TARGETS[@]} -eq 0 ]; then
    echo "  (none)"
  else
    for target_key in "${!ALL_TARGETS[@]}"; do
      # Filter only _details keys
      case "$target_key" in
        *_details)
          target_name="${target_key%_details*}"
          echo "[$target_name]"
          echo -e "${ALL_TARGETS[$target_key]}" | sed 's/\\n/\n/g' | while IFS='|' read -r verdict sev cat summary fix; do
            [ -z "$verdict" ] && continue
            printf "  %-6s %-10s %-18s %s\n" "$verdict" "$sev" "$cat" "$summary"
            printf "         fix: %s\n" "$fix"
          done
          echo ""
          ;;
      esac
    done
  fi

  echo "=========================================="
fi
