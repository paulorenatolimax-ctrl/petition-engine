# Quality Gates - BP System

## Overview

Every generated business plan section passes through 6 quality gates before final assembly. A section that fails any gate must be regenerated or manually corrected before proceeding.

## Gate 1: Forbidden Content Check

**Severity:** BLOCKING (automatic rejection)

Scan the entire section output for any of the 12 prohibited terms defined in `FORBIDDEN_CONTENT_BP.md`. If any term is found, the section is immediately rejected and must be regenerated.

**Automated Check:**
```python
PROHIBITED = [
    "consultoria", "consultor", "consulting",
    "EB-1", "EB-2", "NIW",
    "green card", "visto", "imigração",
    "USCIS", "petition", "petição"
]

def check_forbidden(text: str) -> list[str]:
    """Return list of found prohibited terms."""
    found = []
    text_lower = text.lower()
    for term in PROHIBITED:
        if term.lower() in text_lower:
            found.append(term)
    return found
```

**Action on Failure:** Regenerate section with reinforced prohibition instructions.

## Gate 2: Word Count Validation

**Severity:** WARNING (soft rejection)

| Section Type | Min Words | Max Words |
|-------------|-----------|-----------|
| Standard sections | 500 | 700 |
| Financial sections (DRE, Indicators, BEP) | 500 | 900 |
| Short sections (ESG, Vision/Mission) | 300 | 400 |

**Action on Failure:**
- Under minimum: Flag for content expansion
- Over maximum: Flag for content trimming (cut least essential paragraphs)

## Gate 3: Anti-Hallucination Audit

**Severity:** BLOCKING (requires manual review)

Check for fabricated content:

1. **Numeric Data:** Any revenue figure, price, salary, margin, or quantity must trace to:
   - Research Pack data provided as input, OR
   - A cited .gov or recognized industry source
2. **Competitor Names:** Any named competitor must be verifiable. Generic profiles ("large regional players") are acceptable.
3. **Source URLs:** Any URL cited must be a real, verifiable address. Fabricated URLs cause immediate rejection.
4. **Statistics:** Market size, growth rates, and demographic data must reference their source.

**Indicators of Hallucination:**
- Suspiciously precise numbers without source attribution
- Competitor names that cannot be verified
- URLs returning 404
- Statistics that contradict Research Pack data

**Action on Failure:** Flag specific hallucinated data points, regenerate with stricter anti-hallucination prompt reinforcement.

## Gate 4: Table Formatting Compliance

**Severity:** WARNING (fixable)

Every table in the output must comply with:

1. **Introductory Paragraph:** Minimum 2 sentences before the table providing context
2. **Conclusive Paragraph:** Minimum 1 sentence after the table with strategic insight or implication
3. **No Naked Tables:** Tables without surrounding context are never acceptable
4. **Markdown Format:** Proper `| Col1 | Col2 |` format with header separator row
5. **Table vs Prose Decision:** Comparative/numeric data should use tables. Narrative/descriptive content should use prose.

**Action on Failure:** Add missing context paragraphs. Restructure improperly formatted tables.

## Gate 5: Structural Completeness

**Severity:** WARNING (fixable)

Each section must contain:

1. **Introduction:** 2-3 sentences establishing context
2. **Body:** Substantive content with analysis, data, and/or tables
3. **Conclusion:** 2-3 sentences with strategic implications or forward-looking statements
4. **Proper Headings:** ## for section titles, ### for subtitles
5. **No Metacommentary:** No "I will now...", "Let me analyze...", "Word count:", etc.

**Metacommentary Patterns to Reject:**
```
"Vou pesquisar..."
"Agora vou estruturar..."
"Contagem de palavras:"
"Excelente."
"Tenho dados suficientes."
"Analisando o contexto..."
"Let me..."
"I will now..."
"Word count:"
```

**Action on Failure:** Strip metacommentary. Add missing structural elements.

## Gate 6: Cross-Section Consistency

**Severity:** WARNING (review required)

After all sections in a block are generated, validate cross-section consistency:

1. **Financial Consistency:** Numbers in DRE must match Revenue Estimates. Break-even must align with cost structure.
2. **Employee Count:** Staff numbers in "Quadro de Funcionarios" must match references in other sections.
3. **Location References:** City, state, and address references must be consistent across all sections.
4. **Company Name:** Must be identical everywhere (including legal entity type).
5. **Timeline Alignment:** Milestones in Timeline must reference activities described in operational/marketing sections.
6. **Service/Product Naming:** Consistent naming of products/services across all sections.

**Action on Failure:** Identify inconsistencies, regenerate affected sections with corrected context.

## Gate Execution Order

```
Section Generated
      |
      v
[Gate 1] Forbidden Content Check ---- FAIL --> Regenerate
      |
      PASS
      |
      v
[Gate 2] Word Count Validation ------- FAIL --> Warn + Trim/Expand
      |
      PASS
      |
      v
[Gate 3] Anti-Hallucination Audit ---- FAIL --> Manual Review + Regenerate
      |
      PASS
      |
      v
[Gate 4] Table Formatting ------------ FAIL --> Auto-fix
      |
      PASS
      |
      v
[Gate 5] Structural Completeness ----- FAIL --> Auto-fix
      |
      PASS
      |
      v
Section Approved for Assembly

After all sections in a block are approved:
      |
      v
[Gate 6] Cross-Section Consistency --- FAIL --> Identify + Regenerate affected
      |
      PASS
      |
      v
Block Approved
```

## Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Forbidden term violations | 0 per document | Automated scan |
| Word count compliance | 100% within range | Automated count |
| Hallucination rate | 0 fabricated data points | Manual audit |
| Table formatting compliance | 100% with context | Automated pattern check |
| Structural completeness | 100% all elements present | Automated check |
| Cross-section consistency | 0 contradictions | Manual + automated |
