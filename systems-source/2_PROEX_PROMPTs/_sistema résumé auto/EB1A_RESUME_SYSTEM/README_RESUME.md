# EB-1A Résumé Factory — v1.0

## Para subir no Projects do Claude.ai (tudo flat, sem subpastas)

---

## Instruções do Projeto
Colar o conteúdo de `ARCHITECT_RESUME_EB1.md` no campo "Instruções"

## Arquivos (Knowledge) — 7 arquivos

### Arquivos do Sistema
| # | Arquivo | O que é |
|---|---------|---------|
| 1 | SISTEMA_RESUME_EB1A.md | Arquitetura do sistema (fases, anatomia, regras) |
| 2 | ARCHITECT_RESUME_EB1.md | System prompt (vai nas Instruções) |
| 3 | TEMPLATE_RESUME.md | Template completo de todas as seções |
| 4 | FORMATTING_SPEC_RESUME.md | Tipografia, cores, layout, evidence blocks |
| 5 | FORBIDDEN_CONTENT_RESUME.md | Proibições absolutas |
| 6 | QUALITY_GATES_RESUME.md | 6 gates de validação |
| 7 | PROTOCOLO_INTERACAO_RESUME.md | 7 regras invioláveis de comportamento |
| 8 | MAPA_DE_ERROS.md | Erros reais mapeados (anti-padrões) |

### Benchmarks (subir separado — PDFs)
- Résumé Renato Silveira (54 páginas) — NÃO citar, só estrutura
- Résumé Carlos Avelino (72 páginas) — NÃO citar, só estrutura
- Résumé Bruno Cipriano (27 páginas) — NÃO citar, só estrutura

---

## Setup Rápido
1. Criar Project no Claude.ai → colar ARCHITECT_RESUME_EB1.md nas Instruções
2. Subir os 8 .md como Arquivos (Knowledge)
3. Subir os 3 PDFs de benchmark
4. Iniciar conversa:
   ```
   Novo résumé: [NOME DO CLIENTE]
   O*Net: [CÓDIGO]
   Critérios: [C1, C3, C5, C8, C9]
   Documentos: [lista ou "vou subir agora"]
   ```

---

## Relação com o Sistema de Cover Letter

| Aspecto | Cover Letter System | Résumé System |
|---------|-------------------|---------------|
| Função | Argumentação jurídica | Inventário de evidências |
| Projeto Claude | Separado | Separado |
| Benchmarks | Cover Letters aprovadas | Résumés aprovados |
| Produção | Produzir DEPOIS do résumé | Produzir ANTES da cover letter |
| Cross-reference | Obrigatório | Obrigatório (Gate 6) |

### Ordem de Produção Recomendada:
1. **PRIMEIRO**: Résumé (inventaria e organiza todas as evidências)
2. **SEGUNDO**: Cover Letter (argumenta juridicamente sobre as evidências já inventariadas)
3. **TERCEIRO**: Auditoria cruzada (números, datas, nomes IDÊNTICOS nos dois documentos)

---

## Comparativo: Estrutura dos 3 Benchmarks

### Renato (54 páginas — Farmacêutico/Influenciador/CEO)
```
1. Header + Contact (1 pg)
2. Summary of Professional Qualifications (2 pg)
3. Impact at Population Scale (1 pg)
4. Awards & Distinctions (2 pg)
5. Corporate Trajectory (1 pg)
6. Scientific Production (1 pg)
7. Media Recognition (1 pg)
8. High Salary (1 pg)
9. Academic Background (1 pg)
10. Professional Licensure (4 pg)
11. Awards — Evidence Blocks (2 pg)
12. Published Material — 8 Evidence Blocks (8 pg)
13. Original Contributions — Evidence Blocks (6 pg)
14. Media — Additional Evidence Blocks (4 pg)
15. IP & Trademarks — 8 registros (6 pg)
16. Scholarly Articles — Evidence Blocks (2 pg)
17. Leading Role — 12 entidades (12 pg)
18. Academic Background — Evidence Blocks (4 pg)
19. Addendum: Impact Narrative (3 pg)
```

### Carlos (72 páginas — Técnico Mecânico/Empreendedor)
```
1. Professional and Technical Career — cronológico (3 pg)
2. Academic Background — certificações (2 pg)
3. Awards — ABRASCI + outros (3 pg)
4. Published Material (varies)
5. Original Contributions (varies)
6. Authorship (varies)
7. Professional Affiliation (varies)
8. Leading Role (varies)
9. High Salary (varies)
```

### Bruno (27 páginas — Segurança Aviação)
```
1. Summary of Qualifications (2 pg)
2. Professional History — timeline (varies)
3. Detailed Role Descriptions (varies)
4. Certifications (varies)
5. Published Articles (varies)
6. Original Contributions (varies)
```

---

## Métricas de Qualidade (O que um bom résumé tem)

| Métrica | Mínimo | Ideal | Benchmark |
|---------|--------|-------|-----------|
| Páginas total | 25 | 40-60 | Renato: 54, Carlos: 72, Bruno: 27 |
| Evidence blocks por critério | 2 | 4-6 | Renato C3: 8 blocks |
| Campos por evidence block | 6 | 8 (todos) | Template: 8 campos |
| Boxes institucionais | 1 por mídia/entidade | Todos | Renato: ~15 boxes |
| Consistência numérica | 100% | 100% | Zero contradições |
| Cross-ref com CL | 100% match | 100% match | Zero divergências |

---

*README Résumé Factory v1.0 — 21/02/2026*
