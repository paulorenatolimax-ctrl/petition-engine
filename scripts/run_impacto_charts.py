#!/usr/bin/env python3
"""Wrapper do chart generator do IMPACTO v3.

Uso:
    python3 run_impacto_charts.py <chart_script.py> <config.json> <output_dir>
"""
import os
import subprocess
import sys

if len(sys.argv) < 4:
    sys.stderr.write("Usage: run_impacto_charts.py <chart_script> <config.json> <output_dir>\n")
    sys.exit(1)

chart_script, config_json, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]

for f in (chart_script, config_json):
    if not os.path.isfile(f):
        sys.stderr.write(f"ERR: file not found: {f}\n")
        sys.exit(2)

os.makedirs(out_dir, exist_ok=True)

cmd = ["python3", chart_script, config_json, out_dir]
print(f"[impacto-charts] cmd={cmd!r}")

result = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
print("--- STDOUT ---")
print(result.stdout)
if result.stderr:
    print("--- STDERR ---")
    print(result.stderr)
if result.returncode != 0:
    sys.exit(result.returncode)

layers = os.path.join(out_dir, "chart_impact_layers.png")
mult = os.path.join(out_dir, "chart_multipliers.png")
for f in (layers, mult):
    if not os.path.isfile(f):
        sys.stderr.write(f"ERR: expected chart not produced: {f}\n")
        sys.exit(3)

print(f"OK {layers} ({os.path.getsize(layers):,} bytes)")
print(f"OK {mult} ({os.path.getsize(mult):,} bytes)")
