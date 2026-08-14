"use client";

import { useState } from "react";
import { AttendanceRow } from "./AttendanceRow";
import type { AttendanceRecord } from "@/types/attendance";
import { cx } from "@/lib/utils";

const VISIBLE_COUNT = 5;

export function AttendanceGroup({
  label,
  color,
  records,
  isEditing,
  pendingCorrections,
  onToggle,
}: {
  label: "ABSENT" | "PRESENT";
  color: "danger" | "success";
  records: AttendanceRecord[];
  isEditing: boolean;
  pendingCorrections: Map<number, string>;
  onToggle: (studentId: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (records.length === 0) return null;

  const visible = expanded ? records : records.slice(0, VISIBLE_COUNT);
  const remaining = records.length - visible.length;
  const noun = label === "ABSENT" ? "absentee" : "presentee";

  return (
    <div>
      <div className="flex items-center gap-1.5 px-1 py-1.5">
        <span
          className={cx(
            "h-2 w-2 rounded-full",
            color === "danger" ? "bg-danger" : "bg-success"
          )}
        />
        <p className="text-xs font-bold tracking-wide text-navy">
          {label} ({records.length})
        </p>
      </div>

      <div className="rounded-xl border border-surface-border bg-white px-2">
        {visible.map((record) => (
          <AttendanceRow
            key={record.student_id}
            record={record}
            isEditing={isEditing}
            isPendingChange={pendingCorrections.has(record.student_id)}
            onToggle={() => onToggle(record.student_id)}
          />
        ))}
      </div>

      {remaining > 0 && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1.5 px-1 text-xs font-medium text-brand-blue"
        >
          View all {records.length} {noun}s ⌄
        </button>
      )}
      {expanded && records.length > VISIBLE_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-1.5 px-1 text-xs font-medium text-brand-blue"
        >
          Show less ⌃
        </button>
      )}
    </div>
  );
}
