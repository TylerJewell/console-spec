import type { ReactNode } from "react";

interface TableCellProps {
  children: ReactNode;
  fitWidth?: boolean;
  className?: string;
  colSpan?: number;
}

export function TableCell({ children, fitWidth, className = "", colSpan }: TableCellProps) {
  const base =
    "p-2 px-3 bg-content2 dark:bg-content1 group-hover:bg-content3 dark:group-hover:bg-content2 group-last:first:rounded-bl-md group-last:last:rounded-br-md break-words";
  const fit = fitWidth ? "w-px whitespace-nowrap" : "";

  return (
    <td className={`${base} ${fit} ${className}`.trim()} colSpan={colSpan}>
      {children}
    </td>
  );
}
