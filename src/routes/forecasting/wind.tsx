import { createFileRoute } from "@tanstack/react-router";
import { ForecastPage } from "./-components/ForecastPage";

export const Route = createFileRoute("/forecasting/wind")({
  component: WindForecastPage,
});

function WindForecastPage() {
  return <ForecastPage forecastType="wind" unit="MW" />;
}
