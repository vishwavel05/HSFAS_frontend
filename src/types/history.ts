import type { AttendanceRecord } from "./attendance";

/**
 * Mirrors GET /api/attendance/history/ exactly, per api_documentation.md.
 * Note: the documented example does NOT include a session_id field on
 * history records (unlike the Process Attendance response, which does)
 * — that's a real gap, not an oversight here. See the History page's
 * top-of-file comment for what this means for "correct from history".
 */
export interface AttendanceHistoryRecord {
  session_id: number;
  course_code: string;
  course_name: string;
  class_group: string;
  date: string;
  time: string;
  status: string;
  total_students: number;
  present: number;
  absent: number;
  unknown: number;
  annotated_images: string[];
  attendance?: AttendanceRecord[];
  faculty_name?: string;
  period_number?: number;
}
