/**
 * Onboarding Wizard — extrai personas + us_timeline iniciais a partir de
 * uma pasta de cliente. Substitui o cadastro manual de master_facts/persona_bank
 * que hoje toda primeira tentativa de gerar EB-2 NIW / EB-1A / O-1 exige.
 *
 * CHUNK 11+12 (F3.3+F3.4) — Auditoria 30/abr identificou que cláusula pétrea
 * us_entry_date (r206/r207) bloqueia QUALQUER cliente novo até alguém criar
 * `data/master_facts/{case_id}.json` à mão. E persona_bank requer cadastro
 * manual de cada testemunho. Hoje o dono fez 11 entries manuais (5 Cedini
 * + 6 Sâmola) só pra desbloquear cartas. Não escala.
 *
 * Este wizard NÃO escreve nos arquivos canônicos automaticamente — produz
 * SUGESTÕES pra serem revisadas por humano antes de virar `master_facts`/
 * `persona_bank` definitivos. Output: JSON estruturado + flag `_provisional: true`.
 *
 * Operações:
 *   - extractTestimonyPersonasFromFolder(caseId, docsPath, language='en')
 *   - inferUSTimelineFromFolder(caseId, docsPath)
 *
 * Cada operação é DETERMINÍSTICA quando possível (file scan + regex);
 * cai em heurística conservadora quando faltam dados (entry_status=
 * consular_processing_outside_us como floor seguro).
 */

import { existsSync, readdirSync, statSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import type { LetterType } from '@/lib/rules/persona-bank';
import type { USTimeline, USEntryStatus } from '@/lib/validators/us-entry-date';

// ────────────────────────────────────────────────────────────────────────────
// PERSONA EXTRACTION (CHUNK 11)
// ────────────────────────────────────────────────────────────────────────────

export interface PersonaSuggestion {
  author_id: string;
  case_id: string;
  full_name: string;
  source_file: string;       // path absoluto do CV/carta de onde foi extraído
  source_kind: 'cv_pdf' | 'carta_existing' | 'inferred';
  credential: string;
  firm: string;
  years_in_field: number;
  letter_type: LetterType;
  // Estilísticos heterogêneos (anti-ATLAS), atribuídos por índice:
  signature_verb: string;
  emotional_register: string;
  sentence_length_distribution: string;
  preferred_language: 'pt' | 'en';
  expertise_lock: string[];
  opening_variants: string[];
  relationship_to_petitioner: string;
  _provisional: true;
  _confidence: 'high' | 'medium' | 'low';
}

const STYLE_PROFILES = [
  { signature_verb: 'registre-se', emotional_register: 'formal-técnico sênior', sentence_length_distribution: 'long_sentences_enumerativas' },
  { signature_verb: 'atesto', emotional_register: 'formal-fiscalizador conciso', sentence_length_distribution: 'short_sentences_assertivas' },
  { signature_verb: 'declaro', emotional_register: 'formal-executivo narrativo', sentence_length_distribution: 'medium_sentences_narrativas' },
  { signature_verb: 'certifico', emotional_register: 'formal-empreendedor direto', sentence_length_distribution: 'medium_sentences_diretas' },
  { signature_verb: 'ratifico', emotional_register: 'formal-jurídico-institucional', sentence_length_distribution: 'long_sentences_argumentativas' },
  { signature_verb: 'subscrevo', emotional_register: 'formal-acadêmico estruturado', sentence_length_distribution: 'medium_sentences_recordativas' },
  { signature_verb: 'assino', emotional_register: 'formal-comercial caloroso', sentence_length_distribution: 'medium_sentences_descritivas' },
];

function slugify(s: string): string {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60);
}

function readPdfText(pdfPath: string, maxChars = 4000): string {
  try {
    const out = execSync(
      `python3 -c "import pdfplumber, sys; t=''.join(p.extract_text() or '' for p in pdfplumber.open(${JSON.stringify(pdfPath)}).pages[:3]); sys.stdout.write(t[:${maxChars}])"`,
      { encoding: 'utf-8', maxBuffer: 5 * 1024 * 1024, timeout: 20_000 },
    );
    return out;
  } catch {
    return '';
  }
}

function readDocxText(docxPath: string, maxChars = 4000): string {
  try {
    const out = execSync(
      `python3 -c "from docx import Document; d=Document(${JSON.stringify(docxPath)}); t='\\n'.join(p.text for p in d.paragraphs); print(t[:${maxChars}])"`,
      { encoding: 'utf-8', maxBuffer: 5 * 1024 * 1024, timeout: 20_000 },
    );
    return out;
  } catch {
    return '';
  }
}

function inferCredentialFirm(text: string): { credential: string; firm: string; expertise: string[] } {
  const lower = text.toLowerCase();
  if (/lawyer|advog|partner|attorney/.test(lower) && /accounting|cpa|contabilid/.test(lower)) {
    return { credential: 'Lawyer & Accounting Partner', firm: 'L&S / private practice', expertise: ['accounting partnership', 'tax compliance', 'corporate accounting'] };
  }
  if (/afre|fiscal\s+da\s+receita|secretary\s+of\s+finance/.test(lower)) {
    return { credential: 'AFRE — Auditor Fiscal da Receita Estadual', firm: 'Secretaria da Fazenda', expertise: ['fiscal audit', 'state revenue', 'tax compliance'] };
  }
  if (/engineer|engenheir|crea/.test(lower)) {
    return { credential: 'Senior Engineer (CREA)', firm: 'private practice', expertise: ['engineering oversight', 'technical evaluation'] };
  }
  if (/ceo|founder|founding|co.?founder|fundador|presidente/.test(lower)) {
    return { credential: 'CEO / Founder', firm: 'private business', expertise: ['executive continuity', 'operational stewardship'] };
  }
  if (/rh\b|human\s+resources|recursos\s+humanos|gerente\s+de\s+pessoas/.test(lower)) {
    return { credential: 'HR Manager', firm: 'corporate HR', expertise: ['human resources', 'talent management'] };
  }
  return { credential: 'Senior Professional', firm: 'Brazil-based practice', expertise: ['senior professional practice'] };
}

/**
 * Varre a pasta do cliente buscando CVs (.pdf) e cartas existentes (.pdf/.docx)
 * de testemunhadores. Cada arquivo encontrado vira UMA persona-suggestion.
 *
 * Convenções heurísticas pra identificar testemunhadores:
 *   - filename contém "CV", "curric", "carta", "letter", "recommend", "testem"
 *   - extrai nome da primeira página
 *   - infere cargo/firma de palavras-chave no texto
 *
 * Output: SUGESTÕES com `_provisional: true` e `_confidence`. Caller (UI ou
 * humano) revisa antes de inserir em persona_bank.json.
 */
export function extractTestimonyPersonasFromFolder(
  caseId: string,
  docsPath: string,
  options: { language?: 'pt' | 'en'; maxPersonas?: number } = {},
): PersonaSuggestion[] {
  const { language = 'en', maxPersonas = 8 } = options;
  if (!existsSync(docsPath)) return [];

  const candidates: { absPath: string; name: string; kind: 'cv_pdf' | 'carta_existing' }[] = [];
  function walk(dir: string, depth = 0) {
    if (depth > 4) return;
    let entries: string[] = [];
    try { entries = readdirSync(dir); } catch { return; }
    for (const e of entries) {
      if (e.startsWith('.') || /^_QUARENTENA|_BACKUP|_LEGACY|_LIXO/i.test(e)) continue;
      const full = path.join(dir, e);
      let st;
      try { st = statSync(full); } catch { continue; }
      if (st.isDirectory()) walk(full, depth + 1);
      else if (st.isFile()) {
        const lower = e.toLowerCase();
        const isPdf = lower.endsWith('.pdf');
        const isDocx = lower.endsWith('.docx');
        if (!isPdf && !isDocx) continue;
        if (/cv\b|curric/.test(lower)) candidates.push({ absPath: full, name: e, kind: 'cv_pdf' });
        else if (/carta|letter|recom|testem|testimon/.test(lower)) candidates.push({ absPath: full, name: e, kind: 'carta_existing' });
      }
    }
  }
  walk(docsPath);

  const suggestions: PersonaSuggestion[] = [];
  let styleIdx = 0;
  for (const c of candidates) {
    if (suggestions.length >= maxPersonas) break;
    const text = c.absPath.endsWith('.pdf') ? readPdfText(c.absPath) : readDocxText(c.absPath);
    if (!text || text.length < 50) continue;

    // Nome do testemunhador — heurística simples
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);
    const nameCandidates = lines.slice(0, 8).filter(l => /^[A-ZÀ-Ý][a-zà-ÿ]/.test(l) && l.length < 80 && !/^cv|curric|resume/i.test(l));
    const fullName = (nameCandidates[0] || c.name.replace(/\.[a-z]+$/i, '')).trim();
    const authorId = `${slugify(fullName)}_${caseId}`;

    if (suggestions.some(s => s.author_id === authorId)) continue; // dedup

    const { credential, firm, expertise } = inferCredentialFirm(text);
    const yearMatches = Array.from(text.matchAll(/\b(19[7-9]\d|20[012]\d)\b/g)).map(m => Number(m[1]));
    const years = yearMatches.length >= 2 ? Math.max(...yearMatches) - Math.min(...yearMatches) : 10;

    const style = STYLE_PROFILES[styleIdx % STYLE_PROFILES.length];
    styleIdx++;

    suggestions.push({
      author_id: authorId,
      case_id: caseId,
      full_name: fullName,
      source_file: c.absPath,
      source_kind: c.kind,
      credential,
      firm,
      years_in_field: years,
      letter_type: 'testemunho_passado',
      signature_verb: style.signature_verb,
      emotional_register: style.emotional_register,
      sentence_length_distribution: style.sentence_length_distribution,
      preferred_language: language,
      expertise_lock: expertise,
      opening_variants: [
        `In my capacity as ${credential} at ${firm}, I have direct knowledge of`,
        `Over the course of more than ${years} years of professional collaboration`,
        `I write in support based on direct observation while at ${firm}`,
      ],
      relationship_to_petitioner: `Professional counterpart of the petitioner; relationship verifiable via the source file in the client folder (${c.kind}).`,
      _provisional: true,
      _confidence: c.kind === 'cv_pdf' && text.length > 1000 ? 'high' : 'medium',
    });
  }
  return suggestions;
}

// ────────────────────────────────────────────────────────────────────────────
// US TIMELINE INFERENCE (CHUNK 12)
// ────────────────────────────────────────────────────────────────────────────

export interface USTimelineSuggestion extends USTimeline {
  _provisional: true;
  _confidence: 'high' | 'medium' | 'low';
  _evidence: string[];   // snippets que embasaram a inferência
}

/**
 * Tenta inferir us_timeline a partir da pasta do cliente:
 *   1. Procura transcrições (.md/.docx) com keywords ("EUA", "Estados Unidos", "cheguei", "EAD", "I-485", "AOS")
 *   2. Lê CV pra detectar endereço US (Florida zip, +1 phone)
 *   3. Se nada conclusivo, retorna entry_status='consular_processing_outside_us' (floor seguro)
 *
 * NUNCA inventa datas concretas. Quando inferir entry_status mas não datas,
 * deixa null + flag _provisional + _evidence array.
 */
export function inferUSTimelineFromFolder(
  caseId: string,
  docsPath: string,
): USTimelineSuggestion {
  const evidence: string[] = [];
  if (!existsSync(docsPath)) {
    return {
      entry_status: 'consular_processing_outside_us',
      _provisional: true,
      _confidence: 'low',
      _evidence: ['(pasta do cliente não existe — assumindo Consular Processing como floor seguro)'],
    };
  }

  // Heurísticas de detecção de presença US
  let hasUsAddress = false;
  let hasUsPhone = false;
  let hasUsEntryRef = false;
  let hasWorkPermitRef = false;

  function walk(dir: string, depth = 0) {
    if (depth > 3) return;
    let entries: string[] = [];
    try { entries = readdirSync(dir); } catch { return; }
    for (const e of entries) {
      if (e.startsWith('.') || /^_QUARENTENA|_BACKUP|_LEGACY|_LIXO/i.test(e)) continue;
      const full = path.join(dir, e);
      let st;
      try { st = statSync(full); } catch { continue; }
      if (st.isDirectory()) walk(full, depth + 1);
      else if (st.isFile()) {
        const lower = e.toLowerCase();
        // Só verificar arquivos de texto e curtos
        if (!/\.(md|txt)$/i.test(lower)) continue;
        let content = '';
        try {
          if (statSync(full).size > 500_000) continue;
          content = require('fs').readFileSync(full, 'utf-8') as string;
        } catch { continue; }
        const lc = content.toLowerCase();
        if (!hasUsAddress && /\b(florida|fl\b|orlando|miami|tampa|jacksonville|new york|california|texas|seattle|boston)\b/i.test(content)) {
          hasUsAddress = true;
          evidence.push(`endereço/menção US em ${path.basename(full)}`);
        }
        if (!hasUsPhone && /\+1\s*\(?\d{3}\)?\s*\d{3}-?\d{4}/.test(content)) {
          hasUsPhone = true;
          evidence.push(`telefone US (+1) em ${path.basename(full)}`);
        }
        if (!hasUsEntryRef && /(cheguei nos eua|chegou nos estados unidos|moved to the us|relocated to)/i.test(lc)) {
          hasUsEntryRef = true;
          evidence.push(`menção de chegada nos EUA em ${path.basename(full)}`);
        }
        if (!hasWorkPermitRef && /(work\s*permit|ead|i-?485|aos\s+approved|adjustment\s+of\s+status\s+approved)/i.test(lc)) {
          hasWorkPermitRef = true;
          evidence.push(`menção de work permit/EAD em ${path.basename(full)}`);
        }
      }
    }
  }
  walk(docsPath);

  let entry_status: USEntryStatus = 'consular_processing_outside_us';
  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (hasUsAddress && hasUsPhone && hasWorkPermitRef) {
    entry_status = 'in_us_with_work_authorization';
    confidence = 'medium';
  } else if (hasUsAddress && hasUsPhone) {
    entry_status = 'in_us_pending_work_authorization';
    confidence = 'medium';
  } else if (hasUsEntryRef && !hasWorkPermitRef) {
    entry_status = 'in_us_pending_work_authorization';
    confidence = 'low';
  }

  return {
    entry_status,
    us_entry_date: undefined,
    us_first_work_authorization_date: undefined,
    verification_source: `inferido por onboarding-wizard de ${docsPath}`,
    transcription_excerpt: evidence.length > 0 ? evidence.join(' | ') : 'sem evidência conclusiva',
    _provisional: true,
    _confidence: confidence,
    _evidence: evidence.length > 0 ? evidence : ['(nenhum sinal forte detectado — assumindo Consular Processing como floor seguro)'],
  };
}
