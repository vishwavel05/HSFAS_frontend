"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/common/AuthGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ProcessingTimeline } from "@/components/processing/ProcessingTimeline";
import { useProcessingAnimation } from "@/hooks/useProcessingAnimation";
import { useAttendanceFlow } from "@/context/AttendanceFlowContext";

function ProcessingScreen() {
  const router = useRouter();
  const { processStatus, processError, retryProcessing, images } =
    useAttendanceFlow();

  // Guard: reaching this screen without a request in flight (idle) — e.g.
  // a hard refresh, which drops in-memory context state — sends the user
  // back to pick images again instead of showing a dead animation.
  useEffect(() => {
    if (processStatus === "idle" && images.length === 0) {
      router.replace("/start-attendance");
    }
  }, [processStatus, images.length, router]);

  const { stageStatuses, hasReachedFinalStage } = useProcessingAnimation(
    processStatus === "pending" || processStatus === "success"
  );

  // THE FIX for "Processing never navigates to Result despite a clean 200":
  // navigation depends on two independently-tracked signals — the staged
  // animation reaching its last step, and the mutation object (lifted into
  // AttendanceFlowContext, so it isn't tied to this component's lifecycle)
  // actually resolving. Previously neither onSuccess nor onError fired
  // because of the multipart Content-Type bug upstream (see apiClient.ts) —
  // the browser's XHR layer never got a well-formed response to resolve
  // the promise with, and a StrictMode remount of this component could
  // additionally have discarded the mutation before its callbacks ran.
  // Reading `processStatus` from context sidesteps both: the request
  // outlives this component, and this effect re-checks on every render
  // rather than depending on a one-shot callback.
  useEffect(() => {
    if (hasReachedFinalStage && processStatus === "success") {
      router.replace("/result");
    }
  }, [hasReachedFinalStage, processStatus, router]);

  const showError = processStatus === "error";

  return (
    <div className="flex flex-1 flex-col bg-surface">
      <AppHeader
        title="Processing Attendance"
        subtitle="Please wait while we analyze the images"
      />

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <Card className="px-5 py-5">
          <ProcessingTimeline statuses={stageStatuses} />
        </Card>

        {showError ? (
          <ErrorState
            title="Processing failed"
            message={
              processError ??
              "We couldn't process this attendance session. Please try again."
            }
            onRetry={retryProcessing}
            secondaryAction={{
              label: "Back to Preview",
              onClick: () => router.push("/image-preview"),
            }}
          />
        ) : (
          <Card className="flex flex-col items-center gap-3 px-6 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-brand-blue/30 text-brand-blue">
              <LoadingSpinner size={30} />
            </div>
            <p className="font-bold text-navy">Our AI is working...</p>
            <p className="text-sm text-surface-muted">
              This may take a few seconds depending on the number of faces.
            </p>
          </Card>
        )}
      </div>

      <AppFooter />
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <AuthGuard>
      <ProcessingScreen />
    </AuthGuard>
  );
}
