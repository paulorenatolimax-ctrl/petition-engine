#!/usr/bin/env python3
"""Extract text from PDF files."""
import sys
try:
    from PyPDF2 import PdfReader
except ImportError:
    print("[ERRO: PyPDF2 não instalado. Rode: pip3 install PyPDF2]")
    sys.exit(1)

def extract(path):
    try:
        reader = PdfReader(path)
        text = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text.append(t)
        return '\n\n'.join(text)
    except Exception as e:
        return f"[ERRO: {str(e)}]"

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Uso: python3 extract_pdf.py <caminho.pdf>")
        sys.exit(1)
    print(extract(sys.argv[1]))
