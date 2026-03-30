import type { ReactNode } from "react";
import { Card, CardBody } from "@heroui/card";

const borderColors: Record<string, string> = {
  primary: "border-l-primary",
  secondary: "border-l-secondary",
  success: "border-l-success",
  warning: "border-l-warning",
  danger: "border-l-danger",
  default: "border-l-foreground-500",
};

interface MetricCardProps {
  label: string;
  value: string | number;
  color?: string;
  prefix?: string;
  suffix?: string;
  children?: ReactNode;
}

export function MetricCard({
  label,
  value,
  color = "primary",
  prefix,
  suffix,
  children,
}: MetricCardProps) {
  const borderClass = borderColors[color] ?? borderColors.primary;

  return (
    <Card shadow="sm" className={`border-l-3 ${borderClass}`}>
      <CardBody>
        <p className="text-tiny font-[550] dark:font-[500] text-foreground-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-[550] dark:font-[500]">
          {prefix}
          {value}
          {suffix}
        </p>
        {children}
      </CardBody>
    </Card>
  );
}
