"use client";

import { cx } from "@/lib/utils";
import type { AttendanceHistoryRecord } from "@/types/history";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  const isCompleted = status.toLowerCase() === "completed";
  return (
    <span
      className={cx(
        "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
        isCompleted ? "bg-success-light text-success" : "bg-surface text-surface-muted"
      )}
    >
      {status}
    </span>
  );
}

export function HistoryRecordCard({
  record,
}: {
  record: AttendanceHistoryRecord;
}) {
  return (
    <Link href={`/history/${record.session_id}`} className="block mb-4 transition-transform hover:-translate-y-0.5">
      <div className="rounded-2xl border border-surface-border border-l-4 border-l-brand-blue bg-white px-4 py-4">
      <div className="flex w-full items-start justify-between gap-3 text-left">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-navy">
            {record.course_code} - {record.course_name}
          </p>
          <p className="mt-0.5 text-xs text-brand-blue font-semibold">
            {record.class_group}
          </p>
          {record.faculty_name && (
            <p className="mt-0.5 text-[13px] text-surface-muted">
              By {record.faculty_name}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <div className="bg-surface px-2.5 py-1.5 rounded-md flex flex-col items-end">
            <span className="text-xs font-bold text-navy">{record.date}</span>
            <span className="text-xs font-semibold text-brand-blue">Period {record.period_number}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-surface-border pt-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-success"></div>
            <p className="text-[13px] font-bold text-navy">{record.present} <span className="font-medium text-surface-muted">Present</span></p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-danger"></div>
            <p className="text-[13px] font-bold text-navy">{record.absent} <span className="font-medium text-surface-muted">Absent</span></p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-surface-muted">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM18 21a1 1 0 0 0 1-1 7 7 0 0 0-14 0 1 1 0 0 0 1 1h12z" />
          </svg>
          <p className="text-[13px] font-bold text-surface-muted">{record.total_students} <span className="font-medium">Total</span></p>
        </div>
      </div>
    </div>
    </Link>
  );
}
