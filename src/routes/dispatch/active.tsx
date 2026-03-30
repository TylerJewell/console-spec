import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { StatusChip } from "@/components/StatusChip";
import { EmptyState } from "@/components/EmptyState";
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
import { useDispatchPlans } from "@/hooks/useDispatchData";
import type { DispatchPlanStatus } from "@/types/dispatch";

export const Route = createFileRoute("/dispatch/active")({
  component: ActivePlansPage,
});

const statusColors: Record<
  DispatchPlanStatus,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  draft: "default",
  optimizing: "secondary",
  approved: "primary",
  active: "success",
  completed: "secondary",
};

function ActivePlansPage() {
  const navigate = useNavigate();
  const { data: plans, isLoading, isError } = useDispatchPlans({
    status: ["draft", "optimizing", "approved", "active"],
  });

  return (
    <Table>
      <TableHead>
        <TableHeadRow>
          <TableHeadCell>Plan ID</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
          <TableHeadCell>Demand Target</TableHeadCell>
          <TableHeadCell>Total Cost</TableHeadCell>
          <TableHeadCell>Units</TableHeadCell>
          <TableHeadCell>Created</TableHeadCell>
        </TableHeadRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          <TableSkeleton columns={[80, 80, 80, 80, 40, 130]} rows={5} />
        ) : isError ? (
          <TableError colSpan={6} />
        ) : plans && plans.length > 0 ? (
          plans.map((plan) => (
            <TableRow
              key={plan.id}
              onClick={() =>
                navigate({
                  to: "/dispatch/$planId",
                  params: { planId: plan.id },
                })
              }
            >
              <TableCell fitWidth>
                <span className="font-mono text-tiny">{plan.id.slice(0, 8)}</span>
              </TableCell>
              <TableCell fitWidth>
                <StatusChip value={plan.status} color={statusColors[plan.status]} />
              </TableCell>
              <TableCell fitWidth>
                {plan.demandTarget.toLocaleString()} MW
              </TableCell>
              <TableCell fitWidth>
                ${plan.totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </TableCell>
              <TableCell fitWidth>{plan.units.length}</TableCell>
              <TableCell fitWidth>
                {new Date(plan.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              <EmptyState title="No active plans" description="Create a new dispatch plan to get started." />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
