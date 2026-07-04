import type { Metadata } from "next";
import { StaffSessionProvider } from "@/lib/auth/session-provider";
import "./handbook.css";

export const metadata: Metadata = {
  title: {
    default: "Operations Handbook",
    template: "%s · Handbook · Sunnah Remedies",
  },
  robots: { index: false, follow: false },
};

/**
 * Staff route group layout.
 *
 * Architectural decision: the (staff) route group uses its own layout
 * without the public Masthead and Footer. Staff tools are internal;
 * they do not need the guest-facing chrome. This also allows the
 * route group to be independently protected by auth middleware (Milestone 2)
 * without affecting the public site.
 *
 * The noindex robots directive ensures search engines never index
 * internal pages even if they somehow become accessible.
 *
 * The SessionProvider enables client-side session access for components
 * that need to display the signed-in user or role-specific content.
 */
export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StaffSessionProvider>
      <div className="min-h-screen bg-[#F6F3EE]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-[#0E3B2E] focus:text-white focus:text-xs focus:font-medium"
        >
          Skip to content
        </a>
        <header className="border-b border-[#0E3B2E]/10 px-6 py-4">
          <div className="mx-auto max-w-4xl flex items-center justify-between">
            <span className="font-[family-name:var(--font-utility)] text-xs font-medium tracking-widest uppercase text-[#0E3B2E]/60">
              Sunnah Remedies — Internal
            </span>
            <nav aria-label="Staff navigation" className="font-[family-name:var(--font-utility)] text-xs text-[#0E3B2E]/50 flex items-center gap-4">
              <a href="/handbook" className="hover:text-[#0E3B2E]/80 transition-colors">
                Handbook
              </a>
              <a href="/ops" className="hover:text-[#0E3B2E]/80 transition-colors">
                Operations
              </a>
              <a href="/api/auth/signout" className="hover:text-[#0E3B2E]/80 transition-colors">
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
  );
}
