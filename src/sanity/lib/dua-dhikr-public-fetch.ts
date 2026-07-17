/**
 * Duʿā & Dhikr Public Fetch — the ONLY module a public route under
 * src/app/[locale]/ may use to read Duʿā & Dhikr content.
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
  duaDhikrCollectionsQuery,
} from "./queries";
import {
  CANONICAL_COLLECTIONS,
  getCanonicalCollection,
  type CanonicalCollection,
} from "@/lib/dua-dhikr/taxonomy";

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
   * editorial bypass — NOT scholarly-verified. Any UI rendering an entry
   * with this pathway must show a "scholarly review pending" note.
   */
  publicationPathway: "scholarly-approved" | "editorial-pending-scholarly-review";
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

/** Every publicly eligible entry from EITHER pathway, merged and re-sorted by `order`. */
export async function getAllPublicDuaDhikrEntries(): Promise<DuaDhikrEntryPublic[]> {
  const [scholarly, editorial] = await Promise.all([
    getDuaDhikrEntriesPublic(),
    getEditoriallyPublishedDuaDhikrEntriesPublic(),
  ]);
  return [...scholarly, ...editorial].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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
}

/**
 * Every canonical collection (from src/lib/dua-dhikr/taxonomy.ts — always
 * the full fixed list, never gated by Sanity content existing) enriched
 * with entry counts and any eligible editorial copy. Safe to render
 * immediately, before any Sanity content exists.
 */
export async function getDuaDhikrCollectionsPublic(): Promise<DuaDhikrCollectionPublic[]> {
  const [entries, docsBySlug] = await Promise.all([
    getAllPublicDuaDhikrEntries(),
    getDuaDhikrCollectionDocsBySlug(),
  ]);

  const countBySlug = new Map<string, number>();
  for (const entry of entries) {
    for (const ref of entry.collections) {
      countBySlug.set(ref.slug, (countBySlug.get(ref.slug) ?? 0) + 1);
    }
  }

  return CANONICAL_COLLECTIONS.map((collection) => {
    const doc = docsBySlug.get(collection.slug);
    const copyEligible = doc ? isCollectionCopyEligible(doc) : false;
    return {
      ...collection,
      // descriptionDa is structural card copy (mirrors dhikrCategory.description,
      // which has no reviewStatus gate of its own) — not subject to the
      // introduction/whenRead copy-eligibility gate below.
      descriptionDa: doc?.descriptionDa,
      introductionEn: copyEligible ? doc?.introductionEn : undefined,
      introductionDa: copyEligible ? doc?.introductionDa : undefined,
      whenReadEn: copyEligible ? doc?.whenReadEn : undefined,
      whenReadDa: copyEligible ? doc?.whenReadDa : undefined,
      hasPendingUnreviewedCopy: !!doc?.introductionEn && !copyEligible,
      entryCount: countBySlug.get(collection.slug) ?? 0,
    };
  });
}

export async function getDuaDhikrCollectionPublic(slug: string): Promise<DuaDhikrCollectionPublic | undefined> {
  const collections = await getDuaDhikrCollectionsPublic();
  return collections.find((c) => c.slug === slug);
}

/** Every publicly eligible entry belonging to a given canonical collection slug (by collection reference, not subcategory). */
export async function getDuaDhikrEntriesForCollection(slug: string): Promise<DuaDhikrEntryPublic[]> {
  const entries = await getAllPublicDuaDhikrEntries();
  return entries.filter((entry) => entry.collections.some((c) => c.slug === slug));
}

/** Convenience: whether a canonical collection slug is known at all (used for generateStaticParams / notFound guards). */
export function isKnownDuaDhikrCollectionSlug(slug: string): boolean {
  return !!getCanonicalCollection(slug);
}
