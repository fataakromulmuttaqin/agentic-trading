# Δ-78 Trading Dashboard — Design Specification v2

## 1. Concept & Vision

A **premium 2026 trading command center** — dark, electric, data-rich but surgically clean. Think Bloomberg Terminal meets Apple Vision Pro spatial computing UI. Every pixel earns its place. The aesthetic says "institutional grade" while the UX says "anyone can use it." No clutter, no noise — just signal.

---

## 2. Design Language

### Color Palette (CSS Variables)
```css
--bg-void:        #0A0A0A   /* deep matte black */
--bg-base:        #0D0D12   /* slightly lifted surface */
--bg-elevated:    #141420   /* cards, modals */
--bg-glass:       rgba(255,255,255,0.03) /* glassmorphism panels */

--accent:         #00F5FF   /* electric cyan — primary accent */
--accent-glow:    rgba(0,245,255,0.15)   /* glow halos */
--positive:       #00FFAA   /* neon green — gains, bids */
--negative:       #FF3366   /* soft red — losses, asks */
--warning:        #FFB800   /* amber — alerts */

--text-primary:   #F0F0F5   /* headings, key values */
--text-secondary: #8888AA    /* labels, descriptions */
--text-muted:    #44445A    /* placeholders, disabled */

--border:         rgba(255,255,255,0.06)
--border-active:  rgba(0,245,255,0.3)
```

### Typography
- **Primary**: Inter (Google Fonts) — clean, readable, modern
- **Mono**: JetBrains Mono — prices, numbers, code
- **Scale**: 10px / 12px / 14px / 16px / 20px / 24px / 32px / 48px

### Spatial System
- Base unit: 4px
- Padding: 12px (tight), 16px (normal), 24px (spacious)
- Border radius: 8px (small), 12px (medium), 16px (large), 24px (pill)
- Gaps: 8px (tight), 12px (normal), 16px (loose)

### Motion Philosophy
- Micro-interactions: 150ms ease-out (hover, toggle)
- Layout shifts: 200ms ease-in-out (panel open/close)
- Data updates: subtle pulse/glow (live price ticks)
- No jarring transitions — everything flows

---

## 3. Layout & Structure

### Desktop (≥1024px) — Full Layout
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (56px)  Δ-78 │ BTC $68,372.45 +5.27% │ ... │ 👤   │
├────────┬────────────────────────────────────────────────────┤
│        │  [Metric Cards × 4]                               │
│  SIDE  │ ┌──────────────────────────┬─────────────────┐    │
│  BAR   │ │  CANDLESTICK CHART       │  ORDER BOOK     │    │
│ (64px/ │ │  (60% width)            │  (40% width)   │    │
│  220px)│ └──────────────────────────┴─────────────────┘    │
│        │  [AI AGENT CONTROL CENTER]                         │
│        │  [AI MARKET INSIGHT]                               │
└────────┴────────────────────────────────────────────────────┘
```

### Tablet (768px–1023px)
- Sidebar collapsed to icons only (64px)
- Order book moves below chart
- 2 metric cards per row

### Mobile (<768px)
- Header: Δ-78 logo + BTC price + hamburger
- Bottom nav bar (fixed): Dashboard | Markets | Agents | Insights
- All content stacked vertically
- Chart: full width, 280px height minimum
- Order book: collapsible accordion

---

## 4. Component Inventory

### Header Bar
- Height: 56px
- Background: #0D0D12 with bottom border
- Left: Δ-78 logo mark (gradient cyan-to-purple), "Δ-78" wordmark
- Center: BTC/USD large price (32px mono), green/red change badge
- Right: Pair selector dropdown, notification bell (with dot), LIVE AI badge, avatar

### Sidebar (Desktop)
- Width: 64px collapsed / 220px expanded
- Nav items: icon + label (when expanded)
- Items: Dashboard, Markets, Agents, Insights, History, Settings
- Active state: cyan left border + icon glow + bg highlight
- Collapse toggle at bottom

### Metric Cards (4 cards)
- Glass background with 1px border
- Icon top-left, label, big value, change %
- Live pulse dot for active data
- Hover: subtle glow lift

### Candlestick Chart
- Full-width in chart area
- Timeframe pills: 1m | 5m | 15m | 1H | 4H | 1D | 1W
- Active pill: cyan bg with glow
- Price overlay: large price top-left, change top-right
- LIVE badge: red dot + "LIVE" text
- TradingView branding subtle bottom-right

### Order Book
- Bid side (left): green depth bars, price/size/total columns
- Ask side (right): red depth bars
- Spread indicator center
- Depth bars: horizontal fill from right (asks) or left (bids)

### AI Agent Cards (3 cards)
- Agent name + avatar/icon
- Status badge: ACTIVE (green) / PAUSED (amber) / ERROR (red)
- PnL display: dollar + percentage
- Confidence circle: ring progress indicator
- Strategy name (truncated)
- Actions: Pause/Resume, Edit Strategy, View Details

### AI Market Insight Cards
- 2 cards side by side
- Sentiment indicator (bullish/bearish/neutral)
- Prediction text (1-2 sentences)
- Confidence level bar
- Timestamp

### Mobile Bottom Nav
- Fixed bottom, 64px height
- 4 items: Dashboard, Markets, Agents, Insights
- Active: cyan icon + label
- Inactive: muted icon only

---

## 5. States & Interactions

### Hover States
- Cards: `translateY(-2px)` + shadow glow
- Buttons: brightness increase + subtle scale(1.02)
- Nav items: background fade in

### Active/Pressed States
- Scale down to 0.97
- Instant color change

### Loading States
- Skeleton shimmer animation
- Chart: placeholder bars
- Cards: animated gradient sweep

### Error States
- Red border pulse
- Error icon + message

### Empty States
- Illustrated placeholder
- Helpful CTA button

---

## 6. Technical Approach

- **Framework**: Next.js 14 App Router (React 18)
- **Styling**: Tailwind CSS v3 + CSS custom properties
- **Charts**: lightweight-charts by TradingView (local, no iframe)
- **Icons**: lucide-react
- **Fonts**: Inter (Google Fonts) + JetBrains Mono
- **State**: React useState/useEffect (no external state management needed)
- **Theme**: CSS variables for color tokens, data-theme attribute for dark/light

### File Structure
```
src/
  app/
    globals.css       ← Design tokens, base styles
    layout.tsx        ← Font providers, metadata
    page.tsx          ← Main dashboard (SPA routing)
  components/
    layout/
      Header.tsx       ← Top header bar
      Sidebar.tsx      ← Left sidebar
      BottomNav.tsx    ← Mobile bottom nav
    dashboard/
      MetricCards.tsx  ← 4 stat cards
      ChartArea.tsx    ← Candlestick chart
      OrderBook.tsx    ← Bid/ask ladder
    agents/
      AIPanel.tsx      ← Agent cards grid
      AIInsight.tsx    ← Market insight cards
```

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | <640px | Single column, bottom nav |
| Tablet | 640–1023px | Collapsed sidebar, 2-col cards |
| Desktop | ≥1024px | Full layout, expanded sidebar |
