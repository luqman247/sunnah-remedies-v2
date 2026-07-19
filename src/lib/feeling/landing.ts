/**
 * "I am feeling…" landing hub — pure composition helpers.
 *
 * Mirrors src/lib/dua-dhikr/landing-hub.ts: keeps the page's selection and
 * grouping logic directly unit-testable without rendering React or hitting
 * Sanity.
 */

import type { FeelingStatePublic } from "@/sanity/lib/feeling-public-fetch";
import { isFeelingStatePublicationReady } from "@/sanity/lib/feeling-public-fetch";
import { getLaunchFeelingStates, type FeelingFamilyKey } from "./taxonomy";

export const FEATURED_FEELING_STATES_MAX = 4;

/** Only states whose canonical taxonomy entry has launchStatus "launch" — deferred/not-suitable states never appear on the public grid (SPEC §4, §9). */
export function selectLaunchFeelingStates<T extends { slug: string }>(states: T[]): T[] {
  const launchSlugs = new Set(getLaunchFeelingStates().map((s) => s.slug));
  return states.filter((s) => launchSlugs.has(s.slug));
}

/**
 * The small, editorially curated "Where visitors begin" set (SPEC §3.3).
 * Ordering is entirely editorial (featuredOrder) — never re-ranked by
 * click-through data (SPEC §7.6's anti-gaming rule).
 */
export function selectFeaturedFeelingStates(states: FeelingStatePublic[]): FeelingStatePublic[] {
  return selectLaunchFeelingStates(states)
    .filter((s): s is FeelingStatePublic & { featuredOrder: number } => typeof s.featuredOrder === "number")
    .filter((s) => isFeelingStatePublicationReady(s))
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
    .slice(0, FEATURED_FEELING_STATES_MAX);
}

/** Launch states grouped by family, in taxonomy family order (SPEC §3.4). Families with zero launch states are simply absent from the map. */
export function groupFeelingStatesByFamily(states: FeelingStatePublic[]): Map<FeelingFamilyKey, FeelingStatePublic[]> {
  const launch = selectLaunchFeelingStates(states);
  const map = new Map<FeelingFamilyKey, FeelingStatePublic[]>();
  for (const state of launch) {
    const list = map.get(state.family) ?? [];
    list.push(state);
    map.set(state.family, list);
  }
  return map;
}
