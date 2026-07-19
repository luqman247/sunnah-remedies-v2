/**
 * "I am feeling…" — search, crisis-keyword interception, and
 * deferred-state graceful-redirect tests.
 *
 * Pure checks — no live Sanity access, no religious content.
 */

import { searchFeelingStates } from "../../src/lib/feeling/search";
import { isCrisisInterceptedQuery, CRISIS_INTERCEPTION_TERMS } from "../../src/lib/feeling/crisis-terms";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function testCrisisQueryReturnsOnlyCrisisResult() {
  const results = searchFeelingStates("I want to end my life");
  assert(results.length === 1, "a crisis query must return exactly one result");
  assert(results[0].type === "crisis", "the one result must be type crisis");
  console.log("✓ crisis-keyword query returns exactly one, crisis-only result — no taxonomy results alongside it");
}

function testCrisisInterceptionRunsBeforeAliasResolution() {
  // "suicidal" must never resolve to a taxonomy match even though the word
  // itself isn't a registered alias anywhere.
  const results = searchFeelingStates("feeling suicidal lately");
  assert(results.length === 1 && results[0].type === "crisis", "crisis interception must run before any taxonomy matching");
  console.log("✓ crisis interception takes priority over taxonomy alias/substring matching");
}

function testEveryCrisisTermIsIntercepted() {
  for (const term of CRISIS_INTERCEPTION_TERMS) {
    assert(isCrisisInterceptedQuery(term), `crisis term "${term}" was not intercepted`);
    assert(isCrisisInterceptedQuery(`  ${term.toUpperCase()}  `), `crisis term "${term}" must be intercepted case-insensitively with surrounding whitespace`);
  }
  console.log(`✓ all ${CRISIS_INTERCEPTION_TERMS.length} maintained crisis terms are intercepted, case-insensitively`);
}

function testOrdinaryQueryIsNeverIntercepted() {
  const ordinary = ["anxious", "grateful", "facing a decision", "hypocrite", "envy"];
  for (const term of ordinary) {
    assert(!isCrisisInterceptedQuery(term), `ordinary term "${term}" must not be intercepted as a crisis query`);
  }
  console.log("✓ ordinary feeling queries are never falsely intercepted as crisis queries");
}

function testExactLabelMatchReturnsSingleResult() {
  const results = searchFeelingStates("Anxious or Worried");
  assert(results.length === 1, "an exact label match should return one result");
  assert(results[0].type === "match" && results[0].state.slug === "feeling-anxious", "exact label match must resolve to feeling-anxious");
  console.log("✓ exact label match resolves to a single, correct result");
}

function testCompassionateAliasSearchWorks() {
  const results = searchFeelingStates("hypocrite");
  assert(results.length === 1, "\"hypocrite\" must return one result");
  assert(results[0].type === "match" && results[0].state.slug === "struggling-with-sincerity", "\"hypocrite\" must resolve to struggling-with-sincerity, not a dead end");
  console.log("✓ a condemning word a visitor might type still resolves compassionately, never a dead end");
}

function testDeferredStateAliasRedirectsGracefully() {
  const results = searchFeelingStates("waswas");
  assert(results.length === 1, "a deferred-state alias must return exactly one result");
  assert(results[0].type === "deferred-redirect", "\"waswas\" must produce a deferred-redirect result, not a direct match");
  if (results[0].type === "deferred-redirect") {
    assert(results[0].state.launchStatus === "launch", "the redirect target must itself be a launch-status state");
    assert(results[0].deferredLabel === "Troubled by Doubts", `deferredLabel should name the deferred state, got "${results[0].deferredLabel}"`);
  }
  console.log("✓ a query matching a deferred state's alias (\"waswas\") redirects to a real launch neighbour with an honest note, never a dead end and never the deferred state itself");
}

function testEmptyQueryReturnsNoResults() {
  assert(searchFeelingStates("").length === 0, "empty query must return zero results");
  assert(searchFeelingStates("   ").length === 0, "whitespace-only query must return zero results");
  console.log("✓ empty/whitespace queries return zero results (landing page shows no dropdown)");
}

function testNonsenseQueryReturnsNoResults() {
  const results = searchFeelingStates("xyzzyplughqwertyunmatched12345");
  assert(results.length === 0, "a nonsense query must return zero results, not a false match");
  console.log("✓ nonsense queries return zero results rather than a spurious match");
}

async function runAll() {
  testCrisisQueryReturnsOnlyCrisisResult();
  testCrisisInterceptionRunsBeforeAliasResolution();
  testEveryCrisisTermIsIntercepted();
  testOrdinaryQueryIsNeverIntercepted();
  testExactLabelMatchReturnsSingleResult();
  testCompassionateAliasSearchWorks();
  testDeferredStateAliasRedirectsGracefully();
  testEmptyQueryReturnsNoResults();
  testNonsenseQueryReturnsNoResults();
  console.log("\nAll feeling-search-and-crisis tests passed.");
}

runAll();
