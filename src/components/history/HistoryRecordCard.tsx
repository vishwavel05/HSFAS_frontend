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
    <div className="rounded-2xl border border-surface-border bg-white px-4 py-4">
      <div className="flex w-full items-start justify-between gap-3 text-left">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-navy">
            {record.course_code} - {record.course_name}
          </p>
          <p className="mt-0.5 text-xs text-surface-muted">
            {record.class_group}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-surface-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {record.time}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <StatusBadge status={record.status} />
          <span className="flex items-center gap-1 text-xs text-surface-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3.5 9.5h17M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {record.date}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 border-t border-surface-border pt-3 text-center">
        <div>
          <p className="text-xs text-surface-muted">Total</p>
          <p className="text-sm font-bold text-navy">{record.total_students}</p>
        </div>
        <div>
          <p className="text-xs text-surface-muted">Present</p>
          <p className="text-sm font-bold text-success">{record.present}</p>
        </div>
        <div>
          <p className="text-xs text-surface-muted">Absent</p>
          <p className="text-sm font-bold text-danger">{record.absent}</p>
        </div>
        <div>
          <p className="text-xs text-surface-muted">Unknown</p>
          <p className="text-sm font-bold text-gold">{record.unknown}</p>
        </div>
      </div>

      <div className="mt-2.5 flex w-full items-center justify-between pt-1">
        <Link
          href={`/history/${record.session_id}`}
          className="flex items-center gap-1 text-xs font-semibold text-brand-blue"
        >
          View details
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
