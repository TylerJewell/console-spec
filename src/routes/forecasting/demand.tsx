import { createFileRoute } from "@tanstack/react-router";
import { ForecastPage } from "./-components/ForecastPage";

export const Route = createFileRoute("/forecasting/demand")({
  component: DemandForecastPage,
});

function DemandForecastPage() {
  return <ForecastPage forecastType="demand" unit="MW" />;
}
