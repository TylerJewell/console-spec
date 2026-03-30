import { ReactNode, useState } from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";

interface PrimaryNavItemProps {
  title: string;
  to?: string;
  icon?: ReactNode;
  isExpandable?: boolean;
  defaultExpanded?: boolean;
  depth?: number;
  children?: ReactNode;
}

export function PrimaryNavItem({
  title, to, icon, isExpandable = false, defaultExpanded = false, depth = 0, children,
}: PrimaryNavItemProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const matchRoute = useMatchRoute();
  const isActive = to ? !!matchRoute({ to, fuzzy: false }) : false;

  const depthPadding = depth > 0 ? { paddingLeft: `${depth * 16 + 8}px` } : {};

  const labelContent = (
    <div className="inline-flex items-center gap-2 min-w-0">
      <div className={`inline-flex items-center min-w-0 gap-2 pl-1.5 pr-2 py-1 rounded-small transition-colors ${isActive ? "bg-primary/50" : ""}`}>
        {icon}
        <span className="text-left truncate">{title}</span>
      </div>
    </div>
  );

  const expandIcon = isExpandable ? (
    <ChevronDown className={`w-4 h-4 flex-none transition-transform fill-foreground/60 ${!expanded ? "-rotate-90" : ""}`} />
  ) : null;

  const baseClass = "relative flex items-center justify-between gap-1.5 min-h-8 p-1 bg-transparent text-xxs leading-4 w-full rounded-small";
  const interactive = " hover:bg-foreground/10 transition-colors";

  let element: ReactNode;
  if (isExpandable) {
    element = (
      <button onClick={() => setExpanded(!expanded)} className={baseClass + interactive} style={depthPadding} aria-expanded={expanded}>
        {labelContent}{expandIcon}
      </button>
    );
  } else if (to) {
    element = (
      <Link to={to} className={baseClass + interactive} style={depthPadding}>
        {labelContent}
      </Link>
    );
  } else {
    element = <div className={baseClass} style={depthPadding}>{labelContent}</div>;
  }

  return (
    <li>
      {element}
      {isExpandable && (
        <div className="grid transition-[grid-template-rows] duration-300 ease-in-out" style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}>
          <div className="overflow-hidden">
            {expanded && <ul className="list-none m-0 p-0">{children}</ul>}
          </div>
        </div>
      )}
    </li>
  );
}
