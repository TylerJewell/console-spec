import { createFileRoute } from "@tanstack/react-router";
import { ForecastPage } from "./-components/ForecastPage";

export const Route = createFileRoute("/forecasting/solar")({
  component: SolarForecastPage,
});

function SolarForecastPage() {
  return <ForecastPage forecastType="solar" unit="MW" />;
}
