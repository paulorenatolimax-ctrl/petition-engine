import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'clients.json');

const SEED_CLIENTS = [
  { id: 'c1', name: 'Deni Ruben Moreira', email: 'deni@drmsolutions.com', visa_type: 'EB-2-NIW', status: 'active', company_name: 'DRM Solutions LLC', docs_folder_path: '/Users/paulo1844/Documents/2_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/Deni Rubens (Direto)/', created_at: '2026-03-15T10:00:00Z', client_profiles: { extracted_at: '2026-03-16T10:00:00Z' } },
  { id: 'c2', name: 'Rafael Almeida Santos', email: 'rafael@example.com', visa_type: 'EB-2-NIW', status: 'completed', company_name: 'Tech Solutions Inc', docs_folder_path: '', created_at: '2025-11-10T10:00:00Z', client_profiles: { extracted_at: '2025-11-12T10:00:00Z' } },
  { id: 'c3', name: 'Renato Silveira dos Reis', email: 'renato@example.com', visa_type: 'EB-1A', status: 'active', company_name: '', docs_folder_path: '', created_at: '2025-09-05T10:00:00Z', client_profiles: { extracted_at: '2025-09-06T10:00:00Z' } },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readClients(): any[] {
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify(SEED_CLIENTS, null, 2), 'utf-8');
    return SEED_CLIENTS;
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function writeClients(clients: any[]) {
  writeFileSync(DATA_FILE, JSON.stringify(clients, null, 2), 'utf-8');
}

export async function GET(req: NextRequest) {
  const clients = readClients();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const visaType = searchParams.get('visa_type') || '';

  let filtered = clients;
  if (search) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filtered = filtered.filter((c: any) =>
      c.name.toLowerCase().includes(search) ||
      (c.email || '').toLowerCase().includes(search)
    );
  }
  if (visaType) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filtered = filtered.filter((c: any) => c.visa_type === visaType);
  }

  return NextResponse.json({ data: filtered });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.visa_type) {
    return NextResponse.json({ error: 'Nome e tipo de visto sao obrigatorios' }, { status: 400 });
  }

  const clients = readClients();
  const newClient = {
    id: `c${Date.now()}`,
    name: body.name,
    email: body.email || '',
    visa_type: body.visa_type,
    status: 'active',
    company_name: body.company_name || '',
    docs_folder_path: body.docs_folder_path || '',
    created_at: new Date().toISOString(),
    client_profiles: null,
  };

  clients.push(newClient);
  writeClients(clients);

  return NextResponse.json({ data: newClient }, { status: 201 });
}
