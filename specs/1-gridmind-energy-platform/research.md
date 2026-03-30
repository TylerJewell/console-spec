# Research: GridMind Energy Platform

## R-1: Mock Data Architecture Pattern

**Decision**: Centralized in-memory store with domain-specific generator modules

**Rationale**: A single `MockDataEngine` class manages all state, with separate generator functions per domain (grid, trading, forecast, anomaly, asset, dispatch). This keeps data generation logic isolated while allowing cross-domain references (e.g., dispatch plans reference asset generators, anomalies reference sectors). Using a class-based store with getter/setter methods enables TanStack Query to treat it as a "server" -- query functions read from the store, mutations write to it, and `queryClient.invalidateQueries()` triggers re-renders.

**Alternatives considered**:
- Separate stores per domain: Rejected because cross-domain references (anomalies referencing sectors, dispatch plans referencing generators) require shared state
- Redux/Zustand global store: Rejected because TanStack Query already provides cache/invalidation; adding a second state layer creates unnecessary complexity
- Service Worker mock API: Rejected as over-engineered for in-memory mock data with no real HTTP needed

---

## R-2: Real-Time Data Refresh Strategy

**Decision**: `setInterval`-based timers within the MockDataEngine that mutate in-memory state, combined with TanStack Query `refetchInterval` on consuming queries

**Rationale**: The mock engine updates its internal state on configurable intervals (5s for telemetry, 10s for other domains). React components use TanStack Query's `refetchInterval` option to poll the in-memory store. This mimics a real API polling pattern while keeping the mock transparent.

**Configuration**:
- Grid telemetry: 5-second refresh (FR-11.2)
- Trading orders: 10-second refresh (status progression)
- Forecasts: 30-second refresh (new actuals arriving)
- Anomalies: 15-second refresh (new anomalies generated)
- Assets: 20-second refresh (health score drift)
- Dispatch: 10-second refresh (unit status changes)

**Alternatives considered**:
- WebSocket simulation: Rejected as overly complex for mock data; `refetchInterval` achieves the same UX
- React signals/atoms: Rejected to stay within TanStack Query patterns defined in UI-SPEC

---

## R-3: Routing Structure for TanStack Router

**Decision**: File-based routing mirroring the navigation tree, using layout routes for shared shells

**Rationale**: TanStack Router's file-based routing maps cleanly to the navigation hierarchy. Layout routes (`grid.tsx`, `trading.tsx`, etc.) provide shared headers/context for sub-routes. Dynamic segments (`$sectorId`, `$assetId`, `$planId`) handle detail pages.

**Route file structure**:
```
src/routes/
├── __root.tsx                          # Root layout (sidebar + main content area)
├── index.tsx                           # Dashboard
├── grid.tsx                            # Grid Monitoring layout
├── grid/
│   ├── index.tsx                       # Grid Overview (sector cards)
│   └── $sectorId.tsx                   # Sector detail
├── trading.tsx                         # Energy Trading layout
├── trading/
│   ├── orders.tsx                      # Orders table
│   ├── positions.tsx                   # Positions summary
│   └── new-order.tsx                   # New order form
├── forecasting.tsx                     # Forecasting layout
├── forecasting/
│   ├── demand.tsx                      # Demand forecasts
│   ├── solar.tsx                       # Solar generation forecasts
│   ├── wind.tsx                        # Wind generation forecasts
│   └── price.tsx                       # Price forecasts
├── anomalies.tsx                       # Anomalies layout
├── anomalies/
│   ├── active.tsx                      # Active anomalies
│   ├── resolved.tsx                    # Resolved anomalies
│   └── all.tsx                         # All anomalies
├── assets.tsx                          # Assets layout
├── assets/
│   ├── inventory.tsx                   # Asset inventory table
│   ├── inventory/$assetId.tsx          # Asset detail
│   ├── work-orders.tsx                 # Work orders table
│   └── health.tsx                      # Health overview cards
├── dispatch.tsx                        # Dispatch layout
└── dispatch/
    ├── active.tsx                      # Active plans table
    ├── history.tsx                     # Plan history table
    ├── $planId.tsx                     # Plan detail
    └── new.tsx                         # New plan form
```

**Alternatives considered**:
- Flat route structure with `_layout` files: Less readable for a deep navigation tree
- Next.js App Router: UI-SPEC specifies TanStack Router; Next.js is used only by the cloud console

---

## R-4: Theme Implementation

**Decision**: `next-themes` compatible theme provider with Tailwind CSS dark mode class strategy

**Rationale**: UI-SPEC uses HeroUI's theme system with `dark:` Tailwind variants. The theme provider adds/removes a `dark` class on the root HTML element. Theme state is persisted in `localStorage`. Since this is a standalone Vite app (not Next.js), we use a lightweight theme provider that mimics the `next-themes` API (or use `next-themes` directly as it works with any React app).

**Alternatives considered**:
- CSS media query only: Doesn't support manual override (Light/Dark/System toggle)
- Custom context-based theme: Unnecessary when `next-themes` + Tailwind `dark:` is already proven in the kalix-console codebase

---

## R-5: Form Handling with TanStack Form

**Decision**: TanStack Form (`@tanstack/react-form`) with inline field-level validation

**Rationale**: UI-SPEC specifies TanStack Form. Three forms are needed: New Order (4 fields), Work Order Creation (6 fields), and New Dispatch Plan (1 field + review step). Anomaly resolution uses a simpler controlled-component pattern inside a modal since it's 3 fields with no complex validation.

**Validation approach**:
- Field-level validators return error strings or undefined
- Errors display below inputs using the `FormErrors` pattern from kalix-console
- Form-level submit prevention when any field has errors
- Price/quantity ranges validated as numbers within bounds

**Alternatives considered**:
- React Hook Form: Not in UI-SPEC stack
- Zod schema validation: Adds dependency; inline validators are sufficient for the form complexity

---

## R-6: Table Sorting and Filtering

**Decision**: Client-side sorting and filtering with React state, no server-side pagination

**Rationale**: All data is in-memory (max ~100 rows per table), so client-side operations are instantaneous. Filter state is managed as React `useState` hooks in the table container component. Sort state is column + direction, toggled on column header click. This avoids adding a table library while keeping the implementation simple.

**Alternatives considered**:
- TanStack Table: Full-featured but heavy for our simple needs; would diverge from kalix-console's custom `Table` components
- URL-based filter state: Nice-to-have but not required by spec; adds complexity for no user benefit in a local console

---

## R-7: Toast Notification Integration

**Decision**: `sonner` library matching kalix-console's Toast component pattern

**Rationale**: UI-SPEC documents Toast using `sonner` with custom rendering. We replicate the same `pushToast()` function pattern with variant-based coloring and persistent/auto-dismiss behavior.

**Alternatives considered**:
- Custom toast implementation: Why rebuild when `sonner` is already the established choice
- React-toastify: Different API pattern from kalix-console

---

## R-8: Mock Data Seeding Strategy

**Decision**: Deterministic initial seed with randomized ongoing updates

**Rationale**: On app startup, the MockDataEngine generates a fixed set of initial data:
- 5 grid sectors with baseline telemetry values
- 50-100 historical trade orders across all statuses
- 24h of forecast data (24 entries x 4 types x 5 regions = 480 forecast rows)
- 15-25 anomalies across all severities and statuses
- 30-50 assets across all types and sectors
- 10-20 work orders across all statuses
- 3-5 dispatch plans across all statuses
- 6 agent status records

After seeding, interval-based updates add small perturbations to create the illusion of live data.

**Alternatives considered**:
- Lazy generation on first query: Creates visible loading on every first navigation; seeding upfront is better UX
- JSON fixture files: Adds file I/O complexity; inline generation is simpler and more flexible

---

## R-9: Project Structure (Single App vs Monorepo)

**Decision**: Single Vite app (not a monorepo) with feature-based folder organization

**Rationale**: The kalix-console uses a monorepo because it shares components between cloud and local console apps. GridMind is a standalone app with no sharing requirement, so a monorepo adds unnecessary complexity. We use a flat `src/` structure with `features/`, `components/`, `routes/`, and `mock/` directories.

**Alternatives considered**:
- Monorepo mirroring kalix-console: Over-engineered for a single app
- Feature-sliced design: Too prescriptive for a UI exercise project

---

## R-10: Icon Strategy

**Decision**: Lucide React icons for a comprehensive, tree-shakeable icon set

**Rationale**: UI-SPEC says "Custom SVG icon components (no icon library dependency)" for the kalix-console. However, GridMind needs 30+ distinct icons (sector status, fuel types, agent domains, navigation, actions). Creating 30+ custom SVGs is prohibitive. Lucide React provides MIT-licensed, tree-shakeable SVG icons that render as React components with `className` props, matching the `IconComponentType` pattern. We wrap them in a local `Icons/` module to maintain the same interface.

**Alternatives considered**:
- Hand-drawn SVGs: Too time-intensive for 30+ icons
- Heroicons: Fewer domain-specific icons (no energy/grid icons)
- Unicode/emoji: Inconsistent rendering across platforms; unprofessional for an operations console
