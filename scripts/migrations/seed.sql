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
