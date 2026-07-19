import type { CanonicalFeelingState } from "@/lib/feeling/taxonomy";
import type { FeelingStatePublic } from "@/sanity/lib/feeling-public-fetch";

/**
 * Dev/preview-only review-status indicator (owner-review requirement,
 * 2026-07-19, item 9). Shows the CURRENT provisional review state of a
 * feeling page while the owner/reviewers are working through
 * docs/i-am-feeling/SCHOLARLY_REVIEW_PACKAGE.md locally — never rendered in
 * a production build.
 *
 * Safety guarantee: `process.env.NODE_ENV` is inlined at build time by
 * Next.js's bundler, so in a production build the condition below compiles
 * to `false` and this component (and its import) is dead-code-eliminated
 * from the output entirely — not merely hidden, genuinely absent. This is
 * intentionally the lightest possible implementation: no new Studio tool,
 * no new Sanity field, no runtime flag to misconfigure.
 */

export type FeelingReviewTag =
  | "sourced"
  | "scholarly-review-required"
  | "safeguarding-review-required"
  | "danish-unavailable"
  | "blocked-by-missing-entry"
  | "deferred";

const TAG_LABELS: Record<FeelingReviewTag, string> = {
  sourced: "Sourced (draft copy exists)",
  "scholarly-review-required": "Scholarly review required",
  "safeguarding-review-required": "Safeguarding/clinical review required",
  "danish-unavailable": "Danish unavailable",
  "blocked-by-missing-entry": "Blocked — no featured entry",
  deferred: "Deferred (architected, not launched)",
};

export function computeFeelingReviewTags(
  canonical: Pick<CanonicalFeelingState, "launchStatus" | "safeguardingLevel">,
  state: Pick<FeelingStatePublic, "hasEligibleFeaturedEntries"> | undefined,
  locale: "en" | "da",
  otherLocaleReady: boolean,
): FeelingReviewTag[] {
  if (canonical.launchStatus !== "launch") return ["deferred"];

  const tags: FeelingReviewTag[] = [];
  if (!state?.hasEligibleFeaturedEntries) {
    tags.push("blocked-by-missing-entry");
  } else {
    tags.push("sourced", "scholarly-review-required");
    if (canonical.safeguardingLevel !== "standard") tags.push("safeguarding-review-required");
  }
  if (locale === "en" && !otherLocaleReady) tags.push("danish-unavailable");
  return tags;
}

export function FeelingReviewStatusBadge({ tags }: { tags: FeelingReviewTag[] }) {
  if (process.env.NODE_ENV === "production") return null;
  if (tags.length === 0) return null;

  return (
    <div
      style={{
        margin: "0 0 var(--space-4)",
        padding: "var(--space-2) var(--space-3)",
        border: "1px dashed #b45309",
        borderRadius: 4,
        background: "#fffbeb",
        color: "#78350f",
        fontFamily: "monospace",
        fontSize: "0.75rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--space-2)",
        alignItems: "center",
      }}
      aria-hidden="true"
      data-preview-only="feeling-review-status"
    >
      <strong>PREVIEW ONLY — review status:</strong>
      {tags.map((tag) => (
        <span key={tag} style={{ padding: "1px 6px", border: "1px solid #b45309", borderRadius: 3 }}>
          {TAG_LABELS[tag]}
        </span>
      ))}
    </div>
  );
}
