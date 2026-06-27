#!/usr/bin/env bash
# install-plugins.sh — Wire OpenCode plugins and skills to global config
#
# 1. Create ~/.config/opencode/.opencode/plugins/ (if missing)
# 2. Symlink plugin .ts files from repo to global plugins dir
# 3. Verify design skill symlink exists
# 4. Print status

set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
OPENCODE_DIR="$HOME/.config/opencode"
PLUGIN_DEST="$OPENCODE_DIR/.opencode/plugins"
PLUGIN_SRC="$REPO/.opencode/plugins"

echo "==> OpenCode plugin install"

# 1. Ensure global plugins directory exists
mkdir -p "$PLUGIN_DEST"

# 2. Symlink plugin .ts files (skip .test.ts)
linked=0
for f in "$PLUGIN_SRC"/*.ts; do
  name="$(basename "$f")"
  # Skip test files — they are not plugins
  if [[ "$name" == *.test.ts ]]; then
    echo "  skip $name (test file)"
    continue
  fi
  target="$PLUGIN_DEST/$name"
  ln -sf "$f" "$target"
  echo "  link $name"
  linked=$((linked + 1))
done

echo "  -> $linked plugin(s) linked to $PLUGIN_DEST"

# 3. Verify design skill symlink
DESIGN_LINK="$OPENCODE_DIR/skills/design"
if [ -L "$DESIGN_LINK" ]; then
  resolved="$(readlink -f "$DESIGN_LINK")"
  echo "  design skill: $DESIGN_LINK -> $resolved"
else
  echo "  warning: design skill symlink missing at $DESIGN_LINK"
  echo "  run ./scripts/link-skills.sh first"
fi

# 4. Summary
echo ""
echo "==> Done. Plugins installed at: $PLUGIN_DEST"
ls -la "$PLUGIN_DEST"
echo ""
echo "==> Next: add plugin entries to opencode.json (see .scratch/issues/ready/004-wiring-symlink-config.md)"
echo "    or run ./scripts/install-plugins.sh --with-config to auto-update"
