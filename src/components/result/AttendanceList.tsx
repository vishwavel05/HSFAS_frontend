"use client";

import { useMemo, useState } from "react";
import { AttendanceSearchBar, AttendanceFilter } from "./AttendanceSearchBar";
import { AttendanceGroup } from "./AttendanceGroup";
import type { AttendanceRecord, AttendanceStatus } from "@/types/attendance";

export function AttendanceList({
  records,
  isEditing,
  onToggleEditing,
  pendingCorrections,
  onToggleStatus,
}: {
  records: AttendanceRecord[];
  isEditing: boolean;
  onToggleEditing: () => void;
  pendingCorrections: Map<number, AttendanceStatus>;
  onToggleStatus: (studentId: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<AttendanceFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.display_name.toLowerCase().includes(q) ||
        r.roll_number.toLowerCase().includes(q)
      );
    });
  }, [records, query, filter]);

  const absent = filtered.filter((r) => r.status === "absent");
  const present = filtered.filter((r) => r.status === "present");

  return (
    <div>
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-bold text-navy">Attendance List</p>
        <button
          type="button"
          onClick={onToggleEditing}
          className="flex items-center gap-1.5 rounded-lg border border-brand-blue px-2.5 py-1.5 text-xs font-semibold text-brand-blue"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 20h4L18 10a2.8 2.8 0 0 0-4-4L4 16v4Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
          {isEditing ? "Editing" : "Edit Attendance"}
        </button>
      </div>

      <div className="mt-2.5">
        <AttendanceSearchBar
          query={query}
          onQueryChange={setQuery}
          filter={filter}
          onFilterChange={setFilter}
        />
      </div>

      <div className="mt-3 space-y-4">
        <AttendanceGroup
          label="ABSENT"
          color="danger"
          records={absent}
          isEditing={isEditing}
          pendingCorrections={pendingCorrections}
          onToggle={onToggleStatus}
        />
        <AttendanceGroup
          label="PRESENT"
          color="success"
          records={present}
          isEditing={isEditing}
          pendingCorrections={pendingCorrections}
          onToggle={onToggleStatus}
        />

        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-surface-muted">
            No students match your search.
          </p>
        )}
      </div>
    </div>
  );
}
