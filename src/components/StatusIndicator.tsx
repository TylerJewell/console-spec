const bgColors: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  secondary: "bg-secondary",
  default: "bg-foreground-500",
  primary: "bg-primary",
};

const animateClasses: Record<string, string> = {
  spin: "animate-spin",
  pulse: "animate-pulse-fast",
  "spin-slow": "animate-spin-slow",
};

interface StatusIndicatorProps {
  label: string;
  color: "success" | "warning" | "danger" | "secondary" | "default" | "primary";
  animate?: "spin" | "pulse" | "spin-slow";
}

export function StatusIndicator({ label, color, animate }: StatusIndicatorProps) {
  const bg = bgColors[color] ?? bgColors.default;
  const anim = animate ? animateClasses[animate] ?? "" : "";

  return (
    <div className="flex items-center gap-1">
      <span className={`w-3 h-3 rounded-full ${bg} ${anim}`.trim()} />
      <span className="text-tiny font-[550] dark:font-[500] leading-none pl-1.5">
        {label}
      </span>
    </div>
  );
}
