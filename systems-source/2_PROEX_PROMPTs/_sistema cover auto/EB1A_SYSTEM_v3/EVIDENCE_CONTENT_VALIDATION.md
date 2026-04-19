# EVIDENCE_CONTENT_VALIDATION.md — v3.0
## Validação de Conteúdo Real dos PDFs de Evidência

> **LIÇÃO APRENDIDA (Caso Renato Silveira v19→v23):**
> Evidence 37 era rotulada "Carta de Recomendação — Francelino Neto" mas o PDF continha a carteira profissional do CRF.
> Evidence 71 era rotulada "Relatório Técnico" mas o PDF tinha 6 placeholders não preenchidos ([Nome Completo do Contador], [XXX.XXX.XXX-XX]).
> Evidence 52 usava thumbnail da página 1 (certificado do tradutor TMS) em vez do documento real.
> Nenhum desses erros foi detectado pelo sistema porque o conteúdo dos PDFs nunca foi verificado — apenas os nomes dos arquivos.

---

## 1. GATE OBRIGATÓRIO: Validação PDF↔Description

**QUANDO:** Após Phase 3 (Evidence Organization), ANTES de Phase 4 (Audit).

**PARA CADA evidência listada no Enclosed Evidence Guide:**

### 1.1 Extração de Texto
```
pdftotext "Evidence XX. [Título].pdf" - | head -100
```
Se nenhum texto extraível (PDF baseado em imagem): registrar como `SCAN_ONLY` e pular para verificação visual.

### 1.2 Comparação Conteúdo↔Título
Comparar as primeiras 100 linhas do texto extraído com o título e description no evidence box:

| Campo do Evidence Box | Deve Aparecer no PDF |
|---|---|
| Nome da pessoa/entidade | Presente no texto extraído |
| Tipo de documento (carta, DRE, certidão) | Consistente com conteúdo |
| Data/período mencionado | Presente ou compatível |

**FAIL se:**
- O PDF contém documento de tipo completamente diferente (ex: CRF quando deveria ser carta)
- O nome da pessoa/entidade principal não aparece no texto
- O período/ano é incompatível

### 1.3 Detecção de Placeholders
Varrer TODO o texto do PDF para os seguintes padrões:

```regex
\[Nome[^\]]*\]
\[Endereço[^\]]*\]
\[XXX[^\]]*\]
\[CPF[^\]]*\]
\[CNPJ[^\]]*\]
\[Data[^\]]*\]
\[PREENCHER[^\]]*\]
___+
XXXXXX+
\[.*INSERIR.*\]
\[.*COMPLETAR.*\]
```

**FAIL IMEDIATO se qualquer placeholder encontrado.** Documento com placeholders NÃO PODE ser incluído como evidência.

### 1.4 Detecção de Certificado de Tradução na Página 1
Se a página 1 contém qualquer um dos seguintes:
- "AFFIDAVIT OF TRANSLATION"
- "TRANSLATION ACCURACY"
- "TMS Translations"
- "CERTIFIED TRANSLATION"
- "hereby certifies that the professional translation"

**ENTÃO:** O conteúdo real começa na página 2+. Registrar como `TRANSLATED_DOC`.

### 1.5 Detecção de Redundância
Para cada par de evidências (N, M) onde N ≠ M:
- Extrair texto de ambos
- Calcular sobreposição textual (Jaccard similarity nos tokens únicos)
- **ALERTA se sobreposição > 60%:** "Evidence N e Evidence M podem ser redundantes — verificar com Paulo"

---

## 2. REGRAS DE THUMBNAIL

### 2.1 Seleção de Página
| Condição | Página para Thumbnail |
|---|---|
| PDF sem certificado de tradução | Página 1 |
| PDF com "AFFIDAVIT OF TRANSLATION" na pág. 1 | Página 2 |
| PDF com "CERTIFICADO" na pág. 1 | Página 2 |
| PDF com capa genérica/institucional na pág. 1 | Página 2 (confirmar com Paulo) |

### 2.2 Validação Visual
Após gerar thumbnail:
- O thumbnail deve conter texto legível relacionado ao título da evidência
- Se thumbnail é predominantemente branco/vazio: **ALERTA**
- Se thumbnail mostra logo de tradutora (TMS, ATA) em vez de conteúdo: **FAIL**

### 2.3 Comando de Extração
```bash
# Para documentos traduzidos (pular página 1):
pdftoppm -png -f 2 -l 2 -r 150 "Evidence XX.pdf" thumb
# Para documentos normais:
pdftoppm -png -f 1 -l 1 -r 150 "Evidence XX.pdf" thumb
```

---

## 3. CHECKLIST DE VALIDAÇÃO POR TIPO DE EVIDÊNCIA

### 3.1 Cartas de Recomendação (Evidence 37-43)
- [ ] O PDF contém texto de carta (não outro documento)
- [ ] O nome do recomendador aparece no texto
- [ ] A data da carta é legível
- [ ] O título/cargo do recomendador é mencionado
- [ ] A carta menciona o beneficiário pelo nome
- [ ] CV do recomendador presente como sub-evidência (XXa)

### 3.2 Documentos Financeiros (DREs, Balanços, IRPF)
- [ ] O PDF contém dados financeiros (não outro tipo de documento)
- [ ] O nome da entidade/pessoa aparece
- [ ] O período/exercício fiscal corresponde ao declarado
- [ ] Tradução certificada presente (se documento em português)
- [ ] Valores numéricos são legíveis

### 3.3 Registros de Marca/PI (Evidence 25-32)
- [ ] O PDF é do INPI ou órgão equivalente
- [ ] O nome da marca corresponde ao título da evidência
- [ ] O número do processo aparece
- [ ] O titular é o beneficiário ou sua empresa

### 3.4 Cobertura de Mídia (Evidence 13-23)
- [ ] O PDF contém artigo/matéria jornalística
- [ ] O nome do veículo aparece
- [ ] O beneficiário é mencionado no texto
- [ ] Data de publicação é identificável

### 3.5 Documentação Corporativa (Evidence 52-62)
- [ ] O PDF é certidão/contrato social
- [ ] O nome da empresa corresponde
- [ ] CNPJ é legível
- [ ] O beneficiário aparece como sócio/administrador

---

## 4. RELATÓRIO DE VALIDAÇÃO

Após executar todas as verificações, gerar relatório no formato:

```
=== EVIDENCE CONTENT VALIDATION REPORT ===
Date: [data]
Total evidences: [N]
Validated: [X]
PASS: [Y]
FAIL: [Z]
ALERTS: [W]

FAILURES:
- Evidence XX: [motivo]
- Evidence YY: [motivo]

ALERTS:
- Evidence XX ↔ Evidence YY: Possível redundância (sobreposição: XX%)
- Evidence ZZ: SCAN_ONLY — verificação visual necessária

TRANSLATION STATUS:
- Evidence XX: TRANSLATED_DOC (conteúdo começa pág. 2)
- Evidence YY: SEM TRADUÇÃO — AÇÃO NECESSÁRIA
```

---

## 5. ERROS QUE ESTE GATE TERIA PREVENIDO (Caso Renato)

| Erro | Como Este Gate Preveniria |
|---|---|
| Evidence 37 = CRF em vez de carta | Gate 1.2: "Carta de Recomendação" no título, mas PDF diz "Federal Council of Pharmacy" → FAIL |
| Evidence 71 = placeholders vazios | Gate 1.3: Regex detectaria `[Nome Completo do Contador]` → FAIL IMEDIATO |
| Evidence 52 thumbnail = certificado tradutor | Gate 2.1: Página 1 contém "AFFIDAVIT OF TRANSLATION" → usar página 2 |
| Evidence 71 redundante com Evidence 50 | Gate 1.5: Sobreposição textual > 60% → ALERTA |
| Evidence 65 sem tradução | Gate 3.2: Documento financeiro em português sem certificado de tradução → FAIL |
