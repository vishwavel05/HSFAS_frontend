"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/common/AuthGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Button } from "@/components/ui/Button";
import { ImageGrid } from "@/components/image-preview/ImageGrid";
import { ClassScopeForm } from "@/components/image-preview/ClassScopeForm";
import { useAttendanceFlow } from "@/context/AttendanceFlowContext";

function ImagePreviewScreen() {
  const router = useRouter();
  const { images, removeImage, clearImages, scope, setScope, submitForProcessing } =
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
    if (!scope.department || !scope.year || !scope.section) {
      setFormError("Select department, year, and section before processing.");
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
        <ImageGrid images={images} onRemove={removeImage} />

        <p className="text-sm font-semibold text-navy">
          Total Images: {images.length}
        </p>

        <ClassScopeForm scope={scope} onChange={setScope} />

        {formError && (
          <p className="text-sm text-danger" role="alert">
            {formError}
          </p>
        )}
      </div>

      <div className="space-y-2.5 px-5 pb-5">
        <Button variant="outline" onClick={handleRetake}>
          Retake
        </Button>
        <Button onClick={handleProcess}>Process Attendance</Button>
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
