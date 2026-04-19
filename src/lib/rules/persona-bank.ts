import { readFileSync, existsSync } from 'fs';
import path from 'path';

export type LetterType =
  | 'testemunho_passado'
  | 'cliente_futuro'
  | 'parceiro_estrategico'
  | 'investidor_futuro'
  | 'contador';

export interface Persona {
  author_id: string;
  case_id: string;
  full_name: string;
  credential: string;
  firm: string;
  years_in_field: number;
  relationship_to_petitioner: string;
  signature_verb: string;
  opening_variants: string[];
  expertise_lock: string[];
  emotional_register: string;
  sentence_length_distribution: string;
  preferred_language: 'pt' | 'en';
  letter_type: LetterType;
}

interface PersonaBankFile {
  description?: string;
  source?: string;
  personas: Persona[];
}

const PERSONA_BANK_FILE = path.join(process.cwd(), 'data', 'persona_bank.json');

let _cache: PersonaBankFile | null = null;

function load(): PersonaBankFile {
  if (_cache) return _cache;
  if (!existsSync(PERSONA_BANK_FILE)) {
    _cache = { personas: [] };
    return _cache;
  }
  _cache = JSON.parse(readFileSync(PERSONA_BANK_FILE, 'utf-8'));
  return _cache!;
}

export function loadPersona(author_id: string): Persona | null {
  return load().personas.find(p => p.author_id === author_id) || null;
}

export function getAllPersonas(caseId?: string): Persona[] {
  const all = load().personas;
  if (!caseId) return all;
  return all.filter(p => p.case_id === caseId);
}

export function getPersonasForType(caseId: string, letterType: LetterType): Persona[] {
  return getAllPersonas(caseId).filter(p => p.letter_type === letterType);
}

/** Clear cache — used by tests after fixture mutations. */
export function _clearPersonaCache() { _cache = null; }
