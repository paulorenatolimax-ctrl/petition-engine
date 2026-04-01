# Instrucao de Geracao PPTX: Declaração de Intenções
## Cliente: Leandro Borges
## Visto: EB-2-NIW
## Empresa: New Providence Financial
## PIPELINE DE 2 ETAPAS
Etapa 1: Voce gera o conteudo estruturado como JSON.
Etapa 2: O script Python generate_pptx.py monta o PPTX profissional.
## REGRAS ABSOLUTAS
- Leia TODOS os arquivos de sistema ANTES de gerar conteudo.
- NAO invente dados. Use APENAS informacoes do perfil e documentos do cliente.
- Cada afirmacao deve ter evidencia. Sem linguagem generica.
- 100% em INGLES para documentos USCIS.
## SISTEMA DE GERACAO
Leia TODOS os arquivos .md em: /Users/paulo1844/Documents/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Declaração de Intenções (PROMPTS)/
Versao: 2.1 | Modelo recomendado: claude-sonnet-4
## DADOS DO CLIENTE
Pasta de documentos: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/MILENA/LEANDRO BORGES
Leia todos os documentos de evidencia na pasta do cliente para construir o perfil.
## ETAPA 1: GERAR JSON ESTRUTURADO
Salve o JSON em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/MILENA/LEANDRO BORGES/_Forjado por Petition Engine/declaration_of_intentions_Leandro_Borges_content.json
O JSON DEVE seguir EXATAMENTE esta estrutura:
```json
{
  "client_name": "Leandro Borges",
  "visa_type": "EB-2-NIW",
  "doc_label": "Professional Declaration of Intentions Dossier",
  "title": "Statement of Intentions — Strategic Declaration",
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
  "client_docs_path": "/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/MILENA/LEANDRO BORGES",
  "closing_message": "Comprehensive Documentation Complete"
}
```
### TIPOS DE SLIDE DISPONIVEIS (10 tipos):
- **content**: Title bar navy + paragrafos + bullets (MAX 3 paragrafos curtos)
- **metrics**: Cards navy com numeros gold grandes (KPIs, stats)
- **table**: Tabela profissional navy header + alternating rows
- **comparison**: Lado a lado (Antes/Depois, Convencional/Inovador)
- **quote**: Citacao elegante em slide navy escuro
- **process_flow**: Pipeline horizontal com circulos numerados, setas gold, cards. steps: [{num, title, body}]
- **hub_spoke**: Circulo central + 4 cards ao redor. hub_text + cards: [{metric, title, description}]
- **icon_cards**: Grid 2x3 de cards numerados com circulos dourados. items: [{title, description}]
- **timeline**: Linha horizontal com dots e cards. milestones: [{year, title, description}]
- **two_column**: Alias para comparison
### DESIGN DNA (OBRIGATORIO):
- Fontes: Palatino Linotype (titulos, headings) + Garamond (corpo, bullets)
- Cores: Navy #1B2A4A (estrutura) | Gold #B8860B (importancia) | Cream #E8D5B7 (footer)
- Title bar: navy 58pt height em todo content slide
- Footer: Garamond 9pt cream em y=367 de todo slide
- Cards: roundRect, gold accent bar 3pt no topo, padding 10pt
- Line spacing: 22pt para body text (generoso, profissional)
### REGRAS DO JSON:
- Minimo 5 sections, cada section com 2-4 slides
- Total esperado: 25-35 slides de conteudo
- VARIE os tipos — NUNCA mais que 2 slides "content" consecutivos
- Use process_flow para METHOD→RESULT→IMPACT (obrigatorio em Metodologia)
- Use hub_spoke para framework central com pilares
- Use icon_cards para competencias, certificacoes, features
- Use timeline para evolucao cronologica
- Use metrics para KPIs e numeros de impacto
- Use comparison para Convencional vs. Proposto
- Paragrafos: MAX 3 frases curtas (NUNCA paredes de texto)
- Metricas com numeros REAIS do perfil do cliente (nao inventar)
- Tabelas com dados concretos (evidencias, criterios, impacto)
## ETAPA 2: GERAR PPTX
Apos salvar o JSON, execute:
python3 /Users/paulo1844/Documents/OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/scripts/generate_pptx_v2.py --content "/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/MILENA/LEANDRO BORGES/_Forjado por Petition Engine/declaration_of_intentions_Leandro_Borges_content.json" --output "/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/MILENA/LEANDRO BORGES/_Forjado por Petition Engine/declaration_of_intentions_Leandro_Borges.pptx" --type declaration
## POS-GERACAO: SEPARATION OF CONCERNS
Apos gerar, NAO considere finalizado.
Revisao cruzada obrigatoria em SESSAO LIMPA.
Instrucao: /Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md

## PESQUISA WEB OBRIGATORIA
ANTES de gerar o documento, faca pesquisas na web para garantir dados ULTRA-ATUALIZADOS:
- Pesquise Executive Orders e Policy Alerts da USCIS de 2025-2026
- Pesquise dados BLS/Census mais recentes para o setor do cliente
- Pesquise politicas federais relevantes para o proposed endeavor
- Se o cliente atua em tecnologia: pesquise regulacoes de AI, GPU, chips, CISA
- Use WebSearch e WebFetch para acessar fontes oficiais (uscis.gov, bls.gov, federalregister.gov)
- Integre dados encontrados no documento com citacao de fonte e data
- Os RAGs locais sao a BASE — a pesquisa web COMPLEMENTA com dados em tempo real

## REGRAS DE ERRO ATIVAS (AUTO-LEARNING)
Total: 17 regras (12 globais + 5 especificas para declaration_of_intentions)
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
- [CRITICAL/BLOCK] Declaration MUST state SPECIFIC proposed endeavor — not generic consulting/advisory. Must name: target industry, geographic scope, method of implementation, timeline.
- [CRITICAL/BLOCK] Declaration must address ALL 3 Dhanasar prongs explicitly: (1) merit and national importance, (2) well-positioned to advance, (3) balance of factors favors waiver. Missing any prong = incomplete.
- [HIGH/WARN] Declaration must demonstrate AUTONOMY — petitioner can advance the endeavor WITHOUT a specific employer/sponsor. If tied to one company, NIW waiver argument is weakened.
- [HIGH/WARN] Declaration PPTX must have minimum 15 slides covering: proposed endeavor, Dhanasar prongs, evidence mapping, autonomy, timeline.
- [CRITICAL/BLOCK] Declaration for EB-1A must NOT reference Dhanasar prongs (exclusive to EB-2 NIW). Use 8 CFR 204.5(h)(3) criteria instead.
