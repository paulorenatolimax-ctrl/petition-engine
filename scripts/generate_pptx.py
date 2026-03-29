#!/usr/bin/env python3
"""
PETITION ENGINE — Professional PPTX Generator
Design DNA: André Cerbasi Dossier (39-slide benchmark)
Palette: Navy #1B2A4A | Gold #B8860B | Cream #E8D5B7 | Dark Gray #3A3A3A

Usage:
    python3 generate_pptx.py --type methodology --content content.json --output output.pptx
    python3 generate_pptx.py --type declaration --content content.json --output output.pptx
"""

import json
import os
import sys
import argparse
import re
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn
from datetime import datetime

# ============================================================
# DESIGN SYSTEM — Cerbasi DNA
# ============================================================
NAVY      = RGBColor(0x1B, 0x2A, 0x4A)
GOLD      = RGBColor(0xB8, 0x86, 0x0B)
CREAM     = RGBColor(0xE8, 0xD5, 0xB7)
DARK_GRAY = RGBColor(0x3A, 0x3A, 0x3A)
LIGHT_GRAY= RGBColor(0xF5, 0xF5, 0xF5)
WHITE     = RGBColor(0xFF, 0xFF, 0xFF)
MED_GRAY  = RGBColor(0x99, 0x99, 0x99)
DARK_BG   = RGBColor(0x0F, 0x17, 0x2A)

# Typography
FONT_TITLE    = "Georgia"
FONT_BODY     = "Calibri"
FONT_ACCENT   = "Georgia"

# Slide dimensions (widescreen 10x5.625)
SLIDE_W = Inches(10)
SLIDE_H = Inches(5.625)

# Margins
M_LEFT   = Inches(0.6)
M_RIGHT  = Inches(0.6)
M_TOP    = Inches(0.5)
M_BOTTOM = Inches(0.5)

CONTENT_W = SLIDE_W - M_LEFT - M_RIGHT  # usable width


# ============================================================
# HELPER FUNCTIONS
# ============================================================
def set_slide_bg(slide, color):
    """Set solid background color for a slide."""
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_shape_rect(slide, left, top, width, height, fill_color, opacity=1.0):
    """Add a filled rectangle shape."""
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    shape.line.fill.background()
    return shape


def add_textbox(slide, left, top, width, height):
    """Add a textbox and return its text_frame."""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    return tf


def add_text(tf, text, size=Pt(11), color=DARK_GRAY, bold=False, italic=False,
             alignment=PP_ALIGN.LEFT, font_name=None, space_after=Pt(4)):
    """Add a paragraph with formatted text to a text_frame."""
    p = tf.add_paragraph() if tf.paragraphs[0].text else tf.paragraphs[0]
    if tf.paragraphs[0].text:
        p = tf.add_paragraph()
    p.alignment = alignment
    p.space_after = space_after
    run = p.add_run()
    run.text = text
    run.font.size = size
    run.font.color.rgb = color
    run.font.bold = bold
    run.font.italic = italic
    run.font.name = font_name or FONT_BODY
    return p


def add_footer(slide, client_name, doc_label):
    """Add footer bar to bottom of slide — cream text on dark bar."""
    # Dark bar
    bar_h = Inches(0.3)
    bar_top = SLIDE_H - bar_h
    add_shape_rect(slide, Inches(0), bar_top, SLIDE_W, bar_h, NAVY)

    # Footer text
    tf = add_textbox(slide, M_LEFT, bar_top, CONTENT_W, bar_h)
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    run = tf.paragraphs[0].add_run()
    run.text = f"{client_name} | {doc_label}"
    run.font.size = Pt(8)
    run.font.color.rgb = CREAM
    run.font.name = FONT_BODY
    run.font.italic = True


def add_gold_accent_line(slide, top, width=None):
    """Add a thin gold horizontal line."""
    w = width or Inches(2)
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, M_LEFT, top, w, Pt(2))
    shape.fill.solid()
    shape.fill.fore_color.rgb = GOLD
    shape.line.fill.background()
    return shape


# ============================================================
# SLIDE BUILDERS
# ============================================================
def build_cover_slide(prs, client_name, title, subtitle, doc_label, visa_type=""):
    """Slide 1 — Cover with dark background, gold accents."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank
    set_slide_bg(slide, DARK_BG)

    # Gold accent bar top
    add_shape_rect(slide, Inches(0), Inches(0), SLIDE_W, Pt(4), GOLD)

    # Client name — large bold
    tf = add_textbox(slide, M_LEFT, Inches(1.2), CONTENT_W, Inches(0.8))
    add_text(tf, client_name, size=Pt(36), color=WHITE, bold=True,
             font_name=FONT_TITLE, alignment=PP_ALIGN.LEFT)

    # Visa type — small
    if visa_type:
        tf2 = add_textbox(slide, M_LEFT, Inches(1.9), CONTENT_W, Inches(0.4))
        add_text(tf2, visa_type, size=Pt(16), color=GOLD, bold=False,
                 font_name=FONT_BODY, alignment=PP_ALIGN.LEFT)

    # Gold line
    add_gold_accent_line(slide, Inches(2.3), Inches(3))

    # Title
    tf3 = add_textbox(slide, M_LEFT, Inches(2.6), CONTENT_W, Inches(0.6))
    add_text(tf3, title, size=Pt(18), color=CREAM, bold=False,
             font_name=FONT_ACCENT, alignment=PP_ALIGN.LEFT, italic=True)

    # Subtitle
    tf4 = add_textbox(slide, M_LEFT, Inches(3.2), CONTENT_W, Inches(0.6))
    add_text(tf4, subtitle, size=Pt(11), color=LIGHT_GRAY, bold=False,
             font_name=FONT_BODY, alignment=PP_ALIGN.LEFT)

    # Date
    tf5 = add_textbox(slide, M_LEFT, Inches(4.4), CONTENT_W, Inches(0.3))
    add_text(tf5, datetime.now().strftime("%B %Y"), size=Pt(10), color=MED_GRAY,
             font_name=FONT_BODY, alignment=PP_ALIGN.LEFT)

    add_footer(slide, client_name, doc_label)
    return slide


def build_toc_slide(prs, sections, client_name, doc_label):
    """Slide 2 — Table of Contents with Roman numerals."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)

    # Title
    tf_title = add_textbox(slide, M_LEFT, M_TOP, CONTENT_W, Inches(0.6))
    add_text(tf_title, "Table of Contents", size=Pt(32), color=NAVY, bold=True,
             font_name=FONT_TITLE)

    # Gold line under title
    add_gold_accent_line(slide, Inches(1.0), Inches(2))

    # Entries — 2 columns if > 5
    romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
              "XI", "XII", "XIII", "XIV", "XV"]

    col_w = CONTENT_W / 2 if len(sections) > 5 else CONTENT_W
    y_start = Inches(1.3)
    items_per_col = (len(sections) + 1) // 2 if len(sections) > 5 else len(sections)

    for i, sec in enumerate(sections):
        col = 0 if i < items_per_col else 1
        row = i if col == 0 else i - items_per_col
        x = M_LEFT + (col * col_w)
        y = y_start + Inches(row * 0.35)

        # Roman numeral
        tf_num = add_textbox(slide, x, y, Inches(0.4), Inches(0.3))
        add_text(tf_num, romans[i] if i < len(romans) else str(i+1),
                 size=Pt(20), color=GOLD, bold=True, font_name=FONT_TITLE,
                 alignment=PP_ALIGN.CENTER)

        # Section title
        tf_sec = add_textbox(slide, x + Inches(0.5), y, col_w - Inches(0.6), Inches(0.3))
        add_text(tf_sec, sec.get("title", f"Section {i+1}"),
                 size=Pt(14), color=NAVY, bold=True, font_name=FONT_BODY)

    add_footer(slide, client_name, doc_label)
    return slide


def build_section_divider(prs, section_title, section_subtitle, client_name, doc_label):
    """Full-bleed section divider — gold title on dark background."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DARK_BG)

    # Gold accent bar
    add_shape_rect(slide, Inches(0.6), Inches(2.0), Inches(3), Pt(3), GOLD)

    # Title — large gold
    tf = add_textbox(slide, M_LEFT, Inches(2.2), CONTENT_W, Inches(1.0))
    add_text(tf, section_title.upper(), size=Pt(44), color=GOLD, bold=True,
             font_name=FONT_TITLE, alignment=PP_ALIGN.LEFT)

    # Subtitle
    if section_subtitle:
        tf2 = add_textbox(slide, M_LEFT, Inches(3.3), CONTENT_W, Inches(0.5))
        add_text(tf2, section_subtitle, size=Pt(14), color=CREAM, italic=True,
                 font_name=FONT_BODY, alignment=PP_ALIGN.LEFT)

    add_footer(slide, client_name, doc_label)
    return slide


def build_content_slide(prs, title, body_paragraphs, client_name, doc_label,
                        bullets=None, highlight_box=None):
    """Standard content slide — white bg, navy title, body text."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)

    # Title
    tf_title = add_textbox(slide, M_LEFT, M_TOP, CONTENT_W, Inches(0.6))
    add_text(tf_title, title, size=Pt(24), color=NAVY, bold=True,
             font_name=FONT_TITLE)

    # Gold accent under title
    add_gold_accent_line(slide, Inches(1.0), Inches(1.5))

    # Body text
    y_body = Inches(1.2)
    body_w = CONTENT_W
    if highlight_box:
        body_w = CONTENT_W * 0.6  # leave room for highlight

    tf_body = add_textbox(slide, M_LEFT, y_body, body_w, Inches(3.5))

    for para_text in body_paragraphs:
        if not para_text.strip():
            continue
        add_text(tf_body, para_text.strip(), size=Pt(11), color=DARK_GRAY,
                 font_name=FONT_BODY, space_after=Pt(8))

    # Bullet points
    if bullets:
        for bullet in bullets:
            p = tf_body.add_paragraph()
            p.space_after = Pt(4)
            p.level = 0
            run = p.add_run()
            run.text = f"  {bullet.strip()}"
            run.font.size = Pt(11)
            run.font.color.rgb = DARK_GRAY
            run.font.name = FONT_BODY

    # Highlight box (right side)
    if highlight_box:
        box_left = M_LEFT + body_w + Inches(0.3)
        box_w = CONTENT_W - body_w - Inches(0.3)
        rect = add_shape_rect(slide, box_left, y_body, box_w, Inches(3.0), LIGHT_GRAY)

        tf_box = add_textbox(slide, box_left + Inches(0.15), y_body + Inches(0.15),
                             box_w - Inches(0.3), Inches(2.7))
        if highlight_box.get("title"):
            add_text(tf_box, highlight_box["title"], size=Pt(12), color=NAVY,
                     bold=True, font_name=FONT_BODY)
        if highlight_box.get("text"):
            add_text(tf_box, highlight_box["text"], size=Pt(10), color=DARK_GRAY,
                     font_name=FONT_BODY)

    add_footer(slide, client_name, doc_label)
    return slide


def build_key_metrics_slide(prs, title, metrics, client_name, doc_label):
    """Metrics slide — big numbers with labels (like Cerbasi's 2,000+ / 60+)."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)

    # Title
    tf_title = add_textbox(slide, M_LEFT, M_TOP, CONTENT_W, Inches(0.6))
    add_text(tf_title, title, size=Pt(24), color=NAVY, bold=True,
             font_name=FONT_TITLE)

    add_gold_accent_line(slide, Inches(1.0), Inches(1.5))

    # Metrics grid (up to 4 in a row)
    num_metrics = len(metrics)
    col_w = CONTENT_W / min(num_metrics, 4)
    y_metrics = Inches(1.6)

    for i, metric in enumerate(metrics[:4]):
        col = i % 4
        x = M_LEFT + (col * col_w)

        # Background card
        card_w = col_w - Inches(0.2)
        add_shape_rect(slide, x + Inches(0.1), y_metrics, card_w, Inches(2.2), LIGHT_GRAY)

        # Big number
        tf_num = add_textbox(slide, x + Inches(0.1), y_metrics + Inches(0.3),
                             card_w, Inches(1.0))
        add_text(tf_num, str(metric.get("value", "N/A")), size=Pt(36), color=GOLD,
                 bold=True, font_name=FONT_TITLE, alignment=PP_ALIGN.CENTER)

        # Label
        tf_label = add_textbox(slide, x + Inches(0.1), y_metrics + Inches(1.3),
                               card_w, Inches(0.8))
        add_text(tf_label, metric.get("label", ""), size=Pt(11), color=NAVY,
                 bold=True, font_name=FONT_BODY, alignment=PP_ALIGN.CENTER)

    # Second row if > 4
    if num_metrics > 4:
        y_row2 = y_metrics + Inches(2.5)
        for i, metric in enumerate(metrics[4:8]):
            col = i % 4
            x = M_LEFT + (col * col_w)
            card_w = col_w - Inches(0.2)
            add_shape_rect(slide, x + Inches(0.1), y_row2, card_w, Inches(1.5), LIGHT_GRAY)

            tf_num = add_textbox(slide, x + Inches(0.1), y_row2 + Inches(0.2),
                                 card_w, Inches(0.6))
            add_text(tf_num, str(metric.get("value", "")), size=Pt(28), color=GOLD,
                     bold=True, font_name=FONT_TITLE, alignment=PP_ALIGN.CENTER)

            tf_label = add_textbox(slide, x + Inches(0.1), y_row2 + Inches(0.8),
                                   card_w, Inches(0.5))
            add_text(tf_label, metric.get("label", ""), size=Pt(10), color=NAVY,
                     bold=True, font_name=FONT_BODY, alignment=PP_ALIGN.CENTER)

    add_footer(slide, client_name, doc_label)
    return slide


def build_table_slide(prs, title, headers, rows, client_name, doc_label):
    """Table slide — navy header, clean rows."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)

    # Title
    tf_title = add_textbox(slide, M_LEFT, M_TOP, CONTENT_W, Inches(0.5))
    add_text(tf_title, title, size=Pt(20), color=NAVY, bold=True,
             font_name=FONT_TITLE)

    # Table
    num_cols = len(headers)
    num_rows = len(rows) + 1  # +1 for header
    table_top = Inches(1.0)
    table_h = Inches(min(0.35 * num_rows, 4.0))

    table_shape = slide.shapes.add_table(num_rows, num_cols,
                                          M_LEFT, table_top, CONTENT_W, table_h)
    table = table_shape.table

    # Header row
    for j, header in enumerate(headers):
        cell = table.cell(0, j)
        cell.text = header
        cell.fill.solid()
        cell.fill.fore_color.rgb = NAVY
        for paragraph in cell.text_frame.paragraphs:
            for run in paragraph.runs:
                run.font.size = Pt(10)
                run.font.color.rgb = WHITE
                run.font.bold = True
                run.font.name = FONT_BODY

    # Data rows
    for i, row_data in enumerate(rows):
        for j, cell_text in enumerate(row_data):
            if j >= num_cols:
                break
            cell = table.cell(i + 1, j)
            cell.text = str(cell_text)
            cell.fill.solid()
            cell.fill.fore_color.rgb = WHITE
            # Remove lateral borders via XML
            tc = cell._tc
            tcPr = tc.get_or_add_tcPr()
            for paragraph in cell.text_frame.paragraphs:
                for run in paragraph.runs:
                    run.font.size = Pt(9)
                    run.font.color.rgb = DARK_GRAY
                    run.font.name = FONT_BODY
                    if j == 0:
                        run.font.bold = True

    add_footer(slide, client_name, doc_label)
    return slide


def build_two_column_slide(prs, title, left_content, right_content, client_name, doc_label):
    """Two-column layout for comparisons, before/after, dual concepts."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)

    # Title
    tf_title = add_textbox(slide, M_LEFT, M_TOP, CONTENT_W, Inches(0.5))
    add_text(tf_title, title, size=Pt(24), color=NAVY, bold=True,
             font_name=FONT_TITLE)

    add_gold_accent_line(slide, Inches(0.9), Inches(1.5))

    col_w = (CONTENT_W - Inches(0.3)) / 2
    y_cols = Inches(1.2)

    # Left column
    tf_left = add_textbox(slide, M_LEFT, y_cols, col_w, Inches(3.5))
    if left_content.get("heading"):
        add_text(tf_left, left_content["heading"], size=Pt(16), color=NAVY,
                 bold=True, font_name=FONT_BODY)
    for para in left_content.get("paragraphs", []):
        add_text(tf_left, para, size=Pt(11), color=DARK_GRAY, font_name=FONT_BODY,
                 space_after=Pt(6))

    # Right column
    tf_right = add_textbox(slide, M_LEFT + col_w + Inches(0.3), y_cols, col_w, Inches(3.5))
    if right_content.get("heading"):
        add_text(tf_right, right_content["heading"], size=Pt(16), color=NAVY,
                 bold=True, font_name=FONT_BODY)
    for para in right_content.get("paragraphs", []):
        add_text(tf_right, para, size=Pt(11), color=DARK_GRAY, font_name=FONT_BODY,
                 space_after=Pt(6))

    add_footer(slide, client_name, doc_label)
    return slide


def build_quote_slide(prs, quote_text, attribution, client_name, doc_label):
    """Full-slide quote — elegant, centered."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DARK_BG)

    # Quote mark
    tf_mark = add_textbox(slide, M_LEFT, Inches(1.0), Inches(1), Inches(1))
    add_text(tf_mark, "\u201C", size=Pt(72), color=GOLD, font_name=FONT_TITLE,
             alignment=PP_ALIGN.LEFT)

    # Quote text
    tf_quote = add_textbox(slide, Inches(1.2), Inches(1.8), Inches(7.5), Inches(2.0))
    add_text(tf_quote, quote_text, size=Pt(18), color=WHITE, italic=True,
             font_name=FONT_ACCENT, alignment=PP_ALIGN.LEFT, space_after=Pt(12))

    # Attribution
    if attribution:
        tf_attr = add_textbox(slide, Inches(1.2), Inches(3.8), Inches(7.5), Inches(0.4))
        add_text(tf_attr, f"-- {attribution}", size=Pt(12), color=CREAM,
                 font_name=FONT_BODY, alignment=PP_ALIGN.LEFT)

    add_footer(slide, client_name, doc_label)
    return slide


def build_closing_slide(prs, client_name, doc_label, message="Thank you"):
    """Final slide — dark bg, centered message."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, DARK_BG)

    # Gold line
    line_w = Inches(3)
    add_shape_rect(slide, (SLIDE_W - line_w) / 2, Inches(2.0), line_w, Pt(3), GOLD)

    # Message
    tf = add_textbox(slide, M_LEFT, Inches(2.3), CONTENT_W, Inches(1.0))
    add_text(tf, message, size=Pt(32), color=WHITE, bold=True,
             font_name=FONT_TITLE, alignment=PP_ALIGN.CENTER)

    # Subtext
    tf2 = add_textbox(slide, M_LEFT, Inches(3.3), CONTENT_W, Inches(0.5))
    add_text(tf2, f"Prepared for {client_name}", size=Pt(14), color=CREAM,
             font_name=FONT_BODY, alignment=PP_ALIGN.CENTER, italic=True)

    # Date
    tf3 = add_textbox(slide, M_LEFT, Inches(3.8), CONTENT_W, Inches(0.3))
    add_text(tf3, datetime.now().strftime("%B %Y"), size=Pt(10), color=MED_GRAY,
             font_name=FONT_BODY, alignment=PP_ALIGN.CENTER)

    # Gold line bottom
    add_shape_rect(slide, (SLIDE_W - line_w) / 2, Inches(4.3), line_w, Pt(3), GOLD)

    add_footer(slide, client_name, doc_label)
    return slide


# ============================================================
# DOCUMENT ASSEMBLER
# ============================================================
def assemble_presentation(content, doc_type):
    """
    Assemble a full presentation from structured content JSON.

    Expected content format:
    {
        "client_name": "Full Name",
        "visa_type": "EB-1A Extraordinary Ability",
        "doc_label": "Professional Methodology Dossier",
        "title": "Methodology — Comprehensive Analysis",
        "subtitle": "Detailed documentation of ...",
        "sections": [
            {
                "title": "Section Title",
                "subtitle": "Optional subtitle for divider",
                "slides": [
                    {
                        "type": "content|metrics|table|two_column|quote",
                        "title": "Slide Title",
                        "paragraphs": ["..."],
                        "bullets": ["..."],
                        "highlight_box": {"title": "...", "text": "..."},
                        "metrics": [{"value": "500+", "label": "..."}],
                        "headers": ["..."], "rows": [["..."]],
                        "left": {"heading": "...", "paragraphs": ["..."]},
                        "right": {"heading": "...", "paragraphs": ["..."]},
                        "quote": "...", "attribution": "..."
                    }
                ]
            }
        ],
        "closing_message": "Optional closing text"
    }
    """
    prs = Presentation()
    prs.slide_width = SLIDE_W
    prs.slide_height = SLIDE_H

    client_name = content.get("client_name", "Client")
    visa_type = content.get("visa_type", "")
    doc_label = content.get("doc_label", "Professional Dossier")
    title = content.get("title", "Document")
    subtitle = content.get("subtitle", "")
    sections = content.get("sections", [])

    # 1. Cover slide
    build_cover_slide(prs, client_name, title, subtitle, doc_label, visa_type)

    # 2. TOC slide
    if sections:
        build_toc_slide(prs, sections, client_name, doc_label)

    # 3. Section slides
    for section in sections:
        # Section divider
        build_section_divider(prs, section.get("title", ""),
                             section.get("subtitle", ""), client_name, doc_label)

        # Section content slides
        for slide_data in section.get("slides", []):
            slide_type = slide_data.get("type", "content")

            if slide_type == "content":
                build_content_slide(
                    prs,
                    slide_data.get("title", ""),
                    slide_data.get("paragraphs", []),
                    client_name, doc_label,
                    bullets=slide_data.get("bullets"),
                    highlight_box=slide_data.get("highlight_box")
                )

            elif slide_type == "metrics":
                build_key_metrics_slide(
                    prs,
                    slide_data.get("title", "Key Metrics"),
                    slide_data.get("metrics", []),
                    client_name, doc_label
                )

            elif slide_type == "table":
                build_table_slide(
                    prs,
                    slide_data.get("title", ""),
                    slide_data.get("headers", []),
                    slide_data.get("rows", []),
                    client_name, doc_label
                )

            elif slide_type == "two_column":
                build_two_column_slide(
                    prs,
                    slide_data.get("title", ""),
                    slide_data.get("left", {}),
                    slide_data.get("right", {}),
                    client_name, doc_label
                )

            elif slide_type == "quote":
                build_quote_slide(
                    prs,
                    slide_data.get("quote", ""),
                    slide_data.get("attribution", ""),
                    client_name, doc_label
                )

    # 4. Closing slide
    closing_msg = content.get("closing_message", "Thank you")
    build_closing_slide(prs, client_name, doc_label, closing_msg)

    return prs


# ============================================================
# CLI
# ============================================================
def main():
    parser = argparse.ArgumentParser(description="Petition Engine PPTX Generator")
    parser.add_argument("--content", required=True, help="Path to content JSON")
    parser.add_argument("--output", required=True, help="Output PPTX path")
    parser.add_argument("--type", default="methodology",
                        choices=["methodology", "declaration"],
                        help="Document type")
    args = parser.parse_args()

    if not os.path.exists(args.content):
        print(f"ERROR: Content file not found: {args.content}")
        sys.exit(1)

    with open(args.content, 'r', encoding='utf-8') as f:
        content = json.load(f)

    print(f"Generating {args.type} PPTX...")
    prs = assemble_presentation(content, args.type)

    os.makedirs(os.path.dirname(args.output) or '.', exist_ok=True)
    prs.save(args.output)

    slide_count = len(prs.slides)
    file_size = os.path.getsize(args.output)
    print(f"DONE: {args.output}")
    print(f"  Slides: {slide_count}")
    print(f"  Size: {file_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
