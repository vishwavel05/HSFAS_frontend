import { apiClient } from "./apiClient";
import type {
  AttendanceResponse,
  AttendanceUpdatePayload,
  AttendanceUpdateSuccessResponse,
  ProcessAttendancePayload,
} from "@/types/attendance";

/**
 * POST /api/attendance/  (multipart/form-data)
 * Fields per api_documentation.md: images (1-5, repeated),
 * timetable_slot_id (required), date (required, YYYY-MM-DD), threshold
 * (optional). There is no department/year/section/debug field in the
 * documented request — the backend resolves class context server-side
 * from timetable_slot_id.
 */
export async function processAttendance(
  payload: ProcessAttendancePayload
): Promise<AttendanceResponse> {
  const formData = new FormData();
  payload.images.forEach((file) => formData.append("images", file));
  formData.append("timetable_slot_id", String(payload.timetableSlotId));
  formData.append("date", payload.date);
  if (payload.threshold !== undefined) {
    formData.append("threshold", String(payload.threshold));
  }

  const response = await apiClient.post<AttendanceResponse>(
    "/api/attendance/",
    formData
  );
  return response.data;
}

/**
 * POST /api/attendance/update/  (application/json)
 * Body: { attendance: [{ student_id, status }] }
 */
export async function updateAttendance(
  payload: AttendanceUpdatePayload
): Promise<AttendanceUpdateSuccessResponse> {
  const response = await apiClient.post<AttendanceUpdateSuccessResponse>(
    "/api/attendance/update/",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

/** Resolve an annotated image path returned by the backend into a full URL. */
export function resolveMediaUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
    "http://127.0.0.1:8000";
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
