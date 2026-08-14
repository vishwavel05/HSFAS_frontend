import { apiClient } from "./apiClient";
import type { LoginCredentials, LoginResponse } from "@/types/auth";

const LOGIN_ENDPOINT =
  process.env.NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT ?? "/api/auth/login/";

/**
 * Backend_final.md (the documented source of truth) does not specify an
 * authentication endpoint — it only documents /api/enrollments/,
 * /api/attendance/, and /api/attendance/update/. The PRD still requires a
 * working Sign In against "the backend authentication endpoint," so this
 * calls a configurable endpoint (NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT) rather
 * than faking a successful login client-side. Point the env var at your
 * real Django auth view (DRF TokenAuth, SimpleJWT, session login, etc.)
 * and this will work as-is; until then, sign-in will surface a real error
 * from whatever that endpoint currently returns.
 */
export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(LOGIN_ENDPOINT, {
    username: credentials.username,
    password: credentials.password,
  });
  return response.data;
}
