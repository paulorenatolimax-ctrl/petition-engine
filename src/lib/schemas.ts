import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  visa_type: z.enum(['EB-1A', 'EB-2-NIW', 'O-1', 'L-1', 'EB-1C']),
  proposed_endeavor: z.string().optional(),
  soc_code: z.string().optional(),
  soc_title: z.string().optional(),
  location_city: z.string().optional(),
  location_state: z.string().optional(),
  company_name: z.string().optional(),
  company_type: z.string().optional(),
  naics_code: z.string().optional(),
  notes: z.string().optional(),
  docs_folder_path: z.string().optional(),
  drive_folder_url: z.string().url().optional().or(z.literal('')),
  case_number: z.string().optional(),
  previous_petition_denied: z.boolean().optional().default(false),
  denial_reasons: z.string().optional(),
  priority: z.enum(['urgent', 'high', 'normal', 'low']).optional().default('normal'),
});

export const generateSchema = z.object({
  client_id: z.string().uuid(),
  doc_type: z.enum([
    'resume', 'cover_letter_eb1a', 'cover_letter_eb2_niw', 'cover_letter_o1',
    'business_plan', 'methodology', 'declaration_of_intentions',
    'anteprojeto', 'location_analysis', 'impacto_report',
    'satellite_letter', 'photographic_report', 'rfe_response',
    'strategy_eb1', 'strategy_eb2',
  ]),
  doc_subtype: z.string().optional(),
  config: z.object({
    skip_quality: z.boolean().optional(),
    skip_uscis: z.boolean().optional(),
    include_thumbnails: z.boolean().optional(),
    language: z.enum(['pt-BR', 'en-US']).optional(),
  }).optional(),
});
