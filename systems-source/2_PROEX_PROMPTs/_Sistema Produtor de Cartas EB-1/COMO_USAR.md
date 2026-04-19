# Como Usar o Sistema Produtor de Cartas EB-1 — V2.0 (2026)

## O Que É Isso?

Conjunto de instruções (prompts) que ensina qualquer modelo de IA (Claude, GPT, etc.) a gerar cartas de apoio profissionais para petições EB-1A, EB-1B e EB-1C. As cartas são visualmente heterogêneas, juridicamente blindadas, repletas de métricas quantificáveis com cadeias causais, e incorporam inteligência dos melhores escritórios de imigração do mundo (WeGreened, Manifest Law, Lison Bee) + jurisprudência atualizada de 2026 (Mukherji v. Miller).

## Estrutura de Arquivos

```
_Sistema Produtor de Cartas EB-1/
├── SKILL.md                               ← Instruções principais (o "cérebro" — leia primeiro)
├── COMO_USAR.md                           ← Este arquivo
└── references/
    ├── formatting-catalog.md              ← 18 fonts, 10 headers, 10 tabelas, 8 assinaturas
    ├── docx-code-patterns.md              ← Código Node.js/docx-js com helpers e exemplos
    ├── metricas-e-nexos-causais.md        ← Framework de métricas, cadeias causais, benchmarks por área
    └── jurisprudencia-e-estrategia-2026.md ← NOVO: Mukherji, Pílula Venenosa, elite firms, RFEs por IA
```

## Pré-Requisito OBRIGATÓRIO: RAGs de Estratégia

O sistema exige a leitura de 4 documentos de estratégia EB-1 ANTES de produzir qualquer carta. Esses RAGs contêm jurisprudência AAO, padrões de aprovação/negação, estratégias de elite firms, e dados atualizados 2026. Sem eles, as cartas serão genéricas.

Os RAGs típicos são:
1. Análise de Critérios de Aprovação e Negação EB-1 (2023-2025) `.pdf`
2. O que os Oficiais Esperam Ver em uma Petição EB-1A `.pdf`
3. Pesquisas de Escritórios de Elite `.pdf`
4. Atualização de Dados EB-1 2026 `.docx`

**Informe ao Claude o caminho dos RAGs na primeira mensagem.**

## Como Usar no Cowork (Claude Desktop)

1. Monte esta pasta como diretório de trabalho
2. Diga algo como:
   ```
   Preciso de [X] cartas de apoio EB-1A para [NOME].
   Área: [campo]
   Critérios: [3, 5, 8]
   RAGs em: [caminho]
   Signatários:
     1. [Nome, Cargo, Empresa] — recomendação
     2. [Nome, Cargo, Empresa] — expert opinion
     3. [Empresa, Representante] — satélite
   ```
3. O Claude lê SKILL.md + RAGs + references e segue o workflow completo

## Como Usar no Claude Code (Terminal)

1. Coloque esta pasta no diretório do projeto ou referência como skill
2. Execute: `claude "Leia o SKILL.md e gere cartas EB-1A para [caso]. RAGs em [caminho]"`
3. O Claude Code gera scripts Node.js e produz os .docx automaticamente

## Como Usar em Qualquer Chat (Claude.ai, API, GPT)

1. Copie o SKILL.md como system prompt ou primeira mensagem
2. Cole os dados do caso + conteúdo dos RAGs (ou peça para ler os arquivos)
3. Peça para gerar — o modelo segue o workflow

## O que a V2.0 Traz de Novo

| Recurso | Descrição |
|---------|-----------|
| Leitura obrigatória de RAGs | Passo Zero — sem RAGs, sem cartas |
| Mukherji v. Miller | Step 2 declarado ilegal; estratégia jurídica atualizada |
| "Pílula Venenosa" | Teste formal de viabilidade do Critério 9 (salário) |
| Defesa anti-IA | Otimização para leitura por máquina (contra RFEs alucinados) |
| Estratégias de elite | WeGreened, Manifest Law, Lison Bee — absorvidas |
| Divisão 40/60 | Arquitetura detalhada da Petition Letter |
| 4 Ns por parágrafo | Número + Nexo + Notoriedade + Narrativa |
| Dados Q3 FY2025 | EB-1A 66.6%, NIW 54%, EB-1C 97.6% |
| Gold Card awareness | I-140G e impacto potencial nas cotas |
| Flexibilizações | Prêmios de equipe, mídia, associações pretéritas |

## Checklist Antes de Cada Batch

- [ ] Tenho nome completo e área do peticionário?
- [ ] RAGs de estratégia disponíveis e informados ao Claude?
- [ ] Lista de signatários com cargo, empresa e tipo de carta?
- [ ] Defini quais critérios cada carta endereça?
- [ ] Apliquei o "Teste da Pílula Venenosa" no Critério 9?
- [ ] Tenho dados quantificáveis (receita, projetos, citações, prêmios)?
- [ ] Business plan ou CV do peticionário em mãos?
- [ ] Se há cartas já feitas no batch, informei ao Claude?

## Universal Para Qualquer Cliente

Funciona para qualquer campo: TI, engenharia, pesquisa, artes, saúde, negócios, educação, esportes. O framework de métricas tem benchmarks para áreas comuns, e o modelo pesquisa dados adicionais quando necessário.
