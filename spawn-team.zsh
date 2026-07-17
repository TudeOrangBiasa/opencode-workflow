#!/bin/zsh
set -euo pipefail

# Spawn all team profiles in one Herdr workspace
# Don't source .zshrc here (oh-my-zsh issues), define alias path directly

ALIASES_ENG="OPENCODE_CONFIG_DIR=$HOME/.config/opencode-profiles/engineering opencode"
ALIASES_PLAN="OPENCODE_CONFIG_DIR=$HOME/.config/opencode-profiles/planning opencode"
ALIASES_VAL="OPENCODE_CONFIG_DIR=$HOME/.config/opencode-profiles/validation opencode"

echo "=== Spawning team in 1 Herdr workspace ==="

# Ensure Herdr is running
herdr ping 2>/dev/null || { herdr &>/dev/null &; sleep 2; }

# Create team workspace
WS_JSON=$(herdr workspace create --label team --no-focus 2>/dev/null)
WS_ID=$(echo "$WS_JSON" | jq -r '.result.workspace.workspace_id')
PANE_ID=$(echo "$WS_JSON" | jq -r '.result.root_pane.pane_id')

echo "Workspace: $WS_ID  Pane: $PANE_ID"

# Pane 1: Planning
herdr pane rename "$PANE_ID" "planning" 2>/dev/null
herdr pane run "$PANE_ID" "$ALIASES_PLAN" 2>/dev/null &

sleep 0.5

# Pane 2: Engineering (split right)
SPLIT_1=$(herdr pane split "$PANE_ID" --direction right --no-focus 2>/dev/null)
ENG_ID=$(echo "$SPLIT_1" | jq -r '.result.pane.pane_id')
herdr pane rename "$ENG_ID" "engineering" 2>/dev/null
herdr pane run "$ENG_ID" "$ALIASES_ENG" 2>/dev/null &

sleep 0.5

# Pane 3: Validation (split down from engineering)
SPLIT_2=$(herdr pane split "$ENG_ID" --direction down --no-focus 2>/dev/null)
VAL_ID=$(echo "$SPLIT_2" | jq -r '.result.pane.pane_id')
herdr pane rename "$VAL_ID" "validation" 2>/dev/null
herdr pane run "$VAL_ID" "$ALIASES_VAL" 2>/dev/null &

# Open Ghostty
ghostty -e zsh -i -c "source ~/.zshrc; herdr" &

echo ""
echo "Team spawned in workspace '$WS_ID'."
echo "Ghostty window opened. Profiles:"
echo "  planning | engineering | validation"
echo "Switch: herdr workspace focus $WS_ID"
