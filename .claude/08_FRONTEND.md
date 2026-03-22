# 08 — FRONTEND (Antigravity / Gemini)

> **Este arquivo é para o front-end builder (Antigravity/Gemini).** Claude Code NÃO precisa ler este arquivo a menos que esteja implementando componentes React diretamente.

## Design System

### Identidade Visual

- **Tema:** Dark mode premium — backgrounds em preto/cinza escuro, acentos em teal/verde neon
- **Estilo:** Glass morphism sutil, cards com `backdrop-blur`, borders com opacidade, gradients refinados
- **Referência visual:** Inspiration do Petition Flow (Immigration Tracker) — premium, clean, ultra high-tech
- **Fontes:** Inter para UI, Geist Mono para dados/números
- **Ícones:** Lucide React (consistente com shadcn/ui)
- **Animações:** Framer Motion — transições suaves, micro-interações, loading states animados

### Paleta de Cores

```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-card: #1a1a1a;
  --bg-card-hover: #222222;
  --bg-glass: rgba(26, 26, 26, 0.8);

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-medium: rgba(255, 255, 255, 0.1);
  --border-strong: rgba(255, 255, 255, 0.15);

  /* Text */
  --text-primary: #f5f5f5;
  --text-secondary: #a0a0a0;
  --text-muted: #666666;

  /* Accent (Teal/Green) */
  --accent-primary: #2dd4bf;
  --accent-secondary: #14b8a6;
  --accent-glow: rgba(45, 212, 191, 0.15);
  --accent-gradient: linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%);

  /* Status */
  --status-green: #22c55e;
  --status-yellow: #eab308;
  --status-red: #ef4444;
  --status-blue: #3b82f6;

  /* Visa Type Colors */
  --visa-eb1a: #f59e0b;
  --visa-eb2-niw: #8b5cf6;
  --visa-o1: #06b6d4;
  --visa-l1: #ec4899;
  --visa-eb1c: #10b981;
}
```

### Componentes Base (shadcn/ui + customizados)

```
src/components/ui/           ← shadcn/ui base (dark mode variants)
  ├── button.tsx
  ├── card.tsx
  ├── badge.tsx
  ├── dialog.tsx
  ├── dropdown-menu.tsx
  ├── input.tsx
  ├── select.tsx
  ├── table.tsx
  ├── tabs.tsx
  ├── toast.tsx
  ├── tooltip.tsx
  ├── progress.tsx
  ├── skeleton.tsx
  └── command.tsx             ← Command palette (Cmd+K)
```

---

## 5 Telas Principais

### Tela 1: Dashboard (`/`)

**Layout:** Grid responsivo com stats no topo, atividade recente, e gráficos.

```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR │                    HEADER (search + user)         │
│          │──────────────────────────────────────────────────│
│  🏠 Dash │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│  👥 Cli  │  │ 24   │ │ 156  │ │ 94%  │ │ 3    │           │
│  ⚡ Ger  │  │Client│ │ Docs │ │ Qual │ │ Fila │           │
│  ✅ Qual │  └──────┘ └──────┘ └──────┘ └──────┘           │
│  🐛 Err  │                                                  │
│  ⚙️ Sist │  ┌─────────────────┐ ┌────────────────────┐     │
│          │  │ ÚLTIMOS CLIENTES │ │ DOCS GERADOS (7d)  │     │
│          │  │ ┌──────────────┐ │ │  ┌───────────────┐ │     │
│          │  │ │ Maria K.     │ │ │  │   ▄ ▆ █ ▄ ▇  │ │     │
│          │  │ │ EB-2 NIW     │ │ │  │   bar chart   │ │     │
│          │  │ ├──────────────┤ │ │  └───────────────┘ │     │
│          │  │ │ João S.      │ │ │                    │     │
│          │  │ │ EB-1A        │ │ │                    │     │
│          │  │ └──────────────┘ │ └────────────────────┘     │
│          │  └─────────────────┘                              │
│          │                                                   │
│          │  ┌────────────────────────────────────────────┐  │
│          │  │ TIMELINE DE ATIVIDADE                      │  │
│          │  │ 14:32 ✅ Cover Letter EB-1A gerada — Maria │  │
│          │  │ 14:30 ⚡ Qualidade: 96/100 — Maria         │  │
│          │  │ 13:15 📄 Résumé EB-1A v2 — João            │  │
│          │  │ 11:00 🐛 Erro fix: "I believe" removido    │  │
│          │  └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Componentes:**
- `StatsCards.tsx` — 4 cards KPI com números animados (Framer Motion count-up)
- `RecentClients.tsx` — Lista com avatar, nome, visa type badge, último doc
- `DocumentChart.tsx` — Gráfico de barras (Recharts) de docs gerados por dia
- `ActivityTimeline.tsx` — Feed de atividades recentes com ícones e timestamps

**Data:** `GET /api/dashboard/stats` + `GET /api/documents?limit=20`

---

### Tela 2: Clientes (`/clientes`)

**Layout:** Lista filtrável + busca.

```
┌──────────────────────────────────────────────────────┐
│  🔍 Buscar cliente...    [Filtro: Todos ▾] [+ Novo] │
│─────────────────────────────────────────────────────│
│  ┌────────────────────────────────────────────────┐  │
│  │ 👤 Maria Kasza          EB-2 NIW  ● Ativo     │  │
│  │    Tech Entrepreneur     12 docs   94% qual    │  │
│  ├────────────────────────────────────────────────┤  │
│  │ 👤 João Silva           EB-1A     ● Ativo     │  │
│  │    Research Scientist    8 docs    97% qual    │  │
│  ├────────────────────────────────────────────────┤  │
│  │ 👤 Ana Costa            O-1       ● Em espera │  │
│  │    Film Director         3 docs    —           │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**Clicando no cliente → Perfil (`/clientes/[id]`):**

Sistema de **abas (tabs)**:

#### Aba "Dados"
- Formulário editável com todos os campos do cliente
- Informações pessoais, visa type, empresa, SOC code, localização
- Botão "Extrair Perfil" → chama `/api/clients/[id]/extract`

#### Aba "Documentos"
- Grid de documentos gerados para este cliente
- Cada card mostra: tipo, versão, data, score de qualidade (badge verde/amarelo/vermelho), USCIS risk
- Botão de download do DOCX
- Botão "Re-gerar" → abre modal de configuração

#### Aba "Evidências"
- Grid visual de thumbnails das evidências do cliente
- Upload de novos documentos
- Cada evidência: preview, tipo, exhibit number, caption editável

#### Aba "Cartas Satélite"
- Lista de cartas satélite necessárias (extraídas do perfil)
- Status de cada uma: pendente, gerada, aprovada
- Tipo: investor_pj, strategic_partner, academic, employer, etc.

#### Aba "Histórico"
- Timeline completa de atividades do cliente
- Cada entrada: ação, detalhes, timestamp
- Filtros por tipo de ação

**Data:** `GET /api/clients/[id]` (inclui joins com profiles, documents, activity_log)

---

### Tela 3: Gerador (`/gerador`)

**Layout:** Grid de "Product Cards" — cada sistema de geração é um card clicável.

```
┌────────────────────────────────────────────────────────────┐
│  ⚡ GERADOR DE DOCUMENTOS          [Selecionar cliente ▾] │
│────────────────────────────────────────────────────────────│
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ 📄       │ │ 📄       │ │ 📋       │ │ 📊       │     │
│  │ Cover    │ │ Cover    │ │ Résumé   │ │ Business │     │
│  │ EB-1A    │ │ EB-2 NIW │ │ EB-1A    │ │ Plan     │     │
│  │ v5.0     │ │ v3.0     │ │ v1.0     │ │ v2.0     │     │
│  │ Sonnet   │ │ Sonnet   │ │ Sonnet   │ │ Opus     │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ 📝       │ │ 📝       │ │ 🗺️       │ │ 💥       │     │
│  │ Metodo-  │ │ Decla-   │ │ Locali-  │ │ IMPACTO® │     │
│  │ logia    │ │ ração    │ │ zação    │ │ 6 agents │     │
│  │ v2.1     │ │ v2.1     │ │ v1.0     │ │ v2.0     │     │
│  │ Sonnet   │ │ Sonnet   │ │ Gemini   │ │ Opus     │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ 🎯       │ │ 🎯       │ │ ✉️       │ │ 📷       │     │
│  │ Estraté- │ │ Estraté- │ │ Cartas   │ │ Relat.   │     │
│  │ gia EB-1 │ │ gia EB-2 │ │ Satélite │ │ Fotográf.│     │
│  │ v1.0     │ │ v1.0     │ │          │ │          │     │
│  │ Opus     │ │ Opus     │ │ Sonnet   │ │ Sonnet   │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Ao clicar em um card → GenerationModal:**

```
┌─────────────────────────────────────────┐
│  GERAR: Cover Letter EB-1A              │
│─────────────────────────────────────────│
│                                          │
│  Cliente: [Maria Kasza ▾]               │
│  Modelo: [Claude Sonnet 4 ▾]           │
│  Idioma: [Inglês ▾]                    │
│                                          │
│  ☑ Incluir thumbnails de evidências     │
│  ☑ Executar validação de qualidade      │
│  ☑ Simulação de revisão USCIS          │
│                                          │
│  [Configurações avançadas ▾]            │
│                                          │
│         [Cancelar]  [⚡ GERAR]          │
└─────────────────────────────────────────┘
```

**Durante a geração → ProgressLog (inline ou modal):**

```
┌─────────────────────────────────────────┐
│  GERANDO: Cover Letter EB-1A — Maria    │
│─────────────────────────────────────────│
│                                          │
│  ✅ Carregando sistema (v5.0)      2s   │
│  ✅ Montando prompt com perfil     1s   │
│  ✅ Aplicando 12 regras de erro    <1s  │
│  🔄 Chamando Claude Sonnet 4...   45s  │
│  ⏳ Gerando DOCX formatado              │
│  ⏳ Validação de qualidade              │
│  ⏳ Simulação USCIS                     │
│                                          │
│  ████████████░░░░░░░░░░  55%            │
│                                          │
└─────────────────────────────────────────┘
```

**Após conclusão:**

```
┌─────────────────────────────────────────┐
│  ✅ COVER LETTER EB-1A — Maria Kasza    │
│─────────────────────────────────────────│
│                                          │
│  Versão: 3                               │
│  Tempo: 1m 23s                           │
│  Tokens: 78,420                          │
│  Custo: $0.32                            │
│                                          │
│  QUALIDADE: 96/100 ✅                    │
│  ┌──────────────────────────┐           │
│  │ Consistência:     98/100 │           │
│  │ Regras de erro:   100    │           │
│  │ Terminologia:     94/100 │           │
│  │ Formatação:       92/100 │           │
│  └──────────────────────────┘           │
│                                          │
│  USCIS RISK: 🟢 Low Risk               │
│  ┌──────────────────────────┐           │
│  │ C1 Awards:        🟢    │           │
│  │ C2 Membership:    🟡    │           │
│  │ C3 Published:     🟢    │           │
│  │ ...                      │           │
│  └──────────────────────────┘           │
│                                          │
│   [📥 Download DOCX]  [🔄 Re-gerar]    │
└─────────────────────────────────────────┘
```

**Componentes:**
- `ProductCard.tsx` — Card do sistema com ícone, nome, versão, modelo, tooltip com descrição
- `GenerationModal.tsx` — Modal de configuração antes de gerar
- `ProgressLog.tsx` — Log de progresso em tempo real (SSE consumer)
- `QualityReport.tsx` — Relatório de qualidade visual
- `USCISRiskBadge.tsx` — Indicadores verde/amarelo/vermelho por critério

---

### Tela 4: Qualidade (`/qualidade`)

**Layout:** Relatórios agregados de qualidade + drill-down por documento.

```
┌────────────────────────────────────────────────────────┐
│  ✅ QUALIDADE                                          │
│────────────────────────────────────────────────────────│
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ 94%      │ │ 156      │ │ 147      │ │ 9        │ │
│  │ Score    │ │ Total    │ │ Passed   │ │ Failed   │ │
│  │ médio    │ │ docs     │ │ ✅       │ │ ❌       │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ QUALIDADE POR TIPO DE DOCUMENTO                   │ │
│  │                                                    │ │
│  │  Cover EB-1A    ████████████████░░  96%  (42)     │ │
│  │  Cover EB-2     █████████████████░  97%  (38)     │ │
│  │  Résumé         ███████████████░░░  93%  (25)     │ │
│  │  Business Plan  ████████████░░░░░░  88%  (12)     │ │
│  │  Metodologia    █████████████████░  98%  (20)     │ │
│  │  IMPACTO        ██████████████░░░░  91%  (8)      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ DOCUMENTOS COM PROBLEMAS                          │ │
│  │                                                    │ │
│  │  ❌ BP — João Silva — Score: 72 — "I believe"     │ │
│  │  ⚠️ Cover — Ana Costa — Score: 85 — terminology   │ │
│  │  ⚠️ Résumé — Maria — Score: 87 — formatting       │ │
│  └───────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

**Componentes:**
- `QualityDashboard.tsx` — Overview com stats cards e gráficos
- `QualityByType.tsx` — Barras horizontais por tipo de documento
- `ProblematicDocs.tsx` — Lista de documentos abaixo do threshold
- `QualityDetail.tsx` — Drill-down em um documento específico
- `ScoreBadge.tsx` — Badge colorido (verde ≥90, amarelo 80-89, vermelho <80)

---

### Tela 5: Erros & Regras (`/erros`)

**Layout:** Kanban de erros + tabela de regras ativas.

```
┌──────────────────────────────────────────────────────────┐
│  🐛 ERROS & AUTO-APRENDIZADO       [+ Reportar Erro]    │
│──────────────────────────────────────────────────────────│
│                                                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ PENDENTES   │ │ EM ANÁLISE  │ │ RESOLVIDOS  │       │
│  │             │ │             │ │             │       │
│  │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │       │
│  │ │ #47     │ │ │ │ #45     │ │ │ │ #44     │ │       │
│  │ │ "I      │ │ │ │ Wrong   │ │ │ │ Fixed   │ │       │
│  │ │ believe"│ │ │ │ SOC code│ │ │ │ margin  │ │       │
│  │ │ 🔴 crit │ │ │ │ 🟡 high │ │ │ │ 🟢 done │ │       │
│  │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │ REGRAS ATIVAS (42)                    [Filtrar ▾] │   │
│  │────────────────────────────────────────────────────│   │
│  │ Tipo       │ Descrição          │ Sev. │ Ação │ # │   │
│  │────────────┼────────────────────┼──────┼──────┼───│   │
│  │ forbidden  │ Nunca "I believe"  │ 🔴   │ block│127│   │
│  │ forbidden  │ Nunca "we think"   │ 🟠   │ block│ 84│   │
│  │ logic      │ No Dhanasar EB-1A  │ 🔴   │ block│ 23│   │
│  │ terminology│ proposed endeavor  │ 🟡   │ fix  │ 56│   │
│  │ formatting │ Bold headings      │ ⚪   │ warn │ 12│   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  Cada regra tem botões: [Editar] [Desativar] [Rollback]  │
└──────────────────────────────────────────────────────────┘
```

**Componentes:**
- `ErrorKanban.tsx` — Board com 3 colunas drag-and-drop
- `ErrorCard.tsx` — Card de erro individual com severity badge
- `RulesTable.tsx` — Tabela de regras ativas, filtrável, paginada
- `ErrorReportModal.tsx` — Modal para Paulo reportar erro novo (texto livre + select de documento)
- `RollbackButton.tsx` — Botão com confirmação para desativar regra

---

### Tela 6 (bônus): Sistemas (`/sistemas`)

**Layout:** Grid de sistemas instalados com health check.

```
┌────────────────────────────────────────────────────┐
│  ⚙️ SISTEMAS INSTALADOS                            │
│────────────────────────────────────────────────────│
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Cover Letter EB-1A    v5.0    ✅ Conectado   │  │
│  │ 12 arquivos .md       Último scan: 2h atrás  │  │
│  ├──────────────────────────────────────────────┤  │
│  │ Cover Letter EB-2     v3.0    ✅ Conectado   │  │
│  │ 8 arquivos .md        Último scan: 2h atrás  │  │
│  ├──────────────────────────────────────────────┤  │
│  │ IMPACTO® (6 agents)   v2.0    ✅ Conectado   │  │
│  │ 18 arquivos .md       Último scan: 2h atrás  │  │
│  ├──────────────────────────────────────────────┤  │
│  │ Localização            v1.0    ⚠️ 0 arquivos │  │
│  │ Symlink quebrado       [Re-scan]              │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  [🔄 Re-scan Todos]  [🔗 Setup Symlinks]           │
└────────────────────────────────────────────────────┘
```

---

## Sidebar Navigation

```typescript
// src/components/layout/Sidebar.tsx

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Clientes', href: '/clientes' },
  { icon: Zap, label: 'Gerador', href: '/gerador' },
  { icon: CheckCircle, label: 'Qualidade', href: '/qualidade' },
  { icon: Bug, label: 'Erros', href: '/erros' },
  { icon: Settings, label: 'Sistemas', href: '/sistemas' },
];
```

**Sidebar:**
- Colapsável (ícone ↔ ícone + texto)
- Logo "Petition Engine" no topo com accent gradient
- Indicador visual da página ativa (barra lateral teal)
- Badge de notificação no "Erros" (número de erros pendentes)
- Badge de notificação no "Gerador" (itens na fila)

## Header

```typescript
// src/components/layout/Header.tsx
// - Breadcrumb (Dashboard > Clientes > Maria Kasza)
// - Search global (Cmd+K → Command palette)
// - Notificações (bell icon com count)
// - Avatar do operador (Paulo)
```

## State Management (Zustand)

```typescript
// src/lib/store.ts

import { create } from 'zustand';

interface AppState {
  // Cliente selecionado globalmente (para o Gerador)
  selectedClientId: string | null;
  setSelectedClient: (id: string | null) => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Fila de geração (real-time)
  queueCount: number;
  setQueueCount: (n: number) => void;

  // Erros pendentes
  pendingErrorsCount: number;
  setPendingErrorsCount: (n: number) => void;
}
```

## Padrão de Data Fetching (SWR)

```typescript
// Exemplo: usar SWR para data fetching com cache
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

// Em qualquer componente:
const { data, error, isLoading } = useSWR('/api/dashboard/stats', fetcher, {
  refreshInterval: 30000, // refresh a cada 30s
});
```

## SSE Consumer (para geração em tempo real)

```typescript
// src/hooks/useGenerationStream.ts

export function useGenerationStream() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [quality, setQuality] = useState<QualityReport | null>(null);
  const [uscis, setUSCIS] = useState<USCISReview | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startGeneration = async (body: GenerateBody) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value);
      const events = text.split('\n\n').filter(Boolean);

      for (const event of events) {
        const [eventLine, dataLine] = event.split('\n');
        const eventType = eventLine.replace('event: ', '');
        const data = JSON.parse(dataLine.replace('data: ', ''));

        switch (eventType) {
          case 'stage': setStages(prev => [...prev, data]); break;
          case 'quality': setQuality(data); break;
          case 'uscis': setUSCIS(data); break;
          case 'complete': setResult(data); break;
          case 'error': setError(data.message); break;
        }
      }
    }
  };

  return { stages, quality, uscis, result, error, startGeneration };
}
```

## Responsividade

- **Desktop (≥1280px):** Sidebar expandida + conteúdo full width
- **Tablet (768-1279px):** Sidebar colapsada (ícones) + conteúdo full width
- **Mobile (≤767px):** Sidebar em drawer (hamburger menu) + layout stacked

## Performance

- **Lazy loading:** Cada tela carrega seus componentes via `dynamic()` do Next.js
- **Skeleton loading:** Enquanto dados carregam, mostrar skeletons animados
- **Optimistic UI:** Ações como "aprovar documento" atualizam UI imediatamente, revertendo se API falhar
- **Prefetch:** Prefetch de dados das telas adjacentes na navigation

## Idioma

- **TODA a interface em português brasileiro** (labels, botões, mensagens, placeholders)
- Documentos gerados podem ser em inglês ou português (configurável)
- Comentários no código podem ser em inglês
