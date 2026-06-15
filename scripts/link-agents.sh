#!/usr/bin/env bash
set -euo pipefail

# Links repository agents into OpenCode's global agent directory.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$HOME/.config/opencode/agents"

# If the destination is a symlink that resolves into this repo, linking would
# write agent symlinks back into the working copy. Bail out instead.
if [ -L "$DEST" ]; then
  resolved="$(readlink -f "$DEST")"
  case "$resolved" in
    "$REPO"|"$REPO"/*)
      echo "error: $DEST is a symlink into this repo ($resolved)." >&2
      echo "Remove it (rm \"$DEST\") and re-run; the script will recreate it as a real dir." >&2
      exit 1
      ;;
  esac
fi

mkdir -p "$DEST"

for src in "$REPO"/agents/*.md; do
  name="$(basename "$src")"
  target="$DEST/$name"

  if [ -e "$target" ] && [ ! -L "$target" ]; then
    echo "error: $target exists and is not a symlink" >&2
    exit 1
  fi

  ln -sfn "$src" "$target"
  echo "linked $name -> $src"
done
