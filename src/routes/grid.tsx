import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/grid")({
  component: GridLayout,
});

function GridLayout() {
  return (
    <>
      <PageHeader
        title="Grid Monitoring"
        subtitle="Real-time monitoring of grid sectors, frequency, voltage, and load"
        Icon={Zap}
      />
      <Outlet />
    </>
  );
}
