import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Header } from "@/components/Header";
import { PrimaryNav } from "@/components/PrimaryNav";
import { Toaster } from "@/components/Toast";
import { pushToast } from "@/components/Toast";
import { mockEngine } from "@/mock";
import type { Anomaly } from "@/types/anomalies";
import type { TradeOrder } from "@/types/trading";
import type { DispatchPlan } from "@/types/dispatch";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  useEffect(() => {
    mockEngine.startIntervals();

    const onAnomalyDetected = (data: unknown) => {
      const anomaly = data as Anomaly;
      const variant =
        anomaly.severity === "critical"
          ? "error"
          : anomaly.severity === "high"
            ? "warning"
            : "regular";
      pushToast(
        `Anomaly Detected: ${anomaly.type.replace(/_/g, " ")}`,
        {
          description: anomaly.description,
          variant,
        },
      );
    };

    const onOrderFilled = (data: unknown) => {
      const order = data as TradeOrder;
      pushToast(`Order ${order.id.slice(0, 8)} filled`, {
        description: `${order.type} ${order.quantity} MWh at $${order.price}/MWh`,
        variant: "success",
      });
    };

    const onPlanApproved = (data: unknown) => {
      const plan = data as DispatchPlan;
      pushToast("Dispatch plan approved", {
        description: `${plan.demandTarget} MW target, $${plan.totalCost.toFixed(0)} total cost`,
        variant: "success",
      });
    };

    mockEngine.on("onAnomalyDetected", onAnomalyDetected);
    mockEngine.on("onOrderFilled", onOrderFilled);
    mockEngine.on("onPlanApproved", onPlanApproved);

    return () => {
      mockEngine.off("onAnomalyDetected", onAnomalyDetected);
      mockEngine.off("onOrderFilled", onOrderFilled);
      mockEngine.off("onPlanApproved", onPlanApproved);
      mockEngine.stopIntervals();
    };
  }, []);

  return (
    <Layout>
      <Header>
        <PrimaryNav />
      </Header>
      <main className="overflow-y-auto p-6" style={{ gridArea: "main" }}>
        <Outlet />
      </main>
      <Toaster />
    </Layout>
  );
}
