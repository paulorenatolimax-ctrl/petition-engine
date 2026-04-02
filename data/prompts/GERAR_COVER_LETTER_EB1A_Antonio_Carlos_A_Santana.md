# Instrucao de Geracao: Cover Letter EB-1A
## Cliente: Antonio Carlos A Santana
## Visto: EB-2-NIW
## REGRAS ABSOLUTAS
- Output SEMPRE .docx (python-docx). NUNCA .md, NUNCA texto puro.
- Leia TODOS os arquivos de sistema ANTES de escrever codigo.
- Instrucoes estrategicas — NAO invente parametrizacoes.
- ACENTUAÇÃO PORTUGUESA É INEGOCIÁVEL (para docs em PT-BR): EXEMPLOS DE VIOLAÇÃO: "introducao" (→ introdução), "peticao" (→ petição), "informacao" (→ informação), "certificacao" (→ certificação), "area" (→ área), "tambem" (→ também), "ja" (→ já), "ate" (→ até), "nao" (→ não), "sera" (→ será), "apos" (→ após), "servico" (→ serviço), "codigo" (→ código), "negocio" (→ negócio), "gestao" (→ gestão), "analise" (→ análise). Se sair sem acentos = REJEIÇÃO AUTOMÁTICA.
## SISTEMA DE GERACAO
Leia TODOS os arquivos .md em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/
Versao: 5.0 | Modelo recomendado: claude-sonnet-4
## DADOS DO CLIENTE
Pasta de documentos: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/Antonio Santana
Leia todos os documentos de evidencia na pasta do cliente para construir o perfil.
## OUTPUT
Crie a pasta se nao existir: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/Antonio Santana/_Forjado por Petition Engine/
Gere o documento .docx final e salve em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/Antonio Santana/_Forjado por Petition Engine/
Naming: cover_letter_eb1a_Antonio_Carlos_A_Santana.docx
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
Total: 15 regras (14 globais + 1 especificas para cover_letter_eb1a)
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
- [CRITICAL/BLOCK] SaaS Evidence, Met e Dec NUNCA devem ter 'Version X.X', 'Generated: date', ou 'SaaS Evidence Architect' no documento. São termos internos do sistema. O documento deve parecer produzido profissionalmente pela empresa, não por um gerador automático. (regex: \b(Version \d|Generated:|SaaS Evidence Architect|Petition Engine)\b)
- [CRITICAL/BLOCK] Nunca citar Dhanasar em cover letter EB-1A (exclusivo de EB-2 NIW)
