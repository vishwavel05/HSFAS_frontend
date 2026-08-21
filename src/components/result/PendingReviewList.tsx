"use client";

import { useState } from "react";
import Image from "next/image";
import { PendingReviewItem } from "@/types/attendance";
import { useAttendanceFlow } from "@/context/AttendanceFlowContext";

interface PendingReviewListProps {
  items: PendingReviewItem[];
}

export function PendingReviewList({ items }: PendingReviewListProps) {
  const { setStudentStatus, setIsEditing } = useAttendanceFlow();
  const [handled, setHandled] = useState<Set<string>>(new Set());

  const unhandledItems = items.filter((item) => !handled.has(item.id));

  if (unhandledItems.length === 0) return null;

  return (
    <div className="mb-6 rounded-2xl border border-warning/30 bg-warning-light p-4">
      <h3 className="mb-3 text-sm font-bold text-warning-dark">
        PENDING REVIEW ({unhandledItems.length})
      </h3>
      <p className="mb-4 text-xs text-warning-dark/80">
        The following faces were detected but not confidently matched. Please confirm or reject the suggestions.
      </p>
      <div className="flex flex-col gap-3">
        {unhandledItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border">
              <Image
                src={item.image_url}
                alt="Unknown face"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-black">
                {item.display_name}
              </p>
              <p className="text-xs text-secondary">
                Similarity: <span className="font-semibold text-primary">{item.similarity}%</span>
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => {
                  setHandled((prev) => new Set(prev).add(item.id));
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-error-light text-error hover:bg-error hover:text-white transition-colors"
                title="Reject Match"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              
              <button
                onClick={() => {
                  setIsEditing(true);
                  setStudentStatus(item.student_id, "present");
                  setHandled((prev) => new Set(prev).add(item.id));
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-success-light text-success hover:bg-success hover:text-white transition-colors"
                title="Confirm Match"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
