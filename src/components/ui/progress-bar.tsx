import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "warning" | "danger";
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = "md",
  variant = "primary",
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const fillVariantStyles = {
    primary: "bg-blue-600",
    success: "bg-emerald-600",
    warning: "bg-amber-500",
    danger: "bg-rose-600",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-700">
          {label ? <span>{label}</span> : <span />}
          {showPercentage && <span className="font-semibold text-slate-900">{percentage}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50", heightStyles[size])}>
        <div
          className={cn("h-full transition-all duration-500 ease-out rounded-full", fillVariantStyles[variant])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
