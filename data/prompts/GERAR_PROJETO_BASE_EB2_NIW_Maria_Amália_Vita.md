# PROJETO-BASE EB-2 NIW
## Cliente: Maria Amália Vita
## Visto: EB-2-NIW

## REGRAS ABSOLUTAS
- Output SEMPRE em .md (para Obsidian). NUNCA .docx para anteprojeto/projeto-base.
- 100% em PORTUGUES. Nunca misturar ingles com portugues.
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
Pasta de documentos: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/AMÁLIA
Leia TODOS os documentos do cliente (CV, certificados, evidencias) ANTES de gerar.

## ENDEAVOR E CODIGO SELECIONADOS
Endeavor escolhido: EventFinOps LLC - Gestao de Operacoes Financeiras para Eventos
Codigo SOC escolhido: 11-9111.00 Medical and Health Services Managers
Execute TODOS os prompts do sistema (1-9 para EB-2 ou 1-4 para EB-1) focando EXCLUSIVAMENTE neste endeavor.

## OUTPUT
Salve o arquivo .md em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/AMÁLIA/_Forjado por Petition Engine/
Nome: Projeto_Base_EB2_NIW_Maria_Amália_Vita.md

## REGRAS DE ERRO ATIVAS (AUTO-LEARNING)
Total: 12 regras (12 globais + 0 especificas para projeto_base_eb2_niw)
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
