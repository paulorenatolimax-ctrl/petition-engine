# AGENT_05_QA.md — IMPACTO® Quality Assurance & Compliance Validation

## Purpose
Performs final comprehensive quality assurance on the generated DOCX document before USCIS submission. This agent validates structural integrity, data consistency across all modules, Dhanasar compliance, RFE rebuttal completeness, and anti-AI detection measures to ensure the document meets all legal and technical standards.

---

## QA Protocol Overview

Quality assurance follows a four-stage validation process:

1. **Structural Validation** — Document integrity and completeness
2. **Data Consistency** — Cross-reference verification across modules
3. **Legal Compliance** — Dhanasar three-prong satisfaction
4. **Evidentiary Quality** — RFE rebuttal readiness + anti-AI detection

Each stage produces a pass/fail determination. Document advancement requires **ALL stages to PASS**.

---

## Stage 1: Structural Validation

### 1.1 Module Count Verification

**Requirement**: Exactly 13 modules, in sequential order

```
MODULE CHECKLIST:
[ ] Module 1: Economic Output & Multiplier Effects
[ ] Module 2: Employment Impact & Job Creation
[ ] Module 3: Earnings & Household Income
[ ] Module 4: Tax Revenue Generation
[ ] Module 5: Supply Chain Development
[ ] Module 6: Innovation & Technology Investment
[ ] Module 7: Government Alignment & Policy Contribution
[ ] Module 8: Community Integration & Local Development
[ ] Module 9: Sensitivity Analysis & Risk Assessment
[ ] Module 11: Social Return on Investment (SROI)
[ ] Module 12: Cultural Impact & Diaspora Engagement
[ ] Module 13: Combined Impact Summary
[ ] Appendix: Methodology & Data Sources
```

**Validation Method**:
```javascript
function validateModuleCount(docxPath) {
  const docText = extractDocxText(docxPath);
  const modulePattern = /Module (\d+):\s*([^.\n]+)/g;
  const foundModules = [];
  let match;

  while ((match = modulePattern.exec(docText)) !== null) {
    foundModules.push({
      number: parseInt(match[1]),
      title: match[2].trim()
    });
  }

  const expectedSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13];
  const foundSequence = foundModules.map(m => m.number);

  if (JSON.stringify(foundSequence) === JSON.stringify(expectedSequence)) {
    return { status: 'PASS', modules_found: foundModules };
  } else {
    return {
      status: 'FAIL',
      expected: expectedSequence,
      found: foundSequence,
      missing: expectedSequence.filter(n => !foundSequence.includes(n))
    };
  }
}
```

**Pass Criteria**:
- ✓ All 13 modules present
- ✓ No duplicate module numbers
- ✓ Modules in correct sequence (1, 2, 3...9, 11, 12, 13)
- ✓ Each module has distinct Heading1 style

**Failure Resolution**:
- Missing modules: rebuild document from config
- Out-of-sequence: verify build_impacto_universal.js module ordering
- Duplicate modules: check client_config.json for corruption

---

### 1.2 Table Count Verification

**Requirement**: Minimum 11 tables (typically 12-14)

| Module | Required Tables | Purpose |
|--------|-----------------|---------|
| M1 | 1 | Direct / Indirect / Induced / Total breakdown |
| M2 | 1 | RIMS II / EPI / BLS comparison |
| M3 | 1 | Wage tier breakdown (Professional / Skilled / Entry) |
| M4 | 1 | Federal / State / Local tax revenue |
| M5 | 1 | Vendor count / Procurement / Local % |
| M6 | 0-1 | R&D investments (optional) |
| M7 | 1 | Alignment scoring matrix |
| M8 | 1 | Training / Partnerships / Investment |
| M9 | 1 | Conservative / Base / Optimistic scenarios |
| M11 | 1 | SROI components (6-part breakdown) |
| M12 | 0-1 | Diaspora / Trade data (optional) |
| M13 | 1 | Combined impact summary |
| Appendix | 2-3 | Methodology tables (multipliers, wage data, tax rates) |

**Validation Method**:
```javascript
function validateTableCount(docxPath) {
  const archive = new AdmZip(docxPath);
  const xmlContent = archive.readAsText('word/document.xml');

  // Count table XML elements
  const tableRegex = /<w:tbl>/g;
  const tableMatches = xmlContent.match(tableRegex) || [];
  const tableCount = tableMatches.length;

  const minimumTables = 11;
  const maximumTables = 16;

  if (tableCount >= minimumTables && tableCount <= maximumTables) {
    return { status: 'PASS', table_count: tableCount };
  } else if (tableCount < minimumTables) {
    return {
      status: 'FAIL',
      table_count: tableCount,
      expected_minimum: minimumTables,
      issue: 'Missing critical data tables'
    };
  } else {
    return {
      status: 'WARNING',
      table_count: tableCount,
      expected_maximum: maximumTables,
      issue: 'Possibly redundant or excessive tables'
    };
  }
}
```

**Pass Criteria**:
- ✓ Minimum 11 tables present
- ✓ Maximum 16 tables (allows for supplemental appendix tables)
- ✓ All primary modules (M1-M5, M7-M9, M11-M13) have tables
- ✓ Tables properly formatted with borders and headers

**Failure Resolution**:
- < 11 tables: verify config has all required data populated
- > 16 tables: remove duplicate or redundant tables from build template
- Missing module table: check module content in build_impacto_universal.js

---

### 1.3 Paragraph Count Verification

**Requirement**: Minimum 85 paragraphs (typical 120-160)

**Expected Distribution**:
- Executive Summary: 3-5 paragraphs
- 12 Content Modules (M1-M9, M11-M13): 8-12 paragraphs each = 96-144 paragraphs
- Appendix: 8-15 paragraphs
- **Total: 115-160 paragraphs**

**Validation Method**:
```javascript
function validateParagraphCount(docxPath) {
  const archive = new AdmZip(docxPath);
  const xmlContent = archive.readAsText('word/document.xml');

  // Count paragraph XML elements (not table cells)
  const paragraphRegex = /<w:p>/g;
  const totalParagraphs = (xmlContent.match(paragraphRegex) || []).length;

  // Estimate non-table paragraphs (rough heuristic)
  const tableRegex = /<w:tbl>[\s\S]*?<\/w:tbl>/g;
  const tableCells = (xmlContent.match(/<w:tc>/g) || []).length;
  const estimatedContentParagraphs = totalParagraphs - (tableCells * 0.15);

  if (estimatedContentParagraphs >= 85) {
    return {
      status: 'PASS',
      total_paragraphs: totalParagraphs,
      estimated_content_paragraphs: Math.round(estimatedContentParagraphs)
    };
  } else {
    return {
      status: 'FAIL',
      total_paragraphs: totalParagraphs,
      estimated_content_paragraphs: Math.round(estimatedContentParagraphs),
      expected_minimum: 85,
      issue: 'Insufficient narrative content'
    };
  }
}
```

**Pass Criteria**:
- ✓ Minimum 85 paragraphs (content only, excluding table cells)
- ✓ Typical range 120-160 paragraphs
- ✓ Paragraphs distributed evenly across modules
- ✓ No module with fewer than 5 paragraphs

**Failure Resolution**:
- < 85 paragraphs: add narrative explanation to sparse modules
- Uneven distribution: rebalance content across modules in template
- Sparse module: ensure methodology explanation in that section

---

### 1.4 File Size & Encoding

**Requirement**: 35-45 KB (indicates proper DOCX compression)

```javascript
function validateFileSize(docxPath) {
  const stats = fs.statSync(docxPath);
  const sizeKB = stats.size / 1024;

  const minSize = 35;
  const maxSize = 45;

  if (sizeKB >= minSize && sizeKB <= maxSize) {
    return {
      status: 'PASS',
      size_kb: sizeKB.toFixed(2),
      size_bytes: stats.size
    };
  } else if (sizeKB < minSize) {
    return {
      status: 'FAIL',
      size_kb: sizeKB.toFixed(2),
      issue: 'File too small - possible missing content'
    };
  } else {
    return {
      status: 'WARNING',
      size_kb: sizeKB.toFixed(2),
      issue: 'File larger than typical - verify no embedded images/media'
    };
  }
}
```

**Pass Criteria**:
- ✓ File size 35-45 KB
- ✓ No uncompressed images or media
- ✓ UTF-8 encoding without BOM
- ✓ Valid DOCX structure (ZIP archive with proper manifest)

**Failure Resolution**:
- < 35 KB: verify all modules present, rebuild if necessary
- > 45 KB: check for embedded images, remove if not essential
- Invalid DOCX: verify build_impacto_universal.js uses docx library correctly

---

## Stage 2: Data Consistency Validation

### 2.1 Cross-Module Number Verification

**Objective**: Ensure all numeric values referenced across modules are consistent

**Cross-Module Dependencies**:

```
M1 (Total Economic Output) → Referenced in M13 (Combined Impact)
├─ Direct Output
├─ Indirect Output
├─ Induced Output
└─ Total Output (drives multiplier calculations)

M2 (Employment) → Referenced in M3, M4, M5, M8
├─ Direct Jobs (Year 5)
├─ Total Jobs (all models)
├─ Employment Range (RIMS II / EPI / BLS)
└─ Used to calculate: wages, tax revenue, supply chain impact

M3 (Earnings) → Referenced in M4, M11
├─ Total Labor Income
├─ Professional Wages
├─ Skilled Wages
└─ Entry-level Wages
└─ Used for: tax calculations, SROI workforce component

M4 (Tax Revenue) → Referenced in M13 (Combined Impact)
├─ Federal Tax
├─ State Tax
├─ Local Tax
└─ Used for: impact summary, policy contribution scoring

M5 (Supply Chain) → Referenced in M13
├─ Vendor Count
├─ Local Procurement %
├─ Total Supply Chain Spend
└─ Used for: combined impact, community value calculation

M9 (Sensitivity) → All three scenarios validated independently
├─ Conservative values (70% of base)
├─ Base values (match M1-M5 calculations)
└─ Optimistic values (130% of base)

M11 (SROI) → Referenced in M13 (Combined Impact)
├─ 6 Components (workforce, knowledge, community, environmental, health, cultural)
├─ Total Social Value
├─ Total Investment
└─ SROI Ratio (should be 3:1 to 15:1)

M13 (Combined Impact) → Aggregates all previous modules
├─ Total Economic Impact = M1 + M4 + M5
├─ Total Social Impact = M11 components
├─ Combined Total = Economic + Social + Cultural
└─ Impact dimensions = number of distinct benefit categories
```

**Validation Method**:

```javascript
function validateDataConsistency(docxPath, config) {
  const docText = extractDocxText(docxPath);
  const docMetrics = extractMetricsFromDocument(docText);
  const configMetrics = config.calculations;

  const consistency = {
    verified_links: [],
    broken_links: [],
    precision_mismatches: [],
    calculation_errors: []
  };

  // Link 1: M1 Total Output
  const m1_total_doc = docMetrics.m1_total_output;
  const m1_total_config = configMetrics.M1_output.total;
  if (withinTolerance(m1_total_doc, m1_total_config, 0.005)) {
    consistency.verified_links.push('M1: Total Output consistent');
  } else {
    consistency.broken_links.push({
      link: 'M1 → Config',
      document: m1_total_doc,
      config: m1_total_config,
      variance: percentVariance(m1_total_doc, m1_total_config)
    });
  }

  // Link 2: M2 Employment (conservative model)
  const m2_jobs_doc = docMetrics.m2_conservative_jobs;
  const m2_jobs_config = configMetrics.M2_employment.rims_ii;
  if (withinTolerance(m2_jobs_doc, m2_jobs_config, 0.005)) {
    consistency.verified_links.push('M2: Employment figures consistent');
  } else {
    consistency.broken_links.push({
      link: 'M2 → Config',
      document: m2_jobs_doc,
      config: m2_jobs_config,
      variance: percentVariance(m2_jobs_doc, m2_jobs_config)
    });
  }

  // Link 3: M3 Earnings (total income)
  const m3_income_doc = docMetrics.m3_total_income;
  const m3_income_config = configMetrics.M3_earnings.total;
  if (withinTolerance(m3_income_doc, m3_income_config, 0.005)) {
    consistency.verified_links.push('M3: Earnings total consistent');
  } else {
    consistency.broken_links.push({
      link: 'M3 → Config',
      document: m3_income_doc,
      config: m3_income_config,
      variance: percentVariance(m3_income_doc, m3_income_config)
    });
  }

  // Link 4: M4 Tax Revenue (total)
  const m4_tax_doc = docMetrics.m4_total_tax;
  const m4_tax_config = configMetrics.M4_tax_revenue.total;
  if (withinTolerance(m4_tax_doc, m4_tax_config, 0.005)) {
    consistency.verified_links.push('M4: Tax revenue consistent');
  } else {
    consistency.broken_links.push({
      link: 'M4 → Config',
      document: m4_tax_doc,
      config: m4_tax_config,
      variance: percentVariance(m4_tax_doc, m4_tax_config)
    });
  }

  // Link 5: M9 Sensitivity (base case)
  const m9_base_doc = docMetrics.m9_base_case;
  const m9_base_config = configMetrics.M9_sensitivity.base;
  if (withinTolerance(m9_base_doc, m9_base_config, 0.005)) {
    consistency.verified_links.push('M9: Base case scenario consistent');
  } else {
    consistency.broken_links.push({
      link: 'M9 → Config',
      document: m9_base_doc,
      config: m9_base_config,
      variance: percentVariance(m9_base_doc, m9_base_config)
    });
  }

  // Link 6: M11 SROI Ratio
  const m11_sroi_doc = docMetrics.m11_sroi_ratio;
  const m11_sroi_config = configMetrics.M11_sroi.ratio;
  if (withinTolerance(m11_sroi_doc, m11_sroi_config, 0.01)) { // 1% tolerance for ratios
    consistency.verified_links.push('M11: SROI ratio consistent');
  } else {
    consistency.broken_links.push({
      link: 'M11 → Config',
      document: m11_sroi_doc,
      config: m11_sroi_config,
      variance: percentVariance(m11_sroi_doc, m11_sroi_config)
    });
  }

  // Link 7: M13 Combined Impact
  const m13_combined_doc = docMetrics.m13_combined_impact;
  const expectedM13 = configMetrics.M1_output.total +
                      configMetrics.M4_tax_revenue.total +
                      configMetrics.M11_sroi.components.total_social_value;
  if (withinTolerance(m13_combined_doc, expectedM13, 0.01)) {
    consistency.verified_links.push('M13: Combined impact matches aggregate');
  } else {
    consistency.calculation_errors.push({
      module: 'M13',
      issue: 'Combined impact calculation does not sum component values',
      documented: m13_combined_doc,
      expected: expectedM13,
      error: Math.abs(m13_combined_doc - expectedM13)
    });
  }

  // Internal consistency check: M9 sensitivity ranges
  const conservative = configMetrics.M9_sensitivity.conservative;
  const base = configMetrics.M9_sensitivity.base;
  const optimistic = configMetrics.M9_sensitivity.optimistic;

  if (conservative <= base && base <= optimistic) {
    consistency.verified_links.push('M9: Sensitivity scenarios in correct order');
  } else {
    consistency.precision_mismatches.push({
      module: 'M9',
      issue: 'Sensitivity scenarios not properly ordered',
      conservative: conservative,
      base: base,
      optimistic: optimistic
    });
  }

  consistency.status = consistency.broken_links.length === 0 ? 'PASS' : 'FAIL';
  return consistency;
}

function withinTolerance(actual, expected, tolerance = 0.005) {
  if (expected === 0) return actual === 0;
  return Math.abs((actual - expected) / expected) <= tolerance;
}

function percentVariance(actual, expected) {
  if (expected === 0) return actual === 0 ? '0%' : 'undefined%';
  return ((Math.abs(actual - expected) / expected) * 100).toFixed(2) + '%';
}
```

**Pass Criteria**:
- ✓ All cross-module links within 0.5% variance (allows for rounding)
- ✓ M9 sensitivity scenarios in correct order (conservative ≤ base ≤ optimistic)
- ✓ M13 combined impact = sum of major components (within 1% variance)
- ✓ No circular dependencies (SROI components independent of economic output)

**Failure Resolution**:
- Broken links: identify source of discrepancy (config vs. document)
- Calculation errors: rebuild specific module calculations
- Ordering issues: correct sensitivity scenario values in config
- M13 mismatch: verify aggregation formula in build template

---

### 2.2 Calculation Verification

**Spot-check calculations in key modules**:

```javascript
function verifyKeyCalculations(config) {
  const calcs = {
    verified: [],
    errors: []
  };

  // Verify M1: Multiplier calculation
  const m1_direct = config.calculations.M1_output.direct;
  const m1_indirect = config.calculations.M1_output.indirect;
  const m1_induced = config.calculations.M1_output.induced;
  const m1_total = config.calculations.M1_output.total;

  const calculated_total = m1_direct + m1_indirect + m1_induced;
  if (Math.abs(m1_total - calculated_total) < 1000) { // Allow $1K rounding error
    calcs.verified.push('M1: Direct + Indirect + Induced = Total');
  } else {
    calcs.errors.push({
      module: 'M1',
      error: 'Total output does not equal sum of components',
      documented_total: m1_total,
      calculated_total: calculated_total,
      difference: m1_total - calculated_total
    });
  }

  // Verify M4: Tax component sum
  const m4_federal = config.calculations.M4_tax_revenue.federal;
  const m4_state = config.calculations.M4_tax_revenue.state;
  const m4_local = config.calculations.M4_tax_revenue.local;
  const m4_total = config.calculations.M4_tax_revenue.total;

  const calculated_tax = m4_federal + m4_state + m4_local;
  if (Math.abs(m4_total - calculated_tax) < 1000) {
    calcs.verified.push('M4: Federal + State + Local = Total Tax');
  } else {
    calcs.errors.push({
      module: 'M4',
      error: 'Total tax revenue does not equal component sum',
      documented_total: m4_total,
      calculated_total: calculated_tax,
      difference: m4_total - calculated_tax
    });
  }

  // Verify M11: SROI ratio
  const sroi_total_social = config.calculations.M11_sroi.components.total_social_value;
  const sroi_total_investment = config.calculations.M11_sroi.components.total_investment;
  const sroi_ratio = config.calculations.M11_sroi.ratio;

  const calculated_ratio = sroi_total_social / sroi_total_investment;
  if (Math.abs(sroi_ratio - calculated_ratio) / calculated_ratio < 0.01) {
    calcs.verified.push('M11: SROI Ratio = Social Value / Investment');
  } else {
    calcs.errors.push({
      module: 'M11',
      error: 'SROI ratio calculation incorrect',
      documented_ratio: sroi_ratio,
      calculated_ratio: calculated_ratio.toFixed(2),
      difference: Math.abs(sroi_ratio - calculated_ratio)
    });
  }

  return calcs;
}
```

**Verification Checklist**:
- [ ] M1: direct + indirect + induced = total (within $1,000)
- [ ] M2: RIMS II ≤ EPI ≤ BLS or appropriate ordering
- [ ] M3: wage tiers sum to total employment
- [ ] M4: federal + state + local = total tax
- [ ] M5: vendor calculations internally consistent
- [ ] M9: conservative (70%) ≤ base (100%) ≤ optimistic (130%)
- [ ] M11: SROI ratio = total social value / total investment
- [ ] M13: combined impact ≥ max individual component

---

## Stage 3: Dhanasar Compliance Validation

**Legal Standard**: Matter of Dhanasar, 28 I&N Dec. 820 (AAO 2023)

The Dhanasar framework requires EB-5 petitioners to demonstrate job creation through three evidentiary prongs:

### 3.1 Prong 1: NCE Creates 10+ Jobs (Direct Employment)

**Requirement**: The New Commercial Enterprise (business) itself creates minimum 10 full-time positions

**Document Evidence**:
- M2 (Employment Impact): Direct job creation figures
- Direct jobs Year 5 ≥ 10
- Full-time equivalent (FTE) status documented
- Job descriptions and anticipated wages

**Validation Method**:

```javascript
function validateProng1(docxPath, config) {
  const docText = extractDocxText(docxPath);
  const direct_jobs = config.calculations.M2_employment.direct_jobs_year5;

  const prong1 = {
    requirement: 'NCE creates minimum 10 full-time jobs',
    direct_jobs: direct_jobs,
    pass: direct_jobs >= 10,
    evidence: []
  };

  // Look for job creation references
  if (docText.includes('direct employment') || docText.includes('direct job')) {
    prong1.evidence.push('Direct employment language present');
  }

  if (docText.includes('full-time') || docText.includes('FTE')) {
    prong1.evidence.push('Full-time status documented');
  }

  if (docText.match(/\b(10|11|12|15|20|25|30|40|50)\s+(jobs|positions|employees)/i)) {
    prong1.evidence.push('Specific job count provided');
  }

  if (!prong1.pass) {
    prong1.failure_reason = `Direct job count (${direct_jobs}) below minimum threshold of 10`;
  }

  return prong1;
}
```

**Pass Criteria**:
- ✓ Direct jobs ≥ 10 in Year 5 projection
- ✓ Full-time status explicitly stated
- ✓ Job descriptions tied to business operations
- ✓ Wage estimates provided for each role
- ✓ Regional wage validation (should meet or exceed area median)

**Evidence Locations**:
- M2: Direct employment table and narrative
- M3: Wage projections by job tier
- M4: Tax withholding assumes W-2 employment
- Business plan: detailed job descriptions and hiring timeline

---

### 3.2 Prong 2: Create Employment Within Targeted Area (TEA) Regional Economy

**Requirement**: Direct job creation must generate secondary (indirect) employment in the regional economy through supply chain, induced consumption, and other economic effects

**Document Evidence**:
- M2: Indirect employment figures (use RIMS II Type II multiplier)
- M5: Supply chain impact and vendor jobs
- Regional economic interconnections documented

**Validation Method**:

```javascript
function validateProng2(docxPath, config) {
  const docText = extractDocxText(docxPath);
  const indirect_jobs = config.calculations.M2_employment.indirect_jobs;
  const rims_ii_multiplier = config.calculations.M1_output.type_ii_output;

  const prong2 = {
    requirement: 'Direct employment generates indirect regional employment',
    direct_jobs: config.calculations.M2_employment.direct_jobs_year5,
    indirect_jobs: indirect_jobs,
    multiplier_effect: rims_ii_multiplier,
    pass: indirect_jobs > 0 && rims_ii_multiplier > 1.0,
    evidence: []
  };

  // Look for multiplier effect references
  if (docText.match(/multiplier|indirect|Type II|RIMS II/i)) {
    prong2.evidence.push('Multiplier effects documented');
  }

  // Look for supply chain references
  if (docText.match(/supply chain|vendor|supplier|procurement/i)) {
    prong2.evidence.push('Supply chain impact addressed');
  }

  // Look for induced employment references
  if (docText.match(/induced|household spending|consumer spending/i)) {
    prong2.evidence.push('Induced employment effects explained');
  }

  // Validate multiplier reasonableness
  if (rims_ii_multiplier >= 1.35 && rims_ii_multiplier <= 2.25) {
    prong2.evidence.push('Multiplier within reasonable range for sector');
  } else if (rims_ii_multiplier < 1.35) {
    prong2.warnings = ['Multiplier may be lower than typical for sector'];
  } else if (rims_ii_multiplier > 2.25) {
    prong2.warnings = ['Multiplier may be optimistic, verify sector classification'];
  }

  if (!prong2.pass) {
    prong2.failure_reason = 'No multiplier effects or indirect employment documented';
  }

  return prong2;
}
```

**Pass Criteria**:
- ✓ Indirect jobs > 0 (demonstrating multiplier effect)
- ✓ RIMS II Type II multiplier between 1.35 and 2.25
- ✓ Supply chain impact quantified (M5)
- ✓ Vendor count and local procurement % documented
- ✓ Indirect job range established using RIMS II, EPI, or BLS models

**Evidence Locations**:
- M1: Economic output breakdown (direct / indirect / induced)
- M2: RIMS II employment multiplier and resulting indirect jobs
- M5: Supply chain vendor development and jobs
- Appendix: RIMS II multiplier tables by sector

---

### 3.3 Prong 3: Create Employment Within Targeted Employment Area (TEA)

**Requirement**: Employment must be created within the specific geographic area of the EB-5 TEA (either targeted rural area, high unemployment, or underutilized area)

**Document Evidence**:
- TEA designation documented (rural / high unemployment / underutilized)
- Business location in designated area
- Local hiring preference or commitment
- Regional wage and employment context

**Validation Method**:

```javascript
function validateProng3(docxPath, config) {
  const docText = extractDocxText(docxPath);
  const businessState = config.client_info.state;
  const businessLocation = config.client_info.city || config.client_info.county;

  const prong3 = {
    requirement: 'Employment created within designated Targeted Employment Area',
    business_state: businessState,
    business_location: businessLocation,
    toa_qualified: config.location_toa_qualified || false,
    pass: false,
    evidence: []
  };

  // Look for TEA references
  if (docText.match(/targeted employment area|TEA|rural|high unemployment|underutilized/i)) {
    prong3.evidence.push('TEA designation referenced');
  }

  // Look for location specificity
  if (docText.includes(businessState) || docText.includes(businessLocation)) {
    prong3.evidence.push(`Business location (${businessLocation}, ${businessState}) documented`);
  }

  // Look for local hiring or area commitment
  if (docText.match(/local hiring|area residents|regional employment|community employment/i)) {
    prong3.evidence.push('Commitment to local hiring demonstrated');
  }

  // Look for area-specific economic context
  if (docText.match(/regional median wage|area unemployment|local labor market/i)) {
    prong3.evidence.push('Regional economic context provided');
  }

  // Validate TEA qualification
  if (config.location_toa_qualified) {
    prong3.pass = true;
    prong3.evidence.push('Location qualifies as designated TEA');
  } else {
    prong3.warnings = [
      'Business location may not qualify as TEA',
      'Verify with USCIS I-526 instructions for current TEA list'
    ];
  }

  if (!prong3.pass) {
    prong3.failure_reason = 'TEA qualification not established or not adequately documented';
  }

  return prong3;
}
```

**Pass Criteria**:
- ✓ TEA qualification explicitly stated (rural, high unemployment, or underutilized)
- ✓ Business location within designated area
- ✓ Regional economic data provided (median wage, unemployment rate)
- ✓ Local hiring preference or commitment documented
- ✓ All job creation figures tied to specific area

**Evidence Locations**:
- Client info: Business address and state
- M7: Government alignment (local priority factors)
- M8: Community integration and local hiring
- Appendix: TEA designation and criteria documentation

---

### 3.4 Dhanasar Compliance Summary

```javascript
function validateDhanaaarCompliance(docxPath, config) {
  const prong1 = validateProng1(docxPath, config);
  const prong2 = validateProng2(docxPath, config);
  const prong3 = validateProng3(docxPath, config);

  const compliance = {
    all_prongs_satisfied: prong1.pass && prong2.pass && prong3.pass,
    prong_1: prong1,
    prong_2: prong2,
    prong_3: prong3,
    status: 'PASS'
  };

  if (!compliance.all_prongs_satisfied) {
    compliance.status = 'FAIL';
    compliance.failing_prongs = [];
    if (!prong1.pass) compliance.failing_prongs.push('Prong 1');
    if (!prong2.pass) compliance.failing_prongs.push('Prong 2');
    if (!prong3.pass) compliance.failing_prongs.push('Prong 3');
    compliance.remediation_required = true;
  }

  return compliance;
}
```

**Overall Compliance Checklist**:
- [ ] Prong 1: Direct job creation ≥ 10
- [ ] Prong 2: Indirect regional employment demonstrated with multipliers
- [ ] Prong 3: Employment within designated TEA
- [ ] All three prongs clearly addressed with supporting evidence
- [ ] No contradictory statements across modules
- [ ] Conservative assumptions used throughout

---

## Stage 4: RFE Rebuttal Readiness & Anti-AI Detection

### 4.1 Common RFE Objections Mapping

**USCIS commonly raises RFE objections on EB-5 economic impact claims**. Each objection must have documented rebuttal evidence in the IMPACTO® document.

| RFE Objection | Module Coverage | Rebuttal Strategy |
|---|---|---|
| "Multiplier effect too aggressive" | M1, M2, Appendix | RIMS II methodology, Type II validation |
| "Job creation figures overstated" | M2, M9 | Three-model validation (RIMS II/EPI/BLS), sensitivity analysis |
| "Wage projections unrealistic" | M3, Appendix | Regional BLS data, industry benchmarks, conservative assumptions |
| "Supply chain unproven" | M5, M8 | Vendor count, local procurement %, business relationships |
| "Social value inflated" | M11, Appendix | Global Value Exchange benchmarks, conservative valuation |
| "Projections assume perfect execution" | M9 | Sensitivity analysis (conservative/base/optimistic), risk factors |
| "No proof of local hiring commitment" | M5, M8, M7 | Local procurement preference, community partnerships, regional alignment |
| "Financial sustainability unclear" | M3, M4, Appendix | Wage sustainability, tax revenue reinvestment, business fundamentals |

**RFE Coverage Validation**:

```javascript
function validateRFECoverage(docxPath) {
  const docText = extractDocxText(docxPath);

  const rfe_defenses = {
    multiplier_defense: {
      keywords: ['RIMS II', 'Type II', 'BEA', 'multiplier', 'indirect', 'induced'],
      found: false,
      content_length: 0
    },
    job_creation_defense: {
      keywords: ['RIMS II', 'EPI', 'BLS', 'employment model', 'validation', 'range'],
      found: false,
      content_length: 0
    },
    wage_defense: {
      keywords: ['BLS', 'regional wage', 'conservative', 'wage tier', 'median income'],
      found: false,
      content_length: 0
    },
    supply_chain_defense: {
      keywords: ['vendor', 'supplier', 'procurement', 'local', 'business relationship'],
      found: false,
      content_length: 0
    },
    social_value_defense: {
      keywords: ['SROI', 'Global Value Exchange', 'GVE', 'social return', 'conservative'],
      found: false,
      content_length: 0
    },
    projection_defense: {
      keywords: ['sensitivity', 'conservative', 'base case', 'optimistic', 'scenario'],
      found: false,
      content_length: 0
    }
  };

  // Check for each defense
  for (const [defense, spec] of Object.entries(rfe_defenses)) {
    const matches = spec.keywords.filter(kw =>
      docText.toLowerCase().includes(kw.toLowerCase())
    );

    if (matches.length >= 3) {  // At least 3 keywords found
      rfe_defenses[defense].found = true;

      // Estimate content length (rough heuristic)
      const regex = new RegExp(
        `(${spec.keywords.join('|')}).{0,300}`,
        'gi'
      );
      const contentMatches = docText.match(regex) || [];
      rfe_defenses[defense].content_length =
        contentMatches.reduce((sum, m) => sum + m.length, 0);
    }
  }

  // Count adequately addressed defenses (found and sufficient content)
  const adequateDefenses = Object.values(rfe_defenses).filter(d =>
    d.found && d.content_length > 500  // At least 500 chars of substantive content
  ).length;

  return {
    rfe_defenses: rfe_defenses,
    coverage_score: (adequateDefenses / Object.keys(rfe_defenses).length) * 100,
    status: adequateDefenses >= 5 ? 'PASS' : 'WARNING'
  };
}
```

**Pass Criteria**:
- ✓ All 6 common RFE objections have documented rebuttal
- ✓ Each rebuttal backed by specific methodology or data source
- ✓ Coverage extends across minimum 2-3 related modules
- ✓ Conservative assumptions documented throughout
- ✓ Data sources cited (BEA, BLS, Census, academic)

---

### 4.2 Anti-AI Detection Compliance

**Objective**: Ensure document does not appear to be AI-generated (would harm credibility with USCIS)

#### Indicator 1: Sentence Variation

AI-generated text typically uses similar sentence structures and patterns. Natural writing has varied:
- Sentence lengths (10-50+ words)
- Opening patterns (diverse subjects)
- Punctuation use (varied use of semicolons, em-dashes, parentheses)

```javascript
function analyzeSentenceVariation(docxPath) {
  const docText = extractDocxText(docxPath);
  const sentences = docText.match(/[^.!?]+[.!?]+/g) || [];

  // Analyze sentence length distribution
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = Math.sqrt(
    sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) /
    sentenceLengths.length
  );

  // Analyze opening word patterns
  const openingWords = sentences.map(s => s.trim().split(/\s+/)[0].toLowerCase());
  const uniqueOpenings = new Set(openingWords).size;
  const openingDiversity = uniqueOpenings / sentences.length;

  // Analyze punctuation use
  const semicolonCount = (docText.match(/;/g) || []).length;
  const dashCount = (docText.match(/—|–/g) || []).length;
  const parenCount = (docText.match(/\(/g) || []).length;
  const totalPunctuation = semicolonCount + dashCount + parenCount;

  return {
    sentence_count: sentences.length,
    average_length: avgLength.toFixed(1),
    length_variance: variance.toFixed(2),  // Higher = more varied
    variance_score: Math.min(100, variance * 12),  // Scale to 0-100
    opening_word_diversity: (openingDiversity * 100).toFixed(1) + '%',
    punctuation_variety: totalPunctuation,
    quality_score: {
      length_variance: variance > 8 ? 'PASS' : 'WARNING',
      opening_diversity: openingDiversity > 0.40 ? 'PASS' : 'WARNING',
      punctuation_variety: totalPunctuation > 50 ? 'PASS' : 'WARNING'
    }
  };
}
```

**Pass Criteria**:
- ✓ Sentence length variance ≥ 8 (indicates natural variation)
- ✓ Opening word diversity ≥ 40% (varied sentence starts)
- ✓ Punctuation variety > 50 total marks (semicolons, dashes, parentheses)
- ✓ No discernible repetitive patterns within 3-sentence windows

#### Indicator 2: Citation & Attribution

AI-generated content often lacks proper citations. Natural academic/professional writing has:
- Parenthetical references (Author Year) or footnotes
- Specific data source attribution
- Proper methodology credits

```javascript
function analyzeCitations(docxPath) {
  const docText = extractDocxText(docxPath);

  // Count various citation patterns
  const parentheticalCitations = (
    docText.match(/\([A-Z][a-z]+ (?:et al\.?)? ?\d{4}\)/g) || []
  ).length;

  const institutionalCitations = (
    docText.match(
      /\((?:BEA|BLS|Census|RIMS II|EPI|GVE|Global Value Exchange)\)/g
    ) || []
  ).length;

  const dataSourceAttribution = (
    docText.match(/Source:|Data Source:|According to|From/gi) || []
  ).length;

  const totalCitations = parentheticalCitations + institutionalCitations + dataSourceAttribution;

  return {
    parenthetical_citations: parentheticalCitations,
    institutional_citations: institutionalCitations,
    data_source_attributions: dataSourceAttribution,
    total_citations: totalCitations,
    citation_density: ((totalCitations / docText.length) * 10000).toFixed(2) + ' per 10k words',
    quality_score: totalCitations >= 8 ? 'PASS' : 'WARNING'
  };
}
```

**Pass Criteria**:
- ✓ Minimum 8 citations throughout document
- ✓ At least 3 distinct source institutions (BEA, BLS, Census, RIMS II, etc.)
- ✓ Citation density > 0.1 per 1000 words
- ✓ Methodology sections include attribution

#### Indicator 3: Repetitive Phrases & Pattern Detection

AI often repeats phrases or patterns. Natural writing avoids this:

```javascript
function analyzeRepetitivePatterns(docxPath) {
  const docText = extractDocxText(docxPath);
  const sentences = docText.match(/[^.!?]+[.!?]+/g) || [];

  // Look for repeated phrases (3+ occurrences within document)
  const phraseFreq = {};
  sentences.forEach(s => {
    const phrases = s.trim().match(/\w+\s+\w+\s+\w+/g) || [];
    phrases.forEach(phrase => {
      phraseFreq[phrase] = (phraseFreq[phrase] || 0) + 1;
    });
  });

  const repetitivePatterns = Object.entries(phraseFreq)
    .filter(([phrase, count]) => count >= 3)
    .map(([phrase, count]) => ({ phrase: phrase.trim(), count: count }));

  // Check for paragraph-level repetition
  const paragraphs = docText.split(/\n\n+/);
  const paragraphOpenings = paragraphs.map(p => p.trim().substring(0, 50));
  const uniqueOpenings = new Set(paragraphOpenings).size;
  const paragraphVariety = (uniqueOpenings / paragraphs.length) * 100;

  return {
    repetitive_phrase_count: repetitivePatterns.length,
    most_repeated: repetitivePatterns
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    paragraph_opening_variety: paragraphVariety.toFixed(1) + '%',
    quality_score: {
      phrase_repetition: repetitivePatterns.length <= 3 ? 'PASS' : 'WARNING',
      paragraph_variety: paragraphVariety > 80 ? 'PASS' : 'WARNING'
    }
  };
}
```

**Pass Criteria**:
- ✓ No more than 3 phrases repeated 3+ times
- ✓ Paragraph opening variety > 80%
- ✓ No discernible template patterns across modules
- ✓ Each module has distinct voice and emphasis

#### Indicator 4: Credibility & Evidence Markers

Natural professional documents include specific terminology and evidence:

```javascript
function analyzeCredibilityMarkers(docxPath) {
  const docText = extractDocxText(docxPath);

  const markers = {
    peer_reviewed: (docText.match(/peer[- ]reviewed|academic|scholarly/gi) || []).length,
    government_data: (docText.match(/government|federal|official|BEA|BLS|Census/gi) || []).length,
    methodology_specific: (docText.match(/RIMS II|Type II|multiplier coefficient|methodology|calculation/gi) || []).length,
    industry_specific: (docText.match(/NAICS|SIC|sector|industry classification/gi) || []).length,
    data_citations: (docText.match(/\d+\.\d+%|?\$[\d,]+|20\d{2}|[\d,]+ jobs|[\d,]+ employees/g) || []).length,
    uncertainty_acknowledgment: (docText.match(/assume|estimate|project|potentially|could|may|conservative/gi) || []).length
  };

  const totalMarkers = Object.values(markers).reduce((a, b) => a + b, 0);

  return {
    credibility_markers: markers,
    total_distinct_markers: Object.entries(markers).filter(([_, count]) => count > 0).length,
    total_marker_instances: totalMarkers,
    credibility_score: Math.min(100, (Object.entries(markers).filter(([_, count]) => count > 0).length / 6) * 100),
    quality_score: totalMarkers >= 50 ? 'PASS' : 'WARNING'
  };
}
```

**Pass Criteria**:
- ✓ At least 50 credibility marker instances throughout document
- ✓ All 6 marker categories present (peer-reviewed, government, methodology, industry, data, uncertainty)
- ✓ Specific quantified claims (numbers, percentages, dates)
- ✓ Conservative language and assumption acknowledgment

### 4.3 Anti-AI Detection Summary

```javascript
function validateAntiAICompliance(docxPath) {
  const sentenceVar = analyzeSentenceVariation(docxPath);
  const citations = analyzeCitations(docxPath);
  const repetition = analyzeRepetitivePatterns(docxPath);
  const credibility = analyzeCredibilityMarkers(docxPath);

  const compliance = {
    sentence_variation: {
      score: sentenceVar.variance_score,
      status: sentenceVar.quality_score.length_variance
    },
    citations: {
      count: citations.total_citations,
      status: citations.quality_score
    },
    repetition: {
      count: repetition.repetitive_phrase_count,
      status: repetition.quality_score.phrase_repetition
    },
    credibility: {
      score: credibility.credibility_score,
      status: credibility.quality_score
    },
    overall_status: 'PASS'
  };

  // Set overall status based on component scores
  const componentScores = [
    sentenceVar.quality_score.length_variance,
    sentenceVar.quality_score.opening_diversity,
    citations.quality_score,
    repetition.quality_score.phrase_repetition,
    credibility.quality_score
  ];

  const passingComponents = componentScores.filter(s => s === 'PASS').length;

  if (passingComponents < 4) {
    compliance.overall_status = 'FAIL';
    compliance.recommendation = 'Document may be flagged as AI-generated. Recommend manual review and revision.';
  } else if (passingComponents === 4) {
    compliance.overall_status = 'WARNING';
    compliance.recommendation = 'Document acceptable but recommend strengthening one weak area.';
  }

  return compliance;
}
```

**Anti-AI Compliance Checklist**:
- [ ] Sentence variation score ≥ 60
- [ ] Minimum 8 citations across document
- [ ] No more than 3 repetitive phrases
- [ ] Paragraph opening variety > 80%
- [ ] Credibility marker score ≥ 50
- [ ] At least 5 of 6 credibility marker categories present
- [ ] Varied use of passive/active voice
- [ ] No generic template language detected
- [ ] Evidence-based claims throughout
- [ ] Professional terminology used correctly

---

## QA Report Generation

Upon completion of all four validation stages, generate qa_report.json:

```json
{
  "qa_timestamp": "2026-03-13T15:45:22Z",
  "document_file": "IMPACTO_ClientName_Economic_Impact_Analysis.docx",
  "validation_stages": {
    "stage_1_structural": {
      "module_count": { "status": "PASS", "found": 13, "expected": 13 },
      "table_count": { "status": "PASS", "found": 12, "expected_range": "11-16" },
      "paragraph_count": { "status": "PASS", "found": 135, "expected_minimum": 85 },
      "file_size": { "status": "PASS", "size_kb": 38.5, "expected_range": "35-45" },
      "overall_status": "PASS"
    },
    "stage_2_data_consistency": {
      "cross_module_links": {
        "m1_to_config": { "status": "PASS", "variance": "0.12%" },
        "m2_to_config": { "status": "PASS", "variance": "0.08%" },
        "m3_to_config": { "status": "PASS", "variance": "0.15%" },
        "m4_to_config": { "status": "PASS", "variance": "0.04%" },
        "m9_to_config": { "status": "PASS", "variance": "0.09%" },
        "m11_to_config": { "status": "PASS", "variance": "0.12%" },
        "m13_aggregate": { "status": "PASS", "variance": "0.18%" }
      },
      "key_calculations": {
        "m1_component_sum": { "status": "PASS" },
        "m4_tax_components": { "status": "PASS" },
        "m11_sroi_ratio": { "status": "PASS" },
        "m9_scenario_ordering": { "status": "PASS" }
      },
      "overall_status": "PASS"
    },
    "stage_3_dhanasar_compliance": {
      "prong_1_direct_jobs": {
        "status": "PASS",
        "requirement": "Minimum 10 jobs",
        "documented": 18,
        "evidence_count": 4
      },
      "prong_2_indirect_employment": {
        "status": "PASS",
        "requirement": "Multiplier effect documented",
        "multiplier": 1.72,
        "indirect_jobs": 31,
        "evidence_count": 5
      },
      "prong_3_toa_location": {
        "status": "PASS",
        "requirement": "Employment within TEA",
        "toa_designated": true,
        "area": "Miami-Dade County, Florida",
        "evidence_count": 3
      },
      "overall_status": "PASS",
      "all_prongs_satisfied": true
    },
    "stage_4_rfe_rebuttal": {
      "multiplier_objection": { "status": "PASS", "coverage": "RIMS II methodology, Type II validation" },
      "job_creation_objection": { "status": "PASS", "coverage": "Three-model validation" },
      "wage_sustainability": { "status": "PASS", "coverage": "BLS regional data, benchmarks" },
      "supply_chain_reliability": { "status": "PASS", "coverage": "Vendor analysis, local procurement" },
      "social_value_inflation": { "status": "PASS", "coverage": "GVE benchmarking, conservative approach" },
      "projection_optimism": { "status": "PASS", "coverage": "Sensitivity analysis with scenarios" },
      "coverage_score": 95,
      "overall_status": "PASS"
    },
    "stage_4_anti_ai_detection": {
      "sentence_variation": { "score": 78, "status": "PASS" },
      "citations": { "count": 9, "status": "PASS" },
      "repetitive_phrases": { "count": 1, "status": "PASS" },
      "credibility_markers": { "score": 68, "status": "PASS" },
      "overall_status": "PASS"
    }
  },
  "final_recommendation": "PASS — Document is ready for USCIS EB-5 visa petition submission",
  "ready_for_submission": true,
  "qa_issued_by": "AGENT_05_QA",
  "notes": "All validation stages completed successfully. Document meets all structural, compliance, and credibility requirements."
}
```

---

## QA Protocol Failure Handling

If any validation stage fails:

1. **Identify Failing Component**: Document specific failure (e.g., "Module count: 12 found, 13 expected")
2. **Determine Root Cause**:
   - Structural failure → rebuild document
   - Data consistency failure → verify config, recalculate
   - Dhanasar failure → strengthen evidence in specific modules
   - RFE readiness failure → expand narrative on weak objection
   - Anti-AI failure → revise for sentence variety, add citations
3. **Remediation**: Return to appropriate agent (03, 04, or 05) with specific fixes
4. **Re-validation**: Re-run full QA protocol after remediation
5. **Documentation**: Log all failures and remediation steps for audit trail

---

## Summary Checklist

Before releasing document for USCIS submission, confirm:

**STRUCTURAL** (Stage 1)
- [ ] 13 modules present and sequenced correctly
- [ ] 11+ tables with proper formatting
- [ ] 85+ paragraphs of content
- [ ] File size 35-45 KB
- [ ] Valid DOCX format (ZIP archive)

**DATA CONSISTENCY** (Stage 2)
- [ ] M1 output consistent across document and config (within 0.5%)
- [ ] M2 employment figures within tolerance
- [ ] M4 tax components sum correctly
- [ ] M9 scenarios properly ordered (conservative ≤ base ≤ optimistic)
- [ ] M13 combined impact = aggregate of components (within 1%)

**LEGAL COMPLIANCE** (Stage 3)
- [ ] Dhanasar Prong 1: Direct employment ≥ 10 jobs
- [ ] Dhanasar Prong 2: Indirect employment through multiplier effects
- [ ] Dhanasar Prong 3: Employment within TEA
- [ ] All three prongs clearly documented with supporting evidence

**EVIDENTIARY QUALITY** (Stage 4)
- [ ] All 6 common RFE objections addressed with rebuttal evidence
- [ ] Sentence variation indicates natural writing (not AI)
- [ ] Minimum 8 citations from government/academic sources
- [ ] Repetitive phrases < 3 instances
- [ ] Credibility markers ≥ 50 instances
- [ ] Professional terminology used correctly

Document is approved for USCIS EB-5 visa petition submission.
