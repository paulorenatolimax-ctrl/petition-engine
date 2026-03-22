# 02 — SCHEMA SUPABASE

Copie e execute este SQL no SQL Editor do Supabase. Rode na ordem (as foreign keys dependem da ordem).

```sql
-- ============================================
-- PETITION ENGINE — Schema Completo
-- ============================================

-- 1. CLIENTES
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  visa_type TEXT NOT NULL CHECK (visa_type IN ('EB-1A', 'EB-2-NIW', 'O-1', 'L-1', 'EB-1C')),
  proposed_endeavor TEXT,
  soc_code TEXT,
  soc_title TEXT,
  location_city TEXT,
  location_state TEXT,
  location_msa TEXT,
  company_name TEXT,
  company_type TEXT, -- LLC, C-Corp, Sole Proprietorship
  company_ein TEXT,
  naics_code TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
  docs_folder_path TEXT, -- /Users/paulo1844/Documents/CLIENTES/Nome_Cliente
  drive_folder_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PERFIL EXTRAÍDO DO CLIENTE (Agente Extrator popula)
CREATE TABLE client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  nationality TEXT,
  date_of_birth DATE,
  current_visa_status TEXT,
  education JSONB DEFAULT '[]',
  work_experience JSONB DEFAULT '[]',
  total_years_experience INTEGER,
  evidence_inventory JSONB DEFAULT '[]',
  total_evidence_count INTEGER DEFAULT 0,
  publications JSONB DEFAULT '[]',
  media_coverage JSONB DEFAULT '[]',
  awards JSONB DEFAULT '[]',
  financial_data JSONB DEFAULT '{}',
  satellite_letters_needed JSONB DEFAULT '[]',
  eb1a_criteria JSONB DEFAULT '{}',
  dhanasar_pillars JSONB DEFAULT '{}',
  o1_criteria JSONB DEFAULT '{}',
  raw_extracted_text TEXT, -- texto completo extraído (para re-processamento)
  extracted_at TIMESTAMPTZ DEFAULT now(),
  extraction_version TEXT DEFAULT 'v1'
);

-- 3. DOCUMENTOS GERADOS
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL CHECK (doc_type IN (
    'resume', 'cover_letter_eb1a', 'cover_letter_eb2_niw', 'cover_letter_o1',
    'business_plan', 'methodology', 'declaration_of_intentions',
    'anteprojeto', 'location_analysis', 'impacto_report',
    'satellite_letter', 'photographic_report', 'rfe_response',
    'strategy_eb1', 'strategy_eb2'
  )),
  doc_subtype TEXT, -- para satélite: 'investor_pj', 'strategic_partner', etc.
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'generating' CHECK (status IN (
    'generating', 'quality_check', 'review_pending', 'approved', 'delivered', 'error'
  )),
  system_used TEXT,
  system_path TEXT,
  output_file_path TEXT,
  output_file_size BIGINT,
  page_count INTEGER,
  quality_score JSONB DEFAULT '{}',
  quality_passed BOOLEAN,
  quality_notes TEXT,
  uscis_risk_score JSONB DEFAULT '{}', -- {overall: 'green', criteria: {C1: 'green', C2: 'yellow'...}}
  generation_time_seconds INTEGER,
  tokens_used INTEGER,
  model_used TEXT,
  cost_usd DECIMAL(8,4),
  generated_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- 4. REGRAS DE ERRO (auto-aprendizado)
CREATE TABLE error_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_type TEXT NOT NULL CHECK (rule_type IN (
    'forbidden_term', 'formatting', 'content', 'logic', 'legal', 'terminology', 'visual'
  )),
  doc_type TEXT, -- NULL = aplica a todos
  rule_description TEXT NOT NULL,
  rule_pattern TEXT, -- regex ou texto literal
  rule_action TEXT NOT NULL CHECK (rule_action IN ('block', 'warn', 'auto_fix')),
  auto_fix_replacement TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source TEXT DEFAULT 'manual', -- 'manual', 'quality_agent', 'paulo_feedback'
  active BOOLEAN DEFAULT true,
  times_triggered INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  github_commit_sha TEXT
);

-- 5. FILA DE GERAÇÃO
CREATE TABLE generation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  doc_type TEXT NOT NULL,
  doc_subtype TEXT,
  priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  config JSONB DEFAULT '{}', -- parâmetros específicos
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  document_id UUID REFERENCES documents(id), -- link para o doc gerado
  queued_at TIMESTAMPTZ DEFAULT now()
);

-- 6. VERSÕES DOS SISTEMAS
CREATE TABLE system_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name TEXT NOT NULL,
  system_path TEXT NOT NULL,
  version_tag TEXT NOT NULL,
  file_count INTEGER,
  files_hash TEXT,
  changelog TEXT,
  github_commit_sha TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. LOG DE ATIVIDADES (timeline do cliente)
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id),
  action TEXT NOT NULL, -- 'generated', 'quality_passed', 'quality_failed', 'approved', 'error_reported', 'fix_applied', 'delivered', 'rollback'
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_documents_client ON documents(client_id);
CREATE INDEX idx_documents_type ON documents(doc_type);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_error_rules_active ON error_rules(active) WHERE active = true;
CREATE INDEX idx_error_rules_doc_type ON error_rules(doc_type);
CREATE INDEX idx_generation_queue_status ON generation_queue(status);
CREATE INDEX idx_activity_log_client ON activity_log(client_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Incrementar times_triggered quando regra é acionada
CREATE OR REPLACE FUNCTION increment_rule_trigger(rule_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE error_rules SET times_triggered = times_triggered + 1 WHERE id = rule_id;
END;
$$ LANGUAGE plpgsql;

-- Auto-increment version de documento
CREATE OR REPLACE FUNCTION next_doc_version(p_client_id UUID, p_doc_type TEXT)
RETURNS INTEGER AS $$
DECLARE
  max_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version), 0) INTO max_version
  FROM documents
  WHERE client_id = p_client_id AND doc_type = p_doc_type;
  RETURN max_version + 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Para uso local single-user, RLS pode ser desabilitado.
-- Se no futuro virar multi-tenant, ativar RLS com policies por user_id.

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policy: permite tudo para authenticated (single user)
CREATE POLICY "Allow all for authenticated" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON client_profiles FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON documents FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON error_rules FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON generation_queue FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON system_versions FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON activity_log FOR ALL USING (true);
```

## Dados Iniciais (Seed)

Após rodar o schema, popular com os sistemas existentes:

```sql
-- Registrar sistemas existentes
INSERT INTO system_versions (system_name, system_path, version_tag, is_active) VALUES
  ('Cover Letter EB-1A', '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5', 'v5.0.0', true),
  ('Cover Letter EB-2 NIW', '/Users/paulo1844/Documents/AIOS/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions', 'v3.0.0', true),
  ('Résumé EB-1A', '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema résumé auto/EB1A_RESUME_SYSTEM', 'v1.0.0', true),
  ('Business Plan', '/Users/paulo1844/Documents/OMNI/_IMIGRAÇÃO/BP Orquestrador/SETUP_GUIDE_2', 'v2.0.0', true),
  ('Metodologia', '/Users/paulo1844/Documents/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Metodologia (PROMPTS)', 'v2.1.0', true),
  ('Declaração de Intenções', '/Users/paulo1844/Documents/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Declaração de Intenções (PROMPTS)', 'v2.1.0', true),
  ('IMPACTO®', '/Users/paulo1844/Documents/_Z GLOBAL/_PRODUTO NOVO/agents', 'v2.0.0', true),
  ('Estratégia EB-2 NIW', '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-2 - ESTRATÉGIAS', 'v1.0.0', true),
  ('Estratégia EB-1A', '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-1 - ESTRATÉGIA EB-1 (PROMPTS)/_ASSISTENTE FINAL (ESTE)', 'v1.0.0', true),
  ('Localização', '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/LOCALIZAÇÃO - PROMPT', 'v1.0.0', true);
```
