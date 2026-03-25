import { NextRequest, NextResponse } from 'next/server';

const MOCK_CLIENTS = [
  {
    id: 'c1',
    name: 'Deni Ruben Moreira',
    email: 'deni@drmsolutions.com',
    visa_type: 'EB-2-NIW',
    status: 'active',
    company_name: 'DRM Solutions LLC',
    created_at: '2026-03-15T10:00:00Z',
    client_profiles: { extracted_at: '2026-03-16T10:00:00Z' },
  },
  {
    id: 'c2',
    name: 'Rafael Almeida Santos',
    email: 'rafael@example.com',
    visa_type: 'EB-2-NIW',
    status: 'completed',
    company_name: 'Tech Solutions Inc',
    created_at: '2025-11-10T10:00:00Z',
    client_profiles: { extracted_at: '2025-11-12T10:00:00Z' },
  },
  {
    id: 'c3',
    name: 'Renato Silveira dos Reis',
    email: 'renato@example.com',
    visa_type: 'EB-1A',
    status: 'active',
    company_name: null,
    created_at: '2025-09-05T10:00:00Z',
    client_profiles: { extracted_at: '2025-09-06T10:00:00Z' },
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const visaType = searchParams.get('visa_type') || '';

  let filtered = MOCK_CLIENTS;
  if (search) {
    filtered = filtered.filter(c => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search));
  }
  if (visaType) {
    filtered = filtered.filter(c => c.visa_type === visaType);
  }

  return NextResponse.json({ data: filtered });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newClient = {
    id: `c${Date.now()}`,
    ...body,
    status: 'active',
    created_at: new Date().toISOString(),
    client_profiles: null,
  };
  return NextResponse.json({ data: newClient }, { status: 201 });
}
