/**
 * Founding Covenant — homepage institutional summary.
 *
 * The complete constitutional text remains on `/charter`.
 * This module holds the shared structural keys so the homepage
 * summary cannot silently invent alternate principles.
 *
 * Copy lives in `src/messages/{en,da}.json` under `homepage.foundingCovenant`
 * (next-intl), matching other Arrival v2 homepage sections.
 */

export const FOUNDING_COVENANT_COMMITMENT_IDS = [
  "healing",
  "foundation",
  "fear",
  "person",
  "trust",
] as const;

export type FoundingCovenantCommitmentId =
  (typeof FOUNDING_COVENANT_COMMITMENT_IDS)[number];

/** Central triad — shared institutional statement (EN source form). */
export const FOUNDING_COVENANT_TRIAD = [
  "Knowledge before products",
  "Service before profit",
  "Trust before growth",
] as const;
