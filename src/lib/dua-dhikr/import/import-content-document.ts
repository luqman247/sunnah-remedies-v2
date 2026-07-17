/**
 * Duʿa & Dhikr content-document import.
 *
 * Reads a JSON array of rows matching docs/dua-dhikr/CONTENT_IMPORT_TEMPLATE.md,
 * validates every row (src/lib/dua-dhikr/import/schema.ts), and — only in
 * `--live` mode, only via scripts/dua-dhikr-import.ts's `--live
 * --confirm-write --dataset <name>` gate — writes each valid row as a
 * `duaDhikrEntry` Sanity document via the write-token client.
 *
 * Fail-closed by default: if ANY row in the batch has a blocking error,
 * the entire batch is aborted with zero writes (see `allowPartialBatch`).
 * A human must fix every error, or explicitly opt in to a partial batch,
 * before anything is written.
 *
 * Follows the same safe upsert pattern as the existing Dhikr import
 * (src/lib/dhikr-research/import/import-approved-records.ts), extended
 * with an explicit split between fields import always re-syncs and fields
 * it only ever fills in once:
 *
 * - `createIfNotExists` seeds `reviewStatus: "sourced"` and an empty
 *   `editorialPublicationStatus` ONLY the first time a document is
 *   created — reviewStatus/boardApprovals/editorialPublicationStatus are
 *   NEVER touched by any later re-import.
 * - ALWAYS-RESYNCED fields (`toAlwaysSyncedFields`) are the plain
 *   transcription of the source document — title, Arabic, translations,
 *   transliteration, repetition, timing, collection/subcategory — and are
 *   re-applied via `.set()` on every run, since these are meant to mirror
 *   the source document exactly.
 * - PRESERVE-IF-PRESENT fields (`toPreserveIfPresentFields`) are editorial
 *   elaboration a human is expected to refine after import — virtue text,
 *   explanation, authentication note, source references, and content
 *   provenance — and are applied via `.setIfMissing()`, so a human's
 *   correction in Studio (e.g. a fixed source reference, an added
 *   explanation) is never silently overwritten by a later re-import of the
 *   same row. See docs/dua-dhikr/CONTENT_IMPORT_GUIDE.md, "Rollback
 *   procedure" and "Human-review preservation".
 *
 * @see docs/dua-dhikr/CONTENT_IMPORT_GUIDE.md
 */

import { writeClient } from "@/sanity/lib/write-client";
import { validateImportRow, findDuplicateImportIdentifiers, type DuaDhikrImportRow, type ImportRowIssue } from "./schema";

export interface ImportRunOptions {
  rows: unknown[];
  dryRun: boolean;
  /**
   * When false (the default), a batch containing ANY row with a blocking
   * error writes nothing at all, even for the rows that were individually
   * valid — "partial validation failure prevents all writes by default".
   * Set true only to deliberately stage the valid subset of a batch that
   * has known-bad rows still being fixed.
   */
  allowPartialBatch?: boolean;
}

export interface ImportRunEntryResult {
  importIdentifier?: string;
  documentId?: string;
  outcome: "would-write" | "written" | "skipped-invalid" | "skipped-duplicate-in-batch" | "skipped-batch-aborted";
  issues: ImportRowIssue[];
}

export interface ImportRunReport {
  dryRun: boolean;
  generatedAt: string;
  totalRows: number;
  valid: number;
  invalid: number;
  /** True when the whole batch was refused because it contained blocking errors and allowPartialBatch was not set. */
  abortedDueToPartialFailure: boolean;
  entries: ImportRunEntryResult[];
}

function documentIdFor(importIdentifier: string): string {
  return `duaDhikrEntry-${importIdentifier.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;
}

/**
 * The plain transcription of the source document — re-applied on every
 * import run regardless of what a human has since done in Studio, since
 * these fields are meant to always mirror the source document.
 *
 * `collections` requires the real Sanity document _id for the referenced
 * duaDhikrCollection, not its slug — callers resolve this by looking up the
 * collection document by slug immediately before writing (see
 * runDuaDhikrImport) and pass it in as `collectionDocumentId`.
 */
function toAlwaysSyncedFields(row: DuaDhikrImportRow, collectionDocumentId: string) {
  return {
    titleEn: row.titleEn,
    titleDa: row.titleDa,
    collections: [{ _type: "reference", _key: `collection-${row.collectionSlug}`, _ref: collectionDocumentId }],
    subcategorySlugs: row.subcategorySlug ? [row.subcategorySlug] : undefined,
    whatItIsFor: row.whatItIsFor,
    arabicText: row.arabicText,
    transliteration: row.transliteration,
    translationEn: row.translationEn,
    translationDa: row.translationDa,
    recommendedRepetitions: row.repetitionCount,
    timingLabel: row.timingLabel,
    occasion: row.occasion,
    instructionText: row.instruction,
    importIdentifier: row.importIdentifier,
  };
}

/**
 * Editorial elaboration a human is expected to refine after import.
 * Applied with `.setIfMissing()` only — once any of these fields is
 * non-empty on the document (whether from the very first import or from a
 * human edit in Studio), re-running import never touches it again. This is
 * what makes re-import safe to run repeatedly without clobbering a
 * reviewer's corrections.
 */
function toPreserveIfPresentFields(row: DuaDhikrImportRow) {
  return {
    virtueText: row.virtue,
    explanationText: row.explanation,
    authenticationNote: row.authenticationNote,
    sourceReferences: row.references.map((ref, index) => ({
      _type: "sourceReference",
      _key: `import-ref-${index}`,
      ...ref,
    })),
    contentProvenance: {
      _type: "provenanceNote",
      note: `Imported by scripts/dua-dhikr-import.ts on ${new Date().toISOString()}.`,
    },
  };
}

export async function runDuaDhikrImport({ rows, dryRun, allowPartialBatch = false }: ImportRunOptions): Promise<ImportRunReport> {
  const validated = rows.map((row, index) => validateImportRow(row, index));
  const validRows = validated.map((r) => r.value).filter((v): v is DuaDhikrImportRow => !!v);
  const duplicates = new Set(findDuplicateImportIdentifiers(validRows));

  const hasBlockingRow = validated.some((r) => !r.value) || validRows.some((row) => duplicates.has(row.importIdentifier));
  const abortBatch = !dryRun && hasBlockingRow && !allowPartialBatch;

  const entries: ImportRunEntryResult[] = [];
  const collectionIdCache = new Map<string, string | undefined>();

  for (let i = 0; i < validated.length; i++) {
    const result = validated[i];
    if (!result.value) {
      entries.push({ outcome: "skipped-invalid", issues: result.issues });
      continue;
    }
    if (duplicates.has(result.value.importIdentifier)) {
      entries.push({
        importIdentifier: result.value.importIdentifier,
        outcome: "skipped-duplicate-in-batch",
        issues: [{ row: i, importIdentifier: result.value.importIdentifier, message: "Duplicate importIdentifier within this batch." }],
      });
      continue;
    }

    const documentId = documentIdFor(result.value.importIdentifier);

    if (dryRun) {
      entries.push({ importIdentifier: result.value.importIdentifier, documentId, outcome: "would-write", issues: [] });
      continue;
    }

    if (abortBatch) {
      entries.push({
        importIdentifier: result.value.importIdentifier,
        documentId,
        outcome: "skipped-batch-aborted",
        issues: [
          {
            row: i,
            importIdentifier: result.value.importIdentifier,
            message: "Batch contains other rows with blocking errors; nothing in this batch was written. Fix every error, or pass allowPartialBatch to stage only the valid rows.",
          },
        ],
      });
      continue;
    }

    if (!collectionIdCache.has(result.value.collectionSlug)) {
      const collectionDoc = await writeClient.fetch<{ _id: string } | null>(
        `*[_type == "duaDhikrCollection" && slug.current == $slug][0]{ _id }`,
        { slug: result.value.collectionSlug },
      );
      collectionIdCache.set(result.value.collectionSlug, collectionDoc?._id);
    }
    const collectionId = collectionIdCache.get(result.value.collectionSlug);

    if (!collectionId) {
      entries.push({
        importIdentifier: result.value.importIdentifier,
        documentId,
        outcome: "skipped-invalid",
        issues: [
          {
            row: i,
            importIdentifier: result.value.importIdentifier,
            field: "collectionSlug",
            message: `No duaDhikrCollection document exists yet for slug "${result.value.collectionSlug}". Create it in Studio first (see docs/dua-dhikr/CONTENT_MODEL.md).`,
          },
        ],
      });
      continue;
    }

    const alwaysSynced = toAlwaysSyncedFields(result.value, collectionId);
    const preserveIfPresent = toPreserveIfPresentFields(result.value);
    await writeClient.createIfNotExists({
      _id: documentId,
      _type: "duaDhikrEntry",
      internalTitle: `${result.value.titleEn} (imported ${result.value.importIdentifier})`,
      reviewStatus: "sourced",
      editorialPublicationStatus: "",
      ...alwaysSynced,
      ...preserveIfPresent,
    });
    await writeClient.patch(documentId).set(alwaysSynced).setIfMissing(preserveIfPresent).commit();
    entries.push({ importIdentifier: result.value.importIdentifier, documentId, outcome: "written", issues: [] });
  }

  return {
    dryRun,
    generatedAt: new Date().toISOString(),
    totalRows: rows.length,
    valid: entries.filter((e) => e.outcome === "written" || e.outcome === "would-write").length,
    invalid: entries.filter((e) => e.outcome !== "written" && e.outcome !== "would-write").length,
    abortedDueToPartialFailure: abortBatch,
    entries,
  };
}

export function formatImportReport(report: ImportRunReport): string {
  const lines = [
    `Duʿa & Dhikr import — ${report.dryRun ? "DRY RUN" : "LIVE"} (${report.generatedAt})`,
    `Total rows: ${report.totalRows} · Valid: ${report.valid} · Invalid/skipped: ${report.invalid}`,
  ];
  if (report.abortedDueToPartialFailure) {
    lines.push("BATCH ABORTED: this batch contained blocking errors and was not written. Fix every error, or re-run with --allow-partial to stage only the valid rows.");
  }
  lines.push("");
  for (const entry of report.entries) {
    lines.push(`- [${entry.outcome}] ${entry.importIdentifier ?? "(unidentified row)"}${entry.documentId ? ` → ${entry.documentId}` : ""}`);
    for (const issue of entry.issues) {
      lines.push(`    ${issue.field ? `${issue.field}: ` : ""}${issue.message}`);
    }
  }
  return lines.join("\n");
}
