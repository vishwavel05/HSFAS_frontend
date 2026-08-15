"use client";

import { useRef, useState } from "react";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export function ImageGrid({
  images,
  onRemove,
}: {
  images: { previewUrl: string }[];
  onRemove: (index: number) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const pinchStartDistance = useRef<number | null>(null);
  const pinchStartZoom = useRef(1);

  function openPreview(index: number) {
    setZoom(1);
    setOpenIndex(index);
  }

  function closePreview() {
    setOpenIndex(null);
    setZoom(1);
  }

  function zoomIn() {
    setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.5).toFixed(2)));
  }

  function zoomOut() {
    setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.5).toFixed(2)));
  }

  function toggleDoubleTapZoom() {
    setZoom((z) => (z > 1 ? 1 : 2));
  }

  function touchDistance(touches: React.TouchList) {
    const [a, b] = [touches[0], touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      pinchStartDistance.current = touchDistance(e.touches);
      pinchStartZoom.current = zoom;
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinchStartDistance.current) {
      e.preventDefault();
      const currentDistance = touchDistance(e.touches);
      const ratio = currentDistance / pinchStartDistance.current;
      const nextZoom = Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, +(pinchStartZoom.current * ratio).toFixed(2))
      );
      setZoom(nextZoom);
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (e.touches.length < 2) {
      pinchStartDistance.current = null;
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, index) => (
          <div
            key={img.previewUrl}
            className="overflow-hidden rounded-xl border border-surface-border bg-white"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => openPreview(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openPreview(index);
                }
              }}
              aria-label={`View image ${index + 1} full size`}
              className="relative block aspect-[4/3] w-full cursor-pointer bg-surface"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.previewUrl}
                alt={`Classroom photo ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                aria-label="Remove image"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-navy/80 text-white hover:bg-navy"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <p className="border-t border-surface-border py-2 text-center text-sm font-semibold text-navy">
              Image {index + 1}
            </p>
          </div>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90"
          onClick={closePreview}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-medium text-white/80">
              Image {openIndex + 1} of {images.length}
            </span>
            <button
              type="button"
              onClick={closePreview}
              aria-label="Close preview"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div
            className="relative flex-1 overflow-auto"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex min-h-full items-center justify-center p-4"
              style={{ width: `${zoom * 100}%`, margin: "0 auto" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[openIndex].previewUrl}
                alt={`Classroom photo ${openIndex + 1} full size`}
                onDoubleClick={toggleDoubleTapZoom}
                className="w-full select-none rounded-lg object-contain"
                draggable={false}
              />
            </div>
          </div>

          <div
            className="flex items-center justify-center gap-4 px-4 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-white hover:bg-white/20 disabled:opacity-40"
            >
              −
            </button>
            <span className="w-12 text-center text-sm font-medium text-white/80">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-white hover:bg-white/20 disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      )}
    </>
  );
}
