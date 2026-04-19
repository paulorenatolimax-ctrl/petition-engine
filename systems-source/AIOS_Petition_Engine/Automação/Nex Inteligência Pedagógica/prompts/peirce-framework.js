/**
 * Framework Semiótico Peirceano — Nex Inteligência Pedagógica
 *
 * Este módulo é o coração do sistema de copy. Implementa a análise
 * semiótica completa de Charles Sanders Peirce aplicada ao nicho de
 * gestores de escolas particulares / consultoria pedagógica.
 *
 * Cada signo Peirceano é mapeado para um elemento de persuasão
 * que alimenta os 3 ângulos de copy.
 */

const NICHO = {
  segmento: 'Gestores de escolas particulares',
  servico: 'Consultoria e inteligência pedagógica',
  empresa: 'Nex Inteligência Pedagógica',
  especialista: 'Kayenne Cristine Vosgerau da Silva',
  publicoAlvo: 'Diretores e gestores de escolas particulares, Brasil, 25-60 anos',
};

// ============================================================
// ETAPA 1 — ANÁLISE SEMIÓTICA PEIRCEANA COMPLETA
// ============================================================

const SIGNOS_PEIRCANOS = {
  /**
   * QUALISSIGNO (Remático Icônico)
   * Emoções primárias que existem antes de qualquer objeto concreto.
   * São as "qualidades de sentimento" que o público carrega.
   */
  qualissigno: {
    descricao: 'Emoções primárias do gestor escolar — acionadas na primeira linha do criativo',
    emocoes: [
      {
        emocao: 'Medo de fiscalização',
        intensidade: 'ALTA',
        gatilho: 'Visita surpresa do Núcleo Regional de Educação',
        aplicacao: 'Abrir com cenário de risco iminente',
      },
      {
        emocao: 'Vergonha de imprevidência',
        intensidade: 'ALTA',
        gatilho: 'Perceber que a escola funciona "no automático" sem sistema',
        aplicacao: 'Confrontar com a realidade de não ter documentos atualizados',
      },
      {
        emocao: 'Culpa por negligência pedagógica',
        intensidade: 'MÉDIA-ALTA',
        gatilho: 'Aluno com necessidade especial sem protocolo de atendimento',
        aplicacao: 'Mostrar consequência humana da falta de sistema',
      },
      {
        emocao: 'Orgulho de escola bem-administrada',
        intensidade: 'MÉDIA',
        gatilho: 'Escola aprovada em todas as instâncias com elogios',
        aplicacao: 'Usar como visão de futuro pós-solução (contraste)',
      },
    ],
  },

  /**
   * SINSIGNO ICÔNICO REMÁTICO
   * Uma ocorrência concreta que funciona como ícone.
   * História real que encarna o problema.
   */
  sinsignoIconico: {
    descricao: 'História-âncora: cena real que encarna o risco — começa na cena do risco, não na solução',
    historia: {
      cena: 'Diretora recebe visita surpresa do Núcleo Regional com PPP de 2019 e protocolos de inclusão inexistentes — escola autuada.',
      personagem: 'Diretora de escola particular de médio porte, 15 anos de experiência',
      conflito: 'Funcionava bem operacionalmente, mas sem sistema documental atualizado',
      consequencia: 'Autuação, risco de perda de credenciamento, pânico na equipe',
      resolucao: 'Após implementar o Sistema Nex, escola passou de autuada a referência regional em 90 dias',
    },
    frameworkNarrativo: 'SEMPRE começar na cena do risco, nunca na solução',
  },

  /**
   * SINSIGNO INDICIAL REMÁTICO
   * Gatilhos de dor imediata — perguntas que funcionam como índice
   * apontando diretamente para o problema.
   */
  sinsignoIndicialRematico: {
    descricao: 'Perguntas-gatilho que apontam diretamente para a dor — escala: risco legal > vergonha > perda financeira',
    gatilhos: [
      {
        pergunta: 'Sua escola está pronta para uma fiscalização agora?',
        escala: 'RISCO_LEGAL',
        peso: 10,
      },
      {
        pergunta: 'Você sabe o que o Decreto 12.773 exige da sua escola?',
        escala: 'RISCO_LEGAL',
        peso: 9,
      },
      {
        pergunta: 'Quando foi a última vez que seu PPP foi revisado?',
        escala: 'VERGONHA_PROFISSIONAL',
        peso: 8,
      },
      {
        pergunta: 'Seus protocolos de inclusão estão documentados e atualizados?',
        escala: 'RISCO_LEGAL',
        peso: 9,
      },
      {
        pergunta: 'Quantos indicadores pedagógicos sua escola monitora hoje?',
        escala: 'VERGONHA_PROFISSIONAL',
        peso: 7,
      },
      {
        pergunta: 'Você sabe quanto custa uma autuação do Núcleo Regional?',
        escala: 'PERDA_FINANCEIRA',
        peso: 8,
      },
    ],
    escalaHierarquia: ['RISCO_LEGAL', 'VERGONHA_PROFISSIONAL', 'PERDA_FINANCEIRA'],
  },

  /**
   * SINSIGNO INDICIAL DICENTE
   * Evidências concretas e verificáveis — provas de autoridade.
   */
  sinsignoIndicialDicente: {
    descricao: 'Evidências verificáveis de autoridade e credibilidade',
    evidencias: [
      {
        tipo: 'CREDENCIAL',
        fato: 'Kayenne possui Mestrado e Pós-graduação em Educação',
        aplicacao: 'Usar em ângulo de autoridade para estabelecer expertise',
      },
      {
        tipo: 'EXPERIÊNCIA',
        fato: '15+ anos de experiência em gestão educacional',
        aplicacao: 'Reforçar tempo de mercado e profundidade de conhecimento',
      },
      {
        tipo: 'METODOLOGIA',
        fato: 'Diagnóstico baseado em 47 indicadores pedagógicos',
        aplicacao: 'Mostrar que não é achismo — é sistema validado',
      },
      {
        tipo: 'RESULTADO',
        fato: 'Escolas atendidas passaram de autuadas a referência regional',
        aplicacao: 'Prova social de transformação concreta',
      },
    ],
  },

  /**
   * LEGISSIGNO INDICIAL REMÁTICO
   * Padrões temporais e de timing que criam urgência legítima.
   */
  legissignoIndicialRematico: {
    descricao: 'Gatilhos de urgência baseados em timing real do calendário escolar',
    gatilhosTemporais: [
      {
        periodo: 'Janeiro-Fevereiro',
        gatilho: 'Início de ano letivo — época de maior fiscalização',
        urgencia: 'CRÍTICA',
      },
      {
        periodo: 'Março-Abril',
        gatilho: 'Prazo para entrega de documentos ao Núcleo Regional',
        urgencia: 'ALTA',
      },
      {
        periodo: 'Maio-Junho',
        gatilho: 'Período de avaliações — indicadores expostos',
        urgencia: 'MÉDIA',
      },
      {
        periodo: 'Julho',
        gatilho: 'Recesso — momento para revisão e planejamento',
        urgencia: 'MÉDIA',
      },
      {
        periodo: 'Agosto-Setembro',
        gatilho: 'Segundo semestre — última chance de regularizar',
        urgencia: 'ALTA',
      },
      {
        periodo: 'Outubro-Novembro',
        gatilho: 'Renovação de credenciamento — prazo iminente',
        urgencia: 'CRÍTICA',
      },
      {
        periodo: 'Dezembro',
        gatilho: 'Balanço anual — resultados expostos',
        urgencia: 'MÉDIA',
      },
    ],
    getUrgenciaAtual: () => {
      const mes = new Date().getMonth();
      const mapa = {
        0: 'CRÍTICA', 1: 'CRÍTICA',
        2: 'ALTA', 3: 'ALTA',
        4: 'MÉDIA', 5: 'MÉDIA',
        6: 'MÉDIA',
        7: 'ALTA', 8: 'ALTA',
        9: 'CRÍTICA', 10: 'CRÍTICA',
        11: 'MÉDIA',
      };
      return mapa[mes];
    },
    getGatilhoAtual: () => {
      const mes = new Date().getMonth();
      const framework = SIGNOS_PEIRCANOS.legissignoIndicialRematico;
      const periodoIndex = mes <= 1 ? 0 : mes <= 3 ? 1 : mes <= 5 ? 2 : mes === 6 ? 3 : mes <= 8 ? 4 : mes <= 10 ? 5 : 6;
      return framework.gatilhosTemporais[periodoIndex];
    },
  },

  /**
   * SÍMBOLO REMÁTICO
   * Metáforas que condensam o problema em imagens mentais.
   */
  simboloRematico: {
    descricao: 'Metáforas-âncora que condensam complexidade em imagem mental instantânea',
    metaforas: [
      {
        metafora: 'Sua escola é um avião voando sem checklist de decolagem',
        contexto: 'Escola funciona mas sem processos sistematizados',
        forca: 'ALTA',
      },
      {
        metafora: 'PPP desatualizado é como não ter alvará de funcionamento',
        contexto: 'Documento obrigatório tratado como burocracia',
        forca: 'ALTA',
      },
      {
        metafora: 'Inteligência pedagógica é o que separa escolas que crescem das que fecham',
        contexto: 'Diferencial competitivo real',
        forca: 'MÉDIA-ALTA',
      },
      {
        metafora: 'Gerir escola sem dados é como navegar sem GPS',
        contexto: 'Decisões baseadas em intuição vs. dados',
        forca: 'MÉDIA',
      },
    ],
  },

  /**
   * ARGUMENTO SIMBÓLICO LEGISSIGNO
   * Cadeia lógica irrefutável que leva à ação.
   */
  argumentoSimbolico: {
    descricao: 'Lógica irrefutável: cadeia causal que torna a ação inevitável',
    cadeiaProblema: [
      'Escola sem sistema de inteligência pedagógica',
      'Risco constante de não-conformidade',
      'Fiscalização encontra irregularidades',
      'Perda de credenciamento',
      'Perda de alunos e receita',
      'Fechamento da escola',
    ],
    cadeiaSolucao: [
      'Diagnóstico de 6 minutos (gratuito)',
      'Relatório personalizado com os 3 maiores riscos',
      'Consultoria de 30 minutos com Kayenne',
      'Sistema Nex de Inteligência Pedagógica instalado',
      'Escola blindada e em conformidade total',
      'Crescimento sustentável com dados',
    ],
    proposicaoLogica: 'Se escola sem sistema pedagógico → risco constante → perda de credenciamento → perda de alunos → fechamento. Portanto, diagnóstico gratuito → relatório → consultoria → sistema instalado → escola blindada.',
  },
};

// ============================================================
// ETAPA 2 — PROMPT MASTER PARA CLAUDE API
// ============================================================

/**
 * Gera o prompt completo para a Claude API executar a análise
 * Peirceana e produzir o mapa semiótico do ciclo.
 */
function gerarPromptAnalisePeirceana() {
  const urgenciaAtual = SIGNOS_PEIRCANOS.legissignoIndicialRematico.getUrgenciaAtual();
  const gatilhoAtual = SIGNOS_PEIRCANOS.legissignoIndicialRematico.getGatilhoAtual();
  const mesAtual = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return `Você é um estrategista de copy que domina a semiótica de Charles Sanders Peirce aplicada a marketing direto.

## CONTEXTO
- Empresa: ${NICHO.empresa}
- Serviço: ${NICHO.servico}
- Público: ${NICHO.publicoAlvo}
- Especialista: ${NICHO.especialista}
- Mês atual: ${mesAtual}
- Urgência do período: ${urgenciaAtual}
- Gatilho temporal: ${gatilhoAtual.gatilho}

## ANÁLISE SEMIÓTICA DISPONÍVEL

### Qualissigno (emoções primárias)
${SIGNOS_PEIRCANOS.qualissigno.emocoes.map(e => `- ${e.emocao} (${e.intensidade}): ${e.aplicacao}`).join('\n')}

### Sinsigno Icônico (história-âncora)
${SIGNOS_PEIRCANOS.sinsignoIconico.historia.cena}
Framework: ${SIGNOS_PEIRCANOS.sinsignoIconico.frameworkNarrativo}

### Gatilhos de Dor (Sinsigno Indicial Remático)
${SIGNOS_PEIRCANOS.sinsignoIndicialRematico.gatilhos.map(g => `- "${g.pergunta}" [${g.escala}, peso ${g.peso}]`).join('\n')}

### Evidências (Sinsigno Indicial Dicente)
${SIGNOS_PEIRCANOS.sinsignoIndicialDicente.evidencias.map(e => `- ${e.tipo}: ${e.fato}`).join('\n')}

### Metáforas (Símbolo Remático)
${SIGNOS_PEIRCANOS.simboloRematico.metaforas.map(m => `- "${m.metafora}" (${m.forca})`).join('\n')}

### Lógica Irrefutável (Argumento Simbólico)
${SIGNOS_PEIRCANOS.argumentoSimbolico.proposicaoLogica}

## SUA TAREFA

Com base na análise semiótica acima e no timing atual (${mesAtual}, urgência ${urgenciaAtual}), gere um MAPA SEMIÓTICO ATUALIZADO contendo:

1. **Emoção dominante do período**: qual das emoções primárias está mais ativada agora
2. **Gatilho temporal específico**: como o timing atual intensifica a dor
3. **Narrativa atualizada**: versão da história-âncora ajustada ao momento
4. **3 hooks calibrados**: um por ângulo (risco, autoridade, oferta)
5. **Metáfora do ciclo**: a metáfora mais potente para este período

Responda em JSON com a estrutura:
{
  "ciclo": "YYYY-MM-DD",
  "emocaoDominante": { "emocao": "", "justificativa": "" },
  "gatilhoTemporal": { "gatilho": "", "intensificador": "" },
  "narrativaAtualizada": "",
  "hooks": {
    "risco": "",
    "autoridade": "",
    "oferta": ""
  },
  "metaforaCiclo": ""
}`;
}

export default {
  NICHO,
  SIGNOS_PEIRCANOS,
  gerarPromptAnalisePeirceana,
};
