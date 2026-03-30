# Quickstart: GridMind Energy Platform

## Prerequisites

- Node.js >= 22
- pnpm >= 9

## Setup

```bash
# From the project root (console/)
pnpm install
pnpm dev
```

The app will be available at `http://localhost:5173`.

## Key URLs

| Page | URL |
|------|-----|
| Dashboard | `/` |
| Grid Overview | `/grid` |
| Sector Detail | `/grid/north` (or south/east/west/central) |
| Trading Orders | `/trading/orders` |
| New Order | `/trading/new-order` |
| Positions | `/trading/positions` |
| Demand Forecasts | `/forecasting/demand` |
| Active Anomalies | `/anomalies/active` |
| Asset Inventory | `/assets/inventory` |
| Work Orders | `/assets/work-orders` |
| Health Overview | `/assets/health` |
| Active Dispatch Plans | `/dispatch/active` |
| New Dispatch Plan | `/dispatch/new` |

## Testing

```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
```

## Theme Toggle

Click the theme icon (sun/moon) in the header to switch between Light, Dark, and System themes.

## Mock Data

All data is generated in-memory on app startup. Refresh the browser to reset all data. Data auto-updates on configurable intervals to simulate real-time changes.
