# TEMPLATE RÉSUMÉ EB-1A — Estrutura por Seção (V2.0 — Layout Premium)

> Este template define a estrutura EXATA de cada seção. Todo résumé produzido DEVE seguir esta estrutura. Os exemplos visuais usam a paleta Navy/Teal/Garamond definida no FORMATTING_SPEC.

---

## 1. HEADER — Barra Navy Premium

O header é gerado automaticamente pelo `setup_document()` como uma tabela no header do Word.

### Estrutura Visual:
```
╔════════════════════════════════════════════════════════════════╗
║  ██████████ NAVY (#2D3E50) ██████████                          ║
║  [NOME COMPLETO EM MAIÚSCULAS — Garamond 20pt Bold Branco]    ║
╠════════════════════════════════════════════════════════════════╣
║  ██████████ NAVY (#2D3E50) ██████████                          ║
║  RÉSUMÉ [11pt Bold]          E-mail: xxx@xxx [9pt Branco]     ║
╠════════════════════════════════════════════════════════════════╣
║  ████████ TEAL (#3498A2) — accent line ████████                ║
╚════════════════════════════════════════════════════════════════╝
```

### Variação EB-1A:
Na Row 1, incluir SOC/O*Net e categoria:
```
RÉSUMÉ                    SOC/O*Net: XX-XXXX.XX | EB-1A
```

### Dados Obrigatórios:
- Nome completo do beneficiário
- E-mail profissional
- (Opcional) SOC/O*Net code, categoria de visto

---

## 2. SÍNTESE / EXECUTIVE SUMMARY (1-2 páginas)

### Introduzido por Navy Section Header:
```
┌─── NAVY BAR ─────────────────────────────────────────────┐
│  SÍNTESE PROFISSIONAL  ou  EXECUTIVE SUMMARY             │
└──────────────────────────────────────────────────────────┘
```

### Estrutura Interna (4-8 parágrafos Garamond 10.5pt, justificados):

**Parágrafo 1 — Quem é**
Credenciais, registro profissional, anos de experiência. Posicionamento no campo.
- Tom: factual, assertivo, terceira pessoa ("Dr. [Name] is..." ou "[Name] é...")

**Parágrafo 2 — O que criou/desenvolveu**
Contribuição original principal. Metodologia, produto, sistema ou inovação central.

**Parágrafo 3 — Impacto quantificado**
Números: seguidores, alunos, clientes, receita, empregados, países, downloads.

**Parágrafo 4 — Por que é extraordinário**
Diferencial vs. campo. O que faz que outros não fazem. Top X%.

**Parágrafos 5-8 (opcionais)**
Pilares da metodologia, reconhecimentos-chave, expansão internacional, atuação em setores específicos.

### REGRA DE PROFUNDIDADE
Cada parágrafo deve ter **4-6 linhas** no mínimo. NÃO aceitar parágrafos mirrados de 2 linhas. O Executive Summary é onde o oficial do USCIS forma a primeira impressão — deve ser DENSO e COMPLETO.

### Idioma
- EB-1A padrão: **Inglês**
- Se Paulo instruir: **Português** (como no caso do Rafael)
- Manter consistente em TODO o documento

---

## 3. HISTÓRICO PROFISSIONAL — Com Gantt Timeline

### Introduzido por Navy Section Header:
```
┌─── NAVY BAR ─────────────────────────────────────────────┐
│  HISTÓRICO PROFISSIONAL  ou  PROFESSIONAL HISTORY        │
└──────────────────────────────────────────────────────────┘
```

### Gantt/Staircase Timeline (tabela colorida):
```
┌────────┬─────┬─────┬─────┬─────┬─────┬─────┐
│Empresa │2015 │2016 │2017 │2018 │2019 │2020 │  ← Navy header
├────────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ Emp A  │ ███ │ ███ │ ███ │     │     │     │  ← Teal = ativo
│ Emp B  │     │     │ ███ │ ███ │ ███ │     │
│ Emp C  │     │     │     │     │ ███ │ ███ │
└────────┴─────┴─────┴─────┴─────┴─────┴─────┘
```
- Header: Navy background, texto Branco
- Células ativas: Teal (#3498A2)
- Células inativas: Branco
- Nome da empresa: Garamond 8pt Bold
- Anos: Garamond 8pt

### REGRA: `start <= yr <= end` (incluir ano final)

---

## 4. EXPERIÊNCIA PROFISSIONAL DETALHADA

### Para cada empregador — Company Box:
```
┌─── LIGHT_GRAY (#F5F5F5) background, borda #CCCCCC ──────┐
│  Empresa: [Nome]                                          │
│  Cargo: [título]                                          │
│  Período: [início – fim]                                  │
│  Sobre a empresa: [italic cinza, 1-2 frases]             │
└──────────────────────────────────────────────────────────┘
```

### Seguido de:
- 3-5 bullets (●) descrevendo realizações
- Evidence blocks para documentos comprobatórios (NFS-e, contratos, etc.)

### PROIBIDO nesta seção:
- ❌ Valores de salário/remuneração (R$, USD)
- ❌ Linguagem de marketing ("revolucionou", "transformou")
- ✅ Fatos, métricas, responsabilidades específicas

---

## 5. SEÇÕES POR CRITÉRIO — Template por Evidence Block

Cada seção de critério segue este padrão:

### A. Navy Section Header
```
┌─── NAVY BAR ─────────────────────────────────────────────┐
│  [TÍTULO DO CRITÉRIO EM CAPS]                             │
└──────────────────────────────────────────────────────────┘
```

### B. Parágrafo Introdutório
1-2 parágrafos Garamond 10.5pt contextualizando o critério para este beneficiário.
**MÍNIMO 4 linhas por parágrafo. NADA de parágrafos mirrados.**

### C. Evidence Blocks (um por evidência)

#### Evidence Block Padrão (para prêmios, certificações, contribuições principais):
```
┌────────────────────────────────────┬─────────────────────┐
│                                    │                     │
│ Prêmio: MVP 2024                   │  ┌──────────────┐  │
│ Categoria: Developer Tech          │  │              │  │
│ Conferido por: Microsoft Corp      │  │  THUMBNAIL   │  │
│ Âmbito: Internacional              │  │  2.6" width  │  │
│                                    │  │              │  │
│ Descrição / Impacto:  [Navy bold]  │  └──────────────┘  │
│ Texto italic com 4-6 linhas de     │                     │
│ profundidade técnica e inferência  │                     │
│ causal sobre a relevância...       │                     │
│                                    │                     │
└────────────────────────────────────┴─────────────────────┘
```

#### Evidence Block Compacto (para artigos, conferências, cursos):
```
┌───────────────────────────────────────┬─────────────────┐
│ Artigo: Título do artigo              │ ┌────────────┐  │
│ Plataforma: InfoQ                     │ │ THUMBNAIL  │  │
│ Ano: 2023                             │ │ 2.0" width │  │
│ Idioma: EN/PT                         │ └────────────┘  │
│                                       │                 │
│ Descrição / Impacto:                  │                 │
│ Texto italic com análise...           │                 │
└───────────────────────────────────────┴─────────────────┘
```

### D. Sub-Bullets para Listas (quando há muitos itens similares)
Após os evidence blocks principais de uma categoria, listar itens adicionais com:
```
○  Título do item (Plataforma, Ano, Idioma) — descrição curta
```

### E. Teal Sub-Headers (para agrupar dentro de uma seção)
Quando uma seção tem subcategorias (ex: artigos por tema):
```
┌─── TEAL BAR ─────────────────────────────────────────────┐
│  Entity Framework Core — Contribuições Técnicas          │
└──────────────────────────────────────────────────────────┘
```

---

## 6. SEÇÕES ESPECÍFICAS EB-1A — Notas por Critério

### C1 — AWARDS / PRÊMIOS
- Evidence block PADRÃO para cada prêmio
- Incluir: seletividade, critérios, quem concede, percentil
- Box institucional para entidades que concedem

### C2 — MEMBERSHIP / ASSOCIAÇÕES
- Foco em critérios de admissão, processo de seleção
- NÃO incluir registros obrigatórios (CRF/CRM/OAB)

### C3 — PUBLISHED MATERIAL / MATERIAL PUBLICADO
- Evidence block para cada matéria
- Box institucional OBRIGATÓRIO (audiência, fundação, grupo empresarial)
- Screenshot quando disponível

### C4 — JUDGING / JULGAMENTO DE PARES
- Cartas de convite, certificados, atas de bancas
- Contexto: peer review, trabalho de outros profissionais

### C5 — ORIGINAL CONTRIBUTIONS / CONTRIBUIÇÕES ORIGINAIS
- Evidence block PADRÃO para cada contribuição
- Dados de adoção (downloads, implementações, citações)
- Teal sub-headers para categorizar contribuições

### C6 — SCHOLARLY ARTICLES / ARTIGOS
- Evidence block COMPACTO para artigos em destaque
- Sub-bullets para artigos adicionais agrupados por tema
- Teal sub-headers por categoria

### C7 — EXHIBITIONS / EXPOSIÇÕES
- Evidence block COMPACTO para cada evento
- Incluir: palco, audiência, curadoria

### C8 — LEADING ROLE / PAPEL DE LIDERANÇA
- Company Box para cada organização
- Bullets com realizações
- Evidence blocks para documentos (CNPJ, contrato social, NFS-e)

### C9 — HIGH SALARY / ALTA REMUNERAÇÃO
- Tabela comparativa (Navy header, alternate rows)
- Evidence block para IRPF/comprovante
- ⚠️ VERIFICAR COM PAULO se incluir ou omitir

### C10 — COMMERCIAL SUCCESS
- Raramente aplicável
- Se incluir: vendas, streaming, licenciamento

---

## 7. FORMAÇÃO ACADÊMICA

### Navy Section Header + Evidence Blocks por grau:
```
Evidence Block Padrão:
  Instituição: [nome completo]
  Curso: [nome do curso]
  Localização: [cidade, estado, país]
  Tipo: [Graduação / Pós-Graduação / Mestrado]
  Status: [Concluído]

  Descrição / Impacto:
  [Narrativa sobre o programa, foco técnico, relevância]
```

### Certificações Complementares:
Lista em bullets (●) após os evidence blocks principais.

---

## 8. CURSOS MINISTRADOS / PALESTRAS / CONFERÊNCIAS

### Evidence Block por curso/palestra principal
### Sub-bullets para listagem adicional
### Teal sub-headers para agrupar (YouTube Lives, Conferências, etc.)

---

## 9. CARTAS DE RECOMENDAÇÃO

### Tabela com Navy header:
```
┌─── NAVY HEADER ──────────────────────────────────────────┐
│  Nº  │  Recomendante  │  Cargo / Afiliação              │
├──────┼────────────────┼─────────────────────────────────┤
│  1   │  Nome          │  Cargo — Empresa                │
│  2   │  Nome          │  Cargo — Empresa                │
└──────┴────────────────┴─────────────────────────────────┘
```
- Alternate rows: #F5F5F5 / #FFFFFF
- Nota final sobre qualificações dos recomendantes

---

## 10. PROPOSED ENDEAVORS (para EB-2 NIW — NÃO usado em EB-1A)

Se o caso for EB-2 NIW, incluir seção com:
- Navy Section Header
- Descrição de cada proposta (Teal sub-headers por proposta)
- Bullets com dados de mercado e alinhamento federal
- Quadro comparativo (tabela Navy header)
- Parágrafo conclusivo com framework legal (Dhanasar)

---

## CHECKLIST FINAL — Evidence Block Completo

Antes de entregar QUALQUER evidence block, verificar:

- [ ] Tem labels bold com valores em regular
- [ ] "Descrição / Impacto:" está em bold Navy DENTRO do bloco
- [ ] Texto de impacto está em italic cinza DENTRO do bloco (não abaixo)
- [ ] Impacto tem MÍNIMO 4 linhas (nada de "duas linhas mirradinhas")
- [ ] Thumbnail está na coluna direita (ou placeholder [THUMBNAIL])
- [ ] Toda a fonte é Garamond — ZERO Arial
- [ ] Cores: só Navy, Teal, Branco, Preto, Cinzas
- [ ] Bordas: #CCCCCC
- [ ] Números verificados contra documento fonte
- [ ] Consistente com outras seções e com Cover Letter

---

*Template Résumé EB-1A V2.0 — Layout Premium — 03/mar/2026*
