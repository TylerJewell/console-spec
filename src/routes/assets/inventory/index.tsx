import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { useAssets } from "@/hooks/useAssetData";
import type { AssetStatus } from "@/types/assets";

export const Route = createFileRoute("/assets/inventory/")({
  component: AssetInventoryPage,
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

function AssetInventoryPage() {
  const navigate = useNavigate();
  const { data: assets, isLoading, isError } = useAssets();

  return (
    <Table>
      <TableHead>
        <TableHeadRow>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Type</TableHeadCell>
          <TableHeadCell>Location</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
          <TableHeadCell>Health</TableHeadCell>
          <TableHeadCell>Efficiency</TableHeadCell>
          <TableHeadCell>Age</TableHeadCell>
        </TableHeadRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          <TableSkeleton columns={[120, 100, 80, 80, 60, 60, 40]} rows={8} />
        ) : isError ? (
          <TableError colSpan={7} />
        ) : assets && assets.length > 0 ? (
          assets.map((asset) => (
            <TableRow
              key={asset.id}
              onClick={() =>
                navigate({
                  to: "/assets/inventory/$assetId",
                  params: { assetId: asset.id },
                })
              }
            >
              <TableCell>
                <span className="font-[550] dark:font-[500]">{asset.name}</span>
              </TableCell>
              <TableCell fitWidth>
                <StatusChip value={asset.type} color="default" />
              </TableCell>
              <TableCell>{asset.location}</TableCell>
              <TableCell fitWidth>
                <StatusIndicator
                  label={asset.status}
                  color={statusIndicatorColors[asset.status]}
                />
              </TableCell>
              <TableCell fitWidth>
                <StatusChip
                  value={`${asset.healthScore}%`}
                  color={healthChipColor(asset.healthScore)}
                />
              </TableCell>
              <TableCell fitWidth>{asset.efficiency.toFixed(1)}%</TableCell>
              <TableCell fitWidth>{asset.ageYears} yr{asset.ageYears !== 1 ? "s" : ""}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6">
              <EmptyState title="No assets found" />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
