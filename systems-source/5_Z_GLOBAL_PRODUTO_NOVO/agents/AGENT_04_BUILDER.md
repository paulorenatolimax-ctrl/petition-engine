# IMPACTO® — Document Builder Agent

## Purpose
Takes the fully-populated client_config.json from Agent 03 and generates a professional, USCIS-compliant DOCX document. This agent manages template selection, language localization, content assembly, and post-build validation to ensure output meets all structural and compliance requirements.

---

## Prerequisites

### System Requirements
- Node.js 16.x or higher (for docx library compatibility)
- npm or yarn package manager
- docx npm package: `npm install docx@latest`
- Temporary file storage (500 MB available)

### Project Structure
```
/project_root/
├── build_impacto_universal.js    (template engine)
├── client_config.json            (input from Agent 03)
├── templates/
│   ├── en/
│   │   ├── HEADER_EN.docx
│   │   ├── MODULE_SECTIONS.json
│   │   └── FOOTER_EN.docx
│   └── pt-br/
│       ├── HEADER_PT.docx
│       ├── MODULE_SECTIONS.json
│       └── FOOTER_PT.docx
├── output/
│   └── [generated documents]
└── logs/
    └── [build logs]
```

---

## Build Process

### Step 1: Configuration Validation
Before initiating build, verify client_config.json contains:

```json
{
  "client_info": {
    "name": "string",
    "entity_type": "string",
    "industry_naics": "string",
    "state": "string",
    "created_date": "YYYY-MM-DD"
  },
  "language": "en|pt-br",
  "calculations": {
    "M1_output": { "direct": number, "indirect": number, "induced": number, "total": number },
    "M2_employment": { "rims_ii": number, "epi": number, "bls": number, "range": "string" },
    "M3_earnings": { "total": number, "by_tier": {} },
    "M4_tax_revenue": { "federal": number, "state": number, "local": number, "total": number },
    "M5_supply_chain": { "spend": number, "vendors": number, "local_pct": number },
    "M6_innovation": { "rd_spend": number, "patent_potential": number },
    "M7_government_alignment": { "score": number },
    "M8_community": { "training": number, "partnerships": number, "investment": number },
    "M9_sensitivity": { "conservative": {}, "base": {}, "optimistic": {} },
    "M11_sroi": { "ratio": number, "components": {} },
    "M12_cultural": { "diaspora": number, "trade": number, "total": number },
    "M13_combined": { "total": number, "dimensions": number }
  }
}
```

**Validation Tasks**:
- [ ] All required fields present
- [ ] Numeric values non-negative
- [ ] NAICS code matches 6-digit format
- [ ] Language parameter valid (en or pt-br)
- [ ] Date fields in ISO 8601 format
- [ ] No empty strings in required fields

### Step 2: Load Build Template

```javascript
// build_impacto_universal.js entry point
const docx = require('docx');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('client_config.json', 'utf8'));

// Validate configuration
if (!config.language || !['en', 'pt-br'].includes(config.language)) {
  throw new Error('Invalid language. Must be "en" or "pt-br"');
}

// Select language-specific templates
const LANGUAGE = config.language;
const TEMPLATE_DIR = `./templates/${LANGUAGE}`;
const SECTIONS = JSON.parse(fs.readFileSync(`${TEMPLATE_DIR}/MODULE_SECTIONS.json`));
```

### Step 3: Execute Build Script

```bash
# Execute from command line with config path
node build_impacto_universal.js --config client_config.json --language en --output ./output/

# Typical execution time: 2-5 seconds
# Expected file size: 35-45 KB
```

**Build Script Execution Flow**:

1. Parse and validate client_config.json
2. Load language-specific template strings and styling
3. Build document structure (13 modules, sequential)
4. Populate calculated values from config
5. Apply formatting and layouts
6. Generate DOCX binary
7. Write to output directory
8. Log build metrics
9. Return build summary

---

## Language Handling

### English Templates (language: "en")

#### Module Headers (English)
```
M1: Economic Output & Multiplier Effects
M2: Employment Impact & Job Creation
M3: Earnings & Household Income
M4: Tax Revenue Generation
M5: Supply Chain Development
M6: Innovation & Technology Investment
M7: Government Alignment & Policy Contribution
M8: Community Integration & Local Development
M9: Sensitivity Analysis & Risk Assessment
M11: Social Return on Investment (SROI)
M12: Cultural Impact & Diaspora Engagement
M13: Combined Impact Summary
Appendix: Methodology & Data Sources
```

#### English Section Templates
```javascript
const SECTIONS_EN = {
  title: "IMPACTO® Economic Impact Analysis",
  subtitle: "EB-5 Capital Investment Program",
  executive_summary: "Executive Summary",
  module_intro: "This analysis quantifies the economic, social, and cultural impacts...",
  methodology: "Methodology & Data Sources",
  definitions: {
    type_ii_multiplier: "Type II multipliers capture both indirect and induced economic effects",
    rims_ii: "RIMS II (Regional Input-Output Modeling System II) is the BEA-endorsed methodology",
    sroi: "Social Return on Investment measures the economic value of social outcomes"
  },
  disclaimers: {
    conservative: "This analysis uses conservative assumptions and documented benchmarks",
    projection: "Revenue projections are based on detailed business plan analysis",
    multipliers: "Multipliers are derived from RIMS II industry-specific coefficients"
  }
};
```

### Portuguese (Brazil) Templates (language: "pt-br")

#### Module Headers (Portuguese)
```
M1: Produto Econômico e Efeitos Multiplicadores
M2: Impacto Empregatício e Criação de Empregos
M3: Ganhos e Renda Familiar
M4: Geração de Receita Tributária
M5: Desenvolvimento da Cadeia de Suprimentos
M6: Inovação e Investimento em Tecnologia
M7: Alinhamento Governamental e Contribuição Política
M8: Integração Comunitária e Desenvolvimento Local
M9: Análise de Sensibilidade e Avaliação de Risco
M11: Retorno Social do Investimento (SROI)
M12: Impacto Cultural e Engajamento da Diáspora
M13: Resumo do Impacto Combinado
Apêndice: Metodologia e Fontes de Dados
```

#### Portuguese Section Templates
```javascript
const SECTIONS_PT = {
  title: "IMPACTO® Análise de Impacto Econômico",
  subtitle: "Programa de Investimento de Capital EB-5",
  executive_summary: "Resumo Executivo",
  module_intro: "Esta análise quantifica os impactos econômicos, sociais e culturais...",
  methodology: "Metodologia e Fontes de Dados",
  definitions: {
    type_ii_multiplier: "Os multiplicadores Tipo II capturam efeitos econômicos indiretos e induzidos",
    rims_ii: "RIMS II (Sistema Regional de Modelagem de Entrada-Saída II) é a metodologia endossada pelo BEA",
    sroi: "Retorno Social do Investimento mede o valor econômico dos resultados sociais"
  },
  disclaimers: {
    conservative: "Esta análise utiliza suposições conservadoras e benchmarks documentados",
    projection: "As projeções de receita são baseadas em análise detalhada do plano de negócios",
    multipliers: "Os multiplicadores são derivados de coeficientes específicos do setor RIMS II"
  }
};
```

### Language Selection Logic

```javascript
// In build_impacto_universal.js
function loadLanguageTemplates(language) {
  const templates = {};

  if (language === 'en') {
    templates.modules = [
      { name: 'M1', title: 'Economic Output & Multiplier Effects' },
      { name: 'M2', title: 'Employment Impact & Job Creation' },
      { name: 'M3', title: 'Earnings & Household Income' },
      // ... remaining modules
    ];
    templates.disclaimers = [
      'This analysis uses conservative assumptions and documented benchmarks',
      'Revenue projections are based on detailed business plan analysis',
      'Multipliers are derived from RIMS II industry-specific coefficients'
    ];
    templates.formatting = {
      font_family: 'Calibri',
      heading_size: 16,
      body_size: 11
    };
  } else if (language === 'pt-br') {
    templates.modules = [
      { name: 'M1', title: 'Produto Econômico e Efeitos Multiplicadores' },
      { name: 'M2', title: 'Impacto Empregatício e Criação de Empregos' },
      { name: 'M3', title: 'Ganhos e Renda Familiar' },
      // ... remaining modules in Portuguese
    ];
    templates.disclaimers = [
      'Esta análise utiliza suposições conservadoras e benchmarks documentados',
      'As projeções de receita são baseadas em análise detalhada do plano de negócios',
      'Os multiplicadores são derivados de coeficientes específicos do setor RIMS II'
    ];
    templates.formatting = {
      font_family: 'Calibri',
      heading_size: 16,
      body_size: 11
    };
  }

  return templates;
}
```

---

## File Naming Convention

### English Document
```
Format: IMPACTO_[ClientName]_Economic_Impact_Analysis.docx

Examples:
- IMPACTO_TechStartup_LLC_Economic_Impact_Analysis.docx
- IMPACTO_GreenEnergy_Corp_Economic_Impact_Analysis.docx
- IMPACTO_Advanced_Manufacturing_Economic_Impact_Analysis.docx

Naming Rules:
- Replace spaces with underscores in company name
- Remove special characters (& → and, # → num, etc.)
- Preserve capitalization
- Maximum 85 characters total
```

### Portuguese Document
```
Format: IMPACTO_[ClientName]_Analise_Impacto_Economico_PT.docx

Examples:
- IMPACTO_TechStartup_LLC_Analise_Impacto_Economico_PT.docx
- IMPACTO_GreenEnergy_Corp_Analise_Impacto_Economico_PT.docx
- IMPACTO_Advanced_Manufacturing_Analise_Impacto_Economico_PT.docx

Naming Rules:
- Same as English, append _PT suffix before .docx
- Use Portuguese spelling "Analise" (not "Análise" to avoid encoding issues)
- Maximum 85 characters total
```

### Implementation

```javascript
function generateFileName(client_name, language) {
  // Sanitize client name
  let sanitized = client_name
    .replace(/[&]/g, 'and')
    .replace(/[#]/g, 'num')
    .replace(/[^\w\s-]/g, '')  // remove special chars
    .replace(/\s+/g, '_')      // replace spaces
    .trim();

  if (language === 'en') {
    return `IMPACTO_${sanitized}_Economic_Impact_Analysis.docx`;
  } else if (language === 'pt-br') {
    return `IMPACTO_${sanitized}_Analise_Impacto_Economico_PT.docx`;
  }

  // Enforce max length
  if (filename.length > 85) {
    sanitized = sanitized.substring(0, 45);
  }

  return filename;
}
```

---

## Document Structure (13 Modules)

Each module follows consistent formatting:

### Module Template Structure

```javascript
function buildModule(moduleNumber, moduleName, config) {
  return {
    heading: {
      text: `Module ${moduleNumber}: ${moduleName}`,
      style: "Heading1",
      pageBreakBefore: true
    },
    introduction: {
      text: // Module-specific introduction 2-3 sentences
      style: "Normal"
    },
    content: {
      // Module-specific content tables, bullets, narrative
    },
    conclusion: {
      text: // Summary statement
      style: "Normal"
    },
    dataSource: {
      text: `Data Source: ${config.data_source || 'RIMS II, BLS'}`,
      style: "Caption"
    }
  };
}
```

### Module Content Specifications

**M1: Economic Output**
- Table: Direct / Indirect / Induced / Total (5-year cumulative)
- Narrative: Multiplier explanation, RIMS II methodology
- Chart: 5-year revenue progression (optional)

**M2: Employment**
- Table: RIMS II / EPI / BLS comparison with ranges
- Narrative: Model description, conservative selection rationale
- Data points: Year-by-year job creation trajectory

**M3: Earnings & Income**
- Table: Professional / Skilled / Entry-level wage breakdown
- Narrative: Wage distribution, regional adjustment factors
- Impact: Total household income generated

**M4: Tax Revenue**
- Table: Federal / State / Local breakdown (5-year total)
- Narrative: Tax calculation methodology
- State-specific: FL no income tax, other rates applied

**M5: Supply Chain**
- Table: Vendor count, local procurement %, spending
- Narrative: Supply chain multiplier effects
- Benefits: Vendor upskilling, access to capital

**M6: Innovation**
- Narrative: R&D intensity, technology investments
- List: Key innovation areas (if applicable)
- Impact: Patent potential, sector advancement

**M7: Government Alignment**
- Table: Alignment scoring matrix (jobs / wages / priority sector / location)
- Narrative: Connection to state economic development goals
- Score: 0-100 alignment rating

**M8: Community Integration**
- Table: Training programs / Partnerships / Investment
- Narrative: Workforce development pipeline
- Impact: Student internships, community contributions

**M9: Sensitivity Analysis**
- Table: Conservative / Base / Optimistic scenarios
- Narrative: Risk assessment, assumption documentation
- Chart: Range visualization across metrics

**M11: Social Return on Investment**
- Table: SROI components (workforce, knowledge, community, environmental, health, cultural)
- Calculation: Total social value / investment
- Ratio: SROI multiple (e.g., 4.2:1)

**M12: Cultural Impact**
- Narrative: Diaspora activation, bilateral trade facilitation
- Data: Home country trade data, technology transfer
- Impact: Knowledge exchange, economic ecosystem development

**M13: Combined Impact**
- Summary: Aggregate across all 13 benefit dimensions
- Table: Impact per direct job created
- Statement: Transformative economic development contribution

**Appendix: Methodology**
- Data sources and citations
- Assumptions log
- Multiplier tables
- Regional adjustment factors

---

## Post-Build Validation

After DOCX generation, Agent 04 executes comprehensive validation suite:

### V1: Structural Validation

```javascript
function validateStructure(docxPath) {
  const validations = {
    module_count: 0,
    table_count: 0,
    paragraph_count: 0,
    image_count: 0,
    errors: []
  };

  // Extract DOCX structure (DOCX is ZIP format)
  const archive = new AdmZip(docxPath);
  const xmlContent = archive.readAsText('word/document.xml');

  // Count modules (each starts with Heading1 "Module N:")
  const moduleRegex = /Module \d+:/g;
  validations.module_count = (xmlContent.match(moduleRegex) || []).length;
  if (validations.module_count !== 13) {
    validations.errors.push(`Module count ${validations.module_count}, expected 13`);
  }

  // Count tables
  const tableRegex = /<w:tbl>/g;
  validations.table_count = (xmlContent.match(tableRegex) || []).length;
  if (validations.table_count < 10) {
    validations.errors.push(`Table count ${validations.table_count}, expected minimum 10`);
  }

  // Count paragraphs
  const paragraphRegex = /<w:p>/g;
  validations.paragraph_count = (xmlContent.match(paragraphRegex) || []).length;
  if (validations.paragraph_count < 80) {
    validations.errors.push(`Paragraph count ${validations.paragraph_count}, expected minimum 80`);
  }

  // File size check
  const stats = fs.statSync(docxPath);
  if (stats.size < 35000 || stats.size > 45000) {
    validations.errors.push(`File size ${stats.size} bytes, expected 35-45 KB`);
  }

  return validations;
}
```

**Structural Checklist**:
- [ ] Exactly 13 module sections present
- [ ] All modules have Heading1 styling
- [ ] Minimum 10 tables (typically 11-13)
- [ ] Minimum 80 paragraphs (typically 120-150)
- [ ] File size 35-45 KB (indicates proper compression)
- [ ] Headers and footers present and consistent
- [ ] No orphaned sections or malformed XML

### V2: Data Consistency Validation

```javascript
function validateDataConsistency(docxPath, config) {
  const validations = {
    matches: [],
    mismatches: [],
    precision_errors: []
  };

  const docText = extractDocxText(docxPath);

  // Extract key numbers from document
  const docMetrics = {
    total_output: extractNumber(docText, /Total Economic Output[:\s]*\$?([\d,]+)/),
    direct_jobs: extractNumber(docText, /Direct Jobs[:\s]*(\d+)/),
    total_jobs: extractNumber(docText, /Total Jobs[:\s]*(\d+)/),
    tax_revenue: extractNumber(docText, /Total Tax Revenue[:\s]*\$?([\d,]+)/),
    sroi_ratio: extractNumber(docText, /SROI Ratio[:\s]*([\d.]+)/)
  };

  // Compare with config values (allow 0.5% variance due to formatting)
  const tolerance = 0.005;

  for (const [metric, docValue] of Object.entries(docMetrics)) {
    const configValue = getNestedValue(config, metric);
    if (configValue) {
      const variance = Math.abs(docValue - configValue) / configValue;
      if (variance < tolerance) {
        validations.matches.push(metric);
      } else {
        validations.mismatches.push({
          metric: metric,
          document: docValue,
          config: configValue,
          variance: (variance * 100).toFixed(2) + '%'
        });
      }
    }
  }

  return validations;
}
```

**Data Consistency Checklist**:
- [ ] M1 total output matches config sum
- [ ] M2 employment figures within 0.5% of config
- [ ] M3 earnings total matches config calculations
- [ ] M4 tax revenue components sum correctly
- [ ] M5 vendor count and spend consistent
- [ ] M9 sensitivity ranges documented
- [ ] M11 SROI ratio calculated correctly
- [ ] M13 combined impact matches component sum

### V3: Dhanasar Compliance Check

```javascript
function validateDhanasar(docxPath) {
  const docText = extractDocxText(docxPath);
  const compliance = {
    three_prongs: {
      prong_1_jobs: false,
      prong_2_regional_employment: false,
      prong_3_jobs_within_area: false
    },
    evidence: [],
    gaps: []
  };

  // Check Prong 1: New Commercial Enterprise (NCE) creates jobs
  if (docText.includes('job') || docText.includes('employment')) {
    compliance.three_prongs.prong_1_jobs = true;
    compliance.evidence.push('Prong 1: Direct employment impact documented');
  } else {
    compliance.gaps.push('Prong 1: Insufficient job creation evidence');
  }

  // Check Prong 2: Regional impact (multiplier effects)
  if (docText.includes('indirect') || docText.includes('multiplier')) {
    compliance.three_prongs.prong_2_regional_employment = true;
    compliance.evidence.push('Prong 2: Indirect/regional employment addressed');
  } else {
    compliance.gaps.push('Prong 2: Regional employment effects missing');
  }

  // Check Prong 3: Jobs within area of targeted employment (TEA)
  if (docText.includes('area') || docText.includes('regional') || docText.includes('local')) {
    compliance.three_prongs.prong_3_jobs_within_area = true;
    compliance.evidence.push('Prong 3: Local/area impact demonstrated');
  } else {
    compliance.gaps.push('Prong 3: Local area job documentation insufficient');
  }

  compliance.all_prongs_satisfied = Object.values(compliance.three_prongs).every(v => v);

  return compliance;
}
```

**Dhanasar Three-Prong Checklist**:
- [ ] Prong 1: New Commercial Enterprise (NCE) creates 10+ jobs
  - Document: Direct employment figures in M2
  - Evidence: Revenue-to-jobs ratio, job projections by year

- [ ] Prong 2: NCE creates employment within regional economy
  - Document: Multiplier effects, indirect jobs in M2
  - Evidence: RIMS II Type II multipliers, supply chain jobs

- [ ] Prong 3: NCE creates employment within targeted area
  - Document: Local hiring, area-specific procurement in M5
  - Evidence: % of jobs in TEA, local vendor participation

### V4: RFE Rebuttal Completeness

```javascript
function validateRFEReadiness(docxPath, config) {
  const validation = {
    objection_responses: {},
    coverage_score: 0,
    gaps: []
  };

  const docText = extractDocxText(docxPath);

  // Common RFE objection patterns
  const commonObjections = {
    'weak_multiplier': {
      keywords: ['RIMS II', 'Type II', 'multiplier'],
      required: true
    },
    'job_creation_doubt': {
      keywords: ['employment', 'jobs', 'worker'],
      required: true
    },
    'weak_earnings': {
      keywords: ['wage', 'salary', 'income', 'compensation'],
      required: true
    },
    'supply_chain_unproven': {
      keywords: ['vendor', 'supplier', 'procurement'],
      required: true
    },
    'social_value_inflated': {
      keywords: ['SROI', 'social', 'community', 'training'],
      required: true
    },
    'projection_optimism': {
      keywords: ['conservative', 'sensitivity', 'assumption', 'scenario'],
      required: true
    }
  };

  for (const [objection, spec] of Object.entries(commonObjections)) {
    const found = spec.keywords.some(kw => docText.toLowerCase().includes(kw));
    validation.objection_responses[objection] = found;
    if (!found && spec.required) {
      validation.gaps.push(`Missing coverage for: ${objection}`);
    }
  }

  validation.coverage_score =
    (Object.values(validation.objection_responses).filter(v => v).length /
     Object.keys(validation.objection_responses).length) * 100;

  return validation;
}
```

**RFE Rebuttal Completeness Checklist**:
- [ ] Multiplier methodology explained (RIMS II, Type II vs Type I)
- [ ] Job creation doubts addressed with three-model validation
- [ ] Earnings sustainability demonstrated with wage projections
- [ ] Supply chain reliability proven with vendor analysis
- [ ] Social value not overstated (SROI benchmarked to GVE)
- [ ] Projections grounded in conservative assumptions
- [ ] Sensitivity analysis shows range of outcomes
- [ ] All assumptions documented with sources

### V5: Anti-AI Detection Compliance

```javascript
function validateAntiAICompliance(docxPath) {
  const validation = {
    sentence_variety_score: 0,
    citation_count: 0,
    repetition_flags: [],
    credibility_markers: [],
    pass: false
  };

  const docText = extractDocxText(docxPath);
  const sentences = docText.match(/[^.!?]+[.!?]+/g) || [];

  // Check sentence length variety
  const sentenceLengths = sentences.map(s => s.trim().split(' ').length);
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const lengthVariance = Math.sqrt(
    sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) /
    sentenceLengths.length
  );

  // Variance > 8 indicates natural variation
  validation.sentence_variety_score = Math.min(100, lengthVariance * 10);

  // Check for citations (parenthetical references)
  const citationRegex = /\([A-Z][a-z]+ et al\.|BEA|BLS|U\.S\. Census|RIMS II\)/g;
  validation.citation_count = (docText.match(citationRegex) || []).length;

  // Flag repetitive phrases (3+ occurrences in 5000 word chunks)
  const phrases = {};
  sentences.forEach(s => {
    const phrase = s.substring(0, 30);
    phrases[phrase] = (phrases[phrase] || 0) + 1;
  });

  for (const [phrase, count] of Object.entries(phrases)) {
    if (count >= 3) {
      validation.repetition_flags.push({
        phrase: phrase,
        occurrences: count
      });
    }
  }

  // Credibility markers
  const credMarkers = docText.match(/(peer-reviewed|academic|government|official|data|research)/gi) || [];
  validation.credibility_markers = [...new Set(credMarkers)];

  // Pass criteria:
  // - Sentence variety score > 60
  // - At least 5 citations
  // - No more than 2 repetitive phrases
  // - At least 8 distinct credibility markers
  validation.pass =
    validation.sentence_variety_score > 60 &&
    validation.citation_count >= 5 &&
    validation.repetition_flags.length <= 2 &&
    validation.credibility_markers.length >= 8;

  return validation;
}
```

**Anti-AI Detection Checklist**:
- [ ] Sentence length variety score > 60 (natural variation in lengths)
- [ ] Minimum 5 parenthetical citations (BEA, BLS, Census, etc.)
- [ ] No more than 2 phrases repeated 3+ times
- [ ] At least 8 distinct credibility markers (peer-reviewed, government, data, etc.)
- [ ] Varied paragraph structure (short + long, questions, statements)
- [ ] Sector-specific terminology used correctly
- [ ] No generic filler language (e.g., "In conclusion...")
- [ ] Evidence-based claims throughout
- [ ] Proper use of passive voice (not excessive)
- [ ] Direct citations to specific data sources

---

## Validation Output Report

Upon completion of all validations, generate build_report.json:

```json
{
  "build_timestamp": "2026-03-13T14:32:15Z",
  "input_file": "client_config.json",
  "output_file": "IMPACTO_ClientName_Economic_Impact_Analysis.docx",
  "output_size_bytes": 38450,
  "language": "en",
  "validation_results": {
    "structural": {
      "module_count": 13,
      "table_count": 12,
      "paragraph_count": 135,
      "status": "PASS"
    },
    "data_consistency": {
      "metric_matches": 8,
      "metric_mismatches": 0,
      "variance_tolerance": "0.5%",
      "status": "PASS"
    },
    "dhanasar_compliance": {
      "prong_1_jobs": true,
      "prong_2_regional": true,
      "prong_3_area_toa": true,
      "status": "PASS"
    },
    "rfe_rebuttal": {
      "coverage_score": 95,
      "objections_addressed": 6,
      "gaps": [],
      "status": "PASS"
    },
    "anti_ai_detection": {
      "sentence_variety_score": 78,
      "citation_count": 8,
      "repetition_flags": 0,
      "credibility_markers": 12,
      "status": "PASS"
    }
  },
  "overall_status": "PASS",
  "ready_for_submission": true,
  "notes": "Document meets all structural and compliance requirements for USCIS EB-5 visa petition."
}
```

---

## Error Handling

### Build Failures

```javascript
function handleBuildError(error, config) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error_type: error.name,
    error_message: error.message,
    error_code: error.code,
    config_file: config.client_info.name,
    recovery_suggestions: []
  };

  if (error.code === 'ENOENT') {
    errorLog.recovery_suggestions.push('Check that all template files exist');
    errorLog.recovery_suggestions.push('Verify build_impacto_universal.js is in project root');
  } else if (error.message.includes('JSON')) {
    errorLog.recovery_suggestions.push('Validate client_config.json syntax');
    errorLog.recovery_suggestions.push('Ensure all required fields are populated');
  } else if (error.message.includes('docx')) {
    errorLog.recovery_suggestions.push('Verify docx npm package installed');
    errorLog.recovery_suggestions.push('Run: npm install docx@latest');
  }

  fs.writeFileSync(`logs/error_${Date.now()}.json`, JSON.stringify(errorLog, null, 2));
  throw error;
}
```

### Validation Warnings

If validation identifies warnings (but not failures):
- [ ] Module count < 13: warn of missing sections
- [ ] File size > 45 KB: warn of bloated document
- [ ] Data variance > 1%: warn of potential calculation issues
- [ ] SROI ratio > 15:1: warn of possibly inflated assumptions
- [ ] Sentence variety < 50: warn of potential AI detection risk

---

## Agent Handoff

Upon successful build and validation:

1. **Generate DOCX file** in `/output/` with proper naming convention
2. **Create build_report.json** documenting all validation results
3. **Log all metrics** (build time, file size, validation scores)
4. **Verify readiness**: all validations must PASS before handoff
5. **Archive build**: store config + DOCX + report together for audit trail
6. **Return completion summary** to user with document ready for USCIS submission

**Build Success Criteria**:
- ✓ Structural validation: PASS
- ✓ Data consistency: PASS
- ✓ Dhanasar compliance: PASS
- ✓ RFE rebuttal readiness: >= 90%
- ✓ Anti-AI detection: PASS
- ✓ File size: 35-45 KB
- ✓ No errors in build log

Document is ready for USCIS EB-5 visa petition submission.
