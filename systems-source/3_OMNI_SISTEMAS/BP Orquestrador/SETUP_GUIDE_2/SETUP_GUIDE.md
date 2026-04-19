# SETUP — Como montar a pasta pro Claude Code

## Pasta de trabalho
```
/Users/paulo1844/Documents/OMNI/BP Orquestrador/
```

## Arquivos que você PRECISA colocar nessa pasta:

### 1. CLAUDE.md (OBRIGATÓRIO — já está pronto)
O Claude Code lê automaticamente. Contém todas as instruções.

### 2. BP_DIRETRIZES_RECONSTRUCAO.md (OBRIGATÓRIO — já está pronto)
Post-mortem das 12 versões. Catálogo de erros.

### 3. Benchmarks (copiar do projeto)
- `VF_business_plan_ikaro_ferreira_souza.pdf` ← benchmark principal
- `BP_Pravion_LLC_FINAL.pdf` ← benchmark secundário

### 4. Dados do caso Everton (copiar do projeto)
- `V14_business_plan_prompt__1_.docx` ← estrutura do BP
- `V6_prompts_BP_completo_otimizac_a_o_prompts.docx` ← prompts
- `V3_Planilha_Financeira_Everton.xlsx` ← financeiro
- `curriculo_Everton.docx` ← currículo

### 5. Estratégia e localização (copiar do projeto)
- `LOCALIZAC_A_O_ESTRATE_GICA_EVERTON_RODRIGO.pdf`
- `ESTRATE_GIA_EVERTON_RODRIGO_VIEIRA.pdf`

### 6. Regulamentação EB2 (copiar do projeto)
- `Chapter_5__Advanced_Degree_or_Exceptional_Ability___USCIS.pdf`
- `eCFR____8_CFR_204_5__Petitions_for_employmentbased_immigrants_.pdf`
- `II__EB2_NIAF2025.pdf`
- `Mudanc_as_no_EB2_NIW_2025__II.pdf`
- `O_Adjudicador_Algori_tmico__2026.pdf`

### 7. Orçamento federal (copiar do projeto)
- `M2534NSTM2FiscalYearFY2027AdministrationResearchandDevelopmentBudgetPrioritiesandCrossCuttingActions_1.pdf`
- `FiscalYear2026DiscretionaryBudgetRequest.pdf`
- `BILLS-119hr1enr.pdf`

### 8. V12 como referência negativa (copiar do output anterior)
- `BP_Vieira_Operations_LLC_v12.docx` ← o que NÃO fazer

### 9. Sistema JSON do Lovable (você já tem)
- O JSON com os prompts do sistema de geração

---

## Estrutura final da pasta:
```
BP Orquestrador/
├── CLAUDE.md                          ← instrução master pro Claude Code
├── BP_DIRETRIZES_RECONSTRUCAO.md      ← post-mortem + catálogo de erros
│
├── benchmarks/
│   ├── VF_business_plan_ikaro.pdf     ← BENCHMARK PRINCIPAL
│   └── BP_Pravion_LLC_FINAL.pdf       ← benchmark secundário
│
├── dados_everton/
│   ├── V14_business_plan_prompt.docx  ← estrutura
│   ├── V6_prompts_BP.docx            ← prompts otimização
│   ├── V3_Planilha_Financeira.xlsx   ← financeiro
│   ├── curriculo_Everton.docx        ← CV
│   ├── LOCALIZACAO_ESTRATEGICA.pdf   ← localização
│   └── ESTRATEGIA_EVERTON.pdf        ← estratégia
│
├── regulamentacao/
│   ├── Chapter_5_USCIS.pdf
│   ├── eCFR_8_CFR_204_5.pdf
│   ├── II_EB2_NIAF2025.pdf
│   ├── Mudancas_EB2_NIW_2025.pdf
│   ├── Adjudicador_Algoritmico_2026.pdf
│   ├── BILLS-119hr1enr.pdf
│   ├── FY2027_Budget_Priorities.pdf
│   └── FY2026_Budget_Request.pdf
│
├── referencia_negativa/
│   └── BP_Vieira_v12.docx            ← o que NÃO fazer
│
├── sistema_lovable/
│   └── prompts.json                   ← JSON do sistema Lovable
│
└── output/                            ← onde o Claude Code salva o resultado
    ├── BP_Vieira_Operations_LLC_FINAL.docx
    └── BP_Vieira_Operations_LLC_FINAL.pdf
```

---

## Como rodar no Claude Code:

```bash
cd "/Users/paulo1844/Documents/OMNI/BP Orquestrador"
claude
```

Depois é só pedir:
```
Leia o CLAUDE.md e o BP_DIRETRIZES_RECONSTRUCAO.md. 
Depois leia os benchmarks (Ikaro e Medeiros).
Depois reconstrua o BP do ZERO seguindo as diretrizes.
Valide 3x antes de entregar.
```

O CLAUDE.md já tem tudo: processo, checklist, dados, antipadrões, script de validação.
