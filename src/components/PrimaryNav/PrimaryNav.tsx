import { PrimaryNavItem } from "./PrimaryNavItem";
import { LayoutDashboard, Zap, TrendingUp, BarChart3, Shield, Wrench, Factory } from "lucide-react";

const iconClass = "w-4 h-4 flex-none";

export function PrimaryNav() {
  return (
    <nav className="w-full flex flex-col p-3">
      <ul className="list-none m-0 p-0 space-y-0.5">
        <PrimaryNavItem title="Dashboard" to="/" icon={<LayoutDashboard className={iconClass} />} />

        <PrimaryNavItem title="Grid Monitoring" icon={<Zap className={iconClass} />} isExpandable defaultExpanded>
          <PrimaryNavItem title="Overview" to="/grid" depth={1} />
          <PrimaryNavItem title="North" to="/grid/north" depth={1} />
          <PrimaryNavItem title="South" to="/grid/south" depth={1} />
          <PrimaryNavItem title="East" to="/grid/east" depth={1} />
          <PrimaryNavItem title="West" to="/grid/west" depth={1} />
          <PrimaryNavItem title="Central" to="/grid/central" depth={1} />
        </PrimaryNavItem>

        <PrimaryNavItem title="Energy Trading" icon={<TrendingUp className={iconClass} />} isExpandable>
          <PrimaryNavItem title="Orders" to="/trading/orders" depth={1} />
          <PrimaryNavItem title="Positions" to="/trading/positions" depth={1} />
          <PrimaryNavItem title="New Order" to="/trading/new-order" depth={1} />
        </PrimaryNavItem>

        <PrimaryNavItem title="Forecasting" icon={<BarChart3 className={iconClass} />} isExpandable>
          <PrimaryNavItem title="Demand" to="/forecasting/demand" depth={1} />
          <PrimaryNavItem title="Solar Generation" to="/forecasting/solar" depth={1} />
          <PrimaryNavItem title="Wind Generation" to="/forecasting/wind" depth={1} />
          <PrimaryNavItem title="Price" to="/forecasting/price" depth={1} />
        </PrimaryNavItem>

        <PrimaryNavItem title="Anomalies" icon={<Shield className={iconClass} />} isExpandable>
          <PrimaryNavItem title="Active" to="/anomalies/active" depth={1} />
          <PrimaryNavItem title="Resolved" to="/anomalies/resolved" depth={1} />
          <PrimaryNavItem title="All" to="/anomalies/all" depth={1} />
        </PrimaryNavItem>

        <PrimaryNavItem title="Assets" icon={<Wrench className={iconClass} />} isExpandable>
          <PrimaryNavItem title="Inventory" to="/assets/inventory" depth={1} />
          <PrimaryNavItem title="Work Orders" to="/assets/work-orders" depth={1} />
          <PrimaryNavItem title="Health Overview" to="/assets/health" depth={1} />
        </PrimaryNavItem>

        <PrimaryNavItem title="Dispatch" icon={<Factory className={iconClass} />} isExpandable>
          <PrimaryNavItem title="Active Plans" to="/dispatch/active" depth={1} />
          <PrimaryNavItem title="Plan History" to="/dispatch/history" depth={1} />
          <PrimaryNavItem title="New Plan" to="/dispatch/new" depth={1} />
        </PrimaryNavItem>
      </ul>
    </nav>
  );
}
