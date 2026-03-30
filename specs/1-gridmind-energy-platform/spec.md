# GridMind: Multi-Agent Energy Grid Operations Platform

## Status: Draft

## 1. Overview

GridMind is a multi-agent energy grid operations platform that provides operators with a unified console for monitoring, managing, and optimizing electrical grid operations. The system coordinates six specialized agents -- each responsible for a distinct operational domain -- presenting their combined intelligence through a single, cohesive interface.

All agent behavior is simulated with realistic mock data held entirely in-memory, enabling rapid development iteration and comprehensive UI testing without external infrastructure dependencies.

### Problem Statement

Energy grid operators must currently switch between multiple disconnected tools to monitor grid health, execute trades, review forecasts, investigate anomalies, manage physical assets, and optimize generation dispatch. This fragmentation leads to slow decision-making, missed correlations between domains, and increased risk of operational errors.

### Solution

A single-pane-of-glass console that unifies six operational domains under one navigation hierarchy, applying consistent visual patterns (status indicators, severity chips, metric cards, data tables) so operators can rapidly assess grid state and take action without context-switching between tools.

### Target Users

- **Grid Operators**: Primary users who monitor real-time grid conditions and respond to events
- **Energy Traders**: Users who place and manage energy buy/sell orders
- **Maintenance Engineers**: Users who manage physical asset health and work orders
- **Operations Managers**: Users who review dashboards and KPIs across all domains

---

## 2. User Scenarios & Acceptance Criteria

### Scenario 1: Operator Reviews Grid Health at Shift Start

**As a** grid operator beginning a shift,
**I want to** see a consolidated dashboard of all six agent domains,
**so that** I can quickly assess overall grid status and prioritize my attention.

**Acceptance Criteria:**
- Dashboard displays six metric cards, one per agent, each showing a real-time KPI
- Grid Frequency card changes color when frequency deviates beyond +/-0.3 Hz from 60 Hz
- Active Anomalies card shows a count with the highest-severity color
- A table of the five most recent anomalies is visible below the metrics
- Agent status cards show whether each agent is active, idle, or processing
- All data auto-refreshes without requiring a page reload

### Scenario 2: Operator Investigates a Grid Sector

**As a** grid operator who notices a warning on a sector,
**I want to** drill into that sector's detailed telemetry and event history,
**so that** I can diagnose the root cause and determine if action is needed.

**Acceptance Criteria:**
- Sidebar navigation shows all five sectors (North, South, East, West, Central) under Grid Monitoring
- Sector detail page displays frequency, voltage, load, capacity, and status in a structured key-value layout
- An event log table shows all events for that sector, sorted by most recent first
- Events display timestamp, event type, severity, and description
- Sector status indicator animates for warning and critical states

### Scenario 3: Trader Places a New Energy Order

**As a** energy trader,
**I want to** create a new buy or sell order on the spot or day-ahead market,
**so that** I can execute my trading strategy.

**Acceptance Criteria:**
- A "New Order" page is accessible from the sidebar under Energy Trading
- The form includes fields for: market (spot/day-ahead), order type (buy/sell), price ($/MWh), and quantity (MWh)
- Price must be a positive number between 0 and 500
- Quantity must be a positive number between 0.1 and 10,000
- All fields show inline validation errors when invalid
- Submitting a valid order shows a success notification and the order appears in the Orders table
- Submitting with invalid data prevents submission and highlights erroneous fields

### Scenario 4: Trader Reviews Orders and Positions

**As a** energy trader,
**I want to** filter and sort my order history and review my current portfolio position,
**so that** I can track execution and manage exposure.

**Acceptance Criteria:**
- Orders table supports filtering by market, order type, and status
- Orders table supports sorting by any column
- Each order row displays a status chip with semantic coloring (green=filled, amber=pending, red=cancelled, blue=open, purple=partially-filled)
- Positions page shows a summary with net position, total bought, total sold, average price, and P&L
- P&L value is displayed in green when positive and red when negative

### Scenario 5: Operator Reviews Demand Forecasts

**As a** grid operator,
**I want to** review 24-hour demand, solar, wind, and price forecasts,
**so that** I can anticipate grid conditions and prepare resources.

**Acceptance Criteria:**
- Forecasting section offers four sub-pages: Demand, Solar Generation, Wind Generation, Price
- Each sub-page displays a table with: timestamp, predicted value, actual value (when available), confidence range (low-high), and accuracy score
- Accuracy is displayed as a colored badge: excellent (>=90%), good (75-89%), fair (60-74%), poor (<60%)
- A region filter allows narrowing forecasts to a specific sector
- A time-range filter allows selecting next 6h, 12h, or 24h windows
- Rows where actual values are not yet available show a muted placeholder

### Scenario 6: Operator Triages an Anomaly

**As a** grid operator,
**I want to** view active anomalies, investigate details, and record a resolution,
**so that** threats are acknowledged and tracked to closure.

**Acceptance Criteria:**
- Active anomalies page shows a table with severity chip, type chip, source, timestamp, status chip, and an action button
- A notice banner appears at the top of the page when any critical-severity anomalies exist
- Clicking the action button opens a detail modal showing all anomaly fields in a structured layout
- The modal includes a resolution form with: status dropdown (new/investigating/resolved/false-positive), notes text area, and assign-to field
- Saving the resolution form shows a success notification
- Resolved anomalies move to the Resolved sub-page
- All sub-pages (Active, Resolved, All) show the same table structure with appropriate status filtering

### Scenario 7: Maintenance Engineer Manages Assets

**As a** a maintenance engineer,
**I want to** review asset health, create work orders, and track maintenance schedules,
**so that** equipment is properly maintained and outages are prevented.

**Acceptance Criteria:**
- Asset Inventory table displays: name, type, sector, health score, status, and efficiency
- Health score is shown as a colored chip: green (>80), amber (50-80), red (<50)
- Clicking an asset row navigates to a detail page with breadcrumbs and full asset information
- Asset detail shows related work orders and alert history
- Work Orders table displays priority chips and status indicators
- A work order creation form (accessible from the Work Orders page) includes: asset selection, type (preventive/corrective/emergency), priority, scheduled date, technician assignment, and notes
- Health Overview page shows a card grid with average health score per asset type

### Scenario 8: Operator Creates and Approves a Dispatch Plan

**As a** grid operator,
**I want to** create an optimized generation dispatch plan and review the proposed unit allocations before approving,
**so that** demand is met at the lowest possible cost.

**Acceptance Criteria:**
- New Plan page includes a demand target input (MW)
- Submitting the demand target generates an optimized dispatch plan with units sorted by marginal cost (merit order)
- The review step shows a table of proposed dispatch units with: generator name, fuel type chip, output (MW), max capacity, marginal cost, and status indicator
- Plan detail page shows plan metadata in a structured layout plus the full merit order table
- Approving a plan moves it from draft to active status with a success notification
- Active Plans and Plan History pages show the same table structure filtered by status
- Each plan row shows status chips, total cost, and demand target

### Scenario 9: User Switches Theme and Navigates on Mobile

**As a** user on a mobile device or with a preference for dark mode,
**I want to** switch between light and dark themes and navigate using a responsive sidebar,
**so that** the application is comfortable to use in any environment.

**Acceptance Criteria:**
- A theme dropdown offers Light, Dark, and System options
- Theme selection persists across page navigation
- All pages render correctly in both light and dark themes with appropriate contrast
- On small screens, the sidebar collapses to a hamburger menu
- The hamburger menu opens a drawer overlay with full navigation
- The drawer closes when navigating to a new page or pressing Escape

### Scenario 10: User Experiences Loading and Empty States

**As a** user viewing any data page,
**I want to** see clear loading indicators while data is fetched and meaningful empty states when no data matches,
**so that** I understand the system state at all times.

**Acceptance Criteria:**
- All tables show animated skeleton rows while data is loading
- Tables display an error state with a danger-colored message when data fails to load
- When filters return no results, a contextual empty message is shown
- Toast notifications appear when agents detect notable events (anomaly detected, order filled, dispatch plan approved)

---

## 3. Functional Requirements

### FR-1: Dashboard

- **FR-1.1**: Display six metric cards in a responsive grid, one per agent domain
- **FR-1.2**: GridWatch card shows grid frequency in Hz, colored green (59.7-60.3), amber (59.5-59.7 or 60.3-60.5), red (<59.5 or >60.5)
- **FR-1.3**: VoltTrader card shows portfolio P&L with green (positive) or red (negative) coloring
- **FR-1.4**: ForecastIQ card shows overall forecast accuracy percentage with a colored badge
- **FR-1.5**: Sentinel card shows active anomaly count colored by highest severity present
- **FR-1.6**: AssetGuard card shows fleet-wide average health score percentage
- **FR-1.7**: DispatchOptimizer card shows active dispatch cost in $/MWh
- **FR-1.8**: Display a table of the five most recent anomalies with severity, type, source, and timestamp
- **FR-1.9**: Display agent status cards showing each agent's operational state (active/idle/processing) and last-updated timestamp
- **FR-1.10**: All dashboard data refreshes automatically on a configurable interval (default 5 seconds)

### FR-2: Grid Monitoring

- **FR-2.1**: Overview page displays sector cards in a responsive grid layout
- **FR-2.2**: Each sector card shows: sector name, status indicator (with animation for warning/critical), frequency, and load vs. capacity
- **FR-2.3**: Sector detail page displays a structured key-value layout with: frequency (Hz), voltage (kV), load (MW), capacity (MW), and status
- **FR-2.4**: Sector detail page includes an event log table with columns: timestamp, event type, severity, description
- **FR-2.5**: Events are sorted by timestamp descending (most recent first)
- **FR-2.6**: Sector status uses semantic colors: green (Normal), amber (Warning), red (Critical), muted (Blackout)
- **FR-2.7**: Mock telemetry updates every 5 seconds with realistic fluctuations around baseline values

### FR-3: Energy Trading

- **FR-3.1**: Orders page displays a data table with columns: ID, type, market, price, quantity, status, timestamp, counterparty
- **FR-3.2**: Orders table supports filtering by: market (spot/day-ahead), type (buy/sell), status (all statuses)
- **FR-3.3**: Orders table supports column sorting
- **FR-3.4**: Order status chips use semantic colors: green (filled), amber (pending), red (cancelled/expired), blue (open), purple (partially-filled)
- **FR-3.5**: Positions page displays a summary with: net position (MWh), total bought (MWh), total sold (MWh), average buy price, average sell price, realized P&L
- **FR-3.6**: P&L is displayed with green text when positive, red text when negative
- **FR-3.7**: New Order form includes: market select, type select, price input, quantity input
- **FR-3.8**: Price validation: required, numeric, range 0.01-500.00
- **FR-3.9**: Quantity validation: required, numeric, range 0.1-10000
- **FR-3.10**: Successful order submission shows a success toast and resets the form
- **FR-3.11**: Orders are generated in the mock data with realistic price distribution ($20-80/MWh for spot, $25-65/MWh for day-ahead)

### FR-4: Forecasting

- **FR-4.1**: Four sub-pages accessible from sidebar: Demand, Solar Generation, Wind Generation, Price
- **FR-4.2**: Each sub-page displays a table with columns: timestamp, predicted value, actual value, confidence low, confidence high, accuracy score
- **FR-4.3**: Accuracy badges: success color (>=90% "Excellent"), secondary color (75-89% "Good"), warning color (60-74% "Fair"), danger color (<60% "Poor")
- **FR-4.4**: Region filter dropdown with options: All, North, South, East, West, Central
- **FR-4.5**: Time range filter with options: Next 6h, Next 12h, Next 24h
- **FR-4.6**: Rows without actual values display a muted "Pending" indicator in the actual column
- **FR-4.7**: Mock forecasts use realistic ranges: demand 800-2400 MW, solar 0-600 MW (time-of-day dependent), wind 50-400 MW, price $20-80/MWh

### FR-5: Anomaly Detection

- **FR-5.1**: Active page displays anomalies filtered to status: new, investigating
- **FR-5.2**: Resolved page displays anomalies filtered to status: resolved, false-positive
- **FR-5.3**: All page displays all anomalies regardless of status
- **FR-5.4**: Anomaly table columns: severity chip, type chip, source, description (truncated), timestamp, status chip, actions
- **FR-5.5**: Severity chips use semantic colors: muted (info), default (low), secondary (medium), warning (high), danger (critical)
- **FR-5.6**: A notice banner appears at the top of Active and All pages when critical anomalies exist
- **FR-5.7**: Action button opens a detail modal displaying all anomaly fields in a structured key-value layout
- **FR-5.8**: Detail modal includes a resolution form: status dropdown, notes text area, assign-to text input
- **FR-5.9**: Saving the resolution updates the anomaly in-memory and shows a success toast
- **FR-5.10**: Mock data generates anomalies across all types and severity levels with realistic distribution (more info/low, fewer critical)

### FR-6: Asset Management

- **FR-6.1**: Inventory table columns: name, type, sector, health score chip, status indicator, efficiency percentage
- **FR-6.2**: Health score chip colors: success (>80), warning (50-80), danger (<50)
- **FR-6.3**: Asset types: generator, transformer, transmission line, substation, solar panel, wind turbine
- **FR-6.4**: Asset statuses with indicators: online (success), offline (danger), degraded (warning), maintenance (secondary)
- **FR-6.5**: Clicking an asset row navigates to a detail page
- **FR-6.6**: Asset detail page shows breadcrumbs (Assets > Inventory > {Asset Name})
- **FR-6.7**: Asset detail page displays all fields in a structured key-value layout: name, type, location, status, health score, last inspection, next maintenance, efficiency, age
- **FR-6.8**: Asset detail shows a related work orders table and alert history list
- **FR-6.9**: Work Orders table columns: ID, asset name, type chip, priority chip, status indicator, scheduled date, technician
- **FR-6.10**: Priority chips: default (low), secondary (medium), warning (high), danger (critical)
- **FR-6.11**: Work order creation form: asset select, type select (preventive/corrective/emergency), priority select, scheduled date input, technician input, notes text area
- **FR-6.12**: Health Overview page shows a card grid with one card per asset type displaying average health score

### FR-7: Dispatch Optimization

- **FR-7.1**: Active Plans page displays plans filtered to status: draft, optimizing, approved, active
- **FR-7.2**: Plan History page displays plans filtered to status: completed
- **FR-7.3**: Plans table columns: ID, timestamp, demand target (MW), total cost ($), status chip
- **FR-7.4**: Plan status chips: default (draft), secondary (optimizing), primary (approved), success (active), muted (completed)
- **FR-7.5**: Plan detail page shows plan metadata in a structured key-value layout
- **FR-7.6**: Plan detail includes a merit order table: generator name, fuel type chip, output MW, max capacity MW, marginal cost ($/MWh), unit status indicator
- **FR-7.7**: Fuel type chips: default (gas), muted (coal), secondary (nuclear), primary (solar), success (wind), secondary (hydro)
- **FR-7.8**: Unit statuses with indicators: dispatched (success), standby (default), ramping-up (primary, animated), ramping-down (warning, animated), offline (danger)
- **FR-7.9**: New Plan page: demand target input (MW, required, range 100-5000)
- **FR-7.10**: Submitting generates a mock-optimized plan with units sorted by marginal cost ascending
- **FR-7.11**: Review step displays proposed units before approval
- **FR-7.12**: Approving a plan transitions it from draft to approved status with a success toast

### FR-8: Navigation & Layout

- **FR-8.1**: Sidebar displays a tree navigation matching the hierarchy defined in the navigation structure
- **FR-8.2**: Active navigation items are highlighted with the primary brand color
- **FR-8.3**: Grid Monitoring section is expandable, showing sector sub-items when expanded
- **FR-8.4**: Navigation items show relevant icons per section
- **FR-8.5**: The application logo and name ("GridMind") appear at the top of the sidebar
- **FR-8.6**: On screens below the medium breakpoint, the sidebar collapses to a hamburger menu with a slide-in drawer
- **FR-8.7**: The drawer closes on navigation, Escape key, or backdrop click
- **FR-8.8**: Breadcrumbs appear on detail pages showing the navigation path

### FR-9: Theming

- **FR-9.1**: Theme dropdown in the header offers Light, Dark, and System options
- **FR-9.2**: Theme selection persists across navigation (stored in local storage or equivalent)
- **FR-9.3**: All pages and components render correctly in both light and dark themes
- **FR-9.4**: Color contrast meets accessibility standards in both themes

### FR-10: Loading & Feedback States

- **FR-10.1**: All data tables show skeleton loading rows while data is being fetched
- **FR-10.2**: Tables show an error row with danger-colored text when data fails to load
- **FR-10.3**: Filtered views with no results show a contextual empty message
- **FR-10.4**: Toast notifications fire for: anomaly detected (warning/danger), order filled (success), dispatch plan approved (success), resolution saved (success)
- **FR-10.5**: Toasts are persistent (require manual dismissal) for warning/danger variants and auto-dismiss after 6 seconds for success/info variants

### FR-11: Mock Data Engine

- **FR-11.1**: All data is generated and stored in-memory with no external dependencies
- **FR-11.2**: Grid telemetry updates on a 5-second interval with realistic fluctuations
- **FR-11.3**: Energy prices follow realistic distributions (spot: $20-80/MWh, day-ahead: $25-65/MWh)
- **FR-11.4**: Grid frequency fluctuates around 60 Hz with +/-0.5 Hz normal range
- **FR-11.5**: Asset health scores range from 0-100 with gradual degradation over mock time
- **FR-11.6**: Anomalies are generated with weighted severity distribution (info: 30%, low: 25%, medium: 20%, high: 15%, critical: 10%)
- **FR-11.7**: Forecast accuracy varies realistically (70-98% for demand, 50-90% for renewables, 60-95% for price)
- **FR-11.8**: The mock engine seeds initial data on application startup so all pages have content immediately
- **FR-11.9**: Configurable refresh intervals for each data domain

---

## 4. Key Entities

### GridSector
| Field | Type | Description |
|-------|------|-------------|
| id | string | Sector identifier (north, south, east, west, central) |
| name | string | Display name |
| frequency | number | Current frequency in Hz |
| voltage | number | Current voltage in kV |
| load | number | Current load in MW |
| capacity | number | Maximum capacity in MW |
| status | enum | Normal, Warning, Critical, Blackout |
| lastUpdated | datetime | Last telemetry update timestamp |

### GridEvent
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique event identifier |
| sectorId | string | Which sector this event belongs to |
| type | enum | frequency_deviation, voltage_sag, overload, equipment_trip, line_fault |
| severity | enum | info, warning, critical |
| description | string | Human-readable event description |
| timestamp | datetime | When the event occurred |

### TradeOrder
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique order identifier |
| type | enum | buy, sell |
| market | enum | spot, day_ahead |
| price | number | Price in $/MWh |
| quantity | number | Quantity in MWh |
| filledQuantity | number | Quantity filled so far |
| status | enum | pending, open, filled, partially_filled, cancelled, expired |
| counterparty | string | Trading counterparty name |
| createdAt | datetime | Order creation timestamp |
| updatedAt | datetime | Last status change timestamp |

### PortfolioPosition
| Field | Type | Description |
|-------|------|-------------|
| netPosition | number | Net MWh (positive = net buyer) |
| totalBought | number | Total MWh purchased |
| totalSold | number | Total MWh sold |
| avgBuyPrice | number | Volume-weighted average buy price |
| avgSellPrice | number | Volume-weighted average sell price |
| realizedPnL | number | Realized profit/loss in dollars |

### Forecast
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique forecast identifier |
| type | enum | demand, solar, wind, price |
| region | string | Sector/region this forecast applies to |
| timestamp | datetime | The time period being forecast |
| predicted | number | Predicted value |
| actual | number or null | Actual observed value (null if future) |
| confidenceLow | number | Lower bound of confidence interval |
| confidenceHigh | number | Upper bound of confidence interval |
| accuracy | number or null | Accuracy score 0-100 (null if no actual yet) |

### Anomaly
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique anomaly identifier |
| type | enum | frequency_deviation, voltage_anomaly, load_spike, price_manipulation, asset_degradation, cyber_intrusion |
| severity | enum | info, low, medium, high, critical |
| source | string | Originating agent or sector |
| description | string | Detailed anomaly description |
| timestamp | datetime | Detection timestamp |
| status | enum | new, investigating, resolved, false_positive |
| assignedTo | string or null | Person assigned to investigate |
| resolutionNotes | string or null | Notes from resolution |
| resolvedAt | datetime or null | Resolution timestamp |

### Asset
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique asset identifier |
| name | string | Asset display name |
| type | enum | generator, transformer, transmission_line, substation, solar_panel, wind_turbine |
| location | string | Sector where asset is located |
| status | enum | online, offline, degraded, maintenance |
| healthScore | number | Health score 0-100 |
| lastInspection | date | Last inspection date |
| nextMaintenance | date | Next scheduled maintenance date |
| efficiency | number | Operating efficiency percentage |
| ageYears | number | Asset age in years |
| alerts | Alert[] | Active alerts for this asset |

### Alert
| Field | Type | Description |
|-------|------|-------------|
| id | string | Alert identifier |
| message | string | Alert description |
| severity | enum | info, warning, critical |
| timestamp | datetime | When the alert was raised |

### WorkOrder
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique work order identifier |
| assetId | string | Related asset identifier |
| assetName | string | Related asset display name |
| type | enum | preventive, corrective, emergency |
| priority | enum | low, medium, high, critical |
| status | enum | scheduled, in_progress, completed, deferred |
| scheduledDate | date | When the work is scheduled |
| technician | string | Assigned technician name |
| notes | string | Work order notes/description |
| createdAt | datetime | Creation timestamp |
| completedAt | datetime or null | Completion timestamp |

### DispatchPlan
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique plan identifier |
| createdAt | datetime | Plan creation timestamp |
| demandTarget | number | Target demand to meet in MW |
| totalCost | number | Total estimated cost in dollars |
| status | enum | draft, optimizing, approved, active, completed |
| units | DispatchUnit[] | Generators in this plan |

### DispatchUnit
| Field | Type | Description |
|-------|------|-------------|
| generatorId | string | Reference to asset |
| generatorName | string | Generator display name |
| fuelType | enum | gas, coal, nuclear, solar, wind, hydro |
| outputMw | number | Dispatched output in MW |
| maxCapacityMw | number | Maximum generator capacity in MW |
| marginalCost | number | Cost per MWh at this output level |
| status | enum | dispatched, standby, ramping_up, ramping_down, offline |

### AgentStatus
| Field | Type | Description |
|-------|------|-------------|
| id | string | Agent identifier |
| name | string | Agent display name (GridWatch, VoltTrader, etc.) |
| domain | string | Agent's operational domain |
| status | enum | active, idle, processing |
| lastUpdated | datetime | Last activity timestamp |
| description | string | Brief description of agent's role |

---

## 5. Navigation Structure

```
GridMind
├── Dashboard
├── Grid Monitoring
│   ├── Overview
│   ├── Sector: North
│   ├── Sector: South
│   ├── Sector: East
│   ├── Sector: West
│   └── Sector: Central
├── Energy Trading
│   ├── Orders
│   ├── Positions
│   └── New Order
├── Forecasting
│   ├── Demand
│   ├── Solar Generation
│   ├── Wind Generation
│   └── Price
├── Anomalies
│   ├── Active
│   ├── Resolved
│   └── All
├── Assets
│   ├── Inventory
│   ├── Work Orders
│   └── Health Overview
└── Dispatch
    ├── Active Plans
    ├── Plan History
    └── New Plan
```

---

## 6. UI Components Exercised

This feature is designed to exercise the full breadth of the Akka Console design system:

| Component | Where Used |
|-----------|------------|
| Sidebar tree navigation | Main navigation with expandable sections |
| Card grid | Dashboard metrics, sector overview, health overview, agent status |
| Data table | Orders, forecasts, anomalies, assets, work orders, events, dispatch units |
| Table skeleton rows | All tables during loading |
| Table error row | All tables on fetch failure |
| Status indicator | Sector status, asset status, dispatch unit status, agent status |
| Description list | Sector detail, positions, asset detail, plan detail, anomaly detail |
| Chip/Badge | Order status, severity, priority, fuel type, accuracy, plan status |
| Form inputs | New order, work order creation, new dispatch plan, anomaly resolution |
| Form validation | Price/quantity ranges, required fields |
| Modal | Anomaly detail with resolution form |
| Toast notifications | Order submitted, anomaly detected, resolution saved, plan approved |
| Notice banner | Critical anomaly alert |
| Breadcrumbs | Asset detail pages |
| Theme dropdown | Header (light/dark/system) |
| Page header | Every page with title, optional icon, optional action buttons |
| Responsive drawer | Mobile sidebar navigation |
| Loading animations | Spin (loading), pulse (warning states), spin-slow (updating) |
| Scroll shadows | Wide tables with horizontal overflow |
| View transitions | Page-to-page navigation slides |

---

## 7. Success Criteria

1. **Operational awareness**: An operator can assess overall grid health across all six domains within 10 seconds of opening the dashboard
2. **Navigation efficiency**: Any page in the application is reachable within 3 clicks from the dashboard
3. **Order execution**: A trader can create and submit a valid energy order in under 30 seconds
4. **Anomaly resolution**: An operator can view anomaly details and submit a resolution in under 60 seconds
5. **Theme consistency**: All pages and components render correctly with appropriate contrast in both light and dark themes
6. **Responsive usability**: All core workflows are completable on screens as narrow as 375px (mobile)
7. **Loading transparency**: Users never see a blank page; all data areas show skeleton or loading states within 100ms of navigation
8. **Component coverage**: The application exercises at least 15 distinct UI component types from the design system
9. **Data realism**: Mock data values fall within realistic energy sector ranges (frequency 59.5-60.5 Hz, prices $20-80/MWh, health scores 0-100)
10. **Feedback immediacy**: All user actions (form submission, filter change, resolution save) produce visible feedback within 500ms

---

## 8. Assumptions

- The application is a single-page application running entirely in the browser with no backend server required
- All mock data is generated client-side in JavaScript/TypeScript and stored in memory
- Data generation uses pseudo-random values seeded on application startup for reproducibility
- The application targets modern browsers (Chrome, Firefox, Safari, Edge -- latest two versions)
- No authentication or authorization is required (single-user local console)
- No data persistence across page refreshes (data resets on reload with fresh mock generation)
- Refresh intervals are configurable but default to 5 seconds for telemetry and 10 seconds for other domains
- The application will follow the tech stack and design tokens defined in UI-SPEC.md
- All monetary values are displayed in USD
- Grid frequency baseline is 60 Hz (North American standard)
- The navigation tree structure is static (not dynamically generated from data)
- Asset count for mock data: approximately 30-50 assets across all types
- Trade order count for mock data: approximately 50-100 historical orders
- Forecast entries: 24 entries per type per region (one per hour, 24-hour window)

---

## 9. Out of Scope

- Real-time data integration with actual grid telemetry systems (SCADA, EMS)
- Authentication, authorization, or multi-user support
- Data persistence to a database or filesystem
- Backend API server
- Real energy trading execution or market integration
- Actual machine learning models for forecasting or anomaly detection
- Print layouts or PDF export
- Internationalization or localization (English only)
- Accessibility beyond standard semantic HTML and keyboard navigation
- Performance optimization for datasets exceeding 10,000 records
- Browser notification API integration (toast-only notifications)

---

## 10. Dependencies

- UI-SPEC.md design system specification (located in project root)
- No external API dependencies (all data mocked in-memory)
- No database dependencies
- No third-party service integrations
