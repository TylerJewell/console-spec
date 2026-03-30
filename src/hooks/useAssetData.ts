import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockEngine } from "@/mock";
import type { AssetFilters, WorkOrderFilters, CreateWorkOrderInput } from "@/types/assets";

export function useAssets(filters?: AssetFilters) {
  return useQuery({
    queryKey: ["assets", filters],
    queryFn: () => mockEngine.getAssets(filters),
    refetchInterval: 20000,
  });
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: ["assets", id],
    queryFn: () => mockEngine.getAsset(id),
    enabled: !!id,
    refetchInterval: 20000,
  });
}

export function useWorkOrders(filters?: WorkOrderFilters) {
  return useQuery({
    queryKey: ["assets", "work-orders", filters],
    queryFn: () => mockEngine.getWorkOrders(filters),
    refetchInterval: 20000,
  });
}

export function useCreateWorkOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateWorkOrderInput) => Promise.resolve(mockEngine.createWorkOrder(input)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

export function useHealthOverview() {
  return useQuery({
    queryKey: ["assets", "health-overview"],
    queryFn: () => mockEngine.getHealthOverview(),
    refetchInterval: 20000,
  });
}
