import { useQuery } from "@tanstack/react-query";
import { mockEngine } from "@/mock";

export function useGridSectors() {
  return useQuery({
    queryKey: ["grid", "sectors"],
    queryFn: () => mockEngine.getGridSectors(),
    refetchInterval: 5000,
  });
}

export function useGridSector(sectorId: string) {
  return useQuery({
    queryKey: ["grid", "sectors", sectorId],
    queryFn: () => mockEngine.getGridSector(sectorId),
    refetchInterval: 5000,
    enabled: !!sectorId,
  });
}

export function useGridEvents(sectorId: string) {
  return useQuery({
    queryKey: ["grid", "events", sectorId],
    queryFn: () => mockEngine.getGridEvents(sectorId),
    refetchInterval: 5000,
    enabled: !!sectorId,
  });
}
