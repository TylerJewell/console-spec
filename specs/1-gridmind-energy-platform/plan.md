# Implementation Plan: GridMind Energy Platform

## Technical Context

| Aspect | Decision | Source |
|--------|----------|--------|
| Framework | React 19 + Vite | UI-SPEC.md |
| Routing | TanStack Router (file-based) | UI-SPEC.md |
| Server State | TanStack Query | UI-SPEC.md |
| Forms | TanStack Form | UI-SPEC.md |
| Styling | Tailwind CSS 4 + HeroUI | UI-SPEC.md |
| Testing | Vitest + Testing Library | UI-SPEC.md |
| Fonts | Instrument Sans Variable, Roboto Mono Variable | UI-SPEC.md |
| Icons | Lucide React (wrapped) | research.md R-10 |
| Theme | next-themes + HeroUI dark mode | research.md R-4 |
| Toast | sonner | UI-SPEC.md |
| Data Layer | In-memory MockDataEngine | research.md R-1 |
| Package Manager | pnpm | UI-SPEC.md |

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Design system compliance | PASS | All components use UI-SPEC.md tokens, colors, patterns |
| Light/dark theme parity | PASS | HeroUI theme config with full light/dark token sets |
| No external dependencies for data | PASS | All mock, in-memory |
| Responsive layout | PASS | Sidebar drawer on mobile, grid layouts |
| Accessibility baseline | PASS | Semantic HTML, keyboard nav, ARIA labels on icon buttons |

---

## Implementation Phases

### Phase 1: Project Scaffolding & Design System Foundation

**Goal**: Working Vite app with Tailwind/HeroUI theme, root layout, and navigation shell.

| # | Task | Files | Depends On | FR |
|---|------|-------|------------|-----|
| 1.1 | Initialize Vite + React + TypeScript project | `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html` | -- | -- |
| 1.2 | Install dependencies (TanStack Router/Query/Form, HeroUI, Tailwind, next-themes, sonner, lucide-react) | `package.json`, `pnpm-lock.yaml` | 1.1 | -- |
| 1.3 | Configure Tailwind CSS with HeroUI plugin and full theme (copy color tokens from UI-SPEC) | `tailwind.config.ts`, `src/index.css` | 1.2 | FR-9.1-9.4 |
| 1.4 | Set up theme provider (next-themes) and HeroUI provider | `src/main.tsx`, `src/providers/ThemeProvider.tsx` | 1.3 | FR-9.1-9.2 |
| 1.5 | Create root layout with sidebar + main content grid | `src/routes/__root.tsx`, `src/components/Layout.tsx` | 1.4 | FR-8.1, FR-8.6 |
| 1.6 | Build Header component (logo, theme dropdown, mobile hamburger) | `src/components/Header.tsx`, `src/components/ThemeDropdown.tsx` | 1.5 | FR-8.5, FR-9.1 |
| 1.7 | Build PrimaryNav sidebar with full navigation tree | `src/components/PrimaryNav/` | 1.5 | FR-8.1-8.4 |
| 1.8 | Create Icon wrapper module (lucide-react -> IconComponentType) | `src/components/Icons/` | 1.2 | FR-8.4 |
| 1.9 | Set up TanStack Router with route tree generation | `src/routeTree.gen.ts`, route files (stubs) | 1.5 | -- |
| 1.10 | Set up TanStack Query provider | `src/providers/QueryProvider.tsx` | 1.2 | -- |

**Gate**: App renders with sidebar navigation, theme toggle works, all route stubs accessible.

---

### Phase 2: Mock Data Engine

**Goal**: Complete in-memory data layer with all entities, generators, and refresh timers.

| # | Task | Files | Depends On | FR |
|---|------|-------|------------|-----|
| 2.1 | Define all TypeScript types and enums | `src/types/` (one file per domain) | 1.1 | Section 4 entities |
| 2.2 | Build MockDataEngine core class (store, getters, event emitter) | `src/mock/engine.ts` | 2.1 | FR-11.1 |
| 2.3 | Grid sector generator (5 sectors, telemetry fluctuation) | `src/mock/generators/grid.ts` | 2.2 | FR-11.2, FR-11.4 |
| 2.4 | Grid event generator (realistic events per sector) | `src/mock/generators/grid.ts` | 2.3 | FR-2.4 |
| 2.5 | Trade order generator (50-100 orders, status distribution) | `src/mock/generators/trading.ts` | 2.2 | FR-11.3 |
| 2.6 | Portfolio position calculator (computed from orders) | `src/mock/generators/trading.ts` | 2.5 | FR-3.5 |
| 2.7 | Forecast generator (24h x 4 types x 5 regions) | `src/mock/generators/forecasting.ts` | 2.2 | FR-11.7 |
| 2.8 | Anomaly generator (weighted severity distribution) | `src/mock/generators/anomalies.ts` | 2.2 | FR-11.6 |
| 2.9 | Asset generator (30-50 assets, health scores) | `src/mock/generators/assets.ts` | 2.2 | FR-11.5 |
| 2.10 | Work order generator (10-20 orders linked to assets) | `src/mock/generators/assets.ts` | 2.9 | FR-6.9 |
| 2.11 | Dispatch plan generator (3-5 plans with units) | `src/mock/generators/dispatch.ts` | 2.9 | FR-7.1 |
| 2.12 | Agent status generator (6 fixed records) | `src/mock/generators/agents.ts` | 2.2 | FR-1.9 |
| 2.13 | Interval-based refresh timers for all domains | `src/mock/engine.ts` | 2.3-2.12 | FR-11.9 |
| 2.14 | Event notification hooks (anomaly detected, order filled, etc.) | `src/mock/engine.ts` | 2.13 | FR-10.4 |
| 2.15 | TanStack Query hooks for all API functions | `src/hooks/` (one file per domain) | 2.2, 1.10 | -- |

**Gate**: All `useQuery` hooks return populated data. Console-logging confirms refresh intervals fire.

---

### Phase 3: Shared UI Components

**Goal**: Reusable components matching UI-SPEC patterns, ready for page composition.

| # | Task | Files | Depends On | FR |
|---|------|-------|------------|-----|
| 3.1 | PageHeader component (title, subtitle, icon, actions) | `src/components/PageHeader.tsx` | 1.8 | Every page |
| 3.2 | MetricCard component (label, value, color accent) | `src/components/MetricCard.tsx` | 1.3 | FR-1.1-1.7 |
| 3.3 | StatusIndicator component (color dot + label + animation) | `src/components/StatusIndicator.tsx` | 1.3 | FR-2.2, FR-6.4 |
| 3.4 | StatusChip component (enum-to-color mapping wrapper around HeroUI Chip) | `src/components/StatusChip.tsx` | 1.3 | FR-3.4, FR-5.5 |
| 3.5 | DataTable component (Table with skeleton, error, empty states) | `src/components/DataTable/` | 1.3 | FR-10.1-10.3 |
| 3.6 | FilterBar component (dropdowns + apply/clear) | `src/components/FilterBar.tsx` | 1.3 | FR-3.2, FR-4.4 |
| 3.7 | DescriptionList component (key-value pairs, boxed/floating) | `src/components/DescriptionList.tsx` | 1.3 | FR-2.3, FR-3.5 |
| 3.8 | Breadcrumbs component | `src/components/Breadcrumbs.tsx` | 1.3 | FR-8.8 |
| 3.9 | NoticeBanner component (severity-colored inline alert) | `src/components/NoticeBanner.tsx` | 1.3 | FR-5.6 |
| 3.10 | Modal wrapper (HeroUI Modal with form support) | `src/components/Modal.tsx` | 1.3 | FR-5.7 |
| 3.11 | Toast setup (sonner Toaster in root, pushToast utility) | `src/components/Toast.tsx`, root layout | 1.3 | FR-10.4-10.5 |
| 3.12 | FormInput, FormSelect, FormTextarea, FormLabel, FormErrors | `src/components/Form/` | 1.3 | FR-3.7, FR-5.8 |
| 3.13 | EmptyState component (icon + message) | `src/components/EmptyState.tsx` | 1.3 | FR-10.3 |

**Gate**: Each component renders correctly in both light/dark themes. Storybook-style manual verification.

---

### Phase 4: Dashboard Page

**Goal**: Fully functional dashboard with metric cards, recent anomalies table, and agent status grid.

| # | Task | Files | Depends On | FR |
|---|------|-------|------------|-----|
| 4.1 | Dashboard page component | `src/routes/index.tsx` | 3.1, 3.2, 3.5 | FR-1.1 |
| 4.2 | Grid frequency metric card with color thresholds | In DashboardPage | 2.15, 3.2 | FR-1.2 |
| 4.3 | Portfolio P&L metric card (green/red) | In DashboardPage | 2.15, 3.2 | FR-1.3 |
| 4.4 | Forecast accuracy metric card with badge | In DashboardPage | 2.15, 3.2 | FR-1.4 |
| 4.5 | Active anomalies metric card (severity-colored) | In DashboardPage | 2.15, 3.2 | FR-1.5 |
| 4.6 | Fleet health score metric card | In DashboardPage | 2.15, 3.2 | FR-1.6 |
| 4.7 | Dispatch cost metric card | In DashboardPage | 2.15, 3.2 | FR-1.7 |
| 4.8 | Recent anomalies table (5 rows) | In DashboardPage | 2.15, 3.4, 3.5 | FR-1.8 |
| 4.9 | Agent status cards grid | In DashboardPage | 2.15, 3.3 | FR-1.9 |
| 4.10 | Auto-refresh with refetchInterval | In DashboardPage | 2.15 | FR-1.10 |

**Gate**: Dashboard displays all 6 metrics, anomalies table, and agent cards. Data refreshes live.

---

### Phase 5: Grid Monitoring Pages

**Goal**: Grid overview with sector cards and sector detail pages.

| # | Task | Files | Depends On | FR |
|---|------|-------|------------|-----|
| 5.1 | Grid layout route | `src/routes/grid.tsx` | 1.9 | -- |
| 5.2 | Grid overview page (sector cards grid) | `src/routes/grid/index.tsx` | 2.15, 3.3 | FR-2.1-2.2 |
| 5.3 | Sector card component (status, frequency, load bar) | `src/components/SectorCard.tsx` | 3.3 | FR-2.2 |
| 5.4 | Sector detail page (description list + event table) | `src/routes/grid/$sectorId.tsx` | 2.15, 3.5, 3.7 | FR-2.3-2.6 |
| 5.5 | Live telemetry refresh | In sector pages | 2.15 | FR-2.7 |

**Gate**: Overview shows 5 sector cards with live status. Clicking a sector shows detail with event log.

---

### Phase 6: Energy Trading Pages

**Goal**: Orders table with filters, positions summary, and new order form.

| # | Task | Files | Depends On | FR |
|---|------|-------|------------|-----|
| 6.1 | Trading layout route | `src/routes/trading.tsx` | 1.9 | -- |
| 6.2 | Orders page (filterable, sortable table) | `src/routes/trading/orders.tsx` | 2.15, 3.4, 3.5, 3.6 | FR-3.1-3.4 |
| 6.3 | Positions page (description list + P&L) | `src/routes/trading/positions.tsx` | 2.15, 3.7 | FR-3.5-3.6 |
| 6.4 | New order form page (TanStack Form, validation) | `src/routes/trading/new-order.tsx` | 2.15, 3.11, 3.12 | FR-3.7-3.10 |

**Gate**: Can filter/sort orders, view positions, submit new orders with validation and toast feedback.

---

### Phase 7: Forecasting Pages

**Goal**: Four forecast sub-pages with tables, filters, and accuracy badges.

| # | Task | Files | Depends On | FR |
|---|------|-------|------------|-----|
| 7.1 | Forecasting layout route | `src/routes/forecasting.tsx` | 1.9 | -- |
| 7.2 | Shared ForecastTable component (reused across 4 pages) | `src/components/ForecastTable.tsx` | 3.4, 3.5, 3.6 | FR-4.2-4.6 |
| 7.3 | Demand forecast page | `src/routes/forecasting/demand.tsx` | 7.2, 2.15 | FR-4.1 |
| 7.4 | Solar forecast page | `src/routes/forecasting/solar.tsx` | 7.2, 2.15 | FR-4.1 |
| 7.5 | Wind forecast page | `src/routes/forecasting/wind.tsx` | 7.2, 2.15 | FR-4.1 |
| 7.6 | Price forecast page | `src/routes/forecasting/price.tsx` | 7.2, 2.15 | FR-4.1 |

**Gate**: All four forecast pages display tables with accuracy badges. Region and time filters work.

---

### Phase 8: Anomaly Detection Pages

**Goal**: Active/Resolved/All anomaly views with detail modal and resolution form.

| # | Task | Files | Depends On | FR |
|---|------|-------|------------|-----|
| 8.1 | Anomalies layout route | `src/routes/anomalies.tsx` | 1.9 | -- |
| 8.2 | Shared AnomalyTable component | `src/components/AnomalyTable.tsx` | 3.4, 3.5, 3.9 | FR-5.4-5.6 |
| 8.3 | Anomaly detail modal with resolution form | `src/components/AnomalyDetailModal.tsx` | 3.7, 3.10, 3.11, 3.12 | FR-5.7-5.9 |
| 8.4 | Active anomalies page | `src/routes/anomalies/active.tsx` | 8.2, 8.3, 2.15 | FR-5.1 |
| 8.5 | Resolved anomalies page | `src/routes/anomalies/resolved.tsx` | 8.2, 2.15 | FR-5.2 |
| 8.6 | All anomalies page | `src/routes/anomalies/all.tsx` | 8.2, 8.3, 2.15 | FR-5.3 |

**Gate**: All three views filter correctly. Modal opens, resolution form saves, toast confirms.

---

### Phase 9: Asset Management Pages

**Goal**: Asset inventory, detail with breadcrumbs, work orders, and health overview.

| # | Task | Files | Depends On | FR |
|---|------|-------|------------|-----|
| 9.1 | Assets layout route | `src/routes/assets.tsx` | 1.9 | -- |
| 9.2 | Asset inventory page (table with health chips) | `src/routes/assets/inventory.tsx` | 2.15, 3.3, 3.4, 3.5 | FR-6.1-6.5 |
| 9.3 | Asset detail page (breadcrumbs, description list, related tables) | `src/routes/assets/inventory/$assetId.tsx` | 2.15, 3.7, 3.8, 3.5 | FR-6.6-6.8 |
| 9.4 | Work orders page (table + create modal) | `src/routes/assets/work-orders.tsx` | 2.15, 3.4, 3.5, 3.10, 3.12 | FR-6.9-6.11 |
| 9.5 | Health overview page (card grid by asset type) | `src/routes/assets/health.tsx` | 2.15, 3.2 | FR-6.12 |

**Gate**: Can browse assets, view detail with breadcrumbs, create work orders, see health overview cards.

---

### Phase 10: Dispatch Optimization Pages

**Goal**: Dispatch plan tables, merit order detail, and plan creation flow.

| # | Task | Files | Depends On | FR |
|---|------|-------|------------|-----|
| 10.1 | Dispatch layout route | `src/routes/dispatch.tsx` | 1.9 | -- |
| 10.2 | Active plans page | `src/routes/dispatch/active.tsx` | 2.15, 3.4, 3.5 | FR-7.1, FR-7.3-7.4 |
| 10.3 | Plan history page | `src/routes/dispatch/history.tsx` | 2.15, 3.4, 3.5 | FR-7.2 |
| 10.4 | Plan detail page (metadata + merit order table) | `src/routes/dispatch/$planId.tsx` | 2.15, 3.3, 3.4, 3.5, 3.7 | FR-7.5-7.8 |
| 10.5 | New plan page (form + review + approve) | `src/routes/dispatch/new.tsx` | 2.15, 3.5, 3.11, 3.12 | FR-7.9-7.12 |

**Gate**: Can create dispatch plan, review units in merit order, approve plan with toast feedback.

---

### Phase 11: Event Notifications & Polish

**Goal**: Wire up live toast notifications, view transitions, and cross-cutting polish.

| # | Task | Files | Depends On | FR |
|---|------|-------|------------|-----|
| 11.1 | Wire MockDataEngine events to toast notifications | `src/routes/__root.tsx` | 2.14, 3.11 | FR-10.4-10.5 |
| 11.2 | Add view transitions CSS for page navigation | `src/index.css` | 1.3 | UI-SPEC 2.8 |
| 11.3 | Mobile responsive testing and drawer polish | Existing layout files | 1.5-1.7 | FR-8.6-8.7 |
| 11.4 | Loading skeleton states for all tables (verify) | Existing table components | 3.5 | FR-10.1 |
| 11.5 | Empty state messages for filtered views (verify) | Existing page components | 3.13 | FR-10.3 |
| 11.6 | Accessibility pass (ARIA labels, focus management, keyboard nav) | All components | All phases | FR-9.4 |

**Gate**: Toasts fire on live events. View transitions animate. Mobile drawer works. All loading/empty states present.

---

## File Structure (Final)

```
src/
├── components/
│   ├── Breadcrumbs.tsx
│   ├── DataTable/
│   │   ├── Table.tsx
│   │   ├── TableHead.tsx
│   │   ├── TableBody.tsx
│   │   ├── TableRow.tsx
│   │   ├── TableCell.tsx
│   │   ├── TableSkeleton.tsx
│   │   ├── TableError.tsx
│   │   └── index.ts
│   ├── DescriptionList.tsx
│   ├── EmptyState.tsx
│   ├── FilterBar.tsx
│   ├── Form/
│   │   ├── FormErrors.tsx
│   │   ├── FormInput.tsx
│   │   ├── FormLabel.tsx
│   │   ├── FormSelect.tsx
│   │   ├── FormTextarea.tsx
│   │   └── index.ts
│   ├── Header.tsx
│   ├── Icons/
│   │   ├── index.ts              (re-exports lucide icons as IconComponentType)
│   │   └── GridMindLogo.tsx
│   ├── Layout.tsx
│   ├── MetricCard.tsx
│   ├── Modal.tsx
│   ├── NoticeBanner.tsx
│   ├── PageHeader.tsx
│   ├── PrimaryNav/
│   │   ├── PrimaryNav.tsx
│   │   ├── PrimaryNavItem.tsx
│   │   ├── PrimaryNavSection.tsx
│   │   └── index.ts
│   ├── SectorCard.tsx
│   ├── StatusChip.tsx
│   ├── StatusIndicator.tsx
│   ├── ThemeDropdown.tsx
│   ├── Toast.tsx
│   ├── AnomalyTable.tsx
│   ├── AnomalyDetailModal.tsx
│   └── ForecastTable.tsx
│
├── hooks/
│   ├── useGridData.ts
│   ├── useTradingData.ts
│   ├── useForecastData.ts
│   ├── useAnomalyData.ts
│   ├── useAssetData.ts
│   ├── useDispatchData.ts
│   └── useDashboardData.ts
│
├── mock/
│   ├── engine.ts                  (MockDataEngine class)
│   ├── generators/
│   │   ├── grid.ts
│   │   ├── trading.ts
│   │   ├── forecasting.ts
│   │   ├── anomalies.ts
│   │   ├── assets.ts
│   │   ├── dispatch.ts
│   │   └── agents.ts
│   └── utils.ts                   (random helpers, ID generation)
│
├── providers/
│   ├── QueryProvider.tsx
│   └── ThemeProvider.tsx
│
├── routes/
│   ├── __root.tsx
│   ├── index.tsx                  (Dashboard)
│   ├── grid.tsx
│   ├── grid/
│   │   ├── index.tsx
│   │   └── $sectorId.tsx
│   ├── trading.tsx
│   ├── trading/
│   │   ├── orders.tsx
│   │   ├── positions.tsx
│   │   └── new-order.tsx
│   ├── forecasting.tsx
│   ├── forecasting/
│   │   ├── demand.tsx
│   │   ├── solar.tsx
│   │   ├── wind.tsx
│   │   └── price.tsx
│   ├── anomalies.tsx
│   ├── anomalies/
│   │   ├── active.tsx
│   │   ├── resolved.tsx
│   │   └── all.tsx
│   ├── assets.tsx
│   ├── assets/
│   │   ├── inventory.tsx
│   │   ├── inventory/$assetId.tsx
│   │   ├── work-orders.tsx
│   │   └── health.tsx
│   ├── dispatch.tsx
│   └── dispatch/
│       ├── active.tsx
│       ├── history.tsx
│       ├── $planId.tsx
│       └── new.tsx
│
├── types/
│   ├── grid.ts
│   ├── trading.ts
│   ├── forecasting.ts
│   ├── anomalies.ts
│   ├── assets.ts
│   ├── dispatch.ts
│   ├── agents.ts
│   └── dashboard.ts
│
├── index.css
├── main.tsx
└── routeTree.gen.ts
```

---

## Dependency Graph Summary

```
Phase 1 (Scaffolding) ──► Phase 2 (Mock Data) ──► Phase 3 (Shared Components)
                                                         │
                              ┌───────────────────────────┤
                              ▼               ▼           ▼           ▼           ▼           ▼
                          Phase 4         Phase 5     Phase 6     Phase 7     Phase 8     Phase 9
                        (Dashboard)      (Grid)     (Trading)   (Forecast)  (Anomalies)  (Assets)
                              │               │           │           │           │           │
                              ▼               ▼           ▼           ▼           ▼           ▼
                          Phase 10 (Dispatch) ◄───────────────────────────────────────────────┘
                              │
                              ▼
                          Phase 11 (Polish & Notifications)
```

**Phases 4-9 can be developed in parallel** once Phase 3 is complete. Phase 10 has a soft dependency on Phase 9 (dispatch units reference generator assets) but can proceed with mock IDs. Phase 11 is the final integration pass.

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| HeroUI components don't match UI-SPEC patterns exactly | Medium | Custom wrapper components (Phase 3) abstract differences; adjust at wrapper level |
| TanStack Router file-based routing has learning curve | Low | Route structure is well-defined in contracts/ui-routes.md; follow 1:1 |
| Mock data intervals cause performance issues | Low | Use `refetchInterval` (not manual timers); intervals are configurable; data sets are small (<1000 records) |
| 30+ route files create maintenance overhead | Medium | Layout routes share logic; shared components (ForecastTable, AnomalyTable) reduce duplication |
| Tailwind CSS 4 breaking changes from v3 | Low | Use `@import "tailwindcss"` syntax; test theme config early in Phase 1 |
