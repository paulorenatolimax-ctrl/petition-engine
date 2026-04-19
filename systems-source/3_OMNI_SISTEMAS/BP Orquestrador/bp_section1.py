"""Section 1: EXECUTIVE SUMMARY — Expanded for 55-65 page target"""
from generate_bp_v2 import (p_text, bullet, check, num_item, table_sub,
               make_table, separator, page_break, highlight_box,
               add_footnote)


def build_section_1(doc):
  doc.add_heading('1. EXECUTIVE SUMMARY', level=1)
  p_text(doc, 'Esta se\u00e7\u00e3o apresenta a **vis\u00e3o geral do empreendimento**, incluindo a '
      '**oportunidade de neg\u00f3cio**, o **portf\u00f3lio de servi\u00e7os**, a **timeline operacional**, '
      'a **identidade institucional** e o **enquadramento jur\u00eddico** da Vieira Operations LLC.')

  # ---- 1.1 Oportunidade de Negocio ----
  doc.add_heading('1.1. Oportunidade de Neg\u00f3cio', level=2)

  p_text(doc, 'A **Vieira Operations LLC** configura-se como resposta t\u00e9cnica direta \u00e0s '
      '**vulnerabilidades sist\u00eamicas** documentadas nas cadeias de suprimentos industriais '
      'dos Estados Unidos, agravadas pela pandemia de **COVID-19** e por tens\u00f5es '
      'geopol\u00edticas globais que expuseram fragilidades cr\u00edticas.')

  p_text(doc, 'O empreendimento estrutura-se como **S-Corporation** sediada em **Jacksonville, '
      'Florida**, e endere\u00e7a lacunas operacionais identificadas pela **Executive Order 14017** '
      '(America\'s Supply Chains), que destinou mais de **$37 bilh\u00f5es** para fortalecimento '
      'de cadeias produtivas dom\u00e9sticas.')

  p = p_text(doc, 'A pandemia de **COVID-19** revelou que **94% das empresas** Fortune 1000 sofreram '
      'disrup\u00e7\u00f5es significativas em suas cadeias de suprimentos. O custo '
      'estimado dessas disrup\u00e7\u00f5es ultrapassou **$4 trilh\u00f5es** globalmente, criando '
      'demanda urgente por especialistas em **resili\u00eancia operacional**.')
  add_footnote(doc, p, 'Accenture, "Supply Chain Disruption Report," 2021.')

  p = p_text(doc, 'O mercado de serviços profissionais em gest\u00e3o administrativa (**NAICS 541611**) nos Estados '
      'Unidos gerou receita superior a **$300 bilh\u00f5es** em 2023, com taxa de crescimento '
      'anual composta (**CAGR**) de **6,2%** projetada at\u00e9 2028.')
  add_footnote(doc, p, 'U.S. Census Bureau, Service Annual Survey 2023.')

  p_text(doc, 'A regi\u00e3o Sudeste dos EUA concentra **infraestrutura log\u00edstica estrat\u00e9gica**: '
      'o **JAXPORT** (um dos 17 portos estrat\u00e9gicos do Departamento de Defesa), o **Port of '
      'Savannah** (4\u00ba maior porto dos EUA em TEUs) e mais de **2.300 empresas manufatureiras** '
      'na regi\u00e3o metropolitana de Jacksonville.')

  p_text(doc, 'A converg\u00eancia de tr\u00eas megatendencias \u2014 **reshoring acelerado**, '
      '**digitaliza\u00e7\u00e3o industrial** e **regulamenta\u00e7\u00e3o federal** \u2014 cria janela '
      'de oportunidade singular para empresas especializadas em supply chain e opera\u00e7\u00f5es '
      'no Sudeste americano.')

  p = p_text(doc, 'Empresas americanas investiram **$182 bilh\u00f5es** em reshoring apenas em 2023. '
      'Este movimento de relocaliza\u00e7\u00e3o industrial gera demanda direta por servi\u00e7os de '
      '**redesenho log\u00edstico**, **implementa\u00e7\u00e3o de ERP** e **capacita\u00e7\u00e3o de for\u00e7a '
      'de trabalho**.')
  add_footnote(doc, p, 'Reshoring Initiative, Annual Data Report 2023.')

  p_text(doc, 'O fundador, **Everton Rodrigo Vieira**, traz **25 anos de experi\u00eancia** na '
      '**AmBev/AB InBev**, incluindo gest\u00e3o de **R$380 bilh\u00f5es em ativos**, redu\u00e7\u00e3o '
      'documentada de **48% em custos vari\u00e1veis** e implementa\u00e7\u00e3o do **SAP Fiori** com '
      'antecipa\u00e7\u00e3o de **2 anos e 4 meses**.')

  p_text(doc, 'A trajet\u00f3ria do fundador inclui a constru\u00e7\u00e3o de uma **planta de oxig\u00eanio '
      'medicinal** durante a pandemia de COVID-19, demonstrando capacidade de resposta '
      'emergencial e gest\u00e3o de infraestrutura cr\u00edtica sob press\u00e3o \u2014 compet\u00eancias '
      'diretamente transferidas aos servi\u00e7os da empresa.')

  p_text(doc, 'A empresa projeta **receita bruta acumulada** de **$7.619.836** em cinco anos, '
      'com gera\u00e7\u00e3o de **14 empregos diretos** e aproximadamente **62 empregos indiretos** '
      '(multiplicador **EPI 4,43x** para NAICS 5416), totalizando **76 postos de trabalho** '
      'no Sudeste americano.')

  table_sub(doc, 'Tabela 1.1: Indicadores-Chave do Empreendimento')
  make_table(doc,
    ['Indicador', 'Valor', 'Refer\u00eancia'],
    [
      ['Investimento Inicial (Y0)', '$121.972', 'Capital de giro + equipamentos + registro'],
      ['Receita Bruta Acumulada (5 anos)', '$7.619.836', 'Proje\u00e7\u00e3o bottom-up por servi\u00e7o'],
      ['NPV (taxa 12%)', '$378.348', 'Valor presente l\u00edquido descontado'],
      ['IRR', '64,3%', 'Taxa interna de retorno'],
      ['Payback Descontado', '3 anos', 'Recupera\u00e7\u00e3o do investimento'],
      ['Break-Even', 'Y2', 'Margem de seguran\u00e7a 21,4% no Y2'],
      ['Margem de Contribui\u00e7\u00e3o M\u00e9dia', '80,3%', 'Modelo asset-light'],
      ['Empregos Diretos (Y5)', '14', 'Tr\u00eas localidades'],
      ['Empregos Totais (Y5)', '76', 'Multiplicador EPI 4,43x'],
    ],
    col_widths=[2.2, 1.5, 2.3]
  )

  check(doc, 'Investimento Inicial Y0', '$121.972 com break-even projetado para o Y2 de opera\u00e7\u00e3o')
  check(doc, 'NPV (12%)', '$378.348 com IRR de 64,3% e payback descontado de 3 anos')
  check(doc, 'Margem de Contribui\u00e7\u00e3o', '80,3% m\u00e9dia sobre cinco anos de opera\u00e7\u00e3o')
  check(doc, 'Mercado Endere\u00e7\u00e1vel', 'superior a $300 bilh\u00f5es anuais com CAGR de 6,2% at\u00e9 2028')

  # ---- 1.2 Servicos Oferecidos ----
  doc.add_heading('1.2. Servi\u00e7os Oferecidos', level=2)

  p_text(doc, 'A **Vieira Operations LLC** oferece portf\u00f3lio integrado de **seis servi\u00e7os '
      'especializados** que cobrem toda a cadeia de valor da gest\u00e3o operacional industrial, '
      'desde a **otimiza\u00e7\u00e3o de supply chain** at\u00e9 o **desenvolvimento de lideran\u00e7a**.')

  p_text(doc, 'O modelo de servi\u00e7os diferencia-se pela **integra\u00e7\u00e3o sist\u00eamica**: cada servi\u00e7o '
      'complementa os demais, criando **sinergias operacionais** que maximizam o retorno '
      'para o cliente. Esta abordagem reflete a experi\u00eancia do fundador na **AmBev/AB InBev**, '
      'onde a gest\u00e3o integrada foi fator cr\u00edtico de sucesso.')

  table_sub(doc, 'Tabela 1.2a: Portf\u00f3lio de Servi\u00e7os Especializados da Vieira Operations LLC')
  make_table(doc,
    ['#', 'Servi\u00e7o', 'Descri\u00e7\u00e3o', 'P\u00fablico-Alvo'],
    [
      ['1', 'Otimiza\u00e7\u00e3o Avan\u00e7ada de Supply Chain Industrial',
       'Diagn\u00f3stico, redesenho e implementa\u00e7\u00e3o de cadeias de suprimentos resilientes',
       'Manufaturas, log\u00edstica, defesa'],
      ['2', 'Implementa\u00e7\u00e3o de Sistemas ERP (SAP Fiori/S4HANA)',
       'Implanta\u00e7\u00e3o end-to-end de SAP com metodologia acelerada propriet\u00e1ria',
       'Mid-market ($50M-$500M receita)'],
      ['3', 'Gest\u00e3o de Projetos Emergenciais e Infraestrutura Essencial',
       'Resposta r\u00e1pida a crises operacionais com mobiliza\u00e7\u00e3o em 48h',
       'Governos, utilities, sa\u00fade'],
      ['4', 'Conformidade Regulat\u00f3ria Industrial (EPA, OSHA, FDA)',
       'Auditoria, gap analysis e implementa\u00e7\u00e3o de programas de compliance',
       'Ind\u00fastrias reguladas'],
      ['5', 'Capacita\u00e7\u00e3o T\u00e9cnica e Desenvolvimento de For\u00e7a de Trabalho',
       'Programas de certifica\u00e7\u00e3o e upskilling em supply chain e opera\u00e7\u00f5es',
       'Profissionais e corpora\u00e7\u00f5es'],
      ['6', 'Treinamento de Lideran\u00e7a e Gest\u00e3o Empresarial',
       'Desenvolvimento de compet\u00eancias gerenciais baseado em casos reais',
       'Gestores e executivos'],
    ],
    col_widths=[0.3, 1.8, 2.5, 1.5]
  )

  doc.add_heading('Servi\u00e7o 1: Otimiza\u00e7\u00e3o de Supply Chain', level=3)
  p_text(doc, 'O servi\u00e7o de **otimiza\u00e7\u00e3o de supply chain** constitui o carro-chefe da empresa, '
      'representando **33,2%** da receita projetada. A metodologia propriet\u00e1ria combina '
      'diagn\u00f3stico presencial, **modelagem computacional** e implementa\u00e7\u00e3o monitorada, '
      'com resultados document\u00e1veis dentro de **90 dias**.')

  p_text(doc, 'A expertise do fundador em **redu\u00e7\u00e3o de 48% em custos vari\u00e1veis** na AmBev/AB InBev '
      'traduz-se em metodologia replicada e adaptada ao contexto de **PMEs americanas**, '
      'que frequentemente operam com cadeias de suprimentos n\u00e3o otimizadas e dependentes '
      'de fornecedores \u00fanicos.')

  doc.add_heading('Servi\u00e7o 2: Implementa\u00e7\u00e3o ERP SAP', level=3)
  p_text(doc, 'A implementa\u00e7\u00e3o de **SAP Fiori/S4HANA** representa **25,9%** da receita projetada. '
      'O diferencial competitivo reside na **metodologia acelerada** desenvolvida pelo fundador, '
      'que antecipou em **2 anos e 4 meses** o cronograma na AmBev \u2014 resultado raramente '
      'atingido mesmo por empresas de serviços globais.')

  p_text(doc, 'O mercado de implementa\u00e7\u00e3o ERP cresce a **12-15% ao ano** no segmento industrial, '
      'impulsionado pela migra\u00e7\u00e3o obrigat\u00f3ria para **S/4HANA** (deadline SAP 2027). '
      'Esta janela regulat\u00f3ria cria demanda concentrada que favorece implementadores com '
      'experi\u00eancia comprovada em grandes opera\u00e7\u00f5es.')

  doc.add_heading('Servi\u00e7os 3-6: Portf\u00f3lio Complementar', level=3)
  p_text(doc, 'Os servi\u00e7os complementares \u2014 **gest\u00e3o emergencial**, **compliance regulat\u00f3rio**, '
      '**capacita\u00e7\u00e3o t\u00e9cnica** e **treinamento de lideran\u00e7a** \u2014 representam **40,9%** '
      'da receita e cumprem fun\u00e7\u00e3o estrat\u00e9gica dual: geram **recorr\u00eancia** e '
      '**fidelizam** clientes adquiridos via supply chain e ERP.')

  p_text(doc, 'A gest\u00e3o emergencial posiciona a empresa como **parceiro de confian\u00e7a** em '
      'situa\u00e7\u00f5es cr\u00edticas, gerando contratos premium. O compliance regul\u00e1torio (EPA, OSHA, '
      'FDA) endere\u00e7a necessidade permanente das ind\u00fastrias reguladas, criando fluxo de '
      'receita est\u00e1vel e previs\u00edvel ao longo dos anos.')

  table_sub(doc, 'Tabela 1.2b: Proje\u00e7\u00e3o de Receita por Servi\u00e7o (Y1-Y5)')
  make_table(doc,
    ['Servi\u00e7o', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Total 5 Anos'],
    [
      ['Supply Chain', '$177.408', '$336.336', '$603.187', '$603.187', '$854.515', '$2.574.634'],
      ['ERP SAP', '$177.408', '$336.336', '$603.187', '$603.187', '$854.515', '$2.574.634'],
      ['Gest\u00e3o Emergencial', '$50.688', '$96.096', '$172.339', '$172.339', '$244.147', '$735.610'],
      ['Compliance', '$50.688', '$96.096', '$172.339', '$172.339', '$244.147', '$735.610'],
      ['Capacita\u00e7\u00e3o T\u00e9cnica', '$50.688', '$96.096', '$172.339', '$172.339', '$244.147', '$735.610'],
      ['Lideran\u00e7a', '$43.200', '$47.520', '$52.272', '$57.499', '$63.249', '$263.740'],
      ['**TOTAL**', '**$550.080**', '**$1.008.480**', '**$1.775.664**', '**$1.780.891**', '**$2.504.721**', '**$7.619.836**'],
    ],
    col_widths=[1.5, 0.8, 0.8, 0.8, 0.8, 0.8, 1.0]
  )

  p_text(doc, 'A concentra\u00e7\u00e3o de **67,6%** da receita em **Supply Chain e ERP** reflete a '
      'expertise core do fundador e a demanda concentrada do mercado, enquanto os servi\u00e7os '
      'complementares diversificam o risco e constroem recorr\u00eancia ao longo do ciclo '
      'de vida do cliente.')

  # ---- 1.3 Timeline ----
  doc.add_heading('1.3. Timeline do Neg\u00f3cio', level=2)

  p_text(doc, 'A **timeline operacional** segue cronograma de **12 meses** para estabiliza\u00e7\u00e3o, '
      'com in\u00edcio das opera\u00e7\u00f5es comerciais previsto para o **primeiro trimestre de opera\u00e7\u00e3o**. '
      'O modelo de ramp-up progressivo minimiza risco operacional e vincula cada onda de '
      'investimento a marcos de receita verificados.')

  p_text(doc, 'O planejamento segue o modelo recomendado pelo **U.S. Small Business Administration** '
      'para empresas de servi\u00e7os profissionais, com foco em **capital intelectual** como '
      'principal ativo e investimento f\u00edsico concentrado em **infraestrutura tecnol\u00f3gica**.')

  p_text(doc, 'A estrat\u00e9gia de **ramp-up progressivo** minimiza exposi\u00e7\u00e3o financeira ao vincular '
      'cada onda de investimento a marcos de receita verificados. A abertura de novas localidades '
      'ocorre apenas ap\u00f3s a sede atingir **taxa de utiliza\u00e7\u00e3o de 80%** e pipeline '
      'confirmado na nova regi\u00e3o.')

  table_sub(doc, 'Tabela 1.3a: Timeline de Implementa\u00e7\u00e3o \u2014 Primeiros 12 Meses')
  make_table(doc,
    ['Fase', 'Per\u00edodo', 'Marco', 'Investimento'],
    [
      ['Pr\u00e9-operacional', 'Meses 1-2', 'Registro legal, licen\u00e7as, abertura de contas', '$15.000'],
      ['Setup', 'Meses 3-4', 'Escrit\u00f3rio Jacksonville, equipamentos, software', '$45.000'],
      ['Lan\u00e7amento', 'Meses 5-6', 'Primeiros contratos, marketing inicial', '$30.000'],
      ['Estabiliza\u00e7\u00e3o', 'Meses 7-9', 'Pipeline de 3-5 clientes ativos', '$20.000'],
      ['Crescimento', 'Meses 10-12', 'Contrata\u00e7\u00e3o de 2\u00ba e 3\u00ba especialistas', '$11.700'],
    ],
    col_widths=[1.2, 1.0, 2.8, 1.0]
  )

  p_text(doc, 'A **expans\u00e3o geogr\u00e1fica** segue padr\u00e3o progressivo ao longo do corredor '
      'log\u00edstico **I-95**: **Jacksonville, FL** (sede, Y0-Y1), **Savannah, GA** (branch 1, '
      'Y2-Y3) e **Brunswick, GA** (branch 2, Y5), acompanhando a demanda do mercado.')

  table_sub(doc, 'Tabela 1.3b: Expans\u00e3o Geogr\u00e1fica Planejada')
  make_table(doc,
    ['Localidade', 'Ano', 'Fun\u00e7\u00e3o', 'Empregos Projetados'],
    [
      ['Jacksonville, FL', 'Y0-Y5', 'Sede operacional e administrativa', '8 (Y5)'],
      ['Savannah, GA', 'Y2-Y5', 'Branch regional \u2014 opera\u00e7\u00f5es portu\u00e1rias', '4 (Y5)'],
      ['Brunswick, GA', 'Y5+', 'Branch secund\u00e1ria \u2014 log\u00edstica costeira', '2 (Y5)'],
    ],
    col_widths=[1.5, 0.8, 2.5, 1.2]
  )

  p_text(doc, 'A sele\u00e7\u00e3o das tr\u00eas localidades reflete an\u00e1lise de **densidade industrial**, '
      '**proximidade portu\u00e1ria** e **custo operacional**. Jacksonville concentra 2.300+ '
      'manufaturas; Savannah abriga o 4\u00ba maior porto dos EUA; Brunswick complementa o '
      'corredor com foco em log\u00edstica costeira e servi\u00e7os mar\u00edtimos.')

  check(doc, 'Break-Even', 'projetado para o Y2 do cen\u00e1rio base (Y3 no cen\u00e1rio pessimista)')
  check(doc, 'Expans\u00e3o', '3 localidades estrat\u00e9gicas no corredor I-95 do Sudeste americano')

  # ---- 1.4 Visao Missao Valores ----
  doc.add_heading('1.4. Vis\u00e3o, Miss\u00e3o e Valores', level=2)

  p_text(doc, 'A **Vieira Operations LLC** fundamenta sua identidade institucional em tr\u00eas '
      'pilares estrat\u00e9gicos que orientam todas as decis\u00f5es operacionais e comerciais da '
      'empresa, desde a sele\u00e7\u00e3o de projetos at\u00e9 a forma\u00e7\u00e3o da equipe.')

  doc.add_heading('Vis\u00e3o', level=3)
  p_text(doc, 'Ser reconhecida como **refer\u00eancia em resili\u00eancia operacional** e otimiza\u00e7\u00e3o de '
      'supply chain no **Sudeste dos Estados Unidos**, integrando **expertise brasileira** '
      'de classe mundial com as demandas do mercado americano de manufatura e log\u00edstica. '
      'A vis\u00e3o contempla **lideran\u00e7a regional** at\u00e9 o Ano 5.')

  doc.add_heading('Miss\u00e3o', level=3)
  p_text(doc, 'Entregar solu\u00e7\u00f5es integradas de **excel\u00eancia operacional** que combinem expertise '
      'em **supply chain**, **tecnologia ERP** e **desenvolvimento humano** para gerar impacto '
      'econ\u00f4mico mensur\u00e1vel nas comunidades onde atuamos, com foco em **gera\u00e7\u00e3o de empregos** '
      'e **fortalecimento de cadeias produtivas**.')

  doc.add_heading('Valores Corporativos', level=3)
  p_text(doc, 'Os valores da empresa orientam todas as decis\u00f5es operacionais e comerciais. '
      'A **Excel\u00eancia Operacional** traduz-se em compromisso com resultados mensur\u00e1veis '
      'e melhoria cont\u00ednua, enquanto a **Integridade** garante transpar\u00eancia em todas '
      'as rela\u00e7\u00f5es com clientes, parceiros e comunidade.')
  p_text(doc, 'A **Inova\u00e7\u00e3o Aplicada** manifesta-se na ado\u00e7\u00e3o de tecnologias e metodologias '
      'comprovadas para maximizar valor. A **Responsabilidade Social** materializa-se na '
      'contribui\u00e7\u00e3o ativa para gera\u00e7\u00e3o de empregos e desenvolvimento econ\u00f4mico regional. '
      'A **Colabora\u00e7\u00e3o** sustenta parcerias estrat\u00e9gicas com universidades, associa\u00e7\u00f5es '
      'profissionais e \u00f3rg\u00e3os governamentais locais.')

  # ---- 1.5 Enquadramento Juridico ----
  doc.add_heading('1.5. Enquadramento Jur\u00eddico', level=2)

  p_text(doc, 'A **Vieira Operations LLC** estrutura-se juridicamente como **S-Corporation** '
      'registrada no Estado da **Florida**, escolha que otimiza a carga tribut\u00e1ria e '
      'oferece prote\u00e7\u00e3o patrimonial ao fundador, al\u00e9m de transmitir credibilidade '
      'institucional perante clientes corporativos.')

  p_text(doc, 'A op\u00e7\u00e3o pela estrutura **S-Corp** fundamenta-se em tr\u00eas vantagens competitivas '
      'documentadas pelo **IRS** e pelo **Florida Department of Revenue** para empresas de '
      'servi\u00e7os profissionais com faturamento projetado inferior a **$5 milh\u00f5es anuais**.')

  p_text(doc, 'O regime de **pass-through taxation** da S-Corp elimina a dupla tributa\u00e7\u00e3o '
      'corporativa caracter\u00edstica das C-Corporations, gerando economia estimada de '
      '**15-20%** sobre a carga tribut\u00e1ria total. Esta efici\u00eancia \u00e9 parcialmente '
      'repassada aos clientes via **pricing competitivo**.')

  p_text(doc, 'A estrutura S-Corporation oferece quatro vantagens estrat\u00e9gicas para a opera\u00e7\u00e3o. '
      'O regime de **pass-through taxation** elimina a dupla tributa\u00e7\u00e3o corporativa, '
      'gerando economia estimada de **15-20%** em rela\u00e7\u00e3o a uma C-Corporation. A separa\u00e7\u00e3o '
      'legal entre ativos pessoais e corporativos protege o patrim\u00f4nio do fundador, enquanto '
      'a estrutura transmite **credibilidade institucional** que facilita o acesso a contratos '
      'federais. A flexibilidade na distribui\u00e7\u00e3o de dividendos, sem dupla incid\u00eancia '
      'tribut\u00e1ria, maximiza o retorno l\u00edquido ao propriet\u00e1rio.')

  p_text(doc, 'O processo de constitui\u00e7\u00e3o legal envolve sete etapas sequenciais, '
      'complet\u00e1veis em aproximadamente 90 dias: registro da LLC na Florida Division of '
      'Corporations via Sunbiz.org ($125); elei\u00e7\u00e3o S-Corp junto ao IRS (Form 2553, 60-90 '
      'dias); obten\u00e7\u00e3o do EIN online (1 dia); registro de nome comercial no condado de '
      'Duval ($50); abertura de conta empresarial; obten\u00e7\u00e3o do Business Tax Receipt no '
      'Condado de Duval ($50); e contrata\u00e7\u00e3o de seguro profissional \u2014 Professional '
      'Liability e General Liability \u2014 ao custo de $2.400/ano.')

  p_text(doc, 'A empresa manter\u00e1 conformidade com regulamenta\u00e7\u00f5es federais (**OSHA, EPA, FDA**) '
      'e estaduais aplic\u00e1veis ao setor de serviços profissionais, al\u00e9m de certifica\u00e7\u00f5es profissionais '
      'relevantes como **SAP Certified** e membro da **APICS/ASCM**.')

  check(doc, 'Estrutura Jur\u00eddica', 'S-Corporation otimizada para servi\u00e7os profissionais com '
      'prote\u00e7\u00e3o patrimonial e efici\u00eancia tribut\u00e1ria')
  check(doc, 'Conformidade', 'framework regulat\u00f3rio completo cobrindo OSHA, EPA, FDA e '
      'certifica\u00e7\u00f5es profissionais SAP e APICS')

  separator(doc)
  page_break(doc)
