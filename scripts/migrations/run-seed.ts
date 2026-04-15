import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function runSeed() {
  console.log('🌱 Iniciando seed do Supabase...');

  // 1. INSERT system_versions (10 sistemas)
  const systemsFull = [
    { system_name: 'cover-letter-eb1a', version_tag: '5.0.0', doc_type: 'cover_letter_eb1a', is_active: true, recommended_model: 'Claude Code', file_count: 23, system_path: '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema cover auto/EB1A_SYSTEM_v5', changelog: 'Sistema original v5' },
    { system_name: 'cover-letter-eb2-niw', version_tag: '3.0.0', doc_type: 'cover_letter_eb2_niw', is_active: true, recommended_model: 'Claude Code', file_count: 18, system_path: '/Users/paulo1844/Documents/AIOS/CONSTRUTOR COVER EB-2 NIW/V3_Project Instructions', changelog: 'V3 Project Instructions' },
    { system_name: 'resume-eb1a', version_tag: '1.0.0', doc_type: 'resume', is_active: true, recommended_model: 'Claude Code', file_count: 9, system_path: '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/_sistema résumé auto/EB1A_RESUME_SYSTEM', changelog: 'Sistema de résumé EB-1A' },
    { system_name: 'business-plan', version_tag: '2.0.0', doc_type: 'business_plan', is_active: true, recommended_model: 'Claude Code', file_count: 3, system_path: '/Users/paulo1844/Documents/OMNI/_IMIGRAÇÃO/BP Orquestrador/SETUP_GUIDE_2', changelog: 'BP Orquestrador v2' },
    { system_name: 'metodologia', version_tag: '2.1.0', doc_type: 'methodology', is_active: true, recommended_model: 'Claude Code', file_count: 5, system_path: '/Users/paulo1844/Documents/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Metodologia (PROMPTS)', changelog: 'Metodologia 2026' },
    { system_name: 'declaracao-intencoes', version_tag: '2.1.0', doc_type: 'declaration_of_intentions', is_active: true, recommended_model: 'Claude Code', file_count: 6, system_path: '/Users/paulo1844/Documents/_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Declaração de Intenções (PROMPTS)', changelog: 'Declaração 2026' },
    { system_name: 'impacto', version_tag: '2.0.0', doc_type: 'impacto_report', is_active: true, recommended_model: 'Claude Code', file_count: 6, system_path: '/Users/paulo1844/Documents/_Z GLOBAL/_PRODUTO NOVO/agents', changelog: 'IMPACTO® v2' },
    { system_name: 'estrategia-eb2', version_tag: '1.0.0', doc_type: 'strategy_eb2', is_active: true, recommended_model: 'Claude Code', file_count: 9, system_path: '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-2 - ESTRATÉGIAS', changelog: 'Estratégia EB-2 NIW' },
    { system_name: 'estrategia-eb1', version_tag: '1.0.0', doc_type: 'strategy_eb1', is_active: true, recommended_model: 'Claude Code', file_count: 11, system_path: '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-1 - ESTRATÉGIA EB-1 (PROMPTS)/_ASSISTENTE FINAL (ESTE)', changelog: 'Estratégia EB-1A' },
    { system_name: 'localizacao', version_tag: '1.0.0', doc_type: 'location_analysis', is_active: true, recommended_model: 'Claude Code', file_count: 1, system_path: '/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/LOCALIZAÇÃO - PROMPT', changelog: 'Análise de localização' },
  ];

  // Try full insert first; if it fails due to missing columns, fall back to minimal
  let useFallback = false;

  // Test with first system using plain insert
  const testResult = await supabase.from('system_versions').insert(systemsFull[0]);
  if (testResult.error) {
    if (testResult.error.message.includes('doc_type') || testResult.error.message.includes('column') || testResult.error.message.includes('schema')) {
      console.log(`⚠️ Full insert failed: ${testResult.error.message}`);
      console.log('⚠️ Falling back to minimal columns (system_name, version_tag, is_active, system_path)...');
      useFallback = true;
    } else if (testResult.error.message.includes('duplicate') || testResult.error.code === '23505') {
      console.log(`⚠️ system_versions [${systemsFull[0].system_name}]: already exists, skipping`);
    } else {
      console.error(`❌ system_versions [${systemsFull[0].system_name}]:`, testResult.error.message);
    }
  } else {
    console.log(`✅ system_versions: ${systemsFull[0].system_name}`);
  }

  const startIndex = useFallback ? 0 : 1;

  for (let i = startIndex; i < systemsFull.length; i++) {
    const sys = systemsFull[i];
    const data = useFallback
      ? { system_name: sys.system_name, version_tag: sys.version_tag, is_active: sys.is_active, system_path: sys.system_path }
      : sys;
    const { error } = await supabase.from('system_versions').insert(data);
    if (error) {
      if (error.message.includes('duplicate') || error.code === '23505') {
        console.log(`⚠️ system_versions [${sys.system_name}]: already exists, skipping`);
      } else {
        console.error(`❌ system_versions [${sys.system_name}]:`, error.message);
      }
    } else {
      console.log(`✅ system_versions: ${sys.system_name}`);
    }
  }

  // 2. INSERT error_rules (50 regras)
  const rules = [
    { rule_type: 'forbidden_term', doc_type: null, rule_description: 'Nunca usar "I believe" — parece opinião, não fato', rule_pattern: 'I believe', rule_action: 'block', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'forbidden_term', doc_type: null, rule_description: 'Nunca usar "we think" — petição deve ser assertiva', rule_pattern: 'we think', rule_action: 'block', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'forbidden_term', doc_type: null, rule_description: 'Nunca usar "hopefully" — demonstra incerteza', rule_pattern: 'hopefully', rule_action: 'block', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'forbidden_term', doc_type: null, rule_description: 'Nunca usar "might" quando afirmando qualificação', rule_pattern: 'might\\s+(qualify|meet|satisfy)', rule_action: 'warn', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'forbidden_term', doc_type: null, rule_description: 'Nunca usar "try to" — beneficiário ESTÁ fazendo, não tentando', rule_pattern: 'try to|tries to|trying to', rule_action: 'block', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'forbidden_term', doc_type: null, rule_description: 'Nunca usar "alien" para se referir ao beneficiário em contexto positivo', rule_pattern: 'the alien\\s+(has|is|will)', rule_action: 'warn', severity: 'medium', source: 'paulo_experience', active: true },
    { rule_type: 'forbidden_term', doc_type: null, rule_description: 'Evitar "very unique" — unique já é superlativo', rule_pattern: 'very unique', rule_action: 'warn', severity: 'low', source: 'paulo_experience', active: true },
    { rule_type: 'forbidden_term', doc_type: null, rule_description: 'Nunca usar "undocumented" — usar "without status" se necessário', rule_pattern: 'undocumented', rule_action: 'warn', severity: 'medium', source: 'paulo_experience', active: true },
    { rule_type: 'forbidden_term', doc_type: null, rule_description: 'Não usar "illegal immigrant" em nenhum contexto', rule_pattern: 'illegal immigrant', rule_action: 'block', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'forbidden_term', doc_type: null, rule_description: 'Evitar "foreign national" — preferir "beneficiary" ou "petitioner"', rule_pattern: 'foreign national', rule_action: 'warn', severity: 'low', source: 'paulo_experience', active: true },
    { rule_type: 'terminology', doc_type: null, rule_description: 'Usar "beneficiary" não "applicant" em petições de emprego', rule_pattern: 'the applicant(?!\\s+(agency|organization))', rule_action: 'warn', severity: 'medium', source: 'paulo_experience', active: true },
    { rule_type: 'terminology', doc_type: null, rule_description: 'Usar "petition" não "application" para EB-1/EB-2', rule_pattern: 'this application', rule_action: 'warn', severity: 'medium', source: 'paulo_experience', active: true },
    { rule_type: 'terminology', doc_type: 'cover_letter_eb1a', rule_description: 'Referenciar "extraordinary ability" não "exceptional"', rule_pattern: 'exceptional ability', rule_action: 'warn', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'terminology', doc_type: 'cover_letter_eb2_niw', rule_description: 'Sempre mencionar "national interest waiver" por extenso na primeira referência', rule_pattern: null, rule_action: 'warn', severity: 'medium', source: 'paulo_experience', active: true },
    { rule_type: 'terminology', doc_type: null, rule_description: 'Citar "8 CFR" não "8 C.F.R." — sem pontos entre letras', rule_pattern: '8\\s+C\\.F\\.R\\.', rule_action: 'auto_fix', severity: 'low', source: 'paulo_experience', active: true },
    { rule_type: 'legal', doc_type: 'cover_letter_eb1a', rule_description: 'EB-1A requer 3 de 10 critérios — nunca dizer "2 critérios"', rule_pattern: '(two|2)\\s+(criteria|critérios)', rule_action: 'block', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'legal', doc_type: 'cover_letter_eb2_niw', rule_description: 'NIW usa teste Dhanasar de 3 prongs — nunca referenciar teste antigo NYSDOT', rule_pattern: 'NYSDOT', rule_action: 'block', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'legal', doc_type: 'cover_letter_eb2_niw', rule_description: 'Dhanasar é de 2016, não 2017 — data correta: December 27, 2016', rule_pattern: 'Dhanasar.{0,30}2017', rule_action: 'block', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'legal', doc_type: null, rule_description: 'Matter of Kazarian é de 2010, não 2009 ou 2011', rule_pattern: 'Kazarian.{0,30}(2009|2011)', rule_action: 'block', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'legal', doc_type: null, rule_description: 'USCIS Policy Manual é o M-602 — não referenciar AFM (Adjudicator Field Manual) obsoleto', rule_pattern: 'Adjudicator.{0,20}Field.{0,20}Manual|AFM', rule_action: 'block', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: null, rule_description: 'Nome do beneficiário deve aparecer pelo menos 5 vezes no documento', rule_pattern: null, rule_action: 'warn', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: null, rule_description: 'Não inventar publicações ou prêmios — usar apenas dados do perfil extraído', rule_pattern: null, rule_action: 'warn', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: null, rule_description: 'Datas de emprego devem ser consistentes com o résumé', rule_pattern: null, rule_action: 'warn', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: null, rule_description: 'Número de citações deve vir do Google Scholar ou perfil, nunca inventado', rule_pattern: null, rule_action: 'warn', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: 'business_plan', rule_description: 'Business plan deve ter projeções financeiras de 5 anos, não 3', rule_pattern: '(three|3).{0,20}year.{0,20}(projection|forecast)', rule_action: 'warn', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: 'business_plan', rule_description: 'Revenue projections devem ter base factual — não números aleatórios', rule_pattern: null, rule_action: 'warn', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'formatting', doc_type: null, rule_description: 'Cada exhibit/evidence deve ter número sequencial (Exhibit 1, Exhibit 2...)', rule_pattern: null, rule_action: 'warn', severity: 'medium', source: 'paulo_experience', active: true },
    { rule_type: 'formatting', doc_type: null, rule_description: 'Headers de seção devem estar em negrito e com tamanho maior', rule_pattern: null, rule_action: 'warn', severity: 'low', source: 'paulo_experience', active: true },
    { rule_type: 'formatting', doc_type: null, rule_description: 'Tabelas devem ter header row com fundo cinza', rule_pattern: null, rule_action: 'warn', severity: 'low', source: 'paulo_experience', active: true },
    { rule_type: 'formatting', doc_type: null, rule_description: 'Não usar mais de 3 níveis de bullets/indentação', rule_pattern: null, rule_action: 'warn', severity: 'low', source: 'paulo_experience', active: true },
    { rule_type: 'formatting', doc_type: 'cover_letter_eb1a', rule_description: 'Cada critério EB-1A deve ter header separado (Criterion 1:, Criterion 2:, etc.)', rule_pattern: null, rule_action: 'warn', severity: 'medium', source: 'paulo_experience', active: true },
    { rule_type: 'logic', doc_type: 'cover_letter_eb1a', rule_description: 'Não citar critérios EB-2 NIW (Dhanasar/prongs) em petition EB-1A', rule_pattern: 'Dhanasar|prong\\s+[123]|national interest', rule_action: 'block', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'logic', doc_type: 'cover_letter_eb2_niw', rule_description: 'Não citar critérios EB-1A (10 criteria/Kazarian) em petition EB-2 NIW', rule_pattern: 'extraordinary ability|10 criteria|Kazarian', rule_action: 'warn', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'logic', doc_type: null, rule_description: 'Se empresa é nova (<2 anos), não afirmar "established track record"', rule_pattern: 'established track record', rule_action: 'warn', severity: 'medium', source: 'paulo_experience', active: true },
    { rule_type: 'logic', doc_type: null, rule_description: 'Valor de investimento deve ser coerente com porte da empresa', rule_pattern: null, rule_action: 'warn', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'logic', doc_type: null, rule_description: 'Não usar evidências de um critério para provar outro critério diferente', rule_pattern: null, rule_action: 'warn', severity: 'medium', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: 'satellite_letter', rule_description: 'Carta satélite nunca deve repetir frases de outra carta do mesmo caso', rule_pattern: null, rule_action: 'block', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: 'satellite_letter', rule_description: 'Cada carta deve ter voz única — variar estrutura, tom, vocabulário (anti-ATLAS)', rule_pattern: null, rule_action: 'block', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'formatting', doc_type: 'satellite_letter', rule_description: 'Carta deve ter entre 2-4 páginas — nem muito curta nem muito longa', rule_pattern: null, rule_action: 'warn', severity: 'medium', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: 'satellite_letter', rule_description: 'Signatory deve ter credenciais verificáveis — não inventar títulos', rule_pattern: null, rule_action: 'block', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: 'rfe_response', rule_description: 'Resposta a RFE deve citar textualmente o que a USCIS pediu', rule_pattern: null, rule_action: 'warn', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: 'rfe_response', rule_description: 'Cada ponto do RFE deve ter resposta individual e específica', rule_pattern: null, rule_action: 'warn', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'logic', doc_type: 'rfe_response', rule_description: 'Não contradizer informações da petition original', rule_pattern: null, rule_action: 'block', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: null, rule_description: 'Documento não deve ter placeholder text ([INSERT], [TODO], [PREENCHER])', rule_pattern: '\\[(INSERT|TODO|PREENCHER|TBD|NOME|DATA)\\]', rule_action: 'block', severity: 'critical', source: 'paulo_experience', active: true },
    { rule_type: 'formatting', doc_type: null, rule_description: 'Documento não deve ter texto em português quando deveria ser em inglês', rule_pattern: null, rule_action: 'warn', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: null, rule_description: 'Não repetir o mesmo parágrafo/sentença em seções diferentes', rule_pattern: null, rule_action: 'warn', severity: 'high', source: 'paulo_experience', active: true },
    { rule_type: 'content', doc_type: null, rule_description: 'Cada afirmação factual deve ter evidência referenciada (Exhibit X)', rule_pattern: null, rule_action: 'warn', severity: 'medium', source: 'paulo_experience', active: true },
    { rule_type: 'formatting', doc_type: null, rule_description: 'Máximo 500 palavras por parágrafo — quebrar parágrafos longos', rule_pattern: null, rule_action: 'warn', severity: 'low', source: 'paulo_experience', active: true },
  ];

  // Insert em batches de 10
  for (let i = 0; i < rules.length; i += 10) {
    const batch = rules.slice(i, i + 10);
    const { error } = await supabase.from('error_rules').insert(batch);
    if (error) {
      if (error.message.includes('duplicate') || error.code === '23505') {
        console.log(`⚠️ error_rules batch ${i/10 + 1}: algumas regras já existem, pulando`);
      } else {
        console.error(`❌ error_rules batch ${i/10 + 1}:`, error.message);
      }
    } else {
      console.log(`✅ error_rules: batch ${i/10 + 1} (${batch.length} regras)`);
    }
  }

  // 3. Função auxiliar — precisa de SQL raw
  // O Supabase JS client não executa DDL diretamente.
  // Mas podemos usar a REST API /sql endpoint
  console.log('\n⚠️ NOTA: A function increment_rule_trigger precisa ser criada via SQL Editor.');
  console.log('Execute este SQL no dashboard Supabase:');
  console.log(`
CREATE OR REPLACE FUNCTION increment_rule_trigger(rule_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE error_rules SET times_triggered = times_triggered + 1 WHERE id = rule_id;
END;
$$ LANGUAGE plpgsql;
  `);

  console.log('\n🎉 Seed completo!');
}

runSeed().catch(console.error);
