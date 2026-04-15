#!/usr/bin/env python3
"""
Pipeline de geração de thumbnails para evidence blocks.
Lê PDFs de evidência, renderiza primeira página como imagem,
crop/resize para dimensões do sistema V4.

Uso:
    python thumbnail_pipeline.py /path/to/evidence_pdfs /path/to/output_thumbnails

    from thumbnail_pipeline import generate_thumbnail, generate_all_thumbnails
"""
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    print("ERRO: PyMuPDF não instalado. Rode: pip install PyMuPDF")
    sys.exit(1)

from PIL import Image

# Dimensões V4 (em pixels a 150 DPI)
STANDARD_WIDTH = int(2.6 * 150)   # 390px — evidence block padrão
STANDARD_HEIGHT = int(3.4 * 150)  # 510px
COMPACT_WIDTH = int(2.0 * 150)    # 300px — evidence block compacto
COMPACT_HEIGHT = int(2.6 * 150)   # 390px


def generate_thumbnail(pdf_path: str, output_dir: str = None, dpi: int = 150, compact: bool = False) -> str:
    """
    Gera thumbnail da primeira página de um PDF.

    Args:
        pdf_path: Caminho para o PDF de evidência
        output_dir: Diretório de saída (default: mesmo dir do PDF)
        dpi: Resolução da imagem
        compact: Se True, usa dimensões compactas (2.0" x 2.6")

    Returns:
        Caminho da imagem PNG gerada, ou None se falhar
    """
    pdf_path = Path(pdf_path)
    if not pdf_path.exists():
        print(f"  SKIP: {pdf_path.name} — arquivo não encontrado")
        return None

    if output_dir is None:
        output_dir = pdf_path.parent / "thumbnails"
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        doc = fitz.open(str(pdf_path))
        page = doc[0]

        mat = fitz.Matrix(dpi / 72, dpi / 72)
        pix = page.get_pixmap(matrix=mat)

        temp_path = output_dir / f"{pdf_path.stem}_raw.png"
        pix.save(str(temp_path))

        img = Image.open(temp_path)
        w, h = img.size

        if compact:
            target_w, target_h = COMPACT_WIDTH, COMPACT_HEIGHT
        else:
            target_w, target_h = STANDARD_WIDTH, STANDARD_HEIGHT

        # Resize mantendo aspect ratio, crop central
        ratio = max(target_w / w, target_h / h)
        new_w, new_h = int(w * ratio), int(h * ratio)
        img = img.resize((new_w, new_h), Image.LANCZOS)

        left = (new_w - target_w) // 2
        top = (new_h - target_h) // 2
        img = img.crop((left, top, left + target_w, top + target_h))

        final_path = output_dir / f"thumb_{pdf_path.stem}.png"
        img.save(str(final_path), quality=95)

        # Limpar temp
        temp_path.unlink(missing_ok=True)
        doc.close()

        return str(final_path)

    except Exception as e:
        print(f"  ERRO: {pdf_path.name} — {e}")
        return None


def generate_all_thumbnails(evidence_dir: str, output_dir: str = None) -> dict:
    """
    Gera thumbnails para todos os PDFs em um diretório.

    Returns:
        Dict: {nome_arquivo: caminho_thumbnail}
    """
    evidence_dir = Path(evidence_dir)
    if output_dir is None:
        output_dir = evidence_dir / "thumbnails"

    thumbnails = {}
    pdfs = sorted(evidence_dir.glob("*.pdf"))
    print(f"Gerando thumbnails para {len(pdfs)} PDFs...")

    for pdf in pdfs:
        thumb = generate_thumbnail(str(pdf), str(output_dir))
        thumbnails[pdf.stem] = thumb
        status = "OK" if thumb else "FALHOU"
        print(f"  [{status}] {pdf.name}")

    ok = sum(1 for v in thumbnails.values() if v)
    print(f"\nResultado: {ok}/{len(pdfs)} thumbnails gerados")
    return thumbnails


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python thumbnail_pipeline.py <pasta_evidencias> [pasta_output]")
        sys.exit(1)

    evidence = sys.argv[1]
    output = sys.argv[2] if len(sys.argv) > 2 else None
    generate_all_thumbnails(evidence, output)
