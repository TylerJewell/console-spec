import { useQuery } from "@tanstack/react-query";
import { mockEngine } from "@/mock";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: () => mockEngine.getDashboardMetrics(),
    refetchInterval: 5000,
  });
}

export function useRecentAnomalies(limit = 5) {
  return useQuery({
    queryKey: ["dashboard", "recent-anomalies", limit],
    queryFn: () => mockEngine.getRecentAnomalies(limit),
    refetchInterval: 5000,
  });
}

export function useAgentStatuses() {
  return useQuery({
    queryKey: ["dashboard", "agent-statuses"],
    queryFn: () => mockEngine.getAgentStatuses(),
    refetchInterval: 5000,
  });
}
