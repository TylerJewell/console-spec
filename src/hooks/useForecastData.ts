import { useQuery } from "@tanstack/react-query";
import { mockEngine } from "@/mock";
import type { ForecastFilters } from "@/types/forecasting";

export function useForecasts(filters?: ForecastFilters) {
  return useQuery({
    queryKey: ["forecasting", filters],
    queryFn: () => mockEngine.getForecasts(filters),
    refetchInterval: 30000,
  });
}
