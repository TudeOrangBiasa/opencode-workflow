#!/bin/bash
set -euo pipefail

echo "=== Spawning all OpenCode agent profiles via Herdr ==="

# Check if Herdr is running
if ! herdr ping 2>/dev/null; then
  echo "Starting Herdr server..."
  herdr &
  sleep 2
fi

# Spawn each profile session
for profile in orchestrator planning engineering validation; do
  echo "Spawning $profile..."
  herdr new-session --name $profile -- cmd oc-$profile 2>/dev/null || echo "  $profile already running"
done

echo ""
echo "=== All profiles spawned ==="
echo ""
echo "Sessions:"
herdr session list 2>/dev/null || echo "(use 'herdr' to attach)"
echo ""
echo "Switch between profiles:"
echo "  herdr session focus orchestrator"
echo "  herdr session focus planning"
echo "  herdr session focus engineering"
echo "  herdr session focus validation"
