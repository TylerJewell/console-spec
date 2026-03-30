import type { Anomaly, AnomalyType, AnomalySeverity, AnomalyStatus } from "@/types/anomalies";
import { uuid, randomItem, weightedRandom, hoursAgo, minutesAgo } from "../utils";

const ANOMALY_TYPES: AnomalyType[] = [
  "frequency_deviation", "voltage_anomaly", "load_spike",
  "price_manipulation", "asset_degradation", "cyber_intrusion",
];

const SEVERITIES: AnomalySeverity[] = ["info", "low", "medium", "high", "critical"];
const SEVERITY_WEIGHTS = [30, 25, 20, 15, 10];

const SOURCES = [
  "North Sector SCADA", "South Sector PMU", "East Sector RTU",
  "West Sector DCS", "Central Monitoring Hub", "Market Surveillance Engine",
  "Cybersecurity IDS", "Asset Health Monitor",
];

const DESCRIPTIONS: Record<AnomalyType, string[]> = {
  frequency_deviation: [
    "Sustained frequency deviation of 0.15Hz detected across interconnect",
    "Frequency oscillation pattern inconsistent with normal load variation",
    "Governor response anomaly: frequency recovery time exceeded threshold",
  ],
  voltage_anomaly: [
    "Unexpected voltage fluctuation on 230kV bus exceeding 2% tolerance",
    "Harmonic distortion levels elevated beyond acceptable limits",
    "Voltage unbalance detected across three-phase supply",
  ],
  load_spike: [
    "Sudden load increase of 150MW not correlated to demand forecast",
    "Abnormal load pattern detected: possible metering error",
    "Load ramp rate exceeds historical maximum for this time period",
  ],
  price_manipulation: [
    "Unusual bid pattern detected in day-ahead market clearing",
    "Price spike not correlated with supply-demand fundamentals",
    "Potential wash trading activity identified between counterparties",
  ],
  asset_degradation: [
    "Transformer oil dissolved gas analysis shows accelerating trend",
    "Generator bearing vibration levels trending above baseline",
    "Insulation resistance declining on transmission line segment",
  ],
  cyber_intrusion: [
    "Unauthorized SCADA protocol traffic detected on OT network",
    "Failed authentication attempts exceeding threshold on RTU",
    "Anomalous data injection pattern detected in telemetry stream",
  ],
};

const ANALYSTS = ["Dr. Sarah Chen", "Mike Torres", "Aisha Patel", "Carlos Mendez", "Jun Watanabe"];

export function seedAnomalies(): Anomaly[] {
  const anomalies: Anomaly[] = [];

  for (let i = 0; i < 20; i++) {
    const type = randomItem(ANOMALY_TYPES);
    const severity = weightedRandom(SEVERITIES, SEVERITY_WEIGHTS);
    const isActive = Math.random() < 0.6;
    const status: AnomalyStatus = isActive
      ? randomItem(["new", "investigating"] as AnomalyStatus[])
      : randomItem(["resolved", "false_positive"] as AnomalyStatus[]);

    const timestamp = hoursAgo(Math.random() * 72);
    const resolved = status === "resolved" || status === "false_positive";

    anomalies.push({
      id: uuid(),
      type,
      severity,
      source: randomItem(SOURCES),
      description: randomItem(DESCRIPTIONS[type]),
      timestamp,
      status,
      assignedTo: status === "new" ? null : randomItem(ANALYSTS),
      resolutionNotes: resolved
        ? `Investigated and ${status === "resolved" ? "confirmed root cause. Corrective action applied." : "determined to be a false positive triggered by sensor calibration drift."}`
        : null,
      resolvedAt: resolved ? minutesAgo(Math.random() * 120) : null,
    });
  }

  return anomalies.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function generateNewAnomaly(): Anomaly {
  const type = randomItem(ANOMALY_TYPES);
  const severity = weightedRandom(SEVERITIES, SEVERITY_WEIGHTS);

  return {
    id: uuid(),
    type,
    severity,
    source: randomItem(SOURCES),
    description: randomItem(DESCRIPTIONS[type]),
    timestamp: new Date().toISOString(),
    status: "new",
    assignedTo: null,
    resolutionNotes: null,
    resolvedAt: null,
  };
}
