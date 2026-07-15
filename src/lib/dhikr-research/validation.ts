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

export interface ImportGateResult {
  canImport: boolean;
  blockedReasons: string[];
}

/**
 * Determines whether a research record may be imported into the approved
 * dhikrItem schema. Every record produced by Stage 3A is expected to be
 * blocked by this function — that is the intended, tested behaviour, since
 * no source research has happened yet.
 */
export function computeImportGate(record: DhikrSourceResearchRecord): ImportGateResult {
  const blockedReasons: string[] = [];

  if (record.sourceResearchStatus !== "verified") {
    blockedReasons.push(`Source research is not verified (status: "${record.sourceResearchStatus}").`);
  }

  if (record.wordingMatchStatus !== "exact-match" && record.wordingMatchStatus !== "minor-orthographic-variation" && record.wordingMatchStatus !== "recognised-narration-variant") {
    blockedReasons.push(`Wording match is not resolved (status: "${record.wordingMatchStatus}").`);
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

  if (record.scholarlyDecision === "pending") {
    blockedReasons.push("Scholarly approval is absent (decision is still pending).");
  }

  if (record.importStatus === "research-only") {
    blockedReasons.push("Record is still marked research-only.");
  }

  return {
    canImport: blockedReasons.length === 0,
    blockedReasons,
  };
}
