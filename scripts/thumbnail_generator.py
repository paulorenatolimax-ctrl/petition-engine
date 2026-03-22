#!/usr/bin/env python3
"""
Petition Engine — Thumbnail Generator
Converts PDFs and images into standardized thumbnails for DOCX insertion.
"""

import sys
import os
import json
import fitz  # PyMuPDF
from PIL import Image
from pathlib import Path

THUMBNAIL_WIDTH = 800
THUMBNAIL_QUALITY = 85
DPI = 150
SUPPORTED_EXTENSIONS = {'.pdf', '.png', '.jpg', '.jpeg', '.tiff', '.tif', '.bmp', '.webp'}


def generate_thumbnail(input_path: str, output_dir: str, page: int = 0) -> dict:
    path_obj = Path(input_path)

    if not path_obj.exists():
        return {"error": f"Arquivo não encontrado: {input_path}"}

    if path_obj.suffix.lower() not in SUPPORTED_EXTENSIONS:
        return {"error": f"Formato não suportado: {path_obj.suffix}"}

    os.makedirs(output_dir, exist_ok=True)
    output_name = f"{path_obj.stem}_thumb_p{page}.jpg"
    output_path = os.path.join(output_dir, output_name)

    try:
        if path_obj.suffix.lower() == '.pdf':
            img = pdf_to_image(str(path_obj), page)
        else:
            img = Image.open(str(path_obj))

        if img.mode != 'RGB':
            img = img.convert('RGB')

        aspect = img.height / img.width
        new_width = THUMBNAIL_WIDTH
        new_height = int(new_width * aspect)
        img = img.resize((new_width, new_height), Image.LANCZOS)
        img.save(output_path, 'JPEG', quality=THUMBNAIL_QUALITY)

        return {
            "status": "ok",
            "input": str(path_obj),
            "output": output_path,
            "page": page,
            "width": new_width,
            "height": new_height,
            "size_bytes": os.path.getsize(output_path),
        }
    except Exception as e:
        return {"error": str(e), "input": str(path_obj)}


def pdf_to_image(pdf_path: str, page: int = 0) -> Image.Image:
    doc = fitz.open(pdf_path)
    if page >= len(doc):
        page = 0
    pg = doc[page]
    mat = fitz.Matrix(DPI / 72, DPI / 72)
    pix = pg.get_pixmap(matrix=mat)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    doc.close()
    return img


def generate_all_thumbnails(folder_path: str, output_dir: str, max_pages: int = 1) -> list:
    results = []
    folder = Path(folder_path)

    if not folder.exists():
        return [{"error": f"Pasta não encontrada: {folder_path}"}]

    files = sorted([
        f for f in folder.rglob('*')
        if f.suffix.lower() in SUPPORTED_EXTENSIONS
    ])

    for file_path in files:
        if file_path.suffix.lower() == '.pdf':
            doc = fitz.open(str(file_path))
            pages = min(len(doc), max_pages)
            doc.close()
            for page in range(pages):
                result = generate_thumbnail(str(file_path), output_dir, page)
                results.append(result)
        else:
            result = generate_thumbnail(str(file_path), output_dir)
            results.append(result)

    return results


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Uso: thumbnail_generator.py <input_folder> <output_dir> [max_pages]"}))
        sys.exit(1)

    folder = sys.argv[1]
    output = sys.argv[2]
    max_pages = int(sys.argv[3]) if len(sys.argv) > 3 else 1

    results = generate_all_thumbnails(folder, output, max_pages)
    print(json.dumps(results, indent=2))
