"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { AuthGuard } from "@/components/common/AuthGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = (user as any)?.isAdmin === true;

  useEffect(() => {
    if (isHydrated && user && !isAdmin) {
      router.replace("/timetable");
    }
  }, [isHydrated, user, isAdmin, router]);

  if (!isHydrated || !user || !isAdmin) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-surface-base">
        <LoadingSpinner className="text-brand-blue" />
        <p className="mt-4 text-sm text-surface-muted">Verifying access...</p>
      </div>
    );
  }

  // Determine Title based on current route
  let title = "Admin Portal";
  let subtitle = "";
  if (pathname.includes("/admin/analytics")) {
    title = "Global Analytics";
    subtitle = "College-wide statistics";
  } else if (pathname.includes("/admin/dashboard")) {
    title = "Admin Dashboard";
    subtitle = "Welcome, Admin";
  } else if (pathname.includes("/admin/enroll-student")) {
    title = "Enroll Student";
    subtitle = "Add new student profile";
  } else if (pathname.includes("/admin/assign-lecture")) {
    title = "Assign Lecture";
    subtitle = "Schedule class sessions";
  }

  return (
    <div className="flex flex-1 flex-col bg-surface min-h-screen">
      <AppHeader title={title} subtitle={subtitle || undefined} showMenu={true} hideBack={true} />
      <div className="flex-1 pb-32">
        {children}
      </div>
      <AppFooter />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthGuard>
  );
}
