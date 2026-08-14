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
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <div className="min-h-screen w-full sm:max-w-shell sm:min-h-[820px] sm:my-0 bg-surface sm:rounded-[28px] sm:overflow-hidden sm:shadow-card-lg flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
