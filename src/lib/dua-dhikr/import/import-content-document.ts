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
 * Collection references: every row's `collectionSlug` is resolved to a
 * Sanity `duaDhikrCollection` _id via `resolveCanonicalCollectionId()`,
 * which reads through `publishedReadClient` (perspective: "published")
 * and refuses anything that isn't the deterministic canonical root id
 * (`duaDhikrCollection-{slug}`) with a matching slug — a `drafts.`- or
 * `versions.`-prefixed id is never written into an entry reference. This
 * resolution is read-only and runs in BOTH dry-run and live mode, so a dry
 * run's report reflects exactly what a live run would do or refuse to do.
 *
 * @see docs/dua-dhikr/CONTENT_IMPORT_GUIDE.md
 */

import { writeClient } from "@/sanity/lib/write-client";
import { publishedReadClient } from "@/sanity/lib/client";
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
  /**
   * Injectable collection resolver — defaults to `resolveCanonicalCollectionId`
   * (a real, read-only Sanity fetch via `publishedReadClient`). Tests pass a
   * fake resolver so the pipeline stays network-free; production code should
   * never override this.
   */
  resolveCollectionId?: (slug: string) => Promise<CollectionResolution>;
}

export interface CollectionResolution {
  slug: string;
  /**
   * "resolved": a published duaDhikrCollection with this exact slug exists
   * at its deterministic canonical `_id` — safe to reference.
   * "missing": no published document has this slug.
   * "draft-only": resolution surfaced a `drafts.`-prefixed id — refused.
   * "version-only": resolution surfaced a `versions.`-prefixed id — refused.
   * "slug-mismatch": the resolved document's own slug field disagrees.
   * "invalid-reference-id": the resolved id isn't the deterministic
   * `duaDhikrCollection-{slug}` form — refused rather than trusted blindly.
   */
  status: "resolved" | "missing" | "draft-only" | "version-only" | "slug-mismatch" | "invalid-reference-id";
  resolvedId?: string;
}

export interface ImportRunEntryResult {
  importIdentifier?: string;
  documentId?: string;
  outcome: "would-write" | "written" | "skipped-invalid" | "skipped-duplicate-in-batch" | "skipped-batch-aborted";
  issues: ImportRowIssue[];
  /** Present once collection resolution has been attempted for this row (dry run or live). */
  collectionResolution?: CollectionResolution;
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

export function canonicalCollectionIdFor(slug: string): string {
  return `duaDhikrCollection-${slug}`;
}

/**
 * Resolves a collectionSlug to a stable, safe-to-reference duaDhikrCollection
 * _id — read-only, via publishedReadClient (perspective: "published"), so a
 * draft-only collection is never even seen by this query. Refuses (rather
 * than trusts) anything that isn't the deterministic canonical root id with
 * a matching slug — defense-in-depth beyond perspective filtering alone, in
 * case Sanity ever surfaces a `versions.`-prefixed id under this
 * perspective (the newer Content Releases model). Never mutates. Run
 * during BOTH dry run and live mode, so a dry run genuinely reports what a
 * live run would do — see runDuaDhikrImport.
 */
async function resolveCanonicalCollectionId(slug: string): Promise<CollectionResolution> {
  const doc = await publishedReadClient.fetch<{ _id: string; slug?: string } | null>(
    `*[_type == "duaDhikrCollection" && slug.current == $slug][0]{ _id, "slug": slug.current }`,
    { slug },
  );

  if (!doc) return { slug, status: "missing" };
  if (doc._id.startsWith("drafts.")) return { slug, status: "draft-only", resolvedId: doc._id };
  if (doc._id.startsWith("versions.")) return { slug, status: "version-only", resolvedId: doc._id };
  if (doc.slug !== slug) return { slug, status: "slug-mismatch", resolvedId: doc._id };
  if (doc._id !== canonicalCollectionIdFor(slug)) return { slug, status: "invalid-reference-id", resolvedId: doc._id };
  return { slug, status: "resolved", resolvedId: doc._id };
}

function collectionResolutionFailureMessage(resolution: CollectionResolution): string {
  switch (resolution.status) {
    case "missing":
      return `No published duaDhikrCollection document exists yet for slug "${resolution.slug}". Publish it first (see docs/dua-dhikr/CONTENT_MODEL.md).`;
    case "draft-only":
      return `duaDhikrCollection for slug "${resolution.slug}" only resolved to a draft (${resolution.resolvedId}) — refusing to reference a draft. Publish the collection first.`;
    case "version-only":
      return `duaDhikrCollection for slug "${resolution.slug}" resolved to a version-scoped id (${resolution.resolvedId}) — refusing to reference it. Use the published root document.`;
    case "slug-mismatch":
      return `duaDhikrCollection resolved for slug "${resolution.slug}" but its own slug field disagrees — refusing to reference a possibly-wrong document (${resolution.resolvedId}).`;
    case "invalid-reference-id":
      return `duaDhikrCollection resolved for slug "${resolution.slug}" to "${resolution.resolvedId}", which is not the deterministic canonical id "${canonicalCollectionIdFor(resolution.slug)}" — refusing to reference it.`;
    case "resolved":
      return "";
  }
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

export async function runDuaDhikrImport({ rows, dryRun, allowPartialBatch = false, resolveCollectionId = resolveCanonicalCollectionId }: ImportRunOptions): Promise<ImportRunReport> {
  const validated = rows.map((row, index) => validateImportRow(row, index));
  const validRows = validated.map((r) => r.value).filter((v): v is DuaDhikrImportRow => !!v);
  const duplicates = new Set(findDuplicateImportIdentifiers(validRows));

  const hasBlockingRow = validated.some((r) => !r.value) || validRows.some((row) => duplicates.has(row.importIdentifier));
  const abortBatch = !dryRun && hasBlockingRow && !allowPartialBatch;

  const entries: ImportRunEntryResult[] = [];
  const collectionResolutionCache = new Map<string, CollectionResolution>();

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

    // Collection resolution is READ-ONLY (publishedReadClient.fetch only) and
    // runs identically in dry-run and live mode, so a dry run genuinely
    // reports what a live run would do instead of silently skipping past it.
    if (!collectionResolutionCache.has(result.value.collectionSlug)) {
      collectionResolutionCache.set(result.value.collectionSlug, await resolveCollectionId(result.value.collectionSlug));
    }
    const collectionResolution = collectionResolutionCache.get(result.value.collectionSlug)!;

    if (collectionResolution.status !== "resolved") {
      entries.push({
        importIdentifier: result.value.importIdentifier,
        documentId,
        outcome: "skipped-invalid",
        collectionResolution,
        issues: [{ row: i, importIdentifier: result.value.importIdentifier, field: "collectionSlug", message: collectionResolutionFailureMessage(collectionResolution) }],
      });
      continue;
    }

    if (dryRun) {
      entries.push({ importIdentifier: result.value.importIdentifier, documentId, outcome: "would-write", collectionResolution, issues: [] });
      continue;
    }

    if (abortBatch) {
      entries.push({
        importIdentifier: result.value.importIdentifier,
        documentId,
        outcome: "skipped-batch-aborted",
        collectionResolution,
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

    const collectionId = collectionResolution.resolvedId!;
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
    entries.push({ importIdentifier: result.value.importIdentifier, documentId, outcome: "written", collectionResolution, issues: [] });
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
    if (entry.collectionResolution) {
      const r = entry.collectionResolution;
      lines.push(`    collection "${r.slug}": ${r.status}${r.resolvedId ? ` (${r.resolvedId})` : ""}`);
    }
    for (const issue of entry.issues) {
      lines.push(`    ${issue.field ? `${issue.field}: ` : ""}${issue.message}`);
    }
  }
  return lines.join("\n");
}
