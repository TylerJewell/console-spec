import type {
  Asset, AssetType, AssetStatus, Alert, AlertSeverity,
  WorkOrder, WorkOrderType, Priority, WorkOrderStatus,
  CreateWorkOrderInput,
} from "@/types/assets";
import { uuid, randomFloat, randomInt, randomItem, weightedRandom, daysFromNow, daysAgo, hoursAgo } from "../utils";

const SECTORS = ["North Sector", "South Sector", "East Sector", "West Sector", "Central Sector"];

const TECHNICIANS = [
  "James Park", "Elena Vasquez", "Raj Patel", "Olivia Chen",
  "Marcus Johnson", "Fatima Al-Rashid", "Dmitry Volkov", "Ana Silva",
];

interface AssetTemplate {
  type: AssetType;
  prefix: string;
  count: number;
}

const ASSET_TEMPLATES: AssetTemplate[] = [
  { type: "generator", prefix: "GEN", count: 8 },
  { type: "transformer", prefix: "TRF", count: 6 },
  { type: "transmission_line", prefix: "TL", count: 8 },
  { type: "substation", prefix: "SUB", count: 5 },
  { type: "solar_panel", prefix: "SOL", count: 8 },
  { type: "wind_turbine", prefix: "WND", count: 5 },
];

const ASSET_NAMES: Record<AssetType, string[]> = {
  generator: ["Gas Turbine Unit", "Steam Turbine Unit", "Combined Cycle Unit", "Diesel Generator", "Peaking Unit", "Base Load Generator", "Cogeneration Unit", "Reserve Generator"],
  transformer: ["Main Power Transformer", "Distribution Transformer", "Step-Up Transformer", "Auto-Transformer", "Phase Shifting Transformer", "Auxiliary Transformer"],
  transmission_line: ["230kV Main Line", "115kV Feeder", "345kV Interstate Line", "69kV Distribution Line", "500kV Backbone", "138kV Sub-Transmission", "230kV Tie Line", "115kV Ring Bus Feeder"],
  substation: ["Main Grid Substation", "Distribution Substation", "Collector Substation", "Switching Station", "Interconnect Substation"],
  solar_panel: ["Solar Array Alpha", "Solar Array Beta", "Solar Array Gamma", "Rooftop PV Cluster", "Tracking Solar Field", "Fixed Tilt Array", "Bifacial Panel Bank", "Community Solar Farm"],
  wind_turbine: ["Onshore Turbine", "Hilltop Wind Unit", "Coastal Wind Unit", "Prairie Wind Generator", "Ridge Wind Turbine"],
};

const ALERT_MESSAGES: Record<AlertSeverity, string[]> = {
  info: [
    "Scheduled maintenance window approaching",
    "Firmware update available",
    "Routine calibration due",
  ],
  warning: [
    "Operating temperature approaching upper threshold",
    "Vibration levels slightly elevated",
    "Efficiency degradation detected",
    "Oil level below recommended range",
  ],
  critical: [
    "Immediate inspection required: abnormal readings",
    "Protection relay operated unexpectedly",
    "Cooling system failure detected",
  ],
};

function generateAlerts(count: number): Alert[] {
  const alerts: Alert[] = [];
  for (let i = 0; i < count; i++) {
    const severity = weightedRandom<AlertSeverity>(
      ["info", "warning", "critical"],
      [50, 35, 15],
    );
    alerts.push({
      id: uuid(),
      message: randomItem(ALERT_MESSAGES[severity]),
      severity,
      timestamp: hoursAgo(randomFloat(0, 48)),
    });
  }
  return alerts;
}

function deriveAssetStatus(healthScore: number, alertCount: number): AssetStatus {
  if (healthScore < 50) return randomItem(["offline", "maintenance"] as AssetStatus[]);
  if (healthScore < 65 || alertCount >= 3) return "degraded";
  if (Math.random() < 0.05) return "maintenance";
  return "online";
}

export function seedAssets(): Asset[] {
  const assets: Asset[] = [];

  for (const tmpl of ASSET_TEMPLATES) {
    for (let i = 0; i < tmpl.count; i++) {
      const healthScore = randomInt(40, 100);
      const alertCount = randomInt(0, 3);
      const status = deriveAssetStatus(healthScore, alertCount);

      assets.push({
        id: `${tmpl.prefix.toLowerCase()}-${String(i + 1).padStart(3, "0")}`,
        name: `${ASSET_NAMES[tmpl.type][i % ASSET_NAMES[tmpl.type].length]} ${tmpl.prefix}-${i + 1}`,
        type: tmpl.type,
        location: SECTORS[i % SECTORS.length],
        status,
        healthScore,
        lastInspection: daysAgo(randomInt(5, 90)),
        nextMaintenance: daysFromNow(randomInt(5, 180)),
        efficiency: parseFloat(randomFloat(70, 99).toFixed(1)),
        ageYears: randomInt(1, 25),
        alerts: generateAlerts(alertCount),
      });
    }
  }

  return assets;
}

const WORK_ORDER_NOTES: Record<WorkOrderType, string[]> = {
  preventive: [
    "Routine inspection and lubrication per maintenance schedule",
    "Scheduled filter replacement and system calibration",
    "Periodic insulation resistance testing",
    "Annual thermographic inspection",
  ],
  corrective: [
    "Repair bearing assembly following vibration alert",
    "Replace faulty temperature sensor",
    "Fix oil leak on hydraulic actuator",
    "Repair damaged insulator",
  ],
  emergency: [
    "Immediate response to protection relay trip",
    "Emergency cooling system repair",
    "Critical bushing replacement after flashover",
    "Emergency generator restart after unexpected trip",
  ],
};

export function seedWorkOrders(assets: Asset[]): WorkOrder[] {
  const orders: WorkOrder[] = [];

  for (let i = 0; i < 15; i++) {
    const asset = randomItem(assets);
    const type = weightedRandom<WorkOrderType>(["preventive", "corrective", "emergency"], [50, 35, 15]);
    const priority = weightedRandom<Priority>(["low", "medium", "high", "critical"], [25, 35, 25, 15]);
    const status = weightedRandom<WorkOrderStatus>(
      ["scheduled", "in_progress", "completed", "deferred"],
      [30, 30, 25, 15],
    );

    const createdAt = hoursAgo(randomFloat(1, 336));
    const scheduledDate = daysFromNow(randomInt(-5, 30));

    orders.push({
      id: uuid(),
      assetId: asset.id,
      assetName: asset.name,
      type,
      priority,
      status,
      scheduledDate,
      technician: randomItem(TECHNICIANS),
      notes: randomItem(WORK_ORDER_NOTES[type]),
      createdAt,
      completedAt: status === "completed" ? hoursAgo(randomFloat(0, 48)) : null,
    });
  }

  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createWorkOrder(input: CreateWorkOrderInput, assets: Asset[]): WorkOrder {
  const asset = assets.find((a) => a.id === input.assetId);
  return {
    id: uuid(),
    assetId: input.assetId,
    assetName: asset?.name ?? "Unknown Asset",
    type: input.type,
    priority: input.priority,
    status: "scheduled",
    scheduledDate: input.scheduledDate,
    technician: input.technician,
    notes: input.notes,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}
