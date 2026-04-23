# Instrução de Geração: SaaS Evidence Architect v2.0
## Cliente: Bruna Accioly Pereira Peloso
## Visto: EB-2-NIW
## Pasta raiz de documentos: `/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/VALÉRIA/Bruna Accioly Pereira Peloso/`
## Pasta de saída: `/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/VALÉRIA/Bruna Accioly Pereira Peloso/_Forjado por Petition Engine/`

## ⛔ ORDEM DE EXECUÇÃO OBRIGATÓRIA

**Antes de qualquer coisa**, ler INTEGRALMENTE:

1. **Template oficial v2.0:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/data/prompts/GERAR_SAAS_EVIDENCE_TEMPLATE.md` — 8 passos sequenciais com gates bloqueantes
2. **Architect V2:** `/Users/paulo1844/Documents/5_Z GLOBAL/Z_PROMPTS/SAAS (PROMPTS)/SaaS_Evidence_Architect_V2.md` — 488 linhas, playbook completo
3. **Pipeline JSON:** `/Users/paulo1844/Documents/3_OMNI/_IMIGRAÇÃO/Sistema Automatizado/petition-engine/systems/pipelines/saas-evidence.json` — definição formal das fases

Seguir os 8 passos do template. Cada passo tem GATE — se falha, não prossegue.

**Ponto crítico histórico (sintoma real): DOCX final só pode ser gerado APÓS:**
1. LOVABLE_BUILD_SPEC.md estar rico (≥200 linhas, 7 páginas detalhadas, Phase 7 V2 completa)
2. Operador ter colado LOVABLE_BUILD_SPEC no Lovable e gerado o SaaS
3. Operador ter salvo a URL do deploy em `lovable_url.txt`
4. Playwright ter capturado ≥10 screenshots PNG em `screenshots/SaaS_NN_*.png`

**Sem isso, o DOCX fica com placeholders `[SCREENSHOT_XX]` sem imagens — INVÁLIDO.**

## REGRAS ABSOLUTAS
- Output FINAL = DOCX com screenshots injetados (≥10 inline_shapes). Bytes ≥ 300KB.
- Leia TODOS os arquivos de sistema ANTES de escrever codigo.
- Instrucoes estrategicas — NAO invente parametrizacoes.
- ACENTUAÇÃO PORTUGUESA É INEGOCIÁVEL (para docs em PT-BR): EXEMPLOS DE VIOLAÇÃO: "introducao" (→ introdução), "peticao" (→ petição), "informacao" (→ informação), "certificacao" (→ certificação), "area" (→ área), "tambem" (→ também), "ja" (→ já), "ate" (→ até), "nao" (→ não), "sera" (→ será), "apos" (→ após), "servico" (→ serviço), "codigo" (→ código), "negocio" (→ negócio), "gestao" (→ gestão), "analise" (→ análise). Se sair sem acentos = REJEIÇÃO AUTOMÁTICA.
- SEGREDO INDUSTRIAL — NUNCA expor infraestrutura interna no documento:
  - NUNCA mencionar RAG, RAG I, RAG II, RAG III, repositorio de argumentacao, base de conhecimento
  - NUNCA mencionar Petition Engine, Forjado por, gerado automaticamente, gerado por IA/Claude/sistema
  - NUNCA mencionar Obsidian, formato .md, markdown, ferramentas de producao, pipeline
  - NUNCA incluir versao (V1, V2, V3), Separation of Concerns, Quality Gate, auto-learning no documento
  - NUNCA incluir disclaimers tipo DOCUMENTO INTERNO, Rascunho, Para Revisao
  - NUNCA incluir glossarios de ferramentas internas (RAG I = tal coisa)
  - O documento DEVE parecer produzido por ESPECIALISTA HUMANO experiente, NAO por sistema automatizado
- TERMINOLOGIA ADMINISTRATIVA — NUNCA usar linguagem juridica/advocaticia:
  - NUNCA: equipe juridica, advogado, escritorio de advocacia, representacao legal, traducao juramentada
  - USAR: equipe tecnica, consultor/especialista, consultoria, suporte tecnico, traducao certificada
  - USCIS eh processo ADMINISTRATIVO. NUNCA: tribunal, juiz, sentenca, julgamento, litigio

## REGRAS ESPECÍFICAS PARA SAAS EVIDENCE (OBRIGATÓRIO)

Seguir integralmente o template `GERAR_SAAS_EVIDENCE_TEMPLATE.md` e o Architect V2. Em particular:

- **LOVABLE_BUILD_SPEC.md deve ter ≥200 linhas** e conter as 7 seções da Phase 7 V2 (WHAT TO BUILD + TECH STACK + COLOR PALETTE com hex `#1B2A4A` + `#B8860B` + TYPOGRAPHY Inter/JetBrains Mono + 7 PAGES TO BUILD uma a uma + DATA TO SHOW + DESIGN PRINCIPLES + CRITICAL RULES). Validador bloqueia se < 200 linhas ou faltar alguma seção.
- **Adaptar cada seção ao produto ESPECÍFICO da Bruna** — NÃO usar template genérico. Módulos, métricas, terminologia, paleta de dados mock devem vir do domínio real dela.
- **Pricing page bate EXATO com product_spec.md.**
- **Footer em toda página do SaaS:** "Methodology by Bruna Accioly | Proprietary Framework".
- **Dashboard inclui seção "Research Updates" ou "Methodology Evolution"** mostrando ongoing contribution da beneficiária.
- **NUNCA "self-service"** sem "expert-guided" / "supervised deployment". **NUNCA "automated"** sem "under the beneficiary's quality framework".
- **SEM LOVABLE_BUILD_SPEC.md com essas características o pipeline PARA no Gate 4.**

## SISTEMA DE GERACAO
Leia TODOS os arquivos .md em: /Users/paulo1844/Documents/5_Z GLOBAL/Z_PROMPTS/SAAS (PROMPTS)/
Versao: 2.0 | Modelo recomendado: claude-sonnet-4
## DADOS DO CLIENTE
Pasta de documentos: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/VALÉRIA/Bruna Accioly Pereira Peloso 
Leia todos os documentos de evidencia na pasta do cliente para construir o perfil.
## OUTPUT
Crie a pasta se nao existir: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/VALÉRIA/Bruna Accioly Pereira Peloso /_Forjado por Petition Engine/
Gere o documento .docx final e salve em: /Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_1. APIÁRIO (QUARTA PARTE)/VALÉRIA/Bruna Accioly Pereira Peloso /_Forjado por Petition Engine/
Naming: saas_evidence_Bruna_Accioly.docx
## POS-GERACAO: SEPARATION OF CONCERNS
Apos gerar o documento, NAO considere finalizado.
O documento DEVE passar por revisao cruzada em SESSAO LIMPA.
Instrucao: /Users/paulo1844/Documents/Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md

## PROTOCOLO ANTI-ALUCINACAO (OBRIGATORIO — EXECUTAR ANTES DE ESCREVER)

### Passo 0: INVENTARIO DE EVIDENCIAS
ANTES de escrever qualquer linha do documento:
1. Faca ls -la RECURSIVO na pasta de documentos do cliente
2. Liste CADA arquivo de evidencia com: nome, tipo (diploma, certificado, artigo, premio, etc.), tamanho
3. Para CADA evidence block que voce pretende criar, mapeie o arquivo EXATO que sera referenciado
4. Se um arquivo nao existe na pasta, NAO crie evidence block para ele
5. NUNCA use a mesma evidencia em 2 lugares diferentes do documento
6. GERAR thumbnail_map.json JUNTO com o DOCX: para CADA exhibit, registrar {exhibit_number, description, pdf_path} com caminho ABSOLUTO do arquivo de evidencia. NUNCA deixar pdf_path vazio ou description como Unknown.

### Passo 0.03: CROSS-VALIDATION (CARTAS DE TESTEMUNHO)
Se estiver gerando cartas de testemunho/recomendacao:
1. Ler TODOS os documentos da pasta do cliente (CV, certificados, declaracoes RH, contratos, premiacoes, publicacoes)
2. Ler TODOS os Profiles dos recomendadores (LinkedIn PDF, CV)
3. Ler o Quadro de Informacoes e o Projeto Base
4. CRUZAR datas: se o recomendador diz "nos conhecemos em 2005" mas o certificado e de 2003, e ERRO
5. CRUZAR empresas: se diz "trabalhamos juntos na X" mas os CVs mostram que as datas nao batem, e INCONSISTENCIA
6. INCORPORAR dados que o recomendador ESQUECEU mas que estao nos documentos (premiacoes, certificados, resultados)
7. Se existirem Tentativas anteriores (Tentativa 1, 2, 3), ler TODAS e pegar o melhor de cada uma
8. Definir MATRIZ DE PRISMAS antes de escrever: cada carta endossa um angulo DIFERENTE (lideranca, tecnico, mentoria, impacto, visao estrategica) mas TODAS ratificam resultados

### Passo 0.05: CODIGO SOC ESCAMOTEADO
O numero do codigo SOC (ex: 11-3021, 11-9041.00) SO aparece no CABECALHO do documento.
No corpo do texto, usar APENAS as keywords/tarefas do codigo de forma NATURAL e organica.
NUNCA escrever o numero do codigo no meio de um paragrafo.

### Passo 0.1: VERIFICACAO DE CREDENCIAIS
Para CADA pessoa mencionada no documento (peticionario, recomendadores, parceiros):
1. Liste as credenciais que voce ENCONTROU nos documentos (diploma, certificacao, titulo)
2. NAO adicione NENHUMA credencial que nao esteja nos documentos — ZERO tolerancia para alucinacao
3. Se nao tem certeza se a pessoa tem MBA/PhD/certificacao, NAO MENCIONE

### Passo 0.2: VALIDACAO DE DATAS
A tabela de experiencia profissional DEVE ir ate a data ATUAL (2026).
Se o peticionario esta ativo em uma empresa, a data final e "Presente".

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
Total: 43 regras (42 globais + 1 especificas para saas_evidence)
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
- [CRITICAL/BLOCK] ANTI-CRISTINE V2: NUNCA usar termos que provem que o endeavor funciona SEM o beneficiário. Lista expandida: 'standardized/padronizado', 'operates autonomously', 'self-sustaining/auto-sustentável', 'plug-and-play', 'train-the-trainer', 'white-label/marca branca', 'client autonomy', 'founder dependency: low', 'scalable without the founder', 'replicable by any professional', 'turnkey solution/chave-na-mão'. Esses termos DESTROEM Prong 3. (regex: \b(standardized|padronizado|operates autonomously|self-sustaining|auto-sustent|plug.and.play|train.the.trainer|white.label|marca branca|client autonomy|founder dependency|scalable without|replicable by any|turnkey|chave.na.m)\b)
- [HIGH/WARN] NUNCA usar 'consultoria' ou 'consulting' isolado em documentos EB-2 NIW — dispara flag no sistema VIBE/Dun & Bradstreet do USCIS. Usar: 'prestação de serviços técnicos especializados' ou 'soluções baseadas em metodologia proprietária'. (regex: \b(consultoria|consulting)\b)
- [CRITICAL/BLOCK] PROIBIÇÃO DE HISTÓRICO PROCESSUAL: JAMAIS mencionar negativa anterior, denial, RFE anterior, petição anterior, refile, segunda tentativa. Mencionar histórico planta dúvida no oficial. Toda petição = ORIGINAL. (regex: \b(denial|negativa anterior|RFE anterior|previous petition|prior filing|refile|segunda tentativa|nova submissão|petição anterior|corrected approach|lessons learned from denial)\b)
- [CRITICAL/BLOCK] PROEX é CONSULTORIA, NÃO escritório de advocacia. NUNCA usar terminologia jurídica/advocatícia. Substituir: 'equipe jurídica' → 'equipe técnica', 'advogado' → 'consultor', 'escritório de advocacia' → 'consultoria especializada', 'representação legal' → 'suporte técnico'. (regex: \b(equipe jur[ií]dica|advogado|escrit[oó]rio de advocacia|representa[çc][aã]o legal|assessoria jur[ií]dica|departamento jur[ií]dico|parecer jur[ií]dico|consultar? (um |o |seu )?advogado|orientação jurídica|acompanhamento jurídico)\b)
- [CRITICAL/BLOCK] USCIS é processo ADMINISTRATIVO, NÃO judicial. NUNCA usar terminologia de tribunal. Substituir: 'tribunal' → 'USCIS/processo administrativo', 'juiz' → 'oficial de imigração/adjudicador', 'sentença' → 'decisão administrativa', 'julgamento' → 'adjudicação'. (regex: \b(tribunal|ju[ií]z|senten[çc]a|julgamento|vara|processo judicial|a[çc][aã]o judicial|litígio|litigante|jurisdi[çc][aã]o|corte|instância judicial|recurso judicial)\b)
- [CRITICAL/BLOCK] NUNCA usar 'tradução juramentada'. O termo correto é 'tradução certificada' (certified translation). Tradução juramentada é conceito brasileiro que NÃO existe no sistema americano. USCIS aceita 'certified translation' por qualquer tradutor competente. (regex: \b(tradu[çc][aã]o juramentada|tradutor juramentado|tradutor p[uú]blico|tradu[çc][aã]o oficial|sworn translation)\b)
- [CRITICAL/BLOCK] NUNCA expor RAGs ou documentos internos de pesquisa nos documentos do cliente. RAG I, RAG II, RAG III são infraestrutura interna — o cliente NUNCA deve saber que existem. Glossários de referências internas são PROIBIDOS. (regex: \b(RAG I|RAG II|RAG III|RAG \d|RAGs|documento.? interno.? de pesquisa|base de conhecimento jurídico|repositório de argumentação)\b)
- [CRITICAL/BLOCK] NUNCA mencionar Petition Engine, Forjado por Petition Engine, ou qualquer referência ao sistema de geração nos documentos. O documento deve parecer produzido por especialista humano, não por sistema automatizado. (regex: \b(Petition Engine|Forjado por|gerado automaticamente|gerado por (IA|AI|Claude|sistema)|sistema de gera[çc][aã]o|auto-generated|machine.generated)\b)
- [CRITICAL/BLOCK] NUNCA mencionar Obsidian, formato .md, markdown, ferramentas de produção, ou meta-informação de processo interno. O cliente recebe o PRODUTO FINAL, nunca sabe como foi feito. (regex: \b(Obsidian|formato \.md|markdown|arquivo \.md|Notion|ferramenta de produ[çc][aã]o|pipeline de gera[çc][aã]o)\b)
- [CRITICAL/BLOCK] NUNCA incluir meta-informação de versionamento ou processo nos documentos do cliente. Nada de 'Versão 3.0 — Descontaminada', 'Revisada (SoC aplicado)', 'Para Revisão', 'Rascunho Interno'. O documento é FINAL, ponto. (regex: (Vers[aã]o:? \d|V\d\.\d|Descontaminad|Separation of Concerns|SoC aplicado|Para Revis[aã]o|Rascunho Interno|DOCUMENTO INTERNO|Revis[aã]o cru[sz]ada|Quality Gate|auto.learning))
- [CRITICAL/BLOCK] ANTI-ALUCINAÇÃO DE CREDENCIAIS: ANTES de mencionar QUALQUER credencial (MBA, PhD, certificação, título, diploma, fellowship) de QUALQUER pessoa no documento, VERIFICAR se essa credencial existe nos documentos do cliente. Se não existir nos arquivos fonte, NÃO MENCIONAR. ZERO tolerância para credenciais inventadas. Cada credencial citada DEVE ter rastreabilidade a um documento específico na pasta do cliente.
- [CRITICAL/BLOCK] INVENTÁRIO OBRIGATÓRIO DE EVIDÊNCIAS: ANTES de gerar résumé ou cover letter, fazer ls completo da pasta de evidências do cliente e criar inventário (nome arquivo → tipo → seção destino). Cada evidence block DEVE referenciar o arquivo EXATO. NUNCA inferir qual evidência vai onde pelo nome — ABRIR e verificar conteúdo.
- [CRITICAL/BLOCK] VALIDAÇÃO CRUZADA THUMBNAIL: Após inserir CADA thumbnail no documento, verificar: (1) o arquivo de imagem existe, (2) o nome do arquivo corresponde à seção, (3) a descrição do evidence block bate com o conteúdo visual do arquivo. Se uma evidência aparece em mais de um lugar, é ERRO — cada evidência aparece UMA VEZ no documento.
- [HIGH/BLOCK] DATAS DE EXPERIÊNCIA ATUALIZADAS: A tabela de experiência profissional DEVE cobrir até a data ATUAL (2026), não parar em anos anteriores. Se o peticionário está ativo em uma empresa, a data final é 'Presente' ou '2026'. NUNCA truncar experiência.
- [CRITICAL/BLOCK] ZERO PLACEHOLDERS NO OUTPUT: O documento FINAL não pode conter [VERIFICAR], [TODO], [INSERIR], [PENDENTE], [TBD], [XXX], ou qualquer placeholder. Se um dado não está disponível nos documentos do cliente, OMITIR a seção inteira — NUNCA deixar placeholder. (regex: \[(VERIFICAR|TODO|INSERIR|PENDENTE|TBD|XXX|COMPLETAR|PREENCHER)\])
- [CRITICAL/BLOCK] DESCRIÇÃO DEVE BATER COM EVIDÊNCIA: Se um evidence block descreve 'Smart Cities e Cuidado de Pessoas' mas a figura é de outro assunto, é ERRO CRÍTICO. A descrição textual do evidence block DEVE corresponder ao conteúdo real do documento/imagem referenciado. Na dúvida, LER o documento antes de descrever.
- [HIGH/BLOCK] PAGINAÇÃO OBRIGATÓRIA: Todo résumé e cover letter DEVE ter footer com 'Page X of Y' e identificação do documento. Header/footer NUNCA podem estar vazios. Documento sem paginação é AMADOR e será rejeitado.
- [HIGH/BLOCK] EXHIBIT NUMBERING SEQUENCIAL: Todo evidence block DEVE ter número de Exhibit (Exhibit 1, Exhibit 2, etc.) sequencial. Ao final do documento DEVE haver um Exhibit Index. Documento sem numeração de exhibits impossibilita cross-reference com o dossiê físico.
- [CRITICAL/BLOCK] RÉSUMÉ NUNCA CITA CARTAS DE RECOMENDAÇÃO: Résumé e cartas são documentos PARALELOS e INDEPENDENTES. O résumé JAMAIS deve referenciar 'conforme carta de...', 'como atestado por...', 'segundo recomendação de...'. São fluxos separados do dossiê. O que PODE aparecer no résumé são FATOS e IMPACTOS que o cliente informou no Quadro de Informações — dados próprios dele, não testemunhos de terceiros. (regex: \b(conforme carta|como atestado|segundo recomenda|carta de recomenda|recommendation letter|support letter|as attested by)\b)
- [HIGH/BLOCK] INFERÊNCIA TÉCNICA OBRIGATÓRIA EM EVIDENCE BLOCKS: Cada evidence block DEVE ter 3 camadas: (1) O QUE fez (fato), (2) O QUE isso DEMONSTRA (inferência técnica — qual capacidade/competência isso prova), (3) POR QUE isso importa para o endeavor proposto (nexo causal). Bloco que só diz 'ela fez X' sem inferência é RASO e será rejeitado.
- [HIGH/WARN] KEYWORDS DO SOC NATURALIZADAS NO TEXTO: As tarefas e competências do código SOC/O*NET devem ser TECIDAS organicamente nos parágrafos de experiência profissional. Não como lista, não como citação, mas como descrição natural do que o peticionário FAZ. Ex: em vez de 'conforme SOC 11-3021, gerencia sistemas', escrever 'coordenou a implementação e supervisão de sistemas de informação para...'.
- [CRITICAL/BLOCK] THUMBNAIL MAP OBRIGATÓRIO NA GERAÇÃO: Ao gerar résumé ou cover letter, o gerador DEVE produzir um thumbnail_map.json JUNTO com o DOCX contendo para CADA exhibit: {exhibit_number, description, pdf_path (caminho absoluto do arquivo de evidência na pasta do cliente)}. O gerador TEM acesso à pasta de evidências — deve fazer ls, identificar cada arquivo, e mapear para o exhibit correto. Thumbnail map com 'Unknown' ou pdf_path vazio = FALHA DE GERAÇÃO.
- [HIGH/WARN] TAXONOMIA DE CARTAS — 2 tipos DISTINTOS: (1) CARTA DE TESTEMUNHO = PASSADO. Sobre resultados, impactos, métricas, efeitos do trabalho do peticionário. Quem escreve: colegas, supervisores, clientes, beneficiários que VIRAM o trabalho. Foco: 'o que aconteceu depois do igual' — quantitativo, métrico, inferências técnicas e nexos causais. (2) CARTA SATÉLITE = FUTURO. Sobre demanda de mercado, interesse em contratar/parceria/investir. Quem escreve: potencial cliente, potencial parceiro estratégico, potencial investidor. Foco: 'o que vai acontecer quando ele chegar nos EUA'. NUNCA confundir os dois tipos. NUNCA chamar carta de testemunho de 'satélite'.
- [CRITICAL/BLOCK] CROSS-VALIDATION EXAUSTIVA EM CARTAS DE TESTEMUNHO: ANTES de escrever qualquer carta, cruzar TODOS os documentos da pasta do cliente: CV do peticionário, CV/Profile do recomendador, certificados, declarações de RH, quadro de informações. Cada DATA mencionada na carta DEVE bater com os documentos. Ex: se o recomendador diz 'nos conhecemos em 2005 no curso de Excel' mas o certificado do curso é de 2003, é ERRO. Se diz 'trabalhamos juntos na Coca-Cola' mas o CV do recomendador mostra que ele só entrou na empresa em 2009 e o peticionário saiu em 2007, é INCONSISTÊNCIA que o oficial VAI pegar. TUDO tem que bater com TUDO.
- [CRITICAL/BLOCK] LEITURA HOLÍSTICA OBRIGATÓRIA: O gerador de cartas NÃO pode ler só o quadro de informações. Deve ler TODOS os documentos da pasta do cliente de capa a capa: certificados, diplomas, declarações de RH, contratos, fotos, premiações, publicações, CV do peticionário, Profiles dos recomendadores. Somente após leitura COMPLETA é que começa a escrever. Dados que o recomendador ESQUECEU de mencionar mas que estão nos documentos DEVEM ser incorporados na carta (ex: uma premiação que está no certificado mas que o recomendador não citou no quadro de informações).
- [HIGH/BLOCK] PRISMA ÚNICO POR CARTA: Cada carta de testemunho DEVE ter um ÂNGULO ESPECÍFICO e DIFERENTE das demais do batch. Uma endossa liderança/mentoria, outra capacidade técnica específica, outra visão estratégica, outra impacto quantitativo, outra transformação organizacional. MAS TODAS devem SEMPRE ratificar resultados e impacto do trabalho — o ângulo muda, o fundamento (resultados) é constante. Definir a matriz de prismas ANTES de escrever qualquer carta.
- [HIGH/WARN] CONSOLIDAÇÃO DE TENTATIVAS: Quando existirem múltiplas tentativas de cartas na pasta do cliente (Tentativa 1, 2, 3 etc.), o gerador DEVE: (1) ler TODAS as tentativas, (2) identificar os melhores fatos/métricas de cada uma, (3) identificar a melhor estrutura narrativa, (4) identificar inferências que nenhuma captou mas que estão nos documentos, (5) produzir 1 carta definitiva que aglutina o melhor. NUNCA ignorar tentativas anteriores — elas contêm trabalho prévio valioso.
- [HIGH/BLOCK] DESIGN PREMIUM OBRIGATÓRIO EM CARTAS: Cada carta DEVE ter design profissional premium — NÃO é texto corrido num Word em branco. Referência: cartas da Mariana Kasza (ultra-sofisticadas). Cada carta com font, cor, header, estrutura, alinhamento ÚNICOS. O formatting-catalog-v3.md tem 20 fonts, 12 headers, 10 tabelas, 10 assinaturas disponíveis. Carta que parece 'feita pelo filho de 8 anos' = REJEIÇÃO.
- [CRITICAL/BLOCK] SaaS Evidence, Metodologia e Declaração de Intenções JAMAIS podem conter termos imigratórios: petition, petitioner, EB-2, NIW, EB-1, USCIS, immigration, visa, I-140, green card, adjudicator, Dhanasar, Kazarian, extraordinary ability, national interest waiver. Esses documentos são Product Dossiers para CLIENTES e INVESTIDORES — o oficial de imigração NÃO pode desconfiar que foram feitos pra ele. (regex: \b(petition|petitioner|EB-2|EB-1|NIW|USCIS|immigration|visa|I-140|green.card|adjudicator|Dhanasar|Kazarian|extraordinary.ability|national.interest.waiver)\b)
