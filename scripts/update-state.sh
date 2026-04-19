#!/bin/bash
# Updates docs/CONTINUITY/STATE.md and STEPLOG.md with current system state.
# Invoked by the post-commit hook; also runnable manually.
#
# Idempotent: regenerates STATE.md from scratch each time; appends to STEPLOG.md.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

STATE="docs/CONTINUITY/STATE.md"
STEPLOG="docs/CONTINUITY/STEPLOG.md"

mkdir -p "$(dirname "$STATE")"

# ═══════════════════════════════════════════════════════════════
# Collect metrics
# ═══════════════════════════════════════════════════════════════

TS=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
CURRENT_SHA=$(git rev-parse HEAD 2>/dev/null || echo 'unknown')
CURRENT_MSG=$(git log -1 --pretty='%s' 2>/dev/null || echo 'unknown')
CURRENT_AUTHOR=$(git log -1 --pretty='%an' 2>/dev/null || echo 'unknown')
TOTAL_COMMITS=$(git rev-list --count HEAD 2>/dev/null || echo 0)
REMOTE_SHA=$(git ls-remote origin main 2>/dev/null | awk '{print $1}' || echo 'unknown')

# Count rules, systems, clients, personas
RULES_COUNT=$(python3 -c "import json; print(len(json.load(open('data/error_rules.json'))))" 2>/dev/null || echo 0)
SYSTEMS_COUNT=$(python3 -c "import json; print(len(json.load(open('data/systems.json'))))" 2>/dev/null || echo 0)
CLIENTS_COUNT=$(python3 -c "import json; print(len(json.load(open('data/clients.json'))))" 2>/dev/null || echo 0)
PERSONAS_COUNT=$(python3 -c "import json; d=json.load(open('data/persona_bank.json')); print(len(d.get('personas',[])))" 2>/dev/null || echo 0)
MASTER_FACTS_COUNT=$(ls data/master_facts/*.json 2>/dev/null | wc -l | tr -d ' ')
HARD_BLOCKS_COUNT=$(ls data/hard_blocks/*.json 2>/dev/null | wc -l | tr -d ' ')

# Agents count
AGENTS_COUNT=$(ls src/agents/*.ts 2>/dev/null | wc -l | tr -d ' ')

# Test status (quick snapshot — don't actually run, just count)
TEST_FILES=$(find src/__tests__ -name '*.test.ts' 2>/dev/null | wc -l | tr -d ' ')

# Daemon status
if launchctl list 2>/dev/null | grep -q com.paulo.petitionengine.dev; then
  DAEMON='✅ running'
else
  DAEMON='❌ not loaded'
fi

# Port 3000 listening?
if lsof -i :3000 2>/dev/null | grep -q LISTEN; then
  PORT='✅ serving'
else
  PORT='❌ down'
fi

# Last handoff
LAST_HANDOFF=$(ls -t docs/handoff/SESSAO_*.md 2>/dev/null | head -1 || echo 'none')
LAST_HANDOFF_NAME=$(basename "$LAST_HANDOFF" 2>/dev/null || echo 'none')

# Sync divergence
if [ "$CURRENT_SHA" = "$REMOTE_SHA" ]; then
  SYNC='✅ local = remote'
else
  SYNC="⚠️ local ($CURRENT_SHA) vs remote ($REMOTE_SHA)"
fi

# ═══════════════════════════════════════════════════════════════
# Write STATE.md
# ═══════════════════════════════════════════════════════════════

cat > "$STATE" <<EOF
# STATE.md — Estado atual do Petition Engine

**Auto-atualizado por \`scripts/update-state.sh\`.** Última atualização: $TS

> Esta página é regenerada a cada commit (via git hook post-commit). Para ver cronologia, consultar \`STEPLOG.md\`. Para o mapa completo do que existe, \`INVENTORY.md\`.

## Estado do repo

| Métrica | Valor |
|---------|-------|
| Último commit | \`$CURRENT_SHA\` — $CURRENT_MSG |
| Autor | $CURRENT_AUTHOR |
| Total de commits | $TOTAL_COMMITS |
| Sincronização | $SYNC |
| Último handoff | $LAST_HANDOFF_NAME |

## Saúde operacional

| Métrica | Valor |
|---------|-------|
| Daemon \`com.paulo.petitionengine.dev\` | $DAEMON |
| Port 3000 | $PORT |

## Números do sistema

| Métrica | Valor |
|---------|-------|
| error_rules.json | $RULES_COUNT regras |
| systems.json | $SYSTEMS_COUNT entries |
| clients.json | $CLIENTS_COUNT clientes cadastrados |
| persona_bank.json | $PERSONAS_COUNT personas |
| master_facts/ | $MASTER_FACTS_COUNT casos |
| hard_blocks/ | $HARD_BLOCKS_COUNT configs (default + por caso) |
| Agentes | $AGENTS_COUNT em src/agents/ |
| Test files | $TEST_FILES |

## Em andamento (última mão)

Ver \`STEPLOG.md\` seção "Pendências ativas" e o handoff mais recente em \`docs/handoff/$LAST_HANDOFF_NAME\`.

## Flags vermelhas conhecidas

(auto-detecção simples — revisar manualmente se algo aparecer)

EOF

# Check for red flags
if [ "$DAEMON" != '✅ running' ]; then
  echo "- ⚠️ Daemon não está rodando. \`bash scripts/launchagent/install.sh\` para reinstalar." >> "$STATE"
fi
if [ "$PORT" != '✅ serving' ]; then
  echo "- ⚠️ Port 3000 não responde. Verificar \`tail ~/Library/Logs/petition-engine-dev.err.log\`." >> "$STATE"
fi
if [ "$CURRENT_SHA" != "$REMOTE_SHA" ]; then
  echo "- ⚠️ Repo local divergiu do remote. Rodar \`git fetch && git status\` pra entender." >> "$STATE"
fi
if [ "$PERSONAS_COUNT" -lt 5 ]; then
  echo "- ⚠️ persona_bank tem menos de 5 personas. Testimony letters precisa de ≥5 por caso." >> "$STATE"
fi

# Add the "quick pointers" section
cat >> "$STATE" <<'EOF'

## Pointers rápidos (quando precisar encontrar algo)

- **Regras ativas:** `data/error_rules.json` (via `readActiveRules` em `src/lib/rules/repository.ts`)
- **Pipeline testimony letters:** `src/lib/pipelines/testimony-letters.ts`
- **Pipeline Cover EB-1A:** `src/lib/pipelines/cover-letter-eb1a.ts`
- **Quality gate local:** `src/agents/quality-local.ts`
- **USCIS reviewer:** `src/agents/uscis-reviewer.ts`
- **AutoDebugger (fecha loop):** `src/agents/auto-debugger-local.ts`
- **Hard-blocks por caso:** `src/lib/rules/hard-blocks.ts` + `data/hard_blocks/{case_id}.json`
- **Master facts por caso:** `src/lib/rules/master-facts.ts` + `data/master_facts/{case_id}.json`
- **Personas por caso:** `src/lib/rules/persona-bank.ts` + `data/persona_bank.json`
- **Anti-ATLAS:** `src/lib/validators/anti-atlas.ts`
- **Route principal da geração:** `src/app/api/generate/execute/route.ts`
- **LaunchAgent plist:** `scripts/launchagent/com.paulo.petitionengine.dev.plist`
EOF

# ═══════════════════════════════════════════════════════════════
# Append to STEPLOG.md (if this was triggered by a real commit)
# ═══════════════════════════════════════════════════════════════

if [ ! -f "$STEPLOG" ]; then
  cat > "$STEPLOG" <<'EOF'
# STEPLOG.md — Cronologia de passos do Petition Engine

Cada entrada é um commit (auto-append pelo post-commit hook) ou uma anotação manual de sessão. Ordem cronológica **inversa** — mais recente no topo.

## Como usar

Para saber onde estamos: ler as últimas 10-15 entradas. Cada entrada tem o `sha`, a mensagem, e a data.

Pendências ativas e próximos passos: seção no fundo, atualizada manualmente pelo handoff mais recente.

---

EOF
fi

# Only append if we have a real commit and it's not already logged
if [ "$CURRENT_SHA" != 'unknown' ] && ! grep -q "\`$CURRENT_SHA\`" "$STEPLOG" 2>/dev/null; then
  # Prepend (newest first) — we build a new file
  {
    head -8 "$STEPLOG"  # keep preamble
    echo ""
    echo "### $TS — \`$CURRENT_SHA\`"
    echo ""
    echo "$CURRENT_MSG"
    echo ""
    echo "- Rules: $RULES_COUNT · Systems: $SYSTEMS_COUNT · Clients: $CLIENTS_COUNT · Personas: $PERSONAS_COUNT"
    echo "- Daemon: $DAEMON · Port 3000: $PORT"
    echo ""
    tail -n +9 "$STEPLOG"  # keep the rest
  } > "$STEPLOG.new"
  mv "$STEPLOG.new" "$STEPLOG"
fi

echo "✓ STATE.md e STEPLOG.md atualizados ($TS)"
