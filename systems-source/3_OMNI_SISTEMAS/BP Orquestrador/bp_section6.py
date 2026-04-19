"""Section 6: FINAL CONSIDERATIONS \u2014 Expanded for 55-65 page target"""
from generate_bp_v2 import (p_text, bullet, check, num_item, table_sub,
               make_table, separator, page_break, highlight_box,
               add_footnote)


def build_section_6(doc):
  doc.add_heading('6. FINAL CONSIDERATIONS', level=1)
  p_text(doc, 'Esta se\u00e7\u00e3o consolida a **timeline de implementa\u00e7\u00e3o**, '
      'a **an\u00e1lise de riscos**, as **considera\u00e7\u00f5es finais** sobre viabilidade '
      'e impacto, e as **refer\u00eancias** que fundamentam as proje\u00e7\u00f5es e '
      'an\u00e1lises apresentadas neste Business Plan.')

  p_text(doc, 'O encerramento deste plano de neg\u00f3cios reafirma o compromisso da '
      '**Vieira Operations LLC** com a **excel\u00eancia operacional**, a **gera\u00e7\u00e3o '
      'de valor sustent\u00e1vel** e o **impacto positivo** na economia americana, '
      'alinhando-se \u00e0s prioridades estrat\u00e9gicas nacionais.')

  # ================================================================
  # 6.1 Timeline de Implementa\u00e7\u00e3o
  # ================================================================
  doc.add_heading('6.1. Timeline de Implementa\u00e7\u00e3o', level=2)
  p = p_text(doc, 'A implementa\u00e7\u00e3o da Vieira Operations LLC estrutura-se em cronograma '
        'de **64 meses** (5 anos + fase pr\u00e9-operacional) dividido em **cinco fases '
        'estrat\u00e9gicas**, cada uma com marcos operacionais, financeiros e de '
        'recursos humanos mensur\u00e1veis e verificaveis.')

  p = p_text(doc, 'O modelo de expans\u00e3o progressiva segue as melhores pr\u00e1ticas '
        'documentadas pelo **U.S. Small Business Administration**, que registra taxa de '
        'sobreviv\u00eancia de **78,5%** para empresas de servi\u00e7os profissionais com '
        'planejamento estruturado e capital de giro adequado.')
  add_footnote(doc, p, 'U.S. Small Business Administration, Starting and Managing a Business \u2014 taxa de sobreviv\u00eancia para servi\u00e7os profissionais com planejamento estruturado.')

  p_text(doc, 'Cada fase incorpora **marcos trimestrais** (milestones) que permitem '
      'monitoramento cont\u00ednuo do progresso, identifica\u00e7\u00e3o precoce de '
      'desvios e tomada de decis\u00e3o informada sobre a evolu\u00e7\u00e3o do '
      'neg\u00f3cio ao longo do horizonte de cinco anos.')

  # --- Phase 0 ---
  doc.add_heading('Fase 0: Pr\u00e9-Operacional (Y0 \u2014 Meses 1-4)', level=3)
  p_text(doc, 'A fase pr\u00e9-operacional concentra todas as atividades de **constitui\u00e7\u00e3o '
      'legal**, **infraestrutura inicial** e **prepara\u00e7\u00e3o comercial** necess\u00e1rias '
      'para o lan\u00e7amento da opera\u00e7\u00e3o em Jacksonville, FL.')

  table_sub(doc, 'Tabela 6.1a: Marcos Trimestrais \u2014 Fase 0 (Meses 1-4)')
  make_table(doc,
    ['M\u00eas', 'Milestone', 'Entregavel', 'Status Gate'],
    [
      ['M1', 'Constitui\u00e7\u00e3o legal S-Corp',
       'Registro FL Division of Corporations (Sunbiz)', 'GO/NO-GO'],
      ['M1-M2', 'Obten\u00e7\u00e3o de licen\u00e7as',
       'NAICS 541611, EIN, conta banc\u00e1ria comercial', 'Compliance'],
      ['M2-M3', 'Setup do escrit\u00f3rio Jacksonville',
       'Coworking executivo, equipamentos TI, rede', 'Operacional'],
      ['M3-M4', 'Desenvolvimento comercial inicial',
       'Website, materiais, primeiros contatos comerciais', 'Pipeline'],
    ],
    col_widths=[0.7, 1.3, 2.2, 1.0]
  )

  p_text(doc, '**Investimento Fase 0:** $121.972 destinados a capital de giro '
      '(3 meses), equipamentos e registro legal. **Financiamento:** $121.972 '
      'via linha de cr\u00e9dito banc\u00e1ria a 12% a.a. em 5 anos, com parcela '
      'mensal de $2.676.')

  # --- Phase 1 ---
  doc.add_heading('Fase 1: Lan\u00e7amento (Y1 \u2014 Meses 5-16)', level=3)
  p_text(doc, 'O primeiro ano de opera\u00e7\u00e3o foca em **estabelecer a base de clientes**, '
      'atingir o **break-even no Y2** e validar o modelo de neg\u00f3cio com '
      'resultados mensur\u00e1veis no mercado de Jacksonville.')

  table_sub(doc, 'Tabela 6.1b: Marcos Trimestrais \u2014 Fase 1 (Meses 5-16)')
  make_table(doc,
    ['Trimestre', 'Milestone', 'KPI Alvo', 'Receita Acumulada'],
    [
      ['Q1 (M5-M7)', 'Primeiro contrato assinado',
       '2+ clientes ativos, utiliza\u00e7\u00e3o 60%', '$91.680'],
      ['Q2 (M8-M10)', 'Pipeline validado',
       '4+ clientes, utiliza\u00e7\u00e3o 70%', '$229.200'],
      ['Q3 (M11-M13)', 'Pipeline robusto',
       '5+ clientes, margem positiva consistente', '$366.720'],
      ['Q4 (M14-M16)', 'Primeira contrata\u00e7\u00e3o',
       '3 colaboradores, receita $550K', '$550.080'],
    ],
    col_widths=[1.0, 1.3, 1.8, 1.0]
  )

  p_text(doc, '**Equipe Y1:** 3 colaboradores (fundador + 2 especialistas), com '
      'meta de receita de **$550.080** e break-even point em $567.870. '
      'O break-even \u00e9 atingido no **Y2** quando a receita supera o BEP.')

  # --- Phase 2 ---
  doc.add_heading('Fase 2: Expans\u00e3o Regional (Y2 \u2014 Meses 17-28)', level=3)
  p = p_text(doc, 'A segunda fase marca a **expans\u00e3o para Savannah, GA**, dobrando a '
        'capacidade operacional e estabelecendo presen\u00e7a no corredor log\u00edstico '
        'I-95. O Port of Savannah, quarto maior dos EUA em movimenta\u00e7\u00e3o de '
        'cont\u00eaineres, gera demanda significativa por serviços profissionais.')
  add_footnote(doc, p, 'Georgia Ports Authority, Port of Savannah Statistics \u2014 dados de cont\u00eaineres, crescimento e investimentos em infraestrutura portu\u00e1ria.')

  table_sub(doc, 'Tabela 6.1c: Marcos Trimestrais \u2014 Fase 2 (Meses 17-28)')
  make_table(doc,
    ['Trimestre', 'Milestone', 'KPI Alvo', 'Receita Acumulada'],
    [
      ['Q1 (M17-M19)', 'Abertura Savannah',
       'Escrit\u00f3rio operacional, 2 novos especialistas', '$252.120'],
      ['Q2 (M20-M22)', 'Primeiros clientes Savannah',
       '3+ clientes na nova localidade', '$504.240'],
      ['Q3 (M23-M25)', 'Integra\u00e7\u00e3o operacional',
       '7 colaboradores totais, cross-selling ativo', '$756.360'],
      ['Q4 (M26-M28)', 'Consolida\u00e7\u00e3o Y2',
       'Receita $1.008K, margem EBITDA 15,6%', '$1.008.480'],
    ],
    col_widths=[1.0, 1.3, 1.8, 1.0]
  )

  p_text(doc, '**Equipe Y2:** 7 colaboradores representam crescimento de 133% '
      'versus Y1, sustentando a meta de receita de **$1.008.480** (83% acima '
      'do primeiro ano). O investimento de **$130.472** destina-se ao capital '
      'de giro da opera\u00e7\u00e3o em Savannah e equipamentos para a nova equipe.')

  # --- Phase 3 ---
  doc.add_heading('Fase 3: Consolida\u00e7\u00e3o (Y3-Y4 \u2014 Meses 29-52)', level=3)
  p_text(doc, 'A fase de consolida\u00e7\u00e3o foca em **otimizar opera\u00e7\u00f5es** nas '
      'duas localidades, aumentar a **taxa de utiliza\u00e7\u00e3o**, diversificar a base '
      'de clientes e construir **pipeline robusto** para a terceira expans\u00e3o. '
      'O per\u00edodo de 24 meses permite matura\u00e7\u00e3o operacional.')

  table_sub(doc, 'Tabela 6.1d: Marcos Semestrais \u2014 Fase 3 (Meses 29-52)')
  make_table(doc,
    ['Per\u00edodo', 'Milestone', 'KPI Alvo', 'Receita Acumulada'],
    [
      ['S1-Y3 (M29-M34)', 'Escala operacional',
       '9 colaboradores, utiliza\u00e7\u00e3o 82%', '$887.832'],
      ['S2-Y3 (M35-M40)', 'Diversifica\u00e7\u00e3o de clientes',
       '15+ clientes ativos, 3+ setores', '$1.775.664'],
      ['S1-Y4 (M41-M46)', 'Consolida\u00e7\u00e3o operacional',
       '10 colaboradores, pipeline $2M+', '$890.446'],
      ['S2-Y4 (M47-M52)', 'Prepara\u00e7\u00e3o Fase 4',
       'Due diligence Brunswick, equipe 10', '$1.780.891'],
    ],
    col_widths=[1.0, 1.3, 1.8, 1.0]
  )

  p_text(doc, '**Equipe Y3-Y4:** a opera\u00e7\u00e3o cresce para 9 a 10 '
      'colaboradores, gerando receitas de **$1.775.664** (Y3) e '
      '**$1.780.891** (Y4). O investimento de **$130.472** no Y4 destina-se \u00e0 '
      'expans\u00e3o da infraestrutura e prepara\u00e7\u00e3o para a Fase 4.')

  # --- Phase 4 ---
  doc.add_heading('Fase 4: Maturidade (Y5 \u2014 Meses 53-64)', level=3)
  p = p_text(doc, 'A fase de maturidade consolida a **terceira localidade em Brunswick, GA** '
        'e atinge o **pico de capacidade operacional** com 14 colaboradores diretos. '
        'Brunswick complementa o corredor I-95 com acesso ao cluster industrial do '
        'sudeste da Georgia.')

  table_sub(doc, 'Tabela 6.1e: Marcos Trimestrais \u2014 Fase 4 (Meses 53-64)')
  make_table(doc,
    ['Trimestre', 'Milestone', 'KPI Alvo', 'Receita Acumulada'],
    [
      ['Q1 (M53-M55)', 'Abertura Brunswick',
       'Escrit\u00f3rio operacional, 4 novos especialistas', '$626.180'],
      ['Q2 (M56-M58)', 'Ramp-up Brunswick',
       'Primeiros clientes, integra\u00e7\u00e3o regional', '$1.252.360'],
      ['Q3 (M59-M61)', 'Capacidade plena',
       '14 colaboradores, utiliza\u00e7\u00e3o 85%+', '$1.878.541'],
      ['Q4 (M62-M64)', 'Meta final Y5',
       'Receita $2,5M, EBITDA 32,5%, 76 empregos', '$2.504.721'],
    ],
    col_widths=[1.0, 1.3, 1.8, 1.0]
  )

  p_text(doc, '**Equipe Y5:** 14 colaboradores diretos e 62 indiretos '
      '(multiplicador EPI 4,43x), totalizando 76 postos de trabalho. '
      'A meta de receita de **$2.504.721** representa CAGR de 46,1% '
      'ao longo dos cinco anos. O investimento total acumulado de '
      '**$382.917** sustenta as tr\u00eas fases de expans\u00e3o.')

  # --- Resumo Consolidado ---
  doc.add_heading('Vis\u00e3o Consolidada da Timeline', level=3)
  p_text(doc, 'A tabela abaixo consolida os **indicadores-chave** de cada fase, demonstrando '
      'a evolu\u00e7\u00e3o progressiva da empresa em termos de receita, equipe, '
      'localidades e indicadores financeiros ao longo dos cinco anos.')

  table_sub(doc, 'Tabela 6.1f: Vis\u00e3o Consolidada \u2014 Indicadores por Fase')
  make_table(doc,
    ['Indicador', 'Fase 0', 'Fase 1', 'Fase 2', 'Fase 3', 'Fase 4'],
    [
      ['Per\u00edodo', 'M1-M4', 'M5-M16', 'M17-M28', 'M29-M52', 'M53-M64'],
      ['Localidades', '1', '1', '2', '2', '3'],
      ['Colaboradores', '\u2014', '3', '7', '9-10', '14'],
      ['Receita', '\u2014', '$550K', '$1.008K', '$3.557K', '$2.505K'],
      ['Investimento', '$122,0K', '\u2014', '$130,5K', '$130,5K', '\u2014'],
      ['Margem EBITDA', '\u2014', '12,0%', '15,6%', '26,6-33,9%', '32,5%'],
      ['Empregos Totais', '\u2014', '13', '31', '40-44', '76'],
    ],
    col_widths=[1.2, 0.8, 0.8, 0.8, 0.9, 0.8]
  )

  p_text(doc, 'O cronograma demonstra **disciplina de execu\u00e7\u00e3o** com expans\u00e3o '
      'condicionada ao atingimento de marcos em cada fase. Nenhuma nova localidade '
      '\u00e9 aberta antes da consolida\u00e7\u00e3o da anterior, minimizando risco '
      'operacional e preservando a sa\u00fade financeira.')

  # ================================================================
  # 6.2 Considera\u00e7\u00f5es Finais (1-2 p\u00e1ginas)
  # ================================================================
  doc.add_heading('6.2. Considera\u00e7\u00f5es Finais', level=2)

  p_text(doc, 'A Vieira Operations LLC re\u00fane **oportunidade de mercado comprovada**, '
      '**expertise diferenciada do fundador** e **modelo financeiro robusto** para '
      'atender a demanda crescente por servi\u00e7os profissionais de gest\u00e3o no '
      'Sudeste dos EUA. O posicionamento mid-market ($115/hora) preenche o gap entre '
      'grandes firmas internacionais e prestadores locais, em segmento impulsionado '
      'pelo nearshoring, pela EO 14017 e pelo CHIPS Act.')

  p_text(doc, 'A an\u00e1lise financeira projeta **NPV de $378.348** com taxa de desconto de 12%, '
      '**IRR de 64,3%** e **payback descontado de 3 anos** \u2014 posicionando o empreendimento '
      'no **quartil superior** do segmento NAICS 541611. O ROI de 170,1% em cinco anos e o '
      'break-even atingido no Y2 confirmam a solidez do modelo. A receita acumulada de '
      '**$7,6 milh\u00f5es** sustenta margem EBITDA crescente, de 12,0% no Y1 a **32,5% no Y5**, '
      'evidenciando ganhos de escala \u00e0 medida que a opera\u00e7\u00e3o se expande pelas tr\u00eas localidades '
      'do corredor I-95.')

  p_text(doc, 'O impacto econ\u00f4mico projeta a gera\u00e7\u00e3o de **76 postos de trabalho** \u2014 14 diretos '
      'e 62 indiretos (multiplicador EPI 4,43x) \u2014 em Jacksonville, Savannah e Brunswick, '
      'contribuindo diretamente para o desenvolvimento de uma regi\u00e3o estrat\u00e9gica para a '
      'infraestrutura log\u00edstica nacional. O investimento total de **$382.917** ao longo de cinco '
      'anos converte-se em receita tribut\u00e1ria federal e estadual, massa salarial qualificada e '
      'fortalecimento do ecossistema de supply chain no Sudeste americano.')

  p_text(doc, 'A converg\u00eancia entre **pol\u00edticas federais estruturantes** \u2014 EO 14017, CHIPS Act, '
      'IIJA e NDIS \u2014 e a expertise de **25 anos do fundador** em opera\u00e7\u00f5es industriais de '
      'classe mundial na AmBev/AB InBev cria vantagem competitiva dur\u00e1vel. Resultados '
      'documentados como a **redu\u00e7\u00e3o de 48% em custos log\u00edsticos** e a **antecipa\u00e7\u00e3o de '
      '2 anos e 4 meses** na implementa\u00e7\u00e3o SAP Fiori demonstram capacidade comprovada de '
      'gerar valor tang\u00edvel para clientes corporativos do mid-market americano.')

  p_text(doc, 'Os indicadores financeiros, o alinhamento com prioridades nacionais e a '
      'capacidade demonstrada de execu\u00e7\u00e3o sustentam a **viabilidade** e o **potencial de '
      'impacto** da Vieira Operations LLC como empreendimento de **alto valor** para '
      'a economia americana.')

  separator(doc)
  page_break(doc)

