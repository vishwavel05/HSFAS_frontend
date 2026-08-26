"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function LoginForm() {
  const { login, isLoggingIn, loginError, clearLoginError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearLoginError();

    if (!username.trim() || !password) {
      setValidationError("Enter your username and password to continue.");
      return;
    }
    setValidationError(null);
    login({ username: username.trim(), password: password.trim(), rememberMe });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        id="username"
        label="Username"
        placeholder="Enter your username"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />

      <Input
        id="password"
        label="Password"
        placeholder="Enter your password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect
              x="4"
              y="10"
              width="16"
              height="10"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="M8 10V7a4 4 0 1 1 8 0v3"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        }
        rightSlot={
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
            className="text-surface-muted"
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.5A10.4 10.4 0 0 1 12 5c5 0 9 4.5 9 7a9.8 9.8 0 0 1-3 3.5M6.3 6.3C4 8 2.6 10.4 3 12c.6 2 3 5 9 5 1 0 1.9-.1 2.7-.4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
              </svg>
            )}
          </button>
        }
      />

      <div className="flex items-center justify-between">
        <Checkbox
          id="remember-me"
          label="Remember me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-brand-blue hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      {(validationError || loginError) && (
        <p className="text-sm text-danger" role="alert">
          {validationError ?? loginError}
        </p>
      )}

      <Button type="submit" isLoading={isLoggingIn}>
        Sign In
      </Button>
    </form>
  );
}
