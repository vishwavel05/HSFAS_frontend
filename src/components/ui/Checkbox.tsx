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
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={cx(
              "peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border-2 border-surface-border bg-white transition-colors checked:border-brand-blue checked:bg-brand-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
              className
            )}
            {...rest}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
          >
            <path
              d="M4 12.5l4.5 4.5L20 6"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {label && (
          <span className="text-sm font-medium text-navy">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
