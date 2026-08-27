import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-10 w-full rounded-2xl bg-white dark:bg-[#172033] border border-slate-200 dark:border-[#273449] p-6 shadow-xl animate-in zoom-in-95 duration-200 text-slate-900 dark:text-[#F8FAFC]",
          widthClasses[maxWidth]
        )}
      >
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-[#273449]/60">
          <div>
            {title && <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{title}</h3>}
            {description && <p className="text-xs text-slate-600 dark:text-[#CBD5E1] mt-0.5">{description}</p>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="py-4">{children}</div>

        {footer && <div className="pt-4 border-t border-slate-100 dark:border-[#273449]/60 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};
