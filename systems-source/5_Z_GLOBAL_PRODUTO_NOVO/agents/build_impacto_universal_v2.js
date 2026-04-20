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

function bulletP(text) {
  return new Paragraph({
    spacing: { after: 80, line: 276 },
    alignment: AlignmentType.JUSTIFIED,
    bullet: { level: 0 },
    children: [new TextRun({ text, size: 21, color: DARK_TEXT, font: "Arial" })]
  });
}

function captionP(text) {
  return new Paragraph({
    spacing: { after: 100, line: 260 },
    alignment: AlignmentType.LEFT,
    children: [new TextRun({ text, size: 18, color: LIGHT_TEXT, italics: true, font: "Arial" })]
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
      p(`Decomposing the headline output figure into its three constituent layers — direct, indirect, and induced — clarifies where the petitioner's economic value is realized along the regional value chain. Each layer is computed under RIMS II Type II multipliers anchored to NAICS ${C.client.industry_naics || "N/A"} for the ${C.location.msa_name} MSA.`),
      kpiTable([
        [lang === "pt-br" ? "Saída Direta:" : "Direct Output:", C.m1_economic_output?.direct_output || "N/A", NAVY],
        [lang === "pt-br" ? "Saída Indireta:" : "Indirect Output:", C.m1_economic_output?.indirect_output || "N/A", TEAL],
        [lang === "pt-br" ? "Saída Induzida:" : "Induced Output:", C.m1_economic_output?.induced_output || "N/A", DARK_TEAL]
      ])
    );
  }

  if (Array.isArray(C.client?.unique_expertise) && C.client.unique_expertise.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "2.3 Perfil de Expertise da Petição" : "2.3 Petitioner Expertise Profile"),
      spacer(40),
      p(`The petitioner's distinctive technical and managerial competencies anchor the projected economic effects. The capabilities enumerated below act as causal drivers of the multipliers reported in subsections 2.1 and 2.2 and are referenced throughout subsequent modules (M6 Innovation, M11 SROI, M12 Cultural).`),
      makeHeaderedTable(
        [lang === "pt-br" ? "#" : "#", lang === "pt-br" ? "Área de Expertise" : "Area of Expertise"],
        C.client.unique_expertise.map((e, i) => [[String(i + 1), String(e)]]),
        [800, 8560]
      )
    );
  }

  if (Array.isArray(C.client?.credentials) && C.client.credentials.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "2.4 Credenciais e Qualificações Verificáveis" : "2.4 Verifiable Credentials & Qualifications"),
      spacer(40),
      p(`Independent third-party credentials reinforce the reliability of projected impacts. Each credential below is verifiable through its issuing institution and is included in the supporting documentation appendix.`),
      makeHeaderedTable(
        [lang === "pt-br" ? "#" : "#", lang === "pt-br" ? "Credencial" : "Credential"],
        C.client.credentials.map((e, i) => [[String(i + 1), String(e)]]),
        [800, 8560]
      )
    );
  }

  if (Array.isArray(C.client?.languages) && C.client.languages.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "2.5 Capacidade Linguística Operacional" : "2.5 Operational Language Capability"),
      spacer(40),
      p(`The petitioner's working languages enable cross-border execution of the operations modeled in this analysis, particularly the trade-corridor effects detailed in Module M12.`),
      makeHeaderedTable(
        [lang === "pt-br" ? "Idioma" : "Language", lang === "pt-br" ? "Uso Operacional" : "Operational Use"],
        C.client.languages.map(e => [[String(e), lang === "pt-br" ? "Comunicação profissional" : "Professional communication"]]),
        [4680, 4680]
      )
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

  if (Array.isArray(C.m2_employment?.jobs_by_sector) && C.m2_employment.jobs_by_sector.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "3.2 Distribuição Setorial dos Empregos Gerados" : "3.2 Sector-Level Distribution of Generated Jobs"),
      spacer(40),
      p(`Aggregate employment metrics conceal critical structural information. The sector-level breakdown below identifies where the petitioner's operations create occupational density and how each segment contributes to the overall multiplier reported in subsection 3.1.`),
      makeHeaderedTable(
        [
          lang === "pt-br" ? "Setor" : "Sector",
          lang === "pt-br" ? "Empregos" : "Jobs",
          lang === "pt-br" ? "% do Total" : "% of Total"
        ],
        C.m2_employment.jobs_by_sector.map(s => [[String(s.sector || ""), String(s.jobs ?? "—"), String(s.pct || "—")]]),
        [5360, 2000, 2000]
      ),
      spacer(80),
      captionP(lang === "pt-br"
        ? "Fonte: Modelagem RIMS II Type II aplicada às operações declaradas pela petição."
        : "Source: RIMS II Type II modeling applied to operations declared in the petition.")
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

  if (Array.isArray(C.m3_earnings_income?.wage_categories) && C.m3_earnings_income.wage_categories.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "4.2 Pirâmide de Remuneração por Categoria Funcional" : "4.2 Compensation Pyramid by Functional Category"),
      spacer(40),
      p(`The compensation profile influences both the household-level induced effects modeled here and the tax revenue projections developed in Module M4. Each band below reflects the petitioner's actual compensation policy benchmarked against MSA wage surveys.`),
      makeHeaderedTable(
        [
          lang === "pt-br" ? "Categoria" : "Category",
          lang === "pt-br" ? "Salário Médio (USD)" : "Avg. Wage (USD)",
          lang === "pt-br" ? "Empregos" : "Jobs",
          lang === "pt-br" ? "Descrição" : "Description"
        ],
        C.m3_earnings_income.wage_categories.map(w => [[
          String(w.category || ""),
          typeof w.avg_wage === "number" ? `$${w.avg_wage.toLocaleString("en-US")}` : String(w.avg_wage || "—"),
          String(w.jobs ?? "—"),
          String(w.description || "")
        ]]),
        [2400, 2000, 1200, 3760]
      ),
      spacer(80),
      captionP(lang === "pt-br"
        ? "Salários médios são ponderados pelo número de posições; valores em USD nominais correntes."
        : "Average wages are weighted by headcount; values in nominal current USD.")
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

  if (Array.isArray(C.m4_tax_revenue?.tax_types) && C.m4_tax_revenue.tax_types.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "5.2 Categorias Tributárias Atingidas" : "5.2 Tax Categories Triggered"),
      spacer(40),
      p(`Beyond the consolidated federal/state/local figures, the petitioner's operations trigger collections across multiple statutory tax instruments. The list below catalogs each category captured in the projection.`),
      makeHeaderedTable(
        [
          lang === "pt-br" ? "#" : "#",
          lang === "pt-br" ? "Tipo de Tributo" : "Tax Type",
          lang === "pt-br" ? "Esfera Aplicável" : "Applicable Level"
        ],
        C.m4_tax_revenue.tax_types.map((t, i) => [[
          String(i + 1),
          String(t),
          lang === "pt-br" ? "Federal / Estadual / Local" : "Federal / State / Local"
        ]]),
        [800, 5560, 3000]
      )
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

  if (Array.isArray(C.m5_supply_chain?.vendor_categories) && C.m5_supply_chain.vendor_categories.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "6.2 Composição da Rede de Fornecedores" : "6.2 Vendor Network Composition"),
      spacer(40),
      p(`The vendor matrix below disaggregates the headline supplier count by category, count, and annualized spend. Each row represents a transmission channel through which the petitioner's spending propagates into the regional economy via Type II indirect effects.`),
      makeHeaderedTable(
        [
          lang === "pt-br" ? "Categoria" : "Category",
          lang === "pt-br" ? "Fornecedores" : "Vendors",
          lang === "pt-br" ? "Gasto Anual" : "Annual Spend",
          lang === "pt-br" ? "Descrição" : "Description"
        ],
        C.m5_supply_chain.vendor_categories.map(v => [[
          String(v.category || ""),
          String(v.count ?? "—"),
          String(v.spend || "—"),
          String(v.description || "")
        ]]),
        [2400, 1200, 1600, 4160]
      ),
      spacer(80),
      captionP(lang === "pt-br"
        ? "Gastos representam fluxo monetário direto para fornecedores; efeitos induzidos modelados no Módulo M1."
        : "Spend reflects direct monetary outflow to vendors; induced effects are modeled in Module M1.")
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

  if (Array.isArray(C.m6_innovation_technology?.innovations) && C.m6_innovation_technology.innovations.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "7.2 Catálogo de Inovações Implementadas" : "7.2 Catalog of Implemented Innovations"),
      spacer(40),
      p(`The innovations below operationalize the petitioner's R&D investment. Each entry pairs a discrete technical contribution with a measurable economic impact, supplying the causal mechanism behind the multipliers reported in Module M1.`),
      makeHeaderedTable(
        [
          lang === "pt-br" ? "Inovação" : "Innovation",
          lang === "pt-br" ? "Descrição" : "Description",
          lang === "pt-br" ? "Impacto Mensurável" : "Measurable Impact",
          lang === "pt-br" ? "Ano" : "Year"
        ],
        C.m6_innovation_technology.innovations.map(it => [[
          String(it.name || ""),
          String(it.description || ""),
          String(it.impact || ""),
          String(it.implementation_year || "—")
        ]]),
        [2200, 3000, 3160, 1000]
      )
    );
    C.m6_innovation_technology.innovations.forEach((it, i) => {
      sections.push(
        spacer(120),
        h3(`7.2.${i + 1} ${it.name || ""}`),
        p(String(it.description || "")),
        p(`${lang === "pt-br" ? "Impacto:" : "Impact:"} ${it.impact || ""}`)
      );
    });
  }

  if (Array.isArray(C.m6_innovation_technology?.trade_secret_descriptions) && C.m6_innovation_technology.trade_secret_descriptions.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "7.3 Segredos Comerciais Protegidos" : "7.3 Protected Trade Secrets"),
      spacer(40),
      p(`Each protected asset below represents proprietary know-how whose disclosure would erode the petitioner's competitive moat. Trade secrets are catalogued descriptively to preserve confidentiality.`),
      makeHeaderedTable(
        [lang === "pt-br" ? "#" : "#", lang === "pt-br" ? "Descrição do Ativo" : "Asset Description"],
        C.m6_innovation_technology.trade_secret_descriptions.map((t, i) => [[String(i + 1), String(t)]]),
        [800, 8560]
      )
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

  if (Array.isArray(C.m7_industry_comparison?.benchmarks) && C.m7_industry_comparison.benchmarks.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "8.2 Comparação Quantitativa com Pares Setoriais" : "8.2 Quantitative Comparison Against Sector Peers"),
      spacer(40),
      p(`The benchmarks below contrast the petitioner's operational performance with the industry baseline drawn from comparable firms in the same NAICS classification. Outperformance is highlighted where it materially affects the multipliers used elsewhere in this report.`),
      makeHeaderedTable(
        [
          lang === "pt-br" ? "Métrica" : "Metric",
          lang === "pt-br" ? "Petição" : "Petitioner",
          lang === "pt-br" ? "Benchmark Setorial" : "Industry Benchmark",
          lang === "pt-br" ? "Diferença" : "Delta"
        ],
        C.m7_industry_comparison.benchmarks.map(b => [[
          String(b.metric || ""),
          String(b.petitioner || b.value || "—"),
          String(b.industry_avg || b.benchmark || "—"),
          String(b.delta || b.outperforms || "—")
        ]]),
        [3000, 2120, 2120, 2120]
      )
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

  if (Array.isArray(C.m8_government_alignment?.executive_orders) && C.m8_government_alignment.executive_orders.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "9.2 Alinhamento com Ordens Executivas Federais" : "9.2 Alignment with Federal Executive Orders"),
      spacer(40),
      p(`The petitioner's operations directly intersect with the executive orders catalogued below. Each row maps a specific policy mandate to the operational dimension of the petition that satisfies it.`),
      makeHeaderedTable(
        [
          lang === "pt-br" ? "Ordem Executiva" : "Executive Order",
          lang === "pt-br" ? "Grau de Alinhamento" : "Alignment",
          lang === "pt-br" ? "Descrição da Ligação" : "Linkage Description"
        ],
        C.m8_government_alignment.executive_orders.map(eo => [[
          String(eo.name || ""),
          String(eo.alignment || "—"),
          String(eo.description || "")
        ]]),
        [3000, 1800, 4560]
      )
    );
  }

  if (Array.isArray(C.m8_government_alignment?.federal_priorities) && C.m8_government_alignment.federal_priorities.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "9.3 Prioridades Federais Endereçadas" : "9.3 Federal Priorities Addressed"),
      spacer(40),
      p(`The federal-level priorities below were drawn from publicly available agency strategic plans and policy directives. Each item below is materially advanced by the petitioner's operations.`),
      makeHeaderedTable(
        [lang === "pt-br" ? "#" : "#", lang === "pt-br" ? "Prioridade Federal" : "Federal Priority"],
        C.m8_government_alignment.federal_priorities.map((x, i) => [[String(i + 1), String(x)]]),
        [800, 8560]
      )
    );
  }

  if (Array.isArray(C.m8_government_alignment?.state_priorities) && C.m8_government_alignment.state_priorities.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "9.4 Prioridades Estaduais Endereçadas" : "9.4 State Priorities Addressed"),
      spacer(40),
      p(`At the state level, the petitioner's footprint advances each of the priorities catalogued below, as articulated in current state economic development planning documents.`),
      makeHeaderedTable(
        [lang === "pt-br" ? "#" : "#", lang === "pt-br" ? "Prioridade Estadual" : "State Priority"],
        C.m8_government_alignment.state_priorities.map((x, i) => [[String(i + 1), String(x)]]),
        [800, 8560]
      )
    );
  }

  if (Array.isArray(C.m8_government_alignment?.local_priorities) && C.m8_government_alignment.local_priorities.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "9.5 Prioridades Locais (MSA) Endereçadas" : "9.5 Local (MSA) Priorities Addressed"),
      spacer(40),
      p(`Local priorities reflect MSA-specific economic development objectives that are directly served by the petitioner's presence and operational footprint within the region.`),
      makeHeaderedTable(
        [lang === "pt-br" ? "#" : "#", lang === "pt-br" ? "Prioridade Local" : "Local Priority"],
        C.m8_government_alignment.local_priorities.map((x, i) => [[String(i + 1), String(x)]]),
        [800, 8560]
      )
    );
  }

  if (Array.isArray(C.m8_government_alignment?.sba_programs) && C.m8_government_alignment.sba_programs.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "9.6 Elegibilidade a Programas SBA Aplicáveis" : "9.6 Eligibility to Applicable SBA Programs"),
      spacer(40),
      p(`The Small Business Administration programs below are either currently leveraged by the petitioner or represent active eligibility pathways that reinforce the public-interest dimension of the petition.`),
      makeHeaderedTable(
        [lang === "pt-br" ? "#" : "#", lang === "pt-br" ? "Programa SBA" : "SBA Program"],
        C.m8_government_alignment.sba_programs.map((x, i) => [[String(i + 1), String(x)]]),
        [800, 8560]
      )
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
    p(lang === "pt-br"
      ? `O mapeamento de RFE demonstra alinhamento com as Solicitações de Evidência do Formulário I-140, abordando diretamente os critérios do USCIS para profissionais com grau avançado e elegibilidade ao National Interest Waiver sob 8 CFR § 204.5(k)(4)(ii).`
      : `RFE mapping demonstrates alignment with Form I-140 Requests for Evidence by directly addressing USCIS criteria for advanced degree professionals and national interest waiver eligibility under 8 CFR § 204.5(k)(4)(ii).`)
  ];

  if (C.m10_rfe_mapping?.criterion_1) {
    sections.push(
      spacer(200),
      h2("11.1 USCIS Criterion Alignment"),
      spacer(40),
      p(C.m10_rfe_mapping.criterion_1)
    );
  }

  if (Array.isArray(C.m10_rfe_mapping?.rfe_objections) && C.m10_rfe_mapping.rfe_objections.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "11.2 Mapeamento de Objeções Antecipadas e Refutações" : "11.2 Mapping of Anticipated Objections and Rebuttals"),
      spacer(40),
      p(`The matrix below pre-empts the most probable adjudicator concerns by pairing each anticipated objection with the modules that address it, the rebuttal summary, and the supporting evidence already documented in this report.`),
      makeHeaderedTable(
        [
          lang === "pt-br" ? "Objeção Antecipada" : "Anticipated Objection",
          lang === "pt-br" ? "Módulos" : "Modules",
          lang === "pt-br" ? "Resumo da Refutação" : "Rebuttal Summary",
          lang === "pt-br" ? "Evidência Chave" : "Key Evidence"
        ],
        C.m10_rfe_mapping.rfe_objections.map(o => [[
          String(o.objection || ""),
          Array.isArray(o.modules_addressed) ? o.modules_addressed.join(", ") : String(o.modules_addressed || "—"),
          String(o.rebuttal_summary || ""),
          String(o.key_evidence || "")
        ]]),
        [2600, 1200, 2780, 2780]
      )
    );
    C.m10_rfe_mapping.rfe_objections.forEach((o, i) => {
      sections.push(
        spacer(120),
        h3(`11.2.${i + 1} ${o.objection || ""}`),
        p(`${lang === "pt-br" ? "Refutação:" : "Rebuttal:"} ${o.rebuttal_summary || ""}`),
        p(`${lang === "pt-br" ? "Evidência referenciada:" : "Referenced evidence:"} ${o.key_evidence || ""}`)
      );
    });
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

  const certTypes = C.m11_sroi?.workforce_development?.certification_types;
  if (Array.isArray(certTypes) && certTypes.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "12.3 Tipologia das Certificações Profissionais" : "12.3 Typology of Professional Certifications"),
      spacer(40),
      p(`Each credential below represents a distinct human-capital investment whose monetized value is captured in the SROI ratio reported in subsection 12.1. Certification breadth is itself an indicator of workforce mobility and durable capability formation.`),
      makeHeaderedTable(
        [lang === "pt-br" ? "#" : "#", lang === "pt-br" ? "Tipo de Certificação" : "Certification Type"],
        certTypes.map((c, i) => [[String(i + 1), String(c)]]),
        [800, 8560]
      )
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

  const intlInnov = C.m12_cultural?.international_expertise?.innovations_from_origin;
  if (Array.isArray(intlInnov) && intlInnov.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "13.2 Inovações Importadas do Mercado de Origem" : "13.2 Innovations Imported from Origin Market"),
      spacer(40),
      p(`The petitioner channels operational practices proven in the origin market into U.S. application contexts. Each row below traces the provenance of an imported practice and the competitive advantage it confers domestically.`),
      makeHeaderedTable(
        [
          lang === "pt-br" ? "Prática de Origem" : "Origin Practice",
          lang === "pt-br" ? "Aplicação nos EUA" : "U.S. Application",
          lang === "pt-br" ? "Vantagem Competitiva" : "Competitive Advantage",
          lang === "pt-br" ? "Mecanismo de Transferência" : "Transfer Mechanism"
        ],
        intlInnov.map(it => [[
          String(it.origin_practice || ""),
          String(it.us_application || ""),
          String(it.competitive_advantage || ""),
          String(it.transfer_mechanism || "")
        ]]),
        [2340, 2340, 2340, 2340]
      )
    );
    intlInnov.forEach((it, i) => {
      sections.push(
        spacer(120),
        h3(`13.2.${i + 1} ${it.origin_practice || ""}`),
        p(String(it.us_application || "")),
        p(`${lang === "pt-br" ? "Vantagem:" : "Advantage:"} ${it.competitive_advantage || ""}`)
      );
    });
  }

  const langsServed = C.m12_cultural?.workforce_cultural_integration?.languages_served;
  if (Array.isArray(langsServed) && langsServed.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "13.3 Idiomas Atendidos pela Operação" : "13.3 Languages Served by the Operation"),
      spacer(40),
      p(`The bilingual / multilingual reach of the operation widens the addressable market and reduces communication-error rates documented elsewhere in this module. Each language below corresponds to an active client-service capability.`),
      makeHeaderedTable(
        [lang === "pt-br" ? "Idioma" : "Language", lang === "pt-br" ? "Status Operacional" : "Operational Status"],
        langsServed.map(l => [[String(l), lang === "pt-br" ? "Atendimento ativo" : "Active service"]]),
        [4680, 4680]
      )
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

  const fieldInnov = C.m13_broader_field?.innovation_diffusion?.innovations_impacting_field;
  if (Array.isArray(fieldInnov) && fieldInnov.length) {
    sections.push(
      spacer(200),
      h2(lang === "pt-br" ? "14.2 Difusão de Inovações no Campo Profissional" : "14.2 Innovation Diffusion Across the Professional Field"),
      spacer(40),
      p(`The diffusion matrix below documents how each of the petitioner's innovations propagates beyond the firm itself, with explicit adoption mechanisms and projected adopter counts over a five-year horizon.`),
      makeHeaderedTable(
        [
          lang === "pt-br" ? "Elemento de Inovação" : "Innovation Element",
          lang === "pt-br" ? "Impacto no Campo" : "Field Impact",
          lang === "pt-br" ? "Mecanismo de Adoção" : "Adoption Mechanism",
          lang === "pt-br" ? "Adotantes Projetados (5a)" : "Projected Adopters (5y)",
          lang === "pt-br" ? "Ganho de Eficiência" : "Efficiency Gain"
        ],
        fieldInnov.map(it => [[
          String(it.element || ""),
          String(it.field_impact || ""),
          String(it.adoption_mechanism || ""),
          String(it.estimated_adopters_5yr || "—"),
          String(it.field_wide_efficiency_gain || "—")
        ]]),
        [2200, 2200, 2200, 1380, 1380]
      )
    );
    fieldInnov.forEach((it, i) => {
      sections.push(
        spacer(120),
        h3(`14.2.${i + 1} ${it.element || ""}`),
        p(`${lang === "pt-br" ? "Impacto no campo:" : "Field impact:"} ${it.field_impact || ""}`),
        p(`${lang === "pt-br" ? "Mecanismo:" : "Mechanism:"} ${it.adoption_mechanism || ""}`)
      );
    });
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildDhanasarAppendix() {
  const dh = C.dhanasar_analysis;
  if (!dh) return [];
  const sections = [
    new Paragraph({ children: [new PageBreak()] }),
    h1(lang === "pt-br" ? "16. Análise Dhanasar — Síntese dos Três Prongs" : "16. Dhanasar Analysis — Three-Prong Synthesis"),
    spacer(40),
    p(lang === "pt-br"
      ? "A síntese abaixo consolida a evidência apresentada nos Módulos M1–M13 sob a estrutura de três prongs estabelecida em Matter of Dhanasar, 26 I&N Dec. 884 (AAO 2016). Cada bloco abaixo cataloga as evidências chave a serem cruzadas com a documentação anexada."
      : "The synthesis below consolidates the evidence presented in Modules M1–M13 under the three-prong framework established in Matter of Dhanasar, 26 I&N Dec. 884 (AAO 2016). Each block below catalogs the key evidence to be cross-referenced with the attached documentation.")
  ];
  const prongs = [
    {
      key: "prong1_substantial_merit_and_national_importance",
      title_pt: "16.1 Prong 1 — Mérito Substancial e Importância Nacional",
      title_en: "16.1 Prong 1 — Substantial Merit and National Importance",
      intro_pt: "Este prong avalia se o empreendimento proposto possui mérito substancial e relevância em escala nacional. As evidências catalogadas abaixo demonstram a extensão geográfica e setorial do impacto.",
      intro_en: "This prong evaluates whether the proposed endeavor has substantial merit and national-scale relevance. The evidence catalogued below demonstrates the geographic and sectoral reach of the impact."
    },
    {
      key: "prong2_well_positioned_lead_field",
      title_pt: "16.2 Prong 2 — Posicionamento para Liderar o Empreendimento",
      title_en: "16.2 Prong 2 — Well Positioned to Advance the Endeavor",
      intro_pt: "Este prong avalia a capacidade da petição em conduzir o empreendimento. As evidências abaixo articulam credenciais, histórico e capacidade operacional.",
      intro_en: "This prong assesses the petitioner's capacity to lead the endeavor. The evidence below articulates credentials, track record, and operational capability."
    },
    {
      key: "prong3_beneficial_to_waive_employment_offer",
      title_pt: "16.3 Prong 3 — Benefício de Dispensar a Oferta de Emprego",
      title_en: "16.3 Prong 3 — Beneficial to Waive the Job-Offer Requirement",
      intro_pt: "Este prong avalia se, no balanço dos fatores, é benéfico aos Estados Unidos dispensar a exigência tradicional de oferta de emprego e certificação laboral.",
      intro_en: "This prong evaluates whether, on balance, it is beneficial to the United States to waive the traditional job-offer and labor-certification requirement."
    }
  ];
  prongs.forEach(pr => {
    const ev = dh[pr.key]?.key_evidence;
    if (!Array.isArray(ev) || !ev.length) return;
    sections.push(
      spacer(160),
      h2(lang === "pt-br" ? pr.title_pt : pr.title_en),
      spacer(40),
      p(lang === "pt-br" ? pr.intro_pt : pr.intro_en),
      makeHeaderedTable(
        [lang === "pt-br" ? "#" : "#", lang === "pt-br" ? "Evidência Chave" : "Key Evidence"],
        ev.map((e, i) => [[String(i + 1), String(e)]]),
        [800, 8560]
      )
    );
    ev.forEach((e, i) => {
      sections.push(bulletP(`${i + 1}. ${e}`));
    });
  });
  sections.push(new Paragraph({ children: [new PageBreak()] }));
  return sections;
}

function buildValidationChecklist() {
  const items = C.notes_and_instructions?.validation_checklist;
  if (!Array.isArray(items) || !items.length) return [];
  return [
    h2(lang === "pt-br" ? "15.5 Checklist de Validação Interna" : "15.5 Internal Validation Checklist"),
    spacer(40),
    p(lang === "pt-br"
      ? "Cada item abaixo foi verificado contra os dados-fonte antes da emissão deste relatório."
      : "Each item below was verified against source data prior to issuance of this report."),
    makeHeaderedTable(
      [lang === "pt-br" ? "#" : "#", lang === "pt-br" ? "Item de Validação" : "Validation Item"],
      items.map((it, i) => [[String(i + 1), String(it)]]),
      [800, 8560]
    ),
    ...items.map((it, i) => bulletP(`${i + 1}. ${it}`))
  ];
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
    spacer(160),
    ...buildValidationChecklist(),
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
  ...buildMethodologicalNotes(),
  ...buildDhanasarAppendix()
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
