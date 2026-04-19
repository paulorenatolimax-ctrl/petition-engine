# FORBIDDEN CONTENT — EB-2 NIW
## Proibições Absolutas (Zero Tolerância)
### v1.0 — 28/02/2026

---

## NÍVEL 1 — PROIBIÇÕES LEGAIS (violação = risco processual)

### F-01: Dados Inventados
- **PROIBIDO**: Qualquer dado, estatística, nome, data ou número não extraído de fonte verificável
- **RAZÃO**: Documento sob penalty of perjury (18 U.S.C. § 1546)
- **AÇÃO**: Se não tem fonte → `[VERIFICAR]` em highlight amarelo

### F-02: Nomes de Outros Clientes
- **PROIBIDO**: Citar nomes de outros clientes do escritório PROEX como precedente
- **RAZÃO**: Violação de sigilo profissional; petições NIW são individuais
- **AÇÃO**: Usar apenas jurisprudência pública (AAO, BIA, federal courts)

### F-03: "PROEX" no Documento
- **PROIBIDO**: Mencionar o nome do escritório "PROEX" na Cover Letter
- **RAZÃO**: O documento é do CLIENTE, não do escritório
- **AÇÃO**: Remover qualquer referência

### F-04: Entidade Planejada como Constituída
- **PROIBIDO**: Usar "constituída", "sediada", "fundada", "estabelecida" para empresa que NÃO tem Articles of Incorporation
- **RAZÃO**: Fraude processual; FDNS/VIBE pode verificar
- **AÇÃO**: Usar "planejada", "projetada", "a ser constituída"

---

## NÍVEL 2 — PROIBIÇÕES DE LINGUAGEM (violação = flag de IA / RFE)

### F-05: "O beneficiário" / "O peticionário"
- **PROIBIDO**: Referir-se ao cliente em terceira pessoa no corpo da Cover Letter
- **RAZÃO**: Tom impessoal; inconsistente com self-petition
- **AÇÃO**: Usar primeira pessoa — "demonstro", "apresento", "minha experiência"
- **EXCEÇÃO**: Em citações do Policy Manual ou da lei, manter o original

### F-06: "Satisfeito" / "Satisfaz" / "Satisfies" sobre Prongs
- **PROIBIDO**: Afirmar que um prong está "satisfeito" ou "satisfaz os requisitos"
- **RAZÃO**: Juízo que cabe exclusivamente ao oficial adjudicador
- **AÇÃO**: Usar "demonstrado", "atendido", "consistente com", "em conformidade com", "comprovado"

### F-07: Jargão Oco de GenAI
- **PROIBIDO**: 
  - "sinergias" / "criar sinergias"
  - "paradigma" / "mudança de paradigma"  
  - "revolucionário" / "revolucionar"
  - "game-changing" / "game-changer"
  - "disruptivo" / "disrupção"
  - "holístico"
  - "cutting-edge" / "state-of-the-art"
  - "na vanguarda"
  - "contribuir significativamente" (sem quantificar)
  - "impacto transformador" (sem dados)
  - "alavancar"
  - "ecossistema" (quando usado de forma vaga)
  - "stakeholders" (sem especificar quem)
- **RAZÃO**: Flags de conteúdo gerado por IA; gatilhos de "boilerplate" no ATLAS/ATA
- **AÇÃO**: Substituir por descrição específica com dados

### F-08: Seção "Objeções Antecipadas"
- **PROIBIDO**: Criar seção explícita com este título ou similar ("Potential Objections", "Defesa contra RFE")
- **RAZÃO**: Telegrafar fraquezas ao oficial; demonstra insegurança
- **AÇÃO**: Costurar defesas preemptivas DENTRO do texto argumentativo

### F-09: Escassez como Justificativa de National Importance
- **PROIBIDO**: Argumentar que escassez de profissionais no campo justifica o NIW
- **RAZÃO**: Explicitamente rejeitado pelo USCIS e AAO (caso Piloto, 2025)
- **AÇÃO**: Focar em impacto prospectivo, criação de capacidades, alinhamento com CETs/EOs

---

## NÍVEL 3 — PROIBIÇÕES DE FORMATAÇÃO (violação = inconsistência)

### F-10: Evidence Numbers Abreviados
- **PROIBIDO**: "Ev. 16", "E16", "Evidence16", "Evidência 16"
- **RAZÃO**: Inconsistência; dificulta busca pelo oficial
- **AÇÃO**: SEMPRE "**Evidence XX**" (bold, com espaço, em inglês)

### F-11: Unicode Bullets
- **PROIBIDO**: "•", "●", "○" digitados manualmente
- **RAZÃO**: Incompatibilidade de renderização; violação docx-js
- **AÇÃO**: Usar `LevelFormat.BULLET` via numbering config

### F-12: Tabelas com Box Borders
- **PROIBIDO**: Bordas verticais em tabelas (esquerda/direita)
- **RAZÃO**: Padrão visual do escritório; estética profissional
- **AÇÃO**: Apenas bordas horizontais (top/bottom)

### F-13: Arial como Fonte
- **PROIBIDO**: Arial no corpo ou headers da Cover Letter
- **RAZÃO**: Fonte padrão do skill docx genérico; Cover Letter NIW usa Garamond
- **AÇÃO**: Garamond para TUDO (corpo, headers, footnotes, footer)

---

## NÍVEL 4 — PROIBIÇÕES ESTRATÉGICAS (violação = enfraquecimento do caso)

### F-14: URLs sem Footnote
- **PROIBIDO**: Citar estatística de fonte externa sem footnote com URL
- **RAZÃO**: Oficial não pode verificar; parece inventado; flag de GenAI
- **AÇÃO**: TODA estatística externa → footnote numerada com URL completa

### F-15: Afirmações sem Evidence Reference
- **PROIBIDO**: Parágrafo do corpo sem referência a pelo menos uma Evidence
- **RAZÃO**: Argumento sem suporte documental; vulnerável a RFE
- **AÇÃO**: CADA parágrafo → pelo menos uma "(Evidence XX)" em bold

### F-16: Proposed Endeavor Genérico
- **PROIBIDO**: PE descrito como campo de atuação ("trabalhar em TI", "consultoria financeira")
- **RAZÃO**: Gatilho principal de RFE Pattern 1.3 (vague proposed endeavor)
- **AÇÃO**: PE = projeto específico com nome, local, setores, métricas

### F-17: Repetição de Estrutura entre Prongs
- **PROIBIDO**: Mesma estrutura argumentativa em prongs diferentes
- **RAZÃO**: Baixa burstiness → flag de uniformidade GenAI
- **AÇÃO**: Variar estrutura: cronológica → concêntrica → por pilar → por fator

### F-18: Dados do BP Inconsistentes com CL
- **PROIBIDO**: Citar números na Cover Letter que divergem do Business Plan
- **RAZÃO**: Inconsistência = credibilidade comprometida; FDNS flag
- **AÇÃO**: Cross-check CADA número: BP ↔ CL devem ser IDÊNTICOS

---

## SCAN AUTOMATIZADO

O agente DEVE rodar este scan em CADA seção antes de entregar:

```
FORBIDDEN CONTENT SCAN — [SEÇÃO]
□ F-01: Dados inventados? → 0 encontrados
□ F-02: Nomes de clientes? → 0 encontrados  
□ F-03: "PROEX"? → 0 encontrados
□ F-04: Entidade planejada como constituída? → 0 encontrados
□ F-05: "O beneficiário"/"O peticionário"? → 0 encontrados
□ F-06: "Satisfeito/satisfaz"? → 0 encontrados
□ F-07: Jargão oco? → 0 encontrados
□ F-08: Seção "Objeções Antecipadas"? → Ausente ✅
□ F-09: Escassez como justificativa? → 0 encontrados
□ F-10: Evidence abreviado? → 0 encontrados
□ F-14: URLs sem footnote? → 0 encontrados
□ F-15: Parágrafos sem Evidence ref? → 0 encontrados
□ F-16: PE genérico? → NÃO ✅
□ F-18: BP ↔ CL inconsistência? → 0 encontrados

RESULTADO: ✅ APROVADO / ❌ [N] VIOLAÇÕES ENCONTRADAS
```

---

*v1.0 — 28/02/2026*
