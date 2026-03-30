import type { Forecast, ForecastType } from "@/types/forecasting";
import { uuid, randomFloat } from "../utils";

const REGIONS = ["north", "south", "east", "west", "all"];
const FORECAST_TYPES: ForecastType[] = ["demand", "solar", "wind", "price"];

function demandForHour(hour: number): number {
  // Higher midday, lower overnight
  const base = 1400;
  const peakOffset = -Math.abs(hour - 14) * 40;
  return base + peakOffset + randomFloat(-100, 100);
}

function solarForHour(hour: number): number {
  // Bell curve peaking around noon
  if (hour < 6 || hour > 20) return 0;
  const peak = 600;
  const spread = 4;
  const gauss = Math.exp(-0.5 * Math.pow((hour - 13) / spread, 2));
  return peak * gauss + randomFloat(-30, 30);
}

function windForHour(_hour: number): number {
  return randomFloat(50, 400);
}

function priceForHour(hour: number): number {
  // Prices correlate loosely with demand
  const base = 40;
  const peakOffset = -Math.abs(hour - 14) * 1.5;
  return base + peakOffset + randomFloat(-8, 8);
}

function valueForType(type: ForecastType, hour: number): number {
  switch (type) {
    case "demand": return demandForHour(hour);
    case "solar": return solarForHour(hour);
    case "wind": return windForHour(hour);
    case "price": return priceForHour(hour);
  }
}

function clampPositive(v: number): number {
  return Math.max(0, v);
}

export function seedForecasts(): Forecast[] {
  const forecasts: Forecast[] = [];
  const now = new Date();
  const currentHour = now.getHours();

  for (const type of FORECAST_TYPES) {
    for (const region of REGIONS) {
      for (let offset = -12; offset <= 12; offset++) {
        const hour = (currentHour + offset + 24) % 24;
        const timestamp = new Date(now.getTime() + offset * 3600000).toISOString();

        const predicted = clampPositive(parseFloat(valueForType(type, hour).toFixed(2)));
        const confidenceMargin = predicted * randomFloat(0.05, 0.15);
        const confidenceLow = parseFloat(clampPositive(predicted - confidenceMargin).toFixed(2));
        const confidenceHigh = parseFloat((predicted + confidenceMargin).toFixed(2));

        const isPast = offset < 0;
        let actual: number | null = null;
        let accuracy: number | null = null;

        if (isPast) {
          const errorPct = randomFloat(0.02, 0.5);
          actual = parseFloat(clampPositive(predicted * (1 + randomFloat(-errorPct, errorPct))).toFixed(2));
          accuracy = predicted > 0
            ? parseFloat((100 - Math.abs((actual - predicted) / predicted) * 100).toFixed(1))
            : 100;
          accuracy = Math.max(50, Math.min(98, accuracy));
        }

        forecasts.push({
          id: uuid(),
          type,
          region,
          timestamp,
          predicted,
          actual,
          confidenceLow,
          confidenceHigh,
          accuracy,
        });
      }
    }
  }

  return forecasts;
}
