# 09 — AUTO-APRENDIZADO CONVERSACIONAL

> **Este é o sistema mais importante do Petition Engine.** Cada interação com Paulo evolui os sistemas de geração. Não é machine learning — é versionamento inteligente de prompts via GitHub, com rollback instantâneo.

## A Dor Original (palavras do Paulo)

> "Eu já quero pegar todos os erros, colocar num pacote, numa sacola, apertar um botão e esse botão já se tornar automático pro cloud code já pegar e ajustar ou no sistema, atualizar."

> "Eu não quero que ele fique reescrevendo em cima."

> "Tem a porra da janela de contexto, acaba, daí eu tenho que abrir uma nova conversa, aí tenho que lembrar tudo ali."

## Os 3 Níveis de Auto-Aprendizado

### Nível 1: Error Rules (já em 06_ERROR_RULES.md)
**O que é:** Regras de validação que previnem erros específicos.
**Trigger:** Paulo reporta um erro → Auto-Debugger classifica → regra criada.
**Impacto:** Afeta o QualityAgent (validação pós-geração).
**Granularidade:** Micro — uma regra por erro.
**Já especificado em:** `06_ERROR_RULES.md`

### Nível 2: System Updates (NOVO — este arquivo)
**O que é:** Evolução dos prompts/instruções dos sistemas de geração.
**Trigger:** Paulo conversa, faz ajustes, dá feedback sobre um documento. O Engine detecta que algo mudou e PERGUNTA: "Quer que eu incorpore isso no sistema?"
**Impacto:** Afeta o WriterAgent (geração de documentos futuros).
**Granularidade:** Macro — altera o .md do sistema inteiro.
**Versionamento:** Cada update = nova versão do sistema (v5.0 → v5.1 → v5.2...).

### Nível 3: Preference Learning (NOVO)
**O que é:** Preferências de Paulo que não são erros nem mudanças de sistema, mas ajustes de estilo/tom/abordagem.
**Trigger:** Paulo diz "prefiro assim", "sempre faz X", "nunca mais faz Y".
**Impacto:** Afeta todas as gerações (meta-regras no prompt).
**Granularidade:** Transversal — aplica a todos os doc_types.
**Storage:** Tabela `preferences` no Supabase.

---

## Nível 2: System Updates — Especificação Completa

### Conceito Central: Versionar, Não Sobrescrever

Paulo disse: *"Eu não quero que ele fique reescrevendo em cima."*

Então o sistema NUNCA modifica um arquivo .md existente in-place. Ele:

1. **Copia** o arquivo atual como `v{N}.md`
2. **Cria** o novo como `v{N+1}.md`
3. **Atualiza** o symlink `current.md` → `v{N+1}.md`
4. **Commita** ambos no GitHub (histórico completo)
5. Se der merda → **reverte** o symlink para `v{N}.md`

```
systems/cover-letter-eb1a/
├── current.md → versions/v5.2.md     ← symlink para versão ativa
├── versions/
│   ├── v5.0.md                        ← versão original
│   ├── v5.1.md                        ← primeiro ajuste
│   ├── v5.2.md                        ← ajuste atual (ATIVO)
│   └── changelog.md                   ← log de todas as mudanças
└── meta.json                          ← metadata do sistema
```

### Fluxo Conversacional

```
Paulo: "Essa cover letter ficou boa, mas na seção de Criterion 6
        o tom tá muito acadêmico. Quero mais direto, mais assertivo,
        como se fosse um advogado falando com convicção."

Engine detecta: feedback sobre tom de seção específica
                → tipo: system_update
                → sistema afetado: cover-letter-eb1a
                → seção: Criterion 6 generation
                → mudança: tom "acadêmico" → "advogado assertivo"
        │
        ▼
Engine pergunta:
  "Detectei que você quer ajustar o tom do Criterion 6 na
   Cover Letter EB-1A de 'acadêmico' para 'assertivo/advogado'.

   Isso afetaria TODAS as futuras cover letters EB-1A.

   Quer que eu incorpore isso no sistema?

   [Sim, incorporar]  [Não, só neste caso]  [Deixa eu explicar melhor]"
        │
        ▼ (Paulo clica "Sim, incorporar")
        │
        ▼
System Update Agent:
  1. Lê current.md do cover-letter-eb1a
  2. Identifica a seção relevante (Criterion 6 instructions)
  3. Gera versão modificada com a mudança de tom
  4. Mostra diff para Paulo: "Vou mudar ISTO para ISTO"
        │
        ▼
Paulo confirma o diff
        │
        ▼
  1. Salva v5.0 como backup
  2. Cria v5.1 com a mudança
  3. Atualiza symlink current.md → v5.1
  4. Commita no GitHub:
     "update(cover-letter-eb1a): v5.0→v5.1 — tom do Criterion 6 mais assertivo"
  5. Atualiza system_versions no Supabase
  6. Registra no changelog.md
        │
        ▼
Engine confirma:
  "Sistema Cover Letter EB-1A atualizado para v5.1.
   Mudança: tom do Criterion 6 agora mais assertivo.
   Commit: abc1234
   Para reverter: /api/systems/rollback/cover-letter-eb1a/v5.0"
```

### Detecção Automática de Feedback

O Engine deve detectar padrões na conversa que indicam feedback de sistema:

```typescript
// src/lib/feedback-detector.ts

const SYSTEM_UPDATE_PATTERNS = [
  // Mudanças de tom/estilo
  /(?:o tom|a linguagem|o estilo|a abordagem)\s+(?:tá|está|ficou)\s+(?:muito|bem|pouco)/i,
  /(?:quero|prefiro)\s+(?:mais|menos)\s+(?:assertivo|acadêmico|formal|direto|técnico)/i,

  // Mudanças de conteúdo
  /(?:sempre|nunca)\s+(?:inclua|coloque|mencione|cite|use)/i,
  /(?:na seção|no critério|na parte)\s+(?:de|do|da)\s+/i,

  // Feedback direto
  /(?:incorpora|integra|atualiza)\s+(?:isso|essa mudança|esse ajuste)\s+(?:no sistema|no prompt)/i,
  /(?:a partir de agora|daqui pra frente|sempre que gerar)/i,

  // Preferências recorrentes
  /(?:toda vez que|sempre que)\s+(?:eu|gerar|criar|fazer)/i,
  /(?:esse padrão|essa lógica|essa estrutura)\s+(?:é|tá)\s+(?:boa|certa|perfeita)/i,
];

interface DetectedFeedback {
  type: 'system_update' | 'error_rule' | 'preference' | 'one_time';
  confidence: number;         // 0-1
  affected_system?: string;   // qual sistema seria atualizado
  affected_section?: string;  // qual seção do sistema
  change_description: string; // resumo da mudança
  original_quote: string;     // citação exata do Paulo
}

export function detectFeedback(message: string, currentContext: {
  doc_type?: string;
  document_id?: string;
  system_name?: string;
}): DetectedFeedback | null {
  // 1. Verificar se matches algum padrão
  const matchedPatterns = SYSTEM_UPDATE_PATTERNS.filter(p => p.test(message));

  if (matchedPatterns.length === 0) return null;

  // 2. Calcular confiança baseado em quantos padrões matcharam
  const confidence = Math.min(matchedPatterns.length / 3, 1);

  if (confidence < 0.3) return null; // muito incerto, não perguntar

  // 3. Determinar tipo
  // Se menciona erro específico → error_rule
  // Se menciona "sempre/nunca/a partir de agora" → system_update
  // Se é sobre preferência pessoal → preference
  // Se não tem indicador de permanência → one_time

  const isPermanent = /sempre|nunca|a partir de agora|daqui pra frente|toda vez/i.test(message);
  const isError = /erro|bug|errado|incorreto|não deveria/i.test(message);

  let type: DetectedFeedback['type'];
  if (isError) type = 'error_rule';
  else if (isPermanent) type = 'system_update';
  else type = 'one_time';

  return {
    type,
    confidence,
    affected_system: currentContext.system_name,
    change_description: message.substring(0, 200),
    original_quote: message,
  };
}
```

### System Update Agent

```typescript
// src/agents/system-updater.ts

import Anthropic from '@anthropic-ai/sdk';
import { SupabaseClient } from '@supabase/supabase-js';

export class SystemUpdater {
  private anthropic: Anthropic;
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.anthropic = new Anthropic();
    this.supabase = supabase;
  }

  /**
   * Processa um feedback detectado e propõe atualização do sistema
   */
  async proposeUpdate(feedback: {
    systemName: string;       // ex: "cover-letter-eb1a"
    changeDescription: string;
    originalQuote: string;
    currentDocType: string;
  }): Promise<ProposedUpdate> {
    // 1. Ler sistema atual
    const { readSystemFiles } = await import('@/lib/file-reader');
    const currentSystem = await readSystemFiles(feedback.systemName);

    // 2. Pedir ao Claude para gerar a mudança
    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: `Você é um especialista em atualização de sistemas de prompts para geração de documentos de imigração dos EUA.

Seu trabalho é:
1. Ler o sistema atual
2. Entender o feedback do operador (Paulo)
3. Propor uma mudança CIRÚRGICA — alterar APENAS o que precisa mudar
4. NÃO reescrever o sistema inteiro
5. Gerar um diff claro mostrando antes/depois

REGRA ABSOLUTA: Nunca apagar o que já funciona. Adicionar ou modificar, nunca deletar sem confirmação explícita.`,
      messages: [{
        role: 'user',
        content: `SISTEMA ATUAL (${feedback.systemName}):
${currentSystem.substring(0, 15000)}

FEEDBACK DO PAULO:
"${feedback.originalQuote}"

INTERPRETAÇÃO: ${feedback.changeDescription}

Gere:
1. SEÇÃO AFETADA: qual parte do sistema precisa mudar
2. ANTES: texto atual da seção
3. DEPOIS: texto proposto
4. JUSTIFICATIVA: por que esta mudança endereça o feedback
5. RISCO: o que pode dar errado com essa mudança (para Paulo decidir)

Responda em JSON:
{
  "affected_section": "nome/path da seção",
  "before": "texto atual (até 500 chars)",
  "after": "texto proposto (até 500 chars)",
  "justification": "...",
  "risk": "...",
  "change_type": "add|modify|remove"
}`,
      }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Não conseguiu gerar proposta de atualização');

    const proposal = JSON.parse(jsonMatch[0]);

    return {
      systemName: feedback.systemName,
      ...proposal,
      originalQuote: feedback.originalQuote,
      status: 'proposed', // proposed → confirmed → applied → rolled_back
    };
  }

  /**
   * Aplica a atualização confirmada pelo Paulo
   */
  async applyUpdate(proposal: ProposedUpdate): Promise<AppliedUpdate> {
    const fs = await import('fs/promises');
    const path = await import('path');

    const systemDir = path.join(process.cwd(), 'systems', proposal.systemName);
    const versionsDir = path.join(systemDir, 'versions');
    const metaPath = path.join(systemDir, 'meta.json');

    // 1. Ler meta atual
    let meta: SystemMeta;
    try {
      meta = JSON.parse(await fs.readFile(metaPath, 'utf-8'));
    } catch {
      meta = { current_version: '1.0.0', versions: [] };
    }

    // 2. Calcular nova versão (patch bump)
    const [major, minor, patch] = meta.current_version.split('.').map(Number);
    const newVersion = `${major}.${minor}.${patch + 1}`;

    // 3. Criar diretório de versões se não existir
    await fs.mkdir(versionsDir, { recursive: true });

    // 4. Ler conteúdo atual do sistema
    const { readSystemFiles } = await import('@/lib/file-reader');
    const currentContent = await readSystemFiles(proposal.systemName);

    // 5. Aplicar a mudança
    let newContent: string;
    if (proposal.change_type === 'add') {
      newContent = currentContent + '\n\n' + proposal.after;
    } else if (proposal.change_type === 'modify') {
      newContent = currentContent.replace(proposal.before, proposal.after);
    } else {
      newContent = currentContent.replace(proposal.before, '');
    }

    // 6. Salvar versão anterior
    const oldVersionPath = path.join(versionsDir, `v${meta.current_version}.md`);
    await fs.writeFile(oldVersionPath, currentContent, 'utf-8');

    // 7. Salvar nova versão
    const newVersionPath = path.join(versionsDir, `v${newVersion}.md`);
    await fs.writeFile(newVersionPath, newContent, 'utf-8');

    // 8. Atualizar current.md (symlink ou arquivo direto)
    const currentPath = path.join(systemDir, 'current.md');
    try { await fs.unlink(currentPath); } catch {}
    await fs.symlink(newVersionPath, currentPath);

    // 9. Atualizar meta.json
    meta.current_version = newVersion;
    meta.versions.push({
      version: newVersion,
      timestamp: new Date().toISOString(),
      change: proposal.justification,
      quote: proposal.originalQuote,
      change_type: proposal.change_type,
    });
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');

    // 10. Atualizar changelog
    const changelogPath = path.join(versionsDir, 'changelog.md');
    const changelogEntry = `\n## v${newVersion} — ${new Date().toISOString().split('T')[0]}\n\n**Mudança:** ${proposal.justification}\n**Quote:** "${proposal.originalQuote.substring(0, 100)}"\n**Seção:** ${proposal.affected_section}\n**Tipo:** ${proposal.change_type}\n`;
    await fs.appendFile(changelogPath, changelogEntry, 'utf-8');

    // 11. Commit no GitHub
    const { commitToGitHub } = await import('@/lib/github');
    const commitSha = await commitToGitHub(
      `systems/${proposal.systemName}/versions/v${newVersion}.md`,
      newContent,
      `update(${proposal.systemName}): v${meta.versions[meta.versions.length - 2]?.version || '0'}→v${newVersion} — ${proposal.justification.substring(0, 50)}`
    );

    // 12. Atualizar Supabase
    await this.supabase.from('system_versions').update({
      version_tag: newVersion,
      last_updated: new Date().toISOString(),
    }).eq('system_name', proposal.systemName);

    // 13. Log
    await this.supabase.from('activity_log').insert({
      action: 'system_updated',
      details: {
        system: proposal.systemName,
        from_version: meta.versions[meta.versions.length - 2]?.version,
        to_version: newVersion,
        change: proposal.justification,
        commit_sha: commitSha,
      },
    });

    return {
      systemName: proposal.systemName,
      fromVersion: meta.versions[meta.versions.length - 2]?.version || 'initial',
      toVersion: newVersion,
      commitSha,
      canRollback: true,
    };
  }

  /**
   * Rollback para versão anterior
   */
  async rollback(systemName: string, targetVersion?: string): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');

    const systemDir = path.join(process.cwd(), 'systems', systemName);
    const metaPath = path.join(systemDir, 'meta.json');
    const meta: SystemMeta = JSON.parse(await fs.readFile(metaPath, 'utf-8'));

    // Se não especificou versão, volta uma
    if (!targetVersion) {
      const versions = meta.versions.map(v => v.version);
      const currentIdx = versions.indexOf(meta.current_version);
      if (currentIdx <= 0) throw new Error('Não há versão anterior para rollback');
      targetVersion = versions[currentIdx - 1];
    }

    const targetPath = path.join(systemDir, 'versions', `v${targetVersion}.md`);
    const currentPath = path.join(systemDir, 'current.md');

    // Verificar se versão alvo existe
    try { await fs.access(targetPath); } catch {
      throw new Error(`Versão ${targetVersion} não encontrada`);
    }

    // Atualizar symlink
    try { await fs.unlink(currentPath); } catch {}
    await fs.symlink(targetPath, currentPath);

    // Atualizar meta
    meta.current_version = targetVersion;
    meta.versions.push({
      version: targetVersion,
      timestamp: new Date().toISOString(),
      change: `ROLLBACK para v${targetVersion}`,
      quote: 'Rollback manual',
      change_type: 'rollback',
    });
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');

    // Commit de rollback no GitHub
    const { commitToGitHub } = await import('@/lib/github');
    const content = await fs.readFile(targetPath, 'utf-8');
    await commitToGitHub(
      `systems/${systemName}/current.md`,
      content,
      `rollback(${systemName}): revert to v${targetVersion}`
    );

    // Log
    await this.supabase.from('activity_log').insert({
      action: 'system_rollback',
      details: { system: systemName, rolled_back_to: targetVersion },
    });
  }
}

interface ProposedUpdate {
  systemName: string;
  affected_section: string;
  before: string;
  after: string;
  justification: string;
  risk: string;
  change_type: 'add' | 'modify' | 'remove';
  originalQuote: string;
  status: 'proposed' | 'confirmed' | 'applied' | 'rolled_back';
}

interface AppliedUpdate {
  systemName: string;
  fromVersion: string;
  toVersion: string;
  commitSha: string;
  canRollback: boolean;
}

interface SystemMeta {
  current_version: string;
  versions: Array<{
    version: string;
    timestamp: string;
    change: string;
    quote: string;
    change_type: string;
  }>;
}
```

### API Routes para System Updates

```typescript
// src/app/api/systems/[name]/propose-update/route.ts

export async function POST(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const supabase = createServerClient();
  const body = await req.json();
  // body: { change_description, original_quote, current_doc_type }

  const updater = new SystemUpdater(supabase);
  const proposal = await updater.proposeUpdate({
    systemName: params.name,
    changeDescription: body.change_description,
    originalQuote: body.original_quote,
    currentDocType: body.current_doc_type,
  });

  return NextResponse.json({ proposal });
}

// src/app/api/systems/[name]/apply-update/route.ts

export async function POST(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const supabase = createServerClient();
  const { proposal } = await req.json();

  const updater = new SystemUpdater(supabase);
  const result = await updater.applyUpdate(proposal);

  return NextResponse.json({ result });
}

// src/app/api/systems/[name]/rollback/route.ts

export async function POST(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const supabase = createServerClient();
  const { target_version } = await req.json();

  const updater = new SystemUpdater(supabase);
  await updater.rollback(params.name, target_version);

  return NextResponse.json({ message: `Rollback para v${target_version} concluído` });
}

// src/app/api/systems/[name]/versions/route.ts

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const fs = await import('fs/promises');
  const path = await import('path');

  const metaPath = path.join(process.cwd(), 'systems', params.name, 'meta.json');

  try {
    const meta = JSON.parse(await fs.readFile(metaPath, 'utf-8'));
    return NextResponse.json({
      current_version: meta.current_version,
      versions: meta.versions,
      total_versions: meta.versions.length,
    });
  } catch {
    return NextResponse.json({ error: 'Sistema não encontrado' }, { status: 404 });
  }
}
```

---

## Nível 3: Preferences (Tabela `preferences`)

### Schema Supabase

```sql
CREATE TABLE preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,           -- 'tone', 'structure', 'terminology', 'workflow', 'visual'
  key TEXT NOT NULL UNIQUE,         -- 'criterion_6_tone', 'always_cite_bls', etc.
  value TEXT NOT NULL,              -- 'assertivo, como advogado'
  applies_to TEXT[],                -- ['cover_letter_eb1a', 'cover_letter_eb2_niw'] ou NULL = todos
  source_quote TEXT,                -- citação original do Paulo
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Como Preferências São Injetadas

No prompt de QUALQUER geração, antes do conteúdo do sistema:

```typescript
async function getPreferencesBlock(docType: string): Promise<string> {
  const { data: prefs } = await supabase
    .from('preferences')
    .select('*')
    .eq('active', true)
    .or(`applies_to.cs.{${docType}},applies_to.is.null`);

  if (!prefs || prefs.length === 0) return '';

  return `
## PREFERÊNCIAS DO OPERADOR (Paulo Lima)
Estas são preferências pessoais que DEVEM ser respeitadas em todas as gerações:

${prefs.map(p => `- [${p.category.toUpperCase()}] ${p.value}`).join('\n')}
`;
}
```

---

## DeepResearch: Input Manual com Fallback

Quando o Engine precisa de DeepResearch (localização, dados de mercado profundos) e o Gemini API com grounding não é suficiente:

```typescript
// src/lib/deep-research.ts

export async function requestDeepResearch(params: {
  query: string;
  clientName: string;
  docType: string;
}): Promise<DeepResearchResult> {

  // 1. Tentar via Gemini API com grounding
  try {
    const result = await callGeminiWithGrounding(params.query);
    if (result.confidence > 0.8) {
      return { source: 'gemini_api', data: result.text, confidence: result.confidence };
    }
  } catch {}

  // 2. Se não suficiente → pedir input manual
  // Gera o prompt ideal para Paulo colar no DeepResearch do Gemini
  const optimizedPrompt = await generateDeepResearchPrompt(params);

  return {
    source: 'manual_required',
    data: null,
    confidence: 0,
    manual_prompt: optimizedPrompt,
    instructions: `Cola este prompt no Gemini DeepResearch. Após receber o resultado, cole aqui.`,
  };
}
```

Na interface, quando `manual_required`:

```
┌──────────────────────────────────────────────────────┐
│  🔬 DEEP RESEARCH NECESSÁRIO                        │
│──────────────────────────────────────────────────────│
│                                                       │
│  O Gemini API não conseguiu dados suficientes para   │
│  a análise de localização.                           │
│                                                       │
│  Prompt otimizado para DeepResearch:                 │
│  ┌────────────────────────────────────────────────┐  │
│  │ "Analyze the economic viability for a dental   │  │
│  │  technology company in 5 regions: Tampa Bay,   │  │
│  │  FL; Research Triangle, NC; ..."               │  │
│  │                                    [📋 Copiar] │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  Cole o resultado do DeepResearch aqui:              │
│  ┌────────────────────────────────────────────────┐  │
│  │                                                │  │
│  │                [Colar resultado]               │  │
│  │                                                │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  [Continuar sem DeepResearch]  [Inserir resultado]   │
└──────────────────────────────────────────────────────┘
```

Isso mantém a possibilidade de rodar DeepResearch manual e inserir no sistema, como você pediu.

---

## Tabela Supabase: `system_updates`

```sql
CREATE TABLE system_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name TEXT NOT NULL,
  from_version TEXT NOT NULL,
  to_version TEXT NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('add', 'modify', 'remove', 'rollback')),
  affected_section TEXT,
  change_description TEXT NOT NULL,
  original_quote TEXT,               -- citação exata do Paulo
  diff_before TEXT,
  diff_after TEXT,
  github_commit_sha TEXT,
  applied_by TEXT DEFAULT 'paulo',
  status TEXT DEFAULT 'applied' CHECK (status IN ('proposed', 'confirmed', 'applied', 'rolled_back')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_system_updates_system ON system_updates(system_name);
CREATE INDEX idx_system_updates_status ON system_updates(status);
```
