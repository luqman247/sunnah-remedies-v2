import type { AppLocale } from "@/i18n/locales";
import type { DuaDhikrCollectionPublic } from "@/sanity/lib/dua-dhikr-public-fetch";

/** Preferred published collections for the non-interactive preview mosaic. */
export const DUA_DHIKR_FEATURE_PREVIEW_PREFERRED_SLUGS = [
  "morning-dhikr",
  "evening-dhikr",
  "after-salah",
  "before-sleep",
] as const;

export function selectDuaDhikrFeaturePreview(
  published: DuaDhikrCollectionPublic[],
  limit = 4,
): DuaDhikrCollectionPublic[] {
  const bySlug = new Map(
    published.map((collection) => [collection.slug, collection]),
  );
  const preferred = DUA_DHIKR_FEATURE_PREVIEW_PREFERRED_SLUGS.map((slug) =>
    bySlug.get(slug),
  ).filter((collection): collection is DuaDhikrCollectionPublic =>
    Boolean(collection),
  );
  const preferredSlugs = new Set(
    preferred.map((collection) => collection.slug),
  );
  const remainder = published.filter(
    (collection) => !preferredSlugs.has(collection.slug),
  );
  return [...preferred, ...remainder].slice(0, limit);
}

/**
 * Locale-safe decorative title: never show an English taxonomy title on Danish.
 * When titleDa is absent, the tile becomes icon-only.
 */
export function resolveDuaDhikrFeatureTileTitle(
  collection: Pick<DuaDhikrCollectionPublic, "titleEn" | "titleDa">,
  locale: AppLocale,
): string | null {
  if (locale === "da") {
    return collection.titleDa?.trim() ? collection.titleDa : null;
  }
  return collection.titleEn;
}

export const KNOWLEDGE_LIBRARY_SECTION_NUMERALS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
] as const;

/**
 * Allocate consecutive Roman numerals for the Knowledge Library hub.
 * Optional Recent Publications consumes one numeral when present;
 * Closing always receives the next unused numeral.
 */
export function allocateKnowledgeLibraryNumerals(hasRecentArticles: boolean) {
  let index = 0;
  const next = () => {
    const numeral = KNOWLEDGE_LIBRARY_SECTION_NUMERALS[index];
    if (!numeral) {
      throw new Error("Knowledge Library section numeral sequence exhausted");
    }
    index += 1;
    return numeral;
  };

  return {
    hero: next(),
    duaDhikr: next(),
    openShelf: next(),
    featured: next(),
    recent: hasRecentArticles ? next() : null,
    closing: next(),
  };
}
