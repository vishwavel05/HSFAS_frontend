"use client";

export type AttendanceFilter = "all" | "present" | "absent";

export function AttendanceSearchBar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  filter: AttendanceFilter;
  onFilterChange: (v: AttendanceFilter) => void;
}) {
  return (
    <div className="flex gap-2">
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-surface-border bg-white px-3 py-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0 text-surface-muted">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name or roll number..."
          className="w-full bg-transparent text-xs text-navy placeholder:text-surface-muted outline-none"
        />
      </div>
      <select
        value={filter}
        onChange={(e) => onFilterChange(e.target.value as AttendanceFilter)}
        className="appearance-none rounded-lg border border-surface-border bg-white px-2.5 py-2 text-xs font-medium text-navy outline-none"
      >
        <option value="all">All</option>
        <option value="present">Present</option>
        <option value="absent">Absent</option>
      </select>
    </div>
  );
}
