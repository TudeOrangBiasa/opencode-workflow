#!/usr/bin/env bash
# setup-documents-kit.sh — Symlink documents-kit-skills into opencode-workflow under skills/personal/.
# Run this once after cloning opencode-workflow (and after cloning documents-kit-skills).
#
# Creates:
#   opencode-workflow/skills/personal/documents-kit-skills/  (package folder)
#   opencode-workflow/skills/personal/documents-kit-skills/document-writing  → documents-kit-skills/skills/document-writing
#   opencode-workflow/skills/personal/documents-kit-skills/drawio            → documents-kit-skills/skills/drawio
#   opencode-workflow/skills/personal/documents-kit-skills/humanizer         → documents-kit-skills/skills/humanizer
#   opencode-workflow/skills/personal/documents-kit-skills/officecli         → documents-kit-skills/skills/officecli
#   ~/.config/opencode/skills/{document-writing,drawio,humanizer,officecli}  (re-pointed to package)
#
# Backs up existing skill dirs (if they exist as real dirs, not symlinks) to .scratch/backup/.

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

# Helper: backup if exists as real dir
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

# Helper: remove broken symlink
remove_broken_link() {
  local path="$1"
  if [[ -L "$path" && ! -e "$path" ]]; then
    echo "Removing broken symlink: $path"
    rm "$path"
  fi
}

# 1. Package folder: skills/personal/documents-kit-skills/
PACKAGE_DIR="$WORKFLOW_DIR/skills/personal/documents-kit-skills"
mkdir -p "$PACKAGE_DIR"

# Backup any existing skills in old locations (productivity/, misc/)
backup_if_exists "$WORKFLOW_DIR/skills/productivity/document-writing"
backup_if_exists "$WORKFLOW_DIR/skills/productivity/humanizer"
backup_if_exists "$WORKFLOW_DIR/skills/productivity/officecli"
backup_if_exists "$WORKFLOW_DIR/skills/misc/drawio"

# Remove broken symlinks in package
for skill in document-writing drawio humanizer; do
  remove_broken_link "$PACKAGE_DIR/$skill"
done

# Create symlinks in package
for skill in document-writing drawio humanizer officecli; do
  target="$PACKAGE_DIR/$skill"
  if [[ ! -L "$target" ]]; then
    echo "Package symlink: skills/personal/documents-kit-skills/$skill → $KIT_DIR/skills/$skill"
    ln -s "$KIT_DIR/skills/$skill" "$target"
  fi
done

# 3. Repoint ~/.config/opencode/skills/ to the new package location
echo
echo "=== Re-pointing ~/.config/opencode/skills/ ==="
for skill in document-writing drawio humanizer officecli; do
  global_link="$HOME/.config/opencode/skills/$skill"
  if [[ -L "$global_link" ]]; then
    echo "Removing old symlink: $global_link"
    rm "$global_link"
  elif [[ -d "$global_link" ]]; then
    echo "Warning: $global_link exists as directory, skipping"
    continue
  fi
  echo "Creating: $global_link → $PACKAGE_DIR/$skill"
  ln -s "$PACKAGE_DIR/$skill" "$global_link"
done

# 4. Tools symlinks (if --tools flag or --all)
if [[ "${SETUP_TOOLS:-true}" == "true" ]]; then
  echo
  echo "=== Symlinking tools/ ==="
  TOOLS_DIR="$WORKFLOW_DIR/tools"
  mkdir -p "$TOOLS_DIR"
  for tool in __init__.py officecli_helper.py pandoc_citeproc.py scholar_bibtex.py asset-validator.sh doc-audit-pipeline.sh pdf-from-docx.sh tests; do
    target="$TOOLS_DIR/$tool"
    if [[ ! -L "$target" && ! -d "$target" ]]; then
      echo "  tools/$tool → $KIT_DIR/tools/$tool"
      ln -s "$KIT_DIR/tools/$tool" "$target"
    fi
  done
fi

# 5. Verify
echo
echo "=== Verify ==="
for skill in document-writing drawio humanizer officecli; do
  target="$WORKFLOW_DIR/skills/personal/documents-kit-skills/$skill"
  if [[ -L "$target" && -e "$target" ]]; then
    echo "[OK] $skill → $(readlink "$target")"
  else
    echo "[FAIL] $skill is not a working symlink"
  fi
done

for skill in document-writing drawio humanizer officecli; do
  global_link="$HOME/.config/opencode/skills/$skill"
  if [[ -L "$global_link" && -e "$global_link" ]]; then
    echo "[OK] ~/.config/.../$skill → $(readlink "$global_link")"
  fi
done

if [[ -d "$WORKFLOW_DIR/tools" ]]; then
  echo "[OK] tools/ directory exists with $(ls -1 "$WORKFLOW_DIR/tools" | wc -l) entries"
fi

echo
echo "=== Done ==="
echo "Restart OpenCode to pick up changes."
echo "Edit documents in: $KIT_DIR"
echo "Changes propagate to opencode-workflow via symlinks."
echo
echo "Final structure:"
echo "  $KIT_DIR                    ← source of truth (edit here)"
echo "    ↓"
echo "  $WORKFLOW_DIR/skills/personal/documents-kit-skills/{document-writing,drawio,humanizer,officecli} ← package folder"
echo "    ↓"
echo "  $HOME/.config/opencode/skills/{X}                    ← OpenCode global"
echo
echo "  $KIT_DIR/tools/           ← source of truth"
echo "    ↓"
echo "  $WORKFLOW_DIR/tools/      ← glue scripts"
