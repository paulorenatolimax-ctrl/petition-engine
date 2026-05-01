import { describe, it, expect } from 'vitest';
import {
  preGateUSEntryDate,
  scanUSEntryDateViolations,
  type USTimeline,
} from '@/lib/validators/us-entry-date';

const TIMELINE: USTimeline = {
  us_entry_date: '2019-08-01',
  us_entry_basis: 'F-1 student',
  us_aos_approved_date: '2021-12-01',
  us_first_work_authorization_date: '2022-07-01',
  us_first_work_authorization_basis: 'EAD via I-485',
  company_name: 'Simple Shift Consulting, LLC',
};

describe('preGateUSEntryDate', () => {
  it('passes for unrelated visa types', () => {
    expect(preGateUSEntryDate('any_case', 'B-1 tourist')).toEqual({ ok: true });
    expect(preGateUSEntryDate(undefined, 'B-1 tourist')).toEqual({ ok: true });
  });

  it('blocks EB-2 NIW without case_id', () => {
    const r = preGateUSEntryDate(undefined, 'EB-2 NIW');
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/case_id ausente/);
  });

  it('blocks when master_facts file is missing', () => {
    const r = preGateUSEntryDate('nonexistent_case_xyz', 'EB-2 NIW');
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/ausente OU sem us_timeline/);
  });

  it('passes for marcio_elias_barbosa (real fixture)', () => {
    const r = preGateUSEntryDate('marcio_elias_barbosa', 'EB-2 NIW');
    expect(r.ok).toBe(true);
    expect(r.timeline?.us_entry_date).toBe('2019-08-01');
    expect(r.timeline?.us_first_work_authorization_date).toBe('2022-07-01');
  });

  it('matches O-1 and EB-1A normalized', () => {
    expect(preGateUSEntryDate(undefined, 'O-1A').ok).toBe(false);
    expect(preGateUSEntryDate(undefined, 'eb-1a').ok).toBe(false);
  });

  it('passes for samola_de_oliveira_simao (consular_processing_outside_us, no dates required)', () => {
    const r = preGateUSEntryDate('samola_de_oliveira_simao', 'EB-2 NIW');
    expect(r.ok).toBe(true);
    expect(r.timeline?.entry_status).toBe('consular_processing_outside_us');
  });

  it('skips gate for non-allowed docType (testimony, methodology, RFE, etc.)', () => {
    // Even with a missing master_facts, gate is bypassed for non-allowed docTypes
    expect(preGateUSEntryDate('nonexistent_xyz', 'EB-2 NIW', 'testimony_letter').ok).toBe(true);
    expect(preGateUSEntryDate('nonexistent_xyz', 'EB-1A', 'methodology').ok).toBe(true);
    expect(preGateUSEntryDate('nonexistent_xyz', 'EB-2 NIW', 'rfe_response').ok).toBe(true);
    expect(preGateUSEntryDate(undefined, 'EB-2 NIW', 'photo_report').ok).toBe(true);
  });

  it('still gates for allowed docType with missing master_facts', () => {
    const r = preGateUSEntryDate('nonexistent_xyz', 'EB-2 NIW', 'cover_letter_eb2_niw');
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/ausente OU sem us_timeline/);
  });

  it('still gates for allowed docType business_plan / resume_eb1a / anteprojeto', () => {
    expect(preGateUSEntryDate('nonexistent_xyz', 'EB-2 NIW', 'business_plan').ok).toBe(false);
    expect(preGateUSEntryDate('nonexistent_xyz', 'EB-1A', 'resume_eb1a').ok).toBe(false);
    expect(preGateUSEntryDate('nonexistent_xyz', 'EB-2 NIW', 'anteprojeto_eb2_niw').ok).toBe(false);
    expect(preGateUSEntryDate('nonexistent_xyz', 'EB-1A', 'projeto_base_eb1a').ok).toBe(false);
  });

  it('passes for allowed docType when master_facts is valid', () => {
    const r = preGateUSEntryDate('marcio_elias_barbosa', 'EB-2 NIW', 'cover_letter_eb2_niw');
    expect(r.ok).toBe(true);
    expect(r.timeline?.us_entry_date).toBe('2019-08-01');
  });

  it('docType undefined preserves legacy behavior (visaType-only gate)', () => {
    // Backward compat for callers not yet passing docType
    expect(preGateUSEntryDate(undefined, 'EB-2 NIW').ok).toBe(false);
    expect(preGateUSEntryDate('marcio_elias_barbosa', 'EB-2 NIW').ok).toBe(true);
  });

  it('passes for in_us_pending_work_authorization with both dates null', () => {
    // Gustavo's case: status pending, no entry stamps OCR'able, no EAD yet.
    // Pré-gate must accept; cláusula pétrea operates at runtime via scanUSEntryDateViolations.
    const r = preGateUSEntryDate('gustavo_nelson_sales_chaves', 'EB-1A', 'cover_letter_eb1a');
    expect(r.ok).toBe(true);
    expect(r.timeline?.entry_status).toBe('in_us_pending_work_authorization');
    expect(r.timeline?.us_first_work_authorization_date).toBeFalsy();
  });

  it('passes for in_us_pending_work_authorization with us_entry_date null', () => {
    // Marcelo's case: status pending, no EAD (status definition), no entry date OCR'd.
    const r = preGateUSEntryDate('marcelo_jacob', 'EB-1A', 'cover_letter_eb1a');
    expect(r.ok).toBe(true);
    expect(r.timeline?.entry_status).toBe('in_us_pending_work_authorization');
  });
});

describe('scanUSEntryDateViolations', () => {
  it('returns ok when text has no US-context dates', () => {
    const r = scanUSEntryDateViolations('Texto puro sem datas relevantes.', TIMELINE);
    expect(r.ok).toBe(true);
    expect(r.violations).toHaveLength(0);
  });

  it('flags work-context date before work authorization', () => {
    const text = 'Em janeiro de 2020, o peticionário implementou um projeto para o cliente nos Estados Unidos.';
    const r = scanUSEntryDateViolations(text, TIMELINE);
    expect(r.ok).toBe(false);
    expect(r.violations.length).toBeGreaterThan(0);
    expect(r.violations[0].violation_type).toBe('before_work_authorization');
  });

  it('flags work-context date before US entry', () => {
    const text = 'Em janeiro de 2018 o peticionário trabalhou para um cliente americano em Miami.';
    const r = scanUSEntryDateViolations(text, TIMELINE);
    expect(r.ok).toBe(false);
    expect(r.violations[0].violation_type).toBe('before_entry');
  });

  it('passes when work date is after authorization', () => {
    const text = 'Em outubro de 2023 o peticionário implementou um projeto para o cliente Collect Call em Florida.';
    const r = scanUSEntryDateViolations(text, TIMELINE);
    expect(r.ok).toBe(true);
  });

  it('ignores dates inside URLs (false-positive shield)', () => {
    const text = 'Veja Florida Bar Ethics em https://www.floridabar.org/uploads/2021/06/Nonlawyer.pdf — material para clientes.';
    const r = scanUSEntryDateViolations(text, TIMELINE);
    expect(r.ok).toBe(true);
  });

  it('does not flag Brazilian-context dates', () => {
    const text = 'Em janeiro de 2010 o peticionário trabalhou para um cliente no Brasil em São Paulo.';
    const r = scanUSEntryDateViolations(text, TIMELINE);
    expect(r.ok).toBe(true);
  });

  it('consular_processing_outside_us flags ANY US-work date (no permission ever)', () => {
    const cpTimeline: USTimeline = { entry_status: 'consular_processing_outside_us' };
    // CP — pode citar empresa nos EUA mas NÃO pode citar trabalho ativo dela lá
    const benignText = 'A peticionária constituiu a Apex Executive Governance LLC em Florida.';
    expect(scanUSEntryDateViolations(benignText, cpTimeline).ok).toBe(true);
    // Mas qualquer trabalho remunerado nos EUA com data é violação
    const badText = 'Em março de 2024 a peticionária implementou um projeto para um cliente em Florida.';
    const r = scanUSEntryDateViolations(badText, cpTimeline);
    expect(r.ok).toBe(false);
    expect(r.violations[0].violation_type).toBe('before_work_authorization');
  });

  it('in_us_pending_work_authorization blocks ALL US-work dates', () => {
    const pendingTimeline: USTimeline = {
      entry_status: 'in_us_pending_work_authorization',
      us_entry_date: '2023-06-01',
    };
    const text = 'Em outubro de 2024 o peticionário implementou um projeto para um cliente em Miami.';
    const r = scanUSEntryDateViolations(text, pendingTimeline);
    expect(r.ok).toBe(false);
  });
});
