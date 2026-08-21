import axios, { AxiosError, AxiosHeaders } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

const AUTH_TOKEN_STORAGE_KEY = "hsfas_auth_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ??
    window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  );
}

export function storeToken(token: string, persist: boolean) {
  if (typeof window === "undefined") return;
  if (persist) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } else {
    window.sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
}

export function clearStoredToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

// ---------------------------------------------------------------------------
// Faculty identity storage
// ---------------------------------------------------------------------------
// api_documentation.md's login endpoint returns {faculty_id, full_name,
// department} and no token/session field, and every other endpoint takes
// faculty_id as a plain query/body value rather than reading it from an
// auth header. So "being logged in" here means "we have a persisted
// faculty_id", not "we have a valid bearer token" — this is a separate,
// explicitly-named concern from the (currently unused) token helpers
// above, which are left in place only in case real token auth is added
// to the backend later.
const FACULTY_STORAGE_KEY = "hsfas_faculty_identity";

export interface StoredFacultyIdentity {
  facultyId: string;
  fullName: string;
  department: string;
  gender?: string | null;
}

export function getStoredFacultyIdentity(): StoredFacultyIdentity | null {
  if (typeof window === "undefined") return null;
  const raw =
    window.localStorage.getItem(FACULTY_STORAGE_KEY) ??
    window.sessionStorage.getItem(FACULTY_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredFacultyIdentity;
  } catch {
    return null;
  }
}

export function storeFacultyIdentity(
  identity: StoredFacultyIdentity,
  persist: boolean
) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(identity);
  if (persist) {
    window.localStorage.setItem(FACULTY_STORAGE_KEY, raw);
    window.sessionStorage.removeItem(FACULTY_STORAGE_KEY);
  } else {
    window.sessionStorage.setItem(FACULTY_STORAGE_KEY, raw);
    window.localStorage.removeItem(FACULTY_STORAGE_KEY);
  }
}

export function clearStoredFacultyIdentity() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(FACULTY_STORAGE_KEY);
  window.sessionStorage.removeItem(FACULTY_STORAGE_KEY);
}

/**
 * Normalized error shape used throughout the app so every screen can
 * render a real, specific message instead of a swallowed/opaque error.
 *
 * BUG FIX (previous implementation): the old axios error interceptor
 * returned a generic Error with no message, so React Query's onError
 * handlers effectively received nothing useful to show — screens looked
 * like they "hung" because the UI had no error branch to actually render.
 * This interceptor always preserves a human-readable message, the HTTP
 * status, and the original error for debugging.
 */
export class ApiError extends Error {
  status: number | null;
  isNetworkError: boolean;
  isTimeout: boolean;
  original: unknown;

  constructor(params: {
    message: string;
    status: number | null;
    isNetworkError: boolean;
    isTimeout: boolean;
    original: unknown;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.isNetworkError = params.isNetworkError;
    this.isTimeout = params.isTimeout;
    this.original = params.original;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // face recognition can be slow; generous but finite
});

apiClient.interceptors.request.use((config) => {
  // Currently a no-op in practice: api_documentation.md's login endpoint
  // returns no token, so nothing is ever written under
  // AUTH_TOKEN_STORAGE_KEY by the real login flow (see
  // storeFacultyIdentity below for what actually persists a session).
  // Left in place rather than removed, in case token-based auth is added
  // to the backend later.
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers ?? new AxiosHeaders();
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  // BUG FIX (previous implementation): the request builder manually set
  // `Content-Type: multipart/form-data` on FormData requests. That header
  // needs a `boundary=...` parameter that only the browser's fetch/XHR
  // implementation can generate when it serializes the FormData body.
  // Setting the header manually strips that boundary, so Django's
  // MultiPartParser cannot split the body into fields at all — it silently
  // receives an unparsable request, which is why `images`/`department`/etc.
  // never showed up server-side even though the browser returned 200/well
  // short of that. The fix is simply to never set Content-Type ourselves
  // for FormData bodies; axios + the browser set it correctly (including
  // the boundary) whenever the header is left unset.
  if (config.data instanceof FormData && config.headers) {
    config.headers.delete("Content-Type");
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; detail?: string }>) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject(
        new ApiError({
          message:
            "The server took too long to respond. The images may still be processing — please try again in a moment.",
          status: null,
          isNetworkError: false,
          isTimeout: true,
          original: error,
        })
      );
    }

    if (!error.response) {
      return Promise.reject(
        new ApiError({
          message:
            "Could not reach the server. Check your connection and that the backend is running.",
          status: null,
          isNetworkError: true,
          isTimeout: false,
          original: error,
        })
      );
    }

    const status = error.response.status;
    const backendMessage =
      error.response.data?.error ?? error.response.data?.detail;

    let message = backendMessage ?? `Request failed with status ${status}.`;
    if (!backendMessage) {
      if (status === 401) message = "Your session has expired. Please sign in again.";
      else if (status === 403) message = "You don't have permission to do that.";
      else if (status === 404) message = "That endpoint could not be found on the server.";
      else if (status >= 500) message = "The server ran into a problem processing this request.";
    }

    return Promise.reject(
      new ApiError({
        message,
        status,
        isNetworkError: false,
        isTimeout: false,
        original: error,
      })
    );
  }
);
