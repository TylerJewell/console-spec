export type AssetType = "generator" | "transformer" | "transmission_line" | "substation" | "solar_panel" | "wind_turbine";
export type AssetStatus = "online" | "offline" | "degraded" | "maintenance";
export type AlertSeverity = "info" | "warning" | "critical";
export type WorkOrderType = "preventive" | "corrective" | "emergency";
export type Priority = "low" | "medium" | "high" | "critical";
export type WorkOrderStatus = "scheduled" | "in_progress" | "completed" | "deferred";

export interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  location: string;
  status: AssetStatus;
  healthScore: number;
  lastInspection: string;
  nextMaintenance: string;
  efficiency: number;
  ageYears: number;
  alerts: Alert[];
}

export interface WorkOrder {
  id: string;
  assetId: string;
  assetName: string;
  type: WorkOrderType;
  priority: Priority;
  status: WorkOrderStatus;
  scheduledDate: string;
  technician: string;
  notes: string;
  createdAt: string;
  completedAt: string | null;
}

export interface AssetFilters {
  type?: AssetType;
  location?: string;
  status?: AssetStatus;
  sortBy?: keyof Asset;
  sortDirection?: "asc" | "desc";
}

export interface WorkOrderFilters {
  assetId?: string;
  type?: WorkOrderType;
  priority?: Priority;
  status?: WorkOrderStatus;
}

export interface CreateWorkOrderInput {
  assetId: string;
  type: WorkOrderType;
  priority: Priority;
  scheduledDate: string;
  technician: string;
  notes: string;
}

export interface HealthOverviewItem {
  assetType: AssetType;
  assetTypeLabel: string;
  count: number;
  averageHealthScore: number;
  onlineCount: number;
  offlineCount: number;
}
