import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-bold text-slate-800 dark:text-[#F8FAFC]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 dark:text-slate-400 pointer-events-none">{leftIcon}</div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full h-10 rounded-xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#1E293B] px-3 py-2 text-xs text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-[#94A3B8] transition-colors focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:opacity-60",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              error && "border-rose-500 focus:border-rose-600 focus:ring-rose-500/20",
              className
            )}
            {...props}
          />
          {rightIcon && <div className="absolute right-3 text-slate-400">{rightIcon}</div>}
        </div>
        {error ? (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-[#CBD5E1]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
