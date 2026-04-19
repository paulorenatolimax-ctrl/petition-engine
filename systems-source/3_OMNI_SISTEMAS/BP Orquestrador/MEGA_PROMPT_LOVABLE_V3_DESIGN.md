# MEGA PROMPT V3 -- BP Generator Design & Formatting Update

## PURPOSE

Update the DOCX assembly layer of the BP Generator on Lovable to produce publication-ready business plan documents matching the Ikaro benchmark standard. The content generation (42 section prompts via Claude Haiku API) is already working -- this prompt addresses HOW the markdown output is converted into a professionally formatted DOCX.

---

## PART 1: DOCX FORMATTING SPECIFICATION

### 1.1 Page Setup

```
Paper Size: US Letter (8.5" x 11")
Orientation: Portrait (default). Landscape ONLY for wide financial tables (DRE, BEP).
Margins:
  Top:    0.7"
  Bottom: 0.6"
  Left:   0.8"
  Right:  0.6"
```

### 1.2 Typography -- Garamond Throughout

The ENTIRE document uses the Garamond font family. No Times New Roman.

| Element | Font | Size | Style | Color | Spacing |
|---------|------|------|-------|-------|---------|
| Body text | Garamond | 11pt | Regular | #000000 (Black) | Line: 1.15, Para: 6pt after |
| H1 (Block title) | Garamond | 16-18pt | Bold | #584D42 (Dark Brown) | Line below in #584D42 |
| H2 (Section title) | Garamond | 13pt | Bold | #000000 (Black) | -- |
| H3 (Sub-section) | Garamond | 11pt | Bold + Italic | #000000 | -- |
| Table header text | Garamond | 10pt | Bold | #000000 | -- |
| Table body text | Garamond | 10pt | Regular | #000000 | Line: 1.0 |
| Table legend | Garamond | 10pt | Italic | #666666 | Centered |
| Footnote text | Garamond | 9pt | Regular | #666666 | -- |
| Footer text | Garamond | 8pt | Bold | #FFFFFF (White) | -- |
| Header text | Garamond | 9pt | Italic | #999999 (Gray) | Right-aligned |
| Page number | Garamond | 10pt | Regular | #666666 | Right-aligned |

### 1.3 Paragraph Formatting

```
Line spacing:     1.15 (body text), 1.0 (inside tables)
Paragraph spacing: 6pt after each paragraph
Max paragraph length: 200 words -- if longer, SPLIT at nearest sentence boundary
Alignment:        Justified (body text), Left-aligned (headings)
First line indent: None (use spacing between paragraphs instead)
```

### 1.4 Headings

- **H1 (##)**: Block/category title. 16-18pt bold, color #584D42. Followed by a thin brown line (#584D42) spanning the page width. Starts on a new page.
- **H2 (###)**: Section title within a block. 13pt bold, black.
- **H3 (####)**: Sub-section. 11pt bold + italic, black.
- No heading should be followed immediately by another heading without intervening text.
- No markdown separators (---, ***, ===) between sections.

### 1.5 Bold and Emphasis

- **Bold** for: key terms, company names, product names, important metrics
- *Italic* for: foreign terms, book titles (use sparingly)
- No underline in body text
- No ALL CAPS except acronyms (SWOT, DRE, ESG, B2B, B2C)

---

## PART 2: TABLE DESIGN -- IKARO STANDARD

### 2.1 Table Style Specification

This is a CRITICAL change from the current implementation. The current tables have zebra striping and green colors. The correct style is:

**BEFORE (WRONG -- current implementation):**
- Header: gray or green background
- Body: alternating green/white rows (zebra striping)
- Borders: on all four sides of every cell

**AFTER (CORRECT -- Ikaro standard):**
- Header row: background #DEDACB (light brown/beige), text in bold 10pt Garamond
- Body rows: background 100% WHITE (#FFFFFF) -- NO zebra striping, NO alternating colors
- Borders: ONLY top and bottom borders, NO lateral/side borders
- Border color: #CCCCCC (light gray), thin lines
- Cell padding: 4pt all sides
- Table width: 100% page width (auto-fit contents)
- Table alignment: Centered on page

**Implementation in python-docx or equivalent:**

```python
# Table style for BP documents
def apply_bp_table_style(table):
    """Apply Ikaro-standard table formatting."""
    # Remove all existing borders
    for row in table.rows:
        for cell in row.cells:
            # Clear all borders
            set_cell_borders(cell, {
                'top': {'sz': 0, 'val': 'none'},
                'bottom': {'sz': 0, 'val': 'none'},
                'start': {'sz': 0, 'val': 'none'},  # NO left border
                'end': {'sz': 0, 'val': 'none'},     # NO right border
            })
    
    # Header row
    header_row = table.rows[0]
    for cell in header_row.cells:
        # Background: #DEDACB (light brown)
        set_cell_shading(cell, '#DEDACB')
        # Text: Bold, 10pt Garamond
        for paragraph in cell.paragraphs:
            for run in paragraph.runs:
                run.font.name = 'Garamond'
                run.font.size = Pt(10)
                run.font.bold = True
        # Top and bottom border only
        set_cell_borders(cell, {
            'top': {'sz': 6, 'val': 'single', 'color': 'CCCCCC'},
            'bottom': {'sz': 6, 'val': 'single', 'color': 'CCCCCC'},
        })
    
    # Body rows -- ALL WHITE, no zebra
    for i, row in enumerate(table.rows[1:], 1):
        for cell in row.cells:
            # Background: 100% WHITE
            set_cell_shading(cell, '#FFFFFF')
            # Text: Regular, 10pt Garamond
            for paragraph in cell.paragraphs:
                for run in paragraph.runs:
                    run.font.name = 'Garamond'
                    run.font.size = Pt(10)
                    run.font.bold = False
            # Bottom border only (thin)
            set_cell_borders(cell, {
                'bottom': {'sz': 4, 'val': 'single', 'color': 'CCCCCC'},
            })
    
    # Last row: slightly thicker bottom border
    for cell in table.rows[-1].cells:
        set_cell_borders(cell, {
            'bottom': {'sz': 6, 'val': 'single', 'color': 'CCCCCC'},
        })
```

### 2.2 Table Context Rules

Every table in the document MUST have:
1. **Introductory paragraph** (minimum 2 sentences) BEFORE the table providing context
2. **Concluding paragraph** (minimum 1 sentence) AFTER the table with strategic insight or analytical takeaway
3. Tables without surrounding context ("naked tables") are NEVER acceptable

### 2.3 Table vs Prose Decision

- **Use TABLE for:** Comparative/numeric data with 5+ rows of data
- **Use PROSE for:** Narrative/descriptive content, or data with 3 or fewer items
- **Maximum:** 2 tables per section (except Financial Plan sections: 3-4)
- **Minimum:** 60% of each section must be prose, maximum 40% table space

---

## PART 3: HEADER, FOOTER & PAGE ELEMENTS

### 3.1 Footer (ALL pages except cover)

The footer is a solid bar spanning the full page width:

```
Background: Solid fill #584D42 (dark brown)
Height: Approximately 0.35"
Text: White (#FFFFFF), Bold, 8pt Garamond, centered
Content: "CONFIDENTIAL -- [COMPANY NAME] -- Business Plan 2026"
Page number: Right-aligned within the bar, "Page X of Y"
```

**Implementation:**

```python
def add_bp_footer(document, company_name):
    """Add the standard BP footer to all pages."""
    section = document.sections[0]
    footer = section.footer
    footer.is_linked_to_previous = False
    
    # Create a table to simulate the bar
    table = footer.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    # Set bar background
    for cell in table.rows[0].cells:
        set_cell_shading(cell, '#584D42')
    
    # Left cell: CONFIDENTIAL text
    left_cell = table.rows[0].cells[0]
    p = left_cell.paragraphs[0]
    run = p.add_run(f"CONFIDENTIAL -- {company_name} -- Business Plan 2026")
    run.font.name = 'Garamond'
    run.font.size = Pt(8)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    
    # Right cell: Page X of Y
    right_cell = table.rows[0].cells[1]
    p = right_cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    # Add page number field
    add_page_number(p)
```

### 3.2 Header (ALL pages except cover)

```
Text: Company name, italic, 9pt Garamond, #999999, right-aligned
Line: Thin horizontal line below (#999999)
```

### 3.3 Cover Page

```
"BUSINESS PLAN" -- 42pt bold Garamond, color #584D42, centered
[blank space]
Company subtitle/description -- 12pt regular, centered
[blank space]
"PROPOSED BY:"
Founder Name
Email
Location (City, State)
Date (Month Year)

NO header or footer on cover page.
```

### 3.4 Page Breaks

- Page break BEFORE each block (6 blocks total)
- Each block starts with H1 (16-18pt bold brown #584D42) + thin brown line below
- Table of Contents: auto-generated from H1/H2/H3 headings

---

## PART 4: COLOR PALETTE

```
#584D42  -- Dark Brown (footer bar, H1 headings, chart primary bars)
#DEDACB  -- Light Brown/Beige (table header background)
#D0DDD6  -- Light Green (ONLY for EBITDA bars in charts -- NEVER for tables)
#000000  -- Black (body text, H2/H3 headings)
#666666  -- Dark Gray (footnotes, table legends, secondary text)
#CCCCCC  -- Light Gray (table borders, thin lines)
#999999  -- Medium Gray (header text, header line)
#F5F5F5  -- Near White (institutional box backgrounds, if applicable)
#FFFFFF  -- White (table body background -- ALWAYS white)
#C0392B  -- Red (negative values in charts)
```

**CRITICAL:** The color #D0DDD6 (Light Green) is for charts ONLY. It must NEVER appear in table cells. Table bodies are ALWAYS white.

---

## PART 5: FOOTNOTES & CITATIONS

### 5.1 In-Text Citations

- Superscript numbers in the text: text[1], text[2], text[3]
- Sequential numbering across the ENTIRE document (not restarting per section)
- If section A ends with [3], section B starts with [4]

### 5.2 Footnote Display

**BEFORE (WRONG -- current):** Footnotes appear as inline text in the middle of paragraphs

**AFTER (CORRECT):**
- Footnotes collected at the END of each section (or at the end of each block)
- Separated from body text by a thin gray horizontal line (#CCCCCC)
- Format: [1] Source Name, Document/Report Title, Year. URL (if verified).
- Font: 9pt Garamond, color #666666

### 5.3 Minimum Footnotes Requirement

- **Minimum 10 footnotes** across the entire document with verified sources
- Preferred sources: .gov domains (BLS, Census, OSHA, CDC, HRSA, HHS, IRS)
- NEVER fabricate URLs -- if uncertain, cite the source name without URL
- Financial sections (S32-S37) may have fewer footnotes (data comes from spreadsheet)
- Market/strategy sections (S5, S5b, S7, S12, S13, S17) should have the most footnotes

### 5.4 Source Trust Hierarchy

1. Financial spreadsheet data -> ABSOLUTE trust, use without source citation
2. Web search results (found in current session) -> HIGH trust, cite source
3. Form data (company, services, location) -> ABSOLUTE trust
4. Known .gov data (BLS, Census, SBA, IRS) -> HIGH trust, cite .gov site
5. General verifiable knowledge -> MEDIUM trust, no source needed
6. Market estimates without source -> LOW trust, use qualitative language only
7. Anything uncertain -> DO NOT USE

---

## PART 6: CHARTS -- 6 MANDATORY FINANCIAL CHARTS

The BP Generator must produce 6 charts using matplotlib (Python) and embed them in the DOCX. ALL chart labels must be in ENGLISH even though the document text is in Portuguese.

### 6.1 Chart Configuration (Global)

```python
# Global chart settings for all 6 charts
CHART_CONFIG = {
    'dpi': 200,
    'width_inches': 7.5,       # Chart render width
    'docx_width_inches': 5.5,  # Width when inserted into DOCX
    'font_family': 'Garamond',
    'colors': {
        'primary': '#584D42',   # Dark brown (main bars)
        'secondary': '#D0DDD6', # Light green (EBITDA, secondary data)
        'negative': '#C0392B',  # Red (losses, negative values)
        'grid': '#E0E0E0',     # Light gray gridlines
        'text': '#333333',      # Dark text on charts
        'background': '#FFFFFF', # White background
    },
    'language': 'en',          # ALL labels in English
}
```

### 6.2 Chart 1: Revenue Projection (Bar Chart)

```python
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker

def generate_revenue_chart(financial_data, output_path):
    """Bar chart showing Gross Revenue Y1-Y5."""
    years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5']
    revenue = [
        financial_data['revenue']['Y1'],
        financial_data['revenue']['Y2'],
        financial_data['revenue']['Y3'],
        financial_data['revenue']['Y4'],
        financial_data['revenue']['Y5'],
    ]
    
    fig, ax = plt.subplots(figsize=(7.5, 4.5))
    bars = ax.bar(years, revenue, color='#584D42', width=0.6)
    
    ax.set_title('Gross Revenue Projection (5 Years)', fontsize=14, fontweight='bold', color='#333333')
    ax.set_ylabel('USD ($)', fontsize=11, color='#333333')
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f'${x:,.0f}'))
    ax.grid(axis='y', color='#E0E0E0', linestyle='--', alpha=0.7)
    ax.set_axisbelow(True)
    
    # Add value labels on bars
    for bar, val in zip(bars, revenue):
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(revenue)*0.02,
                f'${val:,.0f}', ha='center', va='bottom', fontsize=9, color='#333333')
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
```

### 6.3 Chart 2: Expense Breakdown (Stacked Bar or Grouped Bar)

```python
def generate_expense_chart(financial_data, output_path):
    """Stacked bar showing Variable Costs + Fixed Costs + OpEx by year."""
    years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5']
    variable = [financial_data['variableCosts'][f'Y{i}'] for i in range(1,6)]
    fixed = [financial_data['fixedCosts'][f'Y{i}'] for i in range(1,6)]
    
    fig, ax = plt.subplots(figsize=(7.5, 4.5))
    ax.bar(years, variable, label='Variable Costs', color='#584D42', width=0.6)
    ax.bar(years, fixed, bottom=variable, label='Fixed Costs', color='#D0DDD6', width=0.6)
    
    ax.set_title('Expense Breakdown (5 Years)', fontsize=14, fontweight='bold', color='#333333')
    ax.set_ylabel('USD ($)', fontsize=11, color='#333333')
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f'${x:,.0f}'))
    ax.legend(loc='upper left', fontsize=9)
    ax.grid(axis='y', color='#E0E0E0', linestyle='--', alpha=0.7)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
```

### 6.4 Chart 3: P&L Summary (Combined Bar + Line)

```python
def generate_pnl_chart(dre_data, output_path):
    """Bar for Revenue/Costs, Line for Net Income."""
    years = ['Y0', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5']
    revenue = [0, 627384, 1128996, 1864724, 1937149, 2955811]  # from DRE
    net_income = [-128381, -14722, 60180, 239298, 121021, 427331]  # from DRE
    
    fig, ax1 = plt.subplots(figsize=(7.5, 4.5))
    
    # Revenue bars
    colors = ['#584D42' if v >= 0 else '#C0392B' for v in revenue]
    ax1.bar(years, revenue, color='#584D42', alpha=0.7, label='Gross Revenue', width=0.5)
    
    # Net Income line
    ax2 = ax1.twinx()
    line_colors = ['#C0392B' if v < 0 else '#584D42' for v in net_income]
    ax2.plot(years, net_income, color='#584D42', marker='o', linewidth=2, label='Net Income')
    ax2.axhline(y=0, color='#999999', linestyle='--', linewidth=0.8)
    
    ax1.set_title('Profit & Loss Summary', fontsize=14, fontweight='bold', color='#333333')
    ax1.set_ylabel('Gross Revenue (USD)', fontsize=10, color='#333333')
    ax2.set_ylabel('Net Income (USD)', fontsize=10, color='#333333')
    
    ax1.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f'${x:,.0f}'))
    ax2.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f'${x:,.0f}'))
    
    # Combined legend
    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper left', fontsize=9)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
```

### 6.5 Chart 4: Market Opportunity (Pie or Donut)

```python
def generate_market_chart(market_data, output_path):
    """Pie/donut chart showing market segmentation or TAM/SAM/SOM."""
    labels = ['TAM', 'SAM', 'SOM']
    sizes = [market_data['tam'], market_data['sam'], market_data['som']]
    colors_palette = ['#584D42', '#D0DDD6', '#DEDACB']
    explode = (0, 0, 0.1)  # Highlight SOM
    
    fig, ax = plt.subplots(figsize=(6, 6))
    wedges, texts, autotexts = ax.pie(sizes, explode=explode, labels=labels,
                                       colors=colors_palette, autopct='%1.1f%%',
                                       startangle=90, pctdistance=0.85)
    
    # Donut style
    centre_circle = plt.Circle((0,0), 0.55, fc='white')
    ax.add_artist(centre_circle)
    
    ax.set_title('Market Opportunity Analysis', fontsize=14, fontweight='bold', color='#333333')
    
    for text in texts + autotexts:
        text.set_fontsize(10)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
```

### 6.6 Chart 5: Customer/Employee Growth (Line Chart)

```python
def generate_growth_chart(growth_data, output_path):
    """Line chart showing customer acquisition and/or employee growth Y1-Y5."""
    years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5']
    customers = growth_data.get('customers', [10, 25, 50, 80, 120])
    employees = growth_data.get('employees', [3, 6, 12, 18, 25])
    
    fig, ax1 = plt.subplots(figsize=(7.5, 4.5))
    
    ax1.plot(years, customers, color='#584D42', marker='s', linewidth=2.5,
             markersize=8, label='Clients Served')
    
    ax2 = ax1.twinx()
    ax2.plot(years, employees, color='#D0DDD6', marker='o', linewidth=2.5,
             markersize=8, label='Employees (FTE)')
    
    ax1.set_title('Client & Employee Growth Projection', fontsize=14,
                  fontweight='bold', color='#333333')
    ax1.set_ylabel('Clients Served', fontsize=11, color='#584D42')
    ax2.set_ylabel('Employees (FTE)', fontsize=11, color='#666666')
    
    ax1.grid(axis='y', color='#E0E0E0', linestyle='--', alpha=0.7)
    
    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper left', fontsize=9)
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
```

### 6.7 Chart 6: Investment & Payback (Waterfall or Cumulative)

```python
def generate_investment_chart(dre_data, output_path):
    """Cumulative Net Income showing investment recovery trajectory."""
    years = ['Y0', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5']
    cumulative = [-128381, -143103, -82922, 156376, 277397, 704728]  # from DRE
    
    fig, ax = plt.subplots(figsize=(7.5, 4.5))
    
    colors = ['#C0392B' if v < 0 else '#584D42' for v in cumulative]
    bars = ax.bar(years, cumulative, color=colors, width=0.6)
    
    ax.axhline(y=0, color='#999999', linestyle='-', linewidth=1.2)
    ax.set_title('Cumulative Net Income & Investment Recovery', fontsize=14,
                 fontweight='bold', color='#333333')
    ax.set_ylabel('USD ($)', fontsize=11, color='#333333')
    ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f'${x:,.0f}'))
    ax.grid(axis='y', color='#E0E0E0', linestyle='--', alpha=0.7)
    
    for bar, val in zip(bars, cumulative):
        y_pos = bar.get_height() + (max(cumulative) * 0.03 if val >= 0 else min(cumulative) * 0.03)
        ax.text(bar.get_x() + bar.get_width()/2, val + (abs(max(cumulative)) * 0.02 * (1 if val >= 0 else -1)),
                f'${val:,.0f}', ha='center', va='bottom' if val >= 0 else 'top',
                fontsize=9, color='#333333')
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=200, bbox_inches='tight', facecolor='white')
    plt.close()
```

### 6.8 Chart Placement in Document

| Chart | Insert After Section | Position |
|-------|---------------------|----------|
| Revenue Projection | S34 (Estimativa de Receitas) | End of section, centered |
| Expense Breakdown | S34 (Estimativa de Receitas) | After revenue chart |
| P&L Summary | S35 (DRE) | End of section |
| Market Opportunity | S5 (Perspectivas do Mercado) | End of section |
| Customer/Employee Growth | S7 (Empregabilidade) or S26 (Quadro) | End of section |
| Investment & Payback | S36 (Indicadores de Retorno) | End of section |

Each chart is:
- Rendered at 200 DPI
- Inserted at 5.5 inches width, centered
- Has a caption below: "Figure X: [Chart Title]" in 10pt italic Garamond, centered, #666666

---

## PART 7: 16 BP-SPECIFIC ERROR RULES

These rules are extracted from the production error_rules.json and MUST be enforced by the Lovable app during BP generation. Implement these as automated checks that run on each section's output.

### Category A: Content Integrity (BLOCKING)

| # | Rule | Check | Action |
|---|------|-------|--------|
| 1 | Anti-hallucination on charts | Every chart/infographic data point must match the financial spreadsheet. Never trust AI-generated chart defaults. | Validate chart data against spreadsheet JSON before rendering |
| 2 | Minimum footnotes | Each section with market data needs numbered references [1][2][3] with verifiable sources | Count footnote markers; warn if section has market claims but zero citations |
| 3 | No empty sections | A heading followed immediately by another heading (no content between) is prohibited | Regex check: `/^##[^#].*\n##[^#]/m` triggers block |
| 4 | No "pe quadrado" | Never use "pe quadrado" -- use "metros quadrados" (PT context) or "square feet" (US context) | String search for "pe quadrado", "pes quadrados" |
| 5 | Chart labels in English | ALL chart/infographic labels must be in ENGLISH: "Gross Revenue" not "Receita Bruta" | Validate matplotlib label strings |
| 6 | Mandatory footer | "CONFIDENTIAL -- [COMPANY] -- Business Plan 2026" on ALL pages without exception | Verify DOCX footer element exists and contains correct text |
| 7 | Section minimum density | Each section needs minimum 300 words of dense content. Under 50 words = blocked | Word count check |
| 8 | LLC vs S-Corp distinction | LLC is the legal entity; S-Corporation is the tax election (Form 2553). Clarify when both appear. | Flag sections that mention both without clarification |
| 9 | Unique section numbering | Each section number (1.1, 2.3, etc.) must appear ONLY ONCE in the document | Post-assembly duplicate check |
| 10 | Table context required | Every table needs intro paragraph (2+ sentences) BEFORE and analytical paragraph (1+ sentence) AFTER | Pattern check on markdown: table without preceding paragraph |

### Category B: Formatting Compliance (WARNING)

| # | Rule | Check | Action |
|---|------|-------|--------|
| 11 | Paragraph length | Paragraphs over 1200 characters must be split | Character count per paragraph |
| 12 | Location integrity | Location section (S30) must have intact paragraphs, no broken lines | Pattern check for orphan lines |
| 13 | B2C/B2B consistency | Publico-Alvo sections must have consistent formatting. No stray markdown | Check for orphan `#` or `###` mid-paragraph |

### Category C: Anti-Cristine Rules (Beneficiary-Endeavor Nexus)

These rules ensure the BP implicitly demonstrates the causal connection between the beneficiary's credentials and the business venture, without ever mentioning immigration:

| # | Rule | Description |
|---|------|-------------|
| 14 | Implicit merit demonstration | Each section should naturally connect founder expertise to business operations |
| 15 | No immigration language | Zero references to visa categories, immigration processes, or government petition reviews |
| 16 | Investor-audience tone | The document reads as if prepared for a sophisticated investor evaluating a business opportunity |

**Implementation:**

```typescript
interface ErrorRule {
  id: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  action: 'block' | 'warn' | 'auto_fix';
  check: (sectionText: string, sectionId: string) => { passed: boolean; message?: string };
}

const BP_ERROR_RULES: ErrorRule[] = [
  {
    id: 'bp_r1',
    description: 'Chart data must match financial spreadsheet',
    severity: 'critical',
    action: 'block',
    check: (text, id) => {
      // Validate any numeric data in chart-adjacent sections against spreadsheet
      return { passed: true };
    }
  },
  {
    id: 'bp_r2',
    description: 'Market sections need footnoted sources',
    severity: 'high',
    action: 'block',
    check: (text, id) => {
      const marketSections = ['S5', 'S5b', 'S7', 'S12', 'S13', 'S17'];
      if (marketSections.includes(id)) {
        const footnoteCount = (text.match(/\[\d+\]/g) || []).length;
        return {
          passed: footnoteCount >= 2,
          message: footnoteCount < 2 ? `Section ${id} has only ${footnoteCount} footnotes. Minimum 2 required.` : undefined
        };
      }
      return { passed: true };
    }
  },
  {
    id: 'bp_r3',
    description: 'No empty sections',
    severity: 'critical',
    action: 'block',
    check: (text) => {
      const emptyPattern = /^##[^#\n]+\n\s*##[^#]/m;
      return {
        passed: !emptyPattern.test(text),
        message: 'Empty section detected: heading followed by heading with no content'
      };
    }
  },
  {
    id: 'bp_r4',
    description: 'No "pe quadrado" translation error',
    severity: 'critical',
    action: 'block',
    check: (text) => {
      const lower = text.toLowerCase();
      return {
        passed: !lower.includes('pe quadrado') && !lower.includes('pes quadrados') && !lower.includes('pe\u0301 quadrado'),
        message: 'Found "pe quadrado" -- use "metros quadrados" or "square feet"'
      };
    }
  },
  {
    id: 'bp_r5',
    description: 'Unique section numbering',
    severity: 'critical',
    action: 'block',
    check: (text) => {
      const headings = text.match(/^##\s+\d+\.\d+/gm) || [];
      const unique = new Set(headings);
      return {
        passed: headings.length === unique.size,
        message: headings.length !== unique.size ? 'Duplicate section numbering detected' : undefined
      };
    }
  },
  {
    id: 'bp_r6',
    description: 'Table context required',
    severity: 'critical',
    action: 'block',
    check: (text) => {
      // Check for tables without preceding paragraph
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('|') && lines[i].includes('|')) {
          // Found a table line -- check if preceded by blank + text
          const prevNonEmpty = lines.slice(0, i).reverse().find(l => l.trim().length > 0);
          if (prevNonEmpty && prevNonEmpty.startsWith('|')) continue; // Part of same table
          if (prevNonEmpty && (prevNonEmpty.startsWith('#') || prevNonEmpty.startsWith('|'))) {
            return {
              passed: false,
              message: 'Table found without introductory paragraph'
            };
          }
        }
      }
      return { passed: true };
    }
  }
];
```

---

## PART 8: IKARO BENCHMARK REFERENCE

The gold standard for BP formatting is the Ikaro business plan document. Key visual characteristics to replicate:

1. **Professional appearance** -- clean, sparse, executive-level presentation
2. **Garamond typography throughout** -- no font mixing
3. **Brown/beige color scheme** -- warm, professional, not corporate-cold
4. **Tables with light brown headers** on white backgrounds -- no zebra, no lateral borders
5. **Dense analytical prose** -- not bullet-point heavy, not template-like
6. **Charts with brown/green palette** -- consistent with document colors
7. **CONFIDENTIAL footer** on every page -- in the brown bar
8. **60-75 pages total** -- substantial but not padded
9. **Footnotes from .gov sources** -- lending credibility and verifiability
10. **No immigration references anywhere** -- reads as pure business document for investors

**Target page count:** 60-75 pages (assembled DOCX with charts)
**Target word count:** 25,000-30,000 words across all 42 sections

---

## PART 9: DOCX ASSEMBLY PIPELINE

### 9.1 Assembly Order

```
1. Create document with Garamond font, set margins (0.7/0.6/0.8/0.6)
2. Add cover page (no header/footer)
3. Add Table of Contents (auto-generated)
4. For each block (1-6):
   a. Add page break
   b. Add H1 block title with brown color + brown line
   c. For each section in block:
      - Parse markdown output from API
      - Convert ## to H2, ### to H3
      - Convert **bold** to bold runs
      - Convert markdown tables to DOCX tables with Ikaro styling
      - Convert [N] superscripts to actual superscript formatting
      - Insert charts at designated positions (see Part 6.8)
      - Apply paragraph formatting (justified, 11pt Garamond, 1.15 spacing)
5. Add references section (S40)
6. Apply header to all sections (except cover)
7. Apply footer to all sections (except cover)
8. Update Table of Contents
9. Save as DOCX
```

### 9.2 Markdown-to-DOCX Conversion Rules

| Markdown | DOCX |
|----------|------|
| `## Title` | H2: 13pt bold Garamond, black |
| `### Subtitle` | H3: 11pt bold italic Garamond |
| `**bold text**` | Bold run in current paragraph |
| `*italic text*` | Italic run in current paragraph |
| `\| Col \| Col \|` table | DOCX table with Ikaro styling (Part 2) |
| `text[1]` | Superscript "1" at that position |
| `- bullet item` | Bullet list item, 11pt Garamond |
| `1. numbered item` | Numbered list item |
| Blank line | New paragraph |
| `---` | Ignore (do not render horizontal rules) |

---

## PART 10: IMPLEMENTATION CHECKLIST FOR LOVABLE

Use this checklist to verify the Lovable app update is complete:

- [ ] Garamond font in ALL text elements (body, headings, tables, footnotes, header, footer)
- [ ] Margins set to 0.7" / 0.6" / 0.8" / 0.6" (top/bottom/left/right)
- [ ] Tables: header background #DEDACB, body 100% WHITE, NO zebra striping
- [ ] Tables: NO lateral borders, only top/bottom borders in #CCCCCC
- [ ] Footer: brown bar (#584D42) with white text "CONFIDENTIAL -- [COMPANY] -- Business Plan 2026" on ALL pages
- [ ] Header: company name in italic 9pt gray, right-aligned, on ALL pages (except cover)
- [ ] Cover page: "BUSINESS PLAN" 42pt bold brown, no header/footer
- [ ] Footnotes: at END of section (not inline), separated by thin gray line
- [ ] Charts: 6 mandatory charts with ALL labels in ENGLISH
- [ ] Charts: color palette #584D42 (primary), #D0DDD6 (secondary), #C0392B (negative)
- [ ] Charts: 200 DPI, 5.5" width in DOCX, centered
- [ ] Page breaks between blocks
- [ ] H1 block titles: 16-18pt bold brown with brown line below
- [ ] Paragraphs: max 200 words, justified, 1.15 line spacing
- [ ] Forbidden term check runs on every section output
- [ ] 16 BP error rules implemented and running
- [ ] Total document: 60-75 pages
- [ ] Zero immigration terms in entire document
- [ ] Minimum 10 footnotes with verified .gov sources
- [ ] Chart data validated against financial spreadsheet before rendering

---

*BP System V3 -- Mega Prompt for Lovable -- Design & Formatting Update*
*Version: 3.0 -- April 2026*
*Benchmark Reference: Ikaro Business Plan (VF_business plan_ikaro ferreira souza.pdf)*
