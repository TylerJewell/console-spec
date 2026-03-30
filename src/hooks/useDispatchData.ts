import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockEngine } from "@/mock";
import type { PlanFilters, CreatePlanInput } from "@/types/dispatch";

export function useDispatchPlans(filters?: PlanFilters) {
  return useQuery({
    queryKey: ["dispatch", "plans", filters],
    queryFn: () => mockEngine.getDispatchPlans(filters),
    refetchInterval: 10000,
  });
}

export function useDispatchPlan(id: string) {
  return useQuery({
    queryKey: ["dispatch", "plans", id],
    queryFn: () => mockEngine.getDispatchPlan(id),
    enabled: !!id,
  });
}

export function useCreateDispatchPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePlanInput) => Promise.resolve(mockEngine.createDispatchPlan(input.demandTarget)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
    },
  });
}

export function useApprovePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Promise.resolve(mockEngine.approvePlan(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispatch"] });
    },
  });
}
