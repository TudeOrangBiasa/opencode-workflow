# dev-workflow — Reference

Supplementary detail for the `dev-workflow` skill. The canonical reference is [`docs/development.md`](../../docs/development.md).

## Backup + Clean Procedure

### Before editing

```bash
cp target-file target-file.bak-YYYY-MM-DD
```

Create `.bak` in the **same directory** as the file being edited. This ensures it shadows `git status` when the file is under a symlinked skill path.

Multiple edits same day: append `-N`.

```bash
cp SKILL.md SKILL.md.bak-2026-06-24
cp SKILL.md SKILL.md.bak-2026-06-24-2   # second edit
```

### After verification

Delete all `.bak` files before `git add`:

```bash
# Repo scope
find . -name "*.bak-*" -type f -delete
# Config scope (not in git, but good hygiene)
find ~/.config/opencode -name "*.bak-*" -type f -delete 2>/dev/null || true
```

### Why

- `.bak` files in `skills/*/` are reachable at `~/.config/opencode/skills/*/` via symlink
- They appear in `git status` as untracked files — noisy, easy to accidentally commit
- Timestamped naming ties backup to the session; suffix format makes glob cleanup simple

### Naming convention

Always **suffix format**: `file.bak-YYYY-MM-DD`.

| Format | Verdict |
|--------|---------|
| `file.bak-2026-06-24` | ✓ correct |
| `file.bak-2026-06-24-2` | ✓ correct (second edit) |
| `file.2026-06-24.bak` | ✗ glob break (`find -name "*.bak-*"` misses it) |
| `file.bak` | ✗ no date — ambiguous, stale |

### Common mistakes

1. **Forgetting to delete `.bak` before commit** — leads to bloated commits with redundant state. Add cleanup to your pre-commit checklist.
2. **Creating `.bak` in `~/.config/opencode/` and forgetting** — not in git, but accumulates in your home dir. Run the `find ~/.config/opencode` cleanup periodically.
3. **Inconsistent naming** — mixing `file.bak-2024-01-01` with `file.2024-01-01.bak` breaks glob-based cleanup. Standardize on suffix format.
4. **Backing up in `/tmp/`** — defeats the purpose. The backup must shadow `git status` in the working tree to prevent accidental commits.

## Cross-references

- Canonical source: [`docs/development.md#backup--clean-procedure`](../../docs/development.md#backup--clean-procedure)
- SKILL.md verify step: [`SKILL.md#4-verify-before-commit`](../SKILL.md#4-verify-before-commit)
- AGENTS.md workflow principles: [`AGENTS.md`](../../AGENTS.md)
