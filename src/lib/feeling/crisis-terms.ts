/**
 * "I am feeling…" — crisis-keyword interception list.
 *
 * SPEC.md §8/§9: any search input matching one of these terms must never
 * attempt a taxonomy match — it routes straight to the urgent-support page
 * (src/app/[locale]/i-am-feeling/urgent-support/page.tsx) instead, with no
 * other search results shown alongside it. This list is intentionally
 * conservative (recall over precision: a false positive costs nothing but
 * showing the urgent-support link a beat earlier; a false negative could
 * mean a distressed visitor gets ordinary taxonomy results instead).
 *
 * Deliberately plain, case-insensitive substring matching — no external
 * dependency, no analytics of what was typed (see src/lib/feeling/search.ts
 * and SPEC.md §14: raw query text is never logged).
 */
export const CRISIS_INTERCEPTION_TERMS = [
  "suicide",
  "suicidal",
  "kill myself",
  "end my life",
  "end it all",
  "want to die",
  "wish i was dead",
  "wish i were dead",
  "don't want to be here",
  "dont want to be here",
  "no reason to live",
  "self harm",
  "self-harm",
  "hurt myself",
  "harm myself",
  "cant go on",
  "can't go on",
] as const;

function normalizeForCrisisMatch(text: string): string {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[.,;:!?()/\\_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True if the given free-text query matches a crisis-interception term. */
export function isCrisisInterceptedQuery(query: string): boolean {
  const normalized = normalizeForCrisisMatch(query);
  if (!normalized) return false;
  return CRISIS_INTERCEPTION_TERMS.some((term) => normalized.includes(normalizeForCrisisMatch(term)));
}
