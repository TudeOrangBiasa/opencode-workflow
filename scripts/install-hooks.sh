#!/usr/bin/env bash
# install-hooks.sh — Install git hooks for opencode-workflow.
# Copies pre-commit.sh to .git/hooks/pre-commit and makes it executable.

set -euo pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
HOOKS_DIR="$ROOT/.git/hooks"

if [[ ! -d "$HOOKS_DIR" ]]; then
  echo "Error: $HOOKS_DIR not found. Is this a git repo?"
  exit 1
fi

# Install pre-commit hook
cp "$SCRIPT_DIR/pre-commit.sh" "$HOOKS_DIR/pre-commit"
chmod +x "$HOOKS_DIR/pre-commit"
echo "[INSTALLED] $HOOKS_DIR/pre-commit"

echo
echo "Done. Hooks active. Skip with 'git commit --no-verify'."
