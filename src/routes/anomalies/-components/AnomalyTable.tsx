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
import type { Anomaly, AnomalySeverity, AnomalyStatus } from "@/types/anomalies";

const severityColors: Record<
  AnomalySeverity,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  info: "default",
  low: "secondary",
  medium: "primary",
  high: "warning",
  critical: "danger",
};

const statusColors: Record<
  AnomalyStatus,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  new: "warning",
  investigating: "primary",
  resolved: "success",
  false_positive: "secondary",
};

interface AnomalyTableProps {
  anomalies: Anomaly[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRowClick?: (anomaly: Anomaly) => void;
  showStatus?: boolean;
}

export function AnomalyTable({
  anomalies,
  isLoading,
  isError,
  onRowClick,
  showStatus = true,
}: AnomalyTableProps) {
  return (
    <Table>
      <TableHead>
        <TableHeadRow>
          <TableHeadCell>Severity</TableHeadCell>
          {showStatus && <TableHeadCell>Status</TableHeadCell>}
          <TableHeadCell>Type</TableHeadCell>
          <TableHeadCell>Source</TableHeadCell>
          <TableHeadCell>Description</TableHeadCell>
          <TableHeadCell>Timestamp</TableHeadCell>
          {onRowClick && <TableHeadCell>Action</TableHeadCell>}
        </TableHeadRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          <TableSkeleton
            columns={showStatus ? [60, 80, 100, 100, 200, 130, 60] : [60, 100, 100, 200, 130, 60]}
            rows={8}
          />
        ) : isError ? (
          <TableError colSpan={showStatus ? 7 : 6} />
        ) : anomalies && anomalies.length > 0 ? (
          anomalies.map((a) => (
            <TableRow key={a.id} onClick={onRowClick ? () => onRowClick(a) : undefined}>
              <TableCell fitWidth>
                <StatusChip value={a.severity} color={severityColors[a.severity]} />
              </TableCell>
              {showStatus && (
                <TableCell fitWidth>
                  <StatusChip value={a.status} color={statusColors[a.status]} />
                </TableCell>
              )}
              <TableCell fitWidth>
                <StatusChip value={a.type} color="default" />
              </TableCell>
              <TableCell>{a.source}</TableCell>
              <TableCell>{a.description}</TableCell>
              <TableCell fitWidth>
                {new Date(a.timestamp).toLocaleString()}
              </TableCell>
              {onRowClick && (
                <TableCell fitWidth>
                  <button
                    type="button"
                    className="text-primary text-tiny underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowClick(a);
                    }}
                  >
                    View
                  </button>
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={showStatus ? 7 : 6} className="text-center py-6">
              <EmptyState title="No anomalies found" />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
