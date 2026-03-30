import { createFileRoute } from "@tanstack/react-router";
import { DescriptionList } from "@/components/DescriptionList";
import { EmptyState } from "@/components/EmptyState";
import { usePortfolioPosition } from "@/hooks/useTradingData";

export const Route = createFileRoute("/trading/positions")({
  component: PositionsPage,
});

function PositionsPage() {
  const { data: position, isLoading, isError } = usePortfolioPosition();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <EmptyState title="Failed to load position" description="An error occurred while fetching portfolio data." />;
  }

  if (!position) {
    return <EmptyState title="No position data" description="Portfolio position is currently unavailable." />;
  }

  const pnlColor = position.realizedPnL >= 0 ? "text-success" : "text-danger";
  const pnlSign = position.realizedPnL >= 0 ? "+" : "";

  return (
    <div className="max-w-xl">
      <h3 className="text-medium font-[550] dark:font-[500] mb-4">Portfolio Position</h3>
      <DescriptionList
        list={[
          {
            term: "Net Position",
            definition: (
              <span className={position.netPosition >= 0 ? "text-success" : "text-danger"}>
                {position.netPosition >= 0 ? "+" : ""}
                {position.netPosition.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MWh
              </span>
            ),
          },
          {
            term: "Total Bought",
            definition: `${position.totalBought.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MWh`,
          },
          {
            term: "Total Sold",
            definition: `${position.totalSold.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MWh`,
          },
          {
            term: "Avg Buy Price",
            definition: `$${position.avgBuyPrice.toFixed(2)}/MWh`,
          },
          {
            term: "Avg Sell Price",
            definition: `$${position.avgSellPrice.toFixed(2)}/MWh`,
          },
          {
            term: "Realized P&L",
            definition: (
              <span className={`text-lg font-[550] dark:font-[500] ${pnlColor}`}>
                {pnlSign}${Math.abs(position.realizedPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
