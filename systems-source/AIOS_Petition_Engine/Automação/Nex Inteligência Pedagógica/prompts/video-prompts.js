/**
 * Video Prompts — Roteiros + Prompts Gemini Veo
 *
 * Gera roteiros de vídeo de 15 segundos estruturados no Framework Peirceano
 * e prompts para a Gemini Veo API gerar os vídeos.
 */

import peirce from './peirce-framework.js';

const { SIGNOS_PEIRCANOS } = peirce;

/**
 * Gera prompt para Claude criar o roteiro detalhado do vídeo.
 */
function gerarPromptRoteiro(angulo, mapaSemiotico) {
  const direcoes = {
    risco: {
      tom: 'urgente, sério, impactante',
      visualGancho: 'Cena de documento com carimbo vermelho "IRREGULAR" ou mão batendo na mesa',
      visualProblema: 'Montagem rápida: papéis desorganizados, tela de decreto, rosto preocupado',
      visualSolucao: 'Transição para tela com dashboard Nex, gráficos verdes, check marks',
      visualCTA: 'Tela limpa com botão "Diagnóstico Grátis" pulsando',
    },
    autoridade: {
      tom: 'confiante, inspirador, profissional',
      visualGancho: 'Profissional em ambiente educacional moderno, olhando para câmera',
      visualProblema: 'Antes/depois: escola desorganizada vs. escola estruturada',
      visualSolucao: 'Tela mostrando metodologia, dados, resultados',
      visualCTA: 'Convite pessoal para diagnóstico com sorriso',
    },
    oferta: {
      tom: 'acessível, direto, motivador',
      visualGancho: 'Timer de 6 minutos começando, texto "GRÁTIS" aparecendo',
      visualProblema: 'Pontos de interrogação sobre escola, dados faltando',
      visualSolucao: 'Relatório sendo gerado em tempo real, indicadores aparecendo',
      visualCTA: 'Tela com link clicável e texto "Comece agora"',
    },
  };

  const direcao = direcoes[angulo] || direcoes.risco;

  return `Você é um roteirista de vídeos curtos para ads educacionais.
Crie um roteiro de EXATAMENTE 15 segundos para o ângulo "${angulo}".

## MAPA SEMIÓTICO
${JSON.stringify(mapaSemiotico, null, 2)}

## ESTRUTURA OBRIGATÓRIA (15 segundos total)

### Gancho (0-3s) — PARAR O SCROLL
- Tom: ${direcao.tom}
- Visual sugerido: ${direcao.visualGancho}
- Texto na tela: frase curta e impactante (máx 8 palavras)
- Regra: primeiros 3 segundos decidem se a pessoa assiste

### Problema (3-8s) — CONECTAR COM A DOR
- Visual sugerido: ${direcao.visualProblema}
- Narração: descrever o problema em linguagem do gestor
- Texto na tela: dado ou pergunta que intensifica a dor
- Usar gatilhos Peirceanos: ${SIGNOS_PEIRCANOS.sinsignoIndicialRematico.gatilhos.slice(0, 2).map(g => g.pergunta).join(' / ')}

### Solução (8-13s) — APRESENTAR A SAÍDA
- Visual sugerido: ${direcao.visualSolucao}
- Narração: como o Sistema Nex resolve em termos concretos
- Texto na tela: "47 indicadores" ou "Sistema Nex" ou resultado
- Transição visual clara de problema → solução

### CTA (13-15s) — CHAMAR PARA AÇÃO
- Visual sugerido: ${direcao.visualCTA}
- Texto na tela: "Diagnóstico Grátis — 6 minutos"
- Narração: "Faça seu diagnóstico gratuito agora"
- Link visual: predict-vibe-pro.lovable.app

## RESPONDA EM JSON:

{
  "angulo": "${angulo}",
  "duracaoTotal": "15s",
  "segmentos": [
    {
      "fase": "gancho",
      "inicio": "0s",
      "fim": "3s",
      "textoTela": "",
      "narracao": "",
      "direcaoVisual": "",
      "musica": "tensão crescente / impacto inicial"
    },
    {
      "fase": "problema",
      "inicio": "3s",
      "fim": "8s",
      "textoTela": "",
      "narracao": "",
      "direcaoVisual": "",
      "musica": "mantém tensão"
    },
    {
      "fase": "solucao",
      "inicio": "8s",
      "fim": "13s",
      "textoTela": "",
      "narracao": "",
      "direcaoVisual": "",
      "musica": "transição para esperança / resolução"
    },
    {
      "fase": "cta",
      "inicio": "13s",
      "fim": "15s",
      "textoTela": "",
      "narracao": "",
      "direcaoVisual": "",
      "musica": "nota final de ação"
    }
  ]
}`;
}

/**
 * Gera o prompt para a Gemini Veo API criar o vídeo a partir do roteiro.
 */
function gerarPromptVeo(roteiro, angulo) {
  const estilos = {
    risco: 'dramatic corporate style, urgent mood, dark blue and red color scheme, document close-ups, serious tone',
    autoridade: 'professional educational setting, confident mood, blue and gold tones, modern school environment, warm lighting',
    oferta: 'clean minimal design, bright and inviting, white background with green accents, timer animation, modern UI elements',
  };

  const segmentos = roteiro.segmentos || [];

  return `Create a 15-second vertical video (1080x1920, 9:16 aspect ratio) for an educational consulting company ad.

## STYLE
${estilos[angulo] || estilos.risco}

## BRAND
- Company: Nex Inteligência Pedagógica
- Colors: Dark blue (#1a365d), Red (#e53e3e), Green (#38a169)
- Audience: Brazilian school directors and managers

## SCENE BREAKDOWN

Scene 1 (0-3 seconds): ${segmentos[0]?.direcaoVisual || 'Dramatic opening that stops the scroll'}
Text overlay: "${segmentos[0]?.textoTela || ''}"

Scene 2 (3-8 seconds): ${segmentos[1]?.direcaoVisual || 'Problem visualization'}
Text overlay: "${segmentos[1]?.textoTela || ''}"

Scene 3 (8-13 seconds): ${segmentos[2]?.direcaoVisual || 'Solution reveal'}
Text overlay: "${segmentos[2]?.textoTela || ''}"

Scene 4 (13-15 seconds): ${segmentos[3]?.direcaoVisual || 'Call to action'}
Text overlay: "${segmentos[3]?.textoTela || 'Diagnóstico Grátis — 6 min'}"

## REQUIREMENTS
- Vertical video (9:16)
- Professional quality
- Brazilian Portuguese text overlays
- Smooth transitions between scenes
- No audio (will be added separately)
- Modern, clean motion graphics style`;
}

export default {
  gerarPromptRoteiro,
  gerarPromptVeo,
};
