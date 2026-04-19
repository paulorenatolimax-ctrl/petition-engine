# IMPACTO® — Universal Document Generation Orchestrator

**Version:** 2.0
**Product:** Economic Impact Intelligence Suite
**Owner:** Global Communication LLC
**Last Updated:** March 2026

---

## EXECUTIVE OVERVIEW

This is the master agent instruction file — the "receita de bolo" (recipe) for orchestrating the complete IMPACTO® Economic Impact Intelligence Suite pipeline. This system transforms raw client documents (Business Plan, Request for Evidence, denial letters, supporting documentation) into a finished, comprehensive 13-module Economic Impact Analysis Report designed to support EB-2 National Interest Waiver (NIW) petitions.

The IMPACTO® system is built on the **Matter of Dhanasar** framework (26 I&N Dec. 884) and generates documents that withstand scrutiny from USCIS AI detection systems by employing natural language variation, real data sources, and reproducible quantitative analysis.

### System Scope

- **Input:** Business Plan + Optional (RFE letter, denial letter, supporting documents)
- **Output:** Bilingual ready-to-file IMPACTO® reports (English and Portuguese-Brazilian)
- **Target:** EB-2 NIW applications across any industry (consulting, tech, medical, culinary, engineering, research, etc.)
- **Methodology:** RIMS II multipliers, IMPLAN data, EPI employment metrics, Dhanasar framework alignment

---

## THE ORCHESTRATION PIPELINE

### STEP 1: Document Intake & Comprehensive Parsing

**Objective:** Extract all relevant data from client-provided documents into a structured format.

**Process:**

1. **Read ALL uploaded documents** in the following priority order:
   - Primary: Business Plan (BP) — the foundation of all financial projections
   - Secondary: Request for Evidence (RFE) — identifies USCIS officer objections
   - Tertiary: Denial Letter — captures reasons for prior denial (if applicable)
   - Quaternary: Supporting documents (market research, credential verification, media mentions, partnership letters, etc.)

2. **Extract Core Business Data:**
   - **Applicant Name & Role:** Full name, job title, responsibilities
   - **Business Name & Legal Structure:** Full legal name, type (sole proprietor, LLC, C-corp, S-corp, partnership)
   - **Business Type & Description:** 2-3 sentence business summary
   - **NAICS Code:** (preliminary — confirmed in Step 2) — the North American Industry Classification System code
   - **Location:** Full address, city, state, MSA (Metropolitan Statistical Area), FIPS code
   - **Founding Year & Tenure:** When business was founded, how long applicant has been owner/manager
   - **Current Revenue:** Most recent available annual revenue (preferably last 2 years of tax returns or audited financials)
   - **Employee Count:** Current number of full-time and part-time employees
   - **Customer Base:** B2B, B2C, hybrid; geographic reach; key customer sectors
   - **Industry Sector:** Healthcare, technology, professional services, hospitality, manufacturing, etc.
   - **Unique Value Propositions:** Patents, proprietary processes, specialized expertise, certifications, brand reputation
   - **Country of Origin:** Applicant's home country (critical for M12 Cultural Impact module)
   - **Languages Spoken:** Primary and secondary languages; business languages
   - **Educational Credentials:** Advanced degrees, specialized certifications, professional licenses
   - **Immigration History:** Years in US, visa history, any prior USCIS interaction

3. **Extract Financial Projections:**
   - **Revenue Projections:** 5-year forward projections (Years 1-5)
   - **Operating Expenses:** Cost of goods sold, operating costs, estimated as % of revenue
   - **Employee Projections:** Expected hiring trajectory (Year 1, Year 2, Year 5)
   - **Profit Margin:** Historical and projected
   - **Capital Investment:** Startup/expansion costs, equipment, facility

4. **If RFE Present — Extract Officer Objections Verbatim:**
   - Read the RFE letter in full
   - For each objection, copy the EXACT language the officer used
   - Flag the specific module(s) that must address each objection
   - Create an RFE Mapping Table (see Step 6)

5. **If Denial Letter Present:**
   - Extract the grounds for denial (EB-1C, NIW, labor cert, etc.)
   - Identify specific deficiencies cited
   - Note whether the case is being refiled or appealed
   - Flag all deficiencies for targeted rebuttal in the report

6. **Flag Data Gaps:**
   - If critical data is missing (e.g., revenue projections, employee count, NAICS code), flag for manual review
   - DO NOT fabricate missing data
   - Create a list of "Required Client Follow-Up" items

**Output of Step 1:** Structured data JSON object containing all extracted fields and a prioritized list of gaps.

---

### STEP 2: NAICS Code & Geographic Research

**Objective:** Confirm the correct NAICS code and conduct industry-specific research to support multiplier selection and Module 1-5 analysis.

**Process:**

1. **Confirm NAICS Code:**
   - Review the preliminary NAICS code from the Business Plan (if provided)
   - Cross-reference against the U.S. Census Bureau NAICS lookup tool (naics.census.gov)
   - Select the 6-digit NAICS code that MOST precisely describes the business's primary activity
   - Document the NAICS code definition and why it was selected
   - Note any confusion with related codes (e.g., 541611 Management Consulting vs. 541612 Marketing Consulting)

2. **Identify Geographic Identifiers:**
   - **MSA (Metropolitan Statistical Area):** Look up the client's city on Census Bureau's MSA reference
   - **FIPS Code:** Identify the 5-digit Federal Information Processing Standard code for the county
   - **State Economic Region:** Document the economic region (e.g., "Southeast", "Great Plains")
   - **Opportunity Zone Status:** Check if the business location is designated as a Qualified Opportunity Zone (QOZ)

3. **Research Industry Size & Growth:**
   - **Industry Output (IMPLAN/BEA):** Find the total industry output in the MSA (in millions)
   - **Employment in Industry:** Total employment in the NAICS code within the MSA
   - **Growth Rate (5-year):** Look up BLS growth projections for the industry
   - **Wage Average:** Mean occupational wage in the industry, by MSA
   - **Job Creation Pace:** Expected new jobs per year in the industry
   - **Industry Maturity:** Is the industry growing, stable, or declining?

4. **Conduct Industry Landscape Research:**
   - **Major Competitors:** List 3-5 major competitors nationally and in the MSA
   - **Market Barriers to Entry:** Capital requirements, regulatory hurdles, skill requirements
   - **Market Consolidation:** Percentage of market held by top 3, top 10 firms
   - **Supply Chain Position:** Upstream suppliers, downstream customers, complementary industries
   - **Regulatory Environment:** Licensing, certifications, compliance costs, regulatory trends
   - **Technology Trends:** AI/automation impact, digitalization, emerging tools

5. **Document Sources:**
   - Bureau of Labor Statistics (BLS) Occupational Outlook Handbook
   - U.S. Census Bureau Economic Census data
   - IMPLAN database (industry-specific estimates)
   - Trade publications, industry reports, market research firms
   - Federal Reserve Economic Data (FRED) for regional indicators

**Output of Step 2:**
- Confirmed NAICS code with rationale
- MSA, FIPS code, geographic identifiers
- Industry research summary (2-3 pages)
- Growth rates, wage data, competitive landscape
- Opportunity Zone designation (if applicable)

---

### STEP 3: Multiplier Selection & Documentation

**Objective:** Select appropriate economic multipliers that will form the foundation of all quantitative analysis in Modules 1-5.

**Critical Note:** All multiplier selection must be defensible, sourced from official government or academic databases, and appropriate to the specific NAICS code and geographic region.

**Process:**

1. **Select RIMS II Type II Multipliers:**
   - **Source:** Bureau of Economic Analysis (BEA), Regional Input-Output Multipliers System (RIMS II)
   - **Purchase/Access:** RIMS II data is available for purchase from BEA (bea.gov), or derived from published state-level tables
   - **Type II Definition:** Type II multipliers include:
     - **Direct Effects:** Initial change in industry output
     - **Indirect Effects:** Inter-industry purchases (industry buys from suppliers)
     - **Induced Effects:** Household spending (employees spend wages locally)
   - **Data to Obtain:**
     - Output Multiplier (Type II): For every $1 of direct output, total output increases by $X
     - Employment Multiplier: For every $1M of direct output, Y jobs are created (direct + indirect + induced)
     - Earnings Multiplier: For every $1 of direct earnings, total earnings increase by $X
     - Value-Added Multiplier: For every $1 of direct value added, total value added increases by $X
   - **MSA/County Specificity:** RIMS II data is customizable by county/MSA, not national — ensure data matches client location
   - **Document the Rationale:** Why these specific multipliers were selected; how they differ from national averages

2. **Cross-Reference IMPLAN Data (if available):**
   - **Source:** Impact Analysis for Planning (IMPLAN), a proprietary input-output model maintained by IMPLAN Group
   - **546 Sectors:** IMPLAN's regional SAM (Social Accounting Matrix) provides detailed multipliers for 546 sectors
   - **Regional Customization:** IMPLAN allows county-level modeling, making it ideal for local impact assessment
   - **Comparison:** Compare IMPLAN multipliers to RIMS II; flag significant divergences and explain
   - **Usage Note:** If IMPLAN data is available for the client location, it may provide superior local-market accuracy

3. **Calculate/Reference EPI Employment Multipliers:**
   - **Source:** Economic Policy Institute (EPI), free public database
   - **Coverage:** 179 private-sector industries
   - **Multiplier Type:** EPI publishes employment multipliers showing total job creation per $1M of spending
   - **Application:** Use EPI data for occupational breakdown and industry-specific employment effects
   - **Cross-Validation:** Compare EPI employment multipliers to RIMS II and IMPLAN; use the median if divergence is <10%

4. **Reference BLS Occupational Multipliers:**
   - **Source:** Bureau of Labor Statistics (BLS), Occupational Employment and Wage Statistics (OEWS)
   - **Data Points:** Mean and median wages by occupation, by MSA
   - **Application:** When applicant will hire specific occupations (e.g., software engineers, accountants), reference BLS wage data
   - **Job Growth:** Reference BLS Occupational Outlook Handbook for projected job growth by occupation
   - **Wage Comparison:** Compare client's projected wages to BLS means; justify if higher/lower

5. **Industry-Specific Adjustments:**
   - **Seasonal Industries:** If the business is highly seasonal, adjust multipliers downward
   - **Import/Export Leakage:** If the business imports significant inputs or sells primarily outside the region, reduce indirect/induced multipliers
   - **Labor Intensity:** If the business is highly labor-intensive vs. capital-intensive, this affects the employment multiplier
   - **Supply Chain Complexity:** Businesses with complex supply chains show higher indirect multipliers; simple supply chains show lower indirect effects

6. **Document All Multiplier Sources:**
   - Create a Multiplier Justification Table with columns:
     - Multiplier Type (Output, Employment, Earnings, Value-Added)
     - NAICS Code
     - MSA/County
     - Value (e.g., 2.45)
     - Source (BEA RIMS II, IMPLAN, EPI, BLS)
     - Year/Vintage of Data
     - Adjustments Applied
     - Rationale for Selection

**Output of Step 3:**
- Confirmed multiplier set (Type II Output, Employment, Earnings, Value-Added)
- Complete multiplier justification table
- Cross-reference validation (RIMS II vs. IMPLAN vs. EPI)
- Occupational wage benchmarks from BLS
- Source documentation for all numbers

---

### STEP 4: Economic Impact Calculations

**Objective:** Calculate direct, indirect, and induced economic impacts for each financial projection year (Years 1-5), using the multipliers selected in Step 3.

**Methodology:** All calculations follow standard input-output (I-O) economics principles as used by BEA, IMPLAN, and EPI.

**Process:**

1. **For Each Year (Year 1 through Year 5):**

   **A. Output Impact:**
   - **Direct Output = Revenue (from BP)**
     - Example: Year 1 Revenue = $2,500,000
   - **Type II Output Multiplier = 2.45** (from Step 3)
   - **Total Output = Direct Output × Type II Output Multiplier**
     - Example: $2,500,000 × 2.45 = $6,125,000
   - **Indirect + Induced Output = Total Output - Direct Output**
     - Example: $6,125,000 - $2,500,000 = $3,625,000

   **Breakdown (Optional but Recommended):**
   - **Indirect Output Share ≈ 40% of secondary effects** (inter-industry purchases)
   - **Induced Output Share ≈ 60% of secondary effects** (household spending)
   - Indirect = $3,625,000 × 0.40 = $1,450,000
   - Induced = $3,625,000 × 0.60 = $2,175,000
   - **Validation:** $2,500,000 + $1,450,000 + $2,175,000 = $6,125,000 ✓

   **B. Employment Impact:**
   - **Direct Employment = Projected headcount (from BP)**
     - Example: Year 1 headcount = 15 employees
   - **Type II Employment Multiplier = 18.3 jobs per $1M direct output** (from Step 3)
   - **Total Employment Impact = Direct Output (in millions) × Employment Multiplier**
     - Example: $2.5M × 18.3 = 45.75 jobs
   - **Indirect + Induced Employment = Total - Direct**
     - Example: 45.75 - 15 = 30.75 indirect/induced jobs

   **Alternative Calculation (if headcount-based multiplier unavailable):**
   - Use industry-standard ratio: approximately 1.2-1.4 indirect/induced jobs per direct job
   - Example: 15 direct × 1.3 = 19.5 indirect/induced jobs
   - Total: 15 + 19.5 = 34.5 jobs (use more conservative estimate)

   **C. Earnings Impact:**
   - **Direct Earnings = Wage bill (average wage × direct employment)**
     - Example: 15 employees × $65,000 avg wage = $975,000
   - **Type II Earnings Multiplier = 1.82** (from Step 3)
   - **Total Earnings = Direct Earnings × Earnings Multiplier**
     - Example: $975,000 × 1.82 = $1,775,500
   - **Indirect + Induced Earnings = Total - Direct**
     - Example: $1,775,500 - $975,000 = $800,500

   **D. Value-Added Impact:**
   - **Direct Value-Added ≈ Revenue × (1 - COGS%)**
     - Example: $2,500,000 × (1 - 0.35) = $1,625,000
   - **Type II Value-Added Multiplier = 2.15** (from Step 3)
   - **Total Value-Added = Direct × Multiplier**
     - Example: $1,625,000 × 2.15 = $3,493,750

2. **Tax Revenue Impacts:**

   **Federal Income Tax (approx. 16.5% of total earnings):**
   - Apply to both business income (corporate tax ~21%) and employee wages (income tax ~15% average)
   - Formula: (Business Net Income × 0.21) + (Total Wage Income × 0.15)
   - Example: If net income Year 1 = $500,000 and total wages = $1,775,500:
     - Federal tax = ($500,000 × 0.21) + ($1,775,500 × 0.15) = $105,000 + $266,325 = $371,325

   **State Income Tax (varies by state; typically 3-8%):**
   - Example: $2,500,000 revenue × 0.05 (state average) = $125,000
   - Varies significantly by state; use actual state rate for client location

   **Local Tax (city/county; typically 1-3%):**
   - Example: $2,500,000 × 0.02 = $50,000
   - Includes city income tax, local sales tax equivalents, property tax (if applicable)

   **Payroll Taxes (Social Security, Medicare; employer + employee = 15.3%):**
   - Applied to total wage income
   - Example: $1,775,500 × 0.153 = $271,863

   **Total Tax Revenue = Federal + State + Local + Payroll**
   - Example: $371,325 + $125,000 + $50,000 + $271,863 = $818,188

3. **Create a Year-by-Year Impact Summary Table:**

   | Metric | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
   |--------|--------|--------|--------|--------|--------|
   | Direct Output | $2.5M | $3.0M | $3.5M | $4.0M | $4.5M |
   | Total Output | $6.1M | $7.4M | $8.6M | $9.8M | $11.0M |
   | Direct Employment | 15 | 18 | 22 | 25 | 28 |
   | Total Employment | 46 | 55 | 68 | 77 | 86 |
   | Direct Earnings | $975K | $1.17M | $1.43M | $1.63M | $1.82M |
   | Total Earnings | $1.78M | $2.14M | $2.61M | $2.97M | $3.32M |
   | Tax Revenue | $818K | $983K | $1.14M | $1.30M | $1.46M |

4. **Cumulative 5-Year Impact:**
   - Sum all annual figures
   - Example:
     - Total Output (5 years) = $42.9M
     - Total Employment (5 years) = 352 job-years
     - Total Earnings (5 years) = $12.72M
     - Total Tax Revenue (5 years) = $5.71M

**Critical Validation:**
- Multiply Direct Revenue by Type II Multiplier; compare to Total Output — should match within 1%
- Compare employment growth trajectory to industry growth rates (BLS) — should be plausible
- Sanity check tax calculations against standard tax rates by state
- Verify all cumulative figures are 5-year sums, not annualized

**Output of Step 4:**
- Year-by-year impact tables (Output, Employment, Earnings, Tax Revenue)
- Cumulative 5-year impacts
- Detailed calculation methodology documented
- All inputs sourced and traceable to Step 1-3

---

### STEP 5: Social, Cultural & Broader Field Impact Assessment (Modules 11-13)

**Objective:** Develop Modules 11, 12, and 13 of the IMPACTO® report, addressing the broader Dhanasar Prong 1(b) and 1(c) criteria: societal welfare improvements, cultural/artistic enrichment, and benefits beyond immediate economic effects.

#### MODULE 11: SOCIAL RETURN ON INVESTMENT (SROI) & SOCIETAL WELFARE

**Framework:** Social Return on Investment (SROI) quantifies non-financial social benefits. Application must be scaled to the client's business size and demonstrable through the applicant's unique role.

**Process:**

1. **Identify Applicable Social Value Categories:**
   - Workforce Development (training, certification, career advancement)
   - Knowledge Transfer (from applicant's expertise, credentials, international experience)
   - Community Resilience (local supply chain, vendor relationships, community investment)
   - Environmental Stewardship (sustainability practices, pollution reduction, energy efficiency)
   - Health & Safety Improvements (occupational health, safety innovation, health-focused products/services)
   - Disadvantaged Population Reach (services to underserved communities, accessibility, affordability)

2. **Quantify Workforce Development:**
   - **Direct Employees:** Count number of employees trained, certified, or advanced per year
     - Example: 15-person company with internal training program trains 8 employees/year in new skills
   - **Industry Standard:** Entry-level positions command $35K-45K; mid-level positions $55K-75K
   - **Wage Premium from Training:** If employee advances from $45K to $60K, social value ≈ $15K × employee count
   - **Cumulative 5-Year:** 8 employees/year × $15K wage premium × 5 years = $600K social value from wage advancement
   - **Certification Programs:** If applicant sponsors industry certifications (PMP, AWS, etc.), each cert = $3K-8K value
     - Example: 5 employees × $5K cert = $25K/year × 5 years = $125K

3. **Quantify Knowledge Transfer:**
   - **Source:** Applicant's educational credentials, work experience, international background, patents, publications
   - **Mechanism:** How does applicant share knowledge? (formal training, mentoring, innovation in company practices, industry participation)
   - **Multiplier Effect:** For every person the applicant directly trains, how many others benefit indirectly?
     - Example: Applicant is former biotech researcher. Trains 2 scientists/year. Each trained scientist trains 3 technicians. = 2 × 3 = 6 indirect beneficiaries per applicant
   - **Knowledge Value:** Industry research shows each knowledge transfer event worth $2K-10K depending on complexity
   - **5-Year Calculation:** 5 years × 2 direct trainees × $5K per trainee = $50K + 5 years × 6 indirect beneficiaries × $2K = $60K
   - **Total Knowledge Transfer Value:** $110K

4. **Quantify Community Resilience:**
   - **Local Procurement:** What % of business purchases come from local suppliers?
     - Example: 40% of $2.5M supplier spend = $1M local. Each $1 local spend generates $0.50 indirect benefit (local jobs, tax base)
     - 5-year total local procurement = $5M × 0.40 = $2M × $0.50 multiplier = $1M community resilience value
   - **Vendor Network:** How many local vendors does the business support?
     - Example: Partners with 8 local vendors; each supports 2-3 jobs. 8 vendors × 2.5 jobs × $50K avg wage = $1M total vendor payroll supported
   - **Community Involvement:** Donations, sponsorships, volunteer hours
     - Example: $5K/year to local nonprofits + 200 volunteer hours/year × $30/hour = $11K/year × 5 = $55K

5. **Quantify Environmental Impact:**
   - **Industry Type Determines Environmental Footprint:**
     - Manufacturing: Measure waste reduction, energy efficiency, emissions
     - Services: Measure digital transformation (paperless, reduced commuting), sustainable practices
     - Food/Hospitality: Measure sustainable sourcing, waste reduction, local sourcing
   - **Methodology:** Compare applicant's company environmental performance to industry benchmarks
     - Example: Food service business with 60% local sourcing vs. industry average 20%. Difference: 40% × $1M annual spend = $400K premium local spending × 0.40 multiplier = $160K environmental/community value per year × 5 = $800K
   - **Carbon Savings (if applicable):**
     - Measure CO2 equivalent reduced. Example: 10 tons CO2 saved/year. Social value of carbon ≈ $150-200/ton (EPA social cost of carbon). 10 tons × $175 × 5 years = $8,750

6. **Calculate 5-Year SROI:**
   - Sum all social value categories:
     - Workforce Development: $600K
     - Knowledge Transfer: $110K
     - Community Resilience: $1M
     - Environmental Impact: $800K
     - **Total Social Value: $2.51M**
   - Calculate Return: $2.51M social value / $500K business investment (COGS, equipment, overhead) = **5.02:1 SROI**
   - Interpretation: For every $1 invested, $5.02 of social value is created

7. **Module 11 Narrative:**
   - Lead with SROI ratio and total social value
   - Explain each category with specific examples from applicant's business
   - Cite industry benchmarks and government sources
   - Connect to Dhanasar: "This company creates substantial improvements in societal welfare through workforce development, knowledge transfer, and community resilience."

**Module 11 Output:**
- SROI calculation table (Value Category | Annual | 5-Year)
- Total 5-Year Social Value and SROI ratio
- Narrative explaining each category
- Sources and methodology

---

#### MODULE 12: CULTURAL & INTERNATIONAL IMPACT

**Framework:** Demonstrate how the applicant's international origin, expertise, and cross-cultural role creates "cultural or artistic enrichment" and facilitates bilateral economic relations.

**Process:**

1. **Assess International Expertise Transfer:**
   - **Question:** What innovations, practices, or knowledge does the applicant bring from their home country?
   - **Examples:**
     - Tech founder from India: Agile development practices, offshore cost optimization, subcontinent market expertise
     - Chef from France: Classical culinary techniques, wine pairing expertise, Michelin-standard food culture
     - Engineer from Germany: Precision manufacturing, ISO standards, German technical innovation
     - Medical consultant from Singapore: Asia-Pacific healthcare innovation, telemedicine, medical tourism facilitation
   - **Quantify:** How many employees/clients benefit from this knowledge?
     - Example: French chef trains 12 sous chefs/year in French classical techniques. 12 × 5 years = 60 chefs trained. Each carries this knowledge forward throughout career.
   - **Market Impact:** Does this knowledge create competitive advantage or market expansion?
     - Example: German manufacturing expertise attracts $500K+ additional contracts from clients seeking German-standard precision

2. **Assess Bilateral Trade Facilitation:**
   - **Home Country:** Applicant's origin
   - **Trade Volume USA-[Country]:** Look up Census Bureau trade data (USA Trade Online database)
     - Example: USA-Vietnam trade = $111.8B annually (2023)
   - **Company's Role:** Does applicant facilitate trade between US and home country?
     - Example: Logistics consulting firm specializes in Vietnam-USA supply chains, connects 12 US manufacturers with Vietnam suppliers
     - Total trade facilitated: 12 manufacturers × $2M avg contract = $24M bilateral trade enabled annually
     - 5-year cumulative: $120M bilateral trade facilitation
   - **Narrative:** "The applicant facilitates [X] million in USA-[Country] bilateral trade, supporting jobs and economic relationship on both sides of the Pacific."

3. **Assess Diaspora Network Strengthening:**
   - **Home Country Diaspora in MSA:** Look up Census Bureau American Community Survey (ACS) data for population with ancestry from applicant's country
     - Example: Houston, Texas has 142,000 Vietnamese-Americans (2020 Census)
   - **Company's Role:** Does the company serve, employ, or strengthen the diaspora community?
     - Example: Vietnamese restaurant employs 25 Vietnamese immigrants, serves 15,000+ Vietnamese customers annually, preserves culinary heritage, bridges cultural integration
   - **Multiplier:** Diaspora strength correlates with bilateral trade, cultural preservation, and political soft power
     - Example: Vietnamese restaurant + consulting firm + import/export business = ecosystem strengthening Vietnamese-American community

4. **Assess Cross-Cultural Workforce Integration:**
   - **Immigrant Employees:** How many foreign-born employees does the company employ?
     - Example: 8 of 15 employees are first-generation immigrants
   - **Integration Model:** Does the company facilitate immigrant employment, language support, credential recognition?
     - Example: Company sponsors H-1B/EB-3, recognizes foreign credentials, provides ESL support, offers work visas
     - Narrative: "The company serves as an integration pathway for [X] foreign-born professionals, facilitating their entry into the US economy and labor market."
   - **Long-term Benefit:** Immigrants who enter through company sponsorship often become entrepreneurs, investors, and civic leaders

5. **Cultural/Artistic Enrichment (if applicable):**
   - **Direct cultural business:** If applicant operates in arts, entertainment, culinary, or cultural sector:
     - Example: Museum director, film producer, chef, musician, architect, fashion designer
   - **Quantify participation:** Number of people served annually, attendance, reach
   - **Unique cultural value:** What is distinct/irreplaceable about applicant's cultural contribution?
   - **Preservation angle:** Does applicant preserve or advance cultural traditions?

6. **Module 12 Narrative:**
   - Lead with bilateral trade volume or diaspora impact
   - Explain applicant's unique role in facilitating USA-[Country] economic/cultural relationship
   - Cite Census Bureau ACS data for diaspora population
   - Connect to Dhanasar: "The applicant demonstrates cultural and economic benefits that extend beyond the immediate company to the broader USA-[Country] relationship."

**Module 12 Output:**
- Applicant's country of origin and key expertise/innovations
- Bilateral trade volume (USA-[Country])
- Diaspora population in MSA
- Specific trade/cultural facilitation examples
- Cross-cultural workforce integration metrics

---

#### MODULE 13: BROADER FIELD & INDUSTRY ECOSYSTEM ADVANCEMENT

**Framework:** Universal for any business. Demonstrate how the applicant's success benefits the entire industry, economy, and society — extending beyond "immediate vicinity" and "attenuated benefits."

**Process:**

1. **Field-Wide Innovation Potential:**
   - **Question:** Does the applicant introduce new processes, technologies, or business models to their field?
   - **Examples:**
     - Tech: Machine learning algorithms, cloud architecture, cybersecurity innovations
     - Medical: New treatment protocols, diagnostic innovations, telemedicine platforms
     - Manufacturing: Automation, lean manufacturing, sustainability innovations
     - Consulting: New methodologies, industry frameworks, disruption models
   - **Evidence:** Patents, publications, awards, industry recognition
     - Example: Applicant holds 3 patents in AI-powered supply chain optimization. Patents are licensed to 5 companies. Field-wide benefit: $10M+ in productivity gains across licensed implementations
   - **Spillover:** When one company innovates, competitors must match or exceed (positive competition escalation)
     - Example: Applicant's company adopts German lean manufacturing. Competitors adopt similar. Entire industry becomes more efficient. Result: 10-15% productivity gain across sector

2. **Industry Ecosystem Strengthening:**
   - **Supply Chain Position:** Where does applicant's company sit in the supply chain?
     - Upstream supplier: Strengthens availability of critical inputs for downstream industries
     - Distribution/Logistics: Improves access and efficiency for customers
     - Component manufacturer: Critical to larger industrial ecosystem
   - **Network Density:** How many other businesses depend on or partner with applicant's company?
     - Example: Logistics consulting firm serves 40 manufacturing clients, 30 import/export clients, 15 tech companies = 85-firm ecosystem
   - **Ecosystem Resilience:** If applicant's company fails, what breaks in the ecosystem?
     - Example: Specialized software vendor for construction industry; if they go under, 200+ construction firms lose critical tools = high ecosystem impact
   - **Narrative:** "The applicant's company is a critical node in the [X] industry ecosystem, strengthening resilience and interconnectedness across [Y] dependent firms."

3. **National Resilience Contribution:**
   - **Domestic Supply Chain Strengthening:** Does applicant's company reduce dependence on imports or overseas supply chains?
     - Example: Advanced manufacturing company sources 80% domestically vs. industry average 50%. Difference: 30% × $5M supply spend = $1.5M incremental domestic sourcing annually
     - Narrative: "The applicant strengthens national supply chain resilience by increasing domestic sourcing by $1.5M annually."
   - **Strategic Industry:** Is the applicant's industry designated as "strategic" by government (defense, semiconductors, pharmaceuticals, critical minerals)?
     - Example: Semiconductor company in US serves DoD supply chain. Applicant's company is DoD supplier. National resilience value: significant
   - **Job Creation in Opportunity Zones:** If located in designated Opportunity Zone, job creation has federal tax incentive consequences
   - **Regional Economic Diversification:** Does applicant's company diversify regional economy?
     - Example: Healthcare IT company brings high-wage tech jobs to economically distressed region. Diversifies economy away from manufacturing decline

4. **Beyond-Commercial-Interest Evidence Synthesis:**
   - **Government Alignment:** Does applicant's work align with federal/state priorities?
     - Example: Clean energy, biotech, infrastructure, healthcare, education, national security
   - **Competitive Advantage:** Does applicant give USA competitive advantage vs. other nations?
     - Example: AI researcher; if they go to Canada/Europe, that nation gains competitive AI talent. USA loses
   - **Peer Recognition:** Industry awards, academic citations, professional leadership
   - **Market Leadership:** Is applicant among top 10% of companies in their field?
   - **Quantifiable Advantage:** What is lost if applicant and their firm do not stay in USA?

5. **Field-Wide Contribution Matrix:**
   Create a table showing applicant's impact across the industry:

   | Impact Area | Specific Contribution | Beneficiary Count | National/Sector Value |
   |-------------|----------------------|-------------------|----------------------|
   | Innovation | 3 patents in AI supply chain | 5 licensees, 100+ firms indirectly | $10M+ efficiency gains |
   | Standards | Developed ISO-compliant process | 40 supply chain partners | Industry standardization |
   | Workforce | Trains specialists in field X | 60 trained professionals/5yr | Addresses labor shortage |
   | Technology | Adopts cutting-edge [tool] | 200 downstream customers | Market-wide capability gain |
   | Resilience | 30% domestic sourcing | 50 suppliers, 500 supply chain jobs | Supply chain robustness |

6. **Module 13 Narrative:**
   - Lead with largest impact area (innovation, ecosystem strengthening, or resilience)
   - Use quantified examples from matrix
   - Connect to Dhanasar: "The applicant's work extends substantially beyond the immediate business to strengthen the entire [X] industry and national economic resilience."
   - Emphasize "beyond commercial interest"

**Module 13 Output:**
- Field-wide innovation examples with evidence (patents, licenses, adoption)
- Ecosystem strengthening metrics (firm count, supply chain position)
- National resilience contribution (domestic sourcing, supply chain robustness)
- Field-wide contribution matrix
- Government alignment and competitive advantage evidence

---

### STEP 6: RFE/Denial Letter Mapping (If Applicable)

**Objective:** Create a comprehensive mapping between each RFE officer objection and the specific IMPACTO® modules and evidence that address it.

**Critical Note:** RFE objections must be addressed with EXACT specificity. Generic responses fail. Quantified rebuttals win.

**Process:**

1. **Extract All Officer Objections:**
   - Read the RFE letter in full
   - For each objection, copy the EXACT language the officer used (in quotation marks)
   - Assign each objection to one or more IMPACTO® modules
   - Note whether objection is "substantive" (attacks the claim) or "procedural" (attacks the evidence)

2. **Create RFE Mapping Table:**

   | Objection (Officer Language) | Substantive or Procedural? | Primary Module(s) | Evidence/Rebuttal | Citation |
   |--------|--------|--------|--------|--------|
   | "The applicant's economic impact appears speculative and unsupported by documented evidence." | Substantive | M1, M2, M3, M9 | Provide RIMS II multiplier documentation, BEA source data, input-output model explanation, sensitivity analysis with conservative/base/optimistic scenarios | BEA RIMS II system documentation + sensitivity analysis table |
   | "The claimed benefits are too attenuated to support a finding of national importance." | Substantive | M1, M5, M13 | Quantify total 5-year economic impact ($42.9M output, $5.71M tax revenue), show industry ecosystem impact (85-firm supply chain), demonstrate how applicant's innovation benefits entire field | Ecosystem matrix + field-wide innovation evidence |
   | "The applicant's role is limited to a single business; benefits do not extend beyond the immediate company." | Substantive | M5, M7, M13 | Demonstrate supply chain multiplier effects (indirect + induced = $3.6M+ annually), show industry leadership and innovation spillover, quantify bilateral trade facilitation if applicable | Ecosystem impact + multiplier documentation |
   | "No evidence of workforce development or societal welfare benefits." | Substantive | M11 | Provide SROI calculation showing $2.51M 5-year social value, document employee training programs, wage advancement metrics, community involvement, environmental stewardship | SROI calculation table + workforce development metrics |
   | "No cultural enrichment demonstrated." | Substantive | M12 | Document applicant's home country expertise transfer, bilateral trade facilitation, diaspora community strengthening, cross-cultural workforce integration | Bilateral trade volume + diaspora population data + integration examples |
   | "No special or unique ability demonstrated; any business owner could achieve this." | Substantive | M1, M4, M5, M6, M8 | Highlight applicant's specific credentials, innovations, patents, industry awards, market position, and irreplaceable role in the company's success | Credentials + patents/awards + company performance metrics |
   | "Projections not supported by historical performance." | Procedural | M2, M9 | Provide 3-year historical financials, show trend analysis supporting projections, include sensitivity analysis with downside scenarios, explain conservative assumptions | Historical tax returns + projection methodology + sensitivity analysis |
   | "No demonstrated demand for this business or its services." | Substantive | M2, M7 | Provide customer testimonials, letters of intent, signed contracts, market research data, customer base size and growth, competitive positioning | Customer letters + market research + sales pipeline |

3. **For Each Objection, Provide Specific Rebuttal:**

   **Example Objection:** "Benefits too attenuated."

   **Rebuttal Strategy:**
   1. **Direct rebuttal:** Quantify total 5-year impact = $42.9M economic output, not attenuated but substantial
   2. **Multiplier explanation:** RIMS II Type II multipliers are officially recognized by federal government (BEA); indirect/induced effects are standard economic methodology
   3. **Ecosystem proof:** Show that applicant's company is central node in supply chain serving 85+ firms; benefits are direct to those firms
   4. **Field-wide innovation:** If applicant has patents or innovations adopted by competitors, this demonstrates non-attenuated field-wide benefit
   5. **Government priority alignment:** If business serves strategic sector (biotech, clean energy, defense), benefits align with government goals (non-attenuated policy importance)
   6. **Quantified counter-example:** "IMPLAN modeling shows that $1M in output from this industry creates $2.45M total economic activity. The applicant's $42.9M 5-year output is not attenuated; it is a direct application of BEA-validated economic methodology."

4. **Procedural Objections:**
   - If officer says "evidence not adequate," respond by providing the requested evidence
   - If officer says "projections speculative," respond with sensitivity analysis (best-case, base-case, worst-case)
   - If officer says "expertise not demonstrated," respond with credentials, awards, publications

5. **Common RFE Patterns & Solutions:**

   | Common Objection | Root Cause | Solution |
   |--------|--------|--------|
   | "Too attenuated" | No quantification of indirect/induced effects | Provide RIMS II multiplier documentation and ecosystem impact matrix |
   | "Speculative" | Projections not supported by historical data | Provide 3-year tax returns + sensitivity analysis with downside scenarios |
   | "Limited to company" | No demonstration of field-wide or ecosystem impact | Add Module 13 with ecosystem strengthening, innovation spillover, supply chain impact |
   | "No societal welfare" | M11 module weak or missing | Strengthen SROI calculation with workforce development, community resilience, environmental metrics |
   | "No cultural value" | M12 module missing or weak | Add bilateral trade quantification, diaspora community data, knowledge transfer evidence |
   | "Not unique" | No demonstration of applicant's individual role | Highlight credentials, patents, awards; show how company depends on applicant's expertise |
   | "Limited documentation" | Vague references without sources | Add precise citations: "BEA RIMS II [state], [NAICS], [MSA]", "BLS OEWS [MSA], [SOC code]", "Census ACS [year], [ancestry category]" |

**Output of Step 6:**
- RFE Mapping Table (all objections addressed)
- Specific rebuttal language for each objection
- Evidence/documentation for each rebuttal
- Module assignment and cross-reference

---

### STEP 7: Configuration File Population

**Objective:** Populate the `client_config_template.json` file with all calculated values from Steps 1-6.

**Process:**

1. **Obtain Template:** Access `client_config_template.json` (part of IMPACTO® system)

2. **Populate Client Section:**
   ```json
   "client": {
     "name": "[Full Name]",
     "business_name": "[Legal Business Name]",
     "business_type": "[Business Description]",
     "role": "[Job Title]",
     "naics_code": "[6-digit NAICS]",
     "country_of_origin": "[Home Country]",
     "location": {
       "address": "[Street Address]",
       "city": "[City]",
       "state": "[State Code]",
       "msa": "[MSA Name]",
       "fips_code": "[5-digit FIPS]",
       "opportunity_zone": true/false
     },
     "credentials": {
       "degrees": ["[Degree 1]", "[Degree 2]"],
       "certifications": ["[Cert 1]", "[Cert 2]"],
       "languages": ["[Language 1]", "[Language 2]"],
       "patents": "[Number]",
       "publications": "[Number]"
     }
   }
   ```

3. **Populate Financial Section:**
   ```json
   "financials": {
     "current_revenue": [number],
     "current_employees": [number],
     "projections": {
       "year_1": {"revenue": [number], "employees": [number]},
       "year_2": {"revenue": [number], "employees": [number]},
       ...
     },
     "tax_returns": "[Years included, e.g., 2021-2023]"
   }
   ```

4. **Populate Multiplier Section:**
   ```json
   "multipliers": {
     "source": "[RIMS II / IMPLAN / EPI]",
     "naics": "[6-digit NAICS]",
     "msa": "[MSA Name]",
     "type_ii_output": [number],
     "employment_per_million": [number],
     "earnings_multiplier": [number],
     "value_added_multiplier": [number],
     "documentation": "[Source citation]"
   }
   ```

5. **Populate Impact Section (from Step 4):**
   ```json
   "economic_impacts": {
     "year_1": {
       "direct_output": [number],
       "total_output": [number],
       "direct_employment": [number],
       "total_employment": [number],
       "total_earnings": [number],
       "tax_revenue": [number]
     },
     ...
     "cumulative_5_year": {
       "total_output": [number],
       "total_employment": [number],
       "total_earnings": [number],
       "total_tax_revenue": [number]
     }
   }
   ```

6. **Populate Social/Cultural Section:**
   ```json
   "impact_modules": {
     "module_11_sroi": {
       "workforce_development": [number],
       "knowledge_transfer": [number],
       "community_resilience": [number],
       "environmental_impact": [number],
       "total_social_value": [number],
       "sroi_ratio": "[X:1]"
     },
     "module_12_cultural": {
       "international_expertise": "[Description]",
       "bilateral_trade_volume": [number],
       "diaspora_population": [number],
       "cultural_contributions": "[Description]"
     },
     "module_13_field": {
       "innovation_patents": [number],
       "ecosystem_firm_count": [number],
       "supply_chain_impact": "[Description]",
       "field_wide_benefit": "[Description]"
     }
   }
   ```

7. **Populate RFE Section (if applicable):**
   ```json
   "rfe_mapping": [
     {
       "objection": "[Officer's exact language]",
       "module": "[Module number]",
       "rebuttal": "[Specific quantified response]",
       "evidence": "[Citation or document reference]"
     },
     ...
   ]
   ```

8. **Validation Checklist:**
   - All required fields populated (no null values)
   - All numbers are consistent across modules (e.g., Year 1 revenue appears same in financials, economic_impacts, and calculations)
   - All source citations are complete (which RIMS II variant, which BLS table, etc.)
   - All multipliers are documented with specific source
   - All employment numbers match headcount from BP
   - All revenue numbers match financial projections from BP
   - NAICS code is 6 digits
   - FIPS code is 5 digits
   - State code is 2 letters
   - All dates are in YYYY format
   - All currency is in USD
   - All percentages are expressed as decimals (0.05 for 5%)
   - SROI ratio is expressed as "X:1" format
   - No fabricated data — all values traceable to original documents or official sources

**Output of Step 7:**
- Completed `client_config_template.json` file
- Validation checklist passed (100% complete, all cross-references verified)

---

### STEP 8: Document Generation

**Objective:** Execute the IMPACTO® document generation system to produce bilingual (EN and PT-BR) reports.

**Process:**

1. **System Requirements:**
   - `build_impacto_universal.js` script (Node.js executable)
   - `client_config_template.json` (populated from Step 7)
   - `templates/` directory (contains 13 module templates)
   - `styles/` directory (contains Pandoc/LibreOffice style sheets)
   - Output directory specified

2. **Execute Build Command:**
   ```bash
   node build_impacto_universal.js \
     --config ./client_config_template.json \
     --language en \
     --output-dir ./output_en/

   node build_impacto_universal.js \
     --config ./client_config_template.json \
     --language pt \
     --output-dir ./output_pt/
   ```

3. **Build Process (Expected Sequence):**
   - Parse config file
   - Load 13 module templates
   - Populate templates with client data
   - Generate cross-references and table of contents
   - Run Pandoc conversion to DOCX format
   - Apply style sheets (fonts, colors, margins, headers/footers)
   - Generate EN and PT-BR versions in parallel

4. **Output Files:**
   - EN: `IMPACTO_[ClientName]_Economic_Impact_Analysis_EN.docx`
   - PT-BR: `IMPACTO_[ClientName]_Analise_Impacto_Economico_PT.docx`

5. **File Structure:**
   Each document contains:
   - Cover page with client name, business, date, version
   - Executive Summary (1 page)
   - Table of Contents
   - 13 Modules (each 2-4 pages)
   - Appendices (data tables, multiplier documentation, RFE mapping)

**Output of Step 8:**
- Two completed DOCX files (EN and PT-BR)
- File sizes and page counts confirmed

---

### STEP 9: Quality Assurance & Final Review

**Objective:** Validate document completeness, consistency, and readiness for filing.

**Validation Checklist:**

1. **Structural Validation:**
   - [ ] All 13 modules present
   - [ ] Each module has title, introduction, data, tables, narrative conclusion
   - [ ] Cross-module references are correct (e.g., Module 2 correctly references Module 1 data)
   - [ ] Table of Contents is auto-generated and accurate
   - [ ] Executive Summary captures key findings

2. **Quantitative Validation:**
   - [ ] Year 1 revenue in M2 matches BP projection
   - [ ] Year 1 revenue × Type II multiplier = Total Output in M3
   - [ ] Employment impact calculated correctly (revenue/million × employment multiplier)
   - [ ] Cumulative 5-year figures are sums, not averages
   - [ ] Tax calculations are internally consistent
   - [ ] SROI ratio matches total social value / investment
   - [ ] All cross-module numbers align (same figures in M1, M3, M4, etc.)

3. **Dhanasar Framework Validation:**
   - [ ] Prong 1(a): Economic effects clearly demonstrated (M1-M5)
   - [ ] Prong 1(b): Societal welfare improvements documented (M11)
   - [ ] Prong 1(c): Cultural/artistic enrichment addressed (M12)
   - [ ] Prong 2: Applicant well-positioned to advance (M4-M8)
   - [ ] Prong 3: On balance beneficial (M1, M13, conclusion)
   - [ ] "Substantial merit and national importance" language used throughout

4. **RFE Address (if applicable):**
   - [ ] Every officer objection is addressed
   - [ ] Each rebuttal is quantified and specific
   - [ ] Officer's exact language is quoted in response
   - [ ] Evidence is cited (module number, page number, specific table)
   - [ ] No generic responses ("we disagree")

5. **Language & Professional Style:**
   - [ ] No obvious typos or grammatical errors
   - [ ] Sentence structure varied (not all sentences same length)
   - [ ] Technical terms defined on first use
   - [ ] Passive and active voice mixed (not all passive)
   - [ ] No jargon without explanation
   - [ ] Professional tone throughout
   - [ ] USCIS officer language used (e.g., "broadly enhance societal welfare", "substantial merit")

6. **Source Documentation:**
   - [ ] Every claim supported by citation or reference
   - [ ] Multipliers sourced from BEA, IMPLAN, or EPI (not invented)
   - [ ] Industry data sourced from BLS, Census, or trade publications
   - [ ] No unsourced assertions
   - [ ] Bibliography included

7. **AI Detection Readiness (ATLAS/ATA/VIBE):**
   - [ ] Sentence length varies (minimum 10% short <15 words, minimum 10% long >30 words)
   - [ ] Paragraph length varies (not all 3-4 sentences)
   - [ ] Technical vocabulary mixed with common words (not all jargon)
   - [ ] Real data sources cited (BEA RIMS II, BLS OEWS, Census, etc.)
   - [ ] Specific numbers and percentages (not round figures)
   - [ ] Natural narrative flow (not formulaic templates)
   - [ ] No repetitive phrases ("The applicant" appears varied)

8. **Final Sign-Off:**
   - [ ] All validation checks passed
   - [ ] Document reviewed by subject-matter expert (if available)
   - [ ] Client approved final version
   - [ ] File naming conventions followed
   - [ ] File metadata updated (author, title, subject)

**Output of Step 9:**
- Quality Assurance Report (pass/fail for each check)
- Any flagged issues with recommended corrections
- Sign-off approval

---

## CRITICAL SYSTEM RULES

### Rule 1: NO FABRICATED DATA
- Every number must come from:
  - Client's Business Plan (revenue, employee projections)
  - Official government databases (BEA, BLS, Census, IMPLAN)
  - Published academic research
  - Client-provided third-party documentation (customer letters, market research)
- **If data cannot be sourced**, flag it for manual review and do not proceed
- **Never invent multipliers, employment figures, or economic data**

### Rule 2: ALL MULTIPLIERS MUST BE SOURCED
- RIMS II: Cite specific state, NAICS code, MSA, year of data
  - Example: "BEA RIMS II, State of Texas, NAICS 541612, Houston-Galveston MSA, 2022"
- IMPLAN: Cite county, sector number, year
  - Example: "IMPLAN, Harris County, Texas, Sector 256, 2023"
- EPI: Cite industry code and year
  - Example: "Economic Policy Institute, Industry 5416 Management Consulting, 2023"
- BLS: Cite occupation code, MSA, year
  - Example: "BLS OEWS, SOC 13-1111, Houston MSA, 2023"
- **Do not use national averages for local analysis** — multipliers must be region-specific

### Rule 3: REVENUE PROJECTIONS FROM CLIENT BP ONLY
- Extract revenue projections DIRECTLY from the Business Plan's financial section
- If BP does not include explicit projections, request them from client
- **Never adjust or "improve" client's projections** — use their numbers as provided
- If projections appear unrealistic, flag for client review but don't invent alternatives

### Rule 4: ALWAYS USE MATTER OF DHANASAR FRAMEWORK
- Every module must connect to one or more Dhanasar prongs:
  - Prong 1(a): Economic effects (Modules 1-5)
  - Prong 1(b): Societal welfare (Module 11)
  - Prong 1(c): Cultural/artistic enrichment (Module 12)
  - Prong 2: Well-positioned (Modules 4-8)
  - Prong 3: On balance beneficial (Modules 1, 13, Conclusion)
- Use Dhanasar language explicitly in narrative
- Reference Dhanasar framework in executive summary and conclusion

### Rule 5: EVERY MODULE CONNECTS TO "SUBSTANTIAL MERIT & NATIONAL IMPORTANCE"
- No module should be standalone or disconnected
- Each module must include closing paragraph explaining how it contributes to "substantial merit and national importance" finding
- Example ending: "This analysis demonstrates that [Applicant]'s business creates substantial merit through [specific economic/social/cultural effect] and contributes to national importance by [specific reason]."

### Rule 6: USE USCIS OFFICER LANGUAGE
- Learn and use officer language from RFE letters and EB-2 NIW denials:
  - "Broadly enhance societal welfare"
  - "Cultural or artistic enrichment"
  - "Benefits too attenuated"
  - "Limited to the applicant's company"
  - "National interest"
  - "Substantial merit"
  - "Well-positioned to advance"
  - "Waive labor certification requirement"
- Use this language naturally in rebuttals and narrative
- Shows understanding of USCIS evaluation criteria

### Rule 7: WITHSTAND USCIS AI DETECTION SCRUTINY
- USCIS uses AI systems (ATLAS, ATA, VIBE) to detect AI-generated content
- **To evade detection:**
  - Vary sentence length (mix short and long sentences)
  - Vary paragraph length (mix 2-sentence and 6-sentence paragraphs)
  - Use specific numbers with decimal places (not round figures)
  - Cite real government databases (BEA, BLS, Census — not fabricated sources)
  - Use natural narrative flow (not templated language)
  - Mix active and passive voice
  - Define technical terms (show domain knowledge)
  - Include unexpected details (specific customer names, regional quirks, personal anecdotes)
  - Avoid repetitive phrases — change wording for same concept
  - Example: Don't write "The applicant" 50 times; use "The applicant", "the founder", "the business owner", "[Name]" randomly

### Rule 8: ALL CALCULATIONS MUST BE REPRODUCIBLE & DEFENSIBLE
- Every number in the report must have a documented source and clear methodology
- Example defensibility test: "A USCIS analyst should be able to look at our multipliers, apply them to the client's revenue, and arrive at exactly our numbers in 10 minutes"
- Include methodology sections in each module
- Include a full Appendix with all input data, multiplier sources, and calculation steps
- Never skip steps or abbreviate methodology — show all work

---

## DHANASAR FRAMEWORK REFERENCE

### Matter of Dhanasar (26 I&N Dec. 884)

**Three Prongs to Show Eligibility:**

**PRONG 1: SUBSTANTIAL MERIT & NATIONAL IMPORTANCE**

Must show that the endeavor has substantial merit and national importance:

(a) **Economic Effects on the Economy**
- Evidence must show how the endeavor will benefit the US economy
- Must go beyond personal economic gain to applicant
- Modules addressing: M1 (Economic Impact Overview), M2 (Revenue & Growth), M3 (Output Impact), M4 (Employment Impact), M5 (Tax Revenue Impact)
- USCIS language: "The endeavor benefits the US economy through [specific economic mechanism]"

(b) **Societal Welfare Improvements**
- Evidence must show how the endeavor improves broader societal welfare
- Not limited to applicant's company; must extend to broader society
- Examples: workforce development, community health improvements, environmental stewardship, education benefits
- Module addressing: M11 (Social Return on Investment & Workforce Development)
- USCIS language: "The endeavor broadly enhances societal welfare by [specific mechanism]"

(c) **Cultural or Artistic Enrichment**
- Evidence must show contribution to cultural, artistic, educational, or scientific enrichment
- Includes international cultural facilitation
- Module addressing: M12 (Cultural & International Impact)
- USCIS language: "The endeavor provides cultural or artistic enrichment through [specific mechanism]"

(d) **Alignment with Government Priorities**
- Evidence showing applicant's endeavor aligns with federal priorities
- Examples: clean energy, biotech, national defense, healthcare innovation
- Implicit throughout all modules
- USCIS language: "The endeavor aligns with national priorities in [sector] by [specific mechanism]"

**PRONG 2: WELL-POSITIONED TO ADVANCE THE ENDEAVOR**
- Evidence must show applicant is uniquely positioned to advance the endeavor
- Must demonstrate special ability, expertise, or role
- Cannot be generic; must be specific to applicant
- Modules addressing: M4 (Applicant Role & Market Position), M5 (Competitive Advantage), M6 (Proprietary Systems/IP), M8 (Applicant Credentials & Background)
- USCIS language: "The applicant is exceptionally well-positioned to advance this endeavor because [specific reason tied to credentials/innovation/market position]"

**PRONG 3: ON BALANCE, BENEFICIAL TO WAIVE JOB OFFER/LABOR CERTIFICATION REQUIREMENT**
- Even if Prongs 1 & 2 met, must still show that waiving job offer requirement is beneficial to US
- Modules addressing: M1 (Summary), M13 (Broader Field & Industry Ecosystem)
- USCIS language: "On balance, it would be beneficial to the US to waive the job offer/labor certification requirement for this applicant because [specific reason]"

---

## COMMON RFE OBJECTION PATTERNS & SOLUTIONS

| Officer Objection | Root Problem | Which Modules Address | Specific Solution |
|--------|--------|--------|--------|
| "Benefits too attenuated to national interest" | Economic impact is claimed but not quantified; feels theoretical | M1, M2, M5, M13 | Provide RIMS II Type II multiplier documentation showing how indirect/induced effects are calculated. Quantify total 5-year impact ($42.9M output, for example). Show supply chain ecosystem (85+ firms) demonstrating that benefits extend beyond applicant's company. |
| "Impact limited to applicant's company; benefits do not extend beyond immediate vicinity" | No demonstration of ecosystem, supply chain, or field-wide impact | M5, M7, M13 | Demonstrate supply chain relationships (# of suppliers, # of customers, $ value). Show field-wide innovation spillover (patents licensed, process improvements adopted by competitors). Quantify indirect employment creation (job-years). |
| "No evidence of societal welfare improvements; economic impact is only for applicant's profit" | Module 11 missing or weak | M11 | Provide detailed SROI calculation showing non-financial social value. Document workforce development programs, wage advancement metrics, community engagement, environmental stewardship. Quantify: # employees trained, $ wage increases, community contributions, etc. |
| "No cultural enrichment demonstrated" | Module 12 missing or weak | M12 | Document applicant's home country origin and international expertise. Quantify bilateral trade volume (USA-[Country]). Provide Census ACS data for diaspora population in MSA. Show how applicant's business facilitates cultural/economic integration. |
| "Projections are speculative and not supported by documented historical performance" | No historical financials provided; projections seem invented | M2, M9 | Provide 3-year historical tax returns or audited financials. Show historical revenue growth trajectory. Include sensitivity analysis showing best-case, base-case, worst-case scenarios. Explain conservative assumptions (e.g., "projections assume 7% annual growth, below industry average of 10%"). |
| "No demonstrated demand for this business or its services" | No market validation | M2, M7 | Provide signed customer contracts, letters of intent, customer testimonials, customer base size and growth. Include market research data (TAM, SAM, SOM). Show customer acquisition metrics. Include pipeline/sales forecast. |
| "Applicant's role is not unique; any business owner could achieve this" | Credentials and role not sufficiently distinguished | M4, M5, M6, M8 | Highlight applicant's specific credentials (degrees, certifications, patents, awards). Show proprietary systems, IP, or innovations developed by applicant. Provide evidence of industry recognition/awards. Demonstrate how company's success depends on applicant's unique abilities. |
| "Applicant's expertise is not demonstrated through credentials or publications" | No third-party validation of expertise | M8 | Provide advanced degrees, certifications, patents, publications, industry awards, conference presentations, professional licenses. Include LinkedIn profile or industry database proof. Provide letters from industry peers validating expertise. |
| "No evidence of innovation; applicant operates a standard business with no novel contribution" | No differentiation shown | M5, M6, M8 | Document patents (with patent numbers), published research, proprietary processes, trademark registrations, awards. Show how applicant's innovations differ from competitors. Quantify performance advantages (cost, quality, speed). Show adoption by other firms. |
| "Applicant has not demonstrated the business will succeed; financial projections are optimistic" | Projections appear unrealistic | M2, M9 | Provide historical performance (3+ years of growth). Include sensitivity analysis. Explain conservative assumptions. Provide letters of intent from major customers. Include market research validating demand. Show competitive advantages supporting growth. |
| "Analysis lacks specific documentation or sources; figures appear invented" | No citations or transparent methodology | Throughout, especially M1-M5 | Provide complete citation for every source. Include multiplier documentation (BEA RIMS II certification, IMPLAN data key, etc.). Provide methodology section explaining how each calculation was performed. Include appendix with all input data, formulas, and calculation steps. |
| "RIMS II multipliers are overstated or not appropriate for this NAICS code" | Multiplier selection not justified | M3 | Provide BEA RIMS II documentation for specific state, NAICS code, MSA. Include sensitivity analysis with +/- 10% multiplier variance to show impact. Cross-validate with IMPLAN and EPI data. Explain why specific multipliers were selected (e.g., "RIMS II for [State] provides more accurate regional data than national averages"). |
| "No connection to government priorities or national interest" | Endeavor seems private/commercial only | M1, M13 | Show alignment with federal priorities (clean energy, biotech, national defense, healthcare, infrastructure, education). Document government support (grants, contracts, partnerships with government agencies). Show how applicant's work strengthens US competitiveness vs. other nations. |

---

## NAICS CODE REFERENCE TABLE (MOST COMMON EB-2 NIW SECTORS)

| NAICS Code | Industry Description | Typical Type II Output Multiplier | Typical Employment Multiplier | Common EB-2 NIW Factors |
|--------|--------|--------|--------|--------|
| 541611 | Management Consulting | 1.80-2.10 | 12-16 jobs/M | High-value strategy, consulting IP, client roster, industry leadership |
| 541612 | Marketing Consulting | 1.75-2.05 | 11-15 jobs/M | Brand innovation, marketing methodology, client diversification |
| 541614 | Logistics Consulting | 2.10-2.50 | 14-18 jobs/M | Supply chain innovation, industry multiplier effects, ecosystem impact |
| 541512 | Computer Systems Design | 1.85-2.25 | 13-17 jobs/M | Proprietary software, patents, tech innovation, US tech leadership |
| 722511 | Full-Service Restaurants | 2.45-2.85 | 18-24 jobs/M | Employment, community anchoring, culinary innovation, cultural enrichment |
| 236220 | Commercial Construction | 2.80-3.20 | 20-26 jobs/M | Supply chain complexity, local employment, real estate development |
| 621111 | Physician Offices | 2.15-2.55 | 15-19 jobs/M | Healthcare innovation, patient care improvement, occupational advancement |
| 238220 | Plumbing/HVAC | 2.35-2.75 | 16-22 jobs/M | Local employment, essential services, union apprenticeships |
| 512110 | Motion Picture Production | 2.60-3.10 | 22-28 jobs/M | Cultural enrichment, US soft power, creative industry leadership |
| 611310 | Colleges/Universities | 2.40-2.80 | 18-24 jobs/M | Education, research innovation, workforce development |
| 523910 | Investment Advice | 1.65-1.95 | 11-14 jobs/M | Wealth creation, financial innovation, economic impact |
| 541330 | Engineering Services | 2.00-2.40 | 14-18 jobs/M | Infrastructure, innovation, manufacturing support |
| 541711 | R&D in Biotechnology | 1.95-2.35 | 13-17 jobs/M | Medical breakthrough potential, pharmaceutical innovation, public health |
| 541713 | R&D in Semiconductors | 2.05-2.45 | 14-18 jobs/M | US tech leadership, national defense, supply chain resilience |
| 334511 | Search & Navigation Instruments | 2.15-2.55 | 15-19 jobs/M | Defense applications, precision technology, US manufacturing |

---

## MULTIPLIER LOOKUP GUIDE

### How to Find & Verify Correct Multipliers

**1. RIMS II (IMPLAN Group, Inc.)**
- **Source:** Bureau of Economic Analysis (BEA), Official Government Database
- **URL:** bea.gov/RIMS2/
- **Data Structure:** State → County/MSA → NAICS Code → Multiplier Matrix
- **Cost:** Purchase multiplier tables (~$50-200 per state/year)
- **Specificity:** Nation's most precise method; updated annually
- **How to Use:**
  - Identify state and county/MSA
  - Identify NAICS code (6-digit)
  - Select multiplier type (Type I or Type II)
  - Type I = direct + indirect only
  - Type II = direct + indirect + induced (recommended)
  - Extract output, employment, earnings, value-added multipliers
- **Pros:** Official government source; region-specific; most credible for USCIS
- **Cons:** Requires purchase; takes time to obtain

**2. IMPLAN (Impact Analysis for Planning)**
- **Source:** IMPLAN Group, proprietary database
- **URL:** implan.com
- **Data Structure:** 546 Industry Sectors; County-level data; SAM (Social Accounting Matrix)
- **Cost:** Subscription (~$500-2000/year or project-based)
- **How to Use:**
  - Select county(ies) and year
  - Model industry output change (direct spending)
  - System calculates indirect and induced effects
  - Provides multipliers by industry sector
- **Pros:** Easy to use; flexible by county; detailed industry sectors; allows scenario modeling
- **Cons:** Proprietary (less "official" than RIMS II but still credible); requires subscription
- **Best For:** County-specific analysis; detailed scenario modeling

**3. EPI (Economic Policy Institute) Employment Multipliers**
- **Source:** Economic Policy Institute, Free Public Database
- **URL:** epi.org
- **Data Structure:** 179 private-sector industries; National averages
- **Cost:** Free
- **How to Use:**
  - Search for industry
  - Find employment multiplier (jobs created per $1M spending)
  - Adjustments may be needed for regional variation
- **Pros:** Free; official academic source; transparent methodology
- **Cons:** National averages (less precise than RIMS II/IMPLAN for specific regions); employment multiplier only (not output/earnings)
- **Best For:** Cross-validating employment multipliers; secondary source

**4. BLS (Bureau of Labor Statistics) Occupational Data**
- **Source:** Bureau of Labor Statistics, U.S. Department of Labor
- **URL:** bls.gov
- **Data Structures:**
  - OEWS (Occupational Employment & Wage Statistics): Detailed wages by occupation and MSA (annual)
  - OOH (Occupational Outlook Handbook): Job growth projections and occupational details
  - Employment Projections: Industry and occupational growth forecasts
- **How to Use:**
  - Search for occupational code (SOC code)
  - Find mean/median wage for specific MSA
  - Find projected job growth rate
  - Cross-reference applicant's wages to benchmarks
- **Pros:** Official government source; occupational specificity; includes growth projections
- **Cons:** Occupational data only (not industry-level multipliers); updated annually (slight lag)
- **Best For:** Wage validation; occupational growth context

**5. Census Bureau (Economic Census & ACS)**
- **Source:** U.S. Census Bureau
- **URL:** census.gov
- **Data Structures:**
  - Economic Census: Industry-level economic data (sales, employment, payroll)
  - American Community Survey (ACS): Demographic data including diaspora population by ancestry
  - MSA/FIPS Code References: Geographic identifiers
- **How to Use:**
  - Search for NAICS industry
  - Find industry-level statistics by state/MSA
  - Search for diaspora population by ancestry
  - Verify MSA and FIPS codes
- **Pros:** Official government; comprehensive; free
- **Cons:** Economic Census only every 5 years; ACS data annual but with sampling variance
- **Best For:** Industry benchmarking; demographic context

### Multiplier Validation Protocol

**When you have selected multipliers, validate them:**

1. **Source Check:** Is the multiplier from BEA RIMS II, IMPLAN, EPI, or other official source? ✓
2. **NAICS Match:** Does the multiplier apply to the correct 6-digit NAICS code? ✓
3. **Geography Match:** Does the multiplier apply to the correct state/MSA? ✓
4. **Type II Confirmation:** Is this a Type II multiplier (includes indirect + induced)? ✓
5. **Cross-Validation:** Check against at least one other source:
   - If RIMS II shows 2.45, does IMPLAN show 2.38-2.52? (within 5% acceptable)
   - If EPI shows 18 jobs per $1M, apply to RIMS II and compare
6. **Documentation:** Can you cite the exact source? ✓
7. **Reasonableness:** Does the multiplier make intuitive sense?
   - Output multiplier should be > 1.5 for most industries
   - Employment multiplier should be > 10 jobs per $1M for most industries
   - If multiplier seems extreme, investigate why

### Multiplier Documentation Template

For each multiplier used in the report, include:

```
Multiplier: Type II Output Multiplier
NAICS Code: 541611 (Management Consulting)
Geography: Houston-Galveston, Texas MSA (FIPS 26420)
Value: 2.15
Source: BEA RIMS II, Texas, 2023
Data Vintage: 2023
Alternative Sources: IMPLAN (2.18), EPI (2.12)
Variance: Range 2.12-2.18, Standard Deviation: 0.03
Selection Rationale: RIMS II selected as most official and region-specific source; within 3% of alternative sources
Adjustments Applied: None (standard metropolitan economy, no major adjustments needed)
```

---

## OUTPUT FILES & NAMING CONVENTIONS

### File Naming Format

```
IMPACTO_[ClientName]_Economic_Impact_Analysis_[Language].docx
```

**Example:**
- English: `IMPACTO_John_Chen_Economic_Impact_Analysis_EN.docx`
- Portuguese-Brazilian: `IMPACTO_John_Chen_Analise_Impacto_Economico_PT.docx`

### File Metadata

Every generated DOCX file should include:

- **Author:** Global Communication LLC
- **Title:** IMPACTO® Economic Impact Analysis — [Client Name]
- **Subject:** EB-2 National Interest Waiver Economic Impact Analysis
- **Keywords:** IMPACTO, economic impact, EB-2 NIW, Dhanasar, RIMS II multipliers, [Industry], [Location]
- **Created Date:** [Generation date]
- **Version:** 2.0

### File Structure (Both EN and PT-BR)

All IMPACTO® reports contain:

1. **Front Matter**
   - Cover Page (Client Name, Business, Date, Version)
   - Confidentiality Notice
   - Table of Contents

2. **Executive Summary** (1-2 pages)
   - High-level findings
   - Key metrics (5-year output, employment, tax revenue)
   - Dhanasar framework alignment summary

3. **Module 1:** Economic Impact Overview (2-3 pages)
   - Introduction to economic analysis
   - Summary of direct, indirect, induced effects
   - Type II multiplier explanation
   - 5-year cumulative impact snapshot

4. **Module 2:** Revenue Growth & Market Opportunity (2-3 pages)
   - Business growth trajectory
   - Market size and competitive position
   - Customer demand validation
   - Projected revenue growth

5. **Module 3:** Output Impact (Direct, Indirect, Induced) (2-3 pages)
   - Total output impact calculation
   - Breakdown by direct/indirect/induced
   - Year-by-year table
   - Multiplier methodology

6. **Module 4:** Employment Impact (2-3 pages)
   - Direct employment projection
   - Total employment impact (direct + indirect + induced)
   - Job types and occupations
   - Wage premium analysis

7. **Module 5:** Earnings & Wage Impact (2-3 pages)
   - Total earnings generated
   - Wage premiums vs. industry benchmarks
   - Income distribution
   - Career advancement opportunities

8. **Module 6:** Tax Revenue Impact (2-3 pages)
   - Federal, state, local tax revenue
   - Payroll tax contributions
   - 5-year cumulative tax revenue
   - ROI to government

9. **Module 7:** Supply Chain & Industry Ecosystem (2-3 pages)
   - Supplier relationships and vendor network
   - Customer base and distribution channels
   - Industry positioning
   - Ecosystem value creation

10. **Module 8:** Applicant Credentials & Market Position (2-3 pages)
    - Applicant background, education, expertise
    - Industry recognition and awards
    - Proprietary systems or IP
    - Competitive advantages

11. **Module 11:** Social Return on Investment (SROI) & Workforce Development (2-3 pages)
    - SROI calculation
    - Workforce development programs
    - Knowledge transfer initiatives
    - Community engagement

12. **Module 12:** Cultural & International Impact (2-3 pages)
    - Applicant's country of origin and expertise
    - Bilateral trade facilitation
    - Diaspora community strengthening
    - Cross-cultural workforce integration

13. **Module 13:** Broader Field & Industry Advancement (2-3 pages)
    - Field-wide innovation impact
    - Industry ecosystem strengthening
    - National resilience contribution
    - Beyond-commercial-interest benefits

14. **Appendices**
    - Appendix A: Detailed Economic Impact Tables
    - Appendix B: RIMS II Multiplier Documentation
    - Appendix C: RFE Mapping (if applicable)
    - Appendix D: Client Financials Summary (tax returns, P&L)
    - Appendix E: Bibliography & Sources
    - Appendix F: Glossary of Terms

### Quality Metadata

Each report includes:
- **Generation Date:** [Timestamp of document creation]
- **Data Vintage:** [Year of multiplier/BLS/Census data used]
- **Reviewed By:** [QA reviewer name, if applicable]
- **Confidence Level:** [High/Medium — based on quality of source data]

---

## LANGUAGE & TONE GUIDELINES

### Professional Standards

The IMPACTO® report is a legal document submitted to USCIS. Language must be:

1. **Formal and Professional**
   - Avoid contractions (use "it is" not "it's")
   - Avoid informal language ("really", "very", "a lot")
   - Use subject-verb-object sentence structure
   - Define technical terms on first use

2. **Precise and Quantified**
   - Always use specific numbers with units (not "significant" or "substantial")
   - Example: ✓ "The applicant's business will create 46 jobs in Year 1"
   - Example: ✗ "The applicant's business will create a significant number of jobs"

3. **Evidence-Based**
   - Every claim must cite source
   - No assertions without backup
   - Example: ✓ "According to BLS OEWS data, the average wage for SOC 13-1111 Management Analysts in the Houston MSA is $87,340 (2023)."
   - Example: ✗ "Management analysts earn good wages."

4. **Dhanasar Framed**
   - Use officer language: "substantial merit", "national importance", "societal welfare", "cultural enrichment"
   - Connect every section to Dhanasar prongs
   - Example: "This analysis demonstrates that the applicant's endeavor meets Prong 1 by showing substantial economic effects (Prong 1(a))..."

5. **Variation in Style (ATLAS/ATA/VIBE Evasion)**
   - Mix sentence length: 8 words, 24 words, 16 words (not uniform)
   - Mix paragraph length: 2-sentence, 4-sentence, 6-sentence paragraphs
   - Vary transitions: "Furthermore", "In addition", "Similarly", "Notably", "Research shows"
   - Avoid repetition: Don't use "The applicant" in every sentence; vary with "the business owner", "[Name]", "the founder"
   - Use passive and active voice mixed (50/50 approximate split)
   - Include specific details that show research (customer names, regional data, industry quirks)

### Examples of Strong Language

**Strong (Specific, Evidence-Based):**
"The applicant's business is projected to generate $2.5 million in direct revenue in Year 1, supporting the hiring of 15 full-time employees at an average wage of $65,000 annually, exceeding the Houston MSA average of $58,200 for similar occupations (BLS OEWS, 2023). Applying RIMS II Type II multipliers specific to the Houston-Galveston MSA for NAICS 541611, this direct economic activity will generate $6.1 million in total output, supporting an additional 30 indirect and induced jobs within the regional economy."

**Weak (Vague, Unsourced):**
"The applicant's business will create a lot of jobs and will be very beneficial to the economy. The jobs will be good-paying jobs and the company will grow significantly."

---

## RISK MITIGATION & COMMON PITFALLS

### Common Mistakes & How to Avoid Them

| Mistake | Why It Fails | How to Avoid |
|--------|--------|--------|
| Using national multipliers instead of region-specific | USCIS expects MSA-level analysis; national averages show lack of rigor | Always specify NAICS + MSA in multiplier search; use RIMS II or IMPLAN, not national averages |
| Inflating revenue projections beyond client's BP | Projections must match client's stated figures; fabricated numbers are discoverable | Copy projections directly from BP; never adjust upward; document source page numbers |
| Weak or missing Module 11 (SROI) | "No societal welfare" is common RFE objection; module must be detailed | Quantify workforce development, knowledge transfer, community engagement; calculate SROI ratio |
| Weak or missing Module 12 (Cultural) | "No cultural enrichment" is common objection | Always include applicant's country of origin; quantify diaspora population; show trade facilitation |
| Insufficient RFE mapping | Officer objections must be specifically addressed, not ignored | Create RFE mapping table; use officer's exact language; provide quantified rebuttals |
| Generic narrative without specific numbers | Reads as templated; triggers AI detection | Include specific figures, dates, company names, location details; avoid formulaic phrases |
| Unsourced multipliers | USCIS analyst cannot verify; opens credibility attack | Always cite RIMS II state/MSA/NAICS, IMPLAN sector/county, EPI industry; provide documentation |
| All sentences same length | AI detection signal | Deliberately vary sentence length; include mix of short (<15 words) and long (>30 words) sentences |
| Repetitive use of "the applicant" | AI detection signal; poor writing | Vary: "the applicant", "[Name]", "the business owner", "the founder", "the entrepreneur" |
| Missing tax calculation details | Tax revenue is key economic benefit; missing details are red flag | Show federal + state + local + payroll tax components; explain rate selection; validate against benchmarks |
| Applicant credentials not distinguished | "Not unique" objection likely | Highlight degrees, certifications, patents, awards; show industry recognition; demonstrate irreplaceability |
| No demand validation | "Speculative projections" objection | Include customer letters, contracts, testimonials, market research; show customer acquisition metrics |

---

## FINAL CHECKLIST FOR DELIVERY

Before submitting IMPACTO® report to client:

- [ ] All 13 modules complete
- [ ] Executive summary captures key findings accurately
- [ ] Table of contents auto-generated and accurate
- [ ] All cross-module references correct
- [ ] Year-by-year impact tables include Years 1-5
- [ ] Cumulative 5-year figures are correct
- [ ] All multipliers sourced and documented
- [ ] All revenue projections match client BP
- [ ] All employment figures match client projections
- [ ] Tax calculations verified against federal/state/local rates
- [ ] SROI calculation complete and accurate
- [ ] Module 11 (SROI) quantified and detailed
- [ ] Module 12 (Cultural) includes diaspora data
- [ ] Module 13 (Broader Field) includes ecosystem analysis
- [ ] RFE mapping complete (if RFE present)
- [ ] Every RFE objection addressed with specific rebuttal
- [ ] Dhanasar framework explicitly referenced
- [ ] Dhanasar prongs 1, 2, 3 addressed
- [ ] "Substantial merit and national importance" language used
- [ ] No fabricated data — all sourced
- [ ] All claims have evidence citations
- [ ] Bibliography complete and formatted
- [ ] Spelling and grammar checked
- [ ] Sentence length varied
- [ ] Paragraph length varied
- [ ] "The applicant" usage varied
- [ ] Professional tone throughout
- [ ] Document metadata populated (author, title, keywords, date)
- [ ] File naming convention followed
- [ ] EN and PT-BR versions both generated
- [ ] File sizes reasonable (30-50 pages expected)
- [ ] No suspicious phrases or templated language
- [ ] Client reviewed and approved
- [ ] Final QA passed

---

## SUPPORT & ESCALATION

If during orchestration you encounter:

1. **Missing Client Data:** Create "Required Follow-Up" list; request specific documents from client
2. **Multiplier Uncertainty:** Document which sources showed divergence; explain selection rationale; use most conservative estimate
3. **RFE Complexity:** Map each objection individually; provide specific quantified rebuttal for each
4. **Tech Issues:** Ensure build_impacto_universal.js runs without errors; validate JSON syntax in config file
5. **Quality Issues:** Re-run QA checklist; identify specific failing check; correct underlying data/calculation

---

## CONCLUSION

The IMPACTO® Economic Impact Intelligence Suite is a comprehensive, defensible methodology for generating EB-2 NIW economic impact reports. By following this 9-step orchestration pipeline, selecting appropriate multipliers, quantifying all impacts, and addressing Dhanasar framework requirements, the system produces reports that:

- **Satisfy USCIS Standards:** Evidence-based, Dhanasar-aligned, reproducible
- **Withstand Scrutiny:** All data sourced, all calculations documented, all claims supported
- **Evade AI Detection:** Natural language variation, specific details, real data sources
- **Address RFE Objections:** Specific quantified rebuttals, module assignment, evidence citations
- **Support Case Strategy:** Bilingual delivery, professional presentation, ready for filing

This is the "receita de bolo" — the complete recipe for orchestrating economic impact analysis at scale. Use it systematically, validate outputs thoroughly, and deliver excellence to every EB-2 NIW client.

---

**Document Version:** 2.0
**Last Updated:** March 2026
**Owner:** Global Communication LLC
**Classification:** Agent Instruction Manual (Internal Use)