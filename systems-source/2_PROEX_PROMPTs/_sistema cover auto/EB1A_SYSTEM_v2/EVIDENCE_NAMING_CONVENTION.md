# EVIDENCE_NAMING_CONVENTION — Regras de Nomenclatura de Evidências
## Cover Letter EB-1A — Escritório PROEX

---

## REGRA FUNDAMENTAL
O título de cada evidência DEVE ser IDÊNTICO em 3 locais:
1. **Evidence block** (dentro do critério)
2. **Índice de Evidências** (Parte I da cover letter)
3. **Nome do arquivo** na pasta organizada

Se qualquer um difere → erro que deve ser corrigido imediatamente.

---

## FORMATO DO NOME

### No evidence block e no índice:
```
Evidence XX. [Título Descritivo Completo]
```

### No arquivo:
```
Evidence XX. [Título Descritivo Completo].pdf
```

### Exemplos reais (caso Renato):
```
Evidence 16. "Rei do Emagrecimento: Influencer Renato Silveira Faz Sucesso nas Redes Sociais" — Revista IstoÉ.pdf
Evidence 29. Portfólio de Propriedade Intelectual — 9 Registros INPI.pdf
Evidence 32. Manual Técnico — O Protocolo de Jejum Termogênico e sua Implementação Digital.pdf
Evidence 42. Publicação Científica — Aromaterapia como Prática Integrativa (RBPICS v.3 n.5).pdf
Evidence 51. Diploma e Histórico de Mestrado — Máster en Ciencias Naturopáticas (UNEATLANTICO).pdf
```

---

## PADRÕES DE TÍTULO POR TIPO

### Matérias de mídia
```
Evidence XX. "[Título Exato da Matéria]" — [Nome do Veículo].pdf
```

### Documentos corporativos
```
Evidence XX. [Tipo de Documento] — [Nome da Empresa] ([Ano]).pdf
```

### Cartas de recomendação
```
Evidence XX. Carta de Recomendação — [Nome do Recomendador] ([Empresa/Cargo]).pdf
```

### Documentos financeiros
```
Evidence XX. [DRE/IRPF/Declaração] — [Empresa/Pessoa] ([Ano]).pdf
```

### Publicações científicas
```
Evidence XX. Publicação Científica — [Título Abreviado] ([Periódico] v.X n.Y).pdf
```

### Documentos acadêmicos
```
Evidence XX. [Diploma/Histórico/Dissertação] — [Programa] ([Universidade]).pdf
```

### Registros de PI
```
Evidence XX. [Certificado de Registro/Processo] — [Nome da Marca] (INPI).pdf
```

### Certidões
```
Evidence XX. Certidão Simplificada — [Nome da Empresa].pdf
```

---

## NUMERAÇÃO

### Regras
- Numeração sequencial global (não por critério)
- Uma vez atribuído, o número NÃO muda
- Cross-references mantêm o número original
- Gaps na numeração são aceitáveis (não renumerar para fechar gaps)

### Ranges por critério (exemplo Renato — adaptar por cliente)
| Critério | Range Típico |
|----------|-------------|
| Parte I (Introdução) | Evidence 1-6 |
| C1 (Awards) | Evidence 7-11 |
| C2 (Membership) | Evidence 12-15 |
| C3 (Published Material) | Evidence 16-27 |
| C5 (Original Contributions) | Evidence 28-48 |
| C6 (Scholarly Articles) | Evidence 49-51 + cross-refs |
| C8 (Leading Role) | Evidence 52+ |
| C9 (High Salary) | Evidence XX+ |

### Cross-References
Quando uma evidência aparece em múltiplos critérios:
- O número permanece o mesmo
- No texto: "(cross-reference do Critério X)"
- Na pasta: copiar o arquivo para ambas as pastas
- Opcional: sufixo no nome da pasta `(Cross-ref CX)`

---

## METADATA NO EVIDENCE BLOCK

### Campos obrigatórios:
```
Evidence XX. [Título]
Type: [News Article / Corporate Document / Tax Return / Recommendation Letter / etc.]
Source: [Veículo / Empresa / Órgão]
Date: [DD de Mês de AAAA] ou [Mês AAAA] ou [AAAA]
URL: [url completa] ou [N/A — documento físico]
Description & Impact/Relevance: [1-2 frases]
```

### Campos opcionais:
```
Author: [nome do jornalista/autor]
ISSN/ISBN: [se aplicável]
Volume/Issue: [se periódico]
```

---

## MAPA GLOBAL DE EVIDÊNCIAS

Manter um arquivo de controle (markdown ou planilha):
```markdown
| Evidence # | Título Curto | Critério(s) | Arquivo Existe? | Nome Match? |
|-------|-------------|-------------|-----------------|-------------|
| 1     | ...         | Intro       | ✅              | ✅          |
| 2     | ...         | Intro       | ✅              | ✅          |
| ...   | ...         | ...         | ...             | ...         |
```

Atualizar a cada novo critério produzido.

---

**REGRA IMPORTANTE**: NUNCA abreviar "Evidence" como "Ev." em nenhum contexto — índice, blocks, synopsis, referências inline, ou nomes de arquivo. Sempre por extenso: "Evidence XX."

---

*v2.1 — Atualizado em 26/02/2026 com lições do Caso Andrea Justino.*
