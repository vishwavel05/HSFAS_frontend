import { ForgotPasswordForm } from "@/components/login/ForgotPasswordForm";
import { HindustanLogo } from "@/components/layout/HindustanBrandmark";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-1 flex-col bg-navy min-h-screen">
      <div className="relative shrink-0 overflow-hidden h-40">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 70% at 50% -10%, rgba(255,255,255,0.14), transparent 60%)" }} />
      </div>
      <div className="flex flex-1 flex-col px-6 pb-20 pt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/login" className="flex items-center gap-2 text-white/70 hover:text-white mb-8">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to login
        </Link>
        <div className="mb-8">
          <HindustanLogo className="h-10 text-white" />
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Enter your faculty ID to receive an OTP.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-xl sm:px-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
