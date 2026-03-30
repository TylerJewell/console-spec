import type { ReactNode } from "react";
import { toast, Toaster as SonnerToaster } from "sonner";
import { Info, CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";

type ToastVariant = "regular" | "success" | "warning" | "error";

const variantConfig: Record<
  ToastVariant,
  { icon: typeof Info; duration: number }
> = {
  regular: { icon: Info, duration: 6000 },
  success: { icon: CheckCircle, duration: 6000 },
  warning: { icon: AlertTriangle, duration: Infinity },
  error: { icon: XCircle, duration: Infinity },
};

interface PushToastOptions {
  variant?: ToastVariant;
  description?: ReactNode;
}

export function pushToast(message: string, options: PushToastOptions = {}) {
  const { variant = "regular", description } = options;
  const { icon: Icon, duration } = variantConfig[variant];

  toast.custom(
    (id) => (
      <div className="relative bg-content1 shadow-small rounded-small p-4 pl-10 min-w-[300px]">
        <Icon className="w-4 h-4 absolute left-3 top-4" />
        <button
          type="button"
          onClick={() => toast.dismiss(id)}
          className="absolute top-1 right-1 p-1 rounded hover:bg-foreground/10"
          aria-label="Close"
        >
          <X className="w-3 h-3" />
        </button>
        <p className="text-small font-[550] dark:font-[500]">{message}</p>
        {description && (
          <div className="text-tiny text-foreground-500 mt-1">{description}</div>
        )}
      </div>
    ),
    { duration },
  );
}

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{ unstyled: true }}
    />
  );
}
