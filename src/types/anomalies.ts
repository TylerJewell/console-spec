export type AnomalyType = "frequency_deviation" | "voltage_anomaly" | "load_spike" | "price_manipulation" | "asset_degradation" | "cyber_intrusion";
export type AnomalySeverity = "info" | "low" | "medium" | "high" | "critical";
export type AnomalyStatus = "new" | "investigating" | "resolved" | "false_positive";

export interface Anomaly {
  id: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  source: string;
  description: string;
  timestamp: string;
  status: AnomalyStatus;
  assignedTo: string | null;
  resolutionNotes: string | null;
  resolvedAt: string | null;
}

export interface AnomalyFilters {
  status?: AnomalyStatus | AnomalyStatus[];
  severity?: AnomalySeverity;
  type?: AnomalyType;
  sortBy?: keyof Anomaly;
  sortDirection?: "asc" | "desc";
}

export interface AnomalyUpdate {
  status: AnomalyStatus;
  assignedTo?: string;
  resolutionNotes?: string;
}
