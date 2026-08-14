"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cx } from "@/lib/utils";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, id, ...rest }, ref) => {
    return (
      <label
        htmlFor={id}
        className="inline-flex items-center gap-2 cursor-pointer select-none"
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={cx(
            "h-4 w-4 rounded border-surface-border text-brand-blue focus:ring-brand-blue accent-brand-blue",
            className
          )}
          {...rest}
        />
        {label && <span className="text-sm text-navy">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
