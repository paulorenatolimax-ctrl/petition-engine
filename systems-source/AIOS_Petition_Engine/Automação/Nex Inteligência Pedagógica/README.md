# Nex Inteligência Pedagógica — Automação de Marketing

Sistema completo de marketing automatizado que opera como uma agência virtual:
gera criativos (imagem + vídeo), publica no Meta Ads, nutre leads e otimiza
campanhas — sem intervenção humana.

## Como Funciona

```
┌─────────────────────────────────────────────────────┐
│                    SISTEMA NEX                       │
│                                                      │
│  ┌─────────────┐    ┌─────────────┐                 │
│  │  CREATIVE    │───→│  MEDIA      │                 │
│  │  DIRECTOR    │    │  BUYER      │                 │
│  │              │    │             │                 │
│  │ Claude + Gem │    │ Meta API v21│                 │
│  └─────────────┘    └──────┬──────┘                 │
│                            │                         │
│  ┌─────────────┐    ┌──────┴──────┐                 │
│  │  LEAD       │    │ PERFORMANCE │                 │
│  │  NURTURE    │    │ ANALYST     │                 │
│  │             │    │             │                 │
│  │ Webhook +   │    │ Cron 08:00  │                 │
│  │ WhatsApp    │    │ Otimiza     │                 │
│  └─────────────┘    └─────────────┘                 │
└─────────────────────────────────────────────────────┘
```

### 4 Agentes

| Agente | Função | Tecnologia |
|--------|--------|------------|
| **Creative Director** | Gera copy (Framework Peirceano), imagens e vídeos | Claude API + Gemini |
| **Media Buyer** | Publica anúncios no Facebook/Instagram | Meta Marketing API v21 |
| **Performance Analyst** | Analisa métricas e otimiza campanhas diariamente | Meta Insights API |
| **Lead Nurture** | Recebe leads, gera relatórios, nutre por WhatsApp | Express + Evolution API + Brevo |

### Funil

```
Ad → Landing Page → Diagnóstico (6min) → Relatório Personalizado →
→ Sequência WhatsApp (7 dias) → Consultoria 30min → Proposta Comercial
```

## Passo a Passo de Instalação

### Pré-requisitos

- Node.js 18+
- Contas configuradas (ver abaixo)

### 1. Clonar/acessar o diretório

```bash
cd "/Users/paulo1844/Documents/AIOS/Automação/Nex Inteligência Pedagógica"
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar o .env

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

#### Anthropic (Claude) — OBRIGATÓRIO
1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Vá em **API Keys** → Create Key
3. Cole em `ANTHROPIC_API_KEY`

#### Google Gemini — Para imagens e vídeos
1. Acesse [aistudio.google.com](https://aistudio.google.com)
2. Clique em **Get API Key**
3. Cole em `GEMINI_API_KEY`

#### Meta Ads — Para publicar anúncios
1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Crie um app do tipo **Business**
3. Em **Graph API Explorer**, gere um token com permissões:
   - `ads_management`
   - `ads_read`
   - `pages_read_engagement`
4. No **Business Manager**, copie o ID da conta de anúncios (`act_XXXXXXXXX`)
5. Copie o ID da página do Facebook
6. Preencha: `META_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`, `META_PAGE_ID`

#### Brevo — Para envio de emails
1. Acesse [app.brevo.com](https://app.brevo.com)
2. Vá em **SMTP & API** → **API Keys**
3. Cole em `BREVO_API_KEY`

#### Evolution API — Para WhatsApp
1. Configure sua instância Evolution API
2. Preencha: `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE`

#### Calendly
1. Crie seu link de agendamento
2. Cole em `CALENDLY_URL`

### 4. Iniciar o sistema

```bash
npm start
```

O sistema irá:
- Iniciar o webhook server na porta 3000
- Ativar os cron jobs (análise diária 08:00, ciclo criativo segunda 06:00)
- Retomar sequências de nutrição pendentes

## Comandos Manuais

```bash
# Gerar criativos agora (copy + imagens + vídeos)
npm run creative

# Publicar criativos mais recentes no Meta Ads
npm run publish-ads

# Executar análise de performance
npm run analyze

# Iniciar apenas o webhook server
npm run webhook
```

## Webhook de Lead

Envie leads para o sistema via POST:

```bash
curl -X POST http://localhost:3000/webhook/lead \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@escola.com.br",
    "escola": "Colégio Exemplo",
    "whatsapp": "5544999999999",
    "respostas": {
      "ppp_atualizado": false,
      "protocolos_inclusao": false,
      "sistema_indicadores": false,
      "decreto_12773": "nao_conhece",
      "ultima_revisao_ppp": "2019",
      "equipe_treinada": "parcialmente"
    }
  }'
```

## Regras de Otimização Automática

| Condição | Ação |
|----------|------|
| CTR < 0.8% por 3 dias | Pausa o anúncio |
| CPL > 3x META_TARGET_CPL | Pausa o conjunto de anúncios |
| CTR > 2.5% | Gera 3 variações do mesmo ângulo |
| Frequência > 3.5 | Dispara ciclo criativo completo novo |

## Estrutura de Pastas

```
├── .env.example          # Template de variáveis de ambiente
├── .env                  # Suas credenciais (não committar!)
├── package.json          # Dependências e scripts
├── index.js              # Orquestrador principal
├── agents/
│   ├── creative-director.js   # Gera criativos (Claude + Gemini)
│   ├── media-buyer.js         # Publica no Meta Ads
│   ├── performance-analyst.js # Analisa e otimiza
│   └── lead-nurture.js        # Webhook + nutrição
├── prompts/
│   ├── peirce-framework.js    # Framework Semiótico Peirceano
│   ├── copy-prompts.js        # 3 ângulos de copy
│   ├── image-prompts.js       # Instruções visuais Gemini
│   ├── video-prompts.js       # Roteiros + prompts Veo
│   └── report-prompts.js      # Relatório personalizado
├── webhooks/
│   └── server.js              # Express server
├── crons/
│   └── scheduler.js           # Cron jobs
├── utils/
│   ├── meta-api.js            # Meta Marketing API wrapper
│   ├── gemini-api.js          # Gemini API wrapper
│   ├── evolution-api.js       # WhatsApp wrapper
│   ├── brevo-api.js           # Email wrapper
│   └── logger.js              # Winston logger
├── output/
│   ├── criativos/             # Imagens, vídeos e copies geradas
│   ├── meta/                  # Mapeamento de ads publicados
│   └── relatorios/            # Relatórios de performance
└── data/
    └── leads.json             # Base de leads
```

## Framework Peirceano

O sistema usa a Semiótica de Charles Sanders Peirce como base para toda
geração de copy. Cada criativo passa por análise semiótica completa:

| Signo | Aplicação no Marketing |
|-------|----------------------|
| **Qualissigno** | Emoções primárias (medo, vergonha, orgulho) |
| **Sinsigno Icônico** | História-âncora de risco real |
| **Sinsigno Indicial Remático** | Perguntas-gatilho de dor |
| **Sinsigno Indicial Dicente** | Evidências e credenciais |
| **Legissigno Indicial** | Urgência por timing escolar |
| **Símbolo Remático** | Metáforas de impacto |
| **Argumento Simbólico** | Cadeia lógica irrefutável |

## 3 Ângulos de Copy

1. **Urgência/Risco Legal** — Disrupção cognitiva, medo de fiscalização
2. **Autoridade/Prova Social** — Credenciais da Kayenne, casos reais
3. **Oferta/Diagnóstico Grátis** — Micro-compromisso, zero risco

## Orçamento

- `META_DAILY_BUDGET`: em centavos (500 = R$5/dia para teste)
- `META_TARGET_CPL`: custo por lead alvo em centavos (5000 = R$50)
- Ads são criados em modo **PAUSED** — ative após revisão

## Suporte

- WhatsApp: (44) 99927-9091
- Site: https://predict-vibe-pro.lovable.app/

---

*Nex Inteligência Pedagógica — Kayenne Cristine Vosgerau da Silva & Paulo Renato Lima*
