/**
 * Duʿa & Dhikr — draft-entry-creation safety tests.
 *
 * Covers the correction made after discovering that the entry importer's
 * live-mode write path constructed entry documents with the canonical root
 * id (`duaDhikrEntry-{id}`) directly, rather than a physical Sanity draft
 * (`drafts.duaDhikrEntry-{id}`) — meaning a live import would have created
 * real published/root documents immediately, not staged drafts. See
 * content-intake-workspace/live-entry-import/ for the investigation record
 * (git-excluded, not part of this diff).
 *
 * No Sanity access anywhere in this file. Every dry/live-mode test injects
 * fake `resolveCollectionId`/`checkEntryCollision` implementations. The
 * one "live mode" test that must observe the real mutation call shape
 * (Section 11's integration-style test) temporarily monkey-patches
 * `writeClient`'s methods in-process and restores them immediately after —
 * it never contacts the network. No religious entry content anywhere;
 * every fixture below is obviously synthetic ("Neutral sample entry",
 * "food-and-drink", "TEST-001"-style identifiers).
 */

import { writeClient } from "../../src/sanity/lib/write-client";
import {
  runDuaDhikrImport,
  canonicalEntryDocumentId,
  draftEntryDocumentId,
  canonicalCollectionIdFor,
  type CollectionResolution,
  type EntryCollisionResult,
} from "../../src/lib/dua-dhikr/import/import-content-document";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const neutralRow = {
  importIdentifier: "TEST-001",
  collectionSlug: "food-and-drink",
  titleEn: "Neutral sample entry",
  arabicText: "[TEST ARABIC PLACEHOLDER — NOT RELIGIOUS CONTENT]",
  translationEn: "[TEST TRANSLATION PLACEHOLDER]",
  references: [{ type: "other" as const, citation: "[TEST SOURCE PLACEHOLDER]" }],
};

function alwaysResolved(slug: string): CollectionResolution {
  return { slug, status: "resolved", resolvedId: canonicalCollectionIdFor(slug) };
}
async function fakeResolveAlwaysPublished(slug: string): Promise<CollectionResolution> {
  return alwaysResolved(slug);
}
async function fakeNoEntryCollision(importIdentifier: string): Promise<EntryCollisionResult> {
  return { importIdentifier, status: "no-collision" };
}

/* ── ID helpers ────────────────────────────────────────────────────────── */

function testCanonicalIdNormalisesCorrectly() {
  assert(canonicalEntryDocumentId("LWA-001") === "duaDhikrEntry-lwa-001", `got "${canonicalEntryDocumentId("LWA-001")}"`);
  assert(canonicalEntryDocumentId("test entry #1") === "duaDhikrEntry-test-entry--1", `got "${canonicalEntryDocumentId("test entry #1")}"`);
  console.log("✓ canonicalEntryDocumentId normalises importIdentifier correctly and deterministically");
}

function testDraftIdEqualsDraftsPrefixPlusCanonicalId() {
  const id = "TEST-002";
  assert(draftEntryDocumentId(id) === `drafts.${canonicalEntryDocumentId(id)}`, "draft id must equal drafts. + canonical id exactly");
  console.log("✓ draftEntryDocumentId equals drafts.${canonicalId} exactly");
}

function testDraftPrefixIsNotDuplicated() {
  const id = "TEST-003";
  const draft = draftEntryDocumentId(id);
  assert((draft.match(/drafts\./g) ?? []).length === 1, `draft id must contain exactly one "drafts." prefix, got "${draft}"`);
  console.log('✓ the "drafts." prefix is never duplicated');
}

function testEmptyOrInvalidIdentifierIsRejected() {
  let threw = false;
  try {
    canonicalEntryDocumentId("");
  } catch {
    threw = true;
  }
  assert(threw, "an empty importIdentifier must throw, not silently produce a malformed id");
  let whitespaceThrew = false;
  try {
    canonicalEntryDocumentId("   ");
  } catch {
    whitespaceThrew = true;
  }
  assert(whitespaceThrew, "a whitespace-only importIdentifier must also throw (trimmed to empty)");
  let draftThrew = false;
  try {
    draftEntryDocumentId("");
  } catch {
    draftThrew = true;
  }
  assert(draftThrew, "draftEntryDocumentId must also reject an empty identifier (it derives from the canonical helper)");
  console.log("✓ an empty/whitespace-only identifier is rejected by both id helpers");
}

function testVersionPrefixedIdsAreNeverProduced() {
  const samples = ["LWA-001", "test", "TEST-999", "a-b-c"];
  for (const s of samples) {
    assert(!canonicalEntryDocumentId(s).startsWith("versions."), `canonical id for "${s}" must never begin "versions."`);
    assert(!draftEntryDocumentId(s).startsWith("versions."), `draft id for "${s}" must never begin "versions."`);
  }
  console.log("✓ neither id helper can ever produce a versions.-prefixed id");
}

/* ── Dry run ───────────────────────────────────────────────────────────── */

async function testDryRunReportsWouldCreateDraft() {
  const report = await runDuaDhikrImport({ rows: [neutralRow], dryRun: true, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: fakeNoEntryCollision });
  assert(report.entries[0].action === "would-create-draft", `expected action "would-create-draft", got "${report.entries[0].action}"`);
  assert(report.entries[0].outcome === "would-write", `expected outcome "would-write", got "${report.entries[0].outcome}"`);
  console.log('✓ dry run reports action "would-create-draft" for an eligible row');
}

async function testDryRunReportsPhysicalAndCanonicalIds() {
  const report = await runDuaDhikrImport({ rows: [neutralRow], dryRun: true, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: fakeNoEntryCollision });
  const entry = report.entries[0];
  assert(entry.physicalDraftId === "drafts.duaDhikrEntry-test-001", `expected drafts.duaDhikrEntry-test-001, got "${entry.physicalDraftId}"`);
  assert(entry.canonicalDocumentId === "duaDhikrEntry-test-001", `expected duaDhikrEntry-test-001, got "${entry.canonicalDocumentId}"`);
  console.log("✓ dry run reports both the physical draft id and the future canonical id");
}

async function testDryRunPerformsNoMutation() {
  let mutationCalled = false;
  const originalCreate = writeClient.createIfNotExists;
  writeClient.createIfNotExists = (async (...args: unknown[]) => {
    mutationCalled = true;
    return originalCreate.apply(writeClient, args as never);
  }) as typeof writeClient.createIfNotExists;
  try {
    await runDuaDhikrImport({ rows: [neutralRow], dryRun: true, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: fakeNoEntryCollision });
    assert(!mutationCalled, "dry run must never call writeClient.createIfNotExists");
  } finally {
    writeClient.createIfNotExists = originalCreate;
  }
  console.log("✓ dry run performs zero mutations, even with a spy watching the real write client");
}

async function testDryRunBlocksOnRootCollision() {
  const collision = async (id: string): Promise<EntryCollisionResult> => ({ importIdentifier: id, status: "published-root-exists" });
  const report = await runDuaDhikrImport({ rows: [neutralRow], dryRun: true, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: collision });
  assert(report.entries[0].outcome === "skipped-invalid", "a published-root collision must block even a dry run");
  assert(report.entries[0].entryCollision?.status === "published-root-exists", "entryCollision.status must report published-root-exists");
  console.log("✓ dry run blocks when a root document already exists");
}

async function testDryRunBlocksOnDraftCollision() {
  const collision = async (id: string): Promise<EntryCollisionResult> => ({ importIdentifier: id, status: "draft-exists" });
  const report = await runDuaDhikrImport({ rows: [neutralRow], dryRun: true, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: collision });
  assert(report.entries[0].outcome === "skipped-invalid", "a draft collision must block even a dry run");
  assert(report.entries[0].entryCollision?.status === "draft-exists", "entryCollision.status must report draft-exists");
  console.log("✓ dry run blocks when a draft document already exists");
}

async function testDryRunBlocksOnBothCollision() {
  const collision = async (id: string): Promise<EntryCollisionResult> => ({ importIdentifier: id, status: "both-root-and-draft-exist" });
  const report = await runDuaDhikrImport({ rows: [neutralRow], dryRun: true, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: collision });
  assert(report.entries[0].outcome === "skipped-invalid", "a both-exist collision must block even a dry run");
  assert(report.entries[0].entryCollision?.status === "both-root-and-draft-exist", "entryCollision.status must report both-root-and-draft-exist");
  console.log("✓ dry run blocks when both physical forms already exist");
}

async function testDryRunResolvesOnlyPublishedCanonicalCollectionIds() {
  const report = await runDuaDhikrImport({ rows: [neutralRow], dryRun: true, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: fakeNoEntryCollision });
  assert(report.entries[0].collectionResolution?.resolvedId === "duaDhikrCollection-food-and-drink", "must resolve to the deterministic canonical collection id");
  console.log("✓ dry run resolves only published canonical collection ids");
}

async function testDryRunRejectsDraftCollectionReferenceEvenIfResolverClaimsResolved() {
  // A defensive test: a (hypothetically buggy) resolver that lies about its
  // own status must still be caught by checkDraftShape's own belt-and-braces
  // collection-reference check inside the entry-draft pipeline — proving the
  // layered defence, not just the collection-resolver's own classification.
  const lyingResolver = async (slug: string): Promise<CollectionResolution> => ({ slug, status: "resolved", resolvedId: `drafts.${canonicalCollectionIdFor(slug)}` });
  const report = await runDuaDhikrImport({ rows: [neutralRow], dryRun: true, resolveCollectionId: lyingResolver, checkEntryCollision: fakeNoEntryCollision });
  assert(report.entries[0].outcome === "skipped-invalid", "a draft-prefixed collection reference must be rejected even if the resolver's own status claims resolved");
  assert(report.entries[0].issues.some((i) => i.message.includes("Draft-shape validation failed")), "the rejection must come from the draft-shape check specifically");
  console.log("✓ dry run rejects a draft collection reference even from a resolver that (incorrectly) claims it resolved");
}

async function testDryRunRejectsVersionCollectionReferenceEvenIfResolverClaimsResolved() {
  const lyingResolver = async (slug: string): Promise<CollectionResolution> => ({ slug, status: "resolved", resolvedId: `versions.rel.${canonicalCollectionIdFor(slug)}` });
  const report = await runDuaDhikrImport({ rows: [neutralRow], dryRun: true, resolveCollectionId: lyingResolver, checkEntryCollision: fakeNoEntryCollision });
  assert(report.entries[0].outcome === "skipped-invalid", "a version-prefixed collection reference must be rejected even if the resolver's own status claims resolved");
  console.log("✓ dry run rejects a version collection reference even from a resolver that (incorrectly) claims it resolved");
}

/* ── Live mode (mocked writeClient — no network) ──────────────────────── */

interface CapturedCreate {
  _id: string;
  _type: string;
  collections?: { _ref: string }[];
  reviewStatus?: string;
  editorialPublicationStatus?: string;
  boardApprovals?: unknown[];
}

function withMockedWriteClient<T>(fn: (state: { creates: CapturedCreate[]; patchedIds: string[] }) => Promise<T>): Promise<T> {
  const state = { creates: [] as CapturedCreate[], patchedIds: [] as string[] };
  const originalCreateIfNotExists = writeClient.createIfNotExists;
  const originalPatch = writeClient.patch;

  writeClient.createIfNotExists = (async (doc: CapturedCreate) => {
    state.creates.push(doc);
    return doc;
  }) as typeof writeClient.createIfNotExists;

  writeClient.patch = ((id: string) => {
    state.patchedIds.push(id);
    return {
      set: () => ({ setIfMissing: () => ({ commit: async () => ({}) }) }),
    };
  }) as unknown as typeof writeClient.patch;

  return fn(state).finally(() => {
    writeClient.createIfNotExists = originalCreateIfNotExists;
    writeClient.patch = originalPatch;
  });
}

async function testLiveModePassesPhysicalDraftIdToCreateIfNotExists() {
  await withMockedWriteClient(async (state) => {
    await runDuaDhikrImport({ rows: [neutralRow], dryRun: false, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: fakeNoEntryCollision });
    assert(state.creates.length === 1, `expected exactly one createIfNotExists call, got ${state.creates.length}`);
    assert(state.creates[0]._id === "drafts.duaDhikrEntry-test-001", `expected "drafts.duaDhikrEntry-test-001", got "${state.creates[0]._id}"`);
    console.log("✓ live mode passes the physical draft id to createIfNotExists");
  });
}

async function testLiveModeNeverPassesCanonicalRootIdToAMutation() {
  await withMockedWriteClient(async (state) => {
    await runDuaDhikrImport({ rows: [neutralRow], dryRun: false, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: fakeNoEntryCollision });
    assert(state.creates[0]._id !== "duaDhikrEntry-test-001", "createIfNotExists must never receive the canonical root id");
    assert(!state.patchedIds.includes("duaDhikrEntry-test-001"), "patch() must never receive the canonical root id either");
    assert(state.patchedIds.every((id) => id.startsWith("drafts.")), "every patch() call must target a physical draft id");
    console.log("✓ live mode never passes the canonical root entry id to any mutation");
  });
}

async function testLiveModeMakesExactlyOneCollisionSafeCreation() {
  await withMockedWriteClient(async (state) => {
    const report = await runDuaDhikrImport({ rows: [neutralRow], dryRun: false, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: fakeNoEntryCollision });
    assert(state.creates.length === 1, "exactly one createIfNotExists call for one eligible row");
    assert(report.entries[0].outcome === "written", "outcome must be written");
    assert(report.entries[0].action === "created-draft", `expected action "created-draft", got "${report.entries[0].action}"`);
    console.log("✓ live mode makes exactly one collision-safe creation for one eligible entry");
  });
}

async function testLiveModeDoesNotWriteWhenDraftAssertionFails() {
  await withMockedWriteClient(async (state) => {
    const lyingResolver = async (slug: string): Promise<CollectionResolution> => ({ slug, status: "resolved", resolvedId: `drafts.${canonicalCollectionIdFor(slug)}` });
    const report = await runDuaDhikrImport({ rows: [neutralRow], dryRun: false, resolveCollectionId: lyingResolver, checkEntryCollision: fakeNoEntryCollision });
    assert(state.creates.length === 0, "no write may occur when the draft-shape check rejects the candidate document");
    assert(report.entries[0].outcome === "skipped-invalid", "outcome must be skipped-invalid, not written");
    console.log("✓ live mode never writes when the draft-shape check (mutation-boundary defence) fails");
  });
}

async function testLiveModeDoesNotOverwriteExistingDraft() {
  await withMockedWriteClient(async (state) => {
    const collision = async (id: string): Promise<EntryCollisionResult> => ({ importIdentifier: id, status: "draft-exists" });
    const report = await runDuaDhikrImport({ rows: [neutralRow], dryRun: false, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: collision });
    assert(state.creates.length === 0, "no write may occur when a draft already exists for this importIdentifier");
    assert(report.entries[0].outcome === "skipped-invalid", "an existing draft must never be silently treated as a successful new creation");
    console.log("✓ live mode never overwrites an existing draft — and never silently reports it as a fresh creation");
  });
}

async function testLiveModeDoesNotOverwriteExistingRootDocument() {
  await withMockedWriteClient(async (state) => {
    const collision = async (id: string): Promise<EntryCollisionResult> => ({ importIdentifier: id, status: "published-root-exists" });
    const report = await runDuaDhikrImport({ rows: [neutralRow], dryRun: false, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: collision });
    assert(state.creates.length === 0, "no write may occur when a published/root document already exists for this importIdentifier");
    assert(report.entries[0].outcome === "skipped-invalid", "an existing root document must block the write, never be patched");
    console.log("✓ live mode never overwrites an existing published/root document");
  });
}

async function testLiveModePreservesCanonicalCollectionReference() {
  await withMockedWriteClient(async (state) => {
    await runDuaDhikrImport({ rows: [neutralRow], dryRun: false, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: fakeNoEntryCollision });
    const ref = state.creates[0].collections?.[0]?._ref;
    assert(ref === "duaDhikrCollection-food-and-drink", `expected the canonical root collection reference, got "${ref}"`);
    console.log("✓ live mode preserves the canonical published-root collection reference on the created draft");
  });
}

async function testLiveModePreservesPublicationIneligibleWorkflowState() {
  await withMockedWriteClient(async (state) => {
    await runDuaDhikrImport({ rows: [neutralRow], dryRun: false, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: fakeNoEntryCollision });
    const doc = state.creates[0];
    assert(doc.reviewStatus === "sourced", `reviewStatus must remain "sourced", got "${doc.reviewStatus}"`);
    assert(doc.editorialPublicationStatus === "", `editorialPublicationStatus must remain empty, got "${doc.editorialPublicationStatus}"`);
    assert(!doc.boardApprovals || (doc.boardApprovals as unknown[]).length === 0, "boardApprovals must be empty at import time");
    console.log("✓ live mode preserves the publication-ineligible workflow state on the created draft");
  });
}

/* ── Section 11 — integration-style proof: draft, not root ────────────── */

async function testMutationIsEquivalentToDraftNotRoot() {
  await withMockedWriteClient(async (state) => {
    await runDuaDhikrImport({ rows: [neutralRow], dryRun: false, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: fakeNoEntryCollision });
    const created = state.creates[0];
    assert(created._id === "drafts.duaDhikrEntry-test-001", "the final mutation's _id must equal the physical draft id");
    assert(created._type === "duaDhikrEntry", "the final mutation's _type must be duaDhikrEntry");
    assert(created._id !== "duaDhikrEntry-test-001", "the final mutation must NOT be equivalent to creating the canonical root id");
    assert(created.collections?.[0]?._ref === "duaDhikrCollection-food-and-drink", "the collection reference must remain the canonical root id");
    console.log("✓ the final mutation is provably equivalent to creating drafts.duaDhikrEntry-test-001, and provably not equivalent to creating duaDhikrEntry-test-001");
  });
}

/* ── Batch behaviour ───────────────────────────────────────────────────── */

async function testFailedDraftShapeValidationPreventsBatchWrite() {
  await withMockedWriteClient(async (state) => {
    const lyingResolver = async (slug: string): Promise<CollectionResolution> => ({ slug, status: "resolved", resolvedId: `drafts.${canonicalCollectionIdFor(slug)}` });
    const rows = [neutralRow, { ...neutralRow, importIdentifier: "TEST-004" }];
    await runDuaDhikrImport({ rows, dryRun: false, resolveCollectionId: lyingResolver, checkEntryCollision: fakeNoEntryCollision });
    assert(state.creates.length === 0, "a draft-shape validation failure must prevent every row in the batch from writing when the resolver misbehaves for all of them");
    console.log("✓ a failed draft-shape validation prevents the affected batch rows from writing");
  });
}

async function testCollisionInABatchIsReportedAccurately() {
  await withMockedWriteClient(async (state) => {
    const rows = [neutralRow, { ...neutralRow, importIdentifier: "TEST-005" }];
    const collision = async (id: string): Promise<EntryCollisionResult> => (id === "TEST-005" ? { importIdentifier: id, status: "draft-exists" } : { importIdentifier: id, status: "no-collision" });
    const report = await runDuaDhikrImport({ rows, dryRun: false, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: collision });
    const test001 = report.entries.find((e) => e.importIdentifier === "TEST-001");
    const test005 = report.entries.find((e) => e.importIdentifier === "TEST-005");
    assert(test001?.outcome === "written", "TEST-001 (no collision) must be written");
    assert(test005?.outcome === "skipped-invalid", "TEST-005 (draft-exists) must be skipped");
    assert(state.creates.length === 1, "exactly one row should have been created — the collision must not block the whole batch, only the colliding row");
    console.log("✓ a collision affecting only one row in a batch is reported accurately, without blocking the other eligible row");
  });
}

async function testPartiallyFailedOperationIsNotSilentlyReportedAsFullySuccessful() {
  await withMockedWriteClient(async (state) => {
    const rows = [neutralRow, { ...neutralRow, importIdentifier: "TEST-006" }];
    const collision = async (id: string): Promise<EntryCollisionResult> => (id === "TEST-006" ? { importIdentifier: id, status: "published-root-exists" } : { importIdentifier: id, status: "no-collision" });
    const report = await runDuaDhikrImport({ rows, dryRun: false, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: collision });
    assert(report.invalid > 0, "a batch with one blocked row must report a nonzero invalid count, never silently claim full success");
    assert(report.entries.some((e) => e.outcome === "skipped-invalid"), "the blocked row must be explicitly visible in entries, not hidden");
    void state;
    console.log("✓ a partially failed batch is never silently reported as fully successful");
  });
}

async function testCreatedIdInventoriesContainPhysicalDraftIds() {
  await withMockedWriteClient(async () => {
    const report = await runDuaDhikrImport({ rows: [neutralRow], dryRun: false, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: fakeNoEntryCollision });
    const written = report.entries.filter((e) => e.outcome === "written");
    assert(written.length === 1, "expected exactly one written entry");
    assert(written[0].documentId === "drafts.duaDhikrEntry-test-001", "the reported documentId (used to build a created-ID inventory) must be the physical draft id");
    assert(written[0].physicalDraftId === "drafts.duaDhikrEntry-test-001", "physicalDraftId must be the physical draft id");
    console.log("✓ created-ID inventories built from the import report contain physical draft ids, never canonical root ids");
  });
}

async function runAll() {
  testCanonicalIdNormalisesCorrectly();
  testDraftIdEqualsDraftsPrefixPlusCanonicalId();
  testDraftPrefixIsNotDuplicated();
  testEmptyOrInvalidIdentifierIsRejected();
  testVersionPrefixedIdsAreNeverProduced();

  await testDryRunReportsWouldCreateDraft();
  await testDryRunReportsPhysicalAndCanonicalIds();
  await testDryRunPerformsNoMutation();
  await testDryRunBlocksOnRootCollision();
  await testDryRunBlocksOnDraftCollision();
  await testDryRunBlocksOnBothCollision();
  await testDryRunResolvesOnlyPublishedCanonicalCollectionIds();
  await testDryRunRejectsDraftCollectionReferenceEvenIfResolverClaimsResolved();
  await testDryRunRejectsVersionCollectionReferenceEvenIfResolverClaimsResolved();

  await testLiveModePassesPhysicalDraftIdToCreateIfNotExists();
  await testLiveModeNeverPassesCanonicalRootIdToAMutation();
  await testLiveModeMakesExactlyOneCollisionSafeCreation();
  await testLiveModeDoesNotWriteWhenDraftAssertionFails();
  await testLiveModeDoesNotOverwriteExistingDraft();
  await testLiveModeDoesNotOverwriteExistingRootDocument();
  await testLiveModePreservesCanonicalCollectionReference();
  await testLiveModePreservesPublicationIneligibleWorkflowState();

  await testMutationIsEquivalentToDraftNotRoot();

  await testFailedDraftShapeValidationPreventsBatchWrite();
  await testCollisionInABatchIsReportedAccurately();
  await testPartiallyFailedOperationIsNotSilentlyReportedAsFullySuccessful();
  await testCreatedIdInventoriesContainPhysicalDraftIds();

  console.log("\nAll Duʿa & Dhikr draft-entry-creation tests passed.");
}

runAll();
