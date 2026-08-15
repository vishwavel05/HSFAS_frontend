"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cx } from "@/lib/utils";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

type Variant = "primary" | "secondary" | "outline" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-brand-blue to-brand-blue-dark text-white shadow-lg shadow-brand-blue/40 hover:shadow-brand-blue/50 active:from-brand-blue-dark active:to-brand-blue-dark disabled:from-blue-300 disabled:to-blue-300 disabled:shadow-none",
  secondary:
    "bg-navy text-white hover:bg-navy-light disabled:bg-navy/40",
  outline:
    "bg-white text-brand-blue border border-brand-blue hover:bg-brand-blue-light disabled:text-blue-300 disabled:border-blue-200",
  danger:
    "bg-white text-danger border border-danger/40 hover:bg-danger-light disabled:text-red-300",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      isLoading = false,
      fullWidth = true,
      className,
      children,
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cx(
          "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] font-semibold transition-all duration-150 disabled:cursor-not-allowed",
          fullWidth && "w-full",
          variantClasses[variant],
          className
        )}
        {...rest}
      >
        {isLoading && <LoadingSpinner size={18} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
