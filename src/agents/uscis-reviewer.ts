interface USCISInput {
  documentText: string;
  docType: string;
  visaType: string;
  clientName: string;
}

export function buildUSCISReviewPrompt(input: USCISInput): string {
  let criteria = '';

  if (input.visaType.includes('EB-1') || input.visaType === 'EB-1A') {
    criteria = `CRITÉRIOS EB-1A (Kazarian 2-step):
C1: Awards/Prizes of national or international recognition
C2: Membership in associations requiring outstanding achievement
C3: Published material about the beneficiary
C4: Judging the work of others
C5: Original contributions of major significance
C6: Scholarly articles
C7: Exhibition of work
C8: Leading or critical role in distinguished organizations
C9: High salary or remuneration
C10: Commercial success`;
  } else if (input.visaType.includes('EB-2') || input.visaType.includes('NIW')) {
    criteria = `PILARES DHANASAR (EB-2 NIW):
Prong 1: O proposed endeavor tem mérito substancial e importância nacional?
Prong 2: O peticionário está bem posicionado para avançar o endeavor?
Prong 3: No balanço, seria benéfico dispensar o requisito de labor certification?`;
  } else if (input.visaType.includes('O-1')) {
    criteria = `CRITÉRIOS O-1:
1. Awards/prizes of national or international significance
2. Membership in associations requiring outstanding achievement
3. Published material about the beneficiary
4. Judging the work of others
5. Original contributions of major significance
6. Scholarly articles
7. Employment in critical or essential capacity
8. High salary or remuneration`;
  }

  return `# REVISÃO USCIS — Simulação de Adjudicação
## Cliente: ${input.clientName} | Visto: ${input.visaType} | Doc: ${input.docType}

Você é um oficial adjudicador SENIOR da USCIS. Revise esta petição com olhar CÉTICO mas justo.

${criteria}

Para CADA critério/pilar:
- 🟢 VERDE: Evidência forte e convincente
- 🟡 AMARELO: Adequado mas com risco de RFE
- 🔴 VERMELHO: Fraco, alta chance de RFE

Identifique:
- Argumentos que um oficial cético questionaria
- Evidências faltantes
- Inconsistências lógicas
- Claims sem suporte factual

DOCUMENTO:
${input.documentText}

---
Retorne análise detalhada com classificação por critério.`;
}
