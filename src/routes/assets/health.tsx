import { createFileRoute } from "@tanstack/react-router";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { StatusIndicator } from "@/components/StatusIndicator";
import { EmptyState } from "@/components/EmptyState";
import { useHealthOverview } from "@/hooks/useAssetData";

export const Route = createFileRoute("/assets/health")({
  component: HealthOverviewPage,
});

const healthColor = (
  score: number,
): "success" | "warning" | "danger" => {
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "danger";
};

const healthIndicatorColor = (
  score: number,
): "success" | "warning" | "danger" | "secondary" | "default" | "primary" => {
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "danger";
};

function HealthOverviewPage() {
  const { data: overview, isLoading, isError } = useHealthOverview();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} shadow="sm">
            <CardBody>
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return <EmptyState title="Failed to load health data" description="An error occurred while fetching health overview." />;
  }

  if (!overview || overview.length === 0) {
    return <EmptyState title="No health data available" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {overview.map((item) => (
        <Card key={item.assetType} shadow="sm">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between w-full">
              <span className="text-small font-[550] dark:font-[500]">
                {item.assetTypeLabel}
              </span>
              <StatusIndicator
                label={`${item.averageHealthScore}%`}
                color={healthIndicatorColor(item.averageHealthScore)}
              />
            </div>
          </CardHeader>
          <CardBody className="pt-0 gap-2">
            <Progress
              size="sm"
              value={item.averageHealthScore}
              color={healthColor(item.averageHealthScore)}
              aria-label={`Health: ${item.averageHealthScore}%`}
            />
            <div className="flex justify-between text-tiny text-foreground-500">
              <span>{item.count} total</span>
              <span>
                <span className="text-success">{item.onlineCount} online</span>
                {" / "}
                <span className="text-danger">{item.offlineCount} offline</span>
              </span>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
