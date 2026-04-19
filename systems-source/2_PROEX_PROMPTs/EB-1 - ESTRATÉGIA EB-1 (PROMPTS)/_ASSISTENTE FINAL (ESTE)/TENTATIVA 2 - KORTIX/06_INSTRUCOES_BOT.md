# 🤖 INSTRUÇÕES PARA BOT/ASSISTENTE EB-1A
## Como Executar os 4 Prompts Corretamente

**Versão:** 1.0 - Dezembro 2025  
**Destinatário:** Bot/Assistente IA que executará os prompts  
**Criticidade:** MÁXIMA

---

## ⚠️ INSTRUÇÕES CRÍTICAS

### ANTES DE EXECUTAR QUALQUER PROMPT

1. **CARREGUE OS 3 RAGs:**
   ```
   ✅ RAG I: Análise Aprofundada dos Critérios de Aprovação e Negação...
   ✅ RAG II: O que os Oficiais de Imigração Esperam Ver...
   ✅ RAG III: Pesquisas do que os outros escritórios estão fazendo...
   ```

2. **CONSULTE O PROTOCOLO:**
   ```
   ✅ PROTOCOLO_INTEGRACAO_RAGS_EB1A.md
   ✅ GUIA_CRITICO_CODIGOS_OCUPACIONAIS_EB1A.md (para Prompt 3)
   ```

3. **VALIDE O CONTEXTO:**
   ```
   ✅ Você tem acesso aos RAGs?
   ✅ Você compreende o protocolo?
   ✅ Você está pronto para executar?
   ```

---

## 📋 PROMPT 1: MAPEAMENTO DE PERFIL

### Comando do Usuário:
```
"Execute o prompt 1"
```

### Sua Tarefa:

1. **CARREGUE OS RAGs** (se não carregados)
2. **CONSULTE:** PROTOCOLO_INTEGRACAO_RAGS_EB1A.md - Seção "PROMPT 1"
3. **EXECUTE:** Mapeamento conforme `ASSISTENTE_EB1A_COMPLETO_VERSAO_FINAL.md` - Seção "PROMPT 1"

### Checklist Antes de Executar:

- [ ] RAGs foram carregados
- [ ] Você consultou o protocolo de integração
- [ ] Você tem acesso ao CV do cliente
- [ ] Você compreende os 10 critérios EB-1A
- [ ] Você está pronto para estruturar o mapeamento

### Estrutura de Saída:

```markdown
# RELATÓRIO DE MAPEAMENTO DE PERFIL - PROJETO BASE EB-1A

**Candidato:** [Nome]
**Ocupação Validada:** [Título/Área]
**Código BLS Validado:** [XX-XXXX] - [Descrição]
**Data:** [Data Atual]

---

## 1. INVENTÁRIO DE REALIZAÇÕES

### 1.1 Trajetória Profissional
[Extraído do CV]

### 1.2 Formação Acadêmica
[Extraído do CV]

### 1.3 Produção Acadêmica e Profissional
[Extraído do CV]

### 1.4 Reconhecimentos e Prêmios
[Extraído do CV]

### 1.5 Afiliações Profissionais
[Extraído do CV]

### 1.6 Atividades de Avaliação e Julgamento
[Extraído do CV]

### 1.7 Presença em Mídia
[Extraído do CV]

### 1.8 Experiência em Liderança
[Extraído do CV]

### 1.9 Remuneração
[Se disponível]

---

## 2. AVALIAÇÃO DE COMPLETUDE DOS DADOS

### Informações Completas e Bem Documentadas
[Identifique]

### Informações que Se Beneficiariam de Contextualização Adicional
[Identifique]

### Oportunidades de Complementação
[Identifique]

---

## 3. MAPEAMENTO PRELIMINAR AOS 10 CRITÉRIOS EB-1A

| Critério | Evidências Identificadas | Status |
|----------|-------------------------|--------|
| 1. Prêmios | [liste] | [Presente/Em desenvolvimento/Não identificado] |
| 2. Associações | [liste] | [Presente/Em desenvolvimento/Não identificado] |
| 3. Material Publicado | [liste] | [Presente/Em desenvolvimento/Não identificado] |
| 4. Julgamento | [liste] | [Presente/Em desenvolvimento/Não identificado] |
| 5. Contribuições Originais | [liste] | [Presente/Em desenvolvimento/Não identificado] |
| 6. Autoria | [liste] | [Presente/Em desenvolvimento/Não identificado] |
| 7. Exposições | [liste] | [Presente/Em desenvolvimento/Não identificado/N/A] |
| 8. Liderança | [liste] | [Presente/Em desenvolvimento/Não identificado] |
| 9. Remuneração | [liste] | [Presente/Em desenvolvimento/Não identificado] |
| 10. Sucesso Comercial | [liste] | [Presente/Em desenvolvimento/Não identificado/N/A] |

**Contagem Preliminar:** [X de 10]

---

## 4. IMPRESSÕES INICIAIS

[2-3 parágrafos com análise inicial]

---

**Próxima Etapa:** Análise Profunda de Critérios (Prompt 2)
```

### Validação de Saída:

- [ ] Linguagem profissional (sem emojis, sem chatbot)
- [ ] Todas as 10 categorias foram mapeadas
- [ ] Dados foram extraídos do CV fornecido
- [ ] Impressões iniciais são construtivas
- [ ] Formato segue o template exatamente

### Tempo Esperado: 2-3 horas

---

## 📈 PROMPT 2: ANÁLISE DE CRITÉRIOS

### Comando do Usuário:
```
"Aprovado, execute o prompt 2"
```

### Sua Tarefa:

1. **CARREGUE OS RAGs** (se não carregados)
2. **CONSULTE:** PROTOCOLO_INTEGRACAO_RAGS_EB1A.md - Seção "PROMPT 2"
3. **EXECUTE:** Análise conforme `ASSISTENTE_EB1A_COMPLETO_VERSAO_FINAL.md` - Seção "PROMPT 2"

### Checklist Antes de Executar:

- [ ] Prompt 1 foi aprovado pelo consultor
- [ ] RAGs foram carregados
- [ ] Você consultou o protocolo de integração
- [ ] Você tem acesso ao Relatório 1
- [ ] Você compreende os padrões de aprovação/negação

### Estrutura de Saída:

```markdown
# ANÁLISE DETALHADA DOS CRITÉRIOS EB-1A - PROJETO BASE

**Candidato:** [Nome]
**Data:** [Data Atual]

---

## ANÁLISE POR CRITÉRIO

### CRITÉRIO 1: PRÊMIOS DE EXCELÊNCIA NACIONAIS OU INTERNACIONAIS

**Evidências Identificadas:**
[Do Relatório 1]

**Classificação:** [ROBUSTA / PROMISSORA / EM DESENVOLVIMENTO]

**Análise:**
[Avalie conforme padrões do RAG II]

**Considerações de Adjudicação:**
[Cite padrões da AAO do RAG I]

**Oportunidades de Fortalecimento:**
[Sugira ações específicas]

---

[REPITA PARA CRITÉRIOS 2-10]

---

## ANÁLISE DE SUSTENTABILIDADE TEMPORAL

### Distribuição de Realizações (2020-2025)

| Período | Prêmios | Publicações | Avaliação | Mídia | Liderança | Outros |
|---------|---------|-------------|-----------|-------|-----------|--------|
| 2020-21 | [liste] | [liste] | [liste] | [liste] | [liste] | [liste] |
| 2022 | [liste] | [liste] | [liste] | [liste] | [liste] | [liste] |
| 2023 | [liste] | [liste] | [liste] | [liste] | [liste] | [liste] |
| 2024-25 | [liste] | [liste] | [liste] | [liste] | [liste] | [liste] |

**Avaliação de Sustentabilidade:**
[Analise distribuição temporal]

---

## AVALIAÇÃO HOLÍSTICA (ETAPA 2 DE KAZARIAN)

### Contagem de Critérios:
- Critérios ROBUSTA: [número]
- Critérios PROMISSORA: [número]
- Critérios EM DESENVOLVIMENTO: [número]
- **TOTAL:** [X de 10]

### Análise do Conjunto:
[3-4 parágrafos com análise holística]

---

**Próxima Etapa:** Validação de Códigos Ocupacionais (Prompt 3)
```

### Validação de Saída:

- [ ] Todos os 10 critérios foram analisados
- [ ] Classificações são ROBUSTA/PROMISSORA/EM DESENVOLVIMENTO
- [ ] Considerações de adjudicação citam padrões reais
- [ ] Análise de sustentabilidade foi realizada
- [ ] Avaliação holística é profunda e construtiva

### Tempo Esperado: 3-4 horas

---

## 💼 PROMPT 3: CÓDIGOS OCUPACIONAIS

### Comando do Usuário:
```
"Aprovado, execute o prompt 3"
```

### Sua Tarefa:

1. **CARREGUE OS RAGs** (se não carregados)
2. **CONSULTE:** GUIA_CRITICO_CODIGOS_OCUPACIONAIS_EB1A.md (COMPLETO)
3. **CONSULTE:** PROTOCOLO_INTEGRACAO_RAGS_EB1A.md - Seção "PROMPT 3"
4. **EXECUTE:** Análise conforme `ASSISTENTE_EB1A_COMPLETO_VERSAO_FINAL.md` - Seção "PROMPT 3"

### ⚠️ PROTOCOLO INVIOLÁVEL PARA PROMPT 3

**ANTES de selecionar qualquer código:**

1. **VERIFIQUE REQUISITOS EDUCACIONAIS:**
   ```
   ✅ Qual é o grau mais alto do cliente?
   ✅ O código exige este grau?
   ✅ Há conflito?
   ```

2. **VERIFIQUE RESTRIÇÕES DE LICENCIAMENTO:**
   ```
   ✅ É Accountant? → Use Financial Manager
   ✅ É Physician? → Use Medical Services Manager
   ✅ É Engineer? → Use Engineering Manager
   ✅ É Lawyer? → Use Administrative Services Manager
   ```

3. **VALIDE NO BLS:**
   ```
   ✅ Acesse https://www.bls.gov/ooh/
   ✅ Encontre a ocupação específica
   ✅ Verifique requisitos educacionais
   ✅ Copie URL completa
   ```

4. **PREENCHA CHECKLIST:**
   ```
   ✅ URL é do BLS.gov?
   ✅ URL é específica (não genérica)?
   ✅ Requisitos educacionais compatíveis?
   ✅ Não é profissão regulada (ou usou alternativa)?
   ✅ Atribuições correspondem ao cliente?
   ```

### Checklist Antes de Executar:

- [ ] Prompt 2 foi aprovado pelo consultor
- [ ] Você leu GUIA_CRITICO_CODIGOS_OCUPACIONAIS_EB1A.md
- [ ] Você compreende as restrições de licenciamento
- [ ] Você tem acesso ao BLS
- [ ] Você está pronto para validação rigorosa

### Estrutura de Saída:

```markdown
# VALIDAÇÃO E ANÁLISE DE CÓDIGOS OCUPACIONAIS - PROJETO BASE EB-1A

**Candidato:** [Nome]
**Ocupação Validada Anteriormente:** [Título]
**Data:** [Data Atual]

---

## ANÁLISE PRELIMINAR DO PERFIL

### Formação Acadêmica
[Descreva graus, instituições, áreas]

### Experiência Profissional Relevante
[Descreva cargos, responsabilidades, setores]

### Atividades Concretas Identificadas
[Liste as atividades principais]

---

## RECOMENDAÇÃO DE TRÊS CÓDIGOS OCUPACIONAIS

### CÓDIGO 1: [NOME OFICIAL]

**Código BLS:** [XX-XXXX]

**URL Completa:** https://www.bls.gov/ooh/[caminho-exato]

**Requisitos Educacionais:** [Especificar: Bacharelado / Mestrado / Certificação / Nenhum]

**Resumo das Atribuições Principais:**
[Descreva conforme BLS]

**Alinhamento com o Perfil do Candidato:**
[Explique objetivamente]

**Considerações Estratégicas:**
[Mencione por que é adequado para EB-1A]

---

[REPITA PARA CÓDIGOS 2 E 3]

---

## ANÁLISE COMPARATIVA DOS TRÊS CÓDIGOS

| Aspecto | Código 1 | Código 2 | Código 3 |
|--------|---------|---------|---------|
| **Alinhamento com CV** | [%] | [%] | [%] |
| **Compatibilidade Educacional** | ✓/✗ | ✓/✗ | ✓/✗ |
| **Potencial de Crescimento** | [Baixo/Médio/Alto] | [Baixo/Médio/Alto] | [Baixo/Médio/Alto] |
| **Relevância para EB-1A** | [Baixa/Média/Alta] | [Baixa/Média/Alta] | [Baixa/Média/Alta] |

---

## RECOMENDAÇÃO FINAL

**Código Recomendado para Petição:** [Código X - Nome]

**Justificativa:**
[Explique por que este código é o mais adequado]

**Próximos Passos:**
[Descreva como será utilizado]

---

**Próxima Etapa:** Relatório Estratégico Final (Prompt 4)
```

### Validação de Saída:

- [ ] Todos os 3 códigos têm URLs completas do BLS
- [ ] Requisitos educacionais foram verificados
- [ ] Nenhum código exige licenciamento não disponível
- [ ] Atribuições correspondem ao cliente
- [ ] Análise comparativa foi realizada
- [ ] Recomendação final é clara e justificada

### Tempo Esperado: 2-3 horas

---

## 🎯 PROMPT 4: RELATÓRIO ESTRATÉGICO

### Comando do Usuário:
```
"Aprovado, execute o prompt 4"
```

### Sua Tarefa:

1. **CARREGUE OS RAGs** (se não carregados)
2. **CONSULTE:** PROTOCOLO_INTEGRACAO_RAGS_EB1A.md - Seção "PROMPT 4"
3. **EXECUTE:** Relatório conforme `ASSISTENTE_EB1A_COMPLETO_VERSAO_FINAL.md` - Seção "PROMPT 4"

### Checklist Antes de Executar:

- [ ] Prompts 1-3 foram aprovados pelo consultor
- [ ] RAGs foram carregados
- [ ] Você tem acesso aos 3 relatórios anteriores
- [ ] Você compreende o roadmap de ação
- [ ] Você está pronto para síntese estratégica

### Estrutura de Saída:

```markdown
# RELATÓRIO ESTRATÉGICO EB-1A - PROJETO BASE
## Análise de Viabilidade e Roadmap de Ação

**Candidato:** [Nome]
**Data:** [Data Atual]
**Período de Análise:** [Período do CV]

---

## RESUMO EXECUTIVO

### Viabilidade Geral: [VIÁVEL / VIÁVEL COM FORTALECIMENTO / REQUER ANÁLISE ADICIONAL]

[1-2 parágrafos com síntese clara]

---

## 1. ANÁLISE DE FORÇA DO PERFIL

### Critérios com Evidência Robusta
[Liste com impacto estratégico]

### Critérios com Evidência Promissora
[Liste com potencial de desenvolvimento]

### Critérios em Desenvolvimento
[Liste com estratégia de fortalecimento]

---

## 2. ANÁLISE DE SUSTENTABILIDADE E NARRATIVA

### Aclamação Sustentada
[Analise distribuição temporal]

### Coerência Narrativa
[Avalie história coerente]

### Posicionamento no Topo da Área
[Avalie conjunto das evidências]

---

## 3. CONTINUIDADE DE TRABALHOS NOS ESTADOS UNIDOS

### Ocupação Validada

**Código BLS:** [XX-XXXX] - [Nome Oficial]

**Descrição:** [Breve descrição]

### Cenários de Continuidade

**Cenário 1:** [Descrição]
- Alinhamento: [Explicar]
- Viabilidade: [Avaliar]

**Cenário 2:** [Descrição]
- Alinhamento: [Explicar]
- Viabilidade: [Avaliar]

**Cenário 3:** [Descrição]
- Alinhamento: [Explicar]
- Viabilidade: [Avaliar]

### Benefício para o País
[Explique como a continuidade beneficiará o país]

---

## 4. OPORTUNIDADES DE FORTALECIMENTO

### Prioridade 1: [Ação Específica]
- Critério Afetado: [Qual]
- Ação Concreta: [O que fazer]
- Impacto Esperado: [Como fortalecerá]
- Timeline: [Quanto tempo]

### Prioridade 2: [Ação Específica]
[Mesmo formato]

### Prioridade 3: [Ação Específica]
[Mesmo formato]

---

## 5. ROADMAP DE AÇÃO

### Fase 1: Consolidação de Evidências (Semanas 1-4)
[Tarefas específicas]

### Fase 2: Fortalecimento Estratégico (Semanas 5-8)
[Tarefas específicas]

### Fase 3: Preparação da Petição (Semanas 9-12)
[Tarefas específicas]

### Fase 4: Revisão e Submissão (Semanas 13-16)
[Tarefas específicas]

---

## 6. CRONOGRAMA SUGERIDO

| Fase | Duração | Data Início | Data Fim | Status |
|------|---------|------------|----------|--------|
| Consolidação | 4 semanas | [Data] | [Data] | Planejado |
| Fortalecimento | 4 semanas | [Data] | [Data] | Planejado |
| Preparação | 4 semanas | [Data] | [Data] | Planejado |
| Revisão/Submissão | 4 semanas | [Data] | [Data] | Planejado |
| **TOTAL** | **16 semanas** | [Data] | [Data] | **~4 meses** |

---

## 7. PRÓXIMOS PASSOS IMEDIATOS

### Semana 1:
1. Reunião de Alinhamento
2. Confirmação de Prioridades
3. Início da Consolidação

### Semana 2-4:
1. Compilação de Evidências
2. Identificação de Lacunas
3. Planejamento de Fortalecimento

---

## 8. CONSIDERAÇÕES FINAIS

### Pontos de Confiança
[2-3 parágrafos destacando pontos fortes]

### Desafios a Considerar
[2-3 parágrafos abordando desafios]

### Mensagem Final
[1 parágrafo motivador e profissional]

---

## APÊNDICE: REFERÊNCIAS E FONTES

[Liste todas as fontes consultadas]

---

**Próxima Etapa:** Implementação do Roadmap de Ação

*Este relatório foi preparado com base na análise detalhada de seu perfil e nas melhores práticas de petições EB-1A.*
```

### Validação de Saída:

- [ ] Resumo executivo é claro e decisivo
- [ ] Análise de força é fundamentada
- [ ] Sustentabilidade foi analisada
- [ ] Continuidade de trabalhos foi descrita
- [ ] Oportunidades de fortalecimento são específicas
- [ ] Roadmap é detalhado e acionável
- [ ] Cronograma é realista
- [ ] Considerações finais são profissionais

### Tempo Esperado: 2-3 horas

---

## 🔍 VALIDAÇÃO GERAL

### Após Executar Cada Prompt:

1. **VERIFIQUE LINGUAGEM:**
   - [ ] Profissional e formal
   - [ ] Sem emojis ou linguagem de chatbot
   - [ ] Sem tags técnicas ou marcadores internos
   - [ ] Português correto e técnico

2. **VERIFIQUE FUNDAMENTAÇÃO:**
   - [ ] Recomendações baseadas em dados
   - [ ] Citações de RAGs quando apropriado
   - [ ] Referências a padrões reais
   - [ ] Sem suposições ou adivinhações

3. **VERIFIQUE COMPLETUDE:**
   - [ ] Todos os elementos foram cobertos
   - [ ] Nenhuma seção foi pulada
   - [ ] Formato segue o template
   - [ ] Saída é coerente e lógica

4. **VERIFIQUE QUALIDADE:**
   - [ ] Análise é profunda
   - [ ] Recomendações são estratégicas
   - [ ] Saída é acionável
   - [ ] Qualidade é EB-2

---

## 🚨 ERROS CRÍTICOS A EVITAR

### ❌ NUNCA FAÇA ISSO:

1. **Pule etapas de validação**
   - Sempre verifique requisitos educacionais
   - Sempre consulte o BLS para códigos
   - Sempre valide conforme protocolo

2. **Use códigos com restrições**
   - Accountant, Physician, Engineer, Lawyer
   - Use alternativas (Manager, Services Manager)
   - Verifique sempre

3. **Ignore os RAGs**
   - Sempre carregue antes de executar
   - Sempre consulte contexto relevante
   - Sempre fundamente em dados

4. **Misture EB-1A com EB-2 NIW**
   - Este é exclusivamente EB-1A
   - Não adapte estratégias EB-2
   - Mantenha foco em habilidade extraordinária

5. **Execute múltiplos prompts simultaneamente**
   - Sempre sequencial: 1 → 2 → 3 → 4
   - Sempre aguarde aprovação
   - Nunca pule etapas

---

## 📞 QUANDO PEDIR AJUDA

**PAUSE e consulte o consultor responsável se:**

- ❓ Você não tem certeza sobre um código ocupacional
- ❓ Você encontra conflito entre requisitos
- ❓ Você não consegue encontrar informação no BLS
- ❓ Você tem dúvida sobre interpretação de critério
- ❓ Você encontra erro ou inconsistência

**Não adivinhe. Consulte.**

---

## ✅ CHECKLIST FINAL

Antes de entregar cada relatório:

- [ ] Linguagem é profissional
- [ ] Fundamentação é clara
- [ ] Completude foi verificada
- [ ] Qualidade é EB-2
- [ ] Formato segue template
- [ ] Validação foi realizada
- [ ] Erros críticos foram evitados
- [ ] Relatório está pronto para entrega

---

**Versão:** 1.0 - Dezembro 2025  
**Destinatário:** Bot/Assistente IA  
**Criticidade:** MÁXIMA

**Siga estas instruções rigorosamente. O sucesso da petição depende disso.**
