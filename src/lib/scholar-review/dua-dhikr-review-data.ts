/**
 * "Scholar Review" portal — Duʿā & Dhikr read layer. Reads ONLY from
 * `staging` (via staging-client.ts's hard guard). Never used by the public
 * site — this is a separate, parallel read path specifically for the
 * review portal, which needs fields (reviewStatus, boardApprovals,
 * editorialNotes) the public site's projections deliberately exclude.
 */

import { stagingFetch } from "./staging-client";

export interface ReviewSourceReference {
  type?: string;
  citation?: string;
  hadithCollection?: string;
  hadithNumber?: number;
  hadithGrading?: string;
  surah?: number;
  ayah?: number;
  sourceUrl?: string;
  verifiedStatus?: string;
}

export interface ReviewDuaDhikrEntrySummary {
  _id: string;
  titleEn: string;
  titleDa?: string;
  slug?: string;
  collections: { _id: string; titleEn: string; slug?: string }[];
  reviewStatus?: string;
  editorialPublicationStatus?: string;
  hasArabic: boolean;
  hasTranslationEn: boolean;
  hasTranslationDa: boolean;
  sourceCount: number;
  hasGrading: boolean;
  hasPlaceholderCitation: boolean;
  hasVirtueText: boolean;
}

export interface ReviewDuaDhikrEntryFull extends ReviewDuaDhikrEntrySummary {
  arabicText?: string;
  transliteration?: string;
  translationEn?: string;
  translationDa?: string;
  whatItIsFor?: string;
  occasion?: string[];
  virtueText?: string;
  explanationText?: string;
  authenticationNote?: string;
  sourceReferences: ReviewSourceReference[];
  relatedEntries: { _id: string; titleEn: string }[];
  editorialNotes?: string;
  importIdentifier?: string;
}

const ENTRY_LIST_PROJECTION = `
  _id,
  titleEn,
  titleDa,
  "slug": slug.current,
  "collections": coalesce(collections[]->{ _id, titleEn, "slug": slug.current }, []),
  reviewStatus,
  editorialPublicationStatus,
  "hasArabic": length(arabicText) > 0,
  "hasTranslationEn": length(translationEn) > 0,
  "hasTranslationDa": length(translationDa) > 0,
  "sourceCount": count(sourceReferences),
  "hasGrading": count(sourceReferences[defined(hadithGrading)]) > 0,
  "hasPlaceholderCitation": count(sourceReferences[citation match "*Virtue text*" || citation match "*No source reference*"]) > 0,
  "hasVirtueText": length(virtueText) > 0
`;

export async function listDuaDhikrEntriesForReview(): Promise<ReviewDuaDhikrEntrySummary[]> {
  return stagingFetch<ReviewDuaDhikrEntrySummary[]>(`*[_type == "duaDhikrEntry"] | order(titleEn asc) { ${ENTRY_LIST_PROJECTION} }`);
}

export async function getDuaDhikrEntryForReview(id: string): Promise<ReviewDuaDhikrEntryFull | null> {
  return stagingFetch<ReviewDuaDhikrEntryFull | null>(
    `*[_type == "duaDhikrEntry" && _id == $id][0] {
      ${ENTRY_LIST_PROJECTION},
      arabicText,
      transliteration,
      translationEn,
      translationDa,
      whatItIsFor,
      occasion,
      virtueText,
      explanationText,
      authenticationNote,
      "sourceReferences": coalesce(sourceReferences[]{ type, citation, hadithCollection, hadithNumber, hadithGrading, surah, ayah, sourceUrl, verifiedStatus }, []),
      "relatedEntries": coalesce(relatedEntries[]->{ _id, titleEn }, []),
      editorialNotes,
      importIdentifier
    }`,
    { id },
  );
}

/**
 * Suspected duplicates — entries sharing identical arabicText, grouped.
 * Always includes the known lwa-215/lwa-378 case; also surfaces any other
 * exact-text matches found in the live staging data (a straightforward,
 * honest heuristic — not a fuzzy-matching algorithm).
 */
export interface DuplicateGroup {
  arabicText: string;
  entries: { _id: string; titleEn: string }[];
}

export async function findSuspectedDuplicateEntries(): Promise<DuplicateGroup[]> {
  const rows = await stagingFetch<{ arabicText: string; _id: string; titleEn: string }[]>(
    `*[_type == "duaDhikrEntry" && length(arabicText) > 0]{ _id, titleEn, arabicText }`,
  );
  const byText = new Map<string, { _id: string; titleEn: string }[]>();
  for (const row of rows) {
    const key = row.arabicText.trim();
    const list = byText.get(key) ?? [];
    list.push({ _id: row._id, titleEn: row.titleEn });
    byText.set(key, list);
  }
  return [...byText.entries()]
    .filter(([, entries]) => entries.length > 1)
    .map(([arabicText, entries]) => ({ arabicText, entries }));
}

export interface ReviewDuaDhikrCollectionSummary {
  _id: string;
  titleEn: string;
  titleDa?: string;
  slug: string;
  parentGroup?: string;
  order?: number;
  iconKey?: string;
  descriptionEn?: string;
  descriptionDa?: string;
  introductionEn?: string;
  introductionDa?: string;
  seo?: { metaTitle?: string; metaDescription?: string } | null;
  reviewStatus?: string;
  entryCount: number;
}

export async function listDuaDhikrCollectionsForReview(): Promise<ReviewDuaDhikrCollectionSummary[]> {
  return stagingFetch<ReviewDuaDhikrCollectionSummary[]>(
    `*[_type == "duaDhikrCollection"] | order(order asc) {
      _id, titleEn, titleDa, "slug": slug.current, parentGroup, order, iconKey,
      descriptionEn, descriptionDa, introductionEn, introductionDa,
      seo { metaTitle, metaDescription },
      reviewStatus,
      "entryCount": count(*[_type == "duaDhikrEntry" && references(^._id)])
    }`,
  );
}

export async function getDuaDhikrCollectionForReview(id: string): Promise<(ReviewDuaDhikrCollectionSummary & { entries: { _id: string; titleEn: string }[] }) | null> {
  return stagingFetch(
    `*[_type == "duaDhikrCollection" && _id == $id][0] {
      _id, titleEn, titleDa, "slug": slug.current, parentGroup, order, iconKey,
      descriptionEn, descriptionDa, introductionEn, introductionDa,
      seo { metaTitle, metaDescription },
      reviewStatus,
      "entryCount": count(*[_type == "duaDhikrEntry" && references(^._id)]),
      "entries": *[_type == "duaDhikrEntry" && references(^._id)] | order(order asc) { _id, titleEn }
    }`,
    { id },
  );
}
