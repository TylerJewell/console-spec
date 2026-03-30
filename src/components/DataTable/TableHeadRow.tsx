import type { ReactNode } from "react";

interface TableHeadRowProps {
  children: ReactNode;
}

export function TableHeadRow({ children }: TableHeadRowProps) {
  return <tr className="text-tiny text-left">{children}</tr>;
}
