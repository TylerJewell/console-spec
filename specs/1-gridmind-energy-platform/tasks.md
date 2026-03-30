# Tasks: GridMind Energy Platform

**Feature**: GridMind Multi-Agent Energy Grid Operations Platform
**Branch**: `1-gridmind-energy-platform`
**Generated**: 2026-03-29

## User Story Mapping

| Story | Title | Priority | Spec Scenario |
|-------|-------|----------|---------------|
| US1 | Operator Reviews Grid Health (Dashboard) | P1 | Scenario 1 |
| US2 | Operator Investigates Grid Sector | P1 | Scenario 2 |
| US3 | Trader Places New Energy Order | P1 | Scenario 3 |
| US4 | Trader Reviews Orders and Positions | P1 | Scenario 4 |
| US5 | Operator Reviews Demand Forecasts | P2 | Scenario 5 |
| US6 | Operator Triages an Anomaly | P1 | Scenario 6 |
| US7 | Maintenance Engineer Manages Assets | P2 | Scenario 7 |
| US8 | Operator Creates Dispatch Plan | P2 | Scenario 8 |
| US9 | Theme Switching and Mobile Navigation | P1 | Scenario 9 |
| US10 | Loading and Empty States | P1 | Scenario 10 |

---

## Phase 1: Project Setup

**Goal**: Initialized Vite + React + TypeScript project with all dependencies installed, building and running.

- [ ] T001 Initialize Vite React TypeScript project with `pnpm create vite gridmind --template react-ts` in project root, then move contents to `src/`
- [ ] T002 Install core dependencies: `@tanstack/react-router`, `@tanstack/react-query`, `@tanstack/react-form`, `@heroui/react` (or individual packages: `@heroui/button`, `@heroui/card`, `@heroui/chip`, `@heroui/dropdown`, `@heroui/input`, `@heroui/modal`, `@heroui/spinner`, `@heroui/system`, `@heroui/theme`, `@heroui/tooltip`, `@heroui/tabs`), `tailwindcss@4`, `next-themes`, `sonner`, `lucide-react` in `package.json`
- [ ] T003 Install dev dependencies: `@tanstack/router-plugin`, `@vitejs/plugin-react`, `vitest`, `@testing-library/react`, `typescript@5.8+` in `package.json`
- [ ] T004 Configure `vite.config.ts` with React plugin and TanStack Router plugin for file-based route generation
- [ ] T005 Configure `tsconfig.json` with path aliases (`@/` -> `src/`), strict mode, JSX react-jsx
- [ ] T006 Create `index.html` with Instrument Sans Variable and Roboto Mono Variable font links from Google Fonts

**Gate**: `pnpm dev` starts the Vite dev server and renders a blank React app.

---

## Phase 2: Foundational Infrastructure

**Goal**: Design system theme, root layout shell, navigation, icon system, mock data engine, and shared UI components. All blocking prerequisites for user story pages.

### 2A: Design System & Theme

- [ ] T007 Create Tailwind config `tailwind.config.ts` with HeroUI plugin, full gray scale, light/dark theme colors (primary=#f5b60b/#ffce4a, secondary=#02a4a7/#00d8dd, success, warning, danger), font sizes (tiny/small/medium/large), radius (small=3px, medium=6px, large=9px), custom animations (spin-slow, pulse-fast, pulse-heavy), box shadows (divider, dropdownmenu), scroll shadow gradients per `data-model.md` and `UI-SPEC.md`
- [ ] T008 Create `src/index.css` with Tailwind imports (`@import "tailwindcss"`), `@config` reference, CSS custom properties for `--font` and `--font-mono`, view transition keyframes (slide-out-left, slide-in-right, slide-out-right, slide-in-left), `@utility link` definition, reduced-motion media query per UI-SPEC section 2.8

### 2B: Providers & App Shell

- [ ] T009 Create `src/providers/ThemeProvider.tsx` wrapping `next-themes` ThemeProvider with HeroUI's `HeroUIProvider`, setting `attribute="class"`, `defaultTheme="system"`, `storageKey="gridmind-theme"`
- [ ] T010 Create `src/providers/QueryProvider.tsx` wrapping `@tanstack/react-query` QueryClientProvider with default staleTime of 5000ms
- [ ] T011 Create `src/main.tsx` bootstrapping the app with ThemeProvider, QueryProvider, and TanStack RouterProvider
- [ ] T012 Create `src/components/Icons/index.ts` re-exporting lucide-react icons (Zap, Activity, TrendingUp, BarChart3, Shield, AlertTriangle, Wrench, Factory, Sun, Wind, Droplets, Flame, Atom, ChevronDown, Menu, X, Moon, Monitor, MoreHorizontal, FileText, ExternalLink, Info, CheckCircle, XCircle, AlertCircle, Clock, Plus, Search, Filter, ArrowUpDown) wrapped as `IconComponentType` components with `className` prop forwarding

### 2C: Layout & Navigation

- [ ] T013 Create `src/components/Layout.tsx` with CSS Grid layout: `grid-template-columns: auto minmax(0, 1fr)`, `grid-template-rows: minmax(0, 1fr)`, `h-screen overflow-hidden`, `pt-[49px] md:pt-0` for mobile top bar offset, `grid-template-areas: 'primary-nav main'`
- [ ] T014 Create `src/components/Header.tsx` with sidebar header containing: GridMind logo + app name link, actions area (theme dropdown + hamburger on mobile), responsive drawer behavior (fixed top bar on mobile `md:static`, slide-in drawer `w-80 translate-x` animation 300ms, backdrop `bg-black/50`, close on Escape/backdrop click/navigation), `border-r border-divider` on desktop
- [ ] T015 Create `src/components/PrimaryNav/PrimaryNav.tsx` as `<nav className="w-full flex flex-col p-3">` container
- [ ] T016 Create `src/components/PrimaryNav/PrimaryNavSection.tsx` with section title (text-xxs uppercase foreground-500) and children slot
- [ ] T017 Create `src/components/PrimaryNav/PrimaryNavItem.tsx` with: `to` prop for TanStack Router Link, `isExpandable` prop with chevron rotation and grid-template-rows animation (300ms), active state `bg-primary/50` on label, hover `bg-foreground/10`, `text-xxs leading-4 min-h-8 p-1 rounded-small`, depth-based left padding, `startContent`/`endContent` slots
- [ ] T018 Create `src/components/PrimaryNav/index.ts` composing the full navigation tree per `contracts/ui-routes.md`: Dashboard, Grid Monitoring (expandable with 5 sectors + overview), Energy Trading (expandable with Orders/Positions/New Order), Forecasting (expandable with 4 types), Anomalies (expandable with Active/Resolved/All), Assets (expandable with Inventory/Work Orders/Health), Dispatch (expandable with Active Plans/History/New Plan)
- [ ] T019 Create `src/components/ThemeDropdown.tsx` using HeroUI Dropdown with 3 items (Light with sun icon, Dark with moon icon, System with monitor icon), `useTheme()` from next-themes, bordered icon-only sm button showing current resolved theme icon
- [ ] T020 Create `src/components/Icons/GridMindLogo.tsx` as a simple SVG component (stylized lightning bolt or grid icon) with `className` prop, `h-5 w-auto fill-current`

### 2D: Route Stubs

- [ ] T021 Create `src/routes/__root.tsx` with Layout component wrapping `<Header>` (sidebar) + `<main className="overflow-y-auto">` containing `<Outlet />`, TanStack Query devtools (conditional), sonner `<Toaster>` component
- [ ] T022 Create all route stub files returning placeholder `<div>Page Name</div>`: `src/routes/index.tsx` (Dashboard), `src/routes/grid.tsx` (layout), `src/routes/grid/index.tsx`, `src/routes/grid/$sectorId.tsx`, `src/routes/trading.tsx` (layout), `src/routes/trading/orders.tsx`, `src/routes/trading/positions.tsx`, `src/routes/trading/new-order.tsx`, `src/routes/forecasting.tsx` (layout), `src/routes/forecasting/demand.tsx`, `src/routes/forecasting/solar.tsx`, `src/routes/forecasting/wind.tsx`, `src/routes/forecasting/price.tsx`, `src/routes/anomalies.tsx` (layout), `src/routes/anomalies/active.tsx`, `src/routes/anomalies/resolved.tsx`, `src/routes/anomalies/all.tsx`, `src/routes/assets.tsx` (layout), `src/routes/assets/inventory.tsx`, `src/routes/assets/inventory/$assetId.tsx`, `src/routes/assets/work-orders.tsx`, `src/routes/assets/health.tsx`, `src/routes/dispatch.tsx` (layout), `src/routes/dispatch/active.tsx`, `src/routes/dispatch/history.tsx`, `src/routes/dispatch/$planId.tsx`, `src/routes/dispatch/new.tsx`
- [ ] T023 Configure TanStack Router plugin in `vite.config.ts` to auto-generate `src/routeTree.gen.ts` from `src/routes/` directory

### 2E: TypeScript Types

- [ ] T024 [P] Create `src/types/grid.ts` with: `SectorStatus`, `GridEventType`, `GridEventSeverity` enums/unions, `GridSector` and `GridEvent` interfaces per `data-model.md`
- [ ] T025 [P] Create `src/types/trading.ts` with: `OrderType`, `Market`, `OrderStatus` unions, `TradeOrder`, `PortfolioPosition`, `CreateOrderInput`, `OrderFilters` interfaces per `data-model.md` and `contracts/mock-api.md`
- [ ] T026 [P] Create `src/types/forecasting.ts` with: `ForecastType` union, `Forecast`, `ForecastFilters` interfaces per `data-model.md`
- [ ] T027 [P] Create `src/types/anomalies.ts` with: `AnomalyType`, `AnomalySeverity`, `AnomalyStatus` unions, `Anomaly`, `AnomalyFilters`, `AnomalyUpdate` interfaces per `data-model.md`
- [ ] T028 [P] Create `src/types/assets.ts` with: `AssetType`, `AssetStatus`, `AlertSeverity`, `WorkOrderType`, `Priority`, `WorkOrderStatus` unions, `Asset`, `Alert`, `WorkOrder`, `AssetFilters`, `WorkOrderFilters`, `CreateWorkOrderInput`, `HealthOverviewItem` interfaces per `data-model.md`
- [ ] T029 [P] Create `src/types/dispatch.ts` with: `FuelType`, `DispatchPlanStatus`, `DispatchUnitStatus` unions, `DispatchPlan`, `DispatchUnit`, `PlanFilters`, `CreatePlanInput` interfaces per `data-model.md`
- [ ] T030 [P] Create `src/types/agents.ts` with: `AgentOperationalStatus` union, `AgentStatus` interface per `data-model.md`
- [ ] T031 [P] Create `src/types/dashboard.ts` with: `DashboardMetrics` interface per `contracts/mock-api.md`

### 2F: Mock Data Engine

- [ ] T032 Create `src/mock/utils.ts` with helper functions: `uuid()` (crypto.randomUUID), `randomFloat(min, max)`, `randomInt(min, max)`, `randomItem(array)`, `weightedRandom(weights)`, `generateTimestamp(hoursAgo)`, `formatDate(date)`
- [ ] T033 Create `src/mock/engine.ts` with `MockDataEngine` singleton class: private arrays/maps for each entity type, `seed()` method called on construction, typed getter methods matching `contracts/mock-api.md` API surface, mutation methods (createTradeOrder, updateAnomaly, createWorkOrder, createDispatchPlan, approvePlan), simple event emitter (`on`/`emit`) for `onAnomalyDetected`, `onOrderFilled`, `onPlanApproved`, `onCriticalEvent`
- [ ] T034 [P] Create `src/mock/generators/grid.ts` with: `seedGridSectors()` generating 5 sectors with baseline values (frequency ~60Hz, voltage ~230kV, load 60-80% of capacity, capacity 800-2000MW per sector), `updateSectorTelemetry()` adding random fluctuations (+/-0.3Hz frequency, +/-5kV voltage, +/-50MW load), status derivation from frequency/load thresholds per `data-model.md`, `generateGridEvent()` creating events correlated with telemetry anomalies
- [ ] T035 [P] Create `src/mock/generators/trading.ts` with: `seedTradeOrders()` generating 50-100 orders across all statuses with realistic prices (spot $20-80, day-ahead $25-65), counterparty names from a pool of 10 fictional companies, `computePortfolioPosition()` calculating from filled orders, `progressOrders()` randomly advancing pending->open->filled with partial fills
- [ ] T036 [P] Create `src/mock/generators/forecasting.ts` with: `seedForecasts()` generating 24 hourly entries x 4 types x 5 regions, demand (800-2400MW), solar (0-600MW, time-of-day curve), wind (50-400MW), price ($20-80), confidence intervals as +/-10-20% of predicted, actuals for past hours with accuracy calculation per `data-model.md`
- [ ] T037 [P] Create `src/mock/generators/anomalies.ts` with: `seedAnomalies()` generating 15-25 anomalies with weighted severity distribution (info 30%, low 25%, medium 20%, high 15%, critical 10%), mixed statuses (60% new/investigating, 40% resolved/false-positive), descriptive messages per anomaly type, `generateNewAnomaly()` for interval-based creation
- [ ] T038 [P] Create `src/mock/generators/assets.ts` with: `seedAssets()` generating 30-50 assets distributed across types (8 generators, 6 transformers, 8 transmission lines, 5 substations, 12 solar panels, 8 wind turbines) and sectors, realistic health scores (new assets 85-100, old assets 40-75), 0-3 alerts per asset, `seedWorkOrders()` generating 10-20 work orders linked to assets
- [ ] T039 [P] Create `src/mock/generators/dispatch.ts` with: `seedDispatchPlans()` generating 3-5 plans (1 active, 1 approved, 1 draft, 1-2 completed) each with 5-12 dispatch units sorted by marginal cost, unit costs (solar $0-5, wind $5-15, nuclear $15-25, hydro $10-20, gas $30-60, coal $40-80), `generateOptimizedPlan(demandTarget)` selecting units in merit order until demand met
- [ ] T040 [P] Create `src/mock/generators/agents.ts` with: `seedAgentStatuses()` generating 6 fixed records (gridwatch, volttrader, forecastiq, sentinel, assetguard, dispatch) with randomized operational statuses and recent timestamps
- [ ] T041 Wire all generators into `MockDataEngine.seed()` in `src/mock/engine.ts`, set up `setInterval` timers: grid telemetry 5s, trading 10s, forecasts 30s, anomalies 15s, assets 20s, dispatch 10s per `research.md` R-2
- [ ] T042 Create `src/mock/index.ts` exporting a singleton `mockEngine` instance that seeds on import

### 2G: TanStack Query Hooks

- [ ] T043 [P] Create `src/hooks/useGridData.ts` with: `useGridSectors()`, `useGridSector(sectorId)`, `useGridEvents(sectorId)` using `useQuery` with `refetchInterval: 5000`
- [ ] T044 [P] Create `src/hooks/useTradingData.ts` with: `useTradeOrders(filters)`, `usePortfolioPosition()`, `useCreateOrder()` mutation with `onSuccess` invalidating orders query
- [ ] T045 [P] Create `src/hooks/useForecastData.ts` with: `useForecasts(filters)` using `useQuery` with `refetchInterval: 30000`
- [ ] T046 [P] Create `src/hooks/useAnomalyData.ts` with: `useAnomalies(filters)`, `useAnomaly(id)`, `useUpdateAnomaly()` mutation, `useCriticalAnomalyCount()` with `refetchInterval: 15000`
- [ ] T047 [P] Create `src/hooks/useAssetData.ts` with: `useAssets(filters)`, `useAsset(id)`, `useWorkOrders(filters)`, `useCreateWorkOrder()` mutation, `useHealthOverview()` with `refetchInterval: 20000`
- [ ] T048 [P] Create `src/hooks/useDispatchData.ts` with: `useDispatchPlans(filters)`, `useDispatchPlan(id)`, `useCreateDispatchPlan()` mutation, `useApprovePlan()` mutation with `refetchInterval: 10000`
- [ ] T049 [P] Create `src/hooks/useDashboardData.ts` with: `useDashboardMetrics()`, `useRecentAnomalies(limit)`, `useAgentStatuses()` with `refetchInterval: 5000`

### 2H: Shared UI Components

- [ ] T050 Create `src/components/PageHeader.tsx` with: `title` (string, h1 text-2xl font-[550] dark:font-[500]), `subtitle` (ReactNode, text-tiny text-foreground-500 mt-1), `Icon` (IconComponentType, w-8 h-8 fill-current mr-2), `children` (action buttons right-aligned flex gap-3), wrapper `mb-9 flex flex-wrap gap-x-6 gap-y-3 w-full`
- [ ] T051 Create `src/components/MetricCard.tsx` with: `label` (string), `value` (string|number), `color` (HeroUI color token), `prefix` (optional string), using HeroUI Card with `shadow="sm"`, left border accent `border-l-3 border-{color}`, label as `text-tiny font-[550] dark:font-[500] text-foreground-500 uppercase`, value as `text-2xl font-[550] dark:font-[500]`
- [ ] T052 Create `src/components/StatusIndicator.tsx` with: `status` (string), `color` (HeroUI color), `label` (string), `animate` (optional: 'spin'|'pulse'|'spin-slow'), rendering colored dot (w-3 h-3 rounded-full bg-{color}) + label text (text-tiny font-[550] dark:font-[500] pl-1.5)
- [ ] T053 Create `src/components/StatusChip.tsx` with: `value` (string), `colorMap` (Record<string, HeroUI color>), wrapping HeroUI Chip with `size="sm"`, `radius="sm"`, mapped color, `text-tiny font-[450] dark:font-[400]`
- [ ] T054 Create `src/components/DataTable/Table.tsx` with scroll shadow container (gradient pseudo-elements that appear on horizontal overflow), `<table className="min-w-full border-separate border-spacing-0.5 table-auto">`
- [ ] T055 Create `src/components/DataTable/TableHead.tsx`, `TableHeadRow.tsx` (text-tiny text-left), `TableHeadCell.tsx` (bg-content2 dark:bg-content1 font-[550] dark:font-[500] p-2 px-3 whitespace-nowrap, first:rounded-tl-md last:rounded-tr-md), supporting `onClick` for sortable columns with sort indicator arrow
- [ ] T056 Create `src/components/DataTable/TableBody.tsx`, `TableRow.tsx` (group text-tiny align-top), `TableCell.tsx` (p-2 px-3 bg-content2 dark:bg-content1 group-hover:bg-content3 dark:group-hover:bg-content2, group-last rounded corners, break-words)
- [ ] T057 Create `src/components/DataTable/TableSkeleton.tsx` rendering N rows of pulsing `bg-gray-200 dark:bg-gray-700 rounded animate-pulse` bars with configurable column widths
- [ ] T058 Create `src/components/DataTable/TableError.tsx` rendering a single row spanning all columns with `text-danger` error message
- [ ] T059 Create `src/components/DataTable/index.ts` re-exporting all table components
- [ ] T060 Create `src/components/FilterBar.tsx` with: `filters` prop (array of {name, label, options, value}), `onFilterChange` callback, `onClear` callback, rendering as a flex row of HeroUI Select components with an "Apply" (bordered sm) and "Clear" (light sm) button
- [ ] T061 Create `src/components/DescriptionList.tsx` with: `list` (array of {term, definition}), `floating` (boolean, default true for horizontal), `boxed` (boolean, default true for bg-content2 rounded-medium), terms as `text-tiny font-[550] dark:font-[500] pb-1.5`, definitions as `flex flex-wrap gap-1`
- [ ] T062 Create `src/components/Breadcrumbs.tsx` with: `items` (array of {label, to?}), rendering HeroUI Breadcrumbs or custom flex row with `/` separators, last item as plain text, others as TanStack Router Links with `text-secondary` color
- [ ] T063 Create `src/components/NoticeBanner.tsx` with: `severity` ('warning'|'secondary'), `variant` ('default'|'ghost'), `dismissible` (boolean), rendering `inline-flex items-center gap-1.5 border border-{color}/25 bg-{color}/10 rounded text-xxs text-foreground/80` with icon and message, dismiss button if dismissible
- [ ] T064 Create `src/components/Modal.tsx` wrapping HeroUI Modal with: `heading` (string), `showCloseButton` (boolean), `ActionButton` (ReactElement), `size` (default 'lg'), consistent classNames (backdrop `dark:bg-overlay/80`, body `items-start pb-0`, footer `justify-start pt-0 mt-8 pb-8`), `scrollBehavior="outside"`
- [ ] T065 Create `src/components/Toast.tsx` with `pushToast({title, description, variant, persistent})` function using `sonner` toast.custom, rendering with left icon (SuccessIcon/WarningIcon/ErrorIcon/InfoIcon from Icons), close button, `bg-content1 shadow-small rounded-small p-4 pl-10`, variant text colors, persistent=true for warning/danger, 6000ms for success/info
- [ ] T066 Create `src/components/Form/FormLabel.tsx` with: `label`, `id`, `required` props, rendering `<label className="block mb-1 text-tiny font-[550] dark:font-[500]">`
- [ ] T067 Create `src/components/Form/FormInput.tsx` with: `label`, `id`, `required`, `errors[]` props, rendering FormLabel + `<input className="block max-w-full p-2 py-1.75 bg-content2 border border-content4 rounded-small focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-focus text-tiny leading-5 w-80">` + FormErrors
- [ ] T068 Create `src/components/Form/FormSelect.tsx` with: same interface as FormInput but rendering `<select>` with options array prop, same styling
- [ ] T069 Create `src/components/Form/FormTextarea.tsx` with: same interface as FormInput but rendering `<textarea>` with min-h-20, vertical resize
- [ ] T070 Create `src/components/Form/FormErrors.tsx` rendering error strings as `text-tiny text-danger mt-1` list
- [ ] T071 Create `src/components/Form/index.ts` re-exporting all form components
- [ ] T072 Create `src/components/EmptyState.tsx` with: `icon` (ReactNode), `title` (string), `description` (string), rendering centered flex column with 48px icon at 0.5 opacity, title as text-medium font-[550], description as text-tiny text-foreground-500 max-w-sm

**Gate**: All shared components render in both themes. Navigation tree works. Mock data hooks return data. `pnpm dev` shows the full app shell with working sidebar and routing.

---

## Phase 3: US1 - Dashboard (Operator Reviews Grid Health)

**Story Goal**: Operator can assess overall grid health across all six agent domains within 10 seconds of opening the dashboard.

**Independent Test**: Navigate to `/` -- see 6 metric cards with live values, recent anomalies table, agent status cards. Values refresh automatically.

- [ ] T073 [US1] Build DashboardPage in `src/routes/index.tsx`: PageHeader with title "Dashboard" and Activity icon, responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`) of 6 MetricCard components, recent anomalies table, agent status card grid
- [ ] T074 [US1] Implement Grid Frequency MetricCard in `src/routes/index.tsx`: value formatted to 2 decimal places with "Hz" suffix, color derived from thresholds (success: 59.7-60.3, warning: 59.5-59.7/60.3-60.5, danger: <59.5/>60.5)
- [ ] T075 [US1] Implement Portfolio P&L MetricCard in `src/routes/index.tsx`: value formatted as USD currency with "$" prefix, color success when positive, danger when negative
- [ ] T076 [US1] Implement Forecast Accuracy MetricCard in `src/routes/index.tsx`: value as percentage with "%" suffix, StatusChip badge (Excellent/Good/Fair/Poor) using accuracy thresholds
- [ ] T077 [US1] Implement Active Anomalies MetricCard in `src/routes/index.tsx`: count as value, color mapped to highest severity present (danger if any critical, warning if high, etc.)
- [ ] T078 [US1] Implement Fleet Health Score MetricCard in `src/routes/index.tsx`: value as percentage, color derived from score thresholds (success >80, warning 50-80, danger <50)
- [ ] T079 [US1] Implement Dispatch Cost MetricCard in `src/routes/index.tsx`: value formatted as USD with "$/MWh" suffix
- [ ] T080 [US1] Implement Recent Anomalies table in `src/routes/index.tsx`: 5 rows using DataTable, columns: severity (StatusChip), type (StatusChip), source (text), timestamp (formatted relative), with skeleton loading state
- [ ] T081 [US1] Implement Agent Status cards grid in `src/routes/index.tsx`: 6 cards using HeroUI Card with StatusIndicator (active=success, idle=default, processing=secondary+spin-slow), agent name, domain, last updated timestamp
- [ ] T082 [US1] Wire `useDashboardMetrics()`, `useRecentAnomalies(5)`, `useAgentStatuses()` hooks with `refetchInterval: 5000` in `src/routes/index.tsx`

---

## Phase 4: US2 - Grid Monitoring (Operator Investigates Sector)

**Story Goal**: Operator can drill from sector overview into detailed telemetry and event history for any sector.

**Independent Test**: Navigate to `/grid` -- see 5 sector cards. Click a sector -- see detail with description list and event log table.

- [ ] T083 [US2] Build GridLayout in `src/routes/grid.tsx`: PageHeader "Grid Monitoring" with Zap icon, `<Outlet />` for child routes
- [ ] T084 [US2] Create `src/components/SectorCard.tsx`: HeroUI Card with `hoverable`, `pressable`, showing sector name (font-[550]), StatusIndicator (Normal/Warning/Critical/Blackout with semantic colors and pulse animation for warning/critical), frequency value ("60.02 Hz"), load bar (div with bg-content3 track and bg-{statusColor} fill bar at `load/capacity * 100%` width), "Load: X / Y MW" label
- [ ] T085 [US2] Build GridOverviewPage in `src/routes/grid/index.tsx`: responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`) of SectorCard components linked to `/grid/$sectorId`, skeleton loading state (5 placeholder cards), wire `useGridSectors()` hook
- [ ] T086 [US2] Build SectorDetailPage in `src/routes/grid/$sectorId.tsx`: extract `sectorId` from route params, PageHeader with sector name and status badge, DescriptionList with fields (Frequency, Voltage, Load, Capacity, Status, Last Updated), event log DataTable (columns: Timestamp, Event Type as StatusChip, Severity as StatusChip, Description), skeleton loading, wire `useGridSector(sectorId)` and `useGridEvents(sectorId)` hooks

---

## Phase 5: US3 + US4 - Energy Trading (Orders, Positions, New Order)

**Story Goal**: Trader can view/filter orders, check positions, and place new orders with validation.

**Independent Test**: Navigate to `/trading/orders` -- filter by market/type/status, sort columns. Go to `/trading/positions` -- see P&L summary. Go to `/trading/new-order` -- submit valid order (toast), submit invalid (errors).

- [ ] T087 [US3] Build TradingLayout in `src/routes/trading.tsx`: PageHeader "Energy Trading" with TrendingUp icon, `<Outlet />`
- [ ] T088 [US4] Build OrdersPage in `src/routes/trading/orders.tsx`: FilterBar with 3 filters (Market: All/Spot/Day-Ahead, Type: All/Buy/Sell, Status: All + each status), DataTable with columns (ID truncated, Type, Market, Price formatted as $XX.XX/MWh, Quantity formatted as X.X MWh, Status as StatusChip with order color map, Timestamp formatted, Counterparty), column sorting on click (toggle asc/desc), skeleton loading, empty state, wire `useTradeOrders(filters)` with filter state as `useState`
- [ ] T089 [US4] Build PositionsPage in `src/routes/trading/positions.tsx`: DescriptionList (boxed, floating) with terms: Net Position (MWh), Total Bought (MWh), Total Sold (MWh), Avg Buy Price ($/MWh), Avg Sell Price ($/MWh), Realized P&L as `<span className={pnl >= 0 ? 'text-success' : 'text-danger'}>` formatted as USD, wire `usePortfolioPosition()`
- [ ] T090 [US3] Build NewOrderPage in `src/routes/trading/new-order.tsx`: PageHeader "New Order" with Plus icon, HeroUI Card containing TanStack Form with fields: Market (FormSelect: Spot/Day-Ahead), Type (FormSelect: Buy/Sell), Price (FormInput type="number" step="0.01" min="0.01" max="500"), Quantity (FormInput type="number" step="0.1" min="0.1" max="10000"), field-level validators returning error strings, submit button (color="primary" variant="solid"), `onSubmit` calling `useCreateOrder()` mutation then `pushToast({title: 'Order submitted', variant: 'success', persistent: false})` and form reset

---

## Phase 6: US5 - Forecasting (Demand, Solar, Wind, Price)

**Story Goal**: Operator can review forecasts with accuracy badges, filter by region and time range.

**Independent Test**: Navigate to `/forecasting/demand` -- see table with accuracy badges. Switch region filter -- table updates. Switch to `/forecasting/solar` -- different data, same layout.

- [ ] T091 [US5] Build ForecastingLayout in `src/routes/forecasting.tsx`: PageHeader "Forecasting" with BarChart3 icon, `<Outlet />`
- [ ] T092 [US5] Create `src/components/ForecastTable.tsx`: shared component accepting `forecastType` prop, FilterBar with Region dropdown (All + 5 sectors) and Time Range dropdown (6h/12h/24h), DataTable columns (Timestamp formatted, Predicted formatted with unit, Actual formatted or muted "Pending" chip, Confidence as "low - high" range, Accuracy as StatusChip with thresholds: success>=90 "Excellent", secondary 75-89 "Good", warning 60-74 "Fair", danger <60 "Poor", or muted "N/A" if null), skeleton loading, wire `useForecasts({type, region, hoursAhead})`
- [ ] T093 [US5] Build DemandForecastPage in `src/routes/forecasting/demand.tsx`: ForecastTable with `forecastType="demand"`, unit="MW"
- [ ] T094 [P] [US5] Build SolarForecastPage in `src/routes/forecasting/solar.tsx`: ForecastTable with `forecastType="solar"`, unit="MW"
- [ ] T095 [P] [US5] Build WindForecastPage in `src/routes/forecasting/wind.tsx`: ForecastTable with `forecastType="wind"`, unit="MW"
- [ ] T096 [P] [US5] Build PriceForecastPage in `src/routes/forecasting/price.tsx`: ForecastTable with `forecastType="price"`, unit="$/MWh"

---

## Phase 7: US6 - Anomaly Detection (Active, Resolved, All + Modal)

**Story Goal**: Operator can view/filter anomalies, investigate details in a modal, and submit resolutions.

**Independent Test**: Navigate to `/anomalies/active` -- see table with severity chips, notice banner if critical exists. Click action button -- modal opens with all details. Fill resolution form and save -- toast confirms, anomaly moves to resolved.

- [ ] T097 [US6] Build AnomaliesLayout in `src/routes/anomalies.tsx`: PageHeader "Anomalies" with Shield icon, `<Outlet />`
- [ ] T098 [US6] Create `src/components/AnomalyTable.tsx`: shared table component accepting `statusFilter` prop (array of AnomalyStatus or undefined for all), DataTable columns (Severity as StatusChip with severity color map, Type as StatusChip, Source, Description truncated to 60 chars with title tooltip, Timestamp formatted, Status as StatusChip with status color map, Actions column with "View" Button size="sm" variant="light"), skeleton loading, empty state
- [ ] T099 [US6] Create `src/components/AnomalyDetailModal.tsx`: Modal with heading "Anomaly Detail", body containing DescriptionList (ID, Type, Severity, Source, Description full text, Detected At, Status, Assigned To, Resolution Notes, Resolved At), divider, resolution form section with: FormSelect for status (New/Investigating/Resolved/False Positive), FormInput for Assign To, FormTextarea for Resolution Notes, Save button (bordered) calling `useUpdateAnomaly()` mutation then `pushToast({title: 'Resolution saved', variant: 'success', persistent: false})` and closing modal
- [ ] T100 [US6] Build ActiveAnomaliesPage in `src/routes/anomalies/active.tsx`: NoticeBanner (severity="warning") when `useCriticalAnomalyCount()` > 0 showing "X critical anomalies require attention", AnomalyTable with `statusFilter={['new', 'investigating']}`, AnomalyDetailModal triggered by row action button with `useDisclosure()` state
- [ ] T101 [P] [US6] Build ResolvedAnomaliesPage in `src/routes/anomalies/resolved.tsx`: AnomalyTable with `statusFilter={['resolved', 'false_positive']}`
- [ ] T102 [P] [US6] Build AllAnomaliesPage in `src/routes/anomalies/all.tsx`: NoticeBanner (same as active), AnomalyTable with no statusFilter, AnomalyDetailModal

---

## Phase 8: US7 - Asset Management (Inventory, Detail, Work Orders, Health)

**Story Goal**: Engineer can browse assets, view detail with breadcrumbs, create work orders, see health overview.

**Independent Test**: Navigate to `/assets/inventory` -- see table with health chips. Click asset -- detail page with breadcrumbs, related work orders, alerts. Go to `/assets/work-orders` -- see table, open create modal, submit. Go to `/assets/health` -- see card grid.

- [ ] T103 [US7] Build AssetsLayout in `src/routes/assets.tsx`: PageHeader "Assets" with Wrench icon, `<Outlet />`
- [ ] T104 [US7] Build AssetInventoryPage in `src/routes/assets/inventory.tsx`: DataTable with columns (Name as TanStack Router Link to `/assets/inventory/$assetId`, Type as StatusChip, Sector, Health Score as StatusChip with health color map, Status as StatusIndicator with asset status colors, Efficiency as "XX%"), clickable rows navigating to detail, skeleton loading, wire `useAssets()`
- [ ] T105 [US7] Build AssetDetailPage in `src/routes/assets/inventory/$assetId.tsx`: Breadcrumbs (Assets > Inventory > {asset.name}), PageHeader with asset name and type icon, DescriptionList (Name, Type, Location, Status as StatusIndicator, Health Score as StatusChip, Last Inspection, Next Maintenance, Efficiency, Age), "Related Work Orders" section with DataTable (ID, Type chip, Priority chip, Status indicator, Scheduled Date, Technician) from `useWorkOrders({assetId})`, "Alert History" section with simple list of alerts (severity icon + message + timestamp), wire `useAsset(assetId)`
- [ ] T106 [US7] Build WorkOrdersPage in `src/routes/assets/work-orders.tsx`: DataTable with columns (ID, Asset Name, Type as StatusChip, Priority as StatusChip with priority color map, Status as StatusIndicator, Scheduled Date, Technician), "Create Work Order" Button in PageHeader opening Modal with TanStack Form: FormSelect for Asset (options from useAssets), FormSelect for Type (Preventive/Corrective/Emergency), FormSelect for Priority (Low/Medium/High/Critical), FormInput for Scheduled Date (type="date"), FormInput for Technician, FormTextarea for Notes, submit calling `useCreateWorkOrder()` mutation with success toast, wire `useWorkOrders()`
- [ ] T107 [US7] Build HealthOverviewPage in `src/routes/assets/health.tsx`: responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`) of MetricCard components, one per asset type, showing average health score with health color mapping, subtitle showing "X assets (Y online)", wire `useHealthOverview()`

---

## Phase 9: US8 - Dispatch Optimization (Plans, Detail, New)

**Story Goal**: Operator can view dispatch plans, create new optimized plans, review merit order, and approve.

**Independent Test**: Navigate to `/dispatch/active` -- see plans table. Click plan -- detail with merit order table. Go to `/dispatch/new` -- enter demand target, see generated units, approve -- toast confirms.

- [ ] T108 [US8] Build DispatchLayout in `src/routes/dispatch.tsx`: PageHeader "Dispatch" with Factory icon, `<Outlet />`
- [ ] T109 [US8] Build ActivePlansPage in `src/routes/dispatch/active.tsx`: DataTable with columns (ID truncated, Created as timestamp, Demand Target as "X MW", Total Cost as "$X,XXX", Status as StatusChip with plan status color map), clickable rows navigating to `/dispatch/$planId`, "New Plan" Button linking to `/dispatch/new`, wire `useDispatchPlans({status: ['draft','optimizing','approved','active']})`
- [ ] T110 [P] [US8] Build PlanHistoryPage in `src/routes/dispatch/history.tsx`: same table as ActivePlans, wire `useDispatchPlans({status: ['completed']})`
- [ ] T111 [US8] Build PlanDetailPage in `src/routes/dispatch/$planId.tsx`: PageHeader with "Plan {id}" and status chip, "Approve" Button (color="primary" variant="solid", visible only when status=draft) calling `useApprovePlan()` mutation with success toast, DescriptionList (ID, Created, Demand Target, Total Cost, Status), "Merit Order" section with DataTable columns (Generator Name, Fuel Type as StatusChip with fuel color map, Output as "X MW", Max Capacity as "X MW", Marginal Cost as "$X.XX/MWh", Status as StatusIndicator with dispatch unit colors/animations), wire `useDispatchPlan(planId)`
- [ ] T112 [US8] Build NewPlanPage in `src/routes/dispatch/new.tsx`: two-step flow managed with useState (step: 'input' | 'review'), Step 1: FormInput for Demand Target (type="number" min=100 max=5000 step=1, label "Demand Target (MW)"), "Generate Plan" Button calling `useCreateDispatchPlan()` mutation then advancing to step 2, Step 2: DescriptionList showing plan summary (Demand Target, Total Cost, Unit Count), merit order DataTable (same columns as PlanDetailPage), "Approve & Activate" Button (color="primary") calling `useApprovePlan()` with success toast and navigation to `/dispatch/active`, "Back" Button (variant="light") returning to step 1

---

## Phase 10: US9 + US10 - Theme, Mobile, Loading States, Notifications

**Story Goal**: Theme switching works everywhere, mobile drawer is polished, all loading/empty/error states are present, live toast notifications fire.

**Independent Test**: Toggle theme -- all pages update. Resize to mobile -- hamburger works, drawer slides, closes on nav. Visit any page during data load -- skeletons visible. Filter to no results -- empty state shown. Wait for mock events -- toasts appear.

- [ ] T113 [US9] Wire MockDataEngine event emitter to toast notifications in `src/routes/__root.tsx`: subscribe to `onAnomalyDetected` (pushToast variant='warning' for high, 'error' for critical), `onOrderFilled` (pushToast variant='success'), `onPlanApproved` (pushToast variant='success'), `onCriticalEvent` (pushToast variant='error'), unsubscribe on unmount
- [ ] T114 [US9] Verify theme dropdown in Header works: Light/Dark/System all apply correct class to root element, persists in localStorage across navigation, all pages render correctly in both themes (spot-check all 6 domain page groups)
- [ ] T115 [US9] Verify responsive layout: at `<768px` sidebar collapses, hamburger appears, drawer opens/closes with animation, backdrop shows, drawer closes on nav/Escape/backdrop, no content overflow issues
- [ ] T116 [US10] Verify all DataTable instances have skeleton loading states: Dashboard anomalies table, Grid event log, Orders table, Forecast tables (x4), Anomaly tables (x3), Asset inventory, Work orders, Asset detail work orders, Dispatch plans tables, Merit order table -- add `isLoading` prop wiring to each if missing
- [ ] T117 [US10] Verify all filtered views show EmptyState when no results match: Orders with impossible filter combo, Forecasts filtered to empty region, Anomalies resolved (when none exist), Work orders for asset with none
- [ ] T118 [US10] Verify all DataTable instances show TableError on fetch failure: add error handling to each page (pass `isError` and `error.message` to DataTable rendering TableError row)
- [ ] T119 [US10] Add view transition CSS integration: apply `view-transition-name: slide-content` to main content outlet in `__root.tsx`, verify slide animations on page navigation, verify `prefers-reduced-motion` disables animations
- [ ] T120 Accessibility pass: verify all icon-only buttons have `aria-label`, modal has focus trap and restores focus on close, form labels are associated with inputs via `htmlFor`/`id`, StatusChip/StatusIndicator text is readable (not color-only), skip-nav link if sidebar is long

---

## Dependencies

```
Phase 1 (Setup: T001-T006)
    │
    ▼
Phase 2 (Foundation: T007-T072)
    │
    ├──► Phase 3 (US1 Dashboard: T073-T082)
    ├──► Phase 4 (US2 Grid: T083-T086)
    ├──► Phase 5 (US3+US4 Trading: T087-T090)
    ├──► Phase 6 (US5 Forecasting: T091-T096)
    ├──► Phase 7 (US6 Anomalies: T097-T102)
    ├──► Phase 8 (US7 Assets: T103-T107)
    └──► Phase 9 (US8 Dispatch: T108-T112)
              │
              ▼
         Phase 10 (US9+US10 Polish: T113-T120)
```

**Phases 3-9 are fully parallelizable** -- each domain page set depends only on Phase 2 foundation, not on other domain phases.

## Parallel Execution Opportunities

Within Phase 2:
- T024-T031 (types) are all parallelizable
- T034-T040 (generators) are all parallelizable
- T043-T049 (hooks) are all parallelizable
- T050-T072 (shared components) are mostly parallelizable (Forms depend on FormLabel/FormErrors)

Within Phase 6: T094-T096 (Solar/Wind/Price forecast pages) are parallelizable after T092 (shared ForecastTable)

Within Phase 7: T101-T102 (Resolved/All anomaly pages) are parallelizable after T098 (shared AnomalyTable)

---

## Implementation Strategy

**MVP (Minimum Viable Product)**: Phase 1 + Phase 2 + Phase 3 (Dashboard)
- Delivers the core value: operator can see all six domain KPIs at a glance
- Proves the entire stack works end-to-end (mock data -> hooks -> components -> rendering)
- Exercises: MetricCard, DataTable, StatusIndicator, StatusChip, PageHeader, theme, layout

**Increment 2**: Add Phase 4 (Grid) + Phase 5 (Trading)
- Adds drill-down capability and the first form
- Exercises: SectorCard, DescriptionList, FilterBar, Form components, toast, navigation tree expansion

**Increment 3**: Add Phase 6 (Forecasting) + Phase 7 (Anomalies)
- Adds the most complex UI patterns (modal with form, notice banner, shared table component)
- Exercises: Modal, NoticeBanner, ForecastTable, AnomalyDetailModal

**Increment 4**: Add Phase 8 (Assets) + Phase 9 (Dispatch)
- Completes all domain pages
- Exercises: Breadcrumbs, HealthOverview cards, merit order table, two-step form flow

**Increment 5**: Phase 10 (Polish)
- Cross-cutting: notifications, accessibility, view transitions, verification of all states

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 120 |
| Phase 1 (Setup) | 6 tasks |
| Phase 2 (Foundation) | 66 tasks |
| Phase 3 (US1 Dashboard) | 10 tasks |
| Phase 4 (US2 Grid) | 4 tasks |
| Phase 5 (US3+US4 Trading) | 4 tasks |
| Phase 6 (US5 Forecasting) | 6 tasks |
| Phase 7 (US6 Anomalies) | 6 tasks |
| Phase 8 (US7 Assets) | 5 tasks |
| Phase 9 (US8 Dispatch) | 5 tasks |
| Phase 10 (US9+US10 Polish) | 8 tasks |
| Parallelizable tasks (marked [P]) | 30 |
| User story phases parallelizable | 7 (Phases 3-9) |
