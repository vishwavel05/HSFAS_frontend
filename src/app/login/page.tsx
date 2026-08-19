"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  HindustanLogo,
  HindustanBadge40,
} from "@/components/layout/HindustanBrandmark";
import { AppFooter } from "@/components/layout/AppFooter";
import { LoginForm } from "@/components/login/LoginForm";

const DEVELOPERS = [
  "Vishwavel Sivakumar",
  "V. Keerthana",
  "Suresh Thevar",
  "Bharat Raj T",
];

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace("/start-attendance");
    }
  }, [isHydrated, isAuthenticated, router]);

  return (
    <div className="flex flex-1 flex-col bg-navy">
      {/* Decorative background: gradient glow + top-right swoosh */}
      <div className="relative shrink-0 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 70% at 50% -10%, rgba(255,255,255,0.14), transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(59,130,246,0.35), rgba(59,130,246,0) 70%)",
          }}
        />
        <svg
          className="pointer-events-none absolute -right-10 -top-10 h-56 w-full max-w-md opacity-40"
          viewBox="0 0 400 200"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M120 0C260 20 340 90 400 60V0H120Z"
            fill="url(#swoosh-gradient)"
          />
          <defs>
            <linearGradient
              id="swoosh-gradient"
              x1="120"
              y1="0"
              x2="400"
              y2="60"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0.18" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative flex items-center justify-between pl-14 pr-8 pt-3">
          <HindustanLogo className="h-14" />
          <HindustanBadge40 className="h-12" />
        </div>

        <div className="relative flex flex-col items-center px-6 pb-3 pt-2 text-center">
          {/*
            hsfas-logo.png is now icon-only (face + neural network + scan
            brackets) — it no longer contains the "HSFAS" wordmark, so the
            heading below is coded separately.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/hsfas-logo.png"
            alt="HSFAS smart face recognition icon"
            className="h-28 w-auto object-contain"
          />
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white">
            HSFAS
          </h1>
          <div className="relative mt-1.5 h-1 w-28">
            <div
              className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(56,189,248,0) 0%, rgba(56,189,248,0.85) 50%, rgba(56,189,248,0) 100%)",
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200"
              style={{
                boxShadow:
                  "0 0 4px 1px rgba(207,250,254,0.95), 0 0 8px 2px rgba(56,189,248,0.6)",
              }}
            />
          </div>
          <p className="mt-1.5 text-sm text-white/70">
            HITS Smart Face
            <br />
            Attendance System
          </p>
        </div>
      </div>

      <div className="flex-1 rounded-t-[32px] bg-white px-6 pb-5 pt-4 shadow-[0_-8px_30px_rgba(0,0,0,0.15)]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-navy">Welcome Back!</h2>
          <p className="mt-1 text-sm text-surface-muted">
            Sign in to continue
          </p>
        </div>

        <div className="mt-4">
          <LoginForm />
        </div>

        <div className="mt-3 rounded-2xl bg-surface px-4 py-3">
          <p className="text-xs font-medium text-surface-muted">
            Mentored by
          </p>
          <p className="mt-0.5 text-sm font-bold text-navy">
            Dr. J. Thangakumar
          </p>
          <p className="text-sm font-semibold text-navy/80">
            Associate Dean (CS)
          </p>

          <p className="mt-3 text-xs font-medium text-surface-muted">
            Developed by
          </p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {DEVELOPERS.map((name) => (
              <li key={name} className="text-sm font-semibold text-navy">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
