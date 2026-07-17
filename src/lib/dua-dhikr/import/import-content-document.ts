/**
 * Duʿā & Dhikr content-document import.
 *
 * Reads a JSON array of rows matching docs/dua-dhikr/CONTENT_IMPORT_TEMPLATE.md,
 * validates every row (src/lib/dua-dhikr/import/schema.ts), and — only in
 * `--live` mode — writes each valid row as a `duaDhikrEntry` Sanity
 * document via the write-token client.
 *
 * Follows the same safe upsert pattern as the existing Dhikr import
 * (src/lib/dhikr-research/import/import-approved-records.ts):
 * `createIfNotExists` seeds `reviewStatus: "sourced"` and an empty
 * `editorialPublicationStatus` ONLY the first time a document is created,
 * then a separate `.patch(id).set(contentFields).commit()` updates only
 * the content fields this import owns (title, Arabic, translations,
 * guidance, references, provenance) on every run. Re-running an import
 * batch therefore never resets `reviewStatus`, `boardApprovals`, or
 * `editorialPublicationStatus` that a human reviewer has since advanced in
 * Studio — see docs/dua-dhikr/CONTENT_IMPORT_GUIDE.md, "Rollback procedure".
 *
 * @see docs/dua-dhikr/CONTENT_IMPORT_GUIDE.md
 */

import { writeClient } from "@/sanity/lib/write-client";
import { validateImportRow, findDuplicateImportIdentifiers, type DuaDhikrImportRow, type ImportRowIssue } from "./schema";

export interface ImportRunOptions {
  rows: unknown[];
  dryRun: boolean;
}

export interface ImportRunEntryResult {
  importIdentifier?: string;
  documentId?: string;
  outcome: "would-write" | "written" | "skipped-invalid" | "skipped-duplicate-in-batch";
  issues: ImportRowIssue[];
}

export interface ImportRunReport {
  dryRun: boolean;
  generatedAt: string;
  totalRows: number;
  valid: number;
  invalid: number;
  entries: ImportRunEntryResult[];
}

function documentIdFor(importIdentifier: string): string {
  return `duaDhikrEntry-${importIdentifier.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;
}

/**
 * Content fields this import owns — written on every run via `.patch().set()`.
 * Deliberately excludes reviewStatus, boardApprovals, and
 * editorialPublicationStatus, which only `createIfNotExists` ever seeds
 * (at creation time only) and a human otherwise controls exclusively
 * through Sanity Studio thereafter.
 *
 * `collections` requires the real Sanity document _id for the referenced
 * duaDhikrCollection, not its slug — callers resolve this by looking up the
 * collection document by slug immediately before writing (see
 * runDuaDhikrImport) and pass it in as `collectionDocumentId`.
 */
function toOwnedContentFields(row: DuaDhikrImportRow, collectionDocumentId: string) {
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
    virtueText: row.virtue,
    explanationText: row.explanation,
    authenticationNote: row.authenticationNote,
    sourceReferences: row.references.map((ref, index) => ({
      _type: "sourceReference",
      _key: `import-ref-${index}`,
      ...ref,
    })),
    importIdentifier: row.importIdentifier,
    contentProvenance: {
      _type: "provenanceNote",
      note: `Imported by scripts/dua-dhikr-import.ts on ${new Date().toISOString()}.`,
    },
  };
}

export async function runDuaDhikrImport({ rows, dryRun }: ImportRunOptions): Promise<ImportRunReport> {
  const validated = rows.map((row, index) => validateImportRow(row, index));
  const validRows = validated.map((r) => r.value).filter((v): v is DuaDhikrImportRow => !!v);
  const duplicates = new Set(findDuplicateImportIdentifiers(validRows));

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

    const fields = toOwnedContentFields(result.value, collectionId);
    await writeClient.createIfNotExists({
      _id: documentId,
      _type: "duaDhikrEntry",
      internalTitle: `${result.value.titleEn} (imported ${result.value.importIdentifier})`,
      reviewStatus: "sourced",
      editorialPublicationStatus: "",
      ...fields,
    });
    await writeClient.patch(documentId).set(fields).commit();
    entries.push({ importIdentifier: result.value.importIdentifier, documentId, outcome: "written", issues: [] });
  }

  return {
    dryRun,
    generatedAt: new Date().toISOString(),
    totalRows: rows.length,
    valid: entries.filter((e) => e.outcome === "written" || e.outcome === "would-write").length,
    invalid: entries.filter((e) => e.outcome === "skipped-invalid" || e.outcome === "skipped-duplicate-in-batch").length,
    entries,
  };
}

export function formatImportReport(report: ImportRunReport): string {
  const lines = [
    `Duʿā & Dhikr import — ${report.dryRun ? "DRY RUN" : "LIVE"} (${report.generatedAt})`,
    `Total rows: ${report.totalRows} · Valid: ${report.valid} · Invalid/skipped: ${report.invalid}`,
    "",
  ];
  for (const entry of report.entries) {
    lines.push(`- [${entry.outcome}] ${entry.importIdentifier ?? "(unidentified row)"}${entry.documentId ? ` → ${entry.documentId}` : ""}`);
    for (const issue of entry.issues) {
      lines.push(`    ${issue.field ? `${issue.field}: ` : ""}${issue.message}`);
    }
  }
  return lines.join("\n");
}
