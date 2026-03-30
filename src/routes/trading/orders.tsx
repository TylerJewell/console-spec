import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { StatusChip } from "@/components/StatusChip";
import { FilterBar } from "@/components/FilterBar";
import { EmptyState } from "@/components/EmptyState";
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
import { useTradeOrders } from "@/hooks/useTradingData";
import type { OrderFilters, OrderStatus, OrderType, Market } from "@/types/trading";

export const Route = createFileRoute("/trading/orders")({
  component: OrdersPage,
});

const statusColors: Record<
  OrderStatus,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  pending: "default",
  open: "primary",
  filled: "success",
  partially_filled: "warning",
  cancelled: "danger",
  expired: "secondary",
};

const typeColors: Record<
  OrderType,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  buy: "success",
  sell: "danger",
};

function OrdersPage() {
  const [filters, setFilters] = useState<OrderFilters>({});
  const [sortBy, setSortBy] = useState<keyof import("@/types/trading").TradeOrder | undefined>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const queryFilters: OrderFilters = {
    ...filters,
    sortBy,
    sortDirection,
  };

  const { data: orders, isLoading, isError } = useTradeOrders(queryFilters);

  const handleFilterChange = useCallback((name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  }, []);

  const handleClear = useCallback(() => {
    setFilters({});
  }, []);

  const handleSort = useCallback(
    (column: keyof import("@/types/trading").TradeOrder) => {
      if (sortBy === column) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(column);
        setSortDirection("desc");
      }
    },
    [sortBy],
  );

  const getSortDir = (col: string) =>
    sortBy === col ? sortDirection : null;

  return (
    <div className="space-y-4">
      <FilterBar
        filters={[
          {
            name: "market",
            label: "All Markets",
            value: filters.market ?? "",
            options: [
              { value: "spot", label: "Spot" },
              { value: "day_ahead", label: "Day Ahead" },
            ],
          },
          {
            name: "type",
            label: "All Types",
            value: filters.type ?? "",
            options: [
              { value: "buy", label: "Buy" },
              { value: "sell", label: "Sell" },
            ],
          },
          {
            name: "status",
            label: "All Statuses",
            value: filters.status ?? "",
            options: [
              { value: "pending", label: "Pending" },
              { value: "open", label: "Open" },
              { value: "filled", label: "Filled" },
              { value: "partially_filled", label: "Partially Filled" },
              { value: "cancelled", label: "Cancelled" },
              { value: "expired", label: "Expired" },
            ],
          },
        ]}
        onFilterChange={handleFilterChange}
        onClear={handleClear}
      />

      <Table>
        <TableHead>
          <TableHeadRow>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell>Market</TableHeadCell>
            <TableHeadCell
              onClick={() => handleSort("price")}
              sortDirection={getSortDir("price")}
            >
              Price
            </TableHeadCell>
            <TableHeadCell
              onClick={() => handleSort("quantity")}
              sortDirection={getSortDir("quantity")}
            >
              Quantity
            </TableHeadCell>
            <TableHeadCell>Filled</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Counterparty</TableHeadCell>
            <TableHeadCell
              onClick={() => handleSort("createdAt")}
              sortDirection={getSortDir("createdAt")}
            >
              Created
            </TableHeadCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableSkeleton columns={[50, 70, 60, 60, 50, 80, 100, 130]} rows={8} />
          ) : isError ? (
            <TableError colSpan={8} />
          ) : orders && orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell fitWidth>
                  <StatusChip value={order.type} color={typeColors[order.type]} />
                </TableCell>
                <TableCell fitWidth>
                  <StatusChip value={order.market} color="default" />
                </TableCell>
                <TableCell fitWidth>
                  ${order.price.toFixed(2)}/MWh
                </TableCell>
                <TableCell fitWidth>
                  {order.quantity.toLocaleString()} MWh
                </TableCell>
                <TableCell fitWidth>
                  {order.filledQuantity.toLocaleString()} MWh
                </TableCell>
                <TableCell fitWidth>
                  <StatusChip value={order.status} color={statusColors[order.status]} />
                </TableCell>
                <TableCell>{order.counterparty}</TableCell>
                <TableCell fitWidth>
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                <EmptyState title="No orders found" description="Adjust your filters or create a new order." />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
