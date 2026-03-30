import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockEngine } from "@/mock";
import type { AnomalyFilters, AnomalyUpdate } from "@/types/anomalies";

export function useAnomalies(filters?: AnomalyFilters) {
  return useQuery({
    queryKey: ["anomalies", filters],
    queryFn: () => mockEngine.getAnomalies(filters),
    refetchInterval: 15000,
  });
}

export function useAnomaly(id: string) {
  return useQuery({
    queryKey: ["anomalies", id],
    queryFn: () => mockEngine.getAnomaly(id),
    enabled: !!id,
  });
}

export function useUpdateAnomaly() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, update }: { id: string; update: AnomalyUpdate }) =>
      Promise.resolve(mockEngine.updateAnomaly(id, update)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anomalies"] });
    },
  });
}

export function useCriticalAnomalyCount() {
  return useQuery({
    queryKey: ["anomalies", "critical-count"],
    queryFn: () => mockEngine.getCriticalAnomalyCount(),
    refetchInterval: 15000,
  });
}
