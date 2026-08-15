"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReactNode } from "react";

export function MethodCard({
  icon,
  title,
  description,
  buttonLabel,
  onTrigger,
  variant = "upload",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  onTrigger: () => void;
  variant?: "upload" | "camera";
}) {
  const iconBg =
    variant === "upload" ? "bg-brand-blue" : "bg-navy";

  return (
    <Card className="flex flex-col items-center px-6 py-7 text-center">
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full text-white ${iconBg}`}
      >
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>
      <p className="mx-auto mt-1 max-w-[230px] text-sm text-surface-muted">
        {description}
      </p>
      <Button
        className="mt-5 w-auto px-10"
        fullWidth={false}
        onClick={onTrigger}
      >
        {buttonLabel}
      </Button>
    </Card>
  );
}
