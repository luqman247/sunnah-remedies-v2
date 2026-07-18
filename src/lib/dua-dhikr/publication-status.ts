/**
 * Duʿa & Dhikr — collection publication status (single source of truth for UI).
 *
 * A collection is "published" for public navigation only when it has at least
 * one entry that already passed the authoritative public eligibility gate:
 *
 *   - Morning / Evening Dhikr → `getMorningDhikrItemsPublic` /
 *     `getEveningDhikrItemsPublic` (dhikr-publication-gate pathways)
 *   - All other canonical collections → `getAllPublicDuaDhikrEntries`
 *     (dua-dhikr-publication-gate pathways)
 *
 * Arabic text alone, reference-register projections, or taxonomy structure
 * never imply publication. Import readiness never implies publication.
 *
 * @see src/sanity/lib/dua-dhikr-publication-gate.ts
 * @see src/sanity/lib/dhikr-publication-gate.ts
 */

export type DuaDhikrCollectionPublicationState = "published" | "in-preparation";

export function resolveDuaDhikrCollectionPublicationState(
  entryCount: number,
): DuaDhikrCollectionPublicationState {
  return entryCount > 0 ? "published" : "in-preparation";
}

export function isDuaDhikrCollectionPublished(
  collection: { publicationState: DuaDhikrCollectionPublicationState },
): boolean {
  return collection.publicationState === "published";
}
