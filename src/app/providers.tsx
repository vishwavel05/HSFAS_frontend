"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { AttendanceFlowProvider } from "@/context/AttendanceFlowContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  // useState (not a module-level singleton) so each browser session gets
  // its own client, while still surviving client-side route navigations
  // within that session since this component lives in the root layout.
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AttendanceFlowProvider>
          {children}
          <Toaster position="bottom-center" toastOptions={{
            duration: 3000,
            style: {
              background: '#0b1e4d',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '99px',
              padding: '12px 24px',
            }
          }} />
        </AttendanceFlowProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
