# FORMATTING SPEC — EB-2 NIW Cover Letter (.docx)
## Especificação Completa de Formatação via docx-js
### v1.0 — 28/02/2026

---

## PAGE SETUP

```javascript
// US Letter
const PAGE_WIDTH = 12240;   // 8.5" in DXA
const PAGE_HEIGHT = 15840;  // 11" in DXA

// Margins
const MARGIN_TOP = 850;     // 1.5 cm
const MARGIN_BOTTOM = 850;  // 1.5 cm
const MARGIN_LEFT = 1134;   // 2.0 cm
const MARGIN_RIGHT = 850;   // 1.5 cm

// Content width = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
const CONTENT_WIDTH = 10256; // DXA
```

---

## FONTES E ESTILOS

### Normal (corpo do texto)
```javascript
font: "Garamond"
size: 24          // half-points → 12pt
color: "000000"
alignment: AlignmentType.JUSTIFIED
spacing: {
  after: 80,      // ~4pt entre parágrafos
  line: 290       // ~14.5pt line spacing
}
```

### Heading 1 (Seções principais: ELIGIBILITY, PRONG 1, PRONG 2, PRONG 3, CONCLUSÃO)
```javascript
font: "Garamond"
size: 28          // 14pt
bold: true
color: "000000"
allCaps: true
spacing: { before: 360, after: 200 }
shading: {
  type: ShadingType.CLEAR,
  fill: "C5E0B4"  // sage green
}
// Padding interno via paragraph indent ou border space
```

### Heading 2 (Sub-seções: PROPOSED ENDEAVOR, SUBSTANTIAL MERIT, etc.)
```javascript
font: "Garamond"
size: 26          // 13pt
bold: true
color: "1F4E2F"  // dark green
spacing: { before: 280, after: 160 }
```

### Heading 3 (Sub-sub-seções: cartas individuais, fatores)
```javascript
font: "Garamond"
size: 24          // 12pt
bold: true
color: "333333"
spacing: { before: 200, after: 120 }
```

### Evidence Block (blocos de evidência destacados)
```javascript
// Parágrafo com shading
shading: {
  type: ShadingType.CLEAR,
  fill: "FFF2CC"  // cream/light yellow
}
indent: { left: 360, right: 360 }  // recuo de ~0.25"
border: {
  left: { style: BorderStyle.SINGLE, size: 12, color: "D4A017" }
}
```

### Footnote
```javascript
font: "Garamond"
size: 18          // 9pt
color: "666666"
```

### Footer
```javascript
font: "Garamond"
size: 16          // 8pt
color: "808080"
alignment: AlignmentType.CENTER
// Template: "EB-2 NIW I-140 Petition – Cover Letter [NOME] | Page X of Y"
```

---

## CAPA (FORMATO CARTA)

A capa NÃO é uma title page centralizada. É formato de CARTA profissional:

```javascript
// 1. DATA (alinhada à direita)
new Paragraph({
  alignment: AlignmentType.RIGHT,
  children: [new TextRun({
    text: "[DIA] de [MÊS] de [ANO].",
    font: "Garamond", size: 24
  })]
})

// 2. DESTINATÁRIO
new Paragraph({
  spacing: { before: 360 },
  children: [new TextRun({
    text: "To: USCIS/TSC",  // ou USCIS/NSC dependendo do centro
    font: "Garamond", size: 24, bold: true
  })]
})

// 3. REFERÊNCIA
new Paragraph({
  children: [new TextRun({
    text: "Ref: EB-2 Immigrant Petition for Permanent Residency with request for a NIW",
    font: "Garamond", size: 24, italics: true
  })]
})

// 4. TIPO DE SUBMISSÃO
new Paragraph({
  children: [new TextRun({
    text: "FORM I-140 ORIGINAL SUBMISSION",
    font: "Garamond", size: 24, bold: true, allCaps: true
  })]
})

// 5. METADATA BLOCK (sage green background)
new Table({
  width: { size: CONTENT_WIDTH, type: WidthType.DXA },
  columnWidths: [CONTENT_WIDTH],
  rows: [new TableRow({
    children: [new TableCell({
      shading: { fill: "C5E0B4", type: ShadingType.CLEAR },
      borders: { /* horizontal only */ },
      children: [
        // Nome, nacionalidade, forma de petição, SOC code, etc.
        new Paragraph({ children: [
          new TextRun({ text: "Petitioner/Beneficiary: ", bold: true }),
          new TextRun({ text: "[NOME COMPLETO]" })
        ]}),
        new Paragraph({ children: [
          new TextRun({ text: "Nationality: ", bold: true }),
          new TextRun({ text: "[PAÍS]" })
        ]}),
        new Paragraph({ children: [
          new TextRun({ text: "Form of Petition: ", bold: true }),
          new TextRun({ text: "Self-Petition" })
        ]}),
        new Paragraph({ children: [
          new TextRun({ text: "Classification: ", bold: true }),
          new TextRun({ text: "EB-2 Advanced Degree [ou Exceptional Ability]" })
        ]}),
        new Paragraph({ children: [
          new TextRun({ text: "SOC Code: ", bold: true }),
          new TextRun({ text: "[CÓDIGO] — [TÍTULO]" })
        ]})
      ]
    })]
  })]
})

// 6. SAUDAÇÃO
new Paragraph({
  spacing: { before: 360 },
  children: [new TextRun({
    text: "Dear Officer,",
    font: "Garamond", size: 24, bold: true
  })]
})

// 7. OPENING STATEMENT (1-2 parágrafos)
// "My name is [NOME], I am a self-petitioner/beneficiary..."
```

---

## TABELAS

### Regra: Bordas APENAS horizontais

```javascript
const BORDER_H = { style: BorderStyle.SINGLE, size: 1, color: "B4B4B4" };
const BORDER_NONE = { style: BorderStyle.NONE };

// Header row
new TableRow({
  tableHeader: true,
  children: [new TableCell({
    shading: { fill: "C5E0B4", type: ShadingType.CLEAR },
    borders: {
      top: BORDER_H,
      bottom: BORDER_H,
      left: BORDER_NONE,
      right: BORDER_NONE
    },
    children: [new Paragraph({
      children: [new TextRun({ text: "Header", bold: true, font: "Garamond", size: 22 })]
    })]
  })]
})

// Data rows
new TableRow({
  children: [new TableCell({
    borders: {
      top: BORDER_NONE,
      bottom: BORDER_H,
      left: BORDER_NONE,
      right: BORDER_NONE
    },
    children: [new Paragraph({
      children: [new TextRun({ text: "Data", font: "Garamond", size: 22 })]
    })]
  })]
})
```

---

## SEPARADORES

```javascript
// Separador entre seções menores
new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200, after: 200 },
  children: [new TextRun({
    text: "─".repeat(60),
    font: "Garamond",
    size: 16,   // 8pt
    color: "B4B4B4"
  })]
})
```

---

## EVIDENCE REFERENCES NO TEXTO

```javascript
// Evidence number SEMPRE em bold
new TextRun({ text: "Evidence 16", bold: true, font: "Garamond", size: 24 })

// NUNCA abreviar:
// ❌ "Ev. 16", "E16", "Evidence16"
// ✅ "Evidence 16" (com espaço, em bold)
```

---

## PLACEHOLDERS

```javascript
// Para dados que precisam verificação
new TextRun({
  text: "[VERIFICAR: descrição]",
  font: "Garamond",
  size: 24,
  highlight: "yellow"
})
```

---

## TERMOS TÉCNICOS

```javascript
// Termos legais em inglês: bold + italic
new TextRun({
  text: "Matter of Dhanasar",
  bold: true, italics: true, font: "Garamond", size: 24
})

// Termos em inglês dentro de texto PT-BR: italic
new TextRun({
  text: "National Interest Waiver",
  italics: true, font: "Garamond", size: 24
})

// Nomes de organizações: bold na primeira menção
new TextRun({
  text: "Bureau of Labor Statistics",
  bold: true, font: "Garamond", size: 24
})
// Menções subsequentes: normal (ou sigla)
```

---

## FOOTER SETUP

```javascript
footers: {
  default: new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "EB-2 NIW I-140 Petition – Cover Letter [NOME] ",
          font: "Garamond", size: 16, color: "808080"
        }),
        new TextRun({
          text: "| Page ",
          font: "Garamond", size: 16, color: "808080"
        }),
        new TextRun({
          children: [PageNumber.CURRENT],
          font: "Garamond", size: 16, color: "808080"
        }),
        new TextRun({
          text: " of ",
          font: "Garamond", size: 16, color: "808080"
        }),
        new TextRun({
          children: [PageNumber.TOTAL_PAGES],
          font: "Garamond", size: 16, color: "808080"
        })
      ]
    })]
  })
}
```

---

## CORES DO SISTEMA

| Uso | Hex | Descrição |
|-----|-----|-----------|
| Heading shading | `#C5E0B4` | Sage green |
| Evidence block | `#FFF2CC` | Cream/light yellow |
| Evidence border | `#D4A017` | Gold |
| Table header | `#C5E0B4` | Sage green |
| Table border | `#B4B4B4` | Light gray |
| Separator | `#B4B4B4` | Light gray |
| H2 color | `#1F4E2F` | Dark green |
| Body text | `#000000` | Black |
| Footer | `#808080` | Gray |
| Footnote | `#666666` | Dark gray |

---

## VALIDAÇÃO PÓS-GERAÇÃO

```bash
python scripts/office/validate.py output.docx
```

Se falhar: desempacotar, corrigir XML, reempacotar:
```bash
python scripts/office/unpack.py output.docx unpacked/
# ... fix XML ...
python scripts/office/pack.py unpacked/ output_fixed.docx --original output.docx
```

---

*v1.0 — 28/02/2026*
