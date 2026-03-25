// Research prompt templates for Business Plan deep research
// Each template produces a research prompt that can be fed to Deep Research / Gemini / Perplexity

export interface ResearchTemplate {
  id: string;
  title: string;
  filename: string;
  prompt: string;
}

export interface TemplateVars {
  EMPRESA: string;
  SETOR: string;
  CIDADE: string;
  ESTADO: string;
  SOC_CODE: string;
  SOC_TITULO: string;
  NAICS: string;
  SERVICOS: string;
}

export const RESEARCH_TEMPLATES: ResearchTemplate[] = [
  {
    id: 'market_analysis',
    title: 'Market Analysis (TAM/SAM/SOM)',
    filename: 'MARKET_ANALYSIS.md',
    prompt: `You are a market research analyst. Conduct a comprehensive TAM/SAM/SOM analysis for a {{SETOR}} business called "{{EMPRESA}}" located in {{CIDADE}}, {{ESTADO}}.

Research requirements:
1. **Total Addressable Market (TAM):** National market size for {{SETOR}} industry in the United States. Include revenue figures, growth rate (CAGR), and market projections for the next 5 years.
2. **Serviceable Addressable Market (SAM):** Market size specifically in {{ESTADO}} and the broader regional area. Include state-level revenue data, number of businesses, and market concentration.
3. **Serviceable Obtainable Market (SOM):** Realistic market share for a new entrant in {{CIDADE}}, {{ESTADO}} within the first 3 years. Consider local competition density, population demographics, and business density.
4. **Market Drivers:** Key factors driving growth in the {{SETOR}} sector (technology, regulation, consumer trends).
5. **Market Barriers:** Entry barriers, regulatory requirements, capital requirements.
6. **NAICS Code {{NAICS}}:** Include specific data tied to this NAICS classification.

Services offered: {{SERVICOS}}

Provide all data with sources (IBISWorld, Statista, BLS, Census Bureau, industry reports). Format as a structured research document with sections, data tables, and source citations.`,
  },
  {
    id: 'competitors',
    title: 'Competitor Analysis',
    filename: 'COMPETITORS.md',
    prompt: `You are a competitive intelligence analyst. Research 5-10 direct and indirect competitors for "{{EMPRESA}}", a {{SETOR}} business planning to operate in {{CIDADE}}, {{ESTADO}}.

For each competitor, provide:
1. **Company Name** and location
2. **Services Offered** — compared to: {{SERVICOS}}
3. **Pricing Structure** — price ranges, packages, hourly rates
4. **Differentials** — what makes them stand out
5. **Online Presence** — website quality, Google reviews rating, social media following
6. **Estimated Revenue** — if available (from public filings, press, or estimates)
7. **Years in Operation**
8. **Target Customer Segment**

Also provide:
- **Competitive Gap Analysis:** What services/approaches are missing in the local market that {{EMPRESA}} could fill?
- **Pricing Positioning:** Where should {{EMPRESA}} position itself (premium, mid-range, value)?
- **Competitive Advantages:** Based on the services ({{SERVICOS}}), what unique value propositions can {{EMPRESA}} offer?

Focus on the {{CIDADE}}, {{ESTADO}} metropolitan area. Include both established businesses and recent entrants. Cite sources for all data.`,
  },
  {
    id: 'government_policies',
    title: 'Government Policies & Incentives',
    filename: 'GOVERNMENT_POLICIES.md',
    prompt: `You are a policy research analyst specializing in U.S. government programs. Research all relevant federal and state policies, incentives, and programs that support or affect a {{SETOR}} business in {{CIDADE}}, {{ESTADO}}.

Research areas:
1. **Federal Policies:**
   - White House fact sheets and executive orders relevant to {{SETOR}}
   - SBA programs and loan guarantees
   - Federal grants available for {{SETOR}} businesses
   - Tax incentives (IRS programs, Opportunity Zones, R&D credits)

2. **State Policies ({{ESTADO}}):**
   - State economic development programs
   - State-level tax incentives for new businesses
   - Workforce development grants
   - {{ESTADO}} Department of Commerce initiatives for {{SETOR}}

3. **Local Policies ({{CIDADE}}):**
   - City/county economic development incentives
   - Local enterprise zones or business corridors
   - Chamber of Commerce programs
   - Municipal grants or low-interest loan programs

4. **Regulatory Environment:**
   - Licenses and permits required for {{SETOR}} in {{ESTADO}}
   - Zoning requirements in {{CIDADE}}
   - Health/safety regulations if applicable
   - Environmental regulations

5. **Immigration-Related Policies:**
   - How this business supports U.S. national interest
   - Job creation impact
   - Economic impact metrics valued by USCIS

Provide direct links to government sources, fact sheets, and program pages. Format with clear sections and actionable findings.`,
  },
  {
    id: 'bls_data',
    title: 'BLS Occupational Data',
    filename: 'BLS_DATA.md',
    prompt: `You are a labor economics researcher. Compile comprehensive Bureau of Labor Statistics (BLS) data for SOC Code {{SOC_CODE}} — "{{SOC_TITULO}}" — with focus on {{CIDADE}}, {{ESTADO}}.

Required data points:
1. **National Employment Data:**
   - Total employment for SOC {{SOC_CODE}}
   - Median annual wage (national)
   - Mean annual wage (national)
   - Wage percentiles (10th, 25th, 50th, 75th, 90th)
   - Employment per 1,000 jobs

2. **State Data ({{ESTADO}}):**
   - Total employment in {{ESTADO}}
   - Mean/median wages in {{ESTADO}}
   - Location quotient
   - Employment concentration

3. **Metropolitan Area Data ({{CIDADE}} MSA):**
   - Employment level in the MSA
   - Mean/median wages in the MSA
   - Annual mean wage vs national comparison
   - Top-paying metropolitan areas for this SOC code

4. **Growth Projections:**
   - Projected employment change (10-year outlook)
   - Growth rate percentage
   - Projected job openings per year
   - Factors driving growth/decline

5. **Related Occupations:**
   - Similar SOC codes in the {{SETOR}} sector
   - Wage comparison across related occupations
   - Cross-industry employment for this SOC code

6. **Industry Context (NAICS {{NAICS}}):**
   - Employment of SOC {{SOC_CODE}} within NAICS {{NAICS}}
   - Industry-specific wage data

Cite all data from BLS.gov (OES, OOH, Employment Projections). Include data vintage (year of survey). Format as tables where appropriate.`,
  },
  {
    id: 'suppliers',
    title: 'Supply Chain & Key Vendors',
    filename: 'SUPPLIERS.md',
    prompt: `You are a supply chain analyst. Research the supplier ecosystem and key vendors for a {{SETOR}} business called "{{EMPRESA}}" operating in {{CIDADE}}, {{ESTADO}}.

Services offered: {{SERVICOS}}

Research areas:
1. **Primary Suppliers:**
   - Equipment and technology providers
   - Raw materials or inventory suppliers
   - Software and SaaS platforms commonly used
   - Estimated costs for initial setup and ongoing supply

2. **Service Providers:**
   - Professional services (accounting, legal, insurance)
   - Marketing and advertising vendors
   - IT and cybersecurity providers
   - HR and payroll services

3. **Distribution & Logistics:**
   - Shipping and delivery partners (if applicable)
   - Local vs national suppliers
   - Supply chain risks and alternatives

4. **Technology Stack:**
   - Industry-standard software for {{SETOR}}
   - Point-of-sale or management systems
   - Customer relationship management (CRM) tools
   - Estimated technology costs (monthly/annual)

5. **Vendor Comparison:**
   - Top 3 vendors for each critical category
   - Price ranges and contract terms
   - Local availability in {{CIDADE}}, {{ESTADO}}

6. **Supply Chain Risks:**
   - Single-source dependencies
   - Geographic risks
   - Price volatility factors
   - Mitigation strategies

Include estimated costs where possible. Focus on vendors accessible in the {{CIDADE}}, {{ESTADO}} area.`,
  },
  {
    id: 'industry_trends',
    title: 'Industry Trends & Emerging Tech',
    filename: 'INDUSTRY_TRENDS.md',
    prompt: `You are an industry trends analyst. Research current and emerging trends in the {{SETOR}} sector that would impact "{{EMPRESA}}" in {{CIDADE}}, {{ESTADO}}.

Research areas:
1. **Current Industry Trends (2024-2026):**
   - Top 5 trends reshaping the {{SETOR}} industry
   - Consumer behavior shifts
   - Technology adoption rates
   - Pricing model evolution

2. **Emerging Technologies:**
   - AI/ML applications in {{SETOR}}
   - Automation opportunities
   - Digital transformation initiatives
   - IoT and smart technology integration

3. **Sustainability & ESG:**
   - Green/sustainable practices in {{SETOR}}
   - Consumer demand for sustainability
   - Regulatory trends toward sustainability
   - Cost-benefit of sustainable operations

4. **Post-Pandemic Changes:**
   - Permanent shifts in the {{SETOR}} industry
   - Remote/hybrid service delivery
   - Digital-first customer expectations
   - Health and safety standards evolution

5. **Innovation Opportunities:**
   - Underserved niches within {{SETOR}}
   - Cross-industry innovations applicable to {{SETOR}}
   - Business model innovations
   - Services/products gaining traction: {{SERVICOS}}

6. **Future Outlook (5-10 years):**
   - Market evolution predictions
   - Technology disruption risks
   - Workforce changes
   - Regulatory forecast

Cite industry reports (McKinsey, Deloitte, PwC, IBISWorld, Gartner), trade publications, and academic research. Include data and statistics to support each trend.`,
  },
  {
    id: 'legal_framework',
    title: 'Legal & Corporate Structure',
    filename: 'LEGAL_FRAMEWORK.md',
    prompt: `You are a business law researcher. Research the legal and corporate framework for establishing "{{EMPRESA}}", a {{SETOR}} business in {{CIDADE}}, {{ESTADO}}.

Research areas:
1. **Business Entity Selection:**
   - LLC vs Corporation vs S-Corp comparison for {{SETOR}} in {{ESTADO}}
   - Tax implications of each structure
   - Liability protection comparison
   - Recommended structure with justification
   - Formation costs and timeline in {{ESTADO}}

2. **State Registration ({{ESTADO}}):**
   - Secretary of State filing requirements
   - Registered agent requirements
   - Annual report obligations
   - State franchise tax or business tax

3. **Licenses & Permits:**
   - Federal licenses required for {{SETOR}} (NAICS {{NAICS}})
   - {{ESTADO}} state licenses for {{SETOR}}
   - {{CIDADE}} local business licenses
   - Professional certifications required
   - Health department permits (if applicable)
   - Fire and safety permits

4. **Employment Law:**
   - {{ESTADO}} employment laws for small businesses
   - Minimum wage in {{ESTADO}} and {{CIDADE}}
   - Workers' compensation requirements
   - Anti-discrimination laws
   - Employee vs contractor classification rules

5. **Insurance Requirements:**
   - General liability insurance
   - Professional liability (E&O)
   - Workers' compensation
   - Commercial property insurance
   - Industry-specific insurance for {{SETOR}}
   - Estimated annual premiums

6. **Intellectual Property:**
   - Trademark considerations for "{{EMPRESA}}"
   - Trade secrets protection
   - Non-compete/NDA enforceability in {{ESTADO}}

7. **Compliance & Ongoing:**
   - Annual filing requirements
   - Tax deadlines (federal, state, local)
   - Record-keeping requirements
   - Audit and inspection schedules

Provide specific {{ESTADO}} statutes and regulations. Include estimated costs for each requirement. Cite official government sources.`,
  },
  {
    id: 'location_data',
    title: 'Location Demographics & Economy',
    filename: 'LOCATION_DATA.md',
    prompt: `You are a demographic and economic research analyst. Compile comprehensive location data for {{CIDADE}}, {{ESTADO}} to support the business plan for "{{EMPRESA}}" ({{SETOR}} sector).

Research areas:
1. **Demographics:**
   - Total population (city, MSA, county)
   - Population growth rate (5-year and 10-year trend)
   - Age distribution
   - Household income (median, mean, distribution)
   - Education levels
   - Ethnic/racial composition
   - Languages spoken

2. **Economic Indicators:**
   - GDP of {{CIDADE}} MSA
   - Unemployment rate (current and trend)
   - Major employers in the area
   - Job growth rate
   - Cost of living index (vs national average)
   - Housing market overview

3. **Business Environment:**
   - Number of businesses in {{SETOR}} sector
   - Business formation rate
   - Business survival rate (5-year)
   - Average revenue per business in {{SETOR}}
   - Commercial real estate costs (rent per sq ft)

4. **Consumer Profile:**
   - Consumer spending patterns relevant to {{SETOR}}
   - Disposable income levels
   - Online vs in-person purchasing habits
   - Brand loyalty and switching behavior in {{SETOR}}

5. **Infrastructure:**
   - Transportation access (highways, airports, public transit)
   - Internet connectivity and speed
   - Utility costs (electricity, water, gas averages)
   - Workforce availability for {{SETOR}}

6. **Growth Indicators:**
   - Planned developments and construction
   - New businesses moving to the area
   - Government investment in infrastructure
   - Population migration trends (inbound vs outbound)

7. **Comparison:**
   - Compare {{CIDADE}} to 2-3 similar cities for {{SETOR}} viability
   - Rank factors: cost, market size, competition, growth

Cite U.S. Census Bureau, BLS, BEA, city/county economic development reports. Include the most recent data available. Format with data tables and visual-ready statistics.`,
  },
];

/**
 * Replace all {{PLACEHOLDER}} markers in a template prompt with actual values.
 */
export function fillTemplate(template: string, vars: TemplateVars): string {
  let result = template;
  const entries = Object.entries(vars) as [keyof TemplateVars, string][];
  for (const [key, value] of entries) {
    const placeholder = `{{${key}}}`;
    // Replace all occurrences
    while (result.includes(placeholder)) {
      result = result.replace(placeholder, value || '');
    }
  }
  return result;
}
