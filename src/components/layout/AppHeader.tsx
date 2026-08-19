"use client";

import { useState, ReactNode } from "react";
import { HindustanLogo, HindustanBadge40 } from "./HindustanBrandmark";

interface AccountMenu {
  onHistory: () => void;
  onLogout: () => void;
}

export function AppHeader({
  title,
  subtitle,
  onBack,
  menu,
}: {
  title: ReactNode;
  subtitle: ReactNode;
  onBack?: () => void;
  /**
   * Optional History/Logout dropdown, shown as a vertical three-dot
   * button on the far right. Omitted entirely (same header as before)
   * unless a page explicitly passes it — every existing page that
   * doesn't need it is unaffected.
   */
  menu?: AccountMenu;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-navy px-5 pb-5 pt-4 shadow-sm">
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
        <div className="ml-auto flex items-center gap-2">
          <HindustanBadge40 className="h-12" />

          {menu && (
            <div className="relative">
              <button
                type="button"
                aria-label="Account menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="5.5" r="1.6" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.6" fill="currentColor" />
                  <circle cx="12" cy="18.5" r="1.6" fill="currentColor" />
                </svg>
              </button>

              {menuOpen && (
                <>
                  {/* Backdrop: closes the menu on any outside click/tap */}
                  <button
                    type="button"
                    aria-hidden="true"
                    tabIndex={-1}
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />
                  <div className="absolute right-0 top-10 z-50 w-40 overflow-hidden rounded-xl bg-white py-1 shadow-card-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        menu.onHistory();
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-semibold text-navy hover:bg-surface"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.7" />
                        <path
                          d="M12 7.5V12l3 2"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      History
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        menu.onLogout();
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-semibold text-navy hover:bg-surface"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M9 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H9"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                        <path
                          d="M14 8l4 4-4 4M18 12H9"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-5">
        <h1 className="text-2xl font-extrabold text-white">{title}</h1>
        <p className="mt-1 text-sm text-white/70">{subtitle}</p>
      </div>
    </div>
  );
}
