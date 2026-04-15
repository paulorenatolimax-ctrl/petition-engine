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

EXCLUDED_DIRS = {
    '_Forjado por Petition Engine', 'phases', 'Evidence', 'Evidências',
    '__MACOSX', '.git', 'node_modules', '_AUTOMAÇÃO',
}
EXCLUDED_FILES = {'.DS_Store', 'Thumbs.db', 'desktop.ini'}
VALID_EXTENSIONS = {'.pdf', '.docx', '.doc', '.png', '.jpg', '.jpeg', '.tiff', '.pptx'}

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
            # Skip excluded directories
            dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]

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

    def is_letter(self, f: dict) -> bool:
        """Check if file is a recommendation/support letter."""
        combined = (f['clean_name'] + ' ' + f['parent_folder']).lower()
        return any(kw in combined for kw in LETTER_KEYWORDS)

    def is_in_signed_folder(self, f: dict) -> bool:
        """Check if file is in a folder for signed documents."""
        return any(kw in f['parent_name'] for kw in SIGNED_FOLDER_KEYWORDS)

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

    def filter_valid_evidence(self, files: List[dict]) -> Tuple[List[dict], List[dict]]:
        """Apply all filtering rules."""
        valid = []
        rejected = []
        seen_hashes: Dict[str, dict] = {}

        for f in files:
            ext = f['extension']
            path = f['original_path']

            # Skip non-evidence extensions
            if ext not in VALID_EXTENSIONS:
                rejected.append({**f, 'reason': 'invalid_extension', 'details': f'Extension {ext} not in valid list'})
                continue

            # Skip empty files
            if f['size_bytes'] == 0:
                rejected.append({**f, 'reason': 'empty_file', 'details': '0 bytes'})
                continue

            # CRITICAL: DOCX letters are ALWAYS rejected
            if self.is_letter(f) and ext == '.docx':
                rejected.append({**f, 'reason': 'unsigned_docx_letter', 'details': 'DOCX letter — only signed PDF letters accepted'})
                continue

            # Dedup by hash
            file_hash = self.compute_hash(path)
            if file_hash and file_hash in seen_hashes:
                existing = seen_hashes[file_hash]
                rejected.append({**f, 'reason': 'duplicate_exact', 'details': f'Same hash as {existing["clean_name"]}'})
                continue

            if file_hash:
                seen_hashes[file_hash] = f

            # Classify
            f['evidence_type'] = self.classify_file(f)
            f['criteria'] = self.map_criteria(f)
            f['is_letter'] = self.is_letter(f)
            f['has_translation_cover'] = self.detect_translation_cover(path) if ext == '.pdf' else False
            f['page_count'] = self.get_page_count(path) if ext == '.pdf' else 0
            f['file_hash'] = file_hash

            valid.append(f)

        self._log(f"✅ Valid: {len(valid)} | ❌ Rejected: {len(rejected)}")
        return valid, rejected

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
        """Copy files to Evidence/ folder. NEVER deletes originals."""
        if self.dry_run:
            self._log(f"🔍 DRY RUN — would create {self.output_dir} with {len(files)} files")
            return

        self.output_dir.mkdir(parents=True, exist_ok=True)
        (self.output_dir / '_thumbnails').mkdir(exist_ok=True)

        copied = 0
        for f in files:
            try:
                shutil.copy2(f['original_path'], f['new_path'])
                copied += 1
            except Exception as e:
                self._log(f"  ❌ Failed to copy {f['original_name']}: {e}")

        self._log(f"📁 Copied {copied}/{len(files)} files to {self.output_dir}")

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
