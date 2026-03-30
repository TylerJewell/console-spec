import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface TableHeadCellProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  sortDirection?: "asc" | "desc" | null;
  fitWidth?: boolean;
}

export function TableHeadCell({
  children,
  className = "",
  onClick,
  sortDirection,
  fitWidth,
}: TableHeadCellProps) {
  const base =
    "first:rounded-tl-md last:rounded-tr-md bg-content2 dark:bg-content1 font-[550] dark:font-[500] p-2 px-3 whitespace-nowrap";
  const clickable = onClick ? "cursor-pointer select-none" : "";
  const fit = fitWidth ? "w-px" : "";

  return (
    <th
      className={`${base} ${clickable} ${fit} ${className}`.trim()}
      onClick={onClick}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {onClick && sortDirection !== undefined && (
          <ChevronDown
            className={`w-3 h-3 transition-transform ${
              sortDirection === "asc"
                ? "rotate-180"
                : sortDirection === "desc"
                  ? ""
                  : "opacity-30"
            }`}
          />
        )}
      </span>
    </th>
  );
}
