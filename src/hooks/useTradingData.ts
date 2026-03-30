import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockEngine } from "@/mock";
import type { OrderFilters, CreateOrderInput } from "@/types/trading";

export function useTradeOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ["trading", "orders", filters],
    queryFn: () => mockEngine.getTradeOrders(filters),
    refetchInterval: 10000,
  });
}

export function usePortfolioPosition() {
  return useQuery({
    queryKey: ["trading", "position"],
    queryFn: () => mockEngine.getPortfolioPosition(),
    refetchInterval: 10000,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => Promise.resolve(mockEngine.createTradeOrder(input)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trading"] });
    },
  });
}
