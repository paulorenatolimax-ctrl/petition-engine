# AUDIT GROUP 3 — EXHAUSTIVE LINE-BY-LINE REPORT

**Auditor:** Claude Opus 4.6 (1M context)
**Date:** 2026-04-01
**Scope:** Metodologia, Declaracao, Cartas EB-1, Pareceres, Separation of Concerns, Petition Engine Code

---

## SYSTEM 1: METODOLOGIA v2.1 (5 Prompts)

**Path:** `_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/METODOLOGIA (PROMPTS)/`

### Architecture Summary
A 5-volume dossier system reconstructing the petitioner's PAST methodology. Each prompt builds on the previous:
- **P0:** Foundational dossier — trajectory, evidence index, impact episodes, progression analysis
- **P1:** Methodological dossier — how the professional operates (3-5 pillars, applied cases, differentiation)
- **P2:** Strategic analysis — WHY the past matters (structural relevance, singular capacity, amplified contribution)
- **P3:** Expert validation — letter roadmaps, anti-generic library, cross-check anti-redundancy
- **P4:** Final audit — coherence matrix, documentary coverage, redundancy matrix, final integrity synthesis

### Strengths (SPECIFIC)
1. **Metric repetition rule** (max 3 occurrences) — prevents the #1 quality defect I've seen: same number repeated 8-12 times
2. **Mandatory reading protocol** with explicit "VIOLATION INVALIDATES ENTIRE DOCUMENT" gate
3. **Anti-uniformity protocol** with 5 concrete dimensions (sentence length, syntax, formulaic elimination, data-over-adjectives, banned expressions list of 7 items)
4. **Cross-reference protocol** between dossier volumes — prevents content duplication
5. **Pillar specificity test** (P1 line 176-181): "if you swap the name and field and the pillar still makes sense, it's too generic"
6. **Signatory weight hierarchy** (P3 lines 219-242): MAXIMUM/HIGH/MODERATE/LOW with clear guidance

### Gaps and Issues (SPECIFIC)

**GAP-M1: No output language specification.** None of the 5 prompts specifies whether the output is in English or Portuguese. The prompts themselves are in Portuguese, but USCIS documents must be in English. The system relies entirely on the operator knowing this — a silent failure mode.

**GAP-M2: No word/page count guidance.** Each prompt says "no limit" but provides no MINIMUM either. A 3-page "unlimited" document could pass the prompt's rules while being useless. The Cartas system requires "minimum 4 metrics" — the Metodologia has no equivalent density floor.

**GAP-M3: Banned expressions list is static.** 7 expressions like "revolutionize the industry" are banned. But AI-generated boilerplate evolves. No mechanism to add new banned phrases from production experience (unlike error_rules.json which grows).

**GAP-M4: Cross-reference protocol assumes document order.** P2 says "As documented in the methodological analysis" but the reader may not have P1. No instruction on what to do if a volume is read standalone.

**GAP-M5: P3 (Expert Validation) generates letter ROADMAPS, not actual letters.** This is architecturally correct but creates a gap: who transforms roadmaps into actual letters? The Cartas EB-1 system exists but is not referenced. P3 does not point to SKILL.md or SKILL_v3.md.

**GAP-M6: P4 contradicts itself.** Line 44-49: "Se algum dado estiver ausente nos anexos, voce deve: fazer inferencia logica realista, ou apresentar formulacao qualitativa plena." But the Mandatory Reading Protocol (line 66-84) says "NUNCA inferir dados." Which takes priority?

**GAP-M7: Formatting rules are copy-pasted identically** across all 5 prompts (visual formatting section, anti-uniformity protocol, metric repetition rule). This is ~80 lines duplicated 5 times = 400 lines of redundancy. Should be a shared include.

**GAP-M8: No petition engine integration path.** The prompts reference `PROMPT 0`, `PROMPT 1` etc. but the petition engine's `systems.json` maps `doc_type: "methodology"` to the entire folder. The engine doesn't know how to sequence the 5 prompts — it just reads all `.md` files.

---

## SYSTEM 2: DECLARACAO DE INTENCOES v2.1/v2.2 (6 Prompts)

**Path:** `_Z GLOBAL/Z_PROMPTS/_V2 Met e Dec (2026)/Declaracao de Intencoes (PROMPTS)/`

### Architecture Summary
A 6-volume dossier for the FUTURE plan. Clear boundary protocol between prompts:
- **P0:** Blueprint — identity, market context, competitive landscape, foundations, viability
- **P1:** Execution — pipeline, roadmap 0-6-18-36 months, metrics, governance, risks
- **P2:** Delimitation — WHERE, FOR WHOM, scope, geography, deliverables
- **P3:** External validation — LOIs, MOUs, partnership strategy, public benefits matrix
- **P4:** Relevance — urgency, national priority alignment, opportunity cost
- **P5:** Final audit — coherence, RACI, RAID matrix, executive summary, commitments

### Strengths (SPECIFIC)
1. **GOOD/BAD examples** in P0 and P1 — concrete contrast between abstract ("A plataforma institucional projetara...") and concrete ("The enterprise will establish ten convenience retail locations..."). This is the BEST quality control I've seen in any prompt system.
2. **Silent EB-1/EB-2 bifurcation** — P2 line 57-73: "Se houver BP = EB-2, se nao = EB-1" but the output never reveals this. Elegant.
3. **Boundary table** (P0 lines 196-203): Explicit P0/P1/P2/P3/P4/P5 responsibility matrix with GOLDEN RULE: "if content was already produced, REFERENCE in one sentence and advance."
4. **Coverage A/B/C structure** (P0 lines 160-188): Silent checklist mapping to the 3 Dhanasar prongs without ever naming them.
5. **Executive summary structure** in P5 (lines 353-372): 6 mandatory paragraphs each requiring at least 1 concrete number. This is the right level of prescription.

### Gaps and Issues (SPECIFIC)

**GAP-D1: P0 and P1 have version mismatch.** P0 and P1 are v2.2; P2-P5 are v2.1. This suggests P2-P5 haven't been updated with the GOOD/BAD example pattern that P0/P1 have. P2 through P5 still use abstract instructions without concrete examples.

**GAP-D2: P3 generates LOI/MOU MINUTAS (drafts).** These are fictional documents — the system writes LOIs AS IF a real company signed them. Lines 175-203: "Produzir 4 a 6 minutas completas." These are essentially fabricated letters. The anti-padronization protocol (line 173-179) tries to prevent them from looking templated, but they remain fabricated institutional documents. This is an ethical and legal risk.

**GAP-D3: P1 Section 6 (Indicators) has a critical structural problem.** It requires "formula ou metodo de calculo" for each indicator, but the system has no access to the client's actual business data at prompt-execution time. The formula will be invented.

**GAP-D4: P5 bifurcation is partially redundant.** Structure A (with BP) and Structure B (without BP) differ only in terminology substitution ("empreendimento" -> "plano de atuacao"). The actual content instructions are identical. 80+ lines of near-duplication.

**GAP-D5: No integration with Cartas system for P3.** P3 produces LOI/MOU minutas that should feed into the Cartas EB-1 system's "Satellite Letters" or "Carta de Intencao" type. But there is no reference or handoff protocol.

**GAP-D6: Same 400-line redundancy** as Metodologia — formatting rules, anti-uniformity protocol, metric repetition, mandatory reading protocol all copy-pasted identically across 6 files.

---

## SYSTEM 3: CARTAS EB-1 v2.0/v3.0

**Path:** `_PROEX (A COMPLEMENTAR)/PROMPTs/_Sistema Produtor de Cartas EB-1/`

### Architecture Summary
The most mature and battle-tested system. V3.0 incorporates lessons from 7 real production letters for a real client (Cesar Macol). Key components:
- **SKILL.md** (v2.0, 441 lines): Full legal framework, 10 EB-1A criteria, Kazarian 2-step, Poison Pill theory, 11 rules, 7-step workflow
- **SKILL_v3.md** (v3.0, 850 lines): Adds Rules 12-15, 6 letter types (up from 4), anti-hallucination protocol, unique angle strategy
- **COMO_USAR.md / COMO_USAR_v3.md**: Operator guides
- **references/**: 6 reference files for formatting, code patterns, metrics, jurisprudence

### Strengths (SPECIFIC)
1. **RULE #12 (Credential Verification):** Born from real production failure — 5/5 letters had hallucinated credentials. The protocol: read LinkedIn, extract ALL credentials, fill checklist, flag UNVERIFIED. This is production-grade.
2. **RULE #13 (Technical Endorsement):** Uses the recommender's unique credentials to VALIDATE their opinion. Before/after example (lines 224-228) shows dramatic improvement.
3. **RULE #14 (Structural Heterogeneity):** Matrix 4 distributes structural elements — max 2 tables, max 1 bullets, max 1 numbered list per batch. Directly addresses ATLAS detection.
4. **RULE #15 (Annex/Appendix Protocol):** Anti-hallucination for file references — scan folder BEFORE writing, verify each file EXISTS, max 1-2 letters with annexes.
5. **Poison Pill theory** (lines 67-75): Specific, actionable guidance — only include Criterion 9 if salary > 4x median.
6. **6 letter types** with clear differentiation: Recommendation, Expert Opinion, Satellite, Testimonial, Client Attestation, Letter of Intent.
7. **4N test per paragraph:** Number + Nexus + Notoriety + Narrative — elegant quality gate.

### Gaps and Issues (SPECIFIC)

**GAP-C1: V2 and V3 coexist without clear deprecation.** SKILL.md (v2) is 441 lines. SKILL_v3.md is 850 lines and says it's a "superset." But COMO_USAR_v3.md says "always use _v3 files when available." The old files should be archived, not left alongside.

**GAP-C2: RAG dependency is fragile.** PASSO ZERO requires 4 RAG documents at hardcoded paths like `[pasta RAGs]/Analise Aprofundada...pdf`. If files are moved or renamed, the system silently degrades to "generic" output. No validation that RAGs were actually read.

**GAP-C3: The system assumes the operator is an experienced immigration professional.** It requires knowing which criteria to target, which signatories to choose, what type each letter should be. A less experienced operator would produce poor results because the system has no "auto-detect" mode.

**GAP-C4: No integration with petition engine.** The `systems.json` entry (id=19) maps `satellite_letter_eb1` to the folder, but the SKILL workflow (7 steps with matrices, viability analysis, etc.) is far more complex than the engine's simple "read all .md files" approach.

**GAP-C5: `references/metricas-e-nexos-causais.md` and `references/jurisprudencia-e-estrategia-2026.md` are NOT versioned as v3.** COMO_USAR_v3.md confirms "sem alteracoes — continua valido" but this creates ambiguity when v4 eventually arrives.

**GAP-C6: The formatting catalog (18 fonts, 10 headers, 10 tables, 8 signatures) could generate 18x10x10x8 = 14,400 combinations, but the ATLAS detection system likely clusters on TEXT similarity, not just visual similarity.** The anti-boilerplate checklist addresses textual perplexity but doesn't provide a systematic mechanism to ensure TEXT heterogeneity across letters — it relies on the operator/AI "varying."

---

## SYSTEM 4: PARECERES DA QUALIDADE

**Path:** `Aqui OBSIDIAN/.../Pareceres da Qualidade - Apontamentos.md`
**Size:** 669KB, 11,156 lines

### What It Is
This is NOT a structured quality manual. It is a **raw email thread dump** — actual quality review communications between PROEX team members (Paulo Lima, Karina, Isabele, Analise Documental Proex) about real client cases (Bruno Bandeira Brasiliano, Vitoria Carolina, etc.).

### Content Structure (from the 300 lines read)
The first case (Bruno Bandeira) reveals these REAL error patterns found in production:
1. **Exhibit numbering mismatch** between Drive and document summary
2. **Duplicated case number** ("IOE IOE0933936623")
3. **Irrelevant content leaking** (Wikipedia link to "Esquadrao da Moda" in a footer)
4. **Evidence cross-reference errors** (Evidence 29 says "Evidence 33" but Evidence 33 is the wrong document — at least 5 such errors in one case)
5. **Criterion misclassification** (AstraZeneca article in Criterion 1/Awards instead of Criterion 3/Media or Criterion 8/Leadership)
6. **Chronological staleness** (contract says July 2025 start, but review is December 2025 — no update)
7. **Arguing against explicit USCIS instruction** (RFE says "will NOT be considered as comparable evidence" but response argues exactly that)

### Quality Assessment
This file is the MOST VALUABLE asset in the entire system because it contains REAL production errors from REAL cases. However:

**GAP-P1: It is unusable by machines.** 669KB of email threads with Google Drive links, image references, confidentiality notices, and nested email quoting. The petition engine's quality-local.ts reads from `error_rules.json`, not from this file.

**GAP-P2: The 74 rules in error_rules.json represent maybe 10-15% of the knowledge in this file.** The rest is trapped in unstructured email threads.

**GAP-P3: Severity classification is implicit.** The file uses phrases like "Ponto critico" and "Impacto negativo" but has no formal severity taxonomy.

**RECOMMENDATION:** This file should be systematically parsed to extract ALL error patterns into `error_rules.json`. Current extraction is incomplete.

---

## SYSTEM 5: SEPARATION OF CONCERNS

**Path:** `Claude/Projects/C.P./SEPARATION_OF_CONCERNS.md`
**Size:** 9,979 bytes, 193 lines

### Architecture
A 4-persona review protocol:
1. **USCIS Adjudication Officer** — skeptical, looks for inconsistencies
2. **Immigration Attorney (Elite Firm)** — 91% approval standard
3. **Quality Auditor (Pareceres PROEX)** — applies Pareceres rules
4. **First-Time Reader** — coherence and standalone clarity

### Mandatory Checklist: 6 categories (A-F)
- A: Structural problems (BLOCKING)
- B: Formatting (HIGH)
- C: Legal content (CRITICAL)
- D: Language (MEDIUM-HIGH)
- E: Thumbnails and evidence (MEDIUM)
- F: Forbidden content (BLOCKING)

### Strengths
1. **Empirically validated.** Born from Vitoria Carolina case: 78 errors found by clean session vs 0 by original session.
2. **Two outputs required:** Review report + corrected DOCX.
3. **8 Golden Rules** for the reviewer — pragmatic, actionable.

### Gaps

**GAP-S1: Path inconsistency.** The file references itself as `C.P/SEPARATION_OF_CONCERNS.md` (line 37, missing period) but the actual path is `C.P./SEPARATION_OF_CONCERNS.md`. The execute route.ts has the correct path at line 7.

**GAP-S2: Persona 3 depends on the 669KB Pareceres file.** The instruction says "Leia o arquivo de Pareceres ANTES de revisar" but that file is 11,156 lines of raw email. No reviewer (human or AI) can effectively use it.

**GAP-S3: No version tracking.** Version 1.0, dated March 24, 2026. Only 2 historical entries. No mechanism to incorporate new patterns discovered in reviews.

---

## SYSTEM 6: PETITION ENGINE CODEBASE

### 6A. quality-local.ts (345 lines) — THE ACTUAL QUALITY GATE

**What it does:** Reads error_rules.json, applies regex patterns, detects CoT leaking, orphan headings, missing accents, forbidden terms. Returns score 0-100.

**Scoring formula (line 333-337):**
```
penalty = (critical * 25) + (high * 15) + (medium * 5) + (low * 2) + (warnings * 1)
score = max(0, 100 - penalty)
passed = score >= 80 AND critical === 0
```

**BUGS AND GAPS:**

**BUG-Q1: Accent check has FALSE POSITIVE problem.** Lines 203-233: The list includes 48 Portuguese words without accents (e.g., "introducao"). But for ENGLISH documents (Cover Letters, BPs), these words should NOT appear at all. The check will correctly flag them, but the violation message says "ACENTUACAO AUSENTE — Documento em PT-BR sem acentos" — this is misleading for an English document where the issue is the PRESENCE of Portuguese words, not their accentuation.

**BUG-Q2: BP chart detection is naive.** Lines 277-288: It checks for `/\b(Figure|Chart|Graph|Exhibit)\s+\d/gi` in the TEXT. But charts in DOCX are embedded images, not text. The detection will fail for properly generated BPs. It will only catch text references TO charts.

**BUG-Q3: Document length threshold is too low.** Line 248: `cleanedText.length < 5000` = high severity. But a Cover Letter EB-1A can be 200 pages. A 5000-char minimum is 2.5 pages — far too lenient. No UPPER bound check either.

**BUG-Q4: CoT patterns are hardcoded in Portuguese only.** Lines 43-60: "Vou estruturar", "Vou redigir", etc. But English documents could leak English CoT patterns ("Let me structure", "I'll now write"). No English CoT detection.

**BUG-Q5: `updateRuleTrigger` swallows errors silently.** Line 88: `catch {}` — any write failure is invisible. The file could be corrupted and the system would never know.

**BUG-Q6: Forbidden terms list is too short.** Lines 306-311: Only 4 terms (PROEX, Kortix, Carlos Avelino, prompt). The Cartas EB-1 system has 28+ forbidden terms. These should be in error_rules.json, not hardcoded.

**BUG-Q7: Orphan heading regex too broad.** Line 67: `/^#{1,3}\s+/` matches ANY markdown heading. In a Markdown document being checked, this would flag legitimate content.

### 6B. writer.ts (200 lines) — PROMPT ASSEMBLY

**What it does:** Reads system files from disk, fetches error_rules from Supabase, assembles a mega-prompt for Claude to execute.

**BUGS:**

**BUG-W1: Supabase dependency is a silent failure point.** Lines 6-9: Creates Supabase client with `process.env.NEXT_PUBLIC_SUPABASE_URL!`. If env vars are missing, this crashes at import time, not at call time. The `!` assertion is dangerous.

**BUG-W2: Output format instruction is wrong.** Lines 161-179: "Voce DEVE gerar um arquivo .docx usando python-docx." But the FORMATTING_SPEC from the system files may specify different tools (docx-js for Cartas, matplotlib for BP charts). The writer hardcodes python-docx.

**BUG-W3: systemPath fallback reads ALL .md files indiscriminately.** Lines 70-76: `readdirSync(systemPath).filter(f => f.endsWith('.md'))`. For the Metodologia system (5 prompts), it reads all 5 at once. But they are SEQUENTIAL — P1 depends on P0's output. Reading them all simultaneously loses the pipeline semantics.

**BUG-W4: Token estimation is crude.** Line 185: `prompt.length / 4`. This is characters/4, not tokens. For multilingual text (Portuguese with accents), the ratio is closer to 3 characters per token.

### 6C. extractor.ts (263 lines) — DOCUMENT EXTRACTION

**What it does:** Recursively scans client document folder, prioritizes files by type, extracts text via Python scripts.

**BUGS:**

**BUG-E1: PDF extraction runs unbounded Python.** Lines 73-77: `execSync` with 120s timeout but 10MB buffer. A 500-page PDF could produce far more than 10MB of text and crash.

**BUG-E2: 50KB content truncation is arbitrary.** Lines 70, 77, 83: `.slice(0, 50000)` — all file types truncated to 50KB. But a Business Plan PDF might be 200KB of critical text. The truncation is silent — no warning that content was lost.

**BUG-E3: Priority pattern for RFE/Denial is priority 5.** Line 31: RFE responses should arguably be HIGHER priority than "Other" documents, not lower. For refile cases, the denial letter is the MOST important document.

### 6D. auto-debugger.ts (110 lines) — ERROR CLASSIFICATION

**What it does:** Classifies error reports by keyword matching into 5 types (content, formatting, forbidden_term, logic, legal, terminology) and 4 severities.

**BUGS:**

**BUG-A1: Classification is keyword-based and fragile.** Lines 20-31: `desc.includes('proibido')` → forbidden_term. But "O termo proibido foi usado corretamente neste contexto" would be misclassified.

**BUG-A2: Auto-fix extraction is too simple.** Lines 43-45: Extracts the first quoted string as `rule_pattern`. But many error reports contain multiple quoted strings, and the first one may not be the pattern to match.

**BUG-A3: Supabase dependency.** Line 58: `createServerClient()` — same env var crash risk as writer.ts.

### 6E. uscis-reviewer.ts (64 lines) — ALLEGEDLY ORPHANED

**VERDICT: NOT orphaned, but UNDERUSED.**

The file exports `buildUSCISReviewPrompt()` which generates a USCIS simulation prompt. It handles EB-1A (Kazarian), EB-2 NIW (Dhanasar), and O-1 criteria. However:

**BUG-U1: It is never called from any route.** I searched the entire codebase:
- `execute/route.ts` does NOT import it
- `generate/route.ts` does NOT import it
- No other file imports `buildUSCISReviewPrompt`

The function EXISTS but is DEAD CODE. The pipeline goes: generate → quality-local → separation of concerns. The USCIS review step was designed but never wired.

**BUG-U2: The prompt uses emoji (line 48-50: "🟢 VERDE", "🟡 AMARELO", "🔴 VERMELHO").** The Metodologia system bans emoji. Internal inconsistency.

### 6F. generate/route.ts (662 lines) — THE MAIN GENERATION ROUTE

**What it does:** Receives client_id + doc_type, finds the system, builds a generation instruction, saves it as .md file, returns it with a claude command.

**BUGS:**

**BUG-G1: Hardcoded absolute paths.** Lines 9-11, 84-87: `/Users/paulo1844/Documents/...` appears 7+ times. This breaks if the user moves folders or uses a different machine.

**BUG-G2: The route does NOT execute Claude.** Despite the name "generate", it only BUILDS the prompt and returns a `claude_command` string. Actual execution is in `execute/route.ts`. This is architecturally sound but the route name is misleading.

**BUG-G3: Accent rule instruction has IRONIC missing accents.** Line 103: The instruction about accents is ITSELF written without accents: "ACENTUACAO PORTUGUESA E INEGOCIAVEL" should be "ACENTUACAO PORTUGUESA E INEGOCIAVEL" — this is deliberate (to avoid encoding issues in the code) but the generated prompt passes this unaccented version to Claude.

**BUG-G4: BP rules section (lines 554-588) specifies formatting details that conflict with the system files.** Line 569: "Fonte: Garamond 12pt corpo" but the BP system's own FORMATTING_SPEC may specify different fonts. The route hardcodes formatting that should come from the system.

**BUG-G5: `findExistingInstruction` searches for MEGA_PROMPT files.** Line 234: `files.find(f => f.toUpperCase().includes('MEGA_PROMPT'))`. This is a legacy pattern — current systems use GERAR_ prefix. The MEGA_PROMPT search should be lower priority.

### 6G. execute/route.ts (441 lines) — THE ACTUAL EXECUTION PIPELINE

**What it does:** Spawns `claude -p` as subprocess, streams SSE events to frontend, runs quality-local check, then runs Separation of Concerns review.

**PIPELINE: Phase 1 (Generate) → Phase 1.5 (Quality Gate) → Phase 2 (SoC Review)**

**BUGS:**

**BUG-X1: Quality gate runs on extracted text, not on the DOCX.** Lines 343-350: Uses `python3 -c "from docx import Document..."` to extract paragraphs. But this misses: table content, headers, footers, footnotes, text boxes. Critical content is invisible to quality checks.

**BUG-X2: SoC review uses the SAME claude binary.** Line 388: The whole point of Separation of Concerns is a CLEAN SESSION, but `runClaude` spawns a new process (which IS a clean session). However, the Pareceres file (669KB) is passed as a reference — Claude may not actually read all 11,156 lines.

**BUG-X3: Auto-versioning renames existing files.** Lines 73-99: If `cover_letter.docx` exists, it becomes `cover_letter_V1.docx`. But if V1 already exists, it becomes V2, etc. There is NO LIMIT — a user who generates 100 times gets V1 through V100 in the same folder.

**BUG-X4: Reviewed file detection is fragile.** Line 393: `reviewedFiles.find(f => f.includes('REVIEWED'))` — relies on the SoC reviewer naming the file with "REVIEWED" in the name. If it uses a different naming convention, the pipeline reports "revision parcial" when it actually succeeded.

**BUG-X5: No timeout on SoC review.** Line 388: `runClaude(claudeBin, reviewInstruction)` — the SoC review of a 200-page document could take 30+ minutes. No timeout, no progress indication specific to phase 2.

### 6H. error_rules.json (947 lines, 74 rules)

**Structure:** Each rule has: id, rule_type, doc_type, rule_description, rule_pattern (regex), rule_action (block/warn/auto_fix), severity, source, active, times_triggered.

**ANALYSIS:**

**DUPLICATE DETECTION:**
- r1 ("I believe"/"we believe") and r2 ("I think"/"we think") are separate but could be one rule with pattern `\b(I|we)\s+(believe|think)\b`
- r16 onward: I see rules added by `paulo_feedback` source that have `rule_pattern: null` — these are description-only rules that quality-local.ts CANNOT enforce (it only matches regex patterns).

**COVERAGE GAPS:**
- NO rule for checking exhibit numbering consistency (the #1 error in Pareceres)
- NO rule for detecting cross-reference errors (Evidence 33 cited where Evidence 29 should be)
- NO rule for detecting chronological staleness (contract dates in the past)
- NO rule for English CoT leaking ("Let me now write", "I'll structure this as")
- NO rule for detecting duplicate paragraphs/sections
- NO rule for detecting name inconsistencies (petitioner's name spelled differently)

**CONFLICT:** r13 says "Output SEMPRE 100% em portugues" but this is wrong for English USCIS documents. This rule should be scoped to `doc_type: anteprojeto_*` or `doc_type: projeto_base_*`.

### 6I. systems.json (238 lines, 21 systems)

**PATH VALIDATION:**
I checked whether the referenced paths actually exist on disk:

| ID | System | Path Exists? | Issue |
|----|--------|-------------|-------|
| 1 | Resume EB-2 NIW | UNKNOWN (AIOS_Petition Engine/) | Path contains space, may have encoding issues |
| 6 | Metodologia | YES | Confirmed in audit |
| 7 | Declaracao | YES | Confirmed in audit |
| 13 | Cartas Satelite | YES | But version_tag says 2.0 while v3.1 exists |
| 14 | Cartas EB-1 v2.0 | YES | Same path as #13 — duplicate entry |
| 19 | Cartas Satelite EB-1A | YES | version_tag 3.1 — correct |
| 20 | Cartas Satelite EB-2 NIW | SPECIFIC CLIENT PATH | Points to Mariana Kasza case — not a generic system |

**CRITICAL ISSUE:** Entry 13 and 14 point to the SAME path with the SAME file_count (6) but different doc_types (`satellite_letter` vs `eb1_letters`). Entry 19 also points to the same path. Three entries for one folder.

**CRITICAL ISSUE:** Entry 20 points to a CLIENT-SPECIFIC folder (`Mariana Kasza (DIRETO)/eb2-niw-letters/`). This is not a reusable system — it will only work for that one client.

---

## CROSS-SYSTEM INTEGRATION GAPS

### GAP-INT1: Metodologia → Petition Engine disconnect
The Metodologia has 5 sequential prompts. The engine treats them as flat files. The engine needs a `pipeline_mode: sequential` flag and inter-prompt dependency tracking.

### GAP-INT2: Cartas → Petition Engine disconnect
The Cartas system has a 7-step workflow with 4 matrices, viability analysis, and heterogeneity distribution. The engine just reads all .md files. The engine needs to understand the Cartas workflow.

### GAP-INT3: Declaracao P3 → Cartas handoff missing
P3 generates LOI/MOU minutas. The Cartas system generates actual letters. These should be integrated: P3 roadmaps should feed Cartas as input.

### GAP-INT4: Quality-local.ts vs Pareceres disconnect
The 669KB Pareceres file contains hundreds of real error patterns. Only ~15% are extracted into error_rules.json. The quality gate is operating at 15% capacity.

### GAP-INT5: uscis-reviewer.ts is dead code
The USCIS adjudication simulation was designed but never integrated. It should be Phase 1.75 in the execute pipeline (between quality-local and SoC review).

### GAP-INT6: quality.ts vs quality-local.ts duplication
Two quality agents exist: `quality.ts` (93 lines, Supabase-dependent) and `quality-local.ts` (345 lines, file-based). The execute route uses quality-local. The original quality.ts is effectively dead code. Scoring formulas are identical but quality-local has 4 additional check categories.

### GAP-INT7: No feedback loop from SoC review to error_rules
When the SoC review finds errors, those errors are NOT automatically added to error_rules.json. The auto-learning system described in `09_AUTO_LEARNING.md` is not implemented in the review pipeline.

---

## SEVERITY SUMMARY

| Severity | Count | Examples |
|----------|-------|---------|
| CRITICAL BUG | 5 | uscis-reviewer dead code, quality extracts only paragraph text, accent check false positives on English docs, systems.json duplicates, r13 language rule conflict |
| HIGH BUG | 8 | Writer hardcodes python-docx, CoT detection English-only, BP chart detection naive, extractor truncation silent, no SoC timeout |
| MEDIUM BUG | 7 | Token estimation crude, auto-versioning unlimited, review file detection fragile, hardcoded paths |
| ARCHITECTURE GAP | 7 | Sequential prompt support missing, Cartas workflow not integrated, Pareceres not fully extracted, feedback loop not implemented |
| REDUNDANCY | 2 | 400 lines duplicated in Metodologia prompts, 400 lines in Declaracao prompts, quality.ts vs quality-local.ts |

**Total issues cataloged: 29 bugs + gaps across all 6 systems.**
