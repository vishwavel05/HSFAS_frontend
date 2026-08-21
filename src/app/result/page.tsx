"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/common/AuthGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/common/ErrorState";
import { SummaryCards } from "@/components/result/SummaryCards";
import { AnnotatedImage } from "@/components/result/AnnotatedImage";
import { AttendanceList } from "@/components/result/AttendanceList";
import { PendingReviewList } from "@/components/result/PendingReviewList";
import { useAttendanceFlow } from "@/context/AttendanceFlowContext";

function ResultScreen() {
  const router = useRouter();
  const {
    result,
    effectiveAttendance,
    isEditing,
    setIsEditing,
    pendingCorrections,
    toggleStatus,
    cancelChanges,
    hasPendingChanges,
    saveAttendance,
    saveStatus,
    saveError,
    resetFlow,
  } = useAttendanceFlow();

  // Guard: no result in context (hard refresh, or direct navigation here)
  // means there's nothing to review — send the user back to start a
  // session instead of rendering an empty/broken results screen.
  useEffect(() => {
    if (!result) {
      router.replace("/start-attendance");
    }
  }, [result, router]);

  if (!result) return null;

  const presentCount = effectiveAttendance.filter(
    (r) => r.status === "present"
  ).length;
  const absentCount = effectiveAttendance.filter(
    (r) => r.status === "absent"
  ).length;

  function handleStartNewSession() {
    resetFlow();
    router.push("/start-attendance");
  }

  return (
    <div className="flex flex-1 flex-col bg-surface">
      <AppHeader
        title="Attendance Result & Verification"
        subtitle="Review, verify and save the attendance"
        onBack={handleStartNewSession}
      />

      <div className="flex-1 space-y-5 px-5 py-5">
        <SummaryCards present={presentCount} absent={absentCount} />

        <AnnotatedImage images={result.annotated_images} />

        {saveStatus === "success" && (
          <div className="rounded-xl border border-success/30 bg-success-light px-4 py-3 text-sm font-medium text-success">
            Attendance saved successfully.
          </div>
        )}

        {saveStatus === "error" && (
          <ErrorState
            title="Couldn't save attendance"
            message={saveError ?? "Please try again."}
            onRetry={saveAttendance}
          />
        )}

        {result.pending_review && result.pending_review.length > 0 && (
          <PendingReviewList items={result.pending_review} />
        )}

        <AttendanceList
          records={effectiveAttendance}
          isEditing={isEditing}
          onToggleEditing={() => setIsEditing(!isEditing)}
          pendingCorrections={pendingCorrections}
          onToggleStatus={toggleStatus}
        />
      </div>

      <div className="flex gap-3 px-5 pb-5">
        {hasPendingChanges && (
          <Button
            variant="outline"
            fullWidth={false}
            className="flex-1"
            onClick={cancelChanges}
          >
            Cancel
          </Button>
        )}
        <Button
          fullWidth={false}
          className="flex-1"
          onClick={() => {
            if (hasPendingChanges) {
              saveAttendance();
            } else {
              handleStartNewSession();
            }
          }}
          isLoading={saveStatus === "pending"}
        >
          {hasPendingChanges ? "Save Changes" : "Confirm & Finish"}
        </Button>
      </div>

      <AppFooter />
    </div>
  );
}

export default function ResultPage() {
  return (
    <AuthGuard>
      <ResultScreen />
    </AuthGuard>
  );
}
