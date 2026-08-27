import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl cursor-pointer";

    const variantStyles = {
      primary: "bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 active:bg-blue-800 shadow-xs",
      secondary: "bg-slate-100 dark:bg-[#1E293B] text-slate-900 dark:text-[#F8FAFC] hover:bg-slate-200 dark:hover:bg-[#273449] border border-slate-200 dark:border-[#273449]",
      outline: "border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#172033] text-slate-800 dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#1E293B] shadow-xs",
      ghost: "text-slate-700 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#1E293B] hover:text-slate-900 dark:hover:text-white",
      danger: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-xs",
      success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-xs",
      link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline p-0 h-auto font-semibold",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-xs gap-2",
      lg: "h-12 px-6 text-sm gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          variant !== "link" && sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
