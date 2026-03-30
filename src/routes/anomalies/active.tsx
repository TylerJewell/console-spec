import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NoticeBanner } from "@/components/NoticeBanner";
import { useAnomalies, useCriticalAnomalyCount } from "@/hooks/useAnomalyData";
import { AnomalyTable } from "./-components/AnomalyTable";
import { AnomalyDetailModal } from "./-components/AnomalyDetailModal";
import type { Anomaly } from "@/types/anomalies";

export const Route = createFileRoute("/anomalies/active")({
  component: ActiveAnomaliesPage,
});

function ActiveAnomaliesPage() {
  const { data: anomalies, isLoading, isError } = useAnomalies({
    status: ["new", "investigating"],
  });
  const { data: criticalCount } = useCriticalAnomalyCount();

  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function handleRowClick(anomaly: Anomaly) {
    setSelectedAnomaly(anomaly);
    setModalOpen(true);
  }

  return (
    <div className="space-y-4">
      {criticalCount != null && criticalCount > 0 && (
        <NoticeBanner severity="warning">
          {criticalCount} critical anomal{criticalCount === 1 ? "y" : "ies"} requiring immediate attention.
        </NoticeBanner>
      )}

      <AnomalyTable
        anomalies={anomalies}
        isLoading={isLoading}
        isError={isError}
        onRowClick={handleRowClick}
        showStatus
      />

      <AnomalyDetailModal
        anomaly={selectedAnomaly}
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
