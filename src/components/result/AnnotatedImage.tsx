"use client";

import { useState } from "react";
import { resolveMediaUrl } from "@/services/attendanceService";

export function AnnotatedImage({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div>
        <p className="text-sm font-semibold text-navy">Annotated Image</p>
        <div className="mt-2 flex h-40 items-center justify-center rounded-xl border border-dashed border-surface-border bg-white text-sm text-surface-muted">
          No annotated image returned
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-navy">Annotated Image</p>
        <p className="text-xs text-surface-muted">
          {index + 1} of {images.length}
        </p>
      </div>

      <div className="relative mt-2 overflow-hidden rounded-xl border border-surface-border bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveMediaUrl(images[index])}
          alt={`Annotated classroom photo ${index + 1}`}
          className="h-44 w-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-navy/70 text-white"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-navy/70 text-white"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="mt-2 flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-xs text-surface-muted">
          <span className="h-2 w-2 rounded-full bg-success" /> Present
        </span>
        <span className="flex items-center gap-1.5 text-xs text-surface-muted">
          <span className="h-2 w-2 rounded-full bg-danger" /> Absent
        </span>
      </div>
    </div>
  );
}
