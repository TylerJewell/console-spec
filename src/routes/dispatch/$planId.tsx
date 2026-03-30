import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@heroui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DescriptionList } from "@/components/DescriptionList";
import { StatusChip } from "@/components/StatusChip";
import { EmptyState } from "@/components/EmptyState";
import { pushToast } from "@/components/Toast";
import {
  Table,
  TableHead,
  TableHeadRow,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  TableSkeleton,
  TableError,
} from "@/components/DataTable";
import { useDispatchPlan, useApprovePlan } from "@/hooks/useDispatchData";
import type { DispatchPlanStatus, DispatchUnitStatus, FuelType } from "@/types/dispatch";

export const Route = createFileRoute("/dispatch/$planId")({
  component: PlanDetailPage,
});

const planStatusColors: Record<
  DispatchPlanStatus,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  draft: "default",
  optimizing: "secondary",
  approved: "primary",
  active: "success",
  completed: "secondary",
};

const unitStatusColors: Record<
  DispatchUnitStatus,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  dispatched: "success",
  standby: "default",
  ramping_up: "primary",
  ramping_down: "warning",
  offline: "danger",
};

const fuelTypeColors: Record<
  FuelType,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  gas: "warning",
  coal: "default",
  nuclear: "danger",
  solar: "success",
  wind: "primary",
  hydro: "secondary",
};

function PlanDetailPage() {
  const { planId } = Route.useParams();
  const { data: plan, isLoading, isError } = useDispatchPlan(planId);
  const approvePlan = useApprovePlan();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  if (isError || !plan) {
    return <EmptyState title="Plan not found" description={`Could not find dispatch plan "${planId}".`} />;
  }

  async function handleApprove() {
    try {
      await approvePlan.mutateAsync(planId);
      pushToast("Plan approved", {
        description: `Dispatch plan ${planId.slice(0, 8)} has been approved.`,
        variant: "success",
      });
    } catch {
      pushToast("Failed to approve plan", { variant: "error" });
    }
  }

  const sortedUnits = [...plan.units].sort((a, b) => a.marginalCost - b.marginalCost);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dispatch", to: "/dispatch/active" },
          { label: `Plan ${plan.id.slice(0, 8)}` },
        ]}
      />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <DescriptionList
          list={[
            {
              term: "Status",
              definition: (
                <StatusChip value={plan.status} color={planStatusColors[plan.status]} />
              ),
            },
            {
              term: "Demand Target",
              definition: `${plan.demandTarget.toLocaleString()} MW`,
            },
            {
              term: "Total Cost",
              definition: `$${plan.totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            },
            {
              term: "Created",
              definition: new Date(plan.createdAt).toLocaleString(),
            },
            {
              term: "Generator Units",
              definition: `${plan.units.length}`,
            },
          ]}
        />

        {plan.status === "draft" && (
          <Button
            color="success"
            onPress={handleApprove}
            isLoading={approvePlan.isPending}
          >
            Approve Plan
          </Button>
        )}
      </div>

      <section>
        <h3 className="text-medium font-[550] dark:font-[500] mb-3">Merit Order</h3>
        <Table>
          <TableHead>
            <TableHeadRow>
              <TableHeadCell>#</TableHeadCell>
              <TableHeadCell>Generator</TableHeadCell>
              <TableHeadCell>Fuel Type</TableHeadCell>
              <TableHeadCell>Output</TableHeadCell>
              <TableHeadCell>Max Capacity</TableHeadCell>
              <TableHeadCell>Marginal Cost</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableHeadRow>
          </TableHead>
          <TableBody>
            {sortedUnits.map((unit, idx) => (
              <TableRow key={unit.generatorId}>
                <TableCell fitWidth>{idx + 1}</TableCell>
                <TableCell>
                  <span className="font-[550] dark:font-[500]">{unit.generatorName}</span>
                </TableCell>
                <TableCell fitWidth>
                  <StatusChip value={unit.fuelType} color={fuelTypeColors[unit.fuelType]} />
                </TableCell>
                <TableCell fitWidth>
                  {unit.outputMw.toLocaleString()} MW
                </TableCell>
                <TableCell fitWidth>
                  {unit.maxCapacityMw.toLocaleString()} MW
                </TableCell>
                <TableCell fitWidth>
                  ${unit.marginalCost.toFixed(2)}/MWh
                </TableCell>
                <TableCell fitWidth>
                  <StatusChip value={unit.status} color={unitStatusColors[unit.status]} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
