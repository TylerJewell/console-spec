import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { StatusIndicator } from "@/components/StatusIndicator";
import { EmptyState } from "@/components/EmptyState";
import { useGridSectors } from "@/hooks/useGridData";
import type { SectorStatus } from "@/types/grid";

export const Route = createFileRoute("/grid/")({
  component: GridOverviewPage,
});

const statusColors: Record<
  SectorStatus,
  "success" | "warning" | "danger" | "secondary" | "default" | "primary"
> = {
  normal: "success",
  warning: "warning",
  critical: "danger",
  blackout: "danger",
};

const statusAnimations: Record<SectorStatus, "pulse" | "spin" | "spin-slow" | undefined> = {
  normal: undefined,
  warning: "pulse",
  critical: "pulse",
  blackout: undefined,
};

const progressColors: Record<SectorStatus, "success" | "warning" | "danger" | "default" | "primary" | "secondary"> = {
  normal: "success",
  warning: "warning",
  critical: "danger",
  blackout: "danger",
};

function GridOverviewPage() {
  const navigate = useNavigate();
  const { data: sectors, isLoading, isError } = useGridSectors();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} shadow="sm">
            <CardBody>
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return <EmptyState title="Failed to load sectors" description="An error occurred while fetching grid data." />;
  }

  if (!sectors || sectors.length === 0) {
    return <EmptyState title="No sectors available" description="No grid sectors have been configured." />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sectors.map((sector) => {
        const loadPercent = sector.capacity > 0 ? (sector.load / sector.capacity) * 100 : 0;

        return (
          <Card
            key={sector.id}
            shadow="sm"
            isPressable
            onPress={() => navigate({ to: "/grid/$sectorId", params: { sectorId: sector.id } })}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-1">
              <div className="flex items-center justify-between w-full">
                <span className="text-small font-[550] dark:font-[500]">{sector.name}</span>
                <StatusIndicator
                  label={sector.status}
                  color={statusColors[sector.status]}
                  animate={statusAnimations[sector.status]}
                />
              </div>
            </CardHeader>
            <CardBody className="pt-0 gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-[550] dark:font-[500]">
                  {sector.frequency.toFixed(3)} Hz
                </span>
                <span className="text-tiny text-foreground-500">
                  {sector.voltage.toFixed(1)} kV
                </span>
              </div>
              <div>
                <div className="flex justify-between text-tiny text-foreground-500 mb-1">
                  <span>Load</span>
                  <span>
                    {sector.load.toLocaleString()} / {sector.capacity.toLocaleString()} MW
                  </span>
                </div>
                <Progress
                  size="sm"
                  value={loadPercent}
                  color={progressColors[sector.status]}
                  aria-label={`Load: ${loadPercent.toFixed(0)}%`}
                />
              </div>
              <p className="text-tiny text-foreground-400">
                Updated: {new Date(sector.lastUpdated).toLocaleTimeString()}
              </p>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
