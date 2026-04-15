/**
 * Transversal Rules — Shared rules injected into ALL generation prompts.
 *
 * Consolidates ~70% overlap between EB-1A and EB-2 NIW transversal rules.
 * Instead of duplicating, compose: SHARED + framework-specific.
 *
 * Applies Sandeco Ch. 4: DRY principle in maintenance.
 */

/**
 * Rules shared between ALL frameworks (EB-1A, EB-2 NIW, etc.)
 */
export const SHARED_RULES = `
### FORBIDDEN CONTENT (SHARED — ALL FRAMEWORKS):
- NUNCA nomes proibidos (PROEX, Carlos Avelino, Bruno Cipriano, Renato Silveira, "Loper Light")
- NUNCA Currículo Lattes, dados inventados, holdings inexistentes
- NUNCA afirmar Mukherji v. Miller como vinculante (é persuasivo, distrito de Nebraska)
- ZERO artefatos de produção (EXPANSÃO:, TODO:, ████, contagem de palavras, meta-instruções)
- ZERO URLs inventadas/truncadas
- Substituição NUNCA é cega — verificar contexto antes de substituir

### FORMATAÇÃO (SHARED):
- Garamond 100% (NUNCA Arial, Calibri, Times)
- Evidence blocks: fundo #FFF8EE (creme), Evidence XX em bold #2E7D32 (verde)
- Tabelas: bordas APENAS horizontais (ZERO bordas verticais)
- Imagens: wp:anchor + wrapSquare (NUNCA wp:inline — quebra tabelas)
- cantSplit=true em rows de tabelas

### PROTOCOLO DE INTERAÇÃO (SHARED):
R1: NUNCA avançar sem ter lido TODOS os arquivos necessários
R3: Listar o que leu ANTES de escrever (confirmação de leitura)
R7: Validação mecânica antes de entregar (forbidden content, evidence bold, cores, borders)
R8: Buscar nas evidências do cliente — NUNCA inventar dados
`;

/**
 * EB-1A specific rules (appended to shared)
 */
export const EB1A_SPECIFIC_RULES = `
### EB-1A ESPECÍFICO:
- NUNCA 3ª pessoa no corpo argumentativo ("o beneficiário") — SEMPRE 1ª pessoa ("apresento", "meu")
- NUNCA seção explícita "Objeções Antecipadas" — costurar no texto argumentativo
- NUNCA "jurídico"/"adjudicativo"/"independentes"/"Ev." — usar "regulatório"/"probatório"/"Evidence"
- NUNCA linguagem de existência para empresas planejadas (NOT YET established)
- NUNCA azul (#0000FF proibido), evidence block SEMPRE antes do texto argumentativo
- TUDO em português brasileiro (exceto: INA §, C.F.R. §, Kazarian, Mukherji, USCIS, O*NET, EB-1A, I-140, Step 1/2)
- Proporções: Intro 8-18%, Step 1 35-55%, Step 2 ≥25% (mín 30% ideal)
- Headers de seção: shading #D6E1DB (verde PROEX)
- Footnotes: nativos do Word (<w:footnoteReference> + footnotes.xml), em português
- Footer: "EB-1A | I-140 Petition — Cover Letter [CLIENT NAME] | Page X of Y"
- R4: NUNCA gerar critério inteiro com 9+ evidências de uma vez — dividir em partes
- R5: Auto-check de densidade contra benchmarks (Carlos Avelino ~72pg, Bruno Cipriano ~27pg)
- R6: Inventário exaustivo com contagem de evidências, tabelas, subseções
- Margens: L=2.0cm, R=1.5cm, T=1.5cm, B=1.5cm
`;

/**
 * EB-2 NIW specific rules (appended to shared)
 */
export const EB2_NIW_SPECIFIC_RULES = `
### EB-2 NIW ESPECÍFICO:
- Idioma: 100% INGLÊS (en-US) para documentos USCIS. Termos em português apenas entre parênteses quando necessário.
- Margens: L=2.0cm, R=1.5cm, T=1.5cm, B=1.5cm
- Headers de seção: shading #D6E1DB (verde PROEX)
- Footnotes: nativos do Word, em inglês
- Footer: "EB-2 NIW | I-140 Petition — Cover Letter [CLIENT NAME] | Page X of Y"
- Dhanasar three-prong test DEVE ser mencionado e articulado
- NUNCA usar termos anti-Cristine (self-sustaining, operates autonomously, plug-and-play, scalable without founder)
`;

/**
 * Build the complete transversal rules string for a given framework.
 */
export function buildTransversalRules(framework: 'eb1a' | 'eb2_niw'): string {
  const header = '## REGRAS INVIOLÁVEIS (INCLUIR EM TODO PROMPT)\n';
  const specific = framework === 'eb1a' ? EB1A_SPECIFIC_RULES : EB2_NIW_SPECIFIC_RULES;
  return header + SHARED_RULES + specific;
}
