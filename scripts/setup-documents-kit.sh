#!/usr/bin/env bash
# setup-documents-kit.sh — Symlink the 3 document-kit-skills into opencode-workflow.
# Run this once after cloning opencode-workflow, after cloning documents-kit-skills.
#
# Creates symlinks:
#   opencode-workflow/skills/productivity/document-writing → documents-kit-skills/skills/document-writing
#   opencode-workflow/skills/productivity/humanizer       → documents-kit-skills/skills/humanizer
#   opencode-workflow/skills/misc/drawio                  → documents-kit-skills/skills/drawio
#   opencode-workflow/documents-kit-skills                 → documents-kit-skills/ (top-level convenience)
#
# Backs up existing skill dirs to .scratch/backup/ if they exist.

set -euo pipefail

WORKFLOW_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
KIT_DIR="${DOCUMENTS_KIT_DIR:-/home/todayz/Workspace/personal/dev/ai-kit/documents-kit-skills}"

echo "=== Setup documents-kit-skills symlinks ==="
echo "Workflow: $WORKFLOW_DIR"
echo "Kit:      $KIT_DIR"
echo

# Check kit dir exists
if [[ ! -d "$KIT_DIR" ]]; then
  echo "Error: documents-kit-skills not found at $KIT_DIR"
  echo "Clone it first:"
  echo "  git clone <repo-url> $KIT_DIR"
  exit 1
fi

# Backup helper
backup_if_exists() {
  local path="$1"
  if [[ -d "$path" && ! -L "$path" ]]; then
    local backup_dir="$WORKFLOW_DIR/.scratch/backup/$(basename "$path")-bak"
    echo "Backing up $path → $backup_dir"
    mkdir -p "$(dirname "$backup_dir")"
    mv "$path" "$backup_dir"
  elif [[ -L "$path" ]]; then
    echo "Already symlinked: $path"
  fi
}

# Remove existing broken symlinks (target doesn't exist)
remove_broken_link() {
  local path="$1"
  if [[ -L "$path" && ! -e "$path" ]]; then
    echo "Removing broken symlink: $path"
    rm "$path"
  fi
}

# 1. Symlink the 3 skills
SKILLS=(
  "skills/productivity/document-writing"
  "skills/productivity/humanizer"
  "skills/misc/drawio"
)

for relpath in "${SKILLS[@]}"; do
  target="$WORKFLOW_DIR/$relpath"
  src="$KIT_DIR/${relpath#skills/}"
  remove_broken_link "$target"
  backup_if_exists "$target"
  if [[ ! -L "$target" ]]; then
    echo "Symlinking $relpath → $src"
    ln -s "$src" "$target"
  fi
done

# 2. Top-level symlink for full repo access
TOPLEVEL="$WORKFLOW_DIR/documents-kit-skills"
remove_broken_link "$TOPLEVEL"
if [[ -d "$TOPLEVEL" && ! -L "$TOPLEVEL" ]]; then
  echo "Warning: $TOPLEVEL exists as a directory, not symlinking"
elif [[ ! -L "$TOPLEVEL" ]]; then
  echo "Symlinking documents-kit-skills → $KIT_DIR"
  ln -s "$KIT_DIR" "$TOPLEVEL"
fi

# 3. Verify
echo
echo "=== Verify ==="
for relpath in "${SKILLS[@]}"; do
  target="$WORKFLOW_DIR/$relpath"
  if [[ -L "$target" && -e "$target" ]]; then
    echo "[OK] $relpath → $(readlink "$target")"
  else
    echo "[FAIL] $relpath is not a working symlink"
  fi
done

if [[ -L "$TOPLEVEL" && -e "$TOPLEVEL" ]]; then
  echo "[OK] documents-kit-skills → $(readlink "$TOPLEVEL")"
fi

echo
echo "=== Done ==="
echo "Restart OpenCode to pick up changes."
echo "Edit documents in: $KIT_DIR"
echo "Changes propagate to opencode-workflow via symlinks."
