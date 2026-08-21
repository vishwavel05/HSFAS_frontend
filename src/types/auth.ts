export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Faculty identity kept in app state after login. Field names are
 * frontend-style (camelCase); see LoginResponse below for the raw
 * snake_case shape the API actually returns.
 */
export interface AuthUser {
  facultyId: string;
  fullName: string;
  department: string;
  gender?: string | null;
}

/**
 * Exact shape of POST /api/auth/login/'s success response per
 * api_documentation.md. No token/session field is documented — every
 * other endpoint takes `faculty_id` as a plain query/body value instead
 * of an auth header, so there is nothing to store as a bearer token today.
 */
export interface LoginResponse {
  success: true;
  faculty_id: string;
  full_name: string;
  department: string;
  gender?: string | null;
}
