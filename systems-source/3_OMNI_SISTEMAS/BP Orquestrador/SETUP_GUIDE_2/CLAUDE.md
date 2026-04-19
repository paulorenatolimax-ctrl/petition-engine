# CLAUDE.md — BP Generator: Reconstrução Vieira Operations LLC

## MISSÃO

Reconstruir do ZERO o Business Plan da Vieira Operations LLC para petição EB-2 NIW (National Interest Waiver). O output deve ser um .docx com qualidade visual e estrutural IDÊNTICA ao benchmark (Ikaro/InnoTek Vertex LLC). Cada linha, cada subtítulo, cada tabela importa. Este é um documento legal para imigração.

---

## PROCESSO OBRIGATÓRIO (NÃO PULAR NENHUM PASSO)

### FASE 0: LEITURA (antes de qualquer código)
1. Ler `BP_DIRETRIZES_RECONSTRUCAO.md` — catálogo exaustivo de erros das 12 versões anteriores
2. Ler o benchmark `VF_business_plan_ikaro_ferreira_souza.pdf` — extrair texto e analisar CADA página (estrutura, formatação, comprimento de parágrafos, uso de tabelas, bullets, checkmarks)
3. Ler `BP_Pravion_LLC_FINAL.pdf` — segundo benchmark, especialmente Marketing 4.0 (tabelas) e Porter (formato compacto)
4. Ler `V14_business_plan_prompt__1_.docx` — estrutura oficial do BP
5. Ler `V3_Planilha_Financeira_Everton.xlsx` — dados financeiros reais
6. Ler `curriculo_Everton.docx` — experiência do fundador
7. Ler `LOCALIZAC_A_O_ESTRATE_GICA_EVERTON_RODRIGO.pdf` e `ESTRATE_GIA_EVERTON_RODRIGO_VIEIRA.pdf` — dados de estratégia e localização

### FASE 1: PLANEJAMENTO
1. Gerar outline completo do documento com todas as seções e subseções
2. Para cada seção, listar: conteúdo esperado, formato (tabela/bullets/texto), dados necessários
3. Validar outline contra checklist do DIRETRIZES

### FASE 2: GERAÇÃO SEÇÃO POR SEÇÃO
1. Gerar cada seção individualmente usando python-docx ou docx-js
2. Após cada seção: verificar comprimento de parágrafos (<400 chars), heading styles, subtítulos
3. Usar lxml/XML quando necessário para formatação avançada (shading, tabelas complexas)

### FASE 3: VALIDAÇÃO (CRÍTICA — NÃO PULAR)
1. Converter .docx para .pdf
2. Extrair texto de CADA PÁGINA do PDF
3. Verificar:
   - Nenhum parágrafo > 400 caracteres
   - Nenhum subtítulo com style Normal (deve ser Heading3/4)
   - Nenhum conteúdo duplicado
   - Todas as seções presentes (comparar contra outline)
   - Numeração sequencial correta
   - Tabelas com subtítulos em itálico
4. Comparar visualmente: converter páginas a JPEG e comparar com benchmark Ikaro
5. Se QUALQUER problema for encontrado: corrigir e re-validar (loop até perfeito)

### FASE 4: ENTREGA
1. Salvar .docx final
2. Gerar .pdf final
3. Log de validação mostrando todos os checks passados

---

## ESTRUTURA OBRIGATÓRIA DO BP

```
COVER PAGE
SUMÁRIO (Table of Contents)
SEPARATOR (━━━)

1. EXECUTIVE SUMMARY
   1.1. Oportunidade de Negócio
   1.2. Serviços Oferecidos ← OBRIGATÓRIO
        - 6 serviços em tabela + bullets detalhados
   1.3. Timeline do Negócio
   1.4. Visão, Missão e Valores
   1.5. Enquadramento Jurídico

2. ANÁLISE ESTRATÉGICA DE MERCADO
   2.1. Perspectivas do Mercado
   2.2. Cadeia de Suprimentos
   2.3. Empregabilidade Esperada (Direta e Indireta)
   2.4. Gestão do Conhecimento
   2.5. Impactos ESG
   2.6. Análise SWOT (formato tabela 2x2)
   2.7. SWOT Cruzada (tabela estratégias SO/WO/ST/WT)
   2.8. Análise de Porter — Cinco Forças
      2.8.1. Análise de Concorrentes (tabela comparativa)
      2.8.2. Ameaça de Novos Entrantes (tabela barreiras + lista numerada)
      2.8.3. Poder de Negociação dos Clientes (bullets + tabela)
      2.8.4. Poder de Negociação dos Fornecedores (tabela + bullets mitigação)
      2.8.5. Produtos ou Serviços Substitutos (tabela + bullets mitigação)

3. MARKETING PLAN
   3.1. Segmentação de Mercado
      3.1.1. Visão Geral da Segmentação
      3.1.2. Público-Alvo B2C
         - Perfil Demográfico (H3)
         - Perfil Comportamental (H3) ← NÃO repetir "Demográfico"
         - Perfil Psicográfico (H3)
         - Perfil Geográfico (H3)
      3.1.3. Setor-Alvo B2B
      3.1.4. Posicionamento da Marca
   3.2. Marketing Mix ← OBRIGATÓRIO (seção integradora dos 4Ps)
      3.2.1. Produto — Análise de Valor
      3.2.2. Estratégia de Preço
      3.2.3. Praça — Estratégia de Distribuição
      3.2.4. Promoção — Orçamento de Marketing
   3.3. Estratégia de Marketing 4.0 (5 TABELAS, mínimo texto)

4. OPERATIONAL PLAN
   4.1. Layout do Empreendimento
   4.2. Recursos Físicos e Equipamentos ← DEVE TER CONTEÚDO
   4.3. Quadro de Funcionários ← DEVE TER CONTEÚDO
   4.4. Recursos Tecnológicos
   4.5. Localização do Negócio
   4.6. Capacidade Produtiva

5. FINANCIAL PLAN
   5.1. Premissas Financeiras
   5.2. Investimentos
   5.3. Estimativa de Receitas e Custos
   5.4. DRE — Demonstrativo de Resultados
   5.5. Indicadores de Retorno
   5.6. Break Even Point

6. FINAL CONSIDERATIONS
   6.1. Timeline de Implementação
   6.2. Considerações Finais
   6.3. Referências e Fontes
```

---

## REGRAS DE FORMATAÇÃO (INVIOLÁVEIS)

### Parágrafos
- **MAX 5 linhas / ~400 caracteres** — sem exceção
- Justificado, espaçamento 1.15 (line spacing 276 twips)
- Fonte Garamond 11pt (body) / headers conforme hierarquia
- Termos-chave em **negrito** inline (3-5 por parágrafo)

### Headings
- **H1**: CAIXA ALTA, negrito, 16pt — ex: "1. EXECUTIVE SUMMARY"
- **H2**: Title Case, negrito, 13pt — ex: "1.1. Oportunidade de Negócio"
- **H3**: Title Case, negrito, 11pt — para subsections
- **H4**: Itálico, 11pt — para subtítulos de tabelas e divisões internas
- **NUNCA** usar style Normal para subtítulos

### Tabelas
- TODA tabela deve ter subtítulo em itálico precedendo-a
- Header row: background #E8E0D4, bold, font 9pt
- Body rows: font 9pt
- Borders: cinza claro (#CCCCCC), single, 0.5pt
- Cell padding: top/bottom 40 twips, left/right 80 twips

### Bullets
- Formato: `• **Termo Bold**: explicação do termo...`
- Indent: 720 twips (0.5"), hanging 360 twips
- Não usar unicode bullets em python-docx; usar list style ou XML direto

### Checkmarks
- Formato: `✔ **Conclusão Bold**: texto explicativo`
- Usar após seções importantes como resumo/takeaway
- 2-4 checkmarks por seção

### Listas Numeradas
- Formato: `1. **Título Bold**: explicação`
- Usar em Porter's Forces (vantagens competitivas)
- Sequencial, sem reset entre itens da mesma lista

---

## DADOS DO NEGÓCIO

### Empresa
- **Vieira Operations LLC** | S-Corporation | Jacksonville, FL
- NAICS 541611 | EIN: a registrar
- Fundador: Everton Rodrigo Vieira, brasileiro, 25 anos experiência AmBev/AB InBev

### 6 Serviços
1. Otimização Avançada de Supply Chain Industrial
2. Implementação de Sistemas ERP (SAP Fiori/S4HANA)
3. Gestão de Projetos Emergenciais e Infraestrutura Essencial
4. Conformidade Regulatória Industrial (EPA, OSHA, FDA)
5. Capacitação Técnica e Desenvolvimento de Força de Trabalho
6. Treinamento de Liderança e Gestão Empresarial

### Financeiro
- Investimento total 5 anos: $382.917
- Investimento Y0: $121.700
- Receita bruta acumulada 5 anos: $7.619.836
- Margem contribuição média: 80.2%
- Break-even: ~Mês 6
- NPV (10%): $1.243.218
- IRR: 187%
- Payback descontado: 14 meses

### Empregos
- Diretos Ano 5: 14
- Multiplicador EPI (NAICS 5416): 4.43x
- Indiretos: ~62
- Total: ~76

### Códigos SOC
- 11-3071 Transportation, Storage, and Distribution Managers
- 13-1081 Logisticians
- 15-1299 Computer Occupations, All Other
- 13-1111 Management Analysts
- 11-3051 Industrial Production Managers

### Resultados Documentados
- 48% redução custos variáveis em supply chain
- SAP Fiori: antecipação 2 anos e 4 meses
- Planta oxigênio medicinal (COVID-19)
- R$380 bi em ativos gerenciados

### Expansão Geográfica
- Y0-Y1: Jacksonville, FL (sede)
- Y2-Y3: Savannah, GA (branch 1)
- Y5: Brunswick, GA (branch 2)

---

## ANTIPADRÕES (O QUE NUNCA FAZER)

1. ❌ Inserir conteúdo novo sem remover o antigo → duplicação
2. ❌ Subtítulos como texto Normal → ficam "jogados" no documento
3. ❌ Parágrafos > 5 linhas → wall of text
4. ❌ Marketing 4.0 como texto corrido → DEVE ser tabelas
5. ❌ Repetir "Perfil Demográfico" 3x → são perfis DIFERENTES
6. ❌ Numeração com saltos (3.2.2 → 3.3.3) → deve ser sequencial
7. ❌ Seções sem corpo de texto (heading sem conteúdo abaixo)
8. ❌ Separadores markdown ("---") em .docx
9. ❌ Gerar sem ler os benchmarks primeiro
10. ❌ Entregar sem validar página por página

---

## VALIDAÇÃO AUTOMATIZADA

Após gerar o .docx, rodar este script de validação:

```python
# validation_checklist.py
from docx import Document
import sys

def validate(docx_path):
    doc = Document(docx_path)
    errors = []
    warnings = []
    
    # 1. Check paragraph length
    for i, p in enumerate(doc.paragraphs):
        if len(p.text.strip()) > 500:
            errors.append(f"ERRO: Para {i} tem {len(p.text)}ch (max 400): {p.text[:60]}...")
        elif len(p.text.strip()) > 400:
            warnings.append(f"AVISO: Para {i} tem {len(p.text)}ch: {p.text[:60]}...")
    
    # 2. Check orphan subtitles
    for i, p in enumerate(doc.paragraphs):
        text = p.text.strip()
        style = p.style.name
        if style == 'Normal' and 20 < len(text) < 100:
            if not text.startswith('•') and not text.startswith('✔') and not text.startswith('━'):
                if not any(c.isdigit() for c in text[:3]):
                    if text[0].isupper():
                        errors.append(f"ERRO: Subtítulo órfão [{style}] para {i}: {text}")
    
    # 3. Check duplicate content
    seen_texts = {}
    for i, p in enumerate(doc.paragraphs):
        text = p.text.strip()
        if len(text) > 200:
            key = text[:100]
            if key in seen_texts:
                errors.append(f"ERRO: Conteúdo duplicado para {i} = para {seen_texts[key]}: {text[:60]}...")
            seen_texts[key] = i
    
    # 4. Check required sections
    headings = [(i, p.text.strip(), p.style.name) for i, p in enumerate(doc.paragraphs) if 'Heading' in p.style.name]
    heading_texts = [h[1] for h in headings]
    
    required = [
        'Serviços', 'Marketing Mix', 'Perfil Comportamental', 'Perfil Psicográfico',
        'Perfil Geográfico', 'Recursos Físicos', 'Quadro de Funcionários'
    ]
    for req in required:
        if not any(req.lower() in h.lower() for h in heading_texts):
            errors.append(f"ERRO: Seção obrigatória ausente: {req}")
    
    # 5. Check numbering
    for i, (idx, text, style) in enumerate(headings):
        if 'Heading2' in style and text[0].isdigit():
            # Check for gaps - simplified
            pass
    
    # 6. Check headings without content
    for i, (idx, text, style) in enumerate(headings):
        if i + 1 < len(headings):
            next_idx = headings[i+1][0]
            content_between = [p for p in doc.paragraphs[idx+1:next_idx] if p.text.strip()]
            if not content_between:
                warnings.append(f"AVISO: Heading sem conteúdo: {text}")
    
    # Report
    print(f"\n{'='*60}")
    print(f"VALIDAÇÃO: {docx_path}")
    print(f"{'='*60}")
    print(f"Erros: {len(errors)} | Avisos: {len(warnings)}")
    for e in errors:
        print(f"  🔴 {e}")
    for w in warnings:
        print(f"  🟡 {w}")
    
    if not errors:
        print("\n✅ DOCUMENTO APROVADO!")
    else:
        print(f"\n❌ DOCUMENTO REPROVADO — {len(errors)} erros a corrigir")
    
    return len(errors) == 0

if __name__ == '__main__':
    validate(sys.argv[1])
```

**Rodar após cada geração. Loop até 0 erros.**

---

## ARQUIVOS NESTE PROJETO

### Referência (benchmarks)
- `VF_business_plan_ikaro_ferreira_souza.pdf` — BENCHMARK PRINCIPAL (67 páginas)
- `BP_Pravion_LLC_FINAL.pdf` — benchmark secundário (48 páginas, Marketing 4.0 tabular)

### Dados do caso Everton
- `V14_business_plan_prompt__1_.docx` — prompt/estrutura oficial
- `V6_prompts_BP_completo_otimizac_a_o_prompts.docx` — prompts de otimização
- `V3_Planilha_Financeira_Everton.xlsx` — dados financeiros
- `curriculo_Everton.docx` — currículo do fundador
- `LOCALIZAC_A_O_ESTRATE_GICA_EVERTON_RODRIGO.pdf` — localização
- `ESTRATE_GIA_EVERTON_RODRIGO_VIEIRA.pdf` — estratégia

### Regulamentação EB2-NIW
- `Chapter_5__Advanced_Degree_or_Exceptional_Ability___USCIS.pdf`
- `eCFR____8_CFR_204_5__Petitions_for_employmentbased_immigrants_.pdf`
- `BILLS-119hr1enr.pdf`
- `II__EB2_NIAF2025.pdf`
- `Mudanc_as_no_EB2_NIW_2025__II.pdf`
- `O_Adjudicador_Algori_tmico__2026.pdf`

### Orçamento federal
- `M2534NSTM2FiscalYearFY2027...pdf`
- `FiscalYear2026DiscretionaryBudgetRequest.pdf`

### Diretrizes
- `BP_DIRETRIZES_RECONSTRUCAO.md` — post-mortem de 12 versões com catálogo de erros
- `BP_Vieira_Operations_LLC_v12.docx` — última versão (referência do que NÃO fazer)
