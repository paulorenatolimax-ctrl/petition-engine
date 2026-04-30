#!/usr/bin/env python3
"""
validate_us_entry_date.py — Bloqueia documentos que citam trabalho remunerado
nos EUA com datas anteriores à autorização legal de trabalho do peticionário.

Lê data/master_facts/{case_id}.json (campo us_timeline) e o documento gerado
(Markdown ou DOCX). Reporta qualquer data em contexto US-emprego que viole
us_entry_date ou us_first_work_authorization_date.

Uso:
    python3 scripts/validate_us_entry_date.py \\
        --case-id marcio_elias_barbosa \\
        --file '/path/to/V3_Projeto_Base.md'

Exit code:
    0 = OK
    1 = violação detectada (block)
    2 = configuração ausente (master_facts/{case_id}.json sem us_timeline)
"""
import argparse
import json
import os
import re
import sys
from datetime import date


REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MASTER_FACTS_DIR = os.path.join(REPO_ROOT, "data", "master_facts")


US_CONTEXT = re.compile(
    r"\b(EUA|Estados\s+Unidos|United\s+States|U\.S\.A?\.?|US\b|USA\b|Florida|Fl[oó]rida|"
    r"Orlando|Miami|Tampa|Jacksonville|Atlanta|California|Texas|New\s+York|Nova\s+York|"
    r"Chicago|Boston|Seattle|San\s+Francisco|Houston|Los\s+Angeles|americano|americana|"
    r"americanos|americanas|norte-americano|norte-americana|stateside)\b",
    re.IGNORECASE,
)

WORK_CONTEXT = re.compile(
    r"\b(trabalh|contrat|implement|atend|prest|client|contract|hire|employ|engaj|"
    r"project|projeto|consult|consultor)",
    re.IGNORECASE,
)

MONTHS = {
    "janeiro": "01", "january": "01", "jan": "01",
    "fevereiro": "02", "february": "02", "feb": "02", "fev": "02",
    "março": "03", "marco": "03", "march": "03", "mar": "03",
    "abril": "04", "april": "04", "apr": "04", "abr": "04",
    "maio": "05", "may": "05",
    "junho": "06", "june": "06", "jun": "06",
    "julho": "07", "july": "07", "jul": "07",
    "agosto": "08", "august": "08", "aug": "08", "ago": "08",
    "setembro": "09", "september": "09", "sep": "09", "set": "09",
    "outubro": "10", "october": "10", "oct": "10", "out": "10",
    "novembro": "11", "november": "11", "nov": "11",
    "dezembro": "12", "december": "12", "dec": "12", "dez": "12",
}

DATE_PATTERNS = [
    # YYYY-MM-DD
    (re.compile(r"\b(20[12][0-9])[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12][0-9]|3[01])\b"),
     lambda m: f"{m.group(1)}-{m.group(2)}-{m.group(3)}"),
    # DD/MM/YYYY
    (re.compile(r"\b(0[1-9]|[12][0-9]|3[01])[/-](0[1-9]|1[0-2])[/-](20[12][0-9])\b"),
     lambda m: f"{m.group(3)}-{m.group(2)}-{m.group(1)}"),
    # Month YYYY (PT-BR/EN)
    (re.compile(
        r"\b(janeiro|fevereiro|mar[çc]o|abril|maio|junho|julho|agosto|setembro|outubro|"
        r"novembro|dezembro|january|february|march|april|may|june|july|august|september|"
        r"october|november|december|jan|feb|fev|mar|apr|abr|may|jun|jul|aug|ago|sep|set|"
        r"oct|out|nov|dec|dez)[\s/]*(?:de\s+)?(20[12][0-9])\b",
        re.IGNORECASE,
     ),
     lambda m: f"{m.group(2)}-{MONTHS.get(m.group(1).lower(), '12')}-15"),
    # Bare YYYY (last resort, requires US+work context in window)
    (re.compile(r"\b(20[12][0-9])\b"),
     lambda m: f"{m.group(1)}-12-31"),
]


VALID_ENTRY_STATUSES = {
    "in_us_with_work_authorization",
    "in_us_pending_work_authorization",
    "consular_processing_outside_us",
}


def load_us_timeline(case_id: str):
    path = os.path.join(MASTER_FACTS_DIR, f"{case_id}.json")
    if not os.path.exists(path):
        return None, f"master_facts/{case_id}.json não existe"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    tl = data.get("us_timeline")
    if not tl:
        return None, f"us_timeline ausente em master_facts/{case_id}.json"
    status = tl.get("entry_status") or "in_us_with_work_authorization"
    if status not in VALID_ENTRY_STATUSES:
        return None, f"entry_status inválido: {status}. Valores válidos: {sorted(VALID_ENTRY_STATUSES)}"
    if status == "in_us_with_work_authorization":
        if not tl.get("us_entry_date") or not tl.get("us_first_work_authorization_date"):
            return None, "us_entry_date ou us_first_work_authorization_date ausentes (status in_us_with_work_authorization exige ambas)"
    elif status == "in_us_pending_work_authorization":
        if not tl.get("us_entry_date"):
            return None, "us_entry_date ausente (status in_us_pending_work_authorization exige us_entry_date)"
    # consular_processing_outside_us: nenhuma data exigida
    tl["entry_status"] = status
    return tl, None


def normalize_iso(s: str) -> str:
    """Aceita YYYY, YYYY-MM, YYYY-MM-DD; preenche com 01-01."""
    parts = s.split("-")
    if len(parts) == 1:
        return f"{parts[0]}-01-01"
    if len(parts) == 2:
        return f"{parts[0]}-{parts[1]}-01"
    return s


def read_text(file_path: str) -> str:
    if file_path.lower().endswith(".docx"):
        try:
            import docx  # type: ignore
        except ImportError:
            sys.exit("python-docx não instalado. pip install python-docx")
        d = docx.Document(file_path)
        return "\n".join(p.text for p in d.paragraphs)
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


URL_NEAR = re.compile(
    r"https?://|www\.|\.pdf|\.html|\.aspx|\]\(|uploads?/|/20[12][0-9]/|wp-content|"
    r"consultado\s+em|consulted\s+on|acesso\s+em|accessed\s+on|"
    r"dispon[ií]vel\s+em|available\s+at|published\s+(?:in|on)|publicado\s+em|"
    r"\[\^\d+\]\s*:",  # footnote definitions [^N]:
    re.IGNORECASE,
)

# Citation/institutional antecedents — when a date is in a window dominated by
# these tokens, it's a SOURCE reference, not a petitioner work claim.
CITATION_ANTECEDENTS = re.compile(
    r"(?:\b(?:USCIS|BLS|DOL|OFLC|Bureau|Policy\s+Manual|"
    r"Vol\.|Volume\s+\d|Cap[ií]tulo|Chapter\s+\d|Pt\.|Part\s+\d|"
    r"Construindo|An[áa]lise\s+Abrangente|Relat[óo]rio|Outlook|Performance\s+Data|"
    r"Vers[ãa]o|Version|Edition|Edi[çc][ãa]o|Boletim|Bulletin|Memo|"
    r"Florida\s+Chamber|Florida\s+2030|"
    r"Statistics|Estat[íi]stica|Census|IBISWorld|Statista|IFA|"
    r"Dhanasar|Matter\s+of|"
    r"OMB|OSTP|Whitehouse|White\s+House|Federal\s+Register|"
    r"atualizada?\s+em|updated\s+(?:in|on)|revis[ãa]o\s+em)\b)"
    r"|(?:^\s*(?:Data|Date)\s*:)"
    r"|(?:^\s*#{1,3}\s)"
    r"|(?:em\s+\d{1,2}\s+de\s+\w+\s+de\s+20\d{2}\s*[);,])",
    re.IGNORECASE | re.MULTILINE,
)


# Bibliographic line pattern — full-line citation/footnote.

# Bibliographic line pattern — full-line citation/footnote.
FOOTNOTE_LINE = re.compile(r"^\s*\[\^\d+\]\s*:")


def is_in_url_context(text: str, position: int, span_len: int) -> bool:
    """True if the match is within or immediately adjacent to a URL/citation context.

    Also true if the entire LINE is a footnote/bibliographic entry, OR a header,
    OR a window dominated by institutional antecedents (USCIS, BLS, Vol., etc),
    since those are SOURCE references — not petitioner work claims.
    """
    near = text[max(0, position - 120): position + span_len + 120]
    if URL_NEAR.search(near):
        return True
    if CITATION_ANTECEDENTS.search(near):
        return True
    line_start = text.rfind("\n", 0, position) + 1
    line_end = text.find("\n", position)
    if line_end == -1:
        line_end = len(text)
    line = text[line_start:line_end]
    if FOOTNOTE_LINE.match(line):
        return True
    # Skip first ~500 chars (document header/metadata zone).
    if position < 500:
        return True
    return False


def scan(text: str, timeline: dict):
    status = timeline.get("entry_status") or "in_us_with_work_authorization"
    entry = normalize_iso(timeline["us_entry_date"]) if timeline.get("us_entry_date") else ""
    work = normalize_iso(timeline["us_first_work_authorization_date"]) if timeline.get("us_first_work_authorization_date") else ""
    violations = []
    seen = set()
    total_us_dates = 0
    for regex, to_iso in DATE_PATTERNS:
        for m in regex.finditer(text):
            if is_in_url_context(text, m.start(), len(m.group(0))):
                continue
            iso_raw = to_iso(m)
            iso = normalize_iso(iso_raw)
            start = max(0, m.start() - 200)
            end = min(len(text), m.end() + 200)
            window = text[start:end]
            if not US_CONTEXT.search(window):
                continue
            if not WORK_CONTEXT.search(window):
                continue
            total_us_dates += 1
            key = (iso, m.start())
            if key in seen:
                continue
            seen.add(key)
            violation = None
            if status == "consular_processing_outside_us":
                violation = "before_work_authorization"
            elif status == "in_us_pending_work_authorization":
                violation = "before_entry" if (entry and iso < entry) else "before_work_authorization"
            else:
                if entry and iso < entry:
                    violation = "before_entry"
                elif work and iso < work:
                    violation = "before_work_authorization"
            if not violation:
                continue
            violations.append({
                "date_iso": iso,
                "match_text": m.group(0),
                "violation_type": violation,
                "position": m.start(),
                "context": window.replace("\n", " ").strip()[:240],
            })
    violations.sort(key=lambda v: v["position"])
    return total_us_dates, violations


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--case-id", required=True, help="case_id (e.g., marcio_elias_barbosa)")
    p.add_argument("--file", required=True, help="path to .md or .docx document")
    p.add_argument("--json", action="store_true", help="output JSON instead of human-readable")
    args = p.parse_args()

    timeline, err = load_us_timeline(args.case_id)
    if not timeline:
        msg = f"CONFIG ERROR: {err}"
        if args.json:
            print(json.dumps({"ok": False, "error": err}))
        else:
            print(msg, file=sys.stderr)
        sys.exit(2)

    if not os.path.exists(args.file):
        print(f"FILE NOT FOUND: {args.file}", file=sys.stderr)
        sys.exit(2)

    text = read_text(args.file)
    total, violations = scan(text, timeline)

    if args.json:
        print(json.dumps({
            "ok": len(violations) == 0,
            "case_id": args.case_id,
            "file": args.file,
            "us_entry_date": timeline["us_entry_date"],
            "us_first_work_authorization_date": timeline["us_first_work_authorization_date"],
            "total_us_context_dates": total,
            "violations": violations,
        }, ensure_ascii=False, indent=2))
    else:
        print(f"--- validate_us_entry_date — {args.case_id} ---")
        print(f"file: {args.file}")
        print(f"us_entry_date: {timeline['us_entry_date']}")
        print(f"us_first_work_authorization_date: {timeline['us_first_work_authorization_date']}")
        print(f"total US-context dates scanned: {total}")
        print(f"violations: {len(violations)}")
        if violations:
            for v in violations:
                kind = "ANTES DA ENTRADA NOS EUA" if v["violation_type"] == "before_entry" else "ANTES DO WORK PERMIT"
                print(f"  - [{kind}] data={v['match_text']} (iso={v['date_iso']}) pos={v['position']}")
                print(f"    contexto: {v['context'][:200]}")
        else:
            print("OK — nenhuma violação detectada.")

    sys.exit(0 if len(violations) == 0 else 1)


if __name__ == "__main__":
    main()
