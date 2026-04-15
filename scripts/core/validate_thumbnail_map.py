#!/usr/bin/env python3
"""
Validate thumbnail_map.json before inserting thumbnails.
Blocks insertion if any path is missing or description is Unknown.

Usage:
    python3 validate_thumbnail_map.py /path/to/thumbnail_map.json

Exit codes:
    0 = all entries valid
    1 = validation failed (details printed)
"""

import json
import os
import sys


def validate(map_path: str) -> bool:
    if not os.path.exists(map_path):
        print(f"❌ thumbnail_map.json not found: {map_path}")
        return False

    with open(map_path) as f:
        data = json.load(f)

    # Handle both formats: direct dict or nested under unmapped_exhibits
    entries = data
    if "unmapped_exhibits" in data:
        entries = data["unmapped_exhibits"]
    if "note" in entries:
        del entries["note"]

    if not entries:
        print("❌ thumbnail_map.json is empty")
        return False

    errors = []
    valid = 0

    for key, entry in entries.items():
        # Check structure
        if isinstance(entry, str):
            errors.append(f"{key}: entry is a string, not a dict")
            continue

        pdf_path = entry.get("pdf_path", "")
        description = entry.get("description", "")

        # Check pdf_path
        if not pdf_path or pdf_path.strip() == "":
            errors.append(f"{key}: pdf_path is EMPTY")
        elif not os.path.exists(pdf_path):
            errors.append(f"{key}: pdf_path NOT FOUND → {pdf_path}")
        else:
            valid += 1

        # Check description
        if not description or description.strip() in ("", "Unknown", "unknown"):
            errors.append(f"{key}: description is '{description}' (must be descriptive)")

    total = len(entries)
    print(f"\n{'='*60}")
    print(f"THUMBNAIL MAP VALIDATION — {os.path.basename(map_path)}")
    print(f"{'='*60}")
    print(f"Total entries: {total}")
    print(f"Valid paths: {valid}/{total}")

    if errors:
        print(f"\n❌ FAILED — {len(errors)} errors:")
        for e in errors:
            print(f"  ❌ {e}")
        print(f"\n{'='*60}")
        return False
    else:
        print(f"\n✅ ALL ENTRIES VALID")
        print(f"{'='*60}")
        return True


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 validate_thumbnail_map.py <path_to_thumbnail_map.json>")
        sys.exit(1)

    passed = validate(sys.argv[1])
    sys.exit(0 if passed else 1)
