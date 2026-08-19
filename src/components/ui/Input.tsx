"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cx } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  rightSlot?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, rightSlot, error, className, id, ...rest }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1 block text-sm font-bold text-navy"
          >
            {label}
          </label>
        )}
        <div
          className={cx(
            "flex items-center gap-2.5 rounded-2xl border bg-white px-4 py-2.5 transition-colors",
            error
              ? "border-danger"
              : "border-surface-border focus-within:border-brand-blue"
          )}
        >
          {icon && <span className="text-surface-muted shrink-0">{icon}</span>}
          <input
            ref={ref}
            id={id}
            className={cx(
              "w-full min-w-0 bg-transparent text-[15px] text-navy placeholder:text-surface-muted outline-none",
              className
            )}
            {...rest}
          />
          {rightSlot && <span className="shrink-0">{rightSlot}</span>}
        </div>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
