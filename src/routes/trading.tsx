import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/trading")({
  component: TradingLayout,
});

function TradingLayout() {
  return (
    <>
      <PageHeader
        title="Energy Trading"
        subtitle="Manage orders, monitor positions, and execute trades"
        Icon={TrendingUp}
      />
      <Outlet />
    </>
  );
}
