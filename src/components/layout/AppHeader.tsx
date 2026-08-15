"use client";

import { HindustanLogo, HindustanBadge40 } from "./HindustanBrandmark";

export function AppHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle: string;
  onBack?: () => void;
}) {
  return (
    <div className="bg-navy px-5 pb-5 pt-4">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            aria-label="Go back"
            onClick={onBack}
            className="-ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <HindustanLogo className="h-12" />
        <div className="ml-auto">
          <HindustanBadge40 className="h-12" />
        </div>
      </div>
      <div className="mt-5">
        <h1 className="text-2xl font-extrabold text-white">{title}</h1>
        <p className="mt-1 text-sm text-white/70">{subtitle}</p>
      </div>
    </div>
  );
}
