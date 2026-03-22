# 04 — API ROUTES

Todas as API routes ficam em `src/app/api/`. Usam Next.js 14 App Router (Route Handlers).

## Padrão Geral

```typescript
// src/app/api/[recurso]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  // ...
  return NextResponse.json({ data }, { status: 200 });
}
```

**Headers padrão em todas as respostas:**
```typescript
const headers = {
  'Content-Type': 'application/json',
  'X-Petition-Engine': 'v1',
};
```

---

## 1. `/api/clients` — Gestão de Clientes

### GET `/api/clients`

Lista todos os clientes com filtros opcionais.

```typescript
// Query params
interface ClientsQuery {
  status?: 'active' | 'completed' | 'on_hold' | 'cancelled';
  visa_type?: 'EB-1A' | 'EB-2-NIW' | 'O-1' | 'L-1' | 'EB-1C';
  search?: string; // busca por nome, email, empresa
  page?: number;   // paginação (default: 1)
  limit?: number;  // itens por página (default: 20)
}

// Response
interface ClientsResponse {
  data: Client[];
  total: number;
  page: number;
  totalPages: number;
}
```

**Implementação:**
```typescript
export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);

  const status = searchParams.get('status');
  const visa_type = searchParams.get('visa_type');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  let query = supabase
    .from('clients')
    .select('*, client_profiles(*)', { count: 'exact' });

  if (status) query = query.eq('status', status);
  if (visa_type) query = query.eq('visa_type', visa_type);
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    data,
    total: count,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
```

### POST `/api/clients`

Cria novo cliente.

```typescript
// Body
interface CreateClientBody {
  name: string;
  email?: string;
  phone?: string;
  visa_type: 'EB-1A' | 'EB-2-NIW' | 'O-1' | 'L-1' | 'EB-1C';
  proposed_endeavor?: string;
  soc_code?: string;
  soc_title?: string;
  location_city?: string;
  location_state?: string;
  company_name?: string;
  company_type?: string;
  naics_code?: string;
  notes?: string;
  docs_folder_path?: string;
  drive_folder_url?: string;
}
```

**Implementação:**
```typescript
export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();

  // Validação com Zod
  const parsed = createClientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('clients')
    .insert(parsed.data)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Criar perfil vazio associado
  await supabase.from('client_profiles').insert({ client_id: data.id });

  // Log de atividade
  await supabase.from('activity_log').insert({
    client_id: data.id,
    action: 'client_created',
    details: { visa_type: data.visa_type },
  });

  return NextResponse.json({ data }, { status: 201 });
}
```

### GET `/api/clients/[id]`

```typescript
// src/app/api/clients/[id]/route.ts
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      client_profiles(*),
      documents(*, quality_score, uscis_risk_score),
      activity_log(*)
    `)
    .eq('id', params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}
```

### PATCH `/api/clients/[id]`

Atualização parcial do cliente.

```typescript
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from('clients')
    .update(body)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
```

---

## 2. `/api/clients/[id]/extract` — Agente Extrator

### POST `/api/clients/[id]/extract`

Executa o Agente Extrator no diretório de documentos do cliente.

```typescript
// Body (opcional — se não enviado, usa docs_folder_path do client)
interface ExtractBody {
  folder_path?: string;    // override do caminho
  force_reextract?: boolean; // forçar re-extração mesmo se já existe perfil
}

// Response (streaming via SSE)
// Content-Type: text/event-stream
// event: progress
// data: {"step": "reading_files", "current": 3, "total": 12, "message": "Lendo arquivo: diploma_mestrado.pdf"}
//
// event: complete
// data: {"profile": {...}, "files_processed": 12, "time_seconds": 45}
//
// event: error
// data: {"message": "Erro ao processar arquivo X", "details": "..."}
```

**Implementação:**
```typescript
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();
  const body = await req.json().catch(() => ({}));

  // Buscar cliente
  const { data: client } = await supabase
    .from('clients')
    .select('*, client_profiles(*)')
    .eq('id', params.id)
    .single();

  if (!client) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });

  const folderPath = body.folder_path || client.docs_folder_path;
  if (!folderPath) {
    return NextResponse.json({ error: 'Nenhum caminho de documentos configurado' }, { status: 400 });
  }

  // Verificar se já tem perfil e não forçou re-extração
  if (client.client_profiles && !body.force_reextract) {
    return NextResponse.json({
      error: 'Perfil já extraído. Use force_reextract: true para re-extrair.',
      existing_profile: client.client_profiles,
    }, { status: 409 });
  }

  // Criar stream SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const { ExtractorAgent } = await import('@/agents/extractor');
        const extractor = new ExtractorAgent(supabase);

        const profile = await extractor.extract(client, folderPath, (progress) => {
          send('progress', progress);
        });

        send('complete', { profile, time_seconds: profile._extraction_time });
      } catch (err: any) {
        send('error', { message: err.message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
```

---

## 3. `/api/generate` — Geração de Documentos

### POST `/api/generate`

Endpoint central de geração. Aceita qualquer tipo de documento.

```typescript
// Body
interface GenerateBody {
  client_id: string;
  doc_type:
    | 'resume'
    | 'cover_letter_eb1a'
    | 'cover_letter_eb2_niw'
    | 'cover_letter_o1'
    | 'business_plan'
    | 'methodology'
    | 'declaration_of_intentions'
    | 'anteprojeto'
    | 'location_analysis'
    | 'impacto_report'
    | 'satellite_letter'
    | 'photographic_report'
    | 'rfe_response'
    | 'strategy_eb1'
    | 'strategy_eb2';
  doc_subtype?: string;  // para satellite: 'investor_pj', 'strategic_partner', etc.
  config?: {
    model_override?: string;     // forçar modelo específico
    skip_quality?: boolean;      // pular validação (debug)
    skip_uscis?: boolean;        // pular revisão USCIS
    include_thumbnails?: boolean; // gerar thumbnails de evidências
    template_override?: string;  // template DOCX customizado
    language?: 'pt-BR' | 'en-US'; // idioma do documento
  };
}

// Response (streaming via SSE)
// event: stage
// data: {"stage": "reading_system", "message": "Carregando sistema Cover Letter EB-1A v5..."}
//
// event: stage
// data: {"stage": "mounting_prompt", "message": "Montando prompt com perfil do cliente..."}
//
// event: stage
// data: {"stage": "calling_llm", "message": "Chamando Claude Sonnet 4..."}
//
// event: stage
// data: {"stage": "generating_docx", "message": "Gerando DOCX formatado..."}
//
// event: stage
// data: {"stage": "quality_check", "message": "Executando validação de qualidade..."}
//
// event: stage
// data: {"stage": "uscis_review", "message": "Simulando revisão USCIS..."}
//
// event: quality
// data: {"score": 94, "passed": true, "issues": [...]}
//
// event: uscis
// data: {"overall": "green", "criteria": {"C1": "green", "C2": "yellow", ...}}
//
// event: complete
// data: {"document_id": "uuid", "file_path": "/path/to/output.docx", "version": 3, ...}
```

**Implementação:**
```typescript
export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body: GenerateBody = await req.json();

  // Validação
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Buscar cliente + perfil
  const { data: client } = await supabase
    .from('clients')
    .select('*, client_profiles(*)')
    .eq('id', body.client_id)
    .single();

  if (!client) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
  if (!client.client_profiles) {
    return NextResponse.json({ error: 'Perfil não extraído. Execute /api/clients/[id]/extract primeiro.' }, { status: 400 });
  }

  // Registrar na fila
  const { data: queueItem } = await supabase
    .from('generation_queue')
    .insert({
      client_id: body.client_id,
      doc_type: body.doc_type,
      doc_subtype: body.doc_subtype,
      priority: 5,
      status: 'processing',
      config: body.config || {},
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  // Stream de geração
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const { Orchestrator } = await import('@/lib/orchestrator');
        const orchestrator = new Orchestrator(supabase);

        const result = await orchestrator.generate({
          client,
          profile: client.client_profiles,
          docType: body.doc_type,
          docSubtype: body.doc_subtype,
          config: body.config || {},
          onProgress: (stage, message) => send('stage', { stage, message }),
          onQuality: (report) => send('quality', report),
          onUSCIS: (review) => send('uscis', review),
        });

        // Atualizar fila
        await supabase.from('generation_queue').update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          document_id: result.document_id,
        }).eq('id', queueItem!.id);

        send('complete', result);
      } catch (err: any) {
        // Registrar falha
        await supabase.from('generation_queue').update({
          status: 'failed',
          error_message: err.message,
        }).eq('id', queueItem!.id);

        send('error', { message: err.message, stack: err.stack });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
```

### GET `/api/generate/queue`

Lista a fila de geração.

```typescript
export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status'); // 'queued' | 'processing' | 'completed' | 'failed'

  let query = supabase
    .from('generation_queue')
    .select('*, clients(name, visa_type), documents(*)');

  if (status) query = query.eq('status', status);

  const { data, error } = await query.order('queued_at', { ascending: false }).limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
```

---

## 4. `/api/quality` — Relatórios de Qualidade

### GET `/api/quality/[document_id]`

Retorna relatório de qualidade detalhado de um documento.

```typescript
export async function GET(
  req: NextRequest,
  { params }: { params: { document_id: string } }
) {
  const supabase = createServerClient();

  const { data: doc } = await supabase
    .from('documents')
    .select('*, clients(name, visa_type)')
    .eq('id', params.document_id)
    .single();

  if (!doc) return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 });

  return NextResponse.json({
    document: doc,
    quality: doc.quality_score,
    quality_passed: doc.quality_passed,
    quality_notes: doc.quality_notes,
    uscis_risk: doc.uscis_risk_score,
  });
}
```

### POST `/api/quality/recheck`

Re-executa validação de qualidade em documento existente.

```typescript
// Body
interface RecheckBody {
  document_id: string;
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const { document_id } = await req.json();

  const { data: doc } = await supabase
    .from('documents')
    .select('*, clients(*, client_profiles(*))')
    .eq('id', document_id)
    .single();

  if (!doc) return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 });

  const { QualityAgent } = await import('@/agents/quality');
  const quality = new QualityAgent(supabase);
  const report = await quality.validate(doc);

  // Atualizar documento
  await supabase.from('documents').update({
    quality_score: report.score_details,
    quality_passed: report.passed,
    quality_notes: report.notes,
  }).eq('id', document_id);

  // Log
  await supabase.from('activity_log').insert({
    client_id: doc.client_id,
    document_id: document_id,
    action: report.passed ? 'quality_passed' : 'quality_failed',
    details: report,
  });

  return NextResponse.json({ report });
}
```

### GET `/api/quality/stats`

Estatísticas agregadas de qualidade.

```typescript
export async function GET(req: NextRequest) {
  const supabase = createServerClient();

  // Total de documentos por status de qualidade
  const { data: docs } = await supabase
    .from('documents')
    .select('doc_type, quality_passed, quality_score');

  const stats = {
    total_documents: docs?.length || 0,
    passed: docs?.filter(d => d.quality_passed === true).length || 0,
    failed: docs?.filter(d => d.quality_passed === false).length || 0,
    pending: docs?.filter(d => d.quality_passed === null).length || 0,
    average_score: 0,
    by_doc_type: {} as Record<string, { total: number; passed: number; avg_score: number }>,
  };

  // Calcular média e stats por tipo
  const scores = docs?.filter(d => d.quality_score?.overall).map(d => d.quality_score.overall) || [];
  stats.average_score = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  // Agrupar por doc_type
  docs?.forEach(d => {
    if (!stats.by_doc_type[d.doc_type]) {
      stats.by_doc_type[d.doc_type] = { total: 0, passed: 0, avg_score: 0 };
    }
    stats.by_doc_type[d.doc_type].total++;
    if (d.quality_passed) stats.by_doc_type[d.doc_type].passed++;
  });

  return NextResponse.json({ stats });
}
```

---

## 5. `/api/errors` — Regras de Erro & Auto-Aprendizado

### GET `/api/errors`

Lista todas as regras de erro.

```typescript
// Query params
interface ErrorsQuery {
  active?: boolean;
  rule_type?: string;
  doc_type?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  sort?: 'times_triggered' | 'created_at' | 'severity';
}

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);

  let query = supabase.from('error_rules').select('*');

  const active = searchParams.get('active');
  if (active !== null) query = query.eq('active', active === 'true');

  const rule_type = searchParams.get('rule_type');
  if (rule_type) query = query.eq('rule_type', rule_type);

  const doc_type = searchParams.get('doc_type');
  if (doc_type) query = query.eq('doc_type', doc_type);

  const severity = searchParams.get('severity');
  if (severity) query = query.eq('severity', severity);

  const sort = searchParams.get('sort') || 'created_at';
  const { data, error } = await query.order(sort, { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
```

### POST `/api/errors`

Cria nova regra de erro manualmente (Paulo reporta um erro).

```typescript
// Body
interface CreateErrorBody {
  rule_type: 'forbidden_term' | 'formatting' | 'content' | 'logic' | 'legal' | 'terminology' | 'visual';
  doc_type?: string;
  rule_description: string;
  rule_pattern?: string;
  rule_action: 'block' | 'warn' | 'auto_fix';
  auto_fix_replacement?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();

  const { data: rule, error } = await supabase
    .from('error_rules')
    .insert({ ...body, source: 'manual' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Commit no GitHub
  const { commitErrorRule } = await import('@/lib/github');
  const commitSha = await commitErrorRule(rule);

  // Atualizar com SHA do commit
  await supabase.from('error_rules').update({ github_commit_sha: commitSha }).eq('id', rule.id);

  return NextResponse.json({ data: { ...rule, github_commit_sha: commitSha } }, { status: 201 });
}
```

### POST `/api/errors/report`

Reporta um erro encontrado em documento gerado → Agente Auto-Debugger classifica e cria regra.

```typescript
// Body
interface ErrorReportBody {
  document_id: string;
  error_description: string; // texto livre do Paulo
  error_location?: string;   // página, seção, etc.
  screenshot_path?: string;  // se tiver screenshot
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body: ErrorReportBody = await req.json();

  const { data: doc } = await supabase
    .from('documents')
    .select('*, clients(name, visa_type)')
    .eq('id', body.document_id)
    .single();

  if (!doc) return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 });

  // Auto-Debugger classifica e cria regra
  const { AutoDebugger } = await import('@/agents/auto-debugger');
  const debugger_ = new AutoDebugger(supabase);

  const result = await debugger_.processError({
    document: doc,
    errorDescription: body.error_description,
    errorLocation: body.error_location,
  });

  // Log
  await supabase.from('activity_log').insert({
    client_id: doc.client_id,
    document_id: body.document_id,
    action: 'error_reported',
    details: { error: body.error_description, rule_created: result.rule_id },
  });

  return NextResponse.json({ data: result }, { status: 201 });
}
```

### PATCH `/api/errors/[id]`

Atualiza regra (ativar/desativar, mudar severidade, etc.).

```typescript
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from('error_rules')
    .update(body)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
```

### POST `/api/errors/[id]/rollback`

Desativa uma regra que causou regressão.

```typescript
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();

  // Desativar regra
  const { data: rule } = await supabase
    .from('error_rules')
    .update({ active: false })
    .eq('id', params.id)
    .select()
    .single();

  if (!rule) return NextResponse.json({ error: 'Regra não encontrada' }, { status: 404 });

  // Commit de rollback no GitHub
  const { rollbackErrorRule } = await import('@/lib/github');
  const commitSha = await rollbackErrorRule(rule);

  return NextResponse.json({
    message: `Regra "${rule.rule_description}" desativada com sucesso`,
    rollback_commit: commitSha,
  });
}
```

---

## 6. `/api/systems` — Gestão dos Sistemas Instalados

### GET `/api/systems`

Lista todos os sistemas registrados e suas versões.

```typescript
export async function GET(req: NextRequest) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('system_versions')
    .select('*')
    .order('system_name');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Verificar status dos symlinks
  const { checkSymlinks } = await import('@/lib/file-reader');
  const systemsWithStatus = await Promise.all(
    (data || []).map(async (sys) => ({
      ...sys,
      symlink_ok: await checkSymlinks(sys.system_path),
      file_count_actual: await checkSymlinks(sys.system_path) ? await countFiles(sys.system_path) : 0,
    }))
  );

  return NextResponse.json({ data: systemsWithStatus });
}
```

### POST `/api/systems/scan`

Escaneia um diretório de sistema e registra/atualiza.

```typescript
// Body
interface ScanBody {
  system_name: string;
  system_path: string;
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body: ScanBody = await req.json();

  const { scanSystemDirectory } = await import('@/lib/file-reader');
  const scan = await scanSystemDirectory(body.system_path);

  if (!scan.exists) {
    return NextResponse.json({ error: `Diretório não encontrado: ${body.system_path}` }, { status: 404 });
  }

  // Upsert no banco
  const { data, error } = await supabase
    .from('system_versions')
    .upsert({
      system_name: body.system_name,
      system_path: body.system_path,
      version_tag: scan.detected_version || 'unknown',
      file_count: scan.file_count,
      files_hash: scan.hash,
      is_active: true,
    }, { onConflict: 'system_name' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, scan });
}
```

### POST `/api/systems/setup-symlinks`

Cria todos os symlinks do diretório `systems/` baseado nos registros do banco.

```typescript
export async function POST(req: NextRequest) {
  const supabase = createServerClient();

  const { data: systems } = await supabase
    .from('system_versions')
    .select('*')
    .eq('is_active', true);

  const { setupSymlinks } = await import('@/lib/file-reader');
  const results = await setupSymlinks(systems || []);

  return NextResponse.json({ results });
}
```

---

## 7. `/api/documents` — Consulta de Documentos

### GET `/api/documents`

Lista documentos com filtros.

```typescript
export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);

  let query = supabase
    .from('documents')
    .select('*, clients(name, visa_type)');

  const client_id = searchParams.get('client_id');
  if (client_id) query = query.eq('client_id', client_id);

  const doc_type = searchParams.get('doc_type');
  if (doc_type) query = query.eq('doc_type', doc_type);

  const status = searchParams.get('status');
  if (status) query = query.eq('status', status);

  const { data, error } = await query
    .order('generated_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
```

### PATCH `/api/documents/[id]/status`

Atualiza status do documento (review_pending → approved → delivered).

```typescript
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();
  const { status } = await req.json();

  const updateData: any = { status };
  if (status === 'approved') updateData.reviewed_at = new Date().toISOString();
  if (status === 'delivered') updateData.delivered_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('documents')
    .update(updateData)
    .eq('id', params.id)
    .select('*, clients(name)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log
  await supabase.from('activity_log').insert({
    client_id: data.client_id,
    document_id: params.id,
    action: status === 'approved' ? 'approved' : 'delivered',
  });

  return NextResponse.json({ data });
}
```

---

## 8. `/api/dashboard` — Dados do Dashboard

### GET `/api/dashboard/stats`

Retorna KPIs agregados para o dashboard principal.

```typescript
export async function GET(req: NextRequest) {
  const supabase = createServerClient();

  // Queries paralelas
  const [clientsRes, docsRes, queueRes, errorsRes] = await Promise.all([
    supabase.from('clients').select('status', { count: 'exact' }),
    supabase.from('documents').select('status, doc_type, quality_passed, generated_at'),
    supabase.from('generation_queue').select('status', { count: 'exact' }).eq('status', 'processing'),
    supabase.from('error_rules').select('severity, times_triggered', { count: 'exact' }).eq('active', true),
  ]);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentDocs = docsRes.data?.filter(d => new Date(d.generated_at) > thirtyDaysAgo) || [];

  return NextResponse.json({
    clients: {
      total: clientsRes.count || 0,
      active: clientsRes.data?.filter(c => c.status === 'active').length || 0,
    },
    documents: {
      total: docsRes.data?.length || 0,
      last_30_days: recentDocs.length,
      quality_pass_rate: calculatePassRate(docsRes.data || []),
    },
    queue: {
      processing: queueRes.count || 0,
    },
    errors: {
      active_rules: errorsRes.count || 0,
      total_triggers: errorsRes.data?.reduce((sum, r) => sum + r.times_triggered, 0) || 0,
      critical: errorsRes.data?.filter(r => r.severity === 'critical').length || 0,
    },
  });
}
```

---

## Middleware & Utilitários

### Rate Limiting (opcional)

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map<string, { count: number; resetAt: number }>();

export function middleware(request: NextRequest) {
  // Apenas para rotas API
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Rate limit simples (100 req/min por IP)
  const ip = request.ip || 'localhost';
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 });
  } else if (entry.count >= 100) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  } else {
    entry.count++;
  }

  return NextResponse.next();
}
```

### Error Handler Global

```typescript
// src/lib/api-helpers.ts
export function apiError(message: string, status: number = 500) {
  return NextResponse.json(
    { error: message, timestamp: new Date().toISOString() },
    { status }
  );
}

export function apiSuccess(data: any, status: number = 200) {
  return NextResponse.json(
    { data, timestamp: new Date().toISOString() },
    { status }
  );
}
```

### Zod Schemas

```typescript
// src/lib/schemas.ts
import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email().optional(),
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
  drive_folder_url: z.string().url().optional(),
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
    model_override: z.string().optional(),
    skip_quality: z.boolean().optional(),
    skip_uscis: z.boolean().optional(),
    include_thumbnails: z.boolean().optional(),
    template_override: z.string().optional(),
    language: z.enum(['pt-BR', 'en-US']).optional(),
  }).optional(),
});
```
