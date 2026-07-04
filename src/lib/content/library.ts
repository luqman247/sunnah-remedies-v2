/**
 * Sunnah Remedies — Digital Library
 *
 * Institutional registry for all published volumes.
 * This is the single entry point for cross-volume queries,
 * statistics, and the daily revelation generator.
 *
 * To add a new volume:
 *   1. Create src/lib/content/volumes/volume-{id}/
 *   2. Add entry files and an index.ts exporting a Volume
 *   3. Import and register the volume in this file
 */

import type {
  Library,
  Volume,
  RevelationEntry,
  Category,
} from "./schema";

import { volumeI } from "./volumes/volume-i";

// ═══════════════════════════════════════════════════════════
// Library registry
// ═══════════════════════════════════════════════════════════

export const library: Library = {
  name: "Sunnah Remedies Digital Library",
  volumes: [volumeI],
};

// ═══════════════════════════════════════════════════════════
// Cross-volume aggregation
// ═══════════════════════════════════════════════════════════

function aggregateEntries(
  volumes: Volume[],
  status?: "published" | "draft" | "review" | "archived"
): RevelationEntry[] {
  const seen = new Set<string>();
  const result: RevelationEntry[] = [];

  for (const volume of volumes) {
    if (volume.editorialStatus !== "published") continue;
    for (const entry of volume.entries) {
      if (seen.has(entry.id)) continue;
      if (status && entry.editorialStatus !== status) continue;
      seen.add(entry.id);
      result.push(entry);
    }
  }

  return result;
}

/** All published entries across all published volumes. */
export const publishedCollection: RevelationEntry[] = aggregateEntries(
  library.volumes,
  "published"
);

/** All entries across all published volumes (any editorial status). */
export const fullCollection: RevelationEntry[] = aggregateEntries(
  library.volumes
);

// ═══════════════════════════════════════════════════════════
// Query API
// ═══════════════════════════════════════════════════════════

/** Retrieve a volume by its ID. */
export function getVolume(id: string): Volume | undefined {
  return library.volumes.find((v) => v.id === id);
}

/** Retrieve a volume by its number. */
export function getVolumeByNumber(n: number): Volume | undefined {
  return library.volumes.find((v) => v.number === n);
}

/** All published volumes. */
export function publishedVolumes(): Volume[] {
  return library.volumes.filter((v) => v.editorialStatus === "published");
}

/** Filter published entries by category (primary or secondary). */
export function byCategory(category: Category): RevelationEntry[] {
  return publishedCollection.filter(
    (e) => e.category === category || e.themes?.includes(category)
  );
}

/** Look up a single entry by ID across all volumes. */
export function byId(id: string): RevelationEntry | undefined {
  return fullCollection.find((e) => e.id === id);
}

/** Featured entries across all published volumes. */
export function featured(): RevelationEntry[] {
  return publishedCollection.filter((e) => e.featured);
}

// ═══════════════════════════════════════════════════════════
// Deterministic generators
// ═══════════════════════════════════════════════════════════

/**
 * Returns a revelation for a given day, cycling through the
 * published collection. Deterministic: same day → same entry.
 */
export function getRevelationForDay(
  date: Date = new Date()
): RevelationEntry {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return publishedCollection[dayOfYear % publishedCollection.length];
}

/**
 * Returns a revelation based on a string seed (e.g. a page path),
 * so different pages can show different but stable revelations.
 */
export function getRevelationForSeed(seed: string): RevelationEntry {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  const index = Math.abs(hash) % publishedCollection.length;
  return publishedCollection[index];
}

// ═══════════════════════════════════════════════════════════
// Statistics
// ═══════════════════════════════════════════════════════════

export function libraryStats() {
  const categories: Record<string, number> = {};
  for (const entry of publishedCollection) {
    categories[entry.category] = (categories[entry.category] || 0) + 1;
  }

  return {
    volumes: library.volumes.length,
    publishedVolumes: publishedVolumes().length,
    totalEntries: fullCollection.length,
    publishedEntries: publishedCollection.length,
    categories,
    quran: publishedCollection.filter((e) => e.type === "quran").length,
    hadith: publishedCollection.filter((e) => e.type === "hadith").length,
  };
}
