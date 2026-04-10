#!/bin/bash
# ============================================================================
# ORQUESTRADOR COVER LETTER EB-2 NIW — Pipeline Multi-Fase (12 fases)
# Uso: ./run_cover_letter_eb2_niw.sh "Nome do Cliente" "/path/to/client/docs" "/path/to/output"
# ============================================================================

set -e

CLIENT_NAME="$1"
CLIENT_DOCS="$2"
OUTPUT_DIR="$3"

if [ -z "$CLIENT_NAME" ] || [ -z "$CLIENT_DOCS" ] || [ -z "$OUTPUT_DIR" ]; then
  echo "Uso: $0 'Nome do Cliente' '/path/to/docs' '/path/to/output'"
  exit 1
fi

CLAUDE="/Users/paulo1844/.npm-global/bin/claude"
PHASES_DIR="${OUTPUT_DIR}/phases"
SYSTEM_PATH="/Users/paulo1844/Documents/AIOS_Petition Engine/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions"
RAGS_PATH="/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/EB-2 NIW - RAGs"
THUMBNAILS_SCRIPT="/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema résumé auto/insert_thumbnails.py"
SLUG=$(echo "$CLIENT_NAME" | tr ' ' '_')

mkdir -p "$PHASES_DIR"

TRANSVERSAL="
REGRAS TRANSVERSAIS (OBRIGATÓRIAS EM TODAS AS FASES):
- Idioma: 100% INGLÊS (en-US). Termos em português apenas entre parênteses.
- Font: Garamond em TODO o documento. 20pt nome, 14pt títulos, 12pt corpo, 10pt notas. NUNCA Arial/Calibri.
- Cores: Navy #2D3E50 headers, Teal #3498A2 sub-headers, Green #D6E1DB metadata blocks.
- Margens: top 0.7in, bottom 0.6in, left 0.8in, right 0.6in.
- Evidence blocks: Tabela 2 colunas — metadata ESQUERDA, [THUMBNAIL — Exhibit X] DIREITA.
  NAO tente gerar imagem. SEMPRE coloque o placeholder exato: [THUMBNAIL — Exhibit X].
  CADA evidence block DEVE ter um placeholder na célula da direita.
- Footnotes: MÍNIMO 3 por seção com fonte verificável (BLS, Census, SBA, etc.).
  Formato: número sobrescrito no texto -> bloco separado no final da seção.
- NUNCA usar extraordinary ability (termo EB-1A).
- NUNCA citar Kazarian (framework EB-1A; usar Dhanasar).
- NUNCA dizer top of the field (EB-1A; NIW = well positioned).
- NUNCA prometer resultados específicos (I WILL -> projected/estimated).
- NUNCA omitir PERM no Prong 3.
- ANTI-CRISTINE: NUNCA usar standardized, self-sustaining, plug-and-play, replicable by any, turnkey, scalable without the founder, padronizado, auto-sustentável, chave-na-mão.
- NUNCA expor infraestrutura (RAGs, Petition Engine, Obsidian, Claude, formato .md).
- NUNCA usar terminologia jurídica (advogado, tribunal, tradução juramentada).
- NUNCA mencionar PROEX, Kortix, nomes de outros clientes.
- Dados de mercado COM FONTE em toda afirmação.
- Parágrafos máximo 1200 caracteres. Se maior, dividir.
- Page break antes de cada seção principal.
"

echo "============================================================================"
echo "ORQUESTRADOR COVER LETTER EB-2 NIW"
echo "Cliente: $CLIENT_NAME"
echo "Docs: $CLIENT_DOCS"
echo "Output: $OUTPUT_DIR"
echo "============================================================================"

# ═══ HELPER: SKIP SE JÁ EXISTE ═══
skip_if_exists() {
  local file="$1"
  local fase="$2"
  if [ -f "$file" ] && [ "$(stat -f%z "$file" 2>/dev/null || echo 0)" -gt 1000 ]; then
    echo "[SKIP] ${fase} — já existe: $(basename $file) ($(du -h "$file" | cut -f1))"
    return 0
  fi
  return 1
}

# ═══ FASE 0: INVENTÁRIO ═══
if skip_if_exists "${PHASES_DIR}/_inventory.json" "FASE 0"; then true; else
echo ""
echo "[FASE 0/12] INVENTÁRIO — Mapeando evidências para 3 Prongs..."
$CLAUDE -p "
Leia TODOS os arquivos do sistema EB-2 NIW em: ${SYSTEM_PATH}/
Leia TODOS os documentos do cliente em: ${CLIENT_DOCS}/

TAREFA: Criar inventário de evidências para Cover Letter EB-2 NIW do cliente ${CLIENT_NAME}.

Mapear CADA evidência encontrada para:
- ELEGIBILIDADE: Advanced Degree ou Exceptional Ability (6 fatores)
- PRONG 1: Mérito substancial + importância nacional
- PRONG 2: Qualificações, experiência, track record
- PRONG 3: Dados de impacto econômico, PERM impraticável
- CROSS: evidências que servem múltiplos prongs

Identificar:
- Proposed Endeavor (do Anteprojeto/Projeto-Base se existir na pasta)
- O*NET/SOC code recomendado
- Geografia do endeavor
- Business Plan (se existir)
- Cartas de recomendação disponíveis

Salve como JSON: ${PHASES_DIR}/_inventory.json
" --allowedTools Bash,Read,Write,Edit,Glob,Grep

echo "[FASE 0] Inventário concluído."
fi

# ═══ FASE 1: INTRODUÇÃO + ELEGIBILIDADE ═══
if skip_if_exists "${PHASES_DIR}/CL_NIW_PART1_Intro.docx" "FASE 1"; then true; else
echo ""
echo "[FASE 1/12] INTRODUÇÃO + ELEGIBILIDADE EB-2..."
$CLAUDE -p "
Leia: ${SYSTEM_PATH}/ (TODOS os arquivos do sistema V3)
Leia: ${PHASES_DIR}/_inventory.json
Leia: ${RAGS_PATH}/ (TODOS os RAGs EB-2 NIW)
Leia evidências do cliente: ${CLIENT_DOCS}/

${TRANSVERSAL}

TAREFA: Gerar PARTE 1 da Cover Letter EB-2 NIW — Introdução + Elegibilidade.

CONTEÚDO OBRIGATÓRIO:

1. CAPA (formato carta formal):
   - Data atual, USCIS Immigration Officer
   - Bloco metadata verde #D6E1DB com: I-140, Petitioner/Beneficiary, Classification EB-2 NIW
   - Re: Petition for Immigrant Worker — Form I-140

2. TABLE OF CONTENTS (índice completo de todas as seções que virão)

3. INTRODUÇÃO (2-3 parágrafos densos):
   - Nome completo, campo de atuação, O*NET code
   - Proposed endeavor em 1 frase
   - Framework: Matter of Dhanasar, 26 I&N Dec. 884 (AAO 2016)
   - Estrutura da petição (o que será apresentado em cada prong)

4. ELEGIBILIDADE EB-2 (seção completa):
   - Pathway: Advanced Degree OU Exceptional Ability
   - Se Advanced Degree: GEO evaluation, credenciais, WES/ECE
   - Se Exceptional Ability: demonstrar 3+ dos 6 fatores (8 C.F.R. § 204.5(k)(3)(ii))
   - Evidence blocks com [THUMBNAIL — Exhibit X] para CADA documento acadêmico

5. TRANSIÇÃO para Prong 1

Palavras alvo: 5.000-7.000 (MÍNIMO 4.000)
MÍNIMO 3 footnotes com fontes verificáveis.
Salve: ${PHASES_DIR}/CL_NIW_PART1_Intro.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch

echo "[FASE 1] Introdução concluída."
fi

# ═══ FASE 2A: PRONG 1 PARTE A ═══
if skip_if_exists "${PHASES_DIR}/CL_NIW_PRONG1_A.docx" "FASE 2A"; then true; else
echo ""
echo "[FASE 2A/12] PRONG 1 PARTE A — Endeavor + Deep Research..."
$CLAUDE -p "
Leia: ${SYSTEM_PATH}/ (sistema V3)
Leia: ${PHASES_DIR}/_inventory.json
Leia: ${PHASES_DIR}/CL_NIW_PART1_Intro.docx (continuidade)
Leia: ${RAGS_PATH}/ (RAGs EB-2 NIW)
Leia evidências do cliente: ${CLIENT_DOCS}/

PESQUISE NA WEB antes de escrever:
- Dados BLS/Census para o setor do endeavor
- TAM/SAM/SOM do mercado-alvo
- Políticas federais relevantes (Executive Orders, Acts)
- Dados de emprego/crescimento (BLS Occupational Outlook)

${TRANSVERSAL}

TAREFA: Gerar PRONG 1 PARTE A — Substantial Merit & National Importance.

CONTEÚDO OBRIGATÓRIO:

1. DEFINIÇÃO DO PROPOSED ENDEAVOR:
   - Descrição técnica DETALHADA (NÃO genérica — o que FAZ, como FAZ, pra quem)
   - Campo de atuação + O*NET code com dados BLS
   - Geografia (cidade, estado, alcance nacional)
   - Público-alvo + vazio competitivo documentado

2. DEEP RESEARCH — DADOS DE MERCADO:
   - TAM, SAM, SOM com fontes primárias (BLS, Census, IBISWorld, Statista)
   - Dados de emprego e crescimento do setor
   - Gap documentado que o endeavor resolve
   - MÍNIMO 10 fontes primárias com URLs/datas
   - Tabelas e quadros com dados formatados

3. Evidence blocks com [THUMBNAIL — Exhibit X] para cada evidência citada

Palavras alvo: 8.000-12.000 (MÍNIMO 7.000)
MÍNIMO 5 footnotes.
Salve: ${PHASES_DIR}/CL_NIW_PRONG1_A.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch

echo "[FASE 2A] Prong 1 Parte A concluída."
fi

# ═══ FASE 2B: PRONG 1 PARTE B ═══
if skip_if_exists "${PHASES_DIR}/CL_NIW_PRONG1_B.docx" "FASE 2B"; then true; else
echo ""
echo "[FASE 2B/12] PRONG 1 PARTE B — Políticas Federais + Nexo Causal..."
$CLAUDE -p "
Leia: ${PHASES_DIR}/_inventory.json
Leia: ${PHASES_DIR}/CL_NIW_PRONG1_A.docx (continuidade — NÃO repetir conteúdo)
Leia: ${RAGS_PATH}/
Leia evidências: ${CLIENT_DOCS}/

PESQUISE NA WEB:
- Executive Orders de 2025-2026 relevantes ao setor
- Programas federais (SBA, DOL, DOC)
- Legislação recente (CHIPS Act, IRA, IIJA, etc.)

${TRANSVERSAL}

TAREFA: Gerar PRONG 1 PARTE B — Políticas Federais + Nexo Causal.

CONTEÚDO OBRIGATÓRIO:

1. POLÍTICAS FEDERAIS ALINHADAS (MÍNIMO 3):
   - Para CADA política: nome, data, o que estabelece
   - Cadeia: Expertise do beneficiário → Endeavor → Política → Interesse Nacional
   - NÃO genérico — mostrar como ESTE beneficiário contribui pra ESTA política

2. NEXO CAUSAL (seção mais importante do Prong 1):
   - Por que o endeavor tem MÉRITO SUBSTANCIAL (qualidade intrínseca)
   - Por que tem IMPORTÂNCIA NACIONAL (escopo além do local/regional)
   - Impacto projetado: empregos, receita, impostos, multiplicador econômico
   - Citações de Dhanasar sobre merit e national importance

3. Evidence blocks restantes do Prong 1

Palavras alvo: 6.000-8.000 (MÍNIMO 5.000)
MÍNIMO 3 footnotes.
Salve: ${PHASES_DIR}/CL_NIW_PRONG1_B.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch

echo "[FASE 2B] Prong 1 Parte B concluída."
fi

# ═══ FASE 3A: PRONG 2 PARTE A ═══
if skip_if_exists "${PHASES_DIR}/CL_NIW_PRONG2_A.docx" "FASE 3A"; then true; else
echo ""
echo "[FASE 3A/12] PRONG 2 PARTE A — Educação + Experiência..."
$CLAUDE -p "
Leia: ${PHASES_DIR}/_inventory.json
Leia: ${PHASES_DIR}/CL_NIW_PRONG1_A.docx e CL_NIW_PRONG1_B.docx (continuidade)
Leia evidências: ${CLIENT_DOCS}/

${TRANSVERSAL}

TAREFA: Gerar PRONG 2 PARTE A — Well Positioned to Advance (Educação + Experiência).

CONTEÚDO OBRIGATÓRIO:

1. EDUCAÇÃO + CREDENCIAIS:
   - Graus acadêmicos com instituição, ano, campo
   - Certificações profissionais
   - Treinamentos especializados
   - Evidence blocks com [THUMBNAIL — Exhibit X]

2. EXPERIÊNCIA PROFISSIONAL DETALHADA:
   - Para CADA posição: cargo, empresa, datas, MÉTRICAS de impacto
   - Quantificar: receita gerada/gerida, projetos liderados, equipes, clientes
   - NÃO genérico — números REAIS das evidências do cliente
   - Progressão de carreira (como cada posição preparou pro endeavor)
   - Evidence blocks com thumbnails

3. CONTRIBUIÇÕES TÉCNICAS:
   - Projetos específicos com resultados mensuráveis
   - Inovações ou metodologias desenvolvidas
   - Impacto documentado em cada organização

Palavras alvo: 8.000-12.000 (MÍNIMO 7.000)
MÍNIMO 5 footnotes.
Salve: ${PHASES_DIR}/CL_NIW_PRONG2_A.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep

echo "[FASE 3A] Prong 2 Parte A concluída."
fi

# ═══ FASE 3B: PRONG 2 PARTE B ═══
if skip_if_exists "${PHASES_DIR}/CL_NIW_PRONG2_B.docx" "FASE 3B"; then true; else
echo ""
echo "[FASE 3B/12] PRONG 2 PARTE B — Publicações + Cartas + Plano..."
$CLAUDE -p "
Leia: ${PHASES_DIR}/_inventory.json
Leia: ${PHASES_DIR}/CL_NIW_PRONG2_A.docx (continuidade — NÃO repetir)
Leia evidências: ${CLIENT_DOCS}/

${TRANSVERSAL}

TAREFA: Gerar PRONG 2 PARTE B — Publicações, Cartas de Recomendação, Plano de Execução.

CONTEÚDO OBRIGATÓRIO:

1. PUBLICAÇÕES E CONTRIBUIÇÕES ACADÊMICAS:
   - Artigos, livros, capítulos, palestras
   - Para CADA: título, veículo, data, métricas de impacto
   - Evidence blocks com thumbnails

2. CARTAS DE RECOMENDAÇÃO (seção CRÍTICA):
   - Para CADA carta disponível na pasta do cliente:
     a) Quem é o autor (nome, cargo, credenciais — verificar no CV/LinkedIn SE disponível)
     b) Relação com o beneficiário (como conhece)
     c) O que o autor diz especificamente (citar trechos da carta)
     d) Por que a opinião deste autor importa (expertise relevante)
   - Tom FUTURO: o beneficiário ESTÁ POSICIONADO para...
   - Evidence blocks com [THUMBNAIL — Exhibit X] para CADA carta

3. METODOLOGIA PROPRIETÁRIA (se aplicável):
   - O que é ÚNICO no approach do beneficiário
   - ANTI-CRISTINE: metodologia DEPENDE do beneficiário, NÃO é transferível

4. PLANO DE EXECUÇÃO (1-3-5 anos):
   - Como o beneficiário vai implementar o endeavor
   - Milestones mensuráveis com timeline
   - Recursos necessários (equipe, capital, infraestrutura)

Palavras alvo: 8.000-12.000 (MÍNIMO 7.000)
MÍNIMO 3 footnotes.
Salve: ${PHASES_DIR}/CL_NIW_PRONG2_B.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep

echo "[FASE 3B] Prong 2 Parte B concluída."
fi

# ═══ FASE 4: PRONG 3 ═══
if skip_if_exists "${PHASES_DIR}/CL_NIW_PRONG3.docx" "FASE 4"; then true; else
echo ""
echo "[FASE 4/12] PRONG 3 — National Interest Waiver..."
$CLAUDE -p "
Leia: ${PHASES_DIR}/_inventory.json
Leia: ${PHASES_DIR}/CL_NIW_PRONG1_A.docx, CL_NIW_PRONG1_B.docx, CL_NIW_PRONG2_A.docx, CL_NIW_PRONG2_B.docx (TODOS — pra manter continuidade)
Leia: ${RAGS_PATH}/ (especialmente Legal Framework e Adjudicador Algorítmico)

${TRANSVERSAL}

TAREFA: Gerar PRONG 3 — Balance of Equities (National Interest Waiver).

ESTA É A SEÇÃO QUE DETERMINA SE O WAIVER É CONCEDIDO. É A MAIS IMPORTANTE.

ESTRUTURA OBRIGATÓRIA — 4 FRENTES:

A. IMPRATICABILIDADE DO PERM:
   - Self-employment / empreendedorismo proprietário (não tem employer pra sponsorar)
   - Escopo multi-empregador / multi-cliente
   - Timeline PERM (2-3 anos) vs. urgência do endeavor
   - Como seria possível ser seu próprio sponsor?

B. BENEFÍCIO NACIONAL > PROTEÇÃO DO MERCADO DE TRABALHO:
   - Empregos projetados (quantificar com dados BLS)
   - Receita estimada e impostos gerados
   - Multiplicador econômico (NAICS, BEA)
   - O benefício é SISTÊMICO, não individual
   - Os EUA ganham MAIS aprovando do que negando

C. PRECEDENTES JURÍDICOS:
   - Dhanasar: it would be impractical to require labor certification
   - NYSDOT: endeavors de interesse público dispensam PERM
   - Casos AAO recentes relevantes

D. URGÊNCIA E JANELA DE OPORTUNIDADE:
   - Skill shortage documentado (BLS JOLTS data)
   - Competição internacional (Canadá, UK, Austrália recrutando talentos)
   - Gap que se AGRAVA enquanto espera PERM
   - Janela regulatória/mercadológica fechando

ANTI-CRISTINE OBRIGATÓRIO EM CADA PARÁGRAFO:
- A expertise do beneficiário é INSUBSTITUÍVEL
- O endeavor NÃO funciona sem esta pessoa
- NUNCA: standardized, self-sustaining, plug-and-play, replicable

Palavras alvo: 8.000-12.000 (MÍNIMO 7.000)
MÍNIMO 5 footnotes com precedentes citados corretamente.
Salve: ${PHASES_DIR}/CL_NIW_PRONG3.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch

echo "[FASE 4] Prong 3 concluído."
fi

# ═══ FASE 5: CONCLUSÃO + EVIDENCE INDEX ═══
if skip_if_exists "${PHASES_DIR}/CL_NIW_CONCLUSION.docx" "FASE 5"; then true; else
echo ""
echo "[FASE 5/12] CONCLUSÃO + EVIDENCE INDEX..."
$CLAUDE -p "
Leia: ${PHASES_DIR}/CL_NIW_PRONG1_A.docx, CL_NIW_PRONG1_B.docx, CL_NIW_PRONG2_A.docx, CL_NIW_PRONG2_B.docx, CL_NIW_PRONG3.docx

${TRANSVERSAL}

TAREFA: Gerar CONCLUSÃO + EVIDENCE INDEX.

CONTEÚDO:

1. SÍNTESE DOS 3 PRONGS (3-4 parágrafos):
   - Prong 1: o endeavor tem mérito substancial e importância nacional porque...
   - Prong 2: o beneficiário está excepcionalmente posicionado porque...
   - Prong 3: dispensar a certificação de trabalho serve ao interesse nacional porque...

2. PEDIDO FORMAL DE APROVAÇÃO:
   - Solicitar aprovação da petição I-140 sob EB-2 NIW
   - Respectfully submitted, [nome do beneficiário]

3. EVIDENCE INDEX (tabela completa):
   - Exhibit # | Title | Type | Prong(s)
   - Evidence block com [THUMBNAIL — Exhibit X] pra CADA evidência
   - Bordas APENAS horizontais (sem laterais)
   - Numerar TODAS as evidências mencionadas ao longo do documento

Palavras alvo: 3.000-5.000
Salve: ${PHASES_DIR}/CL_NIW_CONCLUSION.docx
" --allowedTools Bash,Read,Write,Edit,Glob,Grep

echo "[FASE 5] Conclusão concluída."
fi

# ═══ FASE 6: THUMBNAILS ═══
echo ""
echo "[FASE 6/12] INSERINDO THUMBNAILS..."
if [ -f "$THUMBNAILS_SCRIPT" ]; then
  for f in ${PHASES_DIR}/CL_NIW_*.docx; do
    echo "  Inserindo thumbnails em $(basename $f)..."
    python3 "$THUMBNAILS_SCRIPT" "$f" "$CLIENT_DOCS/" 2>&1 || echo "  WARN: falha em $(basename $f)"
  done
  echo "[FASE 6] Thumbnails concluídos."
else
  echo "[FASE 6] WARN: insert_thumbnails.py não encontrado em $THUMBNAILS_SCRIPT"
fi

# ═══ FASE 7: CONSOLIDAÇÃO ═══
echo ""
echo "[FASE 7/12] CONSOLIDAÇÃO — Merge de todas as partes..."
CONSOLIDATED="Cover_Letter_EB2_NIW_${SLUG}_CONSOLIDATED.docx"
$CLAUDE -p "
Você tem os seguintes arquivos DOCX que precisam ser CONSOLIDADOS em UM ÚNICO documento:

1. ${PHASES_DIR}/CL_NIW_PART1_Intro.docx (ou versão _with_thumbnails se existir)
2. ${PHASES_DIR}/CL_NIW_PRONG1_A.docx (ou _with_thumbnails)
3. ${PHASES_DIR}/CL_NIW_PRONG1_B.docx (ou _with_thumbnails)
4. ${PHASES_DIR}/CL_NIW_PRONG2_A.docx (ou _with_thumbnails)
5. ${PHASES_DIR}/CL_NIW_PRONG2_B.docx (ou _with_thumbnails)
6. ${PHASES_DIR}/CL_NIW_PRONG3.docx (ou _with_thumbnails)
7. ${PHASES_DIR}/CL_NIW_CONCLUSION.docx (ou _with_thumbnails)

TAREFA: Consolidar TODOS em um único DOCX.

Use python-docx para:
1. Abrir o primeiro documento como base
2. Para cada documento seguinte:
   - Adicionar page break
   - Copiar TODOS os parágrafos preservando formatação (font, size, color, bold, italic)
   - Copiar TODAS as tabelas preservando estrutura e formatação
   - Copiar TODAS as imagens (thumbnails inseridos)
3. Manter header/footer consistente do primeiro documento

Se algum arquivo _with_thumbnails existir, PREFERIR esse sobre o original.
Se um arquivo não existir, PULAR (não falhar).

Salve: ${OUTPUT_DIR}/${CONSOLIDATED}

Após consolidar, imprima estatísticas:
- Total de parágrafos
- Total de tabelas
- Total de imagens
- Estimativa de páginas (total_chars / 3000)
" --allowedTools Bash,Read,Write,Edit,Glob,Grep

echo "[FASE 7] Consolidação concluída."

# ═══ FASE 7.5: FIX FORMATAÇÃO COMPLETO ═══
echo ""
echo "[FASE 7.5/12] FIX FORMATAÇÃO (spacing + images + anchor + cleanup)..."
FIX_SCRIPT="$(cd "$(dirname "$0")" && pwd)/fix_docx_formatting.py"
if [ -f "${OUTPUT_DIR}/${CONSOLIDATED}" ] && [ -f "$FIX_SCRIPT" ]; then
  FINAL_NAME="Cover_Letter_EB2_NIW_${SLUG}.docx"
  python3 "$FIX_SCRIPT" "${OUTPUT_DIR}/${CONSOLIDATED}" "${OUTPUT_DIR}/${FINAL_NAME}"
  echo "[FASE 7.5] Formatação corrigida → ${FINAL_NAME}"
elif [ -f "${OUTPUT_DIR}/${CONSOLIDATED}" ]; then
  # Fallback inline fix
  echo "[FASE 7.5] WARN: fix_docx_formatting.py não encontrado, usando fallback..."
  python3 -c "
from docx import Document
from docx.shared import Pt, Inches
from docx.oxml.ns import qn
import sys

path = sys.argv[1]
doc = Document(path)
fixed = 0

for p in doc.paragraphs:
    pf = p.paragraph_format
    if pf.space_after and pf.space_after > Pt(8):
        pf.space_after = Pt(6)
        fixed += 1
    if pf.space_before and pf.space_before > Pt(8):
        pf.space_before = Pt(3)
        fixed += 1
    if pf.line_spacing and pf.line_spacing > Pt(20):
        pf.line_spacing = Pt(14)
        fixed += 1
    for run in p.runs:
        for br in run._element.findall(qn('w:br')):
            if br.get(qn('w:type')) == 'page':
                is_header = run.bold and run.font.size and run.font.size >= Pt(13)
                if not is_header:
                    br.getparent().remove(br)
                    fixed += 1

for table in doc.tables:
    for row in table.rows:
        for cell in row.cells:
            for p in cell.paragraphs:
                pf = p.paragraph_format
                if pf.space_after and pf.space_after > Pt(6):
                    pf.space_after = Pt(3)
                if pf.space_before and pf.space_before > Pt(6):
                    pf.space_before = Pt(2)

for section in doc.sections:
    section.top_margin = Inches(0.7)
    section.bottom_margin = Inches(0.6)
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.6)

doc.save(path)
chars = sum(len(p.text) for p in doc.paragraphs)
print(f'Fixed {fixed} formatting issues. ~{chars // 2500} pages.')
" "${OUTPUT_DIR}/${CONSOLIDATED}" 2>&1
  echo "[FASE 7.5] Formatação comprimida."
else
  echo "[FASE 7.5] WARN: Arquivo consolidado não encontrado."
fi

# Determine final file name for SOC
if [ -f "${OUTPUT_DIR}/Cover_Letter_EB2_NIW_${SLUG}.docx" ]; then
  FINAL_DOC="${OUTPUT_DIR}/Cover_Letter_EB2_NIW_${SLUG}.docx"
else
  FINAL_DOC="${OUTPUT_DIR}/${CONSOLIDATED}"
fi

# ═══ FASE 8: SOC (SEPARATION OF CONCERNS) ═══
echo ""
echo "[FASE 8/12] SEPARATION OF CONCERNS — Revisão cruzada..."
SOC_PATH="/Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md"
QUALITY_PATH="/Users/paulo1844/Documents/Aqui OBSIDIAN/Aspectos Gerais da Vida/PROEX/Pareceres da Qualidade - Apontamentos (insumos para agente de qualidade).md"

$CLAUDE -p "
Leia: ${SOC_PATH} — Protocolo de Revisão
Leia: ${QUALITY_PATH} — Pareceres da Qualidade (50 regras)

TAREFA: Revisão cruzada completa do documento:
${FINAL_DOC}

Você é o REVISOR, não o autor. Seja RIGOROSO.

4 PERSONAS de revisão:
1. USCIS Adjudication Officer (avalia sob Dhanasar, NÃO Kazarian)
2. Elite Immigration Consultant (WeGreened, GCEB1 level)
3. Quality Auditor (formatação, consistência, regras)
4. First-Time Reader (o texto faz sentido?)

Para CADA problema encontrado:
- Severidade: BLOQUEANTE / CRÍTICO / ALTO / MÉDIO
- Localização exata (seção, parágrafo)
- O que está errado
- Como corrigir

Salve: ${OUTPUT_DIR}/REVIEW_Cover_Letter_EB2_NIW_${SLUG}.md
" --allowedTools Bash,Read,Write,Edit,Glob,Grep

echo "[FASE 8] SOC concluída."

echo ""
echo "============================================================================"
echo "PIPELINE COMPLETO — Cover Letter EB-2 NIW: ${CLIENT_NAME}"
echo "Documento final: ${FINAL_DOC}"
echo "Review: ${OUTPUT_DIR}/REVIEW_Cover_Letter_EB2_NIW_${SLUG}.md"
echo "Fases: ${PHASES_DIR}/"
echo "============================================================================"
