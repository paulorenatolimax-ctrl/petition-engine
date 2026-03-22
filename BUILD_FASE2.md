# BUILD FASE 2 — PETITION ENGINE: DE 30% A 95%

Leia este arquivo INTEIRO antes de começar. Depois execute tudo sem perguntar nada.

## REGRAS ABSOLUTAS
- NÃO importar @anthropic-ai/sdk nem @google/generative-ai
- Todos os agentes RETORNAM prompts como strings — Paulo copia pro Claude Code
- NÃO perguntar nada. Executar bloco por bloco.
- Sobrescrever arquivos existentes quando indicado.

---

# ═══════════════════════════════════════
# BLOCO 1: SEED DO SUPABASE (SEM ISSO NADA FUNCIONA)
# ═══════════════════════════════════════

Rodar este SQL no Supabase (dashboard SQL Editor do projeto dmqruovtiivgaqoronvh):

Se não tiver acesso direto ao Supabase, criar o arquivo `scripts/seed.sql` com o conteúdo abaixo e rodar via CLI ou painel.

## Arquivo: scripts/seed.sql

```sql
-- ============================================
-- SEED: system_versions (10 sistemas)
-- ============================================
INSERT INTO system_versions (system_name, version_tag, doc_type, is_active, recommended_model, file_count, system_path, changelog) VALUES
('cover-letter-eb1a', '5.0.0', 'cover_letter_eb1a', true, 'Claude Code', 23, '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5', 'Sistema original v5'),
('cover-letter-eb2-niw', '3.0.0', 'cover_letter_eb2_niw', true, 'Claude Code', 18, '/Users/paulo1844/Documents/AIOS/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions', 'V3 Project Instructions'),
('resume-eb1a', '1.0.0', 'resume', true, 'Claude Code', 9, '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema résumé auto/EB1A_RESUME_SYSTEM', 'Sistema de résumé EB-1A'),
('business-plan', '2.0.0', 'business_plan', true, 'Claude Code', 3, '/Users/paulo1844/Documents/OMNI/_IMIGRAÇÃO/BP Orquestrador/SETUP_GUIDE_2', 'BP Orquestrador v2'),
('metodologia', '2.1.0', 'methodology', true, 'Claude Code', 5, '/Users/paulo1844/Documents/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Metodologia (PROMPTS)', 'Metodologia 2026'),
('declaracao-intencoes', '2.1.0', 'declaration_of_intentions', true, 'Claude Code', 6, '/Users/paulo1844/Documents/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Declaração de Intenções (PROMPTS)', 'Declaração 2026'),
('impacto', '2.0.0', 'impacto_report', true, 'Claude Code', 6, '/Users/paulo1844/Documents/_Z GLOBAL/_PRODUTO NOVO/agents', 'IMPACTO® v2'),
('estrategia-eb2', '1.0.0', 'strategy_eb2', true, 'Claude Code', 9, '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-2 - ESTRATÉGIAS', 'Estratégia EB-2 NIW'),
('estrategia-eb1', '1.0.0', 'strategy_eb1', true, 'Claude Code', 11, '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-1 - ESTRATÉGIA EB-1 (PROMPTS)/_ASSISTENTE FINAL (ESTE)', 'Estratégia EB-1A'),
('localizacao', '1.0.0', 'location_analysis', true, 'Claude Code', 1, '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/LOCALIZAÇÃO - PROMPT', 'Análise de localização')
ON CONFLICT (system_name) DO UPDATE SET
  version_tag = EXCLUDED.version_tag,
  doc_type = EXCLUDED.doc_type,
  is_active = EXCLUDED.is_active,
  recommended_model = EXCLUDED.recommended_model,
  file_count = EXCLUDED.file_count,
  system_path = EXCLUDED.system_path;

-- ============================================
-- SEED: 50 error_rules (6 anos de experiência)
-- ============================================
INSERT INTO error_rules (rule_type, doc_type, rule_description, rule_pattern, rule_action, severity, source, active) VALUES
-- FORBIDDEN TERMS (termos que nunca devem aparecer)
('forbidden_term', NULL, 'Nunca usar "I believe" — parece opinião, não fato', 'I believe', 'block', 'critical', 'paulo_experience', true),
('forbidden_term', NULL, 'Nunca usar "we think" — petição deve ser assertiva', 'we think', 'block', 'critical', 'paulo_experience', true),
('forbidden_term', NULL, 'Nunca usar "hopefully" — demonstra incerteza', 'hopefully', 'block', 'high', 'paulo_experience', true),
('forbidden_term', NULL, 'Nunca usar "might" quando afirmando qualificação', 'might\s+(qualify|meet|satisfy)', 'warn', 'high', 'paulo_experience', true),
('forbidden_term', NULL, 'Nunca usar "try to" — beneficiário ESTÁ fazendo, não tentando', 'try to|tries to|trying to', 'block', 'high', 'paulo_experience', true),
('forbidden_term', NULL, 'Nunca usar "alien" para se referir ao beneficiário em contexto positivo', 'the alien\s+(has|is|will)', 'warn', 'medium', 'paulo_experience', true),
('forbidden_term', NULL, 'Evitar "very unique" — unique já é superlativo', 'very unique', 'warn', 'low', 'paulo_experience', true),
('forbidden_term', NULL, 'Nunca usar "undocumented" — usar "without status" se necessário', 'undocumented', 'warn', 'medium', 'paulo_experience', true),
('forbidden_term', NULL, 'Não usar "illegal immigrant" em nenhum contexto', 'illegal immigrant', 'block', 'critical', 'paulo_experience', true),
('forbidden_term', NULL, 'Evitar "foreign national" — preferir "beneficiary" ou "petitioner"', 'foreign national', 'warn', 'low', 'paulo_experience', true),

-- TERMINOLOGY (termos corretos)
('terminology', NULL, 'Usar "beneficiary" não "applicant" em petições de emprego', 'the applicant(?!\s+(agency|organization))', 'warn', 'medium', 'paulo_experience', true),
('terminology', NULL, 'Usar "petition" não "application" para EB-1/EB-2', 'this application', 'warn', 'medium', 'paulo_experience', true),
('terminology', 'cover_letter_eb1a', 'Referenciar "extraordinary ability" não "exceptional"', 'exceptional ability', 'warn', 'high', 'paulo_experience', true),
('terminology', 'cover_letter_eb2_niw', 'Sempre mencionar "national interest waiver" por extenso na primeira referência', NULL, 'warn', 'medium', 'paulo_experience', true),
('terminology', NULL, 'Citar "8 CFR" não "8 C.F.R." — sem pontos entre letras', '8\s+C\.F\.R\.', 'auto_fix', 'low', 'paulo_experience', true),

-- LEGAL (erros de lógica jurídica)
('legal', 'cover_letter_eb1a', 'EB-1A requer 3 de 10 critérios — nunca dizer "2 critérios"', '(two|2)\s+(criteria|critérios)', 'block', 'critical', 'paulo_experience', true),
('legal', 'cover_letter_eb2_niw', 'NIW usa teste Dhanasar de 3 prongs — nunca referenciar teste antigo NYSDOT', 'NYSDOT', 'block', 'critical', 'paulo_experience', true),
('legal', 'cover_letter_eb2_niw', 'Dhanasar é de 2016, não 2017 — data correta: December 27, 2016', 'Dhanasar.{0,30}2017', 'block', 'critical', 'paulo_experience', true),
('legal', NULL, 'Matter of Kazarian é de 2010, não 2009 ou 2011', 'Kazarian.{0,30}(2009|2011)', 'block', 'high', 'paulo_experience', true),
('legal', NULL, 'USCIS Policy Manual é o M-602 — não referenciar AFM (Adjudicator Field Manual) obsoleto', 'Adjudicator.{0,20}Field.{0,20}Manual|AFM', 'block', 'high', 'paulo_experience', true),

-- CONTENT (erros de conteúdo)
('content', NULL, 'Nome do beneficiário deve aparecer pelo menos 5 vezes no documento', NULL, 'warn', 'high', 'paulo_experience', true),
('content', NULL, 'Não inventar publicações ou prêmios — usar apenas dados do perfil extraído', NULL, 'warn', 'critical', 'paulo_experience', true),
('content', NULL, 'Datas de emprego devem ser consistentes com o résumé', NULL, 'warn', 'high', 'paulo_experience', true),
('content', NULL, 'Número de citações deve vir do Google Scholar ou perfil, nunca inventado', NULL, 'warn', 'critical', 'paulo_experience', true),
('content', 'business_plan', 'Business plan deve ter projeções financeiras de 5 anos, não 3', '(three|3).{0,20}year.{0,20}(projection|forecast)', 'warn', 'high', 'paulo_experience', true),
('content', 'business_plan', 'Revenue projections devem ter base factual — não números aleatórios', NULL, 'warn', 'critical', 'paulo_experience', true),

-- FORMATTING (erros visuais)
('formatting', NULL, 'Cada exhibit/evidence deve ter número sequencial (Exhibit 1, Exhibit 2...)', NULL, 'warn', 'medium', 'paulo_experience', true),
('formatting', NULL, 'Headers de seção devem estar em negrito e com tamanho maior', NULL, 'warn', 'low', 'paulo_experience', true),
('formatting', NULL, 'Tabelas devem ter header row com fundo cinza', NULL, 'warn', 'low', 'paulo_experience', true),
('formatting', NULL, 'Não usar mais de 3 níveis de bullets/indentação', NULL, 'warn', 'low', 'paulo_experience', true),
('formatting', 'cover_letter_eb1a', 'Cada critério EB-1A deve ter header separado (Criterion 1:, Criterion 2:, etc.)', NULL, 'warn', 'medium', 'paulo_experience', true),

-- LOGIC (erros de lógica)
('logic', 'cover_letter_eb1a', 'Não citar critérios EB-2 NIW (Dhanasar/prongs) em petition EB-1A', 'Dhanasar|prong\s+[123]|national interest', 'block', 'critical', 'paulo_experience', true),
('logic', 'cover_letter_eb2_niw', 'Não citar critérios EB-1A (10 criteria/Kazarian) em petition EB-2 NIW', 'extraordinary ability|10 criteria|Kazarian', 'warn', 'high', 'paulo_experience', true),
('logic', NULL, 'Se empresa é nova (<2 anos), não afirmar "established track record"', 'established track record', 'warn', 'medium', 'paulo_experience', true),
('logic', NULL, 'Valor de investimento deve ser coerente com porte da empresa', NULL, 'warn', 'high', 'paulo_experience', true),
('logic', NULL, 'Não usar evidências de um critério para provar outro critério diferente', NULL, 'warn', 'medium', 'paulo_experience', true),

-- SATELLITE LETTERS
('content', 'satellite_letter', 'Carta satélite nunca deve repetir frases de outra carta do mesmo caso', NULL, 'block', 'critical', 'paulo_experience', true),
('content', 'satellite_letter', 'Cada carta deve ter voz única — variar estrutura, tom, vocabulário (anti-ATLAS)', NULL, 'block', 'critical', 'paulo_experience', true),
('formatting', 'satellite_letter', 'Carta deve ter entre 2-4 páginas — nem muito curta nem muito longa', NULL, 'warn', 'medium', 'paulo_experience', true),
('content', 'satellite_letter', 'Signatory deve ter credenciais verificáveis — não inventar títulos', NULL, 'block', 'critical', 'paulo_experience', true),

-- RFE SPECIFIC
('content', 'rfe_response', 'Resposta a RFE deve citar textualmente o que a USCIS pediu', NULL, 'warn', 'critical', 'paulo_experience', true),
('content', 'rfe_response', 'Cada ponto do RFE deve ter resposta individual e específica', NULL, 'warn', 'high', 'paulo_experience', true),
('logic', 'rfe_response', 'Não contradizer informações da petition original', NULL, 'block', 'critical', 'paulo_experience', true),

-- GENERAL QUALITY
('content', NULL, 'Documento não deve ter placeholder text ([INSERT], [TODO], [PREENCHER])', '\\[(INSERT|TODO|PREENCHER|TBD|NOME|DATA)\\]', 'block', 'critical', 'paulo_experience', true),
('formatting', NULL, 'Documento não deve ter texto em português quando deveria ser em inglês', NULL, 'warn', 'high', 'paulo_experience', true),
('content', NULL, 'Não repetir o mesmo parágrafo/sentença em seções diferentes', NULL, 'warn', 'high', 'paulo_experience', true),
('content', NULL, 'Cada afirmação factual deve ter evidência referenciada (Exhibit X)', NULL, 'warn', 'medium', 'paulo_experience', true),
('formatting', NULL, 'Máximo 500 palavras por parágrafo — quebrar parágrafos longos', NULL, 'warn', 'low', 'paulo_experience', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- FUNCTIONS auxiliares
-- ============================================
CREATE OR REPLACE FUNCTION increment_rule_trigger(rule_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE error_rules SET times_triggered = times_triggered + 1 WHERE id = rule_id;
END;
$$ LANGUAGE plpgsql;
```

Para executar: acessa https://supabase.com/dashboard/project/dmqruovtiivgaqoronvh/sql/new e cola o SQL acima.

Se preferir via CLI, rode:
```bash
npx supabase db push --db-url "postgresql://postgres:[SENHA]@db.dmqruovtiivgaqoronvh.supabase.co:5432/postgres" < scripts/seed.sql
```

---

# ═══════════════════════════════════════
# BLOCO 2: GERADOR END-TO-END (CORAÇÃO DO SISTEMA)
# ═══════════════════════════════════════

O gerador precisa funcionar assim:
1. Paulo seleciona cliente
2. Paulo clica num sistema (ex: Cover Letter EB-1A)
3. Modal mostra: seleção de cliente + botão GERAR
4. Ao clicar GERAR: chama POST /api/generate que retorna { prompt, metadata }
5. Modal mostra o PROMPT COMPLETO num textarea copiável
6. Paulo clica "Copiar Prompt" → copia pro clipboard
7. Paulo cola no Claude Code, gera o documento
8. Paulo pode colar o resultado de volta (opcional, fase futura)

O problema atual: o gerador tenta ler SSE stream, mas /api/generate retorna JSON simples. Além disso, quando não tem perfil extraído, o WriterAgent dá erro.

## Arquivo: src/app/gerador/page.tsx (SOBRESCREVER)

```tsx
'use client';

import { useEffect, useState } from 'react';
import { FileText, Zap, Copy, Check, X, ChevronRight, AlertTriangle, Clock, User, Loader2 } from 'lucide-react';

interface SystemVersion {
  id: string;
  system_name: string;
  version_tag: string;
  doc_type: string;
  is_active: boolean;
  recommended_model: string;
  file_count: number;
}

interface Client {
  id: string;
  name: string;
  visa_type: string;
  company_name: string | null;
  client_profiles?: { extracted_at: string | null } | null;
}

const SYSTEM_ICONS: Record<string, typeof FileText> = {};

const SYSTEM_LABELS: Record<string, string> = {
  'cover-letter-eb1a': 'Cover Letter EB-1A',
  'cover-letter-eb2-niw': 'Cover Letter EB-2 NIW',
  'cover-letter-o1': 'Cover Letter O-1',
  'resume-eb1a': 'Résumé EB-1A',
  'business-plan': 'Business Plan',
  'metodologia': 'Metodologia',
  'declaracao-intencoes': 'Declaração de Intenções',
  'localizacao': 'Análise de Localização',
  'impacto': 'IMPACTO®',
  'estrategia-eb1': 'Estratégia EB-1A',
  'estrategia-eb2': 'Estratégia EB-2 NIW',
  'satellite-letters': 'Cartas Satélite',
  'anteprojeto': 'Anteprojeto',
};

export default function GeradorPage() {
  const [systems, setSystems] = useState<SystemVersion[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<SystemVersion | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [promptMetadata, setPromptMetadata] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/systems').then(r => r.json()),
      fetch('/api/clients').then(r => r.json()),
    ]).then(([sysRes, cliRes]) => {
      const sysData = Array.isArray(sysRes.data) ? sysRes.data : sysRes.data?.data || [];
      const cliData = Array.isArray(cliRes.data) ? cliRes.data : cliRes.data?.data || [];
      setSystems(sysData);
      setClients(cliData);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  function openGenModal(sys: SystemVersion) {
    setSelectedSystem(sys);
    setGeneratedPrompt('');
    setPromptMetadata(null);
    setError('');
    setGenerating(false);
    setCopied(false);
    setShowModal(true);
  }

  async function handleGenerate() {
    if (!selectedClient || !selectedSystem) return;
    setGenerating(true);
    setError('');
    setGeneratedPrompt('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: selectedClient,
          doc_type: selectedSystem.doc_type || selectedSystem.system_name,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Erro ao gerar prompt');
        return;
      }

      const result = json.data;
      setGeneratedPrompt(result.prompt);
      setPromptMetadata(result.metadata);
    } catch (err: any) {
      setError(err.message || 'Erro de conexão');
    } finally {
      setGenerating(false);
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = generatedPrompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  const selectedClientData = clients.find(c => c.id === selectedClient);
  const hasProfile = selectedClientData?.client_profiles?.extracted_at;

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#f5f5f5', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={28} color="#2dd4bf" />
            Gerador de Documentos
          </h1>
          <p style={{ color: '#666', margin: '6px 0 0', fontSize: '14px' }}>
            Selecione o cliente e o sistema para montar o prompt
          </p>
        </div>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#f5f5f5',
            fontSize: '14px',
            outline: 'none',
            minWidth: '260px',
          }}
        >
          <option value="">Selecionar cliente...</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.visa_type})
            </option>
          ))}
        </select>
      </div>

      {/* Client Warning */}
      {selectedClient && !hasProfile && (
        <div style={{
          background: 'rgba(234,179,8,0.08)',
          border: '1px solid rgba(234,179,8,0.2)',
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <AlertTriangle size={18} color="#eab308" />
          <span style={{ color: '#eab308', fontSize: '13px' }}>
            Este cliente ainda não tem perfil extraído. O prompt será gerado sem dados do perfil.
            Vá em Clientes → {selectedClientData?.name} → Extrair Perfil primeiro para melhores resultados.
          </span>
        </div>
      )}

      {/* Systems Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '12px' }}>Carregando sistemas...</p>
        </div>
      ) : systems.length === 0 ? (
        <div style={{
          background: '#111',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '60px',
          textAlign: 'center',
        }}>
          <Zap size={48} color="#333" />
          <h3 style={{ color: '#f5f5f5', margin: '16px 0 8px' }}>Nenhum sistema registrado</h3>
          <p style={{ color: '#666' }}>Execute o SQL seed para carregar os 10 sistemas</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {systems.map((sys) => (
            <div
              key={sys.id}
              onClick={() => selectedClient ? openGenModal(sys) : alert('Selecione um cliente primeiro')}
              style={{
                background: '#111',
                border: `1px solid ${sys.is_active ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '12px',
                padding: '24px 20px',
                cursor: selectedClient ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                opacity: sys.is_active ? (selectedClient ? 1 : 0.6) : 0.4,
              }}
              onMouseOver={(e) => {
                if (selectedClient) {
                  e.currentTarget.style.background = '#1a1a1a';
                  e.currentTarget.style.borderColor = 'rgba(45,212,191,0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#111';
                e.currentTarget.style.borderColor = sys.is_active ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                background: 'rgba(45,212,191,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '14px',
              }}>
                <FileText size={22} color="#2dd4bf" />
              </div>
              <div style={{ color: '#f5f5f5', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                {SYSTEM_LABELS[sys.system_name] || sys.system_name}
              </div>
              <div style={{ color: '#555', fontSize: '12px', marginBottom: '10px' }}>
                v{sys.version_tag} · {sys.file_count} arquivos
              </div>
              <div style={{
                display: 'inline-block',
                background: 'rgba(45,212,191,0.08)',
                color: '#2dd4bf',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 500,
              }}>
                {sys.recommended_model || 'Claude Code'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generation Modal */}
      {showModal && selectedSystem && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '32px',
            width: generatedPrompt ? '800px' : '520px',
            maxHeight: '85vh',
            overflow: 'auto',
            transition: 'width 0.3s',
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ color: '#f5f5f5', margin: 0, fontSize: '20px', fontWeight: 600 }}>
                  {SYSTEM_LABELS[selectedSystem.system_name] || selectedSystem.system_name}
                </h2>
                <p style={{ color: '#555', margin: '4px 0 0', fontSize: '13px' }}>
                  v{selectedSystem.version_tag} · {selectedSystem.file_count} arquivos
                </p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={20} color="#666" />
              </button>
            </div>

            {/* Pre-generation State */}
            {!generating && !generatedPrompt && !error && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Cliente</label>
                  <div style={{
                    background: '#0a0a0a',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'rgba(45,212,191,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <User size={18} color="#2dd4bf" />
                    </div>
                    <div>
                      <div style={{ color: '#f5f5f5', fontWeight: 500, fontSize: '14px' }}>
                        {selectedClientData?.name || 'Cliente selecionado'}
                      </div>
                      <div style={{ color: '#555', fontSize: '12px' }}>
                        {selectedClientData?.visa_type} · {hasProfile ? 'Perfil extraído' : 'Sem perfil'}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#888', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleGenerate}
                    style={{
                      background: 'linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%)',
                      color: '#0a0a0a',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Zap size={16} />
                    Montar Prompt
                  </button>
                </div>
              </>
            )}

            {/* Generating State */}
            {generating && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Loader2 size={36} color="#2dd4bf" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#888', marginTop: '16px', fontSize: '14px' }}>
                  Lendo arquivos do sistema, montando prompt com regras de erro...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '16px',
              }}>
                <div style={{ color: '#ef4444', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>Erro na geração</div>
                <div style={{ color: '#f87171', fontSize: '13px' }}>{error}</div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <button onClick={handleGenerate} style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    Tentar novamente
                  </button>
                  <button onClick={() => setShowModal(false)} style={{ background: 'transparent', color: '#888', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    Fechar
                  </button>
                </div>
              </div>
            )}

            {/* Generated Prompt */}
            {generatedPrompt && (
              <>
                {/* Metadata Bar */}
                {promptMetadata && (
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                  }}>
                    {[
                      { label: 'Sistema', value: promptMetadata.system },
                      { label: 'Arquivos lidos', value: promptMetadata.files_read?.length || 0 },
                      { label: 'Regras aplicadas', value: promptMetadata.rules_count },
                      { label: 'Tokens estimados', value: `~${(promptMetadata.estimated_tokens || 0).toLocaleString()}` },
                    ].map((item, i) => (
                      <div key={i} style={{
                        background: '#0a0a0a',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        <div style={{ color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                        <div style={{ color: '#f5f5f5', fontSize: '14px', fontWeight: 500 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Prompt Text */}
                <div style={{ position: 'relative' }}>
                  <textarea
                    readOnly
                    value={generatedPrompt}
                    style={{
                      width: '100%',
                      height: '400px',
                      background: '#0a0a0a',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      padding: '16px',
                      color: '#d4d4d4',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      resize: 'vertical',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#555', fontSize: '12px' }}>
                    {generatedPrompt.length.toLocaleString()} caracteres · Copie e cole no Claude Code
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setShowModal(false)}
                      style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#888', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
                    >
                      Fechar
                    </button>
                    <button
                      onClick={copyPrompt}
                      style={{
                        background: copied ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%)',
                        color: copied ? '#22c55e' : '#0a0a0a',
                        border: copied ? '1px solid rgba(34,197,94,0.3)' : 'none',
                        padding: '10px 24px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                      }}
                    >
                      {copied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar Prompt</>}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
```

---

# ═══════════════════════════════════════
# BLOCO 3: PÁGINA DE DETALHE DO CLIENTE
# ═══════════════════════════════════════

## Arquivo: src/app/clientes/[id]/page.tsx (CRIAR NOVO)

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, FileText, Upload, Copy, Check, Loader2, AlertTriangle, ChevronRight, Clock, Shield } from 'lucide-react';

interface ClientDetail {
  id: string;
  name: string;
  email: string | null;
  visa_type: string;
  status: string;
  company_name: string | null;
  proposed_endeavor: string | null;
  soc_code: string | null;
  soc_title: string | null;
  location_city: string | null;
  location_state: string | null;
  docs_folder_path: string | null;
  notes: string | null;
  created_at: string;
  client_profiles?: {
    extracted_at: string | null;
    full_name: string | null;
    nationality: string | null;
    education: any[];
    work_experience: any[];
    total_years_experience: number | null;
    publications: any[];
    awards: any[];
    total_evidence_count: number;
    eb1a_criteria: Record<string, any>;
    dhanasar_pillars: Record<string, any>;
  } | null;
  documents?: Array<{
    id: string;
    doc_type: string;
    version: number;
    status: string;
    quality_passed: boolean | null;
    generated_at: string;
  }>;
  activity_log?: Array<{
    id: string;
    action: string;
    details: any;
    created_at: string;
  }>;
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [extractionPrompt, setExtractionPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [folderPath, setFolderPath] = useState('');
  const [showProfileJson, setShowProfileJson] = useState(false);
  const [profileJsonInput, setProfileJsonInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [editingDocsPath, setEditingDocsPath] = useState(false);
  const [newDocsPath, setNewDocsPath] = useState('');

  useEffect(() => {
    fetchClient();
  }, [params.id]);

  async function fetchClient() {
    try {
      const res = await fetch(`/api/clients/${params.id}`);
      const json = await res.json();
      const data = json.data;
      setClient(data);
      setFolderPath(data?.docs_folder_path || '');
      setNewDocsPath(data?.docs_folder_path || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleExtract() {
    if (!folderPath) return;
    setExtracting(true);
    setExtractionPrompt('');

    try {
      // First save the folder path if changed
      if (folderPath !== client?.docs_folder_path) {
        await fetch(`/api/clients/${params.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ docs_folder_path: folderPath }),
        });
      }

      const res = await fetch(`/api/clients/${params.id}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder_path: folderPath }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let prompt = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          const events = text.split('\n\n').filter(Boolean);
          for (const event of events) {
            const dataLine = event.split('\n').find(l => l.startsWith('data:'));
            if (dataLine) {
              try {
                const data = JSON.parse(dataLine.replace('data: ', ''));
                if (data.prompt) prompt = data.prompt;
              } catch {}
            }
          }
        }
      }

      if (prompt) setExtractionPrompt(prompt);
    } catch (err: any) {
      alert('Erro na extração: ' + err.message);
    } finally {
      setExtracting(false);
    }
  }

  async function saveProfile() {
    setSavingProfile(true);
    try {
      const profileData = JSON.parse(profileJsonInput);
      await fetch(`/api/clients/${params.id}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      setShowProfileJson(false);
      setProfileJsonInput('');
      fetchClient();
    } catch (err: any) {
      alert('JSON inválido: ' + err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function updateDocsPath() {
    await fetch(`/api/clients/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docs_folder_path: newDocsPath }),
    });
    setEditingDocsPath(false);
    setFolderPath(newDocsPath);
    fetchClient();
  }

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /></div>;
  if (!client) return <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>Cliente não encontrado</div>;

  const profile = client.client_profiles;
  const hasProfile = profile?.extracted_at;

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Back + Header */}
      <button onClick={() => router.push('/clientes')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', fontSize: '13px', padding: 0 }}>
        <ArrowLeft size={16} /> Voltar para Clientes
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(45,212,191,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#2dd4bf', fontWeight: 700 }}>
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f5f5f5', margin: 0 }}>{client.name}</h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '6px' }}>
              <span style={{ background: 'rgba(45,212,191,0.1)', color: '#2dd4bf', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{client.visa_type}</span>
              {client.company_name && <span style={{ color: '#666', fontSize: '13px' }}>{client.company_name}</span>}
              {client.location_city && <span style={{ color: '#555', fontSize: '12px' }}>{client.location_city}, {client.location_state}</span>}
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push(`/gerador?client=${client.id}`)}
          style={{ background: 'linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%)', color: '#0a0a0a', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
        >
          Gerar Documento
        </button>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Dados do Cliente</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {client.email && <div style={{ color: '#ccc', fontSize: '13px' }}>Email: {client.email}</div>}
            {client.proposed_endeavor && <div style={{ color: '#ccc', fontSize: '13px' }}>Endeavor: {client.proposed_endeavor}</div>}
            {client.soc_code && <div style={{ color: '#ccc', fontSize: '13px' }}>SOC: {client.soc_code} — {client.soc_title}</div>}
            <div style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>Criado em: {new Date(client.created_at).toLocaleDateString('pt-BR')}</div>
          </div>
        </div>

        <div style={{ background: '#111', border: `1px solid ${hasProfile ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)'}`, borderRadius: '12px', padding: '20px' }}>
          <div style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Perfil Extraído</div>
          {hasProfile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ color: '#22c55e', fontSize: '13px', fontWeight: 500 }}>Perfil disponível</div>
              <div style={{ color: '#ccc', fontSize: '12px' }}>Evidências: {profile?.total_evidence_count || 0}</div>
              <div style={{ color: '#ccc', fontSize: '12px' }}>Educação: {profile?.education?.length || 0} registros</div>
              <div style={{ color: '#ccc', fontSize: '12px' }}>Publicações: {profile?.publications?.length || 0}</div>
              <div style={{ color: '#555', fontSize: '11px' }}>Extraído: {new Date(profile!.extracted_at!).toLocaleDateString('pt-BR')}</div>
            </div>
          ) : (
            <div style={{ color: '#eab308', fontSize: '13px' }}>
              <AlertTriangle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Perfil ainda não extraído
            </div>
          )}
        </div>
      </div>

      {/* Extraction Section */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ color: '#f5f5f5', margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Upload size={18} color="#2dd4bf" />
          Extração de Documentos
        </h3>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Caminho da pasta de documentos do cliente"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            style={{ flex: 1, background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', color: '#f5f5f5', fontSize: '13px', outline: 'none' }}
          />
          <button
            onClick={handleExtract}
            disabled={!folderPath || extracting}
            style={{
              background: folderPath && !extracting ? 'linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%)' : '#222',
              color: folderPath && !extracting ? '#0a0a0a' : '#555',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: folderPath && !extracting ? 'pointer' : 'not-allowed',
              fontSize: '13px',
              whiteSpace: 'nowrap',
            }}
          >
            {extracting ? 'Extraindo...' : 'Extrair Perfil'}
          </button>
        </div>

        {/* Extraction Prompt Result */}
        {extractionPrompt && (
          <div>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>
              Prompt de extração gerado. Copie e cole no Claude Code. Depois cole o JSON resultante abaixo.
            </div>
            <textarea
              readOnly
              value={extractionPrompt}
              style={{ width: '100%', height: '200px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px', color: '#d4d4d4', fontSize: '11px', fontFamily: 'monospace', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(extractionPrompt);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{ background: 'rgba(45,212,191,0.1)', color: '#2dd4bf', border: '1px solid rgba(45,212,191,0.2)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {copied ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar Prompt</>}
              </button>
              <button
                onClick={() => setShowProfileJson(true)}
                style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
              >
                Colar JSON do Perfil
              </button>
            </div>
          </div>
        )}

        {/* Profile JSON Input */}
        {showProfileJson && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>
              Cole o JSON retornado pelo Claude Code:
            </div>
            <textarea
              value={profileJsonInput}
              onChange={(e) => setProfileJsonInput(e.target.value)}
              placeholder='{"full_name": "...", "nationality": "...", ...}'
              style={{ width: '100%', height: '200px', background: '#0a0a0a', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px', padding: '12px', color: '#d4d4d4', fontSize: '11px', fontFamily: 'monospace', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowProfileJson(false)} style={{ background: 'transparent', color: '#888', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Cancelar</button>
              <button onClick={saveProfile} disabled={!profileJsonInput || savingProfile} style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                {savingProfile ? 'Salvando...' : 'Salvar Perfil'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Documents History */}
      {client.documents && client.documents.length > 0 && (
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ color: '#f5f5f5', margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#2dd4bf" />
            Documentos Gerados ({client.documents.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {client.documents.map(doc => (
              <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#0a0a0a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={16} color="#666" />
                  <span style={{ color: '#f5f5f5', fontSize: '13px' }}>{doc.doc_type}</span>
                  <span style={{ color: '#555', fontSize: '11px' }}>v{doc.version}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: doc.quality_passed === true ? '#22c55e' : doc.quality_passed === false ? '#ef4444' : '#555',
                  }} />
                  <span style={{ color: '#555', fontSize: '11px' }}>{new Date(doc.generated_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Log */}
      {client.activity_log && client.activity_log.length > 0 && (
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ color: '#f5f5f5', margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#2dd4bf" />
            Atividade Recente
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {client.activity_log.slice(0, 10).map(log => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ color: '#ccc', fontSize: '12px' }}>{log.action.replace(/_/g, ' ')}</span>
                <span style={{ color: '#555', fontSize: '11px' }}>{new Date(log.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
```

---

# ═══════════════════════════════════════
# BLOCO 4: CORRIGIR NAVEGAÇÃO (LINKS NA LISTA DE CLIENTES)
# ═══════════════════════════════════════

Na página `src/app/clientes/page.tsx`, os cards de clientes devem ser clicáveis e levar pra `/clientes/[id]`.

Encontrar o div que tem `key={client.id}` na lista de clientes e wrappear com um Link:

1. Adicionar import no topo: `import Link from 'next/link';`
2. No map de clientes, wrappear o card com: `<Link href={`/clientes/${client.id}`} style={{ textDecoration: 'none' }}>...</Link>`

OU, se preferir, simplesmente adicionar `onClick={() => window.location.href = '/clientes/' + client.id}` no div existente.

---

# ═══════════════════════════════════════
# BLOCO 5: PIPELINE ANTEPROJETO (9 PROMPTS SEQUENCIAIS)
# ═══════════════════════════════════════

O Anteprojeto é o documento de estratégia EB-2 NIW que requer 9 prompts sequenciais.
Quando o doc_type é "anteprojeto", o gerador deve mostrar uma interface diferente:
em vez de um único prompt, mostra os 9 prompts em sequência, com um botão "Gerar Prompt X" para cada um.

## Arquivo: src/app/api/generate/anteprojeto/route.ts (CRIAR NOVO)

```typescript
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { apiError, apiSuccess } from '@/lib/api-helpers';
import { readSystemFiles } from '@/lib/file-reader';

const ANTEPROJETO_STAGES = [
  { id: 1, name: 'Análise do Perfil', instruction: 'Analise o perfil completo do beneficiário e identifique os pontos fortes e fracos para uma petição EB-2 NIW.' },
  { id: 2, name: 'Proposed Endeavor', instruction: 'Defina o proposed endeavor com base no perfil. Deve ser specific, measurable, e demonstrar substantial merit e national importance.' },
  { id: 3, name: 'Prong 1 — Merit & Importance', instruction: 'Construa o argumento completo do Prong 1 de Dhanasar: substantial merit e national importance do proposed endeavor.' },
  { id: 4, name: 'Prong 2 — Well Positioned', instruction: 'Construa o argumento do Prong 2: o beneficiário está well positioned para avançar o endeavor. Use evidências concretas.' },
  { id: 5, name: 'Prong 3 — Balance of Factors', instruction: 'Construa o argumento do Prong 3: no balance, seria benéfico waiver o requisito de labor certification.' },
  { id: 6, name: 'Mapeamento de Evidências', instruction: 'Mapeie cada evidência/exhibit disponível para os prongs que ela suporta. Identifique gaps.' },
  { id: 7, name: 'Cartas Satélite Necessárias', instruction: 'Liste as cartas satélite necessárias com tipo (investor_pj, current_client_pf, etc.), nome sugerido do signatory, e argumentos que cada carta deve reforçar.' },
  { id: 8, name: 'Estrutura da Cover Letter', instruction: 'Proponha a estrutura completa da cover letter com seções, subseções, e bullet points de conteúdo para cada uma.' },
  { id: 9, name: 'Resumo Executivo', instruction: 'Gere um resumo executivo de 1-2 páginas que sintetize toda a estratégia para revisão final.' },
];

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();

  const { client_id, stage } = body;
  if (!client_id || !stage) return apiError('client_id e stage são obrigatórios', 400);

  const stageConfig = ANTEPROJETO_STAGES.find(s => s.id === stage);
  if (!stageConfig) return apiError(`Stage ${stage} não existe. Range: 1-9`, 400);

  try {
    // Buscar dados
    const { data: client } = await supabase
      .from('clients')
      .select('*, client_profiles(*)')
      .eq('id', client_id)
      .single();

    if (!client) return apiError('Cliente não encontrado', 404);

    // Ler sistema
    let systemContent = '';
    try {
      const result = await readSystemFiles('estrategia-eb2');
      systemContent = result.content;
    } catch {
      systemContent = '[Sistema estrategia-eb2 não disponível via symlink]';
    }

    // Buscar error rules
    const { data: rules } = await supabase
      .from('error_rules')
      .select('*')
      .eq('active', true)
      .or('doc_type.is.null,doc_type.eq.anteprojeto,doc_type.eq.strategy_eb2');

    const rulesText = (rules || []).map(r => `[${r.severity.toUpperCase()}] ${r.rule_description}`).join('\n');

    const profileContext = client.client_profiles
      ? JSON.stringify(client.client_profiles, null, 2)
      : '[Perfil não extraído — gere com informações disponíveis]';

    const prompt = `# ANTEPROJETO EB-2 NIW — Stage ${stageConfig.id}/9: ${stageConfig.name}

## INSTRUÇÃO
${stageConfig.instruction}

## CONTEXTO DO SISTEMA
${systemContent.substring(0, 50000)}

## DADOS DO CLIENTE
Nome: ${client.name}
Visto: ${client.visa_type}
Endeavor: ${client.proposed_endeavor || 'A definir neste stage'}
Empresa: ${client.company_name || 'N/A'}
SOC: ${client.soc_code || '?'} — ${client.soc_title || '?'}
Localização: ${client.location_city || '?'}, ${client.location_state || '?'}

## PERFIL EXTRAÍDO
${profileContext}

## REGRAS DE ERRO (OBEDEÇA TODAS)
${rulesText || 'Nenhuma regra adicional.'}

## FORMATO DE SAÍDA
Gere o conteúdo completo deste stage. Se necessário, use markdown para estruturar.
Ao final, adicione uma seção "## Próximo passo" indicando o que o Stage ${stageConfig.id + 1} fará.`;

    return apiSuccess({
      prompt,
      metadata: {
        stage: stageConfig.id,
        stage_name: stageConfig.name,
        total_stages: 9,
        estimated_tokens: Math.round(prompt.length / 4),
      },
    });
  } catch (err: any) {
    return apiError(err.message);
  }
}
```

---

# ═══════════════════════════════════════
# BLOCO 6: SETUP SYMLINKS + PIP
# ═══════════════════════════════════════

Rodar estes comandos no terminal do projeto:

```bash
# 1. Dar permissão ao script
chmod +x scripts/setup-symlinks.sh

# 2. Rodar symlinks
bash scripts/setup-symlinks.sh

# 3. Instalar dependências Python
pip3 install -r scripts/requirements.txt
```

---

# ═══════════════════════════════════════
# BLOCO 7: CORRIGIR BUGS CONHECIDOS
# ═══════════════════════════════════════

## Bug 1: API /api/clients retorna double-wrap

A rota `/api/clients` faz `apiSuccess({ data, total, ... })` que resulta em `{ data: { data: [...], total } }`.

Corrigir `/api/clients/route.ts` no GET:
Trocar:
```typescript
return apiSuccess({ data, total: count, page, totalPages: Math.ceil((count || 0) / limit) });
```
Por:
```typescript
return NextResponse.json({ data: data || [], total: count || 0, page, totalPages: Math.ceil((count || 0) / limit) });
```

Isso garante que `json.data` é diretamente o array de clientes.

## Bug 2: Dashboard quality_pass_rate

No dashboard, calcular corretamente:
```typescript
quality_pass_rate: docs && docs.length > 0
  ? Math.round((docs.filter(d => d.quality_passed).length / docs.length) * 100)
  : 0
```

Adicionar este campo no retorno de `/api/dashboard/stats`.

## Bug 3: Todas as páginas que fazem fetch de clients devem tratar ambos formatos

Em qualquer página que faz `fetch('/api/clients')`, usar:
```typescript
const json = await res.json();
const clientList = Array.isArray(json.data) ? json.data : json.data?.data || [];
```

---

# ═══════════════════════════════════════
# BLOCO 8: VERIFICAÇÃO FINAL
# ═══════════════════════════════════════

Após executar TUDO:

1. `npx tsc --noEmit` → ZERO erros
2. `grep -r "anthropic-ai/sdk\|generative-ai" src/` → ZERO matches
3. Abrir localhost:3000 → Dashboard com KPIs
4. Abrir localhost:3000/clientes → Lista funcional (pode estar vazia, mas sem erros)
5. Abrir localhost:3000/gerador → Grid de 10 sistemas
6. Abrir localhost:3000/erros → 50 regras carregadas (após seed)
7. Abrir localhost:3000/sistemas → 10 sistemas com status de symlink
8. Clicar num cliente → Abrir /clientes/[id] com dados + extração
9. No gerador, selecionar cliente + sistema → Clicar GERAR → Ver prompt copiável

Commit:
```bash
git add -A
git commit -m "feat: fase 2 completa — gerador end-to-end, detalhe do cliente, seed 50 regras, pipeline anteprojeto"
git push
```

NÃO PERGUNTE NADA. EXECUTE TUDO.
