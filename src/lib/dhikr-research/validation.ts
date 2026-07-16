/**
 * Order-protection and import-gating logic for the Morning Dhikr Source
 * Register. See docs/dhikr/32-morning-dhikr-source-register.md for the
 * architecture this supports.
 *
 * Order protection is deliberately split into two separate checks rather
 * than relying on a single sorting helper:
 *  - assertCompleteSequence checks the *set* of sequence numbers is exactly
 *    {1..30} with no gaps or duplicates, regardless of array order.
 *  - assertRegisterStoredInAuthoritativeOrder checks the register's
 *    *physical array order* itself is 1, 2, 3 ... 30 — a register that
 *    happens to contain the right 30 numbers but stored out of order would
 *    fail this check even though it would pass assertCompleteSequence.
 */

import type { ContentClassification, DhikrSourceResearchRecord } from "./types";

export function assertCompleteSequence(register: DhikrSourceResearchRecord[]): void {
  const seen = new Map<number, number>();

  for (const record of register) {
    if (!Number.isInteger(record.sequenceNumber) || record.sequenceNumber < 1 || record.sequenceNumber > 30) {
      throw new Error(
        `Register contains an out-of-range sequenceNumber: ${record.sequenceNumber} (internalId ${record.internalId}). Valid range is 1-30.`,
      );
    }
    seen.set(record.sequenceNumber, (seen.get(record.sequenceNumber) ?? 0) + 1);
  }

  const duplicates = [...seen.entries()].filter(([, count]) => count > 1);
  if (duplicates.length > 0) {
    throw new Error(
      `Register contains duplicate sequenceNumber(s): ${duplicates.map(([n, count]) => `${n} (x${count})`).join(", ")}.`,
    );
  }

  const missing: number[] = [];
  for (let n = 1; n <= 30; n++) {
    if (!seen.has(n)) missing.push(n);
  }
  if (missing.length > 0) {
    throw new Error(`Register is missing sequenceNumber(s): ${missing.join(", ")}.`);
  }
}

export function assertRegisterStoredInAuthoritativeOrder(register: DhikrSourceResearchRecord[]): void {
  for (let i = 0; i < register.length; i++) {
    const expected = i + 1;
    const actual = register[i].sequenceNumber;
    if (actual !== expected) {
      throw new Error(
        `Register is not stored in authoritative document order: physical array position ${i} holds sequenceNumber ${actual}, expected ${expected}.`,
      );
    }
  }
}

/**
 * Returns a new array ordered by sequenceNumber, for display purposes.
 * Does not mutate the source array (Array.prototype.sort mutates in place,
 * so this copies first).
 */
export function getOrderedRegisterView(register: DhikrSourceResearchRecord[]): DhikrSourceResearchRecord[] {
  return [...register].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
}

const CLASSIFICATIONS_NOT_REQUIRING_HADITH_GRADING: ContentClassification[] = ["quranic-recitation"];

function classificationRequiresGrading(classification: ContentClassification): boolean {
  return !CLASSIFICATIONS_NOT_REQUIRING_HADITH_GRADING.includes(classification);
}

/**
 * Records with a dedicated clause-map file under
 * src/lib/dhikr-research/audits/ (see docs/dhikr/40-scholarly-review-and-
 * adjudication-framework.md, §I). MDR-001 is a documented special case
 * (a composite reference list with no clause-map file) and is deliberately
 * NOT included here — it is gated as a single record, not clause-by-clause;
 * see the framework's MDR-001 special-case note.
 */
export const COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS: readonly string[] = [
  "MDR-003",
  "MDR-004",
  "MDR-005",
  "MDR-029",
];

const RESOLVED_WORDING_MATCH_STATUSES: DhikrSourceResearchRecord["wordingMatchStatus"][] = [
  "exact-match",
  "minor-orthographic-variation",
  "recognised-narration-variant",
];

export interface ImportGateResult {
  canImport: boolean;
  blockedReasons: string[];
}

/**
 * Determines whether a research record may be imported into the approved
 * dhikrItem schema. Every record produced by Stage 3A/3B is expected to be
 * blocked by this function — that is the intended, tested behaviour, since
 * no record has yet completed scholarly and editorial approval.
 *
 * This is the "technical gatekeeper" role from framework §B: it may BLOCK
 * import on gate-failure grounds, but nothing in this function ever sets,
 * infers, or upgrades scholarlyDecision, editorialApproval, or any approved*
 * field — it only reads them. A record only ever becomes import-ready
 * because a human explicitly populated these fields via a separate,
 * checkpoint-reviewed commit; this function cannot create that state.
 */
export function computeImportGate(record: DhikrSourceResearchRecord): ImportGateResult {
  const blockedReasons: string[] = [];

  // --- Research-completeness conditions (Stage 3A/3B) ---
  if (record.sourceResearchStatus !== "verified") {
    blockedReasons.push(`Source research is not verified (status: "${record.sourceResearchStatus}").`);
  }

  if (!RESOLVED_WORDING_MATCH_STATUSES.includes(record.wordingMatchStatus) && record.approvedArabicText.trim() === "") {
    blockedReasons.push(
      `Wording match is not resolved (status: "${record.wordingMatchStatus}") and no approved corrected wording has been supplied.`,
    );
  }

  if (classificationRequiresGrading(record.contentClassification) && record.hadithGrading.trim() === "") {
    blockedReasons.push("Required hadith grading is absent.");
  }

  if (record.repetitionCount !== undefined && record.repetitionEvidence.trim() === "") {
    blockedReasons.push(`A visible repetition count (${record.repetitionCount}x) has no supporting evidence.`);
  }

  if (record.virtueOrRewardClaim.trim() !== "" && record.virtueEvidence.trim() === "") {
    blockedReasons.push("A virtue or reward claim has no supporting evidence.");
  }

  if (record.contentClassification === "action-reminder" && record.scholarlyDecision === "pending") {
    blockedReasons.push("An action reminder has not received classification review.");
  }

  // --- Scholarly approval conditions (Stage 4B) ---
  if (record.scholarlyDecision === "pending") {
    blockedReasons.push("Scholarly approval is absent (decision is still pending).");
  } else if (record.scholarlyDecision === "deferred") {
    blockedReasons.push("Scholarly decision is deferred.");
  } else if (record.scholarlyDecision === "rejected") {
    blockedReasons.push("Scholarly decision is rejected.");
  } else if (record.scholarlyDecision !== "approved" && record.scholarlyDecision !== "approved-with-corrections") {
    blockedReasons.push(`Scholarly decision ("${record.scholarlyDecision}") is not an approved outcome.`);
  }

  if (record.scholarlyReviewer.trim() === "") {
    blockedReasons.push("No scholarly reviewer is recorded.");
  }

  if (record.scholarlyReviewerQualification.trim() === "") {
    blockedReasons.push("No scholarly reviewer qualification is recorded.");
  }

  if (record.scholarlyReviewDate.trim() === "") {
    blockedReasons.push("No scholarly review date is recorded.");
  }

  if (record.approvedArabicText.trim() === "") {
    blockedReasons.push("No approved Arabic publication text is recorded.");
  }

  if (record.approvedEnglishText.trim() === "") {
    blockedReasons.push("No approved English publication text is recorded.");
  }

  if (record.approvedSourceReference.trim() === "") {
    blockedReasons.push("No approved source reference is recorded.");
  }

  // --- Editorial approval conditions (independent of scholarly approval) ---
  if (record.editorialApproval !== "approved") {
    blockedReasons.push(`Editorial approval is not granted (status: "${record.editorialApproval}").`);
  }

  if (record.editorialReviewer.trim() === "") {
    blockedReasons.push("No editorial reviewer is recorded.");
  }

  if (record.editorialApprovalDate.trim() === "") {
    blockedReasons.push("No editorial approval date is recorded.");
  }

  // --- Composite-record conditions — no whole-record shortcut (framework §I) ---
  if (COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS.includes(record.internalId) && record.compositeClausesApproved !== true) {
    blockedReasons.push("This is a composite record and not every clause has been independently approved.");
  }

  // --- Final technical gate: importStatus must have been explicitly advanced ---
  if (record.importStatus !== "import-ready") {
    blockedReasons.push(`Record is not marked import-ready (importStatus: "${record.importStatus}").`);
  }

  return {
    canImport: blockedReasons.length === 0,
    blockedReasons,
  };
}

/**
 * MDR-001 is a documented special case: a composite reference list with no
 * clause-map file (see COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS above). It is
 * excluded from the editorial-publication pathway on the same "composite"
 * grounds even though it has no clause map to independently approve.
 */
const COMPOSITE_RECORD_IDS_FOR_EDITORIAL_EXCLUSION = new Set<string>([
  ...COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS,
  "MDR-001",
]);

/**
 * The editorial-publication pathway is deliberately conservative about what
 * counts as "wording resolved": a status of "unresolved" means the
 * transcribed Arabic has never been checked against any verified
 * primary-source wording at all — not merely that a difference was found.
 * Publishing under a claim of "prepared from documented sources" requires
 * an actual confirmed comparison, not merely the absence of a known
 * problem. See docs/dhikr/... and the editorial-publication launch report
 * for the reasoning; if this proves too strict in practice, loosen this set
 * deliberately, not by silently treating "unresolved" as acceptable.
 */
const EDITORIAL_PUBLICATION_ACCEPTABLE_WORDING: DhikrSourceResearchRecord["wordingMatchStatus"][] = [
  "exact-match",
  "minor-orthographic-variation",
  "recognised-narration-variant",
];

/**
 * Determines whether a record may be published via the transparent
 * editorial-publication pathway — a distinct, lighter-weight route from
 * computeImportGate's scholarly-approval pathway above, which remains
 * completely unmodified and available for future use. A record reaching
 * "true" here still has scholarlyDecision: "pending" — this function never
 * reads scholarlyDecision as a gating condition, and nothing in this
 * codebase ever sets scholarlyDecision based on this function's result.
 *
 * This is a technical gate only: it may BLOCK publication, but it never
 * sets, infers, or upgrades editorialApproval, editorialReviewer, or any
 * approved* field — those only ever change because a real human editorial
 * reviewer populated them via a separate, checkpoint-reviewed commit.
 */
export function computeEditorialPublicationGate(record: DhikrSourceResearchRecord): ImportGateResult {
  const blockedReasons: string[] = [];

  // --- Protected transcription must be genuinely unaltered ---
  if (record.fullArabicText !== record.originalDocumentText) {
    blockedReasons.push("fullArabicText has diverged from originalDocumentText — protected transcription must remain unaltered.");
  }

  // --- Exclusions from the launch scope ---
  if (record.sourceResearchStatus === "disputed") {
    blockedReasons.push("Record is disputed and excluded from the editorial-publication pathway.");
  }

  if (COMPOSITE_RECORD_IDS_FOR_EDITORIAL_EXCLUSION.has(record.internalId)) {
    blockedReasons.push("Record is composite and excluded from the editorial-publication pathway.");
  }

  if (!EDITORIAL_PUBLICATION_ACCEPTABLE_WORDING.includes(record.wordingMatchStatus)) {
    blockedReasons.push(`Wording is not confirmed-resolved for editorial publication (status: "${record.wordingMatchStatus}").`);
  }

  if (record.morningSpecificStatus === "uncertain") {
    blockedReasons.push("Timing is uncertain and excluded from the editorial-publication pathway.");
  }

  if (record.repetitionCount !== undefined && record.repetitionEvidence.trim() === "") {
    blockedReasons.push(`A visible repetition count (${record.repetitionCount}x) has no supporting evidence — omit repetition rather than publish it unsupported.`);
  }

  if (record.approvedVirtueText.trim() !== "" && record.virtueEvidence.trim() === "") {
    blockedReasons.push("An approved virtue/reward text is set but has no supporting evidence — omit virtue text rather than publish it unsupported.");
  }

  // --- Documented sourcing and public wording must actually exist ---
  if (record.approvedSourceReference.trim() === "") {
    blockedReasons.push("No approved, documented source reference is recorded.");
  }

  if (record.approvedArabicText.trim() === "") {
    blockedReasons.push("No approved Arabic publication text is recorded.");
  }

  if (record.approvedEnglishText.trim() === "") {
    blockedReasons.push("No approved English translation is recorded.");
  }

  // --- A real editorial reviewer must have actually approved this ---
  if (record.editorialApproval !== "approved") {
    blockedReasons.push(`Editorial approval is not granted (status: "${record.editorialApproval}").`);
  }

  if (record.editorialReviewer.trim() === "") {
    blockedReasons.push("No editorial reviewer is recorded.");
  }

  if (record.editorialApprovalDate.trim() === "") {
    blockedReasons.push("No editorial approval date is recorded.");
  }

  // --- scholarlyDecision must remain untouched by this pathway ---
  if (record.scholarlyDecision !== "pending") {
    blockedReasons.push(
      `scholarlyDecision is "${record.scholarlyDecision}", not "pending" — the editorial-publication pathway must never be used on a record with a real scholarly decision already recorded; use the scholarly pathway (computeImportGate) instead.`,
    );
  }

  // --- Final technical gate: publicationReviewStatus must have been explicitly advanced ---
  if (record.publicationReviewStatus !== "editorially-published-pending-scholarly-review") {
    blockedReasons.push(
      `Record is not marked for editorial publication (publicationReviewStatus: "${record.publicationReviewStatus}").`,
    );
  }

  return {
    canImport: blockedReasons.length === 0,
    blockedReasons,
  };
}
