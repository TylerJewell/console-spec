import type { GridSector, GridEvent } from "@/types/grid";
import type { TradeOrder, PortfolioPosition, OrderFilters, CreateOrderInput } from "@/types/trading";
import type { Forecast, ForecastFilters } from "@/types/forecasting";
import type { Anomaly, AnomalyFilters, AnomalyUpdate, AnomalySeverity } from "@/types/anomalies";
import type { Asset, AssetFilters, WorkOrder, WorkOrderFilters, CreateWorkOrderInput, HealthOverviewItem, AssetType } from "@/types/assets";
import type { DispatchPlan, PlanFilters, CreatePlanInput } from "@/types/dispatch";
import type { AgentStatus } from "@/types/agents";
import type { DashboardMetrics } from "@/types/dashboard";

import { seedGridSectors, seedGridEvents, updateSectorTelemetry, generateGridEvent } from "./generators/grid";
import { seedTradeOrders, computePortfolioPosition, progressOrders, createTradeOrder } from "./generators/trading";
import { seedForecasts } from "./generators/forecasting";
import { seedAnomalies, generateNewAnomaly } from "./generators/anomalies";
import { seedAssets, seedWorkOrders, createWorkOrder as createWO } from "./generators/assets";
import { seedDispatchPlans, generateOptimizedPlan } from "./generators/dispatch";
import { seedAgentStatuses } from "./generators/agents";

// ---------------------------------------------------------------------------
// Event emitter types
// ---------------------------------------------------------------------------

type EventName = "onAnomalyDetected" | "onOrderFilled" | "onPlanApproved" | "onCriticalEvent";
type EventCallback = (data: unknown) => void;

// ---------------------------------------------------------------------------
// Asset type labels
// ---------------------------------------------------------------------------

const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  generator: "Generators",
  transformer: "Transformers",
  transmission_line: "Transmission Lines",
  substation: "Substations",
  solar_panel: "Solar Panels",
  wind_turbine: "Wind Turbines",
};

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

export class MockDataEngine {
  // Data stores
  private sectors: GridSector[] = [];
  private gridEvents: GridEvent[] = [];
  private tradeOrders: TradeOrder[] = [];
  private forecasts: Forecast[] = [];
  private anomalies: Anomaly[] = [];
  private assets: Asset[] = [];
  private workOrders: WorkOrder[] = [];
  private dispatchPlans: DispatchPlan[] = [];
  private agentStatuses: AgentStatus[] = [];

  // Event emitter
  private listeners: Map<EventName, Set<EventCallback>> = new Map();

  // Interval handles
  private intervals: ReturnType<typeof setInterval>[] = [];

  constructor() {
    this.seed();
  }

  // -----------------------------------------------------------------------
  // Seed
  // -----------------------------------------------------------------------

  private seed(): void {
    this.sectors = seedGridSectors();
    this.gridEvents = seedGridEvents(this.sectors);
    this.tradeOrders = seedTradeOrders();
    this.forecasts = seedForecasts();
    this.anomalies = seedAnomalies();
    this.assets = seedAssets();
    this.workOrders = seedWorkOrders(this.assets);
    this.dispatchPlans = seedDispatchPlans();
    this.agentStatuses = seedAgentStatuses();
  }

  // -----------------------------------------------------------------------
  // Event emitter
  // -----------------------------------------------------------------------

  on(event: EventName, cb: EventCallback): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(cb);
  }

  off(event: EventName, cb: EventCallback): void {
    this.listeners.get(event)?.delete(cb);
  }

  private emit(event: EventName, data: unknown): void {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }

  // -----------------------------------------------------------------------
  // Intervals
  // -----------------------------------------------------------------------

  startIntervals(): void {
    // Telemetry refresh every 5s
    this.intervals.push(
      setInterval(() => {
        updateSectorTelemetry(this.sectors);

        // Possibly generate a grid event
        if (Math.random() < 0.3) {
          const event = generateGridEvent(this.sectors);
          this.gridEvents.unshift(event);
          if (this.gridEvents.length > 100) this.gridEvents.pop();
          if (event.severity === "critical") {
            this.emit("onCriticalEvent", event);
          }
        }
      }, 5000),
    );

    // Order progression every 8s
    this.intervals.push(
      setInterval(() => {
        const changed = progressOrders(this.tradeOrders);
        if (changed && changed.status === "filled") {
          this.emit("onOrderFilled", changed);
        }
      }, 8000),
    );

    // Anomaly generation every 15s
    this.intervals.push(
      setInterval(() => {
        if (Math.random() < 0.25) {
          const anomaly = generateNewAnomaly();
          this.anomalies.unshift(anomaly);
          if (this.anomalies.length > 50) this.anomalies.pop();
          this.emit("onAnomalyDetected", anomaly);
          if (anomaly.severity === "critical") {
            this.emit("onCriticalEvent", anomaly);
          }
        }
      }, 15000),
    );
  }

  stopIntervals(): void {
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals = [];
  }

  // -----------------------------------------------------------------------
  // Grid getters
  // -----------------------------------------------------------------------

  getGridSectors(): GridSector[] {
    return this.sectors;
  }

  getGridSector(id: string): GridSector | undefined {
    return this.sectors.find((s) => s.id === id);
  }

  getGridEvents(sectorId?: string, limit = 50): GridEvent[] {
    let events = this.gridEvents;
    if (sectorId) events = events.filter((e) => e.sectorId === sectorId);
    return events.slice(0, limit);
  }

  // -----------------------------------------------------------------------
  // Trading getters
  // -----------------------------------------------------------------------

  getTradeOrders(filters?: OrderFilters): TradeOrder[] {
    let orders = [...this.tradeOrders];

    if (filters?.market) orders = orders.filter((o) => o.market === filters.market);
    if (filters?.type) orders = orders.filter((o) => o.type === filters.type);
    if (filters?.status) orders = orders.filter((o) => o.status === filters.status);

    if (filters?.sortBy) {
      const key = filters.sortBy;
      const dir = filters.sortDirection === "asc" ? 1 : -1;
      orders.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (typeof aVal === "number" && typeof bVal === "number") return (aVal - bVal) * dir;
        return String(aVal).localeCompare(String(bVal)) * dir;
      });
    }

    return orders;
  }

  getPortfolioPosition(): PortfolioPosition {
    return computePortfolioPosition(this.tradeOrders);
  }

  createTradeOrder(input: CreateOrderInput): TradeOrder {
    const order = createTradeOrder(input);
    this.tradeOrders.unshift(order);
    return order;
  }

  // -----------------------------------------------------------------------
  // Forecasting getters
  // -----------------------------------------------------------------------

  getForecasts(filters?: ForecastFilters): Forecast[] {
    let data = [...this.forecasts];
    if (filters?.type) data = data.filter((f) => f.type === filters.type);
    if (filters?.region) data = data.filter((f) => f.region === filters.region);
    if (filters?.hoursAhead) {
      const cutoff = new Date(Date.now() + filters.hoursAhead * 3600000).getTime();
      const start = Date.now();
      data = data.filter((f) => {
        const t = new Date(f.timestamp).getTime();
        return t >= start && t <= cutoff;
      });
    }
    return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // -----------------------------------------------------------------------
  // Anomalies getters
  // -----------------------------------------------------------------------

  getAnomalies(filters?: AnomalyFilters): Anomaly[] {
    let data = [...this.anomalies];

    if (filters?.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      data = data.filter((a) => statuses.includes(a.status));
    }
    if (filters?.severity) data = data.filter((a) => a.severity === filters.severity);
    if (filters?.type) data = data.filter((a) => a.type === filters.type);

    if (filters?.sortBy) {
      const key = filters.sortBy;
      const dir = filters.sortDirection === "asc" ? 1 : -1;
      data.sort((a, b) => {
        const aVal = a[key] ?? "";
        const bVal = b[key] ?? "";
        if (typeof aVal === "number" && typeof bVal === "number") return (aVal - bVal) * dir;
        return String(aVal).localeCompare(String(bVal)) * dir;
      });
    }

    return data;
  }

  getAnomaly(id: string): Anomaly | undefined {
    return this.anomalies.find((a) => a.id === id);
  }

  updateAnomaly(id: string, update: AnomalyUpdate): Anomaly | undefined {
    const anomaly = this.anomalies.find((a) => a.id === id);
    if (!anomaly) return undefined;

    anomaly.status = update.status;
    if (update.assignedTo !== undefined) anomaly.assignedTo = update.assignedTo;
    if (update.resolutionNotes !== undefined) anomaly.resolutionNotes = update.resolutionNotes;
    if (update.status === "resolved" || update.status === "false_positive") {
      anomaly.resolvedAt = new Date().toISOString();
    }

    return anomaly;
  }

  getCriticalAnomalyCount(): number {
    return this.anomalies.filter(
      (a) => a.severity === "critical" && (a.status === "new" || a.status === "investigating"),
    ).length;
  }

  getRecentAnomalies(limit = 5): Anomaly[] {
    return this.anomalies.slice(0, limit);
  }

  // -----------------------------------------------------------------------
  // Assets getters
  // -----------------------------------------------------------------------

  getAssets(filters?: AssetFilters): Asset[] {
    let data = [...this.assets];

    if (filters?.type) data = data.filter((a) => a.type === filters.type);
    if (filters?.location) data = data.filter((a) => a.location === filters.location);
    if (filters?.status) data = data.filter((a) => a.status === filters.status);

    if (filters?.sortBy) {
      const key = filters.sortBy;
      const dir = filters.sortDirection === "asc" ? 1 : -1;
      data.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (typeof aVal === "number" && typeof bVal === "number") return (aVal - bVal) * dir;
        if (Array.isArray(aVal) || Array.isArray(bVal)) return 0;
        return String(aVal).localeCompare(String(bVal)) * dir;
      });
    }

    return data;
  }

  getAsset(id: string): Asset | undefined {
    return this.assets.find((a) => a.id === id);
  }

  getWorkOrders(filters?: WorkOrderFilters): WorkOrder[] {
    let data = [...this.workOrders];
    if (filters?.assetId) data = data.filter((w) => w.assetId === filters.assetId);
    if (filters?.type) data = data.filter((w) => w.type === filters.type);
    if (filters?.priority) data = data.filter((w) => w.priority === filters.priority);
    if (filters?.status) data = data.filter((w) => w.status === filters.status);
    return data;
  }

  createWorkOrder(input: CreateWorkOrderInput): WorkOrder {
    const order = createWO(input, this.assets);
    this.workOrders.unshift(order);
    return order;
  }

  getHealthOverview(): HealthOverviewItem[] {
    const typeSet = new Set(this.assets.map((a) => a.type));
    return Array.from(typeSet).map((assetType) => {
      const group = this.assets.filter((a) => a.type === assetType);
      const avgHealth = parseFloat(
        (group.reduce((s, a) => s + a.healthScore, 0) / group.length).toFixed(1),
      );
      return {
        assetType,
        assetTypeLabel: ASSET_TYPE_LABELS[assetType],
        count: group.length,
        averageHealthScore: avgHealth,
        onlineCount: group.filter((a) => a.status === "online").length,
        offlineCount: group.filter((a) => a.status === "offline").length,
      };
    });
  }

  // -----------------------------------------------------------------------
  // Dispatch getters
  // -----------------------------------------------------------------------

  getDispatchPlans(filters?: PlanFilters): DispatchPlan[] {
    let data = [...this.dispatchPlans];
    if (filters?.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      data = data.filter((p) => statuses.includes(p.status));
    }
    return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getDispatchPlan(id: string): DispatchPlan | undefined {
    return this.dispatchPlans.find((p) => p.id === id);
  }

  createDispatchPlan(input: CreatePlanInput): DispatchPlan {
    const plan = generateOptimizedPlan(input.demandTarget);
    this.dispatchPlans.unshift(plan);
    return plan;
  }

  approvePlan(id: string): DispatchPlan | undefined {
    const plan = this.dispatchPlans.find((p) => p.id === id);
    if (!plan || plan.status !== "draft") return undefined;
    plan.status = "approved";
    this.emit("onPlanApproved", plan);
    return plan;
  }

  // -----------------------------------------------------------------------
  // Agents
  // -----------------------------------------------------------------------

  getAgentStatuses(): AgentStatus[] {
    return this.agentStatuses;
  }

  // -----------------------------------------------------------------------
  // Dashboard
  // -----------------------------------------------------------------------

  getDashboardMetrics(): DashboardMetrics {
    // Grid frequency — average across sectors
    const avgFreq = this.sectors.reduce((s, sec) => s + sec.frequency, 0) / this.sectors.length;
    const freqStatus = Math.abs(avgFreq - 60) < 0.05 ? "normal" : Math.abs(avgFreq - 60) < 0.15 ? "warning" : "critical";

    // Portfolio P&L
    const portfolio = this.getPortfolioPosition();

    // Forecast accuracy — average of non-null accuracies
    const accuracies = this.forecasts.filter((f) => f.accuracy !== null).map((f) => f.accuracy!);
    const avgAccuracy = accuracies.length > 0
      ? parseFloat((accuracies.reduce((s, a) => s + a, 0) / accuracies.length).toFixed(1))
      : 0;

    // Active anomalies
    const activeAnomalies = this.anomalies.filter((a) => a.status === "new" || a.status === "investigating");
    const severityOrder: AnomalySeverity[] = ["critical", "high", "medium", "low", "info"];
    const highestSeverity = severityOrder.find((sev) =>
      activeAnomalies.some((a) => a.severity === sev),
    ) ?? "info";

    // Fleet health
    const avgHealth = parseFloat(
      (this.assets.reduce((s, a) => s + a.healthScore, 0) / this.assets.length).toFixed(1),
    );

    // Dispatch cost
    const activePlan = this.dispatchPlans.find((p) => p.status === "active");
    const dispatchCost = activePlan?.totalCost ?? 0;

    return {
      gridFrequency: { value: parseFloat(avgFreq.toFixed(3)), status: freqStatus },
      portfolioPnL: { value: portfolio.realizedPnL, isPositive: portfolio.realizedPnL >= 0 },
      forecastAccuracy: {
        value: avgAccuracy,
        label: avgAccuracy >= 90 ? "Excellent" : avgAccuracy >= 75 ? "Good" : "Fair",
      },
      activeAnomalies: { count: activeAnomalies.length, highestSeverity: highestSeverity as AnomalySeverity },
      fleetHealthScore: { value: avgHealth },
      dispatchCost: { value: dispatchCost },
    };
  }
}
