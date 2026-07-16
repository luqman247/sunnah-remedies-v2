import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import { MORNING_DHIKR_SOURCE_REGISTER } from "@/lib/dhikr-research/morning-dhikr-register";
import { computeImportGate, COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS } from "@/lib/dhikr-research/validation";
import { MDR_003_CLAUSE_MAP } from "@/lib/dhikr-research/audits/mdr-003-clause-map";
import { MDR_004_CLAUSE_MAP } from "@/lib/dhikr-research/audits/mdr-004-clause-map";
import { MDR_005_CLAUSE_MAP } from "@/lib/dhikr-research/audits/mdr-005-clause-map";
import { MDR_029_CLAUSE_MAP } from "@/lib/dhikr-research/audits/mdr-029-clause-map";
import { loadAllDrafts } from "./actions";
import { MdrReviewWorkbench, type MdrWorkbenchRecord, type MdrWorkbenchClause } from "./MdrReviewWorkbench";

export const metadata: Metadata = {
  title: "Dhikr — MDR Scholarly Review Workbench",
  robots: { index: false, follow: false },
};

const CLAUSE_MAPS_BY_MDR_ID: Record<string, { clauseId: string; exactArabicClause: string; apparentGenre: string; sourceResearchStatus: string; wordingMatch: string; unresolvedIssues: string[] }[]> = {
  "MDR-003": MDR_003_CLAUSE_MAP,
  "MDR-004": MDR_004_CLAUSE_MAP,
  "MDR-005": MDR_005_CLAUSE_MAP,
  "MDR-029": MDR_029_CLAUSE_MAP,
};

function deriveProposedPublicationArabic(wordingMatchStatus: string): string {
  return wordingMatchStatus === "exact-match" || wordingMatchStatus === "minor-orthographic-variation"
    ? `Same as protected text (wording match: ${wordingMatchStatus})`
    : `(reviewer to propose, if warranted — wording match currently: ${wordingMatchStatus})`;
}

function deriveUnresolvedConcern(sourceResearchStatus: string, wordingMatchStatus: string): string {
  const disputedNote = sourceResearchStatus === "disputed" ? " Grading/attribution is disputed among named authorities — see full audit report." : "";
  return `Source research status is "${sourceResearchStatus}"; wording match is "${wordingMatchStatus}".${disputedNote}`;
}

/**
 * MDR Scholarly Review Workbench — Stage "Final Launch" browser tool.
 *
 * Staff-only (see middleware.ts), noindex. Loads every field a reviewer
 * needs to see (protected transcription + research metadata + clause
 * details for composite records) directly from the research register and
 * clause-map modules (server-side only — nothing here is a client-side
 * import of dhikr-research), plus any existing review drafts from Sanity
 * (src/sanity/schemas/documents/dhikr-review/dhikr-mdr-review-draft.ts).
 * Saving/submitting a review writes only to that draft document type — see
 * ./actions.ts for the full safety notes. The live register, importStatus,
 * and public publication state are never touched by this page.
 *
 * @see docs/dhikr/40-scholarly-review-and-adjudication-framework.md
 * @see docs/dhikr/review/MDR-001-030-rapid-approval-pack.md
 */
export default async function DhikrMdrReviewPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const drafts = await loadAllDrafts();

  const records: MdrWorkbenchRecord[] = MORNING_DHIKR_SOURCE_REGISTER.map((record) => {
    const gate = computeImportGate(record);
    const clauseMap = CLAUSE_MAPS_BY_MDR_ID[record.internalId];
    const clauses: MdrWorkbenchClause[] | undefined = clauseMap?.map((c) => ({
      clauseId: c.clauseId,
      exactArabicClause: c.exactArabicClause,
      apparentGenre: c.apparentGenre,
      sourceResearchStatus: c.sourceResearchStatus,
      wordingMatch: c.wordingMatch,
      unresolvedIssues: c.unresolvedIssues,
    }));

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
      proposedPublicationArabic: deriveProposedPublicationArabic(record.wordingMatchStatus),
      unresolvedConcern: deriveUnresolvedConcern(record.sourceResearchStatus, record.wordingMatchStatus),
      clauses,
    };
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 border border-[#8A5A2B] bg-[#8A5A2B]/5 px-4 py-3" role="note">
        <p className="font-[family-name:var(--font-utility)] text-xs font-medium uppercase tracking-widest text-[#8A5A2B]">
          Internal — not indexed — for qualified-scholar review only
        </p>
        <p className="font-[family-name:var(--font-body)] text-sm text-[#0E3B2E]/80 mt-1 leading-relaxed">
          Drafts and submissions here are saved to a staff-only review-draft record in Sanity. Nothing
          submitted here changes the live register, importStatus, or any public page — a submitted
          review is transcribed into the register only via a separate, explicitly-approved commit.
          Protected Arabic transcription is read-only throughout and cannot be edited.
        </p>
      </div>

      <header className="mb-8 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-light text-[#0E3B2E] mb-2">
            MDR Scholarly Review Workbench
          </h1>
          <p className="font-[family-name:var(--font-body)] text-sm text-[#0E3B2E]/70 leading-relaxed max-w-2xl">
            Signed in as {session.user.email}. Review each record, save your progress at any time, and
            submit once your decision is final.
          </p>
        </div>
        <a
          href="/dhikr-mdr-review/summary"
          className="font-[family-name:var(--font-utility)] text-xs uppercase tracking-widest text-[#0E3B2E] underline underline-offset-4"
        >
          View summary →
        </a>
      </header>

      <MdrReviewWorkbench records={records} initialDrafts={drafts} />
    </main>
  );
}
