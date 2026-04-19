"""Section 3: MARKETING PLAN \u2014 Expanded for 55-65 page target"""
from generate_bp_v2 import (p_text, bullet, check, num_item, table_sub,
               make_table, separator, page_break, highlight_box,
               add_footnote)


def build_section_3(doc):
  doc.add_heading('3. MARKETING PLAN', level=1)
  p_text(doc, 'O plano de marketing detalha a **segmenta\u00e7\u00e3o de mercado**, o **Marketing Mix** '
      '(4Ps) e a **estrat\u00e9gia de Marketing 4.0**, integrando canais digitais e tradicionais '
      'para posicionar a Vieira Operations LLC como refer\u00eancia no Sudeste dos EUA.')

  p_text(doc, 'A constru\u00e7\u00e3o deste plano parte de uma premissa central: a **Vieira Operations LLC** '
      'n\u00e3o compete por pre\u00e7o nem por volume \u2014 compete por **relev\u00e2ncia t\u00e9cnica**. '
      'Com 25 anos de experi\u00eancia na AmBev/AB InBev, o fundador traz credenciais que '
      'poucas empresas de serviços mid-market conseguem igualar.')

  p_text(doc, 'O marketing da empresa \u00e9 desenhado para converter essa credencial em '
      '**demanda qualificada**, utilizando estrat\u00e9gias que priorizam **autoridade '
      't\u00e9cnica** sobre visibilidade gen\u00e9rica. Cada d\u00f3lar investido em marketing '
      'deve gerar retorno mensur\u00e1vel em leads qualificados e receita.')

  p = p_text(doc, 'O or\u00e7amento de marketing representa **13,5%** da receita bruta ao longo de '
      'cinco anos, totalizando **$880.313** \u2014 um investimento agressivo por\u00e9m '
      'fundamentado em benchmarks setoriais que indicam 10-15% como faixa ideal '
      'para empresas de servi\u00e7os profissionais em fase de crescimento.')
  add_footnote(doc, p, 'Gartner, CMO Spend Survey 2023 \u2014 m\u00e9dia de 9,1% para B2B services; '
         'HubSpot recomenda 12-18% para empresas em fase de crescimento.')

  # ================================================================
  # 3.1 Segmentacao de Mercado
  # ================================================================
  doc.add_heading('3.1. Segmenta\u00e7\u00e3o de Mercado', level=2)

  p_text(doc, 'A segmenta\u00e7\u00e3o identifica e prioriza os **p\u00fablicos-alvo B2C** (profissionais '
      'individuais) e **B2B** (empresas e institui\u00e7\u00f5es) que comp\u00f5em a base de clientes '
      'da Vieira Operations LLC, orientando aloca\u00e7\u00e3o de recursos de marketing.')

  p_text(doc, 'A abordagem de segmenta\u00e7\u00e3o adotada \u00e9 **multidimensional**: combina crit\u00e9rios '
      'demogr\u00e1ficos tradicionais com an\u00e1lise comportamental e psicogr\u00e1fica para '
      'construir perfis de cliente que orientam desde a cria\u00e7\u00e3o de conte\u00fado at\u00e9 '
      'a precifica\u00e7\u00e3o de servi\u00e7os.')

  p_text(doc, 'A segmenta\u00e7\u00e3o n\u00e3o \u00e9 exerc\u00edcio acad\u00eamico: cada segmento identificado '
      'possui **m\u00e9tricas de atratividade** (tamanho, crescimento, acessibilidade) '
      'e **m\u00e9tricas de competitividade** (barreiras, diferencia\u00e7\u00e3o, margem) que '
      'determinam a prioridade de atendimento e investimento em marketing.')

  # ---- 3.1.1 Visao Geral ----
  doc.add_heading('3.1.1. Vis\u00e3o Geral da Segmenta\u00e7\u00e3o', level=3)

  p_text(doc, 'A segmenta\u00e7\u00e3o de mercado fundamenta-se em an\u00e1lise **multidimensional** que '
      'combina dados demogr\u00e1ficos, comportamentais, psicogr\u00e1ficos e geogr\u00e1ficos para '
      'identificar os segmentos de maior potencial de convers\u00e3o e lifetime value.')

  p_text(doc, 'A empresa opera a partir de **Jacksonville, Florida** \u2014 cidade-porto '
      'estrat\u00e9gica com PIB metropolitano de **$82 bilh\u00f5es** (2023), mais de **2.300 '
      'empresas manufatureiras** e posi\u00e7\u00e3o privilegiada no corredor log\u00edstico **I-95**.')

  p_text(doc, 'A localiza\u00e7\u00e3o em Jacksonville oferece vantagem competitiva significativa: '
      'acesso direto ao **JAXPORT** (porto estrat\u00e9gico do Departamento de Defesa), '
      'proximidade com a **Naval Air Station Jacksonville** e conex\u00e3o com o '
      'corredor industrial que se estende at\u00e9 Savannah e Brunswick.')

  p_text(doc, 'A segmenta\u00e7\u00e3o divide-se em duas dimens\u00f5es complementares: **B2C** (profissionais '
      'individuais buscando capacita\u00e7\u00e3o) e **B2B** (empresas buscando servi\u00e7os de '
      'serviços operacionais), com estrat\u00e9gias espec\u00edficas para cada dimens\u00e3o.')

  table_sub(doc, 'Tabela 3.1.1a: Vis\u00e3o Geral dos Segmentos de Mercado')
  make_table(doc,
    ['Dimens\u00e3o', 'Segmento', 'Tamanho Estimado', 'Receita Potencial'],
    [
      ['B2C', 'Profissionais em supply chain/opera\u00e7\u00f5es', '12.000+ na regi\u00e3o Jacksonville',
       '$563.406 (5 anos)'],
      ['B2B', 'PMEs manufatureiras ($10-500M)', '2.300+ empresas na regi\u00e3o',
       '$5.629.963 (5 anos)'],
      ['B2B', 'Corpora\u00e7\u00f5es e governo', '150+ entidades na regi\u00e3o',
       '$845.110 (5 anos)'],
      ['**Total**', '**3 segmentos prim\u00e1rios**', '**14.450+ entidades**',
       '**$7.038.479 (5 anos)**'],
    ],
    col_widths=[0.7, 2.2, 1.5, 1.3]
  )

  p_text(doc, 'O **Total Addressable Market (TAM)** supera $7 milh\u00f5es em cinco anos, '
      'representando fra\u00e7\u00e3o conservadora do mercado dispon\u00edvel. A meta de receita '
      'acumulada de **$7.619.836** considera taxa de penetra\u00e7\u00e3o progressiva de '
      '0,8% no Y1 crescendo para 2,1% no Y5.')

  table_sub(doc, 'Tabela 3.1.1b: Crit\u00e9rios de Atratividade por Segmento')
  make_table(doc,
    ['Crit\u00e9rio', 'B2C Profissionais', 'B2B PMEs', 'B2B Corporativo'],
    [
      ['Tamanho do Mercado', 'M\u00e9dio (12.000+)', 'Grande (2.300+)', 'M\u00e9dio (150+)'],
      ['Crescimento Projetado', '+8% a.a.', '+6,2% a.a.', '+4% a.a.'],
      ['Margem M\u00e9dia', '85-90%', '70-80%', '75-85%'],
      ['Ciclo de Venda', '2-4 semanas', '2-6 meses', '3-9 meses'],
      ['Custo de Aquisi\u00e7\u00e3o', '$500-1.500', '$3.000-8.000', '$5.000-15.000'],
      ['Lifetime Value', '$4.000-12.000', '$35.000-200.000', '$75.000-300.000'],
      ['Prioridade', 'Secund\u00e1ria', '**Prim\u00e1ria**', 'Terci\u00e1ria'],
    ],
    col_widths=[1.3, 1.5, 1.5, 1.5]
  )

  p_text(doc, 'O segmento **B2B PMEs** \u00e9 a prioridade estrat\u00e9gica: oferece o melhor '
      'equil\u00edbrio entre volume de mercado, ticket m\u00e9dio e alinhamento com a '
      'expertise do fundador. O segmento B2C complementa a receita com margens '
      'superiores e ciclos de venda mais curtos.')

  # ---- 3.1.2 Publico-Alvo B2C ----
  doc.add_heading('3.1.2. P\u00fablico-Alvo B2C', level=3)

  p_text(doc, 'A dimens\u00e3o B2C endere\u00e7a **profissionais individuais** cujas necessidades de '
      'desenvolvimento profissional alinham-se com os servi\u00e7os de **capacita\u00e7\u00e3o t\u00e9cnica** '
      'e **treinamento de lideran\u00e7a** oferecidos pela empresa.')

  p_text(doc, 'Este segmento representa **7,4%** da receita projetada em cinco anos, por\u00e9m '
      'desempenha papel estrat\u00e9gico desproporcional: profissionais treinados pela '
      'Vieira Operations tornam-se **embaixadores da marca** dentro de suas '
      'organiza\u00e7\u00f5es, gerando indica\u00e7\u00f5es B2B de alto valor.')

  p_text(doc, 'O mercado de treinamento corporativo e desenvolvimento profissional na '
      'regi\u00e3o de Jacksonville cresce a **8% ao ano**, impulsionado pela escassez '
      'de profissionais qualificados em supply chain e opera\u00e7\u00f5es industriais '
      'documentada pelo Bureau of Labor Statistics.')

  # -- Perfil Demografico --
  doc.add_heading('Perfil Demogr\u00e1fico', level=3)

  p_text(doc, 'O perfil demogr\u00e1fico do p\u00fablico B2C concentra-se em profissionais em '
      'est\u00e1gio **intermedi\u00e1rio a s\u00eanior** de carreira, com forma\u00e7\u00e3o t\u00e9cnica e renda '
      'compat\u00edvel com investimento em desenvolvimento profissional de alto n\u00edvel.')

  p_text(doc, 'A faixa et\u00e1ria de **28-55 anos** reflete dois momentos cr\u00edticos de '
      'carreira: profissionais de 28-38 anos buscando acelera\u00e7\u00e3o de carreira '
      'atrav\u00e9s de certifica\u00e7\u00f5es, e profissionais de 39-55 anos buscando '
      'transi\u00e7\u00e3o para posi\u00e7\u00f5es de lideran\u00e7a ou serviços profissionais.')

  p_text(doc, 'A renda m\u00e9dia de **$60.000-$150.000/ano** posiciona este p\u00fablico no '
      'segmento de profissionais que valorizam qualidade sobre pre\u00e7o em '
      'investimentos educacionais, com disposi\u00e7\u00e3o documentada de alocar '
      '**3-5%** da renda anual em desenvolvimento profissional.')

  p_text(doc, 'O perfil demogr\u00e1fico abrange profissionais de **28 a 55 anos** em est\u00e1gio '
      'intermedi\u00e1rio a s\u00eanior, com renda entre **$60.000 e $150.000/ano** e forma\u00e7\u00e3o '
      'em Engenharia, Administra\u00e7\u00e3o ou Log\u00edstica. As ocupa\u00e7\u00f5es-alvo incluem '
      '**Supply Chain Managers** (SOC 11-3031.00), **Project Management Specialists** '
      '(SOC 13-1082.00) e **First-Line Supervisors** (SOC 43-1011.00).')

  table_sub(doc, 'Tabela 3.1.2a: Perfil Demogr\u00e1fico Detalhado do P\u00fablico B2C')
  make_table(doc,
    ['Atributo', 'Perfil Prim\u00e1rio', 'Perfil Secund\u00e1rio'],
    [
      ['Faixa Et\u00e1ria', '28-38 anos', '39-55 anos'],
      ['G\u00eanero', '65% masculino, 35% feminino', '70% masculino, 30% feminino'],
      ['Escolaridade', 'Bacharelado + MBA', 'Bacharelado + Certifica\u00e7\u00f5es'],
      ['Renda Anual', '$60.000-$95.000', '$95.000-$150.000'],
      ['Experi\u00eancia', '5-12 anos em opera\u00e7\u00f5es', '12-25 anos em opera\u00e7\u00f5es'],
      ['Cargo T\u00edpico', 'Analista/Coordenador de Supply Chain', 'Gerente/Diretor de Opera\u00e7\u00f5es'],
      ['Motiva\u00e7\u00e3o', 'Acelera\u00e7\u00e3o de carreira', 'Transi\u00e7\u00e3o para lideran\u00e7a/serviços profissionais'],
      ['Investimento', '$2.000-$5.000/ano', '$5.000-$8.000/ano'],
    ],
    col_widths=[1.3, 2.2, 2.2]
  )

  # -- Perfil Comportamental --
  doc.add_heading('Perfil Comportamental', level=3)

  p_text(doc, 'O comportamento de compra deste segmento caracteriza-se por **pesquisa extensiva** '
      'e **valida\u00e7\u00e3o por pares** antes da decis\u00e3o de investimento em capacita\u00e7\u00e3o. '
      'O ciclo de decis\u00e3o \u00e9 de **2-4 semanas** com avalia\u00e7\u00e3o rigorosa de ROI educacional.')

  p_text(doc, 'A jornada de compra inicia-se tipicamente com busca no **LinkedIn** ou **Google** '
      'por termos como "supply chain certification Jacksonville" ou "SAP training '
      'Florida". O profissional avalia tr\u00eas a cinco op\u00e7\u00f5es antes de tomar decis\u00e3o, '
      'priorizando credenciais do instrutor sobre pre\u00e7o.')

  p_text(doc, 'A **prova social** \u00e9 o fator de convers\u00e3o mais poderoso neste segmento: '
      'depoimentos de colegas, cases documentados e a credencial AmBev/AB InBev '
      'do fundador funcionam como **aceleradores de decis\u00e3o** que reduzem o '
      'ciclo de venda de 4 semanas para 1-2 semanas.')

  p_text(doc, 'A **motiva\u00e7\u00e3o principal** \u00e9 a ascens\u00e3o profissional atrav\u00e9s de certifica\u00e7\u00f5es '
      'reconhecidas. O **padr\u00e3o de compra** envolve pesquisa extensiva online, consulta '
      'a pares e valida\u00e7\u00e3o de credenciais, com ciclo decisional de **2-4 semanas** e '
      'avalia\u00e7\u00e3o rigorosa de ROI educacional.')

  p_text(doc, 'Os **canais preferidos** incluem LinkedIn, webinars t\u00e9cnicos e recomenda\u00e7\u00f5es '
      'de associa\u00e7\u00f5es setoriais. Os principais **triggers de compra** s\u00e3o: promo\u00e7\u00e3o '
      'negada, mudan\u00e7a de emprego planejada ou exig\u00eancia de certifica\u00e7\u00e3o pelo '
      'empregador atual \u2014 eventos que criam urg\u00eancia de investimento em capacita\u00e7\u00e3o.')

  # -- Perfil Psicografico --
  doc.add_heading('Perfil Psicogr\u00e1fico', level=3)

  p_text(doc, 'Os profissionais deste segmento s\u00e3o motivados por **excel\u00eancia profissional** '
      'e **aprendizado cont\u00ednuo**, buscando diferenciais competitivos que acelerem sua '
      'trajet\u00f3ria de carreira em um mercado cada vez mais competitivo.')

  p = p_text(doc, 'A an\u00e1lise psicogr\u00e1fica revela um perfil de **early adopter t\u00e9cnico**: '
      'profissionais que acompanham tend\u00eancias de Industry 4.0, assinam newsletters '
      'especializadas (Supply Chain Dive, IndustryWeek) e participam ativamente '
      'de comunidades profissionais como APICS e ISM.')
  add_footnote(doc, p, 'APICS/ASCM, Membership Demographics Report 2023 \u2014 45.000+ membros '
         'na regi\u00e3o Sudeste dos EUA.')

  p_text(doc, 'A **dor principal** deste p\u00fablico \u00e9 o gap entre forma\u00e7\u00e3o acad\u00eamica '
      'generalista e as demandas pr\u00e1ticas do mercado. Universidades americanas '
      'formam profissionais com base te\u00f3rica s\u00f3lida, mas sem a experi\u00eancia '
      'pr\u00e1tica que empregadores exigem para posi\u00e7\u00f5es de lideran\u00e7a.')

  p_text(doc, 'Os **valores centrais** deste p\u00fablico s\u00e3o excel\u00eancia profissional e '
      'aprendizado cont\u00ednuo. Aspiram transi\u00e7\u00e3o para **posi\u00e7\u00f5es de lideran\u00e7a** em '
      'supply chain e opera\u00e7\u00f5es industriais. A principal **dor** \u00e9 o gap entre '
      'forma\u00e7\u00e3o acad\u00eamica generalista e as demandas pr\u00e1ticas do mercado.')

  p_text(doc, 'A **disposi\u00e7\u00e3o de investimento** varia de **$2.000 a $8.000** por programa, '
      'desde que ofere\u00e7a aplicabilidade imediata e certifica\u00e7\u00e3o reconhecida. '
      'Este perfil valoriza mais a **credencial do instrutor** do que o pre\u00e7o, '
      'criando vantagem competitiva natural para a Vieira Operations.')

  # -- Perfil Geografico --
  doc.add_heading('Perfil Geogr\u00e1fico', level=3)

  p_text(doc, 'A distribui\u00e7\u00e3o geogr\u00e1fica do p\u00fablico B2C acompanha a estrat\u00e9gia de '
      'expans\u00e3o f\u00edsica da empresa, com **concentra\u00e7\u00e3o prim\u00e1ria** na Jacksonville '
      'Metropolitan Area e **alcance secund\u00e1rio** ao longo do corredor I-95 at\u00e9 '
      'Savannah e Brunswick.')

  p_text(doc, 'O modelo h\u00edbrido (presencial + online) permite atender profissionais '
      'al\u00e9m da regi\u00e3o imediata. Programas de certifica\u00e7\u00e3o online e webinars '
      't\u00e9cnicos alcan\u00e7am profissionais em todo o **Sudeste dos EUA**, ampliando '
      'o mercado endere\u00e7\u00e1vel sem custo incremental significativo.')

  p_text(doc, 'A **regi\u00e3o prim\u00e1ria** \u00e9 a Jacksonville Metropolitan Area (1,6 milh\u00e3o de '
      'habitantes), seguida pela **regi\u00e3o secund\u00e1ria** composta por Savannah e Brunswick '
      'MSAs ao longo do corredor I-95. O canal **online** amplia o alcance para '
      'profissionais de todo o Sudeste dos EUA em programas de certifica\u00e7\u00e3o h\u00edbridos.')

  table_sub(doc, 'Tabela 3.1.2b: Distribui\u00e7\u00e3o Geogr\u00e1fica do P\u00fablico B2C')
  make_table(doc,
    ['Regi\u00e3o', 'Popula\u00e7\u00e3o', 'Profissionais-Alvo', 'Canal Prim\u00e1rio'],
    [
      ['Jacksonville MSA', '1,6 milh\u00e3o', '8.000+', 'Presencial + Online'],
      ['Savannah MSA', '400 mil', '2.500+', 'H\u00edbrido (a partir de Y2)'],
      ['Brunswick MSA', '120 mil', '800+', 'Online (presencial Y5+)'],
      ['Sudeste EUA (remoto)', '25+ milh\u00f5es', '50.000+', 'Online exclusivo'],
    ],
    col_widths=[1.5, 1.0, 1.2, 1.8]
  )

  # ---- 3.1.3 Setor-Alvo B2B ----
  doc.add_heading('3.1.3. Setor-Alvo B2B', level=3)

  p_text(doc, 'A segmenta\u00e7\u00e3o B2B prioriza **quatro setores estrat\u00e9gicos** selecionados por '
      'densidade de empresas na regi\u00e3o, alinhamento com a expertise do fundador e '
      'potencial de receita recorrente.')

  p_text(doc, 'A sele\u00e7\u00e3o dos setores-alvo baseou-se em an\u00e1lise cruzada de tr\u00eas fatores: '
      '(a) **concentra\u00e7\u00e3o setorial** na Jacksonville MSA documentada pelo Census Bureau, '
      '(b) **alinhamento de servi\u00e7os** com a expertise do fundador em supply chain, '
      'ERP e compliance, e (c) **propens\u00e3o a contratar** serviços profissionais externa verificada '
      'pelo IBISWorld.')

  p_text(doc, 'O setor de **manufatura** \u00e9 o principal vetor de demanda, com mais de 2.300 '
      'empresas na regi\u00e3o metropolitana de Jacksonville. A press\u00e3o por reshoring, '
      'a migra\u00e7\u00e3o obrigat\u00f3ria para SAP S/4HANA (deadline 2027) e o aumento '
      'de exig\u00eancias regulat\u00f3rias (EPA, OSHA) criam demanda convergente por '
      'exatamente os servi\u00e7os oferecidos pela Vieira Operations.')

  p_text(doc, 'O setor de **log\u00edstica e transporte**, com 800+ empresas ao longo do corredor '
      'I-95, beneficia-se diretamente da posi\u00e7\u00e3o estrat\u00e9gica de Jacksonville '
      'como hub portu\u00e1rio e log\u00edstico. O crescimento do **JAXPORT** e os '
      'investimentos do Infrastructure Investment Act amplificam esta demanda.')

  table_sub(doc, 'Tabela 3.1.3a: Setores-Alvo B2B Priorit\u00e1rios')
  make_table(doc,
    ['Setor', 'Empresas na Regi\u00e3o', 'Servi\u00e7os Demandados', 'Ticket M\u00e9dio'],
    [
      ['Manufatura', '2.300+ (Jacksonville MSA)', 'Supply chain, ERP, compliance',
       '$50.000-$200.000'],
      ['Log\u00edstica/Transporte', '800+ (corredor I-95)', 'Otimiza\u00e7\u00e3o, tecnologia, treinamento',
       '$30.000-$150.000'],
      ['Defesa/Governo', '150+ (JAXPORT/NAS Jax)', 'Compliance, gest\u00e3o emergencial',
       '$75.000-$300.000'],
      ['Sa\u00fade/Farmac\u00eautica', '200+ (regi\u00e3o)', 'Compliance FDA, supply chain, capacita\u00e7\u00e3o',
       '$40.000-$180.000'],
    ],
    col_widths=[1.3, 1.5, 1.8, 1.2]
  )

  p_text(doc, 'O setor de **defesa e governo** apresenta o maior ticket m\u00e9dio ($75.000-$300.000) '
      'e os ciclos de venda mais longos (6-12 meses). A proximidade com a Naval Air '
      'Station Jacksonville e o papel estrat\u00e9gico do JAXPORT para o Departamento '
      'de Defesa criam oportunidades \u00fanicas para empresa de serviços em compliance e '
      'gest\u00e3o de emerg\u00eancias operacionais.')

  p_text(doc, 'O setor de **sa\u00fade e farmac\u00eautica** completa o portf\u00f3lio com demanda '
      'espec\u00edfica por compliance FDA e otimiza\u00e7\u00e3o de supply chain hospitalar. '
      'A pandemia de COVID-19 evidenciou a fragilidade das cadeias de suprimentos '
      'de sa\u00fade, gerando investimentos cont\u00ednuos em resili\u00eancia operacional.')

  table_sub(doc, 'Tabela 3.1.3b: An\u00e1lise de Potencial por Setor B2B')
  make_table(doc,
    ['Setor', 'Crescimento', 'Concorr\u00eancia', 'Barreira de Entrada', 'Prioridade'],
    [
      ['Manufatura', '+6,2% a.a.', 'Moderada', 'Expertise comprovada', '**#1**'],
      ['Log\u00edstica', '+7,1% a.a.', 'Baixa-M\u00e9dia', 'Conhecimento local', '**#2**'],
      ['Defesa/Gov', '+3,8% a.a.', 'Baixa', 'Certifica\u00e7\u00f5es e clearance', '#3'],
      ['Sa\u00fade/Farma', '+5,5% a.a.', 'M\u00e9dia', 'Compliance FDA', '#4'],
    ],
    col_widths=[1.2, 1.0, 1.0, 1.5, 0.8]
  )

  # ---- 3.1.4 Posicionamento ----
  doc.add_heading('3.1.4. Posicionamento da Marca', level=3)

  p_text(doc, 'A **Vieira Operations LLC** posiciona-se como **"Expertise Tier-1 a Pre\u00e7o '
      'Mid-Market"** \u2014 oferecendo qualidade de entrega compar\u00e1vel \u00e0s Big 4 a pre\u00e7os '
      '**40-60% inferiores**, viabilizando acesso de PMEs a empresa de serviços de alto n\u00edvel.')

  p_text(doc, 'Este posicionamento explora uma **lacuna estrutural** no mercado: as Big 4 '
      '(Deloitte, McKinsey, Accenture, BCG) concentram-se em contas com faturamento '
      'superior a $1 bilh\u00e3o, enquanto boutiques locais carecem da profundidade '
      't\u00e9cnica necess\u00e1ria para projetos complexos de supply chain e ERP.')

  p_text(doc, 'A **proposta de valor \u00fanica** (UVP) da empresa resume-se em uma frase: '
      '"Resultados de multinacional, acessibilidade de parceiro local." Esta '
      'mensagem permeia toda a comunica\u00e7\u00e3o de marketing e posiciona a empresa '
      'como a \u00fanica op\u00e7\u00e3o para PMEs que necessitam de expertise real.')

  p_text(doc, 'O posicionamento fundamenta-se em **tr\u00eas pilares de diferencia\u00e7\u00e3o** que '
      'sustentam a proposta de valor \u00fanica da empresa no mercado regional, cada '
      'um validado por evid\u00eancias document\u00e1veis do track record do fundador.')

  doc.add_heading('Pilar 1: Converg\u00eancia de Compet\u00eancias Cr\u00edticas', level=3)
  p_text(doc, 'A combina\u00e7\u00e3o de **supply chain + ERP SAP + compliance + treinamento** em um '
      '\u00fanico provedor \u00e9 raridade no mercado mid-market. Concorrentes tipicamente '
      'oferecem uma ou duas dessas compet\u00eancias, for\u00e7ando clientes a gerenciar '
      'm\u00faltiplos fornecedores com custos de coordena\u00e7\u00e3o significativos.')

  p_text(doc, 'O **diferencial** reside na combina\u00e7\u00e3o rara de supply chain, ERP, compliance '
      'e treinamento em provedor \u00fanico, respaldado por **25 anos** na AmBev/AB InBev '
      'com gest\u00e3o de R$380 bi em ativos operacionais em 5 pa\u00edses.')

  doc.add_heading('Pilar 2: Resultados Quantific\u00e1veis', level=3)
  p_text(doc, 'A empresa n\u00e3o vende promessas \u2014 vende **resultados documentados**. Cada '
      'proposta comercial inclui m\u00e9tricas de impacto baseadas no track record '
      'verificavel do fundador, transformando a venda de serviços profissionais em '
      'investimento com ROI previs\u00edvel.')

  p_text(doc, 'As evid\u00eancias incluem **48% de redu\u00e7\u00e3o em custos vari\u00e1veis** em projetos '
      'de supply chain, antecipa\u00e7\u00e3o de **2 anos e 4 meses** na implementa\u00e7\u00e3o do '
      'SAP Fiori, e mobiliza\u00e7\u00e3o emergencial de planta de oxig\u00eanio medicinal '
      'durante a pandemia de COVID-19.')

  doc.add_heading('Pilar 3: Pricing Estrat\u00e9gico', level=3)
  p_text(doc, 'A estrutura de **S-Corporation** permite efici\u00eancia tribut\u00e1ria que \u00e9 '
      'repassada ao cliente na forma de pre\u00e7os competitivos. O modelo **lean** '
      'elimina overhead corporativo t\u00edpico das Big 4 (escrit\u00f3rios premium, '
      'bench de especialistas, estrutura hier\u00e1rquica pesada).')

  p_text(doc, 'A taxa hor\u00e1ria de **$150-250** posiciona a empresa **40-60% abaixo** das '
      'Big 4 ($350-500/hora), viabilizando acesso de PMEs a empresa de serviços de alto '
      'n\u00edvel. A estrutura lean de S-Corp sustenta esta vantagem de pre\u00e7o sem '
      'comprometer a margem operacional.')

  highlight_box(doc, '**Posicionamento**: "Expertise Tier-1 a Pre\u00e7o Mid-Market" \u2014 '
         'qualidade Big 4 a **40-60% do pre\u00e7o**, viabilizando acesso de PMEs '
         'a empresa de serviços de alto n\u00edvel em supply chain e opera\u00e7\u00f5es.')

  # ================================================================
  # 3.2 Marketing Mix
  # ================================================================
  doc.add_heading('3.2. Marketing Mix', level=2)

  p_text(doc, 'O **Marketing Mix** integra os **4Ps** (Produto, Pre\u00e7o, Pra\u00e7a, Promo\u00e7\u00e3o) em '
      'estrat\u00e9gia coerente que maximiza a captura de valor no segmento mid-market do '
      'Sudeste americano.')

  p_text(doc, 'A formula\u00e7\u00e3o dos 4Ps segue l\u00f3gica sequencial: o **Produto** define a '
      'proposta de valor, o **Pre\u00e7o** posiciona competitivamente, a **Pra\u00e7a** '
      'determina alcance geogr\u00e1fico e canais, e a **Promo\u00e7\u00e3o** converte '
      'visibilidade em demanda qualificada.')

  p_text(doc, 'Cada elemento do mix \u00e9 calibrado para refor\u00e7ar o posicionamento central '
      'de "Expertise Tier-1 a Pre\u00e7o Mid-Market", garantindo consist\u00eancia na '
      'mensagem ao longo de todos os pontos de contato com o cliente, desde o '
      'primeiro an\u00fancio no LinkedIn at\u00e9 a entrega do relat\u00f3rio final.')

  # ---- 3.2.1 Produto ----
  doc.add_heading('3.2.1. Produto \u2014 An\u00e1lise de Valor', level=3)

  p_text(doc, 'O portf\u00f3lio de **6 servi\u00e7os especializados** opera como sistema integrado onde '
      'cada componente agrega valor aos demais, criando **efeito rede** que aumenta o '
      'lifetime value do cliente e dificulta a substitui\u00e7\u00e3o por concorrentes.')

  p_text(doc, 'A arquitetura de servi\u00e7os foi desenhada para maximizar **cross-selling**: '
      'um cliente que contrata otimiza\u00e7\u00e3o de supply chain frequentemente necessita '
      'de implementa\u00e7\u00e3o ERP (para suportar as mudan\u00e7as) e treinamento (para '
      'capacitar a equipe), gerando contratos compostos de maior valor.')

  p_text(doc, 'A metodologia de entrega fundamenta-se em **resultados documentados**: clientes '
      'projetam retorno sobre investimento de **3-5x** o valor do contrato dentro de '
      '**12 meses**, baseado nos resultados hist\u00f3ricos do fundador.')

  table_sub(doc, 'Tabela 3.2.1a: Proposta de Valor por Servi\u00e7o')
  make_table(doc,
    ['Servi\u00e7o', 'Proposta de Valor', 'ROI Esperado', 'Dura\u00e7\u00e3o'],
    [
      ['Supply Chain', 'Redu\u00e7\u00e3o de 30-48% em custos operacionais',
       '3-5x em 12 meses', '3-6 meses'],
      ['ERP SAP', 'Implementa\u00e7\u00e3o acelerada com metodologia propriet\u00e1ria',
       '4-7x em 18 meses', '6-12 meses'],
      ['Gest\u00e3o Emergencial', 'Mobiliza\u00e7\u00e3o em 48h para crises operacionais',
       'Preven\u00e7\u00e3o de perdas', '1-3 meses'],
      ['Compliance', 'Conformidade EPA/OSHA/FDA com zero multas',
       'Evitar $50K-$1M em multas', '2-4 meses'],
      ['Capacita\u00e7\u00e3o T\u00e9cnica', 'Upskilling de equipes com certifica\u00e7\u00e3o reconhecida',
       '2-3x produtividade', '1-3 meses'],
      ['Lideran\u00e7a', 'Desenvolvimento gerencial baseado em casos reais',
       'Reten\u00e7\u00e3o de talentos', '1-2 meses'],
    ],
    col_widths=[1.2, 2.2, 1.3, 1.0]
  )

  p_text(doc, 'A estrat\u00e9gia de **empacotamento** de servi\u00e7os permite oferecer pacotes '
      'integrados com desconto de 10-15% sobre pre\u00e7os individuais, incentivando '
      'contratos de maior escopo e aumentando o ticket m\u00e9dio. O pacote mais '
      'vendido combina Supply Chain + ERP + Capacita\u00e7\u00e3o.')

  table_sub(doc, 'Tabela 3.2.1b: Pacotes Integrados de Servi\u00e7os')
  make_table(doc,
    ['Pacote', 'Servi\u00e7os Inclu\u00eddos', 'Pre\u00e7o Estimado', 'Desconto'],
    [
      ['Essencial', 'Supply Chain + Capacita\u00e7\u00e3o',
       '$45.000-$120.000', '10%'],
      ['Avan\u00e7ado', 'Supply Chain + ERP SAP + Capacita\u00e7\u00e3o',
       '$80.000-$250.000', '12%'],
      ['Premium', 'Supply Chain + ERP + Compliance + Lideran\u00e7a',
       '$120.000-$400.000', '15%'],
      ['Emergencial', 'Gest\u00e3o Emergencial + Compliance',
       '$50.000-$150.000', '5%'],
    ],
    col_widths=[1.2, 2.2, 1.3, 0.8]
  )

  # ---- 3.2.2 Preco ----
  doc.add_heading('3.2.2. Estrat\u00e9gia de Pre\u00e7o', level=3)

  p_text(doc, 'A precifica\u00e7\u00e3o adota modelo h\u00edbrido de **value-based pricing** combinado com '
      '**project-based fees**, posicionando a empresa **40-60% abaixo** das Big 4 enquanto '
      'mant\u00e9m margens saud\u00e1veis superiores a **75%** na maioria dos servi\u00e7os.')

  p_text(doc, 'A l\u00f3gica de pre\u00e7o parte do **valor entregue ao cliente**, n\u00e3o do custo '
      'de produ\u00e7\u00e3o. Se um projeto de otimiza\u00e7\u00e3o de supply chain gera economia '
      'de $500.000/ano para o cliente, cobrar $100.000 pelo projeto representa '
      '**ROI de 5x no primeiro ano** \u2014 proposta irrecus\u00e1vel para qualquer CFO.')

  p_text(doc, 'O modelo h\u00edbrido permite flexibilidade: clientes que preferem previsibilidade '
      'optam por **projeto fechado**, enquanto clientes com demandas vari\u00e1veis '
      'preferem **serviços profissionais por hora**. O **retainer mensal** atende clientes com '
      'necessidade cont\u00ednua de compliance e suporte operacional.')

  table_sub(doc, 'Tabela 3.2.2a: Estrutura de Precifica\u00e7\u00e3o por Modalidade')
  make_table(doc,
    ['Modalidade', 'Faixa de Pre\u00e7o', 'Margem', 'Aplica\u00e7\u00e3o'],
    [
      ['Serviço por hora', '$150-250/hora', '75-85%',
       'Projetos pontuais e assessments'],
      ['Projeto fechado', '$25.000-$200.000', '70-80%',
       'Implementa\u00e7\u00f5es ERP e supply chain'],
      ['Retainer mensal', '$5.000-$15.000/m\u00eas', '80-90%',
       'Compliance e suporte cont\u00ednuo'],
      ['Treinamento', '$2.000-$8.000/pessoa', '85-90%',
       'Programas de certifica\u00e7\u00e3o'],
    ],
    col_widths=[1.3, 1.2, 0.8, 2.7]
  )

  p_text(doc, 'A estrat\u00e9gia de pre\u00e7o inclui **mecanismo de escalonamento**: a taxa hor\u00e1ria '
      'inicia em $150 para clientes novos (projetos de entrada) e evolui para $250 '
      'conforme o relacionamento se aprofunda e o valor percebido aumenta. Esta '
      'abordagem reduz a barreira de entrada e maximiza o LTV.')

  table_sub(doc, 'Tabela 3.2.2b: Compara\u00e7\u00e3o de Pre\u00e7os \u2014 Vieira Operations vs Mercado')
  make_table(doc,
    ['Provedor', 'Taxa Hor\u00e1ria', 'Projeto M\u00e9dio', 'Foco'],
    [
      ['Deloitte/McKinsey', '$350-500', '$200.000-$2.000.000', 'Fortune 500'],
      ['Accenture', '$300-450', '$150.000-$1.500.000', 'Corporativo'],
      ['Provedores SAP regionais', '$200-350', '$100.000-$500.000', 'ERP apenas'],
      ['Boutiques locais FL', '$100-200', '$10.000-$75.000', 'Generalista'],
      ['**Vieira Operations**', '**$150-250**', '**$25.000-$200.000**', '**Supply chain integrado**'],
    ],
    col_widths=[1.5, 0.9, 1.5, 1.5]
  )

  p_text(doc, 'O posicionamento de pre\u00e7o \u00e9 estrat\u00e9gico: **acima** das boutiques locais '
      '(para sinalizar qualidade superior) e **abaixo** das empresas de serviços globais '
      '(para viabilizar acesso de PMEs). Este posicionamento endere\u00e7a o segmento '
      'de maior volume no mercado regional.')

  # ---- 3.2.3 Praca ----
  doc.add_heading('3.2.3. Pra\u00e7a \u2014 Estrat\u00e9gia de Distribui\u00e7\u00e3o', level=3)

  p_text(doc, 'A estrat\u00e9gia de distribui\u00e7\u00e3o combina **presen\u00e7a f\u00edsica** em tr\u00eas localidades '
      'estrat\u00e9gicas com **canais digitais** para ampliar o alcance geogr\u00e1fico sem '
      'comprometer a qualidade da entrega presencial.')

  p_text(doc, 'A expans\u00e3o geogr\u00e1fica segue o corredor log\u00edstico **I-95**, que conecta os '
      'tr\u00eas principais portos do Sudeste: JAXPORT (Jacksonville), Port of Savannah '
      '(4\u00ba maior dos EUA) e Port of Brunswick. A presen\u00e7a f\u00edsica em cada localidade '
      '\u00e9 condi\u00e7\u00e3o para contratos de implementa\u00e7\u00e3o presencial.')

  p_text(doc, 'O modelo de distribui\u00e7\u00e3o \u00e9 **h\u00edbrido por design**: servi\u00e7os de serviços profissionais '
      'e implementa\u00e7\u00e3o exigem presen\u00e7a f\u00edsica (70% do portf\u00f3lio), enquanto '
      'treinamentos e assessments iniciais podem ser entregues remotamente '
      '(30% do portf\u00f3lio), otimizando o alcance sem sacrificar qualidade.')

  table_sub(doc, 'Tabela 3.2.3a: Canais de Distribui\u00e7\u00e3o')
  make_table(doc,
    ['Canal', 'Tipo', 'Alcance', 'Custo Anual'],
    [
      ['Escrit\u00f3rio Jacksonville', 'Presencial (sede)', 'Jacksonville MSA (1,6M hab)',
       '$24.000/ano'],
      ['Escrit\u00f3rio Savannah', 'Presencial (branch)', 'Savannah MSA (400K hab)',
       '$24.000/ano (Y2+)'],
      ['Escrit\u00f3rio Brunswick', 'Presencial (branch)', 'Brunswick MSA (120K hab)',
       '$18.000/ano (Y5+)'],
      ['Website + SEO', 'Digital', 'Sudeste EUA',
       '$12.000/ano'],
      ['LinkedIn Business', 'Digital/Social', 'Nacional',
       '$6.000/ano'],
      ['Parcerias institucionais', 'Referral', 'Regional',
       'Comiss\u00e3o 5-10%'],
    ],
    col_widths=[1.5, 1.0, 1.5, 1.5]
  )

  p_text(doc, 'A expans\u00e3o geogr\u00e1fica segue cronograma progressivo e controlado: '
      'Jacksonville (sede, Y0-Y1), Savannah (branch 1, Y2-Y3) e Brunswick '
      '(branch 2, Y5), acompanhando a demanda e a capacidade operacional. Cada '
      'nova localidade \u00e9 ativada somente ap\u00f3s a anterior atingir 70% de '
      'capacidade operacional.')

  table_sub(doc, 'Tabela 3.2.3b: Cronograma de Expans\u00e3o Geogr\u00e1fica')
  make_table(doc,
    ['Fase', 'Localidade', 'Investimento', 'Meta de Receita', 'Breakeven'],
    [
      ['Y0-Y1', 'Jacksonville (sede)', '$90.747', '$550.080', 'M\u00eas 8'],
      ['Y2-Y3', 'Savannah (branch 1)', '$60.000', '$392.000', 'M\u00eas 10'],
      ['Y5', 'Brunswick (branch 2)', '$45.000', '$220.000', 'M\u00eas 12'],
    ],
    col_widths=[0.7, 1.5, 1.0, 1.2, 0.8]
  )

  # ---- 3.2.4 Promocao ----
  doc.add_heading('3.2.4. Promo\u00e7\u00e3o \u2014 Or\u00e7amento de Marketing', level=3)

  p_text(doc, 'O or\u00e7amento de marketing representa **13,5%** da receita bruta, alocado em '
      'categorias que equilibram **aquisi\u00e7\u00e3o de clientes** (60%), **reten\u00e7\u00e3o** (25%) '
      'e **marca/reputa\u00e7\u00e3o** (15%).')

  p_text(doc, 'A aloca\u00e7\u00e3o de 13,5% \u00e9 superior \u00e0 m\u00e9dia setorial de 10%, refletindo a '
      'necessidade de **constru\u00e7\u00e3o de marca** em mercado novo. Empresas estabelecidas '
      'operam com 8-10%; startups em fase de crescimento agressivo investem 15-20%. '
      'O patamar de 13,5% equilibra agressividade com sustentabilidade financeira.')

  p_text(doc, 'A distribui\u00e7\u00e3o entre canais privilegia **marketing digital** (32%) por '
      'oferecer melhor mensurabilidade e custo por lead inferior aos canais '
      'tradicionais. **Eventos e networking** (16%) representam o segundo maior '
      'investimento, fundamentais para constru\u00e7\u00e3o de relacionamentos B2B '
      'em mercado de alto valor.')

  p_text(doc, 'A promo\u00e7\u00e3o integra seis categorias or\u00e7ament\u00e1rias com metas espec\u00edficas '
      'e KPIs de acompanhamento trimestral. Cada d\u00f3lar investido \u00e9 rastreado '
      'do an\u00fancio \u00e0 convers\u00e3o, permitindo realoca\u00e7\u00e3o din\u00e2mica de recursos '
      'para os canais de maior performance.')

  table_sub(doc, 'Tabela 3.2.4a: Aloca\u00e7\u00e3o Or\u00e7ament\u00e1ria de Marketing (Y1-Y5)')
  make_table(doc,
    ['Categoria', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Total'],
    [
      ['Marketing Digital', '$22.000', '$39.200', '$58.800', '$73.500', '$88.200',
       '$281.700'],
      ['Eventos e Networking', '$11.000', '$19.600', '$29.400', '$36.750', '$44.100',
       '$140.850'],
      ['Conte\u00fado e PR', '$8.250', '$14.700', '$22.050', '$27.563', '$33.075',
       '$105.638'],
      ['A\u00e7\u00f5es Socioambientais', '$5.500', '$9.800', '$14.700', '$18.375', '$22.050',
       '$70.425'],
      ['Fideliza\u00e7\u00e3o', '$13.750', '$24.500', '$36.750', '$45.938', '$55.125',
       '$176.063'],
      ['Marca/Reputa\u00e7\u00e3o', '$8.250', '$14.700', '$22.050', '$27.563', '$33.075',
       '$105.638'],
      ['**TOTAL**', '**$68.750**', '**$122.500**', '**$183.750**', '**$229.688**',
       '**$275.625**', '**$880.313**'],
    ],
    col_widths=[1.2, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8]
  )

  p_text(doc, 'O crescimento do or\u00e7amento acompanha a evolu\u00e7\u00e3o da receita: de **$68.750** '
      'no Y1 (13,5% de $550.080 menos ajustes) para **$275.625** no Y5 (13,5% de '
      '$2.504.721 menos ajustes). A escala crescente permite investimentos em canais '
      'de maior custo fixo (eventos, parcerias) a partir do Y2-Y3.')

  table_sub(doc, 'Tabela 3.2.4b: Detalhamento do Marketing Digital (Y1)')
  make_table(doc,
    ['Canal Digital', 'Or\u00e7amento Y1', '% do Digital', 'KPI Principal'],
    [
      ['LinkedIn Ads', '$8.000', '36%', 'Leads B2B qualificados/m\u00eas'],
      ['Google Ads (Search)', '$5.500', '25%', 'Custo por lead < $150'],
      ['SEO + Conte\u00fado', '$4.000', '18%', 'Tr\u00e1fego org\u00e2nico +20%/trimestre'],
      ['Email Marketing', '$2.500', '11%', 'Taxa de abertura > 25%'],
      ['YouTube/V\u00eddeo', '$2.000', '10%', 'Visualiza\u00e7\u00f5es > 5.000/m\u00eas'],
      ['**Total Digital Y1**', '**$22.000**', '**100%**', '\u2014'],
    ],
    col_widths=[1.5, 1.0, 0.8, 2.5]
  )

  p_text(doc, 'O **LinkedIn Ads** recebe a maior fatia do or\u00e7amento digital por oferecer '
      'segmenta\u00e7\u00e3o precisa por cargo, setor e localidade \u2014 essencial para '
      'alcance B2B. O **Google Ads** captura demanda ativa (profissionais '
      'buscando servi\u00e7os espec\u00edficos), enquanto **SEO** constr\u00f3i tr\u00e1fego '
      'org\u00e2nico de longo prazo com custo marginal decrescente.')

  highlight_box(doc, '**Investimento em Marketing**: **$880.313** em 5 anos (13,5% da receita), '
         'com LTV/CAC ratio de **10x** no Y1 crescendo para **42x** no Y5, '
         'indicando efici\u00eancia crescente na aloca\u00e7\u00e3o de recursos.')

  # ================================================================
  # 3.3 Estrategia de Marketing 4.0
  # ================================================================
  doc.add_heading('3.3. Estrat\u00e9gia de Marketing 4.0', level=2)

  p_text(doc, 'O **Marketing 4.0** integra canais digitais e tradicionais em jornada do '
      'cliente otimizada, utilizando **5 frameworks** tabulares que cobrem da '
      'conscientiza\u00e7\u00e3o at\u00e9 a fideliza\u00e7\u00e3o.')

  p = p_text(doc, 'O conceito, introduzido por **Philip Kotler**, prop\u00f5e a '
      'converg\u00eancia entre marketing digital e tradicional. A implementa\u00e7\u00e3o \u00e9 '
      '**progressiva**: no Y1, canais digitais de baixo custo; no Y2-Y3, eventos '
      'presenciais e parcerias; no Y4-Y5, automa\u00e7\u00e3o avan\u00e7ada e conte\u00fado premium.')
  add_footnote(doc, p, 'Kotler, P., Kartajaya, H., & Setiawan, I. (2017). '
         'Marketing 4.0: Moving from Traditional to Digital. Wiley.')

  # -- Tabela 3.3a: Jornada do Cliente --
  doc.add_heading('Jornada do Cliente Digitalizada', level=3)

  p_text(doc, 'O **funil de convers\u00e3o** projetado prev\u00ea taxa de convers\u00e3o de '
      '**8%** no Y1, crescendo para **15%** no Y5 conforme a reputa\u00e7\u00e3o se consolida.')

  table_sub(doc, 'Tabela 3.3a: Jornada do Cliente Digitalizada')
  make_table(doc,
    ['Fase', 'Canal', 'A\u00e7\u00e3o', 'KPI'],
    [
      ['Conscientiza\u00e7\u00e3o', 'LinkedIn Ads, Google Ads',
       'Campanhas segmentadas por setor e cargo',
       'Impress\u00f5es, CTR >2%'],
      ['Considera\u00e7\u00e3o', 'Website, webinars, whitepapers',
       'Conte\u00fado educativo com captura de leads',
       'Leads qualificados/m\u00eas'],
      ['Decis\u00e3o', 'Email nurturing, cases de sucesso',
       'Sequ\u00eancia de 5 emails com prova social',
       'Taxa de convers\u00e3o >8%'],
      ['Compra', 'Proposta personalizada, reuni\u00e3o',
       'Diagn\u00f3stico gratuito + proposta de valor',
       'Ticket m\u00e9dio, win rate'],
      ['Fideliza\u00e7\u00e3o', 'Newsletter, eventos exclusivos',
       'Programa de relacionamento p\u00f3s-venda',
       'NPS >70, upsell rate'],
    ],
    col_widths=[1.2, 1.5, 2.0, 1.3]
  )

  # -- Conte\u00fado Digital --
  doc.add_heading('Estrat\u00e9gia de Conte\u00fado Digital', level=3)

  p_text(doc, 'A estrat\u00e9gia de content marketing posiciona o fundador como **thought leader** '
      'em supply chain, convertendo autoridade t\u00e9cnica em leads qualificados. A produ\u00e7\u00e3o '
      'inclui **artigos t\u00e9cnicos** publicados 2x/semana no LinkedIn e blog corporativo, '
      '**case studies** mensais distribu\u00eddos via website e email para documentar ROI, e '
      '**webinars ao vivo** 2x/m\u00eas no LinkedIn Live e Zoom para gera\u00e7\u00e3o direta de leads. '
      'Trimestralmente, **whitepapers** aprofundados s\u00e3o publicados como conte\u00fado gated '
      'para captura de leads de alta qualidade, complementados por **v\u00eddeo-aulas curtas** '
      'semanais no YouTube e LinkedIn para engajamento e alcance org\u00e2nico.')

  # -- Influ\u00eancia T\u00e9cnica --
  doc.add_heading('Marketing de Influ\u00eancia T\u00e9cnica', level=3)

  p_text(doc, 'A estrat\u00e9gia alavanca **parceiros institucionais** cuja credibilidade t\u00e9cnica '
      'transfere autoridade para a marca Vieira Operations. A parceria com a **APICS/ASCM** '
      '(45.000+ membros no Sudeste) inclui palestras em eventos e certifica\u00e7\u00e3o conjunta. '
      'Com a **UNF College of Business** (8.000+ alunos/ano), a empresa desenvolve guest '
      'lectures e programa de mentoria. O sponsorship de eventos na **Jacksonville Chamber** '
      '(3.000+ empresas membros) e apresenta\u00e7\u00f5es t\u00e9cnicas no **SAP User Group SE** '
      '(2.500+ profissionais) complementam a rede de influ\u00eancia institucional.')

  # -- Automa\u00e7\u00e3o --
  doc.add_heading('Automa\u00e7\u00e3o e Ferramentas Digitais', level=3)

  p_text(doc, 'O stack de ferramentas digitais maximiza **produtividade comercial** com '
      'investimento inferior a **$10.000/ano**. O **HubSpot CRM** ($4.800/ano) centraliza '
      'a gest\u00e3o de leads e pipeline com ROI de 3x em efici\u00eancia comercial. O **LinkedIn '
      'Sales Navigator** ($1.200/ano) gera 25+ leads qualificados/m\u00eas via prospec\u00e7\u00e3o '
      'B2B, enquanto o **Google Analytics 4** (gratuito) otimiza continuamente tr\u00e1fego '
      'e convers\u00e3o. O **Mailchimp Pro** ($1.800/ano) automatiza email marketing e '
      'nurturing para 500+ leads, e o **Canva Pro** ($600/ano) viabiliza produ\u00e7\u00e3o de '
      'conte\u00fado visual in-house.')

  # -- Tabela 3.3e: Metricas --
  doc.add_heading('M\u00e9tricas de Performance Digital (KPIs)', level=3)

  p_text(doc, 'As m\u00e9tricas acompanham **alcance**, **engajamento** e **resultado**, com '
      'monitoramento mensal. O **LTV/CAC ratio** de 10x (Y1) a 42x (Y5) evidencia '
      'efici\u00eancia crescente na aquisi\u00e7\u00e3o de clientes.')

  table_sub(doc, 'Tabela 3.3e: M\u00e9tricas de Performance Digital (KPIs)')
  make_table(doc,
    ['M\u00e9trica', 'Y1 (Meta)', 'Y3 (Meta)', 'Y5 (Meta)'],
    [
      ['Visitantes \u00fanicos/m\u00eas (website)', '2.000', '8.000', '15.000'],
      ['Leads qualificados/m\u00eas', '15', '40', '80'],
      ['Taxa de convers\u00e3o lead-cliente', '8%', '12%', '15%'],
      ['NPS (Net Promoter Score)', '65', '75', '80+'],
      ['CAC (Custo Aquisi\u00e7\u00e3o Cliente)', '$3.500', '$2.500', '$1.800'],
      ['LTV (Lifetime Value)', '$35.000', '$55.000', '$75.000'],
      ['LTV/CAC Ratio', '10x', '22x', '42x'],
      ['Taxa de reten\u00e7\u00e3o anual', '70%', '80%', '85%'],
      ['Receita de upsell/cross-sell', '15%', '25%', '35%'],
    ],
    col_widths=[2.5, 1.0, 1.0, 1.0]
  )

  # ---- Conclusoes da Secao 3 ----
  doc.add_heading('Conclus\u00f5es do Plano de Marketing', level=3)

  p_text(doc, 'O plano de marketing articula **segmenta\u00e7\u00e3o precisa**, '
      '**posicionamento diferenciado** e **execu\u00e7\u00e3o digital mensur\u00e1vel** '
      'em framework orientado a resultados.')

  check(doc, 'Expertise como Ativo de Marketing', '25 anos AmBev/AB InBev aplicados a '
      'supply chain e opera\u00e7\u00f5es como credencial de autoridade t\u00e9cnica')
  check(doc, 'Presen\u00e7a Digital Fortalecida', 'SEO, marketing de influ\u00eancia t\u00e9cnica e '
      'engajamento em comunidades profissionais do Sudeste')
  check(doc, 'ROI de Marketing', 'LTV/CAC ratio projetado de 10x no Y1 crescendo para '
      '42x no Y5, indicando efici\u00eancia crescente')
  check(doc, 'Expans\u00e3o Controlada', 'Jacksonville (Y0-Y1), Savannah (Y2-Y3) e Brunswick '
      '(Y5), acompanhando demanda e capacidade operacional')
  check(doc, 'Or\u00e7amento Fundamentado', '13,5% da receita bruta ($880.313 em 5 anos), '
      'alinhado a benchmarks setoriais para fase de crescimento')

  highlight_box(doc, '**Plano de Marketing**: investimento de **$880.313** em 5 anos gera '
         'receita projetada de **$7.619.836**, com ROI de marketing de **8,7x** '
         'e constru\u00e7\u00e3o de marca refer\u00eancia no Sudeste dos EUA.')

  separator(doc)
  page_break(doc)
