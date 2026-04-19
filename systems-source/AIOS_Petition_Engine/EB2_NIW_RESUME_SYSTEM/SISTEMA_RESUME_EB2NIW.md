# SISTEMA DE PRODUÇÃO DE RÉSUMÉ EB-2 NIW — V2.0 (DNA Visual V4)

> Este documento define o PROCESSO COMPLETO de produção do résumé EB-2 NIW via python-docx.
> O layout/design é IDÊNTICO ao EB-1A. As diferenças estão na ESTRUTURA DE CONTEÚDO.

---

## 1. VISÃO GERAL

O Résumé EB-2 NIW NÃO é um currículo tradicional. É um **inventário estratégico de evidências + proposta de atuação nos EUA**, que serve como:

1. **Guia de navegação** para o oficial do USCIS
2. **Índice de evidências** com metadata estruturada
3. **Exposição das Proposed Endeavors** com dados de mercado e alinhamento federal
4. **Complemento da Cover Letter** — a CL argumenta juridicamente (Dhanasar), o Résumé apresenta fatos

### Diferenças EB-2 NIW vs. EB-1A

| Dimensão | EB-1A | EB-2 NIW |
|----------|-------|----------|
| Framework legal | Kazarian (10 critérios) | Dhanasar (3 prongs) |
| Requisito base | Extraordinary ability | Advanced degree + Exceptional ability |
| Proposed Endeavors | Opcional / Complementar | OBRIGATÓRIO — seção principal |
| Dados de mercado | Não necessário | OBRIGATÓRIO (BLS, TAM/SAM, fontes) |
| Seções por critério | C1-C10 | NÃO — organizado por tema |
| Política governamental | Não necessário | OBRIGATÓRIO (EO, CHIPS Act, etc.) |

---

## 2. ARQUITETURA DO BUILD

Idêntica ao EB-1A: multi-part com merge.

```
├── helpers.py              ← Módulo compartilhado (IDÊNTICO ao EB-1A)
├── build_part1.py          ← Síntese + Histórico (Gantt) + Experiência
├── build_part2.py          ← Contribuições + Publicações + Formação + Cursos
├── build_part3.py          ← Proposed Endeavors + Cartas de Recomendação
├── merge.py                ← Merge com image relationship remapping
├── thumbnails/             ← Thumbnails (thumb_*.png)
└── VF_Resume_[Nome].docx   ← Output final
```

### Regra de Divisão EB-2 NIW:
- **Part1**: Header + Síntese + Histórico + Experiência Profissional
- **Part2**: Contribuições Técnicas + Publicações + Formação Acadêmica + Cursos/Palestras
- **Part3**: PROPOSED ENDEAVORS (seção pesada com dados de mercado) + Cartas de Recomendação

---

## 3. MÓDULO HELPERS

**100% IDÊNTICO ao EB-1A.** Mesmas cores, fontes, dimensões, funções.
Ver `SISTEMA_RESUME_EB1A.md` Seção 3 para detalhes completos.

Único ajuste: no `setup_document()`, o header Row 1 deve ter "EB-2 NIW" em vez de "EB-1A".

---

## 4. THUMBNAIL PIPELINE

**100% IDÊNTICO ao EB-1A.**
- pdftoppm → PIL resize 400px → THUMB_MAP
- Ver `SISTEMA_RESUME_EB1A.md` Seção 4

---

## 5. ANATOMIA DO RÉSUMÉ EB-2 NIW

### Ordem das Seções:

| # | Seção | Páginas Est. |
|---|-------|-------------|
| 1 | Header (navy bar) | automático |
| 2 | Síntese Profissional | 1-2 |
| 3 | Histórico Profissional (Gantt) | 1 |
| 4 | Experiência Profissional Detalhada | 3-8 |
| 5 | Contribuições Técnicas e Profissionais | 5-15 |
| 6 | Publicações e Artigos | 2-5 |
| 7 | Formação Acadêmica | 2-4 |
| 8 | Cursos Ministrados / Palestras | 2-5 |
| 9 | **PROJETO EB-2 NIW — PROPOSED ENDEAVORS** | 5-10 |
| 10 | Cartas de Recomendação | 1-2 |

### Nota sobre Contribuições (Seção 5)
No EB-2 NIW, as contribuições NÃO são organizadas por critério (C1-C10).
São organizadas por TEMA ou TIPO:
- Contribuições Open-Source
- Projetos Empresariais
- Inovações Técnicas
- etc.

Cada tema usa **Teal Sub-Header** para agrupar.

---

## 6. SEÇÃO PROPOSED ENDEAVORS — Detalhamento Completo

### 6.1 Estrutura

```python
# Navy section header
add_navy_section_header(doc, "PROJETO EB-2 NIW — PROPOSED ENDEAVORS")

# Parágrafo introdutório sobre Dhanasar
add_paragraph(doc, "The EB-2 National Interest Waiver (NIW) classification, as established in "
    "Matter of Dhanasar, 26 I&N Dec. 884 (AAO 2016), requires demonstration that...")

# Para cada proposta:
add_teal_sub_header(doc, "Proposta A: [Título]")
# Parágrafos descritivos com dados de mercado
# Bullets com métricas
# Evidence blocks com fontes

# Tabela comparativa
# (navy header, alternate rows, Garamond 9.5pt)

# Parágrafo conclusivo Dhanasar
```

### 6.2 Dados Obrigatórios por Proposta

Cada Proposed Endeavor DEVE incluir:

1. **Descrição clara** do que o beneficiário vai fazer nos EUA
2. **Mercado-alvo** com dados quantitativos:
   - TAM (Total Addressable Market)
   - Projeção de crescimento (CAGR, % ao ano)
   - Fonte (Gartner, Statista, McKinsey, Markets and Markets, etc.)
3. **Código BLS/O*Net** relevante:
   - Ex: 15-1252 (Software Developers)
   - Projeção de crescimento ocupacional 2024-2034
4. **Alinhamento com políticas governamentais**:
   - Executive Orders (EO 14110 AI, EO 14028 Cybersecurity, etc.)
   - CHIPS and Science Act
   - NIST Frameworks
   - DoL Priority Areas
   - Critical & Emerging Technologies List
5. **Por que o beneficiário é well-positioned**:
   - Track record (projetos, certificações, contribuições)
   - Diferencial competitivo
   - Evidências específicas de capacidade

### 6.3 Tabela Comparativa

```python
# Create comparison table
table = doc.add_table(rows=N+1, cols=4)  # header + N dimensions x 4 (dim + 3 proposals)
# Navy header row
# Alternate row colors: F5F5F5 / FFFFFF
# Garamond 9.5pt
# Dimensions: Mercado, BLS Code, Crescimento, Política Federal, Receita Projetada, etc.
```

### 6.4 Parágrafo Conclusivo Dhanasar

Deve explicitar os 3 prongs:
1. **Substantial merit and national importance**: As propostas endereçam necessidades críticas dos EUA (segurança cibernética, modernização tecnológica, capacitação de workforce)
2. **Well positioned**: O beneficiário tem X anos de experiência, Y certificações, Z contribuições que demonstram capacidade comprovada
3. **Balance of equities**: Aprovar o caso beneficia os EUA mais do que negar, dado o déficit de profissionais qualificados na área

---

## 7. FASES DE PRODUÇÃO

### FASE 0 — INVENTÁRIO
1. Listar TODOS os documentos do cliente
2. Gerar thumbnails
3. Mapear documentos a seções do résumé
4. Extrair Proposed Endeavors do projeto/Petition Letter

### FASE 1 — PLANO ESTRATÉGICO
1. Definir seções e evidence blocks por seção
2. Definir as Proposed Endeavors (geralmente 2-4)
3. Pesquisar dados de mercado para cada proposta
4. Confirmar com Paulo

### FASE 2 — HELPERS
1. Criar helpers com constantes V4
2. Popular THUMB_MAP
3. Testar com doc dummy

### FASE 3 — PRODUÇÃO
- Part1: Header + Síntese + Gantt + Experiência
- Part2: Contribuições + Publicações + Formação + Cursos
- Part3: Proposed Endeavors + Cartas

### FASE 4 — MERGE
Merge com image relationship remapping (idêntico ao EB-1A)

### FASE 5 — POST-PROCESSING + VERIFICAÇÃO
- Zero Arial
- Zero R$ (exceto se autorizado)
- Proposed Endeavors completas
- Dados de mercado com fontes
- Códigos BLS presentes
- Framework Dhanasar referenciado

### FASE 6 — AUDITORIA CRUZADA
Cruzar com Cover Letter (números, nomes, datas idênticos)

---

## 8. REGRAS CARDINAIS (Complementares às do EB-1A)

1-7: **Idênticas ao EB-1A** (zero argumentação jurídica, zero contradição, zero dados inventados, zero Arial, zero R$, consistência interna, evidence blocks completos)

8. **PROPOSED ENDEAVORS OBRIGATÓRIAS** — Sem esta seção o résumé EB-2 NIW está INCOMPLETO.
9. **DADOS DE MERCADO COM FONTE** — Não inventar números. Citar BLS, Gartner, Statista, etc.
10. **CÓDIGOS BLS CORRETOS** — Verificar no bls.gov. Formato: XX-XXXX.
11. **FRAMEWORK DHANASAR** — Referenciar os 3 prongs no parágrafo conclusivo.
12. **SEM SEÇÕES POR CRITÉRIO EB-1A** — EB-2 NIW não usa C1-C10.

---

## 9. ANTI-PATTERNS ESPECÍFICOS EB-2 NIW

- ❌ Usar seções C1-C10 (isso é EB-1A)
- ❌ Proposed Endeavors sem dados de mercado
- ❌ Proposed Endeavors sem código BLS
- ❌ Proposed Endeavors sem alinhamento com política governamental
- ❌ Esquecer o parágrafo Dhanasar no final
- ❌ Header com "EB-1A" em vez de "EB-2 NIW"
- ❌ Contribuições organizadas por critério (devem ser por tema)

---

## 10. CHECKLIST FINAL DE ENTREGA

Além dos itens do EB-1A (fontes, cores, margins, etc.):

- [ ] Header indica "EB-2 NIW"
- [ ] Síntese menciona "advanced degree" ou "exceptional ability"
- [ ] Seção Proposed Endeavors presente
- [ ] Cada proposta tem: descrição + mercado + BLS + política + positioning
- [ ] Tabela comparativa das propostas
- [ ] Referência explícita ao framework Dhanasar (3 prongs)
- [ ] Dados de mercado com fontes citadas
- [ ] Códigos BLS verificados e corretos
- [ ] NÃO tem seções C1-C10
- [ ] Contribuições organizadas por tema (não por critério)

---

*Sistema Résumé EB-2 NIW V2.0 — DNA Visual V4 — 03/mar/2026*
