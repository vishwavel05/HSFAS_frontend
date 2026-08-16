"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login as loginRequest } from "@/services/authService";
import {
  clearStoredFacultyIdentity,
  getStoredFacultyIdentity,
  storeFacultyIdentity,
} from "@/services/apiClient";
import { ApiError } from "@/services/apiClient";
import type { AuthUser, LoginCredentials } from "@/types/auth";

// ---------------------------------------------------------------------------
// DEMO MODE
// ---------------------------------------------------------------------------
// While true, Sign In never calls the backend login endpoint. Instead:
//   - username "admin" + password "admin" logs in locally as faculty_id
//     "F101" (matching the worked example in api_documentation.md), so
//     downstream Timetable/History calls have a real faculty_id to query.
//   - any other credentials show "Invalid credentials".
// To restore real backend authentication after the demo, set this to false
// (or delete the DEMO MODE block below). No other file needs to change.
const DEMO_MODE = false;
const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "admin";
const DEMO_FACULTY: AuthUser = {
  facultyId: "F101",
  fullName: "Demo Faculty",
  department: "CSE",
};
// ---------------------------------------------------------------------------

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (credentials: LoginCredentials) => void;
  isLoggingIn: boolean;
  loginError: string | null;
  clearLoginError: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Local error state used only for the DEMO MODE bypass path, since that
  // path never touches the react-query mutation that normally carries
  // loginError. Left in place (harmless/no-op) if DEMO_MODE is turned off.
  const [demoLoginError, setDemoLoginError] = useState<string | null>(null);

  useEffect(() => {
    // Hydrate "is signed in" from the persisted faculty identity (see
    // apiClient's storeFacultyIdentity) — the documented login response
    // has no token/session field, so faculty_id + name + department *is*
    // the session as far as this app is concerned.
    const stored = getStoredFacultyIdentity();
    if (stored) {
      setUser({
        facultyId: stored.facultyId,
        fullName: stored.fullName,
        department: stored.department,
      });
    }
    setIsHydrated(true);
  }, []);

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data, variables) => {
      const identity: AuthUser = {
        facultyId: data.faculty_id,
        fullName: data.full_name,
        department: data.department,
      };
      storeFacultyIdentity(identity, variables.rememberMe);
      setUser(identity);
      router.push("/timetable");
    },
  });

  const login = useCallback(
    (credentials: LoginCredentials) => {
      // -----------------------------------------------------------------
      // DEMO MODE bypass — remove this block (and set DEMO_MODE = false)
      // to restore real backend authentication.
      // -----------------------------------------------------------------
      if (DEMO_MODE) {
        setDemoLoginError(null);

        if (
          credentials.username === DEMO_USERNAME &&
          credentials.password === DEMO_PASSWORD
        ) {
          storeFacultyIdentity(DEMO_FACULTY, credentials.rememberMe);
          setUser(DEMO_FACULTY);
          router.push("/timetable");
        } else {
          setDemoLoginError("Invalid credentials");
        }
        return;
      }
      // -----------------------------------------------------------------
      // End DEMO MODE bypass. Real backend call below is unchanged.
      // -----------------------------------------------------------------

      mutation.mutate(credentials);
    },
    [mutation, router]
  );

  const logout = useCallback(() => {
    clearStoredFacultyIdentity();
    setUser(null);
    router.push("/login");
  }, [router]);

  const loginError = DEMO_MODE
    ? demoLoginError
    : mutation.error
    ? mutation.error instanceof ApiError
      ? mutation.error.message
      : "Something went wrong while signing in."
    : null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isHydrated,
      login,
      isLoggingIn: DEMO_MODE ? false : mutation.isPending,
      loginError,
      clearLoginError: () => {
        setDemoLoginError(null);
        mutation.reset();
      },
      logout,
    }),
    [user, isHydrated, login, mutation, loginError, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
