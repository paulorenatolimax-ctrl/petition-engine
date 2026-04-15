import { describe, it, expect } from 'vitest';
import {
  getPipelineType,
  MULTI_PHASE_DOC_TYPES,
  THUMBNAIL_DOC_TYPES,
  QUALITY_GATE_DOC_TYPES,
} from '@/lib/pipelines/registry';

describe('Pipeline Registry', () => {
  it('routes cover_letter_eb1a to its pipeline', () => {
    expect(getPipelineType('cover_letter_eb1a')).toBe('cover_letter_eb1a');
  });

  it('routes cover_letter_eb2_niw to its pipeline', () => {
    expect(getPipelineType('cover_letter_eb2_niw')).toBe('cover_letter_eb2_niw');
  });

  it('routes unknown doc types to generic', () => {
    expect(getPipelineType('resume_eb2_niw')).toBe('generic');
    expect(getPipelineType('business_plan')).toBe('generic');
    expect(getPipelineType('saas_evidence')).toBe('generic');
    expect(getPipelineType('anteprojeto_eb2_niw')).toBe('generic');
  });

  it('MULTI_PHASE_DOC_TYPES contains only cover letters', () => {
    expect(MULTI_PHASE_DOC_TYPES).toContain('cover_letter_eb1a');
    expect(MULTI_PHASE_DOC_TYPES).toContain('cover_letter_eb2_niw');
    expect(MULTI_PHASE_DOC_TYPES.length).toBe(2);
  });

  it('THUMBNAIL_DOC_TYPES includes resumes and cover letters', () => {
    expect(THUMBNAIL_DOC_TYPES).toContain('resume_eb2_niw');
    expect(THUMBNAIL_DOC_TYPES).toContain('resume_eb1a');
    expect(THUMBNAIL_DOC_TYPES).toContain('cover_letter_eb1a');
  });

  it('QUALITY_GATE_DOC_TYPES includes resumes and cover letters', () => {
    expect(QUALITY_GATE_DOC_TYPES).toContain('resume_eb2_niw');
    expect(QUALITY_GATE_DOC_TYPES).toContain('resume_eb1a');
  });
});
