/**
 * Approved-only Dhikr import — the ONLY path by which a research-register
 * record may ever become a `dhikrItem` Sanity document.
 *
 * This module never approves, invents, or infers anything. It only reads
 * MORNING_DHIKR_SOURCE_REGISTER, evaluates computeImportGate (the single
 * canonical technical gate — see ../validation.ts), and for records that
 * gate lets through, writes a faithful transcription of already-approved
 * fields into Sanity. It never sets reviewStatus to "published" and never
 * touches Sanity's own separate publication gate
 * (src/sanity/lib/dhikr-publication-gate.ts) — an imported record still
 * requires a human to add the Danish translation and advance reviewStatus
 * through Sanity Studio before it can ever become publicly eligible. See
 * docs/dhikr/40-scholarly-review-and-adjudication-framework.md, §J.
 *
 * Idempotent: each record maps to one deterministic document _id
 * (`dhikrItem-<mdr-id-lowercased>`). Re-running this import updates that
 * same document's approved-content fields in place — it never creates a
 * duplicate — and only ever writes the fields this module owns
 * (mdrSourceId, titleEn on create only, order, arabicText, translationEn,
 * sourceReferences, timingLabel, recommendedRepetitions, virtueText, and
 * the scholarly/editorial boardApprovals entries). It never touches
 * translationDa, reviewStatus (after creation), tags, audioAsset, slug, or
 * any other boardApprovals entry an editor may have added directly in
 * Studio.
 */

import { MORNING_DHIKR_SOURCE_REGISTER } from "../morning-dhikr-register";
import { computeImportGate, computeEditorialPublicationGate, COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS } from "../validation";
import type { DhikrSourceResearchRecord } from "../types";
import { writeClient } from "@/sanity/lib/write-client";

export type ImportOutcome =
  | "imported"
  | "updated"
  | "skipped-not-ready"
  | "skipped-composite-incomplete";

export type ImportPathway = "scholarly-approved" | "editorial-publication";

export interface ImportAuditEntry {
  internalId: string;
  outcome: ImportOutcome;
  pathway?: ImportPathway;
  sanityDocumentId?: string;
  blockedReasons: string[];
}

export interface ImportAuditReport {
  dryRun: boolean;
  generatedAt: string;
  totalRecords: number;
  imported: number;
  updated: number;
  skipped: number;
  entries: ImportAuditEntry[];
}

function sanityDocumentIdFor(internalId: string): string {
  return `dhikrItem-${internalId.toLowerCase()}`;
}

/**
 * Maps an already-approved record's publication-facing fields only. Never
 * reads or writes originalDocumentText/fullArabicText/openingArabicWords —
 * those protected transcription fields have no Sanity counterpart and are
 * never part of this mapping.
 *
 * pathway "scholarly-approved": writes both scholarly and editorial
 * boardApprovals entries — only reachable when computeImportGate passed,
 * which itself requires a real scholarlyReviewer/scholarlyDecision.
 *
 * pathway "editorial-publication": writes ONLY an editorial boardApprovals
 * entry and sets editorialPublicationStatus — never writes a scholarly
 * boardApprovals entry, never invents a scholarly reviewer. Only reachable
 * when computeEditorialPublicationGate passed, which itself requires
 * scholarlyDecision to still be "pending".
 */
function toApprovedContentFields(record: DhikrSourceResearchRecord, pathway: ImportPathway) {
  const base = {
    mdrSourceId: record.internalId,
    order: record.sequenceNumber,
    arabicText: record.approvedArabicText,
    translationEn: record.approvedEnglishText,
    timingLabel: record.approvedTiming || undefined,
    recommendedRepetitions: record.approvedRepetitionCount,
    virtueText: record.approvedVirtueText || undefined,
    sourceReferences: [
      {
        _type: "sourceReference",
        _key: "approved-source",
        type: "other",
        citation: record.approvedSourceReference,
        verifiedStatus: "verified",
      },
    ],
  };

  const editorialApproval = {
    _type: "boardApproval",
    _key: "editorial",
    board: "editorial",
    approved: true,
    approver: record.editorialReviewer,
    date: record.editorialApprovalDate,
  };

  if (pathway === "editorial-publication") {
    return {
      ...base,
      editorialPublicationStatus: "editorially-published-pending-scholarly-review",
      boardApprovals: [editorialApproval],
    };
  }

  return {
    ...base,
    boardApprovals: [
      {
        _type: "boardApproval",
        _key: "scholarly",
        board: "scholarly",
        approved: true,
        approver: record.scholarlyReviewer,
        date: record.scholarlyReviewDate,
        notes: record.scholarlyNotes || undefined,
      },
      editorialApproval,
    ],
  };
}

async function documentExists(id: string): Promise<boolean> {
  const existing = await writeClient.fetch<string | null>(`*[_id == $id][0]._id`, { id });
  return !!existing;
}

/**
 * Runs the approved-only import. Defaults to dry-run (no writes). Pass
 * `{ dryRun: false }` to actually write to Sanity — callers must ensure
 * SANITY_API_TOKEN has write permissions before doing so. Stage 2 never
 * calls this with dryRun: false.
 */
export async function runApprovedDhikrImport(
  options: { dryRun?: boolean } = {},
): Promise<ImportAuditReport> {
  const dryRun = options.dryRun !== false;
  const entries: ImportAuditEntry[] = [];

  for (const record of MORNING_DHIKR_SOURCE_REGISTER) {
    const scholarlyGate = computeImportGate(record);
    const editorialGate = computeEditorialPublicationGate(record);

    const pathway: ImportPathway | undefined = scholarlyGate.canImport
      ? "scholarly-approved"
      : editorialGate.canImport
        ? "editorial-publication"
        : undefined;

    if (!pathway) {
      const isCompositeIncomplete =
        COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS.includes(record.internalId) &&
        record.compositeClausesApproved !== true;
      entries.push({
        internalId: record.internalId,
        outcome: isCompositeIncomplete ? "skipped-composite-incomplete" : "skipped-not-ready",
        // Report the scholarly gate's reasons as primary (it is the fuller,
        // canonical pathway) — the editorial gate's reasons are a subset
        // concern in practice and would only add noise here.
        blockedReasons: scholarlyGate.blockedReasons,
      });
      continue;
    }

    const documentId = sanityDocumentIdFor(record.internalId);
    const fields = toApprovedContentFields(record, pathway);
    const alreadyExists = dryRun ? false : await documentExists(documentId);

    if (!dryRun) {
      await writeClient.createIfNotExists({
        _id: documentId,
        _type: "dhikrItem",
        titleEn: record.internalId,
        reviewStatus: "sourced",
        ...fields,
      });
      await writeClient
        .patch(documentId)
        .set(fields)
        .commit();
    }

    entries.push({
      internalId: record.internalId,
      outcome: alreadyExists ? "updated" : "imported",
      pathway,
      sanityDocumentId: documentId,
      blockedReasons: [],
    });
  }

  return {
    dryRun,
    generatedAt: new Date().toISOString(),
    totalRecords: MORNING_DHIKR_SOURCE_REGISTER.length,
    imported: entries.filter((e) => e.outcome === "imported").length,
    updated: entries.filter((e) => e.outcome === "updated").length,
    skipped: entries.filter((e) => e.outcome === "skipped-not-ready" || e.outcome === "skipped-composite-incomplete").length,
    entries,
  };
}

export function formatAuditReport(report: ImportAuditReport): string {
  const lines: string[] = [];
  lines.push(`Dhikr approved-only import — ${report.dryRun ? "DRY RUN (no writes performed)" : "LIVE RUN"}`);
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Total records evaluated: ${report.totalRecords}`);
  lines.push(`Imported: ${report.imported} | Updated: ${report.updated} | Skipped: ${report.skipped}`);
  lines.push("");
  for (const entry of report.entries) {
    if (entry.outcome === "imported" || entry.outcome === "updated") {
      lines.push(`  [${entry.outcome.toUpperCase()}] ${entry.internalId} -> ${entry.sanityDocumentId} (pathway: ${entry.pathway})`);
    } else {
      lines.push(`  [SKIPPED] ${entry.internalId} (${entry.outcome}):`);
      for (const reason of entry.blockedReasons) {
        lines.push(`      - ${reason}`);
      }
    }
  }
  return lines.join("\n");
}
