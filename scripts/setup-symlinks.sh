#!/bin/bash
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SYSTEMS_DIR="$PROJECT_ROOT/systems"
BASE="/Users/paulo1844/Documents"

echo "Configurando symlinks em $SYSTEMS_DIR..."

rm -rf "$SYSTEMS_DIR"
mkdir -p "$SYSTEMS_DIR"

link_system() {
  local name="$1"
  local target="$2"
  if [ -d "$target" ]; then
    ln -s "$target" "$SYSTEMS_DIR/$name"
    echo "  OK $name"
  else
    echo "  FALTANDO $name -> $target"
  fi
}

link_system "cover-letter-eb1a" "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5"
link_system "cover-letter-eb2-niw" "$BASE/AIOS/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions"
link_system "resume-eb1a" "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema résumé auto/EB1A_RESUME_SYSTEM"
link_system "business-plan" "$BASE/OMNI/_IMIGRAÇÃO/BP Orquestrador/SETUP_GUIDE_2"
link_system "metodologia" "$BASE/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Metodologia (PROMPTS)"
link_system "declaracao-intencoes" "$BASE/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Declaração de Intenções (PROMPTS)"
link_system "impacto" "$BASE/_Z GLOBAL/_PRODUTO NOVO/agents"
link_system "estrategia-eb2" "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-2 - ESTRATÉGIAS"
link_system "estrategia-eb1" "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-1 - ESTRATÉGIA EB-1 (PROMPTS)/_ASSISTENTE FINAL (ESTE)"
link_system "localizacao" "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/LOCALIZAÇÃO - PROMPT"
link_system "quality-notes" "$BASE/Aqui OBSIDIAN/PROEX/Pareceres da Qualidade"
link_system "satellite-letters" "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/_2. MEUS CASOS"
link_system "resume-eb2-niw" "$BASE/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema résumé auto/EB2_NIW_RESUME_SYSTEM"

echo ""
echo "Setup concluído!"
ls -la "$SYSTEMS_DIR"
