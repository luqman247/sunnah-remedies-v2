import type { SacredJourney } from "./types";
import { oliveGrove } from "./olive-grove";
import { desertWay } from "./desert-way";

export const journeys: SacredJourney[] = [oliveGrove, desertWay];

export const journeyCatalogue = journeys.map((j) => ({
  slug: j.slug,
  name: j.name,
  href: `/sacred-journeys/${j.slug}`,
  season: j.season,
  duration: j.duration,
  fee: j.fee,
  description: j.subtitle,
}));

export function getJourneyBySlug(slug: string): SacredJourney | undefined {
  return journeys.find((j) => j.slug === slug);
}

export function getAllJourneySlugs(): string[] {
  return journeys.map((j) => j.slug);
}
