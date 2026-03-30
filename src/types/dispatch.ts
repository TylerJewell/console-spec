export type FuelType = "gas" | "coal" | "nuclear" | "solar" | "wind" | "hydro";
export type DispatchPlanStatus = "draft" | "optimizing" | "approved" | "active" | "completed";
export type DispatchUnitStatus = "dispatched" | "standby" | "ramping_up" | "ramping_down" | "offline";

export interface DispatchUnit {
  generatorId: string;
  generatorName: string;
  fuelType: FuelType;
  outputMw: number;
  maxCapacityMw: number;
  marginalCost: number;
  status: DispatchUnitStatus;
}

export interface DispatchPlan {
  id: string;
  createdAt: string;
  demandTarget: number;
  totalCost: number;
  status: DispatchPlanStatus;
  units: DispatchUnit[];
}

export interface PlanFilters {
  status?: DispatchPlanStatus | DispatchPlanStatus[];
}

export interface CreatePlanInput {
  demandTarget: number;
}
