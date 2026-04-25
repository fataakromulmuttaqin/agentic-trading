# SPEC.md — Δ-78 Agentic Trading Dashboard

## 1. Concept & Vision

**"Trading at the edge of the future."** — A premium institutional-grade trading dashboard that feels like operating a command center from 2030. The interface should evoke the precision of Bloomberg Terminal, the aesthetics of Arc Browser, and the fluidity of Linear — all powered by AI agents that feel alive. Every pixel communicates power, speed, and intelligence. The user should feel like a quant operator, not a retail trader.

## 2. Design Language

### Aesthetic Direction
**Reference:** Apple Design + TradingView 2026 + Linear + Arc Browser. Deep space command center with electric neon accents. Subtle neural network particle ambiance. Glass panels floating over deep backgrounds.

### Color Palette

**Dark Mode (Primary)**
```
--bg-void:       #050508      /* Absolute deepest background */
--bg-base:       #0A0A0F      /* Main background */
--bg-surface:    #111118      /* Card/panel surfaces */
--bg-elevated:   #18181F      /* Elevated elements */
--bg-glass:      rgba(17,17,24,0.7)  /* Glassmorphism panels */
--border:        rgba(255,255,255,0.06)
--border-active: rgba(0,240,255,0.25)

--accent-cyan:   #00F0FF     /* Primary accent — electric cyan */
--accent-lime:   #39FF14     /* Secondary — lime green (bullish/positive) */
--accent-purple: #A855F7     /* Tertiary — deep purple (AI/agent) */
--accent-rose:   #FF3B6B     /* Negative/bearish */
--accent-amber:  #FFB800     /* Warning/pending */

--text-primary:  #F4F4F5
--text-secondary:#A1A1AA
--text-muted:    #52525B
```

**Light Mode**
```
--bg-void:       #F8F8FC
--bg-base:       #FFFFFF
--bg-surface:    #F4F4F6
--bg-elevated:   #EEEEF2
--bg-glass:      rgba(255,255,255,0.75)
--border:        rgba(0,0,0,0.08)
--border-active: rgba(0,240,255,0.4)

--accent-cyan:   #0099FF
--accent-lime:   #22C55E
--accent-purple: #9333EA
--accent-rose:   #E11D48
--accent-amber:  #F59E0B

--text-primary:  #09090B
--text-secondary:#52525B
--text-muted:    #A1A1AA
```

### Typography
- **Display/Headings:** Inter (700-900 weight) — clean, modern, highly legible
- **Body:** Inter (400-500 weight)
- **Monospace/Data:** JetBrains Mono — prices, numbers, code, logs
- **Font scale:** 10px / 12px / 14px / 16px / 20px / 24px / 32px / 48px

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- Border radius: 6px (small), 10px (medium), 16px (large), 24px (xl)
- Panel gaps: 8px (tight), 12px (default), 16px (loose)

### Motion Philosophy
- **Duration:** 150ms (micro), 250ms (standard), 400ms (emphasis)
- **Easing:** cubic-bezier(0.22, 1, 0.36, 1) — smooth deceleration
- **Entrance:** fade + translateY(8px) → 0, staggered 50ms between items
- **Hover:** scale(1.02) + shadow lift, 150ms
- **Active:** scale(0.98), 100ms
- **Theme toggle:** 400ms cross-fade between dark/light
- **LIVE pulse:** subtle glow animation, 2s infinite

### Visual Assets
- **Icons:** Lucide React — consistent 1.5px stroke, 20px default size
- **Decorative:** CSS-only neural network particle background (subtle), gradient orbs
- **Glass effect:** backdrop-filter blur(20px) + semi-transparent bg + subtle border

## 3. Layout & Structure

### Desktop (1280px+) — Full Command Center

```
┌─────────────────────────────────────────────────────────────────┐
│  TOP NAV — floating glass bar, 56px height                     │
├──────┬──────────────────────────────────────────┬───────────────┤
│      │                                          │               │
│ LEFT │         MAIN CHART AREA                   │  RIGHT PANEL  │
│ SIDE │         (dominant, ~60% width)           │  (orderbook   │
│ BAR  │                                          │   + trades)  │
│ 64px │                                          │  320px       │
│      │                                          │               │
│      ├──────────────────────────────────────────┤               │
│      │  BOTTOM FLOATING AI PANEL (collapsible)  │               │
│      │  200px expanded                          │               │
└──────┴──────────────────────────────────────────┴───────────────┘
```

### Tablet (768px–1279px)
- Sidebar collapses to icon-only (48px)
- Right panel becomes bottom sheet
- Chart full width

### Mobile (<768px)
- No sidebar — hamburger menu drawer
- Chart full width
- Orderbook/trades as tabs in bottom sheet
- AI panel as expandable bottom sheet

## 4. Features & Interactions

### Top Navigation Bar
- Logo animates on hover (subtle glow pulse)
- Asset selector: click opens searchable dropdown with real-time prices
- Live price flashes green/red on change with 200ms color transition
- Notification bell: red dot badge when signals > 0
- "3 Agents Live" pill: purple glow, pulses subtly
- Theme toggle: sun/moon icon, 400ms transition, persists to localStorage

### Left Sidebar
- Icons + text, 220px expanded, 64px collapsed
- Active item: cyan left border + cyan text + subtle bg
- Hover: bg lighten, scale 1.02
- Collapse button at bottom with rotate animation
- Tooltip on collapsed state

### Chart Area
- TradingView-style candlestick chart (lightweight-charts library)
- Timeframe pills: active = filled cyan, inactive = ghost outline
- Floating toolbar: indicators, drawing tools, compare, fullscreen
- Volume bars below candlesticks
- Crosshair with price/time tooltip
- Price line at current price with cyan glow
- Neural particle background (CSS animated, very subtle)
- "LIVE" indicator top-right with pulsing red dot

### Right Panel
- **Order Book tab:** Ladder view with depth bars, spread displayed
- **Trades tab:** Time & sales tape, price ladder
- Tab switcher with sliding indicator
- Depth visualization bars behind prices

### AI Agent Panel
- Collapsible (click header or toggle button)
- 3 agent cards in a row (horizontal scroll on mobile)
- Each card: avatar/icon, name, status badge, P&L, confidence meter
- Action buttons: Pause (outline), Edit Strategy (ghost), View Performance (filled)
- "Deploy New Agent" button — opens modal
- "Pause All Agents" — toggle with confirmation
- "AI Market Insight" — expandable insight card with probability %

### Global
- All interactive elements have hover/active/focus states
- Loading states: skeleton shimmer animation
- Error states: rose border + error icon
- Toast notifications bottom-right, auto-dismiss 5s

## 5. Component Inventory

### `<TopNav>`
States: default, search-open, notification-open, dropdown-open
Contains: Logo, AssetSelector, GlobalTicker, NotificationBell, AgentPill, UserMenu, ThemeToggle

### `<Sidebar>`
States: expanded, collapsed, mobile-drawer
Contains: NavItems list, collapse toggle
NavItems: icon + label, active indicator

### `<ChartArea>`
States: loading (skeleton), loaded, error, fullscreen
Contains: PriceChart, TimeframePills, ChartToolbar, VolumePanel, LiveIndicator, ParticleBackground

### `<RightPanel>`
States: orderbook-active, trades-active
Contains: TabSwitcher, OrderBook, TradesTape

### `<AIPanel>`
States: expanded, collapsed, loading-agents
Contains: AgentCards, DeployButton, PauseAllButton, AIInsightCard

### `<AgentCard>`
States: active, paused, loading, error
Contains: Avatar, Name, StatusBadge, PnLDisplay, ConfidenceBar, ActionButtons

### `<ThemeToggle>`
States: dark (moon icon), light (sun icon)
Animation: icon morphs + background color transition

## 6. Technical Approach

### Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v3 + CSS custom properties (design tokens)
- **Components:** shadcn/ui (Button, DropdownMenu, Tabs, Tooltip, Sheet/Drawer, Skeleton, Toast)
- **Charts:** lightweight-charts (TradingView's open-source library)
- **State:** React useState/useContext (no heavy state management needed)
- **Theme:** next-themes for dark/light mode with CSS variables

### File Structure
```
src/
├── app/
│   ├── page.tsx                    # Redirects to /dashboard
│   ├── layout.tsx                  # Root layout with theme provider
│   ├── globals.css                 # Design tokens, base styles, animations
│   └── dashboard/
│       └── page.tsx                # Main dashboard page
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── layout/
│   │   ├── TopNav.tsx
│   │   ├── Sidebar.tsx
│   │   ├── RightPanel.tsx
│   │   └── AIPanel.tsx
│   ├── dashboard/
│   │   ├── ChartArea.tsx
│   │   ├── AssetSelector.tsx
│   │   ├── OrderBook.tsx
│   │   ├── TradesTape.tsx
│   │   ├── AgentCard.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── AIInsightCard.tsx
│   └── providers/
│       └── ThemeProvider.tsx
├── lib/
│   ├── utils.ts                    # cn() helper
│   └── constants.ts                 # MOCK data, config
└── hooks/
    └── useTheme.ts
```

### Design Tokens (CSS Variables)
All colors, spacing, typography defined as CSS custom properties in globals.css, switched via `[data-theme="light"]` / `[data-theme="dark"]` attribute on `<html>`.

### Responsive Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px
