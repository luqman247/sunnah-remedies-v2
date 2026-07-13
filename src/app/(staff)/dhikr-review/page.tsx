import type { Metadata } from "next";
import {
  getDhikrCategoriesInternalPreview,
  getDhikrItemsInternalPreview,
  DHIKR_V1_PLACEHOLDER_REGISTER,
} from "@/sanity/lib/dhikr-fetch";

export const metadata: Metadata = {
  title: "Dhikr — Internal Review",
  robots: { index: false, follow: false },
};

/**
 * Dhikr internal review prototype — Phase 2 milestone.
 *
 * Staff-only (see middleware.ts), absent from public/main navigation.
 * Renders placeholder IDs and workflow states only — no Arabic text,
 * transliteration, translation, source citation, grading, reward claim,
 * or repetition count exists anywhere in this page or its data sources.
 *
 * @see docs/dhikr/README.md
 * @see docs/dhikr/18-v1-content-register.md
 */
export default async function DhikrReviewPage() {
  const [categories, liveItems] = await Promise.all([
    getDhikrCategoriesInternalPreview(),
    getDhikrItemsInternalPreview(),
  ]);

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
          Prototype for the Daily Dhikr schema and publication gate. Nothing on
          this page is Islamic content — every entry below is a placeholder
          identifier and workflow status only. Not for public review,
          distribution, or use as a religious reference.
        </p>
      </div>

      <header className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-light text-[#0E3B2E] mb-2">
          Dhikr — Schema &amp; Publication Gate Review
        </h1>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#0E3B2E]/70 leading-relaxed max-w-2xl">
          Phase 2 prototype. See docs/dhikr/ for the full architecture pack.
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
        {/* Horizontally scrollable on narrow viewports so cells never wrap
            onto multiple lines — the table itself keeps its natural width
            and scrolls within this wrapper, rather than the whole page. */}
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

      <section aria-labelledby="live-preview-heading">
        <h2
          id="live-preview-heading"
          className="font-[family-name:var(--font-utility)] text-sm font-medium text-[#0E3B2E] mb-3"
        >
          Live Sanity Preview (internal, ungated)
        </h2>
        <p className="font-[family-name:var(--font-body)] text-xs text-[#0E3B2E]/60 mb-4">
          Reads every dhikrItem/dhikrCategory document regardless of
          reviewStatus, via dhikr-fetch.ts. This path applies no eligibility
          filter and must never be reused by a public route.
        </p>
        <dl className="grid grid-cols-2 gap-4 max-w-md">
          <div className="border border-[#0E3B2E]/10 p-4">
            <dt className="font-[family-name:var(--font-utility)] text-xs text-[#0E3B2E]/60">
              Categories in Sanity
            </dt>
            <dd className="font-[family-name:var(--font-display)] text-2xl font-light text-[#0E3B2E] mt-1">
              {categories.length}
            </dd>
          </div>
          <div className="border border-[#0E3B2E]/10 p-4">
            <dt className="font-[family-name:var(--font-utility)] text-xs text-[#0E3B2E]/60">
              Items in Sanity (any status)
            </dt>
            <dd className="font-[family-name:var(--font-display)] text-2xl font-light text-[#0E3B2E] mt-1">
              {liveItems.length}
            </dd>
          </div>
        </dl>
        {liveItems.length === 0 && (
          <p className="font-[family-name:var(--font-body)] text-xs text-[#0E3B2E]/50 mt-4">
            No dhikrItem documents exist in Sanity yet — expected for this
            schema-scaffolding phase. Content sourcing is a separate,
            scholarly-led phase (see docs/dhikr/19-implementation-roadmap.md,
            Phase 2).
          </p>
        )}
      </section>
    </article>
  );
}
