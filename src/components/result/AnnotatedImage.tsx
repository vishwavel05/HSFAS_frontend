"use client";

import { useRef, useState } from "react";
import { resolveMediaUrl } from "@/services/attendanceService";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export function AnnotatedImage({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const pinchStartDistance = useRef<number | null>(null);
  const pinchStartZoom = useRef(1);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const isPinching = useRef(false);

  function openLightbox() {
    setZoom(1);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
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

  function goToPrev() {
    setIndex((i) => Math.max(0, i - 1));
    setZoom(1);
  }

  function goToNext() {
    setIndex((i) => Math.min(images.length - 1, i + 1));
    setZoom(1);
  }

  function touchDistance(touches: React.TouchList) {
    const [a, b] = [touches[0], touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      isPinching.current = true;
      swipeStart.current = null;
      pinchStartDistance.current = touchDistance(e.touches);
      pinchStartZoom.current = zoom;
      return;
    }
    if (e.touches.length === 1 && zoom <= 1) {
      // Only treat as a potential swipe when not zoomed in — at zoom > 1
      // a single finger should pan the image via native scroll instead.
      isPinching.current = false;
      swipeStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
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

    if (!isPinching.current && swipeStart.current && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - swipeStart.current.x;
      const dy = e.changedTouches[0].clientY - swipeStart.current.y;
      const SWIPE_THRESHOLD = 50;
      // Require a mostly-horizontal gesture so vertical scrolling/panning
      // doesn't get misread as a page change.
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          goToNext(); // swipe left -> next image
        } else {
          goToPrev(); // swipe right -> previous image
        }
      }
    }
    swipeStart.current = null;
    isPinching.current = false;
  }

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
        <button
          type="button"
          onClick={openLightbox}
          aria-label={`View annotated image ${index + 1} full size`}
          className="block w-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveMediaUrl(images[index])}
            alt={`Annotated classroom photo ${index + 1}`}
            className="h-44 w-full object-cover"
          />
        </button>
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

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90"
          onClick={closeLightbox}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-medium text-white/80">
              Image {index + 1} of {images.length}
            </span>
            <button
              type="button"
              onClick={closeLightbox}
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
                src={resolveMediaUrl(images[index])}
                alt={`Annotated classroom photo ${index + 1} full size`}
                onDoubleClick={toggleDoubleTapZoom}
                className="w-full select-none rounded-lg object-contain"
                draggable={false}
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                  }}
                  disabled={index === 0}
                  aria-label="Previous image"
                  className="fixed left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  disabled={index === images.length - 1}
                  aria-label="Next image"
                  className="fixed right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10"
                >
                  ›
                </button>
              </>
            )}
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
    </div>
  );
}
