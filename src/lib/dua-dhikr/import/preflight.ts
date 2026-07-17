/**
 * Duʿa & Dhikr — content preflight validator.
 *
 * Read-only. Never imports `@/sanity/lib/write-client` or any Sanity
 * client, never makes a network call, never requires `SANITY_API_TOKEN` —
 * this module only ever reads the rows already parsed from a JSON file in
 * memory. It exists so the real content document can be assessed, as many
 * times as needed, before a single write is ever considered.
 *
 * "Ready to stage" (see ImportEligibility) means the row is structurally
 * complete enough to become a `duaDhikrEntry` document at `reviewStatus:
 * "sourced"` — it does NOT mean the content is scholarly-verified or
 * publishable. Every staged entry still requires editorial review and
 * independent scholarly review before either publication pathway in
 * docs/dua-dhikr/REVIEW_BYPASS.md applies.
 *
 * @see docs/dua-dhikr/CONTENT_IMPORT_GUIDE.md
 * @see docs/dua-dhikr/PREFLIGHT_VALIDATION.md
 */

import { validateImportRow, findDuplicateImportIdentifiers, type DuaDhikrImportRow, type ImportRowIssue } from "./schema";
import { findDuplicateCandidates, type DuplicateCandidateGroup } from "./duplicate-detection";

export type ImportEligibility =
  | "ready-to-stage"
  | "ready-after-minor-correction"
  | "requires-source-verification"
  | "duplicate-candidate"
  | "blocked-from-import";

export interface PreflightEntryReport {
  row: number;
  importIdentifier?: string;
  titleOrPurpose: string;
  canonicalCollection?: string;
  errors: ImportRowIssue[];
  warnings: ImportRowIssue[];
  duplicateCandidates: DuplicateCandidateGroup[];
  importEligibility: ImportEligibility;
  /** Always "not-eligible-pending-review" at this stage — see module doc comment. Never set by this validator alone. */
  publicationEligibility: "not-eligible-pending-review";
  nextSteps: string[];
}

export interface PreflightSummary {
  totalEntries: number;
  validEntries: number;
  entriesWithWarnings: number;
  blockedEntries: number;
  duplicateCandidateGroups: number;
  missingSources: number;
  invalidCategories: number;
  missingTranslations: number;
  missingTransliterations: number;
  reviewStateProblems: number;
}

export interface PreflightReport {
  generatedAt: string;
  summary: PreflightSummary;
  entries: PreflightEntryReport[];
}

function classifyEligibility(
  errors: ImportRowIssue[],
  warnings: ImportRowIssue[],
  isDuplicateCandidate: boolean,
): ImportEligibility {
  if (errors.length > 0) return "blocked-from-import";
  if (isDuplicateCandidate) return "duplicate-candidate";
  if (warnings.some((w) => w.field?.includes("verifiedStatus"))) return "requires-source-verification";
  if (warnings.length > 0) return "ready-after-minor-correction";
  return "ready-to-stage";
}

function nextStepsFor(eligibility: ImportEligibility): string[] {
  switch (eligibility) {
    case "blocked-from-import":
      return ["Fix every listed error, then re-run the preflight check."];
    case "duplicate-candidate":
      return ["A human must confirm whether this is a true duplicate, a legitimate reuse, or a transcription error before staging."];
    case "requires-source-verification":
      return ["Open the cited source on its approved domain and confirm it supports this text, then mark the reference verified."];
    case "ready-after-minor-correction":
      return ["Review the warnings below — none block staging, but each should be a deliberate decision, not an oversight."];
    case "ready-to-stage":
      return [
        "May be staged via `npx tsx scripts/dua-dhikr-import.ts` (dry run first).",
        "Staging is NOT publication — editorial review and independent scholarly review are still required before this entry can be publicly eligible.",
      ];
  }
}

/**
 * Runs every structural check available without touching Sanity. Safe to
 * call as many times as needed against the real content document once it
 * exists, and against fixtures today.
 */
export function runPreflight(rows: unknown[]): PreflightReport {
  const validated = rows.map((row, index) => validateImportRow(row, index));
  const validRows = validated.map((r) => r.value).filter((v): v is DuaDhikrImportRow => !!v);

  const duplicateIdentifiers = new Set(findDuplicateImportIdentifiers(validRows));
  const duplicateGroups = findDuplicateCandidates(validRows);

  // Map each row index (within the *validRows* subsequence) back to its
  // original index in `rows`/`validated`, since findDuplicateCandidates
  // operates only over successfully-validated rows.
  const validRowOriginalIndex: number[] = [];
  validated.forEach((result, originalIndex) => {
    if (result.value) validRowOriginalIndex.push(originalIndex);
  });
  const duplicateGroupsByOriginalIndex = new Map<number, DuplicateCandidateGroup[]>();
  for (const group of duplicateGroups) {
    for (const localIndex of group.rowIndices) {
      const originalIndex = validRowOriginalIndex[localIndex];
      duplicateGroupsByOriginalIndex.set(originalIndex, [
        ...(duplicateGroupsByOriginalIndex.get(originalIndex) ?? []),
        group,
      ]);
    }
  }

  const entries: PreflightEntryReport[] = validated.map((result, index) => {
    const raw = (rows[index] ?? {}) as Record<string, unknown>;
    const importIdentifier = result.value?.importIdentifier ?? (typeof raw.importIdentifier === "string" ? raw.importIdentifier : undefined);
    const errors = [...result.issues];
    if (importIdentifier && duplicateIdentifiers.has(importIdentifier) && result.value) {
      errors.push({ row: index, importIdentifier, field: "importIdentifier", message: "Duplicate importIdentifier within this batch." });
    }
    const rowDuplicateGroups = duplicateGroupsByOriginalIndex.get(index) ?? [];
    const isDuplicateCandidate = rowDuplicateGroups.length > 0;
    const eligibility = classifyEligibility(errors, result.warnings, isDuplicateCandidate);

    return {
      row: index,
      importIdentifier,
      titleOrPurpose:
        (typeof raw.titleEn === "string" && raw.titleEn) ||
        (typeof raw.whatItIsFor === "string" && raw.whatItIsFor) ||
        "(untitled row)",
      canonicalCollection: result.value?.collectionSlug,
      errors,
      warnings: result.warnings,
      duplicateCandidates: rowDuplicateGroups,
      importEligibility: eligibility,
      publicationEligibility: "not-eligible-pending-review",
      nextSteps: nextStepsFor(eligibility),
    };
  });

  const summary: PreflightSummary = {
    totalEntries: entries.length,
    validEntries: entries.filter((e) => e.importEligibility !== "blocked-from-import").length,
    entriesWithWarnings: entries.filter((e) => e.warnings.length > 0).length,
    blockedEntries: entries.filter((e) => e.importEligibility === "blocked-from-import").length,
    duplicateCandidateGroups: duplicateGroups.length,
    missingSources: entries.filter((e) => e.errors.some((i) => i.field === "references")).length,
    invalidCategories: entries.filter((e) => e.errors.some((i) => i.field === "collectionSlug" || i.field === "subcategorySlug")).length,
    missingTranslations: entries.filter((e) => e.errors.some((i) => i.field === "translationEn") || e.warnings.some((i) => i.field === "translationDa")).length,
    missingTransliterations: entries.filter((e) => e.warnings.some((i) => i.field === "transliteration")).length,
    reviewStateProblems: entries.filter((e) => e.warnings.some((i) => i.field?.includes("verifiedStatus") || i.field?.includes("hadithGrading"))).length,
  };

  return { generatedAt: new Date().toISOString(), summary, entries };
}

export function formatPreflightReportText(report: PreflightReport): string {
  const s = report.summary;
  const lines = [
    `Duʿa & Dhikr — content preflight report (${report.generatedAt})`,
    "This is a read-only structural check. It never contacts Sanity.",
    "",
    "Executive summary",
    `  Total entries:              ${s.totalEntries}`,
    `  Valid (not blocked):        ${s.validEntries}`,
    `  Entries with warnings:      ${s.entriesWithWarnings}`,
    `  Blocked entries:            ${s.blockedEntries}`,
    `  Duplicate-candidate groups: ${s.duplicateCandidateGroups}`,
    `  Missing sources:            ${s.missingSources}`,
    `  Invalid categories:         ${s.invalidCategories}`,
    `  Missing translations:       ${s.missingTranslations}`,
    `  Missing transliterations:   ${s.missingTransliterations}`,
    `  Review-state problems:      ${s.reviewStateProblems}`,
    "",
    '"Ready to stage" means structurally complete, NOT scholarship-verified or publishable.',
    "",
  ];
  for (const entry of report.entries) {
    lines.push(`Row ${entry.row} — ${entry.titleOrPurpose} [${entry.importIdentifier ?? "no id"}]`);
    lines.push(`  Collection: ${entry.canonicalCollection ?? "(unresolved)"}`);
    lines.push(`  Decision: ${entry.importEligibility}`);
    for (const e of entry.errors) lines.push(`  ERROR   ${e.field ? `${e.field}: ` : ""}${e.message}`);
    for (const w of entry.warnings) lines.push(`  WARNING ${w.field ? `${w.field}: ` : ""}${w.message}`);
    for (const d of entry.duplicateCandidates) lines.push(`  DUPLICATE (${d.reason}) with row(s) ${d.rowIndices.filter((r) => r !== entry.row).join(", ")}: ${d.note}`);
    for (const step of entry.nextSteps) lines.push(`  → ${step}`);
    lines.push("");
  }
  return lines.join("\n");
}

export function formatPreflightReportJson(report: PreflightReport): string {
  return JSON.stringify(report, null, 2);
}
