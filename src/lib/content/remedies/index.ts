import type { Remedy } from "../types";
import { blackSeedOil } from "./black-seed-oil";
import { honey } from "./honey";
import { senna } from "./senna";
import { oliveOil } from "./olive-oil";

export const remedies: Remedy[] = [blackSeedOil, honey, senna, oliveOil];

export function getRemedyBySlug(slug: string): Remedy | undefined {
  return remedies.find((r) => r.slug === slug);
}

export function getAllRemedySlugs(): string[] {
  return remedies.map((r) => r.slug);
}

export function getRelatedRemedies(slug: string): Remedy[] {
  const remedy = getRemedyBySlug(slug);
  if (!remedy) return [];
  return remedy.relatedRemedies
    .map(getRemedyBySlug)
    .filter((r): r is Remedy => r !== undefined);
}

export function formatProvenance(remedy: Remedy): string {
  const primary = remedy.propheticReferences[0];
  if (!primary) return "Tried · Classical use";
  return `${primary.grade} · ${primary.source.split(" · ")[0]}`;
}

export function formatPrice(amount: number): string {
  return `£${amount}`;
}

export function primaryReference(remedy: Remedy) {
  return remedy.propheticReferences[0];
}
