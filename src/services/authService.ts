import { apiClient } from "./apiClient";
import type { LoginCredentials, LoginResponse } from "@/types/auth";

/**
 * POST /api/auth/login/ per api_documentation.md.
 * For Phase 2, the backend expects the faculty's employee_id used as both
 * username and password. Response is {success, faculty_id, full_name,
 * department} — no token, so there's nothing else to persist beyond that.
 */
export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/api/auth/login/", {
    username: credentials.username,
    password: credentials.password,
  });
  return response.data;
}
