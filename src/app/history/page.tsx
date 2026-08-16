"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AuthGuard } from "@/components/common/AuthGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { HistoryRecordCard } from "@/components/history/HistoryRecordCard";
import { useAuth } from "@/context/AuthContext";
import { getAttendanceHistory } from "@/services/historyService";
import { ApiError } from "@/services/apiClient";

const PAGE_SIZE = 5;

/**
 * GET /api/attendance/history/ only accepts `faculty_id` (see
 * api_documentation.md) — there is no documented support for date-range,
 * class-type, status, course, or search filtering, export, or pagination.
 * Every control below operates on the single unfiltered array the API
 * returns; nothing here makes an additional network request.
 *
 * One exception, called out where it happens: "Class Type" has no
 * corresponding field anywhere in the documented response, so — rather
 * than filtering against data that doesn't exist — that control is
 * rendered for layout parity with the mockup but disabled.
 */

function parseHistoryDate(value: string): number {
  const t = Date.parse(value);
  return Number.isNaN(t) ? 0 : t;
}

function toCsv(rows: { [key: string]: string | number }[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: string | number) =>
    typeof v === "string" && (v.includes(",") || v.includes('"'))
      ? `"${v.replace(/"/g, '""')}"`
      : String(v);
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ];
  return lines.join("\n");
}

function HistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const facultyId = user?.facultyId ?? "";

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["attendance-history", facultyId],
    queryFn: () => getAttendanceHistory(facultyId),
    enabled: !!facultyId,
  });

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const records = data ?? [];

  const statusOptions = useMemo(
    () => ["All", ...Array.from(new Set(records.map((r) => r.status)))],
    [records]
  );
  const courseOptions = useMemo(
    () => ["All", ...Array.from(new Set(records.map((r) => r.course_code)))],
    [records]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fromTs = dateFrom ? new Date(dateFrom).getTime() : null;
    const toTs = dateTo ? new Date(dateTo).getTime() : null;

    return records.filter((r) => {
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (courseFilter !== "All" && r.course_code !== courseFilter) return false;

      if (fromTs !== null || toTs !== null) {
        const recordTs = parseHistoryDate(r.date);
        if (fromTs !== null && recordTs < fromTs) return false;
        if (toTs !== null && recordTs > toTs) return false;
      }

      if (q) {
        const haystack = `${r.course_code} ${r.course_name} ${r.class_group}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [records, statusFilter, courseFilter, dateFrom, dateTo, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE
  );

  function handleFilterChange<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setPage(1);
  }

  function handleExport() {
    const csv = toCsv(
      filtered.map((r) => ({
        "Course Code": r.course_code,
        "Course Name": r.course_name,
        Class: r.class_group,
        Date: r.date,
        Time: r.time,
        Status: r.status,
        "Total Students": r.total_students,
        Present: r.present,
        Absent: r.absent,
        Unknown: r.unknown,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : "Couldn't load attendance history. Please try again.";

  return (
    <div className="flex flex-1 flex-col bg-surface">
      <AppHeader
        title="Attendance History"
        subtitle="View and download past attendance records"
        onBack={() => router.push("/timetable")}
      />

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <LoadingSpinner size={28} className="text-navy" />
          </div>
        )}

        {isError && (
          <ErrorState
            title="Couldn't load history"
            message={errorMessage}
            onRetry={() => refetch()}
          />
        )}

        {data && (
          <>
            <Card className="px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-surface-muted">
                Date Range
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <Input
                  type="date"
                  aria-label="From date"
                  value={dateFrom}
                  onChange={(e) =>
                    handleFilterChange(setDateFrom, e.target.value)
                  }
                />
                <span className="text-sm text-surface-muted">to</span>
                <Input
                  type="date"
                  aria-label="To date"
                  value={dateTo}
                  onChange={(e) =>
                    handleFilterChange(setDateTo, e.target.value)
                  }
                />
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2.5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-surface-muted">
                    Class Type
                  </label>
                  <select
                    disabled
                    title="Not available from the current API response"
                    className="w-full cursor-not-allowed appearance-none rounded-lg border border-surface-border bg-surface px-2.5 py-2 text-sm font-medium text-surface-muted outline-none"
                  >
                    <option>All</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-surface-muted">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      handleFilterChange(setStatusFilter, e.target.value)
                    }
                    className="w-full appearance-none rounded-lg border border-surface-border bg-white px-2.5 py-2 text-sm font-medium text-navy outline-none focus:border-brand-blue"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-surface-muted">
                    Course
                  </label>
                  <select
                    value={courseFilter}
                    onChange={(e) =>
                      handleFilterChange(setCourseFilter, e.target.value)
                    }
                    className="w-full appearance-none rounded-lg border border-surface-border bg-white px-2.5 py-2 text-sm font-medium text-navy outline-none focus:border-brand-blue"
                  >
                    {courseOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2.5">
                <div className="flex-1">
                  <Input
                    placeholder="Search by class, faculty or topic..."
                    value={query}
                    onChange={(e) =>
                      handleFilterChange(setQuery, e.target.value)
                    }
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                        <path d="m20 20-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    }
                  />
                </div>
                <Button
                  variant="outline"
                  fullWidth={false}
                  className="shrink-0 px-4"
                  onClick={handleExport}
                  disabled={filtered.length === 0}
                >
                  ⬇ Export
                </Button>
              </div>
            </Card>

            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-surface-muted">
                No attendance records match your filters.
              </p>
            ) : (
              <div className="space-y-3">
                {paged.map((record) => {
                  const key = `${record.date}-${record.time}-${record.course_code}`;
                  return (
                    <HistoryRecordCard
                      key={key}
                      record={record}
                      expanded={expandedKey === key}
                      onToggle={() =>
                        setExpandedKey((current) =>
                          current === key ? null : key
                        )
                      }
                    />
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={clampedPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-border text-surface-muted disabled:opacity-40"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={
                        p === clampedPage
                          ? "flex h-8 w-8 items-center justify-center rounded-lg border border-brand-blue text-sm font-semibold text-brand-blue"
                          : "flex h-8 w-8 items-center justify-center rounded-lg text-sm text-surface-muted hover:bg-surface"
                      }
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={clampedPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-surface-border text-surface-muted disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AppFooter />
    </div>
  );
}

export default function HistoryPage() {
  return (
    <AuthGuard>
      <HistoryScreen />
    </AuthGuard>
  );
}
