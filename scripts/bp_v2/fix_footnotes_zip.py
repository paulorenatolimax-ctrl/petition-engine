#!/usr/bin/env python3
"""
Fix footnotes via direct ZIP/XML manipulation.
Opens the DOCX as ZIP, injects footnotes.xml, updates [Content_Types].xml
and document.xml.rels, replaces [N] with real footnote references.
"""

import zipfile, shutil, re, os, tempfile
from pathlib import Path
from lxml import etree

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
CT = 'http://schemas.openxmlformats.org/package/2006/content-types'
FONT = "Garamond"

OUTPUT_DIR = Path("/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2025/CAMILLA/_BP/_Atualizado (pós-entendimento novo)")
INPUT = OUTPUT_DIR / "BP_DentalShield_V2.docx"
OUTPUT = OUTPUT_DIR / "BP_DentalShield_V2_FINAL.docx"


def extract_endnotes_from_docx(input_path):
    """Parse the existing DOCX to find [N] and endnote definitions."""
    from docx import Document
    doc = Document(str(input_path))

    # Find endnotes section and extract definitions
    endnotes = {}
    collecting = False
    for para in doc.paragraphs:
        try:
            txt = para.text or ""
        except:
            continue
        if "NOTAS E REFERÊNCIAS" in txt:
            collecting = True
            continue
        if collecting and txt.strip():
            m = re.match(r'\[(\d+)\]\s*(.*)', txt.strip())
            if m:
                endnotes[int(m.group(1))] = m.group(2)

    print(f"  Found {len(endnotes)} endnote definitions")
    return endnotes


def build_footnotes_xml(endnotes):
    """Build proper footnotes.xml with separators and all footnote definitions."""
    NSMAP = {'w': W, 'r': R}
    root = etree.Element(f'{{{W}}}footnotes', nsmap=NSMAP)

    # Separator (id=0) — MUST be type="separator"
    fn0 = etree.SubElement(root, f'{{{W}}}footnote')
    fn0.set(f'{{{W}}}type', 'separator')
    fn0.set(f'{{{W}}}id', '0')
    p0 = etree.SubElement(fn0, f'{{{W}}}p')
    pPr0 = etree.SubElement(p0, f'{{{W}}}pPr')
    sp0 = etree.SubElement(pPr0, f'{{{W}}}spacing')
    sp0.set(f'{{{W}}}after', '0')
    sp0.set(f'{{{W}}}line', '240')
    sp0.set(f'{{{W}}}lineRule', 'auto')
    r0 = etree.SubElement(p0, f'{{{W}}}r')
    etree.SubElement(r0, f'{{{W}}}separator')

    # Continuation separator (id=-1)
    fn1 = etree.SubElement(root, f'{{{W}}}footnote')
    fn1.set(f'{{{W}}}type', 'continuationSeparator')
    fn1.set(f'{{{W}}}id', '-1')
    p1 = etree.SubElement(fn1, f'{{{W}}}p')
    pPr1 = etree.SubElement(p1, f'{{{W}}}pPr')
    sp1 = etree.SubElement(pPr1, f'{{{W}}}spacing')
    sp1.set(f'{{{W}}}after', '0')
    sp1.set(f'{{{W}}}line', '240')
    sp1.set(f'{{{W}}}lineRule', 'auto')
    r1 = etree.SubElement(p1, f'{{{W}}}r')
    etree.SubElement(r1, f'{{{W}}}continuationSeparator')

    # Actual footnotes
    for fn_id in sorted(endnotes.keys()):
        fn_elem = etree.SubElement(root, f'{{{W}}}footnote')
        fn_elem.set(f'{{{W}}}id', str(fn_id))

        p_elem = etree.SubElement(fn_elem, f'{{{W}}}p')
        # Style
        pPr = etree.SubElement(p_elem, f'{{{W}}}pPr')
        pStyle = etree.SubElement(pPr, f'{{{W}}}pStyle')
        pStyle.set(f'{{{W}}}val', 'FootnoteText')

        # Footnote ref number
        r_ref = etree.SubElement(p_elem, f'{{{W}}}r')
        rPr_ref = etree.SubElement(r_ref, f'{{{W}}}rPr')
        rStyle_ref = etree.SubElement(rPr_ref, f'{{{W}}}rStyle')
        rStyle_ref.set(f'{{{W}}}val', 'FootnoteReference')
        etree.SubElement(r_ref, f'{{{W}}}footnoteRef')

        # Space + text
        r_text = etree.SubElement(p_elem, f'{{{W}}}r')
        rPr_text = etree.SubElement(r_text, f'{{{W}}}rPr')
        sz = etree.SubElement(rPr_text, f'{{{W}}}sz')
        sz.set(f'{{{W}}}val', '16')  # 8pt
        szCs = etree.SubElement(rPr_text, f'{{{W}}}szCs')
        szCs.set(f'{{{W}}}val', '16')
        rFonts = etree.SubElement(rPr_text, f'{{{W}}}rFonts')
        rFonts.set(f'{{{W}}}ascii', FONT)
        rFonts.set(f'{{{W}}}hAnsi', FONT)
        t = etree.SubElement(r_text, f'{{{W}}}t')
        t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
        t.text = f' {endnotes[fn_id]}'

    return etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)


def process_document_xml(doc_xml_bytes, endnotes):
    """Replace [N] markers with real footnote references in document.xml."""
    root = etree.fromstring(doc_xml_bytes)
    ns = {'w': W}
    replacements = 0

    # Find all text runs
    for t_elem in root.iter(f'{{{W}}}t'):
        if t_elem.text is None:
            continue
        text = t_elem.text
        matches = list(re.finditer(r'\[(\d+)\]', text))
        if not matches:
            continue

        # Get parent run and paragraph
        r_elem = t_elem.getparent()
        p_elem = r_elem.getparent()
        if p_elem is None:
            continue

        # Get run properties
        rPr = r_elem.find(f'{{{W}}}rPr')

        # Build replacement elements
        new_elements = []
        last_end = 0

        for match in matches:
            fn_num = int(match.group(1))
            start, end = match.start(), match.end()

            # Text before
            if start > last_end:
                before = text[last_end:start]
                if before:
                    new_r = etree.Element(f'{{{W}}}r')
                    if rPr is not None:
                        new_r.append(etree.fromstring(etree.tostring(rPr)))
                    new_t = etree.SubElement(new_r, f'{{{W}}}t')
                    new_t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
                    new_t.text = before
                    new_elements.append(new_r)

            # Footnote reference
            if fn_num in endnotes:
                fn_r = etree.Element(f'{{{W}}}r')
                fn_rPr = etree.SubElement(fn_r, f'{{{W}}}rPr')
                fn_rStyle = etree.SubElement(fn_rPr, f'{{{W}}}rStyle')
                fn_rStyle.set(f'{{{W}}}val', 'FootnoteReference')
                fn_ref = etree.SubElement(fn_r, f'{{{W}}}footnoteReference')
                fn_ref.set(f'{{{W}}}id', str(fn_num))
                new_elements.append(fn_r)
                replacements += 1
            else:
                # Keep as text
                new_r = etree.Element(f'{{{W}}}r')
                if rPr is not None:
                    new_r.append(etree.fromstring(etree.tostring(rPr)))
                new_t = etree.SubElement(new_r, f'{{{W}}}t')
                new_t.text = f'[{fn_num}]'
                new_elements.append(new_r)

            last_end = end

        # Text after
        if last_end < len(text):
            after = text[last_end:]
            if after:
                new_r = etree.Element(f'{{{W}}}r')
                if rPr is not None:
                    new_r.append(etree.fromstring(etree.tostring(rPr)))
                new_t = etree.SubElement(new_r, f'{{{W}}}t')
                new_t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
                new_t.text = after
                new_elements.append(new_r)

        # Replace original run
        parent = r_elem.getparent()
        idx = list(parent).index(r_elem)
        parent.remove(r_elem)
        for i, new_elem in enumerate(new_elements):
            parent.insert(idx + i, new_elem)

    # Remove endnotes section from body
    body = root.find(f'{{{W}}}body')
    found_endnotes = False
    to_remove = []
    for elem in body:
        if elem.tag == f'{{{W}}}p':
            text_content = ''.join(t.text or '' for t in elem.iter(f'{{{W}}}t'))
            if 'NOTAS E REFERÊNCIAS' in text_content:
                found_endnotes = True
            if found_endnotes:
                to_remove.append(elem)
        elif found_endnotes and elem.tag != f'{{{W}}}sectPr':
            to_remove.append(elem)

    for elem in to_remove:
        body.remove(elem)

    print(f"  Replaced {replacements} [N] markers with footnote references")
    print(f"  Removed {len(to_remove)} paragraphs from endnotes section")

    return etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)


def update_content_types(ct_bytes):
    """Add footnotes content type to [Content_Types].xml."""
    root = etree.fromstring(ct_bytes)
    ns = {'ct': CT}

    # Check if footnotes override already exists
    for override in root.findall(f'{{{CT}}}Override'):
        if override.get('PartName') == '/word/footnotes.xml':
            return ct_bytes  # Already exists

    # Add override
    override = etree.SubElement(root, f'{{{CT}}}Override')
    override.set('PartName', '/word/footnotes.xml')
    override.set('ContentType', 'application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml')

    return etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)


def update_rels(rels_bytes):
    """Add footnotes relationship to word/_rels/document.xml.rels."""
    root = etree.fromstring(rels_bytes)
    ns_rels = 'http://schemas.openxmlformats.org/package/2006/relationships'

    # Check if footnotes rel already exists
    for rel in root:
        if 'footnotes' in (rel.get('Target') or ''):
            return rels_bytes

    # Find max rId
    max_id = 0
    for rel in root:
        rid = rel.get('Id', '')
        m = re.match(r'rId(\d+)', rid)
        if m:
            max_id = max(max_id, int(m.group(1)))

    # Add relationship
    rel = etree.SubElement(root, f'{{{ns_rels}}}Relationship')
    rel.set('Id', f'rId{max_id + 1}')
    rel.set('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes')
    rel.set('Target', 'footnotes.xml')

    return etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)


def main():
    print("Fix Footnotes — ZIP/XML Direct Manipulation")
    print("=" * 50)

    if not INPUT.exists():
        print(f"ERROR: {INPUT} not found")
        return

    # Step 1: Extract endnotes
    endnotes = extract_endnotes_from_docx(INPUT)
    if not endnotes:
        print("ERROR: No endnotes found")
        return

    # Step 2: Build footnotes.xml
    footnotes_bytes = build_footnotes_xml(endnotes)
    print(f"  Built footnotes.xml with {len(endnotes)} footnotes")

    # Step 3: Process the DOCX as ZIP
    temp_path = OUTPUT_DIR / "_temp_bp.docx"
    shutil.copy2(INPUT, temp_path)

    with zipfile.ZipFile(str(temp_path), 'r') as zin:
        with zipfile.ZipFile(str(OUTPUT), 'w', zipfile.ZIP_DEFLATED) as zout:
            for item in zin.namelist():
                data = zin.read(item)

                if item == 'word/document.xml':
                    data = process_document_xml(data, endnotes)
                elif item == '[Content_Types].xml':
                    data = update_content_types(data)
                elif item == 'word/_rels/document.xml.rels':
                    data = update_rels(data)

                zout.writestr(item, data)

            # Add footnotes.xml if not already there
            if 'word/footnotes.xml' not in zin.namelist():
                zout.writestr('word/footnotes.xml', footnotes_bytes)
                print("  Added word/footnotes.xml to DOCX")
            else:
                print("  Replaced existing word/footnotes.xml")

    os.remove(temp_path)
    print(f"\n  SAVED: {OUTPUT}")
    print(f"  Size: {OUTPUT.stat().st_size / 1024:.0f} KB")
    print("\n  Abra no Word — as footnotes devem aparecer no RODAPÉ de cada página.")


if __name__ == "__main__":
    main()
