# BP System V3 - Setup Guide

## What is BP System V3?

BP System V3 is a structured business plan generation system that produces comprehensive, professional business plans for US-based companies. It uses AI to generate 42 sections organized into 6 sequential blocks, assembling them into a publication-ready DOCX document.

## Directory Structure

```
BP_SYSTEM_V3/
|-- SISTEMA_BP.md              # Architecture: 6-block flow, Research Pack, generation pipeline
|-- QUALITY_GATES_BP.md        # 6 quality gates: forbidden content, word count, anti-hallucination, etc.
|-- FORBIDDEN_CONTENT_BP.md    # 12 prohibited terms and replacement rules
|-- FORMATTING_SPEC_BP.md      # Typography, tables, page layout (US Letter, Times New Roman 12pt)
|-- ARCHITECT_BP.md            # System prompt, inviolable rules, context injection pattern
|-- README_BP.md               # This file
|-- global_config_reference.json  # Exported configuration from source system
|-- sections/                  # 42 section .md files with individual system prompts
    |-- 01_S1_sumario_executivo_oportunidade_de_negocio.md
    |-- 02_S2_timeline_do_negocio_resumo.md
    |-- ...
    |-- 42_S40_referencias_e_fontes.md
```

## The 6-Block Sequential Flow

Business plans are generated block-by-block in strict order. Each block's output feeds as context into the next block.

### Block 1: Sumario Executivo (S1-S4)
Foundation: company identity, timeline, vision/mission, legal structure.

### Block 2: Analise Estrategica (S5-S16)
Market analysis, supply chain, SWOT, competitive forces (Porter's Five Forces), ANSOFF matrix.

### Block 3: Marketing Plan (S17-S25)
Segmentation, targeting (B2C/B2B), positioning, 4Ps (product, price, place, promotion), Marketing 4.0.

### Block 4: Operational Plan (S26-S31)
Staff, layout, physical resources, technology, location, production capacity.

### Block 5: Financial Plan (S32-S37)
Financial assumptions, investments, revenue/cost estimates, DRE, ROI indicators, break-even.

### Block 6: Conclusao (S38-S40)
Implementation timeline, final considerations, references/bibliography.

## Research Pack Requirement

Before generating any section, you must assemble a **Research Pack** containing:

1. **Company Data:** Name, legal entity, location(s), founders, SOC code
2. **Market Research:** Industry size, growth rates, trends (from BLS, Census, IBISWorld)
3. **Regulatory Data:** Applicable regulations (OSHA, CDC, HIPAA, state-specific)
4. **Competitive Data:** Real competitor profiles and market positioning
5. **Financial Data:** Pricing, cost structure, salary ranges, investment requirements
6. **Location Data:** Demographics, economic indicators, market density

The Research Pack ensures factual accuracy and prevents hallucination. Every data point in the business plan must trace back to the Research Pack or a verified source.

## How to Use with Petition Engine

### Integration Flow

```
[Petition Engine Case Data]
         |
         v
[Research Pack Assembly]  <-- Automated via Petition Engine
         |
         v
[BP System V3 Generation] <-- 42 sections, 6 blocks
         |
         v
[Quality Gates Validation]
         |
         v
[DOCX Assembly]  <-- generate_bp_v2.py
         |
         v
[Final Business Plan Document]
```

### Step 1: Extract Case Data
From Petition Engine, extract the case profile including:
- Beneficiary professional background
- Company details (name, type, location, industry)
- Business model description
- Target market and service offerings

### Step 2: Assemble Research Pack
Use the extracted data to build the Research Pack:
- Run market research queries for the specific industry and location
- Gather regulatory requirements for the business type
- Identify real competitors in the target market
- Compile financial benchmarks for the industry

### Step 3: Generate Sections
Feed each section's system prompt (from `sections/` files) along with:
- The Research Pack
- Previous sections' output (for context continuity)
- The `observationsInjection` from global config (case-specific notes)

Generate sections sequentially within each block, block-by-block.

### Step 4: Quality Gate Validation
After each section is generated, run through the 6 quality gates:
1. Forbidden content check (automated)
2. Word count validation (automated)
3. Anti-hallucination audit (manual + automated)
4. Table formatting compliance (automated)
5. Structural completeness (automated)
6. Cross-section consistency (after block completion)

### Step 5: DOCX Assembly
Use `generate_bp_v2.py` (or its successor) to assemble all approved sections into the final DOCX document with proper formatting, headers, footers, and table of contents.

## Configuration

### Global Settings
Located in `global_config_reference.json`:
- `prohibitedTerms`: The 12 forbidden terms
- `defaultModel`: AI model for generation
- `defaultLanguage`: Output language (pt-BR default)
- `observationsInjection`: Case-specific notes injected into every section
- `systemPromptRaw`: Base system prompt shared across all sections

### Section-Specific Settings
Each section file in `sections/` contains:
- Section metadata (ID, order, category)
- Complete system prompt with section-specific instructions
- Word count limits and formatting requirements

## Key Rules

1. **Never fabricate data** -- every number must come from the Research Pack or a cited source
2. **Never use prohibited terms** -- see `FORBIDDEN_CONTENT_BP.md`
3. **Maximum 200 words per paragraph** -- break longer paragraphs
4. **Every table needs context** -- introductory and concluding paragraphs required
5. **Sequential generation only** -- blocks must be generated in order (1 through 6)
6. **Document reads as pure business plan** -- for a sophisticated investor audience
