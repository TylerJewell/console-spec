import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DescriptionList } from "@/components/DescriptionList";
import { StatusChip } from "@/components/StatusChip";
import { StatusIndicator } from "@/components/StatusIndicator";
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
import { useAsset, useWorkOrders } from "@/hooks/useAssetData";
import type { AssetStatus, WorkOrderStatus, Priority, AlertSeverity } from "@/types/assets";

export const Route = createFileRoute("/assets/inventory/$assetId")({
  component: AssetDetailPage,
});

const statusIndicatorColors: Record<
  AssetStatus,
  "success" | "warning" | "danger" | "secondary" | "default" | "primary"
> = {
  online: "success",
  degraded: "warning",
  maintenance: "secondary",
  offline: "danger",
};

const healthChipColor = (
  score: number,
): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "danger";
};

const workOrderStatusColors: Record<
  WorkOrderStatus,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  scheduled: "default",
  in_progress: "primary",
  completed: "success",
  deferred: "secondary",
};

const priorityColors: Record<
  Priority,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  low: "default",
  medium: "primary",
  high: "warning",
  critical: "danger",
};

const alertSeverityColors: Record<
  AlertSeverity,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  info: "default",
  warning: "warning",
  critical: "danger",
};

function AssetDetailPage() {
  const { assetId } = Route.useParams();
  const { data: asset, isLoading: assetLoading, isError: assetError } = useAsset(assetId);
  const { data: workOrders, isLoading: woLoading, isError: woError } = useWorkOrders({ assetId });

  if (assetLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  if (assetError || !asset) {
    return <EmptyState title="Asset not found" description={`Could not find asset "${assetId}".`} />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Assets", to: "/assets/inventory" },
          { label: asset.name },
        ]}
      />

      <DescriptionList
        list={[
          { term: "Name", definition: asset.name },
          {
            term: "Type",
            definition: <StatusChip value={asset.type} color="default" />,
          },
          { term: "Location", definition: asset.location },
          {
            term: "Status",
            definition: (
              <StatusIndicator
                label={asset.status}
                color={statusIndicatorColors[asset.status]}
              />
            ),
          },
          {
            term: "Health Score",
            definition: (
              <StatusChip
                value={`${asset.healthScore}%`}
                color={healthChipColor(asset.healthScore)}
              />
            ),
          },
          { term: "Efficiency", definition: `${asset.efficiency.toFixed(1)}%` },
          { term: "Age", definition: `${asset.ageYears} year${asset.ageYears !== 1 ? "s" : ""}` },
          {
            term: "Last Inspection",
            definition: new Date(asset.lastInspection).toLocaleDateString(),
          },
          {
            term: "Next Maintenance",
            definition: new Date(asset.nextMaintenance).toLocaleDateString(),
          },
        ]}
      />

      {/* Alerts */}
      {asset.alerts.length > 0 && (
        <section>
          <h3 className="text-medium font-[550] dark:font-[500] mb-3">Active Alerts</h3>
          <ul className="space-y-2">
            {asset.alerts.map((alert) => (
              <li
                key={alert.id}
                className="flex items-start gap-3 bg-content2 rounded-medium p-3 shadow-small"
              >
                <StatusChip
                  value={alert.severity}
                  color={alertSeverityColors[alert.severity]}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-tiny">{alert.message}</p>
                  <p className="text-tiny text-foreground-400 mt-0.5">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Work Orders */}
      <section>
        <h3 className="text-medium font-[550] dark:font-[500] mb-3">Related Work Orders</h3>
        <Table>
          <TableHead>
            <TableHeadRow>
              <TableHeadCell>Type</TableHeadCell>
              <TableHeadCell>Priority</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Technician</TableHeadCell>
              <TableHeadCell>Scheduled</TableHeadCell>
              <TableHeadCell>Notes</TableHeadCell>
            </TableHeadRow>
          </TableHead>
          <TableBody>
            {woLoading ? (
              <TableSkeleton columns={[80, 60, 80, 100, 100, 200]} rows={3} />
            ) : woError ? (
              <TableError colSpan={6} />
            ) : workOrders && workOrders.length > 0 ? (
              workOrders.map((wo) => (
                <TableRow key={wo.id}>
                  <TableCell fitWidth>
                    <StatusChip value={wo.type} color="default" />
                  </TableCell>
                  <TableCell fitWidth>
                    <StatusChip value={wo.priority} color={priorityColors[wo.priority]} />
                  </TableCell>
                  <TableCell fitWidth>
                    <StatusChip value={wo.status} color={workOrderStatusColors[wo.status]} />
                  </TableCell>
                  <TableCell>{wo.technician}</TableCell>
                  <TableCell fitWidth>
                    {new Date(wo.scheduledDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{wo.notes}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No work orders for this asset.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
