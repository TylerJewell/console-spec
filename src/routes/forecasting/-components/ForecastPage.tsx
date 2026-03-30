import { useState, useCallback } from "react";
import { StatusChip } from "@/components/StatusChip";
import { FilterBar } from "@/components/FilterBar";
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
import { useForecasts } from "@/hooks/useForecastData";
import type { ForecastType, ForecastFilters } from "@/types/forecasting";

const accuracyBadgeColor = (
  accuracy: number | null,
): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
  if (accuracy === null) return "default";
  if (accuracy >= 95) return "success";
  if (accuracy >= 85) return "primary";
  if (accuracy >= 70) return "warning";
  return "danger";
};

const accuracyLabel = (accuracy: number | null): string => {
  if (accuracy === null) return "Pending";
  if (accuracy >= 95) return "Excellent";
  if (accuracy >= 85) return "Good";
  if (accuracy >= 70) return "Fair";
  return "Poor";
};

interface ForecastPageProps {
  forecastType: ForecastType;
  unit: string;
}

export function ForecastPage({ forecastType, unit }: ForecastPageProps) {
  const [region, setRegion] = useState("");
  const [hoursAhead, setHoursAhead] = useState<"" | "6" | "12" | "24">("");

  const filters: ForecastFilters = {
    type: forecastType,
    region: region || undefined,
    hoursAhead: hoursAhead ? (parseInt(hoursAhead) as 6 | 12 | 24) : undefined,
  };

  const { data: forecasts, isLoading, isError } = useForecasts(filters);

  const handleFilterChange = useCallback((name: string, value: string) => {
    if (name === "region") setRegion(value);
    if (name === "hoursAhead") setHoursAhead(value as "" | "6" | "12" | "24");
  }, []);

  const handleClear = useCallback(() => {
    setRegion("");
    setHoursAhead("");
  }, []);

  return (
    <div className="space-y-4">
      <FilterBar
        filters={[
          {
            name: "region",
            label: "All Regions",
            value: region,
            options: [
              { value: "north", label: "North" },
              { value: "south", label: "South" },
              { value: "east", label: "East" },
              { value: "west", label: "West" },
              { value: "central", label: "Central" },
            ],
          },
          {
            name: "hoursAhead",
            label: "All Time Ranges",
            value: hoursAhead,
            options: [
              { value: "6", label: "Next 6 hours" },
              { value: "12", label: "Next 12 hours" },
              { value: "24", label: "Next 24 hours" },
            ],
          },
        ]}
        onFilterChange={handleFilterChange}
        onClear={handleClear}
      />

      <Table>
        <TableHead>
          <TableHeadRow>
            <TableHeadCell>Timestamp</TableHeadCell>
            <TableHeadCell>Region</TableHeadCell>
            <TableHeadCell>Predicted</TableHeadCell>
            <TableHeadCell>Actual</TableHeadCell>
            <TableHeadCell>Confidence Range</TableHeadCell>
            <TableHeadCell>Accuracy</TableHeadCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={[130, 60, 70, 70, 100, 80]} rows={8} />
          ) : isError ? (
            <TableError colSpan={6} />
          ) : forecasts && forecasts.length > 0 ? (
            forecasts.map((f) => (
              <TableRow key={f.id}>
                <TableCell fitWidth>
                  {new Date(f.timestamp).toLocaleString()}
                </TableCell>
                <TableCell fitWidth>
                  {f.region.charAt(0).toUpperCase() + f.region.slice(1)}
                </TableCell>
                <TableCell fitWidth>
                  {f.predicted.toLocaleString(undefined, { maximumFractionDigits: 1 })} {unit}
                </TableCell>
                <TableCell fitWidth>
                  {f.actual !== null ? (
                    `${f.actual.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`
                  ) : (
                    <StatusChip value="Pending" color="default" />
                  )}
                </TableCell>
                <TableCell fitWidth>
                  {f.confidenceLow.toLocaleString(undefined, { maximumFractionDigits: 1 })} - {f.confidenceHigh.toLocaleString(undefined, { maximumFractionDigits: 1 })} {unit}
                </TableCell>
                <TableCell fitWidth>
                  {f.accuracy !== null ? (
                    <StatusChip
                      value={`${f.accuracy.toFixed(1)}%`}
                      label={`${f.accuracy.toFixed(1)}% ${accuracyLabel(f.accuracy)}`}
                      color={accuracyBadgeColor(f.accuracy)}
                    />
                  ) : (
                    <StatusChip value="Pending" color="default" />
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                <EmptyState title="No forecasts available" description="Adjust your filters or check back later." />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
