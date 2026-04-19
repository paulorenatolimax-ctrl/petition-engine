# DOCX_PRODUCTION_PIPELINE — Pipeline de Produção e Assembly do .docx
## Cover Letter EB-1A — Escritório PROEX
## v5.0 — Criado em 18/03/2026 — Lições do Caso Vitória Carolina

---

## VISÃO GERAL

Este documento descreve o pipeline técnico para:
1. Inserir thumbnails das evidências nos .docx individuais
2. Aglutinar múltiplos .docx em arquivo único
3. Aplicar formatação FORMATTING_SPEC
4. Corrigir problemas conhecidos de layout

---

## ETAPA 1: GERAÇÃO DE THUMBNAILS

### Converter evidências para PNG:
```bash
# PDFs → PNG (primeira página, 150 DPI)
pdftoppm -png -f 1 -l 1 -r 150 -singlefile arquivo.pdf destino

# DOCXs → PDF → PNG
pandoc arquivo.docx -o temp.pdf && pdftoppm -png -f 1 -l 1 -r 150 -singlefile temp.pdf destino

# PNGs/JPGs → copiar diretamente
cp arquivo.png destino.png
```

### Nomenclatura:
`Evidence_XX.png` onde XX = número da evidência

---

## ETAPA 2: INSERÇÃO NOS .DOCX

### Usar python-docx:
```python
from docx import Document
from docx.shared import Cm

doc = Document(filepath)
for table in doc.tables:
    for row in table.rows:
        for cell in row.cells:
            for paragraph in cell.paragraphs:
                if '[THUMBNAIL]' in paragraph.text:
                    ev_num = extrair_numero_evidencia(row)
                    thumb = f"thumbnails/Evidence_{ev_num}.png"
                    for run in paragraph.runs:
                        run.text = ""
                    run = paragraph.add_run()
                    run.add_picture(thumb, width=Cm(3.5))
doc.save(filepath)
```

---

## ETAPA 3: CONVERSÃO INLINE → ANCHOR (OBRIGATÓRIO!)

**BUG CONHECIDO**: python-docx insere imagens como `wp:inline`. Em tabelas, isso causa problemas de layout no Word. DEVE converter para `wp:anchor` com `wrapSquare`.

### Procedimento XML:
1. Descompactar .docx (é um ZIP)
2. Em word/document.xml, encontrar todos `<wp:inline>`
3. Substituir por `<wp:anchor>` com:
   - `distT="45720" distB="45720" distL="114300" distR="114300"`
   - `simplePos="0" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1"`
   - `<wp:simplePos x="0" y="0"/>`
   - `<wp:positionH relativeFrom="column"><wp:align>left</wp:align></wp:positionH>`
   - `<wp:positionV relativeFrom="paragraph"><wp:align>top</wp:align></wp:positionV>`
   - `<wp:wrapSquare wrapText="bothSides"/>`
   - Manter extent, docPr, cNvGraphicFramePr, graphic do inline original
4. Reempacotar como .docx

---

## ETAPA 4: MERGE (AGLUTINAÇÃO)

### ⚠️ NÃO USAR docxcompose — PERDE IMAGENS!

### Procedimento correto (merge XML):
1. Descompactar o primeiro .docx como base
2. Para cada arquivo adicional:
   a. Descompactar
   b. Copiar media files para word/media/ da base (renomear: imageN+1)
   c. Ler _rels/document.xml.rels → criar novas relationships (rIdXX+1)
   d. Mapear old_rId → new_rId
   e. Copiar body elements (exceto sectPr) para a base
   f. Atualizar r:embed em todos os elementos copiados
   g. Adicionar `<w:br w:type="page"/>` antes de cada arquivo
3. Salvar document.xml e rels atualizados
4. Verificar [Content_Types].xml
5. Reempacotar como .docx
6. **VERIFICAR**: contagem de imagens no ZIP = soma de imagens individuais

---

## ETAPA 5: CORREÇÕES DE TABELA

Em word/document.xml, para TODAS as tabelas:
```xml
<w:tblPr>
  <w:tblInd w:w="0" w:type="dxa"/>
  <w:tblW w:w="5000" w:type="pct"/>
  <w:jc w:val="center"/>
</w:tblPr>
```

---

## ETAPA 6: QUEBRAS DE PÁGINA

### Adicionar pageBreakBefore APENAS em:
- Títulos de critério: `CRITÉRIO X —` (ALL CAPS)
- Partes B: `CRITÉRIO X Parte B`
- Step 2: `ETAPA 2 —`

### NÃO adicionar em:
- Sumário (Parte I)
- Sub-seções internas (Tabela Sinóptica, Conclusão, Legal Framework)

```xml
<w:pPr>
  <w:pageBreakBefore/>
</w:pPr>
```

---

## ETAPA 7: CONTROLE DE LAYOUT

### keepNext em títulos:
Todos os parágrafos de título (negrito, curtos, com padrão "Fonte X:", "Evidência X.", seção A/B/C) recebem:
```xml
<w:pPr>
  <w:keepNext/>
</w:pPr>
```

### widowControl global:
Todos os parágrafos recebem:
```xml
<w:pPr>
  <w:widowControl/>
</w:pPr>
```

---

## ETAPA 8: FORMATAÇÃO

### Garamond:
- Corpo: 12pt
- Títulos de critério: 13pt bold italic
- Headers de seção: 14pt bold
- Notas de rodapé: 10pt
- Header da página: 9pt italic
- Footer: 10pt

### Margens:
- L=2.0cm, R=1.5cm, T=1.5cm, B=1.5cm

### Header:
"EB-1A Petition — [Nome Completo]" (9pt, itálico, direita, cinza)

### Footer:
"Página X de Y" (10pt, centralizado) — usar campos PAGE e NUMPAGES

---

## ETAPA 9: VERIFICAÇÃO FINAL

```bash
# Contagem de imagens
unzip -l arquivo.docx | grep word/media/ | wc -l

# Palavras
pandoc arquivo.docx -t plain --wrap=none | wc -w

# Proibidos
pandoc arquivo.docx -t plain --wrap=none | grep -oi 'satisf' | wc -l  # deve ser 0
pandoc arquivo.docx -t plain --wrap=none | grep -oi 'the Beneficiary' | wc -l  # deve ser 0
pandoc arquivo.docx -t plain --wrap=none | grep -oP '\bEv\.\s' | wc -l  # deve ser 0
pandoc arquivo.docx -t plain --wrap=none | grep -oi 'proex' | wc -l  # deve ser 0
```

---

## ERROS CONHECIDOS A EVITAR

| # | Erro | Consequência | Prevenção |
|---|------|-------------|-----------|
| 1 | Usar docxcompose para merge | Perde 20%+ das imagens | Merge XML manual |
| 2 | Imagens wp:inline em tabelas | Layout quebrado no Word | Converter para wp:anchor |
| 3 | Sub-evidências (68.1, 69a) | Confusão — não existem | CV é parte da evidência principal |
| 4 | Page break no sumário | Sumário fica uma página por critério | Só em seções reais (ALL CAPS) |
| 5 | Título órfão no fim da página | Título separado do conteúdo | keepNext em todos os títulos |
| 6 | Remover footnotes manuais | Perde todas as referências | Manter [1],[2] no fim das seções |
| 7 | Tabela com recuo esquerdo | Espaço desperdiçado à direita | tblInd=0, tblW=5000/pct |
| 8 | Cover letter em inglês | Retrabalho total (tradução) | IDIOMA = português obrigatório |
| 9 | O*NET code errado | Credibilidade comprometida | Validar contra résumé do cliente |
| 10 | Step 2 < 25% do total | Documento desequilibrado | Expandir antes de entregar |
