import { createFileRoute } from "@tanstack/react-router";
import { ForecastPage } from "./-components/ForecastPage";

export const Route = createFileRoute("/forecasting/price")({
  component: PriceForecastPage,
});

function PriceForecastPage() {
  return <ForecastPage forecastType="price" unit="$/MWh" />;
}
