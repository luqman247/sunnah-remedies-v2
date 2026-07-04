/**
 * Sunnah Remedies — Revelation Generator
 *
 * Backward-compatible re-export from the Digital Library.
 * New code should import directly from "@/lib/content/library".
 */

export type { RevelationEntry, Category, Volume, Library } from "./schema";

export {
  library,
  publishedCollection,
  fullCollection,
  byCategory,
  byId,
  featured,
  getRevelationForDay,
  getRevelationForSeed,
  getVolume,
  getVolumeByNumber,
  publishedVolumes,
  libraryStats,
} from "./library";
