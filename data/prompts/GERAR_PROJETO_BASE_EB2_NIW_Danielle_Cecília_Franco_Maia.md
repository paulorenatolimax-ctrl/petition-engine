# PROJETO-BASE EB-2 NIW
## Cliente: Danielle Cecília Franco Maia
## Visto: EB-2-NIW

## REGRAS ABSOLUTAS
- Output SEMPRE em .md (para Obsidian). NUNCA .docx para anteprojeto/projeto-base.
- 100% em PORTUGUÊS com ACENTUAÇÃO CORRETA OBRIGATÓRIA. NUNCA escrever sem acentos (ex: "introducao" errado → "introdução" correto). Usar ção, ções, ão, ões, é, ê, á, í, ú, ã, õ em TODAS as palavras que exigem.
- NUNCA usar a palavra "PROMPT" no output. É termo interno.
- NUNCA mencionar PROEX, Kortix, nomes de outros clientes.
- NUNCA usar códigos SOC que exigem validação de diploma nos EUA (advogado 23-1011, médico 29-1069, engenheiro 17-201X, contador 13-2011). Usar alternativas.
- NUNCA propor endeavors genéricos como "consultoria" ou "assessoria". USCIS tende a negar.
- Verificar compatibilidade educacional do código SOC com formação do peticionário.
- NUNCA pare para perguntar nada. DECIDA e execute autonomamente.

## SISTEMA DE GERAÇÃO
Leia TODOS os arquivos .md em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-2 - ESTRATÉGIAS/
Versão: 1.0

## RAGs OBRIGATÓRIOS (LEIA ANTES DE GERAR)
Leia TODOS os arquivos em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_(RAGs) - ARGUMENTAÇÃO (ESTUDO)_LINKS QUE REFORÇAM/2025/EB-2 NIW - RAGs/
Atenção especial para:
- "II - (EB-2 NIW) - Analise Abrangente da Adjudicação" — padrões de negação
- "O Adjudicador Algorítmico - 2026.pdf" — como AI do USCIS avalia petições
- "Construindo o Caso EB-2 NIW para 2026" — guia de arquitetura de prova

## BENCHMARK (leia como referência de qualidade)
Anteprojeto Thayse: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/LILIAN/Thayse/Anteprojeto Thayse.pdf
Projeto-Base Thayse: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/LILIAN/Thayse/Projeto-Base Completo - Thayse Sopper Boti Cei - EB-2 NIW.pdf

## DADOS DO CLIENTE
Pasta de documentos: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/VALÉRIA/Danielle Cecília Franco Maia
Leia TODOS os documentos do cliente (CV, certificados, evidências) ANTES de gerar.
IMPORTANTE: Existe um Anteprojeto EB-2 NIW na pasta do cliente (PDF). Leia-o PRIMEIRO para extrair o endeavor recomendado.

## ENDEAVOR E CÓDIGO SELECIONADOS
Endeavor escolhido: NÃO PRÉ-SELECIONADO.
INSTRUÇÃO: Leia o Anteprojeto EB-2 NIW da Danielle que está na pasta do cliente (PDF) e extraia o endeavor recomendado de lá.
Se o Anteprojeto tiver múltiplas opções, escolha a PRIMEIRA opção recomendada (a mais forte).
NUNCA pare para perguntar — DECIDA e execute.

Código SOC escolhido: NÃO PRÉ-SELECIONADO.
INSTRUÇÃO: Selecione o código SOC/BLS mais adequado ao endeavor escolhido.
Valide compatibilidade educacional com a formação da cliente.
NUNCA usar códigos que exigem validação de diploma nos EUA (23-1011, 29-1069, 17-201X, 13-2011).

Execute TODOS os prompts do sistema (1-9 para EB-2) focando EXCLUSIVAMENTE no endeavor extraído do Anteprojeto.

## OUTPUT
Salve o arquivo .md em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/VALÉRIA/Danielle Cecília Franco Maia/_Forjado por Petition Engine/
Nome: Projeto_Base_EB2_NIW_Danielle_Cecília_Franco_Maia.md

## PESQUISA WEB OBRIGATÓRIA
ANTES de gerar o documento, faça pesquisas na web para garantir dados ULTRA-ATUALIZADOS:
- Pesquise Executive Orders e Policy Alerts da USCIS de 2025-2026
- Pesquise dados BLS/Census mais recentes para o setor do cliente
- Pesquise políticas federais relevantes para o proposed endeavor
- Use WebSearch e WebFetch para acessar fontes oficiais (uscis.gov, bls.gov, federalregister.gov)
- Integre dados encontrados no documento com citação de fonte e data
- Os RAGs locais são a BASE — a pesquisa web COMPLEMENTA com dados em tempo real

## REGRAS DE ERRO ATIVAS (AUTO-LEARNING)
Total: 12 regras (12 globais + 0 específicas para projeto_base_eb2_niw)
RESPEITE TODAS. Violação de regra BLOCK = rejeição automática.

- [CRITICAL/BLOCK] Nunca usar "I believe" ou "we believe" em documentos (regex: \b(I|we)\s+believe\b)
- [HIGH/BLOCK] Nunca usar "we think" ou "I think" (regex: \b(I|we)\s+think\b)
- [MEDIUM/AUTO-FIX] Usar "proposed endeavor" (não "proposed venture" ou "proposed business") (regex: proposed\s+(venture|business))
- [LOW/WARN] Headings devem ser bold e com capitalização correta
- [HIGH/BLOCK] Nunca usar "in conclusion" ou "to summarize" (regex: \b(in conclusion|to summarize)\b)
- [MEDIUM/WARN] Evidence blocks devem ter thumbnails de evidência quando disponíveis
- [CRITICAL/BLOCK] Nunca usar códigos SOC que exigem validação de diploma nos EUA: Advogado (23-1011), Médico (29-1069), Engenheiro (17-2011+), Contador (13-2011). Usar alternativas: Administrative Services Manager (11-3011), Medical Services Manager (11-9111), Engineering Manager (11-9041), Financial Manager (11-3031). (regex: (23-1011|29-1069|17-201[1-9]|13-2011))
- [HIGH/WARN] Códigos SOC que exigem bacharelado: se o peticionário NÃO tem bacharel, não usar esses códigos. Se o código NÃO exige bacharel mas o peticionário TEM, também pode ser problema. Sempre verificar compatibilidade educacional.
- [CRITICAL/BLOCK] NUNCA usar a palavra PROMPT em documentos de saída (anteprojeto, projeto-base, résumé, cover letter). É termo interno do sistema, não pode aparecer no output do cliente. (regex: \bprompt\b)
- [HIGH/WARN] Output SEMPRE 100% em português. Nunca misturar inglês com português no mesmo documento. Nomes próprios e termos técnicos em inglês devem estar em itálico mas o texto corrido é 100% PT-BR.
- [HIGH/WARN] Sempre consultar RAGs ANTES de gerar qualquer seção. EB-2 NIW: RAGs em EB-2 NIW - RAGs/ (11 docs). Especialmente O Adjudicador Algorítmico e a Análise Abrangente de Adjudicação.
- [CRITICAL/BLOCK] Nunca mencionar PROEX, Carlos Avelino, nomes de outros clientes, Kortix, ou qualquer referência interna do sistema nos documentos de saída. (regex: (PROEX|Kortix|Carlos Avelino))
