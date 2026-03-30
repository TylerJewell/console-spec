import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/anomalies")({
  component: AnomaliesLayout,
});

function AnomaliesLayout() {
  return (
    <>
      <PageHeader
        title="Anomaly Detection"
        subtitle="AI-detected anomalies across grid, trading, and asset systems"
        Icon={Shield}
      />
      <Outlet />
    </>
  );
}
