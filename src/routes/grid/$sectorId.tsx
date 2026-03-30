import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DescriptionList } from "@/components/DescriptionList";
import { StatusChip } from "@/components/StatusChip";
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
import { EmptyState } from "@/components/EmptyState";
import { useGridSector, useGridEvents } from "@/hooks/useGridData";
import type { SectorStatus, GridEventSeverity } from "@/types/grid";

export const Route = createFileRoute("/grid/$sectorId")({
  component: SectorDetailPage,
});

const sectorStatusColors: Record<
  SectorStatus,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  normal: "success",
  warning: "warning",
  critical: "danger",
  blackout: "danger",
};

const eventSeverityColors: Record<
  GridEventSeverity,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  info: "default",
  warning: "warning",
  critical: "danger",
};

function SectorDetailPage() {
  const { sectorId } = Route.useParams();
  const { data: sector, isLoading: sectorLoading, isError: sectorError } = useGridSector(sectorId);
  const { data: events, isLoading: eventsLoading, isError: eventsError } = useGridEvents(sectorId);

  if (sectorLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  if (sectorError || !sector) {
    return <EmptyState title="Sector not found" description={`Could not find sector "${sectorId}".`} />;
  }

  const loadPercent = sector.capacity > 0 ? ((sector.load / sector.capacity) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Grid", to: "/grid" },
          { label: sector.name },
        ]}
      />

      <DescriptionList
        list={[
          { term: "Sector", definition: sector.name },
          {
            term: "Status",
            definition: (
              <StatusChip value={sector.status} color={sectorStatusColors[sector.status]} />
            ),
          },
          { term: "Frequency", definition: `${sector.frequency.toFixed(3)} Hz` },
          { term: "Voltage", definition: `${sector.voltage.toFixed(1)} kV` },
          {
            term: "Load / Capacity",
            definition: `${sector.load.toLocaleString()} / ${sector.capacity.toLocaleString()} MW (${loadPercent}%)`,
          },
          {
            term: "Last Updated",
            definition: new Date(sector.lastUpdated).toLocaleString(),
          },
        ]}
      />

      <section>
        <h3 className="text-medium font-[550] dark:font-[500] mb-3">Event Log</h3>
        <Table>
          <TableHead>
            <TableHeadRow>
              <TableHeadCell>Severity</TableHeadCell>
              <TableHeadCell>Type</TableHeadCell>
              <TableHeadCell>Description</TableHeadCell>
              <TableHeadCell>Timestamp</TableHeadCell>
            </TableHeadRow>
          </TableHead>
          <TableBody>
            {eventsLoading ? (
              <TableSkeleton columns={[60, 120, 200, 140]} rows={5} />
            ) : eventsError ? (
              <TableError colSpan={4} />
            ) : events && events.length > 0 ? (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell fitWidth>
                    <StatusChip
                      value={event.severity}
                      color={eventSeverityColors[event.severity]}
                    />
                  </TableCell>
                  <TableCell fitWidth>
                    <StatusChip value={event.type} color="default" />
                  </TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell fitWidth>
                    {new Date(event.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No events recorded for this sector.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
