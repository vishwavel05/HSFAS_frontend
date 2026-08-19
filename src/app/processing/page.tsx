"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/common/AuthGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/common/ErrorState";
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

  const { progress, stageStatuses, hasReachedFinalStage } =
    useProcessingAnimation(
      processStatus === "pending" || processStatus === "success",
      processStatus === "success"
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
  //
  // hasReachedFinalStage now means "the visual progress sweep hit 100%",
  // which (per useProcessingAnimation) can only happen once processStatus
  // is already "success" — the timer alone caps at 99% and waits. So this
  // still only fires once the real backend response has arrived, same as
  // before; the animation just gets to finish its smooth catch-up first
  // instead of navigating on an abrupt jump.
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
        subtitle="Please wait while we process the images"
      />

      <div className="flex-1 space-y-4 px-5 py-5">
        <Card className="px-5 py-6">
          <ProcessingTimeline progress={progress} statuses={stageStatuses} />
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
          <div className="flex items-start gap-2.5 rounded-2xl bg-brand-blue-light px-4 py-3.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue text-[11px] font-bold text-white">
              i
            </span>
            <div>
              <p className="text-sm font-bold text-navy">
                Please don&apos;t close the app
              </p>
              <p className="mt-0.5 text-[13px] leading-snug text-navy/80">
                Keep this screen open while we process your attendance. You
                will be redirected automatically once complete.
              </p>
            </div>
          </div>
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
