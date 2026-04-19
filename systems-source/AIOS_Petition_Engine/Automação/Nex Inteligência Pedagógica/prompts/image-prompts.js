/**
 * Image Prompts — Instruções visuais para Gemini por ângulo
 *
 * Cada ângulo tem uma direção visual específica alinhada
 * ao Framework Peirceano para maximizar impacto.
 */

const BRAND = {
  nome: 'Nex Inteligência Pedagógica',
  cores: {
    primaria: '#1a365d',    // azul escuro (confiança, autoridade)
    secundaria: '#e53e3e',  // vermelho (urgência)
    accent: '#38a169',      // verde (solução, crescimento)
    branco: '#ffffff',
    cinzaClaro: '#f7fafc',
  },
  fontes: 'moderna, sans-serif, profissional',
  logoDescricao: 'Logo "Nex" em fonte moderna, clean, azul escuro',
};

const FORMATOS = {
  feed: { largura: 1080, altura: 1080, aspecto: '1:1' },
  stories: { largura: 1080, altura: 1920, aspecto: '9:16' },
};

/**
 * Gera prompt de imagem para o Gemini baseado no ângulo e copy.
 */
function gerarPromptImagem(angulo, copy, formato = 'feed') {
  const dimensoes = FORMATOS[formato];
  const base = getBaseVisualAngulo(angulo);

  return `Generate a professional marketing image for an educational consulting company.

## BRAND
- Company: ${BRAND.nome}
- Style: Professional, modern, trustworthy
- Primary color: ${BRAND.cores.primaria} (dark blue)
- Accent color: ${base.corDestaque}

## IMAGE SPECIFICATIONS
- Dimensions: ${dimensoes.largura}x${dimensoes.altura} pixels
- Aspect ratio: ${dimensoes.aspecto}
- Format: PNG, high quality

## VISUAL DIRECTION — ${base.titulo}
${base.direcaoVisual}

## TEXT OVERLAY
- Headline: "${copy.headline || ''}"
- CTA button: "${copy.cta || 'Faça o Diagnóstico Grátis'}"
- Logo area: bottom right corner, "${BRAND.nome}"

## COMPOSITION
${base.composicao}

## STYLE
- Clean, professional design
- Brazilian Portuguese text
- Target audience: School directors and managers (25-60 years old)
- Mood: ${base.mood}
- No stock photo clichés — authentic, modern feel
- High contrast text for readability`;
}

function getBaseVisualAngulo(angulo) {
  const visuais = {
    risco: {
      titulo: 'URGÊNCIA / RISCO LEGAL',
      corDestaque: BRAND.cores.secundaria,
      direcaoVisual: `Visual tenso que comunica urgência e risco iminente.
- Cores frias dominantes (azul escuro, cinza) com elemento vermelho de alerta
- Elemento visual de documento oficial, carimbo, ou decreto
- Sensação de "deadline se aproximando"
- Ícone ou visual de documento com marca d'água de "ALERTA" ou "ATENÇÃO"`,
      composicao: `- Background: gradiente escuro (azul navy para cinza)
- Elemento central: documento estilizado com selo de alerta
- Headline em branco com destaque em vermelho na palavra-chave
- CTA button em vermelho com texto branco
- Borda sutil vermelha sugerindo urgência`,
      mood: 'Urgente, sério, profissional — como um aviso oficial importante',
    },

    autoridade: {
      titulo: 'AUTORIDADE / PROVA SOCIAL',
      corDestaque: BRAND.cores.primaria,
      direcaoVisual: `Visual de autoridade e credibilidade profissional.
- Contexto profissional: sala de reuniões, escola moderna, ambiente educacional
- Elementos que sugerem expertise: livros, diplomas, gráficos de resultado
- Sensação de confiança e competência
- Paleta azul profunda com toques de dourado`,
      composicao: `- Background: ambiente profissional clean, tons de azul e branco
- Elemento de credencial: ícone de mestrado/certificação
- Dados de resultado em destaque (números, porcentagens)
- Headline em azul escuro, forte e confiante
- CTA button em azul com texto branco
- Selo ou badge de "15+ anos de experiência"`,
      mood: 'Confiante, experiente, inspirador — como um mentor respeitado',
    },

    oferta: {
      titulo: 'OFERTA / DIAGNÓSTICO GRATUITO',
      corDestaque: BRAND.cores.accent,
      direcaoVisual: `Visual clean e direto focado na oferta.
- Predominância de branco e espaço limpo
- CTA visualmente o elemento mais destacado da imagem
- Elemento de "presente" ou "gratuito" — sem parecer barato
- Sensação de oportunidade exclusiva`,
      composicao: `- Background: branco ou gradiente muito sutil
- Headline grande e central
- "GRÁTIS" ou "6 MINUTOS" como elemento visual de destaque
- CTA button grande em verde (${BRAND.cores.accent}) — maior que nos outros ângulos
- Ícone de checklist ou diagnóstico
- Badge "47 indicadores analisados"
- Mínimo de elementos — máximo impacto`,
      mood: 'Limpo, acessível, irresistível — como uma oportunidade óbvia',
    },
  };

  return visuais[angulo] || visuais.risco;
}

/**
 * Gera prompts de imagem para todos os formatos de um ângulo.
 */
function gerarPromptsImagemCompleto(angulo, copy) {
  return {
    feed: gerarPromptImagem(angulo, copy, 'feed'),
    stories: gerarPromptImagem(angulo, copy, 'stories'),
  };
}

export default {
  BRAND,
  FORMATOS,
  gerarPromptImagem,
  gerarPromptsImagemCompleto,
  getBaseVisualAngulo,
};
