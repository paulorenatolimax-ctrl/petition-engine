# Instrucao de Geracao PPTX: Metodologia
## Cliente: Flávio Geres de Jesus
## Visto: EB-2-NIW
## PIPELINE DE 2 ETAPAS
Etapa 1: Voce gera o conteudo estruturado como JSON.
Etapa 2: O script Python generate_pptx.py monta o PPTX profissional.
## REGRAS ABSOLUTAS
- Leia TODOS os arquivos de sistema ANTES de gerar conteudo.
- NAO invente dados. Use APENAS informacoes do perfil e documentos do cliente.
- Cada afirmacao deve ter evidencia. Sem linguagem generica.
- 100% em INGLES para documentos USCIS.
## SISTEMA DE GERACAO
Leia TODOS os arquivos .md em: /Users/paulo1844/Documents/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/METODOLOGIA (PROMPTS)/
Versao: 2.1 | Modelo recomendado: claude-sonnet-4
## DADOS DO CLIENTE
Pasta de documentos: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/VALÉRIA/FLÁVIO GERÊS
Leia todos os documentos de evidencia na pasta do cliente para construir o perfil.
## ETAPA 1: GERAR JSON ESTRUTURADO
Salve o JSON em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/VALÉRIA/FLÁVIO GERÊS/_Forjado por Petition Engine/methodology_Flávio_Geres_de_Jesus_content.json
O JSON DEVE seguir EXATAMENTE esta estrutura:
```json
{
  "client_name": "Flávio Geres de Jesus",
  "visa_type": "EB-2-NIW",
  "doc_label": "Professional Methodology Dossier",
  "title": "Methodology — Comprehensive Analysis",
  "subtitle": "Detailed documentation...",
  "sections": [
    {
      "title": "Section Title (short, impactful)",
      "subtitle": "One-line description for divider slide",
      "slides": [
        {
          "type": "content",
          "title": "Slide Title",
          "paragraphs": ["Paragraph 1...", "Paragraph 2..."],
          "bullets": ["Bullet 1...", "Bullet 2..."]
        },
        {
          "type": "metrics",
          "title": "Key Metrics",
          "metrics": [{"value": "500+", "label": "Clients Reached"}]
        },
        {
          "type": "table",
          "title": "Evidence Summary",
          "headers": ["Criterion", "Evidence", "Impact"],
          "rows": [["Awards", "ABRASCI Chair", "Lifetime honor"]]
        },
        {
          "type": "two_column",
          "title": "Comparison",
          "left": {"heading": "Before", "paragraphs": ["..."]},
          "right": {"heading": "After", "paragraphs": ["..."]}
        },
        {
          "type": "quote",
          "quote": "The actual quote text...",
          "attribution": "Source, Year"
        },
        {
          "type": "process_flow",
          "title": "Methodology Pipeline",
          "steps": [
            {"title": "CHALLENGE", "description": "Problem identified...", "icon": "target"},
            {"title": "SOLUTION", "description": "Method applied...", "icon": "methodology"},
            {"title": "IMPACT", "description": "Result measured...", "icon": "impact"}
          ]
        },
        {
          "type": "icon_grid",
          "title": "Core Pillars",
          "intro_text": "The methodology operates through...",
          "items": [
            {"title": "PILLAR NAME", "description": "Description...", "icon": "innovation"},
            {"title": "PILLAR NAME", "description": "Description...", "icon": "leadership"},
            {"title": "PILLAR NAME", "description": "Description...", "icon": "strategy"}
          ]
        },
        {
          "type": "icon_list",
          "title": "Key Competencies",
          "items": [
            {"title": "COMP NAME", "description": "Description...", "icon": "validation"},
            {"title": "COMP NAME", "description": "Description...", "icon": "research"}
          ]
        },
        {
          "type": "photo_content",
          "title": "Professional Profile",
          "paragraphs": ["Text about the petitioner..."],
          "photo_side": "left"
        }
      ]
    }
  ],
  "client_docs_path": "/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/VALÉRIA/FLÁVIO GERÊS",
  "closing_message": "Comprehensive Documentation Complete"
}
```
### TIPOS DE SLIDE DISPONIVEIS:
- **content**: Titulo + paragrafos + bullets (MAXIMO 3 paragrafos curtos)
- **metrics**: Numeros grandes com labels (tipo 500+ Clients)
- **table**: Tabela com headers e dados
- **two_column**: Duas colunas lado a lado
- **quote**: Citacao em slide escuro
- **process_flow**: Chevrons com icones (Challenge→Solution→Impact). Icones: target, methodology, impact, validation, process, innovation
- **icon_grid**: Grid 3 colunas com icones e cards (tipo pilares). Icones: innovation, leadership, strategy, research, analysis, compliance
- **icon_list**: Lista vertical com icones na esquerda
- **photo_content**: Foto do cliente na esquerda/direita + texto (foto buscada automaticamente na pasta)
### REGRAS DO JSON:
- Minimo 5 sections, cada section com 2-4 slides
- Total esperado: 20-35 slides de conteudo
- Cada section COMECA com section divider (automatico) e TEM slides de conteudo
- VARIE os tipos de slide — NUNCA mais que 2 slides "content" consecutivos
- Use process_flow para mostrar METHOD→RESULT→IMPACT
- Use icon_grid para pilares, competencias, frameworks
- Use photo_content no inicio (perfil profissional) ou em cases
- Use metrics para numeros impactantes
- Paragrafos devem ter 2-3 frases densas MAXIMO (nao paredes de texto)
- Metricas com numeros REAIS do perfil do cliente (nao inventar)
- Tabelas com dados concretos (evidencias, criterios, impacto)
## ETAPA 2: GERAR PPTX
Apos salvar o JSON, execute:
python3 /Users/paulo1844/Documents/OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/scripts/generate_pptx.py --content "/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/VALÉRIA/FLÁVIO GERÊS/_Forjado por Petition Engine/methodology_Flávio_Geres_de_Jesus_content.json" --output "/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/VALÉRIA/FLÁVIO GERÊS/_Forjado por Petition Engine/methodology_Flávio_Geres_de_Jesus.pptx" --type methodology
## POS-GERACAO: SEPARATION OF CONCERNS
Apos gerar, NAO considere finalizado.
Revisao cruzada obrigatoria em SESSAO LIMPA.
Instrucao: /Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md

## REGRAS DE ERRO ATIVAS (AUTO-LEARNING)
Total: 17 regras (12 globais + 5 especificas para methodology)
RESPEITE TODAS. Violacao de regra BLOCK = rejeicao automatica.

- [CRITICAL/BLOCK] Nunca usar "I believe" ou "we believe" em documentos (regex: \b(I|we)\s+believe\b)
- [HIGH/BLOCK] Nunca usar "we think" ou "I think" (regex: \b(I|we)\s+think\b)
- [MEDIUM/AUTO-FIX] Usar "proposed endeavor" (nao "proposed venture" ou "proposed business") (regex: proposed\s+(venture|business))
- [LOW/WARN] Headings devem ser bold e com capitalizacao correta
- [HIGH/BLOCK] Nunca usar "in conclusion" ou "to summarize" (regex: \b(in conclusion|to summarize)\b)
- [MEDIUM/WARN] Evidence blocks devem ter thumbnails de evidencia quando disponiveis
- [CRITICAL/BLOCK] Nunca usar codigos SOC que exigem validacao de diploma nos EUA: Advogado (23-1011), Medico (29-1069), Engenheiro (17-2011+), Contador (13-2011). Usar alternativas: Administrative Services Manager (11-3011), Medical Services Manager (11-9111), Engineering Manager (11-9041), Financial Manager (11-3031). (regex: (23-1011|29-1069|17-201[1-9]|13-2011))
- [HIGH/WARN] Codigos SOC que exigem bacharelado: se o peticionario NAO tem bacharel, nao usar esses codigos. Se o codigo NAO exige bacharel mas o peticionario TEM, tambem pode ser problema. Sempre verificar compatibilidade educacional.
- [CRITICAL/BLOCK] NUNCA usar a palavra PROMPT em documentos de saida (anteprojeto, projeto-base, resume, cover letter). E termo interno do sistema, nao pode aparecer no output do cliente. (regex: \bprompt\b)
- [HIGH/WARN] Output SEMPRE 100% em portugues. Nunca misturar ingles com portugues no mesmo documento. Nomes proprios e termos tecnicos em ingles devem estar em italico mas o texto corrido e 100% PT-BR.
- [HIGH/WARN] Sempre consultar RAGs ANTES de gerar qualquer secao. EB-1: RAGs em EB-1/ (3 docs). EB-2 NIW: RAGs em EB-2 NIW - RAGs/ (11 docs). Especialmente O Adjudicador Algoritmico e a Analise Abrangente de Adjudicacao.
- [CRITICAL/BLOCK] Nunca mencionar PROEX, Carlos Avelino, nomes de outros clientes, Kortix, ou qualquer referencia interna do sistema nos documentos de saida. (regex: (PROEX|Kortix|Carlos Avelino))
- [CRITICAL/BLOCK] Methodology MUST demonstrate causal nexus: METHOD → RESULT → IMPACT. Each section must show HOW the methodology produces measurable outcomes, not just describe what it is.
- [CRITICAL/BLOCK] Methodology must include QUANTIFIABLE metrics for each phase/component — number of clients, revenue impact, time savings, success rates. Generic claims like 'significant improvement' are BLOCKED. (regex: \b(significant|considerable|notable|substantial)\s+(improvement|impact|contribution|growth)\b)
- [HIGH/WARN] Methodology must map EACH component to a specific EB criterion or Dhanasar prong. Unmapped components are wasted pages that USCIS ignores.
- [HIGH/WARN] Methodology must include third-party validation — peer review, academic citation, industry adoption by named organizations. Self-validation is NOT sufficient for USCIS.
- [HIGH/WARN] Methodology PPTX must have minimum 20 slides with varied types (content, metrics, table, two_column, quote). Under 20 slides = insufficient documentation.
