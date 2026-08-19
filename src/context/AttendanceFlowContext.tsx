"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
import {
  processAttendance,
  updateAttendance,
} from "@/services/attendanceService";
import { toast } from "react-hot-toast";
import { ApiError } from "@/services/apiClient";
import type {
  AttendanceRecord,
  AttendanceResponse,
  AttendanceStatus,
} from "@/types/attendance";

export const MAX_IMAGES = 5;
export const MIN_IMAGES = 1;

/**
 * What's carried forward from the Timetable screen into the attendance
 * flow. `timetableSlotId` and `date` are the two fields POST
 * /api/attendance/ actually requires; the rest (course/time labels) are
 * kept only for display — e.g. the confirmation banner on Start
 * Attendance — and are never sent to the processing endpoint themselves.
 */
export interface SelectedTimetableSlot {
  timetableSlotId: number;
  date: string;
  courseCode?: string;
  courseName?: string;
  time?: string;
  department?: string;
  year?: string;
  section?: string;
}

interface PickedImage {
  file: File;
  previewUrl: string;
}

interface AttendanceFlowContextValue {
  // --- Step 2/3: image capture ---
  images: PickedImage[];
  addImages: (files: File[]) => { accepted: number; rejected: number };
  removeImage: (index: number) => void;
  clearImages: () => void;

  selectedSlot: SelectedTimetableSlot | null;
  setSelectedSlot: (slot: SelectedTimetableSlot | null) => void;

  // --- Step 3 -> 4: submit for processing ---
  submitForProcessing: () => void;
  processStatus: "idle" | "pending" | "success" | "error";
  processError: string | null;
  result: AttendanceResponse | null;
  retryProcessing: () => void;

  // --- Step 5: review & correct ---
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  pendingCorrections: Map<number, AttendanceStatus>;
  toggleStatus: (studentId: number) => void;
  cancelChanges: () => void;
  effectiveAttendance: AttendanceRecord[];
  hasPendingChanges: boolean;
  saveAttendance: () => void;
  saveStatus: "idle" | "pending" | "success" | "error";
  saveError: string | null;

  resetFlow: () => void;
}

const AttendanceFlowContext = createContext<AttendanceFlowContextValue | null>(
  null
);

export function AttendanceFlowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [images, setImages] = useState<PickedImage[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SelectedTimetableSlot | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [pendingCorrections, setPendingCorrections] = useState<
    Map<number, AttendanceStatus>
  >(new Map());

  // Keep object URLs from leaking across the life of the app.
  const previewUrlsRef = useRef<string[]>([]);

  const addImages = useCallback(
    (files: File[]) => {
      let accepted = 0;
      let rejected = 0;
      setImages((current) => {
        const room = MAX_IMAGES - current.length;
        const toAdd = files.slice(0, Math.max(room, 0));
        accepted = toAdd.length;
        rejected = files.length - toAdd.length;
        const next = [
          ...current,
          ...toAdd.map((file) => {
            const previewUrl = URL.createObjectURL(file);
            previewUrlsRef.current.push(previewUrl);
            return { file, previewUrl };
          }),
        ];
        return next;
      });
      return { accepted, rejected };
    },
    []
  );

  const removeImage = useCallback((index: number) => {
    setImages((current) => {
      const target = current[index];
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        previewUrlsRef.current = previewUrlsRef.current.filter(
          (u) => u !== target.previewUrl
        );
      }
      return current.filter((_, i) => i !== index);
    });
  }, []);

  const clearImages = useCallback(() => {
    previewUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    previewUrlsRef.current = [];
    setImages([]);
  }, []);

  // ---- Processing mutation ----
  // Defined here, in a provider that stays mounted for the whole app (see
  // src/app/layout.tsx), NOT inside the Processing page component. This is
  // the fix for the "Processing screen never navigates" bug: the previous
  // implementation created the mutation inside the Processing screen and
  // fired it there too, so if the animation's own effects re-rendered or
  // remounted that component (e.g. React 18 StrictMode's mount-cleanup-
  // remount in dev), the mutation instance — and any in-flight promise's
  // callbacks — could be torn down before onSuccess/onError ever ran.
  // Submitting from Image Preview and reading status from context means
  // navigating to /processing can never race the request's own lifecycle.
  const processMutation = useMutation({
    mutationFn: processAttendance,
  });

  const submitForProcessing = useCallback(() => {
    if (!selectedSlot) {
      // Shouldn't happen in normal flow — Start Attendance redirects to
      // /timetable if no slot is selected — but guards against a stray
      // call (e.g. context misuse) silently sending a malformed request.
      return;
    }
    processMutation.mutate({
      images: images.map((i) => i.file),
      timetableSlotId: selectedSlot.timetableSlotId,
      date: selectedSlot.date,
    });
  }, [images, selectedSlot, processMutation]);

  const retryProcessing = useCallback(() => {
    if (!selectedSlot) return;
    processMutation.mutate({
      images: images.map((i) => i.file),
      timetableSlotId: selectedSlot.timetableSlotId,
      date: selectedSlot.date,
    });
  }, [images, selectedSlot, processMutation]);

  const processError =
    processMutation.error instanceof ApiError
      ? processMutation.error.message
      : processMutation.error
      ? "Something went wrong while processing attendance."
      : null;

  // ---- Review / correction state ----
  const result = processMutation.data ?? null;

  const toggleStatus = useCallback((studentId: number) => {
    const record = result?.attendance.find((r) => r.student_id === studentId);
    if (!record) return;

    const currentlyPending = pendingCorrections.get(studentId);
    const currentEffectiveStatus = currentlyPending || record.status;
    const newStatus = currentEffectiveStatus === "present" ? "absent" : "present";

    if (newStatus === "present") {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-success-light px-4 py-3 shadow-card-lg`}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="flex-1 text-sm text-black">
              <span className="font-extrabold uppercase">{record.display_name}</span> has been marked present.
            </p>
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="flex shrink-0 items-center justify-center text-success hover:opacity-75"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ),
        {
          id: `toast-present-${studentId}`,
          duration: 3000,
          position: "bottom-center",
        }
      );
    }

    setPendingCorrections((current) => {
      const next = new Map(current);
      if (current.has(studentId)) {
        next.delete(studentId);
      } else {
        next.set(studentId, newStatus);
      }
      return next;
    });
  }, [result, pendingCorrections]);

  const cancelChanges = useCallback(() => {
    setPendingCorrections(new Map());
    setIsEditing(false);
  }, []);

  const effectiveAttendance = useMemo(() => {
    if (!result) return [];
    return result.attendance.map((record) => {
      const override = pendingCorrections.get(record.student_id);
      if (!override) return record;
      return { ...record, status: override, similarity: null };
    });
  }, [result, pendingCorrections]);

  const updateMutation = useMutation({
    mutationFn: updateAttendance,
  });

  const saveAttendance = useCallback(() => {
    if (pendingCorrections.size === 0 || !result) {
      setIsEditing(false);
      return;
    }
    const payload = {
      session_id: result.session_id,
      attendance: Array.from(pendingCorrections.entries()).map(
        ([student_id, status]) => ({ student_id, status })
      ),
    };
    updateMutation.mutate(payload, {
      onSuccess: () => {
        setPendingCorrections(new Map());
        setIsEditing(false);
      },
    });
  }, [pendingCorrections, updateMutation]);

  const saveError =
    updateMutation.error instanceof ApiError
      ? updateMutation.error.message
      : updateMutation.error
      ? "Something went wrong while saving attendance."
      : null;

  const resetFlow = useCallback(() => {
    clearImages();
    setSelectedSlot(null);
    processMutation.reset();
    updateMutation.reset();
    setPendingCorrections(new Map());
    setIsEditing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearImages]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const value: AttendanceFlowContextValue = {
    images,
    addImages,
    removeImage,
    clearImages,
    selectedSlot,
    setSelectedSlot,
    submitForProcessing,
    processStatus: processMutation.status,
    processError,
    result,
    retryProcessing,
    isEditing,
    setIsEditing,
    pendingCorrections,
    toggleStatus,
    cancelChanges,
    effectiveAttendance,
    hasPendingChanges: pendingCorrections.size > 0,
    saveAttendance,
    saveStatus: updateMutation.status,
    saveError,
    resetFlow,
  };

  return (
    <AttendanceFlowContext.Provider value={value}>
      {children}
    </AttendanceFlowContext.Provider>
  );
}

export function useAttendanceFlow() {
  const ctx = useContext(AttendanceFlowContext);
  if (!ctx) {
    throw new Error(
      "useAttendanceFlow must be used within AttendanceFlowProvider"
    );
  }
  return ctx;
}
