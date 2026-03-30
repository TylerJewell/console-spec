import { useState, type FormEvent } from "react";
import { Button } from "@heroui/button";
import { Modal } from "@/components/Modal";
import { DescriptionList } from "@/components/DescriptionList";
import { StatusChip } from "@/components/StatusChip";
import { FormSelect, FormInput, FormTextarea } from "@/components/Form";
import { pushToast } from "@/components/Toast";
import { useUpdateAnomaly } from "@/hooks/useAnomalyData";
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

interface AnomalyDetailModalProps {
  anomaly: Anomaly | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnomalyDetailModal({
  anomaly,
  isOpen,
  onOpenChange,
}: AnomalyDetailModalProps) {
  const updateAnomaly = useUpdateAnomaly();
  const [newStatus, setNewStatus] = useState<AnomalyStatus>("investigating");
  const [assignedTo, setAssignedTo] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");

  if (!anomaly) return null;

  const isResolvable = anomaly.status === "new" || anomaly.status === "investigating";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!anomaly) return;

    try {
      await updateAnomaly.mutateAsync({
        id: anomaly.id,
        update: {
          status: newStatus,
          assignedTo: assignedTo || undefined,
          resolutionNotes: resolutionNotes || undefined,
        },
      });

      pushToast("Anomaly updated", {
        description: `Status changed to ${newStatus.replace(/_/g, " ")}`,
        variant: "success",
      });
      onOpenChange(false);
    } catch {
      pushToast("Failed to update anomaly", { variant: "error" });
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      heading={`Anomaly: ${anomaly.type.replace(/_/g, " ")}`}
      size="xl"
    >
      <div className="space-y-4 w-full">
        <DescriptionList
          list={[
            {
              term: "Severity",
              definition: (
                <StatusChip value={anomaly.severity} color={severityColors[anomaly.severity]} />
              ),
            },
            {
              term: "Status",
              definition: (
                <StatusChip value={anomaly.status} color={statusColors[anomaly.status]} />
              ),
            },
            { term: "Source", definition: anomaly.source },
            { term: "Description", definition: anomaly.description },
            {
              term: "Detected",
              definition: new Date(anomaly.timestamp).toLocaleString(),
            },
            ...(anomaly.assignedTo
              ? [{ term: "Assigned To", definition: anomaly.assignedTo }]
              : []),
            ...(anomaly.resolvedAt
              ? [{ term: "Resolved At", definition: new Date(anomaly.resolvedAt).toLocaleString() }]
              : []),
            ...(anomaly.resolutionNotes
              ? [{ term: "Resolution Notes", definition: anomaly.resolutionNotes }]
              : []),
          ]}
        />

        {isResolvable && (
          <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-divider">
            <h4 className="text-small font-[550] dark:font-[500]">Update Anomaly</h4>

            <FormSelect
              id="anomaly-status"
              label="New Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as AnomalyStatus)}
              options={[
                { value: "investigating", label: "Investigating" },
                { value: "resolved", label: "Resolved" },
                { value: "false_positive", label: "False Positive" },
              ]}
            />

            <FormInput
              id="anomaly-assigned"
              label="Assigned To"
              placeholder="e.g. John Doe"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />

            <FormTextarea
              id="anomaly-notes"
              label="Resolution Notes"
              placeholder="Describe the resolution or investigation findings..."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
            />

            <Button
              type="submit"
              color="primary"
              size="sm"
              isLoading={updateAnomaly.isPending}
            >
              Update
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
}
