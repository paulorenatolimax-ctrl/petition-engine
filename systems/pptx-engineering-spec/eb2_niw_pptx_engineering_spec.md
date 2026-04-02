# EB-2 NIW PPTX Engineering Spec — Pixel-Perfect Slide Generation
## Extracted from Live Deck (Leandro Borges — Methodology & Declaration)
## Version: 1.0 — April 2, 2026

---

## CRITICAL: Use python-pptx. All values in POINTS (1pt = 12700 EMU)

### EMU Conversion Table
| Points | EMU | Usage |
|--------|-----|-------|
| 1 | 12700 | Minimum unit |
| 2 | 25400 | Gold rule height, accent bar |
| 3 | 38100 | Card accent bar height |
| 4 | 50800 | Decorative bars |
| 8 | 101600 | Arrow height |
| 16 | 203200 | Circle small |
| 25 | 317500 | Circle medium icon |
| 34 | 431800 | Circle pipeline |
| 40 | 508000 | Circle large |
| 56 | 711200 | TitleBar height |
| 58 | 736600 | TitleBar height (standard) |
| 104 | 1320800 | Quadrant center circle |
| 218 | 2768600 | Card width (2-col) |
| 325 | 4127500 | Card width (comparison) |
| 720 | 9144000 | Slide width (10 inches) |
| 405 | 5143500 | Slide height (7.5 inches) |

---

## SLIDE DIMENSIONS
- Width: 720pt (9144000 EMU) = 10 inches
- Height: 405pt (5143500 EMU) = 7.5 inches (WIDESCREEN 16:9)

---

## COLOR PALETTE
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Navy | #1B2A4A | 27,42,74 | TitleBar bg, card bg, text |
| NavyDark | #0F1B2E | 15,27,46 | Gradient end, master bg darker |
| Gold | #C9A96E | 201,169,110 | Dividers, rules, accents, circles |
| GoldDark | #8B7355 | 139,115,85 | Footer bg |
| Cream | #F5F0E8 | 245,240,232 | Light text on dark bg |
| White | #FFFFFF | 255,255,255 | Body text, card text |
| Beige | #E8D5B7 | 232,213,183 | Footer text |
| Bronze | #A08B6E | 160,139,110 | Footer accents |

---

## TYPOGRAPHY
| Element | Font | Size | Color | Weight | Spacing |
|---------|------|------|-------|--------|---------|
| Title (slide title) | Palatino Linotype | 36pt | Cream | Bold | spc=200 (normal) |
| Title (name on title slide) | Palatino Linotype | 28pt | Gold | Bold | spc=400 (extra wide) |
| TitleBar text | Palatino Linotype | 14pt | Cream | Bold | spc=300 |
| Section header | Palatino Linotype | 28pt | Navy | Bold | spc=200 |
| Sub-header | Garamond | 13pt | Navy | Bold | — |
| Card title | Garamond | 11pt | Gold | Bold | spc=100 |
| Card body | Garamond | 9.5pt | White/Cream | Normal | — |
| Footer | Garamond | 8pt | Beige/Bronze | Normal | spc=200 |
| Pipeline label | Arial Narrow | 9pt | Navy | Bold | spc=-100 |
| Circle number | Garamond | 14pt | White | Bold | — |
| Metric value | Palatino Linotype | 24pt | Gold | Bold | — |
| Metric label | Garamond | 9pt | Cream | Normal | — |

### CRITICAL: Font size 14pt is the MAXIMUM for card body text
Testing showed 14pt overflowed in 18/26 slides. Always use:
- Card body: 9.5pt (safe)
- Card title: 11pt (safe)
- Pipeline label: 9pt Arial Narrow with spc=-100 (for long words like "IMPLEMENTATION")

---

## MASTER BACKGROUND
**GRADIENT (not solid)**:
- Type: Linear gradient, angle=270° (top to bottom)
- Stop 1: NavyDark #0F1B2E at position 0%
- Stop 2: Navy #1B2A4A at position 100%

**NEVER use solid fill** — gradient is mandatory for the professional look.

---

## LAYOUT SPECIFICATIONS

### 1. TITLE SLIDE (layout_id: 379)
```
Decorative bar top:    x=0    y=0    w=720  h=4    fill=Gold
Decorative bar bottom: x=0    y=401  w=720  h=4    fill=Gold
Name textbox:          x=100  y=134  w=520  h=54   align=center
Gold rule:             x=260  y=196  w=200  h=2    fill=Gold
Subtitle textbox:      x=100  y=210  w=520  h=52   align=center
Visa type textbox:     x=100  y=280  w=520  h=20   align=center
Date textbox:          x=100  y=310  w=520  h=20   align=center
Footer:                x=0    y=377  w=720  h=28   (standard footer)
```

### 2. TABLE OF CONTENTS (layout_id: 415)
```
TitleBar:              x=0    y=0    w=720  h=56   fill=Navy gradient
Two columns:
  Left column:
    Number TBs:        x=22   y=varies  w=30   h=20
    Title TBs:         x=58   y=varies  w=300  h=20
    Desc TBs:          x=58   y=title+20  w=300  h=16
  Right column:
    Number TBs:        x=374  y=varies  w=30   h=20
    Title TBs:         x=412  y=varies  w=300  h=20
    Desc TBs:          x=412  y=title+20  w=300  h=16
Footer:                x=0    y=375  w=720  h=28
```
Vertical spacing between entries: 40pt

### 3. SECTION HEADER (layout_id: 416)
```
GoldRule top:          x=60   y=110  w=600  h=2    fill=Gold
Title textbox:         x=60   y=122  w=600  h=85   align=center
Subtitle textbox:      x=60   y=219  w=600  h=50   align=center
GoldRule bottom:       x=60   y=281  w=600  h=2    fill=Gold
Footer:                x=0    y=367  w=720  h=28
```
**NOTE**: GoldRule width is 600pt (NOT 720pt full-width). Centered with x=60.

### 4. FIVE-COLUMN PIPELINE (layout_id: 417/421)
```
TitleBar:              x=0    y=0    w=720  h=58   fill=Navy gradient

Circles (5): y=68 w=34 h=34 fill=Gold
  x positions:         75, 209, 343, 477, 611

Arrows (4): y=82 w=96 h=6 fill=Gold
  x positions:         111, 245, 379, 513

Circle labels: y=74 h=16 (above circles)
  x centered on each circle

Vertical lines: y=102 w=1 h=14 (connecting circle to card)
  x positions:         91.5, 225.5, 359.5, 493.5, 627.5

Cards (5): y=118 h=247 w=124
  x positions:         30, 164, 298, 432, 566
  Accent bar:          same x, y=118, w=124, h=3, fill=Gold
  MTB (text):          x+3, y=126, w=118, h=234

Footer:                x=0    y=367  w=720  h=28
```

### 5. FOUR-COLUMN PIPELINE (layout_id: 424)
```
TitleBar:              x=0    y=0    w=720  h=58

Circles (4): y=80 w=40 h=40 fill=Gold
  x positions:         87.6, 256.2, 424.8, 593.4

Arrows (3): y=96 w=122.6 h=8 fill=Gold
  x positions:         130.6, 299.2, 467.8

Vertical lines: y=120 w=1 h=17
  x positions:         107.1, 275.7, 444.3, 612.9

Cards (4): y=137 w=157.3 h=218
  x positions:         29, 197.6, 366.2, 534.7
  MTBs:                x+10, y=149, w=137.3, h=202

Footer:                x=0    y=367  w=720  h=28
```

### 6. FOUR-CARD GRID (layout_id: 414)
```
TitleBar:              x=0    y=0    w=720  h=58

Cards (4): y=115 h=136 w=155.3
  x positions:         29, 198.3, 367.5, 536.8
  Accent bar:          same x, y=115, w=155.3, h=3, fill=Gold
  Icon TB:             x, y=130, w=155.3, h=35
  Subtitle TB:         x+8, y=170, w=139.3, h=18
  Body TB:             x+8, y=190, w=139.3, h=55

Footer:                x=0    y=367  w=720  h=28
```

### 7. SIX-CARD 2×3 GRID (layout_id: 418)
```
TitleBar:              x=0    y=0    w=720  h=58

Cards: 2 columns × 3 rows
  Left col x=25, Right col x=364. Both w=324
  Row 1: y=80  h=90
  Row 2: y=178 h=88
  Row 3: y=274 h=84  (NOTE: h=84, NOT 90 — clearance for footer)
  Gap between rows: 8pt

  Per card:
    Circle:            x+7, y+11, w=25, h=25, fill=Gold
    Title TB:          x+40, y+11, w=274, h=18
    Body TB:           x+40, y+33, w=274, h=55

Footer:                x=0    y=367  w=720  h=28
```

### 8. QUADRANT / HUB-SPOKE (layout_id: 420)
```
TitleBar:              x=0    y=0    w=720  h=58

Center circle:         x=312  y=124  w=104  h=104  fill=Gold

Cards (4):
  Top-left:            x=29   y=75   w=218  h=130
  Top-right:           x=473  y=75   w=218  h=130
  Bottom-left:         x=29   y=235  w=218  h=130
  Bottom-right:        x=473  y=235  w=218  h=130

  Per card:
    Accent bar:        same x, same y, w=218, h=3, fill=Gold
    MTB:               x+10, y+12, w=198, h=114

Connector lines:
  Horizontal:          y=140 and y=222 (connecting cards to center)

Footer:                x=0    y=367  w=720  h=28
```

### 9. TWO-COLUMN COMPARISON (layout_id: 389)
```
TitleBar:              x=0    y=0    w=720  h=58

Left header:           x=29   y=77   w=325  h=35   fill=Navy
Right header:          x=365  y=77   w=325  h=35   fill=Navy
Left card:             x=29   y=115  w=325  h=240
Right card:            x=365  y=115  w=325  h=240
Left MTB:              x=39   y=127  w=305  h=224
Right MTB:             x=375  y=127  w=305  h=224
Divider line:          x=360  y=77   w=2    h=278  fill=Gold

Footer:                x=0    y=367  w=720  h=28
```

### 10. FULL-TEXT SLIDE (layout_id: 397)
```
TitleBar:              x=0    y=0    w=720  h=58

MTB (body text):       x=29   y=80   w=663  h=278
  Font: Garamond 9.5pt, color=Cream, line spacing 1.3

Footer:                x=0    y=367  w=720  h=28
```

### 11. TABLE SLIDE (layout_id: 386)
```
TitleBar:              x=0    y=0    w=720  h=58

Table:                 x=29   y=80   w=663  h=variable
  Header row: Navy bg, Gold text, Garamond 9pt Bold
  Data rows: alternating Navy/NavyDark, Cream text, Garamond 9pt
  Border: 0.5pt Gold between rows

Footer:                x=0    y=367  w=720  h=28
```

---

## STANDARD FOOTER (all slides except title)
```
Background rect:       x=0    y=367  w=720  h=38   fill=GoldDark #8B7355
Left text:             "EB-2 NIW Petition — [CLIENT NAME]"
                       Garamond 8pt, Beige #E8D5B7, spc=200
Right text:            "CONFIDENTIAL"
                       Garamond 7pt, Bronze #A08B6E, italic, spc=200
Page number:           right-aligned, Garamond 7pt, Bronze
```
**CRITICAL**: Footer text is Beige/Bronze on GoldDark background.
**NEVER** use Navy text on Navy background (invisible).

---

## STANDARD TITLEBAR (all slides except title & section header)
```
Background rect:       x=0    y=0    w=720  h=58   fill=Navy gradient
                       Gradient: Navy #1B2A4A → NavyDark #0F1B2E (left to right)
Text:                  Palatino Linotype 14pt, Cream, Bold, spc=300
                       Align: center vertically, left with margin=20pt
```
**CRITICAL**: TitleBar is edge-to-edge (x=0, w=720). Only TEXT has margin.

---

## 9 DOCUMENTED PITFALLS (from live testing)

### 1. Font Size Overflow
**Problem**: 14pt body text overflows card boundaries in 18/26 slides
**Solution**: ALWAYS use 9.5pt for card body, 11pt for card title
**NEVER**: Use 14pt for anything inside a card

### 2. Long Word Overflow ("IMPLEMENTATION")
**Problem**: Words like "IMPLEMENTATION", "INFRASTRUCTURE" overflow circle labels
**Solution**: Use Arial Narrow 9pt with letter-spacing spc=-100
**Applies to**: Pipeline circle labels, any constrained-width text

### 3. Circle Text Off-Center
**Problem**: Text placed inside ellipse shape gets clipped/misaligned
**Solution**: Use SEPARATE textbox overlaid on the circle, not text inside the shape
**Pattern**: Create Ellipse (no text) + TextBox (same position, centered)

### 4. Footer Invisible
**Problem**: Navy text on Navy master background = invisible footer
**Solution**: Footer bg is GoldDark #8B7355, text is Beige #E8D5B7 / Bronze #A08B6E
**NEVER**: Use Navy or White for footer text

### 5. GoldRule Width (Section Headers)
**Problem**: Full-width gold rule (720pt) looks cheap
**Solution**: Section header gold rules are 600pt wide, centered (x=60)
**Other gold rules**: Title slide decorative bars ARE full-width (720pt)

### 6. Row Height Inequality (6-Card Grid)
**Problem**: All 3 rows same height (90pt) → row 3 overlaps footer
**Solution**: Row 1=90pt, Row 2=88pt, Row 3=84pt (descending for footer clearance)

### 7. Missing Gradients
**Problem**: Solid Navy fill looks flat and unprofessional
**Solution**: ALWAYS use gradient fills:
  - Master bg: NavyDark → Navy (270°, top to bottom)
  - TitleBar: Navy → NavyDark (0°, left to right)
  - Cards: subtle Navy → NavyDark (270°)

### 8. TitleBar Not Edge-to-Edge
**Problem**: TitleBar with x=29 has visible gaps at edges
**Solution**: TitleBar x=0, w=720 (full width). Only text has left margin.

### 9. Letter-Spacing Hierarchy
**Problem**: Same letter-spacing on all text looks monotonous
**Solution**: Hierarchical spacing:
  - Name on title slide: spc=400 (widest)
  - TitleBar text: spc=300
  - Section headers: spc=200
  - Footer: spc=200
  - Card titles: spc=100
  - Pipeline labels: spc=-100 (compressed)

---

## FORMULAS FOR DYNAMIC LAYOUTS

### N-Column Pipeline
```
margin = 30  # left/right margin
gap = 8      # gap between cards
total_width = 720 - (2 * margin)  # 660
card_width = (total_width - (N-1) * gap) / N
card_x[i] = margin + i * (card_width + gap)
circle_x[i] = card_x[i] + card_width / 2 - circle_size / 2
arrow_x[i] = circle_x[i] + circle_size  # starts after circle
arrow_w = card_x[i+1] + card_width/2 - circle_size/2 - arrow_x[i]  # ends before next circle
```

### N-Card Grid (2 columns)
```
col_gap = 15
col_width = (720 - 2*margin - col_gap) / 2  # ~324
left_x = margin  # 25
right_x = margin + col_width + col_gap  # 364
row_gap = 8
row_height = (footer_y - first_row_y - (rows-1)*row_gap) / rows
```

---

## SLIDE TYPE SELECTION GUIDE

| Content Type | Layout | When to Use |
|-------------|--------|-------------|
| Process/Flow | 5-col pipeline | 5 sequential steps |
| Process/Flow | 4-col pipeline | 4 sequential phases |
| Features | 4-card grid | 4 equal features/pillars |
| Details | 6-card 2×3 grid | 6 items with icon + description |
| Framework | Quadrant/Hub | Central concept + 4 aspects |
| Comparison | Two-column | Before/After, Conventional/Innovative |
| Data | Table | Structured data, comparisons with numbers |
| Narrative | Full-text | Long explanations, legal text, summaries |
| Transition | Section header | Between major sections |
| Opening | Title slide | First slide only |
| Navigation | TOC | Second slide only |

### VARIATION RULE
**NEVER** use the same layout type 2 slides in a row.
Recommended pattern: pipeline → cards → text → table → quadrant → cards → pipeline

---

*Spec extracted from live deck by Cowork. All coordinates verified against rendered output.*
*Last updated: April 2, 2026*
