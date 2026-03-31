# Instrucao de Geracao: Cartas Satélite EB-1A
## Cliente: André Luiz Cerbasi de Almeida
## Visto: EB-1A
## Empresa: A&A Consultoria de Imagem
## REGRAS ABSOLUTAS
- Output SEMPRE .docx (python-docx). NUNCA .md, NUNCA texto puro.
- Leia TODOS os arquivos de sistema ANTES de escrever codigo.
- Instrucoes estrategicas — NAO invente parametrizacoes.
## SISTEMA DE GERACAO
Leia TODOS os arquivos .md em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_Sistema Produtor de Cartas EB-1/
Versao: 3.1 | Modelo recomendado: claude-sonnet-4
## DADOS DO CLIENTE
Pasta de documentos: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/ANDRÉ CERBASI (EB-1)
Leia todos os documentos de evidencia na pasta do cliente para construir o perfil.
## OUTPUT
Crie a pasta se nao existir: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/ANDRÉ CERBASI (EB-1)/_Forjado por Petition Engine/
Gere o documento .docx final e salve em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/ANDRÉ CERBASI (EB-1)/_Forjado por Petition Engine/
Naming: satellite_letter_eb1_André_Luiz_Cerbasi_de_Almeida.docx
## POS-GERACAO: SEPARATION OF CONCERNS
Apos gerar o documento, NAO considere finalizado.
O documento DEVE passar por revisao cruzada em SESSAO LIMPA.
Instrucao: /Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md

## INSTRUCOES ESPECIFICAS PARA ESTA GERACAO
Endeavor HÍBRIDO: Endeavor 1 (Executive Image Design) + Endeavor 3 (Corporate Image & Organizational Consulting). SOC 13-1161.00
   Management Analyst. Keywords obrigatórias nas cartas: organizational studies, evaluations, design systems and procedures, work 
  simplification. Narrativa: passado (metodologia Ser/Fazer/Parecer, 500+ clientes, ESPN/Disney, ABRASCI, AICI) → presente        
  (consultoria corporativa estratégica) → futuro (expansão nos EUA com protocolos organizacionais). Ler TODA a pasta incluindo    
  V2_ANTEPROJETO, ESTRATEGIA_CARTAS_REFERENCIA.docx, Quadros dos 4 recomendadores, e LinkedIns. O 5º recomendador (Carlos Maluf VP
   ESPN) será gerado separadamente quando o Quadro estiver disponível.


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
Total: 23 regras (12 globais + 11 especificas para satellite_letter_eb1)
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
- [CRITICAL/BLOCK] CREDENTIAL VERIFICATION: Before writing ANY letter, read LinkedIn/CV of the recommender. NEVER invent universities, certifications, or titles. Every credential must be verified from source documents.
- [CRITICAL/BLOCK] TECHNICAL ENDORSEMENT: Each letter MUST contain at least 1 paragraph where the recommender's SPECIFIC credential validates what they say about the petitioner. Generic endorsements are BLOCKED.
- [HIGH/WARN] HETEROGENEITY: Maximum 2 tables per batch, 1 carta with bullets, 1 with prose, 1 with pull-quotes. No two letters share same font+color+structure. Distribute visual elements across the batch.
- [CRITICAL/BLOCK] NEVER mention: waiver, priority date, I-485, EAD, advance parole, green card, visa, USCIS, immigration, petition in satellite/recommendation letters. (regex: \b(waiver|priority date|I-485|EAD|advance parole|green card|visa|USCIS|immigration|petition)\b)
- [CRITICAL/BLOCK] ANTI-HALLUCINATION: Post-generation scan that cross-references every claim with verified source. Any metric, credential, or fact not traceable to a source document is flagged.
- [HIGH/WARN] UNIQUE ANGLES: Each letter must have a different perspective — supervisor, client, industry expert, future employer, academic peer, collaborator. No two letters from same angle type.
- [CRITICAL/BLOCK] QUADRO DE INFORMAÇÕES OBRIGATÓRIO: Antes de gerar QUALQUER carta, DEVE existir e ser lido o Quadro de Informações do recomendador (arquivo com 'Quadro' no nome). Se não encontrar o Quadro preenchido para um recomendador específico, NÃO gere a carta desse recomendador — informe que falta o Quadro. O Quadro é a FONTE PRIMÁRIA de dados: relação com peticionário, credenciais verificadas, ângulo da carta, métricas específicas. Sem Quadro = alucinação garantida = BLOQUEADO.
- [HIGH/WARN] MÍNIMO 5 RECOMENDADORES: O batch ideal de cartas EB-1A tem 5+ recomendadores com perspectivas diversas (supervisor, cliente, expert, acadêmico, futuro empregador). Se encontrar menos de 5 Quadros preenchidos na pasta do cliente, ALERTAR: 'ATENÇÃO: Apenas N Quadros encontrados. O ideal são 5+ recomendadores. Recomendadores faltantes devem ser identificados e seus Quadros preenchidos antes da geração.'
- [CRITICAL/BLOCK] ESTRATÉGIA BASE OBRIGATÓRIA: Antes de gerar cartas, DEVE existir um documento de estratégia na pasta (nomes possíveis: 'estrategia', 'strategy', 'core business', 'serviços', 'mercados-alvo', 'plano estrategico'). Contém: core business, serviços oferecidos, mercados-alvo. SEM ESTE DOCUMENTO = BLOQUEAR e informar: 'Falta documento de Estratégia Base. Sem ele, as cartas não terão direcionamento estratégico.' EXCEÇÃO: usuário explicitamente autoriza avançar sem.
- [CRITICAL/BLOCK] CV/LINKEDIN DE CADA RECOMENDADOR OBRIGATÓRIO: Para CADA recomendador, DEVE existir um PDF de CV ou LinkedIn na pasta. Sem CV/LinkedIn = NÃO gera carta desse recomendador. Informar: 'Falta CV/LinkedIn de [nome]. Sem verificação de credenciais, a carta será alucinação.' EXCEÇÃO: usuário explicitamente autoriza avançar sem.
- [CRITICAL/BLOCK] CÓDIGO SOC/OCUPAÇÃO OBRIGATÓRIO: O peticionário DEVE ter código SOC definido (no perfil do cliente ou nos documentos). Sem código SOC = BLOQUEAR e informar: 'Falta código de ocupação SOC. As cartas precisam alinhar com a classificação ocupacional.' EXCEÇÃO: usuário explicitamente autoriza avançar sem.
