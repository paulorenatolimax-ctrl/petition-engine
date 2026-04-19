"""Section 4: OPERATIONAL PLAN \u2014 Expanded for 55-65 page target"""
from generate_bp_v2 import (p_text, bullet, check, num_item, table_sub,
               make_table, separator, page_break, highlight_box,
               add_footnote)


def build_section_4(doc):
  doc.add_heading('4. OPERATIONAL PLAN', level=1)
  p_text(doc, 'O plano operacional detalha a **infraestrutura f\u00edsica**, **recursos humanos**, '
      '**tecnologia** e **capacidade produtiva** da Vieira Operations LLC ao longo do '
      'horizonte de cinco anos de opera\u00e7\u00e3o.')

  p_text(doc, 'Este cap\u00edtulo apresenta o desenho operacional completo da empresa, desde o '
      'layout dos escrit\u00f3rios at\u00e9 a proje\u00e7\u00e3o de capacidade produtiva, '
      'demonstrando como a estrutura suporta o crescimento de **$550.080** (Y1) para '
      '**$2.504.721** (Y5) em receita bruta anual.')

  p_text(doc, 'A estrat\u00e9gia operacional segue o princ\u00edpio de **escala progressiva**: '
      'cada investimento em infraestrutura, pessoal e tecnologia \u00e9 acionado por '
      'gatilhos de demanda previamente definidos, evitando custos fixos prematuros.')

  # ================================================================
  # 4.1 Layout do Empreendimento
  # ================================================================
  doc.add_heading('4.1. Layout do Empreendimento', level=2)

  p_text(doc, 'O dimensionamento espacial segue metodologia de **planejamento progressivo**, '
      'alinhando a expans\u00e3o f\u00edsica \u00e0 demanda real do mercado e \u00e0 '
      'capacidade financeira da empresa em cada fase de crescimento.')

  p_text(doc, 'A estrutura distribui-se em **tr\u00eas fases de crescimento**, cada uma '
      'alinhada \u00e0 abertura de uma nova localidade no corredor log\u00edstico I-95, '
      'permitindo atendimento presencial aos clusters industriais do Sudeste americano.')

  p_text(doc, 'O modelo adotado combina **flex\u00edveis espa\u00e7os de coworking executivo** '
      'na fase inicial de cada localidade com a migra\u00e7\u00e3o para **escrit\u00f3rios '
      'dedicados** quando a opera\u00e7\u00e3o local atinge massa cr\u00edtica de '
      'especialistas e clientes.')

  # 4.1.1 Fase 1
  doc.add_heading('4.1.1. Fase 1 \u2014 Jacksonville, FL (Sede \u2014 Y0 a Y5)', level=3)

  p_text(doc, 'O escrit\u00f3rio de Jacksonville \u00e9 a **sede corporativa** e centro de '
      'opera\u00e7\u00f5es da empresa. Dimensionado entre **800 e 1.200 sqft**, o espa\u00e7o '
      'atende de 3 a 8 profissionais com custo mensal de **$2.000/m\u00eas**.')

  p_text(doc, 'O layout inclui \u00e1rea de recep\u00e7\u00e3o com branding corporativo, '
      'sala de reuni\u00f5es equipada com sistema de videoconfer\u00eancia Logitech Rally '
      'Plus, 6 a 8 esta\u00e7\u00f5es de trabalho individuais e uma \u00e1rea modular de '
      'treinamento com capacidade para 8 a 12 pessoas.')

  p_text(doc, 'Na fase inicial (Y0), a empresa utilizar\u00e1 um **espa\u00e7o de coworking '
      'executivo** no centro empresarial de Jacksonville, reduzindo o compromisso '
      'contratual e permitindo ajuste r\u00e1pido de escala conforme a demanda.')

  p_text(doc, 'A migra\u00e7\u00e3o para escrit\u00f3rio dedicado ocorre no **segundo '
      'semestre do Y1**, quando a base de clientes locais justifica a presen\u00e7a '
      'permanente e o custo fixo adicional. O contrato de loca\u00e7\u00e3o prev\u00ea '
      'cl\u00e1usula de expans\u00e3o para at\u00e9 1.500 sqft.')

  p_text(doc, 'O espa\u00e7o inclui **recep\u00e7\u00e3o** com branding corporativo, **sala de '
      'reuni\u00f5es** para 8 pessoas com videoconfer\u00eancia HD e tela interativa de 65", '
      'al\u00e9m de **6-8 esta\u00e7\u00f5es de trabalho** ergon\u00f4micas com monitores duplos 4K.')

  p_text(doc, 'A **\u00e1rea de treinamento** modular acomoda 8-12 pessoas com projetor Epson '
      'e quadro branco digital. O layout completa-se com copa equipada, sala de '
      'servidor/rede e almoxarifado para materiais did\u00e1ticos.')

  # 4.1.2 Fase 2
  doc.add_heading('4.1.2. Fase 2 \u2014 Savannah, GA (Branch 1 \u2014 Y2 a Y5)', level=3)

  p_text(doc, 'O escrit\u00f3rio de Savannah \u00e9 a **primeira expans\u00e3o regional**, '
      'posicionada para atender o cluster industrial do porto de Savannah \u2014 o **quarto '
      'maior porto de cont\u00eaineres dos EUA** com 5,9 milh\u00f5es de TEUs/ano.')

  p_text(doc, 'Dimensionado entre **600 e 900 sqft** com custo mensal de **$1.800/m\u00eas**, '
      'o espa\u00e7o acomoda de 2 a 4 especialistas. O layout reproduz a configura\u00e7\u00e3o '
      'da sede em escala reduzida, com \u00eanfase na sala de reuni\u00f5es para '
      'atendimento presencial a clientes da regi\u00e3o.')

  p_text(doc, 'A abertura do escrit\u00f3rio de Savannah \u00e9 condicionada ao atingimento '
      'de **3 contratos ativos** com clientes na regi\u00e3o de Savannah/Chatham County '
      'e receita local projetada de pelo menos **$180.000/ano**, garantindo que o '
      'investimento fixo seja sustentado pela demanda real.')

  p_text(doc, 'O layout inclui **sala de reuni\u00f5es** para 6 pessoas com videoconfer\u00eancia '
      'integrada, **4 esta\u00e7\u00f5es de trabalho** ergon\u00f4micas com monitores duplos e '
      '**\u00e1rea flex\u00edvel** modular para treinamentos com at\u00e9 8 participantes.')

  # 4.1.3 Fase 3
  doc.add_heading('4.1.3. Fase 3 \u2014 Brunswick, GA (Branch 2 \u2014 Y5+)', level=3)

  p_text(doc, 'O escrit\u00f3rio de Brunswick \u00e9 a **segunda expans\u00e3o regional**, '
      'direcionada ao cluster de manufatura naval e processos qu\u00edmicos da regi\u00e3o '
      'de Glynn County, que abriga instala\u00e7\u00f5es da Georgia-Pacific, Pinova e GP '
      'Cellulose.')

  p_text(doc, 'Dimensionado entre **400 e 600 sqft** com custo mensal de **$1.500/m\u00eas**, '
      'o espa\u00e7o opera como **escrit\u00f3rio sat\u00e9lite** com 2 a 3 posi\u00e7\u00f5es '
      'de trabalho. O layout prioriza flexibilidade, com m\u00f3veis modulares que '
      'permitem reconfigurar o espa\u00e7o para reuni\u00f5es com clientes.')

  p_text(doc, 'A abertura desta unidade \u00e9 condicionada ao atingimento de **2 contratos '
      'ativos** na regi\u00e3o e receita local projetada de **$120.000/ano**, seguindo o '
      'mesmo modelo de valida\u00e7\u00e3o aplicado em Savannah.')

  p_text(doc, 'O escrit\u00f3rio conta com **sala multiuso** para reuni\u00f5es e treinamento '
      '(6 pessoas), **2-3 esta\u00e7\u00f5es de trabalho** com monitores duplos e '
      'infraestrutura de rede redundante com **VPN para sede** em Jacksonville.')

  # Layout summary table
  table_sub(doc, 'Tabela 4.1a: Fases de Expans\u00e3o \u2014 Layout por Localidade')
  make_table(doc,
    ['Fase', 'Localidade', '\u00c1rea (sqft)', 'Custo Mensal', 'In\u00edcio',
     'Capacidade'],
    [
      ['Fase 1', 'Jacksonville, FL (sede)', '800-1.200', '$2.000/m\u00eas', 'Y0',
       '3-8 pessoas'],
      ['Fase 2', 'Savannah, GA (branch 1)', '600-900', '$1.800/m\u00eas', 'Y2',
       '2-4 pessoas'],
      ['Fase 3', 'Brunswick, GA (branch 2)', '400-600', '$1.500/m\u00eas', 'Y5',
       '2-3 pessoas'],
    ],
    col_widths=[0.7, 1.6, 0.8, 0.9, 0.6, 0.8]
  )

  table_sub(doc, 'Tabela 4.1b: Custo Acumulado de Aluguel (Y1-Y5)')
  make_table(doc,
    ['Localidade', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Total 5 Anos'],
    [
      ['Jacksonville, FL', '$24.000', '$24.000', '$24.000', '$24.000', '$24.000',
       '$120.000'],
      ['Savannah, GA', '\u2014', '$21.600', '$21.600', '$21.600', '$21.600',
       '$86.400'],
      ['Brunswick, GA', '\u2014', '\u2014', '\u2014', '\u2014', '$18.000',
       '$18.000'],
      ['**Total Anual**', '**$24.000**', '**$45.600**', '**$45.600**', '**$45.600**',
       '**$63.600**', '**$224.400**'],
    ],
    col_widths=[1.3, 0.8, 0.8, 0.8, 0.8, 0.8, 0.9]
  )

  p_text(doc, 'Cada escrit\u00f3rio inclui: **sala de reuni\u00f5es** com equipamento de '
      'videoconfer\u00eancia, **esta\u00e7\u00f5es de trabalho** individuais, **\u00e1rea '
      'de treinamento** modular e **infraestrutura de rede** com conectividade redundante.')

  p_text(doc, 'O investimento total em aluguel ao longo de 5 anos totaliza **$224.400**, '
      'representando aproximadamente **2,9%** da receita bruta acumulada de $7.619.836, '
      'dentro dos benchmarks de mercado para empresas de serviços profissionais (3-5% da receita).')

  highlight_box(doc, '**Modelo de Escala Progressiva:** cada localidade inicia em coworking '
         'executivo e migra para espa\u00e7o dedicado ap\u00f3s valida\u00e7\u00e3o '
         'de demanda, eliminando risco de custos fixos prematuros.')

  # ================================================================
  # 4.2 Recursos F\u00edsicos e Equipamentos
  # ================================================================
  doc.add_heading('4.2. Recursos F\u00edsicos e Equipamentos', level=2)

  p_text(doc, 'O investimento em **ativos tang\u00edveis** totaliza **$60.458** ao longo de '
      'cinco anos, distribu\u00eddo entre equipamentos de TI, mobili\u00e1rio corporativo '
      'e infraestrutura de treinamento para as tr\u00eas localidades.')

  p_text(doc, 'A estrat\u00e9gia de investimento prioriza **equipamentos de alta durabilidade** '
      'e **baixo custo de manuten\u00e7\u00e3o**, com ciclo de renova\u00e7\u00e3o de '
      '**4 anos** para hardware e **7 anos** para mobili\u00e1rio, alinhado \u00e0s '
      'melhores pr\u00e1ticas de deprecia\u00e7\u00e3o do IRS para small businesses.')

  p_text(doc, 'A pol\u00edtica de aquisi\u00e7\u00e3o de equipamentos segue o modelo '
      '**CAPEX escalonado**: cada localidade recebe o pacote b\u00e1sico de TI e '
      'mobili\u00e1rio no momento da abertura, com reposi\u00e7\u00f5es programadas '
      'conforme o ciclo de deprecia\u00e7\u00e3o de cada categoria de ativo.')

  p_text(doc, 'Todos os notebooks s\u00e3o configurados com **Dell Latitude 5540** ou '
      'equivalente, equipados com processador Intel Core i7, 32GB RAM e SSD 512GB, '
      'atendendo os requisitos de desempenho de SAP, Power BI e ferramentas de '
      'simula\u00e7\u00e3o de supply chain.')

  # 4.2.1 Equipment detail
  doc.add_heading('4.2.1. Investimentos em Equipamentos por Categoria', level=3)

  table_sub(doc, 'Tabela 4.2a: Investimentos em Equipamentos por Categoria')
  make_table(doc,
    ['Categoria', 'Especifica\u00e7\u00e3o', 'Unit\u00e1rio', 'Qtd (5a)', 'Total'],
    [
      ['Notebooks', 'Dell Latitude 5540, i7, 32GB, SSD 512GB', '$1.200', '14',
       '$16.800'],
      ['Monitores', 'Dell 27" 4K UltraSharp (dual setup)', '$450', '14', '$6.300'],
      ['Projetores', 'Epson EB-L200F para salas de treinamento', '$1.500', '3',
       '$4.500'],
      ['Mobili\u00e1rio', 'Esta\u00e7\u00f5es ergon\u00f4micas (mesa+cadeira)', '$800',
       '14', '$11.200'],
      ['Videoconfer\u00eancia', 'Logitech Rally Plus (sala reuni\u00e3o)', '$2.500',
       '3', '$7.500'],
      ['Rede/Infra', 'Switches, APs Ubiquiti, cabeamento Cat6', '$3.000', '3',
       '$9.000'],
      ['Impressora', 'HP LaserJet Pro MFP multifuncional', '$800', '3', '$2.400'],
      ['Diversos', 'Quadros brancos, material escrit\u00f3rio', '$2.758', '1',
       '$2.758'],
      ['', '', '', '**TOTAL**', '**$60.458**'],
    ],
    col_widths=[1.1, 2.0, 0.8, 0.6, 0.8]
  )

  p_text(doc, 'A sele\u00e7\u00e3o de fornecedores prioriza **marcas empresariais** com '
      'garantia estendida de 3 a 5 anos (Dell ProSupport, HP Care Pack), reduzindo o '
      'custo total de propriedade e minimizando downtime operacional.')

  # 4.2.2 Depreciation
  doc.add_heading('4.2.2. Deprecia\u00e7\u00e3o de Ativos', level=3)

  p_text(doc, 'O cronograma de deprecia\u00e7\u00e3o segue as diretrizes do **IRS Publication '
      '946** para small businesses, utilizando o m\u00e9todo **MACRS** (Modified Accelerated '
      'Cost Recovery System) com as classes de vida \u00fatil definidas por categoria.')

  p_text(doc, 'A empresa poder\u00e1 eleger a dedu\u00e7\u00e3o prevista na **Se\u00e7\u00e3o '
      '179 do IRS Code**, permitindo a deprecia\u00e7\u00e3o integral de equipamentos no '
      'ano da aquisi\u00e7\u00e3o, otimizando o beneficio fiscal nos anos iniciais '
      'de opera\u00e7\u00e3o.')

  table_sub(doc, 'Tabela 4.2b: Cronograma de Deprecia\u00e7\u00e3o por Categoria')
  make_table(doc,
    ['Categoria', 'Valor Total', 'Vida \u00datil', 'Deprec. Anual', 'M\u00e9todo'],
    [
      ['Notebooks', '$16.800', '4 anos', '$4.200/ano', 'MACRS 5-Year'],
      ['Monitores', '$6.300', '4 anos', '$1.575/ano', 'MACRS 5-Year'],
      ['Projetores', '$4.500', '5 anos', '$900/ano', 'MACRS 5-Year'],
      ['Mobili\u00e1rio', '$11.200', '7 anos', '$1.600/ano', 'MACRS 7-Year'],
      ['Videoconfer\u00eancia', '$7.500', '5 anos', '$1.500/ano', 'MACRS 5-Year'],
      ['Rede/Infraestrutura', '$9.000', '5 anos', '$1.800/ano', 'MACRS 5-Year'],
      ['Impressoras', '$2.400', '5 anos', '$480/ano', 'MACRS 5-Year'],
      ['Diversos', '$2.758', '5 anos', '$552/ano', 'MACRS 5-Year'],
      ['**Total**', '**$60.458**', '', '**$12.607/ano**', ''],
    ],
    col_widths=[1.2, 0.9, 0.8, 1.0, 1.0]
  )

  # 4.2.3 Investment timeline
  doc.add_heading('4.2.3. Cronograma de Investimento por Localidade', level=3)

  p_text(doc, 'O investimento em equipamentos distribui-se de forma **escalonada** ao longo '
      'dos cinco anos, concentrando o CAPEX inicial no Y0 (abertura da sede) e alinhando '
      'os investimentos subsequentes \u00e0 abertura de cada nova localidade.')

  table_sub(doc, 'Tabela 4.2c: Cronograma de Investimento em Equipamentos')
  make_table(doc,
    ['Ano', 'Jacksonville', 'Savannah', 'Brunswick', 'Total', 'Descri\u00e7\u00e3o'],
    [
      ['Y0', '$25.000', '\u2014', '\u2014', '$25.000',
       'Setup inicial da sede: notebooks, monitores, mob.'],
      ['Y1', '$5.000', '\u2014', '\u2014', '$5.000',
       'Amplia\u00e7\u00e3o de esta\u00e7\u00f5es de trabalho'],
      ['Y2', '$3.000', '$18.000', '\u2014', '$21.000',
       'Abertura Savannah + reposi\u00e7\u00f5es JAX'],
      ['Y3-Y4', '$2.000', '$3.000', '\u2014', '$5.000',
       'Reposi\u00e7\u00f5es e upgrades programados'],
      ['Y5', '$1.500', '$1.500', '$12.000', '$15.000',
       'Abertura Brunswick + renova\u00e7\u00e3o ciclo 4a'],
    ],
    col_widths=[0.5, 0.9, 0.9, 0.9, 0.8, 2.0]
  )

  p_text(doc, 'O modelo de investimento escalonado resulta em **CAPEX m\u00e9dio anual de '
      '$14.200**, distribu\u00eddo de forma proporcional ao crescimento da receita e '
      'garantindo que o investimento em ativos nunca ultrapasse **3% da receita bruta**.')

  highlight_box(doc, '**Beneficio Fiscal Section 179:** a dedu\u00e7\u00e3o integral no ano '
         'de aquisi\u00e7\u00e3o permite recuperar at\u00e9 **$60.458** em '
         'base tribut\u00e1vel ao longo de 5 anos, otimizando o fluxo de caixa '
         'nos anos iniciais.')

  # ================================================================
  # 4.3 Quadro de Funcion\u00e1rios
  # ================================================================
  doc.add_heading('4.3. Quadro de Funcion\u00e1rios', level=2)

  p_text(doc, 'A estrutura de pessoal projeta crescimento de **3 para 14 colaboradores** '
      'entre Y1 e Y5, distribu\u00eddos entre as tr\u00eas localidades conforme a '
      'demanda do mercado e a capacidade financeira de cada fase.')

  p_text(doc, 'A pol\u00edtica de remunera\u00e7\u00e3o posiciona os sal\u00e1rios no '
      '**percentil 60-75** do mercado local, equilibrando atratividade para talentos '
      'qualificados com sustentabilidade financeira do empreendimento.')

  p_text(doc, 'O recrutamento prioriza profissionais com **experi\u00eancia pr\u00e1tica** '
      'em supply chain, opera\u00e7\u00f5es industriais ou implementa\u00e7\u00e3o de '
      'ERP, complementados por habilidades em comunica\u00e7\u00e3o e gest\u00e3o de '
      'projetos que viabilizam a entrega consultiva de alto valor.')

  # 4.3.1 Org structure
  doc.add_heading('4.3.1. Estrutura Organizacional', level=3)

  p_text(doc, 'A empresa adota uma estrutura **horizontal e matricial**, com tr\u00eas '
      'n\u00edveis hier\u00e1rquicos: **Dire\u00e7\u00e3o** (fundador), **Especialistas** '
      '(senior, pleno, analista) e **Suporte** (administrativo, estagi\u00e1rio).')

  p_text(doc, 'O fundador, **Everton Rodrigo Vieira**, acumula as fun\u00e7\u00f5es de '
      'CEO, Diretor Comercial e Especialista Principal nos primeiros dois anos de '
      'opera\u00e7\u00e3o, delegando progressivamente as fun\u00e7\u00f5es comerciais '
      'e de entrega conforme a equipe cresce.')

  p_text(doc, 'A partir do Y2, a contrata\u00e7\u00e3o de um **Assistente Administrativo** '
      'libera o fundador de tarefas operacionais (agenda, faturamento, log\u00edstica '
      'de viagem), permitindo foco integral em serviços profissionais estrat\u00e9gica e '
      'desenvolvimento de neg\u00f3cios.')

  p_text(doc, 'No Y4, a adi\u00e7\u00e3o de um **Estagi\u00e1rio** cria pipeline de '
      'desenvolvimento de talentos internos, permitindo que analistas juniores '
      'sejam promovidos a especialistas plenos com base em desempenho documentado.')

  num_item(doc, 1, 'N\u00edvel 1 \u2014 Dire\u00e7\u00e3o', 'Fundador/CEO com atua\u00e7\u00e3o '
       'em estrat\u00e9gia comercial, gest\u00e3o de contas-chave e serviços profissionais '
       'de alto impacto')
  num_item(doc, 2, 'N\u00edvel 2 \u2014 Especialistas', 'Especialistas Senior, Pleno e '
       'Analistas com foco em entrega de projetos e atendimento a clientes')
  num_item(doc, 3, 'N\u00edvel 3 \u2014 Suporte', 'Assistente Administrativo e '
       'Estagi\u00e1rios com foco em opera\u00e7\u00f5es internas e '
       'desenvolvimento profissional')

  # 4.3.2 Staffing table
  doc.add_heading('4.3.2. Quadro de Pessoal por Cargo e Localidade', level=3)

  p_text(doc, 'O quadro a seguir detalha a evolu\u00e7\u00e3o do headcount por cargo, '
      'localidade e ano, demonstrando o crescimento gradual alinhado \u00e0 expans\u00e3o '
      'geogr\u00e1fica e \u00e0 demanda de mercado.')

  table_sub(doc, 'Tabela 4.3a: Quadro de Funcion\u00e1rios por Cargo e Localidade')
  make_table(doc,
    ['Cargo', 'Local', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Sal\u00e1rio Anual'],
    [
      ['Diretor/Fundador', 'JAX', '1', '1', '1', '1', '1', '$95.000'],
      ['Especialista Senior', 'JAX', '1', '2', '2', '2', '3', '$75.000'],
      ['Especialista Pleno', 'JAX/SAV', '1', '2', '3', '3', '4', '$60.000'],
      ['Analista', 'JAX/SAV/BRU', '\u2014', '1', '2', '2', '3', '$45.000'],
      ['Assistente Admin', 'JAX', '\u2014', '1', '1', '1', '1', '$38.000'],
      ['Estagi\u00e1rio', 'JAX/SAV', '\u2014', '\u2014', '\u2014', '1', '2', '$22.000'],
      ['**Total**', '', '**3**', '**7**', '**9**', '**10**', '**14**', ''],
    ],
    col_widths=[1.3, 0.7, 0.5, 0.5, 0.5, 0.5, 0.5, 1.0]
  )

  # Detailed role descriptions
  doc.add_heading('4.3.3. Descri\u00e7\u00e3o de Cargos', level=3)

  p_text(doc, 'Cada cargo possui **perfil de compet\u00eancias** definido, com requisitos '
      't\u00e9cnicos e comportamentais alinhados \u00e0s seis linhas de servi\u00e7o da '
      'empresa. As descri\u00e7\u00f5es a seguir detalham as responsabilidades e '
      'qualifica\u00e7\u00f5es de cada posi\u00e7\u00e3o.')

  p_text(doc, 'O **Diretor/Fundador** ($95.000) lidera a estrat\u00e9gia, o desenvolvimento '
      'de neg\u00f3cios e a empresa de serviços de alto impacto, com requisito de 15+ anos em '
      'supply chain. O **Especialista Senior** ($75.000) conduz projetos complexos e '
      'mentora a equipe, exigindo 8+ anos de experi\u00eancia.')

  p_text(doc, 'O **Especialista Pleno** ($60.000) executa projetos e facilita treinamentos, '
      'com 4+ anos de experi\u00eancia. O **Analista** ($45.000) realiza pesquisa de '
      'mercado e an\u00e1lise de dados em projetos de supply chain e ERP, '
      'com 1-3 anos de experi\u00eancia ou MBA recente.')

  p_text(doc, 'O **Assistente Administrativo** ($38.000) gerencia agenda, faturamento e '
      'log\u00edstica, enquanto o **Estagi\u00e1rio** ($22.000) apoia projetos e organiza '
      'materiais de treinamento, devendo estar matriculado em gradua\u00e7\u00e3o correlata.')

  # 4.3.4 Headcount by location
  doc.add_heading('4.3.4. Distribui\u00e7\u00e3o por Localidade', level=3)

  p_text(doc, 'A distribui\u00e7\u00e3o geogr\u00e1fica dos colaboradores acompanha a '
      'abertura de novas localidades, com a sede de Jacksonville concentrando a maior '
      'parte do headcount ao longo de todo o horizonte de planejamento.')

  table_sub(doc, 'Tabela 4.3b: Distribui\u00e7\u00e3o de Headcount por Localidade')
  make_table(doc,
    ['Localidade', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
    [
      ['Jacksonville, FL', '3', '5', '6', '7', '8'],
      ['Savannah, GA', '\u2014', '2', '3', '3', '4'],
      ['Brunswick, GA', '\u2014', '\u2014', '\u2014', '\u2014', '2'],
      ['**Total**', '**3**', '**7**', '**9**', '**10**', '**14**'],
    ],
    col_widths=[1.5, 0.9, 0.9, 0.9, 0.9, 0.9]
  )

  # 4.3.5 Personnel costs
  doc.add_heading('4.3.5. Custos de Pessoal Projetados', level=3)

  p_text(doc, 'Os custos de pessoal representam a **maior categoria de despesa operacional**, '
      'correspondendo a aproximadamente **53%** da receita bruta no Y1, diminuindo '
      'progressivamente para **44%** no Y5 conforme a escala operacional gera '
      'efici\u00eancia.')

  p_text(doc, 'Al\u00e9m dos sal\u00e1rios brutos, os custos incluem **payroll taxes** '
      '(FICA, FUTA, SUTA) e **benef\u00edcios** (seguro sa\u00fade, 401k match, PTO). '
      'A al\u00edquota de payroll taxes varia por estado: **15,62%** na Florida e '
      '**15,93%** na Georgia, refletindo a diferen\u00e7a no SUTA rate.')

  p_text(doc, 'A Florida n\u00e3o cobra **imposto de renda estadual**, conferindo vantagem '
      'competitiva na atra\u00e7\u00e3o de talentos em rela\u00e7\u00e3o a estados '
      'vizinhos como a Georgia (5,49% flat rate em 2024). Este diferencial \u00e9 '
      'destacado no pacote de compensa\u00e7\u00e3o oferecido aos colaboradores.')

  table_sub(doc, 'Tabela 4.3c: Custos de Pessoal Projetados (Y1-Y5)')
  make_table(doc,
    ['Item', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
    [
      ['Sal\u00e1rios Brutos', '$230.000', '$410.000', '$533.000', '$588.000',
       '$758.000'],
      ['Payroll Taxes (15,6%)', '$35.880', '$63.960', '$83.148', '$91.728',
       '$118.248'],
      ['Benef\u00edcios (12%)', '$27.600', '$49.200', '$63.960', '$70.560',
       '$90.960'],
      ['**Total Pessoal**', '**$293.480**', '**$523.160**', '**$680.108**',
       '**$750.288**', '**$967.208**'],
    ],
    col_widths=[1.5, 1.0, 1.0, 1.0, 1.0, 1.0]
  )

  table_sub(doc, 'Tabela 4.3d: Payroll Taxes \u2014 Detalhamento por Componente')
  make_table(doc,
    ['Componente', 'Al\u00edquota', 'Base', 'Observa\u00e7\u00e3o'],
    [
      ['FICA \u2014 Social Security', '6,20%', 'At\u00e9 $168.600/ano (2024)',
       'Empregador + empregado'],
      ['FICA \u2014 Medicare', '1,45%', 'Sem limite',
       'Empregador + empregado'],
      ['FUTA (Federal)', '0,60%', 'At\u00e9 $7.000/ano/empregado',
       'Ap\u00f3s cr\u00e9dito estadual'],
      ['SUTA Florida', '2,70%', 'At\u00e9 $7.000/ano/empregado',
       'New employer rate FL'],
      ['SUTA Georgia', '2,70%', 'At\u00e9 $9.500/ano/empregado',
       'New employer rate GA'],
      ['Workers Comp', '~1,0%', 'Folha total',
       'Classificado por NAICS 541611'],
    ],
    col_widths=[1.5, 0.8, 1.5, 1.8]
  )

  p_text(doc, 'O custo total de pessoal projetado para o per\u00edodo Y1-Y5 \u00e9 de '
      '**$3.214.244**, com crescimento m\u00e9dio anual de **35%**, desacelerando para '
      '**29%** entre Y4 e Y5 \u00e0 medida que a equipe atinge massa cr\u00edtica.')

  highlight_box(doc, '**Vantagem Competitiva Florida:** a aus\u00eancia de imposto de renda '
         'estadual permite oferecer sal\u00e1rios nominais **8-12% superiores** em '
         'compensa\u00e7\u00e3o l\u00edquida comparada a estados com tributa\u00e7\u00e3o '
         'estadual, fortalecendo a atra\u00e7\u00e3o de talentos.')

  # ================================================================
  # 4.4 Recursos Tecnol\u00f3gicos
  # ================================================================
  doc.add_heading('4.4. Recursos Tecnol\u00f3gicos', level=2)

  p_text(doc, 'A infraestrutura tecnol\u00f3gica combina plataformas de **classe empresarial** '
      'com ferramentas de **produtividade** e **colabora\u00e7\u00e3o**, suportando as '
      'seis linhas de servi\u00e7o da empresa com investimento anual controlado.')

  p_text(doc, 'A sele\u00e7\u00e3o de plataformas prioriza **solu\u00e7\u00f5es SaaS** '
      '(Software as a Service) que eliminam custos de infraestrutura local, oferecem '
      'escalabilidade autom\u00e1tica e garantem acesso remoto seguro para especialistas '
      'em campo junto a clientes.')

  p_text(doc, 'O investimento tecnol\u00f3gico anual por localidade \u00e9 de **$21.000**, '
      'totalizando **$21.000** no Y1, **$42.000** a partir do Y2 (duas localidades) e '
      '**$63.000** a partir do Y5 (tr\u00eas localidades). Este custo representa '
      'aproximadamente **3,8%** da receita bruta no Y1, caindo para **2,9%** no Y5.')

  # 4.4.1 Platform detail
  doc.add_heading('4.4.1. Plataformas por Pilar de Servi\u00e7o', level=3)

  table_sub(doc, 'Tabela 4.4a: Plataformas Tecnol\u00f3gicas por Pilar de Servi\u00e7o')
  make_table(doc,
    ['Pilar', 'Plataforma', 'Fun\u00e7\u00e3o', 'Custo Anual'],
    [
      ['Supply Chain', 'SAP S/4HANA (demo), AnyLogistix',
       'Modelagem e simula\u00e7\u00e3o de cadeias', '$2.400'],
      ['ERP', 'SAP Fiori (sandbox), MS Dynamics',
       'Ambiente de treinamento e demonstra\u00e7\u00e3o', '$3.600'],
      ['Compliance', 'ComplianceQuest, Intelex',
       'Gest\u00e3o de conformidade regulat\u00f3ria', '$1.800'],
      ['Treinamento', 'Moodle LMS, Zoom Enterprise',
       'Plataforma de e-learning e webinars', '$2.400'],
      ['Produtividade', 'MS Office 365 Business Premium',
       'Colabora\u00e7\u00e3o, email e documenta\u00e7\u00e3o', '$4.200'],
      ['Analytics', 'Power BI Pro, Tableau',
       'Dashboards e relat\u00f3rios de gest\u00e3o', '$1.800'],
      ['CRM', 'HubSpot Professional',
       'Gest\u00e3o de pipeline comercial e leads', '$4.800'],
      ['', '', '**Total Anual (por local)**', '**$21.000**'],
    ],
    col_widths=[1.1, 1.8, 1.8, 0.8]
  )

  # 4.4.2 Justification
  doc.add_heading('4.4.2. Justificativa de Sele\u00e7\u00e3o', level=3)

  p_text(doc, 'Cada plataforma foi selecionada com base em tr\u00eas crit\u00e9rios: '
      '**ader\u00eancia ao servi\u00e7o** prestado, **custo-benef\u00edcio** para '
      'escala de PME e **interoperabilidade** com o restante do stack tecnol\u00f3gico.')

  p_text(doc, 'O **SAP S/4HANA e Fiori** constituem o n\u00facleo da opera\u00e7\u00e3o: o fundador '
      'possui 25 anos de experi\u00eancia no ecossistema SAP, incluindo implementa\u00e7\u00e3o '
      'do Fiori 2 anos e 4 meses antes do cronograma na AB InBev. Ambientes '
      'demo/sandbox permitem demonstra\u00e7\u00e3o de capacidade real ao cliente.')

  p_text(doc, 'Para analytics e gest\u00e3o de projetos, a empresa utiliza **Power BI Pro** '
      '(dashboards executivos integrados ao Office 365) e **MS Project** (padr\u00e3o '
      'de mercado para gest\u00e3o de serviços profissionais com familiaridade universal entre '
      'clientes corporativos).')

  p_text(doc, 'A camada comercial opera sobre **HubSpot CRM** (automa\u00e7\u00e3o de marketing '
      'e pipeline de vendas B2B), enquanto a capacita\u00e7\u00e3o utiliza **Moodle LMS** '
      '(e-learning personaliz\u00e1vel com certifica\u00e7\u00e3o automatizada). Para compliance, '
      '**ComplianceQuest + Intelex** gerenciam conformidade EPA, OSHA e FDA.')

  # 4.4.3 Technology cost projection
  doc.add_heading('4.4.3. Proje\u00e7\u00e3o de Custos Tecnol\u00f3gicos (Y1-Y5)', level=3)

  table_sub(doc, 'Tabela 4.4b: Custo Tecnol\u00f3gico Anual por Localidade')
  make_table(doc,
    ['Localidade', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
    [
      ['Jacksonville, FL', '$21.000', '$21.000', '$21.000', '$21.000', '$21.000'],
      ['Savannah, GA', '\u2014', '$21.000', '$21.000', '$21.000', '$21.000'],
      ['Brunswick, GA', '\u2014', '\u2014', '\u2014', '\u2014', '$21.000'],
      ['**Total Anual**', '**$21.000**', '**$42.000**', '**$42.000**', '**$42.000**',
       '**$63.000**'],
    ],
    col_widths=[1.5, 0.9, 0.9, 0.9, 0.9, 0.9]
  )

  p_text(doc, 'O custo tecnol\u00f3gico total acumulado em 5 anos \u00e9 de **$210.000**, '
      'com crescimento escalonado vinculado exclusivamente \u00e0 abertura de novas '
      'localidades. Dentro de cada localidade, o custo permanece est\u00e1vel em '
      '$21.000/ano devido ao modelo SaaS com licenciamento por usu\u00e1rio.')

  # 4.4.4 Cybersecurity
  doc.add_heading('4.4.4. Seguran\u00e7a da Informa\u00e7\u00e3o', level=3)

  p_text(doc, 'A empresa adota **pol\u00edtica de seguran\u00e7a em camadas** alinhada ao '
      'framework **NIST Cybersecurity Framework**, abrangendo prote\u00e7\u00e3o de '
      'dados de clientes, controle de acesso e continuidade de neg\u00f3cios.')

  p_text(doc, 'A prote\u00e7\u00e3o inclui **MFA obrigat\u00f3rio** para todos os sistemas, '
      'criptografia **AES-256** para dados em repouso e **TLS 1.3** em tr\u00e2nsito, '
      'al\u00e9m de backup di\u00e1rio automatizado com reten\u00e7\u00e3o de 90 dias e testes '
      'mensais de restaura\u00e7\u00e3o.')

  p = p_text(doc, 'A empresa planeja ader\u00eancia a **SOC 2 Type I** nos primeiros 18 meses '
      'de opera\u00e7\u00e3o, com roadmap para **SOC 2 Type II** no Y3, atendendo \u00e0s '
      'exig\u00eancias de clientes corporativos e do setor de defesa.')
  add_footnote(doc, p, 'AICPA, SOC 2 Trust Services Criteria \u2014 framework de seguran\u00e7a, '
         'disponibilidade e confidencialidade para provedores de servi\u00e7os.')

  highlight_box(doc, '**Stack 100% SaaS:** a ado\u00e7\u00e3o integral de solu\u00e7\u00f5es '
         'em nuvem elimina custos de infraestrutura local (servidores, storage), '
         'reduz riscos de seguran\u00e7a e garante escalabilidade autom\u00e1tica.')

  # ================================================================
  # 4.5 Localiza\u00e7\u00e3o do Neg\u00f3cio
  # ================================================================
  doc.add_heading('4.5. Localiza\u00e7\u00e3o do Neg\u00f3cio', level=2)

  p_text(doc, 'A sele\u00e7\u00e3o de **Jacksonville, Florida**, como sede operacional '
      'fundamenta-se em converg\u00eancia de fatores estrat\u00e9gicos que maximizam o '
      'acesso ao mercado-alvo e minimizam custos operacionais.')


  # 4.5.1 Jacksonville
  doc.add_heading('4.5.1. Jacksonville, FL \u2014 Sede Corporativa', level=3)

  p_text(doc, 'A \u00e1rea metropolitana de Jacksonville concentra **mais de 2.300 empresas '
      'manufatureiras**, um PIB de **$82 bilh\u00f5es** (2023) e taxa de desemprego de '
      '**3,2%** \u2014 indicadores que apontam economia aquecida com demanda latente por '
      'servi\u00e7os de serviços operacionais.')


  table_sub(doc, 'Tabela 4.5a: Perfil Econ\u00f4mico \u2014 Condado de Duval (Jacksonville)')
  make_table(doc,
    ['Indicador', 'Valor', 'Fonte'],
    [
      ['Popula\u00e7\u00e3o (MSA)', '1.605.000 (2023)', 'U.S. Census Bureau'],
      ['PIB Metropolitano', '$82 bilh\u00f5es (2023)', 'Bureau of Economic Analysis'],
      ['Taxa de Desemprego', '3,2% (dez/2023)', 'Bureau of Labor Statistics'],
      ['Empresas Manufatureiras', '2.300+', 'Jacksonville Chamber of Commerce'],
      ['Portos Estrat\u00e9gicos DoD', 'JAXPORT (1 de 17)', 'Department of Defense'],
      ['Custo de Vida', '12% abaixo m\u00e9dia nacional', 'BLS Cost of Living Index'],
      ['Imposto Renda Estadual', '0% (Florida)', 'Florida Dept. of Revenue'],
      ['Corporate Tax Rate', '5,5% (Florida)', 'Florida Dept. of Revenue'],
    ],
    col_widths=[2.0, 1.8, 2.0]
  )

  # 4.5.2 Savannah
  doc.add_heading('4.5.2. Savannah, GA \u2014 Branch 1 (Y2)', level=3)

  p_text(doc, 'Savannah abriga o **quarto maior porto de cont\u00eaineres dos EUA** (Georgia '
      'Ports Authority), com volume de **5,9 milh\u00f5es de TEUs/ano** (2023) e '
      'investimento de **$5,6 bilh\u00f5es** em expans\u00e3o programada at\u00e9 2028.')

  p_text(doc, 'A \u00e1rea metropolitana de Savannah possui **popula\u00e7\u00e3o de 404.000** '
      'habitantes e concentra mais de **600 empresas de log\u00edstica e manufatura**, '
      'muitas delas fornecedores diretos da cadeia portu\u00e1ria que demandam servi\u00e7os '
      'de otimiza\u00e7\u00e3o operacional e compliance.')


  table_sub(doc, 'Tabela 4.5b: Perfil Econ\u00f4mico \u2014 Savannah MSA')
  make_table(doc,
    ['Indicador', 'Valor', 'Fonte'],
    [
      ['Popula\u00e7\u00e3o (MSA)', '404.000 (2023)', 'U.S. Census Bureau'],
      ['Porto de Savannah', '5,9M TEUs/ano (2023)', 'Georgia Ports Authority'],
      ['Investimento Portu\u00e1rio', '$5,6 bilh\u00f5es at\u00e9 2028',
       'Georgia Ports Authority'],
      ['Empresas Log\u00edst./Manuf.', '600+', 'Savannah Economic Dev. Authority'],
      ['Taxa de Desemprego', '3,5% (2023)', 'Bureau of Labor Statistics'],
      ['Corporate Tax Rate', '5,75% (Georgia)', 'Georgia Dept. of Revenue'],
      ['Imposto Renda Estadual', '5,49% flat (2024)', 'Georgia Dept. of Revenue'],
    ],
    col_widths=[2.0, 1.8, 2.0]
  )


  # 4.5.3 Brunswick
  doc.add_heading('4.5.3. Brunswick, GA \u2014 Branch 2 (Y5+)', level=3)

  p_text(doc, 'Brunswick, localizada no **condado de Glynn**, \u00e9 hub de manufatura '
      'qu\u00edmica e processamento de celulose, abrigando opera\u00e7\u00f5es da '
      '**Georgia-Pacific**, **Pinova** e **GP Cellulose** com investimentos combinados '
      'superiores a **$1,2 bilh\u00e3o** em ativos industriais.')

  p_text(doc, 'A \u00e1rea metropolitana possui **popula\u00e7\u00e3o de 120.000** habitantes '
      'e o **Colonel\u2019s Island Terminal** (Georgia Ports) \u2014 segundo maior terminal '
      'de importa\u00e7\u00e3o de ve\u00edculos dos EUA \u2014 gerando demanda por '
      'compliance ambiental (EPA) e otimiza\u00e7\u00e3o log\u00edstica.')


  table_sub(doc, 'Tabela 4.5c: Perfil Econ\u00f4mico \u2014 Brunswick MSA')
  make_table(doc,
    ['Indicador', 'Valor', 'Fonte'],
    [
      ['Popula\u00e7\u00e3o (MSA)', '120.000 (2023)', 'U.S. Census Bureau'],
      ['Colonel\u2019s Island Port', '750K ve\u00edculos/ano', 'Georgia Ports Authority'],
      ['Ind\u00fastrias Principais', 'Georgia-Pacific, Pinova, GP Cellulose',
       'Glynn County EDA'],
      ['Investimento Industrial', '$1,2+ bilh\u00e3o em ativos', 'Georgia Dept. of '
       'Econ. Development'],
      ['Taxa de Desemprego', '3,8% (2023)', 'Bureau of Labor Statistics'],
      ['Custo de Vida', '18% abaixo m\u00e9dia nacional', 'BLS Cost of Living Index'],
    ],
    col_widths=[2.0, 1.8, 2.0]
  )

  # Location strategic summary
  doc.add_heading('4.5.4. Corredor I-95: Vis\u00e3o Estrat\u00e9gica Integrada', level=3)

  p_text(doc, 'As tr\u00eas localidades formam um **corredor estrat\u00e9gico de 150 '
      'milhas** ao longo da I-95, cobrindo os principais clusters industriais e '
      'portu\u00e1rios da costa Sudeste dos EUA.')


  table_sub(doc, 'Tabela 4.5d: Cobertura Geogr\u00e1fica Combinada (3 Localidades)')
  make_table(doc,
    ['M\u00e9trica', 'Jacksonville', 'Savannah', 'Brunswick', 'Combinado'],
    [
      ['Popula\u00e7\u00e3o MSA', '1.605.000', '404.000', '120.000', '2.129.000'],
      ['Empresas Manufat.', '2.300+', '600+', '150+', '3.050+'],
      ['PIB Regional', '$82B', '$22B', '$5B', '$109B'],
      ['Raio Atendimento', '75 mi', '60 mi', '50 mi', '150 mi corredor'],
    ],
    col_widths=[1.3, 1.1, 1.1, 1.1, 1.1]
  )

  highlight_box(doc, '**Corredor I-95 Sudeste:** as tr\u00eas localidades cobrem um mercado '
         'combinado de **$109 bilh\u00f5es em PIB regional**, **3.050+ empresas '
         'manufatureiras** e **2,1 milh\u00f5es de habitantes**, com atendimento '
         'presencial no mesmo dia para qualquer cliente da regi\u00e3o.')

  # ================================================================
  # 4.6 Capacidade Produtiva
  # ================================================================
  doc.add_heading('4.6. Capacidade Produtiva', level=2)

  p_text(doc, 'A capacidade operacional projeta crescimento de **355%** entre Y1 e Y5, '
      'de **$550.080** para **$2.504.721** em receita bruta anual, sustentado pela '
      'expans\u00e3o da equipe e pela abertura de novas localidades.')

  p_text(doc, 'A taxa de utiliza\u00e7\u00e3o parte de **75% no Y1** e progride at\u00e9 '
      '**90% no Y5** (benchmark **85-92%** para empresas mid-market maduras), com '
      '**1.600 a 1.700 horas fatur\u00e1veis** por especialista ao ano.')

  # 4.6.1 Main capacity table
  doc.add_heading('4.6.1. Capacidade Produtiva por Ano', level=3)

  table_sub(doc, 'Tabela 4.6a: Capacidade Produtiva por Ano')
  make_table(doc,
    ['Indicador', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
    [
      ['Especialistas Ativos', '3', '6', '8', '9', '12'],
      ['Horas Fatur\u00e1veis/Especialista', '1.600', '1.650', '1.700', '1.700', '1.700'],
      ['Total Horas Fatur\u00e1veis', '4.800', '9.900', '13.600', '15.300', '20.400'],
      ['Taxa M\u00e9dia/Hora', '$115', '$102', '$131', '$116', '$123'],
      ['Receita Bruta', '$550.080', '$1.008.480', '$1.775.664', '$1.780.891', '$2.504.721'],
      ['Utiliza\u00e7\u00e3o Projetada', '75%', '80%', '85%', '85%', '90%'],
    ],
    col_widths=[1.8, 0.9, 0.9, 0.9, 0.9, 0.9]
  )

  # 4.6.2 Revenue by location
  doc.add_heading('4.6.2. Receita por Localidade', level=3)

  table_sub(doc, 'Tabela 4.6c: Distribui\u00e7\u00e3o de Receita por Localidade')
  make_table(doc,
    ['Localidade', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
    [
      ['Jacksonville, FL', '$550.080', '$605.088', '$994.372', '$1.068.535',
       '$1.252.361'],
      ['Savannah, GA', '\u2014', '$403.392', '$781.292', '$712.356',
       '$1.001.888'],
      ['Brunswick, GA', '\u2014', '\u2014', '\u2014', '\u2014', '$250.472'],
      ['**Total**', '**$550.080**', '**$1.008.480**', '**$1.775.664**',
       '**$1.780.891**', '**$2.504.721**'],
    ],
    col_widths=[1.5, 0.9, 0.9, 0.9, 0.9, 0.9]
  )

  # 4.6.3 Capacity drivers
  doc.add_heading('4.6.3. Vetores de Crescimento de Capacidade', level=3)

  p_text(doc, 'O crescimento da capacidade produtiva \u00e9 sustentado por tr\u00eas '
      'vetores complementares que atuam simultaneamente para expandir a base de receita '
      'de forma sustent\u00e1vel.')

  num_item(doc, 1, 'Expans\u00e3o Geogr\u00e1fica', 'abertura de Savannah (Y2) e '
       'Brunswick (Y5) adiciona novos mercados sem canibalizar Jacksonville, '
       'ampliando o TAM (Total Addressable Market) de $82B para $109B em PIB regional')

  num_item(doc, 2, 'Contrata\u00e7\u00e3o Progressiva', 'crescimento de 3 para 14 '
       'colaboradores com perfis complementares que expandem o leque de servi\u00e7os '
       'entregues e permitem atendimento simult\u00e2neo de mais clientes')

  num_item(doc, 3, 'Maturidade Operacional', 'aumento da utiliza\u00e7\u00e3o de 75% '
       'para 90% reflete pipeline preench\u00edvel, reputa\u00e7\u00e3o consolidada '
       'e efici\u00eancia operacional crescente')

  # Final checks/highlights
  check(doc, 'Infraestrutura Completa', 'tr\u00eas escrit\u00f3rios estrategicamente '
      'posicionados no corredor I-95 do Sudeste americano, cobrindo mercado de '
      '$109B em PIB regional')
  check(doc, 'Equipe Qualificada', '14 colaboradores projetados no Y5 com sal\u00e1rios '
      'competitivos no percentil 60-75 do mercado local e custos controlados')
  check(doc, 'Tecnologia Integrada', 'stack tecnol\u00f3gico 100% SaaS cobrindo as 6 '
      'linhas de servi\u00e7o com investimento de $21.000/ano por localidade')
  check(doc, 'Capacidade Escal\u00e1vel', 'modelo de crescimento progressivo de $550K '
      'para $2,5M em receita bruta com utiliza\u00e7\u00e3o evoluindo de 75% a 90%')

  highlight_box(doc, '**S\u00edntese Operacional:** a Vieira Operations LLC projeta '
         'opera\u00e7\u00e3o enxuta e escal\u00e1vel, com custos fixos controlados '
         '(aluguel 3,2% da receita, tecnologia 2,9%, equipamentos 3%), equipe de '
         '14 profissionais e capacidade de **$2,5M em receita bruta** no Y5.')

  separator(doc)
  page_break(doc)
