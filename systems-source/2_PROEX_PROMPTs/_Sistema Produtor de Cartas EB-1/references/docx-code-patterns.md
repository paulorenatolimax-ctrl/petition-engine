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
