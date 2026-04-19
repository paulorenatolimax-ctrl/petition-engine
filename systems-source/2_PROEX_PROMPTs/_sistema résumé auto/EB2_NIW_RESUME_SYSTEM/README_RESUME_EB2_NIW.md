# EB-2 NIW Résumé Factory — v1.0

## Para subir no Projects do Claude.ai (tudo flat, sem subpastas)

---

## Instruções do Projeto
Colar o conteúdo de `ARCHITECT_RESUME_EB2_NIW.md` no campo "Instruções"

## Arquivos (Knowledge) — 8 arquivos

### Arquivos do Sistema
| # | Arquivo | O que é |
|---|---------|---------|
| 1 | SISTEMA_RESUME_EB2_NIW.md | Arquitetura do sistema (fases, anatomia, regras, diferenças vs EB-1A) |
| 2 | ARCHITECT_RESUME_EB2_NIW.md | System prompt (vai nas Instruções) |
| 3 | TEMPLATE_RESUME_EB2_NIW.md | Template completo das 14 seções com exemplos |
| 4 | FORMATTING_SPEC_RESUME_EB2_NIW.md | Tipografia, cores, layout, timeline, evidence blocks |
| 5 | FORBIDDEN_CONTENT_RESUME_EB2_NIW.md | Proibições absolutas |
| 6 | QUALITY_GATES_RESUME_EB2_NIW.md | 6 gates de validação |
| 7 | PROTOCOLO_INTERACAO_RESUME_EB2_NIW.md | 7 regras invioláveis de comportamento |
| 8 | MAPA_DE_ERROS_RESUME_EB2_NIW.md | Erros reais e potenciais mapeados (anti-padrões) |

### Benchmarks (subir separado — PDFs/DOCX)
- Résumé Derick Araujo Sobral (IT Sales, 20+ anos) — NÃO citar, só estrutura
- Résumé Luiz Lanat Pedreira de Cerqueira Filho (Cirurgia, 36+ anos) — NÃO citar, só estrutura

---

## Setup Rápido

1. Criar Project no Claude.ai → colar ARCHITECT_RESUME_EB2_NIW.md nas Instruções
2. Subir os 8 .md como Arquivos (Knowledge)
3. Subir os 2 DOCX/PDFs de benchmark
4. Iniciar conversa:
   ```
   Novo résumé EB-2 NIW: [NOME DO CLIENTE]
   Proposed Endeavor: [descrição do que fará nos EUA]
   Documentos: [lista ou "vou subir agora"]
   ```

---

## Relação com Outros Sistemas

| Aspecto | Cover Letter EB-2 NIW | Résumé EB-2 NIW | Résumé EB-1A |
|---------|----------------------|-----------------|-------------|
| Função | Argumentação Dhanasar | Inventário profissional | Inventário por critério Kazarian |
| Organização | Prosa por prong | 14 seções profissionais | Seções por critério (C1-C10) |
| Projeto Claude | Separado | Separado | Separado |
| Benchmarks | Cover Letters aprovadas | Derick + Luiz Lanat | Renato + Carlos + Bruno |
| Cross-reference | Obrigatório | Obrigatório (Gate 6) | Obrigatório (Gate 6) |

### Ordem de Produção Recomendada:
1. **PRIMEIRO**: Résumé (inventaria e organiza toda a trajetória profissional)
2. **SEGUNDO**: Cover Letter (argumenta Dhanasar sobre as qualificações inventariadas)
3. **TERCEIRO**: Auditoria cruzada (números, datas, nomes, proposed endeavor IDÊNTICOS)

---

## Comparativo: Estrutura dos 2 Benchmarks

### Derick (20+ anos — IT Sales Executive)
```
1. Header + Contact (1 pg)
2. Summary of Professional Qualifications (2 pg — bullet points quantificáveis)
3. Tools & Software Proficiency (1.5 pg — Salesforce, SAP, Oracle, etc.)
4. Professional Timeline (1 pg — tabela visual colorida)
5. Professional Experience — 6 empresas (20+ pg):
   - Kyndryl/IBM: Role, Key Resp (7), Impacts (4)
   - TIVIT: Role, Key Resp (6), Impacts (3)
   - Oracle: Role, Key Resp (5), Impacts (3)
   - HP Enterprise: Role, Key Resp (5), Impacts (3)
   - Microsoft: Role, Key Resp (6), Impacts (4)
   - Dell Technologies: Role, Key Resp (5), Impacts (3)
6. Academic Background (2 pg — 3 graus com thumbnails)
7. Complementary Courses (4 pg — 15+ certificações)
8. Professional Awards (2 pg — Chairman's Club, Top Producer)
9. Visual Records (2 pg — fotos de eventos, premiações)
10. Professional Affiliations (1 pg)
11. National Impact + Future Objectives (2 pg)
```

### Luiz Lanat (36+ anos — Cirurgião/Preceptor)
```
1. Header + Contact (1 pg)
2. Summary of Qualifications (2 pg — dados clínicos quantificados)
3. Professional Experience — múltiplos hospitais (25+ pg):
   - HGG: Chief Preceptor, 560 residentes, 4000+ cirurgias
   - Hospital Particular: Cirurgião-Chefe
   - Clínica Privada: Fundador
   - [cada um com Key Resp + Impacts detalhados]
4. Academic Background (3 pg — Medicina + Residência + Especialização)
5. Professional Licenses (2 pg — CRM, títulos de especialista)
6. Patents (2 pg — 2 patentes INPI com descrição técnica)
7. Scientific Output (3 pg — artigos, capítulos)
8. Events & Conferences (2 pg)
9. Awards (1 pg)
10. Volunteer Activities (1 pg — missões médicas)
11. Future Strategic Objectives (2 pg)
```

---

## Métricas de Qualidade (O que um bom résumé EB-2 NIW tem)

| Métrica | Mínimo | Ideal | Referência |
|---------|--------|-------|------------|
| Páginas total | 30 | 45-70 | Derick: ~40, Luiz Lanat: ~50 |
| Key Responsibilities por empresa | 5 | 6-8 | Benchmarks: 5-7 |
| Strategic Impacts por empresa | 3 | 4-5 | Benchmarks: 3-5 |
| Certificações listadas | 5 | 10-20 | Derick: 15+ |
| Thumbnails de certificados | 5+ | Todos | Ambos benchmarks: extensivo |
| Timeline visual | Obrigatória | Obrigatória | Derick: tabela colorida |
| Fotos profissionais | 2+ | 5-10 | Derick: ~8 fotos |
| Future Objectives (especificidade) | Genérico | Específico c/ métricas | Ambos: 1-2 páginas detalhadas |
| Consistência numérica | 100% | 100% | Zero contradições |
| Cross-ref com CL | 100% match | 100% match | Zero divergências |

---

## Diferenças-Chave vs. Sistema EB-1A

| Aspecto | EB-1A | EB-2 NIW |
|---------|-------|---------|
| Organização | Por critério Kazarian (C1-C10) | Por seção profissional (14 seções) |
| Evidence Blocks | Criterio-cêntrico (cada evidência → critério) | Empresa-cêntrico (cada empresa → responsibilities + impacts) |
| Timeline | Opcional | OBRIGATÓRIA |
| Tools section | Não tem | OBRIGATÓRIA |
| Proposed Endeavor | Implícito | EXPLÍCITO (seção dedicada + conexões) |
| Volunteer | Não tem seção | Seção dedicada |
| Fotos | Thumbnails de PDFs | Thumbnails + fotos profissionais |
| Tamanho | 25-75 pg | 30-80 pg |

---

*README Résumé EB-2 NIW Factory v1.0 — 22/03/2026*
