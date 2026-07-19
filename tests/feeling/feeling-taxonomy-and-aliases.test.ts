/**
 * "I am feeling…" — taxonomy structure and alias-resolution tests.
 *
 * Pure checks against src/lib/feeling/taxonomy.ts — no live Sanity access.
 * No religious content in any fixture (this file never touches
 * duaDhikrEntry text).
 */

import {
  CANONICAL_FEELING_STATES,
  CANONICAL_FEELING_STATE_SLUGS,
  CANONICAL_FEELING_FAMILY_SLUGS,
  FEELING_FAMILIES,
  resolveFeelingSlug,
  getCanonicalFeelingState,
  getLaunchFeelingStates,
  getFeelingStatesByFamily,
} from "../../src/lib/feeling/taxonomy";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function testEverySlugIsUnique() {
  const seen = new Set<string>();
  for (const slug of CANONICAL_FEELING_STATE_SLUGS) {
    assert(!seen.has(slug), `duplicate feeling-state slug: ${slug}`);
    seen.add(slug);
  }
  console.log(`✓ all ${CANONICAL_FEELING_STATE_SLUGS.length} feeling-state slugs are unique`);
}

function testEveryFamilyReferenceIsValid() {
  for (const state of CANONICAL_FEELING_STATES) {
    assert(
      (CANONICAL_FEELING_FAMILY_SLUGS as string[]).includes(state.family),
      `${state.slug} references unknown family "${state.family}"`,
    );
  }
  console.log("✓ every feeling state references a real family");
}

function testLaunchCountMatchesSpec() {
  const launch = getLaunchFeelingStates();
  assert(launch.length === 17, `expected 17 launch states, got ${launch.length}`);
  console.log(`✓ exactly 17 launch states (docs/i-am-feeling/SPEC.md §4 table)`);
}

function testTroubledByDoubtsIsDeferredNotExcluded() {
  const state = getCanonicalFeelingState("troubled-by-doubts");
  assert(!!state, "troubled-by-doubts must exist in the architecture");
  assert(state!.launchStatus === "deferred", "troubled-by-doubts must be deferred, not launch or not-suitable");
  assert(state!.safeguardingLevel === "heightened", "troubled-by-doubts must require the heightened gate");
  console.log("✓ troubled-by-doubts is architected and deferred, never excluded");
}

function testNoDeferredOrNotSuitableStateIsInLaunchList() {
  const launch = getLaunchFeelingStates();
  for (const state of launch) {
    assert(state.launchStatus === "launch", `${state.slug} in launch list but launchStatus is ${state.launchStatus}`);
  }
  console.log("✓ getLaunchFeelingStates() never returns a deferred/not-suitable state");
}

function testCompassionateAliasesResolveToCompassionateLabels() {
  // SPEC §7.2: condemning words a visitor might type must still resolve
  // somewhere compassionate — never a dead end, never their own tile.
  const hypocrite = resolveFeelingSlug("hypocrite");
  assert(hypocrite === "struggling-with-sincerity", `"hypocrite" must resolve to struggling-with-sincerity, got ${hypocrite}`);

  const jealous = resolveFeelingSlug("jealous");
  assert(jealous === "struggling-with-envy", `"jealous" must resolve to struggling-with-envy, got ${jealous}`);

  for (const state of CANONICAL_FEELING_STATES) {
    assert(
      !/hypocrit|suicid|self.?harm/i.test(state.labelEn),
      `public label "${state.labelEn}" must never use condemning/crisis language directly`,
    );
  }
  console.log("✓ compassionate-label aliases resolve correctly, no condemning public labels exist");
}

function testAliasResolutionIsCaseInsensitive() {
  assert(resolveFeelingSlug("HYPOCRITE") === "struggling-with-sincerity", "alias resolution must be case-insensitive");
  console.log("✓ alias resolution is case-insensitive");
}

function testFamilyGroupingCoversEveryLaunchFamily() {
  for (const family of FEELING_FAMILIES) {
    const states = getFeelingStatesByFamily(family.key);
    assert(states.length > 0, `family ${family.key} has zero states at all`);
  }
  console.log("✓ every family has at least one state (launch or deferred)");
}

function testNoCrisisTermAppearsAsAPublicLabelOrSlug() {
  const CRISIS_WORDS = ["suicid", "self-harm", "self harm", "kill myself"];
  for (const state of CANONICAL_FEELING_STATES) {
    const haystack = `${state.slug} ${state.labelEn} ${state.aliases.join(" ")}`.toLowerCase();
    for (const word of CRISIS_WORDS) {
      assert(!haystack.includes(word), `feeling state "${state.slug}" must never carry a crisis term ("${word}") as its own label/slug/alias`);
    }
  }
  console.log("✓ no launch or deferred feeling state carries a crisis term as its own label/slug/alias");
}

async function runAll() {
  testEverySlugIsUnique();
  testEveryFamilyReferenceIsValid();
  testLaunchCountMatchesSpec();
  testTroubledByDoubtsIsDeferredNotExcluded();
  testNoDeferredOrNotSuitableStateIsInLaunchList();
  testCompassionateAliasesResolveToCompassionateLabels();
  testAliasResolutionIsCaseInsensitive();
  testFamilyGroupingCoversEveryLaunchFamily();
  testNoCrisisTermAppearsAsAPublicLabelOrSlug();
  console.log("\nAll feeling-taxonomy tests passed.");
}

runAll();
