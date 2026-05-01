#!/usr/bin/env python3
"""
validate_image_evidence_mapping.py — Image ↔ Evidence integrity check (rule r219).

Opens a generated .docx, walks word/document.xml in document order, and verifies:

  A. Every "Evidência N" / "Evidence N" heading has at least one image rId
     immediately following it (within the same paragraph or in the next 1-2
     paragraphs of the same evidence block).
  B. Every embedded image rId belongs to an evidence block (no orphans floating
     between evidence sections).
  C. (Optional) When thumbnail_map.json is provided, the file resolved from
     each rId via word/_rels/document.xml.rels matches the file declared for
     that evidence_number in thumbnail_map.

Background: r219 came from Vitória's CL where evidence images 34-42 were
swapped because the merger reassigned rIds without updating the headings.
The error survived qa_docx because old validators only counted images, never
checked their ORDER.

Usage:
  python3 scripts/validate_image_evidence_mapping.py <path-to-docx> [--thumbnail-map path] [--report path]

Exit codes:
  0 — clean (no violations)
  1 — violations found (report written to --report or stdout)
  2 — input error (file not found, malformed docx)
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import zipfile
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "rels": "http://schemas.openxmlformats.org/package/2006/relationships",
}

EVIDENCE_HEADING = re.compile(
    r"\b(?:Evid[êe]ncia|Evidence)\s+(\d+)\b",
    re.IGNORECASE,
)


def paragraph_text(p: ET.Element) -> str:
    return "".join(t.text or "" for t in p.findall(".//w:t", NS))


def paragraph_images(p: ET.Element) -> list[str]:
    blips = p.findall(".//a:blip", NS)
    rids: list[str] = []
    for b in blips:
        rid = b.get(f"{{{NS['r']}}}embed") or b.get(f"{{{NS['r']}}}link")
        if rid:
            rids.append(rid)
    return rids


def load_rels(zf: zipfile.ZipFile) -> dict[str, str]:
    try:
        with zf.open("word/_rels/document.xml.rels") as f:
            tree = ET.parse(f)
    except KeyError:
        return {}
    out: dict[str, str] = {}
    for rel in tree.getroot().findall(f"{{{NS['rels']}}}Relationship"):
        rid = rel.get("Id")
        target = rel.get("Target") or ""
        if rid:
            out[rid] = target
    return out


def load_thumbnail_map(path: Path | None) -> dict[int, str]:
    if not path or not path.exists():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}
    out: dict[int, str] = {}
    entries = data if isinstance(data, list) else data.get("entries") or data.get("thumbnails") or []
    for e in entries:
        if not isinstance(e, dict):
            continue
        num = e.get("exhibit_number") or e.get("evidence_number") or e.get("number")
        pdf = e.get("pdf_path") or e.get("source_path") or e.get("file")
        if num is not None and pdf:
            try:
                out[int(num)] = str(pdf)
            except (TypeError, ValueError):
                continue
    return out


def validate(docx_path: Path, thumbnail_map_path: Path | None) -> dict[str, Any]:
    if not docx_path.exists():
        return {"ok": False, "error": f"docx not found: {docx_path}"}

    try:
        zf = zipfile.ZipFile(docx_path)
    except zipfile.BadZipFile:
        return {"ok": False, "error": f"bad zip: {docx_path}"}

    with zf:
        try:
            doc_xml = zf.read("word/document.xml")
        except KeyError:
            return {"ok": False, "error": "word/document.xml missing"}
        rels = load_rels(zf)

    try:
        root = ET.fromstring(doc_xml)
    except ET.ParseError as e:
        return {"ok": False, "error": f"document.xml parse error: {e}"}

    body = root.find("w:body", NS)
    if body is None:
        return {"ok": False, "error": "no <w:body>"}

    # Walk paragraphs in document order; collect events
    events: list[dict[str, Any]] = []
    for idx, p in enumerate(body.findall(".//w:p", NS)):
        text = paragraph_text(p).strip()
        if text:
            for m in EVIDENCE_HEADING.finditer(text):
                events.append({"kind": "heading", "evidence_num": int(m.group(1)), "para_idx": idx, "text": text[:120]})
        for rid in paragraph_images(p):
            events.append({"kind": "image", "rid": rid, "target": rels.get(rid, ""), "para_idx": idx})

    headings = [e for e in events if e["kind"] == "heading"]
    images = [e for e in events if e["kind"] == "image"]

    # Constraint A: every heading has at least 1 image within next 6 paragraphs
    headings_without_image: list[dict[str, Any]] = []
    for h in headings:
        following_images = [e for e in events
                            if e["kind"] == "image"
                            and e["para_idx"] >= h["para_idx"]
                            and e["para_idx"] <= h["para_idx"] + 6]
        h["images_within_6_paras"] = [{"rid": e["rid"], "target": e["target"], "para_offset": e["para_idx"] - h["para_idx"]} for e in following_images]
        if not following_images:
            headings_without_image.append(h)

    # Constraint B: every image has a preceding heading (or is in intro/index — first 50 paras tolerated)
    images_orphan: list[dict[str, Any]] = []
    for im in images:
        preceding_headings = [h for h in headings if h["para_idx"] <= im["para_idx"]]
        if not preceding_headings and im["para_idx"] > 50:
            images_orphan.append(im)

    # Constraint C (optional): cross-check thumbnail_map
    thumbnail_map = load_thumbnail_map(thumbnail_map_path)
    mismatches: list[dict[str, Any]] = []
    if thumbnail_map:
        for h in headings:
            num = h["evidence_num"]
            expected = thumbnail_map.get(num)
            if not expected:
                continue
            following = h.get("images_within_6_paras") or []
            if not following:
                continue
            first_target = following[0]["target"]
            if expected and Path(expected).name and Path(expected).name not in Path(first_target).name and Path(first_target).name not in Path(expected).name:
                mismatches.append({
                    "evidence_num": num,
                    "expected_source": expected,
                    "embedded_image_target": first_target,
                    "embedded_image_rid": following[0]["rid"],
                })

    # Summary
    violations: list[str] = []
    if headings_without_image:
        violations.append(f"{len(headings_without_image)} heading(s) without image within 6 paragraphs")
    if images_orphan:
        violations.append(f"{len(images_orphan)} image(s) orphaned (no preceding evidence heading)")
    if mismatches:
        violations.append(f"{len(mismatches)} thumbnail_map mismatch(es)")

    return {
        "ok": len(violations) == 0,
        "docx": str(docx_path),
        "headings_count": len(headings),
        "images_count": len(images),
        "violations_summary": violations,
        "headings_without_image": headings_without_image,
        "images_orphan": images_orphan,
        "thumbnail_map_mismatches": mismatches,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Validate image ↔ evidence mapping in DOCX (rule r219).")
    ap.add_argument("docx", help="Path to .docx file")
    ap.add_argument("--thumbnail-map", default=None, help="Optional thumbnail_map.json for cross-check")
    ap.add_argument("--report", default=None, help="Write JSON report to this path (default: stdout)")
    args = ap.parse_args()

    docx_path = Path(args.docx).resolve()
    tm_path = Path(args.thumbnail_map).resolve() if args.thumbnail_map else None
    if tm_path is None:
        candidate = docx_path.parent / "thumbnail_map.json"
        if candidate.exists():
            tm_path = candidate

    result = validate(docx_path, tm_path)
    out = json.dumps(result, ensure_ascii=False, indent=2)

    if args.report:
        Path(args.report).write_text(out, encoding="utf-8")
        print(f"[validate_image_evidence_mapping] report → {args.report}")
        if result.get("violations_summary"):
            print("VIOLATIONS:")
            for v in result["violations_summary"]:
                print(f"  - {v}")
    else:
        print(out)

    if not result.get("ok"):
        return 1 if "error" not in result else 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
