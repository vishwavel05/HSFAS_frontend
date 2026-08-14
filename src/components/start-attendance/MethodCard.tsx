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
}: {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  onTrigger: () => void;
}) {
  return (
    <Card className="flex flex-col items-center px-6 py-7 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-bold text-navy">{title}</h3>
      <p className="mt-1 text-sm text-surface-muted">{description}</p>
      <Button className="mt-5" onClick={onTrigger}>
        {buttonLabel}
      </Button>
    </Card>
  );
}
