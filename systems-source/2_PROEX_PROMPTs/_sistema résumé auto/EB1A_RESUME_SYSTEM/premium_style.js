// Premium Document Style Module - PROEX EB-1A
// Uniform ultra-professional design for all evidence documents

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak, ImageRun, TabStopType, TabStopPosition
} = require("docx");
const fs = require("fs");

// ═══════════════════════════════════════════
// PREMIUM COLOR PALETTE
// ═══════════════════════════════════════════
const COLORS = {
  navy: "1B2A4A",        // Primary headers
  gold: "C9A96E",        // Accent lines, highlights
  darkGray: "333333",    // Body text
  medGray: "666666",     // Secondary text
  lightGray: "F7F7F7",   // Table backgrounds
  white: "FFFFFF",
  black: "000000",
  accentBlue: "2C5F8A",  // Links, secondary headers
};

const FONT = "Garamond";
const FONT_BODY = 24;      // 12pt
const FONT_H1 = 36;        // 18pt
const FONT_H2 = 28;        // 14pt
const FONT_H3 = 24;        // 12pt
const FONT_META = 20;      // 10pt
const FONT_FOOTER = 16;    // 8pt

// ═══════════════════════════════════════════
// BORDER HELPERS
// ═══════════════════════════════════════════
const noBorder = { style: BorderStyle.NONE, size: 0 };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
const thinBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const goldBottomOnly = { top: noBorder, left: noBorder, right: noBorder, bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.gold } };

// ═══════════════════════════════════════════
// COMPONENT BUILDERS
// ═══════════════════════════════════════════

function titleBar(text) {
  return new Paragraph({
    spacing: { before: 0, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: COLORS.gold, space: 8 } },
    children: [
      new TextRun({ text: text.toUpperCase(), font: FONT, size: FONT_H1, bold: true, color: COLORS.navy }),
    ],
  });
}

function subtitleLine(text) {
  return new Paragraph({
    spacing: { before: 0, after: 300 },
    children: [
      new TextRun({ text, font: FONT, size: FONT_H2, italics: true, color: COLORS.accentBlue }),
    ],
  });
}

function sectionHeader(text) {
  return new Paragraph({
    spacing: { before: 400, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.gold, space: 4 } },
    children: [
      new TextRun({ text: text.toUpperCase(), font: FONT, size: FONT_H2, bold: true, color: COLORS.navy }),
    ],
  });
}

function subHeader(text) {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({ text, font: FONT, size: FONT_H3, bold: true, color: COLORS.accentBlue }),
    ],
  });
}

function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 120, line: 276 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        font: FONT,
        size: FONT_BODY,
        color: COLORS.darkGray,
        bold: opts.bold || false,
        italics: opts.italics || false,
      }),
    ],
  });
}

function metadataTable(rows) {
  // rows = [{label: "Data:", value: "2024-01-01"}, ...]
  const TABLE_WIDTH = 9360;
  const COL1 = 2800;
  const COL2 = TABLE_WIDTH - COL1;
  const cellMargins = { top: 60, bottom: 60, left: 120, right: 120 };

  return new Table({
    width: { size: TABLE_WIDTH, type: WidthType.DXA },
    columnWidths: [COL1, COL2],
    rows: rows.map((row, i) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: COL1, type: WidthType.DXA },
            borders: noBorders,
            margins: cellMargins,
            shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({ text: row.label, font: FONT, size: FONT_META, bold: true, color: COLORS.navy }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: COL2, type: WidthType.DXA },
            borders: noBorders,
            margins: cellMargins,
            shading: { fill: COLORS.white, type: ShadingType.CLEAR },
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({ text: row.value, font: FONT, size: FONT_META, color: COLORS.darkGray }),
                ],
              }),
            ],
          }),
        ],
      })
    ),
  });
}

function spacer(pts = 200) {
  return new Paragraph({ spacing: { before: pts, after: 0 }, children: [] });
}

function goldDivider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.gold, space: 1 } },
    children: [],
  });
}

function confidentialFooter(beneficiary) {
  return new Footer({
    children: [
      new Paragraph({
        spacing: { before: 0, after: 0 },
        border: { top: { style: BorderStyle.SINGLE, size: 2, color: COLORS.gold, space: 4 } },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({ text: `EB-1A Petition — ${beneficiary}`, font: FONT, size: FONT_FOOTER, color: COLORS.medGray, italics: true }),
          new TextRun({ text: "\tPage ", font: FONT, size: FONT_FOOTER, color: COLORS.medGray }),
          new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: FONT_FOOTER, color: COLORS.medGray }),
        ],
      }),
    ],
  });
}

function premiumHeader(category) {
  return new Header({
    children: [
      new Paragraph({
        spacing: { before: 0, after: 0 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.gold, space: 4 } },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({ text: "ANTÔNIO CARLOS DE ANDRADE SANTANA", font: FONT, size: FONT_FOOTER, bold: true, color: COLORS.navy }),
          new TextRun({ text: `\t${category}`, font: FONT, size: FONT_FOOTER, color: COLORS.medGray, italics: true }),
        ],
      }),
    ],
  });
}

function createPremiumDoc(content, category, beneficiary = "Antônio Carlos de Andrade Santana") {
  return new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: FONT_BODY, color: COLORS.darkGray },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1296, bottom: 1152, left: 1296 },
        },
      },
      headers: { default: premiumHeader(category) },
      footers: { default: confidentialFooter(beneficiary) },
      children: content,
    }],
  });
}

async function savePremiumDoc(doc, outputPath) {
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  const size = (buffer.length / 1024).toFixed(1);
  console.log(`✓ ${outputPath.split("/").pop()} — ${size} KB`);
  return buffer.length;
}

module.exports = {
  COLORS, FONT, titleBar, subtitleLine, sectionHeader, subHeader,
  bodyText, metadataTable, spacer, goldDivider, confidentialFooter,
  premiumHeader, createPremiumDoc, savePremiumDoc,
  noBorders, thinBorders, goldBottomOnly,
  FONT_BODY, FONT_H1, FONT_H2, FONT_H3, FONT_META, FONT_FOOTER,
};
