# 07 — THUMBNAILS & EVIDÊNCIAS (Scripts Python)

## Contexto

Petições de imigração incluem **evidências** (diplomas, publicações, prêmios, reportagens, contratos, fotos). Essas evidências precisam ser:

1. **Extraídas** dos PDFs/imagens do cliente
2. **Convertidas** em thumbnails (imagens menores, padronizadas)
3. **Inseridas** no DOCX final (relatório fotográfico, cover letter com anexos)
4. **Legendadas** com descrição e número do exhibit

Atualmente Paulo faz isso manualmente no Cowork. O Petition Engine automatiza com Python.

## Dependências

```
# scripts/requirements.txt
python-docx==1.1.2
pdfplumber==0.11.4
PyMuPDF==1.24.0
pdf2image==1.17.0
Pillow==10.4.0
```

**Requisito de sistema:** `poppler-utils` (no macOS: `brew install poppler`)

## Scripts Python

### 1. `scripts/thumbnail_generator.py`

Gera thumbnails a partir de PDFs e imagens.

```python
#!/usr/bin/env python3
"""
Petition Engine — Thumbnail Generator
Converte PDFs e imagens em thumbnails padronizados para inserção em DOCX.
"""

import sys
import os
import json
import fitz  # PyMuPDF
from PIL import Image
from pathlib import Path

# Configurações
THUMBNAIL_WIDTH = 800   # largura em pixels
THUMBNAIL_QUALITY = 85  # qualidade JPEG
DPI = 150               # resolução para conversão de PDF
SUPPORTED_EXTENSIONS = {'.pdf', '.png', '.jpg', '.jpeg', '.tiff', '.tif', '.bmp', '.webp'}


def generate_thumbnail(input_path: str, output_dir: str, page: int = 0) -> dict:
    """
    Gera thumbnail de um arquivo PDF ou imagem.

    Args:
        input_path: Caminho do arquivo fonte
        output_dir: Diretório de saída
        page: Página do PDF (0-indexed)

    Returns:
        dict com info do thumbnail gerado
    """
    path = Path(input_path)

    if not path.exists():
        return {"error": f"Arquivo não encontrado: {input_path}"}

    if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
        return {"error": f"Formato não suportado: {path.suffix}"}

    os.makedirs(output_dir, exist_ok=True)

    output_name = f"{path.stem}_thumb_p{page}.jpg"
    output_path = os.path.join(output_dir, output_name)

    try:
        if path.suffix.lower() == '.pdf':
            img = pdf_to_image(str(path), page)
        else:
            img = Image.open(str(path))

        # Converter para RGB (caso RGBA ou P)
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Redimensionar mantendo aspect ratio
        aspect = img.height / img.width
        new_width = THUMBNAIL_WIDTH
        new_height = int(new_width * aspect)
        img = img.resize((new_width, new_height), Image.LANCZOS)

        # Salvar
        img.save(output_path, 'JPEG', quality=THUMBNAIL_QUALITY)

        return {
            "status": "ok",
            "input": str(path),
            "output": output_path,
            "page": page,
            "width": new_width,
            "height": new_height,
            "size_bytes": os.path.getsize(output_path),
        }
    except Exception as e:
        return {"error": str(e), "input": str(path)}


def pdf_to_image(pdf_path: str, page: int = 0) -> Image.Image:
    """Converte uma página de PDF em imagem PIL usando PyMuPDF."""
    doc = fitz.open(pdf_path)

    if page >= len(doc):
        page = 0  # fallback para primeira página

    pg = doc[page]
    mat = fitz.Matrix(DPI / 72, DPI / 72)  # zoom para DPI desejado
    pix = pg.get_pixmap(matrix=mat)

    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    doc.close()

    return img


def generate_all_thumbnails(folder_path: str, output_dir: str, max_pages: int = 1) -> list:
    """
    Gera thumbnails para todos os arquivos suportados em uma pasta.

    Args:
        folder_path: Pasta com evidências do cliente
        output_dir: Pasta de saída dos thumbnails
        max_pages: Máximo de páginas por PDF

    Returns:
        Lista de resultados
    """
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
            # Para PDFs, gerar thumbnail de cada página (até max_pages)
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


def get_pdf_page_count(pdf_path: str) -> int:
    """Retorna número de páginas de um PDF."""
    doc = fitz.open(pdf_path)
    count = len(doc)
    doc.close()
    return count


# CLI
if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Uso: thumbnail_generator.py <input_folder> <output_dir> [max_pages]"}))
        sys.exit(1)

    folder = sys.argv[1]
    output = sys.argv[2]
    max_pages = int(sys.argv[3]) if len(sys.argv) > 3 else 1

    results = generate_all_thumbnails(folder, output, max_pages)
    print(json.dumps(results, indent=2))
```

### 2. `scripts/docx_inserter.py`

Insere thumbnails em um DOCX existente ou cria relatório fotográfico.

```python
#!/usr/bin/env python3
"""
Petition Engine — DOCX Inserter
Insere thumbnails em documentos DOCX com legendas formatadas.
"""

import sys
import os
import json
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_ORIENT


def create_photographic_report(
    thumbnails: list,
    output_path: str,
    client_name: str,
    visa_type: str,
    title: str = "PHOTOGRAPHIC EVIDENCE REPORT"
) -> dict:
    """
    Cria relatório fotográfico completo com todas as evidências.

    Args:
        thumbnails: Lista de dicts com {path, caption, exhibit_number}
        output_path: Caminho do DOCX de saída
        client_name: Nome do cliente
        visa_type: Tipo de visto
        title: Título do relatório

    Returns:
        dict com info do documento gerado
    """
    doc = Document()

    # Configurar margens
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Título
    title_para = doc.add_paragraph()
    title_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title_para.add_run(title)
    run.bold = True
    run.font.size = Pt(16)
    run.font.color.rgb = RGBColor(0, 0, 0)

    # Subtítulo
    subtitle = doc.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = subtitle.add_run(f"Petitioner: {client_name}\nVisa Category: {visa_type}")
    run.font.size = Pt(11)
    run.font.color.rgb = RGBColor(80, 80, 80)

    doc.add_paragraph()  # espaço

    # Inserir cada evidência
    inserted = 0
    errors = []

    for i, thumb in enumerate(thumbnails):
        img_path = thumb.get('path', '')
        caption = thumb.get('caption', f'Evidence {i + 1}')
        exhibit = thumb.get('exhibit_number', f'Exhibit {i + 1}')

        if not os.path.exists(img_path):
            errors.append(f"Imagem não encontrada: {img_path}")
            continue

        # Número do exhibit
        exhibit_para = doc.add_paragraph()
        exhibit_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = exhibit_para.add_run(exhibit)
        run.bold = True
        run.font.size = Pt(12)

        # Imagem
        try:
            img_para = doc.add_paragraph()
            img_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = img_para.add_run()
            run.add_picture(img_path, width=Inches(5.5))
            inserted += 1
        except Exception as e:
            errors.append(f"Erro ao inserir {img_path}: {str(e)}")
            continue

        # Legenda
        caption_para = doc.add_paragraph()
        caption_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = caption_para.add_run(caption)
        run.italic = True
        run.font.size = Pt(9)
        run.font.color.rgb = RGBColor(100, 100, 100)

        # Separador (exceto último)
        if i < len(thumbnails) - 1:
            doc.add_paragraph()
            separator = doc.add_paragraph()
            separator.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = separator.add_run("─" * 40)
            run.font.color.rgb = RGBColor(200, 200, 200)
            doc.add_paragraph()

    # Salvar
    doc.save(output_path)

    return {
        "status": "ok",
        "output": output_path,
        "total_evidence": len(thumbnails),
        "inserted": inserted,
        "errors": errors,
        "page_count_estimate": inserted + 2,  # capa + evidências
    }


def insert_thumbnails_into_existing(
    docx_path: str,
    thumbnails: list,
    output_path: str,
    insert_after_heading: str = None,
    section_title: str = "EVIDENCE APPENDIX"
) -> dict:
    """
    Insere thumbnails em um DOCX existente.

    Args:
        docx_path: DOCX existente
        thumbnails: Lista de {path, caption, exhibit_number}
        output_path: Caminho de saída (pode ser igual ao input para sobrescrever)
        insert_after_heading: Inserir após este heading (ou no final se None)
        section_title: Título da seção de evidências

    Returns:
        dict com resultado
    """
    doc = Document(docx_path)

    # Adicionar page break antes das evidências
    doc.add_page_break()

    # Título da seção
    heading = doc.add_paragraph()
    heading.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = heading.add_run(section_title)
    run.bold = True
    run.font.size = Pt(14)

    doc.add_paragraph()  # espaço

    inserted = 0
    errors = []

    for i, thumb in enumerate(thumbnails):
        img_path = thumb.get('path', '')
        caption = thumb.get('caption', f'Evidence {i + 1}')
        exhibit = thumb.get('exhibit_number', f'Exhibit {i + 1}')

        if not os.path.exists(img_path):
            errors.append(f"Não encontrado: {img_path}")
            continue

        # Exhibit label
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(exhibit)
        run.bold = True
        run.font.size = Pt(11)

        # Imagem
        try:
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = p.add_run()
            run.add_picture(img_path, width=Inches(5))
            inserted += 1
        except Exception as e:
            errors.append(f"Erro: {img_path} — {str(e)}")
            continue

        # Caption
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(caption)
        run.italic = True
        run.font.size = Pt(9)

        doc.add_paragraph()  # espaço entre evidências

    doc.save(output_path)

    return {
        "status": "ok",
        "output": output_path,
        "inserted": inserted,
        "errors": errors,
    }


# CLI
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "Uso: docx_inserter.py <mode> [args...]",
            "modes": {
                "report": "docx_inserter.py report <thumbnails_json> <output.docx> <client_name> <visa_type>",
                "insert": "docx_inserter.py insert <existing.docx> <thumbnails_json> <output.docx>",
            }
        }))
        sys.exit(1)

    mode = sys.argv[1]

    if mode == 'report':
        thumbnails = json.loads(sys.argv[2])
        output = sys.argv[3]
        client_name = sys.argv[4]
        visa_type = sys.argv[5]
        result = create_photographic_report(thumbnails, output, client_name, visa_type)
        print(json.dumps(result, indent=2))

    elif mode == 'insert':
        docx_path = sys.argv[2]
        thumbnails = json.loads(sys.argv[3])
        output = sys.argv[4]
        result = insert_thumbnails_into_existing(docx_path, thumbnails, output)
        print(json.dumps(result, indent=2))

    else:
        print(json.dumps({"error": f"Modo desconhecido: {mode}"}))
        sys.exit(1)
```

### 3. `scripts/generate_docx.py`

Gera DOCX formatado a partir de markdown/texto estruturado.

```python
#!/usr/bin/env python3
"""
Petition Engine — DOCX Generator
Converte texto estruturado (markdown-like) em DOCX formatado profissionalmente.
"""

import sys
import os
import json
import re
from docx import Document
from docx.shared import Inches, Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.style import WD_STYLE_TYPE


# Estilos padrão para documentos de petição
STYLES = {
    'font_family': 'Times New Roman',
    'body_size': Pt(12),
    'heading1_size': Pt(14),
    'heading2_size': Pt(13),
    'heading3_size': Pt(12),
    'line_spacing': 1.15,
    'paragraph_spacing_after': Pt(6),
    'margin_top': Inches(1),
    'margin_bottom': Inches(1),
    'margin_left': Inches(1),
    'margin_right': Inches(1),
}


def generate_docx(
    content: str,
    output_path: str,
    template_path: str = None,
    metadata: dict = None
) -> dict:
    """
    Gera DOCX a partir de texto estruturado.

    O texto usa convenções simples:
    - # Heading 1
    - ## Heading 2
    - ### Heading 3
    - **bold text**
    - *italic text*
    - Linhas em branco = novo parágrafo
    - --- = page break

    Args:
        content: Texto estruturado
        output_path: Caminho de saída
        template_path: Template DOCX opcional (usa estilos do template)
        metadata: Metadados opcionais {title, author, subject}

    Returns:
        dict com info do documento
    """
    # Usar template ou documento em branco
    if template_path and os.path.exists(template_path):
        doc = Document(template_path)
    else:
        doc = Document()
        setup_default_styles(doc)

    # Configurar margens
    for section in doc.sections:
        section.top_margin = STYLES['margin_top']
        section.bottom_margin = STYLES['margin_bottom']
        section.left_margin = STYLES['margin_left']
        section.right_margin = STYLES['margin_right']

    # Metadados
    if metadata:
        doc.core_properties.title = metadata.get('title', '')
        doc.core_properties.author = metadata.get('author', 'Petition Engine')
        doc.core_properties.subject = metadata.get('subject', '')

    # Processar conteúdo
    lines = content.split('\n')
    current_paragraph = []
    word_count = 0

    for line in lines:
        stripped = line.strip()

        # Page break
        if stripped == '---':
            if current_paragraph:
                word_count += flush_paragraph(doc, current_paragraph)
                current_paragraph = []
            doc.add_page_break()
            continue

        # Heading 1
        if stripped.startswith('# ') and not stripped.startswith('## '):
            if current_paragraph:
                word_count += flush_paragraph(doc, current_paragraph)
                current_paragraph = []
            add_heading(doc, stripped[2:], level=1)
            continue

        # Heading 2
        if stripped.startswith('## ') and not stripped.startswith('### '):
            if current_paragraph:
                word_count += flush_paragraph(doc, current_paragraph)
                current_paragraph = []
            add_heading(doc, stripped[3:], level=2)
            continue

        # Heading 3
        if stripped.startswith('### '):
            if current_paragraph:
                word_count += flush_paragraph(doc, current_paragraph)
                current_paragraph = []
            add_heading(doc, stripped[4:], level=3)
            continue

        # Linha vazia = flush parágrafo
        if stripped == '':
            if current_paragraph:
                word_count += flush_paragraph(doc, current_paragraph)
                current_paragraph = []
            continue

        # Texto normal
        current_paragraph.append(stripped)

    # Flush último parágrafo
    if current_paragraph:
        word_count += flush_paragraph(doc, current_paragraph)

    # Salvar
    doc.save(output_path)

    # Contar páginas (estimativa)
    page_estimate = max(1, word_count // 250)  # ~250 palavras por página

    return {
        "status": "ok",
        "output": output_path,
        "word_count": word_count,
        "page_count_estimate": page_estimate,
        "size_bytes": os.path.getsize(output_path),
    }


def setup_default_styles(doc: Document):
    """Configura estilos padrão do documento."""
    style = doc.styles['Normal']
    font = style.font
    font.name = STYLES['font_family']
    font.size = STYLES['body_size']

    paragraph_format = style.paragraph_format
    paragraph_format.space_after = STYLES['paragraph_spacing_after']
    paragraph_format.line_spacing = STYLES['line_spacing']


def add_heading(doc: Document, text: str, level: int):
    """Adiciona heading formatado."""
    heading = doc.add_heading(level=level)
    run = heading.add_run(text.upper() if level == 1 else text)
    run.bold = True

    sizes = {1: STYLES['heading1_size'], 2: STYLES['heading2_size'], 3: STYLES['heading3_size']}
    run.font.size = sizes.get(level, STYLES['body_size'])
    run.font.color.rgb = RGBColor(0, 0, 0)


def flush_paragraph(doc: Document, lines: list) -> int:
    """Cria parágrafo com formatação inline (bold, italic)."""
    text = ' '.join(lines)
    para = doc.add_paragraph()
    para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    word_count = len(text.split())

    # Parse inline formatting
    parts = re.split(r'(\*\*.*?\*\*|\*.*?\*)', text)

    for part in parts:
        if part.startswith('**') and part.endswith('**'):
            run = para.add_run(part[2:-2])
            run.bold = True
        elif part.startswith('*') and part.endswith('*'):
            run = para.add_run(part[1:-1])
            run.italic = True
        else:
            para.add_run(part)

    return word_count


# CLI
if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(json.dumps({
            "error": "Uso: generate_docx.py <content_file> <output.docx> [template.docx] [metadata_json]"
        }))
        sys.exit(1)

    content_file = sys.argv[1]
    output_path = sys.argv[2]
    template = sys.argv[3] if len(sys.argv) > 3 else None
    metadata = json.loads(sys.argv[4]) if len(sys.argv) > 4 else None

    with open(content_file, 'r', encoding='utf-8') as f:
        content = f.read()

    result = generate_docx(content, output_path, template, metadata)
    print(json.dumps(result, indent=2))
```

### 4. `scripts/extract_pdf.py`

Extrai texto de PDFs (usado pelo Extrator e Quality Agent).

```python
#!/usr/bin/env python3
"""
Petition Engine — PDF Text Extractor
Extrai texto de PDFs usando PyMuPDF (mais rápido) com fallback para pdfplumber.
"""

import sys
import json
import fitz  # PyMuPDF


def extract_text(pdf_path: str, max_pages: int = 0) -> dict:
    """
    Extrai texto de um PDF.

    Args:
        pdf_path: Caminho do PDF
        max_pages: Limite de páginas (0 = todas)

    Returns:
        dict com texto extraído e metadados
    """
    try:
        doc = fitz.open(pdf_path)
        total_pages = len(doc)
        pages_to_read = total_pages if max_pages == 0 else min(max_pages, total_pages)

        pages = []
        full_text = []

        for i in range(pages_to_read):
            page = doc[i]
            text = page.get_text()
            pages.append({
                "page": i + 1,
                "text": text,
                "char_count": len(text),
            })
            full_text.append(text)

        doc.close()

        combined = '\n\n'.join(full_text)

        return {
            "status": "ok",
            "path": pdf_path,
            "total_pages": total_pages,
            "pages_read": pages_to_read,
            "total_chars": len(combined),
            "total_words": len(combined.split()),
            "text": combined,
            "pages": pages,
        }
    except Exception as e:
        return {"status": "error", "error": str(e), "path": pdf_path}


# CLI
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Uso: extract_pdf.py <pdf_path> [max_pages]"}))
        sys.exit(1)

    pdf_path = sys.argv[1]
    max_pages = int(sys.argv[2]) if len(sys.argv) > 2 else 0

    result = extract_text(pdf_path, max_pages)
    print(json.dumps(result, indent=2, ensure_ascii=False))
```

## Node.js Runner

```typescript
// src/lib/python-runner.ts

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const SCRIPTS_DIR = path.join(process.cwd(), 'scripts');
const PYTHON = 'python3';

interface PythonResult {
  stdout: string;
  stderr: string;
  parsed: any;
}

/**
 * Executa um script Python e retorna o resultado JSON parseado
 */
export async function runPython(script: string, args: string[] = []): Promise<any> {
  const scriptPath = path.join(SCRIPTS_DIR, script);
  const escapedArgs = args.map(a => `"${a.replace(/"/g, '\\"')}"`).join(' ');
  const command = `${PYTHON} "${scriptPath}" ${escapedArgs}`;

  try {
    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 50 * 1024 * 1024, // 50MB buffer
      timeout: 120000, // 2 minutos
    });

    if (stderr) {
      console.warn(`[Python stderr] ${script}:`, stderr);
    }

    try {
      return JSON.parse(stdout);
    } catch {
      return stdout; // retorna texto se não for JSON
    }
  } catch (error: any) {
    throw new Error(`Python script failed: ${script}\n${error.stderr || error.message}`);
  }
}

/**
 * Gera thumbnails de evidências
 */
export async function generateThumbnails(
  inputFolder: string,
  outputDir: string,
  maxPages: number = 1
): Promise<any[]> {
  return runPython('thumbnail_generator.py', [inputFolder, outputDir, maxPages.toString()]);
}

/**
 * Cria relatório fotográfico
 */
export async function createPhotographicReport(
  thumbnails: Array<{ path: string; caption: string; exhibit_number: string }>,
  outputPath: string,
  clientName: string,
  visaType: string
): Promise<any> {
  return runPython('docx_inserter.py', [
    'report',
    JSON.stringify(thumbnails),
    outputPath,
    clientName,
    visaType,
  ]);
}

/**
 * Gera DOCX a partir de conteúdo
 */
export async function generateDocx(
  contentFilePath: string,
  outputPath: string,
  templatePath?: string,
  metadata?: Record<string, string>
): Promise<any> {
  const args = [contentFilePath, outputPath];
  if (templatePath) args.push(templatePath);
  if (metadata) args.push(JSON.stringify(metadata));
  return runPython('generate_docx.py', args);
}

/**
 * Extrai texto de PDF
 */
export async function extractPdfText(pdfPath: string, maxPages: number = 0): Promise<any> {
  return runPython('extract_pdf.py', [pdfPath, maxPages.toString()]);
}
```

## Templates DOCX

Diretório `templates/` contém DOCX pré-formatados que servem como base:

```
templates/
├── cover_letter_base.docx          # Cabeçalho, rodapé, estilos padrão
├── resume_base.docx                # Layout de résumé profissional
├── business_plan_base.docx         # Template com TOC, numeração
├── photographic_report_base.docx   # Relatório fotográfico com capa
├── satellite_letter_base.docx      # Carta em letterhead
└── strategy_report_base.docx       # Relatório de estratégia
```

Cada template tem:
- **Estilos definidos** (Heading 1-3, Normal, Caption, Quote)
- **Cabeçalho/rodapé** com placeholders (`{{CLIENT_NAME}}`, `{{VISA_TYPE}}`, `{{DATE}}`)
- **Margens e fontes** já configuradas (Times New Roman 12pt, 1" margins)
- **Numeração de página** no rodapé

O `generate_docx.py` pode usar esses templates como base ao invés de criar do zero.
