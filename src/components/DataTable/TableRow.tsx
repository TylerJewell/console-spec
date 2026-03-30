import type { ReactNode } from "react";

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
}

export function TableRow({ children, onClick }: TableRowProps) {
  return (
    <tr
      className={`group text-tiny text-left align-top ${onClick ? "cursor-pointer" : ""}`.trim()}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}
