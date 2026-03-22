# BUILD FASE 3 — PETITION ENGINE: SEED + DESIGN PREMIUM + REFINAMENTOS FINAIS

Leia este arquivo INTEIRO antes de começar. Depois execute tudo sem perguntar nada.

## REGRAS ABSOLUTAS
- NÃO importar @anthropic-ai/sdk nem @google/generative-ai
- Todos os agentes RETORNAM prompts como strings — Paulo copia pro Claude Code
- NÃO perguntar nada. Executar bloco por bloco.
- Sobrescrever arquivos existentes quando indicado.

---

# ═══════════════════════════════════════
# BLOCO 1: EXECUTAR SEED SQL NO SUPABASE
# ═══════════════════════════════════════

O Supabase já tem as tabelas criadas. Faltam os dados (system_versions + error_rules) e a function auxiliar.

## OPÇÃO A — Via Supabase CLI (preferida):

Leia o .env.local para pegar a SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY. Depois:

```bash
# Extrair a connection string do .env.local
# A URL do Supabase é: https://dmqruovtiivgaqoronvh.supabase.co
# Connection string para SQL direto:
# postgresql://postgres.[ref]:[password]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres

# Se tiver psql instalado:
psql "postgresql://postgres.dmqruovtiivgaqoronvh:[SENHA_DO_ENV]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres" -f scripts/seed.sql
```

## OPÇÃO B — Se não tiver psql, usar o Supabase JS client:

Criar e executar este script temporário:

### Arquivo: scripts/run-seed.ts

```typescript
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
  const systems = [
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

  for (const sys of systems) {
    const { error } = await supabase.from('system_versions').upsert(sys, { onConflict: 'system_name' });
    if (error) console.error(`❌ system_versions [${sys.system_name}]:`, error.message);
    else console.log(`✅ system_versions: ${sys.system_name}`);
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
```

Para executar:
```bash
npx tsx scripts/run-seed.ts
```

Se não tiver tsx instalado:
```bash
npm install -D tsx dotenv && npx tsx scripts/run-seed.ts
```

---

# ═══════════════════════════════════════
# BLOCO 2: LAYOUT PREMIUM COM SIDEBAR (DESIGN PROFISSIONAL)
# ═══════════════════════════════════════

O design atual usa inline styles e parece amador. Vamos criar um layout component
com sidebar fixa e design de SaaS premium.

## Arquivo: src/app/globals.css (SOBRESCREVER)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-tertiary: #161616;
  --bg-hover: #1a1a1a;
  --bg-elevated: #1e1e1e;
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.1);
  --border-strong: rgba(255, 255, 255, 0.15);
  --text-primary: #f5f5f5;
  --text-secondary: #a0a0a0;
  --text-tertiary: #666666;
  --text-muted: #444444;
  --accent: #2dd4bf;
  --accent-hover: #14b8a6;
  --accent-subtle: rgba(45, 212, 191, 0.1);
  --accent-border: rgba(45, 212, 191, 0.2);
  --danger: #ef4444;
  --warning: #eab308;
  --success: #22c55e;
  --info: #3b82f6;
  --sidebar-width: 240px;
  --header-height: 0px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  height: 100vh;
}

/* Scrollbar personalizada */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

/* Animações */
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
.animate-slideIn { animation: slideIn 0.2s ease-out; }

/* Focus ring */
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Inputs e selects globais */
input, select, textarea {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Transitions */
.transition-all { transition: all 0.2s ease; }
.transition-colors { transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease; }
```

## Arquivo: src/components/Sidebar.tsx (CRIAR)

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: 'grid' },
  { href: '/clientes', label: 'Clientes', icon: 'users' },
  { href: '/gerador', label: 'Gerador', icon: 'zap' },
  { href: '/sistemas', label: 'Sistemas', icon: 'layers' },
  { href: '/erros', label: 'Regras de Erro', icon: 'shield' },
  { href: '/qualidade', label: 'Qualidade', icon: 'check-circle' },
];

const ICONS: Record<string, (active: boolean) => JSX.Element> = {
  grid: (a) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={a ? '#2dd4bf' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  users: (a) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={a ? '#2dd4bf' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  zap: (a) => <svg width="18" height="18" viewBox="0 0 24 24" fill={a ? '#2dd4bf' : 'none'} stroke={a ? '#2dd4bf' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  layers: (a) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={a ? '#2dd4bf' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  shield: (a) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={a ? '#2dd4bf' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  'check-circle': (a) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={a ? '#2dd4bf' : '#666'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      width: collapsed ? '64px' : '240px',
      height: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 12px' : '20px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minHeight: '64px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Petition</div>
            <div style={{ fontSize: '10px', fontWeight: 500, color: 'var(--accent)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>ENGINE</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: collapsed ? '10px 14px' : '10px 14px',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-subtle)' : 'transparent',
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '20px',
                  borderRadius: '0 3px 3px 0',
                  background: 'var(--accent)',
                }} />
              )}
              {ICONS[item.icon]?.(isActive)}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
          </svg>
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </aside>
  );
}
```

## Arquivo: src/app/layout.tsx (SOBRESCREVER)

```tsx
import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Petition Engine',
  description: 'Plataforma de automação de petições imigratórias',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{
            flex: 1,
            marginLeft: '240px',
            height: '100vh',
            overflow: 'auto',
            background: 'var(--bg-primary)',
          }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```

---

# ═══════════════════════════════════════
# BLOCO 3: DASHBOARD PREMIUM (SOBRESCREVER page.tsx)
# ═══════════════════════════════════════

## Arquivo: src/app/page.tsx (SOBRESCREVER)

```tsx
'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  clients: { total: number; active: number; by_visa: Record<string, number> };
  documents: { total: number; generated_today: number; quality_pass_rate: number };
  systems: { total: number; active: number };
  errors: { total_rules: number; triggered_today: number };
}

const STAT_CONFIGS = [
  { key: 'clients_active', label: 'Clientes Ativos', color: '#2dd4bf', icon: 'users' },
  { key: 'docs_total', label: 'Documentos Gerados', color: '#8b5cf6', icon: 'file' },
  { key: 'systems_active', label: 'Sistemas Ativos', color: '#06b6d4', icon: 'layers' },
  { key: 'quality_rate', label: 'Taxa de Qualidade', color: '#22c55e', icon: 'check' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(json => setStats(json.data || json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const s = stats || {
    clients: { total: 0, active: 0, by_visa: {} },
    documents: { total: 0, generated_today: 0, quality_pass_rate: 0 },
    systems: { total: 0, active: 0 },
    errors: { total_rules: 0, triggered_today: 0 },
  };

  const statValues = [
    { value: s.clients.active, suffix: '' },
    { value: s.documents.total, suffix: '' },
    { value: s.systems.active, suffix: '' },
    { value: s.documents.quality_pass_rate ?? 0, suffix: '%' },
  ];

  const visaTypes = Object.entries(s.clients.by_visa || {});

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginTop: '4px' }}>
          Visão geral do Petition Engine
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {STAT_CONFIGS.map((config, i) => (
          <div
            key={config.key}
            className="animate-fadeIn"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              animationDelay: `${i * 0.05}s`,
              animationFillMode: 'both',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-tertiary)', fontSize: '13px', fontWeight: 500 }}>
                {config.label}
              </span>
              <div style={{
                width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
                background: `${config.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: config.color }} />
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
              {loading ? '—' : `${statValues[i].value}${statValues[i].suffix}`}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Clientes por Visto */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
            Clientes por Tipo de Visto
          </h3>
          {visaTypes.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Nenhum cliente cadastrado ainda</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {visaTypes.map(([visa, count]) => {
                const colors: Record<string, string> = {
                  'EB-1A': '#f59e0b', 'EB-2-NIW': '#8b5cf6', 'O-1': '#06b6d4',
                  'L-1': '#ec4899', 'EB-1C': '#10b981',
                };
                const pct = s.clients.total > 0 ? ((count as number) / s.clients.total * 100) : 0;
                return (
                  <div key={visa}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: colors[visa] || '#666' }}>{visa}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>{count as number}</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg-hover)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: colors[visa] || '#666',
                        borderRadius: '2px',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status do Sistema */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
            Status do Motor
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Regras de Erro Ativas', value: s.errors.total_rules, color: 'var(--accent)' },
              { label: 'Erros Capturados Hoje', value: s.errors.triggered_today, color: s.errors.triggered_today > 0 ? 'var(--warning)' : 'var(--success)' },
              { label: 'Documentos Hoje', value: s.documents.generated_today, color: 'var(--info)' },
              { label: 'Total de Clientes', value: s.clients.total, color: 'var(--text-secondary)' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontSize: '18px', fontWeight: 600, color: item.color }}>{loading ? '—' : item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

# ═══════════════════════════════════════
# BLOCO 4: GERADOR PREMIUM (SOBRESCREVER)
# ═══════════════════════════════════════

O gerador da FASE 2 (com Lucide icons) é bom mas está com o import do lucide-react que pode não estar instalado. Vamos usar SVG inline para zero dependência externa.

Manter o gerador que já foi criado na FASE 2 — ele já funciona corretamente. Apenas garantir que o `lucide-react` está instalado:

```bash
npm install lucide-react
```

Se a instalação falhar, trocar os imports por SVGs como feito no Sidebar.

---

# ═══════════════════════════════════════
# BLOCO 5: PÁGINA CLIENTES PREMIUM (SOBRESCREVER)
# ═══════════════════════════════════════

## Arquivo: src/app/clientes/page.tsx (SOBRESCREVER)

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  email: string;
  visa_type: string;
  status: string;
  company_name: string;
  created_at: string;
  client_profiles?: any;
}

const VISA_COLORS: Record<string, string> = {
  'EB-1A': '#f59e0b',
  'EB-2-NIW': '#8b5cf6',
  'O-1': '#06b6d4',
  'L-1': '#ec4899',
  'EB-1C': '#10b981',
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  active: { label: 'Ativo', color: '#22c55e' },
  completed: { label: 'Concluído', color: '#3b82f6' },
  on_hold: { label: 'Em espera', color: '#eab308' },
  cancelled: { label: 'Cancelado', color: '#ef4444' },
};

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterVisa, setFilterVisa] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '', email: '', visa_type: 'EB-2-NIW', company_name: '',
    proposed_endeavor: '', location_city: '', location_state: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchClients(); }, [filterVisa, search]);

  async function fetchClients() {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterVisa) params.set('visa_type', filterVisa);
      const res = await fetch(`/api/clients?${params.toString()}`);
      const json = await res.json();
      const data = json.data;
      setClients(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setSaving(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      if (res.ok) {
        setShowNewModal(false);
        setNewClient({ name: '', email: '', visa_type: 'EB-2-NIW', company_name: '', proposed_endeavor: '', location_city: '', location_state: '' });
        fetchClients();
      }
    } catch (err) {
      console.error('Erro ao criar cliente:', err);
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)', padding: '10px 14px', color: 'var(--text-primary)',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Clientes</h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginTop: '4px' }}>Gerenciar clientes e perfis de imigração</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          style={{
            background: 'linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%)',
            color: '#0a0a0a', border: 'none', padding: '10px 20px',
            borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer',
            fontSize: '13px', letterSpacing: '-0.2px',
          }}
        >
          + Novo Cliente
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text" placeholder="Buscar cliente..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
        />
        <select value={filterVisa} onChange={(e) => setFilterVisa(e.target.value)}
          style={{ ...inputStyle, width: 'auto', minWidth: '160px' }}
        >
          <option value="">Todos os vistos</option>
          <option value="EB-1A">EB-1A</option>
          <option value="EB-2-NIW">EB-2 NIW</option>
          <option value="O-1">O-1</option>
          <option value="L-1">L-1</option>
          <option value="EB-1C">EB-1C</option>
        </select>
      </div>

      {/* Client List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
          Carregando clientes...
        </div>
      ) : clients.length === 0 ? (
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)', padding: '60px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.5 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 8px', fontWeight: 600 }}>Nenhum cliente cadastrado</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 20px', fontSize: '13px' }}>Clique em "+ Novo Cliente" para começar</p>
          <button
            onClick={() => setShowNewModal(true)}
            style={{
              background: 'linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%)',
              color: '#0a0a0a', border: 'none', padding: '10px 20px',
              borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', fontSize: '13px',
            }}
          >
            + Novo Cliente
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {clients.map((client, i) => (
            <Link
              key={client.id}
              href={`/clientes/${client.id}`}
              className="animate-fadeIn"
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)', padding: '14px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', transition: 'all 0.15s ease', textDecoration: 'none',
                animationDelay: `${i * 0.03}s`, animationFillMode: 'both',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--bg-hover)';
                e.currentTarget.style.borderColor = 'var(--border-default)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--bg-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--accent-subtle)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', color: 'var(--accent)', fontWeight: 700,
                }}>
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px' }}>{client.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                    {client.company_name || client.email || 'Sem detalhes'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  background: `${VISA_COLORS[client.visa_type] || '#666'}18`,
                  color: VISA_COLORS[client.visa_type] || '#666',
                  padding: '3px 10px', borderRadius: 'var(--radius-sm)',
                  fontSize: '12px', fontWeight: 600,
                }}>{client.visa_type}</span>
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: STATUS_MAP[client.status]?.color || '#666',
                }} />
                <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', minWidth: '60px' }}>
                  {STATUS_MAP[client.status]?.label || client.status}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* New Client Modal */}
      {showNewModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowNewModal(false); }}>
          <div className="animate-fadeIn" style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)', padding: '32px', width: '500px',
            maxHeight: '85vh', overflow: 'auto',
          }}>
            <h2 style={{ color: 'var(--text-primary)', margin: '0 0 24px', fontSize: '20px', fontWeight: 600 }}>Novo Cliente</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nome completo *</label>
                <input type="text" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
                <input type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tipo de visto *</label>
                <select value={newClient.visa_type} onChange={(e) => setNewClient({ ...newClient, visa_type: e.target.value })} style={inputStyle}>
                  <option value="EB-1A">EB-1A (Extraordinary Ability)</option>
                  <option value="EB-2-NIW">EB-2 NIW (National Interest Waiver)</option>
                  <option value="O-1">O-1 (Extraordinary Ability)</option>
                  <option value="L-1">L-1 (Intracompany Transfer)</option>
                  <option value="EB-1C">EB-1C (Multinational Manager)</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Empresa</label>
                <input type="text" value={newClient.company_name} onChange={(e) => setNewClient({ ...newClient, company_name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Proposed Endeavor</label>
                <textarea value={newClient.proposed_endeavor} onChange={(e) => setNewClient({ ...newClient, proposed_endeavor: e.target.value })} rows={3}
                  style={{ ...inputStyle, resize: 'vertical' as const }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cidade</label>
                  <input type="text" value={newClient.location_city} onChange={(e) => setNewClient({ ...newClient, location_city: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estado (US)</label>
                  <input type="text" value={newClient.location_state} onChange={(e) => setNewClient({ ...newClient, location_state: e.target.value })} style={inputStyle} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowNewModal(false)}
                style={{ background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', padding: '10px 20px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '13px' }}>
                Cancelar
              </button>
              <button onClick={handleCreate} disabled={!newClient.name || saving}
                style={{
                  background: newClient.name ? 'linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%)' : '#222',
                  color: newClient.name ? '#0a0a0a' : '#666', border: 'none', padding: '10px 24px',
                  borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: newClient.name ? 'pointer' : 'not-allowed', fontSize: '13px',
                }}>
                {saving ? 'Salvando...' : 'Criar Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

# ═══════════════════════════════════════
# BLOCO 6: TSCONFIG PATH ALIAS
# ═══════════════════════════════════════

Verificar que o `tsconfig.json` tem o path alias `@/`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Se não tiver, adicionar.

---

# ═══════════════════════════════════════
# BLOCO 7: VERIFICAÇÃO FINAL + FIX ALL
# ═══════════════════════════════════════

Execute estes comandos em sequência:

```bash
# 1. Instalar dependências que possam faltar
npm install lucide-react

# 2. Verificar compilação
npx next build 2>&1 | head -50

# 3. Se houver erros de TypeScript, corrigir automaticamente
# Erros comuns: path alias @/, tipos faltando, imports incorretos

# 4. Rodar em dev para testar
npm run dev
```

Abrir http://localhost:3000 e verificar:
- [ ] Dashboard carrega com 4 cards de stats
- [ ] Sidebar aparece com 6 links de navegação
- [ ] Clientes carrega lista (pode estar vazia)
- [ ] Gerador carrega grid de sistemas (precisa do seed SQL)
- [ ] Sistemas mostra lista de systems
- [ ] Regras de Erro mostra as 50 regras (precisa do seed SQL)
- [ ] Criar novo cliente funciona
- [ ] Clicar em cliente abre página de detalhe

---

# ═══════════════════════════════════════
# BLOCO 8: SETUP SYMLINKS + PYTHON
# ═══════════════════════════════════════

```bash
# Setup symlinks (se ainda não feito)
bash scripts/setup-symlinks.sh 2>/dev/null || echo "Symlinks script não encontrado — ok"

# Python deps
pip3 install python-docx PyPDF2 Pillow 2>/dev/null || echo "pip3 não disponível — ok"
```

---

# ═══════════════════════════════════════
# BLOCO 9: COMMIT NO GITHUB
# ═══════════════════════════════════════

```bash
git add -A
git commit -m "FASE 3: Seed SQL + design premium com sidebar + layout profissional

- Adicionado script run-seed.ts para popular Supabase (10 sistemas + 50 error rules)
- Novo layout com sidebar fixa e navegação profissional
- Dashboard redesenhado com cards e métricas
- Página de clientes com links para detalhe
- CSS design system com variáveis (dark premium)
- Tipografia Inter, animações, scrollbar customizada"

git push origin main
```

---

# FIM DA FASE 3
#
# Resultado esperado: aplicação funcionando com design premium,
# dados seed no Supabase, sidebar profissional, todas as páginas
# navegáveis. Paulo pode começar a usar o Gerador imediatamente
# após o seed SQL ser executado.
