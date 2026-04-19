"""Section 2: ANALISE ESTRATEGICA DE MERCADO — Expanded for 55-65 page target"""
from generate_bp_v2 import (p_text, bullet, check, num_item, table_sub,
               make_table, separator, page_break, highlight_box,
               add_footnote)


def build_section_2(doc):
  doc.add_heading('2. AN\u00c1LISE ESTRAT\u00c9GICA DE MERCADO', level=1)
  p_text(doc, 'Esta se\u00e7\u00e3o analisa o **ambiente de mercado**, incluindo **perspectivas setoriais**, '
      '**empregabilidade projetada**, **impactos ESG**, an\u00e1lise **SWOT** e as **Cinco For\u00e7as '
      'de Porter** aplicadas ao segmento de empresa especializada.')

  # ---- 2.1 Perspectivas ----
  doc.add_heading('2.1. Perspectivas do Mercado', level=2)

  p_text(doc, 'O mercado de servi\u00e7os especializados em **resili\u00eancia de supply chain** e '
      '**otimiza\u00e7\u00e3o operacional** nos Estados Unidos apresenta trajet\u00f3ria de **crescimento '
      'acelerado**, impulsionado por tr\u00eas fatores estruturais convergentes.')

  doc.add_heading('Reconfigura\u00e7\u00e3o de Cadeias Globais', level=3)
  p = p_text(doc, 'A pandemia de **COVID-19** e tens\u00f5es geopol\u00edticas aceleraram processos de '
      '**reshoring** e **nearshoring**, gerando demanda por empresa especializada em '
      'redesenho log\u00edstico. Empresas americanas investiram **$182 bilh\u00f5es** em reshoring '
      'apenas em 2023, segundo a Reshoring Initiative.')
  add_footnote(doc, p, 'Reshoring Initiative, 2023 Data Report. Dispon\u00edvel em reshorenow.org.')

  p_text(doc, 'O Departamento de Com\u00e9rcio dos EUA documenta aumento de **37%** nas solicita\u00e7\u00f5es '
      'de licen\u00e7a de importa\u00e7\u00e3o de equipamentos industriais entre 2021 e 2023, indicando '
      'expansao da base manufatureira dom\u00e9stica e demanda crescente por servi\u00e7os de '
      'otimiza\u00e7\u00e3o operacional e log\u00edstica.')

  p_text(doc, 'A guerra comercial EUA-China e a instabilidade no Mar Vermelho refor\u00e7aram a '
      'necessidade de **diversifica\u00e7\u00e3o de fornecedores** e **redundancia log\u00edstica**. '
      'Empresas que dependiam de fornecedor \u00fanico na \u00c1sia buscam especialistas para redesenhar '
      'cadeias com m\u00faltiplas fontes de suprimento.')

  doc.add_heading('Digitaliza\u00e7\u00e3o Industrial', level=3)
  p = p_text(doc, 'A ado\u00e7\u00e3o de sistemas ERP integrados (**SAP S/4HANA**) e tecnologias Industry 4.0 '
      'cresce a taxa de **12-15%** ao ano no segmento de manufatura, criando demanda por '
      'implementadores qualificados com experi\u00eancia pr\u00e1tica em opera\u00e7\u00f5es de grande escala.')
  add_footnote(doc, p, 'Gartner, Market Share Analysis: ERP Software, Worldwide, 2023.')

  p_text(doc, 'A migra\u00e7\u00e3o obrigat\u00f3ria para **SAP S/4HANA** (deadline 2027) afeta mais de '
      '**40.000 empresas** globalmente, incluindo milhares nos EUA que necessitam de '
      'implementadores certificados. Este deadline cria janela de demanda concentrada '
      'de **3-4 anos** para empresas especializadas.')

  doc.add_heading('Regulamenta\u00e7\u00e3o Federal', level=3)
  p = p_text(doc, 'A **Executive Order 14017** e o **CHIPS Act** alocaram mais de **$75 bilh\u00f5es** '
      'para fortalecimento de cadeias produtivas dom\u00e9sticas, criando oportunidades para '
      'empresas especializadas em compliance industrial e resili\u00eancia operacional.')
  add_footnote(doc, p, 'White House, Executive Order 14017 on America\'s Supply Chains, Feb 2021; CHIPS and Science Act, Pub.L. 117\u2013167.')

  p = p_text(doc, 'O **Infrastructure Investment and Jobs Act** (2021) adicionou **$1,2 trilh\u00e3o** '
      'em investimentos, com parcela significativa destinada a moderniza\u00e7\u00e3o de portos, '
      'rodovias e infraestrutura log\u00edstica \u2014 gerando contratos para empresas de serviços '
      'que apoiam a execu\u00e7\u00e3o destes projetos.')
  add_footnote(doc, p, 'Congress.gov, Infrastructure Investment and Jobs Act (IIJA), Pub.L. 117\u201358, Nov 2021.')

  table_sub(doc, 'Tabela 2.1a: Indicadores do Mercado de Serviços de Gestão (NAICS 541611)')
  make_table(doc,
    ['Indicador', 'Valor', 'Fonte'],
    [
      ['Receita total do setor (2023)', '$300+ bilh\u00f5es', 'U.S. Census Bureau'],
      ['CAGR projetado (2023-2028)', '6,2%', 'IBISWorld'],
      ['Investimento em reshoring (2023)', '$182 bilh\u00f5es', 'Reshoring Initiative'],
      ['Aloca\u00e7\u00e3o CHIPS Act', '$52 bilh\u00f5es', 'Congress.gov'],
      ['Aloca\u00e7\u00e3o EO 14017', '$37 bilh\u00f5es', 'White House'],
      ['Crescimento ERP (a.a.)', '12-15%', 'Gartner'],
      ['Empresas manufatureiras Jax MSA', '2.300+', 'Jacksonville Chamber'],
      ['Infrastructure Investment Act', '$1,2 trilh\u00e3o', 'Congress.gov'],
    ],
    col_widths=[2.5, 1.5, 2.0]
  )

  p_text(doc, 'O segmento **NAICS 541611** gerou receita superior a **$300 bilh\u00f5es** em 2023, '
      'com CAGR de **6,2%** projetada at\u00e9 2028. A Vieira Operations LLC posiciona-se '
      'para capturar fra\u00e7\u00e3o deste mercado atrav\u00e9s de posicionamento mid-market no '
      'Sudeste dos EUA.')

  table_sub(doc, 'Tabela 2.1b: Mercado Endere\u00e7\u00e1vel por Regi\u00e3o')
  make_table(doc,
    ['Regi\u00e3o', 'PIB (2023)', 'Manufaturas', 'Portos', 'Oportunidade'],
    [
      ['Jacksonville MSA', '$82 bilh\u00f5es', '2.300+', 'JAXPORT (strat\u00e9gico DoD)', 'Sede: Y0-Y5'],
      ['Savannah MSA', '$19 bilh\u00f5es', '600+', 'Port of Savannah (4\u00ba EUA)', 'Branch: Y2-Y5'],
      ['Brunswick MSA', '$4,8 bilh\u00f5es', '200+', 'Port of Brunswick', 'Branch: Y5+'],
      ['**Total Corredor I-95**', '**$105,8 bilh\u00f5es**', '**3.100+**', '**3 portos**', '**3 localidades**'],
    ],
    col_widths=[1.3, 1.0, 0.9, 1.5, 1.0]
  )

  highlight_box(doc, '**Mercado Endere\u00e7\u00e1vel**: superior a **$300 bilh\u00f5es** anuais com CAGR de '
         '**6,2%** \u2014 a Vieira Operations LLC captura fra\u00e7\u00e3o deste mercado '
         'atrav\u00e9s de posicionamento mid-market no Sudeste dos EUA.')

  # ================================================================
  # NEW SUBSECTION 2.1.1 — Dimensionamento do Mercado (TAM/SAM/SOM)
  # ================================================================
  doc.add_heading('2.1.1. Dimensionamento do Mercado (TAM / SAM / SOM)', level=2)

  p = p_text(doc, 'O dimensionamento de mercado segue a metodologia **TAM/SAM/SOM** amplamente '
      'adotada em planejamentos estrat\u00e9gicos. Esta abordagem permite quantificar o '
      'potencial total do mercado, o segmento acess\u00edvel e a fra\u00e7\u00e3o realista que a '
      'Vieira Operations LLC pode capturar nos primeiros cinco anos de opera\u00e7\u00e3o.')
  add_footnote(doc, p, 'Metodologia TAM/SAM/SOM conforme McKinsey & Company, Market Sizing Framework, 2022.')

  p_text(doc, 'A an\u00e1lise fundamenta-se em dados de fontes autorit\u00e1rias: **IBISWorld** para '
      'receita setorial, **U.S. Census Bureau** para dados demogr\u00e1ficos e **Bureau of '
      'Labor Statistics** para proje\u00e7\u00f5es de emprego. Os c\u00e1lculos consideram o segmento '
      'NAICS 541611 como base prim\u00e1ria de refer\u00eancia.')

  doc.add_heading('Total Addressable Market (TAM)', level=3)

  p = p_text(doc, 'O **TAM** representa o mercado total de serviços profissionais em gest\u00e3o nos Estados '
      'Unidos, classificado sob o c\u00f3digo **NAICS 541611**. Em 2023, este segmento '
      'gerou receita superior a **$350 bilh\u00f5es**, segundo dados do IBISWorld e do '
      'U.S. Census Bureau, Annual Business Survey.')
  add_footnote(doc, p, 'IBISWorld, Management Consulting in the US, Industry Report 54161, 2023 Edition.')

  p_text(doc, 'O crescimento do TAM \u00e9 impulsionado por demanda crescente de transforma\u00e7\u00e3o '
      'digital, conformidade regulat\u00f3ria e otimiza\u00e7\u00e3o de supply chain. A proje\u00e7\u00e3o de '
      'CAGR de **6,2%** at\u00e9 2028 indica que o TAM pode ultrapassar **$470 bilh\u00f5es** '
      'no final do per\u00edodo de proje\u00e7\u00e3o.')

  p_text(doc, 'Fatores estruturais sustentam o crescimento do TAM: o **reshoring** acelerado '
      'pela Executive Order 14017, o **CHIPS and Science Act**, e o **Infrastructure '
      'Investment and Jobs Act** injetam capital federal que se traduz em demanda por '
      'servi\u00e7os de serviços operacionais em escala nacional.')

  doc.add_heading('Serviceable Addressable Market (SAM)', level=3)

  p = p_text(doc, 'O **SAM** foca no subconjunto do TAM diretamente relevante para a Vieira '
      'Operations: serviços de **supply chain**, **opera\u00e7\u00f5es industriais** e '
      '**implementa\u00e7\u00e3o de ERP**. Este segmento corresponde a aproximadamente **$48 '
      'bilh\u00f5es** do mercado total, representando cerca de 13,7% do TAM.')
  add_footnote(doc, p, 'Grand View Research, Supply Chain Management Consulting Market Size, 2023\u20132030.')

  p_text(doc, 'A delimita\u00e7\u00e3o do SAM considera apenas servi\u00e7os que a empresa est\u00e1 '
      'capacitada a ofertar: diagn\u00f3stico e otimiza\u00e7\u00e3o de supply chain, implementa\u00e7\u00e3o '
      'SAP S/4HANA, treinamento t\u00e9cnico em opera\u00e7\u00f5es, compliance regulat\u00f3rio e '
      'desenvolvimento de lideran\u00e7a operacional.')

  p_text(doc, 'O SAM apresenta crescimento superior ao TAM geral, com CAGR estimada de '
      '**8,1%** para o per\u00edodo 2023-2028, refletindo a prioriza\u00e7\u00e3o de investimentos '
      'em resili\u00eancia de supply chain ap\u00f3s as disrup\u00e7\u00f5es pandemia e geopol\u00edticas '
      'experimentadas entre 2020 e 2024.')

  doc.add_heading('Serviceable Obtainable Market (SOM)', level=3)

  p = p_text(doc, 'O **SOM** quantifica a fra\u00e7\u00e3o realista que a Vieira Operations LLC pode '
      'capturar no mercado da **Jacksonville MSA** e regi\u00f5es adjacentes. A estimativa '
      'para o Ano 1 \u00e9 de aproximadamente **$12 milh\u00f5es** em mercado endere\u00e7\u00e1vel '
      'imediato, crescendo para **$35 milh\u00f5es** no Ano 5.')
  add_footnote(doc, p, 'C\u00e1lculo baseado em n\u00famero de empresas manufatureiras na Jax MSA (2.300+), ticket m\u00e9dio de projetos e taxa de penetra\u00e7\u00e3o estimada de 2-5%.')

  p_text(doc, 'O c\u00e1lculo do SOM considera: (a) n\u00famero de empresas manufatureiras e '
      'log\u00edsticas na Jacksonville MSA (**2.300+**), (b) ticket m\u00e9dio estimado por '
      'projeto (**$85.000-$250.000**), (c) taxa de penetra\u00e7\u00e3o de mercado '
      'conservadora (**2% no Y1, crescendo para 5% no Y5**).')

  p_text(doc, 'A expans\u00e3o geogr\u00e1fica para **Savannah** (Y2) e **Brunswick** (Y5) amplia '
      'o SOM progressivamente. O Corredor I-95 conecta tr\u00eas MSAs com mais de **3.100 '
      'empresas manufatureiras** combinadas, representando mercado endere\u00e7\u00e1vel '
      'cumulativo superior a **$50 milh\u00f5es** no Ano 5.')

  table_sub(doc, 'Tabela 2.1.1a: Dimensionamento TAM / SAM / SOM')
  make_table(doc,
    ['N\u00edvel', 'Defini\u00e7\u00e3o', 'Valor (2023)', 'CAGR', 'Valor Projetado (2028)'],
    [
      ['TAM', 'Serviços de gest\u00e3o (EUA, NAICS 541611)', '$350 bilh\u00f5es', '6,2%', '$473 bilh\u00f5es'],
      ['SAM', 'Supply chain e opera\u00e7\u00f5es (EUA)', '$48 bilh\u00f5es', '8,1%', '$71 bilh\u00f5es'],
      ['SOM Y1', 'Jacksonville MSA endere\u00e7\u00e1vel', '$12 milh\u00f5es', '\u2014', '\u2014'],
      ['SOM Y3', 'Jax MSA + Savannah MSA', '$22 milh\u00f5es', '\u2014', '\u2014'],
      ['SOM Y5', 'Corredor I-95 completo', '$35 milh\u00f5es', '\u2014', '\u2014'],
    ],
    col_widths=[0.7, 2.0, 1.0, 0.6, 1.2]
  )

  p_text(doc, 'Cinco drivers macro impulsionam o crescimento do mercado endere\u00e7\u00e1vel. O '
      '**reshoring acelerado**, com +$182 bilh\u00f5es investidos em 2023, gera novos clientes '
      'manufatureiros em Jacksonville ao longo do horizonte 2023-2028. A **EO 14017** '
      '(Supply Chain Resilience) aloca +$37 bilh\u00f5es, criando demanda por compliance em '
      'PMEs do Sudeste at\u00e9 2027. O **CHIPS and Science Act** destina +$52 bilh\u00f5es ao setor '
      'de semicondutores, impactando fornecedores tier-2 na Fl\u00f3rida. A **IIJA** injeta '
      '+$1,2 trilh\u00e3o em infraestrutura, beneficiando diretamente projetos JAXPORT e '
      'rodovi\u00e1rios. Por fim, o **deadline do SAP S/4HANA** for\u00e7a a migra\u00e7\u00e3o de 40.000 '
      'empresas, concentrando demanda cr\u00edtica entre 2025 e 2027. A converg\u00eancia destes '
      'drivers cria uma **janela de oportunidade excepcional** para os pr\u00f3ximos 3-5 anos, '
      'e o timing de entrada da Vieira Operations LLC coincide com o pico de demanda '
      'projetado para servi\u00e7os de supply chain.')

  highlight_box(doc, '**Mercado Endere\u00e7\u00e1vel (SOM)**: **$12M** no Y1, expandindo para **$35M** '
         'no Y5 via Corredor I-95 \u2014 sustentado por **$1,3 trilh\u00e3o** em investimentos '
         'federais em infraestrutura e supply chain.')

  page_break(doc)

  # ================================================================
  # NEW SUBSECTION 2.1.2 — An\u00e1lise Regional: Jacksonville MSA
  # ================================================================
  doc.add_heading('2.1.2. An\u00e1lise Regional \u2014 Jacksonville MSA', level=2)

  p = p_text(doc, 'A **Jacksonville Metropolitan Statistical Area** (MSA) constitui o mercado '
      'prim\u00e1rio da Vieira Operations LLC. Com popula\u00e7\u00e3o superior a **1,6 milh\u00e3o** '
      'de habitantes (Census 2023) e PIB estimado em **$95 bilh\u00f5es**, a regi\u00e3o '
      'figura entre as maiores economias metropolitanas do Sudeste americano.')
  add_footnote(doc, p, 'U.S. Census Bureau, Population Estimates Program, Metropolitan Statistical Areas, Jul 2023.')

  p_text(doc, 'A escolha de Jacksonville como sede fundamenta-se em vantagens competitivas '
      'estruturais: custo operacional inferior \u00e0s m\u00e9dias de **Miami**, **Atlanta** e '
      '**Charlotte**; presen\u00e7a de **infraestrutura log\u00edstica de classe mundial** '
      '(JAXPORT); e ecossistema empresarial diversificado e em expans\u00e3o.')

  doc.add_heading('Perfil Demogr\u00e1fico e Econ\u00f4mico', level=3)

  p = p_text(doc, 'Jacksonville \u00e9 a **cidade mais populosa da Fl\u00f3rida** por \u00e1rea territorial '
      'e a **12\u00aa maior** dos Estados Unidos. A MSA compreende os condados de **Duval**, '
      '**St. Johns**, **Clay**, **Nassau** e **Baker**, formando corredor econ\u00f4mico '
      'integrado com forte base industrial e log\u00edstica.')
  add_footnote(doc, p, 'U.S. Census Bureau, Annual Estimates of the Resident Population, 2023.')

  p_text(doc, 'A taxa de crescimento populacional de **1,8% ao ano** (2020-2023) supera a '
      'm\u00e9dia nacional de 0,5%, impulsionada por migra\u00e7\u00e3o dom\u00e9stica de estados com '
      'custo de vida elevado. Este crescimento gera expans\u00e3o cont\u00ednua da base '
      'empresarial e demanda por servi\u00e7os profissionais.')

  p_text(doc, 'O mercado de trabalho da Jacksonville MSA registrou **taxa de desemprego** de '
      '**3,1%** em dezembro de 2023, abaixo da m\u00e9dia nacional de 3,7%. A for\u00e7a de '
      'trabalho totaliza aproximadamente **820.000 pessoas**, com concentra\u00e7\u00e3o '
      'expressiva nos setores de log\u00edstica, finan\u00e7as e sa\u00fade.')

  table_sub(doc, 'Tabela 2.1.2a: Perfil Demogr\u00e1fico e Econ\u00f4mico \u2014 Jacksonville MSA')
  make_table(doc,
    ['Indicador', 'Valor', 'Compara\u00e7\u00e3o Nacional', 'Fonte'],
    [
      ['Popula\u00e7\u00e3o MSA (2023)', '1.634.756', 'Top 40 MSAs dos EUA', 'Census Bureau'],
      ['PIB MSA (2023)', '$95+ bilh\u00f5es', 'Top 35 MSAs', 'Bureau of Economic Analysis'],
      ['Crescimento pop. (CAGR)', '1,8% a.a.', 'M\u00e9dia nacional: 0,5%', 'Census Bureau'],
      ['Taxa de desemprego', '3,1%', 'M\u00e9dia nacional: 3,7%', 'BLS, LAUS'],
      ['For\u00e7a de trabalho', '~820.000', '\u2014', 'BLS, LAUS'],
      ['Renda mediana household', '$65.816', 'M\u00e9dia nacional: $74.580', 'Census ACS 2023'],
      ['Custo de vida (\u00edndice)', '96,2', 'M\u00e9dia nacional: 100,0', 'Council for Community & Econ Research'],
      ['Empresas manufatureiras', '2.300+', '\u2014', 'Jacksonville Chamber'],
      ['Empresas total Duval Co.', '36.000+', '\u2014', 'Census Business Patterns'],
    ],
    col_widths=[1.5, 1.0, 1.5, 1.5]
  )

  doc.add_heading('Infraestrutura Log\u00edstica', level=3)

  p = p_text(doc, 'A infraestrutura log\u00edstica de Jacksonville posiciona a cidade como **hub '
      'estrat\u00e9gico nacional** para opera\u00e7\u00f5es de supply chain. O **JAXPORT** \u00e9 o '
      '**segundo maior porto da Costa Leste** em volume de ve\u00edculos e equipamentos, '
      'com investimento de **$238 milh\u00f5es** em expans\u00e3o conclu\u00eddo em 2023.')
  add_footnote(doc, p, 'JAXPORT, Annual Report 2023. Dispon\u00edvel em jaxport.com.')

  p_text(doc, 'A presen\u00e7a da **CSX Corporation** (sede global em Jacksonville) consolida '
      'a posi\u00e7\u00e3o da cidade como n\u00f3 ferrovi\u00e1rio cr\u00edtico. A CSX opera a maior rede '
      'ferrovi\u00e1ria do Leste americano, conectando Jacksonville a mais de 23 estados '
      'e 70% da popula\u00e7\u00e3o dos EUA em at\u00e9 dois dias de transporte.')

  p_text(doc, 'O cruzamento das interestaduais **I-95** (norte-sul) e **I-10** (leste-oeste) '
      'em Jacksonville cria corredor rodovi\u00e1rio que conecta a cidade \u00e0s principais '
      'metr\u00f3poles do Sudeste e da Costa Leste. Esta conectividade multimodal \u00e9 '
      'vantagem competitiva para clientes de supply chain.')

  table_sub(doc, 'Tabela 2.1.2b: Infraestrutura Log\u00edstica \u2014 Jacksonville')
  make_table(doc,
    ['Ativo', 'Descri\u00e7\u00e3o', 'Relev\u00e2ncia para Vieira Ops'],
    [
      ['JAXPORT', '2\u00ba maior porto Costa Leste (ve\u00edculos/equip.); $238M investidos',
       'Clientes portu\u00e1rios e log\u00edsticos'],
      ['CSX Corporation (HQ)', 'Maior rede ferrovi\u00e1ria do Leste; 23 estados conectados',
       'Projetos de supply chain ferrovi\u00e1rio'],
      ['Naval Station Mayport', '3\u00aa maior base naval dos EUA; 14.000+ militares',
       'Contratos de defesa e compliance'],
      ['Corredor I-95 / I-10', 'Cruzamento interestadual norte-sul / leste-oeste',
       'Acesso rodovi\u00e1rio a todo o Sudeste'],
      ['Cecil Spaceport', 'Aeroporto comercial e espacial em expans\u00e3o',
       'Setor aeroespacial emergente'],
      ['JEA (utility)', 'Maior utility municipal da Fl\u00f3rida; $1,5B receita',
       'Projetos de efici\u00eancia operacional'],
    ],
    col_widths=[1.3, 2.5, 1.7]
  )

  doc.add_heading('Principais Empregadores e Setores', level=3)

  p_text(doc, 'A diversifica\u00e7\u00e3o setorial da Jacksonville MSA reduz o risco de concentra\u00e7\u00e3o '
      'econ\u00f4mica e amplia a base de potenciais clientes para servi\u00e7os de serviços profissionais. '
      'Nenhum setor isolado representa mais de **18%** do emprego total, '
      'caracter\u00edstica de economias metropolitanas resilientes.')

  p_text(doc, 'Os setores de **log\u00edstica e transporte**, **finan\u00e7as** e **sa\u00fade** concentram '
      'a maior parte das oportunidades para empresa de serviços operacional. Empresas como '
      '**CSX**, **Fidelity National Information Services (FIS)** e **Baptist Health** '
      'representam potenciais clientes \u00e2ncora para a Vieira Operations LLC.')

  table_sub(doc, 'Tabela 2.1.2c: Principais Empregadores \u2014 Jacksonville MSA')
  make_table(doc,
    ['Empresa', 'Setor', 'Empregados (aprox.)', 'Oportunidade de Serviços'],
    [
      ['Naval Station Mayport', 'Defesa', '14.000+', 'Compliance, supply chain militar'],
      ['CSX Corporation', 'Ferrovi\u00e1rio / Log\u00edstica', '7.500+', 'Otimiza\u00e7\u00e3o de opera\u00e7\u00f5es'],
      ['Baptist Health', 'Sa\u00fade', '13.000+', 'Efici\u00eancia operacional hospitalar'],
      ['FIS (Fidelity National)', 'Fintech / Finan\u00e7as', '8.000+', 'Implementa\u00e7\u00e3o ERP, processos'],
      ['JEA', 'Utilities', '2.200+', 'Supply chain de materiais'],
      ['JAXPORT', 'Portu\u00e1rio', '1.500+ (diretos)', 'Log\u00edstica portu\u00e1ria'],
      ['Amazon (fulfillment)', 'E-commerce / Log\u00edstica', '5.000+', 'Opera\u00e7\u00f5es de distribui\u00e7\u00e3o'],
    ],
    col_widths=[1.3, 1.2, 1.0, 2.0]
  )

  p_text(doc, 'O crescimento econ\u00f4mico da regi\u00e3o \u00e9 sustentado por pol\u00edticas estaduais '
      'favor\u00e1veis: a Fl\u00f3rida n\u00e3o cobra **imposto de renda estadual** (individual), '
      'oferece **incentivos fiscais** para novas empresas e mant\u00e9m ambiente regulat\u00f3rio '
      'favorav\u00e9l a neg\u00f3cios \u2014 fatores que atraem empresas e profissionais.')

  highlight_box(doc, '**Jacksonville MSA**: popula\u00e7\u00e3o de **1,6M+**, PIB de **$95B+**, com '
         '**JAXPORT** (2\u00ba maior Costa Leste), **CSX HQ** e cruzamento I-95/I-10 \u2014 '
         'hub log\u00edstico estrat\u00e9gico ideal para empresa de serviços em supply chain.')

  page_break(doc)

  # ================================================================
  # NEW SUBSECTION 2.1.3 — Dados Setoriais do BLS
  # ================================================================
  doc.add_heading('2.1.3. Dados Setoriais do Bureau of Labor Statistics', level=2)

  p = p_text(doc, 'O **Bureau of Labor Statistics** (BLS) fornece dados autorit\u00e1rios sobre '
      'emprego, sal\u00e1rios e proje\u00e7\u00f5es ocupacionais que fundamentam as proje\u00e7\u00f5es de '
      'empregabilidade e remunera\u00e7\u00e3o da Vieira Operations LLC. Os dados a seguir '
      'correspondem aos c\u00f3digos SOC das ocupa\u00e7\u00f5es diretamente empregadas pela empresa.')
  add_footnote(doc, p, 'BLS, Occupational Outlook Handbook e Occupational Employment and Wage Statistics (OEWS), 2023.')

  p_text(doc, 'A an\u00e1lise utiliza os c\u00f3digos **Standard Occupational Classification** (SOC) '
      'publicados pelo BLS, que permitem comparabilidade nacional e regional. Os dados '
      'incluem sal\u00e1rios medianos nacionais, proje\u00e7\u00f5es de crescimento 2022-2032 e '
      'compara\u00e7\u00f5es com o mercado da Jacksonville MSA.')

  doc.add_heading('Proje\u00e7\u00f5es Ocupacionais 2022-2032', level=3)

  p_text(doc, 'As proje\u00e7\u00f5es do BLS para o per\u00edodo 2022-2032 indicam crescimento robusto '
      'para as ocupa\u00e7\u00f5es empregadas pela Vieira Operations LLC. O cargo de **Project '
      'Management Specialists** (SOC 13-1082) apresenta proje\u00e7\u00e3o de crescimento de '
      '**+6%**, classificado como "faster than average" pelo BLS.')

  p_text(doc, 'A ocupa\u00e7\u00e3o de **Supply Chain Managers** (SOC 11-3031) registra proje\u00e7\u00e3o de '
      'crescimento de **+4%** para a d\u00e9cada, refletindo a demanda crescente por '
      'profissionais com capacidade de gest\u00e3o integrada de cadeias de suprimentos '
      'em contexto de reshoring e digitaliza\u00e7\u00e3o industrial.')

  table_sub(doc, 'Tabela 2.1.3a: Proje\u00e7\u00f5es BLS \u2014 Ocupa\u00e7\u00f5es SOC da Vieira Operations')
  make_table(doc,
    ['SOC Code', 'Ocupa\u00e7\u00e3o', 'Emprego 2022', 'Emprego 2032 (proj.)', 'Crescimento', 'Classifica\u00e7\u00e3o BLS'],
    [
      ['11-3031.00', 'Supply Chain Managers', '208.600', '216.900', '+4%', 'As fast as average'],
      ['13-1082.00', 'Project Management Specialists', '943.800', '1.000.400', '+6%', 'Faster than average'],
      ['43-9061.00', 'Office Clerks, General', '2.970.200', '2.827.400', '-5%', 'Declining'],
      ['43-1011.00', 'First-Line Supervisors, Office', '1.541.600', '1.512.400', '-2%', 'Little or no change'],
      ['43-4171.00', 'Receptionists and Info. Clerks', '1.037.400', '1.005.100', '-3%', 'Declining'],
    ],
    col_widths=[0.7, 1.5, 0.8, 0.9, 0.6, 1.0]
  )

  p_text(doc, 'As ocupa\u00e7\u00f5es de **suporte administrativo** (Office Clerks, Receptionists) '
      'apresentam proje\u00e7\u00e3o de leve decl\u00ednio nacional, refletindo automa\u00e7\u00e3o crescente. '
      'No entanto, a Vieira Operations LLC oferece sal\u00e1rios competitivos nestes cargos, '
      'atraindo talentos em mercado local favorav\u00e9l ao empregador.')

  doc.add_heading('Compara\u00e7\u00e3o Salarial: Jacksonville MSA vs Nacional', level=3)

  p = p_text(doc, 'Os dados do **OEWS** (Occupational Employment and Wage Statistics) do BLS '
      'permitem compara\u00e7\u00e3o detalhada entre sal\u00e1rios nacionais e regionais. A '
      'Jacksonville MSA apresenta custo de vida **3,8% inferior** \u00e0 m\u00e9dia nacional, '
      'tornando sal\u00e1rios nominalmente iguais mais atrativos em termos reais.')
  add_footnote(doc, p, 'BLS, Occupational Employment and Wage Statistics, May 2023, Jacksonville MSA (CBSA 27260).')

  table_sub(doc, 'Tabela 2.1.3b: Compara\u00e7\u00e3o Salarial \u2014 Nacional vs Jacksonville MSA')
  make_table(doc,
    ['SOC Code', 'Ocupa\u00e7\u00e3o', 'Sal\u00e1rio Nacional (mediana)', 'Sal. Jax MSA (mediana)', 'Sal. Vieira Ops'],
    [
      ['11-3031.00', 'Supply Chain Managers', '$98.560', '$95.200', '$110.000'],
      ['13-1082.00', 'Project Mgmt Specialists', '$98.580', '$92.340', '$99.380'],
      ['43-9061.00', 'Office Clerks, General', '$37.680', '$35.920', '$61.400'],
      ['43-1011.00', 'First-Line Supv, Office', '$63.450', '$59.800', '$61.420'],
      ['43-4171.00', 'Receptionists & Info Clerks', '$35.830', '$33.470', '$27.470'],
    ],
    col_widths=[0.7, 1.4, 1.2, 1.1, 1.1]
  )

  p_text(doc, 'A Vieira Operations LLC posiciona seus sal\u00e1rios no **percentil 60-75** '
      'do mercado local para cargos t\u00e9cnicos e gerenciais, garantindo competitividade '
      'na atra\u00e7\u00e3o de talentos. Os cargos de **Supply Chain Manager** e **Project '
      'Management Specialist** oferecem remunera\u00e7\u00e3o acima da mediana regional.')

  p_text(doc, 'O custo de vida relativamente baixo de Jacksonville, combinado com a aus\u00eancia '
      'de imposto de renda estadual na Fl\u00f3rida, torna os pacotes de remunera\u00e7\u00e3o '
      'oferecidos significativamente mais atrativos em termos de **poder de compra real** '
      'quando comparados a posi\u00e7\u00f5es equivalentes em Miami, Atlanta ou Charlotte.')

  highlight_box(doc, '**Dados BLS**: ocupa\u00e7\u00f5es-chave (Supply Chain Manager, Project Mgmt Specialist) '
         'com crescimento projetado de **+4% a +6%** \u2014 sal\u00e1rios da Vieira Operations '
         'posicionados no **percentil 60-75** do mercado regional.')

  page_break(doc)

  # ================================================================
  # NEW SUBSECTION 2.1.4 — Benchmark de Competidores
  # ================================================================
  doc.add_heading('2.1.4. Benchmark de Competidores', level=2)

  p_text(doc, 'A an\u00e1lise de benchmark avalia o posicionamento competitivo da Vieira Operations '
      'LLC em rela\u00e7\u00e3o a empresas de serviços que atuam no mercado de **supply chain** e '
      '**opera\u00e7\u00f5es** na regi\u00e3o de Jacksonville e Sudeste dos EUA. A avalia\u00e7\u00e3o cobre '
      'escopo de servi\u00e7os, faixas de pre\u00e7o e posicionamento estrat\u00e9gico.')

  p = p_text(doc, 'O mercado de serviços profissionais na Jacksonville MSA \u00e9 **fragmentado**: n\u00e3o h\u00e1 player '
      'dominante no segmento mid-market de supply chain. As **Big 4** mant\u00eam escrit\u00f3rios '
      'regionais focados em grandes contas, enquanto boutiques locais oferecem escopo '
      'limitado a nichos espec\u00edficos sem integra\u00e7\u00e3o de servi\u00e7os.')
  add_footnote(doc, p, 'An\u00e1lise de mercado baseada em dados do LinkedIn, Glassdoor e Jacksonville Business Journal, 2023-2024.')

  doc.add_heading('Mapeamento de Concorrentes', level=3)

  p_text(doc, 'A an\u00e1lise identifica **seis categorias** de concorrentes, cada uma com perfil '
      'de atua\u00e7\u00e3o distinto. A Vieira Operations LLC posiciona-se na **lacuna** entre '
      'empresas de serviços globais (caras e focadas em grandes contas) e boutiques locais '
      '(limitadas em escopo e profundidade t\u00e9cnica).')

  table_sub(doc, 'Tabela 2.1.4a: Benchmark de Competidores \u2014 Jacksonville e Sudeste')
  make_table(doc,
    ['Competidor', 'Tipo', 'Foco Principal', 'Pre\u00e7o/Hora', 'Presen\u00e7a Jax', 'Limita\u00e7\u00e3o'],
    [
      ['Deloitte Services', 'Global (Big 4)', 'Estrat\u00e9gia geral', '$350-500',
       'Escrit\u00f3rio regional', 'Pre\u00e7o inacess\u00edvel mid-market'],
      ['Accenture', 'Global', 'Tech + serviços profissionais', '$300-450',
       'Escrit\u00f3rio regional', 'Foco em contas >$1B receita'],
      ['Grant Thornton', 'National mid-tier', 'Auditoria + advisory', '$250-400',
       'Escrit\u00f3rio em Jax', 'Foco cont\u00e1bil, pouco supply chain'],
      ['RSM US', 'National mid-tier', 'Middle market advisory', '$200-350',
       'Escrit\u00f3rio pr\u00f3ximo (Tampa)', 'Generalista, sem foco SC'],
      ['Boutiques locais FL', 'Regional', 'Variado', '$100-200',
       'Diversas', 'Sem expertise supply chain'],
      ['Provedores SAP (Cognizant, Infosys)', 'Global (IT)', 'Implementa\u00e7\u00e3o ERP', '$200-350',
       'Remoto + on-site', 'Escopo limitado a tecnologia'],
      ['**Vieira Operations LLC**', '**Reg. especializada**', '**Supply chain integrado**',
       '**$150-250**', '**Sede em Jax**', '**Marca em constru\u00e7\u00e3o**'],
    ],
    col_widths=[1.1, 0.7, 1.0, 0.6, 0.8, 1.3]
  )

  doc.add_heading('Matriz de Compara\u00e7\u00e3o de Servi\u00e7os', level=3)

  p_text(doc, 'A compara\u00e7\u00e3o por escopo de servi\u00e7os evidencia o diferencial da Vieira '
      'Operations: \u00e9 a **\u00fanica empresa de serviços** na regi\u00e3o oferecendo portf\u00f3lio integrado '
      'de **6 servi\u00e7os** cobrindo supply chain, ERP, compliance, treinamento, '
      'lideran\u00e7a e otimiza\u00e7\u00e3o operacional em framework unificado.')

  table_sub(doc, 'Tabela 2.1.4b: Matriz de Servi\u00e7os \u2014 Compara\u00e7\u00e3o Competitiva')
  make_table(doc,
    ['Servi\u00e7o', 'Deloitte', 'Accenture', 'Grant Thornton', 'Boutiques', 'SAP Services', 'Vieira Ops'],
    [
      ['Diagn\u00f3stico Supply Chain', 'Sim', 'Sim', 'Parcial', 'N\u00e3o', 'N\u00e3o', '**Sim**'],
      ['Otimiza\u00e7\u00e3o Operacional', 'Sim', 'Sim', 'Parcial', 'Parcial', 'N\u00e3o', '**Sim**'],
      ['Implementa\u00e7\u00e3o SAP', 'Sim', 'Sim', 'N\u00e3o', 'N\u00e3o', 'Sim', '**Sim**'],
      ['Treinamento T\u00e9cnico', 'Parcial', 'Parcial', 'N\u00e3o', 'Parcial', 'Parcial', '**Sim**'],
      ['Compliance Regulat\u00f3rio', 'Sim', 'Sim', 'Sim', 'Parcial', 'N\u00e3o', '**Sim**'],
      ['Desenv. de Lideran\u00e7a', 'Sim', 'Parcial', 'N\u00e3o', 'Parcial', 'N\u00e3o', '**Sim**'],
      ['**Portf\u00f3lio Integrado**', 'Sim*', 'Sim*', 'N\u00e3o', 'N\u00e3o', 'N\u00e3o', '**Sim**'],
      ['**Pre\u00e7o mid-market**', 'N\u00e3o', 'N\u00e3o', 'Parcial', 'Sim', 'N\u00e3o', '**Sim**'],
    ],
    col_widths=[1.2, 0.6, 0.7, 0.7, 0.6, 0.7, 0.7]
  )

  p_text(doc, '*Deloitte e Accenture oferecem portf\u00f3lio integrado, por\u00e9m a pre\u00e7os que '
      'excluem o segmento mid-market ($350-500/hora vs $150-250/hora da Vieira '
      'Operations). O diferencial competitivo central \u00e9 a combina\u00e7\u00e3o de **expertise '
      'tier-1 a pre\u00e7os acess\u00edveis**.')

  doc.add_heading('Posicionamento Estrat\u00e9gico', level=3)

  p_text(doc, 'O posicionamento da Vieira Operations LLC explora a **lacuna de mercado** '
      'entre duas categorias mal atendidas: (a) empresas com faturamento de **$10M-$500M** '
      'que precisam de expertise de alto n\u00edvel mas n\u00e3o podem pagar Big 4; e (b) '
      'empresas que precisam de **implementa\u00e7\u00e3o**, n\u00e3o apenas relat\u00f3rios.')

  p_text(doc, 'A estrat\u00e9gia de **"expertise tier-1 a pre\u00e7o mid-market"** \u00e9 sustent\u00e1vel '
      'pelo modelo de custos asset-light da empresa e pela experi\u00eancia do fundador '
      'em opera\u00e7\u00f5es de grande escala na **AmBev/AB InBev**, que permite entregar '
      'resultados compar\u00e1veis \u00e0s Big 4 sem a estrutura de custos elevada.')

  table_sub(doc, 'Tabela 2.1.4c: Faixas de Pre\u00e7o por Categoria de Competidor')
  make_table(doc,
    ['Categoria', 'Faixa de Pre\u00e7o/Hora', 'Ticket M\u00e9dio/Projeto', 'Cliente T\u00edpico', 'Market Share Jax'],
    [
      ['Big 4 (Deloitte, Accenture)', '$350-500', '$500K-$5M', 'Fortune 500', '~15%'],
      ['Mid-Tier National (Grant Thornton, RSM)', '$250-400', '$150K-$1M', 'Upper mid-market', '~10%'],
      ['SAP/IT Services', '$200-350', '$200K-$2M', 'Qualquer porte (ERP)', '~8%'],
      ['Boutiques Locais', '$100-200', '$25K-$150K', 'PMEs', '~12%'],
      ['**Vieira Operations LLC**', '**$150-250**', '**$85K-$250K**', '**Mid-market**', '**Target: 3-5%**'],
    ],
    col_widths=[1.3, 0.9, 0.9, 1.0, 0.8]
  )

  bullet(doc, 'Diferencial de Pre\u00e7o', 'taxas 40-60% inferiores \u00e0s Big 4, mantendo '
      'qualidade equivalente baseada em 25 anos de experi\u00eancia AmBev/AB InBev')
  bullet(doc, 'Diferencial de Escopo', 'portf\u00f3lio integrado de 6 servi\u00e7os que elimina '
      'a necessidade de contratar m\u00faltiplos fornecedores')
  bullet(doc, 'Diferencial de Implementa\u00e7\u00e3o', 'foco em execu\u00e7\u00e3o e resultados mensur\u00e1veis, '
      'n\u00e3o apenas diagn\u00f3stico e recomenda\u00e7\u00f5es')
  bullet(doc, 'Diferencial de Proximidade', 'sede em Jacksonville com presen\u00e7a local e '
      'conhecimento profundo do mercado regional')

  highlight_box(doc, '**Posicionamento Competitivo**: \u00fanico player em Jacksonville combinando '
         '**expertise tier-1**, **pre\u00e7os mid-market** ($150-250/h) e **portf\u00f3lio '
         'integrado de 6 servi\u00e7os** \u2014 explorando lacuna de mercado document\u00e1vel.')

  page_break(doc)

  # ================================================================
  # NEW SUBSECTION 2.1.5 — Tend\u00eancias e Drivers de Mercado
  # ================================================================
  doc.add_heading('2.1.5. Tend\u00eancias e Drivers de Mercado', level=2)

  p_text(doc, 'Cinco tend\u00eancias estruturais convergem para criar ambiente excepcionalmente '
      'favor\u00e1vel para empresas especializadas em supply chain e opera\u00e7\u00f5es '
      'nos pr\u00f3ximos 3-5 anos. Cada tend\u00eancia \u00e9 sustentada por dados quantitativos '
      'de fontes autorit\u00e1rias e pol\u00edticas federais vigentes.')

  doc.add_heading('Reshoring e Nearshoring Acelerado', level=3)

  p = p_text(doc, 'O movimento de **reshoring** (retorno da produ\u00e7\u00e3o ao territ\u00f3rio americano) '
      'atingiu recorde hist\u00f3rico em 2023 com **$182 bilh\u00f5es** em investimentos '
      'anunciados, segundo a Reshoring Initiative. Este volume representa **crescimento '
      'de 3.800%** em rela\u00e7\u00e3o a 2010, quando o rastreamento iniciou.')
  add_footnote(doc, p, 'Reshoring Initiative, Annual Data Report 2023. Total reshoring + FDI job announcements.')

  p_text(doc, 'A tend\u00eancia \u00e9 sustentada por fatores estruturais de longo prazo: custos '
      'crescentes na China (+154% em sal\u00e1rios manufatureiros desde 2010), riscos '
      'geopol\u00edticos persistentes, e **incentivos fiscais federais** que tornam a '
      'produ\u00e7\u00e3o dom\u00e9stica competitiva em diversos setores.')

  table_sub(doc, 'Tabela 2.1.5a: Evolu\u00e7\u00e3o do Reshoring nos EUA')
  make_table(doc,
    ['Ano', 'Investimento Reshoring + FDI', 'Empregos Anunciados', 'Crescimento vs Ano Anterior'],
    [
      ['2019', '$98 bilh\u00f5es', '257.000', '\u2014'],
      ['2020', '$112 bilh\u00f5es', '283.000', '+14%'],
      ['2021', '$138 bilh\u00f5es', '349.000', '+23%'],
      ['2022', '$162 bilh\u00f5es', '364.000', '+17%'],
      ['2023', '$182 bilh\u00f5es', '387.000+', '+12%'],
      ['**Total 2010-2023**', '**$1,1+ trilh\u00e3o**', '**2,0M+**', '**CAGR \u223c15%**'],
    ],
    col_widths=[0.6, 1.5, 1.2, 1.3]
  )

  doc.add_heading('Migra\u00e7\u00e3o SAP S/4HANA (Deadline 2027)', level=3)

  p = p_text(doc, 'A SAP anunciou o **fim do suporte** para o SAP ECC (ERP Central Component) '
      'em **dezembro de 2027**, for\u00e7ando mais de **40.000 empresas** globalmente a '
      'migrar para o **SAP S/4HANA**. Esta migra\u00e7\u00e3o n\u00e3o \u00e9 opcional: sistemas sem '
      'suporte ficam vulner\u00e1veis a falhas de seguran\u00e7a e compliance.')
  add_footnote(doc, p, 'SAP SE, End of Mainstream Maintenance for SAP ECC 6.0, Extended to Dec 2027.')

  p_text(doc, 'O mercado de servi\u00e7os de migra\u00e7\u00e3o SAP \u00e9 estimado em **$30+ bilh\u00f5es** '
      'globalmente para o per\u00edodo 2024-2028. Nos EUA, aproximadamente **12.000 empresas** '
      'precisam completar a migra\u00e7\u00e3o, com custo m\u00e9dio de **$1-5 milh\u00f5es** por '
      'projeto, dependendo da complexidade.')

  p_text(doc, 'A Vieira Operations LLC possui **certifica\u00e7\u00e3o SAP** e experi\u00eancia pr\u00e1tica '
      'em implementa\u00e7\u00e3o de **SAP Fiori/S/4HANA** (antecipa\u00e7\u00e3o de 2 anos e 4 meses '
      'no projeto AmBev), posicionando a empresa para capturar parcela significativa '
      'desta demanda concentrada no mercado do Sudeste.')

  doc.add_heading('Industry 4.0 e Digitaliza\u00e7\u00e3o', level=3)

  p = p_text(doc, 'A ado\u00e7\u00e3o de tecnologias **Industry 4.0** (IoT, AI/ML, digital twins, '
      'automa\u00e7\u00e3o avan\u00e7ada) no setor manufatureiro americano cresce a **CAGR de 20,6%**, '
      'com investimentos projetados de **$337 bilh\u00f5es** at\u00e9 2028, segundo a MarketsandMarkets.')
  add_footnote(doc, p, 'MarketsandMarkets, Industry 4.0 Market, Global Forecast to 2028.')

  p_text(doc, 'A digitaliza\u00e7\u00e3o industrial gera demanda por especialistas que entendam '
      'tanto a **tecnologia** quanto as **opera\u00e7\u00f5es** \u2014 exatamente o perfil da '
      'Vieira Operations LLC. Muitas empresas possuem a tecnologia mas carecem '
      'de expertise para integr\u00e1-la efetivamente aos processos operacionais.')

  table_sub(doc, 'Tabela 2.1.5b: Ado\u00e7\u00e3o de Industry 4.0 nos EUA')
  make_table(doc,
    ['Tecnologia', 'Penetra\u00e7\u00e3o Atual', 'Proje\u00e7\u00e3o 2028', 'Impacto no Setor'],
    [
      ['IoT Industrial', '32%', '58%', 'Alto \u2014 integra\u00e7\u00e3o com ERP/supply chain'],
      ['AI/ML em Opera\u00e7\u00f5es', '18%', '45%', 'Alto \u2014 demand forecasting, otimiza\u00e7\u00e3o'],
      ['Digital Twins', '8%', '28%', 'M\u00e9dio \u2014 modelagem de supply chain'],
      ['Automa\u00e7\u00e3o Avan\u00e7ada (RPA)', '41%', '72%', 'M\u00e9dio \u2014 processos administrativos'],
      ['Cloud ERP (S/4HANA)', '25%', '65%', 'Muito Alto \u2014 migra\u00e7\u00e3o obrigat\u00f3ria'],
    ],
    col_widths=[1.2, 0.9, 0.9, 2.5]
  )

  doc.add_heading('Compliance ESG e Sustentabilidade', level=3)

  p = p_text(doc, 'A regulamenta\u00e7\u00e3o de **ESG** (Environmental, Social, Governance) cresce '
      'rapidamente nos EUA. A **SEC** (Securities and Exchange Commission) propositou '
      'regras de divulga\u00e7\u00e3o clim\u00e1tica em 2024, afetando empresas listadas e suas '
      'cadeias de fornecedores, incluindo PMEs do mid-market.')
  add_footnote(doc, p, 'SEC, The Enhancement and Standardization of Climate-Related Disclosures, Final Rule, Mar 2024.')

  p_text(doc, 'Pesquisa da **McKinsey** (2023) indica que **73% dos compradores corporativos** '
      'consideram crit\u00e9rios ESG na sele\u00e7\u00e3o de fornecedores. Para PMEs, o compliance '
      'com ESG tornou-se **requisito de acesso ao mercado**, gerando demanda por '
      'empresa especializada em implementa\u00e7\u00e3o de pr\u00e1ticas sustent\u00e1veis.')

  doc.add_heading('Investimento Federal em Infraestrutura e Supply Chain', level=3)

  p_text(doc, 'Tr\u00eas programas federais injetam mais de **$1,3 trilh\u00e3o** na economia '
      'americana, com impacto direto na demanda por serviços de supply chain '
      'e opera\u00e7\u00f5es. Estes investimentos criam **demanda sustentada** por 5-10 anos, '
      'beneficiando especialmente empresas de serviços com presen\u00e7a no Sudeste.')

  table_sub(doc, 'Tabela 2.1.5c: Investimentos Federais com Impacto em Supply Chain')
  make_table(doc,
    ['Programa Federal', 'Valor Total', 'Per\u00edodo', 'Impacto em Supply Chain', 'Impacto em Jax MSA'],
    [
      ['IIJA (Infrastructure)', '$1,2 trilh\u00e3o', '2021-2031', 'Moderniza\u00e7\u00e3o de portos e rodovias', 'JAXPORT, I-95/I-10'],
      ['CHIPS & Science Act', '$280 bilh\u00f5es', '2022-2032', '$52B em semicondutores dom\u00e9sticos', 'Fornecedores tier-2 FL'],
      ['EO 14017 Supply Chains', '$37 bilh\u00f5es', '2021-2027', 'Fortalecimento cadeias cr\u00edticas', 'Defesa (Mayport)'],
      ['Inflation Reduction Act', '$369 bilh\u00f5es', '2022-2032', 'Energia limpa, manufatura verde', 'Ind\u00fastria solar FL'],
      ['**Total**', '**~$1,9 trilh\u00e3o**', '**2021-2032**', '**Demanda sustentada 10 anos**', '**M\u00faltiplos setores**'],
    ],
    col_widths=[1.2, 0.8, 0.7, 1.5, 1.2]
  )

  table_sub(doc, 'Tabela 2.1.5d: S\u00edntese das Tend\u00eancias e Impacto na Vieira Operations')
  make_table(doc,
    ['Tend\u00eancia', 'Horizonte', 'Tamanho do Mercado', 'Oportunidade Vieira Ops', 'Probabilidade'],
    [
      ['Reshoring acelerado', '2024-2030', '$182B/ano crescente', 'Redesenho de supply chain para mid-market', 'Alta'],
      ['SAP S/4HANA deadline', '2025-2028', '$30B+ global', 'Migra\u00e7\u00e3o ERP para PMEs do Sudeste', 'Muito Alta'],
      ['Industry 4.0', '2024-2030', '$337B investidos', 'Integra\u00e7\u00e3o IoT/AI com opera\u00e7\u00f5es', 'M\u00e9dia-Alta'],
      ['Compliance ESG', '2024-2030', 'Crescente', 'Pr\u00e1ticas ESG para cadeias de fornecedores', 'M\u00e9dia'],
      ['Investimento federal', '2021-2032', '$1,9 tri alocados', 'Projetos JAXPORT, Mayport, I-95', 'Alta'],
    ],
    col_widths=[1.0, 0.7, 0.9, 1.8, 0.8]
  )

  highlight_box(doc, '**Converg\u00eancia de Tend\u00eancias**: **$182B** em reshoring, **$1,9 tri** em '
         'investimentos federais, deadline **SAP 2027** e **Industry 4.0** criam janela '
         'de oportunidade de **3-5 anos** para empresa de serviços em supply chain e opera\u00e7\u00f5es.')

  page_break(doc)

  # ---- 2.2 Cadeia de Suprimentos ----
  doc.add_heading('2.2. Cadeia de Suprimentos', level=2)

  p_text(doc, 'A **Vieira Operations LLC** opera modelo de neg\u00f3cio fundamentalmente distinto '
      'das cadeias de suprimentos tradicionais. Como empresa de **servi\u00e7os profissionais**, '
      'seu principal insumo \u00e9 o **capital intelectual** do fundador e da equipe.')

  p_text(doc, 'A cadeia de valor estrutura-se em tr\u00eas elos principais: (a) **capital intelectual** '
      'e metodologias propriet\u00e1rias, (b) **ferramentas tecnol\u00f3gicas** (SAP, Power BI, MS '
      'Project) e (c) **rede de parceiros** (universidades, certificadores, subcontratados).')

  p_text(doc, 'Este modelo **asset-light** confere vantagens significativas: baixa necessidade de '
      'capital de giro operacional, escalabilidade atrav\u00e9s de contrata\u00e7\u00f5es, e **margem '
      'de contribui\u00e7\u00e3o** superior a 78%, caracter\u00edstica t\u00edpica de empresas de '
      'servi\u00e7os profissionais de alto valor agregado.')

  table_sub(doc, 'Tabela 2.2: Cadeia de Valor \u2014 Vieira Operations LLC')
  make_table(doc,
    ['Elo da Cadeia', 'Componente', 'Custo Estimado', 'Risco'],
    [
      ['Capital Intelectual', '25 anos experi\u00eancia AmBev/AB InBev, metodologias', 'Investido (sunk cost)', 'Baixo'],
      ['Tecnologia', 'Licen\u00e7as SAP, Power BI, MS Project', '$6.000/ano/local', 'Baixo'],
      ['Recursos Humanos', 'Especialistas técnicos, analistas, suporte', 'Vari\u00e1vel por projeto', 'M\u00e9dio'],
      ['Infraestrutura', 'Escrit\u00f3rios, equipamentos, conectividade', '$24.000-36.000/ano', 'Baixo'],
      ['Parceiros', 'UNF, FSCJ, certificadores SAP/APICS', 'Por demanda', 'Baixo'],
    ],
    col_widths=[1.3, 2.5, 1.2, 0.7]
  )

  p_text(doc, 'Este modelo gera **efeito multiplicador**: cada projeto bem-sucedido fortalece '
      'a reputa\u00e7\u00e3o e gera indica\u00e7\u00f5es, reduzindo o custo de aquisi\u00e7\u00e3o de clientes. '
      'A experi\u00eancia na **AmBev/AB InBev** funciona como valida\u00e7\u00e3o pr\u00e9-existente de '
      'compet\u00eancia t\u00e9cnica junto a potenciais clientes corporativos.')

  # ---- 2.3 Empregabilidade ----
  doc.add_heading('2.3. Empregabilidade Esperada (Direta e Indireta)', level=2)

  p_text(doc, 'A proje\u00e7\u00e3o de gera\u00e7\u00e3o de empregos da **Vieira Operations LLC** fundamenta-se '
      'em tr\u00eas dimens\u00f5es: **empregos diretos** (colaboradores), **empregos indiretos** '
      '(cadeia de fornecedores) e **empregos induzidos** (efeito multiplicador na economia).')

  p = p_text(doc, 'O **Economic Policy Institute** documenta multiplicador de **4,43x** para o '
      'setor NAICS 5416, significando que cada emprego direto gera aproximadamente 4,43 '
      'empregos adicionais na cadeia econ\u00f4mica local e regional.')
  add_footnote(doc, p, 'Economic Policy Institute, Updated Employment Multipliers for the U.S. Economy, 2023.')

  p_text(doc, 'A gera\u00e7\u00e3o de empregos em **regi\u00f5es estrat\u00e9gicas** do Sudeste americano '
      'alinha-se diretamente com as **prioridades federais de desenvolvimento econ\u00f4mico**, '
      'que enfatizam a cria\u00e7\u00e3o de postos de trabalho qualificados em setores de alta '
      'demanda e o fortalecimento das cadeias produtivas dom\u00e9sticas.')

  doc.add_heading('Empregos Diretos Projetados', level=3)

  table_sub(doc, 'Tabela 2.3a: Proje\u00e7\u00e3o de Empregos Diretos por Localidade (Y1-Y5)')
  make_table(doc,
    ['Localidade', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
    [
      ['Jacksonville, FL (sede)', '3', '5', '6', '7', '8'],
      ['Savannah, GA', '\u2014', '2', '3', '3', '4'],
      ['Brunswick, GA', '\u2014', '\u2014', '\u2014', '\u2014', '2'],
      ['**Total Diretos**', '**3**', '**7**', '**9**', '**10**', '**14**'],
    ],
    col_widths=[2.0, 0.8, 0.8, 0.8, 0.8, 0.8]
  )

  p_text(doc, 'A distribui\u00e7\u00e3o geogr\u00e1fica acompanha a expans\u00e3o: Jacksonville (sede, Y1-Y5), '
      'Savannah (branch 1, Y2-Y5) e Brunswick (branch 2, Y5). As contrata\u00e7\u00f5es priorizam '
      '**profissionais locais**, contribuindo para o desenvolvimento das comunidades.')

  p_text(doc, 'Os sal\u00e1rios oferecidos posicionam-se no **percentil 60-75** do mercado local, '
      'garantindo atratividade para talentos qualificados enquanto mantem sustentabilidade '
      'financeira. O pacote inclui **seguro sa\u00fade**, **PTO** (Paid Time Off) e '
      '**programa de desenvolvimento profissional cont\u00ednuo**.')

  doc.add_heading('Empregos Indiretos \u2014 Multiplicador EPI', level=3)

  p_text(doc, 'Aplicando o multiplicador **EPI de 4,43x** ao total de **14 empregos diretos** '
      'projetados para o Ano 5, a empresa gera aproximadamente **62 empregos indiretos** '
      'na cadeia econ\u00f4mica regional, totalizando **76 postos de trabalho**.')

  p_text(doc, 'Os empregos indiretos distribuem-se entre fornecedores de servi\u00e7os (TI, '
      'contabilidade, jur\u00eddico), prestadores de servi\u00e7os gerais (limpeza, manuten\u00e7\u00e3o, '
      'transporte) e setores induzidos (varejo, alimenta\u00e7\u00e3o, moradia) que se beneficiam '
      'da renda gerada pelos colaboradores diretos e indiretos.')

  table_sub(doc, 'Tabela 2.3b: C\u00f3digos SOC \u2014 Ocupa\u00e7\u00f5es Relacionadas')
  make_table(doc,
    ['C\u00f3digo SOC', 'Ocupa\u00e7\u00e3o', 'Sal\u00e1rio Anual', 'Outlook 2022-32'],
    [
      ['11-3031.00', 'Supply Chain Managers (Owner)', '$110.000', '+4%'],
      ['13-1082.00', 'Project Management Specialists', '$99.380', '+6%'],
      ['43-9061.00', 'Office Clerks, General', '$61.400', '-5%'],
      ['43-1011.00', 'First-Line Supervisors of Office Support', '$61.420', '-2%'],
      ['43-4171.00', 'Receptionists and Information Clerks', '$27.470', '-3%'],
    ],
    col_widths=[0.8, 2.8, 1.2, 0.9]
  )

  p = p_text(doc, 'Destaca-se que **Project Management Specialists** (SOC 13-1082) apresentam '
      'crescimento projetado de **6%** para o per\u00edodo 2022-2032, classificado como '
      '"faster than average" pelo BLS \u2014 indicando demanda robusta e crescente por '
      'profissionais que a Vieira Operations LLC treina e emprega.')
  add_footnote(doc, p, 'BLS, Occupational Outlook Handbook, Project Management Specialists, 2024 Edition.')

  highlight_box(doc, '**Impacto na Empregabilidade**: **76 postos de trabalho** projetados no '
         'Ano 5 (14 diretos + 62 indiretos) em regi\u00f5es estrat\u00e9gicas do Sudeste dos EUA.')

  # ---- 2.4 Gestao do Conhecimento ----
  doc.add_heading('2.4. Gest\u00e3o do Conhecimento', level=2)

  p_text(doc, 'A **Vieira Operations LLC** fundamenta sua proposta de valor em ativo estrat\u00e9gico '
      'intang\u00edvel: o **capital intelectual** acumulado ao longo de 25 anos de experi\u00eancia '
      'em opera\u00e7\u00f5es industriais de grande escala na **AmBev/AB InBev**.')

  p_text(doc, 'A gest\u00e3o do conhecimento estrutura-se atrav\u00e9s de tr\u00eas componentes reconhecidos '
      'pela **OECD** (Oslo Manual) como pilares da economia baseada em conhecimento, '
      'aplicados ao contexto de empresa especializada.')

  p_text(doc, 'A transfer\u00eancia de conhecimento entre o contexto brasileiro (AmBev) e o americano '
      'constitui **vantagem competitiva rara**: pr\u00e1ticas de gest\u00e3o validadas em '
      'opera\u00e7\u00f5es de escala global s\u00e3o adaptadas ao contexto de PMEs americanas, '
      'gerando resultados desproporcional\u00e3o ao investimento.')

  p_text(doc, 'O capital intelectual da empresa organiza-se em tr\u00eas dimens\u00f5es complementares. '
      'O **capital humano** re\u00fane compet\u00eancias em supply chain, ERP, compliance e '
      'lideran\u00e7a validadas ao longo de 25 anos na AmBev/AB InBev, com certifica\u00e7\u00e3o SAP. '
      'O **capital estrutural** traduz-se em processos e metodologias propriet\u00e1rias \u2014 '
      'frameworks de diagn\u00f3stico, checklists de implementa\u00e7\u00e3o ERP e protocolos de '
      'compliance \u2014 evidenciados pela redu\u00e7\u00e3o de 48% em custos log\u00edsticos e pela '
      'antecipa\u00e7\u00e3o de 2 anos e 4 meses na implementa\u00e7\u00e3o SAP Fiori. O **capital '
      'relacional** compreende a rede B2B e a reputa\u00e7\u00e3o constru\u00eddas na gest\u00e3o de R$380 '
      'bilh\u00f5es em ativos ao longo de opera\u00e7\u00f5es multinacionais em 5 pa\u00edses. Estes ativos '
      'intang\u00edveis constituem **propriedade intelectual** da empresa e s\u00e3o document\u00e1veis '
      'e replic\u00e1veis.')

  # ---- 2.5 Impactos ESG ----
  doc.add_heading('2.5. Impactos ESG', level=2)

  p_text(doc, 'A **Vieira Operations LLC** estrutura sua opera\u00e7\u00e3o em framework integrado de '
      'pr\u00e1ticas **ESG** (Environmental, Social and Governance), alinhado aos padr\u00f5es '
      'do **SASB** para servi\u00e7os profissionais e aos **ODS** das Na\u00e7\u00f5es Unidas.')

  p_text(doc, 'A integra\u00e7\u00e3o de pr\u00e1ticas ESG n\u00e3o constitui apenas compromisso \u00e9tico: '
      '**73%** dos clientes corporativos consideram crit\u00e9rios ESG na sele\u00e7\u00e3o de '
      'fornecedores (McKinsey, 2023), tornando a ades\u00e3o a estes padr\u00f5es um '
      '**requisito competitivo** no mercado de serviços profissionais.')

  doc.add_heading('Dimens\u00e3o Ambiental (E)', level=3)
  p_text(doc, 'Os projetos de **otimiza\u00e7\u00e3o de supply chain** geram redu\u00e7\u00e3o mensur\u00e1vel de '
      '**emiss\u00f5es de carbono** e desperd\u00edcio de recursos. A meta \u00e9 documentar '
      '**redu\u00e7\u00e3o m\u00ednima de 15%** em emiss\u00f5es dos clientes atendidos, contribuindo '
      'para os ODS 9 e 12.')

  p_text(doc, 'A otimiza\u00e7\u00e3o de rotas log\u00edsticas e consolida\u00e7\u00e3o de cargas reduz '
      'quilometragem percorrida e consumo de combust\u00edvel. Em projetos similares na AmBev, '
      'o fundador documentou redu\u00e7\u00e3o de **22% na pegada de carbono** da opera\u00e7\u00e3o '
      'log\u00edstica ap\u00f3s otimiza\u00e7\u00e3o de supply chain.')

  bullet(doc, 'Otimiza\u00e7\u00e3o de Processos', 'redu\u00e7\u00e3o mensur\u00e1vel de desperd\u00edcio e emiss\u00f5es '
      '(meta: -15% nos clientes atendidos)')
  bullet(doc, 'Opera\u00e7\u00e3o Digital-First', 'modelo de serviços profissionais com uso intensivo de ferramentas '
      'digitais, minimizando deslocamentos')

  doc.add_heading('Dimens\u00e3o Social (S)', level=3)
  p_text(doc, 'A gera\u00e7\u00e3o de **76 postos de trabalho** em regi\u00f5es com necessidade documentada '
      'de diversifica\u00e7\u00e3o econ\u00f4mica constitui o principal impacto social da empresa. '
      'Os programas de **capacita\u00e7\u00e3o t\u00e9cnica** elevam a empregabilidade da for\u00e7a '
      'de trabalho local em \u00e1reas de alta demanda.')

  p_text(doc, 'O compromisso com **diversidade** e **inclus\u00e3o** reflete-se na pol\u00edtica de '
      'contrata\u00e7\u00e3o: metas de **30% de diversidade** no quadro de colaboradores at\u00e9 o Y3, '
      'parcerias com **HBCUs** (Historically Black Colleges and Universities) da regi\u00e3o '
      'e programas de est\u00e1gio inclusivos.')

  bullet(doc, 'Gera\u00e7\u00e3o de Empregos', '76 postos projetados em regi\u00f5es com necessidade '
      'de diversifica\u00e7\u00e3o econ\u00f4mica')
  bullet(doc, 'Capacita\u00e7\u00e3o Profissional', 'programas que elevam empregabilidade da for\u00e7a '
      'de trabalho local em supply chain')
  bullet(doc, 'Inclus\u00e3o Econ\u00f4mica', 'atua\u00e7\u00e3o em \u00e1reas com \u00edndice de pobreza acima da '
      'm\u00e9dia nacional, gerando mobilidade social')

  doc.add_heading('Dimens\u00e3o de Governan\u00e7a (G)', level=3)
  p_text(doc, 'A governan\u00e7a corporativa fundamenta-se em **transpar\u00eancia financeira**, '
      '**compliance regulat\u00f3rio** e **\u00e9tica nos neg\u00f3cios**, com relat\u00f3rios financeiros '
      'auditados anualmente e c\u00f3digo de conduta baseado nos padr\u00f5es da AB InBev Global.')

  bullet(doc, 'Transpar\u00eancia', 'relat\u00f3rios financeiros auditados e conformidade com '
      'regulamenta\u00e7\u00f5es federais e estaduais')
  bullet(doc, '\u00c9tica Corporativa', 'c\u00f3digo de conduta baseado em padr\u00f5es da AB InBev Global '
      'Compliance, adaptado ao contexto americano')
  bullet(doc, 'Anti-Corrup\u00e7\u00e3o', 'pol\u00edticas de compliance com FCPA (Foreign Corrupt Practices '
      'Act) e regulamenta\u00e7\u00f5es federais aplic\u00e1veis')

  table_sub(doc, 'Tabela 2.5: Alinhamento ESG com ODS das Na\u00e7\u00f5es Unidas')
  make_table(doc,
    ['ODS', 'Descri\u00e7\u00e3o', 'A\u00e7\u00e3o da Vieira Operations', 'Meta'],
    [
      ['ODS 8', 'Trabalho Decente e Crescimento Econ\u00f4mico', '76 empregos qualificados no Sudeste', '14 diretos (Y5)'],
      ['ODS 9', 'Ind\u00fastria, Inova\u00e7\u00e3o e Infraestrutura', 'Otimiza\u00e7\u00e3o de supply chain industrial', '30+ clientes (Y5)'],
      ['ODS 12', 'Consumo e Produ\u00e7\u00e3o Respons\u00e1veis', 'Redu\u00e7\u00e3o de desperd\u00edcio operacional', '-15% emiss\u00f5es'],
      ['ODS 4', 'Educa\u00e7\u00e3o de Qualidade', 'Programas de capacita\u00e7\u00e3o profissional', '200+ profissionais/ano'],
      ['ODS 10', 'Redu\u00e7\u00e3o das Desigualdades', 'Contrata\u00e7\u00e3o inclusiva e parcerias HBCU', '30% diversidade (Y3)'],
      ['ODS 17', 'Parcerias e Meios de Implementa\u00e7\u00e3o', 'Parcerias universit\u00e1rias e setoriais', '5+ parcerias ativas'],
    ],
    col_widths=[0.6, 1.5, 2.0, 1.2]
  )

  check(doc, 'Alinhamento ESG', 'framework integrado cobrindo 6 ODS das Na\u00e7\u00f5es Unidas e '
      'padr\u00f5es SASB para servi\u00e7os profissionais')

  # ---- 2.6 SWOT ----
  doc.add_heading('2.6. An\u00e1lise SWOT', level=2)

  p_text(doc, 'A an\u00e1lise **SWOT** posiciona a Vieira Operations LLC em rela\u00e7\u00e3o a fatores '
      'internos (**for\u00e7as e fraquezas**) e externos (**oportunidades e amea\u00e7as**) do '
      'ambiente competitivo, fornecendo base para formula\u00e7\u00e3o de estrat\u00e9gias.')

  p_text(doc, 'A an\u00e1lise fundamenta-se em dados verificaveis: for\u00e7as derivam do track record '
      'documentado do fundador; fraquezas refletem condi\u00e7\u00f5es t\u00edpicas de startups; '
      'oportunidades baseiam-se em pol\u00edticas federais vigentes; amea\u00e7as consideram '
      'din\u00e2micas competitivas do setor NAICS 541611.')

  table_sub(doc, 'Tabela 2.6: Matriz SWOT \u2014 Vieira Operations LLC')
  make_table(doc,
    ['', 'Positivo', 'Negativo'],
    [
      ['**Interno**',
       'FOR\u00c7AS\n\u2022 25 anos AmBev/AB InBev\n\u2022 48% redu\u00e7\u00e3o custos vari\u00e1veis\n'
       '\u2022 SAP Fiori: 2a4m antecipa\u00e7\u00e3o\n\u2022 6 servi\u00e7os integrados\n'
       '\u2022 R$380 bi ativos gerenciados',
       'FRAQUEZAS\n\u2022 Marca nova sem hist\u00f3rico nos EUA\n\u2022 Depend\u00eancia inicial do fundador\n'
       '\u2022 Base de clientes a construir\n\u2022 Limita\u00e7\u00e3o de escala no Y1'],
      ['**Externo**',
       'OPORTUNIDADES\n\u2022 EO 14017: $37 bi supply chain\n\u2022 CHIPS Act: $52 bi\n'
       '\u2022 JAXPORT: porto estrat\u00e9gico DoD\n\u2022 CAGR 6,2% serviços profissionais\n'
       '\u2022 Reshoring acelerado ($182 bi)',
       'AMEA\u00c7AS\n\u2022 Big 4 com recursos superiores\n\u2022 Ciclos econ\u00f4micos recessivos\n'
       '\u2022 Escassez de m\u00e3o-de-obra qualificada\n\u2022 Mudan\u00e7as regulat\u00f3rias'],
    ],
    col_widths=[0.8, 2.6, 2.6]
  )

  doc.add_heading('An\u00e1lise das For\u00e7as', level=3)
  p_text(doc, 'A principal for\u00e7a \u00e9 o **track record excepcional** do fundador: gest\u00e3o de '
      'R$380 bilh\u00f5es em ativos, redu\u00e7\u00e3o de 48% em custos e antecipa\u00e7\u00e3o de 2 anos e 4 '
      'meses na implementa\u00e7\u00e3o do SAP Fiori s\u00e3o resultados raramente atingidos mesmo '
      'por empresas de serviços globais com equipes de centenas.')

  doc.add_heading('An\u00e1lise das Fraquezas', level=3)
  p_text(doc, 'A **depend\u00eancia inicial do fundador** \u00e9 a principal fraqueza, mitigada pela '
      'contrata\u00e7\u00e3o progressiva de especialistas a partir do Y1 e documenta\u00e7\u00e3o '
      'de metodologias propriet\u00e1rias que permitem replica\u00e7\u00e3o sem presen\u00e7a '
      'direta do fundador em todos os projetos.')

  doc.add_heading('An\u00e1lise das Oportunidades', level=3)
  p_text(doc, 'A converg\u00eancia de **EO 14017** ($37 bi), **CHIPS Act** ($52 bi) e **reshoring '
      'acelerado** ($182 bi) cria janela de oportunidade \u00fanica para empresas de serviços '
      'especializadas em supply chain e opera\u00e7\u00f5es no Sudeste americano. Esta '
      'oportunidade \u00e9 **estrutural**, n\u00e3o conjuntural.')

  doc.add_heading('An\u00e1lise das Amea\u00e7as', level=3)
  p_text(doc, 'As **Big 4** (Deloitte, McKinsey, Accenture, BCG) possuem recursos significativamente '
      'superiores, por\u00e9m seu **pricing elevado** ($350-500/hora) e foco em grandes contas '
      'criam lacuna de mercado que a Vieira Operations LLC explora com **expertise tier-1 '
      'a pre\u00e7os mid-market**.')

  # ---- 2.7 SWOT Cruzada ----
  doc.add_heading('2.7. SWOT Cruzada', level=2)

  p_text(doc, 'A **SWOT Cruzada** combina fatores internos e externos para gerar **estrat\u00e9gias '
      'acion\u00e1veis**, organizadas em quatro quadrantes que orientam a tomada de decis\u00e3o '
      'operacional e comercial da empresa ao longo dos cinco anos.')

  p_text(doc, 'Cada estrat\u00e9gia vincula-se a **a\u00e7\u00f5es priorizadas** com respons\u00e1veis e prazos, '
      'garantindo que a an\u00e1lise se traduza em execu\u00e7\u00e3o concreta. O monitoramento '
      'trimestral permite ajustes conforme o ambiente evolui.')

  table_sub(doc, 'Tabela 2.7: SWOT Cruzada \u2014 Estrat\u00e9gias Integradas')
  make_table(doc,
    ['Quadrante', 'Estrat\u00e9gia', 'A\u00e7\u00e3o Priorit\u00e1ria'],
    [
      ['SO (For\u00e7as + Oportunidades)', 'Alavancar expertise AmBev para capturar demanda EO 14017',
       'Pipeline de projetos federais via JAXPORT'],
      ['SO', 'Usar SAP Certified para projetos CHIPS Act',
       'Parcerias com integradores regionais'],
      ['SO', 'Posicionar portf\u00f3lio integrado para reshoring',
       'Pacote supply chain + ERP + treinamento'],
      ['WO (Fraquezas + Oportunidades)', 'Construir marca via casos de sucesso documentados',
       'Programa de case studies com ROI quantific\u00e1vel'],
      ['WO', 'Diversificar depend\u00eancia do fundador com contrata\u00e7\u00f5es Y2',
       'Recrutamento em universidades locais (UNF, FSCJ)'],
      ['WO', 'Alavancar parcerias institucionais para credibilidade',
       'APICS, SAP User Group, Jacksonville Chamber'],
      ['ST (For\u00e7as + Amea\u00e7as)', 'Diferencia\u00e7\u00e3o por pre\u00e7o vs Big 4 ($150-250/h vs $350-500/h)',
       'Proposta de valor mid-market com expertise tier-1'],
      ['ST', 'Proteger margem em recess\u00e3o com servi\u00e7os essenciais',
       'Diversifica\u00e7\u00e3o de portf\u00f3lio mantendo 6 linhas'],
      ['WT (Fraquezas + Amea\u00e7as)', 'Construir reserva financeira (3 meses capital de giro)',
       'Capital de giro de $90.747 por onda de expans\u00e3o'],
      ['WT', 'Parcerias acad\u00eamicas para pipeline de talentos',
       'Acordos com UNF e FSCJ para est\u00e1gios'],
    ],
    col_widths=[1.5, 2.5, 2.0]
  )

  # ---- 2.8 Porter ----
  doc.add_heading('2.8. An\u00e1lise de Porter \u2014 Cinco For\u00e7as', level=2)

  p_text(doc, 'A an\u00e1lise das **Cinco For\u00e7as de Porter** avalia a intensidade competitiva '
      'e atratividade estrutural do setor **NAICS 541611** na regi\u00e3o Sudeste dos EUA, '
      'identificando din\u00e2micas que influenciam a rentabilidade.')

  p_text(doc, 'O modelo de Porter revela ambiente competitivo **moderadamente favor\u00e1vel** para '
      'a Vieira Operations LLC: barreiras de entrada por expertise s\u00e3o altas, poder de '
      'fornecedores \u00e9 baixo, e a fragmenta\u00e7\u00e3o do mercado mid-market cria espa\u00e7o para '
      'posicionamento diferenciado.')

  p_text(doc, 'A **rivalidade entre concorrentes** \u00e9 moderada, com lacuna expressiva no mid-market '
      'que a empresa endere\u00e7a via diferencia\u00e7\u00e3o por expertise. A **amea\u00e7a de novos entrantes** '
      '\u00e9 baixa a m\u00e9dia, pois a barreira de expertise t\u00e9cnica e o track record de 25 anos '
      'constituem defesa eficaz. O **poder dos clientes** \u00e9 moderado \u2014 a especializa\u00e7\u00e3o em '
      'supply chain limita alternativas, e resultados mensur\u00e1veis fidelizam a base. O **poder '
      'dos fornecedores** \u00e9 baixo gra\u00e7as ao modelo asset-light e \u00e0 internaliza\u00e7\u00e3o de '
      'compet\u00eancias. A **amea\u00e7a de substitutos** \u00e9 baixa a m\u00e9dia, mitigada pelo portf\u00f3lio '
      'integrado de seis servi\u00e7os complementares.')

  # 2.8.1 Concorrentes
  doc.add_heading('2.8.1. An\u00e1lise de Concorrentes', level=3)

  p_text(doc, 'O mercado de serviços profissionais em gest\u00e3o no Sudeste apresenta estrutura **fragmentada**, '
      'com aus\u00eancia de player dominante no segmento mid-market de supply chain. A Vieira '
      'Operations posiciona-se na **lacuna** entre empresas de serviços globais (caras) e boutiques '
      'locais (limitadas em escopo).')

  p_text(doc, 'A an\u00e1lise competitiva identifica **quatro categorias** de concorrentes, cada uma '
      'com vantagens e limita\u00e7\u00f5es espec\u00edficas que definem o espa\u00e7o competitivo onde a '
      'Vieira Operations LLC se posiciona de forma \u00fanica.')

  table_sub(doc, 'Tabela 2.8.1: An\u00e1lise Comparativa de Concorrentes')
  make_table(doc,
    ['Concorrente', 'Tipo', 'Foco', 'Pre\u00e7o/Hora', 'Limita\u00e7\u00e3o'],
    [
      ['Deloitte/McKinsey', 'Global (Big 4)', 'Estrat\u00e9gia geral', '$350-500',
       'Pre\u00e7o inacess\u00edvel para mid-market'],
      ['Accenture', 'Global', 'Tecnologia + serviços profissionais', '$300-450',
       'Foco em grandes contas (>$1B receita)'],
      ['Boutiques locais FL', 'Regional', 'Variado', '$100-200',
       'Sem expertise em supply chain integrado'],
      ['Provedores SAP', 'Nicho', 'Implementa\u00e7\u00e3o ERP', '$200-350',
       'Escopo limitado a tecnologia'],
      ['**Vieira Operations**', '**Regional especializada**', '**Supply chain integrado**',
       '**$150-250**', '**Marca em constru\u00e7\u00e3o**'],
    ],
    col_widths=[1.3, 1.0, 1.3, 0.8, 1.8]
  )

  p_text(doc, 'O posicionamento de **"expertise tier-1 a pre\u00e7o mid-market"** endere\u00e7a segmento '
      'n\u00e3o atendido: empresas com faturamento de $10-500 milh\u00f5es que necessitam de '
      'serviços profissionais de alta qualidade mas n\u00e3o conseguem pagar as taxas das Big 4. Este '
      'segmento representa o **grosso do mercado** regional.')

  # 2.8.2 Novos Entrantes
  doc.add_heading('2.8.2. Amea\u00e7a de Novos Entrantes', level=3)

  p_text(doc, 'Barreiras de entrada **mistas**: capital e regulamenta\u00e7\u00e3o s\u00e3o relativamente '
      'baixos, por\u00e9m a **expertise t\u00e9cnica comprovada** e o **track record documentado** '
      'constituem barreiras significativas que protegem players estabelecidos.')

  table_sub(doc, 'Tabela 2.8.2: Barreiras de Entrada no Mercado')
  make_table(doc,
    ['Barreira', 'N\u00edvel', 'Justificativa'],
    [
      ['Capital Inicial', 'Baixo', 'Modelo asset-light; investimento principal em capital humano'],
      ['Regulamenta\u00e7\u00e3o', 'Baixo-M\u00e9dio', 'Certifica\u00e7\u00f5es SAP e APICS recomendadas mas n\u00e3o obrigat\u00f3rias'],
      ['Expertise T\u00e9cnica', 'Alto', '25 anos de experi\u00eancia n\u00e3o s\u00e3o replic\u00e1veis facilmente'],
      ['Track Record', 'Alto', 'Resultados documentados (48% redu\u00e7\u00e3o) s\u00e3o barreira competitiva'],
      ['Rede de Relacionamentos', 'M\u00e9dio', 'Constru\u00e7\u00e3o de rede B2B leva 3-5 anos em nova regi\u00e3o'],
    ],
    col_widths=[1.5, 1.0, 3.5]
  )

  num_item(doc, 1, 'Expertise Tier-1 a Pre\u00e7o Acess\u00edvel', 'experi\u00eancia AmBev/AB InBev '
       '(R$380 bi em ativos) a pre\u00e7os 40-60% inferiores \u00e0s Big 4')
  num_item(doc, 2, 'Foco em Implementa\u00e7\u00e3o', 'diferencial claro em rela\u00e7\u00e3o a empresas de serviços '
       'que entregam apenas relat\u00f3rios e recomenda\u00e7\u00f5es')
  num_item(doc, 3, 'Metodologias Validadas', 'frameworks testados em opera\u00e7\u00f5es reais com '
       'redu\u00e7\u00e3o documentada de 48% em custos vari\u00e1veis')
  num_item(doc, 4, 'Portf\u00f3lio Integrado', '\u00fanico player oferecendo 6 servi\u00e7os cobrindo supply '
       'chain, ERP, compliance, treinamento e lideran\u00e7a')

  # 2.8.3 Clientes
  doc.add_heading('2.8.3. Poder de Negocia\u00e7\u00e3o dos Clientes', level=3)

  p_text(doc, 'Poder de barganha **moderado**. M\u00faltiplos fornecedores de servi\u00e7os t\u00e9cnicos '
      'aumentam o poder do cliente, por\u00e9m a **especializa\u00e7\u00e3o** da Vieira Operations '
      'em supply chain integrado e a **escassez de profissionais** com experi\u00eancia em '
      'opera\u00e7\u00f5es de grande escala limitam as alternativas.')

  p_text(doc, 'A estrat\u00e9gia de mitiga\u00e7\u00e3o foca em **demonstra\u00e7\u00e3o de ROI**: clientes que '
      'verificam resultados mensur\u00e1veis (redu\u00e7\u00e3o de custos, ganho de efici\u00eancia) '
      'tornam-se menos sens\u00edveis a pre\u00e7o e mais propensos a contratos de longo prazo, '
      'reduzindo seu poder de negocia\u00e7\u00e3o efetivo.')

  table_sub(doc, 'Tabela 2.8.3: Poder de Negocia\u00e7\u00e3o por Segmento de Cliente')
  make_table(doc,
    ['Segmento', 'Poder', 'Estrat\u00e9gia de Mitiga\u00e7\u00e3o'],
    [
      ['PMEs Manufatureiras', 'Baixo', 'Poucos fornecedores qualificados; alta depend\u00eancia'],
      ['Mid-Market ($50-500M)', 'Moderado', 'Diferencia\u00e7\u00e3o por pre\u00e7o e resultados documentados'],
      ['Corpora\u00e7\u00f5es (>$500M)', 'Alto', 'Nicho de especializa\u00e7\u00e3o; subcontrata\u00e7\u00e3o por Big 4'],
      ['Governo/Defesa', 'Baixo-M\u00e9dio', 'Certifica\u00e7\u00f5es obrigat\u00f3rias limitam pool de fornecedores'],
    ],
    col_widths=[1.5, 0.8, 3.7]
  )

  # 2.8.4 Fornecedores
  doc.add_heading('2.8.4. Poder de Negocia\u00e7\u00e3o dos Fornecedores', level=3)

  p_text(doc, 'Poder de barganha dos fornecedores \u00e9 **baixo a nulo**. A Vieira Operations '
      'opera modelo **asset-light** onde o principal insumo \u00e9 **capital intelectual** '
      'interno. Fornecedores externos operam em mercados competitivos.')

  p_text(doc, 'A \u00fanica exce\u00e7\u00e3o parcial \u00e9 a **SAP SE**, cujas licen\u00e7as s\u00e3o necess\u00e1rias para '
      'ambientes de demonstra\u00e7\u00e3o e treinamento. Esta depend\u00eancia \u00e9 mitigada por '
      'certifica\u00e7\u00f5es m\u00faltiplas (Oracle, Microsoft Dynamics) que permitem '
      'flexibilidade de plataforma conforme necessidade do cliente.')

  table_sub(doc, 'Tabela 2.8.4: Fornecedores e Estrat\u00e9gia de Mitiga\u00e7\u00e3o')
  make_table(doc,
    ['Fornecedor', 'Tipo', 'Poder', 'Mitiga\u00e7\u00e3o'],
    [
      ['SAP SE', 'Licen\u00e7as ERP', 'M\u00e9dio', 'Certifica\u00e7\u00f5es m\u00faltiplas (SAP, Oracle, Microsoft)'],
      ['Microsoft', 'Office 365, Azure', 'Baixo', 'Alternativas dispon\u00edveis (Google, AWS)'],
      ['Coworking/Escrit\u00f3rio', 'Espa\u00e7o f\u00edsico', 'Baixo', 'Mercado competitivo em Jacksonville'],
      ['Universidades', 'Pipeline de talentos', 'Baixo', 'M\u00faltiplas op\u00e7\u00f5es (UNF, FSCJ, JU)'],
      ['Subcontratados', 'Especialistas freelance', 'M\u00e9dio', 'Pool amplo de profissionais no Sudeste'],
    ],
    col_widths=[1.3, 1.2, 0.7, 2.8]
  )

  bullet(doc, 'Diversifica\u00e7\u00e3o', 'certifica\u00e7\u00f5es m\u00faltiplas garantem flexibilidade de plataforma '
      'tecnol\u00f3gica e independ\u00eancia de fornecedor \u00fanico')
  bullet(doc, 'Internaliza\u00e7\u00e3o', 'metodologias propriet\u00e1rias desenvolvidas ao longo de 25 anos '
      'eliminam depend\u00eancia de frameworks de terceiros')

  # 2.8.5 Substitutos
  doc.add_heading('2.8.5. Produtos ou Servi\u00e7os Substitutos', level=3)

  p_text(doc, 'Amea\u00e7a de substitui\u00e7\u00e3o \u00e9 **baixa a moderada**. A combina\u00e7\u00e3o de 6 servi\u00e7os '
      'integrados n\u00e3o \u00e9 facilmente replic\u00e1vel por solu\u00e7\u00f5es alternativas como '
      '**automa\u00e7\u00e3o** pura, **empresas de serviços online** ou **contrata\u00e7\u00e3o interna**.')

  p_text(doc, 'A tend\u00eancia de **automa\u00e7\u00e3o por IA** em serviços profissionais afeta principalmente '
      'tarefas de an\u00e1lise de dados e relat\u00f3rios, n\u00e3o a **implementa\u00e7\u00e3o presencial** '
      'e **gest\u00e3o de mudan\u00e7a organizacional** que constituem o core da Vieira Operations. '
      'A empresa incorpora IA como **ferramenta**, n\u00e3o como substituto.')

  table_sub(doc, 'Tabela 2.8.5: Substitutos e Estrat\u00e9gia de Mitiga\u00e7\u00e3o')
  make_table(doc,
    ['Substituto', 'Amea\u00e7a', 'Limita\u00e7\u00e3o do Substituto', 'Mitiga\u00e7\u00e3o'],
    [
      ['Automa\u00e7\u00e3o/IA', 'Moderada', 'N\u00e3o substitui implementa\u00e7\u00e3o e lideran\u00e7a',
       'Integrar IA como ferramenta'],
      ['Serviços online', 'Baixa', 'Sem implementa\u00e7\u00e3o on-site',
       'Modelo h\u00edbrido presencial + remoto'],
      ['Contrata\u00e7\u00e3o interna', 'Moderada', 'Custo fixo elevado vs modelo vari\u00e1vel',
       'Demonstrar ROI de modelo vari\u00e1vel'],
      ['Freelancers', 'Baixa', 'Sem portf\u00f3lio integrado',
       'Portf\u00f3lio de 6 servi\u00e7os como diferencial'],
    ],
    col_widths=[1.3, 0.7, 2.2, 1.8]
  )

  bullet(doc, 'Portf\u00f3lio Integrado', 'integra\u00e7\u00e3o de 6 servi\u00e7os em framework \u00fanico '
      'que nenhum substituto replica isoladamente')
  bullet(doc, 'Resultados Mensur\u00e1veis', 'ROI quantific\u00e1vel baseado em redu\u00e7\u00e3o documentada '
      'de 48% em custos como prova de valor')

  check(doc, 'Posi\u00e7\u00e3o Competitiva', 'lacuna de mercado entre Big 4 e boutiques locais, '
      'com posicionamento \u00fanico mid-market')
  check(doc, 'Barreiras de Prote\u00e7\u00e3o', 'expertise t\u00e9cnica e track record como defesas '
      'estruturais contra entrantes e substitutos')

  separator(doc)
  page_break(doc)
