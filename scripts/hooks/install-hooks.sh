#!/bin/bash
# Installs the Petition Engine git hooks into .git/hooks/
# Idempotent: safe to re-run.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
HOOKS_SRC="$REPO_ROOT/scripts/hooks"
HOOKS_DST="$REPO_ROOT/.git/hooks"

for hook in post-commit; do
  src="$HOOKS_SRC/$hook"
  dst="$HOOKS_DST/$hook"
  if [ ! -f "$src" ]; then
    echo "  skip $hook (source missing: $src)"
    continue
  fi
  cp "$src" "$dst"
  chmod +x "$dst"
  echo "  ✓ installed $hook"
done

echo "✓ Git hooks installed from $HOOKS_SRC → $HOOKS_DST"
echo "  Test: run 'bash scripts/update-state.sh' then commit anything"
