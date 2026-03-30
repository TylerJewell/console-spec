interface TableSkeletonProps {
  columns: number[];
  rows?: number;
}

export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }, (_, rowIdx) => (
        <tr key={rowIdx} className="group text-tiny text-left align-top">
          {columns.map((width, colIdx) => (
            <td
              key={colIdx}
              className="p-2 px-3 bg-content2 dark:bg-content1 group-last:first:rounded-bl-md group-last:last:rounded-br-md"
            >
              <div
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                style={{ width: `${width}px` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
