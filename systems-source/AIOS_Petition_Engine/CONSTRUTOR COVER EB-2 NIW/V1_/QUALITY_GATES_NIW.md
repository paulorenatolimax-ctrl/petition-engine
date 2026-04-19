# QUALITY GATES — EB-2 NIW
## 6 Gates de Validação Obrigatória
### v1.0 — 28/02/2026

---

## GATE 1 — FORBIDDEN CONTENT SCAN

**Quando**: Após CADA seção produzida (Eligibility, Prong 1, Prong 2 Parts, Prong 3, Conclusão).

**Procedimento**: Executar o scan completo de `FORBIDDEN_CONTENT_NIW.md`.

**Critério**: Zero violações F-01 a F-18.

**Se falhar**: Corrigir TODAS as violações antes de prosseguir.

---

## GATE 2 — EVIDENCE NAMING CONSISTENCY (3-Way Match)

**Quando**: Após produção completa de todas as seções.

**Procedimento**: Verificar que CADA evidence aparece com nome IDÊNTICO em 3 locais:

| Local | Exemplo |
|-------|---------|
| Evidence Index (início) | Evidence 01. Bacharelado em Sistemas de Informação - Universidade Estácio de Sá |
| Corpo do texto | ...conforme documentado no diploma de Bacharelado em Sistemas de Informação pela Universidade Estácio de Sá (**Evidence 01**)... |
| Arquivo real | (nome do arquivo fornecido pelo cliente) |

**3-Way Check para CADA evidence**:
```
Evidence [N]:
  Índice: "[TÍTULO EXATO]" → ✅/❌
  Corpo:  "[REFERÊNCIA]" → ✅/❌  
  Arquivo: "[NOME DO ARQUIVO]" → ✅/❌
  Match: ✅ 3/3 / ❌ [N]/3 → corrigir
```

**Critério**: 100% match para TODAS as evidências.

**Erros comuns**:
- Índice diz "Evidence 05 - Credential Evaluation" mas corpo diz "Evidence 5 - Avaliação de Credenciais"
- Índice usa nome em inglês, corpo em português (ou vice-versa)
- Número da evidence errado (Evidence 12 no corpo quando deveria ser Evidence 13)

---

## GATE 3 — ANTI-BOILERPLATE ANALYSIS

**Quando**: Após produção completa de cada seção.

**Procedimento**: Para CADA parágrafo do corpo, verificar:

```
Parágrafo [N]:
  □ Contém dado numérico específico? (nome, data, percentual, valor)
  □ Contém referência a Evidence?
  □ Comprimento difere do parágrafo anterior em ±30%?
  □ Não usa expressões da lista proibida (F-07)?
  □ Não repete estrutura frasal do parágrafo anterior?
```

**Métricas-alvo**:
- **Burstiness**: Desvio padrão do comprimento das frases > 15 palavras
- **Dados por parágrafo**: Mínimo 1 dado específico por parágrafo
- **Evidence coverage**: 100% dos parágrafos com pelo menos 1 Evidence ref
- **Vocabulário**: Nenhuma expressão repetida mais de 2x no mesmo prong

**Critério**: Todos os parágrafos passam em todos os checks.

---

## GATE 4 — CROSS-CHECK NUMÉRICO

**Quando**: Após produção completa.

**Procedimento**: Para CADA dado numérico na Cover Letter, verificar fonte:

```
Dado: "[NÚMERO/ESTATÍSTICA]"
  Fonte declarada: [Evidence XX / Footnote N / Research]
  Valor na fonte: [VALOR]
  Match: ✅/❌
```

**Categorias de cross-check**:

### 4A: Business Plan ↔ Cover Letter
```
□ Receita Year 1: BP = CL?
□ Receita Year 2: BP = CL?
□ Receita Year 3: BP = CL?
□ Receita Year 5: BP = CL?
□ Receita acumulada: BP = CL?
□ Empregos diretos: BP = CL?
□ Empregos indiretos: BP = CL? (se citado no BP)
□ Endereço sede: BP = CL?
□ Investimento inicial: BP = CL?
□ Funcionários projetados: BP = CL?
□ Nome da empresa: BP = CL? (grafia exata, incluindo LLC/Inc.)
```

### 4B: Credential Evaluation ↔ Cover Letter
```
□ Grau equivalente: CE = CL?
□ Agência avaliadora: CE = CL?
□ Data da avaliação: CE = CL?
□ Graus listados: CE = CL?
```

### 4C: Résumé ↔ Cover Letter
```
□ Datas de emprego: Résumé = CL?
□ Títulos de cargos: Résumé = CL?
□ Nomes de empresas: Résumé = CL?
```

### 4D: Web Research ↔ Cover Letter
```
□ Cada estatística BLS: URL verificável?
□ Cada dado de mercado: fonte + URL?
□ Cada referência a CET/EO: nome + data corretos?
□ Cada dado CISA/DCI: URL verificável?
```

**Critério**: Zero discrepâncias.

---

## GATE 5 — FDNS/VIBE COMPLIANCE

**Quando**: Após produção de Prongs 1, 2 e 3.

**Procedimento**:

```
ENTIDADE EMPRESARIAL:
□ Articles of Incorporation existem? → SIM/NÃO
  SE SIM:
    □ CL usa "constituída/fundada"? → ✅ (permitido)
    □ EIN mencionado? → ✅/❌
    □ D&B mencionado? → ✅/❌ (se disponível)
  SE NÃO:
    □ CL usa "planejada/projetada"? → ✅ (obrigatório)
    □ CL NUNCA usa "constituída/sediada/fundada"? → ✅
    □ Timeline de formalização mencionada? → ✅/❌

DADOS VERIFICÁVEIS:
□ Endereço da empresa: verificável/consistente?
□ Número de funcionários: consistente com BP?
□ Receita: consistente com BP?
□ Se LLC em operação: dados VIBE-consistent?
```

**Critério**: Compliance total.

---

## GATE 6 — TIMELINE & DATE VALIDATION

**Quando**: Após produção completa.

**Procedimento**: Para CADA data mencionada na Cover Letter:

```
Data: [DATA]
  Contexto: [onde é usada]
  Fonte: [Evidence XX / Documento]
  Verificação: ✅/❌
  
Especificamente:
□ Data da Cover Letter: coerente com momento atual?
□ Datas de diplomas: = documento original?
□ Datas de empregos: = résumé?
□ Data da credential evaluation: = documento?
□ Datas de certificações: = documentos?
□ Datas de cartas de recomendação: = documentos?
□ Datas de cartas de clientes: = documentos?
□ Ano de dados BLS/O*NET: ano mais recente disponível?
□ EOs citados: data correta?
□ CETs citados: versão mais recente?
```

**Critério**: Zero datas incorretas ou inconsistentes.

---

## RELATÓRIO DE VALIDAÇÃO

Formato do relatório final:

```
══════════════════════════════════════
RELATÓRIO DE VALIDAÇÃO — [NOME DO CLIENTE]
Data: [DATA]
══════════════════════════════════════

GATE 1 — Forbidden Content:     ✅ PASS (0 violações)
GATE 2 — Evidence Naming:       ✅ PASS ([N]/[N] matches)
GATE 3 — Anti-Boilerplate:      ✅ PASS ([N] parágrafos OK)
GATE 4 — Cross-Check Numérico:  ✅ PASS (0 discrepâncias)
GATE 5 — FDNS/VIBE:            ✅ PASS (compliance total)
GATE 6 — Timeline/Dates:        ✅ PASS (0 inconsistências)

RESULTADO FINAL: ✅ APROVADO PARA ENTREGA
                 ❌ [N] GATES FALHARAM — CORRIGIR

══════════════════════════════════════
```

---

*v1.0 — 28/02/2026*
