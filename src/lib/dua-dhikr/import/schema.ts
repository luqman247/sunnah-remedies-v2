/**
 * Duʿā & Dhikr content-import row shape and validation.
 *
 * One row = one future `duaDhikrEntry` document. No dependency added for
 * this (no zod) — the validators below are plain functions, consistent
 * with "no new dependency unless clearly justified".
 *
 * @see docs/dua-dhikr/CONTENT_IMPORT_GUIDE.md
 * @see docs/dua-dhikr/CONTENT_IMPORT_TEMPLATE.md
 */

import { CANONICAL_COLLECTION_SLUGS, resolveCollectionSlug } from "@/lib/dua-dhikr/taxonomy";

export interface DuaDhikrImportSourceReference {
  type: "hadith" | "quran" | "research" | "book" | "other";
  citation: string;
  hadithCollection?: string;
  hadithNumber?: string;
  hadithGrading?: "sahih" | "hasan" | "daif" | "mawdu" | "other";
  surah?: string;
  ayah?: string;
  sourceUrl?: string;
  verifiedStatus?: "verified" | "unverified";
}

export interface DuaDhikrImportRow {
  importIdentifier: string;
  collectionSlug: string;
  subcategorySlug?: string;
  whatItIsFor?: string;
  titleEn: string;
  titleDa?: string;
  arabicText: string;
  transliteration?: string;
  translationEn: string;
  translationDa?: string;
  repetitionCount?: number;
  timingLabel?: "morning-only" | "evening-only" | "morning-and-evening" | "not-time-specific";
  occasion?: string[];
  instruction?: string;
  virtue?: string;
  explanation?: string;
  references: DuaDhikrImportSourceReference[];
  authenticationNote?: string;
}

export interface ImportRowIssue {
  row: number;
  importIdentifier?: string;
  field?: string;
  message: string;
}

export interface ImportRowResult {
  value?: DuaDhikrImportRow;
  issues: ImportRowIssue[];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * Validates one raw row from the imported content document. Returns the
 * typed row (only) when there are zero issues — callers must never write a
 * row that produced any issue, since a partially-valid row could otherwise
 * silently ship with a missing Arabic text or an unresolvable collection.
 */
export function validateImportRow(raw: unknown, rowIndex: number): ImportRowResult {
  const issues: ImportRowIssue[] = [];
  const row = (raw ?? {}) as Record<string, unknown>;
  const importIdentifier = typeof row.importIdentifier === "string" ? row.importIdentifier : undefined;

  function fail(field: string, message: string) {
    issues.push({ row: rowIndex, importIdentifier, field, message });
  }

  if (!isNonEmptyString(row.importIdentifier)) fail("importIdentifier", "Required — a stable identifier for this row.");
  if (!isNonEmptyString(row.collectionSlug)) {
    fail("collectionSlug", "Required.");
  } else {
    const resolved = resolveCollectionSlug(row.collectionSlug as string) ?? (row.collectionSlug as string);
    if (!(CANONICAL_COLLECTION_SLUGS as string[]).includes(resolved)) {
      fail(
        "collectionSlug",
        `"${row.collectionSlug}" does not resolve to a canonical collection. See docs/dua-dhikr/CATEGORY_ALIAS_MAP.md.`,
      );
    }
  }
  if (!isNonEmptyString(row.titleEn)) fail("titleEn", "Required.");
  if (!isNonEmptyString(row.arabicText)) fail("arabicText", "Required — the authoritative Arabic source text.");
  if (!isNonEmptyString(row.translationEn)) fail("translationEn", "Required.");

  const references = Array.isArray(row.references) ? row.references : [];
  if (references.length === 0) {
    fail("references", "At least one source reference (Qurʾān/hadith/other) is required — see docs/dua-dhikr/SOURCE_POLICY.md.");
  } else {
    references.forEach((ref, refIndex) => {
      const r = (ref ?? {}) as Record<string, unknown>;
      if (!isNonEmptyString(r.citation)) fail(`references[${refIndex}].citation`, "Required.");
      if (!isNonEmptyString(r.type)) fail(`references[${refIndex}].type`, "Required.");
    });
  }

  if (row.repetitionCount !== undefined && typeof row.repetitionCount !== "number") {
    fail("repetitionCount", "Must be a number if present — never a guessed value.");
  }

  if (issues.length > 0) return { issues };

  const resolvedCollectionSlug = resolveCollectionSlug(row.collectionSlug as string) ?? (row.collectionSlug as string);

  return {
    issues: [],
    value: {
      importIdentifier: row.importIdentifier as string,
      collectionSlug: resolvedCollectionSlug,
      subcategorySlug: typeof row.subcategorySlug === "string" ? row.subcategorySlug : undefined,
      whatItIsFor: typeof row.whatItIsFor === "string" ? row.whatItIsFor : undefined,
      titleEn: row.titleEn as string,
      titleDa: typeof row.titleDa === "string" ? row.titleDa : undefined,
      arabicText: row.arabicText as string,
      transliteration: typeof row.transliteration === "string" ? row.transliteration : undefined,
      translationEn: row.translationEn as string,
      translationDa: typeof row.translationDa === "string" ? row.translationDa : undefined,
      repetitionCount: typeof row.repetitionCount === "number" ? row.repetitionCount : undefined,
      timingLabel: typeof row.timingLabel === "string" ? (row.timingLabel as DuaDhikrImportRow["timingLabel"]) : undefined,
      occasion: Array.isArray(row.occasion) ? (row.occasion as string[]) : undefined,
      instruction: typeof row.instruction === "string" ? row.instruction : undefined,
      virtue: typeof row.virtue === "string" ? row.virtue : undefined,
      explanation: typeof row.explanation === "string" ? row.explanation : undefined,
      references: references as DuaDhikrImportSourceReference[],
      authenticationNote: typeof row.authenticationNote === "string" ? row.authenticationNote : undefined,
    },
  };
}

/** Detects duplicate importIdentifier values within one batch, before any write happens. */
export function findDuplicateImportIdentifiers(rows: DuaDhikrImportRow[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const row of rows) {
    if (seen.has(row.importIdentifier)) duplicates.add(row.importIdentifier);
    seen.add(row.importIdentifier);
  }
  return [...duplicates];
}
