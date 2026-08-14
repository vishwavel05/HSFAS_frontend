import { HTMLAttributes } from "react";
import { cx } from "@/lib/utils";

export function Card({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-surface-border bg-white shadow-card",
        className
      )}
      {...rest}
    />
  );
}
