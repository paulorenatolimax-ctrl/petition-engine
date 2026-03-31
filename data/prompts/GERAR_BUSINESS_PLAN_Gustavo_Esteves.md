# Instrucao de Geracao: Business Plan
## Cliente: Gustavo Esteves
## Visto: EB-2-NIW
## REGRAS ABSOLUTAS
- Output SEMPRE .docx (python-docx). NUNCA .md, NUNCA texto puro.
- Leia TODOS os arquivos de sistema ANTES de escrever codigo.
- Instrucoes estrategicas — NAO invente parametrizacoes.
## SISTEMA DE GERACAO
Leia TODOS os arquivos .md em: /Users/paulo1844/Documents/OMNI/_IMIGRAÇÃO/BP Orquestrador/BP_SYSTEM_V3/
Versao: 6.0 | Modelo recomendado: claude-opus-4
## DADOS DO CLIENTE
Pasta de documentos: /Users/paulo1844/Documents/OMNI/Coisas Gizele
Leia todos os documentos de evidencia na pasta do cliente para construir o perfil.
## OUTPUT
Crie a pasta se nao existir: /Users/paulo1844/Documents/OMNI/Coisas Gizele/_Forjado por Petition Engine/
Gere o documento .docx final e salve em: /Users/paulo1844/Documents/OMNI/Coisas Gizele/_Forjado por Petition Engine/
Naming: business_plan_Gustavo_Esteves.docx
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
Total: 25 regras (12 globais + 13 especificas para business_plan)
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
- [HIGH/WARN] Infograficos gerados por IA (Canva, Gemini, matplotlib) SEMPRE devem ter dados revisados antes de incorporar no documento. Nunca confiar nos dados default — substituir por dados reais da planilha financeira.
- [HIGH/BLOCK] Notas de rodapé insuficientes em Business Plans. Cada seção com dados de mercado precisa ter referências numeradas [1][2][3] com fonte verificável (BLS, Census, IBISWorld)
- [HIGH/WARN] Parágrafos com mais de 1200 caracteres devem ser divididos em sub-parágrafos ou ter tabela/quadro visual inserido entre eles para melhorar legibilidade
- [CRITICAL/BLOCK] Seções sem conteúdo após o heading são proibidas. Heading seguido imediatamente por outro heading indica conteúdo ausente que precisa ser preenchido
- [CRITICAL/BLOCK] Tradução literal incorreta proibida. Nunca usar pé quadrado — usar metros quadrados (documento em português) ou square feet (contexto americano)
- [CRITICAL/BLOCK] Gráficos e infográficos devem ter TODOS os labels em INGLÊS. Títulos como Receita Bruta devem ser Gross Revenue, Lucro Líquido deve ser Net Income
- [CRITICAL/BLOCK] Footer CONFIDENTIAL — EVENTFINOPS LLC — Business Plan 2026 deve aparecer em TODAS as páginas do documento sem exceção
- [HIGH/WARN] Cada seção do Business Plan precisa de mínimo 300-500 palavras de conteúdo denso. Seções com menos de 50 palavras são inaceitáveis
- [HIGH/BLOCK] EventFinOps LLC é o nome legal da empresa. S-Corporation é a eleição fiscal (Form 2553). São coisas diferentes — esclarecer no texto quando mencionar ambas
- [CRITICAL/BLOCK] Cada número de seção (1.1, 2.3, etc.) deve aparecer UMA ÚNICA VEZ no documento. Numeração duplicada é proibida
- [CRITICAL/BLOCK] Toda tabela precisa de parágrafo introdutório (mínimo 2 frases) ANTES e parágrafo analítico (mínimo 1 frase com insight) DEPOIS. Tabelas nuas são proibidas
- [CRITICAL/BLOCK] Seção Localização do Negócio deve ter parágrafos íntegros sem linhas quebradas ou dados desconectados
- [CRITICAL/BLOCK] Seções Público-Alvo B2C e B2B devem ter formatação consistente. Hashtags e headings markdown soltos no meio do texto são proibidos
