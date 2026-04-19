/**
 * Report Prompts — Relatório personalizado por lead
 *
 * Usa o Framework Peirceano para gerar relatórios personalizados
 * baseados nas respostas do diagnóstico de 6 minutos.
 */

import peirce from './peirce-framework.js';

const { NICHO, SIGNOS_PEIRCANOS } = peirce;

/**
 * Gera o prompt para Claude criar um relatório personalizado
 * baseado nas respostas do diagnóstico do lead.
 */
function gerarPromptRelatorio(lead) {
  const { nome, escola, respostas } = lead;

  return `Você é a ${NICHO.especialista}, consultora em inteligência pedagógica com mestrado em educação e 15+ anos de experiência.

## CONTEXTO
Um(a) diretor(a) chamado(a) ${nome} da escola "${escola || 'não informada'}" completou o Diagnóstico Nex de 6 minutos. Você precisa gerar um relatório personalizado.

## RESPOSTAS DO DIAGNÓSTICO
${JSON.stringify(respostas || {}, null, 2)}

## FRAMEWORK PEIRCEANO PARA O RELATÓRIO

### 1. Identificação das 3 Dores Prioritárias
Com base nas respostas, identifique as 3 maiores vulnerabilidades usando a escala Peirceana:
- RISCO LEGAL (peso 10): ${SIGNOS_PEIRCANOS.sinsignoIndicialRematico.gatilhos.filter(g => g.escala === 'RISCO_LEGAL').map(g => g.pergunta).join('; ')}
- VERGONHA PROFISSIONAL (peso 8): indicadores que expõem falhas de gestão
- PERDA FINANCEIRA (peso 7): custos ocultos da falta de sistema

### 2. Nomeação do Mecanismo do Problema
Para cada dor, use terminologia proprietária Nex:
- "Síndrome da Escola Invisível" — funciona mas não se enxerga
- "Gap Documental Crítico" — documentos existem mas desatualizados
- "Desalinhamento Pedagógico Sistêmico" — equipe sem norte comum
- "Risco Regulatório Latente" — conformidade aparente, vulnerabilidade real

### 3. Solução como Imperativo Lógico Irrefutável
Use o Argumento Simbólico Peirceano:
${SIGNOS_PEIRCANOS.argumentoSimbolico.proposicaoLogica}

## ESTRUTURA DO RELATÓRIO (gere em HTML para email)

<h2>Relatório de Diagnóstico Pedagógico — ${escola || '[Escola]'}</h2>

<h3>Olá, ${nome}!</h3>
<p>Parágrafo personalizado reconhecendo a coragem de fazer o diagnóstico e contextualizando os resultados.</p>

<h3>🔍 Seus 3 Maiores Riscos Pedagógicos</h3>
Para cada risco:
- Nome do risco (terminologia proprietária)
- O que os dados do diagnóstico revelam
- Consequência real se não tratado (com timeline)
- Nível de urgência: 🔴 Crítico / 🟡 Atenção / 🟢 Monitorar

<h3>📊 Sua Pontuação Geral</h3>
- Score de 0-100 baseado nos 47 indicadores
- Comparação com a média das escolas analisadas
- Áreas de força (reconhecer o positivo)
- Áreas críticas (máximo 3, focadas)

<h3>🗺️ Plano de Ação Recomendado</h3>
- 3 ações prioritárias (1 por risco)
- Para cada ação: o que fazer, por que agora, resultado esperado
- Timeline sugerida: 30/60/90 dias

<h3>📅 Próximo Passo</h3>
<p>Convite para consultoria gratuita de 30 minutos com Kayenne.</p>
<p>Link: ${process.env.CALENDLY_URL || '[CALENDLY_URL]'}</p>

<h3>Sobre a Nex</h3>
<p>Breve sobre credenciais: ${SIGNOS_PEIRCANOS.sinsignoIndicialDicente.evidencias.map(e => e.fato).join('. ')}.</p>

## REGRAS
- Tom: profissional mas acolhedor, como mentor preocupado
- Sem jargão excessivo — linguagem acessível
- Dados do diagnóstico são a base — nunca inventar
- Se uma resposta indica conformidade, reconhecer (não forçar problema)
- O relatório deve ser útil MESMO se a pessoa nunca comprar nada
- HTML limpo, sem CSS inline complexo — será renderizado em email
- Retorne APENAS o HTML do relatório, sem markdown ou explicações`;
}

/**
 * Gera prompts para cada mensagem da sequência WhatsApp de nutrição.
 */
function gerarPromptsNutricao(lead) {
  const { nome, escola, relatorio } = lead;

  return {
    boasVindas: `Gere uma mensagem de WhatsApp de boas-vindas para ${nome} da escola "${escola || ''}".

Contexto: acabou de completar o Diagnóstico Nex e recebeu o relatório por email.
Tom: consultor preocupado, conversacional, SEM formatação corporativa.
Inclua: saudação pessoal + confirmação do envio do relatório + link para ver.
Máximo 3 parágrafos curtos. Sem emojis excessivos (máx 2).
Termine com pergunta aberta: "Teve chance de ver o relatório?"`,

    aprofundamento: `Gere mensagem de WhatsApp (Dia 1) para ${nome}.

Contexto: recebeu relatório ontem. Maior risco identificado no relatório.
${relatorio ? `Resumo do relatório: ${JSON.stringify(relatorio)}` : ''}
Tom: consultor compartilhando insight valioso, NÃO vendedor.
Estrutura: "Oi ${nome}, pensando sobre o diagnóstico da sua escola..." + aprofundamento no risco principal + dado ou metáfora Peirceana relevante.
Sem CTA de venda. Apenas valor.
Máximo 4 parágrafos curtos.`,

    conviteConsultoria: `Gere mensagem de WhatsApp (Dia 2) para ${nome}.

Contexto: já recebeu relatório e mensagem de aprofundamento.
Objetivo: convidar para consultoria gratuita de 30 minutos.
Link do Calendly: ${process.env.CALENDLY_URL || '[CALENDLY_URL]'}
Tom: oferta natural, como se fosse uma continuação lógica da conversa.
Estrutura: referência à conversa anterior + "muitos diretores pedem para aprofundar..." + convite + link.
NÃO usar pressão. Usar lógica Peirceana: "já que você viu os riscos, faz sentido..."`,

    provaSocial: `Gere mensagem de WhatsApp (Dia 4) para ${nome}.

Contexto: não agendou consultoria ainda (ou agendou — adapte o tom).
Tom: compartilhamento de caso real, como colega contando uma história.
Use a história-âncora: ${SIGNOS_PEIRCANOS.sinsignoIconico.historia.cena}
Resolução: ${SIGNOS_PEIRCANOS.sinsignoIconico.historia.resolucao}
Estrutura: "Lembrei de você quando..." + história real + resultado + reforço sutil da oferta.
NÃO mencionar preço. Foco em transformação.`,

    urgenciaReal: `Gere mensagem de WhatsApp (Dia 7) para ${nome}.

Contexto: última mensagem da sequência.
Tom: urgência REAL baseada no calendário escolar — NÃO falsa escassez.
Gatilho temporal atual: ${SIGNOS_PEIRCANOS.legissignoIndicialRematico.getGatilhoAtual().gatilho}
Urgência: ${SIGNOS_PEIRCANOS.legissignoIndicialRematico.getUrgenciaAtual()}
Estrutura: contextualizar o timing real ("com o ${SIGNOS_PEIRCANOS.legissignoIndicialRematico.getGatilhoAtual().gatilho.toLowerCase()}...") + conectar com os riscos do relatório + última chance de consultoria gratuita.
Use metáfora: "${SIGNOS_PEIRCANOS.simboloRematico.metaforas[0].metafora}"
Termine com: "Se quiser conversar, estou aqui."`,
  };
}

export default {
  gerarPromptRelatorio,
  gerarPromptsNutricao,
};
