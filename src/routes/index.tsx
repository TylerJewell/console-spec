import { createFileRoute } from "@tanstack/react-router";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { StatusChip } from "@/components/StatusChip";
import { StatusIndicator } from "@/components/StatusIndicator";
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
import {
  useDashboardMetrics,
  useRecentAnomalies,
  useAgentStatuses,
} from "@/hooks/useDashboardData";
import type { AnomalySeverity } from "@/types/anomalies";
import type { AgentOperationalStatus } from "@/types/agents";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

const severityChipColors: Record<
  AnomalySeverity,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  info: "default",
  low: "secondary",
  medium: "primary",
  high: "warning",
  critical: "danger",
};

const anomalyTypeChipColors: Record<
  string,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  frequency_deviation: "warning",
  voltage_anomaly: "danger",
  load_spike: "primary",
  price_manipulation: "danger",
  asset_degradation: "secondary",
  cyber_intrusion: "danger",
};

const agentStatusColors: Record<
  AgentOperationalStatus,
  "success" | "warning" | "danger" | "secondary" | "default" | "primary"
> = {
  active: "success",
  idle: "default",
  processing: "primary",
};

const agentStatusAnimations: Record<
  AgentOperationalStatus,
  "spin" | "pulse" | "spin-slow" | undefined
> = {
  active: undefined,
  idle: undefined,
  processing: "pulse",
};

function DashboardPage() {
  const metrics = useDashboardMetrics();
  const anomalies = useRecentAnomalies(5);
  const agents = useAgentStatuses();

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Real-time overview of grid operations, trading, and system health"
        Icon={LayoutDashboard}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metrics.isLoading ? (
          Array.from({ length: 6 }, (_, i) => (
            <Card key={i} shadow="sm" className="border-l-3 border-l-foreground-500">
              <CardBody>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </CardBody>
            </Card>
          ))
        ) : metrics.isError ? (
          <Card shadow="sm" className="col-span-full">
            <CardBody className="text-danger">Failed to load metrics.</CardBody>
          </Card>
        ) : metrics.data ? (
          <>
            <MetricCard
              label="Grid Frequency"
              value={metrics.data.gridFrequency.value.toFixed(3)}
              suffix=" Hz"
              color={
                metrics.data.gridFrequency.status === "normal"
                  ? "success"
                  : metrics.data.gridFrequency.status === "warning"
                    ? "warning"
                    : "danger"
              }
            />
            <MetricCard
              label="Portfolio P&L"
              value={`$${Math.abs(metrics.data.portfolioPnL.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              prefix={metrics.data.portfolioPnL.isPositive ? "+" : "-"}
              color={metrics.data.portfolioPnL.isPositive ? "success" : "danger"}
            />
            <MetricCard
              label="Forecast Accuracy"
              value={`${metrics.data.forecastAccuracy.value.toFixed(1)}%`}
              color={
                metrics.data.forecastAccuracy.value >= 90
                  ? "success"
                  : metrics.data.forecastAccuracy.value >= 75
                    ? "warning"
                    : "danger"
              }
            >
              <StatusChip
                value={metrics.data.forecastAccuracy.label}
                color={
                  metrics.data.forecastAccuracy.label === "Excellent"
                    ? "success"
                    : metrics.data.forecastAccuracy.label === "Good"
                      ? "primary"
                      : "warning"
                }
              />
            </MetricCard>
            <MetricCard
              label="Active Anomalies"
              value={metrics.data.activeAnomalies.count}
              color={
                severityChipColors[metrics.data.activeAnomalies.highestSeverity] === "danger"
                  ? "danger"
                  : severityChipColors[metrics.data.activeAnomalies.highestSeverity] === "warning"
                    ? "warning"
                    : "primary"
              }
            />
            <MetricCard
              label="Fleet Health"
              value={`${metrics.data.fleetHealthScore.value.toFixed(1)}%`}
              color={
                metrics.data.fleetHealthScore.value > 80
                  ? "success"
                  : metrics.data.fleetHealthScore.value >= 50
                    ? "warning"
                    : "danger"
              }
            />
            <MetricCard
              label="Dispatch Cost"
              value={`$${metrics.data.dispatchCost.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              suffix="/MWh"
              color="primary"
            />
          </>
        ) : null}
      </div>

      {/* Recent Anomalies */}
      <section className="mb-8">
        <h2 className="text-lg font-[550] dark:font-[500] mb-3">Recent Anomalies</h2>
        <Table>
          <TableHead>
            <TableHeadRow>
              <TableHeadCell>Severity</TableHeadCell>
              <TableHeadCell>Type</TableHeadCell>
              <TableHeadCell>Source</TableHeadCell>
              <TableHeadCell>Timestamp</TableHeadCell>
            </TableHeadRow>
          </TableHead>
          <TableBody>
            {anomalies.isLoading ? (
              <TableSkeleton columns={[60, 120, 100, 140]} rows={5} />
            ) : anomalies.isError ? (
              <TableError colSpan={4} />
            ) : anomalies.data && anomalies.data.length > 0 ? (
              anomalies.data.map((a) => (
                <TableRow key={a.id}>
                  <TableCell fitWidth>
                    <StatusChip value={a.severity} color={severityChipColors[a.severity]} />
                  </TableCell>
                  <TableCell fitWidth>
                    <StatusChip
                      value={a.type}
                      color={anomalyTypeChipColors[a.type] ?? "default"}
                    />
                  </TableCell>
                  <TableCell>{a.source}</TableCell>
                  <TableCell fitWidth>
                    {new Date(a.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No recent anomalies.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      {/* Agent Status Cards */}
      <section>
        <h2 className="text-lg font-[550] dark:font-[500] mb-3">Agent Status</h2>
        {agents.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i} shadow="sm">
                <CardBody>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                  <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </CardBody>
              </Card>
            ))}
          </div>
        ) : agents.isError ? (
          <Card shadow="sm">
            <CardBody className="text-danger">Failed to load agent statuses.</CardBody>
          </Card>
        ) : agents.data && agents.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.data.map((agent) => (
              <Card key={agent.id} shadow="sm">
                <CardHeader className="pb-1">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-small font-[550] dark:font-[500]">
                      {agent.name}
                    </span>
                    <StatusIndicator
                      label={agent.status}
                      color={agentStatusColors[agent.status]}
                      animate={agentStatusAnimations[agent.status]}
                    />
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <p className="text-tiny text-foreground-500">{agent.domain}</p>
                  <p className="text-tiny text-foreground-500 mt-1">
                    {agent.description}
                  </p>
                  <p className="text-tiny text-foreground-400 mt-1">
                    Updated: {new Date(agent.lastUpdated).toLocaleTimeString()}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="No agents available" />
        )}
      </section>
    </>
  );
}
