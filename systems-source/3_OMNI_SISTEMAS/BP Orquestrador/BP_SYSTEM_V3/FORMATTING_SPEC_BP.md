# Formatting Specification - BP System

## Document Format

### Page Setup
- **Paper Size:** US Letter (8.5" x 11")
- **Margins:** 1" all sides (top, bottom, left, right)
- **Orientation:** Portrait (default). Landscape allowed for wide financial tables only.

### Typography

| Element | Font | Size | Style | Color |
|---------|------|------|-------|-------|
| Body text | Times New Roman | 12pt | Regular | Black (#1A1A1A) |
| H1 (##) | Times New Roman | 18pt | Bold | Dark Navy (#1A1A2E) |
| H2 (###) | Times New Roman | 14pt | Bold | Navy (#2C2C54) |
| H3 (####) | Times New Roman | 12pt | Bold | Medium Blue (#333366) |
| Table headers | Times New Roman | 11pt | Bold | Dark text on gray bg |
| Table body | Times New Roman | 10pt | Regular | Black |
| Footnotes | Times New Roman | 9pt | Regular | Gray (#666666) |
| Page numbers | Times New Roman | 10pt | Regular | Gray |

**Note:** The DOCX generator (generate_bp_v2.py) currently uses Garamond. The standard specification calls for Times New Roman 12pt for body text. Ensure consistency with the chosen font family across all sections.

### Paragraph Formatting
- **Line spacing:** 1.15 (body text), 1.0 (tables)
- **Paragraph spacing:** 6pt before, 6pt after
- **Maximum paragraph length:** 200 words. Break longer paragraphs into smaller ones for readability.
- **Alignment:** Justified (body text), Left-aligned (headings)
- **First line indent:** None (use spacing between paragraphs instead)

### Table Formatting

| Property | Specification |
|----------|--------------|
| Header row background | Gray (#E8E0D4 beige or #D9D9D9 light gray) |
| Header text | Bold, centered |
| Border style | Thin solid lines (#CCCCCC light gray) |
| Cell padding | 4pt all sides |
| Table width | 100% page width (auto-fit) |
| Alignment | Center on page |

**Table Context Rules:**
1. Every table MUST have an introductory paragraph before it (minimum 2 sentences)
2. Every table MUST have a concluding paragraph after it (minimum 1 sentence with strategic insight)
3. Never present a "naked" table without surrounding context
4. Use tables for comparative/numeric data. Use prose for narrative/descriptive content.

**Table Markdown Format:**
```markdown
[blank line]
Introductory context paragraph here (minimum 2 sentences).

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data     | Data     | Data     |
| Data     | Data     | Data     |

Concluding insight paragraph here.
[blank line]
```

### Headings

- **##** for main section titles (one per section file)
- **###** for subsections within a section
- **####** for sub-subsections (use sparingly)
- No heading should be followed immediately by another heading without intervening text
- No markdown separators (---, ***, ===) between sections

### Lists

- Use bullet points (-) for unordered lists
- Use numbered lists (1. 2. 3.) for sequential/priority items
- Maximum nesting depth: 2 levels
- Each list item should be a complete thought (not fragments)

### Bold and Emphasis

- **Bold** for key terms, company names, product names, and important metrics
- *Italic* for foreign terms, book titles, or emphasis (use sparingly)
- No underline in body text
- No ALL CAPS except for acronyms (SWOT, DRE, ESG, B2B, B2C)

### Citations and References

- **In-text:** Superscript numbers only: `text[1]`
- **No inline references:** Do not list sources within the section body
- **References section (S40):** Consolidated bibliography at the end
- **Preferred sources:** .gov domains (BLS, Census, OSHA, CDC, HRSA, HHS)
- **Never fabricate URLs**

### Page Elements

- **Header:** Company name (right-aligned)
- **Footer:** "CONFIDENTIAL" in a dark bar (#3B4A3A) with page number
- **Page breaks:** Between major sections (each Block starts on a new page)
- **Table of Contents:** Auto-generated from headings

### Prohibited Formatting

1. No emojis anywhere in the document
2. No markdown horizontal rules (---, ***, ===)
3. No code blocks (unless in technical/IT-related sections)
4. No colored text in body (color reserved for headings and table headers)
5. No images or graphics in the markdown source (added during DOCX assembly)
6. No bullet-only sections (must have prose context)

### Target Document Length

- **Total:** 55-65 pages (assembled DOCX)
- **Per section:** 500-700 words (standard), 400 words (short), 900 words (financial)
- **Total word count:** Approximately 25,000-30,000 words across all 42 sections
