# SISTEMA DE PRODUÇÃO DE RÉSUMÉ EB-1A — v1.0

## Visão Geral

O Résumé EB-1A NÃO é um currículo tradicional. É um **inventário estratégico de evidências mapeado por critério**, que serve como:

1. **Guia de navegação** para o oficial do USCIS entender quem é o beneficiário
2. **Índice de evidências** com metadata estruturada de cada prova documental
3. **Complemento da Cover Letter** — a CL argumenta juridicamente, o Résumé apresenta os fatos

---

## Diferenças Fundamentais: Résumé vs. Cover Letter

| Dimensão | Cover Letter | Résumé |
|----------|-------------|--------|
| Função | Argumentação jurídica | Inventário de fatos e evidências |
| Tom | Advocatício, persuasivo | Factual, descritivo, preciso |
| Estrutura | Prosa fluida com footnotes | Blocos estruturados de metadata |
| Tamanho | 50-120 páginas | 25-75 páginas |
| Footnotes | Obrigatório (legal citations) | NÃO usa footnotes |
| Imagens | NÃO usa imagens | USA imagens (certificados, matérias, screenshots) |
| Legal Framework | Sim (Kazarian, 8 CFR) | NÃO — zero análise legal |
| Idioma | Inglês | Inglês (com termos em português quando nome de instituição/cargo) |
| Evidence Blocks | Narrativa sobre cada evidência | Metadata estruturada + narrativa curta |

---

## Anatomia do Résumé EB-1A (Estrutura Canônica)

Baseado na análise de 3 benchmarks aprovados (Renato 54pg, Carlos 72pg, Bruno 27pg):

### BLOCO 1 — HEADER (1 página)
```
RÉSUMÉ
[NOME COMPLETO DO BENEFICIÁRIO]

Contact
Phone: [telefone]
E-mail: [email]
[Título Profissional Principal] | [SOC/O*Net Code]
Endereço: [endereço completo]
```

### BLOCO 2 — RESUMO EXECUTIVO (1-2 páginas)
Narrativa fluida de 4-8 parágrafos cobrindo:
- Quem é o beneficiário (credenciais, formação, experiência)
- O que criou/desenvolveu (contribuição principal)
- Qual o impacto (números de alcance, receita, adoção)
- Por que é extraordinário (diferencial vs. campo)

**Regra**: O resumo executivo é a ÚNICA seção em prosa narrativa livre. Todas as demais são blocos estruturados.

### BLOCO 3 — SEÇÕES POR CRITÉRIO (bulk do documento)
Cada critério batido recebe uma seção com:
1. Título da seção (em inglês, ALL CAPS)
2. Introdução contextual (1-2 parágrafos)
3. Evidence Blocks (um por evidência)

### BLOCO 4 — FORMAÇÃO ACADÊMICA (2-4 páginas)
Evidence blocks para cada grau acadêmico, certificação, curso relevante.

### BLOCO 5 — ADDENDUM (opcional, 2-3 páginas)
Narrativa consolidada de impacto, útil para perfis complexos.

---

## Evidence Block — Formato Canônico (COM MINIATURA OBRIGATÓRIA)

Cada evidência no résumé segue este formato padronizado. A **MINIATURA** (thumbnail da 1ª página do PDF da evidência) é elemento OBRIGATÓRIO.

### Layout: Tabela 2 Colunas + Texto Abaixo

```
┌──────────────┬──────────────────────────────────────────────────┐
│              │ [TÍTULO DA EVIDÊNCIA — Bold]                      │
│  [MINIATURA] │                                                    │
│  Print da    │ Critério(s) Relacionado(s): Critério [N]          │
│  1ª página   │ Instituição/Entidade: [nome completo]              │
│  do PDF da   │ Tipo de Evidência: [categoria]                     │
│  evidência   │ Data de Emissão: [DD de mês de AAAA]              │
│              │ Título/Distinção Concedida: [se aplicável]         │
│  160px larg. │ Local: [cidade, estado, país]                      │
│  borda fina  │ Website/URL: [link completo]                       │
│  #CCCCCC     │                                                    │
└──────────────┴──────────────────────────────────────────────────┘

Descrição & Impacto/Relevância:
[1-3 parágrafos — largura total, abaixo da tabela]

[OPTIONAL: Box de contexto institucional — fundo #F5F5F5]
[Nome do Veículo/Entidade] é [descrição factual: fundação, alcance, 
posição no mercado, audiência]. [1-2 frases de contextualização.]
```

### O que é a Miniatura

**DEFINIÇÃO**: Screenshot/print da PRIMEIRA PÁGINA do PDF que será enviado como exhibit ao USCIS.

**PROPÓSITO**: Permite que o oficial identifique visualmente o documento sem abrir o exhibit, acelerando a análise e demonstrando profissionalismo.

**COMO GERAR**:
```bash
pdftoppm -f 1 -l 1 -png -r 150 evidence_XX.pdf thumb
convert thumb-1.png -resize 160x thumb_evidence_XX.png
```

**REGRAS**:
- Largura: 160px (~4cm / ~1.1 inch)
- Borda: fina (#CCCCCC, 0.5pt)
- Posição: coluna esquerda da tabela do evidence block
- Se PDF indisponível: placeholder `[THUMBNAIL]` em 8pt cinza (#999999)
- NUNCA omitir — todo evidence block DEVE ter miniatura ou placeholder

---

## Ordem das Seções por Critério

A ordem das seções no résumé segue a MESMA ordem da Cover Letter para facilitar cross-reference:

| Ordem | Seção | Critério |
|-------|-------|----------|
| 1 | Professional Licensure / Registro Profissional | Pré-requisito (não é critério, mas valida autoridade) |
| 2 | Receipt of Awards or Distinctions | C1 |
| 3 | Membership in Associations | C2 |
| 4 | Published Material About the Beneficiary | C3 |
| 5 | Judging the Work of Others | C4 |
| 6 | Original Contributions of Major Significance | C5 |
| 7 | Authorship of Scholarly Articles | C6 |
| 8 | Display of Work at Exhibitions | C7 |
| 9 | Leading or Critical Role | C8 |
| 10 | High Salary / Remuneration | C9 |
| 11 | Commercial Success in Performing Arts | C10 |

**IMPORTANTE**: Só incluir seções dos critérios que o cliente bate. Não incluir seção de critério não pleiteado.

---

## Fases de Produção

### FASE 0 — INVENTÁRIO
1. Listar TODOS os documentos disponíveis do cliente
2. Contar e confirmar com Paulo
3. Mapear cada documento ao critério que ele suporta
4. Identificar GAPS (evidências faltantes)

### FASE 1 — PLANO ESTRATÉGICO
1. Definir quais critérios o résumé vai cobrir
2. Definir quantos evidence blocks por seção
3. Estimar número de páginas (benchmark: 3-5 páginas por critério)
4. Confirmar com Paulo antes de produzir

### FASE 2 — PRODUÇÃO (por seção)
1. Produzir uma seção por vez (nunca o résumé inteiro de uma vez)
2. Cada seção = header + contexto + evidence blocks
3. Validar contra benchmark antes de entregar
4. Aguardar aprovação de Paulo antes de avançar

### FASE 3 — CONSOLIDAÇÃO
1. Montar documento final (.docx)
2. Adicionar imagens se disponíveis
3. Executar validação mecânica
4. Entregar para revisão final

### FASE 4 — AUDITORIA CRUZADA
1. Cruzar números do résumé com a cover letter (DEVEM ser idênticos)
2. Cruzar nomes de evidências (DEVEM ser idênticos)
3. Cruzar datas (DEVEM ser idênticos)
4. Verificar que NENHUM dado do résumé contradiz a cover letter

---

## Regras Cardinais

1. **ZERO ARGUMENTAÇÃO JURÍDICA** — O résumé apresenta fatos. Quem argumenta é a Cover Letter.
2. **ZERO CONTRADIÇÃO COM A COVER LETTER** — Todo número, data, nome DEVE ser idêntico.
3. **ZERO DADOS INVENTADOS** — Tudo vem de documento fonte. Se não tem fonte, marca [VERIFICAR].
4. **CONSISTÊNCIA INTERNA** — O mesmo dado (seguidores, receita, data) aparece IGUAL em todas as seções.
5. **EVIDENCE BLOCKS COMPLETOS** — Cada bloco DEVE ter TODOS os campos do template.
6. **IMAGENS COM LEGENDA** — Toda imagem tem caption descritiva.
7. **INGLÊS CORRETO** — O documento é em inglês. Nomes próprios e termos brasileiros mantêm grafia original.

---

*Sistema Résumé EB-1A v1.0 — 21/02/2026*
