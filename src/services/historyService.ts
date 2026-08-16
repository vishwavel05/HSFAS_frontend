import { apiClient } from "./apiClient";
import type { AttendanceHistoryRecord } from "@/types/history";

/**
 * GET /api/attendance/history/ per api_documentation.md.
 * `faculty_id` is the only documented query parameter — there is no
 * documented support for date-range, status, course, or search filters,
 * or for pagination. The History page fetches the full list once and
 * implements all of those client-side. See that page for details.
 */
export async function getAttendanceHistory(
  facultyId: string
): Promise<AttendanceHistoryRecord[]> {
  const response = await apiClient.get<AttendanceHistoryRecord[]>(
    "/api/attendance/history/",
    { params: { faculty_id: facultyId } }
  );
  return response.data;
}
