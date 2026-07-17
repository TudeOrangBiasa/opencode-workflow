#!/bin/zsh
set -euo pipefail

# Spawn all team profiles in one Herdr workspace
# Opens a single Ghostty window, user sees all profiles in Herdr panes

source ~/.zshrc

echo "=== Spawning team in 1 Herdr workspace ==="

# Open Ghostty running Herdr
ghostty -e zsh -i -c "
  source ~/.zshrc
  echo '=== OpenCode Team Workspace ==='
  echo ''
  echo 'Split panes, then run:'
  echo '  oc-planning'
  echo '  oc-engineering'
  echo '  oc-validation'
  echo ''

  # Start herdr if not in one
  if [ -z \"\${HERDR_ENV:-}\" ]; then
    herdr
  else
    exec zsh -i
  fi
"
