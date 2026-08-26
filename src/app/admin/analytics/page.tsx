"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminAnalytics } from "@/services/adminService";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { Card } from "@/components/ui/Card";

export default function AdminAnalyticsPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: getAdminAnalytics,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <LoadingSpinner className="text-brand-blue" />
        <p className="mt-4 text-sm font-medium text-surface-muted">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <ErrorState
          title="Could not load analytics"
          message={error.message || "An unknown error occurred"}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!data) return null;

  const timeSavedMinutes = Math.floor(data.time_saved_seconds / 60);
  const timeSavedSeconds = Math.floor(data.time_saved_seconds % 60);
  const timeSavedDisplay = data.time_saved_seconds >= 60 
    ? `${timeSavedMinutes}m ${timeSavedSeconds}s`
    : `${data.time_saved_seconds.toFixed(1)}s`;

  return (
    <div className="px-5 py-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center p-4">
          <div className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue">
              <path d="M3 3v18h18" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-surface-muted text-center">Overall Attendance</p>
          <p className="text-3xl font-extrabold text-navy mt-1">{data.overall_attendance}%</p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-4">
          <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-surface-muted text-center">Time Saved</p>
          <p className="text-xl font-bold text-success mt-2">{timeSavedDisplay}</p>
        </Card>

        <Card className="flex flex-col items-center justify-center p-4 col-span-2">
          <div className="h-10 w-10 rounded-full bg-navy/10 flex items-center justify-center mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-surface-muted text-center">Total Sessions Evaluated</p>
          <p className="text-3xl font-extrabold text-navy mt-1">{data.total_sessions}</p>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-navy mb-4">Department Breakdowns</h3>
        <div className="space-y-3">
          {data.department_metrics.map((dept, idx) => (
            <Card key={idx} className="p-4 flex flex-row items-center justify-between">
              <div>
                <p className="text-[15px] font-bold text-navy">{dept.department}</p>
                <p className="text-xs text-surface-muted">{dept.year} Year - Sec {dept.section}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-lg font-extrabold ${dept.attendance_pct >= 75 ? 'text-success' : dept.attendance_pct >= 60 ? 'text-orange-500' : 'text-danger'}`}>
                  {dept.attendance_pct}%
                </span>
              </div>
            </Card>
          ))}
          {data.department_metrics.length === 0 && (
            <p className="text-sm text-surface-muted text-center py-6">No department data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
