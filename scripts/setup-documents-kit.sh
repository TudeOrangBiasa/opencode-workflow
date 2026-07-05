#!/usr/bin/env bash
# setup-documents-kit.sh — Symlink documents-kit-skills into opencode-workflow.
# Run once after cloning both repos.
#
# Creates:
#   skills/personal/documents-kit-skills/<skill>  → documents-kit-skills/skills/<skill>  (10 skills)
#   ~/.config/opencode/skills/<skill>              → package folder (10 skills)
#   tools/<tool>                                   → documents-kit-skills/tools/<tool>    (14 + tests/)
#   documents-kit/{templates,presets,diagrams,examples}/  → source (when SETUP_ASSETS=1)
#
# Env flags:
#   DOCUMENTS_KIT_DIR   — path to source repo (default: ~/Workspace/.../documents-kit-skills)
#   SETUP_TOOLS         — set to false to skip tools/  (default: true)
#   SETUP_ASSETS        — set to false to skip documents-kit/ assets (default: true)

set -euo pipefail

WORKFLOW_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
KIT_DIR="${DOCUMENTS_KIT_DIR:-/home/todayz/Workspace/personal/dev/ai-kit/documents-kit-skills}"

echo "=== Setup documents-kit-skills ==="
echo "Workflow: $WORKFLOW_DIR"
echo "Kit:      $KIT_DIR"
echo

if [[ ! -d "$KIT_DIR" ]]; then
  echo "Error: documents-kit-skills not found at $KIT_DIR"
  echo "Clone it first: git clone <repo-url> $KIT_DIR"
  exit 1
fi

ALL_SKILLS=(document-format document-writing documents-kit drawio humanizer officecli pdf-export report-to-deck scaffold-doc storytelling)

ALL_TOOLS=(__init__.py asset-validator.sh doc-audit-pipeline.sh documents_kit.py export_pdf.py fetch_drawio_template.py new_document.py officecli_helper.py officecli_numbering.py pandoc_citeproc.py pdf-from-docx.sh report_to_deck.py scholar_bibtex.py storytelling_pptx.py tests)

# ---- Skills package ----
PACKAGE_DIR="$WORKFLOW_DIR/skills/personal/documents-kit-skills"
mkdir -p "$PACKAGE_DIR"

echo "=== Package: skills/personal/documents-kit-skills/ ==="
for skill in "${ALL_SKILLS[@]}"; do
  target="$PACKAGE_DIR/$skill"
  if [[ -L "$target" && ! -e "$target" ]]; then
    echo "  Remove broken: $skill"
    rm "$target"
  fi
  if [[ ! -L "$target" ]]; then
    echo "  $skill → $KIT_DIR/skills/$skill"
    ln -s "$KIT_DIR/skills/$skill" "$target"
  else
    echo "  [ok] $skill"
  fi
done

# ---- Global config symlinks ----
echo
echo "=== ~/.config/opencode/skills/ ==="
for skill in "${ALL_SKILLS[@]}"; do
  global_link="$HOME/.config/opencode/skills/$skill"
  if [[ -L "$global_link" && ! -e "$global_link" ]]; then
    echo "  Remove broken: $skill"
    rm "$global_link"
  fi
  if [[ -d "$global_link" && ! -L "$global_link" ]]; then
    echo "  [skip real dir] $skill"
    continue
  fi
  if [[ ! -e "$global_link" ]]; then
    echo "  $skill → $PACKAGE_DIR/$skill"
    ln -s "$PACKAGE_DIR/$skill" "$global_link"
  else
    echo "  [ok] $skill"
  fi
done

# ---- Tools ----
if [[ "${SETUP_TOOLS:-true}" == "true" ]]; then
  echo
  echo "=== tools/ ==="
  TOOLS_DIR="$WORKFLOW_DIR/tools"
  mkdir -p "$TOOLS_DIR"
  for tool in "${ALL_TOOLS[@]}"; do
    target="$TOOLS_DIR/$tool"
    if [[ -L "$target" && ! -e "$target" ]]; then
      echo "  Remove broken: $tool"
      rm "$target"
    fi
    if [[ ! -e "$target" ]]; then
      echo "  $tool → $KIT_DIR/tools/$tool"
      ln -s "$KIT_DIR/tools/$tool" "$target"
    else
      echo "  [ok] $tool"
    fi
  done
fi

# ---- Assets (templates, presets, diagrams, examples) ----
if [[ "${SETUP_ASSETS:-true}" == "true" ]]; then
  echo
  echo "=== documents-kit/ assets ==="
  ASSETS_DIR="$WORKFLOW_DIR/documents-kit"

  # Templates
  mkdir -p "$ASSETS_DIR/templates"
  for tdir in paper presentation report thesis; do
    target="$ASSETS_DIR/templates/$tdir"
    if [[ -L "$target" && ! -e "$target" ]]; then rm "$target"; fi
    if [[ ! -e "$target" ]]; then
      echo "  templates/$tdir → $KIT_DIR/templates/$tdir"
      ln -s "$KIT_DIR/templates/$tdir" "$target"
    fi
  done

  # Presets
  mkdir -p "$ASSETS_DIR/presets"
  for preset in hackathon-energetic.json material-light.json storytelling_fallback.json; do
    target="$ASSETS_DIR/presets/$preset"
    if [[ -L "$target" && ! -e "$target" ]]; then rm "$target"; fi
    if [[ ! -e "$target" ]]; then
      echo "  presets/$preset → $KIT_DIR/presets/$preset"
      ln -s "$KIT_DIR/presets/$preset" "$target"
    fi
  done
  # presets/drawio-styles/
  target="$ASSETS_DIR/presets/drawio-styles"
  if [[ -L "$target" && ! -e "$target" ]]; then rm "$target"; fi
  if [[ ! -e "$target" ]]; then
    echo "  presets/drawio-styles → $KIT_DIR/presets/drawio-styles"
    ln -s "$KIT_DIR/presets/drawio-styles" "$target"
  fi

  # Diagrams
  mkdir -p "$ASSETS_DIR/diagrams"
  for dfile in "$KIT_DIR"/diagrams/*; do
    fname=$(basename "$dfile")
    target="$ASSETS_DIR/diagrams/$fname"
    if [[ -L "$target" && ! -e "$target" ]]; then rm "$target"; fi
    if [[ ! -e "$target" ]]; then
      echo "  diagrams/$fname → $dfile"
      ln -s "$dfile" "$target"
    fi
  done

  # Examples
  mkdir -p "$ASSETS_DIR/examples"
  for efile in "$KIT_DIR"/examples/*; do
    fname=$(basename "$efile")
    target="$ASSETS_DIR/examples/$fname"
    if [[ -L "$target" && ! -e "$target" ]]; then rm "$target"; fi
    if [[ ! -e "$target" ]]; then
      echo "  examples/$fname → $efile"
      ln -s "$efile" "$target"
    fi
  done
fi

# ---- Verify ----
echo
echo "=== Verify ==="
errors=0

for skill in "${ALL_SKILLS[@]}"; do
  target="$PACKAGE_DIR/$skill"
  if [[ -L "$target" && -e "$target" ]]; then
    echo "[OK] package/$skill → $(readlink "$target")"
  else
    echo "[FAIL] package/$skill"
    errors=$((errors + 1))
  fi
done

for skill in "${ALL_SKILLS[@]}"; do
  global_link="$HOME/.config/opencode/skills/$skill"
  if [[ -L "$global_link" && -e "$global_link" ]]; then
    echo "[OK] global/$skill → $(readlink "$global_link")"
  else
    echo "[FAIL] global/$skill"
    errors=$((errors + 1))
  fi
done

if [[ -d "$WORKFLOW_DIR/tools" ]]; then
  count=$(ls -1 "$WORKFLOW_DIR/tools" | wc -l)
  echo "[OK] tools/ ($count entries)"
fi

if [[ -d "$ASSETS_DIR" ]]; then
  for sub in templates presets diagrams examples; do
    count=$(ls -1 "$ASSETS_DIR/$sub" 2>/dev/null | wc -l)
    echo "[OK] documents-kit/$sub/ ($count entries)"
  done
fi

# Check for broken symlinks
broken=$(find "$HOME/.config/opencode/skills" -maxdepth 1 -type l ! -exec test -e {} \; -print 2>/dev/null)
if [[ -n "$broken" ]]; then
  echo "[WARN] Broken global symlinks:"
  echo "$broken"
fi

echo
if [[ $errors -eq 0 ]]; then
  echo "=== Done (0 errors) ==="
else
  echo "=== Done ($errors errors) ==="
  exit 1
fi

echo "Restart OpenCode to pick up changes."
echo "Edit documents in: $KIT_DIR"
