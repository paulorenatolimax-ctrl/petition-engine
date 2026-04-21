#!/usr/bin/env python3
"""Validador bloqueante do client_config.json do IMPACTO®.

Valida ANTES do builder rodar. Retorna exit 0 se OK, não-zero se FAIL.
Gera relatório detalhado em stderr + em arquivo se caminho dado.

Uso:
    python3 validate_impacto_config.py <config.json> [report_path]

Validações:
- Schema (campos obrigatórios + tipos)
- Ranges plausíveis de multipliers
- Presença + formato de multipliers.sources[] (≥4 URLs autoritativas)
- research_timestamp recente (<72h)
- Terminologia imigratória zero nos campos de texto livre
- Consistência cruzada direct_output × type_ii ≈ total_output
"""
import json
import os
import re
import sys
from datetime import datetime, timezone

AUTHORITATIVE_DOMAINS = ("bea.gov", "bls.gov", "census.gov", "epi.org",
                         "siccode.com", "naics.com", "whitehouse.gov",
                         "ibisworld.com", "imf.org", "oecd.org", "floridajobs.org")

IMMIGRATION_TERMS = [
    "EB-2", "EB2", "EB-1", "NIW", "Dhanasar", "Prong", "USCIS",
    "petitioner", "peticionário", "I-140", "waiver", "waive",
    "National Interest Waiver", "8 CFR", "immigration", "imigração",
    "labor certification", "adjudicator", "Kazarian", "extraordinary ability"
]

MULTIPLIER_RANGES = {
    "type_ii_output":          (1.0, 3.0,  "Services em MSAs 1.2-1.6; manufacturing 1.8-2.8"),
    "type_ii_employment":      (5.0, 30.0, "Jobs por $1M direct — services 10-18; manufacturing 18-28"),
    "type_ii_earnings":        (0.3, 1.2,  "Range típico 0.45-0.80 para services MSA"),
    "epi_employment_multiplier": (1.2, 8.0, "EPI Bivens 2019: education 1.93, manufacturing 3-7"),
}

REQUIRED_TOP_LEVEL = ["meta", "client", "location", "industry", "multipliers",
                      "m1_economic_output", "m2_employment", "m4_tax_revenue"]

REQUIRED_META = ["language", "analysis_date", "report_id", "prepared_by"]
REQUIRED_CLIENT = ["company_name", "industry_naics"]
REQUIRED_LOCATION = ["msa_name", "msa_fips"]
REQUIRED_MULTIPLIERS_FIELDS = ["type_ii_output", "type_ii_employment",
                                "type_ii_earnings", "epi_employment_multiplier",
                                "sources", "research_timestamp",
                                "methodology_notes"]


def _err(msgs, msg):
    msgs.append(msg)


def check_schema(cfg, errors, warnings):
    for key in REQUIRED_TOP_LEVEL:
        if key not in cfg:
            _err(errors, f"missing required top-level: {key}")
    meta = cfg.get("meta", {})
    for key in REQUIRED_META:
        if key not in meta:
            _err(errors, f"meta.{key} missing")
    client = cfg.get("client", {})
    for key in REQUIRED_CLIENT:
        if key not in client or not client[key]:
            _err(errors, f"client.{key} missing or empty")
    loc = cfg.get("location", {})
    for key in REQUIRED_LOCATION:
        if key not in loc or not loc[key]:
            _err(errors, f"location.{key} missing or empty")


def check_multipliers(cfg, errors, warnings):
    m = cfg.get("multipliers", {})
    if not m:
        _err(errors, "multipliers block missing entirely")
        return

    for key in REQUIRED_MULTIPLIERS_FIELDS:
        if key not in m:
            _err(errors, f"multipliers.{key} missing (blocking — required by AGENT_02 v3 contract)")

    # Ranges
    for key, (lo, hi, hint) in MULTIPLIER_RANGES.items():
        v = m.get(key)
        if v is None:
            continue
        try:
            v = float(v)
        except (TypeError, ValueError):
            _err(errors, f"multipliers.{key} is not numeric: {v!r}")
            continue
        if v < lo or v > hi:
            _err(errors,
                 f"multipliers.{key}={v} out of plausible range [{lo}, {hi}]. Hint: {hint}")


def check_sources(cfg, errors, warnings):
    m = cfg.get("multipliers", {})
    srcs = m.get("sources", [])
    if not isinstance(srcs, list):
        _err(errors, "multipliers.sources must be a list")
        return
    if len(srcs) < 4:
        _err(errors, f"multipliers.sources has {len(srcs)} items, minimum is 4 (NAICS, RIMS II, BLS OES, EPI)")
    auth_hits = 0
    for i, s in enumerate(srcs):
        if not isinstance(s, dict):
            _err(errors, f"sources[{i}] must be object with url/consulted_for/access_date")
            continue
        url = s.get("url", "")
        if not (url.startswith("http://") or url.startswith("https://")):
            _err(errors, f"sources[{i}].url not a valid URL: {url!r}")
            continue
        if any(d in url for d in AUTHORITATIVE_DOMAINS):
            auth_hits += 1
        if not s.get("consulted_for"):
            _err(errors, f"sources[{i}].consulted_for is empty")
        if not s.get("access_date"):
            _err(errors, f"sources[{i}].access_date is empty")
    if auth_hits < 3:
        _err(errors,
             f"only {auth_hits} source URLs from authoritative domains ({', '.join(AUTHORITATIVE_DOMAINS[:5])}...); minimum 3")


def check_research_freshness(cfg, errors, warnings):
    m = cfg.get("multipliers", {})
    ts = m.get("research_timestamp")
    if not ts:
        return  # already flagged in schema
    try:
        # Accept both "2026-04-20T23:30Z" and full ISO
        t = ts.replace("Z", "+00:00")
        dt = datetime.fromisoformat(t)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        age_hours = (datetime.now(timezone.utc) - dt).total_seconds() / 3600
        if age_hours > 72:
            _err(warnings, f"multipliers.research_timestamp is {age_hours:.0f}h old (>72h); consider re-running AGENT_02")
    except Exception as e:
        _err(warnings, f"multipliers.research_timestamp unparseable: {ts!r} ({e})")


def check_immigration_leak(cfg, errors, warnings):
    """Scan all string values for immigration terminology."""
    seen = []

    def walk(obj, path=""):
        if isinstance(obj, str):
            for term in IMMIGRATION_TERMS:
                if re.search(rf"\b{re.escape(term)}\b", obj, re.IGNORECASE):
                    # Allow in meta.notes_and_instructions / specific internal-context blocks
                    if path.startswith(("dhanasar_analysis", "m10_rfe_mapping",
                                        "notes_and_instructions")):
                        continue
                    seen.append(f"path={path} term={term!r} sample={obj[:80]!r}")
        elif isinstance(obj, dict):
            for k, v in obj.items():
                walk(v, f"{path}.{k}" if path else k)
        elif isinstance(obj, list):
            for i, v in enumerate(obj):
                walk(v, f"{path}[{i}]")

    walk(cfg)
    for s in seen:
        _err(errors, f"immigration term leak: {s}")


def check_consistency(cfg, errors, warnings):
    m1 = cfg.get("m1_economic_output", {})
    mp = cfg.get("multipliers", {})
    direct = m1.get("direct_output_5yr")
    total = m1.get("total_output_5yr")
    mult = mp.get("type_ii_output")
    if direct and total and mult:
        try:
            expected = float(direct) * float(mult)
            diff_pct = abs(total - expected) / expected * 100
            if diff_pct > 5:
                _err(errors,
                     f"M1 inconsistency: direct_output_5yr={direct:,.0f} × type_ii_output={mult} = {expected:,.0f} "
                     f"but total_output_5yr={total:,.0f} (diff {diff_pct:.1f}%, max 5%)")
        except (TypeError, ValueError):
            pass


def main():
    if len(sys.argv) < 2:
        sys.stderr.write("Usage: validate_impacto_config.py <config.json> [report_path]\n")
        sys.exit(2)

    config_path = sys.argv[1]
    report_path = sys.argv[2] if len(sys.argv) > 2 else None

    if not os.path.isfile(config_path):
        sys.stderr.write(f"ERR: config not found: {config_path}\n")
        sys.exit(2)

    try:
        cfg = json.load(open(config_path, encoding="utf-8"))
    except json.JSONDecodeError as e:
        sys.stderr.write(f"ERR: invalid JSON: {e}\n")
        sys.exit(2)

    errors, warnings = [], []
    check_schema(cfg, errors, warnings)
    check_multipliers(cfg, errors, warnings)
    check_sources(cfg, errors, warnings)
    check_research_freshness(cfg, errors, warnings)
    check_immigration_leak(cfg, errors, warnings)
    check_consistency(cfg, errors, warnings)

    lines = [f"IMPACTO® config validator — {config_path}"]
    lines.append(f"  errors:   {len(errors)}")
    lines.append(f"  warnings: {len(warnings)}")
    if errors:
        lines.append("\nERRORS (blocking):")
        for e in errors:
            lines.append(f"  ✗ {e}")
    if warnings:
        lines.append("\nWARNINGS (non-blocking):")
        for w in warnings:
            lines.append(f"  ⚠ {w}")
    if not errors and not warnings:
        lines.append("\n✓ ALL CHECKS PASSED")

    report = "\n".join(lines)
    print(report)
    if report_path:
        with open(report_path, "w", encoding="utf-8") as f:
            f.write(report + "\n")

    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
