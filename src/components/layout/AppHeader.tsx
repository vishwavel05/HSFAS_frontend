"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HindustanLogo, HindustanBadge40 } from "./HindustanBrandmark";

export function AppHeader({
  title,
  subtitle,
  onBack,
  showMenu = false,
  hideBack = false,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  onBack?: () => void;
  showMenu?: boolean;
  hideBack?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { logout, user } = useAuth();
  
  // NOTE: is_admin is not fully typed in Next.js AuthUser yet, 
  // but if the backend provides it or if we mock it, we can use it.
  const isAdmin = (user as any)?.isAdmin === true;

  return (
    <div className="sticky top-0 z-50 bg-navy px-5 pb-5 pt-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 justify-start">
          {!hideBack && (onBack || true) && (
            <button
              aria-label="Go back"
              onClick={onBack || (() => router.back())}
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
        </div>

        <div className="flex shrink-0 items-center justify-center gap-4">
          <HindustanLogo className="h-12" />
          <HindustanBadge40 className="h-14" />
        </div>

        <div className="flex flex-1 justify-end">
          {showMenu && (
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
                  <button
                    type="button"
                    aria-hidden="true"
                    tabIndex={-1}
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />
                  <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-xl bg-white py-1 shadow-card-lg">
                    
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("/profile");
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-semibold text-navy hover:bg-surface"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Profile
                    </button>
                    
                    {!isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            router.push("/history");
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
                            router.push("/reports");
                          }}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-semibold text-navy hover:bg-surface"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M3 3v18h18"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7 14l4-4 4 4 6-6"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Reports
                        </button>
                      </>
                    )}

                    {isAdmin && (
                      <>
                        <div className="h-px bg-surface-border my-1" />
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            router.push("/admin/dashboard");
                          }}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-semibold text-brand-blue hover:bg-surface"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                          Admin Dashboard
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            router.push("/admin/analytics");
                          }}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-semibold text-brand-blue hover:bg-surface"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 3v18h18" />
                            <path d="M18 17V9" />
                            <path d="M13 17V5" />
                            <path d="M8 17v-3" />
                          </svg>
                          Global Analytics
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            router.push("/admin/enroll-student");
                          }}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-semibold text-brand-blue hover:bg-surface"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                          </svg>
                          Enroll Student
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            router.push("/admin/assign-lecture");
                          }}
                          className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-semibold text-brand-blue hover:bg-surface"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          Assign Lecture
                        </button>
                      </>
                    )}

                    <div className="h-px bg-surface-border my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                        router.replace("/login");
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-semibold text-danger hover:bg-surface"
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
      {(title || subtitle) && (
        <div className="mt-5">
          {title && <h1 className="text-2xl font-extrabold text-white">{title}</h1>}
          {subtitle && <p className="mt-1 text-sm text-white/70">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}
