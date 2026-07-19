/**
 * "I am feeling…" — landing-page feeling search (SPEC §9).
 *
 * Pure, dependency-free matching over the fixed, small (~20-item) canonical
 * taxonomy — never a large dataset fetch, mirroring the performance
 * discipline of src/lib/dua-dhikr/search.ts, whose normalizeSearchText this
 * module reuses directly rather than duplicating.
 *
 * Order of checks, per SPEC §8/§9:
 *   1. Crisis-keyword interception — always checked first, short-circuits
 *      every other result.
 *   2. Exact/alias resolution via the taxonomy's own alias map — covers
 *      synonyms, common spelling variants, and (deliberately) the very
 *      words the compassionate-label rule avoids as public labels (e.g.
 *      "hypocrite" still finds "Struggling with Sincerity").
 *   3. Deferred-state graceful redirect — a query that resolves to an
 *      architected-but-not-yet-public state (e.g. "waswas" →
 *      troubled-by-doubts) surfaces its nearest published neighbour with an
 *      honest note, never a dead end and never the deferred state itself.
 *   4. Substring fallback across launch-state labels/descriptions/aliases.
 */

import { normalizeSearchText } from "@/lib/dua-dhikr/search";
import {
  CANONICAL_FEELING_STATES,
  resolveFeelingSlug,
  getCanonicalFeelingState,
  type CanonicalFeelingState,
} from "./taxonomy";
import { isCrisisInterceptedQuery } from "./crisis-terms";

export type FeelingSearchResult =
  | { type: "crisis" }
  | { type: "match"; state: CanonicalFeelingState }
  | { type: "deferred-redirect"; state: CanonicalFeelingState; deferredLabel: string };

function nearestLaunchNeighbour(deferred: CanonicalFeelingState): CanonicalFeelingState | undefined {
  for (const slug of deferred.relatedSlugs) {
    const related = getCanonicalFeelingState(slug);
    if (related && related.launchStatus === "launch") return related;
  }
  // No related launch state recorded — fall back to any launch state in the same family.
  return CANONICAL_FEELING_STATES.find((s) => s.family === deferred.family && s.launchStatus === "launch");
}

function substringMatches(term: string): CanonicalFeelingState[] {
  const normalizedTerm = normalizeSearchText(term);
  if (!normalizedTerm) return [];
  return CANONICAL_FEELING_STATES.filter((state) => {
    if (state.launchStatus !== "launch") return false;
    const haystacks = [state.labelEn, state.labelDa ?? "", state.oneLineDescriptionEn, ...state.aliases];
    return haystacks.some((value) => normalizeSearchText(value).includes(normalizedTerm));
  });
}

/**
 * Resolve a free-text query to zero or more results. Returns at most one
 * `"crisis"` result (nothing else, ever, alongside it) or a small list of
 * `"match"`/`"deferred-redirect"` results, largest-confidence first.
 */
export function searchFeelingStates(term: string): FeelingSearchResult[] {
  if (isCrisisInterceptedQuery(term)) return [{ type: "crisis" }];
  if (!term.trim()) return [];

  const resolvedSlug = resolveFeelingSlug(term);
  if (resolvedSlug) {
    const state = getCanonicalFeelingState(resolvedSlug);
    if (state) {
      if (state.launchStatus === "launch") {
        return [{ type: "match", state }];
      }
      const neighbour = nearestLaunchNeighbour(state);
      if (neighbour) {
        return [{ type: "deferred-redirect", state: neighbour, deferredLabel: state.labelEn }];
      }
      return [];
    }
  }

  return substringMatches(term).map((state) => ({ type: "match" as const, state }));
}
