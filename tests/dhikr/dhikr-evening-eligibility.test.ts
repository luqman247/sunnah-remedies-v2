/**
 * Evening Dhikr eligibility tests.
 *
 * Covers the explicit Evening-eligibility rule: a record may appear on the
 * Evening Dhikr page only when its documented timing is "evening-only" or
 * "morning-and-evening" — never "morning-only", never "uncertain", and never
 * merely because it happens to appear on Morning. See
 * isEveningEligibleTiming / getPendingEveningReferenceCollection /
 * getEveningEligibleTotalCount in src/lib/dhikr-research/public-reference-
 * projection.ts, and getEveningDhikrItemsPublic in
 * src/sanity/lib/dhikr-public-fetch.ts (the Sanity-side equivalent for
 * already-reviewed items).
 *
 * Plain assert()-based, run via `npx tsx`.
 */

import fs from "node:fs";
import path from "node:path";
import { MORNING_DHIKR_SOURCE_REGISTER } from "../../src/lib/dhikr-research/morning-dhikr-register";
import type { MorningSpecificStatus } from "../../src/lib/dhikr-research/types";
import {
  isEveningEligibleTiming,
  getPendingEveningReferenceCollection,
  getPendingReferenceCollection,
  getEveningEligibleTotalCount,
  getSourceRegisterTotalCount,
} from "../../src/lib/dhikr-research/public-reference-projection";
import { getEveningDhikrItemsPublic, getMorningDhikrItemsPublic } from "../../src/sanity/lib/dhikr-public-fetch";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = path.resolve(__dirname, "../..");

/** The two currently-published records — kept in sync with the live editorial launch. */
const CURRENTLY_PUBLISHED_IDS = ["MDR-002", "MDR-011"];

/* ── 1. isEveningEligibleTiming — the single source of truth ────────── */

function testIsEveningEligibleTimingRules() {
  assert(isEveningEligibleTiming("evening-only") === true, '"evening-only" must be Evening-eligible');
  assert(isEveningEligibleTiming("morning-and-evening") === true, '"morning-and-evening" must be Evening-eligible');
  assert(isEveningEligibleTiming("morning-only") === false, '"morning-only" must NOT be Evening-eligible');
  assert(isEveningEligibleTiming("uncertain") === false, '"uncertain" must NOT be Evening-eligible');
  assert(isEveningEligibleTiming("not-time-specific") === false, '"not-time-specific" must NOT be Evening-eligible');
  console.log("✓ isEveningEligibleTiming accepts only evening-only/morning-and-evening, rejects morning-only/uncertain/not-time-specific");
}

/* ── 2. Pending Evening collection is a documented subset ───────────── */

function testPendingEveningIsStrictSubsetOfPendingMorning() {
  const morningPending = getPendingReferenceCollection(CURRENTLY_PUBLISHED_IDS);
  const eveningPending = getPendingEveningReferenceCollection(CURRENTLY_PUBLISHED_IDS);
  const morningIds = new Set(morningPending.map((e) => e.internalId));
  for (const entry of eveningPending) {
    assert(morningIds.has(entry.internalId), `${entry.internalId} appears in Evening pending but not in Morning pending — Evening must be a subset`);
  }
  assert(eveningPending.length < morningPending.length, "Evening pending must be a strict subset (some Morning-only/uncertain records excluded)");
  console.log(`✓ Evening pending (${eveningPending.length}) is a strict subset of Morning pending (${morningPending.length})`);
}

function testPendingEveningExcludesMorningOnlyAndUncertain() {
  const byId = new Map(MORNING_DHIKR_SOURCE_REGISTER.map((r) => [r.internalId, r]));
  const eveningPending = getPendingEveningReferenceCollection(CURRENTLY_PUBLISHED_IDS);
  for (const entry of eveningPending) {
    const record = byId.get(entry.internalId)!;
    assert(record.morningSpecificStatus !== "morning-only", `${entry.internalId} is morning-only and must never appear in the Evening pending collection`);
    assert(record.morningSpecificStatus !== "uncertain", `${entry.internalId} has uncertain timing and must never appear in the Evening pending collection`);
    assert(
      record.morningSpecificStatus === "evening-only" || record.morningSpecificStatus === "morning-and-evening",
      `${entry.internalId} has unexpected morningSpecificStatus "${record.morningSpecificStatus}" in the Evening pending collection`,
    );
  }
  // Known morning-only records from the live register must be absent by name.
  const eveningPendingIds = new Set(eveningPending.map((e) => e.internalId));
  for (const knownMorningOnlyId of ["MDR-005", "MDR-029"]) {
    const record = byId.get(knownMorningOnlyId);
    assert(!!record && record.morningSpecificStatus === "morning-only", `Test fixture assumption broken: ${knownMorningOnlyId} is expected to be morning-only in the live register`);
    assert(!eveningPendingIds.has(knownMorningOnlyId), `${knownMorningOnlyId} (morning-only) must not appear in the Evening pending collection`);
  }
  console.log("✓ no morning-only or timing-uncertain record appears in the Evening pending collection");
}

function testEveningOnlyRecordIsIncluded() {
  const eveningPending = getPendingEveningReferenceCollection(CURRENTLY_PUBLISHED_IDS);
  const ids = new Set(eveningPending.map((e) => e.internalId));
  assert(ids.has("MDR-028"), "MDR-028 (evening-only in the live register) must appear in the Evening pending collection");
  console.log("✓ the one evening-only live record (MDR-028) is included");
}

/* ── 3. Total counts are data-derived, not hardcoded ─────────────────── */

function testEveningEligibleTotalCountIsDataDerived() {
  const mechanicalCount = MORNING_DHIKR_SOURCE_REGISTER.filter((r) => isEveningEligibleTiming(r.morningSpecificStatus)).length;
  assert(getEveningEligibleTotalCount() === mechanicalCount, "getEveningEligibleTotalCount must equal a fresh mechanical recount of the live register");
  assert(getEveningEligibleTotalCount() < getSourceRegisterTotalCount(), "The Evening-eligible total must be smaller than the full 30-record register total");
  console.log(`✓ getEveningEligibleTotalCount() (${getEveningEligibleTotalCount()}) matches a fresh mechanical recount and is smaller than the full register (${getSourceRegisterTotalCount()})`);
}

async function testReviewedPlusPendingEqualsEveningEligibleTotal() {
  const reviewed = await getEveningDhikrItemsPublic();
  const publishedIds = reviewed.map((i) => i.mdrSourceId).filter((id): id is string => !!id);
  const pending = getPendingEveningReferenceCollection(publishedIds);
  const total = getEveningEligibleTotalCount();
  assert(reviewed.length + pending.length === total, `Evening reviewed (${reviewed.length}) + pending (${pending.length}) must equal the Evening-eligible total (${total})`);
  console.log(`✓ live Evening coverage is exact: ${reviewed.length} reviewed + ${pending.length} pending = ${total} Evening-eligible total`);
}

/* ── 4. Sanity-side (reviewed) Evening items never include morning-only ── */

async function testReviewedEveningItemsNeverMorningOnly() {
  const items = await getEveningDhikrItemsPublic();
  for (const item of items) {
    assert(item.timingLabel === "evening-only" || item.timingLabel === "morning-and-evening", `Reviewed Evening item ${item.mdrSourceId} has disallowed timingLabel "${item.timingLabel}"`);
  }
  console.log(`✓ every live reviewed Evening item (${items.length}) has an Evening-eligible timingLabel`);
}

async function testEveningAndMorningReviewedSetsOverlapOnlyOnSharedTiming() {
  const morning = await getMorningDhikrItemsPublic();
  const evening = await getEveningDhikrItemsPublic();
  const eveningIds = new Set(evening.map((i) => i.mdrSourceId));
  for (const item of morning) {
    if (item.timingLabel === "morning-and-evening") {
      assert(eveningIds.has(item.mdrSourceId), `${item.mdrSourceId} is morning-and-evening on Morning but missing from Evening`);
    } else if (item.timingLabel === "morning-only") {
      assert(!eveningIds.has(item.mdrSourceId), `${item.mdrSourceId} is morning-only but appears on Evening`);
    }
  }
  console.log("✓ Morning and Evening reviewed sets agree exactly on every item's documented timing — no record is included on Evening merely because it appears on Morning");
}

/* ── 5. Independence from Morning's filter (no shared mutable state) ─── */

function testEveningFilterIndependentlyDefined() {
  const fetchSource = fs.readFileSync(path.join(REPO_ROOT, "src/sanity/lib/dhikr-public-fetch.ts"), "utf8");
  assert(fetchSource.includes("const EVENING_TIMING_LABELS = new Set"), "EVENING_TIMING_LABELS must be an independently declared constant, not derived from MORNING_TIMING_LABELS");
  assert(!/EVENING_TIMING_LABELS\s*=\s*MORNING_TIMING_LABELS/.test(fetchSource), "EVENING_TIMING_LABELS must not alias MORNING_TIMING_LABELS");
  console.log("✓ [static check] Evening's timing filter is an independently declared constant, not derived from Morning's");
}

async function runAll() {
  testIsEveningEligibleTimingRules();
  testPendingEveningIsStrictSubsetOfPendingMorning();
  testPendingEveningExcludesMorningOnlyAndUncertain();
  testEveningOnlyRecordIsIncluded();
  testEveningEligibleTotalCountIsDataDerived();
  await testReviewedPlusPendingEqualsEveningEligibleTotal();
  await testReviewedEveningItemsNeverMorningOnly();
  await testEveningAndMorningReviewedSetsOverlapOnlyOnSharedTiming();
  testEveningFilterIndependentlyDefined();
  console.log("\nAll Evening Dhikr eligibility tests passed.");
}

runAll();
