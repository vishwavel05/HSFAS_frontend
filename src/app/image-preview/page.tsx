"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/common/AuthGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageGrid } from "@/components/image-preview/ImageGrid";
import { useAttendanceFlow } from "@/context/AttendanceFlowContext";

const CHECKLIST = [
  "All students' faces are visible",
  "Images are clear and well-lit",
  "No faces are blurred or cut off",
  "You are ready to mark attendance",
];

function ImagePreviewScreen() {
  const router = useRouter();
  const { images, removeImage, clearImages, submitForProcessing } =
    useAttendanceFlow();
  const [formError, setFormError] = useState<string | null>(null);

  // "No images selected" error handling: if the user removes every image
  // here (or lands on this route with none), send them back rather than
  // showing a broken empty preview.
  useEffect(() => {
    if (images.length === 0) {
      router.replace("/start-attendance");
    }
  }, [images.length, router]);

  function handleRetake() {
    clearImages();
    router.push("/start-attendance");
  }

  function handleProcess() {
    if (images.length === 0) {
      setFormError("Select at least one classroom image to continue.");
      return;
    }
    setFormError(null);
    submitForProcessing();
    router.push("/processing");
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col bg-surface">
      <AppHeader
        title="Image Preview"
        subtitle="Review your images before processing"
        onBack={() => router.push("/start-attendance")}
      />

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <Card className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3.5"
                    y="4.5"
                    width="17"
                    height="15"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <circle cx="8.3" cy="9.3" r="1.3" fill="currentColor" />
                  <path
                    d="m5 17 4.5-5 3.2 3.6L15.5 12l3.5 5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-bold text-navy">Class Photos</p>
                <p className="text-xs text-surface-muted">
                  {images.length} image{images.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-brand-blue-light px-3 py-1 text-xs font-semibold text-brand-blue">
              {images.length} of {images.length}
            </span>
          </div>

          <div className="mt-3.5 flex items-start gap-2.5 rounded-xl bg-brand-blue-light px-3.5 py-3">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-blue text-[10px] font-bold text-white">
              i
            </span>
            <p className="text-[13px] leading-snug text-navy">
              Please review all images carefully. Ensure all students&apos;
              faces are clearly visible in each photo.
            </p>
          </div>

          <div className="mt-3.5">
            <ImageGrid images={images} onRemove={removeImage} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleRetake}>
              Retake Photos
            </Button>
            <Button onClick={handleProcess}>Process Attendance</Button>
          </div>
        </Card>

        {formError && (
          <p className="text-sm text-danger" role="alert">
            {formError}
          </p>
        )}

        <div className="rounded-2xl bg-indigo-50 px-4 py-4">
          <p className="text-[15px] font-bold text-navy">Before Processing</p>
          <p className="mt-0.5 text-sm text-surface-muted">
            Please make sure:
          </p>
          <ul className="mt-2.5 space-y-2">
            {CHECKLIST.map((line) => (
              <li key={line} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 12.5l4.5 4.5L20 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm text-navy">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}

export default function ImagePreviewPage() {
  return (
    <AuthGuard>
      <ImagePreviewScreen />
    </AuthGuard>
  );
}
