"""Section 5: FINANCIAL PLAN — All numbers from V3_Planilha_Financeira_Everton.xlsx"""
from generate_bp_v2 import (p_text, bullet, check, num_item, table_sub,
                             make_table, separator, page_break, highlight_box,
                             add_footnote)


def build_section_5(doc):
    doc.add_heading('5. FINANCIAL PLAN', level=1)
    p = p_text(doc,
        'O plano financeiro traduz a estratégia da Vieira Operations LLC '
        'em **premissas**, **investimentos**, **projeções de receita** e '
        '**indicadores de retorno** ao longo de cinco anos. A modelagem '
        'adota abordagem **bottom-up**, partindo da capacidade produtiva '
        'real (horas faturáveis por especialista) e das taxas praticadas '
        'no mercado NAICS 541611.')
    add_footnote(doc, p,
        'Metodologia bottom-up recomendada pelo U.S. Small Business '
        'Administration (SBA) para small businesses em estágio inicial.')

    p = p_text(doc,
        'Valores expressos em **dólares americanos correntes**, com '
        'inflação projetada de 2,5\u2009% a.a. conforme target rate do '
        'Federal Reserve. Horizonte de análise: Y0 (pré-operacional) a Y5.')
    add_footnote(doc, p,
        'Federal Reserve, Summary of Economic Projections — long-run '
        'PCE inflation target of 2.0–2.5\u2009%.')

    # ================================================================
    # 5.1 PREMISSAS FINANCEIRAS
    # ================================================================
    doc.add_heading('5.1. Premissas Financeiras', level=2)
    p_text(doc,
        'As projeções derivam de **dados de mercado verificáveis**. '
        'A taxa média de $115/hora no Y1 situa-se no **mid-point** entre '
        'boutiques ($100/hora) e Big\u00a04 ($350/hora). A receita é '
        'função de três variáveis: especialistas ativos, horas faturáveis '
        'e taxa média por hora.')

    table_sub(doc, 'Tabela 5.1a: Premissas Financeiras Críticas')
    make_table(doc,
        ['Premissa', 'Valor', 'Fonte / Justificativa'],
        [
            ['Taxa média hora (Y1)', '$115/hora',
             'Mid-point entre boutiques ($100) e Big 4 ($350)'],
            ['Horas faturáveis/especialista', '1.600–1.700/ano',
             'Padrão NAICS 541611 (BLS)'],
            ['Taxa de utilização (Y1)', '75%',
             'Conservador para primeiro ano de operação'],
            ['Crescimento anual receita', '46,1% CAGR',
             'Expansão geográfica + contratações'],
            ['Margem de contribuição média', '80,3%',
             'Modelo asset-light de serviços profissionais'],
            ['Custo fixo mensal (Y1)', '$30.249',
             'Pessoal + aluguel + software + seguros + operacional'],
            ['Taxa de desconto (WACC)', '12%',
             'Padrão para small business services (SBA)'],
            ['Inflação projetada', '2,5% a.a.',
             'Federal Reserve target rate'],
            ['Payroll tax rate (FL)', '15,62%',
             'Social Security + Medicare + FUTA + SUTA'],
            ['Taxa de inadimplência', '3%',
             'Média do setor NAICS 541611'],
        ],
        col_widths=[2.0, 1.2, 2.8]
    )

    doc.add_heading('Premissas de Custo e Depreciação', level=3)
    p_text(doc,
        '**Custos variáveis** totalizam 22\u2009% da receita no Y1, '
        'reduzindo-se a 19,3\u2009% no Y5 por ganho de escala em '
        'marketing. Os quatro componentes são: **orçamento de vendas** '
        '(4,1\u2009%), **profissionais comissionados** (3,1\u2009%), '
        '**materiais de treinamento** (1,2\u2009%) e **marketing e '
        'ações socioambientais** (13,5\u2009%).')

    table_sub(doc, 'Tabela 5.1b: Premissas de Custo e Depreciação')
    make_table(doc,
        ['Premissa', 'Valor', 'Referência'],
        [
            ['Custos variáveis / receita (Y1)', '22,0%',
             'Vendas 4,1% + Comissões 3,1% + Material 1,2% + Mkt 13,5%'],
            ['Depreciação equipamentos', 'Ciclo 5 anos',
             'IRS Publication 946 — MACRS'],
            ['Amortização financiamento', '$24.394/ano',
             'Financiamento $121.972 a 12% a.a., 60 meses'],
            ['Juros financiamento', '$7.712/ano',
             'Taxa média sobre período do empréstimo'],
            ['Payroll tax rates', '15,6%–20,6%',
             'Jacksonville FL 15,62%, Savannah GA 20,34%, Brunswick GA 20,57%'],
            ['Reajuste salarial anual', '3%',
             'Alinhado à inflação + 0,5% merit increase'],
        ],
        col_widths=[2.0, 1.2, 2.8]
    )

    p = p_text(doc,
        '**Cenário macroeconômico base:** inflação de 2,5\u2009% a.a., '
        'desemprego abaixo de 4\u2009% no Sudeste, PIB entre 2–2,5\u2009%. '
        'A demanda por serviços de supply chain é sustentada pela '
        '**Executive Order 14017** e pelo **CHIPS and Science Act**.')
    add_footnote(doc, p,
        'Bureau of Labor Statistics (BLS), Occupational Employment and Wage '
        'Statistics — NAICS 541611, Management Consulting Services.')

    # ================================================================
    # 5.2 INVESTIMENTOS
    # ================================================================
    doc.add_heading('5.2. Investimentos', level=2)
    p_text(doc,
        'Investimentos totais de **$382.917** em três ondas de expansão '
        '(uma por localidade): Y0 Jacksonville ($121.972), Y2 Savannah '
        '($130.472) e Y4 Brunswick ($130.472). Modelo **asset-light**: '
        'equipamentos representam 12,8\u2009% do total, enquanto capital '
        'de giro absorve a maior parcela, garantindo fôlego financeiro '
        'durante o ramp-up de cada localidade.')

    table_sub(doc, 'Tabela 5.2a: Investimentos por Onda de Expansão')
    make_table(doc,
        ['Onda', 'Local', 'Ano', 'Tangível', 'Intangível + Capital Giro',
         'Total'],
        [
            ['1', 'Jacksonville, FL (sede)', 'Y0',
             '$16.325', '$105.647', '$121.972'],
            ['2', 'Savannah, GA (branch)', 'Y2',
             '—', '—', '$130.472'],
            ['3', 'Brunswick, GA (branch)', 'Y4',
             '—', '—', '$130.472'],
            ['', '**Total**', '', '', '', '**$382.917**'],
        ],
        col_widths=[0.4, 1.5, 0.5, 0.8, 1.3, 0.8]
    )

    doc.add_heading('Investimento Inicial e Financiamento', level=3)
    p = p_text(doc,
        'O investimento pré-operacional de **$121.972** (Y0) cobre a '
        'sede em Jacksonville: equipamentos ($16.325) e intangíveis '
        'incluindo capital de giro de 3 meses ($90.747). Financiamento '
        'via **SBA 7(a) Loan** a 12\u2009% a.a. em 60 parcelas de '
        '**$2.676/mês**, totalizando $160.533 (juros totais de $38.561).')
    add_footnote(doc, p,
        'U.S. Small Business Administration, SBA 7(a) Loan Program — '
        'standard terms for small business financing.')

    table_sub(doc, 'Tabela 5.2b: Parâmetros do Financiamento')
    make_table(doc,
        ['Parâmetro', 'Valor'],
        [
            ['Capital financiado', '$121.972'],
            ['Taxa de juros', '12% a.a.'],
            ['Prazo', '60 meses (5 anos)'],
            ['PMT mensal', '$2.676'],
            ['Amortização anual', '$24.394'],
            ['Juros anuais', '$7.712'],
            ['PMT anual', '$32.107'],
            ['Custo total (juros)', '$38.561'],
        ],
        col_widths=[2.5, 2.0]
    )

    # ================================================================
    # 5.3 ESTIMATIVA DE RECEITAS E CUSTOS
    # ================================================================
    doc.add_heading('5.3. Estimativa de Receitas e Custos', level=2)
    p_text(doc,
        'Receita bruta acumulada de **$7.619.836** em cinco anos, '
        'distribuída em seis linhas de serviço. **Supply Chain** e '
        '**ERP SAP** (33,8\u2009% cada) lideram o faturamento. Nenhuma '
        'linha ultrapassa 35\u2009%, mitigando risco de concentração. '
        'Crescimento alavancado por expansão da equipe (3 para 14 '
        'especialistas), aumento da utilização (75\u2009% para 90\u2009%) '
        'e valorização da hora-especialista.')

    table_sub(doc, 'Tabela 5.3a: Receita Bruta por Serviço (Y1–Y5)')
    make_table(doc,
        ['Serviço', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', '% Total'],
        [
            ['Supply Chain',
             '$177.408', '$336.336', '$603.187', '$603.187', '$854.515', '33,8%'],
            ['ERP SAP',
             '$177.408', '$336.336', '$603.187', '$603.187', '$854.515', '33,8%'],
            ['Gestão Emergencial',
             '$50.688', '$96.096', '$172.339', '$172.339', '$244.147', '9,7%'],
            ['Compliance',
             '$50.688', '$96.096', '$172.339', '$172.339', '$244.147', '9,7%'],
            ['Capacitação Técnica',
             '$50.688', '$96.096', '$172.339', '$172.339', '$244.147', '9,7%'],
            ['Liderança',
             '$43.200', '$47.520', '$52.272', '$57.499', '$63.249', '3,5%'],
            ['**TOTAL**',
             '**$550.080**', '**$1.008.480**', '**$1.775.664**',
             '**$1.780.891**', '**$2.504.721**', '**100%**'],
        ],
        col_widths=[1.2, 0.8, 0.8, 0.8, 0.8, 0.8, 0.6]
    )

    doc.add_heading('Estrutura de Custos Variáveis', level=3)
    p_text(doc,
        '**Custos variáveis** são proporcionais ao volume de projetos. '
        'A margem de contribuição de **78–81\u2009%** confere alta '
        '**alavancagem operacional**: cada dólar incremental de receita '
        'gera $0,78–$0,81 para cobertura de custos fixos e lucro.')

    table_sub(doc, 'Tabela 5.3b: Custos Variáveis por Categoria (Y1–Y5)')
    make_table(doc,
        ['Tipo de Custo', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
        [
            ['Orçamento de Vendas',
             '$22.810', '$43.243', '$77.553', '$77.553', '$109.866'],
            ['Materiais de Treinamento',
             '$6.480', '$7.128', '$7.841', '$8.625', '$9.487'],
            ['Profissionais Comissionados',
             '$17.280', '$19.008', '$20.909', '$23.000', '$25.300'],
            ['Marketing e Ações Socioambientais',
             '$74.261', '$136.145', '$239.715', '$240.420', '$338.137'],
            ['**Total Variável**',
             '**$120.830**', '**$205.524**', '**$346.017**',
             '**$349.598**', '**$482.791**'],
            ['% da Receita',
             '22,0%', '20,4%', '19,5%', '19,6%', '19,3%'],
        ],
        col_widths=[2.0, 0.8, 0.8, 0.8, 0.8, 0.8]
    )

    doc.add_heading('Estrutura de Custos Fixos', level=3)
    p_text(doc,
        '**Custos fixos operacionais** evoluem de $362.990 (Y1) para '
        '$1.208.912 (Y5), acompanhando a expansão de uma para três '
        'localidades. **Pessoal** (salários líquidos) representa a '
        'maior parcela: 66,6\u2009% no Y1, crescendo para 73,1\u2009% no Y5.')

    table_sub(doc, 'Tabela 5.3c: Custos Fixos Operacionais (Y1–Y5)')
    make_table(doc,
        ['Categoria', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
        [
            ['Pessoal (salários líquidos)',
             '$241.850', '$394.112', '$603.731', '$603.731', '$883.892'],
            ['Instalações (aluguel, utilidades, seguros)',
             '$50.100', '$50.100', '$100.200', '$100.200', '$150.300'],
            ['Profissionais e TI',
             '$18.600', '$18.600', '$29.400', '$29.400', '$40.200'],
            ['Viagens e representação',
             '$28.200', '$28.200', '$49.200', '$49.200', '$70.200'],
            ['Outros (escritório, outsourced, associações)',
             '$24.240', '$24.240', '$44.280', '$44.280', '$64.320'],
            ['**Total OpEx**',
             '**$362.990**', '**$515.252**', '**$826.811**',
             '**$826.811**', '**$1.208.912**'],
        ],
        col_widths=[2.0, 0.8, 0.8, 0.8, 0.8, 0.8]
    )

    # ================================================================
    # 5.4 DRE
    # ================================================================
    doc.add_heading('5.4. DRE — Demonstrativo de Resultados', level=2)
    p_text(doc,
        'O EBITDA é positivo desde o Y1 ($66.260), porém o resultado '
        'líquido do primeiro ano é **negativo** (-$13.882) em função dos '
        '**impostos sobre folha** ($44.770) e custos de financiamento '
        '($32.107). A partir do **Y2**, a empresa registra lucro líquido '
        'positivo ($32.135), acelerando até **$261.764** no Y5.')

    table_sub(doc, 'Tabela 5.4a: Demonstrativo de Resultados Projetado (Y0–Y5)')
    make_table(doc,
        ['Item', 'Y0', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
        [
            ['Receita Bruta',
             '—', '$550.080', '$1.008.480', '$1.775.664',
             '$1.780.891', '$2.504.721'],
            ['(-) Custos Variáveis',
             '—', '$120.830', '$205.524', '$346.017',
             '$349.598', '$482.791'],
            ['= Margem Contribuição',
             '—', '$429.250', '$802.956', '$1.429.647',
             '$1.431.294', '$2.021.931'],
            ['(-) Investimentos',
             '$121.972', '—', '$130.472', '—',
             '$130.472', '—'],
            ['(-) Despesas Operacionais',
             '—', '$362.990', '$515.252', '$826.811',
             '$826.811', '$1.208.912'],
            ['= EBITDA',
             '-$121.972', '$66.260', '$157.231', '$602.836',
             '$474.010', '$813.019'],
            ['(-) Depreciação',
             '—', '$3.265', '$3.265', '$8.230',
             '$8.230', '$13.195'],
            ['(-) Amortização (financiamento)',
             '—', '$24.394', '$24.394', '$24.394',
             '$24.394', '$24.394'],
            ['(-) Juros (financiamento)',
             '—', '$7.712', '$7.712', '$7.712',
             '$7.712', '$7.712'],
            ['= EBT (Lucro antes Impostos)',
             '-$121.972', '$30.888', '$121.859', '$562.499',
             '$433.673', '$767.717'],
            ['(-) Impostos sobre Folha',
             '—', '$44.770', '$80.228', '$131.488',
             '$131.488', '$198.648'],
            ['= Lucro antes IR',
             '-$121.972', '-$13.882', '$41.632', '$431.011',
             '$302.185', '$569.069'],
            ['(-) Imposto de Renda',
             '—', '—', '$9.497', '$102.934',
             '$136.891', '$307.305'],
            ['= **Lucro Líquido**',
             '**-$121.972**', '**-$13.882**', '**$32.135**', '**$328.077**',
             '**$165.294**', '**$261.764**'],
        ],
        col_widths=[1.5, 0.6, 0.6, 0.6, 0.7, 0.7, 0.7]
    )

    p = p_text(doc,
        'O **EBITDA** inclui a dedução de investimentos de expansão '
        '(Y0, Y2, Y4), refletindo o impacto das ondas de crescimento. '
        'A margem EBITDA oscila entre **12,0\u2009%** (Y1) e '
        '**32,5\u2009%** (Y5), com redução em Y2 e Y4 pelos '
        'investimentos nas novas localidades.')
    add_footnote(doc, p,
        'IRS Publication 946, How To Depreciate Property — Modified '
        'Accelerated Cost Recovery System (MACRS).')

    doc.add_heading('Margens Operacionais', level=3)

    table_sub(doc, 'Tabela 5.4b: Evolução das Margens Operacionais')
    make_table(doc,
        ['Margem', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
        [
            ['Margem Contribuição', '78,0%', '79,6%', '80,5%',
             '80,4%', '80,7%'],
            ['Margem EBITDA', '12,0%', '15,6%', '33,9%', '26,6%', '32,5%'],
            ['Margem EBT', '5,6%', '12,1%', '31,7%', '24,4%', '30,7%'],
            ['Margem Líquida', '-2,5%', '3,2%', '18,5%', '9,3%', '10,5%'],
        ],
        col_widths=[1.8, 0.9, 0.9, 0.9, 0.9, 0.9]
    )

    p_text(doc,
        '**Lucro líquido acumulado** torna-se positivo no **Y3** '
        '($224.357), marcando a autossuficiência financeira. Ao final '
        'do Y5, o lucro acumulado atinge **$651.415**.')

    table_sub(doc, 'Tabela 5.4c: Lucro Líquido Acumulado (Y0–Y5)')
    make_table(doc,
        ['Item', 'Y0', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
        [
            ['Lucro Líquido',
             '-$121.972', '-$13.882', '$32.135', '$328.077',
             '$165.294', '$261.764'],
            ['**Acumulado**',
             '**-$121.972**', '**-$135.855**', '**-$103.720**',
             '**$224.357**', '**$389.651**', '**$651.415**'],
        ],
        col_widths=[1.3, 0.7, 0.7, 0.7, 0.8, 0.8, 0.8]
    )

    # ================================================================
    # 5.5 INDICADORES DE RETORNO
    # ================================================================
    doc.add_heading('5.5. Indicadores de Retorno', level=2)
    p = p_text(doc,
        'Os indicadores posicionam a Vieira Operations LLC no **quartil '
        'superior** do segmento NAICS 541611. O **NPV de $378.348** '
        '(WACC 12\u2009%) confirma geração de valor substancial. A **IRR '
        'de 64,3\u2009%** supera o WACC em 5,4x, e o **payback descontado '
        'de 3 anos** é igual ao benchmark de referência para small '
        'businesses no setor.')
    add_footnote(doc, p,
        'SBA Office of Advocacy — benchmarks de retorno financeiro '
        'para small businesses no setor de serviços profissionais.')

    table_sub(doc, 'Tabela 5.5a: Indicadores Consolidados de Retorno')
    make_table(doc,
        ['Indicador', 'Valor', 'Benchmark Setor', 'Posição'],
        [
            ['NPV (12%)', '$378.348', '> $0 (viável)', 'Excelente'],
            ['IRR', '64,3%', '> 15% (atrativo)', 'Excelente'],
            ['Payback Descontado', '3 anos', '< 5 anos (bom)', 'Excelente'],
            ['ROI (5 anos)', '170,1%', '> 100% (forte)', 'Excelente'],
            ['Margem Contribuição Média', '80,3%',
             '> 60% (saudável)', 'Excelente'],
            ['CAGR Receita (Y1–Y5)', '46,1%', '> 15% (alto crescimento)',
             'Excepcional'],
            ['Margem EBITDA (Y5)', '32,5%', '> 20% (forte)', 'Excelente'],
            ['Lucro Acumulado 5 anos', '$651.415',
             '> Investimento total', 'Excelente'],
        ],
        col_widths=[1.8, 1.0, 1.5, 1.0]
    )

    check(doc, 'Viabilidade Financeira',
          'NPV positivo de $378.348 com IRR de 64,3% — amplamente acima '
          'do custo de capital de 12%')
    check(doc, 'Retorno Robusto',
          'ROI de 170,1% com payback descontado de 3 anos')
    check(doc, 'Escalabilidade',
          'CAGR de 46,1% com lucro acumulado de $651.415 em 5 anos')

    # ================================================================
    # 5.6 BREAK EVEN POINT
    # ================================================================
    doc.add_heading('5.6. Break Even Point', level=2)
    p_text(doc,
        'O break-even point considera **custos fixos totais** '
        '(operacionais + impostos sobre folha + depreciação + '
        'amortização + juros). No Y1, o BEP ($567.870) supera a '
        'receita ($550.080), resultando em prejuízo líquido. A partir '
        'do **Y2**, a empresa opera acima do BEP com margem de '
        'segurança crescente de **21,4\u2009%** (Y2) a **30,2\u2009%** (Y4).')

    table_sub(doc, 'Tabela 5.6a: Break Even Point por Ano')
    make_table(doc,
        ['Indicador', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
        [
            ['Receita Bruta',
             '$550.080', '$1.008.480', '$1.775.664', '$1.780.891', '$2.504.721'],
            ['Custos Fixos Totais',
             '$443.132', '$630.852', '$998.637', '$998.637', '$1.452.862'],
            ['Margem Contribuição (%)',
             '78,0%', '79,6%', '80,5%', '80,4%', '80,7%'],
            ['**BEP (Receita)**',
             '**$567.870**', '**$792.324**', '**$1.240.336**',
             '**$1.242.556**', '**$1.799.772**'],
            ['Margem de Segurança ($)',
             '-$17.790', '$216.156', '$535.328', '$538.335', '$704.949'],
            ['Margem de Segurança (%)',
             '-3,2%', '21,4%', '30,1%', '30,2%', '28,2%'],
        ],
        col_widths=[1.5, 0.9, 0.9, 0.9, 0.9, 0.9]
    )

    doc.add_heading('Análise de Cenários', level=3)
    p_text(doc,
        'No cenário **otimista** (+15\u2009% receita, -5\u2009% custos), '
        'o Y1 atinge margem de segurança positiva de 14,0\u2009%. No '
        '**pessimista** (-15\u2009% receita, +10\u2009% custos), '
        'o BEP não é atingido no Y1 — equilíbrio desloca-se para o Y2. '
        'Em todos os cenários, a empresa é rentável a partir do Y2.')

    table_sub(doc, 'Tabela 5.6b: Análise de Cenários — Y1')
    make_table(doc,
        ['Cenário', 'Receita Y1', 'Custos Fixos Y1', 'BEP Y1',
         'Resultado Y1'],
        [
            ['Otimista (+15%/-5%)',
             '$632.592', '$421.075', '$539.842', '$72.447'],
            ['Base',
             '$550.080', '$443.132', '$567.870', '-$13.882'],
            ['Pessimista (-15%/+10%)',
             '$467.568', '$487.445', '$624.929', '-$122.742'],
        ],
        col_widths=[1.2, 0.9, 0.9, 0.9, 0.9]
    )

    doc.add_heading('Análise de Sensibilidade', level=3)
    p_text(doc,
        'A variável de **maior impacto** é o número de especialistas: '
        'a perda de um especialista no Y1 (de 3 para 2) reduz o EBITDA '
        'em $143.208, tornando-o fortemente negativo. Cada contratação '
        'adicional gera incremento de $142.833 no EBITDA.')

    table_sub(doc, 'Tabela 5.6c: Análise de Sensibilidade — Impacto no '
              'EBITDA Y1')
    make_table(doc,
        ['Variável', 'Variação', 'EBITDA Base', 'EBITDA Ajustado',
         'Impacto'],
        [
            ['Taxa hora-especialista', '-10%',
             '$66.260', '$23.335', '-$42.925'],
            ['Taxa hora-especialista', '+10%',
             '$66.260', '$109.185', '+$42.925'],
            ['N.º de especialistas', '-1 especialista',
             '$66.260', '-$76.948', '-$143.208'],
            ['N.º de especialistas', '+1 especialista',
             '$66.260', '$209.093', '+$142.833'],
            ['Taxa utilização', '70% (vs 75%)',
             '$66.260', '$37.468', '-$28.792'],
            ['Taxa utilização', '80% (vs 75%)',
             '$66.260', '$94.677', '+$28.417'],
            ['Custos fixos', '+10%',
             '$66.260', '$29.961', '-$36.299'],
            ['Custos fixos', '-10%',
             '$66.260', '$102.559', '+$36.299'],
        ],
        col_widths=[1.3, 1.0, 0.8, 1.0, 0.8]
    )

    # ---- Conclusion box ----
    highlight_box(doc, 'CONCLUSÃO FINANCEIRA: O plano demonstra '
                  'viabilidade robusta com NPV de $378.348 (12%), IRR de '
                  '64,3%, payback de 3 anos e ROI de 170,1%. Apesar do '
                  'prejuízo operacional no Y1 (-$13.882), o EBITDA é '
                  'positivo desde o primeiro ano ($66.260). O lucro '
                  'acumulado atinge $651.415 ao final do Y5.')

    check(doc, 'Viabilidade Comprovada',
          'NPV positivo ($378.348) e IRR (64,3%) muito acima do WACC (12%)')
    check(doc, 'Break-Even no Y2',
          'margem de segurança crescente de 21,4% (Y2) a 30,2% (Y4)')
    check(doc, 'Sensibilidade Controlada',
          'modelo mantém EBITDA positivo com ±10% nas variáveis '
          'críticas, exceto perda de especialista')
    check(doc, 'Autossuficiência no Y3',
          'lucro acumulado positivo no Y3 ($224.357), eliminando '
          'dependência de capital externo')

    separator(doc)
    page_break(doc)
