#!/usr/bin/env python3
"""
validate_resume_against_benchmark.py — Compara um résumé EB-1A gerado contra
benchmarks de qualidade (Carlos Avelino, Bruno Cipriano VF, Thiago FS V1) e
reporta gaps estruturais. Diagnóstico, NÃO bloqueio.

Métricas comparadas:
- word_count: ≥1.200 (piso conservador, abaixo do menor benchmark Carlos = 984
  com margem; Paulo pode ajustar)
- has_timeline_narrative: pelo menos um marcador cronológico explícito
- has_footer_pagination: "Page X of Y" ou equivalente
- absence_of_auto_infographic: TRUE se NÃO contém marcadores de infográfico
  auto-gerado (smart-art, chart object, generic diagram)
- soc_in_body: SOC code (NN-NNNN) NUNCA no corpo, só no header

Saída JSON com pass/fail por métrica + score global (0-100).

Uso:
    python3 scripts/validate_resume_against_benchmark.py --file <DOCX-OR-MD>
    python3 scripts/validate_resume_against_benchmark.py --file X --json
"""
import argparse
import json
import os
import re
import sys


def read_text(path: str) -> str:
    if path.lower().endswith(".docx"):
        try:
            import docx  # type: ignore
        except ImportError:
            sys.exit("python-docx não instalado. pip install python-docx")
        d = docx.Document(path)
        return "\n".join(p.text for p in d.paragraphs)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def count_words(text: str) -> int:
    return len(re.findall(r"\b[\w'-]+\b", text))


def has_timeline_markers(text: str) -> bool:
    """Detect chronological markers — at least 5 year-anchors that aren't URL refs."""
    years = re.findall(r"(?<!/)\b(19\d{2}|20\d{2})\b(?!\.\d)", text)
    return len(set(years)) >= 5


def has_footer_pagination(text: str) -> bool:
    return bool(re.search(r"Page\s+\d+\s+of\s+\d+|P[áa]gina\s+\d+\s+de\s+\d+", text, re.IGNORECASE))


def has_auto_infographic_markers(text: str) -> bool:
    """Markers of auto-generated infographic that benchmarks DO NOT have."""
    patterns = [
        r"\bSmart\s*Art\b",
        r"\bchart\s+object\b",
        r"\binfographic\s*(generated|auto)",
        r"Powered by [A-Z][a-z]+ Diagram",
    ]
    for p in patterns:
        if re.search(p, text, re.IGNORECASE):
            return True
    return False


def soc_appears_in_body(text: str) -> bool:
    """SOC code (NN-NNNN) in body is forbidden — only allowed in header.
    Heuristic: if SOC pattern appears AFTER first 500 chars, it's likely body."""
    matches = list(re.finditer(r"\b\d{2}-\d{4}(?:\.\d{2})?\b", text))
    return any(m.start() > 500 for m in matches)


BENCHMARKS = {
    "min_word_count": 1200,
    "require_timeline_markers": True,
    "require_footer_pagination": True,
    "forbid_auto_infographic": True,
    "forbid_soc_in_body": True,
}


def evaluate(text: str) -> dict:
    wc = count_words(text)
    timeline = has_timeline_markers(text)
    footer = has_footer_pagination(text)
    auto_info = has_auto_infographic_markers(text)
    soc_body = soc_appears_in_body(text)

    checks = {
        "word_count": {
            "value": wc,
            "min_required": BENCHMARKS["min_word_count"],
            "pass": wc >= BENCHMARKS["min_word_count"],
            "severity": "warn",
        },
        "timeline_markers": {
            "value": timeline,
            "pass": timeline,
            "severity": "warn",
        },
        "footer_pagination": {
            "value": footer,
            "pass": footer,
            "severity": "warn",
        },
        "no_auto_infographic": {
            "value": not auto_info,
            "pass": not auto_info,
            "severity": "block",
        },
        "no_soc_in_body": {
            "value": not soc_body,
            "pass": not soc_body,
            "severity": "block",
        },
    }
    passed = sum(1 for c in checks.values() if c["pass"])
    score = round(100 * passed / len(checks))
    blocking_failures = [k for k, c in checks.items() if not c["pass"] and c["severity"] == "block"]
    return {
        "score": score,
        "passed": passed,
        "total": len(checks),
        "checks": checks,
        "blocking_failures": blocking_failures,
        "ok": len(blocking_failures) == 0,
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--file", required=True)
    p.add_argument("--json", action="store_true")
    args = p.parse_args()

    if not os.path.exists(args.file):
        print(f"NOT FOUND: {args.file}", file=sys.stderr)
        sys.exit(2)

    text = read_text(args.file)
    result = evaluate(text)
    result["file"] = args.file

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"--- validate_resume_against_benchmark — {args.file} ---")
        print(f"score: {result['score']}/100  ({result['passed']}/{result['total']} checks)")
        for name, c in result["checks"].items():
            mark = "✅" if c["pass"] else ("⛔" if c["severity"] == "block" else "⚠️")
            extra = f" (value={c['value']})" if "value" in c else ""
            print(f"  {mark} {name}{extra}")
        if result["blocking_failures"]:
            print(f"\nBLOCKING FAILURES: {', '.join(result['blocking_failures'])}")

    sys.exit(0 if result["ok"] else 1)


if __name__ == "__main__":
    main()
