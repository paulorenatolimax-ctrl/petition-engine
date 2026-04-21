#!/usr/bin/env python3
"""Validador determinístico de sources inline em Anteprojeto EB-2 NIW.

Valida um arquivo .md de anteprojeto ANTES de ir pro cliente/Obsidian.
Exit 0 se OK, exit 1 se errors.

Checa:
- ≥5 markers [Source: <url>, accessed YYYY-MM-DD] inline
- ≥3 domínios autoritativos distintos
- Cada número com 3+ dígitos significativos (>=100) tem source marker
  a ≤500 chars de distância (permite que o source seja no fim da mesma oração/parágrafo)
- Neutralidade: zero termos de ranking proibidos
- SOC codes proibidos ausentes

Uso:
    python3 validate_anteprojeto_sources.py <anteprojeto.md> [report.txt]
"""
import os
import re
import sys

AUTHORITATIVE_DOMAINS = (
    "bls.gov", "bea.gov", "census.gov", "uscis.gov", "dol.gov",
    "eda.gov", "sba.gov", "whitehouse.gov", "commerce.gov",
    "apprenticeship.gov", "e-verify.gov", "osha.gov",
    "littler.com", "restaurant.org", "td.org", "epi.org",
    "federalregister.gov", "floridajobs.org", "cwc.org", "ibisworld.com"
)

FORBIDDEN_RANKING_TERMS = [
    r"\brecomendamos\b", r"\bsugerimos\b", r"\bmelhor op(ção|cao)\b",
    r"\bo mais forte\b", r"\bmenor risco absoluto\b",
    r"\bse sobressai\b", r"\bclaramente superior\b",
    r"\bdestaca-se como o mais\b",
    r"\brecomenda(ção|cao) estrat[eé]gica\b",
    r"\brecomenda(ção|cao) final\b",
    r"\bportanto o endeavor [ABC] [eé] o mais indicado\b"
]

FORBIDDEN_SOC = [
    r"\b23-1011\b",   # advogado
    r"\b29-1069\b",   # médico
    r"\b17-201\d\b",  # engenheiro
    r"\b13-2011\b"    # contador
]

FORBIDDEN_INFRA = [
    r"\bPROEX\b", r"\bKortix\b", r"\bPetition Engine\b",
    r"\bObsidian\b", r"\bForjado por\b",
    r"\bRAG [IVX]+\b", r"\bRAG \d\b"
]

SOURCE_MARKER = re.compile(
    r"\[Source:\s*(https?://[^\s,\]]+)[^,\]]*,?\s*accessed\s+(\d{4}-\d{2}-\d{2})\s*\]",
    re.IGNORECASE
)


def _err(msgs, msg):
    msgs.append(msg)


def check_sources_inline(text, errors, warnings, passed):
    sources = SOURCE_MARKER.findall(text)
    if len(sources) < 5:
        _err(errors, f"only {len(sources)} [Source: ...] markers found; minimum 5 required")
    else:
        _err(passed, f"{len(sources)} inline source markers")

    domains = set()
    for url, _ in sources:
        for d in AUTHORITATIVE_DOMAINS:
            if d in url:
                domains.add(d)
                break
    if len(domains) < 3:
        _err(errors, f"only {len(domains)} authoritative domains cited; minimum 3")
    else:
        _err(passed, f"{len(domains)} authoritative domains: {', '.join(sorted(domains))}")
    return sources


def check_number_source_proximity(text, errors, warnings):
    """Each quantitative number (>=100) should have [Source:] within 500 chars."""
    number_pattern = re.compile(
        r"(?<![\w\-])(\d{1,3}[.,]\d{3}(?:[.,]\d{3})*|\d{3,})(?![\w\-])"
    )
    orphans = []
    for m in number_pattern.finditer(text):
        n_str = m.group(1)
        try:
            value = int(n_str.replace(".", "").replace(",", ""))
        except ValueError:
            continue
        if value < 100:
            continue
        start = m.start()
        window = text[max(0, start - 200):min(len(text), start + 500)]
        if "[Source:" not in window:
            orphans.append((n_str, start, text[max(0, start - 60):start + 60]))

    if orphans:
        first_5 = orphans[:5]
        _err(warnings,
             f"{len(orphans)} numbers >= 100 without nearby [Source:] marker. First 5: "
             + " | ".join(f"'{n}' near '{ctx}'" for n, _, ctx in first_5))


def check_forbidden_ranking(text, errors, warnings, passed):
    leaked = []
    for pattern in FORBIDDEN_RANKING_TERMS:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            ctx = text[max(0, m.start() - 40):m.end() + 40]
            leaked.append(f"'{m.group()}' near '{ctx}'")
    if leaked:
        for l in leaked:
            _err(errors, f"ranking term leak: {l}")
    else:
        _err(passed, "neutrality preserved (no ranking terms)")


def check_forbidden_soc(text, errors, warnings, passed):
    leaked = []
    for pattern in FORBIDDEN_SOC:
        if re.search(pattern, text):
            leaked.append(pattern.replace(r"\b", ""))
    if leaked:
        for l in leaked:
            _err(errors, f"forbidden SOC code present: {l}")
    else:
        _err(passed, "no forbidden SOC codes (advogado/médico/engenheiro/contador)")


def check_forbidden_infra(text, errors, warnings, passed):
    leaked = []
    for pattern in FORBIDDEN_INFRA:
        m = re.search(pattern, text)
        if m:
            leaked.append(m.group())
    if leaked:
        for l in leaked:
            _err(errors, f"infrastructure exposure: '{l}'")
    else:
        _err(passed, "no internal infrastructure exposure")


def main():
    if len(sys.argv) < 2:
        sys.stderr.write("Usage: validate_anteprojeto_sources.py <anteprojeto.md> [report.txt]\n")
        sys.exit(2)

    md_path = sys.argv[1]
    report_path = sys.argv[2] if len(sys.argv) > 2 else None

    if not os.path.isfile(md_path):
        sys.stderr.write(f"ERR: file not found: {md_path}\n")
        sys.exit(2)

    text = open(md_path, encoding="utf-8").read()

    errors, warnings, passed = [], [], []
    sources = check_sources_inline(text, errors, warnings, passed)
    check_number_source_proximity(text, errors, warnings)
    check_forbidden_ranking(text, errors, warnings, passed)
    check_forbidden_soc(text, errors, warnings, passed)
    check_forbidden_infra(text, errors, warnings, passed)

    status = "PASSED" if not errors else "FAILED"
    lines = [
        f"Anteprojeto EB-2 NIW validator — {status}",
        f"  file: {md_path}",
        f"  errors:   {len(errors)}",
        f"  warnings: {len(warnings)}",
        f"  passed:   {len(passed)}"
    ]
    if passed:
        lines.append("\n✓ Passed:")
        for p in passed:
            lines.append(f"  ✓ {p}")
    if warnings:
        lines.append("\n⚠ Warnings:")
        for w in warnings:
            lines.append(f"  ⚠ {w}")
    if errors:
        lines.append("\n✗ Errors (blocking):")
        for e in errors:
            lines.append(f"  ✗ {e}")

    report = "\n".join(lines)
    print(report)
    if report_path:
        with open(report_path, "w", encoding="utf-8") as f:
            f.write(report + "\n")

    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
