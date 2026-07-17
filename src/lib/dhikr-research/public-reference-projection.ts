/**
 * Public-safe projection of the Morning Dhikr Source Register — the ONLY
 * module through which any research-register data may reach a public
 * route. It narrows every record down to a fixed, reviewed field list (see
 * DhikrReferenceCollectionEntry) and structurally cannot expose internal
 * notes, reviewer identity, grading/authentication claims, or unsupported
 * virtue/reward text, since none of those fields exist on the returned
 * type.
 *
 * A public route must import ONLY from this module — never
 * ./morning-dhikr-register.ts or ./types.ts directly. This mirrors the
 * existing rule that src/sanity/lib/dhikr-public-fetch.ts is the sole
 * chokepoint for Sanity-sourced public content; this module is the
 * equivalent chokepoint for register-sourced public content.
 *
 * This module reads the register but never writes to it, and never sets or
 * infers scholarlyDecision, editorialApproval, or any approved* field —
 * see docs/dhikr/40-scholarly-review-and-adjudication-framework.md.
 */

import { MORNING_DHIKR_SOURCE_REGISTER } from "./morning-dhikr-register";
import { getOrderedRegisterView } from "./validation";
import type { DhikrSourceResearchRecord, MorningSpecificStatus } from "./types";

/**
 * sourceResearchStatus values treated as "documented enough" to cite a raw
 * primaryReference string publicly. Every other status (including
 * "in-progress" and "disputed") means the citation is not yet firm enough
 * to present as a source reference — the caller must show
 * "Source verification pending" instead.
 */
const DOCUMENTED_SOURCE_STATUSES: DhikrSourceResearchRecord["sourceResearchStatus"][] = [
  "sourced",
  "verified",
];

export interface DhikrReferenceCollectionEntry {
  internalId: string;
  sequenceNumber: number;
  /** The protected, unmodified research transcription (fullArabicText) — never the approved/edited publication text, and never written to by this module. */
  protectedArabicText: string;
  /** Present only when sourceResearchStatus is "sourced" or "verified"; otherwise the source is not yet documented enough to cite publicly. */
  documentedSourceReference?: string;
  /** Present only when morningSpecificStatus is resolved (not "uncertain"). */
  knownTiming?: Exclude<MorningSpecificStatus, "uncertain">;
  /**
   * The raw, document-supplied repetition count — present ONLY when
   * repetitionEvidence is also non-empty (some citation exists for the
   * count, even if not yet sufficient for approval). A repetitionCount with
   * no supporting evidence at all is omitted entirely, never shown. Always
   * unauthenticated either way — the caller must present it as unverified,
   * never as an authoritative recitation instruction.
   */
  knownRepetitionCount?: number;
  /** Always "pending" for every entry this module returns — see getPendingReferenceCollection. */
  reviewStatus: "pending";
}

function toReferenceEntry(record: DhikrSourceResearchRecord): DhikrReferenceCollectionEntry {
  return {
    internalId: record.internalId,
    sequenceNumber: record.sequenceNumber,
    protectedArabicText: record.fullArabicText,
    documentedSourceReference: DOCUMENTED_SOURCE_STATUSES.includes(record.sourceResearchStatus)
      ? record.primaryReference
      : undefined,
    knownTiming: record.morningSpecificStatus === "uncertain" ? undefined : record.morningSpecificStatus,
    knownRepetitionCount: record.repetitionEvidence !== "" ? record.repetitionCount : undefined,
    reviewStatus: "pending",
  };
}

/**
 * Every source-register record NOT among the given publicly-published IDs
 * (the scholarly- or editorially-approved records already shown elsewhere
 * on the page), ordered by sequenceNumber, narrowed to the public-safe
 * projection above. Every returned entry has reviewStatus "pending" by
 * construction — this function has no way to mark anything approved.
 */
export function getPendingReferenceCollection(
  publiclyPublishedIds: readonly string[],
): DhikrReferenceCollectionEntry[] {
  const published = new Set(publiclyPublishedIds);
  return getOrderedRegisterView(MORNING_DHIKR_SOURCE_REGISTER)
    .filter((record) => !published.has(record.internalId))
    .map(toReferenceEntry);
}

/** Total number of records in the source register (published + pending), for progress display. */
export function getSourceRegisterTotalCount(): number {
  return MORNING_DHIKR_SOURCE_REGISTER.length;
}

/**
 * Documented timing values that qualify a record for the Evening Dhikr page.
 * Deliberately excludes "morning-only" and "uncertain" — a record is never
 * treated as Evening-eligible merely because it also appears on Morning, and
 * never because its timing is unresolved. Mirrors EVENING_TIMING_LABELS in
 * src/sanity/lib/dhikr-public-fetch.ts (the Sanity-side equivalent for
 * already-reviewed items) but is independently defined so a change to one
 * can never silently change the other.
 */
const EVENING_ELIGIBLE_TIMINGS: Exclude<MorningSpecificStatus, "uncertain">[] = [
  "evening-only",
  "morning-and-evening",
];

/**
 * Whether a record's documented morningSpecificStatus supports Evening
 * eligibility. The single source of truth for "is this record Evening
 * Dhikr" on the pending/register side — see getPendingEveningReferenceCollection
 * and tests/dhikr/dhikr-evening-eligibility.test.ts.
 */
export function isEveningEligibleTiming(status: MorningSpecificStatus): boolean {
  return (EVENING_ELIGIBLE_TIMINGS as MorningSpecificStatus[]).includes(status);
}

/**
 * Every source-register record NOT among the given publicly-published IDs
 * AND documented as Evening-eligible (morningSpecificStatus is "evening-only"
 * or "morning-and-evening") — a strict subset of getPendingReferenceCollection,
 * reusing its exact same public-safe field projection and evidence gating.
 * "morning-only" and "uncertain" records are never returned here, regardless
 * of whether they appear in Morning's (deliberately broader) reference
 * collection.
 */
export function getPendingEveningReferenceCollection(
  publiclyPublishedIds: readonly string[],
): DhikrReferenceCollectionEntry[] {
  return getPendingReferenceCollection(publiclyPublishedIds).filter(
    (entry) => entry.knownTiming !== undefined && isEveningEligibleTiming(entry.knownTiming),
  );
}

/**
 * Total number of source-register records that are Evening-eligible
 * (published + pending) — the denominator for the Evening progress
 * indicator. Deliberately NOT the same as getSourceRegisterTotalCount():
 * Evening's collection is a documented subset of the full 30-record
 * register, not the whole thing.
 */
export function getEveningEligibleTotalCount(): number {
  return MORNING_DHIKR_SOURCE_REGISTER.filter((record) => isEveningEligibleTiming(record.morningSpecificStatus)).length;
}
