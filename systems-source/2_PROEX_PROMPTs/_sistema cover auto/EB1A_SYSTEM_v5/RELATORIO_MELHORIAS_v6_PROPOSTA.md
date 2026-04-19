# RELATÓRIO DE MELHORIAS — PROPOSTA v6.0
## Baseado nas Lições do Caso Vitória Carolina (Cover Letter v3→v7)
## Data: 26/03/2026
## Autor: Cowork (sessão de revisão com Paulo)

---

## RESUMO EXECUTIVO

Durante a produção da cover letter de Vitória Carolina, o sistema v5 foi testado em condições reais de produção completa (documento final de ~78.000 palavras, 113 tabelas, 90 imagens, 105 footnotes). O processo expôs **12 gaps críticos** que o sistema atual não previne ou não trata adequadamente. Este relatório propõe melhorias organizadas por prioridade.

---

## SEÇÃO 1 — GAPS CRÍTICOS ENCONTRADOS (BUGS REAIS)

### GAP 1: Meta-instruções sobrevivem à produção
**O que aconteceu**: Texto como "EXPANSÃO: ~2.500 palavras", "Inserir antes/após do trecho X", "FIM DO EXPANSION TEXT" e blocos de caracteres █████ sobreviveram em TODAS as versões (v3→v6), só sendo eliminados na v7 por regex direto no XML.

**Causa raiz**: O sistema não tem NENHUMA regra proibindo meta-instruções de produção no documento final. FORBIDDEN_CONTENT.md lista proibições de conteúdo semântico (nomes, termos), mas não proíbe artefatos do próprio processo de geração.

**Recomendação**: Adicionar **CATEGORIA 9: ARTEFATOS DE PRODUÇÃO** ao FORBIDDEN_CONTENT.md:
```
PROIBIDO no documento final:
- "EXPANSÃO:" ou "~N palavras" (instruções de expansão)
- "Inserir antes" / "Inserir após" (instruções de edição)
- "FIM DO EXPANSION" / "FIM DO TEXTO" (marcadores de bloco)
- Caracteres █ (tarjas de placeholder)
- "TODO:" / "FIXME:" / "NOTA PARA" (comentários internos)
- Qualquer texto entre 【】ou similar (delimitadores de instrução)
```

**Impacto**: ALTO — 4 versões foram geradas com esses artefatos antes da correção manual.

---

### GAP 2: Sem regra para substituição de siglas/acrônimos
**O que aconteceu**: Quando "ABRASCI" precisou ser expandida para "a Academia Brasileira de Ciências, Artes, História e Literatura" no texto, a substituição mecânica criou 45+ instâncias de artigos duplicados: "da a Academia", "A a Academia", "na a Academia", porque o texto original já tinha artigos antes de "ABRASCI".

**Causa raiz**: O sistema não tem protocolo para substituição de siglas que interagem com artigos/preposições do português.

**Recomendação**: Adicionar seção ao DOCX_PRODUCTION_PIPELINE.md:
```
## SUBSTITUIÇÃO DE SIGLAS — PROTOCOLO
Ao expandir qualquer sigla para nome completo:
1. Identificar se a expansão começa com artigo (a, o, as, os)
2. Se sim, verificar TODA ocorrência quanto a artigos/preposições precedentes
3. Regex: substituir "da SIGLA" → "da [nome sem artigo]", não "da a [nome]"
4. Testar combinações: de/da/do/na/no/pela/pelo/à/ao + artigo do nome
5. Rodar verificação pós-substituição: procurar padrões "a a ", "o o ", "da a ", etc.
```

**Impacto**: MÉDIO-ALTO — criou 45+ erros gramaticais em uma única substituição.

---

### GAP 3: Citações jurisprudenciais truncadas durante edição
**O que aconteceu**: Em 6 lugares do documento, "Kazarian v. USCIS, 596 F.3d 1115 (9th Cir. 2010)" estava truncado para "Kazarian v. USCIS, 596 F.3d 1115 (9th Cir." — faltando ", 2010)" — ou seja, a citação jurídica mais importante do documento estava incompleta.

**Causa raiz**: Provavelmente corte durante edição/expansão de texto. O sistema tem regra para citar corretamente (QUALITY_GATES 3.2), mas NÃO tem validação automática que VERIFIQUE se a citação completa está presente no documento final.

**Recomendação**: Adicionar ao script de validação (`validate_evidence_package.py` ou novo `validate_final_docx.py`):
```python
REQUIRED_CITATIONS = {
    "Kazarian": r"596 F\.3d 1115.*?9th Cir\..*?2010",
    "PA-2025-16": r"PA-2025-16",
    "Mukherji": r"4:24-CV-3170.*?D\.\s*Neb",
    "Loper Bright": r"Loper Bright",
}
# Para cada citação obrigatória, verificar presença e completude
```

**Impacto**: ALTO — citação jurídica incompleta é erro profissional grave.

---

### GAP 4: Footnotes em inglês no documento em português
**O que aconteceu**: Footnotes nativos do Word (em footnotes.xml) foram escritos em inglês ("Certificate listing", "Official BLS data", "Published research") enquanto o corpo estava em português.

**Causa raiz**: FORBIDDEN_CONTENT Categoria 7 (Idioma) menciona "Notas de rodapé (texto explicativo)" como conteúdo que deve estar em português, mas não especifica que isso inclui footnotes.xml (footnotes nativos do Word). A regra é ambígua quanto a footnotes programáticos vs. textuais.

**Recomendação**: Expandir Categoria 7 do FORBIDDEN_CONTENT.md:
```
REGRA: Footnotes nativos do Word (footnotes.xml) seguem a MESMA regra
de idioma que o corpo. Texto explicativo em português brasileiro.
EXCEÇÃO: URLs, nomes de leis, citações textuais de regulamentos.
```

**Impacto**: MÉDIO — 30+ footnotes precisaram tradução manual.

---

### GAP 5: URLs quebrados/inventados no documento
**O que aconteceu**: URLs como "amazon.com.br/...", "books.google.com/..." e "sucupira.capes.gov.br/..." apareceram no documento com "..." literal — ou seja, URLs truncados que não funcionam.

**Causa raiz**: O modelo de linguagem gera URLs baseados em padrão mas sem verificar se são reais. O sistema não tem regra específica sobre URLs truncados com "..." ou "/...".

**Recomendação**: Adicionar ao FORBIDDEN_CONTENT.md:
```
CATEGORIA 10: URLs
- PROIBIDO: URLs com "..." ou reticências (indicam URL inventada/truncada)
- PROIBIDO: URLs genéricos tipo "amazon.com.br/dp/..." ou "books.google.com/books?id=..."
- Se a URL real não é conhecida, OMITIR o campo URL ou marcar [VERIFICAR URL]
- Validação regex: qualquer URL contendo "/..." ou "..." → REJEITAR
```

**Impacto**: MÉDIO — URLs quebrados prejudicam credibilidade se o oficial tentar acessar.

---

### GAP 6: Footnote solto no corpo do documento
**O que aconteceu**: Um trecho de footnote ("includ[ing] service on a thesis or dissertation committee") apareceu no meio do corpo do texto em vez de estar dentro de uma nota de rodapé.

**Causa raiz**: Durante expansão/edição, conteúdo de footnote vazou para o corpo. O sistema não valida que TODO conteúdo entre colchetes no padrão "[ing]" pertence a uma citação legal corretamente posicionada.

**Recomendação**: Adicionar check de validação:
```python
# Detectar possíveis footnotes soltos no corpo
# Padrões suspeitos: texto entre colchetes que parece citação legal
# ex: "includ[ing]", "requir[ing]" fora de contexto de citação formal
```

**Impacto**: BAIXO-MÉDIO — raro, mas visualmente chocante.

---

### GAP 7: Proporções do documento não eram validadas automaticamente
**O que aconteceu**: Embora FORBIDDEN_CONTENT Cat. 8 defina proporções alvo (Intro 10-15%, Step 1 40-50%, Step 2 35-45%), NÃO havia validação automática. Nas primeiras versões, as proporções estavam severamente desbalanceadas.

**Causa raiz**: A regra existe no papel mas o script de validação (`validate_evidence_package.py`) não a implementa.

**Recomendação**: Adicionar ao script de validação final:
```python
def validar_proporcoes(docx_path):
    # Extrair texto, encontrar marcadores de seção
    # Calcular % de palavras por seção
    # Rejeitar se: Intro < 8% ou > 18%, Step1 < 35% ou > 55%, Step2 < 30% ou > 50%
    # ALERTA VERMELHO se Step2 < 25%
```

**Impacto**: ALTO — documento desbalanceado pode indicar Step 2 incompleto.

---

### GAP 8: ABRASCI sem regra clara de uso
**O que aconteceu**: FORBIDDEN_CONTENT menciona que "ABRASCI pode ser mencionada no Critério 2 SE Paulo autorizar", mas não define limite de menções, nem se o nome completo deve ser usado após primeira menção.

**Causa raiz**: A regra é condicional ("se Paulo autorizar") mas não define o COMO — quantas vezes, em quais contextos, se expandir ou não.

**Recomendação**: Criar regra explícita:
```
ABRASCI — REGRA DE USO:
- Primeira menção: nome completo "Academia Brasileira de Ciências, Artes,
  História e Literatura (ABRASCI)"
- Menções subsequentes: "a Academia" (forma curta) OU "ABRASCI"
- Limite: máximo 60 menções de "ABRASCI" como sigla no documento total
- Critérios permitidos: 2 (se autorizado), Step 2 (contextual)
- PROIBIDO no Critério 3
```

**Impacto**: BAIXO — específico para casos com ABRASCI, mas evita 45+ erros gramaticais.

---

## SEÇÃO 2 — GAPS ESTRUTURAIS DO SISTEMA

### GAP 9: Sem script de validação do documento FINAL (.docx montado)
**O que aconteceu**: `validate_evidence_package.py` valida o PACOTE de evidências (arquivos, nomes, PDFs), mas NÃO existe script que valide o .docx FINAL montado. Toda validação feita no caso Vitória foi ad-hoc (scripts Python descartáveis rodados na sessão Cowork).

**Recomendação**: Criar `validate_final_docx.py` com:
```python
# 1. FORBIDDEN_CONTENT: todos os termos proibidos
# 2. CITAÇÕES: Kazarian completo, PA-2025-16, Mukherji
# 3. ARTEFATOS: zero meta-instruções, tarjas, TODO, EXPANSÃO
# 4. IDIOMA: zero parágrafos inteiros em inglês (exceto citações regulatórias)
# 5. IDIOMA FOOTNOTES: footnotes nativos em português
# 6. PROPORÇÕES: Intro/Step1/Step2 dentro dos limites
# 7. URLs: zero URLs com "..."
# 8. ARTIGOS DUPLICADOS: zero "a a ", "o o ", "da a ", etc.
# 9. CONTAGEM: tabelas, imagens, footnotes (comparar com expected)
# 10. ESTRUTURA: CRITÉRIO 1...N presentes, STEP 2 presente
```

**Impacto**: CRÍTICO — sem isso, toda validação depende de revisão visual humana.

---

### GAP 10: Conflito QUALITY_GATES 7.6 vs FORMATTING_SPEC (footnotes)
**O que aconteceu**: QUALITY_GATES 7.6 diz "Notas manuais [1],[2]... — MANTER como estão, NÃO tentar converter para footnotes reais do Word". Mas FORMATTING_SPEC (seção Footnotes Nativos, v3.0) diz "OBRIGATÓRIO: Toda referência DEVE ser footnote nativo do Word desde a geração" com exemplo XML de `<w:footnoteReference>`.

**Causa raiz**: Gate 7.6 foi escrito como workaround para o caso Vitória (onde converter era arriscado demais). FORMATTING_SPEC foi escrito como ideal para geração futura. As duas regras se contradizem.

**Recomendação**: Resolver a contradição:
- **Se gerando do zero**: FORMATTING_SPEC prevalece — footnotes nativos obrigatórios
- **Se editando documento existente**: QUALITY_GATES 7.6 prevalece — não converter
- Documentar explicitamente: "Em produção nova, usar footnotes nativos. Em edição/expansão de documento existente, preservar o formato existente."

**Impacto**: ALTO — confunde o Claude Code sobre qual abordagem usar.

---

### GAP 11: Sem protocolo Cowork↔Claude Code
**O que aconteceu**: O fluxo Cowork→Claude Code→Cowork não estava documentado no sistema. Paulo precisou inventar o workflow: Cowork revisa, gera arquivo de instruções .md, Paulo cola no Claude Code, Claude Code executa, Cowork revisa output. O sistema v5 assume que TUDO é feito dentro de um Project do Claude.ai.

**Recomendação**: Adicionar documento `WORKFLOW_COWORK_CLAUDE_CODE.md`:
```
## Fluxo de Produção com Cowork + Claude Code

### Fase de Produção (Claude Code):
- Claude Code recebe documento base + arquivo de instruções
- Executa expansões, formatação, correções
- Gera versão .docx

### Fase de Revisão (Cowork):
- Cowork recebe versão gerada
- Roda validação automática (validate_final_docx.py)
- Identifica problemas visuais e semânticos
- Gera INSTRUCOES_VN_CLAUDE_CODE.md com correções

### Regras do Arquivo de Instruções:
- UM arquivo, UM comando para Claude Code
- Lista exaustiva de problemas COM exemplos
- Regex sugeridos quando aplicável
- Checklist de verificação para Claude Code rodar após correções
```

**Impacto**: ALTO — o sistema assume um workflow que não é o real.

---

### GAP 12: Sem lista de TERMOS QUE REQUEREM CONTEXTO
**O que aconteceu**: "jurídico" é proibido no sistema, mas existem usos legítimos: "Pessoas Jurídicas" (nome de cadastro oficial), "Ciências Jurídicas" (departamento da ABRASCI), "personalidade jurídica" (termo técnico formal). O Claude Code removia todos, quebrando nomes próprios.

**Recomendação**: Adicionar seção ao FORBIDDEN_CONTENT.md:
```
## TERMOS COM CONTEXTO — NÃO É SUBSTITUIÇÃO CEGA

| Termo proibido | Exceções legítimas (NÃO substituir) |
|----------------|--------------------------------------|
| "jurídico" | "Cadastro Nacional de Pessoas Jurídicas", "Ciências Jurídicas" (nome de departamento), "personalidade jurídica" (termo técnico) |
| "satisfação" | "satisfação do cliente" (contexto NPS/negócio) |
| "constituída" | quando empresa REALMENTE possui Articles of Incorporation |

REGRA: substituição de termos proibidos NUNCA é regex cego.
Sempre verificar contexto antes de substituir.
```

**Impacto**: MÉDIO — evita quebrar nomes próprios e termos técnicos legítimos.

---

## SEÇÃO 3 — MELHORIAS DE DOCUMENTAÇÃO

### MELHORIA A: Versionamento inconsistente
O README.md diz "v5.0" mas os arquivos internos têm versões diferentes:
- FORBIDDEN_CONTENT.md: "v2.2 (27/02/2026)" — header desatualizado; categorias 7 e 8 foram adicionadas depois mas o header não mudou
- QUALITY_GATES.md: "v2.2" no header mas tem "v3.0" na seção de gates adicionais
- FORMATTING_SPEC.md: "v4.0"
- LEGAL_FRAMEWORK.md: "Fevereiro 2026"
- PROTOCOLO_DE_INTERACAO.md: "v1.2"

**Recomendação**: Alinhar TODOS os arquivos para "v6.0" quando implementar as melhorias, com data única.

---

### MELHORIA B: Lições Vitória não documentadas no SISTEMA_COVER_LETTER_EB1A_v2.md
As seções 7 e 8 documentam lições Renato e Andrea. Falta seção 10 com lições Vitória:
```
## 10. LIÇÕES DO CASO VITÓRIA CAROLINA (v6.0)

### Erros corrigidos:
1. Meta-instruções sobrevivendo à produção (EXPANSÃO, Inserir antes/após, tarjas █)
2. Substituição de sigla criando artigos duplicados (45+ "da a Academia")
3. Citações Kazarian truncadas em 6 instâncias (faltava ", 2010)")
4. Footnotes nativos em inglês (30+ notas)
5. URLs truncados com "..." (amazon, google books, sucupira)
6. Footnote solto no corpo do texto
7. Termo proibido "jurídico" em contextos legítimos removido indevidamente
8. Validação de proporções não automatizada

### Padrões que funcionaram:
1. Regex direto no XML (evitar ElementTree por namespace issues)
2. Validação exaustiva por checklist automatizado
3. Fluxo Cowork→Claude Code→Cowork com arquivo de instruções único
4. Abordagem iterativa: v3→v3.1→v4→v5→v7 com revisão a cada etapa
```

---

### MELHORIA C: DOCX_PRODUCTION_PIPELINE.md — adicionar Etapa 10
Adicionar etapa de "Limpeza de Artefatos de Produção":
```
## ETAPA 10: LIMPEZA DE ARTEFATOS

Após TODA geração/edição, executar limpeza:
1. Remover meta-instruções: EXPANSÃO, Inserir antes/após, FIM DO
2. Remover tarjas █
3. Remover marcadores TODO/FIXME/NOTA PARA
4. Verificar artigos duplicados (a a, o o, da a, na a)
5. Verificar URLs com "..."
6. Verificar citações jurisprudenciais completas
```

---

## SEÇÃO 4 — PRIORIZAÇÃO

| # | Gap | Prioridade | Esforço | Arquivo(s) a alterar |
|---|-----|-----------|---------|---------------------|
| 9 | Script validação .docx final | CRÍTICO | ALTO | Novo: validate_final_docx.py |
| 1 | Meta-instruções proibidas | ALTO | BAIXO | FORBIDDEN_CONTENT.md |
| 3 | Validação de citações | ALTO | MÉDIO | validate_final_docx.py |
| 7 | Proporções automatizadas | ALTO | MÉDIO | validate_final_docx.py |
| 10 | Contradição footnotes | ALTO | BAIXO | QUALITY_GATES.md, FORMATTING_SPEC.md |
| 11 | Workflow Cowork↔Code | ALTO | MÉDIO | Novo: WORKFLOW_COWORK_CLAUDE_CODE.md |
| 2 | Protocolo de substituição | MÉDIO-ALTO | BAIXO | DOCX_PRODUCTION_PIPELINE.md |
| 4 | Idioma footnotes | MÉDIO | BAIXO | FORBIDDEN_CONTENT.md |
| 5 | URLs quebrados | MÉDIO | BAIXO | FORBIDDEN_CONTENT.md |
| 12 | Termos com contexto | MÉDIO | BAIXO | FORBIDDEN_CONTENT.md |
| 6 | Footnote solto | BAIXO-MÉDIO | BAIXO | validate_final_docx.py |
| 8 | Regra ABRASCI | BAIXO | BAIXO | FORBIDDEN_CONTENT.md |
| A | Versionamento | BAIXO | BAIXO | Todos os .md |
| B | Lições Vitória | BAIXO | MÉDIO | SISTEMA_COVER_LETTER_EB1A_v2.md |
| C | Etapa 10 pipeline | BAIXO | BAIXO | DOCX_PRODUCTION_PIPELINE.md |

---

## SEÇÃO 5 — AÇÃO IMEDIATA RECOMENDADA

Se Paulo quiser implementar agora, a ordem sugerida é:

1. **Criar `validate_final_docx.py`** — resolve gaps 1, 3, 5, 6, 7 de uma vez (script de validação exaustiva do .docx montado)
2. **Atualizar FORBIDDEN_CONTENT.md** — adicionar categorias 9 (artefatos) e 10 (URLs), expandir categoria 7 (footnotes), adicionar seção de termos com contexto
3. **Resolver contradição footnotes** — QUALITY_GATES 7.6 vs FORMATTING_SPEC
4. **Criar WORKFLOW_COWORK_CLAUDE_CODE.md** — documentar o fluxo real
5. **Adicionar Etapa 10 ao DOCX_PRODUCTION_PIPELINE.md** — limpeza de artefatos
6. **Atualizar SISTEMA_COVER_LETTER_EB1A com seção 10** — lições Vitória
7. **Alinhar versões** para v6.0

---

*Relatório gerado por Cowork em 26/03/2026.*
*Base: Sessão de produção Vitória Carolina — v3 a v7 (18-26/03/2026).*
*12 gaps identificados, 3 melhorias de documentação, priorização por impacto.*
