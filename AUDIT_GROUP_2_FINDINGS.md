# AUDIT GROUP 2: STRATEGY, BUSINESS PLAN, AND SAAS SYSTEMS
## Exhaustive Line-by-Line Audit Report
**Date:** 2026-04-01 | **Auditor:** Claude Opus 4.6 (1M context)

---

## SYSTEM 1: Estrategia EB-2 NIW (9 Prompts)

**Path:** `/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-2 - ESTRATEGIAS/`
**Files:** 9 markdown files (Prompts 1-9), ~39KB total
**Date of files:** May 12, 2025

### Architecture

A sequential 9-prompt pipeline that builds an EB-2 NIW business plan strategy from scratch, working exclusively on Prong 1 (Substantial Merit & National Importance) under the Matter of Dhanasar framework. Each prompt takes the output of previous prompts as context.

| Prompt | Purpose | Output |
|--------|---------|--------|
| 1 | Map national importance of Proposed Endeavor | Policy-aligned national importance analysis |
| 2 | Define business focus from CV | Single strategic business focus |
| 3 | Structure initial company (Executive Summary) | 5 services + course + 4 target sectors |
| 4 | Government policies aligned to the BUSINESS | 3-5 policy documents with URLs |
| 5 | Government policies aligned to the SERVICES | Additional policies (no overlap with P4) |
| 6 | Government policies aligned to TARGET SECTORS | Additional policies (no overlap with P4/P5) |
| 7 | Mission, Vision, Values | Mission + Vision (5yr) + 4 value pairs |
| 8 | BLS Occupation Code | 4 BLS codes with justification |
| 9 | Final integrated Executive Summary | Consolidated document for USCIS |

### STRENGTHS

1. **Excellent anti-generic guardrails.** Every prompt explicitly forbids vague language:
   - P1 line 63: "Proibido usar termos genericos como 'ajudara os EUA' ou 'tem potencial elevado', sem provas documentais"
   - P2 line 14: "Evite abordagens genericas, descritivas ou multiplos focos paralelos"
   - P3 line 72: "Proibido descrever servicos ou setores com termos vagos como 'consultoria ampla', 'area de atuacao variada'"

2. **Triple government policy coverage (P4/P5/P6).** The three-angle approach (business-level, service-level, sector-level) creates overwhelming policy alignment evidence. This is a genuinely innovative structure.

3. **Mandatory URL requirement.** P4 line 13: "Cada afirmacao deve estar acompanhada da URL completa (incluindo protocolo, dominio e caminho exato)." This forces verifiable sourcing.

4. **Inferential language mandate.** P1 line 14: "Use linguagem impessoal, tecnica e inferencial -- jamais descritiva ou generica." This produces output that reads like a policy brief, which is exactly what adjudicators expect.

5. **P9 integration prompt explicitly forbids invention.** Line 12: "Nao invente novos dados. A funcao aqui e organizar, integrar e articular logicamente os conteudos existentes."

### GAPS AND ISSUES

1. **CRITICAL: No Prong 2 or Prong 3 coverage.** The entire 9-prompt system covers ONLY Prong 1 (Substantial Merit & National Importance). There are ZERO prompts for:
   - Prong 2: "The foreign national is well positioned to advance the proposed endeavor"
   - Prong 3: "On balance, it would be beneficial to the United States to waive the job offer requirement"
   This means the system produces only ~33% of the Dhanasar argumentation needed for a complete NIW petition.

2. **CRITICAL: Outdated USCIS reference.** P1 line 2 references "diretrizes atualizadas da USCIS em 15/01/2025" but the file date is May 2025. The January 2025 Policy Alert (PA-2025-03) significantly tightened Prong 1 requirements, especially for entrepreneurs. The prompts do not incorporate the PA-2025-03 changes (e.g., the requirement that the endeavor's importance extend beyond the individual's employer/clients).

3. **Duplicate "Restricoes" section in Prompt 1.** Lines 61-67 and 71-76 both have "Restricoes" headers. The second set appears to belong to Prompt 2 but was mistakenly left in Prompt 1.

4. **No input validation.** None of the prompts verify that the CV or documentation has been provided before proceeding. There is no mechanism to flag missing information.

5. **Prompts 4/5/6 risk LLM hallucination of URLs.** While they demand "URL completa e funcional," LLMs are notorious for fabricating plausible-looking government URLs. There is no verification step or instruction to confirm URLs are real.

6. **No forbidden content list.** Unlike the Business Plan system (which has FORBIDDEN_CONTENT_BP.md), these prompts lack an explicit list of immigration-specific terms to avoid (e.g., "green card," "visa," "petition").

7. **P8 asks for 4 BLS codes but doesn't explain why 4.** The typical petition uses 1-2 codes. Having 4 may confuse the adjudicator about what the petitioner actually does.

8. **No course validation logic.** P3 mandates creating a 4-module course, but there is no quality gate to verify the course is commercially viable or that the petitioner is qualified to teach it.

---

## SYSTEM 2: Estrategia EB-1A

**Path:** `/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/EB-1 - ESTRATEGIA EB-1 (PROMPTS)/_ASSISTENTE FINAL (ESTE)/`
**Files:** 1 main file (39.9KB) + 10 files in TENTATIVA 2 subfolder (~141KB total)

### Architecture

Two versions exist:

**Version 1 (Main file):** Single monolithic 1,079-line prompt file dated Dec 11, 2025. Contains a 4-prompt sequential assistant system for EB-1A viability analysis ("Projeto Base" phase).

**Version 2 (TENTATIVA 2 - Kortix):** Decomposed into 10 files dated Dec 19, 2025. Same 4-prompt system but broken into modular components including RAG integration protocol, occupational code safety guide, bot instructions, visual diagrams, and delivery summary.

### STRENGTHS

1. **Exceptionally well-designed evidence classification.** The three-tier system avoids negative language:
   - "ROBUSTA" (strong)
   - "PROMISSORA" (promising)
   - "EM DESENVOLVIMENTO" (developing)
   This is psychologically sophisticated for client-facing output.

2. **Kazarian two-step analysis is properly implemented.** The system correctly separates Step 1 (meet 3/10 criteria) from Step 2 (holistic "top of field" determination), which many EB-1A tools get wrong.

3. **Occupational code safety protocol is outstanding.** The guide (03_GUIA_CODIGOS_OCUPACIONAIS.md) contains a critical safety matrix:
   - Accountant (13-2011) -> Financial Manager (11-3031) [CPA required]
   - Physician (29-1069) -> Medical Services Manager (11-9111) [license required]
   - Engineer (17-2011) -> Engineering Manager (11-9041) [PE required]
   - Lawyer (23-1011) -> Administrative Services Manager (11-3011) [bar exam required]
   This prevents a common petition-killing mistake.

4. **Temporal sustainability analysis.** The system evaluates whether achievements are distributed over time (FY2020-2025 grid), which directly addresses the "sustained acclaim" requirement that causes many denials.

5. **Current adjudication context.** Correctly cites FY2023 approval rate ~70.5% dropping to FY2024 ~60.7%, showing awareness of tightening trends.

### GAPS AND ISSUES

1. **CRITICAL: Massive redundancy in TENTATIVA 2.** The 10 files contain approximately 60-70% duplicated content. The same occupational code matrix, the same prompt structures, the same checklists appear in files 01, 02, 03, 05, 06, 08, and 09. This is ~100KB of bloat. A single well-organized file would be more effective.

2. **RAG integration is aspirational, not functional.** The PROTOCOLO_RAGS document (04) describes 3 RAGs that should be loaded, but:
   - The RAG files are not provided in the delivery package
   - The "example queries" on lines 236-262 show fabricated response data (e.g., "taxa de aprovacao para o Criterio 5 em FY2024 foi de 65%") that is presented as if it came from a real RAG
   - There is no actual RAG implementation code or API integration

3. **Metrics of success are fabricated.** File 01 line 183: "Taxa de aprovacao: 65%+ (vs. 60,7% media)." These are aspirational targets presented as guaranteed outcomes. No system can guarantee approval rates.

4. **V1 and V2 are both marked "PRONTO PARA PRODUCAO" but are different systems.** V1 is a single file; V2 is 10 files. Which one should be used? There is no deprecation notice on V1.

5. **No integration with the EB-2 NIW strategy system.** The EB-1A system explicitly says "Nao misture estrategias" but many clients file dual EB-1A + EB-2 NIW petitions. There is no guidance for the common scenario where a client qualifies for both.

6. **The system assumes the client already validated one occupation code.** Prompt 3 context says "Voce ja validou UM unico codigo de ocupacao" but there is no upstream system that does this validation for EB-1A clients (the EB-2 system's Prompt 8 does 4 codes, but for EB-2 not EB-1A).

---

## SYSTEM 3: Business Plan (BP Orquestrador)

**Path:** `/Users/paulo1844/Documents/OMNI/_IMIGRACAO/BP Orquestrador/BP_SYSTEM_V3/` (DOES NOT EXIST)
**Alternate evidence found at:** `/Users/paulo1844/Documents/Claude/Projects/C.P./UPGRADE_SISTEMA_BP_ORQUESTRADOR.md`

### FINDINGS

The `BP_SYSTEM_V3/` directory does NOT exist on disk. The `BP Orquestrador/` parent directory also does not exist. However, the UPGRADE document at `Claude/Projects/C.P./` references files that should exist at this path:

Referenced but NOT found:
- `BP_SYSTEM_V3/SISTEMA_BP.md` (6 blocks, 42 sections architecture)
- `BP_SYSTEM_V3/FORMATTING_SPEC_BP.md`
- `BP_SYSTEM_V3/QUALITY_GATES_BP.md`
- `BP_SYSTEM_V3/FORBIDDEN_CONTENT_BP.md`
- `generate_bp_v2.py` (DOCX generator)
- `bp-system-export-2026-03-22.json` (42-section JSON)

**CRITICAL: The entire Business Plan system appears to have been deleted or moved.** The UPGRADE document describes an "Ikaro 3.0" visual standard upgrade with detailed typography specs (Garamond 11pt, Sage Green #D6E1DB table headers, etc.), but the system files it references are missing.

This is a MAJOR gap: the BP system is referenced by multiple other systems (EB-2 strategy prompts produce content FOR the BP, the SaaS system's pricing feeds INTO the BP) but the core system files are absent.

---

## SYSTEM 4: SaaS Evidence Architect

**Path:** `/Users/paulo1844/Documents/_Z GLOBAL/Z_PROMPTS/SAAS (PROMPTS)/`
**Files:** 2 files (V1: 12.4KB, V2: 18.8KB)

### Architecture

**V1** (Jan 21, 2025): A GPT custom instructions prompt that converts client documents into SaaS product dossiers optimized for EB-2 NIW Prong 1. Produces JSON output with evidence_summary, product_spec, prong1_defense, replicability_plan, pricing_recommendations, and 6 RFE-safe paragraphs.

**V2** (Mar 31, 2026): Major evolution. Adds:
- Triple-audience design (USCIS officer + investor + customer)
- Mandatory web research phase (BLS, Census, IBISWorld, Statista)
- Revenue model requirements (MRR, CAC, LTV, churn, break-even)
- Lovable Build Spec output (generates a mega prompt for building the actual SaaS in Lovable)
- Quality gates with 14 verification checkpoints
- Enterprise SaaS design spec (Stripe/Notion aesthetic)

### STRENGTHS

1. **V2 Rule #1 is brilliant.** Line 37: "NEVER mention: immigration, USCIS, visa, green card, petition, waiver, EAD, I-485, advance parole, priority date, EB-2, NIW, Dhanasar, prong." This ensures the output reads like genuine company documentation, which is exactly what adjudicators want.

2. **V2 Rule #2 fixes a V1 flaw.** V1 exposed internal pricing strategy language (decoy, anchor, conversion). V2 line 39: "NEVER reveal internal pricing strategy mechanics in the output." This was a real risk -- if an adjudicator saw "decoy tier" language, it would undermine credibility.

3. **V2 Rule #9 is strategically excellent.** Line 59: "National/global implications emerge from the BUSINESS MODEL, not from claims. Don't SAY 'this has national importance.' Instead, SHOW: 'The platform currently serves organizations in Texas, Florida, and California, with infrastructure capable of supporting 10,000+ concurrent users across all 50 states.'" This is the most effective Prong 1 strategy: let facts speak.

4. **Revenue model mandate (V2 Rule #8).** Line 52: "The subscription/recurring revenue model is SACRED." This forces every SaaS dossier to have real financial projections, preventing the common failure of SaaS petitions that lack credible revenue models.

5. **Lovable Build Spec is innovative.** Phase 7 generates a complete buildable specification so the client can actually BUILD the SaaS, not just document it. This addresses the common adjudicator concern that the SaaS is vaporware.

### CRITICAL FINDING: Cristine Correia / Talent Anchor OS Case

**Question asked:** Does the system PREVENT the Cristine Correia scenario (SaaS denied because it didn't demonstrate national importance)?

**Answer: V2 YES, V1 PARTIALLY.**

V1's weakness was that it focused on "national reach" and "replicability" but allowed the output to include internal strategy language and didn't mandate web research for market validation. A SaaS like "Talent Anchor OS" could pass V1's checks while still appearing to be a personal consulting tool dressed up as software.

V2 has multiple layers of prevention:
- Phase 2 Section "The Systemic Problem" forces articulation of a field-wide gap with REAL data
- Phase 2 Section "Why This Is a Platform (Not Custom Consulting)" requires 3-paragraph defense with evidence
- Phase 3 Section "2. Platform Solution -- Replicable by Design" forces demonstration that the technology is not founder-dependent
- Quality gate line 270: "National reach emerges from FACTS (infrastructure, users, states) not CLAIMS"
- Quality gate line 276: "The document could be published on the company's website WITHOUT embarrassment"

However, V2 has ONE remaining vulnerability: it does not explicitly check whether the SaaS addresses a problem at NATIONAL SCALE vs. merely being nationally available. A SaaS that helps one company manage talent (like Talent Anchor OS) could be nationally available (anyone can subscribe) without solving a NATIONAL problem. The distinction between "available nationally" and "nationally important" is the exact trap the Cristine Correia case fell into. V2's Section "1. Systemic Problem at National Scale" partially addresses this but could be more explicit.

### GAPS

1. **V1 should be deprecated.** V1 exposes decoy pricing terminology and lacks web research requirements. If someone uses V1 instead of V2, they get an inferior and potentially harmful output.

2. **No integration with the BP Orquestrador.** V2's pricing and revenue model should feed directly into the Business Plan financial projections, but there is no documented handoff mechanism.

3. **V2 references "RAGs and live web research" in the description but doesn't specify which RAGs.** Unlike the EB-1A system which names 3 specific RAGs, the SaaS system assumes the LLM will do web research natively.

4. **Country reference rule (V2 Rule #7) may be too restrictive.** Line 49: "NEVER include country-specific references (e.g., 'Bosnia and Herzegovina', 'Nigeria', etc.) unless they come directly from the client's own documents." Some clients legitimately serve international markets. The rule should distinguish between the petitioner's country of origin (avoid) and markets served (allow).

---

## SYSTEM 5: Localizacao (EB-2 NIW Strategic Location Analysis)

**Path:** `/Users/paulo1844/Documents/_PROEX (A COMPLEMENTAR)/PROMPTs/LOCALIZACAO - PROMPT/`
**Files:** 1 markdown file (273KB) + 1 PDF (857KB)
**Date:** June 26, 2025

### Architecture

This is the LARGEST single prompt system in the entire ecosystem. The markdown file contains a 10-PHASE automated pipeline for strategic location selection, spanning approximately 6,500+ lines. It was generated from a Perplexity AI deep research session (evidenced by ppl-ai-file-upload URLs throughout).

**10 Phases:**
1. Briefing & Complete Data Collection (comprehensive intake form)
2. Dhanasar Prong 1 Optimization (compliance validation, sector categorization)
3. Opportunity Zone & Federal Incentive Mapping (8,764 OZ analysis)
4. PA-2025-03 Compliance Validation + AAO Precedent Analysis
5. Infrastructure & Business Ecosystem Analysis
6. Competitive Landscape & Market Saturation Analysis
7. Financial Modeling & Economic Impact Projections
8. Federal Agency Partnership & Letter Strategy
9. Risk Assessment & Mitigation
10. Final Recommendations & Implementation Roadmap

### STRENGTHS

1. **Most data-rich system in the entire portfolio.** Contains specific approval rates by sector and region (e.g., AI in Bay Area: 31% FY2024, Biotech in Research Triangle: 81% FY2024, Semiconductors in Austin: 78% FY2024).

2. **PA-2025-03 awareness is the most current of any system.** Phase 1 line 10: "Taxa de aprovacao DESPENCOU de 96% (2021-2023) para 43% (2024)." This is the only system that incorporates the dramatic 2024-2025 approval rate decline.

3. **Opportunity Zone database integration.** Phase 3 references the full Treasury Department database of 8,764 designated OZs with tax benefit details and expiration dates.

4. **Federal agency contact strategy by region.** Phase 8 maps specific federal agencies to regions with success rates for support letters (e.g., "NREL letter for clean energy: 83% approval rate").

5. **Pseudo-code risk scoring.** The system includes Python-like validation functions for project specificity checking, red-flag detection, and compliance scoring. While not executable, they provide clear algorithmic logic for the analysis.

6. **Red flag detection for generic language.** Phase 2 includes: `red_flags = ["consultoria", "treinamento", "assessoria", "trabalhar como", "atuar na area", "prestar servicos", "oferecer solucoes"]` with 85% denial probability flag.

### GAPS AND ISSUES

1. **CRITICAL: The approval rate statistics appear fabricated or imprecise.** The document claims AI Bay Area approval rate is "31% (vs 67% for non-AI STEM)" and Biotech Research Triangle is "81% (highest in nation)." These granular breakdowns by technology sector AND geography are not published by USCIS. The USCIS publishes aggregate EB-2 NIW approval data, not sector-by-region breakdowns. These numbers likely come from private law firm analysis or are extrapolated/estimated. They should be labeled as estimates with sources.

2. **CRITICAL: File is a raw Perplexity AI export, not a polished prompt.** The document contains:
   - Perplexity file upload URLs (lines 29-44, 344-358) that are temporary and likely expired
   - Commentary text like "Esta Fase 2 refinada esta pronta ou quer que eu ajuste algum aspecto especifico?" which is conversation artifact, not prompt content
   - Mixed formatting (backtick code blocks containing prose, broken indentation)
   This file needs heavy editing before it can function as a production prompt.

3. **No single-prompt usability.** At 273KB, no current LLM can process this entire file in one context window as a system prompt. It would need to be broken into 10 separate phase prompts, but the file has no clear separation markers.

4. **Python pseudo-code is not executable.** Functions like `calcular_forca_prong1_por_regiao()` and `validar_especificidade_projeto()` look like Python but are incomplete pseudo-code. They create a false impression of automated functionality.

5. **Stale external links.** The 15+ URLs to Perplexity file storage (ppl-ai-file-upload.s3.amazonaws.com) are temporary upload links that expire. The USCIS and law firm URLs may also change.

---

## SYSTEM 6: IMPACTO (Economic Impact Intelligence Suite)

**Path:** `/Users/paulo1844/Documents/_Z GLOBAL/_PRODUTO NOVO/agents/`
**Files:** 6 agent files + build script + 2 config files (~330KB total)
**Date:** March 13, 2026

### Architecture

A 5-agent + 1 master orchestrator system that generates 13-module Economic Impact Analysis Reports for EB-2 NIW petitions. This is the most technically sophisticated system in the portfolio.

| Agent | Purpose | Size |
|-------|---------|------|
| AGENT_MASTER | Pipeline orchestration, 10-step process | 81.9KB |
| AGENT_01_INTAKE | Document parsing & data extraction | 29.2KB |
| AGENT_02_RESEARCH | NAICS validation & economic research | 33.4KB |
| AGENT_03_CALCULATOR | Economic impact calculations (RIMS II, EPI, BLS) | 22.2KB |
| AGENT_04_BUILDER | DOCX document generation (Node.js) | 27.3KB |
| AGENT_05_QA | Quality assurance & compliance validation | 45.8KB |

Supporting files:
- `build_impacto_universal.js` (35.7KB) - Node.js DOCX generator
- `client_config_luciano.json` (27.1KB) - Example client configuration
- `client_config_template.json` (27.8KB) - Template for new clients

### STRENGTHS

1. **Most rigorous economic methodology.** Uses RIMS II Type II multipliers (the gold standard for regional economic impact analysis), cross-validated against IMPLAN and EPI data. The multiplier selection table in Agent 03 is technically sound:
   - Software Publishers (5112): 1.85 output multiplier
   - Computer Systems Design (5415): 1.72
   - Child Day Care (6244): 1.45
   - Semiconductor Manufacturing (3344): 2.15

2. **13-module report structure is comprehensive.** Covers: Economic Output, Employment Impact, Earnings, Tax Revenue, Supply Chain, Innovation, Government Alignment, Community Integration, Sensitivity Analysis, SROI, Cultural Impact, Combined Impact Summary.

3. **Agent 05 QA is exceptionally thorough.** Implements 4-stage validation (Structural, Data Consistency, Legal Compliance, Evidentiary Quality) with specific JavaScript validation functions. Module sequence verification checks for exact order [1,2,3,4,5,6,7,8,9,11,12,13].

4. **Anti-AI detection measures.** Agent 05 includes evidentiary quality checks for "natural language variation" to avoid AI detection systems. This is practically important for 2026 adjudication.

5. **RFE and Denial letter handling.** Agent 01 includes protocols for extracting verbatim officer objections and mapping them to specific Dhanasar prongs, enabling targeted rebuttal.

6. **Bilingual output (EN + PT-BR).** The system generates reports in both languages, which is operationally useful for Brazilian clients who need to understand the document but submit in English.

### GAPS AND ISSUES

1. **CRITICAL: Agent 03 line 4 contains a terminology error.** It says "suitable for USCIS EB-5 visa adjudication" when the system is designed for EB-2 NIW. EB-5 is the investor visa category. This suggests the calculator agent may have been adapted from an EB-5 system without proper context correction.

2. **Module numbering gap.** The 13 modules skip Module 10. The sequence is 1-9, then jumps to 11, 12, 13. Agent 05 validates for this exact sequence, suggesting it is intentional, but there is no explanation for why Module 10 was removed.

3. **build_impacto_universal.js is 35.7KB but Agent 04 describes a different project structure.** Agent 04 references a `/templates/en/` and `/templates/pt-br/` directory structure that may not exist. The build script would need validation against the actual file system.

4. **No integration with upstream systems.** IMPACTO expects a Business Plan as primary input, but there is no documented handoff from the BP Orquestrador or the EB-2 Strategy prompts. Each system operates in isolation.

5. **RIMS II data requires purchase.** Agent 02 notes that RIMS II data is "available for purchase from BEA," but there is no indication that the organization has purchased current RIMS II data. Without it, the system may use outdated or estimated multipliers.

6. **Sensitivity analysis (M9) references 3 scenarios but provides no calibration methodology.** How conservative/optimistic should the scenarios be? The agent says to "generate conservative, base, and optimistic scenarios" but doesn't specify the variance (e.g., +/-20%? +/-50%?).

---

## CROSS-SYSTEM FINDINGS

### Integration Gaps

1. **No unified data model.** Each system uses its own input format. A client moving from EB-2 Strategy (System 1) -> BP Orquestrador (System 3) -> SaaS Architect (System 4) -> IMPACTO (System 6) must manually re-enter information at each stage.

2. **Missing Business Plan system.** System 3 (BP Orquestrador) files are MISSING from disk. This is the central hub that connects strategy to evidence. Without it, the EB-2 strategy prompts produce content that has nowhere to land.

3. **Inconsistent Dhanasar coverage.** The EB-2 Strategy system covers only Prong 1. The SaaS system covers Prong 1. IMPACTO covers all 3 prongs. The Localizacao system covers Prong 1 with geographic optimization. There is no single system that provides complete Prong 1+2+3 coverage with all the specialized depth of each individual system.

4. **No EB-1A to EB-2 NIW bridge.** Many clients file dual petitions. The EB-1A system (System 2) explicitly says "do not mix strategies," but there is no guidance for the common dual-filing scenario.

### Quality Gradient

From most production-ready to least:
1. **IMPACTO** (System 6) - Most technically rigorous, has executable code, proper agent separation
2. **SaaS Evidence Architect V2** (System 4) - Well-designed, current, strong guardrails
3. **EB-1A Estrategia V1** (System 2 main file) - Solid single-file system, needs RAG files
4. **EB-2 Estrategia** (System 1) - Good prompts but incomplete (Prong 1 only)
5. **Localizacao** (System 5) - Richest data but raw/unpolished, needs major editing
6. **BP Orquestrador** (System 3) - FILES MISSING, cannot evaluate

### Legal Framework Currency

| System | Last Updated | PA-2025-03 Aware? | FY2024 Data? |
|--------|-------------|-------------------|--------------|
| EB-2 Strategy | May 2025 | References Jan 2025 update | No |
| EB-1A Strategy | Dec 2025 | Yes (FY2024 rates) | Yes |
| BP Orquestrador | Unknown | Unknown | Unknown |
| SaaS Architect V2 | Mar 2026 | Implicit | Implicit |
| Localizacao | Jun 2025 | Yes (extensively) | Yes |
| IMPACTO | Mar 2026 | Dhanasar framework | Partial |
