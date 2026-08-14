import { apiClient } from "./apiClient";
import type {
  AttendanceResponse,
  AttendanceUpdatePayload,
  AttendanceUpdateSuccessResponse,
  ProcessAttendancePayload,
} from "@/types/attendance";

/**
 * POST /api/attendance/  (multipart/form-data)
 * Fields per Backend_final.md: images (1-5, repeated), department, year,
 * section, threshold (optional), debug (optional).
 */
export async function processAttendance(
  payload: ProcessAttendancePayload
): Promise<AttendanceResponse> {
  const formData = new FormData();
  payload.images.forEach((file) => formData.append("images", file));
  formData.append("department", payload.department);
  formData.append("year", payload.year);
  formData.append("section", payload.section);
  if (payload.threshold !== undefined) {
    formData.append("threshold", String(payload.threshold));
  }
  if (payload.debug) {
    formData.append("debug", "true");
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
