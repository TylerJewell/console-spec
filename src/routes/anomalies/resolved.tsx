import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAnomalies } from "@/hooks/useAnomalyData";
import { AnomalyTable } from "./-components/AnomalyTable";
import { AnomalyDetailModal } from "./-components/AnomalyDetailModal";
import type { Anomaly } from "@/types/anomalies";

export const Route = createFileRoute("/anomalies/resolved")({
  component: ResolvedAnomaliesPage,
});

function ResolvedAnomaliesPage() {
  const { data: anomalies, isLoading, isError } = useAnomalies({
    status: ["resolved", "false_positive"],
  });

  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function handleRowClick(anomaly: Anomaly) {
    setSelectedAnomaly(anomaly);
    setModalOpen(true);
  }

  return (
    <div className="space-y-4">
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
