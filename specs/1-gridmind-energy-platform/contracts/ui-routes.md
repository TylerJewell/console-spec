# UI Route Contract: GridMind Energy Platform

## Overview

Defines every route in the application, its URL path, the page component it renders, and what data it requires. This contract ensures navigation, routing, and component development can proceed in parallel.

---

## Route Table

| Path | Component | Layout | Data Dependencies | Key UI Components |
|------|-----------|--------|-------------------|-------------------|
| `/` | DashboardPage | RootLayout | getDashboardMetrics, getRecentAnomalies, getAgentStatuses | MetricCard x6, Table, StatusCard x6 |
| `/grid` | GridLayout | RootLayout | -- | -- (layout only) |
| `/grid/` | GridOverviewPage | GridLayout | getGridSectors | SectorCard x5 (Card grid) |
| `/grid/$sectorId` | SectorDetailPage | GridLayout | getGridSector, getGridEvents | DescriptionList, Table |
| `/trading` | TradingLayout | RootLayout | -- | -- (layout only) |
| `/trading/orders` | OrdersPage | TradingLayout | getTradeOrders | Table, FilterBar, Chips |
| `/trading/positions` | PositionsPage | TradingLayout | getPortfolioPosition | DescriptionList, PnL card |
| `/trading/new-order` | NewOrderPage | TradingLayout | createTradeOrder (mutation) | Form (4 fields), validation |
| `/forecasting` | ForecastingLayout | RootLayout | -- | -- (layout only) |
| `/forecasting/demand` | ForecastDemandPage | ForecastingLayout | getForecasts(type=demand) | Table, FilterDropdowns, Chips |
| `/forecasting/solar` | ForecastSolarPage | ForecastingLayout | getForecasts(type=solar) | Table, FilterDropdowns, Chips |
| `/forecasting/wind` | ForecastWindPage | ForecastingLayout | getForecasts(type=wind) | Table, FilterDropdowns, Chips |
| `/forecasting/price` | ForecastPricePage | ForecastingLayout | getForecasts(type=price) | Table, FilterDropdowns, Chips |
| `/anomalies` | AnomaliesLayout | RootLayout | -- | -- (layout only) |
| `/anomalies/active` | ActiveAnomaliesPage | AnomaliesLayout | getAnomalies(status=[new,investigating]), getCriticalAnomalyCount | Table, NoticeBanner, Modal, Chips |
| `/anomalies/resolved` | ResolvedAnomaliesPage | AnomaliesLayout | getAnomalies(status=[resolved,false_positive]) | Table, Chips |
| `/anomalies/all` | AllAnomaliesPage | AnomaliesLayout | getAnomalies(), getCriticalAnomalyCount | Table, NoticeBanner, Chips |
| `/assets` | AssetsLayout | RootLayout | -- | -- (layout only) |
| `/assets/inventory` | AssetInventoryPage | AssetsLayout | getAssets | Table, Chips, StatusIndicators |
| `/assets/inventory/$assetId` | AssetDetailPage | AssetsLayout | getAsset, getWorkOrders(assetId) | Breadcrumbs, DescriptionList, Table |
| `/assets/work-orders` | WorkOrdersPage | AssetsLayout | getWorkOrders | Table, Chips, Modal (create form) |
| `/assets/health` | HealthOverviewPage | AssetsLayout | getHealthOverview | Card grid (6 cards) |
| `/dispatch` | DispatchLayout | RootLayout | -- | -- (layout only) |
| `/dispatch/active` | ActivePlansPage | DispatchLayout | getDispatchPlans(status=[draft..active]) | Table, Chips |
| `/dispatch/history` | PlanHistoryPage | DispatchLayout | getDispatchPlans(status=completed) | Table, Chips |
| `/dispatch/$planId` | PlanDetailPage | DispatchLayout | getDispatchPlan | DescriptionList, Table (merit order), Chips |
| `/dispatch/new` | NewPlanPage | DispatchLayout | createDispatchPlan, approvePlan (mutations) | Form, Table (review), Button |

---

## Layout Hierarchy

```
RootLayout (__root.tsx)
├── Sidebar (PrimaryNav with tree navigation)
├── Header (Logo + actions + ThemeDropdown)
└── Main content area (outlet)
    ├── DashboardPage (index.tsx)
    ├── GridLayout (grid.tsx)
    │   └── outlet -> GridOverviewPage | SectorDetailPage
    ├── TradingLayout (trading.tsx)
    │   └── outlet -> OrdersPage | PositionsPage | NewOrderPage
    ├── ForecastingLayout (forecasting.tsx)
    │   └── outlet -> Demand | Solar | Wind | Price pages
    ├── AnomaliesLayout (anomalies.tsx)
    │   └── outlet -> Active | Resolved | All pages
    ├── AssetsLayout (assets.tsx)
    │   └── outlet -> Inventory | AssetDetail | WorkOrders | Health
    └── DispatchLayout (dispatch.tsx)
        └── outlet -> Active | History | PlanDetail | New
```

---

## Navigation Sidebar Structure

```typescript
const navigationItems = [
  { title: "Dashboard", icon: DashboardIcon, to: "/" },
  {
    title: "Grid Monitoring", icon: GridIcon, isExpandable: true,
    children: [
      { title: "Overview", to: "/grid" },
      { title: "North", to: "/grid/north" },
      { title: "South", to: "/grid/south" },
      { title: "East", to: "/grid/east" },
      { title: "West", to: "/grid/west" },
      { title: "Central", to: "/grid/central" },
    ]
  },
  {
    title: "Energy Trading", icon: TradingIcon, isExpandable: true,
    children: [
      { title: "Orders", to: "/trading/orders" },
      { title: "Positions", to: "/trading/positions" },
      { title: "New Order", to: "/trading/new-order" },
    ]
  },
  {
    title: "Forecasting", icon: ForecastIcon, isExpandable: true,
    children: [
      { title: "Demand", to: "/forecasting/demand" },
      { title: "Solar Generation", to: "/forecasting/solar" },
      { title: "Wind Generation", to: "/forecasting/wind" },
      { title: "Price", to: "/forecasting/price" },
    ]
  },
  {
    title: "Anomalies", icon: AnomalyIcon, isExpandable: true,
    children: [
      { title: "Active", to: "/anomalies/active" },
      { title: "Resolved", to: "/anomalies/resolved" },
      { title: "All", to: "/anomalies/all" },
    ]
  },
  {
    title: "Assets", icon: AssetIcon, isExpandable: true,
    children: [
      { title: "Inventory", to: "/assets/inventory" },
      { title: "Work Orders", to: "/assets/work-orders" },
      { title: "Health Overview", to: "/assets/health" },
    ]
  },
  {
    title: "Dispatch", icon: DispatchIcon, isExpandable: true,
    children: [
      { title: "Active Plans", to: "/dispatch/active" },
      { title: "Plan History", to: "/dispatch/history" },
      { title: "New Plan", to: "/dispatch/new" },
    ]
  },
];
```
