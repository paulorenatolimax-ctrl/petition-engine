# Premium DOCX Design System — EB-1A Petition Documents

> **Owner:** Paulo (paulorenatolima@yahoo.com.br)
> **Beneficiary:** Antônio Carlos de Andrade Santana
> **Status:** User-approved ("estupendo") — canonical design for all EB-1A petition evidence documents
> **Last Updated:** 2026-04-01

---

## Overview

This document defines the premium document design system used for Antônio Santana's EB-1A Extraordinary Ability petition. It was built with **Node.js + docx-js** (`docx` npm package) and a shared style module (`premium_style.js`).

**CRITICAL:** Never replace this with `python-docx` output. The user explicitly rejected python-docx twice as inferior quality.

---

## Technology Stack

- **Runtime:** Node.js
- **Library:** `docx` (docx-js) — npm package
- **Style Module:** `premium_style.js` — shared module with all design functions
- **Image Handling:** PNG (offset 16 = width, offset 20 = height), JPEG (SOF marker parsing)
- **Save Method:** `S.savePremiumDoc(doc, filepath)` — NOT `Packer.toBuffer()`

---

## Color Scheme (PROEX)

| Token       | Hex       | Usage                                  |
|-------------|-----------|----------------------------------------|
| Navy        | `#1B2A4A` | Titles, headers, metadata labels       |
| Gold        | `#C9A96E` | Dividers, underlines, borders          |
| AccentBlue  | `#2C5F8A` | Subtitles, subheaders                  |
| DarkGray    | `#333333` | Body text                              |
| MedGray     | `#666666` | Footer text, header category           |
| LightGray   | `#F7F7F7` | Metadata table label cell background   |

---

## Typography

- **Font Family:** Garamond (throughout all elements)
- **Sizes:**
  - H1 (Title): 36pt
  - H2 (Subtitle): 28pt
  - H3 (Section Header): 28pt
  - Sub-header: 24pt
  - Body: 24 half-points (12pt rendered)
  - Metadata: 20 half-points (10pt rendered)
  - Footer: 16 half-points (8pt rendered)

---

## Document Structure Pattern

Every document follows this exact sequence:

```
1. premiumHeader()     — Running header: "ANTÔNIO CARLOS DE ANDRADE SANTANA" (navy bold)
                         + tab + category text (gray italic), gold bottom border

2. titleBar()          — Navy bold text (36pt) + gold bottom border (12pt weight)

3. subtitleLine()      — AccentBlue italic (28pt)

4. spacer(120)         — Small vertical gap after subtitle ⚠️ MUST be 120, not 200

5. metadataTable()     — Two-column table (2800 + 6560 DXA widths)
                         No visible borders
                         Gray (#F7F7F7) background on label cells
                         White background on value cells

6. spacer(200)         — Medium vertical gap before divider

7. goldDivider()       — Empty paragraph with gold bottom border (4pt, #C9A96E)
                         ⚠️ MUST appear between metadata table and content sections

8. sectionHeader()     — Auto-uppercases text, navy bold (28pt), gold underline (2pt)

9. bodyText()          — Justified alignment, 1.15× line spacing, Garamond 12pt

10. subHeader()        — AccentBlue bold (24pt) — for subsections within content

11. confidentialFooter() — Running footer: "EB-1A Petition — Antônio Carlos de Andrade Santana"
                           + tab + page number, gold top border
```

---

## Image Handling

- **Max Width:** 400px (do NOT use 500px — user corrected this)
- **Aspect Ratio:** Always preserved — read actual dimensions from file bytes
- **Alignment:** Centered
- **Format:** Always specify `type: "png"` in ImageRun options
- **PNG Dimensions:** Width at byte offset 16, Height at byte offset 20 (NOT 24)
- **JPEG Dimensions:** Parse SOF markers (0xFFC0, 0xFFC1, 0xFFC2)

---

## Key Design Functions (premium_style.js exports)

```javascript
const S = require('./premium_style.js');

S.titleBar(text)                    // Navy bold 36pt + gold border
S.subtitleLine(text)                // AccentBlue italic 28pt
S.sectionHeader(text)               // Auto-uppercases, navy bold 28pt, gold underline
S.subHeader(text)                   // AccentBlue bold 24pt
S.bodyText(text)                    // Justified, 1.15× spacing, Garamond 12pt
S.metadataTable(rows)               // [{label, value}] → styled 2-column table
S.spacer(height)                    // Empty paragraph with specified height in TWIPs
S.goldDivider()                     // Gold horizontal rule (4pt border)
S.premiumHeader(category)           // Running page header with name + category
S.confidentialFooter()              // Running page footer with petition info + page #
S.createPremiumDoc(header, footer)  // Creates Document with margins and default styles
S.savePremiumDoc(doc, filepath)     // Saves using Packer — ALWAYS use this to save
```

---

## Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|----------|-----------|
| `spacer(200)` after subtitle | `spacer(120)` after subtitle |
| No divider between table and content | `spacer(200)` + `goldDivider()` between table and sections |
| `Packer.toBuffer()` directly | `S.savePremiumDoc(doc, filepath)` |
| `python-docx` | `docx` (docx-js, Node.js) |
| Max image width 500px | Max image width 400px |
| PNG height at offset 24 | PNG height at offset 20 |
| Simplified/short text | Rich, detailed professional text |

---

## File Locations

- **Style Module (persistent):** `/EB1A_RESUME_SYSTEM/premium_style.js`
- **11 Evidence Documents:** `/00_DOCUMENTACAO_COMPLETA_PARA_TRADUCAO/` (organized by category subfolders)
- **Memory file:** `/.auto-memory/premium_design_skill.md`

---

## Approval History

- **User Reaction:** "estupendo" (first approval), "tooop irmão, ficou bem legal!!" (final approval of all 11 docs)
- **Rejections:** python-docx output rejected twice; simplified text rejected; wrong spacer/divider pattern rejected
