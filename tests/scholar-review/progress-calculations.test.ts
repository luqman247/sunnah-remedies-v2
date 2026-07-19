/**
 * "Scholar Review" portal — progress/readiness/submission-blocker
 * calculation tests.
 *
 * Pure checks against src/lib/scholar-review/progress.ts using synthetic
 * fixtures shaped like the real data-layer types — no live Sanity access,
 * no religious content (fixture titles are all placeholders).
 */

import {
  computeDuaDhikrProgress,
  computeFeelingProgress,
  computeFeelingReadiness,
  computeDuaDhikrEntrySubmissionBlockers,
  computeDuaDhikrCollectionSubmissionBlockers,
  computeFeelingStateSubmissionBlockers,
} from "../../src/lib/scholar-review/progress";
import type { ReviewDuaDhikrEntrySummary, ReviewDuaDhikrCollectionSummary } from "../../src/lib/scholar-review/dua-dhikr-review-data";
import type { ReviewFeelingState } from "../../src/lib/scholar-review/feeling-review-data";
import type { DuaDhikrEntryReviewRecord, DuaDhikrCollectionReviewRecord, FeelingStateReviewRecord } from "../../src/lib/scholar-review/review-records";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function makeEntry(overrides: Partial<ReviewDuaDhikrEntrySummary> & { _id: string }): ReviewDuaDhikrEntrySummary {
  return {
    titleEn: "Placeholder entry",
    collections: [],
    hasArabic: true,
    hasTranslationEn: true,
    hasTranslationDa: true,
    sourceCount: 1,
    hasGrading: true,
    hasPlaceholderCitation: false,
    hasVirtueText: true,
    ...overrides,
  };
}

function makeEntryReview(overrides: Partial<DuaDhikrEntryReviewRecord> & { entryId: string }): DuaDhikrEntryReviewRecord {
  return {
    _id: `review-${overrides.entryId}`,
    createdAt: new Date().toISOString(),
    completed: false,
    ...overrides,
  };
}

function makeCollection(overrides: Partial<ReviewDuaDhikrCollectionSummary> & { _id: string }): ReviewDuaDhikrCollectionSummary {
  return { titleEn: "Placeholder collection", slug: overrides._id, entryCount: 0, ...overrides };
}

function makeCollectionReview(overrides: Partial<DuaDhikrCollectionReviewRecord> & { collectionId: string }): DuaDhikrCollectionReviewRecord {
  return { _id: `review-${overrides.collectionId}`, createdAt: new Date().toISOString(), completed: false, ...overrides };
}

function makeFeelingState(overrides: Partial<ReviewFeelingState> & { slug: string }): ReviewFeelingState {
  return {
    family: "heart-feels-heavy",
    labelEn: "Placeholder feeling",
    oneLineDescriptionEn: "Placeholder.",
    tone: "heavy",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    aliases: [],
    relatedSlugs: [],
    documentExists: true,
    featuredEntries: [],
    relatedFeelingSlugs: [],
    ...overrides,
  };
}

function makeFeelingReview(overrides: Partial<FeelingStateReviewRecord> & { feelingStateId: string }): FeelingStateReviewRecord {
  return { _id: `review-${overrides.feelingStateId}`, createdAt: new Date().toISOString(), completed: false, ...overrides };
}

function testDuaDhikrProgressCountsEachBucketIndependently() {
  const entries = [
    makeEntry({ _id: "e1" }),
    makeEntry({ _id: "e2" }),
    makeEntry({ _id: "e3", sourceCount: 0 }),
    makeEntry({ _id: "e4", hasGrading: false }),
    makeEntry({ _id: "e5" }),
  ];
  const entryReviews = [
    makeEntryReview({ entryId: "e1", decision: "approved" }),
    makeEntryReview({ entryId: "e2", decision: "approved-with-translation-revision", proposedTranslation: "revised text" }),
    makeEntryReview({ entryId: "e3", decision: "additional-source-verification-required" }),
    makeEntryReview({ entryId: "e4", decision: "keep-unpublished" }),
    // e5 intentionally has no review at all
  ];
  const progress = computeDuaDhikrProgress(entries, entryReviews, 3, [makeCollectionReview({ collectionId: "c1", decision: "approved" })]);

  assert(progress.totalEntries === 5, "totalEntries must reflect every entry passed in");
  assert(progress.reviewedEntries === 4, "reviewedEntries must count only entries with a decision");
  assert(progress.approvedEntries === 2, "approvedEntries must count both plain and revision-flavoured approvals");
  assert(progress.entriesRequiringChanges === 1, "entriesRequiringChanges must count the translation-revision decision");
  assert(progress.entriesRequiringSourceVerification === 1, "entriesRequiringSourceVerification must count the verification-required decision");
  assert(progress.entriesKeptUnpublished === 1, "entriesKeptUnpublished must count keep-unpublished/reject-entry decisions");
  assert(progress.entriesWithTranslationConcerns === 1, "entriesWithTranslationConcerns must count entries with a proposedTranslation");
  assert(progress.entriesMissingSource === 1, "entriesMissingSource must count zero-source entries");
  assert(progress.entriesMissingGrading === 1, "entriesMissingGrading must count entries without hadith grading");
  assert(progress.totalCollections === 3, "totalCollections must reflect the count passed in, independent of entries");
  assert(progress.collectionsReviewed === 1, "collectionsReviewed must count only collection reviews with a decision");
  assert(progress.remainingEntries === 1, "remainingEntries must be totalEntries minus reviewedEntries");
  console.log("✓ computeDuaDhikrProgress buckets entries and collections independently and correctly");
}

function testFeelingProgressDistinguishesLaunchAndDeferred() {
  const featuredEntry = { entryId: "e1", entry: null };
  const states = [
    makeFeelingState({ slug: "s1", launchStatus: "launch", featuredEntries: [featuredEntry] }),
    makeFeelingState({ slug: "s2", launchStatus: "deferred" }),
    makeFeelingState({ slug: "s3", launchStatus: "launch", featuredEntries: [] }),
    makeFeelingState({ slug: "s4", launchStatus: "launch", safeguardingLevel: "heightened", featuredEntries: [featuredEntry] }),
  ];
  const reviews = [
    makeFeelingReview({ feelingStateId: "s1", decision: "approved" }),
    makeFeelingReview({ feelingStateId: "s2", decision: "deferred" }),
  ];
  // documentId must match feelingStateId used in reviews for the join to work
  states[0].documentId = "s1";
  states[1].documentId = "s2";
  states[2].documentId = "s3";
  states[3].documentId = "s4";

  const progress = computeFeelingProgress(states, reviews);
  assert(progress.totalArchitected === 4, "totalArchitected must count every state regardless of launch status");
  assert(progress.launchCandidates === 3, "launchCandidates must count only launch-status states");
  assert(progress.deferredStates === 1, "deferredStates must count non-launch states");
  assert(progress.reviewed === 2, "reviewed must count states with a decision");
  assert(progress.missingContentStates === 1, "missingContentStates must count launch states with zero featured entries");
  assert(progress.safeguardingSensitiveStates === 1, "safeguardingSensitiveStates must count non-standard safeguarding levels");
  console.log("✓ computeFeelingProgress distinguishes launch vs deferred and flags missing content / safeguarding");
}

function testFeelingReadinessBlocksOnUnapprovedEntries() {
  const entryReviews = [
    makeEntryReview({ entryId: "e1", decision: "approved" }),
    makeEntryReview({ entryId: "e2", decision: "additional-source-verification-required" }),
  ];
  const readyResult = computeFeelingReadiness(["e1"], entryReviews);
  assert(readyResult.ready, "a state whose only featured entry is approved must be ready");
  assert(readyResult.blockedByEntryIds.length === 0, "a ready state must have zero blockers");

  const blockedResult = computeFeelingReadiness(["e1", "e2"], entryReviews);
  assert(!blockedResult.ready, "a state with one unapproved featured entry must not be ready");
  assert(blockedResult.blockedByEntryIds.length === 1 && blockedResult.blockedByEntryIds[0] === "e2", "the specific blocking entry id must be reported");

  const missingReviewResult = computeFeelingReadiness(["e3"], entryReviews);
  assert(!missingReviewResult.ready, "a featured entry with no review record at all must block readiness");

  const noEntriesResult = computeFeelingReadiness([], entryReviews);
  assert(!noEntriesResult.ready, "a state with zero featured entries must never report ready (matches the missing-content states)");
  console.log("✓ computeFeelingReadiness only reports ready when every featured entry is independently approved");
}

function testDuaDhikrEntrySubmissionBlockersRequireDecisionsAndComments() {
  const entries = [makeEntry({ _id: "e1" }), makeEntry({ _id: "e2" }), makeEntry({ _id: "e3" })];
  const reviews = [
    makeEntryReview({ entryId: "e1", decision: "approved" }), // fine, no comment required
    makeEntryReview({ entryId: "e2", decision: "keep-unpublished" }), // missing required comment
    // e3 has no review at all
  ];
  const blockers = computeDuaDhikrEntrySubmissionBlockers(entries, reviews);
  assert(blockers.missingDecisionCount === 1, "e3 with no review at all must count as a missing-decision blocker");
  assert(blockers.missingCommentCount === 1, "e2's keep-unpublished decision without a comment must count as a missing-comment blocker");
  assert(blockers.totalBlockers === 2, "totalBlockers must be the sum of both categories");
  assert(!!blockers.firstBlockerId, "firstBlockerId must be populated when blockers exist");
  console.log("✓ Duʿā & Dhikr entry submission is blocked by both missing decisions and missing required comments");
}

function testDuaDhikrEntrySubmissionHasNoBlockersWhenComplete() {
  const entries = [makeEntry({ _id: "e1" }), makeEntry({ _id: "e2" })];
  const reviews = [
    makeEntryReview({ entryId: "e1", decision: "approved" }),
    makeEntryReview({ entryId: "e2", decision: "defer" }),
  ];
  const blockers = computeDuaDhikrEntrySubmissionBlockers(entries, reviews);
  assert(blockers.totalBlockers === 0, "Approved and Defer decisions require no comment, so a fully-decided set must have zero blockers");
  console.log("✓ a fully-decided entry set (using Approved/Defer) has zero submission blockers");
}

function testDuaDhikrCollectionSubmissionBlockers() {
  const collections = [makeCollection({ _id: "c1" }), makeCollection({ _id: "c2" })];
  const reviews = [makeCollectionReview({ collectionId: "c1", decision: "reorder-entries" })]; // missing comment; c2 missing entirely
  const blockers = computeDuaDhikrCollectionSubmissionBlockers(collections, reviews);
  assert(blockers.missingDecisionCount === 1, "c2 must count as a missing-decision blocker");
  assert(blockers.missingCommentCount === 1, "c1's reorder-entries decision without a comment must count as a missing-comment blocker");
  console.log("✓ Duʿā & Dhikr collection submission blockers mirror the entry-level rule");
}

function testFeelingStateSubmissionBlockers() {
  const states = [makeFeelingState({ slug: "s1", documentId: "s1" }), makeFeelingState({ slug: "s2", documentId: "s2" })];
  const reviews = [makeFeelingReview({ feelingStateId: "s1", decision: "replace-religious-content-pairing" })]; // missing comment; s2 missing entirely
  const blockers = computeFeelingStateSubmissionBlockers(states, reviews);
  assert(blockers.missingDecisionCount === 1, "s2 must count as a missing-decision blocker");
  assert(blockers.missingCommentCount === 1, "s1's replace-pairing decision without a comment must count as a missing-comment blocker");
  console.log("✓ feeling-state submission blockers require both a decision and, where mandated, a comment");
}

function runAll() {
  testDuaDhikrProgressCountsEachBucketIndependently();
  testFeelingProgressDistinguishesLaunchAndDeferred();
  testFeelingReadinessBlocksOnUnapprovedEntries();
  testDuaDhikrEntrySubmissionBlockersRequireDecisionsAndComments();
  testDuaDhikrEntrySubmissionHasNoBlockersWhenComplete();
  testDuaDhikrCollectionSubmissionBlockers();
  testFeelingStateSubmissionBlockers();
  console.log("\nAll scholar-review progress-calculation tests passed.");
}

runAll();
