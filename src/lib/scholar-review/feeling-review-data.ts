/**
 * "Scholar Review" portal — "I am feeling…" read layer. Reads ONLY from
 * `staging`. Parallel to (never reusing) src/sanity/lib/feeling-public-fetch.ts,
 * which is gated for public eligibility — this module shows a reviewer
 * EVERYTHING regardless of publication gate status, including deferred and
 * content-blocked states, per docs/i-am-feeling/SPEC.md's review
 * requirements.
 */

import { stagingFetch } from "./staging-client";
import { CANONICAL_FEELING_STATES, FEELING_FAMILIES, type CanonicalFeelingState } from "@/lib/feeling/taxonomy";

export interface ReviewFeaturedEntry {
  entryId: string;
  reflectionEn?: string;
  reflectionDa?: string;
  entry: {
    _id: string;
    titleEn: string;
    arabicText?: string;
    translationEn?: string;
    translationDa?: string;
    reviewStatus?: string;
  } | null;
}

export interface ReviewFeelingState extends CanonicalFeelingState {
  documentId?: string;
  documentExists: boolean;
  introductionEn?: string;
  introductionDa?: string;
  practicalNextStepEn?: string;
  practicalNextStepDa?: string;
  professionalSupportNoteEn?: string;
  professionalSupportNoteDa?: string;
  reviewStatus?: string;
  featuredEntries: ReviewFeaturedEntry[];
  relatedFeelingSlugs: string[];
}

const FEELING_STATE_DOC_PROJECTION = `
  _id,
  "slug": slug.current,
  labelEn,
  labelDa,
  introductionEn,
  introductionDa,
  practicalNextStepEn,
  practicalNextStepDa,
  professionalSupportNoteEn,
  professionalSupportNoteDa,
  reviewStatus,
  "relatedFeelingStates": relatedFeelingStates[]->slug.current,
  "featuredEntries": featuredEntries[]{
    "entryId": entry._ref,
    reflectionEn,
    reflectionDa,
    "entry": entry->{ _id, titleEn, arabicText, translationEn, translationDa, reviewStatus }
  }
`;

/** Every architected state (all 20 — launch, deferred, and content-blocked alike), merged with any staging document. */
export async function listFeelingStatesForReview(): Promise<ReviewFeelingState[]> {
  const docs = await stagingFetch<Record<string, unknown>[]>(`*[_type == "feelingState"]{ ${FEELING_STATE_DOC_PROJECTION} }`);
  const bySlug = new Map(docs.filter((d) => d.slug).map((d) => [d.slug as string, d]));

  return CANONICAL_FEELING_STATES.map((canonical) => {
    const doc = bySlug.get(canonical.slug) as
      | (Record<string, unknown> & { _id: string; featuredEntries?: ReviewFeaturedEntry[]; relatedFeelingStates?: string[] })
      | undefined;
    return {
      ...canonical,
      documentId: doc?._id,
      documentExists: !!doc,
      introductionEn: doc?.introductionEn as string | undefined,
      introductionDa: doc?.introductionDa as string | undefined,
      practicalNextStepEn: doc?.practicalNextStepEn as string | undefined,
      practicalNextStepDa: doc?.practicalNextStepDa as string | undefined,
      professionalSupportNoteEn: doc?.professionalSupportNoteEn as string | undefined,
      professionalSupportNoteDa: doc?.professionalSupportNoteDa as string | undefined,
      reviewStatus: doc?.reviewStatus as string | undefined,
      featuredEntries: doc?.featuredEntries ?? [],
      relatedFeelingSlugs: (doc?.relatedFeelingStates ?? canonical.relatedSlugs) as string[],
    };
  });
}

export async function getFeelingStateForReview(slug: string): Promise<ReviewFeelingState | undefined> {
  const all = await listFeelingStatesForReview();
  return all.find((s) => s.slug === slug);
}

export { FEELING_FAMILIES };
