import type { TradeOrder, OrderType, Market, PortfolioPosition, CreateOrderInput, OrderStatus } from "@/types/trading";
import { uuid, randomFloat, randomInt, randomItem, weightedRandom, hoursAgo } from "../utils";

const COUNTERPARTIES = [
  "PowerCo Energy", "GridTrade LLC", "Apex Power Markets", "Northern Energy Corp",
  "SunPeak Trading", "VoltEdge Partners", "MeridianPower Inc", "Cascade Commodities",
  "Eclipse Energy Group", "Pinnacle Power Trading",
];

const ORDER_STATUSES: OrderStatus[] = ["pending", "open", "filled", "partially_filled", "cancelled", "expired"];
const STATUS_WEIGHTS = [20, 15, 30, 10, 15, 10];

export function seedTradeOrders(): TradeOrder[] {
  const orders: TradeOrder[] = [];

  for (let i = 0; i < 75; i++) {
    const market: Market = randomItem(["spot", "day_ahead"]);
    const type: OrderType = randomItem(["buy", "sell"]);
    const status = weightedRandom(ORDER_STATUSES, STATUS_WEIGHTS);

    const price = market === "spot"
      ? parseFloat(randomFloat(20, 80).toFixed(2))
      : parseFloat(randomFloat(25, 65).toFixed(2));

    const quantity = randomInt(10, 500);
    let filledQuantity = 0;
    if (status === "filled") filledQuantity = quantity;
    else if (status === "partially_filled") filledQuantity = randomInt(1, quantity - 1);

    const createdAt = hoursAgo(randomFloat(0, 168));

    orders.push({
      id: uuid(),
      type,
      market,
      price,
      quantity,
      filledQuantity,
      status,
      counterparty: randomItem(COUNTERPARTIES),
      createdAt,
      updatedAt: new Date(Math.max(new Date(createdAt).getTime(), Date.now() - randomInt(0, 72) * 3600000)).toISOString(),
    });
  }

  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function computePortfolioPosition(orders: TradeOrder[]): PortfolioPosition {
  let totalBought = 0;
  let totalSold = 0;
  let buyValue = 0;
  let sellValue = 0;

  for (const order of orders) {
    if (order.filledQuantity <= 0) continue;
    if (order.type === "buy") {
      totalBought += order.filledQuantity;
      buyValue += order.filledQuantity * order.price;
    } else {
      totalSold += order.filledQuantity;
      sellValue += order.filledQuantity * order.price;
    }
  }

  const avgBuyPrice = totalBought > 0 ? parseFloat((buyValue / totalBought).toFixed(2)) : 0;
  const avgSellPrice = totalSold > 0 ? parseFloat((sellValue / totalSold).toFixed(2)) : 0;
  const minQty = Math.min(totalBought, totalSold);
  const realizedPnL = parseFloat((minQty * (avgSellPrice - avgBuyPrice)).toFixed(2));

  return {
    netPosition: totalBought - totalSold,
    totalBought,
    totalSold,
    avgBuyPrice,
    avgSellPrice,
    realizedPnL,
  };
}

export function progressOrders(orders: TradeOrder[]): TradeOrder | null {
  const advanceable = orders.filter((o) => o.status === "pending" || o.status === "open" || o.status === "partially_filled");
  if (advanceable.length === 0) return null;

  const order = randomItem(advanceable);
  const now = new Date().toISOString();

  if (order.status === "pending") {
    order.status = randomItem(["open", "cancelled"] as OrderStatus[]);
  } else if (order.status === "open") {
    const next = weightedRandom(
      ["partially_filled", "filled", "expired"] as OrderStatus[],
      [40, 40, 20],
    );
    order.status = next;
    if (next === "filled") order.filledQuantity = order.quantity;
    else if (next === "partially_filled") order.filledQuantity = randomInt(1, order.quantity - 1);
  } else if (order.status === "partially_filled") {
    order.status = "filled";
    order.filledQuantity = order.quantity;
  }

  order.updatedAt = now;
  return order;
}

export function createTradeOrder(input: CreateOrderInput): TradeOrder {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    type: input.type,
    market: input.market,
    price: input.price,
    quantity: input.quantity,
    filledQuantity: 0,
    status: "pending",
    counterparty: randomItem(COUNTERPARTIES),
    createdAt: now,
    updatedAt: now,
  };
}
