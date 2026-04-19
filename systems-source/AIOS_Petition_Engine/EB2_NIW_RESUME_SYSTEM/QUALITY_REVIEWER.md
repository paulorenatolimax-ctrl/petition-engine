# AGENTE REVISOR DE QUALIDADE — RÉSUMÉ EB-1A / EB-2 NIW (V1.0)

> **Propósito**: Este agente é executado APÓS a produção do résumé final (.docx).
> Ele lê o documento produzido e verifica, de forma automatizada E manual,
> se TUDO que foi pedido foi de fato executado — sem falhas gravíssimas,
> graves, ou problemas diversos.
>
> **Quando usar**: SEMPRE. Nenhum résumé é entregue ao Paulo sem passar pelo revisor.

---

## 1. CLASSIFICAÇÃO DE SEVERIDADE

| Nível | Nome | Descrição | Ação |
|-------|------|-----------|------|
| **S0** | GRAVÍSSIMO | Documento inutilizável. Rebuild obrigatório. | BLOQUEIA entrega |
| **S1** | GRAVE | Erro sério que compromete credibilidade. | BLOQUEIA entrega |
| **S2** | MODERADO | Problema visível que reduz qualidade. | Corrigir antes de entregar |
| **S3** | MENOR | Imperfeição cosmética aceitável. | Documentar, corrigir se possível |

---

## 2. SCRIPT DE VERIFICAÇÃO AUTOMATIZADA

O script abaixo DEVE ser executado após CADA build. Ele é a primeira linha de defesa.

```python
#!/usr/bin/env python3
"""
QUALITY REVIEWER — Verificação Automatizada de Résumé V4
Execute após cada build/merge. Lê o .docx final e reporta problemas.

USO:
    python3 quality_reviewer.py /path/to/resume.docx [eb1a|eb2niw]
"""
import sys
import os
from collections import OrderedDict
from docx import Document
from docx.oxml.ns import qn
from lxml import etree

# ═══════════════════════════════════════════════════════════════
# CONFIGURAÇÃO
# ═══════════════════════════════════════════════════════════════

# Cores permitidas (hex sem #)
ALLOWED_COLORS = {
    "2D3E50",  # NAVY
    "3498A2",  # TEAL
    "FFFFFF",  # WHITE
    "000000",  # BLACK
    "333333",  # DARK_GRAY
    "666666",  # MED_GRAY
    "F5F5F5",  # LIGHT_GRAY
    "CCCCCC",  # BORDER_GRAY
    "FAFAFA",  # alternate row (close to F5F5F5)
}

# Fontes permitidas
ALLOWED_FONTS = {"Garamond", "garamond"}

# Palavras proibidas no corpo do documento
FORBIDDEN_WORDS = ["R$"]

# ═══════════════════════════════════════════════════════════════
# FUNÇÕES DE VERIFICAÇÃO
# ═══════════════════════════════════════════════════════════════

def load_document(path):
    """Carrega documento e extrai texto completo."""
    doc = Document(path)

    # Texto de parágrafos
    para_text = "\n".join(p.text for p in doc.paragraphs)

    # Texto de tabelas
    table_text = ""
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                table_text += cell.text + "\n"

    merged = para_text + "\n" + table_text
    return doc, merged


def check_fonts(doc):
    """[S0] Verifica se 100% das fontes são Garamond."""
    issues = []
    arial_count = 0
    other_fonts = set()
    total_runs = 0

    def check_runs(paragraphs, location):
        nonlocal arial_count, total_runs
        for para in paragraphs:
            for run in para.runs:
                total_runs += 1
                fname = run.font.name
                if fname and fname.lower() not in ALLOWED_FONTS and fname.lower() != "garamond":
                    if "arial" in fname.lower():
                        arial_count += 1
                    other_fonts.add(fname)

    # Check paragraphs
    check_runs(doc.paragraphs, "paragraphs")

    # Check table cells
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                check_runs(cell.paragraphs, "table cells")

    if arial_count > 0:
        issues.append(("S0", f"ARIAL ENCONTRADO: {arial_count} runs com Arial (ZERO TOLERÂNCIA)"))
    if other_fonts - {"Garamond", "garamond", None}:
        cleaned = {f for f in other_fonts if f and f.lower() != "garamond"}
        if cleaned:
            issues.append(("S1", f"Fontes não-Garamond encontradas: {cleaned}"))

    return issues, total_runs


def check_page_setup(doc):
    """[S1] Verifica page setup: US Letter, 0.65" margins."""
    issues = []
    section = doc.sections[0]

    # Paper size
    w = round(section.page_width.inches, 1)
    h = round(section.page_height.inches, 1)
    if w != 8.5 or h != 11.0:
        issues.append(("S1", f"Paper size ERRADO: {w}\"x{h}\" (esperado: 8.5\"x11\" US Letter)"))

    # Margins
    lm = round(section.left_margin.inches, 2)
    rm = round(section.right_margin.inches, 2)
    if abs(lm - 0.65) > 0.03:
        issues.append(("S1", f"Margem esquerda ERRADA: {lm}\" (esperado: 0.65\")"))
    if abs(rm - 0.65) > 0.03:
        issues.append(("S1", f"Margem direita ERRADA: {rm}\" (esperado: 0.65\")"))

    return issues


def check_forbidden_words(merged_text, xml_str):
    """[S1] Verifica palavras proibidas."""
    issues = []
    for word in FORBIDDEN_WORDS:
        if word in merged_text or word in xml_str:
            issues.append(("S1", f"Palavra proibida encontrada: '{word}'"))
    return issues


def check_images(doc):
    """[S2] Verifica presença de imagens."""
    issues = []
    img_count = len(doc.inline_shapes)

    if img_count == 0:
        issues.append(("S1", "ZERO imagens no documento (evidence blocks sem thumbnails)"))

    # Check for [THUMBNAIL] placeholders
    placeholder_count = 0
    for para in doc.paragraphs:
        if "[THUMBNAIL]" in para.text:
            placeholder_count += 1
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                if "[THUMBNAIL]" in cell.text:
                    placeholder_count += 1

    if placeholder_count > 0:
        issues.append(("S2", f"{placeholder_count} thumbnails com placeholder [THUMBNAIL] (imagem faltando)"))

    return issues, img_count, placeholder_count


def check_evidence_blocks(doc):
    """[S2] Verifica se evidence blocks têm impacto DENTRO."""
    issues = []
    tables_with_impact = 0
    tables_2col = 0

    for table in doc.tables:
        if len(table.columns) == 2 and len(table.rows) == 1:
            tables_2col += 1
            left_text = table.rows[0].cells[0].text
            if "Impact" in left_text or "Impacto" in left_text or "Description" in left_text:
                tables_with_impact += 1

    if tables_2col > 0 and tables_with_impact == 0:
        issues.append(("S1", f"NENHUM evidence block tem 'Impact' dentro ({tables_2col} tables 2-col encontradas)"))

    return issues, tables_2col, tables_with_impact


def check_paragraph_length(doc, min_lines=3):
    """[S2] Verifica se parágrafos substantivos têm comprimento mínimo."""
    issues = []
    short_paras = []

    for i, para in enumerate(doc.paragraphs):
        text = para.text.strip()
        # Ignorar headers, bullets, captions, empty
        if not text or len(text) < 20:
            continue
        if text.startswith(("●", "○", "Page ", "Description", "—")):
            continue

        # Estimar linhas (~80 chars por linha em Garamond 10.5pt com 0.65" margins)
        est_lines = max(1, len(text) / 85)

        if est_lines < 2.5 and len(text) > 50:
            # Possível parágrafo mirrado
            short_paras.append((i, len(text), text[:60]))

    if len(short_paras) > 5:
        issues.append(("S2", f"{len(short_paras)} parágrafos potencialmente curtos (< 3 linhas estimadas)"))
        for idx, length, preview in short_paras[:5]:
            issues.append(("S3", f"  P{idx}: {length} chars — \"{preview}...\""))

    return issues


def check_header_footer(doc):
    """[S1] Verifica se header e footer existem com navy background."""
    issues = []
    section = doc.sections[0]

    # Check header
    header = section.header
    if not header.paragraphs and not header.tables:
        issues.append(("S1", "HEADER AUSENTE (sem navy bar)"))
    else:
        header_has_table = len(header.tables) > 0
        if not header_has_table:
            issues.append(("S2", "Header sem tabela (pode não ter navy bar)"))

    # Check footer
    footer = section.footer
    if not footer.paragraphs and not footer.tables:
        issues.append(("S1", "FOOTER AUSENTE (sem navy bar + Page X of Y)"))

    return issues


def check_sections_eb1a(merged_text):
    """[S1] Verifica presença de seções obrigatórias EB-1A."""
    issues = []
    required = [
        ("Executive Summary / Síntese", ["EXECUTIVE SUMMARY", "SÍNTESE PROFISSIONAL"]),
        ("Career Timeline / Histórico", ["CAREER TIMELINE", "HISTÓRICO PROFISSIONAL", "PROFESSIONAL CAREER"]),
        ("Pelo menos 1 Criterion", ["CRITERION"]),
    ]
    upper = merged_text.upper()
    for label, needles in required:
        found = any(n in upper for n in needles)
        if not found:
            issues.append(("S1", f"Seção ausente: {label}"))
    return issues


def check_sections_eb2niw(merged_text):
    """[S1] Verifica presença de seções obrigatórias EB-2 NIW."""
    issues = []
    required = [
        ("Executive Summary / Síntese", ["EXECUTIVE SUMMARY", "SÍNTESE PROFISSIONAL"]),
        ("Career Timeline / Histórico", ["CAREER TIMELINE", "HISTÓRICO PROFISSIONAL", "PROFESSIONAL CAREER"]),
        ("Proposed Endeavors", ["PROPOSED ENDEAVOR", "PROJETO EB-2 NIW"]),
        ("Contribuições Técnicas", ["CONTRIBUI", "ORIGINAL CONTRIBUTION", "TECHNICAL CONTRIBUTION"]),
    ]
    upper = merged_text.upper()
    for label, needles in required:
        found = any(n in upper for n in needles)
        if not found:
            issues.append(("S1", f"Seção ausente: {label}"))

    # Check Dhanasar reference
    if "DHANASAR" not in upper:
        issues.append(("S2", "Referência ao framework Dhanasar AUSENTE na seção Proposed Endeavors"))

    # Check BLS codes
    import re
    bls_pattern = r'\d{2}-\d{4}'
    if not re.search(bls_pattern, merged_text):
        issues.append(("S2", "Nenhum código BLS/O*Net encontrado (formato XX-XXXX)"))

    # Check for C1-C10 sections (should NOT exist in EB-2 NIW)
    if "CRITERION 1" in upper or "CRITERION 2" in upper:
        issues.append(("S1", "Seções por Critério (C1-C10) encontradas — isso é EB-1A, não EB-2 NIW"))

    return issues


def check_colors_in_xml(doc):
    """[S2] Verifica cores usadas em cell shading."""
    issues = []
    unexpected_colors = set()

    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                tcPr = cell._tc.find(qn('w:tcPr'))
                if tcPr is not None:
                    shd = tcPr.find(qn('w:shd'))
                    if shd is not None:
                        fill = shd.get(qn('w:fill'))
                        if fill and fill.upper() not in ALLOWED_COLORS and fill != "auto":
                            unexpected_colors.add(fill)

    if unexpected_colors:
        issues.append(("S2", f"Cores inesperadas em cell shading: {unexpected_colors}"))

    return issues


def check_consistency(merged_text):
    """[S2] Verifica consistência interna básica."""
    issues = []

    # Check for mixed language in section headers
    upper = merged_text.upper()
    has_pt = "SÍNTESE" in upper or "CONTRIBUIÇÕES" in upper or "FORMAÇÃO" in upper
    has_en = "EXECUTIVE SUMMARY" in upper or "ACADEMIC BACKGROUND" in upper
    if has_pt and has_en:
        issues.append(("S3", "Headers misturando idiomas (PT e EN) — considerar uniformizar"))

    return issues


# ═══════════════════════════════════════════════════════════════
# EXECUTOR PRINCIPAL
# ═══════════════════════════════════════════════════════════════

def run_review(docx_path, doc_type="eb1a"):
    """Executa TODAS as verificações e gera relatório."""

    print("=" * 70)
    print(f"QUALITY REVIEWER — {os.path.basename(docx_path)}")
    print(f"Tipo: {doc_type.upper()}")
    print(f"Tamanho: {os.path.getsize(docx_path):,} bytes")
    print("=" * 70)

    doc, merged = load_document(docx_path)
    xml_str = etree.tostring(doc.element.body, encoding='unicode')

    all_issues = []

    # 1. Fontes
    print("\n[1/9] Verificando fontes...")
    font_issues, total_runs = check_fonts(doc)
    all_issues.extend(font_issues)
    print(f"      {total_runs} runs verificados")

    # 2. Page setup
    print("[2/9] Verificando page setup...")
    all_issues.extend(check_page_setup(doc))

    # 3. Palavras proibidas
    print("[3/9] Verificando palavras proibidas...")
    all_issues.extend(check_forbidden_words(merged, xml_str))

    # 4. Imagens
    print("[4/9] Verificando imagens...")
    img_issues, img_count, placeholder_count = check_images(doc)
    all_issues.extend(img_issues)
    print(f"      {img_count} imagens, {placeholder_count} placeholders")

    # 5. Evidence blocks
    print("[5/9] Verificando evidence blocks...")
    eb_issues, tables_2col, tables_impact = check_evidence_blocks(doc)
    all_issues.extend(eb_issues)
    print(f"      {tables_2col} evidence blocks, {tables_impact} com impact dentro")

    # 6. Comprimento de parágrafos
    print("[6/9] Verificando comprimento de parágrafos...")
    all_issues.extend(check_paragraph_length(doc))

    # 7. Header/Footer
    print("[7/9] Verificando header e footer...")
    all_issues.extend(check_header_footer(doc))

    # 8. Seções obrigatórias
    print("[8/9] Verificando seções obrigatórias...")
    if doc_type == "eb1a":
        all_issues.extend(check_sections_eb1a(merged))
    elif doc_type == "eb2niw":
        all_issues.extend(check_sections_eb2niw(merged))

    # 9. Cores e consistência
    print("[9/9] Verificando cores e consistência...")
    all_issues.extend(check_colors_in_xml(doc))
    all_issues.extend(check_consistency(merged))

    # ── RELATÓRIO ──
    print("\n" + "=" * 70)
    print("RELATÓRIO DE QUALIDADE")
    print("=" * 70)

    # Stats
    print(f"\nParagraphs: {len(doc.paragraphs)}")
    print(f"Tables: {len(doc.tables)}")
    print(f"Images: {img_count}")
    print(f"Evidence Blocks (2-col): {tables_2col}")
    print(f"  com impact dentro: {tables_impact}")
    print(f"Runs verificados: {total_runs}")

    # Issues by severity
    s0 = [(s, m) for s, m in all_issues if s == "S0"]
    s1 = [(s, m) for s, m in all_issues if s == "S1"]
    s2 = [(s, m) for s, m in all_issues if s == "S2"]
    s3 = [(s, m) for s, m in all_issues if s == "S3"]

    print(f"\n--- ISSUES ---")
    print(f"S0 GRAVÍSSIMO: {len(s0)}")
    print(f"S1 GRAVE:      {len(s1)}")
    print(f"S2 MODERADO:   {len(s2)}")
    print(f"S3 MENOR:      {len(s3)}")

    if s0:
        print(f"\n!!! S0 — GRAVÍSSIMO (BLOQUEIA ENTREGA) !!!")
        for _, msg in s0:
            print(f"  [S0] {msg}")

    if s1:
        print(f"\n!! S1 — GRAVE (BLOQUEIA ENTREGA) !!")
        for _, msg in s1:
            print(f"  [S1] {msg}")

    if s2:
        print(f"\n! S2 — MODERADO (CORRIGIR) !")
        for _, msg in s2:
            print(f"  [S2] {msg}")

    if s3:
        print(f"\nS3 — MENOR (DOCUMENTAR)")
        for _, msg in s3:
            print(f"  [S3] {msg}")

    # Verdict
    print(f"\n{'=' * 70}")
    if s0 or s1:
        print("VEREDICTO: REPROVADO — Corrigir issues S0/S1 antes de entregar")
        print(f"  {len(s0)} gravíssimos + {len(s1)} graves = REBUILD NECESSÁRIO")
    elif s2:
        print("VEREDICTO: APROVADO COM RESSALVAS — Corrigir issues S2 se possível")
    else:
        print("VEREDICTO: APROVADO — Documento pronto para entrega")
    print("=" * 70)

    return len(s0), len(s1), len(s2), len(s3)


# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python3 quality_reviewer.py <resume.docx> [eb1a|eb2niw]")
        sys.exit(1)

    docx_path = sys.argv[1]
    doc_type = sys.argv[2] if len(sys.argv) > 2 else "eb1a"

    s0, s1, s2, s3 = run_review(docx_path, doc_type)
    sys.exit(1 if (s0 + s1) > 0 else 0)
```

---

## 3. CHECKLIST DE REVISÃO MANUAL

Após a verificação automatizada, o agente DEVE fazer revisão manual nos seguintes pontos que o script não consegue capturar:

### 3.1 Revisão Visual (abrir o .docx ou .pdf)

| # | Check | Severidade se falhar |
|---|-------|---------------------|
| 1 | Header navy bar visível em TODAS as páginas | S0 |
| 2 | Footer navy bar com "Page X of Y" em TODAS as páginas | S0 |
| 3 | Teal accent line no header (Row 2) | S1 |
| 4 | Evidence blocks com borda visível (#CCCCCC) | S2 |
| 5 | Thumbnails renderizando corretamente (não quebradas) | S1 |
| 6 | Company boxes com fundo cinza claro (#F5F5F5) | S2 |
| 7 | Gantt timeline com Teal cells preenchidas | S2 |
| 8 | Sem page breaks duplos (páginas em branco no meio) | S1 |
| 9 | Alinhamento consistente (justify em body, center em headers) | S2 |
| 10 | Espaçamento uniforme entre evidence blocks | S3 |

### 3.2 Revisão de Conteúdo

| # | Check | Severidade se falhar |
|---|-------|---------------------|
| 1 | Nome do beneficiário correto no header | S0 |
| 2 | E-mail / contato correto no header | S1 |
| 3 | SOC/O*Net code correto | S1 |
| 4 | Tipo correto (EB-1A vs EB-2 NIW) | S0 |
| 5 | TODOS os documentos/evidências do inventário cobertos | S1 |
| 6 | Nenhuma evidência faltando vs. lista do Paulo | S1 |
| 7 | Dados numéricos conferem com fontes originais | S1 |
| 8 | Nomes de instituições/empresas corretos | S2 |
| 9 | Datas corretas em todos os evidence blocks | S2 |
| 10 | Sem contradições internas (mesmo dado, valores diferentes) | S1 |
| 11 | Impactos são factuais (não marketeiros) | S2 |
| 12 | Sem argumentação jurídica (isso é da Cover Letter) | S1 |

### 3.3 Revisão Específica EB-1A

| # | Check | Severidade se falhar |
|---|-------|---------------------|
| 1 | Seções por critério corretas (apenas os batidos) | S1 |
| 2 | Ordem dos critérios segue a Cover Letter | S2 |
| 3 | Cada critério tem parágrafo introdutório | S2 |
| 4 | Nenhum critério não-pleiteado incluído | S1 |

### 3.4 Revisão Específica EB-2 NIW

| # | Check | Severidade se falhar |
|---|-------|---------------------|
| 1 | Seção Proposed Endeavors presente | S0 |
| 2 | Cada proposta tem dados de mercado com fonte | S1 |
| 3 | Cada proposta tem código BLS | S1 |
| 4 | Cada proposta tem alinhamento com política governamental | S1 |
| 5 | Tabela comparativa das propostas presente | S2 |
| 6 | Parágrafo Dhanasar (3 prongs) presente | S1 |
| 7 | NÃO tem seções C1-C10 | S0 |
| 8 | Contribuições organizadas por tema (não por critério) | S2 |

---

## 4. PROTOCOLO DE EXECUÇÃO

### Passo 1: Verificação Automatizada
```bash
python3 quality_reviewer.py /path/to/resume.docx eb1a
# ou
python3 quality_reviewer.py /path/to/resume.docx eb2niw
```

### Passo 2: Análise do Relatório
- Se **S0 ou S1**: PARAR. Corrigir e re-executar.
- Se **apenas S2**: Corrigir o que for possível, documentar o resto.
- Se **apenas S3 ou limpo**: Prosseguir para revisão manual.

### Passo 3: Revisão Manual (Agente)
O agente deve:
1. Ler o documento com `Document()` e verificar os itens 3.1-3.4
2. Se encontrar issue S0/S1 → reportar e bloquear
3. Se encontrar issue S2 → tentar corrigir automaticamente
4. Listar todos os findings no relatório final

### Passo 4: Relatório Final ao Paulo
Formato do relatório:
```
QUALITY REVIEW — [Nome do Résumé]

Status: APROVADO / APROVADO COM RESSALVAS / REPROVADO

Stats:
  Páginas (estimadas): ~XX
  Parágrafos: XX
  Tabelas: XX
  Imagens: XX
  Evidence blocks: XX

Verificação Automatizada:
  S0 Gravíssimos: X
  S1 Graves: X
  S2 Moderados: X
  S3 Menores: X

[Se houver issues, listar aqui]

Revisão Manual:
  [Itens verificados e resultado]

Conclusão: [Documento pronto / Precisa de correções]
```

---

## 5. EXEMPLOS DE ISSUES COMUNS

### S0 — GRAVÍSSIMO (encontrados em produção real)
- Arial em runs do header/footer (Word insere default)
- Header com "EB-1A" em documento EB-2 NIW
- Nome do beneficiário errado
- Seção Proposed Endeavors completamente ausente em EB-2 NIW

### S1 — GRAVE
- Evidence blocks com impacto ABAIXO em vez de DENTRO
- Thumbnail na coluna ESQUERDA em vez de DIREITA
- Margins de 1" em vez de 0.65"
- R$ no documento
- Page breaks duplos gerando páginas em branco
- Dados contradizem a Cover Letter
- Evidência do inventário completamente ausente

### S2 — MODERADO
- Placeholders [THUMBNAIL] não substituídos
- Parágrafos curtos (< 3 linhas) em seções substantivas
- Cores inesperadas em cell shading
- Espaçamento irregular entre blocos
- Gantt timeline com anos incorretos

### S3 — MENOR
- Idiomas misturados em headers (PT e EN)
- Espaçamento entre evidence blocks levemente diferente
- Caption de foto com formatação inconsistente

---

*Quality Reviewer V1.0 — 03/mar/2026*
