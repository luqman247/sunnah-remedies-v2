/**
 * "I am feeling…" Public Fetch — the ONLY module a public route under
 * src/app/[locale]/ may use to read feelingFamily/feelingState content.
 *
 * Mirrors the discipline of src/sanity/lib/dua-dhikr-public-fetch.ts: uses
 * the public `client` (perspective: "published"), never a preview client.
 * The feelingState document's OWN eligibility is applied inside the GROQ
 * query filter (feelingStatesEnglishEligibleQuery /
 * feelingStatesDanishEligibleQuery). Each featuredEntries[].entry is then
 * independently re-checked here against the SAME, unmodified
 * isDuaDhikrEntryPubliclyEligibleForLocale function the rest of the site
 * uses — a feelingState being eligible never implies its featured entries
 * are; a state with zero currently-eligible featured entries still renders
 * its structural shell with that section quietly omitted (SPEC §6).
 *
 * The family/state structure itself is fixed, curated code in
 * src/lib/feeling/taxonomy.ts — NOT read from Sanity. Every route in the
 * taxonomy exists and renders its structural shell immediately, whether or
 * not any Sanity content exists for it yet.
 *
 * @see docs/i-am-feeling/SPEC.md
 */

import { client } from "./client";
import {
  feelingFamiliesQuery,
  feelingStatesEnglishEligibleQuery,
  feelingStatesDanishEligibleQuery,
} from "./queries";
import type { AppLocale } from "@/i18n/locales";
import {
  CANONICAL_FEELING_STATES,
  FEELING_FAMILIES,
  getCanonicalFeelingState,
  getFeelingStatesByFamily,
  type CanonicalFeelingState,
  type FeelingFamilyKey,
} from "@/lib/feeling/taxonomy";
import {
  isDuaDhikrEntryPubliclyEligible,
  isDuaDhikrEntryEditoriallyPubliclyEligible,
  isDuaDhikrEntryOwnerApprovedEnglishEligible,
} from "./dua-dhikr-publication-gate";
import type { DuaDhikrEntryPublic, DuaDhikrEntryCollectionRef } from "./dua-dhikr-public-fetch";

async function safeFetch<T>(query: string): Promise<T | null> {
  try {
    const result = await client.fetch<T>(query);
    return result ?? null;
  } catch {
    return null;
  }
}

export interface FeelingFamilyPublic {
  key: FeelingFamilyKey;
  titleEn: string;
  titleDa?: string;
  descriptionEn?: string;
  descriptionDa?: string;
  order: number;
}

interface FeelingFamilyDoc {
  slug?: string;
  descriptionEn?: string;
  descriptionDa?: string;
}

/** Every canonical family, enriched with any eligible Sanity descriptionEn/Da — structural shell always present, family list itself always comes from the taxonomy file (SPEC §6). */
export async function getFeelingFamiliesPublic(): Promise<FeelingFamilyPublic[]> {
  const docs = (await safeFetch<FeelingFamilyDoc[]>(feelingFamiliesQuery)) ?? [];
  const bySlug = new Map(docs.filter((d) => d.slug).map((d) => [d.slug as string, d]));

  return FEELING_FAMILIES.map((f) => {
    const doc = bySlug.get(f.key);
    return {
      key: f.key,
      titleEn: f.titleEn,
      titleDa: f.titleDa,
      descriptionEn: doc?.descriptionEn,
      descriptionDa: doc?.descriptionDa,
      order: f.order,
    };
  });
}

interface FeelingFeaturedEntryGateDoc extends Omit<DuaDhikrEntryPublic, "publicationPathway"> {
  reviewStatus?: string;
  editorialPublicationStatus?: string;
  importIdentifier?: string;
  boardApprovals?: { board?: string; approved?: boolean }[];
}

interface FeelingStateDoc {
  _id: string;
  slug?: string;
  labelEn?: string;
  labelDa?: string;
  family?: string;
  oneLineDescriptionEn?: string;
  oneLineDescriptionDa?: string;
  tone?: string;
  launchStatus?: string;
  safeguardingLevel?: string;
  featuredOrder?: number;
  introductionEn?: string;
  introductionDa?: string;
  groundingMomentEn?: string;
  groundingMomentDa?: string;
  practicalNextStepEn?: string;
  practicalNextStepDa?: string;
  professionalSupportNoteEn?: string;
  professionalSupportNoteDa?: string;
  relatedFeelingStates?: { slug?: string; labelEn?: string; labelDa?: string }[];
  relatedCollectionsOverride?: DuaDhikrEntryCollectionRef[];
  featuredEntries?: { reflectionEn?: string; reflectionDa?: string; entry?: FeelingFeaturedEntryGateDoc | null }[];
}

export interface FeelingFeaturedEntryPublic {
  reflection?: string;
  entry: DuaDhikrEntryPublic;
}

/** Public-safe shape of a publicly eligible feelingState, merged with its taxonomy metadata. Contains no reviewStatus, boardApprovals, or internal editorial fields. */
export interface FeelingStatePublic extends CanonicalFeelingState {
  featuredOrder?: number;
  introductionEn?: string;
  introductionDa?: string;
  groundingMomentEn?: string;
  groundingMomentDa?: string;
  practicalNextStepEn?: string;
  practicalNextStepDa?: string;
  professionalSupportNoteEn?: string;
  professionalSupportNoteDa?: string;
  featuredEntries: FeelingFeaturedEntryPublic[];
  relatedFeelingSlugs: string[];
  relatedCollections: DuaDhikrEntryCollectionRef[];
  hasEligibleFeaturedEntries: boolean;
}

function resolveFeaturedEntryPathway(
  doc: FeelingFeaturedEntryGateDoc,
  locale: AppLocale,
): DuaDhikrEntryPublic["publicationPathway"] | undefined {
  if (isDuaDhikrEntryPubliclyEligible(doc)) return "scholarly-approved";
  if (isDuaDhikrEntryEditoriallyPubliclyEligible(doc)) return "editorial-pending-scholarly-review";
  if (locale === "en" && isDuaDhikrEntryOwnerApprovedEnglishEligible(doc)) return "owner-approved-english-first";
  return undefined;
}

function toPublicFeaturedEntries(
  featuredEntries: FeelingStateDoc["featuredEntries"],
  locale: AppLocale,
): FeelingFeaturedEntryPublic[] {
  const results: FeelingFeaturedEntryPublic[] = [];
  for (const item of featuredEntries ?? []) {
    if (!item.entry) continue;
    const pathway = resolveFeaturedEntryPathway(item.entry, locale);
    if (!pathway) continue; // ineligible — quietly omitted, never rendered
    const { reviewStatus, editorialPublicationStatus, importIdentifier, boardApprovals, ...publicFields } = item.entry;
    void reviewStatus;
    void editorialPublicationStatus;
    void importIdentifier;
    void boardApprovals;
    const reflection = locale === "da" ? item.reflectionDa || item.reflectionEn : item.reflectionEn;
    results.push({
      reflection: reflection || undefined,
      entry: { ...publicFields, publicationPathway: pathway },
    });
  }
  return results;
}

/**
 * Every launch-taxonomy feeling state for the given locale, merged with any
 * eligible Sanity curatorial copy. A state whose Sanity document does not
 * yet pass the publication gate for this locale is still returned with its
 * structural taxonomy fields (slug, family, label, description) but with no
 * curatorial copy and an empty featuredEntries array — callers must check
 * for that (isFeelingStatePublicationReady below) before treating a state
 * as a real, content-complete page.
 */
export async function getFeelingStatesPublic(locale: AppLocale = "en"): Promise<FeelingStatePublic[]> {
  const query = locale === "da" ? feelingStatesDanishEligibleQuery : feelingStatesEnglishEligibleQuery;
  const docs = (await safeFetch<FeelingStateDoc[]>(query)) ?? [];
  const bySlug = new Map(docs.filter((d) => d.slug).map((d) => [d.slug as string, d]));

  return CANONICAL_FEELING_STATES.map((canonical) => {
    const doc = bySlug.get(canonical.slug);
    const featuredEntries = doc ? toPublicFeaturedEntries(doc.featuredEntries, locale) : [];
    const relatedCollections =
      doc?.relatedCollectionsOverride && doc.relatedCollectionsOverride.length > 0
        ? doc.relatedCollectionsOverride
        : dedupeCollections(featuredEntries.flatMap((f) => f.entry.collections));

    return {
      ...canonical,
      // CMS-authored Danish label/description win once eligible; taxonomy's
      // own Danish text remains the fixture/sourced-but-unpublished default.
      labelDa: doc?.labelDa ?? canonical.labelDa,
      oneLineDescriptionDa: doc?.oneLineDescriptionDa ?? canonical.oneLineDescriptionDa,
      featuredOrder: doc?.featuredOrder,
      introductionEn: doc?.introductionEn,
      introductionDa: doc?.introductionDa,
      groundingMomentEn: doc?.groundingMomentEn,
      groundingMomentDa: doc?.groundingMomentDa,
      practicalNextStepEn: doc?.practicalNextStepEn,
      practicalNextStepDa: doc?.practicalNextStepDa,
      professionalSupportNoteEn: doc?.professionalSupportNoteEn,
      professionalSupportNoteDa: doc?.professionalSupportNoteDa,
      featuredEntries,
      relatedFeelingSlugs:
        doc?.relatedFeelingStates?.map((r) => r.slug).filter((s): s is string => !!s) ?? canonical.relatedSlugs,
      relatedCollections,
      hasEligibleFeaturedEntries: featuredEntries.length > 0,
    };
  });
}

function dedupeCollections(collections: DuaDhikrEntryCollectionRef[]): DuaDhikrEntryCollectionRef[] {
  const bySlug = new Map<string, DuaDhikrEntryCollectionRef>();
  for (const c of collections) {
    if (!bySlug.has(c.slug)) bySlug.set(c.slug, c);
  }
  return [...bySlug.values()];
}

/**
 * A feeling state is "publication ready" — safe to give a live route with
 * real content — only once its own Sanity document passed the locale gate
 * AND it has at least one eligible featured entry. This is stricter than
 * "launchStatus is launch": a launch-taxonomy state with no reviewed Sanity
 * content yet is NOT publication ready, and its route must 404 rather than
 * render an empty/misleading page (SPEC §17, §24).
 */
export function isFeelingStatePublicationReady(state: Pick<FeelingStatePublic, "introductionEn" | "practicalNextStepEn" | "hasEligibleFeaturedEntries">): boolean {
  return !!state.introductionEn && !!state.practicalNextStepEn && state.hasEligibleFeaturedEntries;
}

export async function getFeelingStatePublic(slug: string, locale: AppLocale = "en"): Promise<FeelingStatePublic | undefined> {
  const states = await getFeelingStatesPublic(locale);
  return states.find((s) => s.slug === slug);
}

export { getCanonicalFeelingState, getFeelingStatesByFamily };
