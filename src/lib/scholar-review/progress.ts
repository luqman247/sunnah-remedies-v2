/**
 * "Scholar Review" portal — pure progress-calculation helpers. No Sanity
 * access here; callers fetch data via dua-dhikr-review-data.ts /
 * feeling-review-data.ts / review-records.ts and pass it in, so these
 * functions are directly unit-testable.
 */

import type { ReviewDuaDhikrEntrySummary, ReviewDuaDhikrCollectionSummary } from "./dua-dhikr-review-data";
import type { ReviewFeelingState } from "./feeling-review-data";
import type { DuaDhikrEntryReviewRecord, DuaDhikrCollectionReviewRecord, FeelingStateReviewRecord } from "./review-records";
import {
  DUA_DHIKR_ENTRY_DECISIONS_NOT_REQUIRING_COMMENT,
  DUA_DHIKR_COLLECTION_DECISIONS_NOT_REQUIRING_COMMENT,
  FEELING_STATE_DECISIONS_NOT_REQUIRING_COMMENT,
} from "./decision-labels";

const APPROVED_ENTRY_DECISIONS = new Set([
  "approved",
  "approved-with-arabic-correction",
  "approved-with-translation-revision",
  "approved-with-transliteration-revision",
  "approved-with-source-correction",
]);
const CHANGE_ENTRY_DECISIONS = new Set([
  "approved-with-arabic-correction",
  "approved-with-translation-revision",
  "approved-with-transliteration-revision",
  "approved-with-source-correction",
]);

export interface DuaDhikrProgress {
  totalEntries: number;
  reviewedEntries: number;
  approvedEntries: number;
  entriesRequiringChanges: number;
  entriesRequiringSourceVerification: number;
  entriesKeptUnpublished: number;
  totalCollections: number;
  collectionsReviewed: number;
  entriesMissingSource: number;
  entriesMissingGrading: number;
  entriesWithTranslationConcerns: number;
  remainingEntries: number;
}

export function computeDuaDhikrProgress(
  entries: ReviewDuaDhikrEntrySummary[],
  entryReviews: DuaDhikrEntryReviewRecord[],
  totalCollections: number,
  collectionReviews: DuaDhikrCollectionReviewRecord[],
): DuaDhikrProgress {
  const byEntry = new Map(entryReviews.map((r) => [r.entryId, r]));
  let reviewed = 0;
  let approved = 0;
  let requiringChanges = 0;
  let requiringSourceVerification = 0;
  let keptUnpublished = 0;
  let translationConcerns = 0;
  let missingSource = 0;
  let missingGrading = 0;

  for (const entry of entries) {
    if (entry.sourceCount === 0 || entry.hasPlaceholderCitation) missingSource++;
    if (!entry.hasGrading) missingGrading++;
    const review = byEntry.get(entry._id);
    if (review?.decision) {
      reviewed++;
      if (APPROVED_ENTRY_DECISIONS.has(review.decision)) approved++;
      if (CHANGE_ENTRY_DECISIONS.has(review.decision)) requiringChanges++;
      if (review.decision === "additional-source-verification-required" || review.decision === "hadith-grading-required") requiringSourceVerification++;
      if (review.decision === "keep-unpublished" || review.decision === "reject-entry") keptUnpublished++;
      if (review.proposedTranslation) translationConcerns++;
    }
  }

  return {
    totalEntries: entries.length,
    reviewedEntries: reviewed,
    approvedEntries: approved,
    entriesRequiringChanges: requiringChanges,
    entriesRequiringSourceVerification: requiringSourceVerification,
    entriesKeptUnpublished: keptUnpublished,
    totalCollections,
    collectionsReviewed: collectionReviews.filter((r) => !!r.decision).length,
    entriesMissingSource: missingSource,
    entriesMissingGrading: missingGrading,
    entriesWithTranslationConcerns: translationConcerns,
    remainingEntries: entries.length - reviewed,
  };
}

export interface FeelingProgress {
  totalArchitected: number;
  launchCandidates: number;
  deferredStates: number;
  reviewed: number;
  missingContentStates: number;
  pairingConcerns: number;
  safeguardingSensitiveStates: number;
  remaining: number;
}

export function computeFeelingProgress(states: ReviewFeelingState[], reviews: FeelingStateReviewRecord[]): FeelingProgress {
  const byState = new Map(reviews.map((r) => [r.feelingStateId, r]));
  let reviewed = 0;
  let pairingConcerns = 0;
  let safeguardingSensitive = 0;
  const missingContent = states.filter((s) => s.featuredEntries.length === 0 && s.launchStatus === "launch").length;

  for (const state of states) {
    if (state.safeguardingLevel !== "standard") safeguardingSensitive++;
    const review = state.documentId ? byState.get(state.documentId) : undefined;
    if (review?.decision) {
      reviewed++;
      if (review.decision === "replace-religious-content-pairing" || review.sourceConcern) pairingConcerns++;
    }
  }

  return {
    totalArchitected: states.length,
    launchCandidates: states.filter((s) => s.launchStatus === "launch").length,
    deferredStates: states.filter((s) => s.launchStatus !== "launch").length,
    reviewed,
    missingContentStates: missingContent,
    pairingConcerns,
    safeguardingSensitiveStates: safeguardingSensitive,
    remaining: states.length - reviewed,
  };
}

/**
 * Cross-project readiness for one feeling state: it can only be
 * "ready to proceed" if every one of its featured entries has an
 * "approved*" decision from the SAME review session (docs' own decisions,
 * never inferred from publication status). Never auto-publishes anything —
 * purely an informational readiness signal for the dashboard/summary.
 */
export function computeFeelingReadiness(
  featuredEntryIds: string[],
  entryReviews: DuaDhikrEntryReviewRecord[],
): { ready: boolean; blockedByEntryIds: string[] } {
  const byId = new Map(entryReviews.map((r) => [r.entryId, r]));
  const blockedByEntryIds = featuredEntryIds.filter((id) => {
    const review = byId.get(id);
    return !review?.decision || !APPROVED_ENTRY_DECISIONS.has(review.decision);
  });
  return { ready: blockedByEntryIds.length === 0 && featuredEntryIds.length > 0, blockedByEntryIds };
}

/**
 * Submission-readiness for a programme: every item needs a decision, and
 * every decision that isn't a "no comment needed" one (see
 * decision-labels.ts) needs a non-empty comment. "Defer" exists precisely so
 * a scholar can mark an item as deliberately not-yet-resolved rather than
 * leaving it blank — so an unset decision always counts as a blocker.
 */
export interface SubmissionBlockers {
  missingDecisionCount: number;
  missingCommentCount: number;
  totalBlockers: number;
  firstBlockerId?: string;
}

export function computeDuaDhikrEntrySubmissionBlockers(entries: ReviewDuaDhikrEntrySummary[], entryReviews: DuaDhikrEntryReviewRecord[]): SubmissionBlockers {
  const byEntry = new Map(entryReviews.map((r) => [r.entryId, r]));
  let missingDecision = 0;
  let missingComment = 0;
  let firstBlockerId: string | undefined;
  for (const entry of entries) {
    const review = byEntry.get(entry._id);
    if (!review?.decision) {
      missingDecision++;
      if (!firstBlockerId) firstBlockerId = entry._id;
      continue;
    }
    if (!DUA_DHIKR_ENTRY_DECISIONS_NOT_REQUIRING_COMMENT.has(review.decision) && !review.comments?.trim()) {
      missingComment++;
      if (!firstBlockerId) firstBlockerId = entry._id;
    }
  }
  return { missingDecisionCount: missingDecision, missingCommentCount: missingComment, totalBlockers: missingDecision + missingComment, firstBlockerId };
}

export function computeDuaDhikrCollectionSubmissionBlockers(
  collections: ReviewDuaDhikrCollectionSummary[],
  collectionReviews: DuaDhikrCollectionReviewRecord[],
): SubmissionBlockers {
  const byCollection = new Map(collectionReviews.map((r) => [r.collectionId, r]));
  let missingDecision = 0;
  let missingComment = 0;
  let firstBlockerId: string | undefined;
  for (const collection of collections) {
    const review = byCollection.get(collection._id);
    if (!review?.decision) {
      missingDecision++;
      if (!firstBlockerId) firstBlockerId = collection._id;
      continue;
    }
    if (!DUA_DHIKR_COLLECTION_DECISIONS_NOT_REQUIRING_COMMENT.has(review.decision) && !review.comments?.trim()) {
      missingComment++;
      if (!firstBlockerId) firstBlockerId = collection._id;
    }
  }
  return { missingDecisionCount: missingDecision, missingCommentCount: missingComment, totalBlockers: missingDecision + missingComment, firstBlockerId };
}

export function computeFeelingStateSubmissionBlockers(states: ReviewFeelingState[], reviews: FeelingStateReviewRecord[]): SubmissionBlockers {
  const byState = new Map(reviews.map((r) => [r.feelingStateId, r]));
  let missingDecision = 0;
  let missingComment = 0;
  let firstBlockerId: string | undefined;
  for (const state of states) {
    const review = state.documentId ? byState.get(state.documentId) : undefined;
    if (!review?.decision) {
      missingDecision++;
      if (!firstBlockerId) firstBlockerId = state.slug;
      continue;
    }
    if (!FEELING_STATE_DECISIONS_NOT_REQUIRING_COMMENT.has(review.decision) && !review.comments?.trim()) {
      missingComment++;
      if (!firstBlockerId) firstBlockerId = state.slug;
    }
  }
  return { missingDecisionCount: missingDecision, missingCommentCount: missingComment, totalBlockers: missingDecision + missingComment, firstBlockerId };
}
