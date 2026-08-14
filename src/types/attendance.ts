/**
 * Types mirror the exact shapes documented in Backend_final.md.
 * Do not add fields the backend does not return — the PRD forbids
 * hardcoded / dummy attendance data.
 */

export type AttendanceStatus = "present" | "absent";

export interface AttendanceRecord {
  student_id: number;
  roll_number: string;
  display_name: string;
  department: string;
  year: string;
  section: string;
  status: AttendanceStatus;
  similarity: number | null;
}

export interface AttendanceSummary {
  total_students: number;
  present: number;
  absent: number;
  unknown: number;
}

export interface AttendanceResponse {
  summary: AttendanceSummary;
  attendance: AttendanceRecord[];
  annotated_images: string[];
}

export interface ProcessAttendancePayload {
  images: File[];
  department: string;
  year: string;
  section: string;
  threshold?: number;
  debug?: boolean;
}

export interface AttendanceUpdateEntry {
  student_id: number;
  status: AttendanceStatus;
}

export interface AttendanceUpdatePayload {
  attendance: AttendanceUpdateEntry[];
}

export interface AttendanceUpdateSuccessResponse {
  success: true;
  message: string;
}

export interface ApiErrorResponse {
  error: string;
}
