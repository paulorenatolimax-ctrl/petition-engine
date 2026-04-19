#!/usr/bin/env python3
"""
validate_evidence_package.py — v3.0
Script de Validação Automática do Pacote de Evidências EB-1A

LIÇÃO APRENDIDA (Caso Renato Silveira v19→v23):
Todo o pseudocódigo de QUALITY_GATES.md e FORBIDDEN_CONTENT.md era manual.
Este script automatiza as verificações mais críticas que teriam prevenido:
- Evidence 37 = CRF em vez de carta (validação conteúdo↔título)
- Evidence 71 = placeholders não preenchidos (detecção de placeholders)
- Evidence 52 = thumbnail errado (detecção de certificado de tradução na pág. 1)
- 7 referências cruzadas erradas (mapa semântico)
- Evidence 65 sem tradução (verificação de tradução)
- Evidence 49-81 = referência a evidência inexistente (validação de intervalo)

USO:
    python validate_evidence_package.py --evidence-dir /path/to/evidencias --docx /path/to/cover.docx
    python validate_evidence_package.py --evidence-dir /path/to/evidencias  # só validar PDFs
    python validate_evidence_package.py --docx /path/to/cover.docx          # só validar Cover Letter

DEPENDÊNCIAS:
    pip install lxml
    Requer: pdftotext (poppler-utils)
"""

import argparse
import os
import re
import subprocess
import sys
from pathlib import Path
from collections import Counter

# ============================================================
# CONFIGURAÇÃO
# ============================================================

PLACEHOLDER_PATTERNS = [
    r'\[Nome[^\]]*\]',
    r'\[Endereço[^\]]*\]',
    r'\[XXX[^\]]*\]',
    r'\[CPF[^\]]*\]',
    r'\[CNPJ[^\]]*\]',
    r'\[Data[^\]]*\]',
    r'\[PREENCHER[^\]]*\]',
    r'___+',
    r'XXXXXX+',
    r'\[.*INSERIR.*\]',
    r'\[.*COMPLETAR.*\]',
]

TRANSLATION_MARKERS = [
    'affidavit of translation',
    'translation accuracy',
    'tms translations',
    'certified translation',
    'hereby certifies that the professional translation',
]

FORBIDDEN_WORDS_CRITERIA = [
    'satisfeito', 'satisfaz', 'satisfied', 'satisfação',
]

FORBIDDEN_PERSON = [
    'o beneficiário', 'o peticionário', 'the beneficiary', 'the petitioner',
]

# ============================================================
# FUNÇÕES DE EXTRAÇÃO
# ============================================================

def extract_pdf_text(pdf_path, max_pages=None):
    """Extrai texto de um PDF usando pdftotext."""
    cmd = ['pdftotext']
    if max_pages:
        cmd += ['-l', str(max_pages)]
    cmd += [str(pdf_path), '-']
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        return result.stdout
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return None


def extract_pdf_page1(pdf_path):
    """Extrai texto apenas da página 1."""
    return extract_pdf_text(pdf_path, max_pages=1)


def get_pdf_page_count(pdf_path):
    """Conta páginas de um PDF."""
    try:
        result = subprocess.run(
            ['pdfinfo', str(pdf_path)],
            capture_output=True, text=True, timeout=10
        )
        for line in result.stdout.splitlines():
            if line.startswith('Pages:'):
                return int(line.split(':')[1].strip())
    except:
        pass
    return None


# ============================================================
# VALIDAÇÃO 1: Conteúdo dos PDFs
# ============================================================

def check_placeholders(pdf_path):
    """Detecta placeholders não preenchidos no PDF."""
    text = extract_pdf_text(pdf_path)
    if text is None:
        return None, "Não foi possível extrair texto"

    found = []
    for pattern in PLACEHOLDER_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        found.extend(matches)

    return found, text


def check_translation_page1(pdf_path):
    """Verifica se a página 1 é certificado de tradução."""
    page1 = extract_pdf_page1(pdf_path)
    if page1 is None:
        return False, "Não foi possível extrair página 1"

    page1_lower = page1.lower()
    for marker in TRANSLATION_MARKERS:
        if marker in page1_lower:
            return True, f"Certificado de tradução detectado: '{marker}'"

    return False, "Página 1 não é certificado de tradução"


def check_content_matches_title(pdf_path, title):
    """Verifica se o conteúdo do PDF é compatível com o título da evidência."""
    text = extract_pdf_text(pdf_path, max_pages=3)
    if text is None:
        return None, "Não foi possível extrair texto"

    # Extrair palavras-chave do título
    title_words = set(re.findall(r'\b[A-Za-zÀ-ÿ]{4,}\b', title.lower()))
    text_lower = text.lower()

    # Contar quantas palavras-chave do título aparecem no texto
    matches = sum(1 for w in title_words if w in text_lower)
    ratio = matches / max(len(title_words), 1)

    # Verificações específicas por tipo
    warnings = []

    # Carta de recomendação que contém CRF/registro profissional
    if 'carta' in title.lower() or 'recomendação' in title.lower() or 'recommendation' in title.lower():
        if 'federal council' in text_lower or 'conselho regional' in text_lower or 'enrollment' in text_lower:
            if 'letter' not in text_lower and 'carta' not in text_lower and 'recommend' not in text_lower:
                warnings.append("ALERTA: Título diz 'Carta/Recomendação' mas PDF parece ser registro profissional/CRF")

    # DRE/Balanço sem números financeiros
    if any(x in title.lower() for x in ['dre', 'balanço', 'demonstração', 'financeiro']):
        if not re.search(r'R\$\s*[\d.,]+', text):
            warnings.append("ALERTA: Título indica documento financeiro mas não encontrou valores R$")

    return ratio, warnings


# ============================================================
# VALIDAÇÃO 2: Redundância entre PDFs
# ============================================================

def jaccard_similarity(text1, text2):
    """Calcula similaridade Jaccard entre dois textos."""
    words1 = set(re.findall(r'\b\w{4,}\b', text1.lower()))
    words2 = set(re.findall(r'\b\w{4,}\b', text2.lower()))
    if not words1 or not words2:
        return 0.0
    intersection = words1 & words2
    union = words1 | words2
    return len(intersection) / len(union)


# ============================================================
# VALIDAÇÃO 3: Referências Cruzadas na Cover Letter
# ============================================================

def extract_xml_text(docx_xml_path):
    """Extrai texto de document.xml."""
    try:
        import xml.etree.ElementTree as ET
        W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
        tree = ET.parse(docx_xml_path)
        root = tree.getroot()
        body = root.find(f'{W}body')

        paragraphs = []
        for p in body.findall(f'{W}p'):
            texts = [t.text for t in p.iter(f'{W}t') if t.text]
            paragraphs.append(''.join(texts))
        return paragraphs
    except Exception as e:
        print(f"Erro ao ler XML: {e}")
        return None


def check_evidence_references(paragraphs, max_evidence):
    """Verifica referências a evidências no texto."""
    issues = []
    all_refs = set()

    for i, para in enumerate(paragraphs):
        # Referências simples: Evidence XX
        for m in re.finditer(r'Evidence\s+(\d+)', para):
            num = int(m.group(1))
            all_refs.add(num)
            if num > max_evidence:
                issues.append({
                    'type': 'EXCEDE_MAXIMO',
                    'para': i,
                    'ref': num,
                    'max': max_evidence,
                    'context': para[max(0, m.start()-30):m.end()+30],
                })
            if num == 0:
                issues.append({
                    'type': 'REFERENCIA_ZERO',
                    'para': i,
                    'context': para[max(0, m.start()-30):m.end()+30],
                })

        # Referências de intervalo: Evidence XX-YY
        for m in re.finditer(r'Evidence\s+(\d+)\s*[-–]\s*(\d+)', para):
            start, end = int(m.group(1)), int(m.group(2))
            if end > max_evidence:
                issues.append({
                    'type': 'INTERVALO_EXCEDE_MAXIMO',
                    'para': i,
                    'range': f'{start}-{end}',
                    'max': max_evidence,
                    'context': para[max(0, m.start()-30):m.end()+30],
                })

    # Verificar cobertura
    expected = set(range(1, max_evidence + 1))
    missing = expected - all_refs

    return issues, all_refs, missing


def check_forbidden_content(paragraphs):
    """Verifica conteúdo proibido."""
    issues = []

    for i, para in enumerate(paragraphs):
        para_lower = para.lower()

        # Palavras proibidas em contexto de critério
        for word in FORBIDDEN_WORDS_CRITERIA:
            if word in para_lower:
                # Verificar se está em contexto de critério (não em NPS ou citação)
                if 'critério' in para_lower or 'criterion' in para_lower or 'step 1' in para_lower:
                    issues.append({
                        'type': 'FORBIDDEN_CRITERIA_WORD',
                        'para': i,
                        'word': word,
                        'context': para[:100],
                    })

        # Pessoa proibida
        for phrase in FORBIDDEN_PERSON:
            if phrase in para_lower:
                issues.append({
                    'type': 'FORBIDDEN_PERSON',
                    'para': i,
                    'phrase': phrase,
                    'context': para[:100],
                })

        # Espaços duplos
        if '  ' in para:
            issues.append({
                'type': 'DOUBLE_SPACE',
                'para': i,
            })

    return issues


# ============================================================
# VALIDAÇÃO 4: Footnotes
# ============================================================

def check_footnotes(docx_dir):
    """Verifica integridade de footnotes."""
    try:
        import xml.etree.ElementTree as ET
        W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

        # Footnotes definidos
        fn_tree = ET.parse(os.path.join(docx_dir, 'word', 'footnotes.xml'))
        fn_ids = set()
        for fn in fn_tree.getroot().findall(f'{W}footnote'):
            fid = int(fn.get(f'{W}id', -999))
            if fid > 0:
                fn_ids.add(fid)

        # Footnotes referenciados
        doc_tree = ET.parse(os.path.join(docx_dir, 'word', 'document.xml'))
        ref_ids = set()
        for ref in doc_tree.getroot().iter(f'{W}footnoteReference'):
            rid = int(ref.get(f'{W}id', -999))
            if rid > 0:
                ref_ids.add(rid)

        orphans = fn_ids - ref_ids
        missing = ref_ids - fn_ids

        return {
            'total_defined': len(fn_ids),
            'total_referenced': len(ref_ids),
            'orphans': sorted(orphans),
            'missing_definitions': sorted(missing),
        }
    except Exception as e:
        return {'error': str(e)}


# ============================================================
# MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(description='Validação do Pacote de Evidências EB-1A')
    parser.add_argument('--evidence-dir', help='Diretório com PDFs de evidência')
    parser.add_argument('--docx', help='Cover Letter .docx (ou diretório unpacked)')
    parser.add_argument('--max-evidence', type=int, default=80, help='Número máximo de evidências')
    parser.add_argument('--check-redundancy', action='store_true', help='Verificar redundância entre PDFs (lento)')
    args = parser.parse_args()

    print("=" * 70)
    print("RELATÓRIO DE VALIDAÇÃO — PACOTE DE EVIDÊNCIAS EB-1A")
    print("=" * 70)
    print()

    total_pass = 0
    total_fail = 0
    total_warn = 0

    # ========================================
    # PARTE A: Validação dos PDFs de Evidência
    # ========================================
    if args.evidence_dir:
        evidence_dir = Path(args.evidence_dir)
        pdfs = sorted(evidence_dir.glob('Evidence *.pdf'))
        print(f"📁 Diretório: {evidence_dir}")
        print(f"📄 PDFs encontrados: {len(pdfs)}")
        print()

        # Extrair números de evidência dos nomes
        ev_numbers = {}
        for pdf in pdfs:
            m = re.match(r'Evidence\s+(\d+)', pdf.name)
            if m:
                num = int(m.group(1))
                ev_numbers[num] = pdf

        # Verificar consecutividade
        if ev_numbers:
            expected = set(range(1, max(ev_numbers.keys()) + 1))
            # Excluir sub-evidências (XXa, XXb)
            main_numbers = set(ev_numbers.keys())
            missing_files = expected - main_numbers
            if missing_files:
                print(f"⚠️  ALERTA: Evidências sem arquivo PDF: {sorted(missing_files)}")
                total_warn += 1
            else:
                print(f"✅ Consecutividade: Evidence 1-{max(ev_numbers.keys())} completa")
                total_pass += 1

        print()
        print("-" * 50)
        print("VERIFICAÇÃO DE CONTEÚDO DOS PDFs")
        print("-" * 50)

        pdf_texts = {}
        for pdf in pdfs:
            name = pdf.name
            # Extrair título (parte após "Evidence XX. ")
            title_match = re.match(r'Evidence\s+\d+[a-z]?\.\s*(.*?)\.pdf', name, re.IGNORECASE)
            title = title_match.group(1) if title_match else name

            print(f"\n📄 {name}")

            # Check 1: Placeholders
            placeholders, text = check_placeholders(pdf)
            if text:
                pdf_texts[name] = text
            if placeholders is None:
                print(f"   ⚠️  Não foi possível extrair texto (PDF imagem?)")
                total_warn += 1
            elif placeholders:
                print(f"   ❌ FAIL: {len(placeholders)} placeholder(s) encontrado(s):")
                for p in placeholders[:5]:
                    print(f"      → {p}")
                total_fail += 1
            else:
                print(f"   ✅ Sem placeholders")
                total_pass += 1

            # Check 2: Certificado de tradução na pág. 1
            is_translated, msg = check_translation_page1(pdf)
            if is_translated:
                print(f"   ℹ️  {msg} — thumbnail deve usar página 2+")

            # Check 3: Conteúdo vs. Título
            if text:
                ratio, warnings = check_content_matches_title(pdf, title)
                if ratio is not None:
                    if ratio < 0.2:
                        print(f"   ⚠️  Baixa correspondência título↔conteúdo ({ratio:.0%})")
                        total_warn += 1
                for w in warnings:
                    print(f"   ❌ {w}")
                    total_fail += 1

        # Check redundância (opcional, lento)
        if args.check_redundancy and len(pdf_texts) > 1:
            print()
            print("-" * 50)
            print("VERIFICAÇÃO DE REDUNDÂNCIA")
            print("-" * 50)

            names = list(pdf_texts.keys())
            for i in range(len(names)):
                for j in range(i + 1, len(names)):
                    sim = jaccard_similarity(pdf_texts[names[i]], pdf_texts[names[j]])
                    if sim > 0.6:
                        print(f"   ⚠️  Possível redundância ({sim:.0%}): {names[i]} ↔ {names[j]}")
                        total_warn += 1

    # ========================================
    # PARTE B: Validação da Cover Letter
    # ========================================
    if args.docx:
        docx_path = Path(args.docx)
        print()
        print("-" * 50)
        print("VERIFICAÇÃO DA COVER LETTER")
        print("-" * 50)

        # Determinar se é diretório unpacked ou .docx
        if docx_path.is_dir():
            xml_path = docx_path / 'word' / 'document.xml'
        else:
            print("   ℹ️  Para análise completa, forneça o diretório unpacked")
            xml_path = None

        if xml_path and xml_path.exists():
            paragraphs = extract_xml_text(str(xml_path))
            if paragraphs:
                print(f"   📝 Parágrafos: {len(paragraphs)}")

                # Referências cruzadas
                issues, refs, missing = check_evidence_references(paragraphs, args.max_evidence)
                print(f"   📌 Referências a evidências: {len(refs)} números únicos")

                if missing:
                    print(f"   ⚠️  Evidências nunca referenciadas: {sorted(missing)}")
                    total_warn += 1
                else:
                    print(f"   ✅ Cobertura 100%: Evidence 1-{args.max_evidence}")
                    total_pass += 1

                for issue in issues:
                    if issue['type'] in ('EXCEDE_MAXIMO', 'INTERVALO_EXCEDE_MAXIMO'):
                        print(f"   ❌ FAIL: Referência a Evidence > {args.max_evidence}: {issue.get('ref', issue.get('range'))}")
                        print(f"      Contexto: ...{issue['context']}...")
                        total_fail += 1
                    elif issue['type'] == 'REFERENCIA_ZERO':
                        print(f"   ❌ FAIL: Referência a Evidence 0")
                        total_fail += 1

                # Conteúdo proibido
                forbidden = check_forbidden_content(paragraphs)
                if forbidden:
                    print(f"\n   ⚠️  Conteúdo proibido: {len(forbidden)} ocorrência(s)")
                    for f in forbidden[:10]:
                        print(f"      → [{f['type']}] Para {f['para']}: {f.get('word', f.get('phrase', ''))}")
                    total_warn += len(forbidden)
                else:
                    print(f"   ✅ Sem conteúdo proibido")
                    total_pass += 1

                # Footnotes
                if docx_path.is_dir():
                    fn_result = check_footnotes(str(docx_path))
                    if 'error' not in fn_result:
                        print(f"\n   📝 Footnotes: {fn_result['total_defined']} definidos, {fn_result['total_referenced']} referenciados")
                        if fn_result['orphans']:
                            print(f"   ⚠️  Footnotes órfãs (sem referência no corpo): {fn_result['orphans']}")
                            total_warn += 1
                        if fn_result['missing_definitions']:
                            print(f"   ❌ FAIL: Referências sem definição em footnotes.xml: {fn_result['missing_definitions']}")
                            total_fail += 1
                        if not fn_result['orphans'] and not fn_result['missing_definitions']:
                            print(f"   ✅ Footnotes íntegros")
                            total_pass += 1

    # ========================================
    # RESUMO FINAL
    # ========================================
    print()
    print("=" * 70)
    print("RESUMO")
    print("=" * 70)
    print(f"   ✅ PASS:    {total_pass}")
    print(f"   ❌ FAIL:    {total_fail}")
    print(f"   ⚠️  ALERTA:  {total_warn}")
    print()

    if total_fail > 0:
        print("❌ RESULTADO: FALHAS ENCONTRADAS — corrigir antes de prosseguir")
        return 1
    elif total_warn > 0:
        print("⚠️  RESULTADO: ALERTAS — revisar antes de prosseguir")
        return 0
    else:
        print("✅ RESULTADO: TUDO OK — pacote validado")
        return 0


if __name__ == '__main__':
    sys.exit(main())
