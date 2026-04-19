# LIÇÕES TÉCNICAS — CASO ANDREA MEDEIROS (EB-2 NIW)
## Bugs Reais + Fixes Obrigatórios para Todo Caso Futuro
## v1.0 — 02/03/2026 — Extraído de auditoria QC completa (65 páginas, 21 problemas)

---

## POR QUE ESTE DOCUMENTO EXISTE

O caso Andrea Medeiros foi o primeiro EB-2 NIW gerado pelo sistema multi-agente. A auditoria de QC (Claude Opus, página por página no PDF) encontrou **21 problemas** em 4 níveis de severidade. Este documento registra CADA bug e o fix definitivo para que NUNCA se repitam.

**REGRA**: Ler este documento ANTES de gerar qualquer cover letter. Cada item aqui é uma armadilha real que o sistema caiu.

---

## 🔴 NÍVEL 1 — GRAVÍSSIMAS (bloqueiam entrega)

### BUG-01: Acentuação Portuguesa Massivamente Incompleta
**O que aconteceu**: O word_map inicial cobria ~100 palavras. A auditoria do PDF final encontrou 146+ palavras sem acento, incluindo palavras comuns como "páginas" (22x), "estratégia" (28x), "Dossiê" (12x).

**O sistema reportou "ZERO remaining unaccented words"** — FALSO. O scan interno verificava o .docx antes da renderização completa, e não cobria todas as palavras.

**FIX OBRIGATÓRIO**:
```python
# O word_map DEVE conter no MÍNIMO estas palavras (lista não exaustiva):
WORD_MAP_MINIMO = {
    # Batch 1: Acentos comuns em texto jurídico/financeiro
    "paginas": "páginas", "pagina": "página",
    "estrategia": "estratégia", "estrategias": "estratégias",
    "trilhao": "trilhão", "trilhoes": "trilhões",
    "merito": "mérito", "meritos": "méritos",
    "emprestimos": "empréstimos", "emprestimo": "empréstimo",
    "avancar": "avançar", "avanco": "avanço",
    "criterios": "critérios", "criterio": "critério",
    "benefico": "benéfico", "benefica": "benéfica",
    "serie": "série", "series": "séries",
    "Dossie": "Dossiê", "dossie": "dossiê",
    "marco": "março",  # CUIDADO: só quando refere ao mês
    "tipica": "típica", "tipicas": "típicas", "tipico": "típico",
    "teorica": "teórica", "teorico": "teórico",
    "analitica": "analítica", "analiticas": "analíticas",
    "especificos": "específicos", "especifica": "específica",
    "especificas": "específicas",
    "codigo": "código", "codigos": "códigos",
    "historicos": "históricos", "historico": "histórico",
    "Sintese": "Síntese", "sintese": "síntese",
    "jurisdicao": "jurisdição",
    "dinamica": "dinâmica", "dinamico": "dinâmico",
    "individuos": "indivíduos",
    "Peca": "Peça", "peca": "peça",
    "esforcos": "esforços", "esforco": "esforço",
    "portfolios": "portfólios",
    
    # Batch 2: Verbos e formas verbais
    "sera": "será", "serao": "serão",
    "tambem": "também",
    "ja": "já",
    "so": "só",  # CUIDADO: contexto — "só" advérbio vs "so" em inglês
    "ate": "até",
    "alem": "além",
    "analise": "análise", "analises": "análises",
    "indice": "índice", "indices": "índices",
    "orgao": "órgão", "orgaos": "órgãos",
    "regiao": "região", "regioes": "regiões",
    "padrao": "padrão", "padroes": "padrões",
    "diferenca": "diferença", "diferencas": "diferenças",
    "expressao": "expressão",
    "profissao": "profissão",
    "ultimos": "últimos", "ultima": "última", "ultimo": "último",
    "unico": "único", "unica": "única",
    "pratica": "prática", "praticas": "práticas",
    "politica": "política", "politicas": "políticas",
    "economica": "econômica", "economico": "econômico",
    "tecnica": "técnica", "tecnico": "técnico",
    "credito": "crédito", "creditos": "créditos",
    "solido": "sólido", "solida": "sólida",
    "liquido": "líquido", "liquida": "líquida",
    "balanco": "balanço",
    "investidor": "investidor",  # sem acento — mas verificar "aplicacao"
    "aplicacao": "aplicação", "aplicacoes": "aplicações",
    "gestao": "gestão",
    "transacao": "transação", "transacoes": "transações",
    "operacao": "operação", "operacoes": "operações",
    "regulacao": "regulação",
    "instituicao": "instituição", "instituicoes": "instituições",
    
    # Batch 3: Nomes próprios
    "Estacio": "Estácio", "estacio": "Estácio",
    "Lazaro": "Lázaro", "lazaro": "lázaro",
    "Brandao": "Brandão", "brandao": "brandão",
}

# PROTEÇÃO DE URLs: NUNCA corrigir acentos dentro de URLs
def _fix_run(run):
    if not pattern.search(run.text):
        return 0
    if run.text.startswith("http") or "://" in run.text or ".com" in run.text:
        return 0  # Pular URLs
    # ... aplicar correções
```

**VALIDAÇÃO**: Após gerar o .docx, converter para PDF e fazer scan OCR do PDF real. O scan do .docx NÃO é suficiente.

---

### BUG-02: "satisfaz/satisfaço" sobre Critérios (10 ocorrências)
**O que aconteceu**: O texto gerado usava "satisfaz/satisfaço/satisfazendo" 10 vezes referindo-se a critérios/prongs. Viola FORBIDDEN_CONTENT Categoria 0.

**FIX**: Busca automatizada + substituição:
```python
SATISFAZ_PATTERNS = [
    ("Satisfaço este requisito", "Atendo a este requisito"),
    ("satisfaz plenamente o requisito", "atende plenamente ao requisito"),
    ("satisfaz integralmente", "atende integralmente"),
    ("satisfaço integralmente", "atendo integralmente"),
    ("satisfazendo plenamente", "atendendo plenamente"),
    ("satisfaz o padrão", "atende ao padrão"),
    ("satisfazendo o padrão", "atendendo ao padrão"),
]
```

---

### BUG-03: "Attesta" com Duplo T (9 ocorrências)
**O que aconteceu**: O texto usava "Attesta/attestam" (grafia inglesa) em vez de "Atesta/atestam" (português correto).

**FIX**: Adicionar ao word_map:
```python
"Attesta": "Atesta", "attesta": "atesta",
"attestam": "atestam", "Attestam": "Atestam",
```

---

### BUG-04: Thumbnails com Orientação Errada
**O que aconteceu**: Evidências 2, 4, 7, 8 (diplomas/certificados ANBIMA) são documentos em formato paisagem, mas foram renderizados verticalmente na coluna de 3.5cm, ficando comprimidos e ilegíveis.

**FIX**:
```python
# Detectar orientação do documento
from PIL import Image
img = Image.open(thumb_path)
width, height = img.size
if width > height:  # Documento paisagem
    # Opção A: Layout 1 coluna full-width (sem thumbnail lateral)
    # Opção B: Expandir coluna thumbnail para ~7cm
    pass
```

---

### BUG-05: Thumbnails Não Correspondem ao Documento
**O que aconteceu**: Evidências 27, 28, 29 tinham miniaturas que não correspondiam ao conteúdo real dos documentos (Cartas de Carlos Luiz, Isabella, Bruno).

**FIX**: Após gerar thumbnails, verificar programaticamente:
1. Extrair texto OCR da miniatura
2. Comparar com o título esperado do documento
3. Se não match → regenerar do arquivo correto

---

### BUG-06: Fundo Preto/Cinza Escuro em Thumbnails
**O que aconteceu**: Evidências 41, 42 tinham thumbnails com background escuro grotesco.

**CAUSA RAIZ**: Uso de `ShadingType.SOLID` em vez de `ShadingType.CLEAR`.

**FIX DEFINITIVO**:
```javascript
// SEMPRE usar ShadingType.CLEAR para qualquer shading
shading: { fill: "FFF2CC", type: ShadingType.CLEAR }

// NUNCA usar ShadingType.SOLID — causa fundo preto em muitos viewers
// shading: { fill: "FFF2CC", type: ShadingType.SOLID }  ← PROIBIDO
```

---

## 🟠 NÍVEL 2 — GRAVES

### BUG-07: Evidence Blocks Sem Fundo Colorido
**O que aconteceu**: FORMATTING_SPEC exige shading #FFF2CC (cream) em AMBAS as células do evidence block. O output tinha apenas borda simples, sem fundo.

**FIX**: Aplicar shading em AMBAS as células:
```javascript
new TableCell({
    shading: { fill: "FFF2CC", type: ShadingType.CLEAR },
    // ... conteúdo
})
```

---

### BUG-08: Espaços Vazios em Evidence Blocks
**O que aconteceu**: O campo "Description & Impact/Relevance" tinha textos curtos (1-2 linhas) quando deveria ter 4-8 linhas densas com conexão ao prong.

**FIX**: Cada Description deve conter:
1. O que o documento é (1 linha)
2. O que demonstra especificamente (1-2 linhas)
3. Conexão com o prong onde está inserido (1-2 linhas)
4. Dado quantitativo quando aplicável (1 linha)

---

### BUG-09: H4 Subheadings Cor Errada
**O que aconteceu**: Subtítulos H4 usavam cores azul/teal. FORMATTING_SPEC proíbe azul. A cor correta extraída do XML do benchmark (Márcia) é `#F2F5D7` (light yellow).

**ATENÇÃO**: O Claude Code tentou "corrigir" #F2F5D7 para #F7F9EE chamando-o de "ugly green". #F2F5D7 É o correto. NUNCA substituir.

**FIX**:
```python
H4_SHADING = "#F2F5D7"  # Light yellow — extraído XML benchmark Márcia
# NÃO usar: #F7F9EE (inventado pelo Claude Code)
# NÃO usar: qualquer azul/teal
```

---

### BUG-10: "Sediada" para Empresa Planejada (com nuance)
**O que aconteceu**: Texto dizia "A Pravion será sediada em Winter Haven". Mas p50 dizia "em fase de planejamento e constituição" — contradição.

**FIX**: Verificar se Articles of Organization existem e estão ASSINADOS:
- Se assinados/registrados → OK usar "sediada"
- Se rascunho ou inexistentes → usar "projetada para"

---

### BUG-11: Contagem de Páginas Insuficiente
**O que aconteceu**: 65 páginas quando benchmarks têm 73-92.

**FIX**: Monitorar contagem durante produção. Se abaixo de 73:
- Expandir Prong 1 (mais tabelas de dados federais)
- Expandir Prong 2 (mais detalhes por emprego + por carta)
- Expandir evidence descriptions

---

## 🟡 NÍVEL 3 — MELHORIAS

### BUG-12: Recuo em Evidence Blocks
Evidence blocks tinham ~1cm de recuo. Devem ser full-width.

### BUG-13: Tabelas Analíticas Sem Fundo
Tabelas de dados (CETs, BLS, etc.) não tinham header com shading. Devem ter #D6E1DB (verde PROEX) ou #E3DED1 (bege/marrom) conforme hierarquia.

### BUG-14: Gráficos/Infográficos Ausentes
Prong 1 deveria ter pelo menos 1 gráfico de barras (growth rate SOC vs. all occupations).

### BUG-15: "Portfolios" → "Portfólios" (5x)
### BUG-16: "Esforços" Sem Acento (p35/39)

---

## 🔵 NÍVEL 4 — REFINAMENTOS

### BUG-17: Footer Verificação
Confirmar que footer aparece em TODAS as páginas com formato correto.

### BUG-18: "Estácio de Sa" → "Estácio de Sá"
Nome próprio de universidade — acento obrigatório.

### BUG-19: Fontes 100% Garamond
Verificar que NENHUM texto usa fonte diferente (especialmente em tabelas e footnotes).

### BUG-20: Prong Headers Caixa Alta
"PRONG II — A PETICIONÁRIA ESTÁ BEM POSICIONADA" — "ESTÁ" em maiúsculas.

### BUG-21: "Peca" → "Peça" (p8)

---

## CHECKLIST PÓS-GERAÇÃO (rodar contra CADA .docx)

```python
# Executar TODOS estes checks antes de entregar

checks = [
    # NÍVEL 1
    "accent_scan",          # Comparar texto contra word_map expandido (200+ palavras)
    "satisfaz_scan",        # ZERO "satisfaz/satisfaço/satisfazendo" sobre critérios
    "attesta_scan",         # ZERO "Attesta/attestam" (duplo T)
    "thumbnail_orientation",# Detectar paisagem, ajustar layout
    "thumbnail_match",      # Verificar que thumbnail = documento certo
    "shading_type_check",   # ZERO ShadingType.SOLID (previne fundo preto)
    
    # NÍVEL 2
    "evidence_shading",     # #FFF2CC em AMBAS células de CADA evidence block
    "evidence_description", # Mínimo 4 linhas por Description
    "h4_color_check",       # #F2F5D7 (NÃO #F7F9EE, NÃO azul)
    "planned_entity_check", # "sediada" apenas se Articles of Org existem
    "page_count",           # Mínimo 73 páginas
    
    # NÍVEL 3-4
    "evidence_indent",      # Full-width (zero recuo)
    "table_header_shading", # #D6E1DB ou #E3DED1 em headers de tabela
    "footer_check",         # Presente em todas as páginas
    "font_check",           # 100% Garamond
    "forbidden_content",    # Nomes, employer, voz, seções proibidas
    "evidence_bold",        # "Evidence XX" sempre bold
    "color_check",          # ZERO azul
    "language_check",       # 100% PT-BR (exceto termos técnicos em italic)
]
```

---

## NOTA SOBRE AUTO-VERIFICAÇÃO DO CLAUDE CODE

O Claude Code tem tendência a reportar "ZERO erros" e "tudo correto" quando na verdade o output tem problemas. Isso acontece porque:

1. O scan interno verifica o .docx em memória, não o PDF renderizado
2. O word_map pode não cobrir todas as palavras necessárias
3. A verificação de cores pode não pegar shading em nested elements

**MITIGAÇÃO**: O sistema de QC humano (Paulo + Claude Opus) sempre faz auditoria no PDF final, página por página. O sistema NÃO deve confiar em seus próprios relatórios de "zero erros" — deve aplicar os fixes preventivamente.

---

*v1.0 — 02/03/2026 — Extraído de auditoria real*
*Aplicar a TODO caso futuro, não apenas Andrea*
