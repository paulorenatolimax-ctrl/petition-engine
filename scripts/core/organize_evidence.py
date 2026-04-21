#!/usr/bin/env python3
"""
Evidence Organizer Agent — Phase -1 of the EB-1A/EB-2 NIW Pipeline.

Transforms a messy client folder into an organized, numbered evidence drive.
Produces evidence_inventory.json + thumbnail_map.json ready for the pipeline.

Usage:
    python3 organize_evidence.py /path/to/client/folder
    python3 organize_evidence.py /path/to/client/folder --dry-run
    python3 organize_evidence.py /path/to/client/folder --force

Exit codes:
    0 = success
    1 = error
"""

import argparse
import hashlib
import json
import os
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF not installed. Run: pip install PyMuPDF")
    sys.exit(1)

# ═══════════════════════════════════════════════════════════════
# CONSTANTS
# ═══════════════════════════════════════════════════════════════

EXCLUDED_DIRS_EXACT = {
    '_Forjado por Petition Engine', 'phases', 'Evidence', 'Evidências',
    '__MACOSX', '.git', 'node_modules',
}
# Partial match — if any of these substrings appear in a folder name, skip it
EXCLUDED_DIRS_PARTIAL = [
    'qualidade', 'confidencial', 'documentos pessoais', 'pessoais',
    'tradução', 'traducao', 'cover letter', 'resumé', 'resume',
    'rascunho', 'versões anteriores', '_automação', '_met e dec',
    'espelho de impressão', 'espelho', 'aprovações', 'aprovacoes',
    'processo anterior', 'eb-2', 'eb2',
]
EXCLUDED_FILES = {'.DS_Store', 'Thumbs.db', 'desktop.ini'}

# ONLY these extensions are valid evidence. DOCX is NEVER evidence
# (signed documents are always PDF; DOCX = unsigned draft)
VALID_EXTENSIONS = {'.pdf', '.png', '.jpg', '.jpeg', '.tiff'}

# Folders that ARE evidence sources (whitelist approach)
EVIDENCE_SOURCE_FOLDERS = {
    'cartas assinadas', 'signed', 'assinadas',
    'critério 1', 'critério 2', 'critério 3', 'critério 4', 'critério 5',
    'critério 6', 'critério 7', 'critério 8', 'critério 9', 'critério 10',
    'criterion 1', 'criterion 2', 'criterion 3', 'criterion 4', 'criterion 5',
    'criterion 6', 'criterion 7', 'criterion 8', 'criterion 9', 'criterion 10',
    'artigos', 'publicações', 'publications', 'articles',
    'matérias', 'media', 'press',
    'prêmios', 'awards',
    'patentes', 'patents', 'marcas', 'trademarks', 'inpi',
    'traduzidos', 'translated',
    'ebook', 'livro', 'book',
    'declarações de aceite',
    # Generic evidence containers
    'cartas', '1. carregue aqui seus documentos', 'carregue aqui',
    'formação acadêmica', 'formação', 'formacao',
    'ebook', 'livros',
}

LETTER_KEYWORDS = {
    'carta', 'letter', 'recomendação', 'recommendation', 'apoio', 'support',
    'testemunho', 'testimony', 'endorsement', 'reference',
}
SIGNED_FOLDER_KEYWORDS = {'assinadas', 'signed', 'cartas assinadas'}

EVIDENCE_TYPE_SIGNALS = {
    'recommendation_letter': ['carta', 'letter', 'recomendação', 'recommendation', 'apoio', 'support', 'endorsement'],
    'academic_credential': ['diploma', 'histórico', 'transcript', 'degree', 'graduação', 'mestrado', 'doutorado'],
    'certification': ['certificado', 'certificate', 'credencial', 'licença', 'license'],
    'publication_book': ['book', 'livro', 'ebook', 'isbn', 'capítulo', 'chapter'],
    'publication_article': ['artigo', 'article', 'doi', 'journal', 'publicação', 'paper'],
    'media_article': ['matéria', 'news', 'reportagem', 'mídia', 'imprensa', 'press'],
    'publication_acceptance': ['aceite', 'acceptance', 'aprovação'],
    'employment_verification': ['rh', 'empregador', 'hr', 'declaração', 'employment', 'verificação'],
    'business_plan': ['business plan', 'plano de negócios', 'bp_'],
    'financial_document': ['dre', 'irpf', 'tax', 'balanço', 'financial', 'imposto'],
    'passport_visa': ['passaporte', 'passport', 'visto', 'visa', 'i-94', 'i-20'],
    'translation': ['translated', 'tradução', 'translation', 'traduzido', 'tr_'],
    'award': ['prêmio', 'award', 'recognition', 'menção', 'honra', 'moção'],
    'photo_evidence': ['foto', 'photo', 'imagem', 'image'],
    'methodology': ['metodologia', 'methodology', 'met_'],
    'declaration_intentions': ['declaração de intenções', 'declaration of intentions', 'dec_'],
}

CRITERIA_MAP = {
    'C1': ['award', 'prêmio', 'recognition', 'menção', 'critério 1'],
    'C2': ['membership', 'associação', 'membro', 'critério 2'],
    'C3': ['media', 'matéria', 'publicado sobre', 'critério 3'],
    'C4': ['judging', 'banca', 'reviewer', 'peer review', 'critério 4'],
    'C5': ['original contribution', 'contribuição', 'critério 5'],
    'C6': ['scholarly', 'artigo', 'article', 'journal', 'critério 6'],
    'C7': ['exhibition', 'exposição', 'apresentação', 'critério 7'],
    'C8': ['leading', 'liderança', 'leadership', 'critical role', 'critério 8'],
    'C9': ['salary', 'remuneração', 'high compensation', 'critério 9'],
    'C10': ['commercial', 'sucesso comercial', 'critério 10'],
}


# ═══════════════════════════════════════════════════════════════
# EVIDENCE ORGANIZER
# ═══════════════════════════════════════════════════════════════

class EvidenceOrganizer:
    def __init__(self, client_folder: str, output_subfolder: str = 'Evidence', dry_run: bool = False):
        self.client_folder = Path(client_folder).resolve()
        self.output_dir = self.client_folder / output_subfolder
        self.dry_run = dry_run
        self.all_files: List[dict] = []
        self.valid: List[dict] = []
        self.rejected: List[dict] = []
        self.log: List[str] = []

    def _log(self, msg: str):
        self.log.append(msg)
        print(msg)

    # ─── Step 1: Scan ───

    def scan_all_files(self) -> List[dict]:
        """Recursively discover all files."""
        files = []
        for root, dirs, filenames in os.walk(self.client_folder):
            # Skip excluded directories (exact + partial match)
            dirs[:] = [d for d in dirs
                       if d not in EXCLUDED_DIRS_EXACT
                       and not any(exc in d.lower() for exc in EXCLUDED_DIRS_PARTIAL)]

            rel_root = Path(root).relative_to(self.client_folder)
            for fname in filenames:
                if fname in EXCLUDED_FILES:
                    continue
                filepath = Path(root) / fname
                ext = filepath.suffix.lower()

                # Fix .pdf.pdf
                fixed_name = fname
                if fname.lower().endswith('.pdf.pdf'):
                    fixed_name = fname[:-4]  # remove last .pdf
                    ext = '.pdf'
                elif fname.lower().endswith('.docx.docx'):
                    fixed_name = fname[:-5]
                    ext = '.docx'

                # Remove (1), (2) suffixes
                clean_name = re.sub(r'\s*\(\d+\)\s*(?=\.\w+$)', '', fixed_name)

                files.append({
                    'original_path': str(filepath),
                    'original_name': fname,
                    'fixed_name': fixed_name,
                    'clean_name': clean_name,
                    'extension': ext,
                    'size_bytes': filepath.stat().st_size if filepath.exists() else 0,
                    'modified_time': filepath.stat().st_mtime if filepath.exists() else 0,
                    'parent_folder': str(rel_root),
                    'parent_name': Path(root).name.lower(),
                })

        self._log(f"📂 Scanned: {len(files)} files in {self.client_folder}")
        return files

    # ─── Step 2: Classify ───

    def classify_file(self, f: dict) -> str:
        """Determine evidence type."""
        name_lower = f['clean_name'].lower()
        parent_lower = f['parent_folder'].lower()
        combined = name_lower + ' ' + parent_lower

        for etype, keywords in EVIDENCE_TYPE_SIGNALS.items():
            if any(kw in combined for kw in keywords):
                return etype

        return 'supporting_document'

    def map_criteria(self, f: dict) -> List[str]:
        """Map file to EB-1A criteria."""
        combined = (f['clean_name'] + ' ' + f['parent_folder']).lower()
        criteria = []
        for crit, keywords in CRITERIA_MAP.items():
            if any(kw in combined for kw in keywords):
                criteria.append(crit)
        return criteria if criteria else ['unclassified']

    # ─── Step 3: Filter ───

    # NEVER EVIDENCE — explicit exclusion patterns (EB-1A domain knowledge)
    NEVER_EVIDENCE_KEYWORDS = [
        # Personal identity documents
        'passaporte', 'passport', 'i-94', 'i-20', 'i-539', 'visa', 'visto',
        'work permit', 'workpermit', 'ead', 'travel document',
        'birth certificate', 'certidão de nascimento', 'vacinação', 'vaccination',
        'marriage certificate', 'certidão de casamento',
        # Internal/admin documents
        'auditoria', 'audit', 'consultora', 'consultant notes',
        'aprovação', 'aprovacao', 'aprovado', 'comentários', 'comentarios',
        'roundcube', 'webmail', 'whatsapp', 'email', 'meeting', 'zoom',
        'formulário', 'form', 'modelos de documentos', 'template',
        'evidências documentais necessárias', 'guia', 'checklist',
        'contexto', 'plano estratégico', 'plano_estrategico',
        'anteprojeto', 'projeto base', 'projeto-base',
        'scope', 'escopo',
        # Immigration forms (not evidence, they ARE the petition)
        'advanced degree', 'i-140', 'i-485', 'g-28', 'checklist',
        'criminal', 'antecedentes',
        # Personal photos not tied to criteria
        'documentos pessoais',
    ]

    # NEVER EVIDENCE — folder-level exclusions
    NEVER_EVIDENCE_FOLDERS = [
        'documentos pessoais', '1.documentos pessoais', 'pessoais',
        'passaporte', 'qualidade - confidencial', 'qualidade',
        'tradução', 'traducao',  # translation folder has certificates of translation, not evidence
    ]

    def is_never_evidence(self, f: dict) -> Optional[str]:
        """Returns rejection reason if file should NEVER be evidence, None if OK."""
        combined = (f['clean_name'] + ' ' + f['parent_folder']).lower()

        # Check explicit keywords
        for kw in self.NEVER_EVIDENCE_KEYWORDS:
            if kw in combined:
                return f'not_evidence_{kw}'

        # Check folder-level exclusions
        for folder_kw in self.NEVER_EVIDENCE_FOLDERS:
            if folder_kw in f['parent_name']:
                return f'excluded_folder_{folder_kw}'

        return None

    def is_letter(self, f: dict) -> bool:
        """Check if file is a recommendation/support letter."""
        combined = (f['clean_name'] + ' ' + f['parent_folder']).lower()
        return any(kw in combined for kw in LETTER_KEYWORDS)

    def is_in_signed_folder(self, f: dict) -> bool:
        """Check if file is in a folder for signed documents."""
        return any(kw in f['parent_name'] for kw in SIGNED_FOLDER_KEYWORDS)

    def has_signature_indicators(self, pdf_path: str) -> bool:
        """Check if a PDF appears to have a signature (scanned or digital)."""
        try:
            doc = fitz.open(pdf_path)
            if doc.page_count == 0:
                doc.close()
                return False
            # Check last page for signature indicators
            last_page = doc[-1]
            text = last_page.get_text().lower()
            doc.close()
            sig_indicators = ['sincerely', 'atenciosamente', 'signature', 'assinatura',
                              'signed', 'assinado', 'respectfully']
            return any(ind in text for ind in sig_indicators)
        except:
            return True  # If can't read, don't reject on this basis

    def is_older_version(self, f: dict, all_files: List[dict]) -> bool:
        """Check if there's a newer version of the same document (V1 < V2 < VF)."""
        name = f['clean_name'].lower()
        # Extract version info
        version_match = re.search(r'v(\d+)|versão\s*(\d+)|version\s*(\d+)', name)
        if not version_match:
            return False

        current_v = int(next(g for g in version_match.groups() if g))
        base_name = re.sub(r'v\d+[_\s-]*|versão\s*\d+|version\s*\d+', '', name).strip()

        # Check if there's a higher version or a VF
        for other in all_files:
            other_name = other['clean_name'].lower()
            if other['original_path'] == f['original_path']:
                continue
            other_base = re.sub(r'v\d+[_\s-]*|versão\s*\d+|version\s*\d+|vf[_\s-]*', '', other_name).strip()

            # Same base document?
            if base_name[:20] in other_base or other_base[:20] in base_name:
                # VF (versão final) always wins
                if 'vf' in other_name or 'versão final' in other_name or 'final' in other_name:
                    return True
                # Higher version number wins
                other_v_match = re.search(r'v(\d+)', other_name)
                if other_v_match:
                    other_v = int(other_v_match.group(1))
                    if other_v > current_v:
                        return True
        return False

    def compute_hash(self, filepath: str) -> str:
        """SHA-256 hash."""
        h = hashlib.sha256()
        try:
            with open(filepath, 'rb') as fh:
                for chunk in iter(lambda: fh.read(8192), b''):
                    h.update(chunk)
        except:
            return ''
        return h.hexdigest()

    def detect_translation_cover(self, pdf_path: str) -> bool:
        """Check if page 1 is a translation certificate."""
        try:
            doc = fitz.open(pdf_path)
            if doc.page_count < 2:
                doc.close()
                return False
            text = doc[0].get_text().lower()
            doc.close()
            return ('certif' in text and 'translat' in text) or ('certifico' in text and 'tradução' in text)
        except:
            return False

    def get_page_count(self, pdf_path: str) -> int:
        """Get PDF page count."""
        try:
            doc = fitz.open(pdf_path)
            count = doc.page_count
            doc.close()
            return count
        except:
            return 0

    def _is_in_evidence_source_folder(self, f: dict) -> bool:
        """WHITELIST: check if file is in a folder that contains real evidence."""
        full_path_lower = f['parent_folder'].lower()

        # Check full path for evidence source keywords
        for src in EVIDENCE_SOURCE_FOLDERS:
            if src in full_path_lower:
                return True

        # Also check each individual folder component
        for part in Path(f['parent_folder']).parts:
            part_lower = part.lower()
            # Direct match
            if part_lower in EVIDENCE_SOURCE_FOLDERS:
                return True
            # Partial match (e.g., "Critério 5 - Criação original" matches "critério 5")
            for src in EVIDENCE_SOURCE_FOLDERS:
                if src in part_lower:
                    return True
            # Generic "Critério N" pattern
            if re.match(r'critério\s+\d+', part_lower) or re.match(r'criterion\s+\d+', part_lower):
                return True
            # CARTAS folder (signed letters)
            if part_lower == 'cartas':
                return True

        return False

    def filter_valid_evidence(self, files: List[dict]) -> Tuple[List[dict], List[dict]]:
        """WHITELIST approach: ONLY accept files from known evidence folders."""
        valid = []
        rejected = []
        seen_hashes: Dict[str, dict] = {}

        for f in files:
            ext = f['extension']
            fpath = f['original_path']

            # 1. ONLY valid extensions (PDF, images — NEVER DOCX)
            if ext not in VALID_EXTENSIONS:
                rejected.append({**f, 'reason': 'invalid_extension', 'details': f'{ext} — only PDF and images accepted as evidence'})
                continue

            # 2. Skip empty
            if f['size_bytes'] == 0:
                rejected.append({**f, 'reason': 'empty_file', 'details': '0 bytes'})
                continue

            # 3. WHITELIST — must be in a known evidence folder
            if not self._is_in_evidence_source_folder(f):
                # Exception: signed letters folder at root level
                if not self.is_in_signed_folder(f):
                    rejected.append({**f, 'reason': 'not_in_evidence_folder', 'details': f'Folder "{f["parent_folder"]}" is not a known evidence source'})
                    continue

            # 4. NEVER EVIDENCE — domain exclusions even inside evidence folders
            never_reason = self.is_never_evidence(f)
            if never_reason:
                rejected.append({**f, 'reason': never_reason, 'details': 'Excluded by EB-1A domain rules'})
                continue

            # 5. Letters must show signature indicators
            if self.is_letter(f):
                if not self.has_signature_indicators(fpath):
                    rejected.append({**f, 'reason': 'likely_unsigned', 'details': 'Letter PDF without signature indicators'})
                    continue

            # 6. Older versions — only VF/latest
            if self.is_older_version(f, files):
                rejected.append({**f, 'reason': 'older_version', 'details': 'Superseded by newer version'})
                continue

            # 7. Dedup by hash
            file_hash = self.compute_hash(fpath)
            if file_hash and file_hash in seen_hashes:
                existing = seen_hashes[file_hash]
                rejected.append({**f, 'reason': 'duplicate_exact', 'details': f'Same hash as {existing["clean_name"]}'})
                continue
            if file_hash:
                seen_hashes[file_hash] = f

            # 8. Check for placeholders
            if ext == '.pdf':
                try:
                    doc = fitz.open(fpath)
                    text = doc[0].get_text() if doc.page_count > 0 else ''
                    doc.close()
                    if any(ph in text for ph in ['[PREENCHER]', '[XXX]', '[Nome Completo]', '[VERIFICAR]']):
                        rejected.append({**f, 'reason': 'placeholder_detected', 'details': 'Unfilled placeholders'})
                        continue
                except:
                    pass

            # PASSED ALL FILTERS
            f['evidence_type'] = self.classify_file(f)
            f['criteria'] = self.map_criteria(f)
            f['is_letter'] = self.is_letter(f)
            f['has_translation_cover'] = self.detect_translation_cover(fpath) if ext == '.pdf' else False
            f['page_count'] = self.get_page_count(fpath) if ext == '.pdf' else 0
            f['file_hash'] = file_hash
            f['needs_certified_translation'] = self._needs_translation(f, fpath)

            valid.append(f)

        self._log(f"✅ Valid: {len(valid)} | ❌ Rejected: {len(rejected)}")
        return valid, rejected

    def _needs_translation(self, f: dict, fpath: str) -> bool:
        """Check if document is in Portuguese and needs certified translation."""
        if f['extension'] != '.pdf':
            return False
        try:
            doc = fitz.open(fpath)
            text = doc[0].get_text()[:500].lower() if doc.page_count > 0 else ''
            doc.close()
            pt_indicators = ['certifico', 'declaração', 'diploma', 'universidade', 'república federativa',
                             'cartório', 'registro', 'brasil', 'são paulo', 'rio de janeiro']
            en_indicators = ['certificate', 'university', 'declaration', 'hereby', 'united states',
                             'this is to certify', 'translated']
            pt_score = sum(1 for w in pt_indicators if w in text)
            en_score = sum(1 for w in en_indicators if w in text)
            return pt_score > en_score
        except:
            return False

    # ─── Step 4: Number and Copy ───

    def assign_numbers(self, files: List[dict]) -> List[dict]:
        """Assign sequential Evidence_XX numbers."""
        # Sort: letters first (most important), then by criteria, then by type
        type_priority = {
            'recommendation_letter': 0,
            'academic_credential': 1,
            'certification': 2,
            'publication_article': 3,
            'publication_book': 4,
            'media_article': 5,
            'award': 6,
            'employment_verification': 7,
        }
        files.sort(key=lambda f: (
            type_priority.get(f.get('evidence_type', ''), 99),
            f.get('clean_name', ''),
        ))

        pad = 2 if len(files) < 100 else 3
        for i, f in enumerate(files, 1):
            num = str(i).zfill(pad)
            # Clean name for filesystem
            base = Path(f['fixed_name']).stem
            ext = f['extension']
            f['evidence_number'] = i
            f['new_name'] = f'Evidence_{num}_{base}{ext}'
            f['new_path'] = str(self.output_dir / f['new_name'])

        return files

    def copy_to_evidence_folder(self, files: List[dict]):
        """Copy files to Evidence/ folder with translation subfolders. NEVER deletes originals."""
        if self.dry_run:
            needs_trans = sum(1 for f in files if f.get('needs_certified_translation'))
            no_trans = len(files) - needs_trans
            self._log(f"🔍 DRY RUN — would create {self.output_dir} with {len(files)} files")
            self._log(f"  📁 Needs Certified Translation: {needs_trans}")
            self._log(f"  📁 No Translation Needed: {no_trans}")
            return

        self.output_dir.mkdir(parents=True, exist_ok=True)
        (self.output_dir / '_thumbnails').mkdir(exist_ok=True)
        needs_trans_dir = self.output_dir / 'Needs_Certified_Translation'
        no_trans_dir = self.output_dir / 'No_Translation_Needed'
        needs_trans_dir.mkdir(exist_ok=True)
        no_trans_dir.mkdir(exist_ok=True)

        copied = 0
        for f in files:
            try:
                # Copy to main Evidence/ folder (flat, for pipeline)
                shutil.copy2(f['original_path'], f['new_path'])

                # Also copy to appropriate translation subfolder
                if f.get('needs_certified_translation'):
                    sub_path = needs_trans_dir / f['new_name']
                else:
                    sub_path = no_trans_dir / f['new_name']
                shutil.copy2(f['original_path'], str(sub_path))

                copied += 1
            except Exception as e:
                self._log(f"  ❌ Failed to copy {f['original_name']}: {e}")

        needs_count = sum(1 for f in files if f.get('needs_certified_translation'))
        self._log(f"📁 Copied {copied}/{len(files)} files to {self.output_dir}")
        self._log(f"  📁 Needs Certified Translation: {needs_count}")
        self._log(f"  📁 No Translation Needed: {len(files) - needs_count}")

    # ─── Step 5: Produce JSONs ───

    def build_evidence_inventory(self, files: List[dict]) -> dict:
        """Build evidence_inventory.json."""
        return {
            'metadata': {
                'generated_at': datetime.now().isoformat(),
                'generated_by': 'Evidence Organizer Agent v1.0',
                'client_folder': str(self.client_folder),
                'total_files_scanned': len(self.all_files),
                'total_valid_evidence': len(files),
                'total_rejected': len(self.rejected),
            },
            'evidence': [
                {
                    'number': f['evidence_number'],
                    'original_path': f['original_path'],
                    'original_name': f['original_name'],
                    'new_path': f['new_path'],
                    'new_name': f['new_name'],
                    'type': f.get('evidence_type', 'unknown'),
                    'criteria': f.get('criteria', []),
                    'is_letter': f.get('is_letter', False),
                    'has_translation_cover': f.get('has_translation_cover', False),
                    'page_count': f.get('page_count', 0),
                    'file_size_bytes': f['size_bytes'],
                    'hash_sha256': f.get('file_hash', ''),
                }
                for f in files
            ],
        }

    def build_thumbnail_map(self, files: List[dict]) -> dict:
        """Build thumbnail_map.json with correct paths and page numbers."""
        tmap = {}
        for f in files:
            if f['extension'] != '.pdf':
                continue
            pad = str(f['evidence_number']).zfill(2 if len(files) < 100 else 3)
            key = f'Evidência {f["evidence_number"]}'
            tmap[key] = {
                'exhibit_number': f['evidence_number'],
                'description': f.get('new_name', ''),
                'pdf_path': f['new_path'],
                'use_page': 2 if f.get('has_translation_cover') else 1,
            }
        return tmap

    def build_rejected_report(self, rejected: List[dict]) -> dict:
        """Build rejected_evidence.json."""
        return {
            'rejected': [
                {
                    'original_path': r['original_path'],
                    'original_name': r['original_name'],
                    'reason': r.get('reason', 'unknown'),
                    'details': r.get('details', ''),
                }
                for r in rejected
            ],
        }

    def save_jsons(self, inventory: dict, tmap: dict, rejected_report: dict):
        """Save all JSON outputs."""
        if self.dry_run:
            self._log("🔍 DRY RUN — would save 3 JSONs")
            return

        for name, data in [
            ('evidence_inventory.json', inventory),
            ('thumbnail_map.json', tmap),
            ('rejected_evidence.json', rejected_report),
        ]:
            path = self.output_dir / name
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            self._log(f"  💾 {name} ({len(json.dumps(data))} bytes)")

    # ─── Main ───

    def run(self) -> dict:
        """Main orchestration."""
        self._log(f"\n{'='*60}")
        self._log(f"EVIDENCE ORGANIZER AGENT")
        self._log(f"Client: {self.client_folder}")
        self._log(f"Output: {self.output_dir}")
        self._log(f"Dry run: {self.dry_run}")
        self._log(f"{'='*60}\n")

        # Check idempotency
        if self.output_dir.exists() and any(self.output_dir.iterdir()):
            self._log(f"⚠️ Evidence/ folder already exists with files. Use --force to overwrite.")
            return {'success': False, 'error': 'Evidence folder already exists'}

        # Step 1: Scan
        self.all_files = self.scan_all_files()

        # Step 2+3: Filter
        self.valid, self.rejected = self.filter_valid_evidence(self.all_files)

        # Step 4: Number
        self.valid = self.assign_numbers(self.valid)

        # Show plan
        self._log(f"\n📋 PLAN:")
        for f in self.valid[:10]:
            self._log(f"  {f['new_name']} ← {f['original_name'][:60]}")
        if len(self.valid) > 10:
            self._log(f"  ... +{len(self.valid) - 10} more")

        if self.rejected:
            self._log(f"\n🚫 REJECTED ({len(self.rejected)}):")
            for r in self.rejected[:5]:
                self._log(f"  {r.get('reason','?')}: {r['original_name'][:50]}")
            if len(self.rejected) > 5:
                self._log(f"  ... +{len(self.rejected) - 5} more")

        # Step 5: Copy
        self.copy_to_evidence_folder(self.valid)

        # Step 6: Build JSONs
        inventory = self.build_evidence_inventory(self.valid)
        tmap = self.build_thumbnail_map(self.valid)
        rejected_report = self.build_rejected_report(self.rejected)
        self.save_jsons(inventory, tmap, rejected_report)

        # Save log
        if not self.dry_run:
            log_path = self.output_dir / 'organizer_log.json'
            with open(log_path, 'w', encoding='utf-8') as f:
                json.dump({'log': self.log, 'timestamp': datetime.now().isoformat()}, f, indent=2, ensure_ascii=False)

        self._log(f"\n{'='*60}")
        self._log(f"{'✅ DONE' if not self.dry_run else '🔍 DRY RUN COMPLETE'}")
        self._log(f"Valid: {len(self.valid)} | Rejected: {len(self.rejected)} | Total scanned: {len(self.all_files)}")
        self._log(f"{'='*60}\n")

        return {
            'success': True,
            'valid_count': len(self.valid),
            'rejected_count': len(self.rejected),
            'total_scanned': len(self.all_files),
            'output_dir': str(self.output_dir),
        }


def main():
    parser = argparse.ArgumentParser(description='Evidence Organizer Agent — Phase -1')
    parser.add_argument('client_folder', help='Path to client folder')
    parser.add_argument('--output', default='Evidence', help='Output subfolder name (default: Evidence)')
    parser.add_argument('--dry-run', action='store_true', help='Show plan without copying')
    parser.add_argument('--force', action='store_true', help='Overwrite existing Evidence/ folder')
    args = parser.parse_args()

    if not os.path.isdir(args.client_folder):
        print(f"❌ Not a directory: {args.client_folder}")
        sys.exit(1)

    organizer = EvidenceOrganizer(args.client_folder, args.output, args.dry_run)

    # Handle --force
    if args.force and organizer.output_dir.exists():
        shutil.rmtree(organizer.output_dir)

    result = organizer.run()
    sys.exit(0 if result.get('success') else 1)


if __name__ == '__main__':
    main()
