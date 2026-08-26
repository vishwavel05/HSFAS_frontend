import { apiClient } from "./apiClient";

export interface DepartmentMetric {
  department: string;
  year: string;
  section: string;
  attendance_pct: number;
}

export interface AdminAnalyticsResponse {
  overall_attendance: number;
  total_sessions: number;
  time_saved_seconds: number;
  department_metrics: DepartmentMetric[];
}

export async function getAdminAnalytics(): Promise<AdminAnalyticsResponse> {
  const res = await apiClient.get("/api/admin/analytics/");
  return res.data;
}
export async function enrollStudent(formData: FormData): Promise<any> {
  const res = await apiClient.post("/api/enrollments/", formData);
  return res.data;
}

export async function getMetadata(): Promise<any> {
  const res = await apiClient.get("/api/metadata/");
  return res.data;
}

export async function assignLecture(data: any): Promise<any> {
  const res = await apiClient.post("/api/timetable/assign/", data);
  return res.data;
}
