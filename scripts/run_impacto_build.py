#!/usr/bin/env python3
"""Thin wrapper around the IMPACTO universal Node.js builder.

Usage:
    python3 run_impacto_build.py <path_to_build_js> <path_to_config_json> <output_docx>

The build_impacto_universal.js script writes to ./output.docx by default; we
rename the output to the requested path.
"""
import os, subprocess, sys, shutil, json

if len(sys.argv) < 4:
    sys.stderr.write('Usage: run_impacto_build.py <build.js> <config.json> <output.docx>\n')
    sys.exit(1)

build_js, config_json, output_docx = sys.argv[1], sys.argv[2], sys.argv[3]

for f in (build_js, config_json):
    if not os.path.isfile(f):
        sys.stderr.write(f'ERR: file not found: {f}\n')
        sys.exit(2)

build_dir = os.path.dirname(os.path.abspath(build_js))
out_dir = os.path.dirname(os.path.abspath(output_docx)) or '.'
os.makedirs(out_dir, exist_ok=True)

# The builder reads argv[2] (config path). Use NODE_PATH to find globally installed docx.
env = os.environ.copy()
try:
    node_prefix = subprocess.check_output(['npm', 'root', '-g'], text=True).strip()
    env['NODE_PATH'] = node_prefix
except Exception:
    pass

cmd = ['node', os.path.basename(build_js), os.path.abspath(config_json)]
print(f'[impacto-build] cwd={build_dir} cmd={cmd!r}')

result = subprocess.run(cmd, cwd=build_dir, capture_output=True, text=True, timeout=900, env=env)
print('--- STDOUT ---')
print(result.stdout[-4000:])
if result.stderr:
    print('--- STDERR ---')
    print(result.stderr[-2000:])
if result.returncode != 0:
    sys.exit(result.returncode)

# Find produced DOCX
produced = None
try:
    cfg = json.load(open(config_json, encoding='utf-8'))
    produced = cfg.get('meta', {}).get('output_path') or cfg.get('meta', {}).get('output')
except Exception:
    pass

if not produced or not os.path.isfile(produced):
    newest, newest_mtime = None, 0
    for name in os.listdir(build_dir):
        if name.endswith('.docx'):
            p = os.path.join(build_dir, name)
            m = os.path.getmtime(p)
            if m > newest_mtime:
                newest_mtime = m
                newest = p
    produced = newest

if not produced or not os.path.isfile(produced):
    sys.stderr.write('ERR: could not locate DOCX produced by builder\n')
    sys.exit(3)

if os.path.abspath(produced) != os.path.abspath(output_docx):
    shutil.move(produced, output_docx)
print(f'OK IMPACTO DOCX: {output_docx} ({os.path.getsize(output_docx):,} bytes)')
