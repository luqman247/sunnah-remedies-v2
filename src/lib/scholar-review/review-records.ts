/**
 * "Scholar Review" portal — review-record read/write layer. Every write
 * here is a PROPOSAL record (scholarlyReviewSession /
 * duaDhikrEntryScholarlyReview / duaDhikrCollectionScholarlyReview /
 * feelingStateScholarlyReview) — none of these mutate the authoritative
 * duaDhikrEntry / duaDhikrCollection / feelingState documents they
 * reference. Staging-only, enforced by staging-client.ts.
 *
 * Deterministic document IDs (derived from session + target id) are used
 * throughout so autosave is simply "upsert this one document" — no
 * find-then-create race, no duplicate records per session+item.
 */

import { stagingFetch, stagingCreateOrReplace, stagingPatch, stagingCreate } from "./staging-client";
import {
  DUA_DHIKR_ENTRY_DECISIONS,
  DUA_DHIKR_ENTRY_DUPLICATE_RESOLUTIONS,
  DUA_DHIKR_COLLECTION_DECISIONS,
  FEELING_STATE_DECISIONS,
} from "./decision-labels";

function assertKnownValue(value: string | undefined, allowed: readonly { value: string }[], fieldName: string): void {
  if (value === undefined) return;
  if (!allowed.some((a) => a.value === value)) {
    throw new Error(`Invalid ${fieldName}: "${value}".`);
  }
}

export interface ReviewerIdentityInput {
  fullName: string;
  roleOrQualification: string;
  organisation?: string;
  email?: string;
}

export interface ScholarlyReviewSessionDoc {
  _id: string;
  reviewer: ReviewerIdentityInput;
  createdAt: string;
  lastActiveAt?: string;
  duaDhikrProgrammeSubmittedAt?: string;
  feelingProgrammeSubmittedAt?: string;
}

function sanitizeText(value: string | undefined | null, maxLength = 5000): string | undefined {
  if (!value) return undefined;
  // Strip control characters (keep tab/newline/CR) and cap length — a
  // review comment is never executable content, but this keeps stored
  // data well-formed and bounds payload size.
  // eslint-disable-next-line no-control-regex
  const controlChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
  const cleaned = value.replace(controlChars, "").trim();
  return cleaned.slice(0, maxLength) || undefined;
}

export async function createReviewSession(reviewer: ReviewerIdentityInput): Promise<string> {
  const id = `scholarlyReviewSession-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  await stagingCreate({
    _id: id,
    _type: "scholarlyReviewSession",
    reviewer: {
      _type: "reviewerIdentity",
      fullName: sanitizeText(reviewer.fullName, 120) ?? "",
      roleOrQualification: sanitizeText(reviewer.roleOrQualification, 200) ?? "",
      organisation: sanitizeText(reviewer.organisation, 200),
      email: sanitizeText(reviewer.email, 200),
    },
    createdAt: now,
    lastActiveAt: now,
  });
  return id;
}

export async function getReviewSession(sessionId: string): Promise<ScholarlyReviewSessionDoc | null> {
  return stagingFetch<ScholarlyReviewSessionDoc | null>(`*[_type == "scholarlyReviewSession" && _id == $id][0]`, { id: sessionId });
}

export async function touchReviewSession(sessionId: string): Promise<void> {
  await stagingPatch(sessionId, { lastActiveAt: new Date().toISOString() });
}

export async function submitProgramme(sessionId: string, programme: "dua-dhikr" | "feeling"): Promise<void> {
  const field = programme === "dua-dhikr" ? "duaDhikrProgrammeSubmittedAt" : "feelingProgrammeSubmittedAt";
  await stagingPatch(sessionId, { [field]: new Date().toISOString() });
}

// ── Duʿā & Dhikr entry reviews ──────────────────────────────────────────

export interface DuaDhikrEntryReviewInput {
  decision?: string;
  comments?: string;
  proposedArabicCorrection?: string;
  proposedArabicCorrectionReason?: string;
  proposedTranslation?: string;
  proposedTransliteration?: string;
  correctedSource?: string;
  hadithGrading?: string;
  duplicateTargetEntry?: string;
  duplicateResolution?: string;
  virtueConcern?: string;
  explanationConcern?: string;
  generalComments?: string;
}

export interface DuaDhikrEntryReviewRecord extends DuaDhikrEntryReviewInput {
  _id: string;
  entryId: string;
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string;
  completed: boolean;
}

function entryReviewId(sessionId: string, entryId: string): string {
  return `duaDhikrEntryScholarlyReview-${sessionId}-${entryId}`;
}

export async function getDuaDhikrEntryReview(sessionId: string, entryId: string): Promise<DuaDhikrEntryReviewRecord | null> {
  const id = entryReviewId(sessionId, entryId);
  const doc = await stagingFetch<Record<string, unknown> | null>(`*[_id == $id][0]{ ..., "entryId": entry._ref }`, { id });
  return doc as DuaDhikrEntryReviewRecord | null;
}

export async function saveDuaDhikrEntryReview(sessionId: string, entryId: string, input: DuaDhikrEntryReviewInput, completed = false): Promise<void> {
  assertKnownValue(input.decision, DUA_DHIKR_ENTRY_DECISIONS, "decision");
  assertKnownValue(input.duplicateResolution, DUA_DHIKR_ENTRY_DUPLICATE_RESOLUTIONS, "duplicateResolution");
  const id = entryReviewId(sessionId, entryId);
  const now = new Date().toISOString();
  await stagingCreateOrReplace({
    _id: id,
    _type: "duaDhikrEntryScholarlyReview",
  });
  const set: Record<string, unknown> = {
    session: { _type: "reference", _ref: sessionId },
    entry: { _type: "reference", _ref: entryId },
    decision: input.decision,
    comments: sanitizeText(input.comments),
    proposedArabicCorrection: sanitizeText(input.proposedArabicCorrection),
    proposedArabicCorrectionReason: sanitizeText(input.proposedArabicCorrectionReason),
    proposedTranslation: sanitizeText(input.proposedTranslation),
    proposedTransliteration: sanitizeText(input.proposedTransliteration),
    correctedSource: sanitizeText(input.correctedSource),
    hadithGrading: sanitizeText(input.hadithGrading, 200),
    duplicateResolution: input.duplicateResolution,
    virtueConcern: sanitizeText(input.virtueConcern),
    explanationConcern: sanitizeText(input.explanationConcern),
    generalComments: sanitizeText(input.generalComments),
    createdAt: now,
    updatedAt: now,
    reviewVersion: 1,
    completed,
  };
  if (input.duplicateTargetEntry) set.duplicateTargetEntry = { _type: "reference", _ref: input.duplicateTargetEntry };
  if (completed) set.submittedAt = now;
  await stagingPatch(id, set);
}

export async function listDuaDhikrEntryReviews(sessionId: string): Promise<DuaDhikrEntryReviewRecord[]> {
  return stagingFetch<DuaDhikrEntryReviewRecord[]>(
    `*[_type == "duaDhikrEntryScholarlyReview" && session._ref == $sessionId]{ ..., "entryId": entry._ref }`,
    { sessionId },
  );
}

/** Across ALL reviewer sessions — for the owner summary only, never for a single scholar's working pages. */
export async function listAllDuaDhikrEntryReviews(): Promise<(DuaDhikrEntryReviewRecord & { sessionId: string })[]> {
  return stagingFetch<(DuaDhikrEntryReviewRecord & { sessionId: string })[]>(
    `*[_type == "duaDhikrEntryScholarlyReview"]{ ..., "entryId": entry._ref, "sessionId": session._ref }`,
  );
}

// ── Duʿā & Dhikr collection reviews ─────────────────────────────────────

export interface DuaDhikrCollectionReviewInput {
  decision?: string;
  comments?: string;
  proposedOrdering?: string;
}

export interface DuaDhikrCollectionReviewRecord extends DuaDhikrCollectionReviewInput {
  _id: string;
  collectionId: string;
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string;
  completed: boolean;
}

function collectionReviewId(sessionId: string, collectionId: string): string {
  return `duaDhikrCollectionScholarlyReview-${sessionId}-${collectionId}`;
}

export async function getDuaDhikrCollectionReview(sessionId: string, collectionId: string): Promise<DuaDhikrCollectionReviewRecord | null> {
  const id = collectionReviewId(sessionId, collectionId);
  return stagingFetch<DuaDhikrCollectionReviewRecord | null>(`*[_id == $id][0]{ ..., "collectionId": collection._ref }`, { id });
}

export async function saveDuaDhikrCollectionReview(sessionId: string, collectionId: string, input: DuaDhikrCollectionReviewInput, completed = false): Promise<void> {
  assertKnownValue(input.decision, DUA_DHIKR_COLLECTION_DECISIONS, "decision");
  const id = collectionReviewId(sessionId, collectionId);
  const now = new Date().toISOString();
  await stagingCreateOrReplace({ _id: id, _type: "duaDhikrCollectionScholarlyReview" });
  await stagingPatch(id, {
    session: { _type: "reference", _ref: sessionId },
    collection: { _type: "reference", _ref: collectionId },
    decision: input.decision,
    comments: sanitizeText(input.comments),
    proposedOrdering: sanitizeText(input.proposedOrdering),
    createdAt: now,
    updatedAt: now,
    reviewVersion: 1,
    completed,
    ...(completed ? { submittedAt: now } : {}),
  });
}

export async function listDuaDhikrCollectionReviews(sessionId: string): Promise<DuaDhikrCollectionReviewRecord[]> {
  return stagingFetch<DuaDhikrCollectionReviewRecord[]>(
    `*[_type == "duaDhikrCollectionScholarlyReview" && session._ref == $sessionId]{ ..., "collectionId": collection._ref }`,
    { sessionId },
  );
}

/** Across ALL reviewer sessions — for the owner summary only. */
export async function listAllDuaDhikrCollectionReviews(): Promise<(DuaDhikrCollectionReviewRecord & { sessionId: string })[]> {
  return stagingFetch<(DuaDhikrCollectionReviewRecord & { sessionId: string })[]>(
    `*[_type == "duaDhikrCollectionScholarlyReview"]{ ..., "collectionId": collection._ref, "sessionId": session._ref }`,
  );
}

// ── Feeling state reviews ───────────────────────────────────────────────

export interface FeelingStateReviewInput {
  decision?: string;
  comments?: string;
  approvedIntroduction?: string;
  approvedReflection?: string;
  approvedPracticalNextStep?: string;
  entriesToRetain?: string[];
  entriesToRemove?: string[];
  replacementEntrySuggestion?: string;
  sourceConcern?: string;
  authenticityConcern?: string;
  safeguardingConcern?: string;
  otherComments?: string;
}

export interface FeelingStateReviewRecord extends FeelingStateReviewInput {
  _id: string;
  feelingStateId: string;
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string;
  completed: boolean;
}

function feelingReviewId(sessionId: string, feelingStateId: string): string {
  return `feelingStateScholarlyReview-${sessionId}-${feelingStateId}`;
}

export async function getFeelingStateReview(sessionId: string, feelingStateId: string): Promise<FeelingStateReviewRecord | null> {
  const id = feelingReviewId(sessionId, feelingStateId);
  return stagingFetch<FeelingStateReviewRecord | null>(`*[_id == $id][0]{ ..., "feelingStateId": feelingState._ref }`, { id });
}

export async function saveFeelingStateReview(sessionId: string, feelingStateId: string, input: FeelingStateReviewInput, completed = false): Promise<void> {
  assertKnownValue(input.decision, FEELING_STATE_DECISIONS, "decision");
  const id = feelingReviewId(sessionId, feelingStateId);
  const now = new Date().toISOString();
  await stagingCreateOrReplace({ _id: id, _type: "feelingStateScholarlyReview" });
  await stagingPatch(id, {
    session: { _type: "reference", _ref: sessionId },
    feelingState: { _type: "reference", _ref: feelingStateId },
    decision: input.decision,
    comments: sanitizeText(input.comments),
    approvedIntroduction: sanitizeText(input.approvedIntroduction),
    approvedReflection: sanitizeText(input.approvedReflection),
    approvedPracticalNextStep: sanitizeText(input.approvedPracticalNextStep),
    entriesToRetain: (input.entriesToRetain ?? []).map((ref) => ({ _type: "reference", _ref: ref, _key: ref })),
    entriesToRemove: (input.entriesToRemove ?? []).map((ref) => ({ _type: "reference", _ref: ref, _key: ref })),
    replacementEntrySuggestion: sanitizeText(input.replacementEntrySuggestion),
    sourceConcern: sanitizeText(input.sourceConcern),
    authenticityConcern: sanitizeText(input.authenticityConcern),
    safeguardingConcern: sanitizeText(input.safeguardingConcern),
    otherComments: sanitizeText(input.otherComments),
    createdAt: now,
    updatedAt: now,
    reviewVersion: 1,
    completed,
    ...(completed ? { submittedAt: now } : {}),
  });
}

export async function listFeelingStateReviews(sessionId: string): Promise<FeelingStateReviewRecord[]> {
  return stagingFetch<FeelingStateReviewRecord[]>(
    `*[_type == "feelingStateScholarlyReview" && session._ref == $sessionId]{ ..., "feelingStateId": feelingState._ref }`,
    { sessionId },
  );
}

/** Across ALL reviewer sessions — for the owner summary only. */
export async function listAllFeelingStateReviews(): Promise<(FeelingStateReviewRecord & { sessionId: string })[]> {
  return stagingFetch<(FeelingStateReviewRecord & { sessionId: string })[]>(
    `*[_type == "feelingStateScholarlyReview"]{ ..., "feelingStateId": feelingState._ref, "sessionId": session._ref }`,
  );
}

/** Every reviewer session ever created — for the owner summary's "reviewed by" attribution. */
export async function listAllReviewSessions(): Promise<ScholarlyReviewSessionDoc[]> {
  return stagingFetch<ScholarlyReviewSessionDoc[]>(`*[_type == "scholarlyReviewSession"] | order(createdAt desc)`);
}
