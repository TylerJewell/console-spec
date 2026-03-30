import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@heroui/button";
import { StatusChip } from "@/components/StatusChip";
import { Modal } from "@/components/Modal";
import { FormInput, FormSelect, FormTextarea } from "@/components/Form";
import { EmptyState } from "@/components/EmptyState";
import { pushToast } from "@/components/Toast";
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
import { useWorkOrders, useCreateWorkOrder, useAssets } from "@/hooks/useAssetData";
import type { WorkOrderStatus, Priority, WorkOrderType } from "@/types/assets";

export const Route = createFileRoute("/assets/work-orders")({
  component: WorkOrdersPage,
});

const statusColors: Record<
  WorkOrderStatus,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  scheduled: "default",
  in_progress: "primary",
  completed: "success",
  deferred: "secondary",
};

const priorityColors: Record<
  Priority,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  low: "default",
  medium: "primary",
  high: "warning",
  critical: "danger",
};

function WorkOrdersPage() {
  const { data: workOrders, isLoading, isError } = useWorkOrders();
  const { data: assets } = useAssets();
  const createWorkOrder = useCreateWorkOrder();

  const [modalOpen, setModalOpen] = useState(false);
  const [assetId, setAssetId] = useState("");
  const [woType, setWoType] = useState<WorkOrderType>("preventive");
  const [priority, setPriority] = useState<Priority>("medium");
  const [scheduledDate, setScheduledDate] = useState("");
  const [technician, setTechnician] = useState("");
  const [notes, setNotes] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  function resetForm() {
    setAssetId("");
    setWoType("preventive");
    setPriority("medium");
    setScheduledDate("");
    setTechnician("");
    setNotes("");
    setFormErrors({});
  }

  function validate(): boolean {
    const errors: Record<string, string[]> = {};
    if (!assetId) errors.assetId = ["Please select an asset."];
    if (!scheduledDate) errors.scheduledDate = ["Please select a date."];
    if (!technician.trim()) errors.technician = ["Technician name is required."];
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createWorkOrder.mutateAsync({
        assetId,
        type: woType,
        priority,
        scheduledDate,
        technician: technician.trim(),
        notes: notes.trim(),
      });

      pushToast("Work order created", { variant: "success" });
      setModalOpen(false);
      resetForm();
    } catch {
      pushToast("Failed to create work order", { variant: "error" });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button color="primary" size="sm" onPress={() => setModalOpen(true)}>
          Create Work Order
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableHeadRow>
            <TableHeadCell>Asset</TableHeadCell>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell>Priority</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Technician</TableHeadCell>
            <TableHeadCell>Scheduled</TableHeadCell>
            <TableHeadCell>Notes</TableHeadCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={[120, 80, 60, 80, 100, 100, 200]} rows={8} />
          ) : isError ? (
            <TableError colSpan={7} />
          ) : workOrders && workOrders.length > 0 ? (
            workOrders.map((wo) => (
              <TableRow key={wo.id}>
                <TableCell>
                  <span className="font-[550] dark:font-[500]">{wo.assetName}</span>
                </TableCell>
                <TableCell fitWidth>
                  <StatusChip value={wo.type} color="default" />
                </TableCell>
                <TableCell fitWidth>
                  <StatusChip value={wo.priority} color={priorityColors[wo.priority]} />
                </TableCell>
                <TableCell fitWidth>
                  <StatusChip value={wo.status} color={statusColors[wo.status]} />
                </TableCell>
                <TableCell>{wo.technician}</TableCell>
                <TableCell fitWidth>
                  {new Date(wo.scheduledDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{wo.notes}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                <EmptyState title="No work orders" description="Create a work order to get started." />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) resetForm();
        }}
        heading="Create Work Order"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <FormSelect
            id="wo-asset"
            label="Asset"
            required
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            errors={formErrors.assetId}
            options={[
              { value: "", label: "Select an asset..." },
              ...(assets ?? []).map((a) => ({ value: a.id, label: a.name })),
            ]}
          />

          <FormSelect
            id="wo-type"
            label="Type"
            required
            value={woType}
            onChange={(e) => setWoType(e.target.value as WorkOrderType)}
            options={[
              { value: "preventive", label: "Preventive" },
              { value: "corrective", label: "Corrective" },
              { value: "emergency", label: "Emergency" },
            ]}
          />

          <FormSelect
            id="wo-priority"
            label="Priority"
            required
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "critical", label: "Critical" },
            ]}
          />

          <FormInput
            id="wo-date"
            label="Scheduled Date"
            type="date"
            required
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            errors={formErrors.scheduledDate}
          />

          <FormInput
            id="wo-technician"
            label="Technician"
            required
            placeholder="e.g. Jane Smith"
            value={technician}
            onChange={(e) => setTechnician(e.target.value)}
            errors={formErrors.technician}
          />

          <FormTextarea
            id="wo-notes"
            label="Notes"
            placeholder="Additional details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button
            type="submit"
            color="primary"
            isLoading={createWorkOrder.isPending}
          >
            Create
          </Button>
        </form>
      </Modal>
    </div>
  );
}
