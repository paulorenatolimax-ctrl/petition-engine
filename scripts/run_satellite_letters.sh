#!/bin/bash
# ============================================================================
# ORQUESTRADOR DE CARTAS SATÉLITE/RECOMENDAÇÃO — Pipeline Multi-Fase
# Gera batch de cartas visualmente heterogêneas para petições EB-1A ou EB-2 NIW
#
# Uso: ./run_satellite_letters.sh "Nome do Cliente" "/path/to/client/docs" "/path/to/output" "eb1a|eb2_niw"
#
# Cada carta recebe identidade visual ÚNICA (font, cor, header, estrutura)
# para evitar detecção ATLAS de padrões uniformes.
# ============================================================================

set -e

CLIENT_NAME="$1"
CLIENT_DOCS="$2"
OUTPUT_DIR="$3"
PETITION_TYPE="${4:-eb2_niw}"

if [ -z "$CLIENT_NAME" ] || [ -z "$CLIENT_DOCS" ] || [ -z "$OUTPUT_DIR" ]; then
  echo "═══════════════════════════════════════════════════════════════════"
  echo "ORQUESTRADOR DE CARTAS SATÉLITE/RECOMENDAÇÃO"
  echo "═══════════════════════════════════════════════════════════════════"
  echo ""
  echo "Uso: $0 'Nome do Cliente' '/path/to/docs' '/path/to/output' [eb1a|eb2_niw]"
  echo ""
  echo "  Arg 1: Nome completo do cliente/peticionário"
  echo "  Arg 2: Pasta com documentos do cliente (Quadros de Informações, CVs, etc.)"
  echo "  Arg 3: Pasta de saída para as cartas geradas"
  echo "  Arg 4: Tipo de petição — eb1a ou eb2_niw (default: eb2_niw)"
  echo ""
  echo "Estrutura esperada na pasta de docs:"
  echo "  - Quadro de Informações*.* (um por recomendador/empresa)"
  echo "  - CV ou LinkedIn de cada recomendador (opcional)"
  echo "  - Estratégia ou PRD do caso (opcional)"
  echo ""
  exit 1
fi

# ═══ VALIDAÇÃO DO TIPO DE PETIÇÃO ═══
if [ "$PETITION_TYPE" != "eb1a" ] && [ "$PETITION_TYPE" != "eb2_niw" ]; then
  echo "ERRO: Tipo de petição inválido: '$PETITION_TYPE'"
  echo "  Use: eb1a ou eb2_niw"
  exit 1
fi

CLAUDE="/Users/paulo1844/.npm-global/bin/claude"
PHASES_DIR="${OUTPUT_DIR}/phases"
SLUG=$(echo "$CLIENT_NAME" | tr ' ' '_')

# ═══ CAMINHOS DO SISTEMA ═══
FORMATTING_CATALOG="/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/PROMPTs/_Sistema Produtor de Cartas EB-1/references/formatting-catalog-v3.md"
SKILL_PATH="/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/PROMPTs/_Sistema Produtor de Cartas EB-1/SKILL.md"
RAGS_EB1="/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/EB-1 - RAGs"
RAGS_NIW="/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/EB-2 NIW - RAGs"
SOC_PATH="/Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md"
QUALITY_PATH="/Users/paulo1844/Documents/Aqui OBSIDIAN/Aspectos Gerais da Vida/PROEX/Pareceres da Qualidade - Apontamentos (insumos para agente de qualidade).md"
FIX_SCRIPT="$(cd "$(dirname "$0")" && pwd)/fix_docx_formatting.py"

# Selecionar RAGs conforme tipo de petição
if [ "$PETITION_TYPE" = "eb1a" ]; then
  RAGS_PATH="$RAGS_EB1"
  PETITION_LABEL="EB-1A (Extraordinary Ability)"
  LETTER_FRAMEWORK="EB-1A"
else
  RAGS_PATH="$RAGS_NIW"
  PETITION_LABEL="EB-2 NIW (National Interest Waiver)"
  LETTER_FRAMEWORK="EB-2 NIW"
fi

mkdir -p "$PHASES_DIR"

echo "════════════════════════════════════════════════════════════════════════"
echo "ORQUESTRADOR DE CARTAS SATÉLITE/RECOMENDAÇÃO"
echo "════════════════════════════════════════════════════════════════════════"
echo "Cliente:      $CLIENT_NAME"
echo "Petição:      $PETITION_LABEL"
echo "Docs:         $CLIENT_DOCS"
echo "Output:       $OUTPUT_DIR"
echo "Catálogo:     $FORMATTING_CATALOG"
echo "════════════════════════════════════════════════════════════════════════"

# ═══ HELPER: SKIP SE JÁ EXISTE (auto-resume) ═══
skip_if_exists() {
  local file="$1"
  local fase="$2"
  if [ -f "$file" ] && [ "$(stat -f%z "$file" 2>/dev/null || stat --printf="%s" "$file" 2>/dev/null || echo 0)" -gt 500 ]; then
    echo "[SKIP] ${fase} — já existe: $(basename "$file") ($(du -h "$file" | cut -f1))"
    return 0
  fi
  return 1
}

# ═══ REGRAS TRANSVERSAIS POR TIPO DE PETIÇÃO ═══

if [ "$PETITION_TYPE" = "eb2_niw" ]; then
  TRANSVERSAL_RULES="
REGRAS TRANSVERSAIS PARA CARTAS SATÉLITE EB-2 NIW:
- TIPO: Cartas satélite EB-2 NIW são PROPOSTAS COMERCIAIS em PORTUGUÊS (pt-BR).
  Escritas PELA EMPRESA ao peticionário, expressando interesse em contratar/parceirar.
  Tom: EMPRESARIAL, linguagem de proposta comercial.
- Cartas de recomendação EB-2 NIW são endossos profissionais em PORTUGUÊS (pt-BR).
  Escritas POR um profissional que CONHECE pessoalmente o peticionário.
  Tom: PESSOAL, experiências compartilhadas, observações diretas.
- IDIOMA: 100% PORTUGUÊS (pt-BR). Termos técnicos em inglês entre parênteses OK.
- NUNCA mencionar: USCIS, imigração, visto, visa, green card, petição, waiver, NIW, EB-2,
  I-140, Dhanasar, adjudicador, beneficiário, patrocinador, consultoria (como serviço genérico),
  assessoria (como serviço genérico).
- ANTI-HALLUCINATION: TODA credencial citada deve vir do CV/LinkedIn do recomendador.
  Se não há fonte verificável, NÃO inventar. Perguntar ou omitir.
- MÉTRICAS: Mínimo 4 dados quantificáveis por carta com fonte verificável.
- Cadeias causais: FATO → INFERÊNCIA → IMPACTO → NEXO COM O CAMPO → COMPARAÇÃO COM PARES.
- NUNCA usar: standardized, self-sustaining, plug-and-play, replicable by any, turnkey,
  scalable without the founder, padronizado, auto-sustentável, chave-na-mão.
- NUNCA expor infraestrutura (RAGs, Claude, Obsidian, Petition Engine, formato .md).
- Parágrafos máximo 1200 caracteres. Se maior, dividir.
- [THUMBNAIL] placeholders: Usar [THUMBNAIL — Exhibit X] onde evidências são referenciadas.
"
elif [ "$PETITION_TYPE" = "eb1a" ]; then
  TRANSVERSAL_RULES="
REGRAS TRANSVERSAIS PARA CARTAS EB-1A:
- TIPO DE CARTAS:
  * RECOMENDAÇÃO: Escrita por profissional que CONHECE pessoalmente o peticionário.
    Tom PESSOAL. Tempo verbal: passado + presente. Experiências compartilhadas.
  * EXPERT OPINION: Escrita por autoridade SEM colaboração direta.
    Tom ANALÍTICO. Declaração de independência OBRIGATÓRIA.
  * SATÉLITE: Escrita pela empresa que QUER contratar/parceirar.
    Tom EMPRESARIAL. Tempo verbal: futuro/condicional.
  * TESTEMUNHO: Escrita por cliente que JÁ recebeu serviços.
    Tom: gratidão corporativa. Tempo verbal: passado. Resultados antes/depois.
- IDIOMA: 100% PORTUGUÊS (pt-BR). Termos técnicos em inglês entre parênteses OK.
- FRAMEWORK: Kazarian (2 etapas). Step 1: critérios. Step 2: mérito final.
  NUNCA nomear os critérios diretamente — o advogado faz a conexão na Petition Letter.
- NUNCA mencionar: USCIS, imigração, visto, visa, green card, petição, petition,
  extraordinary ability (como termo legal), Kazarian, I-140, adjudicador, beneficiário,
  outstanding researcher, consultoria (como serviço genérico), assessoria.
- ANTI-HALLUCINATION: TODA credencial deve vir do CV/LinkedIn. Se não verificável, NÃO inventar.
- MÉTRICAS: Mínimo 4 dados quantificáveis por carta.
- Cadeias causais: FATO → INFERÊNCIA → IMPACTO → NEXO COM O CAMPO → COMPARAÇÃO COM PARES.
- Demonstrar SUSTAINED ACCLAIM: reconhecimento ao longo de ANOS, não pontual.
- NUNCA usar: standardized, self-sustaining, plug-and-play, replicable by any, turnkey,
  scalable without the founder, padronizado, auto-sustentável, chave-na-mão.
- NUNCA expor infraestrutura (RAGs, Claude, Obsidian, Petition Engine, formato .md).
- Parágrafos máximo 1200 caracteres. Se maior, dividir.
- [THUMBNAIL] placeholders: Usar [THUMBNAIL — Exhibit X] onde evidências são referenciadas.
"
fi

# ════════════════════════════════════════════════════════════════════════════
# FASE 0: INVENTÁRIO + ATRIBUIÇÃO DE IDENTIDADE VISUAL
# ════════════════════════════════════════════════════════════════════════════
if skip_if_exists "${PHASES_DIR}/_letter_assignments.json" "FASE 0"; then true; else
echo ""
echo "[FASE 0] INVENTÁRIO + ATRIBUIÇÃO DE IDENTIDADE VISUAL..."
echo "  Escaneando pasta do cliente e atribuindo combos únicos..."

$CLAUDE -p "
Você é o ORQUESTRADOR de um batch de cartas de apoio para a petição ${PETITION_LABEL} do(a) ${CLIENT_NAME}.

TAREFA: Inventariar os documentos do cliente e PRÉ-ATRIBUIR identidade visual única a cada carta.

## PASSO 1: ESCANEAR A PASTA DO CLIENTE

Leia TODOS os arquivos em: ${CLIENT_DOCS}/

Procure por:
1. Arquivos 'Quadro de Informações' ou 'Quadro Informações' (um por recomendador/empresa)
   - Podem ser .md, .docx, .pdf, .txt
   - Cada Quadro define UM recomendador/empresa = UMA carta
2. CVs ou perfis LinkedIn de recomendadores (PDFs, DOCXs)
3. Documentos de estratégia, PRD, ou briefing do caso
4. Qualquer outro arquivo relevante (cartas existentes, modelos, etc.)

Para cada Quadro encontrado, extrair:
- Nome do recomendador/signatário
- Empresa/organização
- Tipo de carta (satélite, recomendação, expert_opinion, testemunho)
- Relação com o peticionário (supervisor, cliente, expert, colaborador, etc.)
- Caminho do arquivo Quadro
- Caminho do CV/LinkedIn do recomendador (se existir na pasta)

## PASSO 2: LER O CATÁLOGO DE FORMATAÇÃO

Leia: ${FORMATTING_CATALOG}

Entenda as 20 combinações F01-F20, os 12 estilos de header H1-H12,
os 10 formatos de documento D1-D10, os 10 tipos de tabela T1-T10,
e os 10 blocos de assinatura S1-S10.

## PASSO 3: ATRIBUIR IDENTIDADE VISUAL ÚNICA

Para CADA carta, atribuir:
- combo: F01-F20 (NUNCA repetir no batch)
- font: nome da família tipográfica
- font_size_body: tamanho do corpo (variar: 11, 11.5, 12pt)
- primary_color: hex da cor primária
- accent_color: hex da cor de acento
- body_color: hex do texto de corpo
- header_style: H1-H12 (NUNCA repetir no batch se possível)
- document_format: D1-D10 (variar: carta, memorando, proposta, parecer, etc.)
- table_type: T1-T10 ou 'none' (MAX 2 cartas com tabela no batch)
- signature_style: S1-S10 (variar)
- structure: 'tables' | 'prose' | 'bullets' | 'numbered_articles' | 'considerando_que' | 'pull_quotes' | 'inline_metrics'

REGRAS DE DISTRIBUIÇÃO:
- NUNCA duas cartas com mesma font family
- NUNCA duas cartas com mesma primary_color
- NUNCA duas cartas com mesmo header_style (até 12 cartas)
- MAX 2 cartas com tabelas no batch inteiro
- MAX 1 carta com bullets
- MAX 1 carta com pull-quote blocks
- Variar comprimentos: algumas 2 páginas, outras 3-4 páginas
- Cada carta com ângulo/perspectiva DIFERENTE

## PASSO 4: SALVAR COMO JSON

Salve em: ${PHASES_DIR}/_letter_assignments.json

Formato EXATO:
{
  \"client_name\": \"${CLIENT_NAME}\",
  \"petition_type\": \"${PETITION_TYPE}\",
  \"total_letters\": N,
  \"generated_at\": \"YYYY-MM-DD\",
  \"letters\": [
    {
      \"index\": 1,
      \"recommender\": \"Nome Completo\",
      \"company\": \"Nome da Empresa\",
      \"type\": \"satellite|recommendation|expert_opinion|testimonial\",
      \"relationship\": \"supervisor|client|expert|collaborator|academic|industry_peer\",
      \"combo\": \"F01\",
      \"font\": \"Trebuchet MS\",
      \"font_size_body\": 12,
      \"primary_color\": \"#1A237E\",
      \"accent_color\": \"#283593\",
      \"body_color\": \"#2D2D2D\",
      \"header_style\": \"H1\",
      \"document_format\": \"D1\",
      \"table_type\": \"T1\",
      \"signature_style\": \"S1\",
      \"structure\": \"prose\",
      \"target_pages\": 3,
      \"quadro_path\": \"/full/path/to/quadro.md\",
      \"cv_path\": \"/full/path/to/cv.pdf\",
      \"output_filename\": \"01_EMPRESA_Carta_Satelite.docx\"
    }
  ],
  \"heterogeneity_matrix\": {
    \"fonts_used\": [\"Trebuchet MS\", \"...\"],
    \"colors_used\": [\"#1A237E\", \"...\"],
    \"headers_used\": [\"H1\", \"...\"],
    \"tables_count\": 2,
    \"structures_used\": [\"prose\", \"tables\", \"...\"]
  }
}

CONVENÇÃO DE NOMES DE ARQUIVO:
- Satélite: NN_EMPRESA_Carta_Satelite.docx
- Recomendação: NN_NOME_Carta_Recomendacao.docx
- Expert Opinion: NN_NOME_Carta_ExpertOpinion.docx
- Testemunho: NN_EMPRESA_Carta_Testemunho.docx

Onde NN = número sequencial (01, 02, 03...) e EMPRESA/NOME em UPPERCASE com underscores.
" --allowedTools Bash,Read,Write,Edit,Glob,Grep

echo "[FASE 0] Inventário e atribuições concluídos → _letter_assignments.json"
fi

# ════════════════════════════════════════════════════════════════════════════
# FASES 1-N: GERAR CADA CARTA (uma sessão Claude por carta)
# ════════════════════════════════════════════════════════════════════════════

# Ler o JSON de assignments e iterar
if [ ! -f "${PHASES_DIR}/_letter_assignments.json" ]; then
  echo "ERRO: _letter_assignments.json não encontrado. Fase 0 falhou?"
  exit 1
fi

# Extrair total de cartas do JSON
TOTAL_LETTERS=$(python3 -c "
import json
with open('${PHASES_DIR}/_letter_assignments.json') as f:
    data = json.load(f)
print(data['total_letters'])
" 2>/dev/null || echo "0")

if [ "$TOTAL_LETTERS" = "0" ] || [ -z "$TOTAL_LETTERS" ]; then
  echo "ERRO: Nenhuma carta encontrada no _letter_assignments.json"
  exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "GERANDO ${TOTAL_LETTERS} CARTAS (uma sessão por carta)..."
echo "════════════════════════════════════════════════════════════════════════"

for i in $(seq 1 $TOTAL_LETTERS); do
  # Extrair dados desta carta do JSON
  LETTER_DATA=$(python3 -c "
import json, sys
with open('${PHASES_DIR}/_letter_assignments.json') as f:
    data = json.load(f)
for letter in data['letters']:
    if letter['index'] == ${i}:
        # Print each field on a line
        print(letter.get('recommender', ''))
        print(letter.get('company', ''))
        print(letter.get('type', ''))
        print(letter.get('relationship', ''))
        print(letter.get('combo', ''))
        print(letter.get('font', ''))
        print(letter.get('font_size_body', 12))
        print(letter.get('primary_color', ''))
        print(letter.get('accent_color', ''))
        print(letter.get('body_color', ''))
        print(letter.get('header_style', ''))
        print(letter.get('document_format', ''))
        print(letter.get('table_type', 'none'))
        print(letter.get('signature_style', ''))
        print(letter.get('structure', ''))
        print(letter.get('target_pages', 3))
        print(letter.get('quadro_path', ''))
        print(letter.get('cv_path', ''))
        print(letter.get('output_filename', ''))
        break
")

  # Parse fields
  L_RECOMMENDER=$(echo "$LETTER_DATA" | sed -n '1p')
  L_COMPANY=$(echo "$LETTER_DATA" | sed -n '2p')
  L_TYPE=$(echo "$LETTER_DATA" | sed -n '3p')
  L_RELATIONSHIP=$(echo "$LETTER_DATA" | sed -n '4p')
  L_COMBO=$(echo "$LETTER_DATA" | sed -n '5p')
  L_FONT=$(echo "$LETTER_DATA" | sed -n '6p')
  L_FONT_SIZE=$(echo "$LETTER_DATA" | sed -n '7p')
  L_PRIMARY=$(echo "$LETTER_DATA" | sed -n '8p')
  L_ACCENT=$(echo "$LETTER_DATA" | sed -n '9p')
  L_BODY_COLOR=$(echo "$LETTER_DATA" | sed -n '10p')
  L_HEADER=$(echo "$LETTER_DATA" | sed -n '11p')
  L_DOC_FORMAT=$(echo "$LETTER_DATA" | sed -n '12p')
  L_TABLE=$(echo "$LETTER_DATA" | sed -n '13p')
  L_SIGNATURE=$(echo "$LETTER_DATA" | sed -n '14p')
  L_STRUCTURE=$(echo "$LETTER_DATA" | sed -n '15p')
  L_PAGES=$(echo "$LETTER_DATA" | sed -n '16p')
  L_QUADRO=$(echo "$LETTER_DATA" | sed -n '17p')
  L_CV=$(echo "$LETTER_DATA" | sed -n '18p')
  L_FILENAME=$(echo "$LETTER_DATA" | sed -n '19p')

  OUTPUT_FILE="${OUTPUT_DIR}/${L_FILENAME}"

  # Skip se já existe (auto-resume)
  if skip_if_exists "$OUTPUT_FILE" "CARTA ${i}/${TOTAL_LETTERS}"; then continue; fi

  echo ""
  echo "────────────────────────────────────────────────────────────────────"
  echo "[CARTA ${i}/${TOTAL_LETTERS}] ${L_RECOMMENDER} — ${L_COMPANY}"
  echo "  Tipo: ${L_TYPE} | Combo: ${L_COMBO} | Font: ${L_FONT}"
  echo "  Cor: ${L_PRIMARY} | Header: ${L_HEADER} | Estrutura: ${L_STRUCTURE}"
  echo "────────────────────────────────────────────────────────────────────"

  # Construir instrução de leitura do CV
  CV_INSTRUCTION=""
  if [ -n "$L_CV" ] && [ "$L_CV" != "null" ] && [ "$L_CV" != "None" ] && [ -f "$L_CV" ]; then
    CV_INSTRUCTION="Leia o CV/LinkedIn do recomendador: ${L_CV}
ANTI-HALLUCINATION: Use SOMENTE credenciais e dados que aparecem neste CV.
Se uma informação NÃO está no CV, NÃO invente. Omita ou sinalize como [VERIFICAR]."
  else
    CV_INSTRUCTION="AVISO: Não há CV/LinkedIn disponível para este recomendador.
Use SOMENTE as informações do Quadro de Informações.
Para credenciais não fornecidas, use placeholders: [CARGO COMPLETO], [ANO], etc."
  fi

  # Construir instrução de RAGs
  RAGS_INSTRUCTION=""
  if [ -d "$RAGS_PATH" ]; then
    RAGS_INSTRUCTION="Leia os RAGs de estratégia em: ${RAGS_PATH}/"
  fi

  # Construir instrução específica do tipo de carta
  if [ "$L_TYPE" = "satellite" ]; then
    if [ "$PETITION_TYPE" = "eb2_niw" ]; then
      TYPE_INSTRUCTIONS="
TIPO DE CARTA: PROPOSTA COMERCIAL (Satélite EB-2 NIW)
- A carta é escrita PELA EMPRESA (${L_COMPANY}) PARA o peticionário (${CLIENT_NAME}).
- Tom: EMPRESARIAL — linguagem de proposta comercial/parceria.
- Tempo verbal: FUTURO/CONDICIONAL — 'gostaríamos', 'acreditamos que poderia', 'propomos'.
- A empresa CONHECE o trabalho do peticionário e quer contratar/parceirar.
- NUNCA é uma carta de referência pessoal — é uma proposta de negócio.
- Demonstrar: por que ESTE profissional e não outro (diferenciação pelo track record).
- Incluir: desafios REAIS do setor da empresa, como o peticionário resolveria.
- Expressão formal de interesse em parceria/contratação no final."
    else
      TYPE_INSTRUCTIONS="
TIPO DE CARTA: SATÉLITE (Proposta de Parceria EB-1A)
- A carta é escrita PELA EMPRESA (${L_COMPANY}) PARA o peticionário (${CLIENT_NAME}).
- Tom: EMPRESARIAL — proposta comercial.
- Tempo verbal: FUTURO/CONDICIONAL.
- Demonstrar que as contribuições do peticionário são de 'major significance' para o campo.
- Endereçar critérios Kazarian INDIRETAMENTE (sem nomear critérios ou Kazarian).
- Mostrar reconhecimento SUSTENTADO ao longo do tempo.
- Expressão formal de interesse."
    fi
  elif [ "$L_TYPE" = "recommendation" ]; then
    TYPE_INSTRUCTIONS="
TIPO DE CARTA: RECOMENDAÇÃO PROFISSIONAL
- A carta é escrita POR ${L_RECOMMENDER} (${L_COMPANY}) SOBRE o peticionário (${CLIENT_NAME}).
- Tom: PESSOAL — o autor CONHECE o peticionário, fala de experiências compartilhadas.
- Tempo verbal: PASSADO + PRESENTE.
- Credenciais do autor (por que tem autoridade para opinar).
- Contexto do relacionamento (duração, profundidade, como se conheceram).
- 3-5 seções com competências específicas OBSERVADAS PESSOALMENTE.
- Para cada: exemplo concreto + métrica + inferência técnica + comparação com pares.
- Fecho forte: na avaliação profissional do autor, o peticionário está entre os top X% do campo."
  elif [ "$L_TYPE" = "expert_opinion" ]; then
    TYPE_INSTRUCTIONS="
TIPO DE CARTA: EXPERT OPINION (Opinião Especializada)
- A carta é escrita POR ${L_RECOMMENDER} SOBRE o peticionário (${CLIENT_NAME}).
- Tom: ANALÍTICO e INDEPENDENTE.
- DECLARAÇÃO DE INDEPENDÊNCIA OBRIGATÓRIA (não colaborou diretamente).
- Credenciais do especialista (PhDs, publicações, posições).
- Análise técnica: por que as contribuições são de 'major significance'.
- Cadeias causais explícitas.
- Comparação com pares do campo.
- Opinião profissional formal de fechamento."
  elif [ "$L_TYPE" = "testimonial" ]; then
    TYPE_INSTRUCTIONS="
TIPO DE CARTA: TESTEMUNHO (Serviços Recebidos)
- A carta é escrita POR ${L_RECOMMENDER} (${L_COMPANY}), um CLIENTE que recebeu serviços do peticionário.
- Tom: GRATIDÃO CORPORATIVA — resultados falam mais alto que elogios.
- Tempo verbal: PASSADO.
- Contexto: situação organizacional ANTES dos serviços (com métricas negativas).
- Escopo dos serviços recebidos (datas e duração).
- Resultados mensuráveis: ANTES → DEPOIS (com variação % explícita).
- Impacto organizacional amplo."
  fi

  # Construir instrução de tabela
  TABLE_INSTRUCTION=""
  if [ "$L_TABLE" != "none" ] && [ "$L_TABLE" != "None" ] && [ -n "$L_TABLE" ]; then
    TABLE_INSTRUCTION="
TABELA: Incluir UMA tabela estilo ${L_TABLE} (consultar catálogo para formato).
Posicionar a tabela na seção mais relevante (impacto, competências, ou escopo).
A tabela deve ter dados REAIS do Quadro de Informações, não genéricos."
  else
    TABLE_INSTRUCTION="
TABELA: Esta carta NÃO deve conter tabelas. Use prosa, métricas inline em negrito, ou pull-quotes."
  fi

  $CLAUDE -p "
Você é um redator especializado em cartas de apoio para petições de imigração ${PETITION_LABEL}.
Sua tarefa é gerar UMA carta com identidade visual e textual ÚNICA.

## DOCUMENTOS OBRIGATÓRIOS — LER ANTES DE ESCREVER

1. Leia o sistema completo de cartas: ${SKILL_PATH}
2. Leia o catálogo de formatação: ${FORMATTING_CATALOG}
3. Leia o Quadro de Informações DESTE recomendador: ${L_QUADRO}
${CV_INSTRUCTION}
${RAGS_INSTRUCTION}
4. Leia o plano de atribuições: ${PHASES_DIR}/_letter_assignments.json
   (para entender as OUTRAS cartas do batch e garantir que ESTA é diferente)

## IDENTIDADE VISUAL — OBRIGATÓRIA E INEGOCIÁVEL

ESTA CARTA USA EXCLUSIVAMENTE:
- FONT: ${L_FONT} — Use SOMENTE esta fonte em TODO o documento.
  Corpo: ${L_FONT_SIZE}pt. Headers: ${L_FONT_SIZE}+4 a +8pt. Sub-headers: ${L_FONT_SIZE}+2pt.
- COR PRIMÁRIA: ${L_PRIMARY} — Para headers de seção e destaques.
- COR DE ACENTO: ${L_ACCENT} — Para sub-headers, bordas, elementos decorativos.
- COR DO CORPO: ${L_BODY_COLOR} — Para texto regular.
- ESTILO DE HEADER: ${L_HEADER} — Consultar catálogo para implementação exata.
- FORMATO DE DOCUMENTO: ${L_DOC_FORMAT} — Seguir a estrutura definida no catálogo.
- BLOCO DE ASSINATURA: ${L_SIGNATURE}
- ESTRUTURA: ${L_STRUCTURE}
${TABLE_INSTRUCTION}

## INSTRUÇÕES DO TIPO DE CARTA
${TYPE_INSTRUCTIONS}

## REGRAS TRANSVERSAIS
${TRANSVERSAL_RULES}

## INFORMAÇÕES DA CARTA

- Carta ${i} de ${TOTAL_LETTERS} no batch
- Recomendador/Signatário: ${L_RECOMMENDER}
- Empresa: ${L_COMPANY}
- Relação com peticionário: ${L_RELATIONSHIP}
- Peticionário: ${CLIENT_NAME}
- Alvo de páginas: ${L_PAGES} páginas

## INSTRUÇÕES DE GERAÇÃO DO DOCX

Gere o arquivo .docx usando python-docx. O script deve:

1. Criar o documento com as especificações visuais EXATAS listadas acima
2. Aplicar a font ${L_FONT} a TODOS os runs
3. Usar as cores hex corretas (sem #) para headers e corpo
4. Implementar o estilo de header ${L_HEADER} conforme o catálogo
5. Seguir o formato de documento ${L_DOC_FORMAT}
6. Margens: top 0.8in, bottom 0.6in, left 0.9in, right 0.7in
7. Incluir [THUMBNAIL — Exhibit X] placeholders onde evidências são referenciadas

IMPORTANTE:
- O script Python deve ser EXECUTADO, gerando o .docx final
- NÃO apenas escrever o script — EXECUTAR e confirmar que o .docx foi criado
- Se python-docx não estiver instalado, instalar com pip

Salve o DOCX final em: ${OUTPUT_FILE}

Após gerar, confirme:
- Tamanho do arquivo
- Número de parágrafos
- Número de tabelas (se houver)
- Font utilizada
- Que a identidade visual está CORRETA
" --allowedTools Bash,Read,Write,Edit,Glob,Grep

  # Verificar se o arquivo foi gerado
  if [ -f "$OUTPUT_FILE" ]; then
    FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    echo "[CARTA ${i}/${TOTAL_LETTERS}] CONCLUÍDA → ${L_FILENAME} (${FILE_SIZE})"
  else
    echo "[CARTA ${i}/${TOTAL_LETTERS}] AVISO: Arquivo não encontrado em ${OUTPUT_FILE}"
    echo "  Tentando verificar em fases..."
    # Verificar se foi salvo no phases por engano
    if [ -f "${PHASES_DIR}/${L_FILENAME}" ]; then
      mv "${PHASES_DIR}/${L_FILENAME}" "$OUTPUT_FILE"
      echo "  Movido de phases/ para output/"
    fi
  fi

done

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "TODAS AS ${TOTAL_LETTERS} CARTAS GERADAS"
echo "════════════════════════════════════════════════════════════════════════"

# ════════════════════════════════════════════════════════════════════════════
# FASE N+1: FIX FORMATTING EM CADA CARTA
# ════════════════════════════════════════════════════════════════════════════
echo ""
echo "[FIX FORMATTING] Corrigindo spacing e formatação de todas as cartas..."

if [ -f "$FIX_SCRIPT" ]; then
  FIX_COUNT=0
  for docx_file in "${OUTPUT_DIR}"/*.docx; do
    if [ -f "$docx_file" ]; then
      BASENAME=$(basename "$docx_file")
      FIXED_FILE="${OUTPUT_DIR}/FIXED_${BASENAME}"
      echo "  Processando: ${BASENAME}..."
      python3 "$FIX_SCRIPT" "$docx_file" "$FIXED_FILE" 2>&1 && {
        mv "$FIXED_FILE" "$docx_file"
        FIX_COUNT=$((FIX_COUNT + 1))
      } || {
        echo "  WARN: Falha ao corrigir ${BASENAME}"
        # Remover arquivo parcial se existir
        [ -f "$FIXED_FILE" ] && rm "$FIXED_FILE"
      }
    fi
  done
  echo "[FIX FORMATTING] ${FIX_COUNT} cartas corrigidas."
else
  echo "[FIX FORMATTING] AVISO: fix_docx_formatting.py não encontrado em ${FIX_SCRIPT}"
  echo "  Aplicando fallback de spacing..."

  for docx_file in "${OUTPUT_DIR}"/*.docx; do
    if [ -f "$docx_file" ]; then
      echo "  Corrigindo spacing: $(basename "$docx_file")..."
      python3 -c "
import sys
from docx import Document
from docx.shared import Pt, Inches
from docx.oxml.ns import qn

path = sys.argv[1]
doc = Document(path)
fixed = 0

for p in doc.paragraphs:
    pf = p.paragraph_format
    if pf.space_after and pf.space_after > Pt(12):
        pf.space_after = Pt(6)
        fixed += 1
    if pf.space_before and pf.space_before > Pt(12):
        pf.space_before = Pt(4)
        fixed += 1
    if pf.line_spacing and pf.line_spacing > Pt(22):
        pf.line_spacing = Pt(14)
        fixed += 1

for table in doc.tables:
    for row in table.rows:
        for cell in row.cells:
            for p in cell.paragraphs:
                pf = p.paragraph_format
                if pf.space_after and pf.space_after > Pt(8):
                    pf.space_after = Pt(3)
                if pf.space_before and pf.space_before > Pt(8):
                    pf.space_before = Pt(2)

for section in doc.sections:
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.6)
    section.left_margin = Inches(0.9)
    section.right_margin = Inches(0.7)

doc.save(path)
print(f'  Fixed {fixed} formatting issues.')
" "$docx_file" 2>&1 || echo "  WARN: Fallback falhou para $(basename "$docx_file")"
    fi
  done
fi

# ════════════════════════════════════════════════════════════════════════════
# FASE N+2: SOC — REVISÃO DE HETEROGENEIDADE DO BATCH
# ════════════════════════════════════════════════════════════════════════════
REVIEW_FILE="${OUTPUT_DIR}/REVIEW_Batch_${SLUG}.md"

if skip_if_exists "$REVIEW_FILE" "SOC REVIEW"; then true; else
echo ""
echo "[SOC REVIEW] Revisão de heterogeneidade do batch completo..."

# Construir lista de arquivos gerados
GENERATED_FILES=""
for docx_file in "${OUTPUT_DIR}"/*.docx; do
  if [ -f "$docx_file" ]; then
    GENERATED_FILES="${GENERATED_FILES}
- ${docx_file}"
  fi
done

SOC_INSTRUCTION=""
if [ -f "$SOC_PATH" ]; then
  SOC_INSTRUCTION="Leia o Protocolo de Revisão: ${SOC_PATH}"
fi

QUALITY_INSTRUCTION=""
if [ -f "$QUALITY_PATH" ]; then
  QUALITY_INSTRUCTION="Leia os Pareceres da Qualidade: ${QUALITY_PATH}"
fi

$CLAUDE -p "
${SOC_INSTRUCTION}
${QUALITY_INSTRUCTION}

Você é o REVISOR DE QUALIDADE do batch de cartas do(a) ${CLIENT_NAME} (${PETITION_LABEL}).

TAREFA: Revisão completa de heterogeneidade e qualidade de TODAS as cartas do batch.

## ARQUIVOS PARA REVISAR
${GENERATED_FILES}

## PLANO DE ATRIBUIÇÕES
Leia: ${PHASES_DIR}/_letter_assignments.json

## 4 PERSPECTIVAS DE REVISÃO

### 1. ATLAS/ATA Anti-Pattern Detector
- Fontes são REALMENTE diferentes entre cartas? (extrair e comparar)
- Cores são REALMENTE diferentes? (verificar hex codes)
- Estrutura visual é REALMENTE distinta? (headers, tabelas, formatação)
- Vocabulário é diverso? (verificar se mesmas frases aparecem em múltiplas cartas)
- Parágrafos de abertura são únicos? (comparar as 3 primeiras frases)

### 2. Compliance Officer
- Zero termos proibidos? (USCIS, imigração, visto, visa, green card, petição, etc.)
- Anti-Cristine check? (standardized, self-sustaining, plug-and-play, etc.)
- Tipo de carta correto? (satélite = proposta, recomendação = endosso pessoal)
- Tempo verbal correto por tipo?
- Idioma correto (português)?
- Credenciais verificáveis? (não inventadas)

### 3. Content Quality Auditor
- Mínimo 4 métricas quantificáveis por carta?
- Cadeias causais explícitas (FATO → INFERÊNCIA → IMPACTO)?
- Cada carta tem ângulo/perspectiva diferente?
- Nenhum parágrafo genérico sem evidência?
- Parágrafos dentro de 1200 chars?

### 4. Batch Coherence Reviewer
- As cartas JUNTAS constroem uma narrativa coerente sobre o peticionário?
- Perspectivas complementares (supervisor, cliente, expert, par)?
- Não há contradições entre cartas?
- Não há repetição excessiva dos mesmos exemplos/métricas?

## FORMATO DO REVIEW

Para CADA problema:
- Severidade: BLOQUEANTE | CRÍTICO | ALTO | MÉDIO | BAIXO
- Carta: qual carta (número e nome)
- Localização: seção/parágrafo
- Problema: descrição clara
- Correção: como resolver

Sumário no final:
- PASS / PASS WITH CONCERNS / FAIL
- Score de heterogeneidade (0-100)
- Cartas que precisam de rewrite
- Problemas bloqueantes que impedem entrega

Salve: ${REVIEW_FILE}
" --allowedTools Bash,Read,Write,Edit,Glob,Grep

echo "[SOC REVIEW] Revisão concluída → $(basename "$REVIEW_FILE")"
fi

# ════════════════════════════════════════════════════════════════════════════
# SUMÁRIO FINAL
# ════════════════════════════════════════════════════════════════════════════
echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "PIPELINE COMPLETO — Cartas ${PETITION_LABEL}: ${CLIENT_NAME}"
echo "════════════════════════════════════════════════════════════════════════"
echo ""
echo "Cartas geradas:"
for docx_file in "${OUTPUT_DIR}"/*.docx; do
  if [ -f "$docx_file" ]; then
    echo "  $(basename "$docx_file") ($(du -h "$docx_file" | cut -f1))"
  fi
done
echo ""
echo "Review: ${REVIEW_FILE}"
echo "Assignments: ${PHASES_DIR}/_letter_assignments.json"
echo "Output: ${OUTPUT_DIR}/"
echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "PRÓXIMOS PASSOS:"
echo "  1. Ler o REVIEW e resolver problemas BLOQUEANTES/CRÍTICOS"
echo "  2. Abrir cada .docx no Word e verificar visualmente"
echo "  3. Substituir [THUMBNAIL] placeholders com evidências reais"
echo "  4. Submeter ao advogado para revisão final"
echo "════════════════════════════════════════════════════════════════════════"
