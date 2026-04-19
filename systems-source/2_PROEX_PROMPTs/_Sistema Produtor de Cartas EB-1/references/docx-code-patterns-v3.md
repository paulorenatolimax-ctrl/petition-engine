# Padrões de Código docx-js para Geração de Cartas

Estrutura comprovada para gerar cartas .docx profissionais com Node.js e a biblioteca docx.

## Estrutura Padrão do Script

Cada script de geração segue este padrão:

```javascript
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, LevelFormat, PageBreak
} = require("docx");

// ============================================================
// 1. CONSTANTES DE IDENTIDADE VISUAL (únicas por carta)
// ============================================================
const FONT = "Trebuchet MS";       // Diferente para cada carta
const COLOR = "1A237E";            // Cor primária (SEM #)
const ACCENT = "283593";           // Cor de acento (SEM #)
const BODY_COLOR = "2D2D2D";       // Cor do corpo do texto
const SIZE = {
  body: 22,      // 11pt
  h1: 30,        // 15pt
  h2: 26,        // 13pt
  small: 20,     // 10pt
  sig: 22        // 11pt (assinatura)
};

// ============================================================
// 2. FUNÇÕES AUXILIARES
// ============================================================

function heading1(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, font: FONT, size: SIZE.h1, color: COLOR })],
    alignment: AlignmentType.LEFT,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT } },
    spacing: { before: 280, after: 160 }
  });
}

function heading2(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, font: FONT, size: SIZE.h2, color: COLOR })],
    spacing: { before: 260, after: 140 }
  });
}

function body(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: SIZE.body, color: BODY_COLOR })],
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 160, line: 276 }
  });
}

function bodyMulti(runs) {
  // Para parágrafos com formatação mista (bold/itálico/cor)
  return new Paragraph({
    children: runs.map(r => new TextRun({
      text: r.text,
      font: FONT,
      size: r.size || SIZE.body,
      color: r.color || BODY_COLOR,
      bold: r.bold || false,
      italics: r.italics || false
    })),
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 160, line: 276 }
  });
}

function spacer(pts = 120) {
  return new Paragraph({ spacing: { before: pts } });
}

function accentLine() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT } },
    spacing: { before: 60, after: 60 }
  });
}

// ============================================================
// 3. AUXILIARES DE TABELA
// ============================================================

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: "B0BEC5" };

function headerCell(text, width) {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold: true, font: FONT, size: SIZE.small, color: "FFFFFF" })],
      alignment: AlignmentType.CENTER
    })],
    width: { size: width, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: COLOR },
    margins: { top: 60, bottom: 60, left: 80, right: 80 }
  });
}

function dataCell(text, width, fill = "FFFFFF") {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, font: FONT, size: SIZE.small, color: BODY_COLOR })],
      alignment: AlignmentType.LEFT
    })],
    width: { size: width, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill },
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    borders: {
      top: thinBorder, bottom: thinBorder,
      left: thinBorder, right: thinBorder
    }
  });
}

// Célula com texto em bold (para primeira coluna de tabelas de evidência)
function dataCellBold(text, width, fill = "FFFFFF") {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, font: FONT, size: SIZE.small, color: BODY_COLOR, bold: true })],
      alignment: AlignmentType.LEFT
    })],
    width: { size: width, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill },
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    borders: {
      top: thinBorder, bottom: thinBorder,
      left: thinBorder, right: thinBorder
    }
  });
}

// ============================================================
// 4. MONTAGEM DO DOCUMENTO
// ============================================================

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: "\u2022",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },  // US Letter
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }  // 1 polegada
      }
    },
    children: [
      // ... parágrafos, tabelas, etc.
    ]
  }]
});

// ============================================================
// 5. ESCREVER SAÍDA
// ============================================================

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/caminho/para/saida/NN_EMPRESA_Carta_Tipo.docx", buf);
  console.log("OK — Arquivo gerado com sucesso");
});
```

## Armadilhas Comuns

### NUNCA use `\n` em TextRun text
Errado: `new TextRun({ text: "Linha 1\nLinha 2" })`
Certo: Dois objetos `Paragraph` separados.

### SEMPRE use cores hex SEM o prefixo #
Errado: `color: "#1A237E"`
Certo: `color: "1A237E"`

### Células de tabela precisam de AMBOS width e columnSpan
```javascript
new TableCell({
  width: { size: 4680, type: WidthType.DXA },
  columnSpan: 1,  // explícito mesmo para colunas simples
  // ...
})
```

### Bullet points precisam de config numbering no nível do Document
O `numbering.config` com `LevelFormat.BULLET` deve ser definido no nível do `Document`, e referenciado nos parágrafos:
```javascript
new Paragraph({
  text: "Texto do item",
  numbering: { reference: "bullets", level: 0 }
})
```

### ShadingType.CLEAR é obrigatório para backgrounds de célula
Errado: `shading: { fill: "E3F2FD" }`
Certo: `shading: { type: ShadingType.CLEAR, fill: "E3F2FD" }`

### Sempre validar após geração
```bash
python /mnt/.skills/skills/docx/scripts/office/validate.py output.docx
```

## Padrão de Cadeia Causal em Código

Para cartas EB-1, cada seção substantiva deve conter uma cadeia causal. Exemplo de como codificar:

```javascript
// PADRÃO: Fato → Inferência → Impacto → Contexto
bodyMulti([
  { text: "A metodologia proprietária desenvolvida por [NOME] ", bold: false },
  { text: "reduziu o ciclo de implementação de ERP de 18 para 9 meses (↓50%)", bold: true, color: COLOR },
  { text: ", gerando economia estimada de USD 1.2M para o cliente. " },
  { text: "Segundo o Standish Group CHAOS Report 2024, ", italics: true },
  { text: "apenas 29% dos projetos de ERP são entregues dentro do prazo — posicionando esta metodologia entre as ", bold: false },
  { text: "top 5% mais eficientes do setor", bold: true, color: ACCENT },
  { text: "." }
]),
```

## Padrão de Tabela Comparativa com Pares

```javascript
new Table({
  rows: [
    new TableRow({
      children: [
        headerCell("Indicador", 3000),
        headerCell("Média do Campo", 2500),
        headerCell("[NOME]", 2500),
        headerCell("Percentil", 1360)
      ]
    }),
    new TableRow({
      children: [
        dataCellBold("Tempo de Implementação", 3000),
        dataCell("14-18 meses", 2500),
        dataCell("9 meses", 2500, "E8F5E9"),
        dataCell("Top 5%", 1360, "E8F5E9")
      ]
    }),
    new TableRow({
      children: [
        dataCellBold("Taxa de Adoção Pós-Go-Live", 3000),
        dataCell("64%", 2500),
        dataCell("91%", 2500, "E8F5E9"),
        dataCell("Top 8%", 1360, "E8F5E9")
      ]
    })
  ],
  width: { size: 9360, type: WidthType.DXA }
})
```

## Referência Rápida de Tamanho de Fonte

| Propósito | Half-points | Pontos |
|-----------|-------------|--------|
| Corpo do texto | 22 | 11pt |
| Heading H1 | 28-30 | 14-15pt |
| Heading H2 | 24-26 | 12-13pt |
| Small/caption | 18-20 | 9-10pt |
| Nome da empresa (header) | 32-36 | 16-18pt |

## Referência Rápida de Espaçamento

| Propósito | Valor DXA |
|-----------|-----------|
| Entre parágrafos corpo (after) | 140-180 |
| Antes de header de seção | 260-340 |
| Depois de header de seção | 120-180 |
| Espaçamento entre linhas | 264-300 (1.1x a 1.25x) |
| Spacer entre seções maiores | 200-400 |

## Referência de Tamanho de Página
- US Letter: 12240 x 15840 DXA (8.5" x 11") — **SEMPRE usar este**
- A4: 11906 x 16838 DXA — EVITAR, usar US Letter
- 1 polegada = 1440 DXA
- 1 pt de fonte = 2 half-points (então 11pt = size: 22)

---

# NOVOS PADRÕES V3.0 - De 7 Cartas EB-1 Produzidas

## 1. Logo Integration with ImageRun

Padrão comprovado para integrar logotipos de empresas em cartas de recomendação.

```javascript
// Read logo file
const logo = fs.readFileSync("path/to/logo.jpeg");

// Logo in header - left aligned (most common)
new Paragraph({
  children: [new ImageRun({
    type: "jpg",
    data: logo,
    transformation: { width: 120, height: 50 },
    altText: { title: "Company Logo", description: "Logo of Company Name", name: "company-logo" }
  })],
  spacing: { after: 100 }
})

// Logo - right aligned (for formal attestations)
new Paragraph({
  children: [new ImageRun({ type: "jpg", data: logo, transformation: { width: 140, height: 50 }, altText: { title: "Logo", description: "Logo", name: "logo" } })],
  alignment: AlignmentType.RIGHT,
  spacing: { after: 160 }
})

// Logo - centered (for letters of intent)
new Paragraph({
  children: [new ImageRun({ type: "jpg", data: logo, transformation: { width: 200, height: 80 }, altText: { title: "Logo", description: "Logo", name: "logo" } })],
  alignment: AlignmentType.CENTER,
  spacing: { after: 120 }
})

// Logo placeholder when image not available
new Paragraph({
  children: [new TextRun({ text: "[Company Logo]", font: FONT, size: 18, color: "CCCCCC", italics: true })],
  alignment: AlignmentType.RIGHT, // or CENTER or LEFT
  spacing: { after: 160 }
})
```

## 2. Pull-Quote Attestation Block Pattern

Para cartas de atestação formal de clientes. Texto em itálico com borda esquerda grossa (pull-quote visual).

```javascript
function attestationBlock(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: SIZE.body, color: BODY_COLOR, italics: true })],
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: ACCENT } },
    indent: { left: 400, right: 200 },
    spacing: { before: 140, after: 140, line: 280 }
  });
}

// Usage: interleave attestationBlock() with body() for rhythm
// Example:
attestationBlock("This quote demonstrates the impact and provides emphasis to the attestation."),
body("Supporting paragraph that contextualizes the attestation above..."),
```

## 3. Value Proposition Block Pattern

Para cartas de intenção profissional. Título + descrição com borda esquerda e sombreamento leve (ouro).

```javascript
function valueBlock(title, description) {
  return [
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, font: FONT, size: SIZE.body, color: COLOR })],
      border: { left: { style: BorderStyle.SINGLE, size: 14, color: ACCENT } },
      indent: { left: 400, right: 200 },
      shading: { type: ShadingType.CLEAR, fill: "FBF5E6" }, // light gold
      spacing: { before: 160, after: 0 }
    }),
    new Paragraph({
      children: [new TextRun({ text: description, font: FONT, size: SIZE.small, color: BODY_COLOR })],
      border: { left: { style: BorderStyle.SINGLE, size: 14, color: ACCENT } },
      indent: { left: 400, right: 200 },
      shading: { type: ShadingType.CLEAR, fill: "FBF5E6" },
      spacing: { before: 40, after: 160, line: 264 }
    })
  ];
}

// Usage: spread operator needed because it returns an array
// Example:
...valueBlock("Strategic Impact", "This proposition demonstrates how the proposed work directly drives revenue growth and competitive advantage."),
```

## 4. Gold/Decorative Rule Separators

Padrões de linhas decorativas para separação visual entre seções.

```javascript
// Single accent line
function accentLine() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: ACCENT } },
    spacing: { before: 40, after: 40 }
  });
}

// Gold rule separator (wider spacing)
function goldRule() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT } },
    spacing: { before: 200, after: 200 }
  });
}

// Double rule for letterhead separation
new Paragraph({
  border: { bottom: { style: BorderStyle.DOUBLE, size: 4, color: ACCENT } },
  spacing: { before: 0, after: 240 }
})
```

## 5. Right-Aligned Company Header (for attestations)

Header corporativo alinhado à direita, padrão em cartas de atestação de empresas.

```javascript
// Right-aligned corporate header block
new Paragraph({
  children: [new TextRun({ text: "COMPANY NAME", bold: true, font: FONT, size: 28, color: COLOR })],
  alignment: AlignmentType.RIGHT,
  spacing: { after: 40 }
}),
new Paragraph({
  children: [new TextRun({ text: "Department / Division", font: FONT, size: 20, color: ACCENT })],
  alignment: AlignmentType.RIGHT,
  spacing: { after: 20 }
}),
new Paragraph({
  children: [new TextRun({ text: "City, State, Country", font: FONT, size: 18, color: "777777" })],
  alignment: AlignmentType.RIGHT,
  spacing: { after: 240 }
}),
```

## 6. Centered Formal Header (for letters of intent)

Header formal centralizado, ideal para cartas de intenção profissional.

```javascript
// Centered letterhead with smallCaps
new Paragraph({
  children: [new TextRun({ text: "THE WALT DISNEY COMPANY", bold: true, font: FONT, size: 32, color: COLOR, smallCaps: true })],
  alignment: AlignmentType.CENTER,
  spacing: { after: 40 }
}),
new Paragraph({
  children: [new TextRun({ text: "Finance Transformation Office", font: FONT, size: 22, color: ACCENT })],
  alignment: AlignmentType.CENTER,
  spacing: { after: 20 }
}),
new Paragraph({
  children: [new TextRun({ text: "Frisco, Texas \u2022 United States", font: FONT, size: 18, color: "777777" })],
  alignment: AlignmentType.CENTER,
  spacing: { after: 60 }
}),
```

## 7. Multi-Credential Signature Block

Bloco de assinatura com múltiplas credenciais e empregadores anteriores, para recomendantes com carreira diversa.

```javascript
// For recommenders with multiple credentials and prior employers
new Paragraph({
  children: [new TextRun({ text: "Kayce Coker", bold: true, font: FONT, size: 24, color: COLOR })],
  spacing: { after: 40 }
}),
new Paragraph({
  children: [new TextRun({ text: "Finance Transformation Executive", font: FONT, size: SIZE.small, color: BODY_COLOR })],
  spacing: { after: 20 }
}),
new Paragraph({
  children: [new TextRun({ text: "The Walt Disney Company", font: FONT, size: SIZE.small, color: ACCENT, bold: true })],
  spacing: { after: 20 }
}),
new Paragraph({
  children: [new TextRun({ text: "MBA, Southern Methodist University \u2014 Cox School of Business", font: FONT, size: 18, color: "888888", italics: true })],
  spacing: { after: 20 }
}),
new Paragraph({
  children: [new TextRun({ text: "Former Senior Manager, Business Consulting \u2014 Finance Transformation, EY (2018\u20132025)", font: FONT, size: 18, color: "888888", italics: true })],
  spacing: { after: 40 }
}),
```

## 8. Formal Attestation Closing ("In Witness Whereof")

Fechamento formal de cartas de atestação, com linguagem legal e contundente.

```javascript
new Paragraph({
  children: [new TextRun({ text: "In Witness Whereof", bold: true, font: FONT, size: SIZE.body, color: COLOR })],
  spacing: { after: 160 }
}),
body("I attest, in my professional capacity as [role] of [company] and as a [domain] leader with extensive experience in [field], that the preceding characterization of [petitioner name]'s professional contributions, technical impact, indispensability to this engagement, and broader professional significance is accurate and fully represents my professional judgment."),
```

## 9. Inline Bold Metrics in Prose (TABLE REPLACEMENT)

Quando você precisa apresentar dados estruturados sem usar tabela. Integra métricas com destaque bold diretamente no fluxo de prosa.

```javascript
bodyMulti([
  { text: "Under César's architectural leadership, the regional reporting framework consolidated " },
  { text: "four geographic P&L structures into a unified enterprise model", bold: true, color: COLOR },
  { text: ", reducing month-end consolidation from " },
  { text: "8–10 days to under 2 days", bold: true },
  { text: " and generating a " },
  { text: "USD 2.2 million contract extension", bold: true, color: COLOR },
  { text: " — a direct commercial validation of the work's strategic significance." }
]),
```

## 10. Ordered Outcomes in Prose (TABLE REPLACEMENT)

Apresenta resultados esperados numerados em prosa, sem tabelas. Cada resultado em parágrafo separado com label bold.

```javascript
bodyMulti([
  { text: "First, ", bold: true, color: COLOR },
  { text: "significant reduction in manual reporting effort and cycle time, enabling finance teams to redirect capacity from data preparation toward interpretation, analysis, and strategic guidance." }
]),
bodyMulti([
  { text: "Second, ", bold: true, color: COLOR },
  { text: "improved accuracy, consistency, and governance of financial reporting at an enterprise level." }
]),
bodyMulti([
  { text: "Third, ", bold: true, color: COLOR },
  { text: "enhanced executive decision-making capabilities through actionable insights and predictive analytics." }
]),
```

## 11. SmallCaps Header Variations

Variações de headers com small caps, oferecendo alternativas visuais sofisticadas.

```javascript
// H11: Small caps with TOP border only
new Paragraph({
  children: [new TextRun({ text: text.toUpperCase(), bold: true, font: FONT, size: SIZE.h1, color: COLOR, smallCaps: true })],
  alignment: AlignmentType.LEFT,
  border: { top: { style: BorderStyle.SINGLE, size: 6, color: ACCENT } },
  spacing: { before: 300, after: 160 }
})

// H12: Centered small caps with bottom underline
new Paragraph({
  children: [new TextRun({ text: text.toUpperCase(), bold: true, font: FONT, size: SIZE.h1, color: COLOR, smallCaps: true })],
  alignment: AlignmentType.CENTER,
  border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ACCENT } },
  spacing: { before: 320, after: 180 }
})
```

## 12. Unicode Characters Reference

Caracteres Unicode comumente usados em cartas EB-1 profissionais.

```javascript
// Commonly used in letters:
"\u2014"  // Em-dash (—)
"\u2019"  // Right single quote / apostrophe (')
"\u201C"  // Left double quote (")
"\u201D"  // Right double quote (")
"\u2022"  // Bullet (•)
"\u00e9"  // é (for César)
"\u00e7"  // ç (for Maçol)
```

## Dicas Adicionais para Implementação

1. **Logos com Transparência**: Arquivos JPEG funcionam melhor. PNG com transparência pode causar problemas; converter para JPG primeiro.

2. **Cor de Accent**: Use cores que combinam com o branding corporativo. Ouro (#D4A574), azul profundo (#1A237E), e cinza (#555555) são escolhas seguras.

3. **Espaçamento**: Teste em Word nativo antes de enviar. Margens e espaçamento entre parágrafos afetam o layout final.

4. **Credenciais Múltiplas**: Para profissionais com MBA + experiência em múltiplas empresas, use o padrão multi-credential. Mantenha nomes de empresa em BOLD e graus em itálico.

5. **Validação**: Após gerar, sempre rodar o validador e abrir em Word para revisar quebras de linha, espaçamento e alinhamento de imagens.
