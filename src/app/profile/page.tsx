"use client";

import { useAuth } from "@/context/AuthContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AuthGuard } from "@/components/common/AuthGuard";
import { useRouter } from "next/navigation";

function ProfilePageContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="flex flex-1 flex-col bg-surface-base">
      <AppHeader title="Profile" />

      <div className="flex-1 px-5 py-6 space-y-6">
        <Card className="p-6 items-center flex flex-col mt-4">
          <div className="h-20 w-20 rounded-full bg-brand-blue/10 flex items-center justify-center mb-4 border-2 border-brand-blue/20 shadow-sm">
            <span className="text-3xl font-extrabold text-brand-blue">
              {user.fullName.charAt(0)}
            </span>
          </div>
          
          <h2 className="text-xl font-bold text-navy text-center mb-1">
            {user.fullName}
          </h2>
          <p className="text-sm font-medium text-surface-muted text-center mb-6">
            Faculty Member
          </p>

          <div className="w-full space-y-4">
            <div className="bg-surface-elevated/50 p-4 rounded-xl border border-surface-border">
              <p className="text-xs font-semibold text-surface-muted mb-1 uppercase tracking-wider">
                Employee ID
              </p>
              <p className="text-[15px] font-bold text-navy">
                {user.facultyId}
              </p>
            </div>
            
            <div className="bg-surface-elevated/50 p-4 rounded-xl border border-surface-border">
              <p className="text-xs font-semibold text-surface-muted mb-1 uppercase tracking-wider">
                Department
              </p>
              <p className="text-[15px] font-bold text-navy">
                {user.department}
              </p>
            </div>
          </div>
        </Card>

        <div className="pt-4">
          <Button 
            variant="danger" 
            className="w-full"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
          >
            Log Out
          </Button>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfilePageContent />
    </AuthGuard>
  );
}
