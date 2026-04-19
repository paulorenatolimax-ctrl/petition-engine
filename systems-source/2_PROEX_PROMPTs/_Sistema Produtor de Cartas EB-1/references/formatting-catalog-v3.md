# Catálogo de Identidade Visual — Biblioteca de Combinações

Cada carta do batch DEVE usar uma combinação única. NUNCA reutilizar dentro do mesmo pacote de petição.

## Combinações Font + Cor Comprovadas

| ID | Família Tipográfica | Cor Primária | Cor Acento | Corpo do Texto | Ideal Para |
|----|---------------------|--------------|------------|----------------|------------|
| F01 | Trebuchet MS | #1A237E (Índigo Escuro) | #283593 (Índigo) | #2D2D2D | Tech, TI, engenharia, startups |
| F02 | Book Antiqua | #6B1C23 (Bordô) | #8B2230 (Vermelho Profundo) | #383838 | Treinamento, educação, pareceres formais |
| F03 | Garamond | #004D40 (Teal Escuro) | #00897B (Teal) | #2E2E2E | Mídia, criativo, artes, comunicação |
| F04 | Verdana 10.5pt | #37474F (Aço) | #FF8F00 (Âmbar) | #303030 | Imobiliário, finanças, jurídico |
| F05 | Palatino Linotype | #880E4F (Rosa Escuro) | #AD1457 (Rosa) | #333333 | Luxo, high-end, consultoria premium |
| F06 | Georgia | #4A5A3C (Oliva Escuro) | #6B8E4E (Verde Oliva) | #3C3C3C | Business advisory, estratégia |
| F07 | Cambria | #2C3E50 (Carvão) | #8E44AD (Roxo) | #363636 | Endossos executivos, C-level |
| F08 | Calibri | #1B3A5C (Marinho) | #2E75B6 (Azul) | #333333 | Tecnologia, engenharia, PM |
| F09 | Arial Narrow | #1B5E20 (Verde Floresta) | #2E7D32 (Verde) | #2B2B2B | Saúde, meio ambiente, sustentabilidade |
| F10 | Segoe UI | #2E7D32 (Verde Floresta) | #43A047 (Verde Claro) | #2B2B2B | Utilities, energia, operações |
| F11 | Constantia | #4E342E (Marrom Escuro) | #795548 (Marrom) | #3A3A3A | Agricultura, indústrias tradicionais |
| F12 | Candara | #0D47A1 (Azul Royal) | #1565C0 (Azul Médio) | #303030 | Aviação, logística, transporte |
| F13 | Century Gothic | #311B92 (Roxo Profundo) | #4527A0 (Roxo) | #2E2E2E | Inovação, startups, IA, pesquisa |
| F14 | Rockwell | #B71C1C (Vermelho Escuro) | #D32F2F (Vermelho) | #353535 | Manufatura, indústria pesada |
| F15 | Lucida Sans | #006064 (Ciano Escuro) | #00838F (Ciano) | #2D2D2D | Healthcare, biotech, farmacêutico |
| F16 | Franklin Gothic | #1A1A2E (Azul Noite) | #16213E (Azul Noite Claro) | #2D2D2D | Finanças, banking, investimentos |
| F17 | Baskerville | #3E2723 (Café) | #5D4037 (Café Claro) | #363636 | Academia, pesquisa, publicações |
| F18 | Tahoma | #004D40 (Verde Petróleo) | #26A69A (Verde Agua) | #303030 | Consultoria técnica, gestão |
| F19 | Book Antiqua | #003B73 (Azul Royal Disney) | #B8860B (Ouro Quente) | #2A2A2A | Letters of Intent, empresas premium, Fortune 100 |
| F20 | Palatino Linotype | #6B2737 (Borgonha Profundo) | #B85C5C (Rosa Seco) | #2C2C2C | Client Attestation, documentos formais, atestados |

## Estilos de Header de Seção

Use um estilo diferente para cada carta. Padrões comprovados:

### H1: Texto Colorido Bold com Borda Inferior
```javascript
new Paragraph({
  children: [new TextRun({ text: title, bold: true, font: FONT, size: 28, color: COLOR })],
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT } },
  spacing: { before: 280, after: 160 }
})
```

### H2: Headers Centralizados com Em-Dash
```javascript
new Paragraph({
  children: [new TextRun({ text: `\u2014 ${title.toUpperCase()} \u2014`, bold: true, font: FONT, size: 24, color: COLOR })],
  alignment: AlignmentType.CENTER,
  spacing: { before: 300, after: 140 }
})
```

### H3: Barra de Acento na Borda Esquerda
```javascript
new Paragraph({
  children: [new TextRun({ text: title, bold: true, font: FONT, size: 26, color: COLOR })],
  border: { left: { style: BorderStyle.SINGLE, size: 12, color: ACCENT } },
  indent: { left: 200 },
  spacing: { before: 300, after: 160 }
})
```

### H4: Artigos Numerados (Estilo Jurídico)
```
ARTIGO 1 — [Título]
ARTIGO 2 — [Título]
```

### H5: CONSIDERANDO QUE (Formal/Legal)
```
CONSIDERANDO QUE a organização necessita...
CONSIDERANDO QUE a expertise em [área]...
```

### H6: Headers com Borda Dupla
```javascript
new Paragraph({
  children: [new TextRun({ text: title, bold: true, font: FONT, size: 26, color: COLOR })],
  border: {
    top: { style: BorderStyle.DOUBLE, size: 3, color: ACCENT },
    bottom: { style: BorderStyle.DOUBLE, size: 3, color: ACCENT }
  },
  spacing: { before: 280, after: 160 }
})
```

### H7: Uppercase com Linha Decorativa Abaixo
```javascript
// Parágrafo com título em CAPS seguido de linha fina
```

### H8: Números Romanos + Título
```
Seção I — [Título]
Seção II — [Título]
```

### H9: Título com Fundo Sombreado (Light Background)
```javascript
new Paragraph({
  children: [new TextRun({ text: ` ${title} `, bold: true, font: FONT, size: 26, color: COLOR })],
  shading: { type: ShadingType.CLEAR, fill: "F5F5F5" },
  spacing: { before: 280, after: 160 }
})
```

### H10: Prefixo Numérico Destacado
```javascript
// "01. " em tamanho grande + título em tamanho menor
bodyMulti([
  { text: "01. ", size: 32, bold: true, color: ACCENT },
  { text: title, size: 26, bold: true, color: COLOR }
])
```

### H11: Small Caps com Borda Superior Apenas (TOP border)
Used in Andrea Arguello's client attestation letter. Elegant, formal.
```javascript
new Paragraph({
  children: [new TextRun({ text: text.toUpperCase(), bold: true, font: FONT, size: SIZE.h1, color: COLOR, smallCaps: true })],
  alignment: AlignmentType.LEFT,
  border: { top: { style: BorderStyle.SINGLE, size: 6, color: ACCENT } },
  spacing: { before: 300, after: 160 }
})
```

### H12: Small Caps Centralizado com Underline Dourado
Used in Kayce Coker's Disney letter of intent. Royal, elegant.
```javascript
new Paragraph({
  children: [new TextRun({ text: text.toUpperCase(), bold: true, font: FONT, size: SIZE.h1, color: COLOR, smallCaps: true })],
  alignment: AlignmentType.CENTER,
  border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ACCENT } },
  spacing: { before: 320, after: 180 }
})
```

## Formatos de Documento

### D1: Carta Comercial Padrão
```
[Header da Empresa]
[Data]
[Destinatário]
[Referência/Assunto]
[Corpo]
[Fechamento]
[Assinatura]
```

### D2: Memorando (DE/PARA/DATA/REF)
```
MEMORANDO
DE: [Nome, Cargo]
PARA: [Peticionário]
DATA: [Data]
REF: [Assunto]
[Corpo]
```

### D3: Proposta Formal com Artigos
```
PROPOSTA DE PARCERIA ESTRATÉGICA
[Preâmbulo]
ARTIGO 1 — [...]
ARTIGO 2 — [...]
[Artigos finais]
[Assinaturas]
```

### D4: Parecer Técnico / Avaliação Executiva
```
PARECER TÉCNICO / AVALIAÇÃO PROFISSIONAL
[Header com credenciais do autor]
[Seções de avaliação]
[Tabela de competências]
[Conclusão técnica]
[Assinatura com credenciais]
```

### D5: Carta de Intenções / Partnership Charter
```
CARTA DE INTENÇÕES
[Identificação da empresa]
[Contexto e motivação]
[Áreas de interesse]
[Modelo de colaboração proposto]
[Expressão formal de interesse]
```

### D6: Recomendação/Endosso Profissional
```
ENDOSSO PROFISSIONAL
[Credenciais e qualificações do autor]
[Contexto do relacionamento]
[Seções numeradas de competências]
[Evidências/métricas]
[Endosso forte de fechamento]
```

### D7: Expert Opinion / Opinião Especializada
```
OPINIÃO ESPECIALIZADA
[Qualificações do especialista]
[Declaração de independência]
[Análise técnica das contribuições]
[Contextualização no campo]
[Conclusão da opinião profissional]
```

### D8: Relatório de Impacto
```
RELATÓRIO DE IMPACTO — [EMPRESA]
[Sumário executivo]
[Contexto: situação prévia]
[Intervenção: escopo dos serviços]
[Resultados: métricas antes/depois]
[Análise: significância dos resultados]
[Recomendação]
```

### D9: Client Attestation (Attestação Formal do Cliente)
```
[Logo — right aligned]
[COMPANY NAME — right aligned]
[Department — right aligned]
[Location — right aligned]

FORMAL CLIENT ATTESTATION [centered]

Section I — Professional Standing of the Attestant
[Credentials, domain expertise, why opinion carries weight]
[Distinction: "my attestation derives from the client side"]

Section II — Context of Professional Engagement
[How the transformation was initiated, attestant's role as sponsor]

Section III — Client-Side Assessment of Technical Impact
[Pull-quote attestation blocks interleaved with analytical prose]

Section IV — Attestation of Indispensability
["meaningful distinction between 'valuable contributor' and 'person whose absence would constitute material project risk'"]

Section V — Professional Significance and Broader Context

In Witness Whereof
[Formal attestation closing]
[Signature with credentials]
[Date at BOTTOM]
```

### D10: Letter of Intent / Future Partnership (Carta de Intenção Futura)
```
[Logo — centered]
[COMPANY NAME — centered, smallCaps]
[Department — centered]
[Location — centered]
[Double gold rule]

[Date — right aligned]

LETTER OF INTENT [centered]
[Subtitle — centered, italic]

[Gold rule separator]

RE: [Beneficiary name — expression of strategic interest]

Section: Professional Standing and Prior Engagement
[Author's credentials + PRIOR relationship with petitioner]
[Why author has unique authority: "direct professional knowledge accumulated over X years"]

Section: Company's Strategic Imperative
[Why the company needs this type of professional]

Section: Basis for Strategic Interest
[Specific competencies mapped to company needs]
[Value Proposition Blocks with gold border + shading]

Section: Anticipated Strategic Outcomes
[Numbered outcomes in prose (First, Second, Third, Fourth)]

Section: Professional Distinction
[Unique vantage point — author saw petitioner from consulting side, now from client/employer side]

Section: Expression of Intent
[Formal statement of interest]

[Gold rule]
[Signature with multiple credentials + former employer reference]
```

## Variações de Tabela

Nunca use a mesma estrutura em mais de 2 cartas do batch.

### T1: Tabela de Oportunidades (2 colunas)
| Oportunidade | Impacto Esperado |

### T2: Tabela de KPI (3 colunas)
| Indicador | Situação Atual | Meta Proposta |

### T3: Tabela de Fases (4 colunas)
| Fase | Ação | Prazo | Entregável |

### T4: Matriz de Competências
| Domínio | Nível | Evidência |

### T5: Tabela de Escopo de Serviço
| Módulo | Descrição | Benefício Esperado |

### T6: Tabela Desafio-Solução
| Desafio | Solução Proposta | Resultado Esperado |

### T7: Tabela Antes/Depois (para Testemunhos)
| Métrica | Antes | Depois | Variação |

### T8: Tabela de Contribuições (para Expert Opinion)
| Contribuição | Campo Impactado | Adoção por Terceiros | Significância |

### T9: Tabela Comparativa com Pares
| Indicador | Média do Campo | Peticionário | Percentil |

### T10: Timeline de Reconhecimento
| Ano | Conquista | Significância | Reconhecimento Externo |

## Elementos Estruturais Avançados

### Pull-Quote Attestation Block
Used for formal client-side attestations. Indented with thick left border, italic text.
```javascript
function attestationBlock(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT, size: SIZE.body, color: BODY_COLOR, italics: true })],
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: ACCENT } },
    indent: { left: 400, right: 200 },
    spacing: { before: 140, after: 140, line: 280 }
  });
}
```

### Value Proposition Block
Used for letters of intent. Title + description with gold border and light background.
```javascript
function valueBlock(title, description) {
  return [
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, font: FONT, size: SIZE.body, color: COLOR })],
      border: { left: { style: BorderStyle.SINGLE, size: 14, color: ACCENT } },
      indent: { left: 400, right: 200 },
      shading: { type: ShadingType.CLEAR, fill: "FBF5E6" },
      spacing: { before: 160, after: 0 }
    }),
    new Paragraph({
      children: [new TextRun({ text: description, font: FONT, size: SIZE.small, color: BODY_COLOR })],
      border: { left: { style: BorderStyle.SINGLE, size: 14, color: ACCENT } },
      indent: { left: 400, right: 200 },
      shading: { type: ShadingType.CLEAR, fill: "FBF5E6" },
      spacing: { before: 40, after: 160, line: 264 }
    })
  ];
}
```

### Inline Bold Metric Prose
Replace tables with flowing prose where key metrics are bold+colored inline. Used for Kevin Brown's letter.
```javascript
bodyMulti([
  { text: "Under César's architectural leadership, the regional reporting framework consolidated " },
  { text: "four geographic P&L structures into a unified enterprise model", bold: true, color: COLOR },
  { text: ", reducing month-end consolidation from " },
  { text: "8–10 days to under 2 days", bold: true },
  { text: " and generating a " },
  { text: "USD 2.2 million contract extension", bold: true, color: COLOR },
  { text: " — a direct commercial validation of the work's strategic significance." }
])
```

### Gold Rule Separator
Elegant decorative separator for formal documents.
```javascript
function goldRule() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT } },
    spacing: { before: 200, after: 200 }
  });
}
```

### Double Gold Rule (for letterhead)
```javascript
new Paragraph({
  border: { bottom: { style: BorderStyle.DOUBLE, size: 4, color: ACCENT } },
  spacing: { before: 0, after: 240 }
})
```

## Estilos de Divisor

### Linha colorida simples (bottom border em parágrafo vazio)
### Linha dupla (BorderStyle.DOUBLE)
### Decorativo centralizado: "***" ou "* * *"
### Linha de em-dash: "————————————"
### Borda grossa esquerda colorida em spacer
### Gradiente simulado: linha fina cinza + espaço + linha fina cor primária

## Variações de Bloco de Assinatura

### S1: Nome + Cargo + Empresa (centralizado)
### S2: Nome sobre linha + Cargo + Empresa + Contato (alinhado à esquerda)
### S3: Nome (bold) + Credenciais + Descrição da Empresa (compacto)
### S4: Nome + Cargo + Placeholder de logo + Bloco de endereço
### S5: "Respeitosamente," + Nome + Cargo (minimalista)
### S6: "Cordialmente," + Nome + Cargo + Empresa (com borda acima)
### S7: Nome + Cargo + Credenciais acadêmicas + LinkedIn/ORCID (para Expert Opinion)
### S8: Bloco formal com selo/carimbo simulado (para pareceres)

### S9: Formal Attestation ("In Witness Whereof")
Used in client attestation letters. Very formal, legal-adjacent.
```
In Witness Whereof

[Attestation paragraph]

[Name — bold, primary color]
[Title]
[Company]
[Credential — italic, accent color]
[Location]
[Date at bottom]
```

### S10: Multi-Credential with Former Employer Reference
Used in letters of intent where author's previous role is relevant.
```
Respectfully,

[Name — bold, primary color]
[Current Title]
[Current Company — bold, accent color]
[MBA, School — italic, gray]
[Other degree — italic, gray]
[Former Title, Former Company (years) — italic, gray]
[Location]
[Email]
[Phone]
```

## Distribuição Anti-Uniformidade para Batches

Para um batch de N cartas, use este guia:

| Elemento Estrutural | Máximo por Batch | Notas |
|---|---|---|
| Tabelas (qualquer tipo T1-T10) | 2 | Devem ser tipos diferentes |
| Prosa com métricas em negrito inline | 1-2 | Bom para substituir tabelas |
| Pontos de bala | 1 | Use LevelFormat.BULLET |
| Listas numeradas | 1 | Pode ser integrado em prosa |
| Pull-quote attestation blocks | 1 | Melhor para attestações de cliente |
| Value proposition blocks | 1 | Melhor para letters of intent |
| Tabelas Desafio-Solução | 1 | Manter em tipo opinião especializada |
| Tabelas Antes/Depois | 1 | Manter em tipo testemunho |
