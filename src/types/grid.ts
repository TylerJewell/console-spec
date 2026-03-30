export type SectorStatus = "normal" | "warning" | "critical" | "blackout";
export type GridEventType = "frequency_deviation" | "voltage_sag" | "overload" | "equipment_trip" | "line_fault";
export type GridEventSeverity = "info" | "warning" | "critical";

export interface GridSector {
  id: string;
  name: string;
  frequency: number;
  voltage: number;
  load: number;
  capacity: number;
  status: SectorStatus;
  lastUpdated: string;
}

export interface GridEvent {
  id: string;
  sectorId: string;
  type: GridEventType;
  severity: GridEventSeverity;
  description: string;
  timestamp: string;
}
