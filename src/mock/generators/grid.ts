import type { GridSector, GridEvent, GridEventType, GridEventSeverity, SectorStatus } from "@/types/grid";
import { uuid, randomFloat, randomInt, randomItem, minutesAgo, hoursAgo } from "../utils";

interface SectorDef {
  name: string;
  capacity: number;
  baseLoad: number;
}

const SECTOR_DEFS: SectorDef[] = [
  { name: "North Sector", capacity: 1800, baseLoad: 1200 },
  { name: "South Sector", capacity: 1500, baseLoad: 1050 },
  { name: "East Sector", capacity: 1200, baseLoad: 840 },
  { name: "West Sector", capacity: 2000, baseLoad: 1500 },
  { name: "Central Sector", capacity: 800, baseLoad: 600 },
];

const SECTOR_IDS = ["sector-north", "sector-south", "sector-east", "sector-west", "sector-central"];

function deriveStatus(sector: { frequency: number; load: number; capacity: number }): SectorStatus {
  const loadRatio = sector.load / sector.capacity;
  if (loadRatio > 0.95 || sector.frequency < 59.5 || sector.frequency > 60.5) return "critical";
  if (loadRatio > 0.85 || sector.frequency < 59.8 || sector.frequency > 60.2) return "warning";
  return "normal";
}

export function seedGridSectors(): GridSector[] {
  return SECTOR_DEFS.map((def, i) => {
    const loadVariation = randomFloat(0.6, 0.8);
    const load = Math.round(def.capacity * loadVariation);
    const frequency = randomFloat(59.9, 60.1);
    const voltage = randomFloat(228, 232);
    const sector: GridSector = {
      id: SECTOR_IDS[i],
      name: def.name,
      frequency: parseFloat(frequency.toFixed(3)),
      voltage: parseFloat(voltage.toFixed(1)),
      load,
      capacity: def.capacity,
      status: "normal",
      lastUpdated: minutesAgo(randomInt(0, 5)),
    };
    sector.status = deriveStatus(sector);
    return sector;
  });
}

const EVENT_DESCRIPTIONS: Record<GridEventType, string[]> = {
  frequency_deviation: [
    "Frequency deviation detected: generator governor response lag",
    "Frequency swing observed following sudden load change",
    "Inter-area oscillation detected on tie-line",
  ],
  voltage_sag: [
    "Voltage sag detected at distribution bus",
    "Reactive power imbalance causing voltage depression",
    "Motor starting event caused temporary voltage dip",
  ],
  overload: [
    "Transmission line approaching thermal limit",
    "Transformer loading exceeds 90% nameplate rating",
    "Feeder overload condition detected",
  ],
  equipment_trip: [
    "Breaker tripped on overcurrent protection",
    "Generator unit tripped on high vibration alarm",
    "Capacitor bank tripped on overvoltage",
  ],
  line_fault: [
    "Phase-to-ground fault detected on 230kV line",
    "Inter-phase fault cleared by distance relay",
    "Lightning-induced fault on overhead conductor",
  ],
};

function eventSeverityFromSector(sector: GridSector): GridEventSeverity {
  if (sector.status === "critical") return "critical";
  if (sector.status === "warning") return randomItem(["warning", "critical"] as GridEventSeverity[]);
  return randomItem(["info", "warning"] as GridEventSeverity[]);
}

export function seedGridEvents(sectors: GridSector[]): GridEvent[] {
  const events: GridEvent[] = [];
  const types: GridEventType[] = ["frequency_deviation", "voltage_sag", "overload", "equipment_trip", "line_fault"];

  for (let i = 0; i < 15; i++) {
    const sector = randomItem(sectors);
    const type = randomItem(types);
    events.push({
      id: uuid(),
      sectorId: sector.id,
      type,
      severity: eventSeverityFromSector(sector),
      description: randomItem(EVENT_DESCRIPTIONS[type]),
      timestamp: hoursAgo(randomFloat(0, 48)),
    });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function updateSectorTelemetry(sectors: GridSector[]): void {
  for (const sector of sectors) {
    sector.frequency = parseFloat((sector.frequency + randomFloat(-0.02, 0.02)).toFixed(3));
    sector.voltage = parseFloat((sector.voltage + randomFloat(-0.3, 0.3)).toFixed(1));
    const loadDelta = randomInt(-20, 20);
    sector.load = Math.max(0, Math.min(sector.capacity, sector.load + loadDelta));
    sector.status = deriveStatus(sector);
    sector.lastUpdated = new Date().toISOString();
  }
}

export function generateGridEvent(sectors: GridSector[]): GridEvent {
  const types: GridEventType[] = ["frequency_deviation", "voltage_sag", "overload", "equipment_trip", "line_fault"];
  const sector = randomItem(sectors);
  const type = randomItem(types);
  return {
    id: uuid(),
    sectorId: sector.id,
    type,
    severity: eventSeverityFromSector(sector),
    description: randomItem(EVENT_DESCRIPTIONS[type]),
    timestamp: new Date().toISOString(),
  };
}
