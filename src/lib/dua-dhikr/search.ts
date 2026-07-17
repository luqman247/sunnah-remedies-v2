/**
 * Duʿa & Dhikr — landing-page collection search.
 *
 * Pure, dependency-free matching over the fixed canonical collection list
 * (never a large dataset — see docs/dua-dhikr/README.md's performance
 * note). Extracted from DuaDhikrSearch.tsx so the matching behaviour is
 * directly unit-testable without rendering React.
 *
 * This searches collection metadata (title, description, aliases,
 * subcategories) only — it never claims to search entry content, since no
 * entry content exists yet and, once it does, in-collection entry search
 * is a separate, already-scoped feature (DuaDhikrEntryCollection).
 */

import type { CanonicalCollection } from "./taxonomy";

/**
 * Normalises punctuation/case/transliteration diacritics so common variant
 * spellings match:
 *   - "Hajj and Umrah" ≈ "Hajj & Umrah" ≈ "hajj+umrah"
 *   - "wudu's" ≈ "wudus"
 *   - "Ḥajj" ≈ "hajj", "Ṣalawāt" ≈ "salawat", "Ramaḍān" ≈ "ramadan" — the
 *     Latin transliteration diacritics used throughout the taxonomy
 *     (macrons, underdots, etc.) are stripped via Unicode NFD decomposition
 *   - "Duʿa" ≈ "dua" — the ʿ/ʾ modifier letters (ayn/hamza) are stripped
 *     explicitly, since they are spacing letters, not combining marks, and
 *     NFD does not remove them. This matters because most users will type
 *     the plain "dua" on an ordinary keyboard — see
 *     docs/dua-dhikr/PREFLIGHT_VALIDATION.md, "Search and discovery".
 *
 * This only affects *matching* — it never changes what is displayed; the
 * site's visible name is always exactly "Duʿa & Dhikr", never "Dua & Dhikr".
 */
export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // combining diacritics (macrons, underdots, etc.)
    .replace(/[ʿʾ]/g, "") // ʿ (ayn) / ʾ (hamza) modifier letters
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[.,;:!?()/\\_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface SearchableCollection
  extends Pick<CanonicalCollection, "slug" | "titleEn" | "descriptionEn" | "aliases" | "subcategories"> {
  titleDa?: string;
}

/**
 * True if `term` matches this collection's title, description, aliases, or
 * any subcategory's title/aliases — after normalising both sides, so
 * "Hajj and Umrah", "hajj & umrah", and "Hajj&Umrah" are all equivalent.
 */
export function collectionMatchesSearchTerm(collection: SearchableCollection, term: string): boolean {
  const normalizedTerm = normalizeSearchText(term);
  if (!normalizedTerm) return false;
  const haystacks = [
    collection.titleEn,
    collection.titleDa ?? "",
    collection.descriptionEn,
    ...collection.aliases,
    ...(collection.subcategories?.flatMap((s) => [s.titleEn, ...(s.aliases ?? [])]) ?? []),
  ];
  return haystacks.some((value) => normalizeSearchText(value).includes(normalizedTerm));
}

export function searchDuaDhikrCollections<T extends SearchableCollection>(collections: T[], term: string): T[] {
  if (!term.trim()) return [];
  return collections.filter((collection) => collectionMatchesSearchTerm(collection, term));
}
