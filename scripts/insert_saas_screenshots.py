#!/usr/bin/env python3
"""
Insert SaaS Screenshots into DOCX — Petition Engine

Reads a .docx file, finds [SCREENSHOT_XX — Name] placeholders,
and replaces them with the actual screenshot images.

Usage:
    python3 insert_saas_screenshots.py <docx_path> <screenshots_dir> [--map screenshot_map.json]

The script looks for placeholders in the format:
    [SCREENSHOT_01 — Landing Page]
    [SCREENSHOT_02 — Dashboard]
    etc.

And replaces each with the corresponding SaaS_01_*.png, SaaS_02_*.png, etc.
"""

import os
import sys
import re
import json
from docx import Document
from docx.shared import Inches

def find_screenshots(screenshots_dir):
    """Map screenshot numbers to file paths."""
    mapping = {}
    if not os.path.exists(screenshots_dir):
        return mapping

    for f in sorted(os.listdir(screenshots_dir)):
        if f.startswith('SaaS_') and f.endswith('.png'):
            # Extract number: SaaS_01_Landing_Page.png → 01
            match = re.match(r'SaaS_(\d+)_', f)
            if match:
                num = match.group(1)
                mapping[num] = os.path.join(screenshots_dir, f)

    return mapping


def insert_screenshots(docx_path, screenshots_dir, map_file=None):
    """Insert screenshots into DOCX at placeholder positions."""

    if not os.path.exists(docx_path):
        print(f'ERROR: DOCX not found: {docx_path}')
        return False

    # Build screenshot mapping
    screenshots = find_screenshots(screenshots_dir)
    if not screenshots:
        print(f'ERROR: No SaaS_XX_*.png files found in {screenshots_dir}')
        return False

    # Load optional map for descriptions
    descriptions = {}
    if map_file and os.path.exists(map_file):
        with open(map_file) as f:
            map_data = json.load(f)
            for page in map_data.get('pages', []):
                num = str(page['number']).zfill(2)
                descriptions[num] = page.get('description', '')

    doc = Document(docx_path)
    inserted = 0
    not_found = []

    # Search through all paragraphs
    for i, para in enumerate(doc.paragraphs):
        text = para.text.strip()

        # Match [SCREENSHOT_XX — Name] or [SCREENSHOT_XX - Name]
        match = re.match(r'\[SCREENSHOT_(\d+)\s*[—\-]\s*(.+?)\]', text)
        if not match:
            continue

        num = match.group(1)
        name = match.group(2).strip()

        if num not in screenshots:
            not_found.append(f'SCREENSHOT_{num} ({name})')
            continue

        img_path = screenshots[num]

        # Clear the placeholder text
        para.clear()

        # Add the image
        run = para.add_run()
        try:
            run.add_picture(img_path, width=Inches(6.0))
            inserted += 1
            print(f'  ✓ Inserted SCREENSHOT_{num} — {name} ({os.path.basename(img_path)})')

            # Add caption below if description available
            desc = descriptions.get(num, '')
            if desc:
                caption_para = doc.paragraphs[i]  # Reference to modify
                # Add a new paragraph after for the caption
                from docx.oxml.ns import qn
                new_p = doc.element.body._new_p()
                caption_para._element.addnext(new_p)
                from docx.text.paragraph import Paragraph
                caption = Paragraph(new_p, doc)
                caption_run = caption.add_run(f'Figura {num}: {name}')
                caption_run.bold = True
                caption_run.font.size = Inches(0.11)  # ~8pt

        except Exception as e:
            print(f'  ✗ Failed to insert SCREENSHOT_{num}: {e}')
            # Restore placeholder text
            para.add_run(text)

    # Also check tables (placeholders might be inside table cells)
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for para in cell.paragraphs:
                    text = para.text.strip()
                    match = re.match(r'\[SCREENSHOT_(\d+)\s*[—\-]\s*(.+?)\]', text)
                    if not match:
                        continue

                    num = match.group(1)
                    name = match.group(2).strip()

                    if num not in screenshots:
                        not_found.append(f'SCREENSHOT_{num} ({name})')
                        continue

                    img_path = screenshots[num]
                    para.clear()
                    run = para.add_run()
                    try:
                        run.add_picture(img_path, width=Inches(5.5))
                        inserted += 1
                        print(f'  ✓ Inserted SCREENSHOT_{num} — {name} (in table)')
                    except Exception as e:
                        print(f'  ✗ Failed: {e}')
                        para.add_run(text)

    # Save
    output_path = docx_path.replace('.docx', '_WITH_SCREENSHOTS.docx')
    doc.save(output_path)

    print(f'\n{"="*50}')
    print(f'  INSERÇÃO COMPLETA')
    print(f'{"="*50}')
    print(f'  Inseridos: {inserted}/{len(screenshots)}')
    print(f'  Não encontrados: {len(not_found)}')
    if not_found:
        for nf in not_found:
            print(f'    ⚠ {nf}')
    print(f'  Output: {output_path}')
    print(f'{"="*50}\n')

    return True


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: python3 insert_saas_screenshots.py <docx_path> <screenshots_dir> [--map screenshot_map.json]')
        sys.exit(1)

    docx_path = sys.argv[1]
    screenshots_dir = sys.argv[2]
    map_file = None

    if '--map' in sys.argv:
        idx = sys.argv.index('--map')
        if idx + 1 < len(sys.argv):
            map_file = sys.argv[idx + 1]

    insert_screenshots(docx_path, screenshots_dir, map_file)
