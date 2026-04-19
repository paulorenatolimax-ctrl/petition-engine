# IMPACTO® — Economic Impact Calculator Agent

## Purpose
Takes the researched configuration from Agent 02 and performs ALL economic calculations to populate the remaining numeric fields in the IMPACTO® Economic Impact Analysis framework. This agent operates as the quantitative backbone, converting inputs into validated multiplier-based outputs suitable for USCIS EB-5 visa adjudication.

---

## Core Responsibilities

1. **Input Validation**: Verify all prerequisite data from Agent 02 (revenue projections, direct employment, industry classification, state/locality)
2. **Calculation Execution**: Apply standardized economic models (RIMS II, EPI, BLS) with sector-specific parameters
3. **Cross-Validation**: Compare results across multiple methodologies to establish confidence ranges
4. **Sensitivity Testing**: Generate conservative, base, and optimistic scenarios
5. **Output Generation**: Populate the client_config.json with all numeric fields

---

## Methodology Reference

### M1: Total Economic Output

The Type II economic multiplier captures both indirect and induced effects of direct economic activity.

```
direct_output = sum(revenue_year1 through revenue_year5)

// RIMS II industry multipliers (Type II - includes household induced effects)
indirect_share = 0.42  // typical for services sector
induced_share = 0.58   // typical for services sector
multiplier_effect = type_ii_output - 1.0

indirect_output = direct_output * multiplier_effect * indirect_share
induced_output = direct_output * multiplier_effect * induced_share
total_output = direct_output + indirect_output + induced_output
```

**Key Assumptions**:
- Applies RIMS II multipliers specific to NAICS classification
- Industry-specific indirect/induced share ratios
- Constant multiplier across 5-year period (conservative approach)
- All values in nominal dollars (no inflation adjustment unless specified)

**Sector Reference Table**:

| NAICS Sector | RIMS II Type II Output | Indirect Share | Induced Share | Notes |
|---|---|---|---|---|
| 5112 (Software Publishers) | 1.85 | 0.35 | 0.50 | High value-added |
| 5415 (Computer Systems Design) | 1.72 | 0.38 | 0.34 | Moderate multiplier |
| 6244 (Child Day Care) | 1.45 | 0.25 | 0.20 | Service-intensive |
| 3344 (Semiconductor Mfg) | 2.15 | 0.55 | 0.60 | Manufacturing-heavy |
| 6111 (Elementary Schools) | 1.38 | 0.28 | 0.10 | Education sector |
| 7211 (Traveler Accommodation) | 1.52 | 0.32 | 0.20 | Tourism-driven |

---

### M2: Employment Impact

Uses a three-model validation approach to establish credible employment ranges for USCIS review.

```
// Model 1: RIMS II Employment Multiplier (most conservative)
rims_ii_jobs = (total_output / 1000000) * type_ii_employment_multiplier

// Model 2: EPI (Economic Policy Institute) Validation
epi_jobs = direct_jobs_year5 * epi_employment_multiplier

// Model 3: BLS (Bureau of Labor Statistics) Validation
bls_jobs = direct_jobs_year5 * bls_employment_multiplier

// Calculate range for credibility
jobs_min = min(rims_ii_jobs, epi_jobs, bls_jobs)
jobs_max = max(rims_ii_jobs, epi_jobs, bls_jobs)
jobs_range = jobs_min + "-" + jobs_max

// Use conservative estimate (typically RIMS II) for primary claim
claimed_jobs = jobs_min
```

**Standard Employment Multipliers by Sector**:

| NAICS Sector | RIMS II Jobs/Million $ | EPI Multiplier | BLS Multiplier |
|---|---|---|---|
| Software/IT | 4.2 | 3.8 | 4.0 |
| Professional Services | 5.1 | 4.9 | 5.2 |
| Hospitality | 8.5 | 8.2 | 8.7 |
| Manufacturing | 6.8 | 6.5 | 7.0 |
| Education/Training | 7.2 | 7.0 | 7.3 |

**Quality Control**:
- Flag if range exceeds 30% variance (indicates data quality issues)
- Always cite which model supports the conservative claim
- Document any sector-specific adjustments

---

### M3: Earnings & Income Impact

Calculates total labor income and wage distribution across employment categories.

```
// Type II earnings (most comprehensive)
total_labor_income = total_output * type_ii_earnings_coefficient

// Wage breakdown by employment tier (use industry averages or provided data)
professional_jobs = direct_jobs_year5 * 0.35
skilled_jobs = direct_jobs_year5 * 0.45
entry_level_jobs = direct_jobs_year5 * 0.20

// Wage distribution (adjust by region and NAICS)
professional_wage = regional_bls_mean_wage * 0.95
skilled_wage = regional_bls_mean_wage * 0.65
entry_level_wage = regional_bls_mean_wage * 0.40

total_wages = (professional_jobs * professional_wage) +
              (skilled_jobs * skilled_wage) +
              (entry_level_jobs * entry_level_wage)

// Annual increase trajectory
earnings_compound_growth = 0.023  // 2.3% annual wage growth (conservative)
```

**Regional Wage Adjustment Factors**:
- California: 1.15x national average
- Florida: 0.92x national average
- Texas: 0.98x national average
- New York: 1.18x national average

---

### M4: Tax Revenue Impact

Calculates federal, state, and local tax implications based on employment and earnings.

```
// FEDERAL INCOME TAX (from total labor income)
federal_income_tax = total_labor_income * 0.165  // effective rate

// CORPORATE TAX (from business profitability)
corporate_tax_estimate = (direct_output - operating_expenses) * 0.21

// PAYROLL TAXES (employer + employee FICA)
payroll_tax = total_wages * 0.153  // FICA rates

// STATE INCOME TAX (state-specific)
state_income_tax = IF(state == "FL", 0, total_labor_income * state_tax_rate)

// STATE SALES TAX (from household spending of induced income)
induced_household_spending = induced_output * 0.70  // spending propensity
state_sales_tax = induced_household_spending * state_sales_tax_rate

// LOCAL PROPERTY TAX (from business assets + employee home purchases)
business_property_tax = (capital_investment * 0.04) * 0.01  // 1% effective rate
residential_property_tax = (new_residents * avg_home_value) * 0.0125

// LOCAL SALES TAX
local_sales_tax = induced_household_spending * local_sales_tax_rate

TOTAL_TAX_REVENUE = federal_income_tax + corporate_tax_estimate + payroll_tax +
                    state_income_tax + state_sales_tax + business_property_tax +
                    residential_property_tax + local_sales_tax
```

**State-Specific Tax Rates** (2026):

| State | Income Tax | Sales Tax | Property Tax | Notes |
|---|---|---|---|---|
| Florida | 0% | 7.0% | 0.80% | EB-5 hub state |
| California | 9.3-13.3% | 8.5% | 0.80% | High income tax |
| Texas | 0% | 8.25% | 1.8% | Growing EB-5 activity |
| New York | 6.5-8.8% | 8.0% | 1.8% | Manhattan focus |

---

### M5: Supply Chain Impact

Quantifies vendor development, local procurement, and multiplier effects from supply chain activity.

```
// DIRECT SUPPLY CHAIN SPEND
supply_chain_spend = operating_expenses * 0.70  // typical percentage

// LOCAL PROCUREMENT (adjust by region and industry)
local_procurement_dollars = supply_chain_spend * local_procurement_rate

// VENDOR COUNT ESTIMATION (if not provided)
avg_vendor_spend = 125000  // typical vendor contract value
vendor_count = supply_chain_spend / avg_vendor_spend

// VENDOR DEVELOPMENT IMPACT
vendor_upskilling_value = vendor_count * avg_training_cost_per_vendor
vendor_access_to_capital = vendor_count * 45000  // avg credit line expansion

// SUPPLY CHAIN MULTIPLIER (use industry-specific input-output coefficients)
supply_chain_indirect_output = local_procurement_dollars * supply_chain_multiplier
supply_chain_jobs = (local_procurement_dollars / 1000000) * supply_chain_employment_multiplier

// TOTAL SUPPLY CHAIN CONTRIBUTION
total_supply_chain_value = local_procurement_dollars + vendor_upskilling_value +
                           vendor_access_to_capital + supply_chain_indirect_output
```

**Local Procurement Rates by Sector**:
- Manufacturing: 0.65 (high local content)
- Technology/Software: 0.35 (often distributed supply chain)
- Hospitality: 0.55 (food, services procurement)
- Professional Services: 0.45 (office, contracted services)

---

### M6: Innovation & R&D Impact

Provides quantitative anchors for technology investments and innovation metrics.

```
// R&D INTENSITY CALCULATION
rd_spend = operating_expenses * rd_intensity_rate  // industry benchmark

// TECHNOLOGY INFRASTRUCTURE VALUE
it_infrastructure_cost = rd_spend * 0.30
cloud_and_software_cost = rd_spend * 0.40
employee_training_tech = rd_spend * 0.30

// PATENT/IP POTENTIAL (if applicable)
patent_pipeline_value = if(rd_spend > 500k, rd_spend * 2.5, rd_spend * 1.8)

// SECTOR IMPACT MULTIPLIER
technology_sector_multiplier = IF(rd_spend > 1000000, 1.35, 1.15)

// INDUSTRY ADVANCEMENT CONTRIBUTION
technology_advancement_value = rd_spend * technology_sector_multiplier
```

**R&D Intensity Benchmarks**:
| Sector | R&D as % of Revenue | Technology Multiplier |
|---|---|---|
| Software | 12-20% | 1.45 |
| Biotech | 15-25% | 1.55 |
| Manufacturing | 3-8% | 1.20 |
| Professional Services | 2-5% | 1.10 |

---

### M7: Government Alignment & Policy Contribution

Scores business contributions to regional economic development priorities.

```
// ALIGNMENT SCORING MATRIX (0-100 scale)

// Jobs Target Alignment
jobs_target = state_economic_development_goal_jobs_per_year
jobs_performance = (direct_jobs_year5 / 5) / jobs_target  // annual rate
jobs_score = min(100, jobs_performance * 100)

// Wage Level Alignment
regional_median_wage = state_bls_data
avg_job_wage = total_wages / total_jobs
wage_score = (avg_job_wage / regional_median_wage) * 100

// Priority Sector Alignment
priority_sectors = [list from state economic development strategy]
sector_alignment_score = IF(NAICS IN priority_sectors, 100, 65)

// Underserved Area Contribution
location_score = IF(opportunity_zone OR designated_rural, 100, 75)

// OVERALL ALIGNMENT SCORE
government_alignment = (jobs_score * 0.35) +
                       (wage_score * 0.25) +
                       (sector_alignment_score * 0.25) +
                       (location_score * 0.15)
```

---

### M8: Community Integration & Local Economic Development

Quantifies benefits to local community economic development priorities.

```
// WORKFORCE DEVELOPMENT PIPELINE
training_programs = employees_year5 * 0.35  // % receiving training
training_graduates = training_programs * 0.85  // completion rate
training_placement_rate = 0.92
training_impact_value = training_graduates * training_placement_rate *
                        avg_starting_wage * 0.25  // 25% wage increment

// EDUCATION PARTNERSHIPS
university_partnerships = if(rd_spend > 500k, 3, 1)
student_internships = employees_year5 * 0.19 * 5  // cumulative over 5 years
internship_value = student_internships * avg_internship_stipend

// COMMUNITY INVESTMENT
community_investment_annual = operating_expenses * 0.02  // typical %
community_investment_5yr = community_investment_annual * 5

// MEDIAN INCOME IMPACT (for distressed areas)
area_median_income = state_acs_5yr_data
direct_income_impact = total_wages / local_population_sample
median_income_lift = direct_income_impact - area_median_income

TOTAL_COMMUNITY_VALUE = training_impact_value + internship_value +
                        community_investment_5yr
```

---

### M9: Sensitivity Analysis

Three-scenario modeling (conservative, base, optimistic) for USCIS credibility.

```
// CONSERVATIVE SCENARIO (30% reduction in optimistic assumptions)
conservative_factor = 0.70
conservative_multiplier_adjustment = 0.85

conservative_output = direct_output * conservative_factor
conservative_jobs = (total_jobs * conservative_factor) * conservative_multiplier_adjustment
conservative_earnings = total_labor_income * conservative_factor
conservative_tax = TOTAL_TAX_REVENUE * conservative_factor

// BASE CASE (as calculated above)
base_output = direct_output
base_jobs = total_jobs
base_earnings = total_labor_income
base_tax = TOTAL_TAX_REVENUE

// OPTIMISTIC SCENARIO (30% increase, with stronger multiplier effects)
optimistic_factor = 1.30
optimistic_multiplier_adjustment = 1.15

optimistic_output = direct_output * optimistic_factor
optimistic_jobs = (total_jobs * optimistic_factor) * optimistic_multiplier_adjustment
optimistic_earnings = total_labor_income * optimistic_factor
optimistic_tax = TOTAL_TAX_REVENUE * optimistic_factor

// SCENARIO RANGE PRESENTATION (for RFE rebuttal)
SENSITIVITY_TABLE = {
  metric: [conservative, base, optimistic],
  output: [conservative_output, base_output, optimistic_output],
  jobs: [conservative_jobs, base_jobs, optimistic_jobs],
  earnings: [conservative_earnings, base_earnings, optimistic_earnings],
  tax_revenue: [conservative_tax, base_tax, optimistic_tax]
}
```

**Sensitivity Factors by Risk Category**:

| Risk Factor | Conservative | Base | Optimistic |
|---|---|---|---|
| Revenue Achievement | 70% | 100% | 130% |
| Job Creation | 65% | 100% | 135% |
| Multiplier Effect | 0.85x | 1.0x | 1.15x |
| Tax Compliance | 85% | 100% | 110% |

---

### M11: SROI (Social Return on Investment) Calculation

Comprehensive social value assessment using Global Value Exchange benchmarks.

```
// WORKFORCE DEVELOPMENT COMPONENT
direct_trained = employees_year5
certifications_issued = if(training_program, employees_year5 * 0.50, 0)
internships_cumulative = employees_year5 * 0.19 * 5  // 5 years
supplier_upskilled = vendor_count * 2.7  // average per vendor

training_value_per_employee = 8500  // GVE benchmark for professional training
avg_certification_value = 12000  // industry-specific credential
internship_value_per_placement = 4200  // career advancement benefit
supplier_training_value = 3500  // per supplier trained

workforce_value = (direct_trained * training_value_per_employee) +
                  (certifications_issued * avg_certification_value) +
                  (internships_cumulative * internship_value_per_placement) +
                  (supplier_upskilled * supplier_training_value)

// KNOWLEDGE & EXPERTISE COMPONENT
expertise_score = 1.0 to 2.5  // based on credentials, innovation, thought leadership
publication_factor = (research_publications + conference_presentations) * 15000
partnership_count = university_partnerships + industry_collaborations
knowledge_multiplier = 1.0 + (expertise_score * 0.25) + (partnership_count * 0.10)
knowledge_value = (expertise_score * 45000) * knowledge_multiplier

// COMMUNITY & LOCAL ECONOMIC DEVELOPMENT
local_procurement_value = local_procurement_dollars
opportunity_zone_factor = if(opportunity_zone, 1.25, 1.0)  // premium in distressed areas
minority_vendor_percentage = minority_owned_vendors / vendor_count
minority_vendor_value = vendor_count * minority_vendor_percentage * 22000

community_value = (local_procurement_value * opportunity_zone_factor) +
                  (minority_vendor_value * 1.5)  // amplify for equity impact

// ENVIRONMENTAL & SUSTAINABILITY COMPONENT
industry_environmental_factor = lookup(NAICS, environmental_impact_multiplier)
carbon_intensity = ghg_emissions / revenue_year5  // kg CO2 per dollar
environmental_value = (revenue_year5 * industry_environmental_factor * 8) *
                      (1.0 - min(carbon_intensity, 0.25))  // penalty for emissions

// HEALTH & QUALITY OF LIFE COMPONENT
induced_employment_household_count = total_induced_jobs / 2.1  // avg household size
per_capita_health_benefit = 2100  // from increased income and health access
health_value = induced_employment_household_count * per_capita_health_benefit

// CULTURAL & DIASPORA COMPONENT
diaspora_population = if(immigrant_owned, community_diaspora_size, 0)
diaspora_activation_rate = 0.15 to 0.35  // engagement rate
cross_border_trade_facilitation = if(international_market_focus, revenue_year5 * 0.18, 0)
cultural_value = (diaspora_population * diaspora_activation_rate * 4500) +
                 (cross_border_trade_facilitation * 0.08)

// AGGREGATE SOCIAL VALUE
TOTAL_SOCIAL_VALUE = workforce_value + knowledge_value + community_value +
                     environmental_value + health_value + cultural_value

// INVESTMENT BASELINE
direct_investment = capital_investment_year1
operational_investment = revenue_year1 * 0.15  // conservative allocation
total_investment = direct_investment + operational_investment

// SROI CALCULATION
sroi_ratio = TOTAL_SOCIAL_VALUE / total_investment

// QUALITY ASSURANCE
// SROI > 5.0 = excellent
// SROI 3.0-5.0 = strong
// SROI < 3.0 = verify assumptions
```

**Global Value Exchange Component Benchmarks**:

| Component | Benchmark Value | Source | Adjustment |
|---|---|---|---|
| Professional Training | $8,500 | GVE Skills Database | By degree level |
| University Credential | $12,000-$18,000 | GVE Education | By field |
| Internship/Mentorship | $4,200 | GVE Youth | By duration |
| Thought Leadership | $15,000 | GVE Knowledge | Per publication |
| Minority Business Support | $22,000 | GVE Equity | Per business |
| Community Investment | $1.25 per $1 spent | GVE Social | Regional multiplier |

---

### M12: Cultural & Diaspora Impact

Quantifies connections to immigrant communities and bilateral trade facilitation.

```
// DIASPORA ACTIVATION COMPONENT
diaspora_community_size = lookup(country_of_origin, diaspora_population_by_metro)
petitioner_network_reach = diaspora_community_size * 0.25  // % network affiliation
network_activation_rate = 0.15 to 0.35  // engagement likelihood
diaspora_value_per_connection = 3500  // economic value per activated connection

diaspora_activated = petitioner_network_reach * network_activation_rate
diaspora_economic_impact = diaspora_activated * diaspora_value_per_connection

// BILATERAL TRADE & COMMERCE
home_country_trade_data = lookup(country, average_diaspora_trade_per_person)
petitioner_revenue_trade_exposure = revenue_year5 * trade_focus_percentage
trade_facilitation_multiplier = 0.18 to 0.35  // by sector and country

bilateral_trade_volume = petitioner_revenue_trade_exposure * trade_facilitation_multiplier
bilateral_trade_value = bilateral_trade_volume * 0.12  // commission/markup value

// KNOWLEDGE TRANSFER & TECHNOLOGY FLOW
home_country_tech_benefit = if(rd_investment > 500k, revenue_year5 * 0.08, 0)
standards_adoption = if(international_certifications, vendor_count * 0.40, 0)
technology_transfer_value = (home_country_tech_benefit + standards_adoption) * 2.1

// CULTURAL EXCHANGE CONTRIBUTION
cultural_programming = if(community_cultural_events, annual_participant_count * 125, 0)
language_services = if(multilingual_services, employees_year5 * 2100, 0)
cultural_contribution = cultural_programming + language_services

TOTAL_CULTURAL_IMPACT = diaspora_economic_impact + bilateral_trade_value +
                        technology_transfer_value + cultural_contribution
```

**Country-Specific Trade Factors**:
| Country | Avg Diaspora Trade | Trade Focus Multiplier | Technology Transfer Factor |
|---|---|---|---|
| India | $185,000 | 0.28 | 0.12 |
| China | $220,000 | 0.35 | 0.15 |
| Brazil | $95,000 | 0.18 | 0.08 |
| Nigeria | $125,000 | 0.22 | 0.09 |
| Vietnam | $78,000 | 0.16 | 0.07 |

---

### M13: Combined Impact Summary

Aggregates all economic, social, and cultural dimensions into unified impact statement.

```
// DIMENSION AGGREGATION
ECONOMIC_IMPACT = total_output + TOTAL_TAX_REVENUE + supply_chain_value
SOCIAL_IMPACT = TOTAL_SOCIAL_VALUE + TOTAL_COMMUNITY_VALUE + health_value
CULTURAL_IMPACT = TOTAL_CULTURAL_IMPACT + knowledge_value
EMPLOYMENT_IMPACT = total_jobs + supplier_upskilled + training_graduates

// COMBINED IMPACT METRIC
COMBINED_IMPACT = ECONOMIC_IMPACT + SOCIAL_IMPACT + CULTURAL_IMPACT

// BENEFIT DIMENSION COUNT (for RFE credibility)
benefit_dimensions = count of distinct categories addressed:
  1. Direct job creation
  2. Indirect job creation
  3. Induced job creation
  4. Tax revenue generation
  5. Wage/earnings impact
  6. Supply chain development
  7. Workforce training
  8. Community investment
  9. Knowledge/innovation
  10. Cultural/diaspora engagement

// IMPACT PER JOB CREATED
impact_per_direct_job = COMBINED_IMPACT / direct_jobs_year5

// MULTIYEAR IMPACT TRAJECTORY
year1_impact = COMBINED_IMPACT * 0.15
year2_impact = COMBINED_IMPACT * 0.20
year3_impact = COMBINED_IMPACT * 0.22
year4_impact = COMBINED_IMPACT * 0.21
year5_impact = COMBINED_IMPACT * 0.22
```

---

## Validation Checklist

Before passing configuration to Agent 04 (Document Builder):

- [ ] All revenue fields populated and sum correctly across 5 years
- [ ] Employment multipliers applied from RIMS II tables specific to NAICS code
- [ ] Three employment models (RIMS II, EPI, BLS) calculated and range established
- [ ] Tax calculations broken down by federal, state, local categories
- [ ] Sensitivity analysis (conservative/base/optimistic) complete and ranges documented
- [ ] SROI ratio calculated with all 6 components valued
- [ ] Supply chain calculations include vendor count and local procurement %
- [ ] All monetary values format-checked (no scientific notation, proper decimals)
- [ ] State-specific tax rates applied (FL no income tax, CA high rates, etc.)
- [ ] Sector-specific multipliers match provided NAICS classification
- [ ] Regional wage adjustments applied based on metro area
- [ ] No circular dependencies (SROI components independent of economic output)
- [ ] All percentages between 0.0 and 1.0, all counts >= 0
- [ ] Documentation of data sources and assumptions for audit trail

---

## Output Format

All calculated values written to `client_config.json` in Module-M format:

```json
{
  "calculations": {
    "M1_output": { "direct": 0, "indirect": 0, "induced": 0, "total": 0 },
    "M2_employment": { "rims_ii": 0, "epi": 0, "bls": 0, "range": "" },
    "M3_earnings": { "total": 0, "by_tier": {} },
    "M4_tax_revenue": { "federal": 0, "state": 0, "local": 0, "total": 0 },
    "M5_supply_chain": { "spend": 0, "vendors": 0, "local_pct": 0 },
    "M9_sensitivity": { "conservative": {}, "base": {}, "optimistic": {} },
    "M11_sroi": { "components": {}, "ratio": 0 },
    "M12_cultural": { "diaspora": 0, "trade": 0, "total": 0 },
    "M13_combined": { "total": 0, "dimensions": 0 }
  }
}
```

---

## Agent Handoff

Upon completion, Agent 03 confirms:
1. All mandatory fields populated
2. No data validation errors
3. Sensitivity analysis documented
4. Assumptions logged for RFE response
5. Configuration ready for Document Builder (Agent 04)

Pass fully-populated config to Agent 04 with validation timestamp.
