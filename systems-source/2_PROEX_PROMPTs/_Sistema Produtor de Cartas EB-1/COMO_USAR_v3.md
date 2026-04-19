# Como Usar o Sistema Produtor de Cartas EB-1 — V3.0 (2026)

## O Que Mudou da V2.0 para a V3.0?

A V3.0 incorpora lições aprendidas da produção real de 7 cartas para um caso EB-1A (Finance Transformation / FP&A). Todas as mudanças foram motivadas por problemas reais encontrados durante a produção.

| Recurso V3.0 | Problema que Resolve | Origem |
|---------------|---------------------|--------|
| Protocolo de Verificação de Credenciais (Regra #12) | 5 de 5 cartas tinham credenciais alucinadas (MBA errado, certificações falsas, títulos inflados) | Produção real: César Maçol |
| Endosso Técnico por Autoridade (Regra #13) | Cartas não aproveitavam as credenciais únicas do recomendador para dar peso ao endosso | Feedback do operador |
| 6 Tipos de Carta (expandido de 4) | Faltavam tipos para Attestação do Cliente e Carta de Intenção Futura | Cartas Andrea Arguello (FMC) e Kayce Coker (Disney) |
| Heterogeneidade Estrutural (Regra #14) | Todas as cartas tinham tabelas — "tá muito uniforme a estrutura" | Feedback direto do cliente |
| Protocolo Anti-Alucinação | IA sistematicamente inventa credenciais, métricas e afiliações | 5/5 cartas com erros graves |
| Estratégia de Ângulos Únicos | Cartas repetiam a mesma perspectiva | Análise do batch final |
| Flexibilidade de Idioma (Regra #4 atualizada) | Regra anterior dizia "100% português" mas caso real exigia inglês | Petição EB-1A nos EUA com recomendadores americanos |
| Protocolo de Logos | Sem orientação para inclusão de logos nas cartas | Necessidade prática |
| Protocolo de Anexos/Apêndices (Regra #15) | Cartas mencionavam resultados sem evidência documental anexa; risco de inventar documentos inexistentes | Produção real: carta Cristiano (AngloGold) com KPI Reports |
| Validação Expandida (7 verificações) | Validação original não checava credenciais, alucinações nem anexos | Erros encontrados pós-geração |
| Termos proibidos expandidos | Lista original incompleta | Revisão jurídica |
| Novos elementos visuais | Apenas tabelas como elemento estrutural | Pull-quotes, value blocks, prose com métricas inline |

## Estrutura de Arquivos V3.0

```
_Sistema Produtor de Cartas EB-1/
├── SKILL.md                                    ← V2.0 (preservado intacto)
├── SKILL_v3.md                                 ← V3.0 (USAR ESTE — inclui todo o V2.0 + melhorias)
├── COMO_USAR.md                                ← V2.0 (preservado intacto)
├── COMO_USAR_v3.md                             ← V3.0 (ESTE ARQUIVO)
└── references/
    ├── formatting-catalog.md                   ← V2.0 (preservado intacto)
    ├── formatting-catalog-v3.md                ← V3.0 (18 fonts → 20, 10 headers → 12, 8 docs → 10, 8 sigs → 10)
    ├── docx-code-patterns.md                   ← V2.0 (preservado intacto)
    ├── docx-code-patterns-v3.md                ← V3.0 (+ logos, pull-quotes, value blocks, smallCaps, attestation closings)
    ├── metricas-e-nexos-causais.md             ← V2.0 (sem alterações — continua válido)
    └── jurisprudencia-e-estrategia-2026.md     ← V2.0 (sem alterações — continua válido)
```

**Regra de ouro:** Sempre use os arquivos `_v3` quando disponíveis. Os arquivos sem sufixo são o V2.0 preservado para referência histórica.

## Como Usar no Cowork (Claude Desktop)

1. Monte esta pasta como diretório de trabalho
2. Diga algo como:
   ```
   Leia o SKILL_v3.md e gere [X] cartas de apoio EB-1A para [NOME].
   Área: [campo]
   Critérios: [3, 5, 8]
   RAGs em: [caminho]

   Signatários:
     1. [Nome, Cargo, Empresa] — recomendação — Profile: [caminho do LinkedIn PDF]
     2. [Nome, Cargo, Empresa] — expert opinion — Profile: [caminho]
     3. [Empresa, Representante] — satélite — Profile: [caminho]
     4. [Nome, Cargo, Empresa] — attestação do cliente — Profile: [caminho]
     5. [Nome, Cargo, Empresa] — carta de intenção — Profile: [caminho]

   Quadro de informações: [caminho do arquivo com dados do caso]
   Logos em: [caminho da pasta com logos]
   ```

3. O Claude lê SKILL_v3.md + RAGs + references V3 e segue o workflow completo
4. **NOVO V3:** O Claude PRIMEIRO verifica credenciais de cada recomendador antes de escrever

## Checklist Antes de Cada Batch (V3.0)

### Dados do Caso
- [ ] Nome completo e área do peticionário
- [ ] RAGs de estratégia disponíveis e informados ao Claude
- [ ] Lista de signatários com cargo, empresa e tipo de carta
- [ ] Critérios que cada carta endereça definidos
- [ ] "Teste da Pílula Venenosa" aplicado no Critério 9
- [ ] Dados quantificáveis (receita, projetos, citações, prêmios)
- [ ] Business plan ou CV do peticionário em mãos
- [ ] Cartas já feitas no batch informadas ao Claude

### NOVO V3: Perfis dos Recomendadores
- [ ] LinkedIn PDF ou CV de CADA recomendador disponível
- [ ] Cada perfil foi lido e credenciais verificadas ANTES de escrever
- [ ] Checklist de credenciais preenchido por recomendador (nome exato, título exato, empresa, educação com escola+grau+ano, certificações verificadas, empregadores anteriores)

### NOVO V3: Planejamento de Heterogeneidade
- [ ] Matriz 3 preenchida (identidade visual única por carta)
- [ ] Matriz 4 preenchida (ângulo único + estrutura narrativa por carta)
- [ ] Máximo 2 cartas com tabelas
- [ ] Pelo menos 1 carta com prose narrativo (sem tabela/bullets)
- [ ] Nenhum elemento estrutural repetido mais de 2x no batch
- [ ] Idioma definido por carta (baseado no recomendador)

### NOVO V3: Validação Pós-Geração
- [ ] Verificação 1 — Técnica (XML válido)
- [ ] Verificação 2 — Conteúdo (zero termos proibidos)
- [ ] Verificação 3 — Qualidade (4+ métricas, cadeias causais, perplexidade)
- [ ] Verificação 4 — Credenciais (cada credencial vs. LinkedIn/CV)
- [ ] Verificação 5 — Heterogeneidade (visual + estrutural + ângulos)
- [ ] Verificação 6 — Scan de Alucinação (claims vs. fontes verificadas)
- [ ] Verificação 7 — Anexos (arquivos existem, max 1-2 cartas, nomes descritivos corretos)

### NOVO V3.1: Protocolo de Anexos/Apêndices
- [ ] Scan completo da pasta de evidências executado (ls -la)
- [ ] Inventário de arquivos disponíveis documentado
- [ ] Avaliação de relevância: qual documento → qual recomendador
- [ ] MAX 1-2 cartas com menção a anexos (heterogeneidade)
- [ ] Nomes profissionais atribuídos: "Anexo [Romano] — [Título Descritivo].[ext]"
- [ ] Cada nome descritivo reflete conteúdo REAL (arquivo foi inspecionado)
- [ ] Texto de menção inserido antes do bloco de assinatura
- [ ] ZERO anexos mencionados que não existam na pasta
- [ ] Mapeamento de rastreabilidade documentado: arquivo_original → Anexo N

## Os 6 Tipos de Carta (V3.0)

| Tipo | Quem Escreve | Tom | Ângulo | Quando Usar |
|------|-------------|-----|--------|-------------|
| **Recomendação** | Colega/supervisor que CONHECE pessoalmente | Pessoal | Experiência compartilhada | Sempre — base do dossiê |
| **Expert Opinion** | Autoridade SEM colaboração direta | Analítico | Independência técnica | Critério 5 (contribuições) |
| **Satélite** | Empresa que QUER parceria/contratação | Empresarial | Demanda de mercado | Step 2 + Critério 5 |
| **Testemunho** | Cliente que RECEBEU serviços | Gratidão corporativa | Resultados mensuráveis | Critérios 5, 8 |
| **Attestação do Cliente** | Sponsor/stakeholder client-side | Formal/quasi-legal | Impacto operacional direto | Critério 8 (papel crítico) |
| **Carta de Intenção** | Executivo de empresa prestigiosa | Convite formal | Fortune 100 quer contratar | Step 2 (o mais poderoso) |

## Compatibilidade

A V3.0 é 100% retrocompatível com a V2.0. Todos os arquivos originais foram preservados intactos. Se por algum motivo precisar reverter, basta usar os arquivos sem sufixo `_v3`.
