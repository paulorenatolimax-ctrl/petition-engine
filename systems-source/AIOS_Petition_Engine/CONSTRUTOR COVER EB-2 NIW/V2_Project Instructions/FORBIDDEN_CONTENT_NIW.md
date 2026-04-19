# FORBIDDEN_CONTENT_NIW — Lista de Proibições Absolutas
## Cover Letter EB-2 NIW — Escritório PROEX
## ZERO TOLERÂNCIA — Qualquer violação invalida o documento
## v1.0 — 01/03/2026 (herda EB-1A v2.2 + proibições NIW-específicas)

---

## CATEGORIA 0: JUÍZO DE VALOR (CRÍTICO)

| Proibido | Substituir por | Motivo |
|----------|---------------|--------|
| "Este prong está satisfeito" | REMOVER | Juízo de valor — cabe ao oficial |
| "satisfeito/satisfaz/satisfies" (sobre prongs/requisitos) | "atendido/consistente com" | Idem |
| "satisfação" (de requisitos) | "cumprimento/atendimento" | Idem |

EXCEÇÃO: "satisfação do cliente" (NPS) em contexto de negócio é válido.

---

## CATEGORIA 0-NIW: EMPLOYER / SPONSOR (CRÍTICO — NIW-ESPECÍFICO)

**REGRA ABSOLUTA**: EB-2 NIW é autopetição (*self-petition*). NÃO EXISTE employer, sponsor, ou petitioner's employer. O beneficiário peticiona POR SI MESMO.

| Proibido | Motivo |
|----------|--------|
| "Employer: [nome]" | NIW = self-petition, zero employer |
| "Sponsor: [nome]" | Idem |
| "Petitioner's employer" | Idem |
| "Empregador patrocinador" | Idem |
| "Empresa patrocinadora" | Idem |
| "[Empresa] as the sponsoring employer" | Idem |
| "Labor certification" como algo que será obtido | NIW = WAIVER da labor cert |
| "Job offer from [empresa]" | NIW dispensa job offer |

**ONDE VERIFICAR**: Capa, metadata block, body, footer, evidence blocks, footnotes, synopsis tables, conclusão. Em TODOS os lugares.

---

## CATEGORIA 1: NOMES PROIBIDOS

| Termo | Motivo |
|-------|--------|
| PROEX | Nome do escritório |
| Carlos Avelino / Carlos Henrique Avelino | Cliente benchmark |
| Bruno Cipriano / Bruno Alcantara Cipriano | Cliente benchmark |
| Renato Silveira | Cliente benchmark |
| Ikaro Ferreira | Cliente benchmark |
| Cassio Vinicius | Cliente benchmark |
| Eduardo Rocha | Cliente benchmark |
| VPO | Referência interna |
| "Loper Light" | ERRO — correto é "Loper Bright" |

---

## CATEGORIA 2: VOZ E PESSOA

### PROIBIDO (terceira pessoa)
```
❌ "o beneficiário" / "O beneficiário"
❌ "o peticionário" / "O peticionário"
❌ "o autor" (quando autorefência)
❌ "[Nome completo]" no corpo argumentativo
```

### CORRETO (primeira pessoa)
```
✅ "apresento nesta seção..." / "meu trabalho..."
✅ "minha contribuição..." / "demonstro que..."
✅ "possuo..." / "sou reconhecido..."
✅ "planejei a [Empresa]..." / "concebi o modelo..."
```

EXCEÇÃO: citações editoriais podem usar o nome.

---

## CATEGORIA 3: SEÇÕES PROIBIDAS

| Seção | Alternativa |
|-------|-------------|
| "Objeções Antecipadas" | Defesas costuradas no texto |
| "Anticipated Objections" | Idem |
| "Resposta a Possíveis RFEs" | Antecipar sem nomear |

---

## CATEGORIA 3B: TERMOS PROIBIDOS

| Proibido | Correto | Motivo |
|----------|---------|--------|
| "jurídico/adjudicativo" | "regulatório/probatório" | Tom adversarial |
| "independentes" (para recomendadores) | omitir ou "com observação direta" | Cabe ao oficial julgar |
| "Ev." como prefixo | "Evidence" por extenso | Padrão PROEX |
| passaporte como evidência | NUNCA incluir | Não é evidência |

---

## CATEGORIA 3C: ENTIDADES PLANEJADAS/INEXISTENTES

**REGRA**: Se a empresa NÃO possui Articles of Incorporation / EIN / Operating Agreement → PLANEJADA.

| Proibido | Correto |
|----------|---------|
| "constituí a [Empresa]" | "planejei a [Empresa]" |
| "constituída na/em [Local]" | "planejada para [Local]" |
| "sediada em [Cidade]" | "projetada para [Cidade]" |
| "abri/fundei a [Empresa]" | "projetei/concebi a [Empresa]" |
| "opero a [Empresa]" | "projetei a operação da [Empresa]" |

Se beneficiário é estudante sem work permit → empresa NECESSARIAMENTE é só plano.
BP de 48 páginas NÃO significa que empresa existe.

---

## CATEGORIA 4: FORMATAÇÃO

| Proibido | Correto |
|----------|---------|
| Headers azuis | Preto #000000 |
| Fundo azul | Sage green #C5E0B4 |
| Evidence block DEPOIS do texto | SEMPRE antes |
| Dados sem footnote | Footnote obrigatório |
| Tabelas com box borders | Horizontais APENAS |
| Capa centrada "title page" | Formato carta |
| Texto em INGLÊS | **100% PT-BR** |

---

## CATEGORIA 5: FONTES E REFERÊNCIAS

| Proibido | Motivo |
|----------|--------|
| Currículo Lattes como evidência | Résumé substitui |
| Dados sem source | Zero afirmações sem base |
| URLs inventadas | Verificar ou [VERIFICAR] |
| Impact factors inventados | Verificar ou omitir |

---

## CATEGORIA 6: CONTEÚDO FACTUAL

| Proibido | Motivo |
|----------|--------|
| Inventar holdings jurídicos | Citação legal = exata |
| Afirmar Mukherji como vinculante | É persuasivo (distrito) |
| Afirmar PA-2025-16 como "lei" | É policy alert |
| Inventar dados BLS/FDIC/Census | Footnote com URL obrigatório |
| Números do BP sem cross-check | Conferir contra BP original |

---

## SCRIPT DE VALIDAÇÃO

```python
FORBIDDEN_NAMES = ["PROEX", "Carlos Avelino", "Bruno Cipriano",
    "Renato Silveira", "Ikaro Ferreira", "Cassio Vinicius",
    "Eduardo Rocha", "VPO", "Loper Light"]
FORBIDDEN_EMPLOYER = ["Employer:", "Sponsor:", "employer",
    "sponsor", "patrocinador", "patrocinadora"]
FORBIDDEN_JUDGMENT = ["satisfeito", "satisfaz", "satisfies",
    "SATISFIED", "satisfação"]
FORBIDDEN_VOICE = ["o beneficiário", "O beneficiário",
    "o peticionário", "O peticionário"]
FORBIDDEN_SECTIONS = ["Objeções Antecipadas", "Anticipated Objections"]
FORBIDDEN_TERMS = ["jurídico", "adjudicativo"]
FORBIDDEN_ABBREV = ["Ev. "]
FORBIDDEN_PLANNED = ["constituí a ", "constituída na ",
    "constituída em ", "sediada em ", "abri a ", "fundei a "]
FORBIDDEN_COLORS = ["0000FF", "0563C1", "1F3864"]
```

---
*v1.0 — 01/03/2026*
