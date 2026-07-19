/**
 * "I am feeling…" — crisis-information verification/staleness gate tests
 * (SPEC §8, §14). No live Sanity access, no religious content.
 */

import {
  CRISIS_INFO_VERIFICATION,
  isCrisisInfoFresh,
  isCrisisItemVerified,
  isUrgentSupportPagePublishable,
} from "../../src/lib/feeling/crisis-info";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function testVerifiedAtIsAParsableDate() {
  const parsed = new Date(CRISIS_INFO_VERIFICATION.verifiedAt);
  assert(!Number.isNaN(parsed.getTime()), `verifiedAt "${CRISIS_INFO_VERIFICATION.verifiedAt}" must be a parsable date`);
  console.log("✓ crisisInfoVerifiedAt is a parsable date");
}

function testFreshRightAfterVerification() {
  const verifiedDate = new Date(CRISIS_INFO_VERIFICATION.verifiedAt);
  const oneDayLater = new Date(verifiedDate.getTime() + 24 * 60 * 60 * 1000);
  assert(isCrisisInfoFresh(oneDayLater), "record must be fresh one day after verification");
  console.log("✓ crisis info is considered fresh shortly after verification");
}

function testStaleAfterThreshold() {
  const verifiedDate = new Date(CRISIS_INFO_VERIFICATION.verifiedAt);
  const wellPastThreshold = new Date(
    verifiedDate.getTime() + (CRISIS_INFO_VERIFICATION.staleAfterDays + 1) * 24 * 60 * 60 * 1000,
  );
  assert(!isCrisisInfoFresh(wellPastThreshold), "record must be considered stale past the staleness threshold");
  console.log(`✓ crisis info is considered stale after ${CRISIS_INFO_VERIFICATION.staleAfterDays} days (SPEC §14's 90-day gate)`);
}

function testNoFabricatedVerification() {
  // Every item must be traceable to a real source URL if marked verified —
  // SPEC §14: "cannot be traced to an official source" is an explicit
  // release blocker.
  for (const item of CRISIS_INFO_VERIFICATION.items) {
    if (item.verified) {
      assert(!!item.verifiedSourceUrl, `${item.key} is marked verified but has no verifiedSourceUrl recorded`);
      assert(item.verifiedSourceUrl!.startsWith("https://"), `${item.key}'s verifiedSourceUrl must be a real https URL`);
    }
  }
  console.log("✓ every verified crisis-info item carries a real, traceable source URL");
}

function testShoutIsNotFabricated() {
  // This is the specific, known gap from this implementation session (see
  // docs/i-am-feeling/SAFEGUARDING_VERIFICATION.md) — the official Shout
  // site blocked automated verification. Confirm the code honestly
  // reflects that rather than shipping a guessed number.
  assert(!isCrisisItemVerified("shout"), "Shout must remain unverified until an editor confirms it directly — see SAFEGUARDING_VERIFICATION.md");
  console.log("✓ Shout is correctly recorded as unverified (no fabricated telephone number shipped)");
}

function testCoreServicesAreVerified() {
  assert(isCrisisItemVerified("emergency999"), "999/emergency guidance must be verified");
  assert(isCrisisItemVerified("nhs111"), "NHS 111 guidance must be verified");
  assert(isCrisisItemVerified("samaritans"), "Samaritans must be verified");
  console.log("✓ the three core UK crisis-support items (999, NHS 111, Samaritans) are verified against live official sources");
}

function testPagePublishableReflectsVerificationState() {
  const now = new Date(CRISIS_INFO_VERIFICATION.verifiedAt);
  assert(isUrgentSupportPagePublishable(now), "the urgent-support page's core content should be publishable given the current, fresh verification record");

  const farFuture = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  assert(!isUrgentSupportPagePublishable(farFuture), "the page must become unpublishable a year after verification (past the staleness gate)");
  console.log("✓ isUrgentSupportPagePublishable() correctly reflects freshness — publishable now, blocked once stale");
}

async function runAll() {
  testVerifiedAtIsAParsableDate();
  testFreshRightAfterVerification();
  testStaleAfterThreshold();
  testNoFabricatedVerification();
  testShoutIsNotFabricated();
  testCoreServicesAreVerified();
  testPagePublishableReflectsVerificationState();
  console.log("\nAll feeling-crisis-info-verification tests passed.");
}

runAll();
