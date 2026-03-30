import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Factory } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/dispatch")({
  component: DispatchLayout,
});

function DispatchLayout() {
  return (
    <>
      <PageHeader
        title="Dispatch Optimization"
        subtitle="Economic dispatch planning and generator merit order management"
        Icon={Factory}
      />
      <Outlet />
    </>
  );
}
