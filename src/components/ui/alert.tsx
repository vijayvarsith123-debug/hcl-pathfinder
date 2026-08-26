import React from "react";
import { cn } from "@/lib/utils";
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = "info",
  title,
  children,
  onClose,
  ...props
}) => {
  const styles = {
    info: {
      bg: "bg-blue-50/80 border-blue-200 text-blue-900",
      icon: <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />,
    },
    success: {
      bg: "bg-emerald-50/80 border-emerald-200 text-emerald-900",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />,
    },
    warning: {
      bg: "bg-amber-50/80 border-amber-200 text-amber-900",
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />,
    },
    error: {
      bg: "bg-rose-50/80 border-rose-200 text-rose-900",
      icon: <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />,
    },
  };

  return (
    <div
      className={cn(
        "relative flex gap-3 p-4 rounded-xl border text-sm transition-all",
        styles[variant].bg,
        className
      )}
      role="alert"
      {...props}
    >
      {styles[variant].icon}
      <div className="flex-1">
        {title && <h5 className="font-semibold leading-tight mb-1">{title}</h5>}
        <div className="text-slate-700 text-xs leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
