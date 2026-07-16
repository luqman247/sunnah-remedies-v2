/**
 * Morning Dhikr Source Register — typed research structure.
 *
 * This module defines the shape of a *research* record, deliberately kept
 * separate from the approved `dhikrItem` Sanity schema (see
 * src/sanity/schemas/documents/dhikr/dhikr-item.ts). A record here is never
 * publishable, imported into Sanity, or exposed to any public route by
 * itself — see docs/dhikr/32-morning-dhikr-source-register.md for the full
 * architecture decision and docs/dhikr/21-decision-log.md for why this
 * lives outside Sanity until scholarly research is complete.
 */

/** How confident the transcription is that this record's Arabic text matches the source document exactly. */
export type TranscriptionStatus =
  | "exact"
  | "layout-reconstructed"
  | "ambiguous-needs-manual-check";

/** What kind of content this record actually is, once reviewed. Unset until source research happens. */
export type ContentClassification =
  | "unclassified"
  | "quranic-recitation"
  | "prophetic-morning-dhikr"
  | "prophetic-evening-dhikr"
  | "morning-and-evening"
  | "general-prophetic-supplication"
  | "composite-text"
  | "scholarly-advice"
  | "action-reminder";

/** Whether this record is confirmed to belong in a morning-specific dhikr list. */
export type MorningSpecificStatus = "uncertain" | "morning-only" | "evening-only" | "morning-and-evening" | "not-time-specific";

/** Where source research for this record currently stands. */
export type SourceResearchStatus =
  | "not-started"
  | "in-progress"
  | "sourced"
  | "scholarly-review-required"
  | "verified"
  | "disputed";

/** Whether the transcribed Arabic wording has been checked against a verified primary-source wording. */
export type WordingMatchStatus =
  | "unresolved"
  | "exact-match"
  | "minor-orthographic-variation"
  | "recognised-narration-variant"
  | "composite-of-multiple-sources"
  | "materially-different";

/** Whether this record may be imported into the approved dhikrItem schema. */
export type ImportStatus = "research-only" | "review-complete" | "import-ready" | "imported" | "rejected";

/**
 * Controlled scholarly-adjudication outcome (Stage 4). "pending" is the only
 * value any of the 30 Stage 3B records may hold until a completed, second-
 * reviewed decision record (docs/dhikr/review/MDR-SCHOLARLY-DECISION-RECORD-
 * TEMPLATE.md) is transcribed in via a separate, explicitly-approved commit.
 * See docs/dhikr/40-scholarly-review-and-adjudication-framework.md, §C.
 */
export type ScholarlyDecisionStatus =
  | "pending"
  | "approved"
  | "approved-with-corrections"
  | "deferred"
  | "rejected";

/**
 * Controlled editorial-approval outcome — independent of, and required in
 * addition to, scholarlyDecision (see framework §B: editorial approval
 * cannot substitute for or override a scholarly/grading/wording decision).
 */
export type EditorialApprovalStatus = "pending" | "approved" | "revision-required" | "rejected";

/**
 * Which publication pathway (if either) a record currently occupies.
 * "not-published" is the only value any of the 30 records may hold until a
 * human editorial reviewer actually approves specific public wording (the
 * "editorially-published-pending-scholarly-review" transition) — this type
 * existing does not itself publish or approve anything.
 *
 * Two distinct, coexisting pathways:
 *  - "editorially-published-pending-scholarly-review": the lighter-weight
 *    transparent-editorial model — publishable once editorial (not
 *    scholarly) review confirms the public wording, documented sourcing,
 *    and absence of unsupported claims, with a mandatory public "awaiting
 *    scholarly verification" label. scholarlyDecision remains "pending".
 *  - "scholarly-verified-published": the full Stage 4 scholarly-approval
 *    pathway (see docs/dhikr/40-scholarly-review-and-adjudication-
 *    framework.md) — kept intact, unaffected by this type's addition, for
 *    future use once real scholarly review actually occurs.
 */
export type PublicationReviewStatus =
  | "not-published"
  | "editorially-published-pending-scholarly-review"
  | "scholarly-verified-published";

export interface DhikrSourceResearchRecord {
  // --- Transcription fields (populated in Stage 3A) ---
  /** Editorially authoritative position in the source document, 1-30. Never used for storage order — see assertRegisterStoredInAuthoritativeOrder. */
  sequenceNumber: number;
  /** Stable identifier independent of array position, e.g. "MDR-001". */
  internalId: string;
  /** Short, exact opening excerpt of the Arabic text, for human scanning only. */
  openingArabicWords: string;
  /** The transcribed Arabic entry as currently held for research purposes. Identical to originalDocumentText until a scholarly correction is separately approved. */
  fullArabicText: string;
  /** The exact, unmodified text as extracted from the source document. Never edited once set — later corrections go in fullArabicText, not here. */
  originalDocumentText: string;
  /** Repetition counts, ACTION labels, headings, or other annotations visible in the source document, preserved verbatim. */
  sourceDocumentAnnotations: string[];
  transcriptionStatus: TranscriptionStatus;
  /** Free-text notes on transcription uncertainty, source-document irregularities, or verification method. Empty string if nothing to note. */
  transcriptionNotes: string;
  /** Category, only ever set when the source document itself states it explicitly (e.g. an "evening only" heading). Empty otherwise. */
  proposedCategory: string;

  // --- Research fields (left unclaimed until later stages) ---
  contentClassification: ContentClassification;
  morningSpecificStatus: MorningSpecificStatus;
  sourceResearchStatus: SourceResearchStatus;
  primaryCollection: string;
  primaryReference: string;
  secondaryReferences: string[];
  narrator: string;
  /** The wording as found in a verified primary source, for comparison against fullArabicText. Empty until sourced. */
  sourceArabicWording: string;
  wordingMatchStatus: WordingMatchStatus;
  hadithGrading: string;
  gradingAuthority: string;
  gradingNotes: string;
  /** A repetition count visible in the source document, recorded as unauthenticated document-supplied data. Not evidence by itself — see repetitionEvidence and computeImportGate. */
  repetitionCount?: number;
  /** Citation/evidence supporting repetitionCount as authentic. Must be non-empty before a record with a repetitionCount can pass computeImportGate. */
  repetitionEvidence: string;
  /** A reward/virtue claim, only ever populated from an explicit statement found during scholarly research. Not populated from source-document text alone in Stage 3A. */
  virtueOrRewardClaim: string;
  /** Citation/evidence supporting virtueOrRewardClaim as authentic. Must be non-empty before a record with a virtueOrRewardClaim can pass computeImportGate. */
  virtueEvidence: string;
  sourceUrls: string[];
  usulAiResearchNotes: string;

  // --- Operational scholarly-review fields (Stage 2 of the launch plan) ---
  // See docs/dhikr/40-scholarly-review-and-adjudication-framework.md. All of
  // these remain empty/"pending" for every one of the 30 Stage 3B records
  // until a completed, second-reviewed decision record is transcribed in via
  // a separate, explicitly-approved commit — this schema change alone
  // approves nothing.
  /** Primary reviewer's name. Empty until Stage 4B review actually occurs. */
  scholarlyReviewer: string;
  /** Primary reviewer's stated qualification (institution, ijazah, field of expertise). */
  scholarlyReviewerQualification: string;
  /** ISO date (YYYY-MM-DD) the scholarly decision was finalised. Empty until decided. */
  scholarlyReviewDate: string;
  /** Controlled decision outcome. "pending" is the only live value across all 30 records today. */
  scholarlyDecision: ScholarlyDecisionStatus;
  /** Free-text scholarly rationale/caveats, distinct from editorialNotes below. */
  scholarlyNotes: string;
  /**
   * Approved publication Arabic wording — a DISTINCT field from the protected
   * fullArabicText/originalDocumentText. Never written back into either
   * protected field; see §3 "Protect original evidence" in the Stage 2
   * launch plan and framework §E.
   */
  approvedArabicText: string;
  /** Approved publication English translation. Empty until approved. */
  approvedEnglishText: string;
  /** Approved, reviewer-confirmed source citation, distinct from primaryReference/secondaryReferences (which are research-stage, not adjudicated). */
  approvedSourceReference: string;
  /** Approved timing label for publication (e.g. a MorningSpecificStatus value), confirmed by the reviewer — distinct from morningSpecificStatus, which is a research-stage classification. */
  approvedTiming: string;
  /** Approved repetition count for publication, distinct from the unauthenticated repetitionCount above. */
  approvedRepetitionCount?: number;
  /** Approved virtue/reward text for publication, distinct from virtueOrRewardClaim (research-stage). Only populated where a claim is genuinely supported — see framework §H. */
  approvedVirtueText: string;
  /** Editorial approver's name. Independent of, and required in addition to, scholarlyReviewer. */
  editorialReviewer: string;
  /** Controlled editorial-approval outcome — cannot substitute for scholarlyDecision (framework §B). */
  editorialApproval: EditorialApprovalStatus;
  /** ISO date (YYYY-MM-DD) editorial approval was finalised. Empty until approved. */
  editorialApprovalDate: string;
  /**
   * For composite records only (those with a dedicated clause-map file under
   * src/lib/dhikr-research/audits/ — see COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS
   * in ./validation.ts): true only once every individual clause has been
   * independently approved. There is no whole-record shortcut for a
   * composite record — framework §I. Undefined/false for non-composite
   * records and for every record today.
   */
  compositeClausesApproved?: boolean;

  /**
   * Which publication pathway this record currently occupies. "not-published"
   * for every one of the 30 records until a human editorial reviewer (this
   * pathway) or scholarly reviewer (the existing pathway) actually approves
   * it — see PublicationReviewStatus above.
   */
  publicationReviewStatus: PublicationReviewStatus;

  editorialNotes: string;
  importStatus: ImportStatus;
}
