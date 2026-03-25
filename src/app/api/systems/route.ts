import { NextResponse } from 'next/server';

const SYSTEMS = [
  { id: '1', system_name: 'Résumé EB-2 NIW', system_path: '/PROMPTs/_sistema résumé auto/EB2_NIW_RESUME_SYSTEM/', version_tag: '2.0', file_count: 4, file_count_actual: 4, is_active: true, recommended_model: 'claude-sonnet-4', doc_type: 'resume_eb2_niw', symlink_ok: true, created_at: '2026-03-20T10:00:00Z' },
  { id: '2', system_name: 'Résumé EB-1A', system_path: '/PROMPTs/_sistema résumé auto/EB1A_RESUME_SYSTEM/', version_tag: '1.0', file_count: 9, file_count_actual: 9, is_active: true, recommended_model: 'claude-sonnet-4', doc_type: 'resume', symlink_ok: true, created_at: '2026-03-20T10:00:00Z' },
  { id: '3', system_name: 'Cover Letter EB-1A', system_path: '/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5/', version_tag: '5.0', file_count: 24, file_count_actual: 24, is_active: true, recommended_model: 'claude-sonnet-4', doc_type: 'cover_letter_eb1a', symlink_ok: true, created_at: '2026-03-20T10:00:00Z' },
  { id: '4', system_name: 'Cover Letter EB-2 NIW', system_path: '/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions/', version_tag: '3.0', file_count: 18, file_count_actual: 18, is_active: true, recommended_model: 'claude-sonnet-4', doc_type: 'cover_letter_eb2_niw', symlink_ok: true, created_at: '2026-03-20T10:00:00Z' },
  { id: '5', system_name: 'Business Plan', system_path: '/Claude/Projects/C.P/docs/', version_tag: '6.0', file_count: 4, file_count_actual: 4, is_active: true, recommended_model: 'claude-opus-4', doc_type: 'business_plan', symlink_ok: true, created_at: '2026-03-20T10:00:00Z' },
  { id: '6', system_name: 'Metodologia', system_path: '/_V2 Met e Dec (2026)/METODOLOGIA (PROMPTS)/', version_tag: '2.1', file_count: 5, file_count_actual: 5, is_active: true, recommended_model: 'claude-sonnet-4', doc_type: 'methodology', symlink_ok: true, created_at: '2026-03-20T10:00:00Z' },
  { id: '7', system_name: 'Declaração de Intenções', system_path: '/_V2 Met e Dec (2026)/Declaração de Intenções (PROMPTS)/', version_tag: '2.1', file_count: 6, file_count_actual: 6, is_active: true, recommended_model: 'claude-sonnet-4', doc_type: 'declaration_of_intentions', symlink_ok: true, created_at: '2026-03-20T10:00:00Z' },
  { id: '8', system_name: 'IMPACTO®', system_path: '/_PRODUTO NOVO/agents/', version_tag: '1.0', file_count: 9, file_count_actual: 9, is_active: true, recommended_model: 'claude-opus-4', doc_type: 'impacto_report', symlink_ok: true, created_at: '2026-03-20T10:00:00Z' },
  { id: '9', system_name: 'Estratégia EB-2 NIW', system_path: '/PROMPTs/EB-2 - ESTRATÉGIAS/', version_tag: '1.0', file_count: 9, file_count_actual: 9, is_active: true, recommended_model: 'claude-opus-4', doc_type: 'strategy_eb2', symlink_ok: true, created_at: '2026-03-20T10:00:00Z' },
  { id: '10', system_name: 'Estratégia EB-1A', system_path: '/PROMPTs/EB-1 - ESTRATÉGIA EB-1 (PROMPTS)/', version_tag: '1.0', file_count: 3, file_count_actual: 3, is_active: true, recommended_model: 'claude-opus-4', doc_type: 'strategy_eb1', symlink_ok: true, created_at: '2026-03-20T10:00:00Z' },
  { id: '11', system_name: 'Localização', system_path: '/PROMPTs/LOCALIZAÇÃO - PROMPT/', version_tag: '1.0', file_count: 2, file_count_actual: 2, is_active: true, recommended_model: 'gemini-2.0-flash', doc_type: 'location_analysis', symlink_ok: true, created_at: '2026-03-20T10:00:00Z' },
  { id: '12', system_name: 'Pareceres da Qualidade', system_path: '/Pareceres da Qualidade/', version_tag: '1.0', file_count: 1, file_count_actual: 1, is_active: true, recommended_model: 'claude-sonnet-4', doc_type: 'quality_report', symlink_ok: true, created_at: '2026-03-20T10:00:00Z' },
  { id: '13', system_name: 'Cartas Satélite', system_path: '/PROMPTs/Cartas Satélite/', version_tag: '0.9', file_count: 0, file_count_actual: 0, is_active: false, recommended_model: 'claude-sonnet-4', doc_type: 'satellite_letter', symlink_ok: false, created_at: '2026-03-20T10:00:00Z' },
  { id: '14', system_name: 'Cartas EB-1 v2.0', system_path: '/PROMPTs/_Sistema Produtor de Cartas EB-1/', version_tag: '2.0', file_count: 6, file_count_actual: 6, is_active: true, recommended_model: 'claude-sonnet-4', doc_type: 'eb1_letters', symlink_ok: true, created_at: '2026-03-24T10:00:00Z' },
];

export async function GET() {
  return NextResponse.json({ data: SYSTEMS });
}
