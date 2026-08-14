"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  HindustanBadge40,
  HindustanWordmark,
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
      <div className="flex items-center justify-between px-6 pt-5">
        <HindustanWordmark size="lg" />
        <HindustanBadge40 />
      </div>

      <div className="flex flex-col items-center px-6 pb-8 pt-6 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-white/25">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="8.5"
              r="3.2"
              stroke="white"
              strokeWidth="1.4"
            />
            <path
              d="M5.5 19c1.2-3.2 3.7-5 6.5-5s5.3 1.8 6.5 5"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <rect
              x="3.2"
              y="3.2"
              width="17.6"
              height="17.6"
              rx="8.8"
              stroke="white"
              strokeOpacity="0.35"
              strokeWidth="1"
            />
          </svg>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
          HSFAS
        </h1>
        <p className="mt-1 text-sm text-white/70">
          HITS Smart Face
          <br />
          Attendance System
        </p>
      </div>

      <div className="flex-1 rounded-t-[28px] bg-white px-6 pb-6 pt-6">
        <h2 className="text-xl font-bold text-navy">Welcome Back!</h2>
        <p className="mt-1 text-sm text-surface-muted">Sign in to continue</p>

        <div className="mt-5">
          <LoginForm />
        </div>

        <div className="mt-6 rounded-xl bg-surface px-4 py-4">
          <p className="text-sm font-semibold text-navy">Mentored by</p>
          <p className="text-sm text-surface-muted">
            Dr. J. Thangakumar
            <br />
            <span className="text-xs">Associate Dean (CS)</span>
          </p>

          <p className="mt-3 text-sm font-semibold text-navy">Developed by</p>
          <ul className="mt-1 space-y-0.5">
            {DEVELOPERS.map((name) => (
              <li key={name} className="text-sm text-surface-muted">
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
