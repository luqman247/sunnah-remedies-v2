import type { Metadata } from "next";
import {
  getDhikrCategoriesInternalPreview,
  getDhikrItemsInternalPreview,
  getDhikrItemsInternalDetail,
  DHIKR_V1_PLACEHOLDER_REGISTER,
  type DhikrItemInternalDetail,
} from "@/sanity/lib/dhikr-fetch";
import {
  getDhikrEligibilityConditions,
  isDhikrItemPubliclyEligible,
} from "@/sanity/lib/dhikr-publication-gate";

export const metadata: Metadata = {
  title: "Dhikr — Internal Review",
  robots: { index: false, follow: false },
};

/**
 * Dhikr internal review — Stage 2E.
 *
 * Staff-only (see middleware.ts), absent from public/main navigation,
 * noindex. Data comes exclusively from src/sanity/lib/dhikr-fetch.ts
 * (previewClient, no eligibility filter) — never the public fetch layer.
 * Governance fields (reviewStatus, board approvals including reviewer
 * identity and notes) are shown here deliberately, since this page is
 * staff-only; none of this data is available to any public route.
 *
 * @see docs/dhikr/README.md
 * @see docs/dhikr/18-v1-content-register.md
 * @see docs/dhikr/29-publication-approval-checklist.md
 */

const REVIEW_STATUS_LABELS: Record<string, string> = {
  sourced: "Sourced",
  "scholarly-review": "Scholarly Review",
  "editorial-review": "Editorial Review",
  approved: "Approved",
  published: "Published",
};

const FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sourced", label: "Sourced" },
  { value: "scholarly-review", label: "Scholarly Review" },
  { value: "editorial-review", label: "Editorial Review" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
  { value: "incomplete", label: "Incomplete" },
];

export interface DhikrReviewSummary {
  total: number;
  sourced: number;
  scholarlyReview: number;
  editorialReview: number;
  approved: number;
  published: number;
  canonicallyEligible: number;
  incomplete: number;
}

/**
 * Pure summary-count calculation, exported for direct testing. "Incomplete"
 * is a calculated display category only (items that do not currently pass
 * the canonical gate, regardless of reviewStatus) — not a new workflow
 * state; reviewStatus itself is never assigned an "incomplete" value
 * anywhere in this file.
 */
export function computeDhikrReviewSummary(items: DhikrItemInternalDetail[]): DhikrReviewSummary {
  const summary: DhikrReviewSummary = {
    total: items.length,
    sourced: 0,
    scholarlyReview: 0,
    editorialReview: 0,
    approved: 0,
    published: 0,
    canonicallyEligible: 0,
    incomplete: 0,
  };
  for (const item of items) {
    if (item.reviewStatus === "sourced") summary.sourced += 1;
    else if (item.reviewStatus === "scholarly-review") summary.scholarlyReview += 1;
    else if (item.reviewStatus === "editorial-review") summary.editorialReview += 1;
    else if (item.reviewStatus === "approved") summary.approved += 1;
    else if (item.reviewStatus === "published") summary.published += 1;

    if (isDhikrItemPubliclyEligible(item)) summary.canonicallyEligible += 1;
    else summary.incomplete += 1;
  }
  return summary;
}

/** Filters the full item list by the "status" query param — "incomplete" is a calculated view, not a reviewStatus value. */
export function filterDhikrItems(items: DhikrItemInternalDetail[], status: string | undefined): DhikrItemInternalDetail[] {
  if (!status || status === "all") return items;
  if (status === "incomplete") return items.filter((item) => !isDhikrItemPubliclyEligible(item));
  return items.filter((item) => item.reviewStatus === status);
}

function formatUpdatedAt(iso: string | undefined): string {
  if (!iso) return "Not provided";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const fieldLabel = "font-[family-name:var(--font-utility)] text-[10px] font-medium uppercase tracking-widest text-[#0E3B2E]/50";
const fieldValue = "font-[family-name:var(--font-body)] text-sm text-[#0E3B2E]";
const emptyValue = "font-[family-name:var(--font-body)] text-sm text-[#0E3B2E]/40 italic";
const subHeading = "font-[family-name:var(--font-utility)] text-xs font-semibold uppercase tracking-widest text-[#0E3B2E] mb-3 pb-2 border-b border-[#0E3B2E]/10";

function EmptyField({ children = "Not entered" }: { children?: string }) {
  return <p className={emptyValue}>{children}</p>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className={fieldLabel}>{label}</p>
      <div className={fieldValue}>{children}</div>
    </div>
  );
}

export default async function DhikrReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const [categories, liveItems, detailItems] = await Promise.all([
    getDhikrCategoriesInternalPreview(),
    getDhikrItemsInternalPreview(),
    getDhikrItemsInternalDetail(),
  ]);

  const summary = computeDhikrReviewSummary(detailItems);
  const activeFilter = status && FILTER_OPTIONS.some((f) => f.value === status) ? status : "all";
  const filteredItems = filterDhikrItems(detailItems, activeFilter);

  return (
    <article>
      <div
        role="alert"
        className="mb-8 border border-[#8A5A2B] bg-[#8A5A2B]/5 px-4 py-3"
      >
        <p className="font-[family-name:var(--font-utility)] text-xs font-medium uppercase tracking-widest text-[#8A5A2B]">
          Internal review only
        </p>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#0E3B2E]/80 mt-1 leading-relaxed">
          Content below reflects live Sanity records exactly as entered by staff. Nothing here has
          passed public eligibility review unless the Canonical Readiness panel for that item shows
          every condition Met. Not for public review, distribution, or use as a religious reference.
        </p>
      </div>

      <header className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-light text-[#0E3B2E] mb-2">
          Dhikr — Internal Review
        </h1>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#0E3B2E]/70 leading-relaxed max-w-2xl">
          See docs/dhikr/29-publication-approval-checklist.md before publishing any item.
        </p>
      </header>

      <section aria-labelledby="placeholder-register-heading" className="mb-10">
        <h2
          id="placeholder-register-heading"
          className="font-[family-name:var(--font-utility)] text-sm font-medium text-[#0E3B2E] mb-3"
        >
          v1 Placeholder Register ({DHIKR_V1_PLACEHOLDER_REGISTER.length} slots)
        </h2>
        <p className="font-[family-name:var(--font-body)] text-xs text-[#0E3B2E]/60 mb-4">
          Mirrors docs/dhikr/18-v1-content-register.md. Every slot is pending
          scholarly input — none has been sourced.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#0E3B2E]/10">
                <th scope="col" className="whitespace-nowrap font-[family-name:var(--font-utility)] text-xs font-medium text-[#0E3B2E]/60 pb-2 pr-4">
                  Slot ID
                </th>
                <th scope="col" className="whitespace-nowrap font-[family-name:var(--font-utility)] text-xs font-medium text-[#0E3B2E]/60 pb-2 pr-4">
                  Proposed category
                </th>
                <th scope="col" className="whitespace-nowrap font-[family-name:var(--font-utility)] text-xs font-medium text-[#0E3B2E]/60 pb-2 pr-4">
                  Review status
                </th>
                <th scope="col" className="whitespace-nowrap font-[family-name:var(--font-utility)] text-xs font-medium text-[#0E3B2E]/60 pb-2">
                  Internal note
                </th>
              </tr>
            </thead>
            <tbody>
              {DHIKR_V1_PLACEHOLDER_REGISTER.map((entry) => (
                <tr key={entry.slotId} className="border-b border-[#0E3B2E]/5">
                  <td className="whitespace-nowrap font-[family-name:var(--font-utility)] text-xs text-[#0E3B2E] py-2 pr-4">
                    {entry.slotId}
                  </td>
                  <td className="whitespace-nowrap font-[family-name:var(--font-body)] text-sm text-[#0E3B2E] py-2 pr-4">
                    {entry.proposedCategory}
                  </td>
                  <td className="whitespace-nowrap font-[family-name:var(--font-utility)] text-xs text-[#0E3B2E]/70 py-2 pr-4">
                    {entry.reviewStatus}
                  </td>
                  <td className="whitespace-nowrap font-[family-name:var(--font-body)] text-xs text-[#0E3B2E]/60 py-2">
                    {entry.internalNote ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="summary-heading" className="mb-10">
        <h2
          id="summary-heading"
          className="font-[family-name:var(--font-utility)] text-sm font-medium text-[#0E3B2E] mb-3"
        >
          Summary
        </h2>
        <p className="font-[family-name:var(--font-body)] text-xs text-[#0E3B2E]/60 mb-4">
          Reads every dhikrItem/dhikrCategory document regardless of reviewStatus, via
          dhikr-fetch.ts. This path applies no eligibility filter and must never be reused by a
          public route. {categories.length} categor{categories.length === 1 ? "y" : "ies"} in Sanity.
        </p>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {([
            ["Total", summary.total],
            ["Sourced", summary.sourced],
            ["Scholarly Review", summary.scholarlyReview],
            ["Editorial Review", summary.editorialReview],
            ["Approved", summary.approved],
            ["Published", summary.published],
            ["Canonically eligible", summary.canonicallyEligible],
            ["Incomplete", summary.incomplete],
          ] as const).map(([label, value]) => (
            <div key={label} className="border border-[#0E3B2E]/10 p-4">
              <dt className="font-[family-name:var(--font-utility)] text-xs text-[#0E3B2E]/60">{label}</dt>
              <dd className="font-[family-name:var(--font-display)] text-2xl font-light text-[#0E3B2E] mt-1">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="live-review-heading">
        <h2
          id="live-review-heading"
          className="font-[family-name:var(--font-utility)] text-sm font-medium text-[#0E3B2E] mb-3"
        >
          Live Sanity Records ({liveItems.length} total, {filteredItems.length} shown)
        </h2>

        <nav aria-label="Filter by review status" className="flex flex-wrap gap-2 mb-6">
          {FILTER_OPTIONS.map((option) => (
            <a
              key={option.value}
              href={option.value === "all" ? "/dhikr-review" : `/dhikr-review?status=${option.value}`}
              aria-current={activeFilter === option.value ? "true" : undefined}
              className={
                "px-3 py-1 text-xs font-[family-name:var(--font-utility)] uppercase tracking-wide border " +
                (activeFilter === option.value
                  ? "border-[#0E3B2E] bg-[#0E3B2E] text-white"
                  : "border-[#0E3B2E]/20 text-[#0E3B2E]/70")
              }
            >
              {option.label}
            </a>
          ))}
        </nav>

        {filteredItems.length === 0 && (
          <p className="font-[family-name:var(--font-body)] text-xs text-[#0E3B2E]/50 mt-4">
            {detailItems.length === 0
              ? "No dhikrItem documents exist in Sanity yet — expected while no real content has been sourced. Content sourcing is a separate, scholarly-led phase (see docs/dhikr/19-implementation-roadmap.md)."
              : "No items match this filter."}
          </p>
        )}

        <ul className="space-y-10">
          {filteredItems.map((item) => {
            const conditions = getDhikrEligibilityConditions(item);
            const eligible = isDhikrItemPubliclyEligible(item);
            const scholarlyApprovals = item.boardApprovals.filter((a) => a.board === "scholarly");
            const editorialApprovals = item.boardApprovals.filter((a) => a.board === "editorial");
            const hasApprovedScholarly = scholarlyApprovals.some((a) => a.approved === true);
            const categoryLabel = item.categoryNameEn
              ? `${item.categoryNameEn}${item.categoryNameDa ? ` / ${item.categoryNameDa}` : ""}`
              : undefined;

            return (
              <li key={item._id} className="border border-[#0E3B2E]/15 p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-light text-[#0E3B2E]">
                    {item.titleEn}
                  </h3>
                  <span className="font-[family-name:var(--font-utility)] text-xs uppercase tracking-widest text-[#0E3B2E]/60">
                    {REVIEW_STATUS_LABELS[item.reviewStatus] ?? item.reviewStatus}
                  </span>
                </div>

                {/* ── Identity ── */}
                <section aria-labelledby={`identity-${item._id}`} className="mb-6">
                  <h4 id={`identity-${item._id}`} className={subHeading}>Identity</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <Field label="English title">{item.titleEn}</Field>
                    <Field label="Danish title">{item.titleDa || <EmptyField>Not provided</EmptyField>}</Field>
                    <Field label="Slug">{item.slug || <EmptyField>Not provided</EmptyField>}</Field>
                    <Field label="Category">{categoryLabel || <EmptyField>Not provided</EmptyField>}</Field>
                    <Field label="Order">{item.order ?? <EmptyField>Not provided</EmptyField>}</Field>
                    <Field label="Tags">{item.tags && item.tags.length > 0 ? item.tags.join(", ") : <EmptyField>Not provided</EmptyField>}</Field>
                    <Field label="Last updated">{formatUpdatedAt(item._updatedAt)}</Field>
                    <Field label="Review status">{REVIEW_STATUS_LABELS[item.reviewStatus] ?? item.reviewStatus}</Field>
                  </div>
                </section>

                {/* ── Arabic and translations ── */}
                <section aria-labelledby={`arabic-${item._id}`} className="mb-6">
                  <h4 id={`arabic-${item._id}`} className={subHeading}>Arabic and Translations</h4>
                  <div className="space-y-4">
                    <Field label="Arabic text">
                      {item.arabicText ? (
                        <p dir="rtl" lang="ar" className="text-xl leading-loose">{item.arabicText}</p>
                      ) : (
                        <EmptyField>Not entered</EmptyField>
                      )}
                    </Field>
                    <Field label="Transliteration">{item.transliteration || <EmptyField>Not provided</EmptyField>}</Field>
                    <Field label="English translation">{item.translationEn || <EmptyField>Not entered</EmptyField>}</Field>
                    <Field label="Danish translation">{item.translationDa || <EmptyField>Not entered</EmptyField>}</Field>
                  </div>
                </section>

                {/* ── Repetition and audio ── */}
                <section aria-labelledby={`repetition-${item._id}`} className="mb-6">
                  <h4 id={`repetition-${item._id}`} className={subHeading}>Repetition and Audio</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Recommended repetitions">
                      {item.recommendedRepetitions != null ? (
                        <span>
                          {item.recommendedRepetitions} —{" "}
                          {hasApprovedScholarly
                            ? "entered guidance (scholarly-reviewed)"
                            : "entered guidance, pending source verification"}
                        </span>
                      ) : (
                        <EmptyField>Not provided</EmptyField>
                      )}
                    </Field>
                    <Field label="Audio">
                      {item.hasAudioAsset ? (
                        <span>Linked — {item.audioAssetTitle || "untitled asset"}</span>
                      ) : (
                        <EmptyField>Not provided</EmptyField>
                      )}
                    </Field>
                  </div>
                </section>

                {/* ── Sources ── */}
                <section aria-labelledby={`sources-${item._id}`} className="mb-6">
                  <h4 id={`sources-${item._id}`} className={subHeading}>
                    Sources ({item.sourceReferences.length})
                  </h4>
                  {item.sourceReferences.length === 0 ? (
                    <EmptyField>Not entered</EmptyField>
                  ) : (
                    <ul className="space-y-3">
                      {item.sourceReferences.map((source, i) => (
                        <li key={i} className="border border-[#0E3B2E]/10 p-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <Field label="Type">{source.type || <EmptyField>Not provided</EmptyField>}</Field>
                          <Field label="Citation">{source.citation || <EmptyField>Not provided</EmptyField>}</Field>
                          <Field label="Hadith collection">{source.hadithCollection || <EmptyField>Not provided</EmptyField>}</Field>
                          <Field label="Hadith number">{source.hadithNumber || <EmptyField>Not provided</EmptyField>}</Field>
                          <Field label="Grading">{source.hadithGrading || <EmptyField>Not provided</EmptyField>}</Field>
                          <Field label="Surah : Ayah">
                            {source.surah || source.ayah ? `${source.surah ?? "—"} : ${source.ayah ?? "—"}` : <EmptyField>Not provided</EmptyField>}
                          </Field>
                          <Field label="Source URL">
                            {source.sourceUrl ? (
                              <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                                {source.sourceUrl}
                              </a>
                            ) : (
                              <EmptyField>Not provided</EmptyField>
                            )}
                          </Field>
                          <Field label="Verified status">{source.verifiedStatus || <EmptyField>Not provided</EmptyField>}</Field>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* ── Governance approvals — scholarly and editorial shown separately, though stored in one array ── */}
                <section aria-labelledby={`approvals-${item._id}`} className="mb-6">
                  <h4 id={`approvals-${item._id}`} className={subHeading}>Governance Approvals</h4>
                  <p className="font-[family-name:var(--font-body)] text-xs text-[#0E3B2E]/50 mb-3">
                    Governance records, not public content. Not exposed outside this staff-only route.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="font-[family-name:var(--font-utility)] text-xs font-medium text-[#0E3B2E]/70 mb-2">Scholarly approval</p>
                      {scholarlyApprovals.length === 0 ? (
                        <EmptyField>Awaiting review</EmptyField>
                      ) : (
                        <ul className="space-y-2">
                          {scholarlyApprovals.map((a, i) => (
                            <li key={i} className="border border-[#0E3B2E]/10 p-3 space-y-1">
                              <Field label="Approved">{a.approved ? "Yes" : "No"}</Field>
                              <Field label="Approver">{a.approver || <EmptyField>Not provided</EmptyField>}</Field>
                              <Field label="Date">{a.date || <EmptyField>Not provided</EmptyField>}</Field>
                              <Field label="Notes">{a.notes || <EmptyField>Not provided</EmptyField>}</Field>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-utility)] text-xs font-medium text-[#0E3B2E]/70 mb-2">Editorial approval</p>
                      {editorialApprovals.length === 0 ? (
                        <EmptyField>Awaiting review</EmptyField>
                      ) : (
                        <ul className="space-y-2">
                          {editorialApprovals.map((a, i) => (
                            <li key={i} className="border border-[#0E3B2E]/10 p-3 space-y-1">
                              <Field label="Approved">{a.approved ? "Yes" : "No"}</Field>
                              <Field label="Approver">{a.approver || <EmptyField>Not provided</EmptyField>}</Field>
                              <Field label="Date">{a.date || <EmptyField>Not provided</EmptyField>}</Field>
                              <Field label="Notes">{a.notes || <EmptyField>Not provided</EmptyField>}</Field>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </section>

                {/* ── Canonical readiness — derived from getDhikrEligibilityConditions, never re-implemented ── */}
                <section aria-labelledby={`canonical-${item._id}`} className="mb-6">
                  <h4 id={`canonical-${item._id}`} className={subHeading}>Canonical Readiness</h4>
                  <p className="font-[family-name:var(--font-body)] text-xs text-[#0E3B2E]/50 mb-3">
                    All seven conditions below are required, together, before this item can become
                    publicly visible. Overall: <strong>{eligible ? "Eligible" : "Not eligible"}</strong>.
                  </p>
                  <ul className="space-y-1">
                    {conditions.map((condition) => (
                      <li key={condition.key} className="flex items-center justify-between text-sm border-b border-[#0E3B2E]/5 py-1">
                        <span>{condition.label}</span>
                        <span className={condition.met ? "text-[#166534] font-medium" : "text-[#991B1B] font-medium"}>
                          {condition.met ? "Met" : "Missing"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* ── Advisory checks — separate from the canonical gate ── */}
                <section aria-labelledby={`advisory-${item._id}`}>
                  <h4 id={`advisory-${item._id}`} className={subHeading}>
                    Advisory checks — not part of the canonical public eligibility gate
                  </h4>
                  <ul className="space-y-1">
                    {([
                      ["Slug", !!item.slug],
                      ["Category", !!item.categoryNameEn],
                      ["English title", !!item.titleEn],
                      ["Danish title", !!item.titleDa],
                      ["Transliteration", !!item.transliteration],
                      ["Repetition guidance", item.recommendedRepetitions != null],
                      ["Audio", item.hasAudioAsset],
                    ] as const).map(([label, present]) => (
                      <li key={label} className="flex items-center justify-between text-sm border-b border-[#0E3B2E]/5 py-1">
                        <span>{label}</span>
                        <span className="text-[#0E3B2E]/60">{present ? "Present" : "Recommended"}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
}
