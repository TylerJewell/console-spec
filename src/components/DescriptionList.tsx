import type { ReactNode } from "react";

interface DescriptionListItem {
  term: string;
  definition: ReactNode;
}

interface DescriptionListProps {
  list: DescriptionListItem[];
  floating?: boolean;
  boxed?: boolean;
  className?: string;
}

export function DescriptionList({
  list,
  floating = true,
  boxed = true,
  className = "",
}: DescriptionListProps) {
  const wrapperClass = [
    boxed ? "bg-content2 rounded-medium p-4" : "",
    floating ? "shadow-small" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <dl className={wrapperClass || undefined}>
      {list.map((item) => (
        <div key={item.term} className="py-2 first:pt-0 last:pb-0">
          <dt className="text-tiny font-[550] dark:font-[500] pb-1.5">
            {item.term}
          </dt>
          <dd className="flex flex-wrap gap-1">{item.definition}</dd>
        </div>
      ))}
    </dl>
  );
}
