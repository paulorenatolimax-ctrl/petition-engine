# MEGA PROMPT — DESIGN ULTRA-PREMIUM FUTURISTA

## INSTRUÇÕES ABSOLUTAS
- Leia este arquivo INTEIRO antes de executar qualquer coisa
- NÃO perguntar nada. Executar bloco por bloco.
- O objetivo é transformar o Petition Engine de um template genérico em um produto visualmente IMPRESSIONANTE
- Referência visual: Immigration Tracker (capturas de tela serão descritas abaixo)
- Este prompt é para o Claude Code executar no projeto petition-engine

---

# ═══════════════════════════════════════
# REFERÊNCIA VISUAL: IMMIGRATION TRACKER
# ═══════════════════════════════════════

O Immigration Tracker é o padrão de qualidade visual. Ele tem:

## Elementos visuais que DEVEM ser replicados:
1. **TEXTURA**: Fundo NÃO é flat/sólido. Tem noise/grain texture overlay sutil (CSS noise pattern)
2. **PROFUNDIDADE**: Cards com múltiplas camadas de sombra, borda sutil, backdrop-blur
3. **NEON GLOW**: Accent color (#00eaff / cyan) com glow effect (box-shadow com blur alto)
4. **TIPOGRAFIA FORTE**: Títulos em caixa alta, letter-spacing: 2-4px, font-weight: 800
5. **GRADIENTES**: Não flat colors — usar gradientes sutis nos backgrounds
6. **BARRA DE PROGRESSO ANIMADA**: Com glow effect pulsante
7. **ACHIEVEMENTS/BADGES**: Sistema de conquistas com ícones locked/unlocked
8. **TIMELINE VISUAL**: Fases com círculos conectados por linhas, "VOCÊ ESTÁ AQUI" marker
9. **SIDEBAR RICA**: Com elementos visuais, não só texto
10. **CARDS COM PERSONALIDADE**: Cada card tem ícone colorido, bordas sutis, hover com glow
11. **CALENDÁRIO**: Widget integrado com design dark
12. **TAGS COLORIDAS**: "CLIENTE", "CONSULTOR", "EQUIPE" com cores distintas
13. **ÍCONES HEXAGONAIS**: Conquistas em formato hexagonal com gradiente

## Paleta de cores (extraída do tweakcn/Immigration Tracker):
- Background: #05090f (quase preto azulado)
- Card background: #0a1320 (azul escuríssimo)
- Card foreground: #e2e8f0
- Primary: #00eaff (cyan neon)
- Primary foreground: #05090f
- Secondary: #15253a (azul profundo)
- Accent: #00eaff15 (cyan com 8% opacidade)
- Border: #1e3a5f (azul escuro sutil)
- Muted: #0e1a2b
- Muted foreground: #4b6584
- Destructive: #ff4757 (vermelho neon)
- Warning: #ffa502 (laranja neon)
- Success: #2ed573 (verde neon)
- Info: #00eaff
- Ring: #00eaff

---

# ═══════════════════════════════════════
# BLOCO 1: globals.css — DESIGN SYSTEM COMPLETO
# ═══════════════════════════════════════

## Arquivo: src/app/globals.css (SOBRESCREVER COMPLETAMENTE)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

/* ═══════════════════════════════════════
   DESIGN SYSTEM — PETITION ENGINE
   Futuristic Dark Premium with Neon Accents
   ═══════════════════════════════════════ */

:root {
  /* Core colors */
  --bg-void: #03060a;
  --bg-deep: #05090f;
  --bg-primary: #080d16;
  --bg-card: #0a1320;
  --bg-card-hover: #0d1828;
  --bg-elevated: #101e30;
  --bg-input: #0c1624;

  /* Borders */
  --border-subtle: rgba(0, 234, 255, 0.06);
  --border-default: rgba(0, 234, 255, 0.12);
  --border-strong: rgba(0, 234, 255, 0.25);
  --border-glow: rgba(0, 234, 255, 0.4);

  /* Text */
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-tertiary: #4b6584;
  --text-muted: #2a3f5f;

  /* Neon Accent (Cyan) */
  --neon: #00eaff;
  --neon-dim: #00c4d6;
  --neon-glow: 0 0 20px rgba(0, 234, 255, 0.3), 0 0 40px rgba(0, 234, 255, 0.1);
  --neon-glow-strong: 0 0 15px rgba(0, 234, 255, 0.4), 0 0 30px rgba(0, 234, 255, 0.2), 0 0 60px rgba(0, 234, 255, 0.1);
  --neon-glow-text: 0 0 10px rgba(0, 234, 255, 0.5);
  --neon-bg: rgba(0, 234, 255, 0.06);
  --neon-bg-hover: rgba(0, 234, 255, 0.1);
  --neon-bg-strong: rgba(0, 234, 255, 0.15);

  /* Status colors (neon variants) */
  --success: #2ed573;
  --success-glow: 0 0 15px rgba(46, 213, 115, 0.3);
  --warning: #ffa502;
  --warning-glow: 0 0 15px rgba(255, 165, 2, 0.3);
  --danger: #ff4757;
  --danger-glow: 0 0 15px rgba(255, 71, 87, 0.3);
  --info: #00eaff;
  --purple: #a855f7;
  --purple-glow: 0 0 15px rgba(168, 85, 247, 0.3);

  /* Layout */
  --sidebar-width: 260px;
  --sidebar-collapsed: 72px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 234, 255, 0.05);
  --shadow-elevated: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 234, 255, 0.08);
  --shadow-modal: 0 16px 64px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 234, 255, 0.1);
}

/* Reset */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-void);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  height: 100vh;
}

/* ═══ NOISE TEXTURE OVERLAY ═══ */
body::before {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  background-repeat: repeat;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.4;
}

/* ═══ SCROLLBAR ═══ */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(0, 234, 255, 0.15);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 234, 255, 0.3);
}

/* ═══ ANIMATIONS ═══ */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes glow-pulse {
  0%, 100% { box-shadow: var(--neon-glow); }
  50% { box-shadow: var(--neon-glow-strong); }
}
@keyframes neon-breathe {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
@keyframes scan-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes progress-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(0, 234, 255, 0.4), 0 0 16px rgba(0, 234, 255, 0.2); }
  50% { box-shadow: 0 0 12px rgba(0, 234, 255, 0.6), 0 0 24px rgba(0, 234, 255, 0.3); }
}
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.animate-fadeInUp { animation: fadeInUp 0.4s ease-out both; }
.animate-fadeIn { animation: fadeIn 0.3s ease-out both; }
.animate-slideIn { animation: slideInLeft 0.3s ease-out both; }
.animate-glow { animation: glow-pulse 3s ease-in-out infinite; }
.animate-breathe { animation: neon-breathe 3s ease-in-out infinite; }

/* ═══ FOCUS ═══ */
*:focus-visible {
  outline: 2px solid var(--neon);
  outline-offset: 2px;
}

/* ═══ INPUTS ═══ */
input, select, textarea {
  font-family: 'Inter', sans-serif;
  background: var(--bg-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}
input:focus, select:focus, textarea:focus {
  border-color: var(--neon);
  box-shadow: 0 0 0 3px rgba(0, 234, 255, 0.1);
}
input::placeholder, textarea::placeholder {
  color: var(--text-muted);
}

/* ═══ UTILITY CLASSES ═══ */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: all 0.2s ease;
}
.card:hover {
  border-color: var(--border-default);
  box-shadow: var(--shadow-elevated);
}
.card-glow:hover {
  border-color: var(--border-glow);
  box-shadow: var(--neon-glow), var(--shadow-elevated);
}

.neon-text {
  color: var(--neon);
  text-shadow: var(--neon-glow-text);
}

.section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--neon);
  text-shadow: var(--neon-glow-text);
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1.5px;
  color: var(--text-primary);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.badge-neon {
  background: var(--neon-bg-strong);
  color: var(--neon);
  border: 1px solid rgba(0, 234, 255, 0.2);
}
.badge-success {
  background: rgba(46, 213, 115, 0.1);
  color: var(--success);
  border: 1px solid rgba(46, 213, 115, 0.2);
}
.badge-warning {
  background: rgba(255, 165, 2, 0.1);
  color: var(--warning);
  border: 1px solid rgba(255, 165, 2, 0.2);
}
.badge-danger {
  background: rgba(255, 71, 87, 0.1);
  color: var(--danger);
  border: 1px solid rgba(255, 71, 87, 0.2);
}
.badge-purple {
  background: rgba(168, 85, 247, 0.1);
  color: var(--purple);
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, var(--neon) 0%, var(--neon-dim) 100%);
  color: var(--bg-void);
  border: none;
  padding: 10px 24px;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}
.btn-primary:hover {
  box-shadow: var(--neon-glow-strong);
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-ghost:hover {
  border-color: var(--neon);
  color: var(--neon);
  background: var(--neon-bg);
}

/* ═══ PROGRESS BAR NEON ═══ */
.progress-bar {
  height: 6px;
  background: var(--bg-elevated);
  border-radius: 3px;
  overflow: visible;
  position: relative;
}
.progress-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--neon-dim) 0%, var(--neon) 100%);
  animation: progress-glow 2s ease-in-out infinite;
  position: relative;
  transition: width 0.5s ease;
}
.progress-fill::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--neon);
  box-shadow: var(--neon-glow-strong);
}

/* ═══ TABLE STYLES ═══ */
.table-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
  transition: all 0.15s ease;
}
.table-row:hover {
  background: var(--neon-bg);
}

/* ═══ MONOSPACE (for prompts/code) ═══ */
.mono {
  font-family: 'JetBrains Mono', monospace;
}

/* ═══ HEXAGONAL BADGE (achievements) ═══ */
.hex-badge {
  width: 48px;
  height: 48px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hex-badge-active {
  background: linear-gradient(135deg, var(--neon) 0%, var(--neon-dim) 100%);
}
.hex-badge-locked {
  background: var(--bg-elevated);
  opacity: 0.4;
}

/* ═══ GRADIENT BORDER EFFECT ═══ */
.gradient-border {
  position: relative;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(0, 234, 255, 0.3), transparent 40%, transparent 60%, rgba(168, 85, 247, 0.2));
  z-index: -1;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  padding: 1px;
}
```

---

# ═══════════════════════════════════════
# BLOCO 2: SIDEBAR FUTURISTA
# ═══════════════════════════════════════

## Arquivo: src/components/Sidebar.tsx (SOBRESCREVER COMPLETAMENTE)

A sidebar DEVE ter:
- Logo "PETITION ENGINE" com tipografia forte (caixa alta, letter-spacing)
- Ícone do logo com gradient e glow
- Links de navegação com indicador neon ativo (barra lateral esquerda com glow)
- Hover com glow sutil
- Seção inferior com versão + status do sistema
- Collapsible com animação suave
- Border-right com gradiente sutil

Manter a estrutura de links atual (Dashboard, Clientes, Gerador, Sistemas, Regras de Erro, Qualidade) mas com o visual do Immigration Tracker.

Ícones: usar SVG inline com stroke=var(--neon) quando ativo, stroke=var(--text-tertiary) quando inativo.

Na seção inferior, adicionar:
```
PETITION ENGINE v1.0
● Sistema Online | 10 sistemas | 96 regras
```
Com o "●" em verde pulsante (animate-breathe).

---

# ═══════════════════════════════════════
# BLOCO 3: DASHBOARD FUTURISTA
# ═══════════════════════════════════════

## Arquivo: src/app/page.tsx (SOBRESCREVER COMPLETAMENTE)

O dashboard DEVE ter:

### Header
- "DASHBOARD" em caixa alta, letter-spacing: 3px, cor neon com text-shadow
- Subtítulo "Visão geral do Petition Engine" em texto secundário

### 4 Stat Cards (grid 4 colunas)
- Background: var(--bg-card)
- Borda com gradient-border effect
- Ícone hexagonal com cor temática
- Label em caixa alta, letter-spacing, tamanho 11px
- Valor em 36px bold com letter-spacing negativo
- Indicador de tendência (↑ 12% vs semana passada)
- Hover: glow do card inteiro com box-shadow neon

### Gráfico de Atividade (se possível, ou placeholder visual)
- Card com background gradiente sutil
- Grid lines em cor muted
- Área preenchida com gradiente translúcido do neon

### Dois cards inferiores lado a lado:
1. "CLIENTES POR VISTO" — barras horizontais com cores distintas por visto, labels em caixa alta
2. "STATUS DO MOTOR" — lista de métricas com valores neon/warning/success conforme estado

### Cada card deve ter:
- Título seção em `section-title` (11px, uppercase, letter-spacing, neon)
- Borda sutil com var(--border-subtle)
- Hover que aumenta levemente a luminosidade
- Animação fadeInUp escalonada (delay de 50ms por card)

---

# ═══════════════════════════════════════
# BLOCO 4: GERADOR FUTURISTA
# ═══════════════════════════════════════

## Arquivo: src/app/gerador/page.tsx (MELHORAR, NÃO SOBRESCREVER LÓGICA)

Manter toda a lógica que já funciona (fetch systems, fetch clients, modal, generate).
Apenas trocar o visual para:

- Grid de sistemas: cards com gradient-border, ícone hexagonal, hover com glow
- Seletor de cliente: select estilizado com borda neon no focus
- Modal de geração: background blur forte, card com shadow-modal, borda gradient
- Área do prompt: fundo JetBrains Mono, borda neon sutil, highlight de regex
- Botão "COPIAR PROMPT" em btn-primary com glow
- Barra de metadata: badges com neon-bg para sistema, tokens, rules

---

# ═══════════════════════════════════════
# BLOCO 5: CLIENTES FUTURISTA
# ═══════════════════════════════════════

## Arquivo: src/app/clientes/page.tsx (MELHORAR VISUAL)

- Header com "CLIENTES" em section-title style
- Botão "+ NOVO CLIENTE" em btn-primary
- Lista de clientes: cada linha é um table-row com avatar (iniciais), nome, visto (badge colorido), status (dot pulsante)
- Hover: background neon sutil
- Modal de novo cliente: gradient-border, inputs com glow no focus
- Campo docs_folder_path com ícone de pasta e descrição helper

---

# ═══════════════════════════════════════
# BLOCO 6: REGRAS DE ERRO FUTURISTA
# ═══════════════════════════════════════

- Manter lógica existente
- Cards de stats no topo com valores neon/warning
- Tabela com table-row, badges de severidade com cores neon
- Toggle ON/OFF com glow verde/vermelho
- Filtros com selects estilizados
- Cada regra violada: highlight vermelho com danger-glow

---

# ═══════════════════════════════════════
# BLOCO 7: LAYOUT COM SIDEBAR
# ═══════════════════════════════════════

## Arquivo: src/app/layout.tsx (VERIFICAR)

Garantir que o layout usa:
- Sidebar à esquerda (width: var(--sidebar-width))
- Main content com marginLeft: var(--sidebar-width)
- Overflow: auto no main
- Background: var(--bg-void) no body

---

# ═══════════════════════════════════════
# BLOCO 8: EFEITOS ESPECIAIS
# ═══════════════════════════════════════

Adicionar estes efeitos ao projeto:

### 8.1 — Scan line (linha horizontal que passa de cima a baixo periodicamente)
```css
/* Adicionar ao body::after */
body::after {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, var(--neon) 50%, transparent 100%);
  opacity: 0.03;
  animation: scan-line 8s linear infinite;
  pointer-events: none;
  z-index: 9998;
}
```

### 8.2 — Gradient glow no topo de cada página
Adicionar um div no topo de cada page com:
```css
.page-glow {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(0, 234, 255, 0.08) 0%, transparent 70%);
  pointer-events: none;
}
```

### 8.3 — Animated grid background (sutil)
```css
.grid-bg {
  background-image:
    linear-gradient(rgba(0, 234, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 234, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

---

# ═══════════════════════════════════════
# BLOCO 9: VERIFICAÇÃO VISUAL
# ═══════════════════════════════════════

Depois de aplicar tudo:

```bash
npx next build 2>&1 | tail -10
npm run dev
```

Abrir http://localhost:3000 e verificar:
- [ ] Fundo com textura noise visível (não flat preto)
- [ ] Sidebar com logo neon, links com glow no hover
- [ ] Dashboard com cards que brilham no hover
- [ ] Cores neon (#00eaff) presentes em todo lugar
- [ ] Tipografia forte: títulos uppercase com letter-spacing
- [ ] Progress bars com glow pulsante
- [ ] Inputs com borda neon no focus
- [ ] Modal com backdrop-blur e shadow forte
- [ ] Scan line sutil passando pela tela

```bash
git add -A
git commit -m "DESIGN: Visual ultra-premium futurista com textura, neon, glow e tipografia forte

- Noise texture overlay no body
- Paleta cyberpunk: #05090f/#0a1320/#00eaff
- Neon glow effects em cards, botões, progress bars
- Tipografia uppercase com letter-spacing para títulos
- Scan line animada e grid background
- Gradient borders nos cards
- JetBrains Mono para áreas de código/prompt
- Sidebar com logo neon e status do sistema"

git push origin main
```

---

# FIM DO MEGA PROMPT DESIGN
# Resultado: Visual à altura do Immigration Tracker — textura, neon, glow, profundidade.
