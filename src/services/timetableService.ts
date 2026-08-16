import { apiClient } from "./apiClient";
import type { TimetableResponse } from "@/types/timetable";

/**
 * GET /api/timetable/ per api_documentation.md.
 * `date` and `semester` are optional — the backend defaults `date` to
 * today and `semester` to "Even 2025" when omitted, so this only sends
 * them when the caller explicitly supplies a value (e.g. paging to a
 * different day later).
 */
export async function getTimetable(params: {
  facultyId: string;
  date?: string;
  semester?: string;
}): Promise<TimetableResponse> {
  const response = await apiClient.get<TimetableResponse>("/api/timetable/", {
    params: {
      faculty_id: params.facultyId,
      ...(params.date ? { date: params.date } : {}),
      ...(params.semester ? { semester: params.semester } : {}),
    },
  });
  return response.data;
}
