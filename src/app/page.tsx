"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;
    router.replace(isAuthenticated ? "/start-attendance" : "/login");
  }, [isHydrated, isAuthenticated, router]);

  return (
    <div className="flex-1 flex items-center justify-center bg-navy">
      <LoadingSpinner size={32} className="text-white" />
    </div>
  );
}
