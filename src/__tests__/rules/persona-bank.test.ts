import { describe, it, expect, beforeEach } from 'vitest';
import { loadPersona, getAllPersonas, getPersonasForType, _clearPersonaCache } from '@/lib/rules/persona-bank';

describe('persona-bank', () => {
  beforeEach(() => _clearPersonaCache());

  it('loads all personas from bank', () => {
    const all = getAllPersonas();
    expect(all.length).toBeGreaterThan(0);
  });

  it('filters personas by case_id', () => {
    const ricardo = getAllPersonas('ricardo_augusto');
    expect(ricardo.length).toBe(5);
    expect(ricardo.every(p => p.case_id === 'ricardo_augusto')).toBe(true);
  });

  it('loads a single persona by author_id', () => {
    const persona = loadPersona('ademar_hirata');
    expect(persona).not.toBeNull();
    expect(persona!.full_name).toBe('Ademar Hirata');
    expect(persona!.signature_verb).toBe('registre-se');
    expect(persona!.opening_variants.length).toBeGreaterThanOrEqual(3);
  });

  it('returns null for unknown author_id', () => {
    expect(loadPersona('ninguem')).toBeNull();
  });

  it('filters by letter type', () => {
    const testemunhos = getPersonasForType('ricardo_augusto', 'testemunho_passado');
    expect(testemunhos.length).toBe(5);
  });

  it('persona has all required expertise_lock entries', () => {
    const persona = loadPersona('david_karins');
    expect(persona!.expertise_lock).toContain('FL structural practice');
    expect(persona!.preferred_language).toBe('en');
  });
});
