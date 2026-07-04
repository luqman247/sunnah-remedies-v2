import type { Metadata } from "next";
import { StaffSessionProvider } from "@/lib/auth/session-provider";
import {
  Fraunces,
  Newsreader,
  IBM_Plex_Mono,
  Amiri,
} from "next/font/google";
import "../globals.css";
import "./handbook.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-display",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-utility",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-arabic",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${fraunces.variable} ${newsreader.variable} ${plexMono.variable} ${amiri.variable}`}
    >
      <body>
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
      </body>
    </html>
  );
}
