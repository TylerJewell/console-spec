# Mock API Contract: GridMind Energy Platform

## Overview

The MockDataEngine exposes an in-memory API surface that TanStack Query hooks consume. These are not HTTP endpoints -- they are synchronous or async TypeScript functions that read/write in-memory state. This contract defines the interface so that UI components and mock data layer can be developed independently.

---

## Grid Monitoring API

### `getGridSectors(): GridSector[]`
Returns all 5 grid sectors with current telemetry.

### `getGridSector(sectorId: string): GridSector | undefined`
Returns a single sector by ID.

### `getGridEvents(sectorId: string): GridEvent[]`
Returns all events for a sector, sorted by timestamp descending.

### `getAllGridEvents(): GridEvent[]`
Returns all events across all sectors, sorted by timestamp descending.

---

## Energy Trading API

### `getTradeOrders(filters?: OrderFilters): TradeOrder[]`
Returns trade orders, optionally filtered.

```typescript
interface OrderFilters {
  market?: Market;
  type?: OrderType;
  status?: OrderStatus;
  sortBy?: keyof TradeOrder;
  sortDirection?: 'asc' | 'desc';
}
```

### `getPortfolioPosition(): PortfolioPosition`
Returns computed portfolio position from filled/partially-filled orders.

### `createTradeOrder(order: CreateOrderInput): TradeOrder`
Creates a new order. Returns the created order with `status: 'pending'`.

```typescript
interface CreateOrderInput {
  type: OrderType;
  market: Market;
  price: number;    // 0.01 - 500.00
  quantity: number;  // 0.1 - 10000
}
```

**Validation errors**: Throws `ValidationError` with field-level messages if inputs are out of range.

---

## Forecasting API

### `getForecasts(filters?: ForecastFilters): Forecast[]`
Returns forecasts, optionally filtered.

```typescript
interface ForecastFilters {
  type?: ForecastType;
  region?: string;          // sector ID or 'all'
  hoursAhead?: 6 | 12 | 24;
}
```

---

## Anomaly Detection API

### `getAnomalies(filters?: AnomalyFilters): Anomaly[]`
Returns anomalies, optionally filtered.

```typescript
interface AnomalyFilters {
  status?: AnomalyStatus | AnomalyStatus[];
  severity?: AnomalySeverity;
  type?: AnomalyType;
  sortBy?: keyof Anomaly;
  sortDirection?: 'asc' | 'desc';
}
```

### `getAnomaly(id: string): Anomaly | undefined`
Returns a single anomaly by ID.

### `updateAnomaly(id: string, update: AnomalyUpdate): Anomaly`
Updates an anomaly's resolution fields. Returns updated anomaly.

```typescript
interface AnomalyUpdate {
  status: AnomalyStatus;
  assignedTo?: string;
  resolutionNotes?: string;
}
```

### `getCriticalAnomalyCount(): number`
Returns count of anomalies with severity=critical and status in (new, investigating).

---

## Asset Management API

### `getAssets(filters?: AssetFilters): Asset[]`
Returns assets, optionally filtered.

```typescript
interface AssetFilters {
  type?: AssetType;
  location?: string;
  status?: AssetStatus;
  sortBy?: keyof Asset;
  sortDirection?: 'asc' | 'desc';
}
```

### `getAsset(id: string): Asset | undefined`
Returns a single asset with embedded alerts.

### `getWorkOrders(filters?: WorkOrderFilters): WorkOrder[]`
Returns work orders, optionally filtered.

```typescript
interface WorkOrderFilters {
  assetId?: string;
  type?: WorkOrderType;
  priority?: Priority;
  status?: WorkOrderStatus;
}
```

### `createWorkOrder(order: CreateWorkOrderInput): WorkOrder`
Creates a new work order. Returns the created work order with `status: 'scheduled'`.

```typescript
interface CreateWorkOrderInput {
  assetId: string;
  type: WorkOrderType;
  priority: Priority;
  scheduledDate: string;  // ISO 8601 date
  technician: string;
  notes: string;
}
```

### `getHealthOverview(): HealthOverviewItem[]`
Returns aggregated health scores by asset type.

```typescript
interface HealthOverviewItem {
  assetType: AssetType;
  assetTypeLabel: string;
  count: number;
  averageHealthScore: number;
  onlineCount: number;
  offlineCount: number;
}
```

---

## Dispatch Optimization API

### `getDispatchPlans(filters?: PlanFilters): DispatchPlan[]`
Returns dispatch plans, optionally filtered.

```typescript
interface PlanFilters {
  status?: DispatchPlanStatus | DispatchPlanStatus[];
}
```

### `getDispatchPlan(id: string): DispatchPlan | undefined`
Returns a single plan with embedded dispatch units.

### `createDispatchPlan(input: CreatePlanInput): DispatchPlan`
Generates a new optimized dispatch plan. Returns a plan with `status: 'draft'` and units sorted by marginal cost.

```typescript
interface CreatePlanInput {
  demandTarget: number;  // 100 - 5000 MW
}
```

**Mock optimization logic**: Select generators in marginal cost order until cumulative output meets demand target. Cheapest generators dispatched first (renewable > nuclear > gas > coal).

### `approvePlan(id: string): DispatchPlan`
Transitions plan from `draft` to `approved`. Returns updated plan.

---

## Dashboard API

### `getDashboardMetrics(): DashboardMetrics`
Returns aggregated KPIs for the dashboard metric cards.

```typescript
interface DashboardMetrics {
  gridFrequency: { value: number; status: 'normal' | 'warning' | 'critical' };
  portfolioPnL: { value: number; isPositive: boolean };
  forecastAccuracy: { value: number; label: string };
  activeAnomalies: { count: number; highestSeverity: AnomalySeverity };
  fleetHealthScore: { value: number };
  dispatchCost: { value: number };
}
```

### `getRecentAnomalies(limit?: number): Anomaly[]`
Returns the N most recent anomalies (default 5).

### `getAgentStatuses(): AgentStatus[]`
Returns status records for all 6 agents.

---

## Event Notifications

The MockDataEngine emits events that the UI layer can subscribe to for toast notifications:

```typescript
interface MockDataEvents {
  onAnomalyDetected: (anomaly: Anomaly) => void;
  onOrderFilled: (order: TradeOrder) => void;
  onPlanApproved: (plan: DispatchPlan) => void;
  onCriticalEvent: (event: GridEvent) => void;
}
```

Implementation: Simple event emitter pattern. The root layout component subscribes on mount and fires `pushToast()` calls.
