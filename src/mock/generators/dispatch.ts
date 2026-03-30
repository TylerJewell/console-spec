import type { DispatchPlan, DispatchPlanStatus, DispatchUnit, FuelType, DispatchUnitStatus } from "@/types/dispatch";
import { uuid, randomFloat, randomInt, randomItem, hoursAgo } from "../utils";

interface GeneratorTemplate {
  name: string;
  fuelType: FuelType;
  maxCapacityMw: number;
  costRange: [number, number];
}

const GENERATOR_POOL: GeneratorTemplate[] = [
  { name: "Solar Farm Alpha", fuelType: "solar", maxCapacityMw: 200, costRange: [0, 5] },
  { name: "Solar Farm Beta", fuelType: "solar", maxCapacityMw: 150, costRange: [0, 5] },
  { name: "Wind Park North", fuelType: "wind", maxCapacityMw: 300, costRange: [5, 15] },
  { name: "Wind Park Coastal", fuelType: "wind", maxCapacityMw: 250, costRange: [5, 15] },
  { name: "Hydro Dam East", fuelType: "hydro", maxCapacityMw: 400, costRange: [10, 20] },
  { name: "Hydro Run-of-River", fuelType: "hydro", maxCapacityMw: 180, costRange: [10, 20] },
  { name: "Nuclear Station 1", fuelType: "nuclear", maxCapacityMw: 800, costRange: [15, 25] },
  { name: "Nuclear Station 2", fuelType: "nuclear", maxCapacityMw: 600, costRange: [15, 25] },
  { name: "Gas Peaker A", fuelType: "gas", maxCapacityMw: 350, costRange: [30, 60] },
  { name: "Gas Combined Cycle B", fuelType: "gas", maxCapacityMw: 500, costRange: [30, 60] },
  { name: "Gas Turbine C", fuelType: "gas", maxCapacityMw: 200, costRange: [35, 55] },
  { name: "Coal Plant West", fuelType: "coal", maxCapacityMw: 600, costRange: [40, 80] },
  { name: "Coal Plant South", fuelType: "coal", maxCapacityMw: 450, costRange: [40, 80] },
];

function generateUnits(count: number, demandTarget: number): DispatchUnit[] {
  const selected = [...GENERATOR_POOL]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, GENERATOR_POOL.length));

  const units: DispatchUnit[] = selected.map((gen) => {
    const marginalCost = parseFloat(randomFloat(gen.costRange[0], gen.costRange[1]).toFixed(2));
    return {
      generatorId: `gen-${gen.name.toLowerCase().replace(/\s+/g, "-")}`,
      generatorName: gen.name,
      fuelType: gen.fuelType,
      outputMw: 0,
      maxCapacityMw: gen.maxCapacityMw,
      marginalCost,
      status: "standby" as DispatchUnitStatus,
    };
  });

  // Sort by marginal cost (merit order)
  units.sort((a, b) => a.marginalCost - b.marginalCost);

  // Dispatch units to meet demand
  let remaining = demandTarget;
  for (const unit of units) {
    if (remaining <= 0) break;
    const output = Math.min(unit.maxCapacityMw, remaining);
    unit.outputMw = Math.round(output);
    unit.status = "dispatched";
    remaining -= output;
  }

  return units;
}

const PLAN_CONFIGS: { status: DispatchPlanStatus; demandTarget: number; hoursOffset: number; unitCount: number }[] = [
  { status: "active", demandTarget: 3200, hoursOffset: 1, unitCount: 10 },
  { status: "approved", demandTarget: 3500, hoursOffset: 4, unitCount: 8 },
  { status: "draft", demandTarget: 2800, hoursOffset: 0.5, unitCount: 7 },
  { status: "completed", demandTarget: 3000, hoursOffset: 12, unitCount: 9 },
];

export function seedDispatchPlans(): DispatchPlan[] {
  return PLAN_CONFIGS.map((cfg) => {
    const units = generateUnits(cfg.unitCount, cfg.demandTarget);
    const totalCost = parseFloat(
      units.reduce((sum, u) => sum + u.outputMw * u.marginalCost, 0).toFixed(2),
    );

    return {
      id: uuid(),
      createdAt: hoursAgo(cfg.hoursOffset),
      demandTarget: cfg.demandTarget,
      totalCost,
      status: cfg.status,
      units,
    };
  });
}

export function generateOptimizedPlan(demandTarget: number): DispatchPlan {
  const unitCount = randomInt(5, 12);
  const units = generateUnits(unitCount, demandTarget);
  const totalCost = parseFloat(
    units.reduce((sum, u) => sum + u.outputMw * u.marginalCost, 0).toFixed(2),
  );

  return {
    id: uuid(),
    createdAt: new Date().toISOString(),
    demandTarget,
    totalCost,
    status: "draft",
    units,
  };
}
