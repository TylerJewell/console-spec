import { TableRow } from "./TableRow";
import { TableCell } from "./TableCell";

interface TableErrorProps {
  colSpan: number;
  message?: string;
}

export function TableError({ colSpan, message = "Failed to load data." }: TableErrorProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-danger text-center py-6">
        {message}
      </TableCell>
    </TableRow>
  );
}
