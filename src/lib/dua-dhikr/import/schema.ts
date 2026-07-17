/**
 * Duʿa & Dhikr content-import row shape and validation.
 *
 * One row = one future `duaDhikrEntry` document. No dependency added for
 * this (no zod) — the validators below are plain functions, consistent
 * with "no new dependency unless clearly justified".
 *
 * @see docs/dua-dhikr/CONTENT_IMPORT_GUIDE.md
 * @see docs/dua-dhikr/CONTENT_IMPORT_TEMPLATE.md
 */

import { CANONICAL_COLLECTION_SLUGS, resolveCollectionSlug, getCanonicalCollection } from "@/lib/dua-dhikr/taxonomy";

/**
 * The only external hostnames this project accepts as a source reference —
 * see docs/dua-dhikr/SOURCE_POLICY.md. Subdomains are permitted (e.g.
 * "api.quran.com") but arbitrary lookalike or unrelated domains are not.
 * This is a structural check only — it confirms a reference points at an
 * approved host, never that the content there has been read or that a
 * hadith is authentic. Structural validation and scholarly verification
 * are deliberately kept separate; see docs/dua-dhikr/PREFLIGHT_VALIDATION.md.
 */
export const ALLOWED_SOURCE_HOSTNAMES = ["quran.com", "sunnah.com", "usul.ai"] as const;

export function isAllowedSourceHostname(url: string): boolean {
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  return ALLOWED_SOURCE_HOSTNAMES.some((allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`));
}

/**
 * Rows carrying fixture/placeholder markers must never be treated as real,
 * importable content — this is the backstop that stops
 * docs/dua-dhikr/sample-import.json (or any similarly-marked row) from
 * ever being written by an operator running the wrong file, live, by
 * mistake. Deliberately broad (case-insensitive substring match) rather
 * than an exact marker format, since the goal is to fail closed on
 * anything that looks like placeholder content.
 */
const FIXTURE_MARKER_PATTERN = /fixture|not for publication/i;

export function containsFixtureMarker(row: Record<string, unknown>): string | undefined {
  const fieldsToCheck: (keyof typeof row)[] = [
    "titleEn",
    "titleDa",
    "whatItIsFor",
    "arabicText",
    "transliteration",
    "translationEn",
    "translationDa",
    "instruction",
    "virtue",
    "explanation",
    "authenticationNote",
  ];
  for (const field of fieldsToCheck) {
    const value = row[field];
    if (typeof value === "string" && FIXTURE_MARKER_PATTERN.test(value)) {
      return String(field);
    }
  }
  return undefined;
}

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
  /** Non-blocking notices — the row may still import, but a human should look at these before publication. */
  warnings: ImportRowIssue[];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * Validates one raw row from the imported content document. Returns the
 * typed row (only) when there are zero blocking issues — callers must
 * never write a row that produced any issue, since a partially-valid row
 * could otherwise silently ship with a missing Arabic text or an
 * unresolvable collection. `warnings` never block import but are surfaced
 * so a human reviewer sees them before publication (see
 * src/lib/dua-dhikr/import/preflight.ts).
 */
export function validateImportRow(raw: unknown, rowIndex: number): ImportRowResult {
  const issues: ImportRowIssue[] = [];
  const warnings: ImportRowIssue[] = [];
  const row = (raw ?? {}) as Record<string, unknown>;
  const importIdentifier = typeof row.importIdentifier === "string" ? row.importIdentifier : undefined;

  function fail(field: string, message: string) {
    issues.push({ row: rowIndex, importIdentifier, field, message });
  }
  function warn(field: string, message: string) {
    warnings.push({ row: rowIndex, importIdentifier, field, message });
  }

  const fixtureField = containsFixtureMarker(row);
  if (fixtureField) {
    fail(
      fixtureField,
      `Contains a fixture/placeholder marker ("FIXTURE" or "NOT FOR PUBLICATION") — refusing to treat this row as real content. If this is genuinely sourced content, remove the marker text.`,
    );
  }

  if (!isNonEmptyString(row.importIdentifier)) fail("importIdentifier", "Required — a stable identifier for this row.");
  let resolvedCollectionSlug: string | undefined;
  if (!isNonEmptyString(row.collectionSlug)) {
    fail("collectionSlug", "Required.");
  } else {
    resolvedCollectionSlug = resolveCollectionSlug(row.collectionSlug as string) ?? (row.collectionSlug as string);
    if (!(CANONICAL_COLLECTION_SLUGS as string[]).includes(resolvedCollectionSlug)) {
      fail(
        "collectionSlug",
        `"${row.collectionSlug}" does not resolve to a canonical collection. See docs/dua-dhikr/CATEGORY_ALIAS_MAP.md.`,
      );
      resolvedCollectionSlug = undefined;
    }
  }

  if (resolvedCollectionSlug && isNonEmptyString(row.subcategorySlug)) {
    const collection = getCanonicalCollection(resolvedCollectionSlug);
    const knownSubcategorySlugs = collection?.subcategories?.map((s) => s.slug) ?? [];
    if (!knownSubcategorySlugs.includes(row.subcategorySlug as string)) {
      fail(
        "subcategorySlug",
        `"${row.subcategorySlug}" is not a known subcategory of "${resolvedCollectionSlug}" (known: ${knownSubcategorySlugs.join(", ") || "none"}).`,
      );
    }
  }

  if (!isNonEmptyString(row.titleEn)) fail("titleEn", "Required.");
  if (!isNonEmptyString(row.whatItIsFor)) warn("whatItIsFor", "No plain-language purpose given — recommended so readers immediately know when to use this entry.");
  if (!isNonEmptyString(row.arabicText)) fail("arabicText", "Required — the authoritative Arabic source text.");
  if (!isNonEmptyString(row.translationEn)) fail("translationEn", "Required.");
  if (!isNonEmptyString(row.translationDa)) warn("translationDa", "No Danish translation supplied yet — the site will fall back to English until one is added.");
  if (!isNonEmptyString(row.transliteration)) warn("transliteration", "No transliteration supplied — confirm this omission is intentional, not an oversight.");

  const references = Array.isArray(row.references) ? row.references : [];
  if (references.length === 0) {
    fail("references", "At least one source reference (Qurʾān/hadith/other) is required — see docs/dua-dhikr/SOURCE_POLICY.md.");
  } else {
    references.forEach((ref, refIndex) => {
      const r = (ref ?? {}) as Record<string, unknown>;
      if (!isNonEmptyString(r.citation)) fail(`references[${refIndex}].citation`, "Required.");
      if (!isNonEmptyString(r.type)) fail(`references[${refIndex}].type`, "Required.");
      if (r.type === "hadith") {
        if (!isNonEmptyString(r.hadithCollection)) fail(`references[${refIndex}].hadithCollection`, "Required for hadith references.");
        if (!isNonEmptyString(r.hadithNumber)) fail(`references[${refIndex}].hadithNumber`, "Required for hadith references.");
        if (!isNonEmptyString(r.hadithGrading)) warn(`references[${refIndex}].hadithGrading`, "No grading supplied for a hadith reference — required before scholarly review can proceed.");
      }
      if (r.type === "quran") {
        if (!isNonEmptyString(r.surah)) fail(`references[${refIndex}].surah`, "Required for Qurʾān references.");
        if (!isNonEmptyString(r.ayah)) fail(`references[${refIndex}].ayah`, "Required for Qurʾān references.");
      }
      if (isNonEmptyString(r.sourceUrl) && !isAllowedSourceHostname(r.sourceUrl)) {
        fail(
          `references[${refIndex}].sourceUrl`,
          `"${r.sourceUrl}" is not on an approved source domain (${ALLOWED_SOURCE_HOSTNAMES.join(", ")}) — see docs/dua-dhikr/SOURCE_POLICY.md. A structurally valid URL is not scholarly verification; only these domains are accepted as citation evidence for this project.`,
        );
      }
      if (r.verifiedStatus !== "verified") {
        warn(`references[${refIndex}].verifiedStatus`, "Source reference is not marked verified — required before publication, not before staging.");
      }
    });
  }

  if (row.repetitionCount !== undefined && typeof row.repetitionCount !== "number") {
    fail("repetitionCount", "Must be a number if present — never a guessed value.");
  }

  if (issues.length > 0) return { issues, warnings };

  return {
    issues: [],
    warnings,
    value: {
      importIdentifier: row.importIdentifier as string,
      // Safe: any undefined resolvedCollectionSlug would have added a
      // blocking issue above, causing the early `issues.length > 0` return.
      collectionSlug: resolvedCollectionSlug as string,
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
