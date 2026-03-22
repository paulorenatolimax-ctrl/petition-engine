# MEGA PROMPT — ESTRUTURA COMPLETA DO PETITION ENGINE

## INSTRUÇÕES ABSOLUTAS
- Leia este arquivo INTEIRO antes de executar qualquer coisa
- NÃO perguntar nada. Executar bloco por bloco.
- NÃO importar @anthropic-ai/sdk nem @google/generative-ai
- Todos os agentes RETORNAM prompts como strings — Paulo copia pro Claude Code
- Este prompt é para o Claude Code executar no projeto petition-engine

---

# ═══════════════════════════════════════
# BLOCO 0: AUDITORIA — O QUE VOCÊ TEM AGORA
# ═══════════════════════════════════════

Antes de escrever uma linha de código, faça:

```bash
echo "=== AUDIT ==="
echo "--- package.json ---"
cat package.json 2>/dev/null | head -5 || echo "MISSING"
echo "--- .env.local ---"
ls -la .env.local 2>/dev/null || echo "MISSING"
echo "--- API routes ---"
find src/app/api -name "route.ts" 2>/dev/null | sort || echo "NO API ROUTES"
echo "--- Agents ---"
find src/agents -name "*.ts" 2>/dev/null | sort || echo "NO AGENTS"
echo "--- Lib ---"
find src/lib -name "*.ts" 2>/dev/null | sort || echo "NO LIB FILES"
echo "--- Components ---"
find src/components -name "*.tsx" 2>/dev/null | sort || echo "NO COMPONENTS"
echo "--- Scripts ---"
ls scripts/ 2>/dev/null || echo "NO SCRIPTS"
echo "--- Systems symlinks ---"
ls -la systems/ 2>/dev/null || echo "NO SYSTEMS DIR"
echo "--- Supabase test ---"
curl -s "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/clients?select=count&apikey=${NEXT_PUBLIC_SUPABASE_ANON_KEY}" 2>/dev/null | head -3 || echo "SUPABASE NOT CONFIGURED"
echo "--- Pages ---"
find src/app -maxdepth 2 -name "page.tsx" 2>/dev/null | sort
echo "=== END AUDIT ==="
```

Se a auditoria mostrar que alguma coisa do que é descrito abaixo JÁ EXISTE, não sobrescreva — apenas corrija/melhore.

---

# ═══════════════════════════════════════
# BLOCO 1: CAMPO DE PASTA LOCAL NO CLIENTE
# ═══════════════════════════════════════

O formulário de novo cliente PRECISA ter um campo `docs_folder_path` onde Paulo informa
o caminho da pasta no Mac. Sem isso, o sistema não sabe onde buscar os documentos.

## 1.1 — Adicionar coluna na tabela clients (se não existir)

Execute no Supabase SQL Editor:

```sql
-- Adicionar campo de pasta local se não existir
ALTER TABLE clients ADD COLUMN IF NOT EXISTS docs_folder_path TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS drive_folder_url TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS case_number TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS previous_petition_denied BOOLEAN DEFAULT false;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS denial_reasons TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal', 'low'));
```

## 1.2 — Atualizar POST /api/clients para aceitar docs_folder_path

Encontre o arquivo da rota POST /api/clients (provavelmente em `src/app/api/clients/route.ts`).
Garanta que ele aceita E salva o campo `docs_folder_path` no INSERT do Supabase.

```typescript
// No body do POST, adicionar:
const {
  name, email, visa_type, company_name,
  proposed_endeavor, location_city, location_state,
  docs_folder_path,  // ← NOVO: caminho da pasta local
  case_number,       // ← NOVO: número do caso
  previous_petition_denied, // ← NOVO: se foi negado antes
  denial_reasons,    // ← NOVO: motivos da negativa
  priority,          // ← NOVO: prioridade
} = await request.json();

// No insert do Supabase:
const { data, error } = await supabase.from('clients').insert({
  name, email, visa_type, company_name,
  proposed_endeavor, location_city, location_state,
  docs_folder_path,
  case_number,
  previous_petition_denied,
  denial_reasons,
  priority,
  status: 'active',
}).select().single();
```

## 1.3 — Atualizar frontend do formulário de novo cliente

No arquivo da página de clientes (src/app/clientes/page.tsx), adicionar ao formulário:

```tsx
// Adicionar ao state do newClient:
docs_folder_path: '',
case_number: '',
previous_petition_denied: false,
denial_reasons: '',
priority: 'normal',

// Adicionar ao modal de novo cliente, ANTES do botão de salvar:

<div>
  <label>Pasta dos documentos (caminho local) *</label>
  <input
    type="text"
    placeholder="/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/Nome do Cliente"
    value={newClient.docs_folder_path}
    onChange={(e) => setNewClient({ ...newClient, docs_folder_path: e.target.value })}
  />
  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
    Caminho completo da pasta do cliente no Mac. O Extractor Agent usa esse caminho para ler PDFs e DOCXs.
  </span>
</div>

<div>
  <label>Número do caso (OS)</label>
  <input
    type="text"
    placeholder="OS_4750"
    value={newClient.case_number}
    onChange={(e) => setNewClient({ ...newClient, case_number: e.target.value })}
  />
</div>

<div style={{ display: 'flex', gap: '12px' }}>
  <div style={{ flex: 1 }}>
    <label>Prioridade</label>
    <select value={newClient.priority} onChange={(e) => setNewClient({ ...newClient, priority: e.target.value })}>
      <option value="urgent">Urgente</option>
      <option value="high">Alta</option>
      <option value="normal">Normal</option>
      <option value="low">Baixa</option>
    </select>
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'end', gap: '8px' }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
      <input
        type="checkbox"
        checked={newClient.previous_petition_denied}
        onChange={(e) => setNewClient({ ...newClient, previous_petition_denied: e.target.checked })}
      />
      Petição anterior negada
    </label>
  </div>
</div>

{newClient.previous_petition_denied && (
  <div>
    <label>Motivos da negativa</label>
    <textarea
      rows={3}
      placeholder="Descreva os motivos da negativa anterior..."
      value={newClient.denial_reasons}
      onChange={(e) => setNewClient({ ...newClient, denial_reasons: e.target.value })}
    />
  </div>
)}
```

---

# ═══════════════════════════════════════
# BLOCO 2: EXTRACTOR AGENT — LER PASTA DO CLIENTE
# ═══════════════════════════════════════

O Extractor Agent recebe o `docs_folder_path` do cliente, lista todos os arquivos (PDF, DOCX, TXT, MD),
extrai o texto de cada um, e monta um PROMPT que, quando colado no Claude Code, gera o perfil JSON do cliente.

## 2.1 — Verificar/criar src/agents/extractor.ts

O agente DEVE:
1. Receber `docs_folder_path` como parâmetro
2. Usar `fs` para listar todos os arquivos na pasta (recursivo, incluindo subpastas)
3. Para PDFs: chamar o script Python `extract_pdf.py`
4. Para DOCX: chamar o script Python `extract_docx.py`
5. Para TXT/MD: ler diretamente com fs.readFileSync
6. Montar um prompt gigante com todo o conteúdo extraído
7. O prompt pede ao Claude Code para gerar um JSON com a estrutura do client_profile
8. RETORNAR o prompt como string (NÃO chamar API)

```typescript
// src/agents/extractor.ts
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';
import { execSync } from 'child_process';

interface ExtractorInput {
  clientName: string;
  visaType: string;
  docsPath: string;
  proposedEndeavor?: string;
  previousDenied?: boolean;
  denialReasons?: string;
}

interface ExtractedFile {
  filename: string;
  path: string;
  type: string;
  content: string;
  sizeKb: number;
}

function listFilesRecursive(dir: string, files: string[] = []): string[] {
  if (!existsSync(dir)) return files;
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    try {
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        // Skip hidden dirs and node_modules
        if (!entry.startsWith('.') && entry !== 'node_modules') {
          listFilesRecursive(fullPath, files);
        }
      } else {
        const ext = extname(entry).toLowerCase();
        if (['.pdf', '.docx', '.doc', '.txt', '.md', '.rtf'].includes(ext)) {
          files.push(fullPath);
        }
      }
    } catch (e) {
      // Skip inaccessible files
    }
  }
  return files;
}

function extractFileContent(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  try {
    if (ext === '.txt' || ext === '.md') {
      return readFileSync(filePath, 'utf-8').slice(0, 50000); // Limit 50k chars
    }
    if (ext === '.pdf') {
      // Use Python script
      const result = execSync(
        `python3 scripts/extract_pdf.py "${filePath}"`,
        { encoding: 'utf-8', timeout: 30000, maxBuffer: 10 * 1024 * 1024 }
      );
      return result.slice(0, 50000);
    }
    if (ext === '.docx' || ext === '.doc') {
      const result = execSync(
        `python3 scripts/extract_docx.py "${filePath}"`,
        { encoding: 'utf-8', timeout: 30000, maxBuffer: 10 * 1024 * 1024 }
      );
      return result.slice(0, 50000);
    }
  } catch (e: any) {
    return `[ERRO AO EXTRAIR: ${e.message}]`;
  }
  return '[FORMATO NÃO SUPORTADO]';
}

export function runExtractor(input: ExtractorInput): {
  prompt: string;
  metadata: {
    filesFound: number;
    filesExtracted: number;
    totalChars: number;
    fileList: string[];
  };
} {
  const files = listFilesRecursive(input.docsPath);
  const extracted: ExtractedFile[] = [];

  for (const filePath of files) {
    const content = extractFileContent(filePath);
    extracted.push({
      filename: basename(filePath),
      path: filePath,
      type: extname(filePath).toLowerCase().replace('.', ''),
      content,
      sizeKb: Math.round(content.length / 1024),
    });
  }

  const totalChars = extracted.reduce((sum, f) => sum + f.content.length, 0);

  // Montar o prompt
  const filesSection = extracted.map((f, i) =>
    `### ARQUIVO ${i + 1}: ${f.filename} (${f.type}, ${f.sizeKb}KB)\n${f.content}\n`
  ).join('\n---\n\n');

  const prompt = `# EXTRAÇÃO DE PERFIL DO CLIENTE: ${input.clientName}

## CONTEXTO
- Tipo de visto: ${input.visaType}
- Proposed Endeavor: ${input.proposedEndeavor || 'Não informado'}
- Petição anterior negada: ${input.previousDenied ? 'SIM — ' + (input.denialReasons || 'motivos não especificados') : 'NÃO'}
- Total de documentos extraídos: ${extracted.length}
- Total de caracteres: ${totalChars.toLocaleString()}

## INSTRUÇÃO
Analise TODOS os documentos abaixo e gere um JSON completo com o perfil do beneficiário.
O JSON deve conter TODOS os campos relevantes para a petição ${input.visaType}.

### Estrutura esperada do JSON:

\`\`\`json
{
  "personal": {
    "full_name": "",
    "nationality": "",
    "date_of_birth": "",
    "education": [{ "degree": "", "field": "", "institution": "", "year": "", "country": "" }],
    "languages": []
  },
  "professional": {
    "current_title": "",
    "current_employer": "",
    "years_experience": 0,
    "specialization": "",
    "employment_history": [{ "title": "", "company": "", "dates": "", "description": "" }],
    "skills": [],
    "certifications": [{ "name": "", "issuer": "", "year": "" }]
  },
  "academic": {
    "publications": [{ "title": "", "journal": "", "year": "", "citations": 0 }],
    "peer_review": { "journals": [], "count": 0 },
    "memberships": [{ "organization": "", "level": "", "since": "" }],
    "awards": [],
    "presentations": []
  },
  "immigration": {
    "proposed_endeavor": "",
    "field_of_expertise": "",
    "national_importance_argument": "",
    "well_positioned_argument": "",
    "balance_of_factors_argument": "",
    "soc_code": "",
    "soc_title": "",
    "target_location": { "city": "", "state": "" }
  },
  "business": {
    "company_name": "",
    "company_type": "",
    "naics_code": "",
    "business_plan_exists": false,
    "revenue_projections": [],
    "employees_planned": 0,
    "investment_amount": ""
  },
  "evidence": {
    "support_letters": [{ "from": "", "title": "", "organization": "", "relationship": "" }],
    "exhibits": [{ "number": 0, "description": "", "source_file": "" }]
  },
  "previous_petition": {
    "denied": ${input.previousDenied || false},
    "denial_reasons": "${input.denialReasons || ''}",
    "rfe_history": [],
    "improvements_needed": []
  }
}
\`\`\`

Extraia TODOS os dados dos documentos. Não invente nada. Se um campo não tem informação nos documentos, use null.
Para evidências e exhibits, referencie o arquivo de origem.

## DOCUMENTOS EXTRAÍDOS

${filesSection}

## RESPOSTA

Gere o JSON completo acima com todos os dados extraídos dos documentos.`;

  return {
    prompt,
    metadata: {
      filesFound: files.length,
      filesExtracted: extracted.length,
      totalChars,
      fileList: files.map(f => basename(f)),
    }
  };
}
```

## 2.2 — Garantir que os scripts Python existem

### scripts/extract_pdf.py

```python
#!/usr/bin/env python3
"""Extract text from PDF files."""
import sys
try:
    from PyPDF2 import PdfReader
except ImportError:
    print("[ERRO: PyPDF2 não instalado. Rode: pip3 install PyPDF2]")
    sys.exit(1)

def extract(path):
    try:
        reader = PdfReader(path)
        text = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text.append(t)
        return '\n\n'.join(text)
    except Exception as e:
        return f"[ERRO: {str(e)}]"

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Uso: python3 extract_pdf.py <caminho.pdf>")
        sys.exit(1)
    print(extract(sys.argv[1]))
```

### scripts/extract_docx.py

```python
#!/usr/bin/env python3
"""Extract text from DOCX files."""
import sys
try:
    from docx import Document
except ImportError:
    print("[ERRO: python-docx não instalado. Rode: pip3 install python-docx]")
    sys.exit(1)

def extract(path):
    try:
        doc = Document(path)
        text = []
        for para in doc.paragraphs:
            if para.text.strip():
                text.append(para.text)
        # Also extract from tables
        for table in doc.tables:
            for row in table.rows:
                cells = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                if cells:
                    text.append(' | '.join(cells))
        return '\n'.join(text)
    except Exception as e:
        return f"[ERRO: {str(e)}]"

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Uso: python3 extract_docx.py <caminho.docx>")
        sys.exit(1)
    print(extract(sys.argv[1]))
```

### Instalar dependências:
```bash
pip3 install PyPDF2 python-docx Pillow
```

---

# ═══════════════════════════════════════
# BLOCO 3: API DE EXTRAÇÃO — /api/clients/[id]/extract
# ═══════════════════════════════════════

Verificar se a rota existe. Se não existir, criar:

### Arquivo: src/app/api/clients/[id]/extract/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { runExtractor } from '@/agents/extractor';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Buscar dados do cliente
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !client) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    if (!client.docs_folder_path) {
      return NextResponse.json({
        error: 'Cliente não tem pasta de documentos configurada. Vá em Clientes → Editar e preencha o campo "Pasta dos documentos".'
      }, { status: 400 });
    }

    // 2. Rodar extractor
    const result = runExtractor({
      clientName: client.name,
      visaType: client.visa_type,
      docsPath: client.docs_folder_path,
      proposedEndeavor: client.proposed_endeavor,
      previousDenied: client.previous_petition_denied,
      denialReasons: client.denial_reasons,
    });

    // 3. Registrar atividade
    await supabase.from('activity_log').insert({
      client_id: params.id,
      action: 'extraction_started',
      details: {
        filesFound: result.metadata.filesFound,
        filesExtracted: result.metadata.filesExtracted,
        totalChars: result.metadata.totalChars,
      },
    });

    return NextResponse.json({
      data: {
        prompt: result.prompt,
        metadata: result.metadata,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

---

# ═══════════════════════════════════════
# BLOCO 4: WRITER AGENT — GERAR DOCUMENTOS
# ═══════════════════════════════════════

Verificar se src/agents/writer.ts existe e funciona. Se não:

```typescript
// src/agents/writer.ts
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface WriterInput {
  clientId: string;
  clientName: string;
  visaType: string;
  docType: string;
  systemName: string;
  profileJson?: any;
  proposedEndeavor?: string;
  previousDenied?: boolean;
  denialReasons?: string;
}

export async function runWriter(input: WriterInput): Promise<{
  prompt: string;
  metadata: {
    systemName: string;
    systemVersion: string;
    filesRead: number;
    rulesApplied: number;
    estimatedTokens: number;
  };
}> {
  // 1. Buscar system_version do Supabase
  const { data: system } = await supabase
    .from('system_versions')
    .select('*')
    .eq('system_name', input.systemName)
    .eq('is_active', true)
    .single();

  if (!system) {
    throw new Error(`Sistema ${input.systemName} não encontrado ou inativo`);
  }

  // 2. Ler todos os arquivos .md do sistema
  const systemPath = system.system_path;
  let systemFiles: { name: string; content: string }[] = [];

  if (existsSync(systemPath)) {
    const files = readdirSync(systemPath).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
    systemFiles = files.map(f => ({
      name: f,
      content: readFileSync(join(systemPath, f), 'utf-8'),
    }));
  }

  // 3. Buscar error_rules aplicáveis
  const { data: rules } = await supabase
    .from('error_rules')
    .select('*')
    .eq('active', true)
    .or(`doc_type.is.null,doc_type.eq.${input.docType}`);

  // 4. Buscar perfil do cliente (se existe)
  let profileSection = '';
  if (input.profileJson) {
    profileSection = `\n## PERFIL DO BENEFICIÁRIO (extraído dos documentos)\n\`\`\`json\n${JSON.stringify(input.profileJson, null, 2)}\n\`\`\`\n`;
  } else {
    const { data: profile } = await supabase
      .from('client_profiles')
      .select('profile_data')
      .eq('client_id', input.clientId)
      .single();

    if (profile?.profile_data) {
      profileSection = `\n## PERFIL DO BENEFICIÁRIO (extraído dos documentos)\n\`\`\`json\n${JSON.stringify(profile.profile_data, null, 2)}\n\`\`\`\n`;
    }
  }

  // 5. Montar seção de regras de erro
  const rulesSection = (rules || []).map(r =>
    `- [${r.severity}/${r.rule_action}] ${r.rule_description}${r.rule_pattern ? ` (padrão: ${r.rule_pattern})` : ''}`
  ).join('\n');

  // 6. Montar seção dos arquivos do sistema
  const systemSection = systemFiles.map(f =>
    `### ${f.name}\n${f.content}`
  ).join('\n\n---\n\n');

  // 7. Contexto de negativa anterior
  const denialContext = input.previousDenied
    ? `\n## ⚠️ ATENÇÃO: PETIÇÃO ANTERIOR NEGADA\nMotivos da negativa: ${input.denialReasons || 'Não especificados'}\nEste é um REFILE. O documento DEVE endereçar explicitamente cada motivo de negativa.\nNunca contradizer o que foi dito na petição original — apenas fortalecer e complementar.\n`
    : '';

  // 8. Montar o prompt final
  const prompt = `# GERAÇÃO DE DOCUMENTO: ${input.docType}
## Cliente: ${input.clientName} | Visto: ${input.visaType}
## Sistema: ${input.systemName} v${system.version_tag}

${denialContext}
${profileSection}

## REGRAS DE ERRO (${(rules || []).length} regras ativas — RESPEITAR TODAS)
${rulesSection}

## ARQUIVOS DO SISTEMA DE GERAÇÃO
Os arquivos abaixo contêm as instruções completas para gerar este tipo de documento.
Siga TODAS as instruções presentes nestes arquivos.

${systemSection}

## INSTRUÇÃO FINAL
Gere o documento completo seguindo as instruções dos arquivos do sistema acima.
Use os dados do perfil do beneficiário — NÃO invente dados.
Respeite TODAS as regras de erro listadas.
${input.previousDenied ? 'CRÍTICO: Endereçe cada motivo de negativa anterior.' : ''}
`;

  const estimatedTokens = Math.round(prompt.length / 4);

  return {
    prompt,
    metadata: {
      systemName: input.systemName,
      systemVersion: system.version_tag,
      filesRead: systemFiles.length,
      rulesApplied: (rules || []).length,
      estimatedTokens,
    },
  };
}
```

---

# ═══════════════════════════════════════
# BLOCO 5: VERIFICAR /api/generate
# ═══════════════════════════════════════

O /api/generate é o endpoint central. Verificar se já existe e se chama o Writer Agent.
Se não funcionar corretamente, garantir que:

1. Recebe `client_id` e `doc_type` no body
2. Busca o cliente no Supabase (incluindo `docs_folder_path`)
3. Mapeia doc_type para system_name
4. Chama `runWriter()`
5. Retorna `{ data: { prompt, metadata } }`

---

# ═══════════════════════════════════════
# BLOCO 6: TESTE REAL COM DENI RUBENS
# ═══════════════════════════════════════

Este é o teste de fogo. Deni Rubens é um cliente real com ~190 documentos.

## 6.1 — Cadastrar Deni Rubens no sistema

Via API ou UI:

```bash
# Via curl (se a API estiver rodando em localhost:3000)
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Deni Ruben Moreira",
    "email": "",
    "visa_type": "EB-2-NIW",
    "company_name": "DRM Success Framework",
    "proposed_endeavor": "Digital Transformation Solutions for US SMEs using proprietary DRM Success Framework for ERP implementation",
    "location_city": "Texas",
    "location_state": "TX",
    "docs_folder_path": "/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/_2. MEUS CASOS/2026/Deni Rubens (Direto)/_2026",
    "case_number": "OS_4750",
    "previous_petition_denied": true,
    "denial_reasons": "Petição anterior de processamento consular foi negada. Problemas identificados na argumentação de national interest e well-positioned. Refile com estratégia reformulada focando em Digital Transformation Solutions.",
    "priority": "high"
  }'
```

Verificar que o cliente aparece na lista em http://localhost:3000/clientes

## 6.2 — Testar extração

```bash
# Pegar o ID do cliente criado
CLIENT_ID=$(curl -s http://localhost:3000/api/clients | python3 -c "import sys,json; data=json.load(sys.stdin); clients=data.get('data',data); print([c['id'] for c in (clients if isinstance(clients,list) else clients.get('data',[]))  if 'Deni' in c['name']][0])")

echo "Client ID: $CLIENT_ID"

# Testar extração (vai listar os ~190 arquivos da pasta)
curl -X POST "http://localhost:3000/api/clients/${CLIENT_ID}/extract" \
  -H "Content-Type: application/json" | python3 -m json.tool | head -50
```

## 6.3 — Testar geração de prompt

```bash
# Gerar prompt de Cover Letter EB-2 NIW
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d "{\"client_id\": \"${CLIENT_ID}\", \"doc_type\": \"cover_letter_eb2_niw\"}" \
  | python3 -m json.tool | head -30

echo "---"
echo "Se retornou um prompt com dados do Deni Rubens + sistema cover-letter-eb2-niw + regras de erro, O SISTEMA FUNCIONA."
```

## 6.4 — Verificar resultado

O prompt gerado deve conter:
- [ ] Nome "Deni Ruben Moreira" no conteúdo
- [ ] Referência ao "DRM Success Framework"
- [ ] Menção de "Digital Transformation"
- [ ] Dados da negativa anterior
- [ ] Regras de erro aplicadas (forbidden terms, etc.)
- [ ] Instruções do sistema cover-letter-eb2-niw
- [ ] Tamanho estimado do prompt em tokens

Se QUALQUER coisa falhar, corrigir imediatamente antes de prosseguir.

---

# ═══════════════════════════════════════
# BLOCO 7: QUALITY AGENT — VALIDAÇÃO PÓS-GERAÇÃO
# ═══════════════════════════════════════

Verificar se src/agents/quality.ts existe. Este agente:
1. Recebe o texto do documento gerado
2. Aplica TODAS as error_rules do Supabase
3. Para regras com `rule_pattern` (regex): testa contra o texto
4. Gera relatório de qualidade com score
5. RETORNA como string (prompt para revisão manual se score < 80%)

```typescript
// src/agents/quality.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface QualityResult {
  score: number;
  passed: boolean;
  violations: {
    rule_id: string;
    severity: string;
    action: string;
    description: string;
    match?: string;
    line?: number;
  }[];
  summary: string;
}

export async function runQuality(
  documentText: string,
  docType: string,
  clientName: string
): Promise<QualityResult> {
  // Buscar regras aplicáveis
  const { data: rules } = await supabase
    .from('error_rules')
    .select('*')
    .eq('active', true)
    .or(`doc_type.is.null,doc_type.eq.${docType}`);

  const violations: QualityResult['violations'] = [];

  for (const rule of (rules || [])) {
    if (rule.rule_pattern) {
      try {
        const regex = new RegExp(rule.rule_pattern, 'gi');
        const matches = documentText.match(regex);
        if (matches) {
          // Incrementar trigger count
          await supabase.rpc('increment_rule_trigger', { rule_id: rule.id });

          for (const match of matches) {
            const lineNum = documentText.substring(0, documentText.indexOf(match)).split('\n').length;
            violations.push({
              rule_id: rule.id,
              severity: rule.severity,
              action: rule.rule_action,
              description: rule.rule_description,
              match,
              line: lineNum,
            });
          }
        }
      } catch (e) {
        // Invalid regex, skip
      }
    }
  }

  // Calcular score
  const criticalCount = violations.filter(v => v.severity === 'critical').length;
  const highCount = violations.filter(v => v.severity === 'high').length;
  const mediumCount = violations.filter(v => v.severity === 'medium').length;
  const lowCount = violations.filter(v => v.severity === 'low').length;

  const deductions = (criticalCount * 15) + (highCount * 8) + (mediumCount * 3) + (lowCount * 1);
  const score = Math.max(0, 100 - deductions);
  const passed = score >= 80 && criticalCount === 0;

  const blockViolations = violations.filter(v => v.action === 'block');

  const summary = passed
    ? `✅ Documento aprovado (score: ${score}%). ${violations.length} issues menores encontradas.`
    : `❌ Documento REPROVADO (score: ${score}%). ${criticalCount} erros críticos, ${highCount} altos. ${blockViolations.length} bloqueantes.`;

  return { score, passed, violations, summary };
}
```

---

# ═══════════════════════════════════════
# BLOCO 8: PÁGINA DE DETALHE DO CLIENTE — MELHORAR
# ═══════════════════════════════════════

A página /clientes/[id] precisa mostrar:
1. Dados do cliente (nome, visto, empresa, endeavor)
2. Caminho da pasta (docs_folder_path) — com indicação se a pasta existe
3. Status da extração (perfil extraído ou não)
4. Botão "Extrair Perfil" → chama /api/clients/[id]/extract → mostra prompt → botão copiar
5. Campo para colar o JSON de volta (resultado do Claude Code)
6. Lista de documentos gerados com score de qualidade
7. Botão rápido para cada sistema ("Gerar Cover Letter", "Gerar BP", etc.)

Verificar o que já existe nessa página e COMPLETAR o que falta.

---

# ═══════════════════════════════════════
# BLOCO 9: COMMIT + VERIFICAÇÃO
# ═══════════════════════════════════════

```bash
# Rodar o build pra garantir 0 erros
npx next build 2>&1 | tail -20

# Se build OK:
git add -A
git commit -m "MEGA: Estrutura completa — extractor, writer, quality agents + teste Deni Rubens + campo pasta local

- Campo docs_folder_path no cadastro de clientes
- Extractor Agent lê PDFs/DOCX da pasta local
- Writer Agent monta prompts com sistema + perfil + regras
- Quality Agent valida documento contra 96 error rules
- Scripts Python para extração de PDF e DOCX
- API /api/clients/[id]/extract funcional
- Teste real com Deni Rubens (EB-2 NIW, refile, ~190 docs)"

git push origin main

# Verificação final
echo "=== VERIFICAÇÃO ==="
echo "1. Abrir http://localhost:3000/clientes"
echo "2. Verificar que Deni Rubens aparece na lista"
echo "3. Clicar no Deni Rubens → ver detalhes + botão Extrair"
echo "4. Ir em Gerador → selecionar Deni Rubens → Cover Letter EB-2 NIW → Gerar"
echo "5. Copiar prompt → colar no Claude Code → verificar output"
```

---

# FIM DO MEGA PROMPT ESTRUTURA
# Resultado: Sistema funcional end-to-end com teste real.
