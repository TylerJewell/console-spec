export type ForecastType = "demand" | "solar" | "wind" | "price";

export interface Forecast {
  id: string;
  type: ForecastType;
  region: string;
  timestamp: string;
  predicted: number;
  actual: number | null;
  confidenceLow: number;
  confidenceHigh: number;
  accuracy: number | null;
}

export interface ForecastFilters {
  type?: ForecastType;
  region?: string;
  hoursAhead?: 6 | 12 | 24;
}
