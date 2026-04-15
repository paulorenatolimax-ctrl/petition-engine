/**
 * Pipeline Registry — Factory Method pattern (Sandeco Ch. 4.4)
 *
 * Maps document types to their generation pipelines.
 * Adding a new document type = adding one entry here.
 * No more if/else chains in execute/route.ts.
 */

export type PipelineType = 'cover_letter_eb1a' | 'cover_letter_eb2_niw' | 'generic';

/**
 * Determine which pipeline to use for a given document type.
 */
export function getPipelineType(docType: string): PipelineType {
  switch (docType) {
    case 'cover_letter_eb1a':
      return 'cover_letter_eb1a';
    case 'cover_letter_eb2_niw':
      return 'cover_letter_eb2_niw';
    default:
      return 'generic';
  }
}

/**
 * Document types that use multi-phase pipelines.
 * All others use the generic single-session pipeline.
 */
export const MULTI_PHASE_DOC_TYPES = [
  'cover_letter_eb1a',
  'cover_letter_eb2_niw',
] as const;

/**
 * Document types that require thumbnail insertion post-generation.
 */
export const THUMBNAIL_DOC_TYPES = [
  'resume_eb2_niw',
  'resume_eb1a',
  'cover_letter_eb1a',
  'cover_letter_eb2_niw',
] as const;

/**
 * Document types that require the Python quality gate (DOCX formatting checks).
 */
export const QUALITY_GATE_DOC_TYPES = [
  'resume_eb2_niw',
  'resume_eb1a',
  'cover_letter_eb1a',
  'cover_letter_eb2_niw',
] as const;
