import type { Metadata } from "next";
import { isStagingDataset, resolveScholarReviewDataset } from "@/lib/scholar-review/staging-guard";
import { hasAccess, getSessionIdFromCookie, isAccessCodeConfigured } from "@/lib/scholar-review/access-control";
import { getReviewSession } from "@/lib/scholar-review/review-records";
import { AccessCodeForm } from "@/components/scholar-review/AccessCodeForm";
import { ReviewerIdentityForm } from "@/components/scholar-review/ReviewerIdentityForm";
import { ReviewChrome } from "@/components/scholar-review/ReviewChrome";

/**
 * Root layout for the entire /scholar-review portal.
 *
 * Order of checks, each a hard gate (fail closed):
 *   1. Staging dataset guard — if the resolved dataset isn't "staging",
 *      nothing below this line ever runs, regardless of access-code state.
 *   2. Access-code gate (SCHOLAR_REVIEW_ACCESS_CODE).
 *   3. Reviewer-identity gate (creates the scholarlyReviewSession once).
 *   4. The actual requested page, wrapped in the review chrome.
 *
 * Never linked from public navigation, never in the sitemap — see the
 * metadata export below and src/app/sitemap.ts (deliberately untouched).
 */
export const metadata: Metadata = {
  title: "Sunnah Remedies Scholarly Review",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function ScholarReviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ScholarReviewGate>{children}</ScholarReviewGate>
      </body>
    </html>
  );
}

/**
 * /scholar-review is a top-level route tree, a sibling of [locale] and
 * (staff) rather than nested under either — so, exactly like
 * src/app/(staff)/layout.tsx, it must provide its own <html>/<body>: the
 * shared src/app/layout.tsx deliberately just passes children through and
 * leaves that to whichever route tree is actually rendering.
 */
async function ScholarReviewGate({ children }: { children: React.ReactNode }) {
  if (!isStagingDataset()) {
    return <StagingGuardError resolved={resolveScholarReviewDataset()} />;
  }

  if (!isAccessCodeConfigured()) {
    return <ConfigError message="SCHOLAR_REVIEW_ACCESS_CODE is not configured for this environment." />;
  }

  const accessGranted = await hasAccess();
  if (!accessGranted) {
    return <AccessCodeForm />;
  }

  const sessionId = await getSessionIdFromCookie();
  const session = sessionId ? await getReviewSession(sessionId) : null;
  if (!session) {
    return <ReviewerIdentityForm />;
  }

  return <ReviewChrome reviewerName={session.reviewer.fullName}>{children}</ReviewChrome>;
}

function StagingGuardError({ resolved }: { resolved: string }) {
  return (
    <ConfigError
      message={`This review portal only operates against the "staging" Sanity dataset. The resolved dataset here is "${resolved}". No content was read or written.`}
    />
  );
}

function ConfigError({ message }: { message: string }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F6F3EE", padding: "2rem" }}>
      <div style={{ maxWidth: 520, background: "#FFFFFF", border: "1px solid #E2DCCF", borderRadius: 4, padding: "2rem" }}>
        <h1 style={{ color: "#9A2B2B", fontSize: "1.2rem", marginTop: 0 }}>Review portal unavailable</h1>
        <p style={{ color: "#4A4438", lineHeight: 1.6 }}>{message}</p>
      </div>
    </div>
  );
}
