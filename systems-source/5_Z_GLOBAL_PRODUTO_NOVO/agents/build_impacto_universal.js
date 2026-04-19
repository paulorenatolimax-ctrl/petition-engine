const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak, TabStopType, TabStopPosition
} = require("docx");

// ═══════════════════════════════════════════════════════════════════════════════
// IMPACTO® UNIVERSAL BUILD SCRIPT
// Economic Impact Intelligence Suite — All 13 Modules
// Parameterized for any client config
// ═══════════════════════════════════════════════════════════════════════════════

// Read config from CLI argument or default
const configPath = process.argv[2] || "./client_config.json";
if (!fs.existsSync(configPath)) {
  console.error(`Error: Config file not found at ${configPath}`);
  process.exit(1);
}

const C = JSON.parse(fs.readFileSync(configPath, "utf8"));
const lang = C.meta.language || "en";

// Color palette (identical to originals)
const NAVY = "0A1628";
const TEAL = "0D9488";
const DARK_TEAL = "0B7A6E";
const GOLD = "D4A843";
const LIGHT_BG = "F8FAFB";
const MED_BG = "EDF2F7";
const DARK_TEXT = "1A202C";
const MED_TEXT = "4A5568";
const LIGHT_TEXT = "718096";
const WHITE = "FFFFFF";
const RED_ACCENT = "E53E3E";
const GREEN_ACCENT = "38A169";
const BLUE_ACCENT = "3182CE";
const PURPLE_ACCENT = "805AD5";

// Borders
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CBD5E0" };
const thinBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const tealBottomBorder = { top: noBorder, bottom: { style: BorderStyle.SINGLE, size: 6, color: TEAL }, left: noBorder, right: noBorder };

// Table widths (US Letter 1" margins = 9360 DXA)
const FULL_W = 9360;
const HALF_W = 4680;
const THIRD_W = 3120;
const TWO_THIRD_W = 6240;

// Cell margins
const cellPad = { top: 80, bottom: 80, left: 120, right: 120 };
const cellPadLarge = { top: 120, bottom: 120, left: 160, right: 160 };

// ════════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS (identical to originals)
// ════════════════════════════════════════════════════════════════════════════════

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, color: NAVY, font: "Arial" })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, bold: true, size: 26, color: TEAL, font: "Arial" })]
  });
}

function h3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, size: 22, color: DARK_TEAL, font: "Arial" })]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: [new TextRun({
      text,
      size: 21,
      color: opts.color || DARK_TEXT,
      font: "Arial",
      bold: opts.bold || false,
      italics: opts.italic || false
    })]
  });
}

function richP(runs, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after || 120, line: 276 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children: runs.map(r => new TextRun({
      text: r.text,
      size: r.size || 21,
      color: r.color || DARK_TEXT,
      font: "Arial",
      bold: r.bold || false,
      italics: r.italic || false
    }))
  });
}

function spacer(h = 120) {
  return new Paragraph({ spacing: { after: h }, children: [] });
}

function kpiTable(rows) {
  return new Table({
    width: { size: FULL_W, type: WidthType.DXA },
    columnWidths: [5200, 4160],
    rows: rows.map(([label, value, highlight]) => new TableRow({
      children: [
        new TableCell({
          borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" } },
          width: { size: 5200, type: WidthType.DXA },
          margins: cellPad,
          children: [new Paragraph({ children: [new TextRun({ text: label, size: 20, color: MED_TEXT, font: "Arial" })] })]
        }),
        new TableCell({
          borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" } },
          width: { size: 4160, type: WidthType.DXA },
          margins: cellPad,
          children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: value, size: 20, color: highlight || NAVY, font: "Arial", bold: true })] })]
        })
      ]
    }))
  });
}

function metricBox(label, value, unit, color) {
  return new Table({
    width: { size: FULL_W, type: WidthType.DXA },
    columnWidths: [FULL_W],
    rows: [new TableRow({
      children: [new TableCell({
        borders: { top: { style: BorderStyle.SINGLE, size: 8, color }, bottom: noBorder, left: noBorder, right: noBorder },
        width: { size: FULL_W, type: WidthType.DXA },
        shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
        margins: cellPadLarge,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [new TextRun({ text: value, size: 40, color, font: "Arial", bold: true })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 20 },
            children: [new TextRun({ text: unit, size: 18, color: MED_TEXT, font: "Arial" })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: label, size: 16, color: LIGHT_TEXT, font: "Arial" })]
          })
        ]
      })]
    })]
  });
}

function makeHeaderedTable(headers, rows, colWidths, headerBg) {
  const bg = headerBg || NAVY;
  return new Table({
    width: { size: FULL_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: headers.map((t, i) => new TableCell({
          borders: thinBorders,
          width: { size: colWidths[i], type: WidthType.DXA },
          shading: { fill: bg, type: ShadingType.CLEAR },
          margins: cellPad,
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: t, size: 16, color: WHITE, font: "Arial", bold: true })]
          })]
        }))
      }),
      ...rows.map(([cells, isTotal], idx) => new TableRow({
        children: cells.map((t, i) => new TableCell({
          borders: thinBorders,
          width: { size: colWidths[i], type: WidthType.DXA },
          shading: { fill: isTotal ? MED_BG : (idx % 2 === 0 ? LIGHT_BG : WHITE), type: ShadingType.CLEAR },
          margins: cellPad,
          children: [new Paragraph({
            alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
            children: [new TextRun({
              text: t,
              size: 17,
              color: DARK_TEXT,
              font: "Arial",
              bold: isTotal || i === 0
            })]
          })]
        }))
      }))
    ]
  });
}

// ════════════════════════════════════════════════════════════════════════════════
// LANGUAGE STRINGS
// ════════════════════════════════════════════════════════════════════════════════

const L = lang === "pt-br" ? {
  coverTitle: "IMPACTO®",
  coverSubtitle: "Suite de Inteligência de Impacto Econômico",
  coverTier: "Nível Empresarial — Análise Completa de 13 Módulos",
  coverAnalysis: "ANÁLISE ABRANGENTE DE IMPACTO ECONÔMICO",
  coverSupport: "Em Suporte ao Formulário I-140, Petição de Imigração para Trabalhador Estrangeiro",
  coverNIW: "National Interest Waiver (EB-2 NIW) — 8 CFR § 204.5(k)(4)(ii)",
  toc: "Sumário",
  m1Title: "Módulo M1 — Análise de Impacto Econômico Principal (IMPLAN + RIMS II)",
  m2Title: "Módulo M2 — Pegada Econômica Regional (MSA)",
  m3Title: "Módulo M3 — Análise de Multiplicadores Setoriais (NAICS)",
  m4Title: "Módulo M4 — Projeção de Receita Tributária (Federal, Estadual e Local)",
  m5Title: "Módulo M5 — Mapeamento do Ecossistema da Cadeia de Suprimentos",
  m6Title: "Módulo M6 — Análise de Multiplicador de Emprego (EPI)",
  m7Title: "Módulo M7 — Alinhamento de Política e Prioridade Nacional",
  m8Title: "Módulo M8 — Vantagem Comparativa Regional",
  m9Title: "Módulo M9 — Análise de Sensibilidade e Cenário",
  m10Title: "Módulo M10 — Mapeamento RFE",
  m11Title: "Módulo M11 — Análise de Retorno Social sobre o Investimento (SROI)",
  m12Title: "Módulo M12 — Impacto Cultural e Transnacional",
  m13Title: "Módulo M13 — Campo Mais Amplo e Implicações Societárias",
  methodNotes: "Notas Metodológicas & Fontes de Dados",
  appendices: "Apêndices"
} : {
  coverTitle: "IMPACTO®",
  coverSubtitle: "Economic Impact Intelligence Suite",
  coverTier: "Enterprise Tier — Full 13-Module Analysis",
  coverAnalysis: "COMPREHENSIVE ECONOMIC IMPACT ANALYSIS",
  coverSupport: "In Support of Form I-140, Immigrant Petition for Alien Worker",
  coverNIW: "National Interest Waiver (EB-2 NIW) — 8 CFR § 204.5(k)(4)(ii)",
  toc: "Table of Contents",
  m1Title: "Module M1 — Core Economic Impact Analysis (IMPLAN + RIMS II)",
  m2Title: "Module M2 — Regional Economic Footprint (MSA)",
  m3Title: "Module M3 — Sectoral Multiplier Analysis (NAICS)",
  m4Title: "Module M4 — Tax Revenue Projection (Federal, State & Local)",
  m5Title: "Module M5 — Supply Chain Ecosystem Mapping",
  m6Title: "Module M6 — EPI Employment Multiplier Analysis",
  m7Title: "Module M7 — Policy & National Priority Alignment",
  m8Title: "Module M8 — Comparative Regional Advantage",
  m9Title: "Module M9 — Sensitivity & Scenario Analysis",
  m10Title: "Module M10 — RFE Mapping",
  m11Title: "Module M11 — Social Return on Investment (SROI) Analysis",
  m12Title: "Module M12 — Cultural & Cross-Border Impact",
  m13Title: "Module M13 — Broader Field & Societal Implications",
  methodNotes: "Methodological Notes & Data Sources",
  appendices: "Appendices"
};

// ════════════════════════════════════════════════════════════════════════════════
// SECTION BUILDERS — Each returns array of Paragraph objects
// ════════════════════════════════════════════════════════════════════════════════

function buildCover() {
  const sections = [];

  sections.push(
    spacer(600),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: TEAL, space: 1 } },
      spacing: { after: 400 },
      children: []
    }),
    spacer(200),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 80 },
      children: [new TextRun({ text: "IMPACTO®", size: 56, color: NAVY, font: "Arial", bold: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [new TextRun({ text: L.coverSubtitle, size: 28, color: TEAL, font: "Arial" })]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 200 },
      children: [new TextRun({ text: L.coverTier, size: 22, color: GOLD, font: "Arial", bold: true })]
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0", space: 1 } },
      spacing: { after: 300 },
      children: []
    }),
    spacer(100),
    new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: L.coverAnalysis, size: 24, color: NAVY, font: "Arial", bold: true })]
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: L.coverSupport, size: 20, color: MED_TEXT, font: "Arial" })]
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: L.coverNIW, size: 20, color: MED_TEXT, font: "Arial" })]
    }),
    spacer(200)
  );

  // Client info table
  const clientRows = [
    [lang === "pt-br" ? "Peticionário:" : "Petitioner:", C.client.petitioner_name],
    [lang === "pt-br" ? "Empresa:" : "Company:", C.client.company_name],
    [lang === "pt-br" ? "Entidade Responsável:" : "Parent Entity:", C.client.parent_entity || "N/A"],
    [lang === "pt-br" ? "Setor:" : "Industry:", C.client.industry_naics || "N/A"],
    [lang === "pt-br" ? "Empreendimento:" : "Endeavor:", C.client.endeavor_short || "N/A"],
    [lang === "pt-br" ? "Região de Impacto:" : "Impact Region:", C.location.msa_name || "N/A"],
    [lang === "pt-br" ? "Número de Recebimento:" : "Receipt Number:", C.meta.receipt_number || "N/A"],
    [lang === "pt-br" ? "Data de Prioridade:" : "Priority Date:", C.meta.priority_date || "N/A"]
  ];

  sections.push(
    new Table({
      width: { size: FULL_W, type: WidthType.DXA },
      columnWidths: [2800, 6560],
      rows: clientRows.map(([label, value]) => new TableRow({
        children: [
          new TableCell({
            borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" } },
            width: { size: 2800, type: WidthType.DXA },
            margins: cellPad,
            children: [new Paragraph({
              children: [new TextRun({ text: label, size: 19, color: LIGHT_TEXT, font: "Arial", bold: true })]
            })]
          }),
          new TableCell({
            borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" } },
            width: { size: 6560, type: WidthType.DXA },
            margins: cellPad,
            children: [new Paragraph({
              children: [new TextRun({ text: value, size: 19, color: DARK_TEXT, font: "Arial" })]
            })]
          })
        ]
      }))
    }),
    spacer(300),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: TEAL, space: 1 } },
      spacing: { after: 200 },
      children: []
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [new TextRun({
        text: `${lang === "pt-br" ? "Preparado por:" : "Prepared by:"} ${C.meta.prepared_by || "Global Communication LLC"}`,
        size: 18,
        color: MED_TEXT,
        font: "Arial"
      })]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [new TextRun({
        text: `${lang === "pt-br" ? "Metodologia:" : "Methodology:"} IMPLAN® + RIMS II + EPI Employment Multipliers`,
        size: 18,
        color: MED_TEXT,
        font: "Arial"
      })]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [new TextRun({
        text: `${lang === "pt-br" ? "Data de Análise:" : "Analysis Date:"} ${C.meta.analysis_date || "March 2026"} | ${lang === "pt-br" ? "ID do Relatório:" : "Report ID:"} ${C.meta.report_id || "IMP-2026-UNIVERSAL"}`,
        size: 18,
        color: MED_TEXT,
        font: "Arial"
      })]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [new TextRun({
        text: lang === "pt-br" ? "CONFIDENCIAL — Preparado Apenas para Procedimentos de Imigração" : "CONFIDENTIAL — Prepared for Immigration Proceedings Only",
        size: 16,
        color: RED_ACCENT,
        font: "Arial",
        bold: true
      })]
    })
  );

  return sections;
}

function buildTOC() {
  const sections = [h1(L.toc), spacer(100)];

  const tocItems = lang === "pt-br" ? [
    ["1.", "Sumário Executivo & Painel de Impacto"],
    ["2.", L.m1Title],
    ["3.", L.m2Title],
    ["4.", L.m3Title],
    ["5.", L.m4Title],
    ["6.", L.m5Title],
    ["7.", L.m6Title],
    ["8.", L.m7Title],
    ["9.", L.m8Title],
    ["10.", L.m9Title],
    ["11.", L.m10Title],
    ["12.", L.m11Title],
    ["13.", L.m12Title],
    ["14.", L.m13Title],
    ["15.", L.methodNotes],
    ["16.", L.appendices]
  ] : [
    ["1.", "Executive Summary & Impact Dashboard"],
    ["2.", L.m1Title],
    ["3.", L.m2Title],
    ["4.", L.m3Title],
    ["5.", L.m4Title],
    ["6.", L.m5Title],
    ["7.", L.m6Title],
    ["8.", L.m7Title],
    ["9.", L.m8Title],
    ["10.", L.m9Title],
    ["11.", L.m10Title],
    ["12.", L.m11Title],
    ["13.", L.m12Title],
    ["14.", L.m13Title],
    ["15.", L.methodNotes],
    ["16.", L.appendices]
  ];

  sections.push(
    ...tocItems.map(([num, title]) => new Paragraph({
      spacing: { after: 80, line: 300 },
      indent: { left: 200 },
      children: [
        new TextRun({ text: num + " ", size: 20, color: TEAL, font: "Arial", bold: true }),
        new TextRun({ text: title, size: 20, color: DARK_TEXT, font: "Arial" })
      ]
    }))
  );

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildM1() {
  const sections = [
    new Paragraph({ children: [new PageBreak()] }),
    h1("2. " + L.m1Title),
    spacer(40),
    p(`The ${C.client.company_name}'s ${C.client.endeavor_short} operation in the ${C.location.msa_name} MSA generates a total 5-year economic output of ${C.m1_economic_output?.headline_metric || "N/A"}, validated through RIMS II Type II multipliers (${C.multipliers?.type_ii_output || "N/A"}x) sourced from the Bureau of Economic Analysis.`)
  ];

  if (C.m1_economic_output?.output_5yr) {
    sections.push(
      h2("2.1 Total Economic Output (5-Year Projection)"),
      spacer(40),
      metricBox("Total Economic Output", C.m1_economic_output.output_5yr, "5-Year Period", TEAL)
    );
  }

  if (C.m1_economic_output?.direct_output || C.m1_economic_output?.indirect_output) {
    sections.push(
      spacer(200),
      h2("2.2 Output Decomposition: Direct vs. Induced Effects"),
      spacer(40),
      kpiTable([
        [lang === "pt-br" ? "Saída Direta:" : "Direct Output:", C.m1_economic_output?.direct_output || "N/A", NAVY],
        [lang === "pt-br" ? "Saída Indireta:" : "Indirect Output:", C.m1_economic_output?.indirect_output || "N/A", TEAL],
        [lang === "pt-br" ? "Saída Induzida:" : "Induced Output:", C.m1_economic_output?.induced_output || "N/A", DARK_TEAL]
      ])
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildM2() {
  const sections = [
    h1("3. " + L.m2Title),
    spacer(40),
    p(`The ${C.location.msa_name} MSA (FIPS ${C.location.fips || "N/A"}) represents a critical economic hub in the region. ${C.client.company_name}'s footprint directly contributes to regional GDP through supply chain integration and employment generation.`)
  ];

  if (C.m2_employment?.total_jobs) {
    sections.push(
      spacer(200),
      h2("3.1 Regional Employment Impact"),
      spacer(40),
      metricBox("Total Jobs Generated", C.m2_employment.total_jobs, "Direct + Indirect", GREEN_ACCENT)
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildM3() {
  const sections = [
    h1("4. " + L.m3Title),
    spacer(40),
    p(`Sectoral multipliers for NAICS ${C.client.industry_naics || "N/A"} reveal the leverage of the petitioner's operations across upstream and downstream supply chain participants.`)
  ];

  if (C.m3_earnings_income?.wage_income_5yr) {
    sections.push(
      spacer(200),
      h2("4.1 Sectoral Income Effects"),
      spacer(40),
      metricBox("5-Year Wage Income", C.m3_earnings_income.wage_income_5yr, "Direct Employment", BLUE_ACCENT)
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildM4() {
  const sections = [
    h1("5. " + L.m4Title),
    spacer(40),
    p(`Federal, state, and local tax revenues are projected from the petitioner's economic impact over a 5-year period, including personal income tax, corporate profit tax, payroll taxes, sales tax, and property tax contributions.`)
  ];

  if (C.m4_tax_revenue?.federal_5yr) {
    sections.push(
      spacer(200),
      h2("5.1 Tax Revenue Breakdown"),
      spacer(40),
      kpiTable([
        [lang === "pt-br" ? "Imposto Federal:" : "Federal Tax:", C.m4_tax_revenue?.federal_5yr || "N/A", NAVY],
        [lang === "pt-br" ? "Imposto Estadual:" : "State Tax:", C.m4_tax_revenue?.state_5yr || "N/A", TEAL],
        [lang === "pt-br" ? "Impostos Locais:" : "Local Tax:", C.m4_tax_revenue?.local_5yr || "N/A", DARK_TEAL]
      ])
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildM5() {
  const sections = [
    h1("6. " + L.m5Title),
    spacer(40),
    p(`The petitioner's supply chain ecosystem encompasses upstream input providers, logistics partners, distribution channels, and downstream customers. This network multiplies initial investment across the regional economy.`)
  ];

  if (C.m5_supply_chain?.vendor_count) {
    sections.push(
      spacer(200),
      h2("6.1 Supply Chain Network Size"),
      spacer(40),
      kpiTable([
        [lang === "pt-br" ? "Fornecedores Diretos:" : "Direct Vendors:", C.m5_supply_chain.vendor_count || "N/A"],
        [lang === "pt-br" ? "Cadeias Indiretas:" : "Indirect Tiers:", C.m5_supply_chain.indirect_tiers || "N/A"]
      ])
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildM6() {
  const sections = [
    h1("7. " + L.m6Title),
    spacer(40),
    p(`Employment multipliers from the Economic Policy Institute (EPI) demonstrate that each direct job supported by the petitioner generates additional employment across the supply chain and consumer spending sectors.`)
  ];

  if (C.m6_innovation_technology?.rd_investment) {
    sections.push(
      spacer(200),
      h2("7.1 Innovation & R&D Investment"),
      spacer(40),
      metricBox("R&D Investment (Annual)", C.m6_innovation_technology.rd_investment, "Technology Transfer", PURPLE_ACCENT)
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildM7() {
  const sections = [
    h1("8. " + L.m7Title),
    spacer(40),
    p(`The petitioner's operations align with multiple federal policy priorities including workforce development, regional economic competitiveness, trade facilitation, and strategic industry advancement.`)
  ];

  if (C.m7_industry_comparison?.comparative_advantage) {
    sections.push(
      spacer(200),
      h2("8.1 Industry Positioning"),
      spacer(40),
      p(C.m7_industry_comparison.comparative_advantage)
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildM8() {
  const sections = [
    h1("9. " + L.m8Title),
    spacer(40),
    p(`Comparative analysis reveals that the ${C.location.msa_name} region benefits from the petitioner's presence relative to peer regions and national benchmarks in similar industries.`)
  ];

  if (C.m8_government_alignment?.strategic_priority) {
    sections.push(
      spacer(200),
      h2("9.1 Strategic Alignment"),
      spacer(40),
      p(C.m8_government_alignment.strategic_priority)
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildM9() {
  const sections = [
    h1("10. " + L.m9Title),
    spacer(40),
    p(`Sensitivity analysis tests the robustness of impact projections under varying assumptions regarding multiplier rates, growth trajectories, and market conditions.`)
  ];

  if (C.m9_sensitivity_analysis?.base_scenario) {
    sections.push(
      spacer(200),
      h2("10.1 Scenario Analysis"),
      spacer(40),
      kpiTable([
        [lang === "pt-br" ? "Cenário Base:" : "Base Scenario:", C.m9_sensitivity_analysis.base_scenario || "N/A"],
        [lang === "pt-br" ? "Cenário Otimista:" : "Upside Scenario:", C.m9_sensitivity_analysis.upside_scenario || "N/A"],
        [lang === "pt-br" ? "Cenário Conservador:" : "Downside Scenario:", C.m9_sensitivity_analysis.downside_scenario || "N/A"]
      ])
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildM10() {
  const sections = [
    h1("11. " + L.m10Title),
    spacer(40),
    p(`RFE mapping demonstrates alignment with Form I-140 Requests for Evidence by directly addressing USCIS criteria for extraordinary ability, advanced degree requirements, and national interest waiver eligibility under 8 CFR § 204.5(k)(4)(ii).`)
  ];

  if (C.m10_rfe_mapping?.criterion_1) {
    sections.push(
      spacer(200),
      h2("11.1 USCIS Criterion Alignment"),
      spacer(40),
      p(C.m10_rfe_mapping.criterion_1)
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildM11() {
  const sections = [
    h1("12. " + L.m11Title),
    spacer(40),
    p(`This module quantifies the petitioner's social impact using the Social Return on Investment (SROI) framework — an internationally recognized methodology endorsed by the World Bank, UNDP, and GIIN. SROI translates social outcomes into monetized values.`)
  ];

  if (C.m11_sroi?.sroi_ratio) {
    sections.push(
      spacer(200),
      h2("12.1 Workforce Development & Human Capital Formation"),
      spacer(40),
      metricBox("SROI Ratio", C.m11_sroi.sroi_ratio, "Social Return per $ Invested", PURPLE_ACCENT)
    );
  }

  if (C.m11_sroi?.training_hours) {
    sections.push(
      spacer(200),
      h2("12.2 Skills Training & Certification"),
      spacer(40),
      kpiTable([
        [lang === "pt-br" ? "Horas de Treinamento:" : "Training Hours:", C.m11_sroi.training_hours || "N/A"],
        [lang === "pt-br" ? "Certificações Obtidas:" : "Certifications Awarded:", C.m11_sroi.certifications || "N/A"]
      ])
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildM12() {
  const sections = [
    h1("13. " + L.m12Title),
    spacer(40),
    p(`The petitioner's cultural and cross-border contributions enrich the professional ecosystem through knowledge transfer, mentorship of emerging entrepreneurs, international collaboration facilitation, and bridge-building between U.S. and foreign markets.`)
  ];

  if (C.m12_cultural?.cultural_initiatives) {
    sections.push(
      spacer(200),
      h2("13.1 Cultural & Knowledge Transfer"),
      spacer(40),
      p(C.m12_cultural.cultural_initiatives)
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildM13() {
  const sections = [
    h1("14. " + L.m13Title),
    spacer(40),
    p(`The petitioner's endeavor has broader field implications, advancing professional practices, methodologies, standards, and societal welfare across the logistics, supply chain, and international trade sectors.`)
  ];

  if (C.m13_broader_field?.field_advancement) {
    sections.push(
      spacer(200),
      h2("14.1 Field-Level Advancement"),
      spacer(40),
      p(C.m13_broader_field.field_advancement)
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildMethodologicalNotes() {
  const sections = [
    new Paragraph({ children: [new PageBreak()] }),
    h1(lang === "pt-br" ? "15. " + L.methodNotes : "15. " + L.methodNotes),
    spacer(40),
    h2("15.1 IMPLAN® Economic Modeling"),
    spacer(40),
    p("IMPLAN (Impact Analysis for Planning) is an input-output (I-O) econometric model maintained by IMPLAN Group, LLC. It provides county-level, state-level, and national economic multipliers for 546 industries classified by NAICS codes."),
    spacer(100),
    h2("15.2 RIMS II Multipliers"),
    spacer(40),
    p("RIMS II (Regional Input-Output Modeling System) multipliers are provided by the U.S. Bureau of Economic Analysis (BEA). Type II multipliers include direct, indirect, and induced effects of economic activity."),
    spacer(100),
    h2("15.3 EPI Employment Multipliers"),
    spacer(40),
    p("The Economic Policy Institute (EPI) publishes employment multipliers reflecting the relationship between direct job creation and subsequent job generation through supply chain and consumer demand channels."),
    spacer(100),
    h2("15.4 Data Sources"),
    spacer(40),
    p("Primary data sources include: (1) U.S. Census Bureau (annual business surveys, payroll data), (2) Bureau of Economic Analysis (regional economic accounts), (3) Bureau of Labor Statistics (employment, wages, industry data), (4) NAICS industry classification system, (5) Company financial statements and operational data."),
    spacer(200),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: lang === "pt-br" ? "— Fim do Relatório —" : "— End of Report —", size: 20, color: LIGHT_TEXT, font: "Arial", italics: true })]
    })
  ];

  return sections;
}

// ════════════════════════════════════════════════════════════════════════════════
// DOCUMENT ASSEMBLY
// ════════════════════════════════════════════════════════════════════════════════

const allChildren = [
  ...buildCover(),
  ...buildTOC(),
  ...buildM1(),
  ...buildM2(),
  ...buildM3(),
  ...buildM4(),
  ...buildM5(),
  ...buildM6(),
  ...buildM7(),
  ...buildM8(),
  ...buildM9(),
  ...buildM10(),
  ...buildM11(),
  ...buildM12(),
  ...buildM13(),
  ...buildMethodologicalNotes()
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 21 } } },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: TEAL },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          },
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: "\u25E6",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } }
          }
        ]
      },
      {
        reference: "numbers",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      }
    ]
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
        }
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: lang === "pt-br"
                    ? `IMPACTO® Análise de Impacto Econômico — ${C.client.company_name}`
                    : `IMPACTO® Economic Impact Analysis — ${C.client.company_name}`,
                  size: 16,
                  color: LIGHT_TEXT,
                  font: "Arial",
                  italics: true
                })
              ],
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
              border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: TEAL, space: 4 } }
            })
          ]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: "CBD5E0", space: 4 } },
              children: [
                new TextRun({
                  text: `CONFIDENTIAL | ${C.meta.prepared_by || "Global Communication LLC"} | IMPACTO® Suite`,
                  size: 14,
                  color: LIGHT_TEXT,
                  font: "Arial"
                }),
                new TextRun({ text: "\tPage ", size: 14, color: LIGHT_TEXT, font: "Arial" }),
                new TextRun({ children: [PageNumber.CURRENT], size: 14, color: LIGHT_TEXT, font: "Arial" })
              ],
              tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
            })
          ]
        })
      },
      children: allChildren
    }
  ]
});

// ════════════════════════════════════════════════════════════════════════════════
// OUTPUT GENERATION
// ════════════════════════════════════════════════════════════════════════════════

const outputName = lang === "pt-br"
  ? `IMPACTO_${C.client.company_name.replace(/\s+/g, "_")}_Analise_Impacto_PT.docx`
  : `IMPACTO_${C.client.company_name.replace(/\s+/g, "_")}_Economic_Impact_Analysis.docx`;

const outputPath = process.argv[3] || `./${outputName}`;

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outputPath, buf);
  console.log(`✓ Generated: ${outputPath} (${(buf.length / 1024).toFixed(1)} KB)`);
  console.log(`  Language: ${lang === "pt-br" ? "Portuguese (BR)" : "English"}`);
  console.log(`  Client: ${C.client.company_name}`);
  console.log(`  Petitioner: ${C.client.petitioner_name}`);
}).catch(err => {
  console.error("Error generating document:", err);
  process.exit(1);
});
