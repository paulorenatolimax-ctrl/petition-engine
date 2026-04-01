import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'clients.json');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readClients(): any[] {
  if (!existsSync(DATA_FILE)) return [];
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function writeClients(clients: any[]) {
  writeFileSync(DATA_FILE, JSON.stringify(clients, null, 2), 'utf-8');
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const clients = readClients();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = clients.find((c: any) => c.id === params.id);
  if (!client) {
    return NextResponse.json({ error: 'Cliente nao encontrado' }, { status: 404 });
  }
  return NextResponse.json({ data: client });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const clients = readClients();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const idx = clients.findIndex((c: any) => c.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Cliente nao encontrado' }, { status: 404 });
  }
  clients[idx] = { ...clients[idx], ...body };
  writeClients(clients);
  return NextResponse.json({ data: clients[idx] });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const clients = readClients();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const idx = clients.findIndex((c: any) => c.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Cliente nao encontrado' }, { status: 404 });
  }
  const removed = clients.splice(idx, 1)[0];
  writeClients(clients);
  return NextResponse.json({ data: { deleted: true, id: removed.id, name: removed.name } });
}
