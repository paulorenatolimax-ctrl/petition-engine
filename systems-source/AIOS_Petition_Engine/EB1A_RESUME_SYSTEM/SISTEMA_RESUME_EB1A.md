# SISTEMA DE PRODUÇÃO DE RÉSUMÉ EB-1A — V2.0 (DNA Visual V4)

> Este documento define o PROCESSO COMPLETO de produção do résumé EB-1A via python-docx. Qualquer agente que produza um résumé DEVE seguir este sistema para garantir output idêntico ao V4 de referência.

---

## 1. VISÃO GERAL

O Résumé EB-1A NÃO é um currículo tradicional. É um **inventário estratégico de evidências mapeado por critério**, que serve como:

1. **Guia de navegação** para o oficial do USCIS entender quem é o beneficiário
2. **Índice de evidências** com metadata estruturada de cada prova documental
3. **Complemento da Cover Letter** — a CL argumenta juridicamente, o Résumé apresenta os fatos

### 1.1 DESIGN CONSTRAINTS — derivados de auditoria de benchmarks (2026-04-29)

Auditoria comparou os benchmarks **Carlos Avelino, Thiago Fernandes dos Santos V1, Bruno Cipriano VF** contra résumés recentes regredidos (ANDRÉ V10, MARCIO V5, Bruno V5 Engine). Padrões NÃO-NEGOCIÁVEIS extraídos:

| Constraint | Valor | Razão |
|-----------|-------|-------|
| `timeline_mode` | **`manual_curated`** | Cronologia narrativa NATIVA da carreira, extraída do material do cliente — NUNCA timeline auto-gerada por template. |
| `infographic` | **`false`** | Os 3 benchmarks NÃO têm infográfico. Recentes ganharam infográfico auto que diluiu densidade narrativa. (BLOCK rule: r210). |
| `min_word_count` | **`1200`** (warn) | Piso conservador, abaixo do menor benchmark (Carlos = 984) com margem de segurança. (WARN rule: r208). Bruno VF tinha 1.724 — recente caiu para 1.260 (-27%). |
| `footer_pagination` | **OBRIGATÓRIO** "Page X of Y" | 3 de 4 recentes perderam footer. (WARN rule: r209). |
| `soc_in_body` | **PROIBIDO** | SOC code (NN-NNNN) só no header/título — nunca no corpo. |

Validador: `scripts/validate_resume_against_benchmark.py --file <DOCX>`. Score 100/100 = atende a todos os benchmarks.

### Diferenças Fundamentais: Résumé vs. Cover Letter

| Dimensão | Cover Letter | Résumé |
|----------|-------------|--------|
| Função | Argumentação jurídica | Inventário de fatos e evidências |
| Tom | Advocatício, persuasivo | Factual, descritivo, preciso |
| Estrutura | Prosa fluida com footnotes | Blocos estruturados de metadata |
| Tamanho | 50-120 páginas | 25-75 páginas |
| Footnotes | Obrigatório (legal citations) | NÃO usa footnotes |
| Imagens | NÃO usa imagens | USA imagens (certificados, matérias, screenshots) |
| Legal Framework | Sim (Kazarian, 8 CFR) | NÃO — zero análise legal |
| Evidence Blocks | Narrativa sobre cada evidência | Metadata estruturada + narrativa curta |

---

## 2. ARQUITETURA DO BUILD — Multi-Part com Merge

### POR QUE Multi-Part?

Documentos com 40+ evidence blocks e 180+ imagens excedem o limite de memória e complexidade de uma única execução python-docx. A solução é dividir o build em partes independentes e depois merge com remapeamento de imagens.

### Estrutura Obrigatória:

```
├── v4_helpers.py            ← Módulo compartilhado (TODAS as funções + constantes)
├── build_v4_part1.py        ← Síntese + Histórico (Gantt) + Experiência Profissional
├── build_v4_part2.py        ← Seções por Critério (Awards, Contributions, Articles, Book...)
├── build_v4_part3.py        ← Formação + Cursos + Palestras + Cartas + Proposed Endeavors
├── merge_v4.py              ← Script de merge com image relationship remapping
├── thumbnails/              ← Pasta com TODAS as miniaturas (thumb_*.png)
└── VF_Resume_[Nome]_V4.docx ← Output final
```

### Regra de Divisão:

- **Part1**: setup_document() + Seções 1-3 (Header, Síntese, Histórico, Experiência)
- **Part2**: Seções de Critério (C1-C10, as que o caso tiver)
- **Part3**: Formação + Cursos + Cartas de Recomendação + EB-2 NIW Proposed Endeavors (se aplicável)
- **Merge**: Combina Part1 como base, appending Part2 e Part3 com page breaks

Se o caso for simples (< 20 evidence blocks, < 30 thumbnails), PODE ser feito em script único. Mas na dúvida, dividir SEMPRE.

---

## 3. MÓDULO HELPERS — Constantes e Funções Obrigatórias

O `v4_helpers.py` é o DNA do layout. NENHUMA outra fonte, cor ou dimensão pode ser usada fora deste módulo.

### 3.1 Constantes de Cor

```python
NAVY       = "2D3E50"   # Headers, section bars, footer
TEAL       = "3498A2"   # Accent line (header), sub-headers, timeline cells ativas
WHITE      = "FFFFFF"   # Texto sobre navy/teal
BLACK      = "000000"   # Texto principal (headings, labels bold)
DARK_GRAY  = "333333"   # Texto body, impacto italic
MED_GRAY   = "666666"   # Placeholders, captions
LIGHT_GRAY = "F5F5F5"   # Company box background
BORDER_GRAY= "CCCCCC"   # Todas as bordas de tabela/evidence block
```

### 3.2 Constantes de Fonte

```python
BODY_FONT   = "Garamond"   # TUDO — body, bullets, evidence blocks
HEADER_FONT = "Garamond"   # TUDO — headers, footers, section titles
```

**REGRA ABSOLUTA: ZERO Arial, ZERO Calibri, ZERO qualquer outra fonte. 100% Garamond em TODO o documento.**

### 3.3 Constantes de Layout

```python
CONTENT_WIDTH     = 10080   # Largura total do conteúdo (dxa)
META_WIDTH        = 5760    # Coluna esquerda do evidence block (metadata+impact)
THUMB_WIDTH       = 4320    # Coluna direita do evidence block (thumbnail)
HEADER_TABLE_WIDTH = 10800  # Largura do header/footer table

# Page setup
page_width        = 8.5"    # US Letter
page_height       = 11"     # US Letter
top_margin        = 0"      # Header colado no topo
bottom_margin     = 0.5"
left_margin       = 0.65"   # Mais estreito que padrão 1"
right_margin      = 0.65"
header_distance   = 0"
```

### 3.4 Funções Obrigatórias do Helpers

Cada função abaixo DEVE existir e ser usada conforme especificado:

| Função | Uso | Tamanho Font |
|--------|-----|-------------|
| `setup_document()` | Cria doc com page setup + header navy + footer navy Page X of Y | 20pt nome, 11pt RÉSUMÉ, 9pt email |
| `add_navy_section_header(doc, title)` | Barra navy com texto branco centralizado | 11pt bold |
| `add_article_group_header(doc, title)` | Barra teal com texto branco alinhado esquerda | 10pt bold |
| `add_evidence_block(doc, metadata_dict, thumb_path, impact_text)` | Evidence block padrão: 2 colunas, meta+impact LEFT, thumb RIGHT | 10pt meta, 9.5pt impact |
| `add_compact_evidence_block(doc, meta, thumb, impact)` | Evidence block compacto (artigos, cursos) | 9.5pt meta, 9pt impact |
| `add_company_box(doc, empresa, cargo, periodo, sobre)` | Box cinza claro com dados da empresa | 10-10.5pt |
| `add_bullet(doc, text, size=10.5, indent=0.3)` | Bullet ● com indent | 10.5pt |
| `add_sub_bullet(doc, text, size=10, indent=0.55)` | Sub-bullet ○ com indent maior | 10pt |
| `add_paragraph(doc, text, ...)` | Parágrafo genérico Garamond | 10.5pt default |
| `add_run(paragraph, text, ...)` | Run de texto dentro de parágrafo | variável |

### 3.5 Evidence Block — Layout Interno

**REGRA CRÍTICA: Impacto DENTRO do bloco, NÃO abaixo dele.**

```
┌──────────────────────────────────┬──────────────────┐
│ Label: Valor                     │                  │
│ Label: Valor                     │   ┌──────────┐   │
│ Label: Valor                     │   │          │   │
│ Label: Valor                     │   │ THUMBNAIL│   │
│                                  │   │ 2.6" w   │   │
│ Descrição / Impacto: [Navy bold] │   │          │   │
│ Texto italic cinza com 4-6       │   └──────────┘   │
│ linhas de análise...             │                  │
└──────────────────────────────────┴──────────────────┘
```

- Coluna esquerda: `META_WIDTH = 5760 dxa` — margins 80/80/120/120
- Coluna direita: `THUMB_WIDTH = 4320 dxa` — margins 80/80/80/80
- Thumbnail: `Inches(2.6)` de largura (padrão) ou `Inches(2.0)` (compacto)
- Borda: `#CCCCCC`, `sz="4"`
- "Descrição / Impacto:" em bold 9.5pt cor NAVY
- Texto de impacto em italic 9.5pt cor DARK_GRAY (#333333)
- **MÍNIMO 4 linhas de impacto por evidence block. PROIBIDO "duas linhas mirradinhas".**

### 3.6 Compact Evidence Block

Para artigos e cursos em quantidade — thumbnail menor, spacing mais apertado:

- Coluna esquerda: `6480 dxa` — margins 60/60/100/100
- Coluna direita: `3600 dxa` — margins 60/60/60/60
- Thumbnail: `Inches(2.0)` de largura
- Font sizes: 9.5pt metadata, 9pt impact
- "Descrição / Impacto:" em bold 9pt cor NAVY

---

## 4. THUMBNAIL PIPELINE

### 4.1 Geração de Thumbnails

Para cada evidência (PDF, imagem, screenshot):

```bash
# PDF → PNG (primeira página)
pdftoppm -f 1 -l 1 -png -r 150 evidence.pdf /tmp/thumb

# Resize para 400px de largura (mantém aspect ratio)
python3 -c "
from PIL import Image
img = Image.open('/tmp/thumb-1.png')
w, h = img.size
new_w = 400
new_h = int(h * (400 / w))
img.resize((new_w, new_h), Image.LANCZOS).save('thumbnails/thumb_evidence.png')
"
```

Para imagens (JPG, PNG) que não são PDF:
```python
from PIL import Image
img = Image.open("evidence.jpg")
w, h = img.size
new_w = min(400, w)
new_h = int(h * (new_w / w))
img.resize((new_w, new_h), Image.LANCZOS).save("thumbnails/thumb_evidence.png")
```

### 4.2 THUMB_MAP — Mapeamento Explícito

O THUMB_MAP é um dicionário Python que mapeia nomes lógicos para filenames reais de thumbnails. É a ÚNICA fonte confiável de lookup de thumbnails.

```python
THUMB_MAP = {
    "mvp_2018": "thumb_Most_Valuable_Professional.png",
    "efcore_firebird": "thumb_EntityFrameworkCore_For_FirebirdSQL.png",
    "csharp_book": "thumb_CSharpIniciantes.png",
    # ... um entry para CADA thumbnail do caso
}
```

**Regras do THUMB_MAP:**
1. Toda thumbnail usada no résumé DEVE ter um entry no THUMB_MAP
2. A key é um nome lógico curto (snake_case) que identifica a evidência
3. O value é o filename EXATO do .png na pasta `thumbnails/`
4. Quando a mesma imagem é reutilizada (ex: MVP award reusar cert), documentar com comentário `# reuse`
5. Se o thumbnail não existe, o entry pode ter valor `None` ou ser omitido
6. O `get_thumb(key)` retorna o path completo ou None se não encontrado

### 4.3 Função find_thumb() — Fallback Fuzzy

Quando o THUMB_MAP não tem a key, `find_thumb(name)` busca por:
1. Match exato no diretório
2. Com prefixo `thumb_`
3. Substituindo espaços por underscores
4. Sem extensão + `.png`
5. Busca fuzzy por substring

**Ordem de preferência: `get_thumb()` > `find_thumb()` > placeholder `[THUMBNAIL]`**

---

## 5. SETUP DO DOCUMENTO — Header e Footer

### 5.1 Header (3 rows, 2 cols)

O `setup_document()` cria automaticamente:

```
Row 0: NAVY bg | [NOME COMPLETO — Garamond 20pt Bold Branco] | [vazio]
Row 1: NAVY bg | [RÉSUMÉ — 11pt Bold Branco]                 | [E-mail: xxx — 9pt Branco, right-aligned]
Row 2: TEAL bg | [accent line — sem texto]                    | [accent line]
```

- Largura total: `HEADER_TABLE_WIDTH = 10800 dxa`
- Coluna esquerda (nome/résumé): `7560 dxa`
- Coluna direita (email): `3240 dxa`
- Sem bordas na tabela do header
- Row 2 inteira em TEAL — funciona como accent line visual
- Para EB-1A: Na Row 1, incluir SOC/O*Net e "EB-1A" se aplicável

### 5.2 Footer (1 row, 1 col)

```
Row 0: NAVY bg | "Page X of Y" — Garamond 9pt Branco, right-aligned
```

- Usa campos Word `PAGE` e `NUMPAGES` para paginação automática
- Implementado via XML raw (fldChar begin/instrText/separate/end)
- **TODA a fonte no footer é Garamond — zero Arial**

### 5.3 Page Setup

```python
section.page_width      = Inches(8.5)   # US Letter
section.page_height     = Inches(11)    # US Letter
section.top_margin      = Inches(0)     # Header colado no topo
section.bottom_margin   = Inches(0.5)
section.left_margin     = Inches(0.65)  # MAIS ESTREITO que padrão
section.right_margin    = Inches(0.65)
section.header_distance = Inches(0)
```

---

## 6. MERGE COM IMAGE RELATIONSHIP REMAPPING

### Problema

Quando você faz `Document()` em Part2 e Part3 separadamente, cada um tem seu próprio package de imagens com relationship IDs (`rId1`, `rId2`...). Ao copiar elementos XML para o documento base (Part1), os `rId` references ficam quebrados.

### Solução: merge_v4.py

```python
def merge_with_images(base_path, parts_paths, output_path):
    base_doc = Document(base_path)

    for part_path in parts_paths:
        part_doc = Document(part_path)

        # 1. Page break antes de cada parte
        p = base_doc.add_paragraph()
        run = p.add_run()
        run.add_break(WD_BREAK.PAGE)

        # 2. Copiar TODAS as imagens do part_doc para base_doc
        rId_map = {}
        for rel in part_doc.part.rels.values():
            if "image" in rel.reltype:
                image_part = rel.target_part
                # Gerar partname único com random ID
                rand_id = random.randint(10000, 99999)
                partname = f"/word/media/merged_img_{rand_id}.{ext}"

                new_part = OpcPart(PackURI(partname), ...)
                new_rId = base_doc.part.relate_to(new_part, rel.reltype)
                rId_map[old_rId] = new_rId

        # 3. Copiar elementos do body (exceto sectPr)
        for element in part_doc.element.body:
            if element.tag.endswith('sectPr'):
                continue
            new_element = copy.deepcopy(element)

            # 4. Remap a:blip references (imagens modernas)
            for blip in new_element.iter(qn('a:blip')):
                old_embed = blip.get(qn('r:embed'))
                if old_embed in rId_map:
                    blip.set(qn('r:embed'), rId_map[old_embed])

            # 5. Remap VML imagedata (imagens legadas)
            for imgdata in new_element.iter(f'{VML_NS}imagedata'):
                old_id = imgdata.get(f'{R_NS}id')
                if old_id in rId_map:
                    imgdata.set(f'{R_NS}id', rId_map[old_id])

            base_doc.element.body.append(new_element)

    # 6. Mover sectPr para o final
    body = base_doc.element.body
    sectPr = body.find(qn('w:sectPr'))
    if sectPr is not None:
        body.remove(sectPr)
        body.append(sectPr)

    base_doc.save(output_path)
```

**CRÍTICO**: O merge DEVE:
1. Copiar imagens ANTES de copiar elementos XML
2. Gerar partnames únicos (usar random ID)
3. Remapear TANTO `a:blip` quanto VML `imagedata`
4. Preservar o `sectPr` no final (para manter page setup/header/footer)

---

## 7. POST-PROCESSING

Após o merge, executar estas verificações/correções:

### 7.1 Remoção de Page Breaks Duplos

```python
import re
from lxml import etree

with open(output_path, 'rb') as f:
    # Check via XML parse for consecutive w:br w:type="page"
    # Remove duplicates
```

### 7.2 Remoção de R$ (se EB-1A ou EB-2 NIW proíbe)

```python
# Buscar qualquer referência a R$ no XML do documento
xml_str = etree.tostring(doc.element.body, encoding='unicode')
if 'R$' in xml_str:
    xml_str = xml_str.replace('R$', '')
    # Re-parse and replace
```

### 7.3 Verificação de Zero Arial

```python
# Percorrer TODOS os runs e TODAS as cells
for para in doc.paragraphs:
    for run in para.runs:
        if run.font.name and 'arial' in run.font.name.lower():
            # FALHA — corrigir para Garamond

for table in doc.tables:
    for row in table.rows:
        for cell in row.cells:
            for para in cell.paragraphs:
                for run in para.runs:
                    if run.font.name and 'arial' in run.font.name.lower():
                        # FALHA
```

---

## 8. FASES DE PRODUÇÃO

### FASE 0 — INVENTÁRIO DE EVIDÊNCIAS

1. Listar TODOS os documentos disponíveis do cliente
2. Gerar thumbnails para CADA documento (PDF → PNG 400px)
3. Criar THUMB_MAP com entry para cada thumbnail
4. Mapear cada documento ao critério que ele suporta
5. Identificar GAPS (evidências faltantes)
6. Confirmar inventário com Paulo

### FASE 1 — PLANO ESTRATÉGICO

1. Definir quais critérios o résumé vai cobrir (baseado no Petition Letter / Cover Letter)
2. Definir quantos evidence blocks por seção
3. Definir a divisão em Parts (Part1/2/3) e o conteúdo de cada
4. Estimar número de páginas (benchmark: 3-5 páginas por critério batido)
5. Confirmar plano com Paulo antes de produzir

### FASE 2 — CONSTRUÇÃO DO HELPERS

1. Criar `v4_helpers.py` com TODAS as constantes e funções
2. Popular o THUMB_MAP com TODAS as thumbnails do caso
3. Testar: gerar um doc dummy com 1 evidence block, verificar fonte/cores/layout
4. NÃO avançar para produção sem helpers testado

### FASE 3 — PRODUÇÃO (por Part)

**Part 1:**
1. `setup_document()` — header com nome do beneficiário
2. Navy section header "SÍNTESE PROFISSIONAL"
3. 4-8 parágrafos densos (MÍNIMO 4 linhas cada)
4. Navy section header "HISTÓRICO PROFISSIONAL"
5. Gantt timeline (tabela com Navy header, Teal cells ativas)
6. Navy section header "EXPERIÊNCIA PROFISSIONAL"
7. Company box + bullets para cada empregador
8. Salvar Part1.docx

**Part 2:**
1. Para cada critério batido (na ordem C1→C10):
   - `add_navy_section_header(doc, "TÍTULO DO CRITÉRIO")`
   - 1-2 parágrafos introdutórios (MÍNIMO 4 linhas cada)
   - Evidence blocks (padrão ou compacto conforme tipo)
   - Sub-bullets para itens adicionais
   - Teal sub-headers para agrupar (`add_article_group_header()`)
2. Salvar Part2.docx

**Part 3:**
1. Navy section header "FORMAÇÃO ACADÊMICA"
2. Evidence blocks para cada grau/certificação
3. Navy section header "CURSOS MINISTRADOS E PALESTRAS"
4. Evidence blocks + sub-bullets para cursos/conferências
5. Navy section header "CARTAS DE RECOMENDAÇÃO"
6. Tabela com Navy header + alternate rows
7. (Se EB-2 NIW) Navy section header "PROJETO EB-2 NIW — PROPOSED ENDEAVORS"
8. Teal sub-headers por proposta + tabela comparativa + conclusão Dhanasar
9. Salvar Part3.docx

### FASE 4 — MERGE

1. Executar `merge_v4.py` com Part1 como base
2. Verificar tamanho do arquivo final (esperado: 1-3 MB com imagens)
3. Verificar contagem de imagens no merge log

### FASE 5 — POST-PROCESSING + VERIFICAÇÃO

Executar script de verificação que checa:

```python
CHECKS = [
    # Content presence
    ("Nome do beneficiário", lambda t: "NOME" in t),
    ("Síntese Profissional", lambda t: "SÍNTESE" in t.upper() or "EXECUTIVE SUMMARY" in t.upper()),
    # ... um check para cada seção e evidência-chave

    # Format compliance
    ("Zero Arial", lambda: all_runs_garamond()),
    ("Zero R$", lambda: "R$" not in full_xml),
    ("Image count > 0", lambda: len(doc.inline_shapes) > 0),
]
```

Critérios de PASS:
- **100% dos content checks** passando
- **Zero Arial** em qualquer run
- **Zero R$** (exceto se Paulo autorizar explicitamente)
- **Contagem de imagens** compatível com número de evidence blocks
- **Contagem de tabelas** compatível com número de evidence blocks + company boxes + headers + timeline

### FASE 6 — AUDITORIA CRUZADA

1. Cruzar TODOS os números do résumé com a Cover Letter (DEVEM ser idênticos)
2. Cruzar nomes de evidências (DEVEM ser idênticos)
3. Cruzar datas (DEVEM ser idênticas)
4. Verificar que NENHUM dado do résumé contradiz a Cover Letter
5. Checar se cada evidência mencionada na Cover Letter tem evidence block correspondente no Résumé

---

## 9. ORDEM DAS SEÇÕES POR CRITÉRIO

A ordem no résumé segue a MESMA ordem da Cover Letter:

| Ordem | Seção | Critério |
|-------|-------|----------|
| 1 | Receipt of Awards or Distinctions | C1 |
| 2 | Membership in Associations | C2 |
| 3 | Published Material About the Beneficiary | C3 |
| 4 | Judging the Work of Others | C4 |
| 5 | Original Contributions of Major Significance | C5 |
| 6 | Authorship of Scholarly Articles | C6 |
| 7 | Display of Work at Exhibitions | C7 |
| 8 | Leading or Critical Role | C8 |
| 9 | High Salary / Remuneration | C9 |
| 10 | Commercial Success in Performing Arts | C10 |

**IMPORTANTE**: Só incluir seções dos critérios que o cliente bate. Não incluir seção de critério não pleiteado.

---

## 10. REGRAS CARDINAIS

1. **ZERO ARGUMENTAÇÃO JURÍDICA** — O résumé apresenta fatos. Quem argumenta é a Cover Letter.
2. **ZERO CONTRADIÇÃO COM A COVER LETTER** — Todo número, data, nome DEVE ser idêntico.
3. **ZERO DADOS INVENTADOS** — Tudo vem de documento fonte. Se não tem fonte, marca `[VERIFICAR COM PAULO]`.
4. **ZERO ARIAL** — 100% Garamond. Verificar com script automatizado.
5. **ZERO R$** — Sem valores monetários em Real (exceto se Paulo autorizar).
6. **CONSISTÊNCIA INTERNA** — O mesmo dado aparece IGUAL em todas as seções.
7. **EVIDENCE BLOCKS COMPLETOS** — Cada bloco DEVE ter todos os campos do template + impacto DENTRO (não abaixo).
8. **THUMBNAILS OBRIGATÓRIOS** — Todo evidence block DEVE ter thumbnail ou placeholder `[THUMBNAIL]`.
9. **MÍNIMO 4 LINHAS DE IMPACTO** — PROIBIDO parágrafos mirrados de 2 linhas em qualquer lugar.
10. **INGLÊS CORRETO** — Documento em inglês. Nomes próprios brasileiros mantêm grafia original.
11. **LAYOUT PREMIUM** — Navy/Teal, 0.65" margins, Garamond throughout. Sem exceções.

---

## 11. ANTI-PATTERNS (ERROS PROIBIDOS)

### Layout
- ❌ Usar Arial, Calibri ou qualquer fonte que não seja Garamond
- ❌ Margens de 1" (padrão Word) — DEVE ser 0.65"
- ❌ Paper size A4 — DEVE ser US Letter (8.5" x 11")
- ❌ Colocar impacto ABAIXO do evidence block (DEVE ser DENTRO)
- ❌ Thumbnail na coluna ESQUERDA (DEVE ser na DIREITA)
- ❌ Thumbnail com 160px / 1.1" (V1 antigo) — DEVE ser 2.6" padrão ou 2.0" compacto
- ❌ Evidence block sem borda (#CCCCCC)
- ❌ Company box sem fundo #F5F5F5
- ❌ Section header com background diferente de Navy
- ❌ Sub-header com background diferente de Teal

### Conteúdo
- ❌ Valores de salário/remuneração (R$, USD) sem autorização
- ❌ Linguagem de marketing ("revolucionou", "transformou o mercado")
- ❌ Opiniões/adjetivos sem base factual
- ❌ Footnotes ou citations (isso é da Cover Letter)
- ❌ Parágrafos de 1-2 linhas (MÍNIMO 4 linhas)
- ❌ Evidence block sem campo "Descrição / Impacto"
- ❌ Dados sem fonte verificável

### Build
- ❌ Fazer o résumé inteiro em um único script (>30 evidence blocks = DIVIDIR em Parts)
- ❌ Copiar XML entre documents sem remap de image relationships
- ❌ Hardcodar paths de thumbnails (usar THUMB_MAP + get_thumb/find_thumb)
- ❌ Esquecer de mover sectPr para o final após merge
- ❌ Não rodar verificação automatizada após build

---

## 12. CHECKLIST FINAL DE ENTREGA

Antes de entregar QUALQUER résumé para Paulo:

- [ ] Todas as fontes são Garamond (verificado por script)
- [ ] Zero Arial em runs, zero Arial em table cells
- [ ] Zero R$ (verificado por XML search)
- [ ] Paleta de cores: APENAS Navy, Teal, Branco, Preto, Cinzas (#333333, #666666, #F5F5F5, #CCCCCC)
- [ ] Margins: 0.65" left/right
- [ ] Paper: US Letter (8.5" x 11")
- [ ] Header: Navy bar + nome + RÉSUMÉ + email + Teal accent
- [ ] Footer: Navy bar + "Page X of Y" Garamond 9pt
- [ ] Cada evidence block tem thumbnail ou placeholder
- [ ] Cada evidence block tem "Descrição / Impacto" DENTRO (não abaixo)
- [ ] Cada impacto tem MÍNIMO 4 linhas
- [ ] Gantt timeline presente com Teal cells ativas
- [ ] Company boxes com fundo #F5F5F5 para cada empregador
- [ ] Navy section headers para TODAS as seções principais
- [ ] Teal sub-headers para subcategorias
- [ ] Números conferidos contra documentos fonte
- [ ] Dados consistentes com Cover Letter (se existir)
- [ ] Contagem de paragraphs, tables, images documentada
- [ ] Arquivo final copiado para pasta do usuário

---

*Sistema Résumé EB-1A V2.0 — DNA Visual V4 — 03/mar/2026*


---

## EVIDÊNCIAS PROIBIDAS COMO THUMBNAIL/EVIDENCE BLOCK (v1.1 — 2026-04-29)

**REGRA ABSOLUTA — origem: caso Márcio Elias V8.**

### Categoria: Documentação financeira pessoal — PROIBIDA
NUNCA inserir como thumbnail ou Evidence Block em résumé:

- Declaração de Imposto de Renda Pessoa Física (IRPF) — qualquer ano
- Recibo de Distribuição de Lucros / Pró-labore
- Holerite / Contracheque / Recibo de Salário
- Extrato bancário / Comprovante de saldo
- Comprovante de renda emitido por empregador
- Qualquer arquivo com prefixo `*_FIN_*` ou `ANX-XXX_FIN_*` na pasta de evidências

### Razão
1. **Privacidade.** Documento financeiro pessoal exposto em petição é amador e gera flag.
2. **Persuasão.** Critério 8 do O-1A é "salário elevado vis-à-vis o mercado", não "renda pessoal alta". Mostrar quanto a pessoa ganha sem comparação com mercado prova `rico`, não `extraordinary`.
3. **ATLAS/VIBE.** Documentos financeiros pessoais aparecem em rotinas de fraud detection do USCIS e disparam ceticismo automático.

### Substitutos válidos para Critério 8 (Salário elevado)
- **Benchmark salarial de mercado** (ex.: relatório Vagas, Catho, ABA Salary Survey, ou similares por SOC/profissão/região) — comparativo público e impessoal.
- **Carta oficial do empregador** atestando remuneração elevada e contextualizando vis-à-vis pares — cabeçalho institucional, sem expor número absoluto se possível.
- **Atestado de associação/conselho profissional** mostrando posição de liderança remunerada de elite.

Preferível 1 evidência defensável a 3 evidências com 2 problemáticas. Se Critério 8 ficar com só 1 thumbnail (benchmark), está OK.

### Aplicação técnica
- Hard block ativo em `data/hard_blocks/default.json` v5.1: ids `resume_no_financial_personal_thumbs` + `resume_no_financial_anx_prefix`.
- Pattern detecta no texto do Evidence Block (cell description) e no nome de arquivo `ANX-XXX_FIN_*`.
- Severity: critical. Violação = rejeição automática no Quality Gate.


---

## REGRA DE IDIOMA — DEFINITIVA (v1.2 — 2026-04-29)

**PROEX produz documentos em PORTUGUÊS-BR como padrão.** O résumé sai em PT-BR. Tradução para inglês acontece em fase posterior do pipeline (tradutor certificado), não na geração.

**TERMOS USCIS PRESERVADOS EM INGLÊS** — não traduzir, NÃO substituir por equivalente em PT, mesmo que pareçam "termos em inglês no meio do texto":

| Categoria | Termos |
|-----------|--------|
| Petição | `endeavor`, `proposed endeavor`, `extraordinary ability`, `exceptional ability`, `advanced degree` |
| Procedimento | `Request for Evidence (RFE)`, `Notice of Intent to Deny (NOID)`, `priority date`, `consular processing`, `adjustment of status` |
| Categorias | `National Interest Waiver (NIW)`, `EB-1A`, `EB-1B`, `EB-2 NIW`, `O-1A`, `O-1B`, `H-1B`, `L-1` |
| Formulários | `Form I-140`, `Form I-485`, `Form I-129`, `Form I-130` |
| Jurisprudência | `Matter of Dhanasar`, `Kazarian two-step`, `8 CFR § 204.5`, `8 CFR § 214.2(o)` |
| Trabalho | `prevailing wage`, `LCA`, `PERM`, `Department of Labor (DOL)` |
| Status | `advance parole`, `immigrant intent`, `dual intent`, `country chargeability`, `Visa Bulletin` |
| Personas | `petitioner`, `beneficiary`, `adjudicator`, `Service Center` |

**Razão:** USCIS é processo administrativo americano. Termos jurídicos/técnicos oficiais NÃO têm tradução portuguesa institucionalizada — qualquer tradução é interpretação que abre flanco para confusão. Manter EN.

**Para revisor (Phase 2):** documentos PROEX em PT-BR com USCIS terms em EN são CORRETOS. NÃO acusar como bloqueante "documento em português" nem "inconsistência de idioma" pelo uso desses termos. Se `endeavor` aparece 18x, isso é CONSISTÊNCIA, não erro.
