import type { Metadata } from "next";
import { StaffSessionProvider } from "@/lib/auth/session-provider";
import { fontVariables } from "@/app/fonts";
import "../globals.css";
import "./handbook.css";

export const metadata: Metadata = {
  title: {
    default: "Operations Handbook",
    template: "%s · Handbook · Sunnah Remedies",
  },
  robots: { index: false, follow: false },
};

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <StaffSessionProvider>
          <div className="min-h-screen bg-warm-ivory">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-emerald focus:text-white focus:text-xs focus:font-medium"
            >
              Skip to content
            </a>
            <header className="border-b border-emerald/10 px-6 py-4">
              <div className="mx-auto max-w-4xl flex items-center justify-between">
                <span className="font-[family-name:var(--font-utility)] text-xs font-medium tracking-widest uppercase text-emerald/60">
                  Sunnah Remedies — Internal
                </span>
                <nav aria-label="Staff navigation" className="font-[family-name:var(--font-utility)] text-xs text-emerald/50 flex items-center gap-4">
                  <a href="/handbook" className="hover:text-emerald/80 transition-colors">
                    Handbook
                  </a>
                  <a href="/ops" className="hover:text-emerald/80 transition-colors">
                    Operations
                  </a>
                  <a href="/api/auth/signout" className="hover:text-emerald/80 transition-colors">
                    Sign out
                  </a>
                </nav>
              </div>
            </header>
            <main id="main-content" className="mx-auto max-w-4xl px-6 py-10">
              {children}
            </main>
          </div>
        </StaffSessionProvider>
      </body>
    </html>
  );
}
