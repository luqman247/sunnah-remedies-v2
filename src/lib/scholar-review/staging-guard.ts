/**
 * "Scholar Review" portal — hard runtime dataset guard.
 *
 * Every read and write this portal performs must go through
 * assertStagingDataset() first. This module has no dependency on request
 * context — it reads the resolved Sanity dataset exactly the way the rest
 * of this codebase does (src/sanity/lib/client.ts:
 * `process.env.NEXT_PUBLIC_SANITY_DATASET || "production"`) and refuses to
 * proceed unless it resolves to exactly `"staging"`.
 *
 * This is deliberately NOT configurable by a second env var or an
 * allowlist — the one legitimate dataset for this entire portal is
 * "staging", full stop. If this ever runs against a Preview deployment
 * that forgot to set NEXT_PUBLIC_SANITY_DATASET=staging (falling back to
 * the "production" default), every read and write in the portal fails
 * loudly instead of silently touching production data.
 *
 * Server-only by convention (never import from a "use client" file) — see
 * src/sanity/lib/client.ts for the same established pattern in this
 * codebase: no `server-only` package dependency, but the token this module
 * uses (SANITY_API_TOKEN) has no NEXT_PUBLIC_ prefix, so Next.js never
 * bundles it into client JavaScript regardless.
 */

export const SCHOLAR_REVIEW_REQUIRED_DATASET = "staging";

export function resolveScholarReviewDataset(): string {
  return process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
}

export function isStagingDataset(): boolean {
  return resolveScholarReviewDataset() === SCHOLAR_REVIEW_REQUIRED_DATASET;
}

export class NotStagingDatasetError extends Error {
  constructor(resolved: string) {
    super(
      `Scholar-review portal refuses to operate: resolved Sanity dataset is "${resolved}", not "${SCHOLAR_REVIEW_REQUIRED_DATASET}". ` +
        `This is a hard safety guard — it never operates against production.`,
    );
    this.name = "NotStagingDatasetError";
  }
}

/** Throws NotStagingDatasetError unless the resolved dataset is exactly "staging". Call this before every read and write. */
export function assertStagingDataset(): void {
  const resolved = resolveScholarReviewDataset();
  if (resolved !== SCHOLAR_REVIEW_REQUIRED_DATASET) {
    throw new NotStagingDatasetError(resolved);
  }
}
