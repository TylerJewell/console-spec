import type { ComponentType, ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  Icon?: ComponentType<{ className?: string }>;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, Icon, children }: PageHeaderProps) {
  return (
    <div className="mb-9 flex flex-wrap gap-x-6 gap-y-3 w-full">
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          {Icon && <Icon className="w-8 h-8 fill-current mr-2" />}
          <h1 className="text-2xl font-[550] dark:font-[500] leading-none">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="mt-1 text-tiny text-foreground-500">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex-none flex gap-3">{children}</div>}
    </div>
  );
}
