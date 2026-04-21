#!/usr/bin/env python3
"""Smoke test for IMPACTO® builder v3 end-to-end.

Runs: charts generator → builder → config validator → docx QA.
Fixture: scripts/test_fixtures/minimal_config.json (generic, no client data).

Exit 0 if all pass, 1 if any fail. Target runtime: <30s.
"""
import os
import shutil
import subprocess
import sys
import tempfile
import time

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
FIXTURE = os.path.join(HERE, "test_fixtures", "minimal_config.json")
AGENTS_DIR = "/Users/paulo1844/Documents/5_Z GLOBAL/_PRODUTO NOVO/agents"
BUILDER = os.path.join(AGENTS_DIR, "build_impacto_universal_v3.js")
CHART_GEN = os.path.join(AGENTS_DIR, "generate_impacto_charts.py")
VALIDATOR = os.path.join(HERE, "validate_impacto_config.py")
QA_SCRIPT = os.path.join(HERE, "qa_impacto_docx.py")


def run(cmd, cwd=None, env=None, timeout=60):
    t0 = time.time()
    r = subprocess.run(cmd, cwd=cwd, env=env, capture_output=True, text=True, timeout=timeout)
    elapsed = time.time() - t0
    return r.returncode, r.stdout, r.stderr, elapsed


def main():
    failures = []

    for path, label in [(FIXTURE, "fixture"), (BUILDER, "builder"),
                        (CHART_GEN, "chart_gen"), (VALIDATOR, "validator"),
                        (QA_SCRIPT, "qa_script")]:
        if not os.path.isfile(path):
            failures.append(f"missing {label}: {path}")
    if failures:
        for f in failures:
            print(f"  ✗ {f}")
        sys.exit(2)

    with tempfile.TemporaryDirectory() as tmp:
        config_copy = os.path.join(tmp, "test_config.json")
        shutil.copy(FIXTURE, config_copy)

        # 1. Config validator
        print(">>> [1/4] validate_impacto_config.py")
        rc, out, err, t = run(["python3", VALIDATOR, config_copy], timeout=15)
        if rc != 0:
            print(out)
            failures.append(f"validator exit={rc}")
        else:
            print(f"    ✓ passed in {t:.1f}s")

        # 2. Chart generator
        print(">>> [2/4] generate_impacto_charts.py")
        charts_out = os.path.join(tmp, "charts")
        os.makedirs(charts_out, exist_ok=True)
        rc, out, err, t = run(["python3", CHART_GEN, config_copy, charts_out], timeout=30)
        if rc != 0:
            print(out + err)
            failures.append(f"chart_gen exit={rc}")
        else:
            p1 = os.path.join(charts_out, "chart_impact_layers.png")
            p2 = os.path.join(charts_out, "chart_multipliers.png")
            ok = os.path.isfile(p1) and os.path.isfile(p2)
            if not ok:
                failures.append("charts not produced")
            elif os.path.getsize(p1) < 10000 or os.path.getsize(p2) < 10000:
                failures.append(f"chart files suspiciously small: {os.path.getsize(p1)}, {os.path.getsize(p2)}")
            else:
                print(f"    ✓ 2 charts in {t:.1f}s ({os.path.getsize(p1):,} + {os.path.getsize(p2):,} bytes)")

        # 3. Builder v3 (expects charts in AGENTS_DIR/_charts_cache by default;
        #    here we pass the tmp charts dir as 4th arg)
        print(">>> [3/4] build_impacto_universal_v3.js")
        docx_out = os.path.join(tmp, "test_output.docx")
        env = os.environ.copy()
        try:
            node_prefix = subprocess.check_output(["npm", "root", "-g"], text=True).strip()
            env["NODE_PATH"] = node_prefix
        except Exception:
            pass
        rc, out, err, t = run(
            ["node", BUILDER, config_copy, docx_out, charts_out],
            env=env, timeout=30
        )
        if rc != 0:
            print(out + err)
            failures.append(f"builder exit={rc}")
        elif not os.path.isfile(docx_out):
            failures.append("builder did not produce DOCX")
        else:
            print(f"    ✓ DOCX generated in {t:.1f}s ({os.path.getsize(docx_out):,} bytes)")

        # 4. QA script on generated DOCX
        if os.path.isfile(docx_out):
            print(">>> [4/4] qa_impacto_docx.py")
            qa_report = os.path.join(tmp, "qa_report.md")
            rc, out, err, t = run(["python3", QA_SCRIPT, docx_out, qa_report], timeout=15)
            if rc != 0:
                print(out)
                failures.append(f"qa_script exit={rc}")
            else:
                print(f"    ✓ QA passed in {t:.1f}s")

    print()
    if failures:
        print("=" * 60)
        print(f"FAILED ({len(failures)} issue{'s' if len(failures)>1 else ''}):")
        for f in failures:
            print(f"  ✗ {f}")
        sys.exit(1)
    else:
        print("=" * 60)
        print("✓ ALL SMOKE TESTS PASSED")
        sys.exit(0)


if __name__ == "__main__":
    main()
