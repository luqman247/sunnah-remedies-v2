/**
 * Duʿa & Dhikr Public Fetch — the ONLY module a public route under
 * src/app/[locale]/ may use to read Duʿa & Dhikr content.
 *
 * Mirrors the discipline of src/sanity/lib/dhikr-public-fetch.ts: uses the
 * public `client` (perspective: "published"), never a preview client, and
 * consumes the queries from ./queries.ts as-is — eligibility is applied
 * inside each query's GROQ filter (./dua-dhikr-publication-gate.ts), never
 * re-filtered or weakened here.
 *
 * The taxonomy (parent groups, collections, subcategories, aliases) is
 * fixed, curated code in src/lib/dua-dhikr/taxonomy.ts — NOT read from
 * Sanity. This means every collection route in the information
 * architecture exists and renders its structural shell (title, icon,
 * subcategory nav, related collections) immediately, even before any
 * Sanity content exists — see docs/dua-dhikr/INFORMATION_ARCHITECTURE.md.
 * A `duaDhikrCollection` Sanity document is optional, per-collection
 * editorial enrichment layered on top of that fixed structure (its own
 * introduction/description copy, gated by reviewStatus/
 * editorialPublicationStatus — see docs/dua-dhikr/REVIEW_BYPASS.md), never
 * a replacement for it.
 *
 * @see docs/dua-dhikr/CONTENT_MODEL.md
 * @see docs/dua-dhikr/REVIEW_BYPASS.md
 */

import { client } from "./client";
import {
  duaDhikrEntriesPublicEligibleQuery,
  duaDhikrEntriesEditoriallyPublicEligibleQuery,
  duaDhikrEntriesOwnerApprovedEnglishEligibleQuery,
  duaDhikrCollectionsQuery,
} from "./queries";
import type { AppLocale } from "@/i18n/locales";
import {
  CANONICAL_COLLECTIONS,
  getCanonicalCollection,
  type CanonicalCollection,
} from "@/lib/dua-dhikr/taxonomy";
import {
  resolveDuaDhikrCollectionPublicationState,
  type DuaDhikrCollectionPublicationState,
} from "@/lib/dua-dhikr/publication-status";
import {
  getEveningDhikrItemsPublic,
  getMorningDhikrItemsPublic,
} from "./dhikr-public-fetch";

export interface DuaDhikrSourceReferencePublic {
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

export interface DuaDhikrEntryCollectionRef {
  slug: string;
  titleEn: string;
  titleDa?: string;
}

/** Public-safe shape of a publicly eligible duaDhikrEntry. Contains no reviewStatus, boardApprovals, editorialNotes, or import metadata. */
export interface DuaDhikrEntryPublic {
  _id: string;
  slug?: string;
  titleEn: string;
  titleDa?: string;
  order?: number;
  featured?: boolean;
  whatItIsFor?: string;
  occasion?: string[];
  searchAliases?: string[];
  arabicText: string;
  transliteration?: string;
  translationEn: string;
  translationDa: string;
  recommendedRepetitions?: number;
  timingLabel?: string;
  instructionText?: string;
  virtueText?: string;
  explanationText?: string;
  authenticationNote?: string;
  subcategorySlugs?: string[];
  collections: DuaDhikrEntryCollectionRef[];
  sourceReferences: DuaDhikrSourceReferencePublic[];
  audioAssetUrl?: string;
  hasAudioAsset?: boolean;
  /**
   * Which publication pathway made this entry publicly visible.
   * "scholarly-approved": passed the full canonical eligibility gate.
   * "editorial-pending-scholarly-review": passed only the temporary
   * editorial bypass — NOT scholarly-verified.
   * "owner-approved-english-first": content-owner approved, accepted as
   * pre-verified, independent re-verification waived — NOT scholarly
   * reviewed, NEVER Danish-eligible.
   * Any UI rendering an entry via either of the two non-canonical pathways
   * must show a neutral "scholarly review pending" / "owner-approved,
   * pre-verified" note — never a claim of scholarly approval.
   */
  publicationPathway: "scholarly-approved" | "editorial-pending-scholarly-review" | "owner-approved-english-first";
}

async function safeFetchList<T>(query: string): Promise<T[]> {
  try {
    const result = await client.fetch<T[]>(query);
    return result ?? [];
  } catch {
    return [];
  }
}

/** Every publicly eligible entry via the canonical, scholarly-approved pathway. */
export async function getDuaDhikrEntriesPublic(): Promise<DuaDhikrEntryPublic[]> {
  const result = await safeFetchList<Omit<DuaDhikrEntryPublic, "publicationPathway">>(
    duaDhikrEntriesPublicEligibleQuery,
  );
  return result.map((item) => ({ ...item, publicationPathway: "scholarly-approved" as const }));
}

/** Every publicly eligible entry via the SEPARATE, temporary editorial-bypass pathway — see docs/dua-dhikr/REVIEW_BYPASS.md. */
export async function getEditoriallyPublishedDuaDhikrEntriesPublic(): Promise<DuaDhikrEntryPublic[]> {
  const result = await safeFetchList<Omit<DuaDhikrEntryPublic, "publicationPathway">>(
    duaDhikrEntriesEditoriallyPublicEligibleQuery,
  );
  return result.map((item) => ({ ...item, publicationPathway: "editorial-pending-scholarly-review" as const }));
}

/**
 * Every publicly eligible entry via the THIRD, separate, additive
 * owner-approved-English-first pathway — never Danish-eligible, never a
 * scholarly-approval claim. See dua-dhikr-publication-gate.ts.
 */
export async function getOwnerApprovedEnglishDuaDhikrEntriesPublic(): Promise<DuaDhikrEntryPublic[]> {
  const result = await safeFetchList<Omit<DuaDhikrEntryPublic, "publicationPathway">>(
    duaDhikrEntriesOwnerApprovedEnglishEligibleQuery,
  );
  return result.map((item) => ({ ...item, publicationPathway: "owner-approved-english-first" as const }));
}

/**
 * Every publicly eligible entry for the given locale, merged and re-sorted
 * by `order`. English (`locale === "en"`, the default) includes all three
 * pathways; Danish includes only the two pathways that hard-require
 * translationDa — the owner-approved-English-first pathway can never
 * surface as Danish content under any circumstance. There is no ambiguous
 * fallback locale: every caller must pass one explicitly, or accept the
 * "en" default deliberately.
 */
export async function getAllPublicDuaDhikrEntries(locale: AppLocale = "en"): Promise<DuaDhikrEntryPublic[]> {
  if (locale === "da") {
    const [scholarly, editorial] = await Promise.all([
      getDuaDhikrEntriesPublic(),
      getEditoriallyPublishedDuaDhikrEntriesPublic(),
    ]);
    return [...scholarly, ...editorial].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
  const [scholarly, editorial, ownerApprovedEnglish] = await Promise.all([
    getDuaDhikrEntriesPublic(),
    getEditoriallyPublishedDuaDhikrEntriesPublic(),
    getOwnerApprovedEnglishDuaDhikrEntriesPublic(),
  ]);
  return [...scholarly, ...editorial, ...ownerApprovedEnglish].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

interface DuaDhikrCollectionDoc {
  _id: string;
  slug?: string;
  titleEn: string;
  titleDa?: string;
  parentGroup: string;
  order?: number;
  featured?: boolean;
  iconKey?: string;
  visualMotifKey?: string;
  descriptionEn?: string;
  descriptionDa?: string;
  introductionEn?: string;
  introductionDa?: string;
  whenReadEn?: string;
  whenReadDa?: string;
  searchAliases?: string[];
  subcategories?: { slug: string; titleEn: string; titleDa?: string }[];
  relatedCollections?: { slug: string; titleEn: string; titleDa?: string; iconKey?: string }[];
  reviewStatus?: string;
  editorialPublicationStatus?: string;
}

/** Whether a duaDhikrCollection document's own editorial copy (introduction/whenRead) may be shown publicly — see docs/dua-dhikr/REVIEW_BYPASS.md. */
function isCollectionCopyEligible(doc: Pick<DuaDhikrCollectionDoc, "reviewStatus" | "editorialPublicationStatus">): boolean {
  return doc.reviewStatus === "published" || doc.editorialPublicationStatus === "editorial-only-scholarly-review-pending";
}

async function getDuaDhikrCollectionDocsBySlug(): Promise<Map<string, DuaDhikrCollectionDoc>> {
  const docs = await safeFetchList<DuaDhikrCollectionDoc>(duaDhikrCollectionsQuery);
  const bySlug = new Map<string, DuaDhikrCollectionDoc>();
  for (const doc of docs) {
    if (doc.slug) bySlug.set(doc.slug, doc);
  }
  return bySlug;
}

export interface DuaDhikrCollectionPublic extends CanonicalCollection {
  /** Reviewed editorial copy, only present once eligible — see isCollectionCopyEligible. */
  introductionEn?: string;
  introductionDa?: string;
  whenReadEn?: string;
  whenReadDa?: string;
  /** Whether the collection has any editorial enrichment pending review, for a neutral "pending" note. */
  hasPendingUnreviewedCopy: boolean;
  entryCount: number;
  /**
   * Authoritative public projection state for navigation/search/sitemaps.
   * Derived only from gate-passed public entry counts — never from taxonomy
   * structure or Arabic text alone. See publication-status.ts.
   */
  publicationState: DuaDhikrCollectionPublicationState;
}

/**
 * Every canonical collection (from src/lib/dua-dhikr/taxonomy.ts) enriched
 * with entry counts, publication state, and any eligible editorial copy.
 *
 * Publication state is the single public navigation source of truth:
 *   - morning-dhikr / evening-dhikr → Morning/Evening Dhikr public gates
 *   - all other slugs → Duʿa & Dhikr public entry gates
 * Taxonomy structure alone never marks a collection published.
 */
export async function getDuaDhikrCollectionsPublic(locale: AppLocale = "en"): Promise<DuaDhikrCollectionPublic[]> {
  const [entries, docsBySlug, morningItems, eveningItems] = await Promise.all([
    getAllPublicDuaDhikrEntries(locale),
    getDuaDhikrCollectionDocsBySlug(),
    getMorningDhikrItemsPublic(),
    getEveningDhikrItemsPublic(),
  ]);

  const countBySlug = new Map<string, number>();
  for (const entry of entries) {
    for (const ref of entry.collections) {
      countBySlug.set(ref.slug, (countBySlug.get(ref.slug) ?? 0) + 1);
    }
  }

  // Authoritative SoT for Morning/Evening: dhikr publication pathways, not
  // duaDhikrEntry counts (those collections redirect to /knowledge/dhikr/*).
  countBySlug.set("morning-dhikr", morningItems.length);
  countBySlug.set("evening-dhikr", eveningItems.length);

  return CANONICAL_COLLECTIONS.map((collection) => {
    const doc = docsBySlug.get(collection.slug);
    const copyEligible = doc ? isCollectionCopyEligible(doc) : false;
    const entryCount = countBySlug.get(collection.slug) ?? 0;
    return {
      ...collection,
      // Prefer CMS structural card copy when present; otherwise keep taxonomy Danish.
      descriptionDa: doc?.descriptionDa ?? collection.descriptionDa,
      introductionEn: copyEligible ? doc?.introductionEn : undefined,
      introductionDa: copyEligible ? doc?.introductionDa : undefined,
      whenReadEn: copyEligible ? doc?.whenReadEn : undefined,
      whenReadDa: copyEligible ? doc?.whenReadDa : undefined,
      hasPendingUnreviewedCopy: !!doc?.introductionEn && !copyEligible,
      entryCount,
      publicationState: resolveDuaDhikrCollectionPublicationState(entryCount),
    };
  });
}

export async function getDuaDhikrCollectionPublic(slug: string, locale: AppLocale = "en"): Promise<DuaDhikrCollectionPublic | undefined> {
  const collections = await getDuaDhikrCollectionsPublic(locale);
  return collections.find((c) => c.slug === slug);
}

/** Every publicly eligible entry belonging to a given canonical collection slug (by collection reference, not subcategory), for the given locale. */
export async function getDuaDhikrEntriesForCollection(slug: string, locale: AppLocale = "en"): Promise<DuaDhikrEntryPublic[]> {
  const entries = await getAllPublicDuaDhikrEntries(locale);
  return entries.filter((entry) => entry.collections.some((c) => c.slug === slug));
}

/** Convenience: whether a canonical collection slug is known at all (used for generateStaticParams / notFound guards). */
export function isKnownDuaDhikrCollectionSlug(slug: string): boolean {
  return !!getCanonicalCollection(slug);
}
