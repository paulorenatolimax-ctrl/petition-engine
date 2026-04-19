# SKILL v5 — Sistema Produtor de Cartas de Apoio (EB-1A / EB-2 NIW / O-1)

**Versão:** 5.0 · **Status:** current · **Vigente desde:** 2026-04-19 · **Base empírica:** caso Ricardo Augusto (11 cartas + declaração contador, 4 ciclos v1→v4.1) e caso Mariana Kasza (v1 reverse-engineered) · **Predecessores preservados:** SKILL.md (v1), SKILL_v3.md, SKILL_v4.md (todos em versions/ ou raiz)

Esta versão consolida a engenharia reversa de arsenais reais em um sistema prescritivo executável. Difere de v4 por introduzir: (1) taxonomia explícita de 5 tipos funcionais, (2) 57 regras invisíveis codificadas, (3) 23 anti-padrões IA com regex, (4) 5 prompt masters com checklist, (5) HARD BLOCKS configuráveis por caso, (6) protocolo formal de revisão v1→v5 incluindo final pass.

Se v4 respondia "como escrever uma carta", v5 responde "como produzir um arsenal heterogêneo de 5-12 cartas que sobrevive à auditoria adversarial USCIS".

---

## SEÇÃO 1 — TAXONOMIA DOS TIPOS DE CARTA

O arsenal é estruturado em **cinco tipos funcionais** + **um tipo estrutural auxiliar** (contador). Cada tipo existe porque ataca uma lacuna específica no arsenal Dhanasar que nenhum outro tipo cobre bem. Escolha dos tipos por caso é deliberada a partir da grade de déficits; NÃO é taxonomia genérica.

### Tipo 1 — Testemunho de Passado

**Papel funcional.** Alimenta **Prong 2 (well-positioned)** sustentando que o pleiteante JÁ DEMONSTROU capacidade de executar o endeavor proposto. Não é sobre promessa; é sobre trilha.

**Lacuna coberta.** Só testemunho passado prova competência exercida. Carta de cliente futuro diz "queremos contratá-lo"; de parceiro diz "queremos nos aliar"; de investidor diz "queremos financiar" — nenhuma delas fala do que o pleiteante fez ANTES.

**Estrutura-assinatura:**
- Abertura: identificação pessoal do signatário + base institucional + janela temporal de convivência profissional (ex.: "atuo como engenheiro estrutural em Goiás há mais de cinco décadas")
- Corpo: uma a três cenas técnicas específicas (projeto X, responsabilidade Y, decisão Z) + referências numeradas (ARTs, NFS-e, DOIs, ISBN, BN_Dep, NBR 12655, ACI 440) + juízo qualificado no domínio do depoente
- Fechamento: formalização institucional (carimbo, CREA, empresa, endereço) + linha declarativa curta

**Tom dominante.** Formal-técnico, **testemunhal em primeira pessoa**, próximo de endosso pericial brasileiro. Evita hipérbole ("excepcional", "extraordinário", "único") mas não evita autoridade.

**Inputs obrigatórios (schema):**
- Nome completo + credencial regulatória (CREA/PE) + empresa + relação temporal com pleiteante (anos exatos, co-projetos específicos)
- 1-3 cenas técnicas verificáveis (nome do projeto, decisão de engenharia, norma invocada)
- Referências numeradas (ART nº, DOI, ISBN, NFS-e, publicação)
- Função institucional atual (diretor, sócio, ex-diretor, presidente de conselho)
- Língua (PT-BR para depoentes brasileiros; EN para depoentes estrangeiros)

**Formatação visual diferenciadora.** BR: cabeçalho corporativo do emissor, fonte serifada (Times/Garamond), tabela de identificação do signatário no pé, data por extenso ("Goiânia, __ de ______________ de 2026"). US: Letterhead US, data curta "April 17, 2026", estrutura de carta de recomendação profissional americana.

**Vocabulário próprio:** "atuar como responsável técnico", "no exercício de minhas funções", "coautor", "ART sob nº", "parecerado", "declaração de ciência", "dano-presumido", "carga empírica", "fonte primária", "endosso na condição profissional", "subscrevo o presente", "registre-se". Exclusivo deste tipo (NÃO aparece em outros): "parecerado", "presidência setorial", "jurisdição do TRT".

### Tipo 2 — Potencial Cliente Futuro

**Papel funcional.** Alimenta **Prong 1 (national importance)** demonstrando DEMANDA SUBSTANTIVA do mercado US pelo endeavor proposto. Se três perfis distintos de comprador querem contratar o serviço hoje, o examinador conclui que o endeavor tem pressão de mercado real.

**Lacuna coberta.** Cartas de testemunho provam competência passada no Brasil. Cartas de cliente futuro provam demanda presente nos EUA.

**Estrutura-assinatura:**
- Abertura: identificação do comprador (HOA, commercial portfolio, general contractor) + gatilho regulatório ou comercial específico (SB 4-D FL, LL 126 NY, NBIS, FDOT, IIJA, FEMA)
- Corpo: descrição do escopo desejado + fit argumentado em 3 grounds (production record, federal-aid compliance literacy, signing-engineer bench) + proposta operacional (walk-through, visita confidencial, engagement letter)
- Fechamento: intenção não vinculante (non-binding letter of intent), sujeita a due diligence e procurement rules

**Tom dominante.** Formal-comercial em inglês de setor (B2B US). Sem exuberância; clima de procurement sóbrio.

**Inputs obrigatórios (schema):**
- Tipo de comprador (HOA / commercial / public infra general contractor)
- Gatilho regulatório específico do nicho
- Escopo técnico desejado (milestone inspection, retrofit, field QC, owner-side reporting)
- Canal PE US via signing engineer (License nº obrigatória) — ground 3 obrigatório
- Três motivos operacionais distintos para a referência cruzada

**Formatação visual diferenciadora.** Letterhead sóbrio em inglês. Data topo direito formato US. Corpo sem tabelas exceto identificação final. Sans-serif corporativo (Calibri/Helvetica).

**Vocabulário próprio:** "structural engineering engagement" (NÃO "structural advisory"), "specialty structural scope", "signing-engineer bench", "owner-side technical reporting", "milestone inspection", "federal-aid compliance", "walk-through", "non-binding letter of intent", "procurement rules", "due diligence". **Jamais:** "advisory", "consulting", "sub-consulting" (HARD BLOCK).

### Tipo 3 — Potencial Parceiro Estratégico Futuro

**Papel funcional.** Alimenta **Prong 3 (balance — beneficial to waive labor certification)** demonstrando que agentes econômicos de peso preferem parceria com o pleiteante à rota de labor-certification de mercado aberto. Parceria de igual-pra-igual é argumento diferente de contratação.

**Lacuna coberta.** Cliente futuro = "queremos comprar de você". Parceiro = "queremos integrar com você". A combinação pleiteante+signatário gera valor que nenhum dos dois gera sozinho.

**Estrutura-assinatura (BR):**
- Reafirmação de trajetória comum no passado (legitimador)
- Proposta de parceria técnica (ponte de transferência de know-how)
- Cláusulas operacionais (% divisão, forma jurídica, scope)
- Assinaturas em linhas paralelas

**Estrutura-assinatura (US):**
- Recitais (WHEREAS): estado atual do mercado + capacidade instalada + demanda regulatória + atributos do pleiteante
- Cláusulas (ARTICLE): scope, divisão de responsabilidades, governança, termos financeiros placeholder
- Assinaturas dual com espaço para data
- IN WITNESS WHEREOF no fechamento

**Tom dominante.** BR: institucional de acordo entre firmas. US: contratual-jurídico americano.

**Inputs obrigatórios (schema):**
- Histórico de relacionamento prévio (se houver) — legitima a parceria
- Jurisdição da parceria (BR | US | cross-border)
- Forma jurídica proposta (JV, contrato de representação, acordo operacional)
- Scope técnico (o que cada lado contribui)
- Canal regulatório (CREA lado BR, License US lado US)

**Formatação visual diferenciadora.** BR: cabeçalho institucional, português, estrutura de ofício. US: letterhead corporativo, inglês, WHEREAS/ARTICLE com numeração romana. Linhas de assinatura bem marcadas (`_______________`).

**Vocabulário próprio:** "parceria estratégica", "transferência de know-how", "intercâmbio técnico", "acordo operacional" (PT); "joint venture", "WHEREAS", "ARTICLE FIRST/SECOND/…", "in witness whereof", "general-practice caseload", "owner-side engineering", "design-of-record signatory" (EN).

### Tipo 4 — Potencial Investidor Futuro

**Papel funcional.** Alimenta os **TRÊS prongs simultaneamente** com peso máximo no Prong 1 (national importance — o mercado endossa com dinheiro) e Prong 3 (waiver — capital privado prefere apoiar o pleiteante especificamente). É a única carta do arsenal que toca os três prongs de forma forte.

**Lacuna coberta.** Cliente compra; parceiro integra; investidor aporta capital. Capital privado é o sinal mais caro e portanto mais crível para o examinador.

**Estrutura-assinatura:**
1. Abertura institucional (Family Office identifica-se)
2. Teses de investimento (por que este mercado? por que agora? por que este pleiteante?)
3. TAM/SAM/SOM com números (ex.: ARTBA 373B, IIJA 40B, FEMA 11:1)
4. Tabela de allocation (% por vertical)
5. Envelope de capital explícito em USD (mínimo US$ 50,000 seed)
6. Condições (confirmatory diligence, milestones)
7. Revenue projections table
8. Fechamento com placeholders do office principal + signatures

**Tom dominante.** Formal-financeiro em inglês americano de family office. Mistura de due diligence sóbria com entusiasmo contido. Próximo de Private Placement Memorandum (PPM) simplificado. Sem hyperbole ("we are extremely excited") mas também sem burocracia morta.

**Inputs obrigatórios (schema):**
- Nome do family office ou entidade investidora
- Endereço + contato (placeholder quando dado não existe)
- Thesis (quais teses macro justificam o aporte)
- Market sizing com fontes verificáveis
- Envelope numérico (default US$ 50,000 seed)
- Governance structure (board seat, observer, advisory)
- Tranche structure (seed + Series A; milestones)

**Formatação visual diferenciadora.** Letterhead Family Office (placeholder). Tipografia clean sans-serif. Abundância de tabelas (7 tabelas — revenue projection, allocation matrix, TAM/SAM/SOM, milestones, governance, signature block). Footer com disclaimer discreto. Cores neutras (grayscale + um acento frio).

**Vocabulário próprio:** "envelope (indicative)", "deployable across Seed + Series A", "confirmatory diligence", "principal-led, specialty signing-engineer team", "build-out", "TAM/SAM/SOM", "downside case", "allocation matrix", "milestone triggers", "governance", "board observer", "co-investment". **Jamais:** "advisory" (HARD BLOCK mesmo em contexto financeiro neste caso).

### Tipo 5 — Declaração de Contador (auxiliar estrutural)

**Papel funcional.** Peça que AUTENTICA a posição institucional do pleiteante como CEO/proprietário de empresa brasileira em período declarado. Não é argumento Dhanasar direto; é evidência documental de que a narrativa de capacidade gerencial tem respaldo contábil.

**Lacuna coberta.** Nenhuma outra carta é emitida por profissional com autoridade regulatória de confirmar posse societária.

**Estrutura-assinatura:**
- Cabeçalho institucional do contador (nome, CRC)
- Declaração objetiva (pleiteante é/foi CEO/sócio/administrador da empresa X no período Y)
- Assinatura + carimbo + CRC
- **APÊNDICE OBRIGATÓRIO** com fundamentação legal:
  - Código Civil Brasileiro — Artigo 1.179
  - NBC TP 01
  - Lei nº 10.406/2002 (Código Civil) — Artigo 1.180
  - Decreto-Lei nº 9.295/1946 — Artigo 25

**Tom dominante.** Jurídico-contábil brasileiro. Linguagem de cartório. Primeira pessoa do contador.

**Formatação visual diferenciadora.** Cabeçalho contábil sóbrio. Cor-âncora azul-marinho (#0B2E4F). Fonte default. APÊNDICE separado visualmente (título centralizado, subtítulo em itálico, citações recuadas).

**Vocabulário próprio:** "declaração de autonomia", "responsável técnico contábil", "em conformidade com NBC TP 01", "escrituração contábil regular", "perícia contábil".

---

## SEÇÃO 2 — 57 REGRAS INVISÍVEIS (8 CATEGORIAS)

Regras aplicadas empiricamente nas revisões mas nunca escritas explicitamente. Esta seção as codifica. Meta de enforcement: subset ≥40 regras mecanicamente verificáveis.

### Categoria A — Heterogeneidade Visual (anti-ATLAS)

"ATLAS" = padrão detectável quando todas as N cartas saem iguais (mesma fonte, estrutura de data, header, footer). Examinador bate o olho e identifica produção em massa.

**A1.** Cada carta tem layout de cabeçalho distinto. *Por quê:* quebra heurística "template único". *Enforcement:* validator compara headers; flag se ≥3 cartas compartilham geometria.

**A2.** Datas aparecem em posição variável — não sempre no topo. *Enforcement:* randomização controlada entre `{top-left, top-right, body-paragraph-1, closing}`.

**A3.** Nem toda carta tem Page X of Y. *Por quê:* cartas curtas (<2.5K chars) sem paginação parecem mais humanas. *Enforcement:* só inserir PAGE/NUMPAGES se `paragraph_count >= 25`.

**A4.** Fontes diferentes por origem cultural. BR testemunho → serifada (Times/Garamond, tradição cartorial). US corporativo → sans-serif. US family office → sans-serif clean. *Enforcement:* mapa `type → font_palette`.

**A5.** Paletas de cor distintas por tipo. *Enforcement:* lookup `color_palette[letter_type]`.

**A6.** Presença ou ausência de logo corporativo condicional. Firma com identidade visual = logo. HOA/commercial owner/GC = placeholder sem logo. *Enforcement:* `logo_required = type in {testemunho_passado, parceiro}`.

**A7.** Linhas de assinatura variam entre tabular (BR testemunho), linha simples (US testemunho), dual paralela (parceiro US). *Enforcement:* `signature_block_style[type]`.

**A8.** Número de tabelas varia de zero a sete. L06 = 0 tabelas. L05 = 5. L11 = 7. Carta IA típica tem 1-2 uniformemente. *Enforcement:* `table_count_target[type]` com jitter.

### Categoria B — Heterogeneidade Textual / Vocabular

**B1.** Cada signatário tem verbo-assinatura próprio. Ex.: "registre-se" (autoridade sênior), "emito o presente endosso na condição profissional de" (engenheiro jovem formal), "subscrevo" (jurista), "parecerado" (assessor). *Enforcement:* `signature_verb_dictionary[author_id]`.

**B2.** Inglês variando entre US-corporate / US-legal-administrativo / US-legal-contratual / US-financial. *Enforcement:* `english_register_map`.

**B3.** Números por extenso em PT vs numerais em EN. PT formal: "cinco décadas". EN corporativo: "17+ years". *Enforcement:* `number_format_by_lang`.

**B4.** Referência a normas varia por papel. Testemunhas → normas técnicas BR/híbridas (NBR, ACI, PTI). Clientes → normas regulatórias US (SB 4-D, LL 126, NBIS, IIJA). Investidor → APENAS volumes financeiros e BCR. *Enforcement:* `norma_whitelist_by_type`.

**B5.** Nenhum sinônimo óbvio repete entre cartas. O pleiteante nunca é "excepcional" em duas cartas. *Enforcement:* `sinonym_deduplication_across_letters`.

**B6.** Datas em formatos diferentes por língua. *Enforcement:* `date_format_by_lang_and_culture`.

**B7.** Cada carta evita nomear os prongs explicitamente. Zero ocorrência de: `national_interest_waiver`, `dhanasar`, `eb-2`, `eb-1`, `i-140`, `immigration`, `visa`, `uscis`, `petition`, `green_card`, `permanent_residency`. *Enforcement:* `forbidden_vocab_scrub`.

### Categoria C — Persona Engineering

**C1.** Abertura pessoal assinada. *Enforcement:* `opening_template_bank[author_id]` com ≥3 variantes.

**C2.** Cena técnica específica. Não "colaboramos em projetos" — mas "fui alocado, sob supervisão direta, como engenheiro de projeto nos blocos C/D da obra X". *Enforcement:* `requires_specific_scene_per_author`.

**C3.** Juízo técnico qualificado no domínio do signatário. Ninguém opina fora da sua cadeira. *Enforcement:* `expertise_domain_lock[author_id]`.

**C4.** Tom emocional varia (pessoal-colegial / frio-comercial / técnico-forense). *Enforcement:* `emotional_register_by_author`.

**C5.** Pontuação e ritmo variam por autor. *Enforcement:* `sentence_length_distribution[author_id]`.

**C6.** Quantidade de "eu" vs "nós" varia por tipo. Testemunho = "eu". Cliente = "we". Investidor = "our family office". *Enforcement:* `pronoun_distribution_by_type`.

**C7.** Fragmentos autobiográficos com medida. 1-2 por carta, não mais. *Enforcement:* `autobio_fragments <= 2`.

### Categoria D — Argumentação Dhanasar Implícita

Jamais citar os prongs pelo nome. Construir as condições que os prongs exigem de forma invisível.

**D1.** Prong 1 (national importance) aparece via tamanho de mercado com números fontados. *Enforcement:* `type=investidor` obriga números de TAM.

**D2.** Prong 2 (well-positioned) aparece via track record. *Enforcement:* `type=testemunho_passado` obriga ≥1 referência regulatória numerada (ART, PE, License).

**D3.** Prong 3 (balance — waiver) aparece via exclusividade funcional (parceria preferencial, capital aportado em pessoa específica). *Enforcement:* `type=parceiro_estrategico` OU `investidor` obriga frase de exclusividade.

**D4.** Nunca "only", "uniquely", "sole" — dizer capability específica. *Enforcement:* `hyperbole_scrub`.

**D5.** Argumentos são layered, não empilhados. UM ponto principal, DOIS secundários. *Enforcement:* `claim_density <= 3`.

**D6.** Evidências aparecem como "como demonstrado por" não "prova que". *Enforcement:* `evidentiary_register scrub de "proves that", "demonstrates conclusively"`.

### Categoria E — Evidências Específicas

**E1.** Todo número vem com fonte. "$373B" → "ARTBA 373B". *Enforcement:* `number_without_source → flag`.

**E2.** ARTs sempre com número completo (≥10 dígitos). *Enforcement:* `regex ART\s*[A-Z]*\s*\d{10,}`.

**E3.** DOIs como links funcionais formato completo `10.xxxx/yyyy`. *Enforcement:* DOI pattern.

**E4.** ISBN com dígito verificador. *Enforcement:* `isbn_13_validator`.

**E5.** Volumes em unidade métrica + contexto. "3.000m CFRP, NFS-e nº 3" nunca "muito CFRP". *Enforcement:* `quantity_requires_unit`.

**E6.** Datas de projeto em intervalo fechado. "Fev/2014 a Jul/2017" em vez de "mais de três anos". *Enforcement:* `date_interval_preferred`.

**E7.** Publicação com editora + ano + ISBN + depósito BN quando existir. *Enforcement:* `publication_metadata_completeness`.

**E8.** Casos de jurisprudência com tribunal + número. *Enforcement:* `jurisprudence_ref_complete`.

### Categoria F — Formatação por Tipo

**F1.** Testemunho BR obriga tabela de identificação no fechamento.
**F2.** Testemunho US obriga License PE explícito.
**F3.** Cliente futuro obriga gatilho regulatório US.
**F4.** Parceiro US obriga estrutura WHEREAS/ARTICLE.
**F5.** Investidor obriga tabela de alocação.
**F6.** Investidor obriga envelope numérico em USD explícito (não "adequate funding").
**F7.** Contador obriga APÊNDICE legal com 4 citações.
**F8.** Bilíngue obriga paridade substantiva EN/PT (não só tradução — paridade de fatos).

### Categoria G — Tom por Audiência

**G1.** Examinador USCIS é 2ª audiência silenciosa. Todo texto sobrevive à leitura paranoica. *Enforcement:* `adversarial_read_pass`.

**G2.** Counsel do pleiteante é 3ª audiência. Frases categóricas ("is the only") são risco. *Enforcement:* `categorical_claim_scrub`.

**G3.** Tom nunca é defensivo. *Enforcement:* `defensive_register_scrub`.

**G4.** Tom nunca é vendedor de carro. *Enforcement:* `sales_tone_scrub`.

**G5.** Elogios têm amarra empírica. *Enforcement:* `praise_without_evidence → flag`.

### Categoria H — Anti-padrões IA (ver SEÇÃO 4 para as 15 específicas com regex)

Os anti-padrões desta categoria (H1-H15) estão codificados em detalhe na **Seção 4** com regex pattern e substituição recomendada para cada um. São os tells mais fortes de documento gerado por LLM e precisam ser scrubs automáticos antes de qualquer entrega.

---

## SEÇÃO 3 — HARD BLOCKS POR CASO

HARD BLOCKS são vocábulos ou padrões cuja presença = **RFE automático**. Configuráveis por caso (SOC target do pleiteante).

### Default (todos os casos)

- `PROEX` (nome da consultoria do Paulo — não deve aparecer em artefato de cliente)
- `Kortix` (nome interno)
- `Petition Engine`, `Obsidian`, `RAGs` (infraestrutura interna)
- `Carlos Avelino` e outros nomes de clientes que não sejam o do caso corrente
- `prompt`, `template`, `versionamento` (meta-linguagem de produção)

### Caso Ricardo Augusto (SOC 17-2051 Civil Engineers)

Termos que sugerem SOC diferente (não-engenharia) = RFE automático:

| Termo | Motivo | Substituição |
|-------|--------|--------------|
| `advisory` (EN descrevendo serviço) | sugere SOC consultor, não engenheiro | `engineering engagement` / `specialty structural scope` |
| `consulting` (EN descrevendo serviço) | idem | `engineering` |
| `sub-consulting` | idem | `specialty engineering subcontract` |
| `consultoria` (PT em razão social de firma BR como "Hirata Consultoria") | TOLERADO em razão social | (manter) |
| `consultoria` (PT descrevendo serviço) | RFE automático | `engenharia técnica` / `atuação estrutural` |
| `assessoria` (PT descrevendo atuação) | sugere SOC não-engenharia | `engenharia técnica` |
| `padronizado` (PT) | sugere processo standard, não engenharia especializada | `sistematizado`, `metodológico`, `reprodutível` |
| `turnkey` | sugere integração contractor-style, fora de SOC 17-2051 | `specialty engineering engagement` |
| `autossuficiente` (PT) | sugere SOC não-engenharia-especialista | capability específica, remover adjetivo |

### Outros casos

Cada caso novo obriga `hard_blocks/{case_id}.json` com regex de blocos específicos do SOC-target.

---

## SEÇÃO 4 — 23 ANTI-PADRÕES IA (REGEX)

Regex de detecção + substituição recomendada. Scrub obrigatório antes de entrega.

| # | Anti-padrão | Regex detecção | Substituição |
|---|-------------|----------------|--------------|
| AP1 | Abertura GPT genérica | `^(In today's\|In our current\|In an era of)` | Identificação institucional do autor |
| AP2 | Tripartite "X, Y, and Z" | `(\w+, \w+, and \w+)` frequência>2/página | Prosa com evidência |
| AP3 | Voz passiva vaga | `(widely recognized\|well-known\|renowned)` | "signed ART nº…" |
| AP4 | Leverage verb | `\bleverage\b` | "apply", "mobilize", "bring to bear" |
| AP5 | Navigate metafórico | `\bnavigate\b` (contexto formal) | "comply with", "meet requirements of" |
| AP6 | Adjetivos vazios | `(robust\|cutting-edge\|state-of-the-art\|world-class\|unparalleled\|best-in-class)` | Norma específica |
| AP7 | Filler meta-linguístico | `(It is important to note\|It should be noted\|It bears mentioning)` | Cortar inteiro |
| AP8 | Hype vocab | `(dive deep\|delve into\|\bunpack\b\|\bexplore\b)` | "examinar", "rever", "aplicar" |
| AP9 | Over-assertion | `(conclusively\|definitively\|incontrovertibly)` | "provides direct evidence of" |
| AP10 | Hyperbole HARD BLOCK | `(\bunique\b\|\bsole\b\|\bonly\b\|one-of-a-kind\|unparalleled)` | Capability específica |
| AP11 | Abertura template | `^(As an? \w+)` | Identificação específica |
| AP12 | Transition adverbs em início | `^(Moreover\|Furthermore\|Additionally\|In addition)` | Nova frase sem conector |
| AP13 | Frase feita | `(testament to\|a testimony to)` | Dado específico |
| AP14 | Opening cliché | `(honor to write\|privilege to recommend\|pleased to recommend)` | Voz pessoal |
| AP15 | Fechamento template | `^(In conclusion\|In summary\|To summarize)` | Frase declarativa |
| AP16 | Bullet lists em formal | count(`•\|-` em bullet) > 2 por carta | Prosa ou tabela |
| AP17 | Em-dash abusivo | count(`—`) / pages > 4 | Reescrever com pontuação normal |
| AP18 | Sales tone | `(extremely excited\|thrilled\|delighted to)` | "we propose" |
| AP19 | "strategic partnership" vago | `strategic partnership` sem scope na mesma sentença | Add scope específico |
| AP20 | Synergies | `(synerg\w+)` | "complementarity" |
| AP21 | Landscape/ecosystem | `(\blandscape\b\|\becosystem\b\|\bparadigm\b)` | Nome do domínio técnico |
| AP22 | Sintaxe PT calcada em EN | "for the purposes of" (tradução literal "para os fins de") | "to" |
| AP23 | Fechamento burocrático | `remain at your disposal` | Proposta operacional concreta |

---

## SEÇÃO 5 — 5 PROMPT MASTERS

Um por tipo de carta. Dados inputs corretos + persona_bank do caso, cada prompt gera carta no nível de entrega.

### 5.1 Testemunho de Passado

**System prompt:**
```
Você é {author_full_name}, {author_role} na firma {author_firm}, com {author_years}
anos de experiência em {author_domain}. Você conhece o pleiteante {petitioner_name}
pessoalmente através de {relationship_context}. Escreva uma carta de testemunho
profissional em {language} respeitando:
- Voz em primeira pessoa SUA (não do pleiteante)
- Tom formal-técnico, próximo de endosso pericial
- Sem hyperbole ("excepcional", "único", "incomparable" — proibidos)
- Sem jargão imigratório (nunca mencione EB-2, NIW, Dhanasar, USCIS, visa, petition)
- Aplicar hard_blocks do caso (ler hard_blocks/{case_id}.json)
- Cada afirmação com evidência numerada (ART, DOI, ISBN, NFS-e, norma)
- Uma cena técnica concreta em que você e o pleiteante interagiram
- Fechamento com identificação institucional completa
```

**User template:**
```
Autor: {author_full_name} · {author_credential}
Firma: {author_firm}
Pleiteante: {petitioner_name}
Relação: {relationship_type} entre {relationship_period}
Cenas técnicas disponíveis (escolha 1-3): {scenes_list}
Evidências numeradas a incluir: {evidence_numbered}
Juízo técnico no domínio do autor: {domain_judgment}
Idioma: {language}
```

**Estrutura esperada:** Cabeçalho corporativo + parágrafo identificação → 1-3 cenas técnicas → juízo qualificado → fechamento com tabela de identificação.

**Checklist (10):** voz 1ª pessoa do autor / evidências numeradas / zero HARD BLOCK / zero jargão imigratório / cenas específicas / juízo no domínio / data variável / tabela identificação / length 800-1800 / fonte por origem cultural.

### 5.2 Cliente Futuro

**System prompt:**
```
Você é {buyer_institutional_name}, {buyer_role_description} no setor {buyer_sector}
em {buyer_location_us}. Você escreve carta de intenção de contratação não-vinculante
para {petitioner_name}, engenheiro estrutural brasileiro atuando via canal PE US
(design-of-record pela License nº {pe_license_number}). Respeite:
- Tom formal-comercial B2B US
- Gatilho regulatório específico (SB 4-D / LL 126 / NBIS / FDOT / IIJA / FEMA) explícito
- Três grounds distintos para a referência ao pleiteante
- Engineering engagement — NUNCA advisory/consulting/sub-consulting
- Non-binding, sujeito a due diligence e procurement rules
- Sem hyperbole
- Sem Dhanasar/EB-2/NIW/USCIS
```

**Checklist (10):** License PE mencionado / three grounds / zero HARD BLOCK EN / gatilho regulatório US / non-binding framing / data topo US / zero jargão imigratório / {years}+ years declarado / tom B2B sóbrio / length 500-1200.

### 5.3 Parceiro Estratégico

**System prompt:**
```
Você é {partner_institutional_name} ({partner_country: BR|US}). Propõe parceria
estratégica com {petitioner_name}. Estrutura por jurisdição:
- BR: ofício institucional em PT (Destinatário, Corpo, Assinaturas paralelas)
- US: minuta contratual EN (WHEREAS, ARTICLE I-V, IN WITNESS WHEREOF)
Sem HARD BLOCKs. Sem Dhanasar. Scope técnico específico. Canal PE obrigatório no lado US.
```

**Checklist (10):** estrutura correta por jurisdição / scope técnico ambos lados / canal PE se US / zero HARD BLOCK / zero jargão imigratório / linhas assinatura delimitadas / placeholder data / tom contratual / anchors declarados / length 1000-2500.

### 5.4 Investidor Futuro

**System prompt:**
```
Você é {family_office_name}, investidor institucional US analisando tese de aporte
seed em {petitioner_name} / endeavor estrutural. Estilo PPM simplificado (Private
Placement Memorandum). Respeite:
- Tom analytic-sóbrio (não sales)
- Três teses macro (mercado, momento, pleiteante)
- TAM/SAM/SOM com números fontados
- Allocation table por vertical
- Envelope numérico explícito em USD (default US$ 50,000 seed)
- Governance structure (board observer, milestones)
- Non-binding, subject to confirmatory diligence
- Sem HARD BLOCK (inclusive "advisory" neste caso)
```

**Checklist (10):** envelope USD explícito / TAM/SAM/SOM com fontes / allocation table / zero "advisory" / governance explícita / non-binding + diligence / tom analítico / License PE mencionado / anchors declarados / length 2000-4500 + 7 tabelas.

### 5.5 Declaração de Contador

**System prompt:**
```
Você é {accountant_name}, CRC {crc_number}, responsável técnico contábil pelo
pleiteante {petitioner_name} e/ou empresa {company_name} durante período {period}.
Emita declaração objetiva sobre posição societária/CEO + APÊNDICE obrigatório com
4 citações legais:
- Código Civil Brasileiro — Artigo 1.179
- NBC TP 01
- Lei nº 10.406/2002 (Código Civil) — Artigo 1.180
- Decreto-Lei nº 9.295/1946 — Artigo 25
Tom jurídico-contábil. PT-BR. Cabeçalho institucional com CRC visível.
```

**Checklist (8):** CRC visível / APÊNDICE presente / Art. 1.179 citado literal / NBC TP 01 citado / Art. 1.180 citado literal / Decreto-Lei 9.295/1946 Art. 25 literal / período datas exatas / zero jargão imigratório.

---

## SEÇÃO 6 — CHECKLIST DE COMPLETUDE DO ARSENAL

Arsenal Rebeka-grade quando satisfaz:

- [ ] 5 tipos de carta suportados (testemunho / cliente / parceiro / investidor / contador)
- [ ] Persona bank ≥5 vozes por caso
- [ ] HARD BLOCK scrub configurável por caso
- [ ] Anti-ATLAS validator (heterogeneidade visual + textual)
- [ ] Adversarial auditor com 8 critérios
- [ ] Master facts cross-consistency
- [ ] Final pass loop formal (v4→v4.1)
- [ ] Bilíngue (PT-BR + EN) paridade substantiva
- [ ] Formatação por tipo (header, data, footer, tabelas, paleta)
- [ ] 57 regras invisíveis codificadas em validators
- [ ] 23 anti-padrões GPT em regex suite
- [ ] Prong coverage heurística (Dhanasar sem nomear)
- [ ] Evidence bank numerado (ARTs, DOIs, ISBN, BN_Dep, NFS-e, normas)
- [ ] PE channel enforcer (License nº no caso pertinente)

---

## SEÇÃO 7 — PROTOCOLO DE REVISÃO v1→v5

### v1 — Rascunho inicial
Tom de "assistente prestativo". Frequente: vocabulário HARD BLOCK, homogeneidade de abertura, números sem fonte, hyperbole, zero diferenciação visual (ATLAS completo).

### v1 → v2: Persona Engineering
Cada signatário ganha voz distinta. `signature_verb_dictionary` injetado. Primeira passada de `vocab_scrub` (advisory→engineering).

### v2 → v3: Evidências + Formatação por Tipo
Números ganham fontes. Formatação estabilizada por tipo (tabela identificação BR, gatilho regulatório cliente, WHEREAS parceiro, allocation investidor, APÊNDICE contador).

### v3 → v4: Auditoria Estratégica
`adversarial_auditor` roda 8 critérios. Fixes críticos aplicados: HARD BLOCKS remanescentes, placeholders abertos, fatos-âncora ausentes (ex.: "14+ anos" em todas as cartas), License PE em ≥7 cartas do arsenal.

### v4 → v4.1: Final Pass
Últimas correções cirúrgicas que só aparecem com documento quase pronto: APÊNDICE contador completo com 4 citações, envelope investidor em USD concreto (não placeholder), data top-position sorteada, Page X of Y só onde `paragraph_count ≥ 25`.

**Critério de promoção:** v→v+1 só se `adversarial_auditor.verdict == 'GO'` (zero críticos).

---

## MUDANÇAS v4 → v5

| Área | v4 | v5 |
|------|----|----|
| Taxonomia | implícita no texto | **explícita, 5 tipos funcionais** |
| Regras | ~20 dispersas | **57 codificadas em 8 categorias** |
| Anti-padrões IA | menção ad-hoc | **23 com regex + substituição** |
| HARD BLOCKS | lista única embedded | **configurável por caso via `hard_blocks/{case_id}.json`** |
| Prompt masters | ausentes | **5 completos com system+user+checklist** |
| Protocolo revisão | informal | **4 ciclos formais + final pass** |
| Personas | texto livre | **schema `persona_bank[author_id]`** |
| Master facts | ausente | **schema `master_facts[case_id]` com anchors** |

---

**FIM DO SKILL v5.**

Referência canônica da engenharia reversa que originou esta versão: `C.P./RETROSPECTIVA_RICARDO_COWORK.md` (810 linhas, 2026-04-17).
