#!/usr/bin/env bash
set -euo pipefail

# link-skills.sh — Deploy skills from repo to ~/.config/opencode/skills/
# preserving bucket structure. Generates opencode.json paths list.
#
# Usage:
#   ./scripts/link-skills.sh                    # apply symlinks
#   ./scripts/link-skills.sh --paths            # only print paths, no changes
#   ./scripts/link-skills.sh --dry-run          # show what would change
#   ./scripts/link-skills.sh --help             # this message

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$HOME/.config/opencode/skills"
MODE="${1:-apply}"

case "$MODE" in
  --help) sed -n '3,13p' "$0"; exit 0 ;;
  --paths) MODE=paths ;;
  --dry-run) MODE=dry ;;
esac

echo "=== link-skills.sh ==="
echo "  repo: $REPO/skills"
echo "  dest: $DEST"
echo ""

# ---------------------------------------------------------------
# Discover all skills
# ---------------------------------------------------------------

SKILLS=()

# Real SKILL.md files
while IFS= read -r -d '' sk; do
  dir="$(dirname "$sk")"
  rel="${dir#$REPO/skills/}"
  case "$rel" in deprecated/*|in-progress/*) continue ;; esac
  SKILLS+=("$rel")
done < <(find "$REPO/skills" -name SKILL.md -print0)

# Symlinked dirs with SKILL.md (external skills)
while IFS= read -r -d '' symdir; do
  rel="${symdir#$REPO/skills/}"
  case "$rel" in deprecated/*|in-progress/*) continue ;; esac
  [ -f "$symdir/SKILL.md" ] && SKILLS+=("$rel")
done < <(find "$REPO/skills" -type l -xtype d -print0)

# Deduplicate
SKILLS=($(printf "%s\n" "${SKILLS[@]}" | sort -u))

echo "Discovered ${#SKILLS[@]} skills"
echo ""

# ---------------------------------------------------------------
# Compute all leaf buckets
# ---------------------------------------------------------------

ALL_BUCKETS=()
for skill in "${SKILLS[@]}"; do
  ALL_BUCKETS+=("$(dirname "$skill")")
done
UNIQ_BUCKETS=($(printf "%s\n" "${ALL_BUCKETS[@]}" | sort -u))

# ---------------------------------------------------------------
# Detect package-entry conflicts:
# A skill conflicts if its target path would be a parent dir of any bucket.
# e.g. engineering/design is a skill AND engineering/design/arch-dec-records is a skill
#      → target $DEST/engineering/design/ is parent of $DEST/engineering/design/arch-dec-records/
# ---------------------------------------------------------------

CONFLICT=()
for skill in "${SKILLS[@]}"; do
  target="$DEST/$(dirname "$skill")/$(basename "$skill")"
  conflict=0
  for bucket in "${UNIQ_BUCKETS[@]}"; do
    bucket_path="$DEST/$bucket"
    # Check if bucket path is a subdirectory of the skill target
    case "$bucket_path/" in
      "$target/"*) conflict=1; break ;;
    esac
  done
  CONFLICT+=("$conflict")
done

# ---------------------------------------------------------------
# Print opencode.json paths
# ---------------------------------------------------------------

if [ "$MODE" = "paths" ] || [ "$MODE" = "dry" ] || [ "$MODE" = "apply" ]; then
  echo "--- opencode.json paths (add to skills.paths) ---"
  echo ""

  ACTIVE_BUCKETS=()
  for i in "${!SKILLS[@]}"; do
    [ "${CONFLICT[$i]}" = "1" ] && continue
    ACTIVE_BUCKETS+=("$(dirname "${SKILLS[$i]}")")
  done

  while IFS= read -r b; do
    echo "  \"$DEST/$b\""
  done < <(printf "%s\n" "${ACTIVE_BUCKETS[@]}" | sort -u)

  count="$(printf "%s\n" "${ACTIVE_BUCKETS[@]}" | sort -u | wc -l | tr -d ' ')"
  echo ""
  echo "Total: $count paths"
  echo ""
fi

[ "$MODE" = "paths" ] && exit 0

# ---------------------------------------------------------------
# Clean old flat symlinks that conflict with new nested structure
# ---------------------------------------------------------------

echo "Cleaning flat symlinks..."

# Collect names of skills that have a non-root bucket (need nesting)
FLAT_NAMES=()
for i in "${!SKILLS[@]}"; do
  [ "${CONFLICT[$i]}" = "1" ] && continue
  bucket="$(dirname "${SKILLS[$i]}")"
  [ "$bucket" = "." ] && continue
  FLAT_NAMES+=("$(basename "${SKILLS[$i]}")")  # name only
done

for item in "$DEST"/*/; do
  [ -L "$item" ] || continue
  name="$(basename "$item")"
  for n in "${FLAT_NAMES[@]}"; do
    if [ "$n" = "$name" ]; then
      if [ "$MODE" = "dry" ]; then
        echo "  [DRY] rm -f $item"
      else
        rm -f "$item"
        echo "  removed flat $name"
      fi
      break
    fi
  done
done

echo ""

# ---------------------------------------------------------------
# Create bucket-preserving symlinks
# ---------------------------------------------------------------

echo "Creating symlinks..."

CREATED=0
SKIPPED=0
for i in "${!SKILLS[@]}"; do
  skill="${SKILLS[$i]}"
  bucket="$(dirname "$skill")"
  name="$(basename "$skill")"
  src="$REPO/skills/$skill"
  target="$DEST/$bucket/$name"

  [ ! -d "$src" ] && [ ! -L "$src" ] && continue

  if [ "${CONFLICT[$i]}" = "1" ]; then
    echo "  SKIP (package entry/conflict): $skill"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  if [ "$MODE" = "dry" ]; then
    echo "  [DRY] mkdir -p $DEST/$bucket && ln -sfn $src $target"
  else
    mkdir -p "$DEST/$bucket"
    ln -sfn "$src" "$target"
    echo "  $bucket/$name"
    CREATED=$((CREATED + 1))
  fi
done

echo ""
echo "Done: $CREATED symlinks, $SKIPPED skipped (package entry conflicts)"
