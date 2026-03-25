import { NextRequest, NextResponse } from 'next/server';

const MOCK_CLIENTS: Record<string, any> = {
  c1: {
    id: 'c1',
    name: 'Deni Ruben Moreira',
    email: 'deni@drmsolutions.com',
    visa_type: 'EB-2-NIW',
    status: 'active',
    company_name: 'DRM Solutions LLC',
    proposed_endeavor: 'Solucoes Integradas de Transformacao Digital para PMEs Americanas',
    soc_code: '15-1252',
    soc_title: 'Software Developers',
    location_city: 'Dallas-Fort Worth',
    location_state: 'TX',
    docs_folder_path: '/Users/paulo1844/Documents/_PROEX/_2. MEUS CASOS/2026/Deni Rubens (Direto)/',
    notes: 'Refile EB-2 NIW. NAICS 541610.',
    created_at: '2026-03-15T10:00:00Z',
    client_profiles: {
      extracted_at: '2026-03-16T10:00:00Z',
      full_name: 'Deni Ruben Moreira',
      nationality: 'Brazilian',
      education: [{ degree: 'MBA', institution: 'FGV', year: 2018 }],
      work_experience: [{ title: 'CEO', company: 'DRM Solutions LLC', years: 5 }],
      total_years_experience: 12,
      publications: [],
      awards: [{ title: 'Top Innovator Dallas 2025' }],
      total_evidence_count: 14,
      eb1a_criteria: {},
      dhanasar_pillars: { prong1: 'substantial_merit', prong2: 'national_scope', prong3: 'waiver_justified' },
    },
    documents: [
      { id: 'd1', doc_type: 'resume_eb2_niw', version: 2, status: 'approved', quality_passed: true, generated_at: '2026-03-22T10:00:00Z' },
      { id: 'd2', doc_type: 'cover_letter_eb2_niw', version: 2, status: 'review', quality_passed: null, generated_at: '2026-03-23T10:00:00Z' },
      { id: 'd3', doc_type: 'business_plan', version: 1, status: 'rejected', quality_passed: false, generated_at: '2026-03-22T10:00:00Z' },
    ],
    activity_log: [
      { id: 'a1', action: 'cover_letter_generated', details: { version: 2 }, created_at: '2026-03-23T10:00:00Z' },
      { id: 'a2', action: 'resume_generated', details: { version: 2 }, created_at: '2026-03-22T10:00:00Z' },
      { id: 'a3', action: 'profile_extracted', details: {}, created_at: '2026-03-16T10:00:00Z' },
    ],
  },
  c2: {
    id: 'c2',
    name: 'Rafael Almeida Santos',
    email: 'rafael@example.com',
    visa_type: 'EB-2-NIW',
    status: 'completed',
    company_name: 'Tech Solutions Inc',
    proposed_endeavor: null,
    soc_code: null,
    soc_title: null,
    location_city: null,
    location_state: null,
    docs_folder_path: null,
    notes: null,
    created_at: '2025-11-10T10:00:00Z',
    client_profiles: { extracted_at: '2025-11-12T10:00:00Z', full_name: 'Rafael Almeida Santos', nationality: 'Brazilian', education: [], work_experience: [], total_years_experience: 8, publications: [], awards: [], total_evidence_count: 10, eb1a_criteria: {}, dhanasar_pillars: {} },
    documents: [{ id: 'd10', doc_type: 'resume_eb2_niw', version: 4, status: 'approved', quality_passed: true, generated_at: '2025-12-01T10:00:00Z' }],
    activity_log: [],
  },
  c3: {
    id: 'c3',
    name: 'Renato Silveira dos Reis',
    email: 'renato@example.com',
    visa_type: 'EB-1A',
    status: 'active',
    company_name: null,
    proposed_endeavor: null,
    soc_code: null,
    soc_title: null,
    location_city: null,
    location_state: null,
    docs_folder_path: null,
    notes: null,
    created_at: '2025-09-05T10:00:00Z',
    client_profiles: { extracted_at: '2025-09-06T10:00:00Z', full_name: 'Renato Silveira dos Reis', nationality: 'Brazilian', education: [], work_experience: [], total_years_experience: 15, publications: [{ title: 'Research Paper 1' }], awards: [], total_evidence_count: 8, eb1a_criteria: {}, dhanasar_pillars: {} },
    documents: [{ id: 'd20', doc_type: 'cover_letter_eb1a', version: 1, status: 'approved', quality_passed: true, generated_at: '2025-10-15T10:00:00Z' }],
    activity_log: [],
  },
};

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const client = MOCK_CLIENTS[params.id];
  if (!client) {
    return NextResponse.json({ error: 'Cliente nao encontrado' }, { status: 404 });
  }
  return NextResponse.json({ data: client });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  return NextResponse.json({ data: { id: params.id, ...body, updated: true } });
}
