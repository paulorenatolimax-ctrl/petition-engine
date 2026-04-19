/**
 * Copy Prompts — 3 Ângulos com Estrutura Peirceana
 *
 * Gera prompts para a Claude API produzir copy completa
 * para cada ângulo e formato de canal.
 */

import peirce from './peirce-framework.js';

const { NICHO, SIGNOS_PEIRCANOS } = peirce;

// ============================================================
// ÂNGULO 1 — URGÊNCIA / RISCO LEGAL (Disrupção Cognitiva)
// ============================================================

function promptAnguloRisco(mapaSemiotico) {
  return `Você é um copywriter especialista em marketing direto para o nicho educacional.
Use o Framework Peirceano para gerar copy de URGÊNCIA/RISCO LEGAL.

## MAPA SEMIÓTICO DO CICLO
${JSON.stringify(mapaSemiotico, null, 2)}

## ESTRUTURA DO ÂNGULO 1 — URGÊNCIA/RISCO LEGAL

**Técnica:** Disrupção Cognitiva — declaração paradoxal ou pergunta que quebra o padrão mental do gestor.

**Hook:** ${mapaSemiotico.hooks?.risco || 'Declaração paradoxal que quebra o padrão mental do diretor'}
Referência: "A maioria das escolas particulares está a um decreto de distância de perder o credenciamento — e nem sabe."

**Bridge:** Dado estatístico ou narrativa que conecta com a realidade diária do diretor.
Use: ${mapaSemiotico.gatilhoTemporal?.intensificador || SIGNOS_PEIRCANOS.legissignoIndicialRematico.getGatilhoAtual().gatilho}

**Problem:** Nomeie o mecanismo proprietário "Síndrome da Escola Invisível" — escola que funciona operacionalmente mas não tem sistema de inteligência pedagógica, está invisível para si mesma.

**Solution:** "Sistema NEX de Inteligência Pedagógica" — diagnóstico baseado em 47 indicadores.

**Offer:** Diagnóstico gratuito em 6 minutos + Relatório personalizado com os 3 maiores riscos.

## EMOÇÕES PEIRCEANAS A ACIONAR
- Primária: Medo de fiscalização
- Secundária: Vergonha de imprevidência
- Escala: risco legal > vergonha profissional > perda financeira

## METÁFORAS DISPONÍVEIS
${SIGNOS_PEIRCANOS.simboloRematico.metaforas.map(m => `- "${m.metafora}"`).join('\n')}

## GERE AS SEGUINTES COPIES (em JSON):

{
  "angulo": "risco",
  "feed": {
    "headline": "(máx 40 caracteres — impactante)",
    "texto": "(máx 125 caracteres — com gatilho Peirceano)",
    "cta": "(chamada para ação direta)"
  },
  "stories": {
    "roteiro15s": {
      "gancho3s": "(frase que prende nos primeiros 3 segundos)",
      "problema5s": "(desdobra o risco em 5 segundos)",
      "solucao5s": "(apresenta a saída em 5 segundos)",
      "cta2s": "(chamada final em 2 segundos)"
    }
  },
  "email": {
    "assunto": "(assunto que gera abertura — curiosidade + urgência)",
    "corpo": "(email completo com estrutura Peirceana: emoção → evidência → lógica → ação)"
  },
  "whatsapp": {
    "mensagem": "(conversacional, sem formatação corporativa, tom de consultor preocupado)"
  }
}`;
}

// ============================================================
// ÂNGULO 2 — AUTORIDADE / PROVA SOCIAL
// ============================================================

function promptAnguloAutoridade(mapaSemiotico) {
  return `Você é um copywriter especialista em marketing direto para o nicho educacional.
Use o Framework Peirceano para gerar copy de AUTORIDADE/PROVA SOCIAL.

## MAPA SEMIÓTICO DO CICLO
${JSON.stringify(mapaSemiotico, null, 2)}

## ESTRUTURA DO ÂNGULO 2 — AUTORIDADE/PROVA SOCIAL

**Hook:** ${mapaSemiotico.hooks?.autoridade || 'Credencial + resultado específico'}
Referência: "Com mestrado em educação e 15 anos transformando escolas, Kayenne já viu o que a falta de sistema causa."

**Bridge:** História da ${NICHO.especialista} ou de uma escola atendida.
Use a história-âncora: ${SIGNOS_PEIRCANOS.sinsignoIconico.historia.cena}
Resolução: ${SIGNOS_PEIRCANOS.sinsignoIconico.historia.resolucao}

**Problem:** O que escolas sem consultoria especializada deixam de detectar — pontos cegos que só aparecem na fiscalização.

**Solution:** Metodologia proprietária da Nex — ${SIGNOS_PEIRCANOS.sinsignoIndicialDicente.evidencias.map(e => e.fato).join('; ')}.

**Offer:** Diagnóstico gratuito em 6 minutos.

## EVIDÊNCIAS PEIRCEANAS (Sinsigno Indicial Dicente)
${SIGNOS_PEIRCANOS.sinsignoIndicialDicente.evidencias.map(e => `- ${e.tipo}: ${e.fato} → ${e.aplicacao}`).join('\n')}

## GERE AS SEGUINTES COPIES (em JSON):

{
  "angulo": "autoridade",
  "feed": {
    "headline": "(máx 40 caracteres — credencial forte)",
    "texto": "(máx 125 caracteres — resultado concreto)",
    "cta": "(chamada para ação)"
  },
  "stories": {
    "roteiro15s": {
      "gancho3s": "(credencial ou resultado que impressiona)",
      "problema5s": "(o que escolas sem consultoria não veem)",
      "solucao5s": "(metodologia Nex em ação)",
      "cta2s": "(chamada final)"
    }
  },
  "email": {
    "assunto": "(assunto com prova social ou credencial)",
    "corpo": "(email com história + evidências + convite)"
  },
  "whatsapp": {
    "mensagem": "(conversacional, compartilhando experiência real)"
  }
}`;
}

// ============================================================
// ÂNGULO 3 — OFERTA / DIAGNÓSTICO GRATUITO (Micro-Compromisso)
// ============================================================

function promptAnguloOferta(mapaSemiotico) {
  return `Você é um copywriter especialista em marketing direto para o nicho educacional.
Use o Framework Peirceano para gerar copy de OFERTA/DIAGNÓSTICO GRATUITO.

## MAPA SEMIÓTICO DO CICLO
${JSON.stringify(mapaSemiotico, null, 2)}

## ESTRUTURA DO ÂNGULO 3 — OFERTA/DIAGNÓSTICO GRATUITO (Micro-Compromisso)

**Hook:** ${mapaSemiotico.hooks?.oferta || 'Oferta específica com zero risco'}
Referência: "Em 6 minutos, descubra os 3 maiores riscos pedagógicos da sua escola — grátis."

**Bridge:** O que o diagnóstico revela em apenas 6 minutos — 47 indicadores analisados automaticamente.

**Problem:** Quanto custa NÃO saber o diagnóstico — cada dia sem dados é um dia de risco acumulado.

**Solution:** Relatório personalizado com os 3 maiores riscos da escola + plano de ação.

**Offer:** CTA direto para o diagnóstico. Zero custo. Zero compromisso. 6 minutos.

## LÓGICA IRREFUTÁVEL (Argumento Simbólico Peirceano)
${SIGNOS_PEIRCANOS.argumentoSimbolico.proposicaoLogica}

Cadeia da solução:
${SIGNOS_PEIRCANOS.argumentoSimbolico.cadeiaSolucao.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## GERE AS SEGUINTES COPIES (em JSON):

{
  "angulo": "oferta",
  "feed": {
    "headline": "(máx 40 caracteres — oferta irresistível)",
    "texto": "(máx 125 caracteres — benefício + zero risco)",
    "cta": "(chamada direta para diagnóstico)"
  },
  "stories": {
    "roteiro15s": {
      "gancho3s": "(oferta que para o scroll)",
      "problema5s": "(o que você perde sem saber)",
      "solucao5s": "(o que o relatório entrega)",
      "cta2s": "(CTA final urgente)"
    }
  },
  "email": {
    "assunto": "(assunto com oferta clara e curiosidade)",
    "corpo": "(email focado em micro-compromisso: baixa barreira + alto valor percebido)"
  },
  "whatsapp": {
    "mensagem": "(conversacional, como se estivesse indicando algo valioso para um colega)"
  }
}`;
}

/**
 * Retorna todos os 3 prompts de copy para um ciclo.
 */
function gerarPromptsCopy(mapaSemiotico) {
  return {
    risco: promptAnguloRisco(mapaSemiotico),
    autoridade: promptAnguloAutoridade(mapaSemiotico),
    oferta: promptAnguloOferta(mapaSemiotico),
  };
}

export default {
  promptAnguloRisco,
  promptAnguloAutoridade,
  promptAnguloOferta,
  gerarPromptsCopy,
};
