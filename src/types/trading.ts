export type OrderType = "buy" | "sell";
export type Market = "spot" | "day_ahead";
export type OrderStatus = "pending" | "open" | "filled" | "partially_filled" | "cancelled" | "expired";

export interface TradeOrder {
  id: string;
  type: OrderType;
  market: Market;
  price: number;
  quantity: number;
  filledQuantity: number;
  status: OrderStatus;
  counterparty: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioPosition {
  netPosition: number;
  totalBought: number;
  totalSold: number;
  avgBuyPrice: number;
  avgSellPrice: number;
  realizedPnL: number;
}

export interface CreateOrderInput {
  type: OrderType;
  market: Market;
  price: number;
  quantity: number;
}

export interface OrderFilters {
  market?: Market;
  type?: OrderType;
  status?: OrderStatus;
  sortBy?: keyof TradeOrder;
  sortDirection?: "asc" | "desc";
}
