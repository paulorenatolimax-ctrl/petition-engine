# Forbidden Content - BP System

## Purpose

The business plan must read as a **pure business document** prepared for a sophisticated investor audience. No immigration context, process references, or related terminology may appear anywhere in the generated content.

## 12 Prohibited Terms

The following terms are **absolutely prohibited** in any section output. Detection of any term triggers immediate section rejection (Quality Gate 1).

| # | Term | Language | Category |
|---|------|----------|----------|
| 1 | consultoria | PT | Service description |
| 2 | consultor | PT | Service description |
| 3 | consulting | EN | Service description |
| 4 | EB-1 | EN | Immigration visa category |
| 5 | EB-2 | EN | Immigration visa category |
| 6 | NIW | EN | Immigration visa category |
| 7 | green card | EN | Immigration document |
| 8 | visto | PT | Immigration document |
| 9 | imigracao | PT | Immigration process |
| 10 | USCIS | EN | Immigration agency |
| 11 | petition | EN | Immigration document |
| 12 | peticao | PT | Immigration document |

## Replacement Rules

### Service Description Terms

Even when input data contains "consultoria" or "consulting", **always replace** with approved alternatives:

| Prohibited | Approved Replacements |
|-----------|----------------------|
| consultoria | assessoria, prestacao de servicos especializados |
| consultor | profissional, especialista, assessor |
| consulting | advisory services, specialized services, professional services |

### Immigration Terms

These terms have **no replacement** -- they must simply never appear. The document must contain zero references to immigration processes, visa categories, or immigration agencies.

## Document Persona Rules

1. **Audience:** The document is written as if presented to a **sophisticated investor** evaluating the business opportunity
2. **Tone:** Professional, analytical, data-driven
3. **Perspective:** Third-person, impersonal, expository
4. **Never address:** Immigration officers, government officials, or petition reviewers
5. **Never reference:** Immigration processes, visa applications, petition support, or any regulatory immigration framework
6. **Focus:** Business viability, market opportunity, financial projections, operational excellence

## Automated Validation

```python
PROHIBITED_TERMS = [
    "consultoria", "consultor", "consulting",
    "EB-1", "EB-2", "NIW",
    "green card", "visto", "imigração",
    "USCIS", "petition", "petição"
]

def validate_forbidden_content(text: str) -> dict:
    """
    Validate text for forbidden content.
    Returns dict with 'passed' bool and 'violations' list.
    """
    violations = []
    text_lower = text.lower()

    for term in PROHIBITED_TERMS:
        if term.lower() in text_lower:
            # Find all occurrences with context
            idx = 0
            while True:
                idx = text_lower.find(term.lower(), idx)
                if idx == -1:
                    break
                # Extract surrounding context (40 chars each side)
                start = max(0, idx - 40)
                end = min(len(text), idx + len(term) + 40)
                context = text[start:end]
                violations.append({
                    "term": term,
                    "position": idx,
                    "context": f"...{context}..."
                })
                idx += 1

    return {
        "passed": len(violations) == 0,
        "violations": violations,
        "violation_count": len(violations)
    }
```

## Edge Cases

1. **Compound words:** "consultoria" inside longer words (e.g., "consultoriamente") -- still prohibited
2. **Case variations:** "CONSULTORIA", "Consulting", "EB-1" -- case-insensitive check
3. **Accented variants:** Both "imigracao" and "imigra\u00e7\u00e3o" must be caught
4. **Partial matches:** "consultant" is NOT prohibited (only "consultor" and "consulting" are)
5. **In tables:** Prohibited terms inside table cells are equally forbidden
6. **In citations:** Prohibited terms in source names/titles are equally forbidden -- rephrase the citation
