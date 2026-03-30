# Data Model: GridMind Energy Platform

## Overview

All entities are TypeScript interfaces stored in-memory within the `MockDataEngine`. There is no database; the engine holds arrays/maps of these types and exposes getter/mutation functions that TanStack Query treats as API calls.

---

## Entity Relationship Diagram

```
AgentStatus (6 records, one per agent)
    │
    ├── GridWatch ──► GridSector (5 sectors)
    │                     │
    │                     └──► GridEvent[] (per sector)
    │
    ├── VoltTrader ──��� TradeOrder[] ──► PortfolioPosition (computed)
    │
    ├── ForecastIQ ──► Forecast[] (by type + region)
    │
    ├── Sentinel ──► Anomaly[]
    │
    ├── AssetGuard ──► Asset[]
    │                     │
    │                     ├──► Alert[] (embedded)
    │                     └──► WorkOrder[] (by assetId)
    │
    └── DispatchOptimizer ──► DispatchPlan[]
                                  │
                                  └──► DispatchUnit[] (embedded)
                                           │
                                           └──► references Asset (generatorId)
```

---

## Enumerations

### SectorStatus
```typescript
type SectorStatus = 'normal' | 'warning' | 'critical' | 'blackout';
```

### GridEventType
```typescript
type GridEventType = 'frequency_deviation' | 'voltage_sag' | 'overload' | 'equipment_trip' | 'line_fault';
```

### GridEventSeverity
```typescript
type GridEventSeverity = 'info' | 'warning' | 'critical';
```

### OrderType
```typescript
type OrderType = 'buy' | 'sell';
```

### Market
```typescript
type Market = 'spot' | 'day_ahead';
```

### OrderStatus
```typescript
type OrderStatus = 'pending' | 'open' | 'filled' | 'partially_filled' | 'cancelled' | 'expired';
```

### ForecastType
```typescript
type ForecastType = 'demand' | 'solar' | 'wind' | 'price';
```

### AnomalyType
```typescript
type AnomalyType = 'frequency_deviation' | 'voltage_anomaly' | 'load_spike' | 'price_manipulation' | 'asset_degradation' | 'cyber_intrusion';
```

### AnomalySeverity
```typescript
type AnomalySeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';
```

### AnomalyStatus
```typescript
type AnomalyStatus = 'new' | 'investigating' | 'resolved' | 'false_positive';
```

### AssetType
```typescript
type AssetType = 'generator' | 'transformer' | 'transmission_line' | 'substation' | 'solar_panel' | 'wind_turbine';
```

### AssetStatus
```typescript
type AssetStatus = 'online' | 'offline' | 'degraded' | 'maintenance';
```

### AlertSeverity
```typescript
type AlertSeverity = 'info' | 'warning' | 'critical';
```

### WorkOrderType
```typescript
type WorkOrderType = 'preventive' | 'corrective' | 'emergency';
```

### Priority
```typescript
type Priority = 'low' | 'medium' | 'high' | 'critical';
```

### WorkOrderStatus
```typescript
type WorkOrderStatus = 'scheduled' | 'in_progress' | 'completed' | 'deferred';
```

### FuelType
```typescript
type FuelType = 'gas' | 'coal' | 'nuclear' | 'solar' | 'wind' | 'hydro';
```

### DispatchPlanStatus
```typescript
type DispatchPlanStatus = 'draft' | 'optimizing' | 'approved' | 'active' | 'completed';
```

### DispatchUnitStatus
```typescript
type DispatchUnitStatus = 'dispatched' | 'standby' | 'ramping_up' | 'ramping_down' | 'offline';
```

### AgentOperationalStatus
```typescript
type AgentOperationalStatus = 'active' | 'idle' | 'processing';
```

---

## Entity Definitions

### GridSector

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | string | Yes | One of: north, south, east, west, central | Unique sector identifier |
| name | string | Yes | Non-empty | Display name (e.g., "North Sector") |
| frequency | number | Yes | 58.0 - 62.0 | Current frequency in Hz |
| voltage | number | Yes | 100.0 - 500.0 | Current voltage in kV |
| load | number | Yes | >= 0 | Current load in MW |
| capacity | number | Yes | > 0 | Maximum capacity in MW |
| status | SectorStatus | Yes | Valid enum | Derived from frequency/load |
| lastUpdated | string (ISO 8601) | Yes | Valid datetime | Last telemetry timestamp |

**State transitions** for `status`:
- `normal` -> `warning` (when frequency drifts > 0.3 Hz from 60 or load > 80% capacity)
- `warning` -> `critical` (when frequency drifts > 0.5 Hz from 60 or load > 95% capacity)
- `critical` -> `blackout` (when frequency drifts > 1.0 Hz from 60 or load > 100% capacity)
- Any state -> `normal` (when conditions return to safe ranges)

### GridEvent

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | string | Yes | UUID format | Unique event identifier |
| sectorId | string | Yes | Valid sector ID | Parent sector reference |
| type | GridEventType | Yes | Valid enum | Event classification |
| severity | GridEventSeverity | Yes | Valid enum | Event severity |
| description | string | Yes | Non-empty | Human-readable description |
| timestamp | string (ISO 8601) | Yes | Valid datetime | Event occurrence time |

**Relationship**: Many-to-one with GridSector (via sectorId)

### TradeOrder

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | string | Yes | UUID format | Unique order identifier |
| type | OrderType | Yes | Valid enum | Buy or sell |
| market | Market | Yes | Valid enum | Trading market |
| price | number | Yes | 0.01 - 500.00 | Price in $/MWh |
| quantity | number | Yes | 0.1 - 10000 | Quantity in MWh |
| filledQuantity | number | Yes | 0 to quantity | Amount filled |
| status | OrderStatus | Yes | Valid enum | Current order status |
| counterparty | string | Yes | Non-empty | Counterparty name |
| createdAt | string (ISO 8601) | Yes | Valid datetime | Creation timestamp |
| updatedAt | string (ISO 8601) | Yes | Valid datetime | Last update timestamp |

**State transitions** for `status`:
- `pending` -> `open` (order accepted by market)
- `open` -> `filled` (quantity fully matched)
- `open` -> `partially_filled` (some quantity matched)
- `partially_filled` -> `filled` (remaining quantity matched)
- `open` | `partially_filled` -> `cancelled` (user/system cancellation)
- `open` | `partially_filled` -> `expired` (time-based expiration)

### PortfolioPosition (Computed, not stored)

| Field | Type | Description |
|-------|------|-------------|
| netPosition | number | Sum of filled buy quantities minus filled sell quantities |
| totalBought | number | Sum of all filled buy quantities |
| totalSold | number | Sum of all filled sell quantities |
| avgBuyPrice | number | Volume-weighted average price of filled buys |
| avgSellPrice | number | Volume-weighted average price of filled sells |
| realizedPnL | number | (avgSellPrice - avgBuyPrice) * min(totalBought, totalSold) |

**Note**: Computed on-the-fly from TradeOrder[] where status is `filled` or `partially_filled`.

### Forecast

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | string | Yes | UUID format | Unique forecast identifier |
| type | ForecastType | Yes | Valid enum | What is being forecast |
| region | string | Yes | Valid sector ID or "all" | Region scope |
| timestamp | string (ISO 8601) | Yes | Valid datetime | Forecast target time |
| predicted | number | Yes | >= 0 | Predicted value |
| actual | number or null | No | >= 0 or null | Observed actual (null if future) |
| confidenceLow | number | Yes | >= 0, <= predicted | Lower confidence bound |
| confidenceHigh | number | Yes | >= predicted | Upper confidence bound |
| accuracy | number or null | No | 0-100 or null | Accuracy % (null if no actual) |

**Accuracy calculation**: `100 - abs(actual - predicted) / predicted * 100`, clamped to 0-100.

### Anomaly

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | string | Yes | UUID format | Unique anomaly identifier |
| type | AnomalyType | Yes | Valid enum | Anomaly classification |
| severity | AnomalySeverity | Yes | Valid enum | Severity level |
| source | string | Yes | Non-empty | Originating agent/sector |
| description | string | Yes | Non-empty, max 500 chars | Detailed description |
| timestamp | string (ISO 8601) | Yes | Valid datetime | Detection time |
| status | AnomalyStatus | Yes | Valid enum | Resolution status |
| assignedTo | string or null | No | -- | Assignee name |
| resolutionNotes | string or null | No | Max 1000 chars | Resolution notes |
| resolvedAt | string (ISO 8601) or null | No | Valid datetime or null | Resolution time |

**State transitions** for `status`:
- `new` -> `investigating` (assigned for review)
- `new` | `investigating` -> `resolved` (issue confirmed and addressed)
- `new` | `investigating` -> `false_positive` (determined not a real issue)

### Asset

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | string | Yes | UUID format | Unique asset identifier |
| name | string | Yes | Non-empty | Display name |
| type | AssetType | Yes | Valid enum | Asset classification |
| location | string | Yes | Valid sector ID | Sector location |
| status | AssetStatus | Yes | Valid enum | Operational status |
| healthScore | number | Yes | 0 - 100 | Health percentage |
| lastInspection | string (ISO 8601 date) | Yes | Valid date | Last inspection |
| nextMaintenance | string (ISO 8601 date) | Yes | Valid date | Next maintenance |
| efficiency | number | Yes | 0 - 100 | Efficiency percentage |
| ageYears | number | Yes | >= 0 | Asset age |
| alerts | Alert[] | Yes | Valid array | Embedded alerts |

### Alert (Embedded in Asset)

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | string | Yes | UUID format | Alert identifier |
| message | string | Yes | Non-empty | Alert description |
| severity | AlertSeverity | Yes | Valid enum | Alert severity |
| timestamp | string (ISO 8601) | Yes | Valid datetime | Alert time |

### WorkOrder

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | string | Yes | UUID format | Unique work order ID |
| assetId | string | Yes | Valid asset ID | Related asset |
| assetName | string | Yes | Non-empty | Asset display name (denormalized) |
| type | WorkOrderType | Yes | Valid enum | Maintenance type |
| priority | Priority | Yes | Valid enum | Priority level |
| status | WorkOrderStatus | Yes | Valid enum | Work order status |
| scheduledDate | string (ISO 8601 date) | Yes | Valid date | Scheduled date |
| technician | string | Yes | Non-empty | Assigned technician |
| notes | string | Yes | Max 1000 chars | Description/notes |
| createdAt | string (ISO 8601) | Yes | Valid datetime | Creation time |
| completedAt | string (ISO 8601) or null | No | Valid datetime or null | Completion time |

**Relationship**: Many-to-one with Asset (via assetId)

**State transitions** for `status`:
- `scheduled` -> `in_progress` (work begins)
- `in_progress` -> `completed` (work finished)
- `scheduled` -> `deferred` (postponed)
- `deferred` -> `scheduled` (rescheduled)

### DispatchPlan

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | string | Yes | UUID format | Unique plan identifier |
| createdAt | string (ISO 8601) | Yes | Valid datetime | Creation time |
| demandTarget | number | Yes | 100 - 5000 | Target demand in MW |
| totalCost | number | Yes | >= 0 | Total cost in dollars |
| status | DispatchPlanStatus | Yes | Valid enum | Plan lifecycle status |
| units | DispatchUnit[] | Yes | Non-empty array | Dispatch allocations |

**State transitions** for `status`:
- `draft` -> `optimizing` (optimization started)
- `optimizing` -> `draft` (optimization completed, awaiting review)
- `draft` -> `approved` (operator approves plan)
- `approved` -> `active` (plan activated for execution)
- `active` -> `completed` (demand period ended)

### DispatchUnit (Embedded in DispatchPlan)

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| generatorId | string | Yes | Valid asset ID | Reference to generator asset |
| generatorName | string | Yes | Non-empty | Generator display name |
| fuelType | FuelType | Yes | Valid enum | Fuel classification |
| outputMw | number | Yes | 0 to maxCapacityMw | Dispatched output |
| maxCapacityMw | number | Yes | > 0 | Maximum capacity |
| marginalCost | number | Yes | >= 0 | $/MWh at this output |
| status | DispatchUnitStatus | Yes | Valid enum | Unit dispatch status |

### AgentStatus

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | string | Yes | Fixed set of 6 | Agent identifier |
| name | string | Yes | Non-empty | Display name |
| domain | string | Yes | Non-empty | Operational domain |
| status | AgentOperationalStatus | Yes | Valid enum | Current state |
| lastUpdated | string (ISO 8601) | Yes | Valid datetime | Last activity |
| description | string | Yes | Non-empty | Agent role description |

**Fixed records** (always exactly 6):
- `gridwatch` / "GridWatch" / "Grid Monitoring"
- `volttrader` / "VoltTrader" / "Energy Trading"
- `forecastiq` / "ForecastIQ" / "Demand Forecasting"
- `sentinel` / "Sentinel" / "Anomaly Detection"
- `assetguard` / "AssetGuard" / "Asset Management"
- `dispatch` / "DispatchOptimizer" / "Generation Dispatch"

---

## Semantic Color Mappings (for UI rendering)

These mappings define how entity enum values map to HeroUI color tokens:

### SectorStatus -> Color
| Value | Color | Animation |
|-------|-------|-----------|
| normal | success | None |
| warning | warning | pulse |
| critical | danger | pulse |
| blackout | default (foreground-500) | None |

### OrderStatus -> Color
| Value | Color |
|-------|-------|
| pending | warning |
| open | secondary |
| filled | success |
| partially_filled | primary |
| cancelled | danger |
| expired | danger |

### AnomalySeverity -> Color
| Value | Color |
|-------|-------|
| info | default |
| low | default |
| medium | secondary |
| high | warning |
| critical | danger |

### AnomalyStatus -> Color
| Value | Color |
|-------|-------|
| new | secondary |
| investigating | warning |
| resolved | success |
| false_positive | default |

### AssetStatus -> Color
| Value | Color | Animation |
|-------|-------|-----------|
| online | success | None |
| offline | danger | None |
| degraded | warning | pulse |
| maintenance | secondary | None |

### Priority -> Color
| Value | Color |
|-------|-------|
| low | default |
| medium | secondary |
| high | warning |
| critical | danger |

### WorkOrderStatus -> Color
| Value | Color |
|-------|-------|
| scheduled | secondary |
| in_progress | primary |
| completed | success |
| deferred | warning |

### FuelType -> Color
| Value | Color |
|-------|-------|
| gas | default |
| coal | default |
| nuclear | secondary |
| solar | primary |
| wind | success |
| hydro | secondary |

### DispatchPlanStatus -> Color
| Value | Color |
|-------|-------|
| draft | default |
| optimizing | secondary |
| approved | primary |
| active | success |
| completed | default |

### DispatchUnitStatus -> Color
| Value | Color | Animation |
|-------|-------|-----------|
| dispatched | success | None |
| standby | default | None |
| ramping_up | primary | spin-slow |
| ramping_down | warning | spin-slow |
| offline | danger | None |

### AccuracyScore -> Color + Label
| Range | Color | Label |
|-------|-------|-------|
| >= 90 | success | Excellent |
| 75-89 | secondary | Good |
| 60-74 | warning | Fair |
| < 60 | danger | Poor |

### HealthScore -> Color
| Range | Color |
|-------|-------|
| > 80 | success |
| 50-80 | warning |
| < 50 | danger |

### AgentOperationalStatus -> Color
| Value | Color | Animation |
|-------|-------|-----------|
| active | success | None |
| idle | default | None |
| processing | secondary | spin-slow |
