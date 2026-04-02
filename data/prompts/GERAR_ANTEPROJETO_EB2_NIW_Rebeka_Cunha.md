# ANTEPROJETO EB-2 NIW
## Cliente: Rebeka Cunha
## Visto: EB-2-NIW

## REGRAS ABSOLUTAS
- Output SEMPRE em .md (para Obsidian). NUNCA .docx para anteprojeto/projeto-base.
- ACENTUAÇÃO PORTUGUESA É INEGOCIÁVEL. Todo output DEVE ter acentos corretos. EXEMPLOS DE VIOLAÇÃO: "introducao" (correto: introdução), "peticao" (correto: petição), "informacao" (correto: informação), "certificacao" (correto: certificação), "area" (correto: área), "tambem" (correto: também), "ja" (correto: já), "ate" (correto: até), "nao" (correto: não), "sera" (correto: será), "apos" (correto: após), "servico" (correto: serviço), "codigo" (correto: código), "negocio" (correto: negócio), "gestao" (correto: gestão), "analise" (correto: análise). USAR: ção, ções, ão, ões, é, ê, á, í, ú, ã, õ, ç em TODAS as palavras. Se o output sair sem acentos, é REJEIÇÃO AUTOMÁTICA.
- NUNCA usar a palavra "PROMPT" no output. E termo interno.
- NUNCA mencionar PROEX, Kortix, nomes de outros clientes.
- NUNCA usar codigos SOC que exigem validacao de diploma nos EUA (advogado 23-1011, medico 29-1069, engenheiro 17-201X, contador 13-2011). Usar alternativas.
- NUNCA propor endeavors genericos como "consultoria" ou "assessoria". USCIS tende a negar.
- Verificar compatibilidade educacional do codigo SOC com formacao do peticionario.

## SISTEMA DE GERACAO
Leia TODOS os arquivos .md em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-2 - ESTRATÉGIAS/
Versao: 1.0

## RAGs OBRIGATORIOS (LEIA ANTES DE GERAR)
Leia TODOS os arquivos em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/EB-2 NIW - RAGs/
Atencao especial para:
- "II - (EB-2 NIW) - Analise Abrangente da Adjudicacao" — padroes de negacao
- "O Adjudicador Algoritmico - 2026.pdf" — como AI do USCIS avalia peticoes
- "Construindo o Caso EB-2 NIW para 2026" — guia de arquitetura de prova

## BENCHMARK (leia como referencia de qualidade)
Anteprojeto Thayse: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/LILIAN/Thayse/Anteprojeto Thayse.pdf
Projeto-Base Thayse: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/LILIAN/Thayse/Projeto-Base Completo - Thayse Sopper Boti Cei - EB-2 NIW.pdf

## DADOS DO CLIENTE
Pasta de documentos: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/REBEKA CUNHA Paulo AJUSTE
Leia TODOS os documentos do cliente (CV, certificados, evidencias) ANTES de gerar.

## MODO ANTEPROJETO (EXECUCAO PARCIAL)
Execute APENAS os prompts 1-3 do sistema EB-2 NIW.
O output deve conter:
1. Quadro-resumo comparativo com 3 endeavors distintos
2. Para cada endeavor: descricao tecnica, publico-alvo, modelo de receita, projecao Y1/Y2
3. 3 codigos SOC/BLS para cada endeavor (com validacao de compatibilidade educacional)
4. Analise de risco de negacao pelo USCIS para cada endeavor
5. Alinhamento com politicas federais

## OUTPUT
Salve o arquivo .md em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/REBEKA CUNHA Paulo AJUSTE/_Forjado por Petition Engine/
Nome: Anteprojeto_EB2_NIW_Rebeka_Cunha.md

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
Total: 14 regras (13 globais + 1 especificas para anteprojeto_eb2_niw)
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
- [CRITICAL/BLOCK] EB-2 NIW: Oficiais tendem a negar endeavors genericos como consultorias/assessorias. O endeavor precisa ser ESPECIFICO, com produto/servico tangivel, nao generico. Evitar: consulting, advisory, general services.
