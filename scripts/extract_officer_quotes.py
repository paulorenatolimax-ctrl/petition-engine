#!/usr/bin/env python3
"""Extrai trechos literais do oficial de imigração do PDF do RFE.

Uso:
    python3 extract_officer_quotes.py <rfe.pdf> <out_officer_quotes.json>

Output: JSON com [{id, page, prong_hint, verbatim, preceding_context}, ...]
Cada objeto é um trecho onde o oficial coloca objeção/pedido, pronto pra
ser inserido como quote-box inline na resposta RFE (Fase 3 do pipeline).

Regex cobrem os padrões típicos do USCIS:
- "In regard to" / "With respect to" / "Regarding"
- "The evidence does not establish"
- "Please submit" / "You must provide"
- "The record is insufficient to show"
- "It is unclear how" / "It is not evident"
"""
import json
import os
import re
import sys

try:
    import pdfplumber
except ImportError:
    sys.stderr.write("ERR: pdfplumber not installed. Run: pip install pdfplumber\n")
    sys.exit(2)

OFFICER_PATTERNS = [
    r"(?:In regard to|With respect to|Regarding|In reference to)\s+[Pp]rong\s+[1-3]",
    r"The evidence (?:does not|fails to|is insufficient to)\s+\w+",
    r"(?:Please submit|You must provide|Please provide|You are requested to)\s+",
    r"The record is insufficient to",
    r"It is (?:unclear|not evident|not established) (?:how|that|whether|why)",
    r"(?:We |USCIS )?(?:find[s]?|note[s]?|observe[s]?)\s+that\s+the\s+(?:evidence|record|petition)",
    r"(?:Substantial|National)\s+(?:merit|importance)\s+(?:has not been|is not)",
    r"(?:Well[- ]positioned|On balance|Beneficial)\s+(?:test|prong|analysis)",
]

PRONG_HINTS = {
    "1": re.compile(r"(?:Prong\s+1|substantial merit|national importance|importance\s+and\s+merit)", re.I),
    "2": re.compile(r"(?:Prong\s+2|well[- ]positioned|position\s+to\s+advance)", re.I),
    "3": re.compile(r"(?:Prong\s+3|on\s+balance|beneficial\s+to\s+waive|labor\s+certification)", re.I),
}


def classify_prong(text):
    for prong, pat in PRONG_HINTS.items():
        if pat.search(text):
            return prong
    return "unknown"


def extract_paragraphs(pdf_path):
    """Yield (page_num, paragraph_text) tuples."""
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            txt = page.extract_text() or ""
            for para in re.split(r"\n\s*\n", txt):
                para = para.strip()
                if len(para) < 40:
                    continue
                para = re.sub(r"\s+", " ", para)
                yield i, para


def find_officer_quotes(pdf_path):
    found = []
    seen = set()
    for page_num, para in extract_paragraphs(pdf_path):
        for pattern in OFFICER_PATTERNS:
            if re.search(pattern, para, re.IGNORECASE):
                key = para[:100]
                if key in seen:
                    continue
                seen.add(key)
                found.append({
                    "id": f"q{len(found) + 1:03d}",
                    "page": page_num,
                    "prong_hint": classify_prong(para),
                    "matched_pattern": pattern,
                    "verbatim": para[:1500],
                    "length_chars": len(para)
                })
                break
    return found


def main():
    if len(sys.argv) < 3:
        sys.stderr.write("Usage: extract_officer_quotes.py <rfe.pdf> <out.json>\n")
        sys.exit(2)
    pdf_path = sys.argv[1]
    out_path = sys.argv[2]

    if not os.path.isfile(pdf_path):
        sys.stderr.write(f"ERR: PDF not found: {pdf_path}\n")
        sys.exit(2)

    quotes = find_officer_quotes(pdf_path)
    by_prong = {"1": 0, "2": 0, "3": 0, "unknown": 0}
    for q in quotes:
        by_prong[q["prong_hint"]] = by_prong.get(q["prong_hint"], 0) + 1

    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"source_pdf": pdf_path, "total_quotes": len(quotes),
                   "by_prong": by_prong, "quotes": quotes}, f, indent=2, ensure_ascii=False)

    print(f"Extracted {len(quotes)} officer quotes from {pdf_path}")
    print(f"  By Prong: P1={by_prong['1']}  P2={by_prong['2']}  P3={by_prong['3']}  unknown={by_prong['unknown']}")
    print(f"  Output:   {out_path}")

    if len(quotes) == 0:
        sys.stderr.write("WARN: zero officer quotes extracted — verify PDF is text-based (not scanned image)\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
