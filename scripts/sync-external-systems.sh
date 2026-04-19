#!/bin/bash
# Sync external systems into systems-source/ for GitHub backup.
#
# The real sources live outside this repo in 5 physical folders (2_PROEX/PROMPTs,
# AIOS_Petition Engine, 3_OMNI/_SISTEMAS (Petition Engine), 5_Z GLOBAL/Z_PROMPTS,
# 5_Z GLOBAL/_PRODUTO NOVO). This script copies them (read-only snapshot) into
# systems-source/ so they are versioned in git.
#
# Run it AFTER editing any system in the external folders. It never deletes
# anything — only rsync --delete WITHIN each target subfolder.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="$REPO_ROOT/systems-source"

mkdir -p "$TARGET"

# (logical_name, source_absolute_path)
MAP=(
  "2_PROEX_PROMPTs::/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/PROMPTs"
  "AIOS_Petition_Engine::/Users/paulo1844/Documents/AIOS_Petition Engine"
  "3_OMNI_SISTEMAS::/Users/paulo1844/Documents/3_OMNI/_SISTEMAS (Petition Engine)"
  "5_Z_GLOBAL_Z_PROMPTS::/Users/paulo1844/Documents/5_Z GLOBAL/Z_PROMPTS"
  "5_Z_GLOBAL_PRODUTO_NOVO::/Users/paulo1844/Documents/5_Z GLOBAL/_PRODUTO NOVO"
)

echo "Sincronizando 5 pastas externas → systems-source/"
for entry in "${MAP[@]}"; do
  name="${entry%%::*}"
  src="${entry#*::}"
  dst="$TARGET/$name"
  if [ ! -d "$src" ]; then
    echo "  ⚠ SKIP $name — source não existe: $src"
    continue
  fi
  mkdir -p "$dst"
  echo "  → $name"
  rsync -a --delete \
    --exclude '.DS_Store' \
    --exclude 'node_modules/' \
    --exclude '.next/' \
    --exclude '*.pyc' \
    --exclude '__pycache__/' \
    --exclude '.venv/' \
    --max-size=50M \
    "$src/" "$dst/"
done

# Add manifest so the GitHub copy is self-describing
MANIFEST="$TARGET/MANIFEST.md"
{
  echo "# systems-source — GitHub backup dos sistemas externos"
  echo
  echo "Última sincronização: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  echo
  echo "**NÃO edite arquivos aqui.** Este diretório é um snapshot. Edite nas pastas originais:"
  echo
  for entry in "${MAP[@]}"; do
    name="${entry%%::*}"
    src="${entry#*::}"
    echo "- \`$name/\` ← \`$src\`"
  done
  echo
  echo "Para sincronizar: \`bash scripts/sync-external-systems.sh\`"
} > "$MANIFEST"

echo "✓ Sync completo. Revisar com 'git status systems-source/' e commitar."
