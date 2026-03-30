import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@heroui/button";
import { FormInput } from "@/components/Form";
import { StatusChip } from "@/components/StatusChip";
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
} from "@/components/DataTable";
import { useCreateDispatchPlan, useApprovePlan } from "@/hooks/useDispatchData";
import type { DispatchPlan, DispatchUnitStatus, FuelType } from "@/types/dispatch";

export const Route = createFileRoute("/dispatch/new")({
  component: NewPlanPage,
});

const unitStatusColors: Record<
  DispatchUnitStatus,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  dispatched: "success",
  standby: "default",
  ramping_up: "primary",
  ramping_down: "warning",
  offline: "danger",
};

const fuelTypeColors: Record<
  FuelType,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  gas: "warning",
  coal: "default",
  nuclear: "danger",
  solar: "success",
  wind: "primary",
  hydro: "secondary",
};

type Step = "input" | "review";

function NewPlanPage() {
  const navigate = useNavigate();
  const createPlan = useCreateDispatchPlan();
  const approvePlan = useApprovePlan();

  const [step, setStep] = useState<Step>("input");
  const [demandTarget, setDemandTarget] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<DispatchPlan | null>(null);

  function validateAndGenerate(e: FormEvent) {
    e.preventDefault();
    const value = parseFloat(demandTarget);
    if (!demandTarget || isNaN(value) || value <= 0) {
      setErrors(["Demand target must be a positive number."]);
      return;
    }
    if (value > 50000) {
      setErrors(["Demand target cannot exceed 50,000 MW."]);
      return;
    }
    setErrors([]);
    generatePlan(value);
  }

  async function generatePlan(target: number) {
    try {
      const plan = await createPlan.mutateAsync({ demandTarget: target });
      setGeneratedPlan(plan);
      setStep("review");
    } catch {
      pushToast("Failed to generate plan", { variant: "error" });
    }
  }

  async function handleApprove() {
    if (!generatedPlan) return;
    try {
      await approvePlan.mutateAsync(generatedPlan.id);
      pushToast("Plan approved and dispatched", {
        description: `${generatedPlan.demandTarget.toLocaleString()} MW demand target, $${generatedPlan.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} total cost`,
        variant: "success",
      });
      navigate({ to: "/dispatch/active" });
    } catch {
      pushToast("Failed to approve plan", { variant: "error" });
    }
  }

  if (step === "input") {
    return (
      <div className="max-w-lg">
        <h3 className="text-medium font-[550] dark:font-[500] mb-4">Create New Dispatch Plan</h3>
        <p className="text-tiny text-foreground-500 mb-4">
          Enter the demand target and the system will generate an optimized merit order dispatch plan.
        </p>
        <form onSubmit={validateAndGenerate} className="space-y-4">
          <FormInput
            id="demand-target"
            label="Demand Target (MW)"
            required
            type="number"
            step="1"
            min="1"
            max="50000"
            placeholder="e.g. 5000"
            value={demandTarget}
            onChange={(e) => setDemandTarget(e.target.value)}
            errors={errors}
          />
          <Button
            type="submit"
            color="primary"
            isLoading={createPlan.isPending}
          >
            Generate Plan
          </Button>
        </form>
      </div>
    );
  }

  // Review step
  if (!generatedPlan) {
    return <EmptyState title="No plan generated" description="Something went wrong. Please try again." />;
  }

  const sortedUnits = [...generatedPlan.units].sort((a, b) => a.marginalCost - b.marginalCost);
  const totalOutput = sortedUnits.reduce((sum, u) => sum + u.outputMw, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-medium font-[550] dark:font-[500]">Review Dispatch Plan</h3>
          <p className="text-tiny text-foreground-500 mt-1">
            Review the generated plan below, then approve to dispatch.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="bordered"
            onPress={() => {
              setStep("input");
              setGeneratedPlan(null);
            }}
          >
            Back
          </Button>
          <Button
            color="success"
            onPress={handleApprove}
            isLoading={approvePlan.isPending}
          >
            Approve & Dispatch
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-content2 rounded-medium p-4 shadow-small">
          <p className="text-tiny text-foreground-500">Demand Target</p>
          <p className="text-lg font-[550] dark:font-[500]">
            {generatedPlan.demandTarget.toLocaleString()} MW
          </p>
        </div>
        <div className="bg-content2 rounded-medium p-4 shadow-small">
          <p className="text-tiny text-foreground-500">Total Output</p>
          <p className="text-lg font-[550] dark:font-[500]">
            {totalOutput.toLocaleString()} MW
          </p>
        </div>
        <div className="bg-content2 rounded-medium p-4 shadow-small">
          <p className="text-tiny text-foreground-500">Total Cost</p>
          <p className="text-lg font-[550] dark:font-[500]">
            ${generatedPlan.totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <section>
        <h4 className="text-small font-[550] dark:font-[500] mb-3">
          Merit Order ({sortedUnits.length} units)
        </h4>
        <Table>
          <TableHead>
            <TableHeadRow>
              <TableHeadCell>#</TableHeadCell>
              <TableHeadCell>Generator</TableHeadCell>
              <TableHeadCell>Fuel Type</TableHeadCell>
              <TableHeadCell>Output</TableHeadCell>
              <TableHeadCell>Max Capacity</TableHeadCell>
              <TableHeadCell>Marginal Cost</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableHeadRow>
          </TableHead>
          <TableBody>
            {sortedUnits.map((unit, idx) => (
              <TableRow key={unit.generatorId}>
                <TableCell fitWidth>{idx + 1}</TableCell>
                <TableCell>
                  <span className="font-[550] dark:font-[500]">{unit.generatorName}</span>
                </TableCell>
                <TableCell fitWidth>
                  <StatusChip value={unit.fuelType} color={fuelTypeColors[unit.fuelType]} />
                </TableCell>
                <TableCell fitWidth>
                  {unit.outputMw.toLocaleString()} MW
                </TableCell>
                <TableCell fitWidth>
                  {unit.maxCapacityMw.toLocaleString()} MW
                </TableCell>
                <TableCell fitWidth>
                  ${unit.marginalCost.toFixed(2)}/MWh
                </TableCell>
                <TableCell fitWidth>
                  <StatusChip value={unit.status} color={unitStatusColors[unit.status]} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
