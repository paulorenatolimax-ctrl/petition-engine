import { readFileSync, existsSync } from 'fs';
import path from 'path';

/**
 * Status de entrada do peticionário nos EUA — determina o que o validator exige.
 *
 *  - in_us_with_work_authorization
 *      Caso normal: peticionário está nos EUA com EAD/AOS approved/H-1B/etc.
 *      EXIGE us_entry_date + us_first_work_authorization_date.
 *      Validator bloqueia qualquer data US-emprego < us_first_work_authorization_date.
 *
 *  - in_us_pending_work_authorization
 *      Está nos EUA mas SEM autorização de trabalho ainda (ex: F-1 sem CPT/OPT,
 *      AOS pendente sem EAD). EXIGE us_entry_date. Validator BLOQUEIA QUALQUER
 *      data em contexto US-emprego (não pode citar trabalho remunerado lá).
 *
 *  - consular_processing_outside_us
 *      Peticionário ainda no país de origem, vai entrar via processo consular.
 *      NÃO exige datas. Validator BLOQUEIA QUALQUER data em contexto US-emprego
 *      (ainda não pode ter trabalhado lá legalmente).
 */
export type USEntryStatus =
  | 'in_us_with_work_authorization'
  | 'in_us_pending_work_authorization'
  | 'consular_processing_outside_us';

export interface USTimeline {
  /**
   * Status que determina o que o validator exige. Default (quando ausente):
   * 'in_us_with_work_authorization' — preserva comportamento histórico.
   */
  entry_status?: USEntryStatus;
  us_entry_date?: string;
  us_entry_basis?: string;
  us_aos_approved_date?: string;
  us_aos_approved_basis?: string;
  /**
   * Obrigatório apenas se entry_status === 'in_us_with_work_authorization'.
   * Para outros status, permanece undefined.
   */
  us_first_work_authorization_date?: string;
  us_first_work_authorization_basis?: string;
  company_formed_date?: string;
  company_name?: string;
  verification_source?: string;
  transcription_excerpt?: string;
}

export interface USEntryDateGateResult {
  ok: boolean;
  reason?: string;
  caseId?: string;
  timeline?: USTimeline;
}

export interface USEntryDateScanViolation {
  date_iso: string;
  context_snippet: string;
  violation_type: 'before_entry' | 'before_work_authorization';
  position: number;
}

export interface USEntryDateScanResult {
  ok: boolean;
  total_us_context_dates: number;
  violations: USEntryDateScanViolation[];
  timeline: USTimeline;
}

const MASTER_FACTS_DIR = path.join(process.cwd(), 'data', 'master_facts');

export function loadUSTimeline(caseId: string): USTimeline | null {
  const file = path.join(MASTER_FACTS_DIR, `${caseId}.json`);
  if (!existsSync(file)) return null;
  try {
    const data = JSON.parse(readFileSync(file, 'utf-8'));
    if (!data.us_timeline) return null;
    const tl = data.us_timeline as USTimeline;
    const status: USEntryStatus = tl.entry_status ?? 'in_us_with_work_authorization';
    // Validação por status:
    if (status === 'in_us_with_work_authorization') {
      if (!tl.us_entry_date || !tl.us_first_work_authorization_date) return null;
    } else if (status === 'in_us_pending_work_authorization') {
      if (!tl.us_entry_date) return null;
    }
    // consular_processing_outside_us: nenhuma data é exigida.
    return { ...tl, entry_status: status };
  } catch {
    return null;
  }
}

const VISA_TYPES_REQUIRING_US_TIMELINE = new Set([
  'EB-2 NIW',
  'EB-2-NIW',
  'EB-1A',
  'EB-1',
  'O-1',
  'O-1A',
]);

/**
 * Doc types where the US_ENTRY_DATE pre-gate is enforced. Any docType outside
 * this list (testimony letters, methodology dossiers, RFE responses, photo
 * reports, etc.) skips the gate — they don't claim US-employment timelines, so
 * blocking them on missing us_timeline is wrong.
 *
 * Cláusula pétrea preservada onde importa: cover letters, BPs, résumés,
 * anteprojetos e projetos-base ainda gateiam.
 */
export const ALLOWED_DOC_TYPES_FOR_US_ENTRY_GATE = new Set<string>([
  'cover_letter_eb1a',
  'cover_letter_eb2_niw',
  'business_plan',
  'resume_eb1a',
  'resume_eb2_niw',
  'anteprojeto_eb1a',
  'anteprojeto_eb2_niw',
  'projeto_base_eb1a',
  'projeto_base_eb2_niw',
]);

/**
 * Pre-gate before any document generation. If the visa type requires US timeline
 * tracking (EB-1A/EB-2 NIW/O-1) and master_facts/{caseId}.json lacks us_timeline,
 * returns ok=false with a reason. Generators MUST refuse to proceed.
 *
 * docType (optional): when provided AND not in ALLOWED_DOC_TYPES_FOR_US_ENTRY_GATE,
 * the gate is skipped (return ok:true). When undefined, the gate runs based on
 * visaType alone — preserves backward-compatible behavior for callers not yet
 * passing docType.
 */
export function preGateUSEntryDate(
  caseId: string | undefined,
  visaType: string | undefined,
  docType?: string,
): USEntryDateGateResult {
  if (docType && !ALLOWED_DOC_TYPES_FOR_US_ENTRY_GATE.has(docType)) {
    return { ok: true };
  }
  if (!visaType) return { ok: true };
  const normalized = visaType.toUpperCase().replace(/\s+/g, ' ').trim();
  const requires = Array.from(VISA_TYPES_REQUIRING_US_TIMELINE).some(v => normalized.includes(v.toUpperCase()));
  if (!requires) return { ok: true };
  if (!caseId) {
    return {
      ok: false,
      reason: `BLOQUEADO: visto ${visaType} exige master_facts/{case_id}.json com us_timeline. case_id ausente.`,
    };
  }
  const timeline = loadUSTimeline(caseId);
  if (!timeline) {
    return {
      ok: false,
      caseId,
      reason: `BLOQUEADO: data/master_facts/${caseId}.json ausente OU sem us_timeline.us_entry_date e us_first_work_authorization_date. CRIAR antes de gerar qualquer documento. Visto ${visaType} requer trilha temporal completa pra evitar atribuir trabalho dos EUA antes da autorização legal.`,
    };
  }
  return { ok: true, caseId, timeline };
}

const US_CONTEXT_PATTERN = /\b(EUA|Estados Unidos|United States|U\.S\.A?\.?|US\b|USA\b|Florida|Fl[oó]rida|Orlando|Miami|Tampa|Jacksonville|Atlanta|California|Texas|New York|Nova York|Chicago|Boston|Seattle|San Francisco|Houston|Los Angeles|EUA\.|americano|americana|americanos|americanas|norte-americano|norte-americana|stateside|domestic\s+(?:market|client))\b/i;

const DATE_PATTERNS: Array<{ regex: RegExp; toIso: (m: RegExpExecArray) => string | null }> = [
  // YYYY-MM-DD or YYYY/MM/DD
  {
    regex: /\b(20[12][0-9])[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12][0-9]|3[01])\b/g,
    toIso: m => `${m[1]}-${m[2]}-${m[3]}`,
  },
  // DD/MM/YYYY or DD-MM-YYYY (PT-BR)
  {
    regex: /\b(0[1-9]|[12][0-9]|3[01])[/-](0[1-9]|1[0-2])[/-](20[12][0-9])\b/g,
    toIso: m => `${m[3]}-${m[2]}-${m[1]}`,
  },
  // Month YYYY (PT-BR or EN)
  {
    regex: /\b(janeiro|fevereiro|mar[çc]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|fev|mar|apr|abr|may|jun|jul|aug|ago|sep|set|oct|out|nov|dec|dez)[\s/]*(?:de\s+)?(20[12][0-9])\b/gi,
    toIso: m => {
      const monthMap: Record<string, string> = {
        janeiro: '01', january: '01', jan: '01',
        fevereiro: '02', february: '02', feb: '02', fev: '02',
        março: '03', marco: '03', march: '03', mar: '03',
        abril: '04', april: '04', apr: '04', abr: '04',
        maio: '05', may: '05',
        junho: '06', june: '06', jun: '06',
        julho: '07', july: '07', jul: '07',
        agosto: '08', august: '08', aug: '08', ago: '08',
        setembro: '09', september: '09', sep: '09', set: '09',
        outubro: '10', october: '10', oct: '10', out: '10',
        novembro: '11', november: '11', nov: '11',
        dezembro: '12', december: '12', dec: '12', dez: '12',
      };
      const month = monthMap[m[1].toLowerCase()];
      return month ? `${m[2]}-${month}-15` : null;
    },
  },
  // Bare YYYY (last resort, only if surrounded by US context within ±200 chars — handled in scanner)
  {
    regex: /\b(20[12][0-9])\b/g,
    toIso: m => `${m[1]}-12-31`,
  },
];

/**
 * Scan generated text for date references in US-employment context that violate
 * the petitioner's US timeline. Returns violations sorted by position.
 *
 * Heuristic: a date "X" is a violation when both:
 *   1. X falls before us_first_work_authorization_date (or before us_entry_date for entry-context phrases)
 *   2. The surrounding ±200-character window contains a US geographic marker AND a work-context verb
 *      (trabalh, contrat, implement, atend, prest, client, contract, hire, employ, project, engaj)
 */
const URL_NEAR_PATTERN = /https?:\/\/|www\.|\.pdf|\.html|\.aspx|\]\(|uploads?\/|\/20[12][0-9]\/|wp-content/i;

function isInUrlContext(text: string, position: number, spanLen: number): boolean {
  const start = Math.max(0, position - 50);
  const end = Math.min(text.length, position + spanLen + 50);
  return URL_NEAR_PATTERN.test(text.slice(start, end));
}

function normalizeIso(s: string): string {
  const parts = s.split('-');
  if (parts.length === 1) return `${parts[0]}-01-01`;
  if (parts.length === 2) return `${parts[0]}-${parts[1]}-01`;
  return s;
}

export function scanUSEntryDateViolations(text: string, timeline: USTimeline): USEntryDateScanResult {
  const violations: USEntryDateScanViolation[] = [];
  const seen = new Set<string>();
  const workContextRegex = /\b(trabalh|contrat|implement|atend|prest|client|contract|hire|employ|engaj|project|projeto|consult|consultor)/i;
  const status: USEntryStatus = timeline.entry_status ?? 'in_us_with_work_authorization';
  const entryDate = timeline.us_entry_date ? normalizeIso(timeline.us_entry_date) : '';
  const workAuthDate = timeline.us_first_work_authorization_date ? normalizeIso(timeline.us_first_work_authorization_date) : '';

  let totalUsContextDates = 0;

  for (const { regex, toIso } of DATE_PATTERNS) {
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      if (isInUrlContext(text, match.index, match[0].length)) continue;
      const isoRaw = toIso(match);
      if (!isoRaw) continue;
      const iso = normalizeIso(isoRaw);
      const start = Math.max(0, match.index - 200);
      const end = Math.min(text.length, match.index + match[0].length + 200);
      const window = text.slice(start, end);
      if (!US_CONTEXT_PATTERN.test(window)) continue;
      if (!workContextRegex.test(window)) continue;
      totalUsContextDates += 1;
      const key = `${iso}@${match.index}`;
      if (seen.has(key)) continue;
      seen.add(key);
      let violationType: 'before_entry' | 'before_work_authorization' | null = null;
      if (status === 'consular_processing_outside_us') {
        // Sem autorização de trabalho NUNCA — toda data US-emprego é violação.
        violationType = 'before_work_authorization';
      } else if (status === 'in_us_pending_work_authorization') {
        // Tem entry_date mas NÃO tem work_auth — qualquer data US-emprego é violação,
        // exceto se claramente anterior à entrada (aí é trabalho fora dos EUA mal-rotulado).
        violationType = entryDate && iso < entryDate ? 'before_entry' : 'before_work_authorization';
      } else {
        // in_us_with_work_authorization (default histórico).
        if (entryDate && iso < entryDate) violationType = 'before_entry';
        else if (workAuthDate && iso < workAuthDate) violationType = 'before_work_authorization';
      }
      if (!violationType) continue;
      violations.push({
        date_iso: iso,
        context_snippet: window.replace(/\s+/g, ' ').trim().slice(0, 240),
        violation_type: violationType,
        position: match.index,
      });
    }
  }

  violations.sort((a, b) => a.position - b.position);
  return {
    ok: violations.length === 0,
    total_us_context_dates: totalUsContextDates,
    violations,
    timeline,
  };
}
