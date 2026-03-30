import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {icon && <div className="mb-4 opacity-50" style={{ width: 48, height: 48 }}>{icon}</div>}
      <p className="text-medium font-[550]">{title}</p>
      {description && (
        <p className="text-tiny text-foreground-500 max-w-sm text-center mt-1">
          {description}
        </p>
      )}
    </div>
  );
}
