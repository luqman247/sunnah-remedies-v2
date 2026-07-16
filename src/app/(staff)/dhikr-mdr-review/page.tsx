import type { Metadata } from "next";
import { MORNING_DHIKR_SOURCE_REGISTER } from "@/lib/dhikr-research/morning-dhikr-register";
import { computeImportGate, COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS } from "@/lib/dhikr-research/validation";
import { MdrReviewWorkbench, type MdrWorkbenchRecord } from "./MdrReviewWorkbench";

export const metadata: Metadata = {
  title: "Dhikr — MDR Scholarly Review Workbench",
  robots: { index: false, follow: false },
};

/**
 * MDR Scholarly Review Workbench — Stage 2 admin/review workflow.
 *
 * Staff-only (see middleware.ts), absent from public/main navigation,
 * noindex. This is deliberately a drafting aid, not a system of record: it
 * displays each research-register record's protected transcription
 * read-only, alongside a client-side-only draft form for composing a
 * proposed decision. Nothing typed here is persisted anywhere — there is
 * no server action, no API route, and no write path into the register, into
 * Sanity, or into any database. A reviewer's actual, binding decision is
 * only ever recorded by a human transcribing it into a completed
 * MDR Scholarly Decision Record (docs/dhikr/review/MDR-SCHOLARLY-DECISION-
 * RECORD-TEMPLATE.md) and committing a register change through this
 * project's standing checkpoint discipline — this page cannot skip that
 * step, and does not attempt to.
 *
 * @see docs/dhikr/40-scholarly-review-and-adjudication-framework.md
 * @see docs/dhikr/review/MDR-001-030-rapid-approval-pack.md
 */
export default function DhikrMdrReviewPage() {
  const records: MdrWorkbenchRecord[] = MORNING_DHIKR_SOURCE_REGISTER.map((record) => {
    const gate = computeImportGate(record);
    return {
      internalId: record.internalId,
      sequenceNumber: record.sequenceNumber,
      openingArabicWords: record.openingArabicWords,
      fullArabicText: record.fullArabicText,
      originalDocumentText: record.originalDocumentText,
      sourceDocumentAnnotations: record.sourceDocumentAnnotations,
      transcriptionStatus: record.transcriptionStatus,
      sourceResearchStatus: record.sourceResearchStatus,
      contentClassification: record.contentClassification,
      morningSpecificStatus: record.morningSpecificStatus,
      primaryReference: record.primaryReference,
      narrator: record.narrator,
      hadithGrading: record.hadithGrading,
      wordingMatchStatus: record.wordingMatchStatus,
      repetitionCount: record.repetitionCount,
      virtueOrRewardClaim: record.virtueOrRewardClaim,
      scholarlyDecision: record.scholarlyDecision,
      editorialApproval: record.editorialApproval,
      importStatus: record.importStatus,
      isComposite: COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS.includes(record.internalId),
      canImport: gate.canImport,
      blockedReasons: gate.blockedReasons,
    };
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div
        className="mb-8 border border-[#8A5A2B] bg-[#8A5A2B]/5 px-4 py-3"
        role="note"
      >
        <p className="font-[family-name:var(--font-utility)] text-xs font-medium uppercase tracking-widest text-[#8A5A2B]">
          Internal — not indexed
        </p>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#0E3B2E]/80 mt-1 leading-relaxed">
          Drafting aid only. Nothing entered on this page is saved, imported, or approved.
          Protected transcription is read-only and cannot be edited here. A real decision is only
          recorded by transcribing a completed decision record into the register via a separate,
          explicitly-approved commit.
        </p>
      </div>

      <header className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-light text-[#0E3B2E] mb-2">
          MDR Scholarly Review Workbench
        </h1>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#0E3B2E]/70 leading-relaxed max-w-2xl">
          Select a record to see its protected transcription and current import-gate status, and to
          draft a proposed decision. Use the generated text as a starting point for a completed
          MDR Scholarly Decision Record (docs/dhikr/review/MDR-SCHOLARLY-DECISION-RECORD-TEMPLATE.md)
          — this workbench does not create one for you.
        </p>
      </header>

      <MdrReviewWorkbench records={records} />
    </main>
  );
}
