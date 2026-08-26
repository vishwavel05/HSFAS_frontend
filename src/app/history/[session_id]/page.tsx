"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getAttendanceHistory } from "@/services/historyService";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { AuthGuard } from "@/components/common/AuthGuard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { useRouter, useParams } from "next/navigation";
import { AttendanceGroup } from "@/components/result/AttendanceGroup";
import { AnnotatedImage } from "@/components/result/AnnotatedImage";

function HistoryDetailScreen() {
  const router = useRouter();
  const params = useParams();
  const sessionId = Number(params.session_id);
  
  const { user } = useAuth();
  const isAdmin = (user as any)?.isAdmin === true;
  const facultyId = user?.facultyId ?? "";
  
  // React Query will instantly serve this from cache if we just came from the dashboard or history page!
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: isAdmin ? ["admin-attendance-history"] : ["attendance-history", facultyId],
    queryFn: () => getAttendanceHistory(isAdmin ? undefined : facultyId),
    enabled: isAdmin || !!facultyId,
  });

  const record = data?.find((r) => String(r.session_id) === String(params.session_id));

  const handleExportCSV = () => {
    if (!record?.attendance) return;

    const headers = ["Roll Number", "Name", "Department", "Year", "Section", "Status"];
    const rows = record.attendance.map((r) => [
      r.roll_number,
      `"${r.display_name}"`,
      r.department,
      r.year,
      r.section,
      r.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    const dateStr = record.date.replace(/ /g, "_");
    link.setAttribute("download", `${record.course_code}_Attendance_${dateStr}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  const emptyMap = new Map();
  const absent = record?.attendance?.filter((r) => r.status === "absent") || [];
  const present = record?.attendance?.filter((r) => r.status === "present") || [];

  return (
    <div className="flex h-screen flex-col bg-surface">
      <AppHeader
        title={record ? `${record.course_code} Details` : "Session Details"}
        subtitle={record ? record.date : ""}
        onBack={() => router.push(isAdmin ? "/admin/dashboard" : "/history")}
      />

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {(!data && !isError) && (
          <div className="flex items-center justify-center py-10">
            <LoadingSpinner size={28} className="text-navy" />
          </div>
        )}

        {isError && (
          <ErrorState
            title="Couldn't load details"
            message={errorMessage}
            onRetry={() => refetch()}
          />
        )}

        {data && !record && (
          <div className="py-8 text-center text-sm text-surface-muted">
            Session not found.
          </div>
        )}

        {record && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-surface-border bg-white px-4 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-navy">{record.course_name}</p>
                  <p className="text-xs text-surface-muted mt-0.5">{record.class_group}</p>
                  <p className="text-xs text-surface-muted mt-1">{record.time}</p>
                </div>
                {record.attendance && (
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="flex shrink-0 items-center gap-1 rounded border border-brand-blue/20 bg-brand-blue/5 px-2.5 py-1.5 text-xs font-semibold text-brand-blue transition-colors hover:bg-brand-blue/10"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Export
                  </button>
                )}
              </div>
              
              <div className="mt-4 grid grid-cols-4 gap-2 border-t border-surface-border pt-4 text-center">
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
            </div>

            <div className="pt-2">
              <p className="text-xs font-bold tracking-wide text-navy mb-3 px-1">
                ANNOTATED IMAGES
              </p>
              <div className="rounded-xl overflow-hidden border border-surface-border bg-white p-3">
                <AnnotatedImage images={record.annotated_images} />
              </div>
            </div>

            {record.attendance && (
              <div className="space-y-4">
                <AttendanceGroup
                  label="ABSENT"
                  color="danger"
                  records={absent}
                  isEditing={false}
                  pendingCorrections={emptyMap}
                  onToggle={() => {}}
                />
                <AttendanceGroup
                  label="PRESENT"
                  color="success"
                  records={present}
                  isEditing={false}
                  pendingCorrections={emptyMap}
                  onToggle={() => {}}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <AppFooter />
    </div>
  );
}

export default function HistoryDetailPage() {
  return (
    <AuthGuard>
      <HistoryDetailScreen />
    </AuthGuard>
  );
}
