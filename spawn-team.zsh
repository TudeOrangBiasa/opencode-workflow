#!/bin/zsh
LABEL="${1:-team}"
REPO_DIR="${2:-/home/todayz/Workspace/work/hackathons/PajakinID}"

ALIASES_ENG="OPENCODE_CONFIG_DIR=$HOME/.config/opencode-profiles/engineering opencode"
ALIASES_PLAN="OPENCODE_CONFIG_DIR=$HOME/.config/opencode-profiles/planning opencode"
ALIASES_VAL="OPENCODE_CONFIG_DIR=$HOME/.config/opencode-profiles/validation opencode"

# Ensure herdr server running
if ! herdr ping 2>/dev/null; then
  herdr &>/dev/null &
  sleep 2
fi

# Create workspace and panes
WS_JSON=$(herdr workspace create --label "$LABEL" --no-focus 2>/dev/null)
WS_ID=$(echo "$WS_JSON" | jq -r '.result.workspace.workspace_id')
PANE_ID=$(echo "$WS_JSON" | jq -r '.result.root_pane.pane_id')

herdr pane rename "$PANE_ID" "planning" 2>/dev/null
herdr pane run "$PANE_ID" "cd $REPO_DIR" &>/dev/null &
herdr pane run "$PANE_ID" "$ALIASES_PLAN" &>/dev/null &

sleep 0.5

SPLIT_1=$(herdr pane split "$PANE_ID" --direction right --no-focus 2>/dev/null)
ENG_ID=$(echo "$SPLIT_1" | jq -r '.result.pane.pane_id')
herdr pane rename "$ENG_ID" "engineering" 2>/dev/null
herdr pane run "$ENG_ID" "cd $REPO_DIR" &>/dev/null &
herdr pane run "$ENG_ID" "$ALIASES_ENG" &>/dev/null &

sleep 0.5

SPLIT_2=$(herdr pane split "$ENG_ID" --direction down --no-focus 2>/dev/null)
VAL_ID=$(echo "$SPLIT_2" | jq -r '.result.pane.pane_id')
herdr pane rename "$VAL_ID" "validation" 2>/dev/null
herdr pane run "$VAL_ID" "cd $REPO_DIR" &>/dev/null &
herdr pane run "$VAL_ID" "$ALIASES_VAL" &>/dev/null &

# Open Ghostty with Herdr focused on this workspace
ghostty -e zsh -i -c "source ~/.zshrc; herdr workspace focus $WS_ID && herdr" &>/dev/null &

echo "===== Team '$LABEL' spawned ====="
echo "Workspace: $WS_ID"
echo "Panes: planning | engineering | validation"
echo "Terminal Herdr opening..."
