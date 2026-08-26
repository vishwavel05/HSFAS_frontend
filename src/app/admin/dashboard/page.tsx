"use client";

import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/layout/AppHeader";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { HistoryRecordCard } from "@/components/history/HistoryRecordCard";
import { getAttendanceHistory } from "@/services/historyService";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-attendance-history"],
    queryFn: () => getAttendanceHistory(), // Call without facultyId to get all
  });

  return (
    <div className="px-5 pt-6 pb-20">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[13px] font-bold tracking-wider text-navy uppercase">
            Recent Activity
          </h2>
          <span className="rounded-md bg-brand-blue/10 px-2.5 py-1 text-[11px] font-bold text-brand-blue uppercase">
            All Faculty
          </span>
        </div>

        {isLoading ? (
          <div className="mt-20">
            <LoadingSpinner text="Loading recent activity..." />
          </div>
        ) : isError ? (
          <div className="mt-10">
            <ErrorState
              title="Failed to Load"
              message={
                error instanceof Error ? error.message : "An error occurred."
              }
              onRetry={() => refetch()}
            />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="mt-20 text-center text-sm font-medium text-surface-muted">
            No recent activity found.
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {data.map((record) => (
              <HistoryRecordCard key={record.session_id} record={record} />
            ))}
          </div>
        )}
    </div>
  );
}
