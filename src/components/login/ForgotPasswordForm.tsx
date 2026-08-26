"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [employeeId, setEmployeeId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

  async function handleRequestOTP(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!employeeId.trim()) {
      setError("Please enter your Faculty ID.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/request-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId.trim() }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to request OTP");
      }
      
      setSuccess("OTP has been sent successfully.");
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOTP(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!otp.trim() || !newPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeId.trim(),
          otp: otp.trim(),
          new_password: newPassword.trim(),
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }
      
      setSuccess("Password reset successfully! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (step === 1) {
    return (
      <form onSubmit={handleRequestOTP} className="flex flex-col gap-4">
        <Input
          id="employee_id"
          label="Faculty ID"
          placeholder="e.g. EMP01"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        {success && <p className="text-sm text-success">{success}</p>}
        <Button type="submit" isLoading={isLoading}>
          Request OTP
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
      <Input
        id="otp"
        label="OTP Code"
        placeholder="Enter 6-digit code"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <Input
        id="new_password"
        label="New Password"
        placeholder="Enter new password"
        type={showPassword ? "text" : "password"}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        rightSlot={
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
            className="text-surface-muted"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        }
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      {success && <p className="text-sm text-success">{success}</p>}
      <Button type="submit" isLoading={isLoading}>
        Reset Password
      </Button>
      <button 
        type="button" 
        onClick={() => setStep(1)}
        className="text-sm font-medium text-brand-blue mt-2"
      >
        Back to Request
      </button>
    </form>
  );
}
