import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/assets")({
  component: AssetsLayout,
});

function AssetsLayout() {
  return (
    <>
      <PageHeader
        title="Asset Management"
        subtitle="Monitor asset health, manage inventory, and track work orders"
        Icon={Wrench}
      />
      <Outlet />
    </>
  );
}
