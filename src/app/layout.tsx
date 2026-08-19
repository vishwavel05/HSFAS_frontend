import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "HSFAS – HITS Smart Face Attendance System",
  description: "AI-powered classroom attendance via face recognition.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <Providers>
          <div className="grid grid-rows-[1fr] min-h-screen w-full bg-surface sm:max-w-shell sm:min-h-[820px] sm:my-0 sm:rounded-[28px] sm:overflow-hidden sm:shadow-card-lg">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
