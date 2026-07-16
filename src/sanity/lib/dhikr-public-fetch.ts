/**
 * Dhikr Public Fetch — the ONLY module a public route under
 * src/app/[locale]/ may use to read Dhikr content.
 *
 * Uses the public `client` (perspective: "published"), never
 * `previewClient`. Consumes `dhikrItemsPublicEligibleQuery` from
 * ./queries.ts as-is — the eligibility condition is applied inside that
 * query's GROQ filter (it interpolates the canonical
 * DHIKR_ELIGIBILITY_GROQ fragment from ./dhikr-publication-gate.ts), not
 * re-implemented or re-filtered here. This module does not define, weaken,
 * or duplicate the publication gate.
 *
 * This module must never import:
 *   - ./dhikr-fetch.ts (staff-only; internal preview; DHIKR_V1_PLACEHOLDER_REGISTER)
 *   - ./client's previewClient export
 *   - anything from src/app/(staff)/
 *
 * Category visibility: there is no public query against the dhikrCategory
 * document type. A category is only ever public by virtue of at least one
 * dhikrItem passing the eligibility gate and referencing it — see
 * getDhikrCategoriesPublic below, which derives categories purely by
 * grouping getDhikrItemsPublic()'s results. Empty, draft-only, or
 * review-only categories are structurally unreachable through this module.
 *
 * Item-detail routes remain deferred (see docs/dhikr/19-implementation-
 * roadmap.md, docs/dhikr/21-decision-log.md) — this module is intentionally
 * usable for a landing view and a category index only. Its projection
 * includes reader-content fields (arabicText, transliteration,
 * translationEn/Da, sourceReferences) in preparation for that future reader
 * view, but no route consumes those fields yet.
 *
 * This module deliberately does not use safeFetch() from ./fetch.ts:
 * safeFetch merges a `language` query parameter and falls back across
 * locales, a pattern built for one-document-per-language content types.
 * Dhikr uses dual EN/DA fields on a single document (ADR-009,
 * docs/dhikr/21-decision-log.md), so locale selection is the caller's
 * responsibility (choose *En vs *Da per field), not the query's.
 *
 * @see docs/dhikr/03-authenticity-and-scholarly-review-policy.md
 * @see docs/dhikr/12-sanity-integration-plan.md
 * @see docs/dhikr/20-risk-register.md (R-01)
 */

import { client } from "./client";
import { dhikrItemsPublicEligibleQuery } from "./queries";

/** Reader-safe projection of the sourceReference object — see queries.ts for field-by-field rationale. */
export interface DhikrSourceReferencePublic {
  type: string;
  citation: string;
  hadithCollection?: string;
  hadithNumber?: string;
  hadithGrading?: string;
  surah?: string;
  ayah?: string;
  sourceUrl?: string;
  verifiedStatus?: string;
}

/**
 * Public-safe shape of a publicly eligible dhikrItem. Contains no
 * reviewStatus, boardApprovals, reviewer identity, internal note, or
 * workflow timestamp — see dhikrItemsPublicEligibleQuery in ./queries.ts.
 */
export interface DhikrItemPublic {
  _id: string;
  /** Stable research-register identifier (e.g. "MDR-006"), for traceability only — not rendered as reviewer/workflow metadata. */
  mdrSourceId?: string;
  slug?: string;
  titleEn: string;
  titleDa?: string;
  order?: number;
  arabicText: string;
  transliteration?: string;
  translationEn: string;
  translationDa: string;
  recommendedRepetitions?: number;
  /** Approved timing category — "morning-only" | "evening-only" | "morning-and-evening" | "not-time-specific". */
  timingLabel?: string;
  /** Approved virtue/reward text. Absent for most items — see docs/dhikr/40-scholarly-review-and-adjudication-framework.md, §H. */
  virtueText?: string;
  categoryName?: string;
  categoryNameDa?: string;
  categorySlug?: string;
  sourceReferences: DhikrSourceReferencePublic[];
}

/**
 * Every publicly eligible Dhikr item, ordered by `order asc`. Returns an
 * empty array (not an error) when zero items are eligible — this is the
 * expected state for the empty-state UI, not a failure mode.
 */
export async function getDhikrItemsPublic(): Promise<DhikrItemPublic[]> {
  try {
    const result = await client.fetch<DhikrItemPublic[]>(dhikrItemsPublicEligibleQuery);
    return result ?? [];
  } catch {
    return [];
  }
}

/** Timing labels that qualify an item for the Morning Dhikr page. */
const MORNING_TIMING_LABELS = new Set(["morning-only", "morning-and-evening"]);

/**
 * Every publicly eligible Dhikr item whose approved timingLabel qualifies it
 * for the Morning Dhikr page — a further, additive filter on top of
 * getDhikrItemsPublic()'s canonical eligibility gate, never a replacement
 * for it. An item with no timingLabel set is excluded (not assumed morning).
 */
export async function getMorningDhikrItemsPublic(): Promise<DhikrItemPublic[]> {
  const items = await getDhikrItemsPublic();
  return items.filter((item) => item.timingLabel !== undefined && MORNING_TIMING_LABELS.has(item.timingLabel));
}

export interface DhikrCategoryPublic {
  name: string;
  nameDa?: string;
  slug: string;
  items: DhikrItemPublic[];
}

/**
 * Publicly visible Dhikr categories, derived exclusively from
 * getDhikrItemsPublic() — never a direct dhikrCategory query. A category
 * with zero eligible items simply never appears; there is no "empty
 * category" public record. Items whose category has no slug set are
 * excluded from every category's list (that category is not yet publicly
 * addressable), but are still returned by getDhikrItemsPublic() itself.
 */
export async function getDhikrCategoriesPublic(): Promise<DhikrCategoryPublic[]> {
  const items = await getDhikrItemsPublic();
  const bySlug = new Map<string, DhikrCategoryPublic>();

  for (const item of items) {
    if (!item.categorySlug) continue;
    const existing = bySlug.get(item.categorySlug);
    if (existing) {
      existing.items.push(item);
      continue;
    }
    bySlug.set(item.categorySlug, {
      name: item.categoryName ?? "",
      nameDa: item.categoryNameDa,
      slug: item.categorySlug,
      items: [item],
    });
  }

  return Array.from(bySlug.values());
}
