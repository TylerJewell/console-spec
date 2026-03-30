import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/forecasting")({
  component: ForecastingLayout,
});

function ForecastingLayout() {
  return (
    <>
      <PageHeader
        title="Forecasting"
        subtitle="AI-powered demand, generation, and price forecasts"
        Icon={BarChart3}
      />
      <Outlet />
    </>
  );
}
