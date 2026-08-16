"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AuthGuard } from "@/components/common/AuthGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { useAuth } from "@/context/AuthContext";
import { useAttendanceFlow } from "@/context/AttendanceFlowContext";
import { getTimetable } from "@/services/timetableService";
import { ApiError } from "@/services/apiClient";
import { getGreeting, cx } from "@/lib/utils";
import type { TimetableSlot } from "@/types/timetable";

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="10.5" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TimetableRow({
  slot,
  onSelect,
}: {
  slot: TimetableSlot;
  onSelect: () => void;
}) {
  const isPending = slot.status === "Pending";
  const isCompleted = slot.status === "Completed";

  const numberBadgeClass = isCompleted || isPending ? "bg-success" : "bg-surface-border text-surface-muted";

  const content = (
    <div
      className={cx(
        "flex items-center gap-3 rounded-xl border-l-4 bg-white px-3.5 py-3",
        isCompleted || isPending ? "border-success" : "border-surface-border"
      )}
    >
      <div
        className={cx(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white",
          numberBadgeClass
        )}
      >
        {slot.period}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cx(
            "truncate text-sm font-bold",
            slot.course_code ? "text-navy" : "text-surface-muted"
          )}
        >
          {slot.course_code ?? "—"}
        </p>
        <p className="text-xs text-surface-muted">{slot.time}</p>
      </div>
      <div
        className={cx(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isCompleted && "bg-success text-white",
          isPending && "bg-success/15 text-success",
          slot.status === "Locked" && "bg-surface text-surface-muted"
        )}
      >
        {isCompleted && <CheckIcon />}
        {isPending && <ChevronIcon />}
        {slot.status === "Locked" && <LockIcon />}
      </div>
    </div>
  );

  if (!isPending) {
    return content;
  }

  return (
    <button type="button" onClick={onSelect} className="block w-full text-left">
      {content}
    </button>
  );
}

function TimetableScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { setSelectedSlot } = useAttendanceFlow();

  const facultyId = user?.facultyId ?? "";

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["timetable", facultyId],
    queryFn: () => getTimetable({ facultyId }),
    enabled: !!facultyId,
  });

  function handleSelectSlot(slot: TimetableSlot) {
    if (!data || slot.status !== "Pending" || !slot.timetable_slot_id) return;
    setSelectedSlot({
      timetableSlotId: slot.timetable_slot_id,
      date: data.date,
      courseCode: slot.course_code,
      courseName: slot.course_name,
      time: slot.time,
      department: slot.target_department,
      year: slot.target_year,
      section: slot.target_section,
    });
    router.push("/start-attendance");
  }

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : "Couldn't load your timetable. Please try again.";

  return (
    <div className="flex flex-1 flex-col bg-surface">
      <AppHeader
        title={`${getGreeting()}, ${user?.fullName?.split(" ")[0] ?? "Faculty"}! 👋`}
        subtitle="Here's your class schedule for today."
        menu={{
          onHistory: () => router.push("/history"),
          onLogout: logout,
        }}
      />

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <LoadingSpinner size={28} className="text-navy" />
          </div>
        )}

        {isError && (
          <ErrorState
            title="Couldn't load timetable"
            message={errorMessage}
            onRetry={() => refetch()}
          />
        )}

        {data && (
          <Card className="px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="5.5" width="16" height="14.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M4 9.5h16M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-extrabold text-navy">
                  {data.day_of_week}
                </p>
                <p className="text-sm text-surface-muted">{data.date}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {data.timetable.map((slot) => (
                <TimetableRow
                  key={slot.period}
                  slot={slot}
                  onSelect={() => handleSelectSlot(slot)}
                />
              ))}
            </div>
          </Card>
        )}
      </div>

      <AppFooter />
    </div>
  );
}

export default function TimetablePage() {
  return (
    <AuthGuard>
      <TimetableScreen />
    </AuthGuard>
  );
}
