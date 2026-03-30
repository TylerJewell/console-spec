import type { ReactNode } from "react";
import { AlertTriangle, Info, X } from "lucide-react";

const defaultColors: Record<string, string> = {
  warning: "border-warning/25 bg-warning/10",
  secondary: "border-secondary/25 bg-secondary/10",
};

const icons: Record<string, typeof AlertTriangle> = {
  warning: AlertTriangle,
  secondary: Info,
};

interface NoticeBannerProps {
  severity: "warning" | "secondary";
  variant?: "default" | "ghost";
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function NoticeBanner({
  severity,
  variant = "default",
  children,
  dismissible,
  onDismiss,
  className = "",
}: NoticeBannerProps) {
  const Icon = icons[severity];
  const isDefault = variant === "default";
  const base = isDefault
    ? `border ${defaultColors[severity]} rounded`
    : "";

  return (
    <div className={`relative flex items-start gap-2 p-3 ${base} ${className}`.trim()}>
      <Icon className="w-4 h-4 flex-none mt-0.5" />
      <div className="text-xxs text-foreground/80 flex-1">{children}</div>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-1 right-1 p-1 rounded hover:bg-foreground/10"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
