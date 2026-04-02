# AUDIT V2 — STRATEGIC ASSESSMENT
## Avaliação Estratégica do Ecossistema AIOS/Petition Engine
### Data: 02 de Abril de 2026

**Classificação:** CONFIDENCIAL — Uso interno AIOS  
**Autor:** Claude Opus 4.6 (Senior Strategy Consultant)  
**Base de dados:** 6 auditorias técnicas (Sistemas 1-11), pesquisa de mercado com 17 competidores, análise regulatória USCIS FY2023-2026  
**Score técnico atual do codebase:** 62/100

---

# SUMÁRIO EXECUTIVO

O Petition Engine/AIOS ocupa uma posição única no mercado de immigration tech: é a única plataforma que combina geração completa de petições (Cover Letter + Resume + Estratégia) com Business Plan em um pipeline end-to-end. Nenhum dos 17 competidores analisados oferece essa combinação.

**O mercado está a favor:**
- Software de imigração: $1.5B (2025), CAGR 15% até 2033
- EB-2 NIW approval rate despencou de 80% (FY2023) para 35.7% (Q4 FY2025) — demanda crescente por ferramentas de qualidade
- Volume EB-1A cresceu 56% em um único trimestre (Q4→Q1 FY2025)
- Investimento em legaltech atingiu $5.99B em 2025 (+54% YoY)

**Mas a execução interna está comprometida:**
- 10 falhas críticas identificadas nas auditorias, incluindo erro de framework legal (EB-5 no lugar de EB-2 NIW)
- ~60% de estatísticas fabricadas no sistema de Localização
- Vulnerabilidades de segurança P0 (command injection, zero auth, path traversal)
- 2 caminhos de sistemas quebrados (Cover Letter EB-2 NIW e Business Plan)
- 40% de redundância entre sistemas Cover Letter EB-1A e EB-2 NIW
- Dependência total do Paulo para operar qualquer sistema

**Veredicto:** A vantagem competitiva existe e é real, mas está construída sobre fundações frágeis. Sem resolver os 10 problemas críticos nos próximos 60 dias, o risco de um caso com erro grave (tipo Cristine Correia) é alto, e a oportunidade de mercado será capturada por competidores como Visalaw AI, Parley ou LegalOS.

---

# SEÇÃO A: ANÁLISE COMPETITIVA PROFUNDA

---

## A.1 Escritórios de Advocacia vs AIOS/Petition Engine

### Comparação Feature-by-Feature

| Recurso | WeGreened | Manifest Law | Lisonbee | BAL | Fragomen | **AIOS/Petition Engine** |
|---------|-----------|-------------|----------|-----|----------|--------------------------|
| IA Generativa para Drafting | Não | Não | Não (usa ChatGPT genérico) | Não (RPA apenas) | Não | **SIM — 11 sistemas** |
| Geração de Business Plan | Não | Não | Não | Não | Não | **SIM — 42 seções** |
| Geração de Cover Letter | Não | Não | Não | Não | Não | **SIM — EB-1A v5 + EB-2 NIW v3** |
| Geração de Resume | Não | Não | Não | Não | Não | **SIM — EB-1A + EB-2 NIW** |
| Case Management | Sim (portal) | Sim (portal moderno) | Básico | Cobalt (proprietário) | Connect (170+ países) | **Parcial** (clients.json) |
| Quality Gates Automatizados | Não | Não | Não | Não | Não | **SIM — 77 regras** |
| Evidence Architecture | Manual | Checklists | Manual | Manual | Manual | **SIM — automatizado** |
| Cobertura Geográfica | EUA | EUA | EUA | Global | Global (170+) | **EUA** |
| Volume de Casos | 64K+ histórico | Desconhecido | Baixo | Enterprise (Fortune 500) | ~$947M rev | **~5/mês** |
| Preço/Caso | Honorários full | Honorários full | Honorários full | Enterprise custom | Enterprise custom | **Interno** |

**Análise Crítica:**

**WeGreened** tem 64K casos mas zero automação. Opera com escala humana, não tecnológica. O SEO deles domina buscas orgânicas, mas o conteúdo é repetitivo. Se o Petition Engine atingir qualidade consistente, a vantagem de WeGreened (volume de experiência) pode ser replicada via data flywheel em 2-3 anos.

**Manifest Law** tem o melhor portal de case management entre escritórios. O blog deles com dados USCIS é referência do setor. São o benchmark para UX — o Petition Engine deveria estudar o Case Portal deles antes de construir a interface SaaS.

**BAL** é o único com RPA real em produção (UiPath, 10+ robôs). A classificação automática de SOC codes via ML/NLP é relevante — o Petition Engine faz isso manualmente via prompt. Porém, BAL é 100% enterprise e não compete no segmento EB-1A/NIW individual.

**Fragomen** ($947M revenue, 6.000 profissionais) é irrelevante como competidor direto — são corporate immigration de grande porte. Relevante apenas como referência de o que acontece quando immigration tech escala para $1B.

### Conclusão A.1
Nenhum escritório tem IA generativa para petições. A ameaça não vem de escritórios tradicionais, mas de startups AI-first (Seção A.3). Os escritórios são potenciais CLIENTES do Petition Engine como SaaS B2B.

---

## A.2 Plataformas de Software vs Petition Engine

### Comparação Feature-by-Feature

| Recurso | Docketwise | INSZoom | LawLogix | Envoy Global | Legalpad/Deel | **AIOS/Petition Engine** |
|---------|------------|---------|----------|-------------|---------------|--------------------------|
| Case Management | SIM (core) | SIM (core) | SIM (core) | SIM (core) | SIM | **Básico** (JSON files) |
| Preenchimento Formulários USCIS | SIM (autopreenchimento) | SIM (biblioteca) | SIM (300+ forms) | SIM | SIM | **NÃO** |
| E-Filing USCIS | SIM (direto) | SIM | Não | SIM | SIM | **NÃO** |
| IA Generativa | Não | Não (bot RPA) | Não | SIM (parcial — queries NL) | Não | **SIM (completo)** |
| Geração de Petições | Não | Não | Não | Não | Não | **SIM** |
| Business Plan | Não | Não | Não | Não | Não | **SIM** |
| Compliance/Alertas | Básico | Sim (expirações) | Guardian I-9 | Sim (proativo) | Sim | **Parcial** (error_rules) |
| Integração HRIS | Não | Não | Não | SIM (Workday, BambooHR) | SIM (Deel core) | **NÃO** |
| SOC 2 / Segurança | Desconhecido | Enterprise-grade | TLS 1.2 + MFA | Enterprise | Deel SOC 2 | **ZERO AUTH** |
| Pricing | $69-119/mo | ~$50/mo+ | N/D | Enterprise custom | Deel pricing | **TBD** |
| Funding | ~$3B (8am) | $2.63B (Mitratech) | Hyland backed | $48-60M | Deel $12B+ | **Pre-seed** |

**Análise Crítica:**

**Docketwise** é o benchmark para SMB law firms. Pricing acessível ($69-119/mo), base instalada grande. Parte da 8am ($3B). Mas não gera absolutamente nada — é um formulário preenchedor e case manager. O Petition Engine não compete com Docketwise; COMPLEMENTA. O cenário ideal é integração: Petition Engine gera, Docketwise gerencia e submete.

**INSZoom/Mitratech** ($2.63B total funding) é enterprise-grade mas com UX datada. A aquisição pela Mitratech (24 aquisições) mostra o apetite de consolidação no setor. INSZoom poderia ser acquirer do Petition Engine em horizonte 24-36 meses se o produto atingir traction.

**Envoy Global** é o único software platform com IA generativa parcial. Conversational data access (queries em linguagem natural) é um diferencial. Mas é 100% corporate e não gera petições individuais. O LBO recente (Feb/2025) com expansão para África mostra que o mercado está em M&A ativo.

**Legalpad/Deel** — a aquisição pela Deel ($12B+ valuation) em 2022 valida que empresas de tech estão dispostas a comprar immigration tech. O Petition Engine como target de aquisição é plausível se atingir $300K-$1M ARR.

### Conclusão A.2
As plataformas de software são case managers e form fillers. Nenhuma gera conteúdo narrativo. O Petition Engine precisa de case management (que não tem), e as plataformas precisam de geração de conteúdo (que não tem). A estratégia correta é INTEGRAÇÃO, não competição.

---

## A.3 Startups Emergentes de IA

### Comparação Feature-by-Feature

| Recurso | Visalaw AI | Parley (YC S24) | Imagility | Alma | Filevine ImmiAI | LegalOS (YC W26) | **AIOS/Petition Engine** |
|---------|-----------|----------------|-----------|------|-----------------|-------------------|--------------------------|
| Geração de Petição | SIM (20p com appendix) | SIM (drafts completos) | SIM (parcial) | SIM (com advogado) | NÃO (forms) | SIM (48h) | **SIM (completo, 11 sistemas)** |
| Business Plan | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | **SIM (42 seções, 55-65p)** |
| Cover Letter Completa | SIM (genérica) | SIM (genérica) | Parcial | Com advogado | NÃO | SIM | **SIM (68K palavras, critério-by-critério)** |
| Resume Imigratório | Desconhecido | Desconhecido | Desconhecido | Desconhecido | NÃO | Desconhecido | **SIM (33 evidence blocks)** |
| IMPACTO Econômico | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | **SIM (13 metodologias M1-M13)** |
| Estratégia (Evidence Architecture) | NÃO | Research Agent (parcial) | Predictive analytics | Com advogado | NÃO | Trained on 12K cases | **SIM (EB-1A 10 critérios + EB-2 NIW Dhanasar)** |
| Localização Estratégica | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | **SIM (10 fases, scoring formula)** |
| Metodologia Probatória | NÃO | NÃO | NÃO | NÃO | NÃO | NÃO | **SIM (5 prompts, dossiê fundacional)** |
| Quality Gates | Desconhecido | Desconhecido | Desconhecido | Manual (advogado) | Desconhecido | Desconhecido | **SIM (77 regras automatizadas)** |
| Parceria AILA | **SIM (oficial)** | NÃO | NÃO | NÃO | NÃO | NÃO | **NÃO** |
| SOC 2 | **SIM (Type II)** | Desconhecido | Desconhecido | Desconhecido | Filevine sim | Desconhecido | **NÃO** |
| Funding | N/D | YC S24 | N/D | $5.1M seed | $725M (Filevine) | $500K (YC W26) | **Pre-seed** |
| Pricing | $380/mo (10 petições) | N/D | N/D | $3K-10K/caso | N/D | N/D | **TBD** |

**Análise Crítica:**

**Visalaw AI** é a ameaça mais imediata. Parceria oficial com AILA (15.000-18.000 membros), SOC 2 Type II, drafting de 20+ páginas, $380/mo. A força deles é distribuição (AILA = canal de 15K advogados). A fraqueza: gera drafts GENÉRICOS — não tem a profundidade do AIOS (68K palavras por Cover Letter, 33 evidence blocks por Resume). Se Visalaw melhorar a profundidade, se torna ameaça existencial. **Prazo estimado para atingir paridade:** 12-18 meses.

**Parley (YC S24)** integra em Word/Google Docs (menor fricção de adoção que uma plataforma web separada). O Research Agent autônomo coleta benchmarks e publicações automaticamente. Com backing YC, acesso a capital e network para crescimento rápido. Fraqueza: early-stage, escopo menor, sem BP. **Prazo para atingir paridade:** 18-24 meses.

**Alma** ($5.1M seed) opera como law firm AI-assisted, não como SaaS. Pricing transparente ($3K-10K/caso). 99%+ approval rate. Compete no RESULTADO, não na FERRAMENTA. Se Alma licenciar a tech deles, se torna competidor direto.

**LegalOS (YC W26)** é a mais nova e agressiva: treinada em 12.000 petições reais, entrega em 48h, 100% approval rate. Com apenas $500K, está ultra-early. Mas o treinamento em 12K petições reais é um diferencial de dados que o Petition Engine não tem.

**Filevine** ($725M+, $3-5B valuation) é o gorila do setor de legal tech. Se decidirem investir pesado em ImmigrationAI para geração de petições (não apenas forms), teriam budget para contratar as melhores equipes. Porém, como generalista, dificilmente atingirão a profundidade de nicho.

### Conclusão A.3
A janela de vantagem competitiva do Petition Engine é de **12-18 meses**. Após isso, Visalaw AI (com canal AILA), Parley (com integração Word), e LegalOS (com dados de 12K petições) poderão atingir paridade em geração de petições. O Business Plan continua sendo exclusivo — ninguém está construindo isso.

---

## A.4 Moat (Vantagem Competitiva Defensável)

### O que ninguém mais tem:
1. **Pipeline end-to-end completo:** Estratégia → Localização → Resume → Cover Letter → Business Plan → IMPACTO → Metodologia → Declaração de Intenções — 11 sistemas orquestrados
2. **Geração de Business Plan para imigração:** Zero competidores oferecem. 42 seções, 55-65 páginas, financial projections, Dhanasar-aligned
3. **IMPACTO econômico com 13 metodologias:** M1 (Direct Revenue) a M13 (Technology Transfer) com fórmulas, multipliers BEA RIMS II
4. **Metodologia Probatória em 5 Dossiês:** Fundacional, Metodológico, Estratégico, Validação por Especialistas, Auditoria Final
5. **77 regras de qualidade automatizadas:** Incluindo termos proibidos USCIS-specific, validação Dhanasar, SOC code blacklists
6. **Conhecimento de domínio acumulado:** 11 sistemas com regras USCIS PA-2025-03, PA-2025-16, precedentes AAO 2024-2025

### O que é difícil de replicar:
1. **Profundidade por caso:** 68K palavras na Cover Letter Vitória vs ~20 páginas genéricas do Visalaw. Isso reflete regras acumuladas em produção real
2. **Evidence architecture EB-1A com 10 critérios:** Mapeamento critério-by-critério com thumbnails, impact statements, scoring
3. **Regras de conteúdo proibido:** Listas de termos como "I believe", "we think", "in conclusion", "proposed venture" — aprendidas em produção
4. **Cross-references entre sistemas:** Cover Letter referencia Resume, BP referencia IMPACTO, Estratégia alimenta todos — pipeline integrado

### O que melhora com o tempo (network effects / data flywheel):
1. **Error rules auto-learning:** Auto-debugger classifica erros e adiciona regras. Regra r1 ("I believe") já foi acionada 127 vezes — cada caso melhora as regras
2. **Quality gates por caso:** Cada caso processado gera feedback que refina os gates
3. **Knowledge base regulatória:** Precedentes AAO, policy alerts, approval rates — acúmulo de dados que nenhum competidor novo tem
4. **Templates por setor/ocupação:** Cada novo SOC code processado gera template reutilizável

### Fragilidades do Moat:
1. **Não há lock-in de dados:** Nenhum dado de cliente está no sistema (JSON mocks), não há banco de dados real
2. **Não há comunidade:** Zero usuários externos, zero feedback loop de advogados
3. **Não há compliance certificável:** Zero SOC 2, zero auth, zero audit trail
4. **Conhecimento está em prompts, não em modelo treinado:** Competidores com acesso a dados de petições reais (LegalOS = 12K) podem superar via fine-tuning

---

# SEÇÃO B: ANÁLISE DE GAPS CRÍTICOS

---

## B.1 O que IMPEDE escalar de 5 para 30 casos/mês?

| # | Gap | Impacto | Severidade | Esforço Fix |
|---|-----|---------|-----------|-------------|
| 1 | **Zero autenticação em endpoints** | Qualquer processo local acessa tudo | P0 | 3 dias |
| 2 | **Command injection em API routes** | Atacante pode executar comandos no servidor | P0 | 2 dias |
| 3 | **Path traversal em validate-local** | Atacante lê qualquer arquivo (.env, SSH keys) | P0 | 1 dia |
| 4 | **2 paths quebrados em systems.json** (Cover Letter EB-2 NIW + BP) | Sistemas 4 e 5 não são encontrados pela plataforma | P0 | 0.5 dia |
| 5 | **Dados em JSON files, não em banco** | Sem transações, sem concorrência, sem backup, sem audit trail | P1 | 10 dias (Supabase migration) |
| 6 | **Pipeline sequencial sem paralelismo** | 1 caso bloqueia o sistema enquanto processa | P1 | 5 dias |
| 7 | **Zero testes automatizados** | Mudança em qualquer sistema pode quebrar outros sem detecção | P1 | 8 dias (test suite básica) |
| 8 | **IMPACTO usa framework EB-5 em vez de Dhanasar** | Petições EB-2 NIW com argumentos ERRADOS (NCE 10+ jobs vs substantial merit) | P0 | 2 dias |
| 9 | **~60% estatísticas fabricadas no sistema Localização** | Dados de approval rates, scoring, regions podem estar incorretos | P0 | 5 dias (validação manual) |
| 10 | **Florida income tax listado como $900K** | Florida tem 0% income tax — erro factual grave em caso real | P0 | 0.5 dia |

**Esforço total para desbloquear escala:** ~37 dias (1 desenvolvedor full-time)

### Diagnóstico:
Para ir de 5 para 30 casos/mês, o sistema precisa:
- Processar 3+ casos em paralelo sem conflito de dados (requer banco real)
- Garantir que erros como EB-5/Dhanasar e Florida income tax NUNCA cheguem ao cliente
- Ter testes que detectem regressões automaticamente
- Ter auth para que operadores acessem apenas seus casos

---

## B.2 O que IMPEDE vender como SaaS B2B?

| # | Gap | Impacto | Severidade | Esforço Fix |
|---|-----|---------|-----------|-------------|
| 1 | **Zero autenticação/autorização** | Não é possível multi-tenant sem auth | P0 | 5 dias (Supabase Auth + RLS) |
| 2 | **Dados em JSON, não em banco** | Sem isolamento de dados por tenant | P0 | 10 dias |
| 3 | **Zero SOC 2 / compliance** | Advogados não adotam software sem compliance mínimo | P0 | 90+ dias (SOC 2 Type II) |
| 4 | **Estratégia de pricing decoy exposta no output** | JSON do SaaS V1 revela estratégia de manipulação de preço | P1 | 1 dia |
| 5 | **Zero documentação de API** | Desenvolvedores de integração não têm referência | P1 | 5 dias |
| 6 | **Zero monitoring/observability** | Sem saber se o sistema está up, quantos erros, latência | P1 | 3 dias |
| 7 | **Paths hardcoded para /Users/paulo1844/** | Sistema roda APENAS no Mac do Paulo | P0 | 3 dias |
| 8 | **Dependência de Python local para quality review** | Server precisa ter Python + python-docx instalado | P1 | 2 dias (containerizar) |
| 9 | **Zero rate limiting** | Um usuário pode consumir toda a API key da OpenAI/Claude | P1 | 1 dia |
| 10 | **Zero billing/usage tracking** | Não é possível cobrar por uso sem métricas | P1 | 5 dias |
| 11 | **FORMATTING_SPEC do BP completamente desatualizado** | Times New Roman no spec, Garamond em produção — SaaS não pode ter inconsistência documentada | P1 | 1 dia |
| 12 | **5 contradições entre sistemas Resume e Cover Letter** | Idioma, thumbnails, footnotes, paleta, margens — SaaS precisa consistência | P1 | 3 dias |
| 13 | **~40% redundância entre Cover Letter EB-1A e EB-2 NIW** | Manutenção duplicada, risco de divergência em produção | P2 | 10 dias |

**Esforço total para SaaS MVP:** ~139 dias (excluindo SOC 2)  
**Esforço total para SaaS enterprise-ready:** ~229 dias (+SOC 2)

### Diagnóstico:
O gap mais crítico para SaaS não é feature — é INFRAESTRUTURA. Auth, banco, multi-tenancy, monitoring, billing. O produto atual é um protótipo funcional que roda no Mac do Paulo. Para SaaS B2B, precisa:
- Supabase (banco real com RLS) — substitui todos os JSON files
- Clerk ou Supabase Auth — multi-tenant com roles
- Stripe — billing automatizado
- Vercel ou Railway — deploy com CI/CD
- PostHog ou Mixpanel — analytics de uso
- Sentry — error tracking

---

## B.3 O que IMPEDE uma secretária operar sem o Paulo?

| # | Gap | Por que impede | Severidade | Esforço Fix |
|---|-----|---------------|-----------|-------------|
| 1 | **Interface requer conhecimento de sistemas** | Operador precisa saber quais dos 21 sistemas chamar, em que ordem | P0 | 15 dias (wizard guiado) |
| 2 | **Zero onboarding/tutorial na UI** | Primeira tela é um form técnico sem instruções | P1 | 3 dias |
| 3 | **Erros exibidos como stack traces** | Operador não técnico não sabe o que "TypeError: Cannot read property 'x'" significa | P1 | 5 dias |
| 4 | **Quality review requer interpretar marcações técnicas** | Highlights e comentários são em jargão imigratário | P2 | 5 dias |
| 5 | **Nenhum checkpoint de aprovação humana** | Documento vai direto do sistema para o cliente sem revisão intermediária | P0 | 3 dias |
| 6 | **Zero log de ações** | Se algo deu errado, não há como saber o que o operador fez | P1 | 2 dias |
| 7 | **Documentação de processos inexistente** | Não há SOP para "como processar um caso EB-2 NIW passo a passo" | P0 | 5 dias |
| 8 | **11 sistemas sem dashboard unificado** | Operador precisa navegar entre telas para acompanhar progresso | P1 | 8 dias |

**Esforço total para operação autônoma:** ~46 dias

### Diagnóstico:
O Petition Engine foi construído por e para o Paulo. A interface reflete o modelo mental do criador, não do operador. Para uma secretária operar:
- Wizard sequencial: "Passo 1: Upload documentos do cliente → Passo 2: Selecionar tipo de visto → Passo 3: Revisar estratégia → ... → Passo N: Entregar ao advogado"
- Checklist de revisão: "Antes de enviar, verifique: [ ] Nome correto, [ ] SOC code validado, [ ] Dhanasar aplicado (não EB-5)"
- Dashboard de status: "Caso Luciano: Estratégia OK → Resume OK → Cover Letter em progresso (70%) → BP pendente"

---

## B.4 Falhas que poderiam causar outro caso Cristine Correia

| # | Falha | Cenário de Dano | Probabilidade | Impacto |
|---|-------|----------------|--------------|---------|
| 1 | **EB-5 framework no IMPACTO** | USCIS recebe petição EB-2 NIW com argumentos de EB-5 (job creation). Denial imediato. Cliente paga $15K+ e perde meses. | **ALTA** — está em produção | Catastrófico |
| 2 | **Florida income tax $900K** | Officer USCIS vê projeção de $900K income tax em estado sem income tax. Questionamento de credibilidade. RFE ou denial. | **ALTA** — está em config real (Luciano) | Alto |
| 3 | **Estatísticas fabricadas na Localização** | Officer verifica dados de approval rate citados e não encontra fonte. Presunção de má-fé. | **ALTA** — ~60% dos dados não são verificáveis | Catastrófico |
| 4 | **Citação Dhanasar errada** | QA agent cita "28 I&N Dec. 820 (AAO 2023)" — a citação correta é "26 I&N Dec. 884 (AAO 2016)". Officer USCIS que conhece Dhanasar vê erro imediato. | **ALTA** — está no código | Alto |
| 5 | **SOC code proibido não detectado** | Sistema gera petição EB-1A com SOC 29-1023 (dentista) sem alertar que requer diploma validado. | Parcial (regra r9 existe mas r10 patterns incompletos) | Alto |
| 6 | **Footnotes conflitantes** | Cover Letter com mistura de footnotes nativos XML e manuais [1],[2] — USCIS veria formatação inconsistente | **MÉDIA** — contradição documentada | Médio |
| 7 | **Vazamento de sistema** | Output contém palavra "prompt", "PROEX", "Kortix" ou "Carlos Avelino" — revela uso de IA ou identifica concorrente | Baixa (regras r12/r16 existem) mas sem enforcement automático | Alto |
| 8 | **Command injection** | Atacante executa comando via file_path: `; rm -rf /` ou exfiltra .env.local com API keys | **MÉDIA** (requer acesso local) | Catastrófico |

### Mitigação Imediata Recomendada (Próximas 48 horas):
1. **CORRIGIR** EB-5 → Dhanasar no AGENT_04_BUILDER.md e AGENT_05_QA.md
2. **CORRIGIR** FL income tax de $900K → $0 no config Luciano
3. **CORRIGIR** citação Dhanasar de "28 I&N Dec. 820 (AAO 2023)" para "26 I&N Dec. 884 (AAO 2016)"
4. **MARCAR** todas as estatísticas fabricadas no sistema Localização com flag "[VERIFICAR]"
5. **RESOLVER** contradição footnotes: decidir nativos ou manuais e atualizar AMBOS os sistemas

---

# SEÇÃO C: ROADMAP DETALHADO

---

## C.1 Horizonte 2 meses (Abril-Maio 2026)

**Tema: "Sobrevivência — Corrigir o que pode matar o negócio"**

| # | Ação | Esforço | Impacto | Dependência | Risco |
|---|------|---------|---------|------------|-------|
| 1 | Corrigir EB-5 → Dhanasar em AGENT_04, AGENT_05 | 2 dias | Crítico — elimina denial automático | Nenhuma | Baixo |
| 2 | Corrigir FL income tax e citação Dhanasar | 0.5 dia | Crítico — elimina erro factual | Nenhuma | Baixo |
| 3 | Sanitizar inputs em execSync/spawn (command injection) | 2 dias | Crítico — elimina vulnerabilidade P0 | Nenhuma | Médio (pode quebrar flows) |
| 4 | Validar file_path com allowlist em validate-local | 1 dia | Crítico — elimina path traversal | Nenhuma | Baixo |
| 5 | Corrigir 2 paths quebrados em systems.json | 0.5 dia | Crítico — sistemas 4 e 5 funcionam | Verificar paths reais | Baixo |
| 6 | Validar e corrigir estatísticas do sistema Localização | 5 dias | Crítico — elimina dados fabricados | Acesso a fontes USCIS/BLS | Alto (pode não encontrar fontes) |
| 7 | Resolver contradição footnotes (EB-1A e EB-2 NIW) | 1 dia | Alto — consistência documental | Decisão de design | Baixo |
| 8 | Resolver contradição sub-evidências CVs | 0.5 dia | Alto — consistência | Decisão de design | Baixo |
| 9 | Atualizar FORMATTING_SPEC_BP (Times New Roman → Garamond) | 1 dia | Alto — elimina spec desatualizado | Nenhuma | Baixo |
| 10 | Unificar idioma do Resume (decidir EN ou PT-BR) | 0.5 dia | Alto — elimina ambiguidade | Decisão de negócio | Baixo |
| 11 | Adicionar auth básica (Supabase Auth ou API keys) | 5 dias | Crítico — prerequisito para multi-usuário | Conta Supabase | Médio |
| 12 | Migrar clients.json e generations.json para Supabase | 5 dias | Alto — dados persistentes e seguros | Auth implementado (#11) | Médio |
| 13 | Adicionar Zod validation em todos endpoints POST | 3 dias | Alto — inputs validados | Nenhuma | Baixo |
| 14 | Adicionar rate limiting no endpoint execute | 1 dia | Alto — protege API keys | Nenhuma | Baixo |
| 15 | Adicionar auto_fix_replacement na regra r4 | 0.5 dia | Médio — completa regra quebrada | Nenhuma | Baixo |
| 16 | Remover pricing decoy do output SaaS V1 | 1 dia | Médio — elimina exposição estratégia | Nenhuma | Baixo |
| 17 | Adicionar "consultant" à lista de termos proibidos | 0.5 dia | Médio — previne conteúdo genérico | Nenhuma | Baixo |

**Esforço total C.1:** ~30 dias  
**Resultado esperado:** Sistema seguro para 10+ casos/mês sem risco de denial por erro técnico

---

## C.2 Horizonte 6 meses (Abril-Setembro 2026)

**Tema: "Fundação — Construir infraestrutura para escala"**

| # | Ação | Esforço | Impacto | Dependência | Risco |
|---|------|---------|---------|------------|-------|
| 1 | Migrar TODOS os dados para Supabase (systems, error_rules, generations, clients) | 10 dias | Crítico — elimina JSON files | C.1 #11-12 concluídos | Médio |
| 2 | Implementar multi-tenancy com RLS (Row Level Security) | 5 dias | Crítico — prerequisito SaaS | Supabase migration | Alto (design complexo) |
| 3 | CI/CD com GitHub Actions (lint, type-check, test, deploy) | 5 dias | Alto — automação de deploy | Repositório organizado | Baixo |
| 4 | Suite de testes automatizados (unit + integration) | 15 dias | Alto — detecta regressões | Nenhuma | Médio |
| 5 | Deploy automatizado (Vercel ou Railway) | 3 dias | Alto — elimina dependência do Mac do Paulo | CI/CD (#3) | Baixo |
| 6 | Containerizar pipeline Python (Docker) | 3 dias | Alto — elimina dependência de ambiente local | Nenhuma | Médio |
| 7 | Dashboard unificado de status por caso | 10 dias | Alto — visibilidade operacional | Supabase migration | Médio |
| 8 | Wizard sequencial para operador não-técnico | 15 dias | Alto — permite operação sem Paulo | Dashboard (#7) | Alto (UX complexa) |
| 9 | Eliminar redundância Cover Letter EB-1A/EB-2 NIW (~40%) | 10 dias | Médio — reduz manutenção | Decisão de arquitetura | Alto (pode quebrar) |
| 10 | Unificar paleta de cores entre sistemas (ou documentar decisões) | 2 dias | Médio — consistência visual | Nenhuma | Baixo |
| 11 | Integrar Sentry para error tracking | 2 dias | Alto — visibilidade de erros em produção | Deploy (#5) | Baixo |
| 12 | Integrar PostHog/Mixpanel para usage analytics | 3 dias | Médio — métricas de uso | Deploy (#5) | Baixo |
| 13 | Documentar SOP para "processar caso EB-2 NIW passo a passo" | 5 dias | Alto — operação autônoma | Wizard (#8) | Baixo |
| 14 | Completar localização PT-BR no build_impacto_universal.js | 3 dias | Médio — corpo narrativo em PT-BR | Nenhuma | Baixo |
| 15 | Adicionar M10 como módulo formal no AGENT_03_CALCULATOR.md | 1 dia | Baixo — completude | Nenhuma | Baixo |
| 16 | Padronizar nomes de módulos entre AGENT_MASTER e template JSON | 1 dia | Baixo — consistência | Nenhuma | Baixo |

**Esforço total C.2:** ~93 dias  
**Resultado esperado:** Sistema deployado na nuvem, operável por secretária com wizard, 20+ casos/mês, CI/CD funcionando

---

## C.3 Horizonte 12 meses (Abril 2026 - Março 2027)

**Tema: "Produto — Transformar protótipo em SaaS comercializável"**

| # | Ação | Esforço | Impacto | Dependência | Risco |
|---|------|---------|---------|------------|-------|
| 1 | SOC 2 Type II (contratar auditor, implementar controles) | 90 dias (esforço distribuído) | Crítico — gate para B2B enterprise | Auth + logging + encryption | Alto (custo $20-50K) |
| 2 | API documentada com OpenAPI/Swagger | 5 dias | Alto — habilita integrações | Endpoints estabilizados | Baixo |
| 3 | Integração Stripe para billing por caso/subscription | 10 dias | Crítico — monetização | Multi-tenancy | Médio |
| 4 | Integração com Docketwise (API de case data) | 15 dias | Alto — canal de distribuição | API documentada (#2) | Alto (depende de cooperação Docketwise) |
| 5 | Onboarding self-service para advogados trial | 10 dias | Alto — reduce fricção de adoção | Auth + wizard + billing | Médio |
| 6 | Feature de RFE Response automatizado | 20 dias | Alto — diferencial competitivo (Visalaw já tem) | Pipeline estabilizado | Alto |
| 7 | Feature de Exhibit List generation | 10 dias | Médio — complementa Cover Letter | Cover Letter estabilizada | Médio |
| 8 | Data flywheel: anonimizar e armazenar patterns de casos aprovados | 15 dias | Alto — moat de dados | Supabase + compliance | Alto (privacy) |
| 9 | A/B testing de prompts por taxa de aprovação | 10 dias | Alto — otimização contínua | Data flywheel (#8) | Médio |
| 10 | Suporte a O-1A/O-1B (novo tipo de visto) | 30 dias | Alto — expande TAM | Sistemas EB-1A como base | Alto (novo domínio) |
| 11 | Portal de advogado: upload, review, approve, download | 20 dias | Crítico — experiência do cliente B2B | Dashboard + auth | Alto |
| 12 | Tradução automática PT-BR ↔ EN com revisão humana | 10 dias | Médio — atende advogados americanos | Pipeline estabilizado | Médio |

**Esforço total C.3:** ~245 dias (2-3 desenvolvedores)  
**Resultado esperado:** SaaS B2B com 5-10 escritórios pagantes, $10K-$30K MRR, SOC 2 em andamento

---

## C.4 Horizonte 24 meses (Abril 2026 - Março 2028)

**Tema: "Escala — Capturar mercado antes que competidores atinjam paridade"**

| # | Ação | Esforço | Impacto | Dependência | Risco |
|---|------|---------|---------|------------|-------|
| 1 | Fine-tuning de modelo com dados anonimizados de casos | 30 dias | Alto — moat de IA proprietária | 100+ casos no data flywheel | Alto (custo, compliance) |
| 2 | Parceria AILA (ou associação equivalente) | N/A (business dev) | Crítico — canal de 15K-18K advogados | SOC 2, produto estável | Alto (competição Visalaw) |
| 3 | Integração USCIS e-filing direto da plataforma | 30 dias | Alto — elimina fricção final | API USCIS (limitada) | Alto (regulatório) |
| 4 | Expansão para EB-1B, EB-1C, L-1 | 60 dias (20/tipo) | Alto — TAM 3x | O-1 implementado, dados | Alto (novos domínios) |
| 5 | Marketplace de templates por setor/SOC code | 15 dias | Médio — community flywheel | 50+ SOC codes processados | Médio |
| 6 | White-label para firmas de advocacia | 20 dias | Alto — B2B enterprise | Portal de advogado maduro | Médio |
| 7 | OCR/NLP para extração automática de evidências (documentos do cliente) | 30 dias | Alto — reduz intake manual | Infraestrutura IA | Alto (complexidade) |
| 8 | Predictive case outcome (ML com dados históricos) | 30 dias | Alto — diferencial premium | Data flywheel com 500+ casos | Alto |
| 9 | Series A: target $3-5M com traction de $100K+ MRR | N/A (fundraising) | Crítico — combustível para crescimento | Product-market fit demonstrado | Alto |
| 10 | Equipe: contratar 2 engineers + 1 compliance + 1 sales | N/A (hiring) | Crítico — não escala com 1 pessoa | Series A | Médio |

**Resultado esperado:** 50+ escritórios pagantes, $100K-$300K MRR, valuation $4-12M, equipe de 5-7 pessoas

---

# SEÇÃO D: FERRAMENTAS E INTEGRAÇÕES

---

## Stack Atual vs Stack Recomendada

| Camada | Atual | Recomendado | Prioridade | Esforço |
|--------|-------|-------------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | Manter — adequado | N/A | 0 |
| **Linguagem** | TypeScript | Manter — adequado | N/A | 0 |
| **IA - Drafting** | OpenAI GPT-4o + Claude | Adicionar Gemini 2.5 Pro como fallback | C.2 | 3 dias |
| **IA - Code** | Claude Code (Opus) | Adicionar Codex CLI para refactoring batch | C.1 | 2 dias |
| **IA - Review** | Manual | Adicionar Cursor com regras AIOS como AI Rules | C.1 | 1 dia |
| **Banco de dados** | JSON files (data/*.json) | **Supabase (Postgres + RLS + Auth + Storage)** | C.1 | 10 dias |
| **Auth** | Zero | **Supabase Auth (email + magic link)** | C.1 | 5 dias |
| **Deploy** | localhost:3000 | **Vercel (preview + production)** | C.2 | 2 dias |
| **CI/CD** | Zero | **GitHub Actions (lint → test → deploy)** | C.2 | 5 dias |
| **Monitoring** | Zero | **Sentry (errors) + PostHog (analytics)** | C.2 | 3 dias |
| **Billing** | Zero | **Stripe (subscriptions + per-case)** | C.3 | 10 dias |
| **Storage** | Filesystem local | **Supabase Storage (documentos)** | C.2 | 3 dias |
| **Queue** | Zero (síncrono) | **Inngest ou BullMQ (jobs de geração)** | C.2 | 5 dias |
| **Email** | Zero | **Resend (transacional) ou Supabase Edge Functions** | C.3 | 2 dias |
| **Compliance** | Zero | **Vanta ou Drata (SOC 2 automation)** | C.3 | 90 dias |
| **Testing** | Zero | **Vitest (unit) + Playwright (e2e)** | C.2 | 15 dias |
| **Containerização** | Zero (Python local) | **Docker (pipeline Python isolado)** | C.2 | 3 dias |

### Supabase Integration — Plano Detalhado

**Tabelas a criar:**

```
organizations     — tenants (escritórios de advocacia)
users             — operadores com role (admin, operator, viewer)
clients           — dados do peticionário (nome, SOC, visto, status)
cases             — caso imigratório (client_id, tipo, status, created_at)
generations       — documento gerado (case_id, system_id, version, content_hash)
systems           — registros dos 21 sistemas (path, version, status)
error_rules       — 77 regras (substitui error_rules.json)
quality_results   — resultados de quality review por generation
audit_log         — todas as ações de operadores (quem, o que, quando)
```

**Row Level Security (RLS):**
```sql
-- Operadores só veem casos da sua organização
CREATE POLICY "org_isolation" ON cases
  FOR ALL USING (org_id = auth.jwt() ->> 'org_id');
```

**Migration path:**
1. Criar tabelas no Supabase (1 dia)
2. Script de migração JSON → Postgres (2 dias)
3. Atualizar routes para usar Supabase client em vez de readFileSync (5 dias)
4. Testar com dados reais (2 dias)
5. Remover JSON files do flow principal (1 dia)

### CI/CD com GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
  deploy:
    needs: quality
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Deploy Automation

**Vercel (recomendado para Next.js):**
- Preview deploy a cada PR
- Production deploy a cada merge em main
- Edge Functions para API routes (latência < 50ms)
- Analytics nativo
- Custo: Free tier até $20/mo para Pro

**Railway (alternativa se precisar de Python no backend):**
- Docker support nativo
- Postgres incluso
- Custo: $5/mo + uso

---

# SEÇÃO E: ANÁLISE DE RISCO

---

## E.1 Riscos Técnicos

| ID | Risco | Probabilidade | Impacto | Mitigação |
|----|-------|--------------|---------|-----------|
| T1 | **Command injection explorada** — atacante executa código arbitrário via file_path não sanitizado | Média (requer acesso local ou exposição de porta) | Catastrófico (perda de dados, exfiltração de API keys) | Sanitizar TODOS os inputs em execSync/spawn; usar parameterized commands; nunca interpolar strings em shell |
| T2 | **Perda de dados** — JSON files corrompidos ou sobrescritos (sem backup, sem transação) | Alta (JSON não tem ACID) | Alto (perda de histórico de casos) | Migrar para Supabase (ACID compliant); implementar backups diários |
| T3 | **API key exhaustion** — sem rate limiting, um loop pode consumir $500+ em API calls | Média | Alto (custo inesperado + serviço fora) | Rate limiting por IP/user; budget alerts no OpenAI/Anthropic dashboard; timeout de 30min por geração |
| T4 | **Regressão silenciosa** — mudança em um sistema quebra output de outro sem detecção | Alta (zero testes) | Alto (documento errado entregue ao cliente) | Suite de testes com snapshots de output; CI/CD com testes obrigatórios |
| T5 | **Vendor lock-in em LLM** — OpenAI muda pricing ou degrada qualidade; Claude Opus indisponível | Média | Alto (pipeline para) | Multi-provider (OpenAI + Claude + Gemini); abstraction layer para trocar modelos |
| T6 | **Escalabilidade do filesystem** — JSON files não suportam concorrência de 30+ casos | Alta | Alto (race conditions, dados corrompidos) | Supabase com connection pooling (Supavisor) |

## E.2 Riscos de Negócio

| ID | Risco | Probabilidade | Impacto | Mitigação |
|----|-------|--------------|---------|-----------|
| B1 | **Visalaw AI atinge paridade com parceria AILA** — canal de 15K advogados distribui petitions melhores | Média (12-18 meses) | Catastrófico (mercado capturado antes do Petition Engine escalar) | Acelerar go-to-market; buscar partnerships alternativos (ABIL, AILF); diferencial BP |
| B2 | **Paulo é single point of failure** — doença, férias, burnout = zero operação | Alta (já ocorre) | Catastrófico | Wizard + SOP + dashboard + treinamento de operador; Horizonte C.2 |
| B3 | **Pricing war com LegalOS/Parley** — YC-backed startups subsidiam pricing para capturar mercado | Média (6-12 meses) | Alto (compressão de margem) | Focar em PROFUNDIDADE (BP + IMPACTO como diferencial); enterprise pricing, não race-to-bottom |
| B4 | **Cliente insatisfeito com denial processado pelo sistema** — dano reputacional + possível ação legal | Média | Catastrófico | Checkpoint humano obrigatório antes de envio; seguro E&O; disclaimer claro |
| B5 | **Burnout do fundador** — Paulo opera 11 sistemas + audita + vende + atende cliente | Alta | Catastrófico | Contratar operador em Horizonte C.2; automatizar o que for possível; priorizar ruthlessly |

## E.3 Riscos Regulatórios

| ID | Risco | Probabilidade | Impacto | Mitigação |
|----|-------|--------------|---------|-----------|
| R1 | **USCIS endurece posição contra IA em petições** — novo policy alert exigindo disclosure de uso de IA | Média (ABA já discute) | Alto (precisa adaptar todo output para compliance) | Monitorar ABA Ethics opinions; preparar mecanismo de disclosure; garantir que output não pareça gerado por IA (regras r12, r16) |
| R2 | **Mudança no teste Dhanasar** — USCIS modifica critérios NIW | Baixa (Dhanasar é AAO 2016, estável) | Alto (todos os sistemas precisam de atualização) | Arquitetura modular — framework legal isolado em arquivos editáveis, não hardcoded |
| R3 | **PA-2025-16 expande para EB-1A** — peso discricionário negativo aplicado a EB-1A | Baixa (EB-1A é não-discricionário por PA-2025-16) | Médio | Monitorar policy alerts; atualizar sistemas em < 48h |
| R4 | **State bar disciplinary action** — advogado usando Petition Engine viola regras de conduta profissional por falta de supervisão | Média | Catastrófico (escritório perde licença) | Disclaimer claro: "ferramenta de auxílio, não substitui revisão do advogado"; checkpoint humano obrigatório |
| R5 | **Approval rates continuam caindo** — EB-2 NIW cai para <30% | Alta (tendência FY2025 é de queda) | Médio-Alto (mais denials = mais RFEs = mais trabalho e insatisfação) | Feature de RFE Response (Roadmap C.3 #6); quality gates mais rigorosos; expectation management com clientes |

## E.4 Riscos de Qualidade

| ID | Risco | Probabilidade | Impacto | Mitigação |
|----|-------|--------------|---------|-----------|
| Q1 | **Output com framework errado (EB-5 em vez de Dhanasar)** | Alta (bug ativo em AGENT_04/05) | Catastrófico (denial certo) | Fix imediato (C.1 #1); teste automatizado que verifica ausência de termos EB-5 em output NIW |
| Q2 | **Estatísticas fabricadas chegam ao USCIS** | Alta (~60% do Localização não verificável) | Catastrófico (má-fé presumida) | Audit completo de fontes (C.1 #6); flag "[SOURCE REQUIRED]" em qualquer dado sem referência |
| Q3 | **Inconsistência entre documentos do mesmo caso** — Resume diz uma coisa, Cover Letter diz outra | Média (5 contradições documentadas entre sistemas) | Alto (USCIS vê inconsistência como red flag) | Cross-validation automatizada entre outputs; golden test cases |
| Q4 | **Content too generic** — output parece template, não caso real | Média (risco aumenta com escala) | Alto (RFE por "insufficient evidence of extraordinary") | Quality gate mínimo de especificidade; métricas de unicidade por caso |
| Q5 | **Formatação inconsistente** — mistura Times New Roman/Garamond, footnotes nativos/manuais | Alta (contradições ativas em specs) | Médio (USCIS officers notam) | Fix formatação (C.1 #9, #7); template unificado por tipo de documento |

## E.5 Mitigações Consolidadas — Matriz de Prioridade

| Prioridade | Mitigação | Riscos Cobertos | Esforço | Quando |
|-----------|-----------|----------------|---------|--------|
| **P0** | Fix EB-5 → Dhanasar | Q1, B4 | 2 dias | Semana 1 |
| **P0** | Fix FL income tax + citação Dhanasar | Q1, B4 | 0.5 dia | Semana 1 |
| **P0** | Sanitizar command injection | T1 | 2 dias | Semana 1 |
| **P0** | Fix path traversal | T1 | 1 dia | Semana 1 |
| **P0** | Audit estatísticas Localização | Q2 | 5 dias | Semana 2-3 |
| **P1** | Migrar para Supabase | T2, T6, B2 | 10 dias | Mês 1-2 |
| **P1** | Implementar auth | T1, T3, B2 | 5 dias | Mês 1-2 |
| **P1** | Suite de testes | T4, Q3, Q4 | 15 dias | Mês 2-3 |
| **P1** | CI/CD + deploy cloud | T4, B2 | 7 dias | Mês 2-3 |
| **P2** | Wizard + SOP para operador | B2, B5 | 20 dias | Mês 3-4 |
| **P2** | SOC 2 Type II | R4, B1 | 90 dias | Mês 4-12 |
| **P2** | Multi-provider LLM | T5 | 3 dias | Mês 3 |
| **P3** | Feature RFE Response | R5, B3 | 20 dias | Mês 6-9 |
| **P3** | Parceria AILA/ABIL | B1, B3 | Ongoing | Mês 9-18 |

---

# ANEXO: MÉTRICAS-CHAVE PARA MONITORAR

| Métrica | Valor Atual | Target 6 meses | Target 12 meses | Target 24 meses |
|---------|-------------|----------------|-----------------|-----------------|
| Score técnico codebase | 62/100 | 78/100 | 88/100 | 92/100 |
| Casos processados/mês | ~5 | 15-20 | 30 | 50+ |
| Tempo por caso (dias) | ~5 dias | 2 dias | 1 dia | 4 horas |
| Approval rate clientes | Desconhecido | Tracking ativo | >70% | >80% |
| Operadores que não são Paulo | 0 | 1 | 2 | 3+ |
| Escritórios B2B pagantes | 0 | 0 (beta) | 5-10 | 50+ |
| MRR | $0 | $0 (pre-revenue) | $10K-$30K | $100K-$300K |
| Uptime | N/A (local) | 99% | 99.5% | 99.9% |
| Testes automatizados | 0 | 50+ | 150+ | 300+ |
| Vulnerabilidades P0 abertas | 4 | 0 | 0 | 0 |
| Dados fabricados nos sistemas | ~60% Localização | 0% | 0% | 0% |

---

# ANEXO: VALUATION IMPLÍCITO

Baseado em comparáveis do mercado (Seção D da pesquisa de mercado):

| Cenário | ARR Alvo | Múltiplo | Valuation Implied |
|---------|---------|---------|-------------------|
| Hoje (pre-revenue, MVP funcional) | $0 | N/A | $3-8M (seed typical para vertical AI) |
| Early traction (6-12 meses) | $100K-$300K | 10-15x | $1M-$4.5M |
| Product-market fit (12-18 meses) | $500K-$1M | 8-12x | $4M-$12M |
| Growth stage (24 meses) | $2M-$5M | 7-10x | $14M-$50M |

**Fatores de premium:**
1. Vertical AI em imigração = premium sobre SaaS genérico
2. Business Plan generation = funcionalidade única (zero competidores)
3. End-to-end pipeline = moat de complexidade
4. Queda nas approval rates = demanda crescente (market tailwind)
5. Mercado de $1.5B crescendo 15% CAGR

**Fatores de desconto:**
1. Pre-revenue, single operator
2. 4 vulnerabilidades P0 abertas
3. Zero compliance (SOC 2, HIPAA)
4. Dependência de política imigratória dos EUA
5. Competição YC-backed (3+ startups em 2024-2026)

---

*Documento gerado em 02/04/2026. Próxima revisão recomendada: 02/05/2026 (após execução do Horizonte C.1).*
