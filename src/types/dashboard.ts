import type { AnomalySeverity } from "./anomalies";

export interface DashboardMetrics {
  gridFrequency: { value: number; status: "normal" | "warning" | "critical" };
  portfolioPnL: { value: number; isPositive: boolean };
  forecastAccuracy: { value: number; label: string };
  activeAnomalies: { count: number; highestSeverity: AnomalySeverity };
  fleetHealthScore: { value: number };
  dispatchCost: { value: number };
}
