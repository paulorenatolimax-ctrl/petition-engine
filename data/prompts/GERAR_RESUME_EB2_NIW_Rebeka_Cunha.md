# Instrucao de Geracao: Résumé EB-2 NIW
## Cliente: Rebeka Cunha
## Visto: EB-2-NIW
## REGRAS ABSOLUTAS
- Output SEMPRE .docx (python-docx). NUNCA .md, NUNCA texto puro.
- Leia TODOS os arquivos de sistema ANTES de escrever codigo.
- Instrucoes estrategicas — NAO invente parametrizacoes.
- ACENTUAÇÃO PORTUGUESA É INEGOCIÁVEL (para docs em PT-BR): EXEMPLOS DE VIOLAÇÃO: "introducao" (→ introdução), "peticao" (→ petição), "informacao" (→ informação), "certificacao" (→ certificação), "area" (→ área), "tambem" (→ também), "ja" (→ já), "ate" (→ até), "nao" (→ não), "sera" (→ será), "apos" (→ após), "servico" (→ serviço), "codigo" (→ código), "negocio" (→ negócio), "gestao" (→ gestão), "analise" (→ análise). Se sair sem acentos = REJEIÇÃO AUTOMÁTICA.

## REGRAS ESPECIFICAS PARA RESUME (CRITICO — V2.0 Premium)
- BENCHMARKS: Thiago (61 imgs, 78 tabelas, 54pg) e Andre Cerbasi (37 imgs, 48 tabelas)
- HEADER: Tabela Navy (#2D4F5F) 1x2 colunas — nome esquerda, contato direita. TODAS as paginas.
- FOOTER: "Page X of Y" alinhado direita, Arial 9pt cinza #666666. SEM barra navy no footer.
- MARGENS: 0.59" laterais, ~0.4" topo. NAO 1" padrao. Margens estreitas = visual premium.
- SECTION HEADERS: Barra Navy full-width com texto branco centralizado, 11pt Bold.
- EVIDENCE BLOCKS: Tabela 2 colunas — metadata ESQUERDA (5797 DXA), thumbnail DIREITA (4743 DXA).
  Thumbnail da 1a pagina do PDF de evidencia. Gerar com PyMuPDF/fitz.
  Se PDF nao encontrado: placeholder "[THUMBNAIL — Evidence X]" em italico cinza.
- FONT: Arial em TODO o documento. 14pt nome, 11pt secao, 10pt corpo, 9pt contact.
- COR: Titulos Navy #2D4F5F (NAO preto). Corpo preto. Secundario #333333. Terciario #666666.
- CONCISAO: Max 18K chars. Description & Impact = 2-3 paragrafos MAX.
- BOXES INSTITUCIONAIS: Fundo #F5F5F5, borda #CCCCCC, texto 9.5pt italic #333333.
- Apos gerar: rodar QUALITY_REVIEWER.md (script de QA obrigatorio no sistema).

## SISTEMA DE GERACAO
Leia TODOS os arquivos .md em: /Users/paulo1844/Documents/AIOS_Petition Engine/EB2_NIW_RESUME_SYSTEM/
Versao: 2.0 | Modelo recomendado: claude-sonnet-4
## DADOS DO CLIENTE
Pasta de documentos: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/REBEKA CUNHA Paulo AJUSTE
Leia todos os documentos de evidencia na pasta do cliente para construir o perfil.
## OUTPUT
Crie a pasta se nao existir: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/REBEKA CUNHA Paulo AJUSTE/_Forjado por Petition Engine/
Gere o documento .docx final e salve em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/REBEKA CUNHA Paulo AJUSTE/_Forjado por Petition Engine/
Naming: resume_eb2_niw_Rebeka_Cunha.docx
## POS-GERACAO: SEPARATION OF CONCERNS
Apos gerar o documento, NAO considere finalizado.
O documento DEVE passar por revisao cruzada em SESSAO LIMPA.
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
Total: 13 regras (13 globais + 0 especificas para resume_eb2_niw)
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
- [CRITICAL/BLOCK] ACENTUAÇÃO OBRIGATÓRIA: Todo documento em português DEVE ter acentos corretos. NUNCA 'introducao' (correto: 'introdução'), NUNCA 'peticao' (correto: 'petição'), NUNCA 'informacao' (correto: 'informação'). Se o output vier sem acentos, é REJEIÇÃO AUTOMÁTICA. Instruir explicitamente no prompt: 'Use acentuação portuguesa completa: ção, ções, ão, ões, é, ê, á, í, ú, ã, õ'. (regex: \b(introducao|peticao|informacao|certificacao|formacao|avaliacao|ocupacao|operacao|integracao|migracao|capacitacao|micropigmentacao)\b)
