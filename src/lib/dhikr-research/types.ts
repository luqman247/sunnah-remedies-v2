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
export type SourceResearchStatus = "not-started" | "in-progress" | "sourced" | "verified" | "disputed";

/** Whether the transcribed Arabic wording has been checked against a verified primary-source wording. */
export type WordingMatchStatus =
  | "unresolved"
  | "exact-match"
  | "minor-orthographic-variation"
  | "recognised-narration-variant"
  | "materially-different";

/** Whether this record may be imported into the approved dhikrItem schema. */
export type ImportStatus = "research-only" | "import-ready" | "imported" | "rejected";

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
  scholarlyReviewer: string;
  /** Free-text decision record. "pending" is the Stage 3A default meaning "not yet reviewed". */
  scholarlyDecision: string;
  editorialNotes: string;
  importStatus: ImportStatus;
}
