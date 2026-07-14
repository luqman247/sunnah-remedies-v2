/**
 * Dhikr Review-Status Gating Tests — Phase 2 prototype.
 *
 * Behavioural tests: these call the actual predicate/validator functions
 * with constructed documents and assert on the returned value — they do
 * not merely search query strings for text.
 *
 * testNegativeCaseTable proves, for each of the 7 conditions in the
 * canonical eligibility rule (reviewStatus == published; arabicText;
 * translationEn; translationDa; sourceReferences; approved scholarly
 * board; approved editorial board), that removing that condition alone —
 * with every other condition held valid — makes the item ineligible.
 * testEveryConditionAppearsInGroqFragment then verifies, structurally,
 * that DHIKR_ELIGIBILITY_GROQ (the GROQ half of the same rule) has a
 * clause for every one of those same 7 conditions, so the two
 * representations in dhikr-publication-gate.ts cannot silently diverge.
 *
 * The final three tests are explicitly labelled as static source/string
 * inspection (query-shape and middleware-wiring checks) rather than a live
 * Sanity dataset, live GROQ execution, or live HTTP request — no dev
 * server or Sanity connection is used anywhere in this file.
 *
 * Risk mapping (see docs/dhikr/20-risk-register.md): R-01.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  isDhikrItemPubliclyEligible,
  DHIKR_ELIGIBILITY_GROQ,
  type DhikrItemEligibilityInput,
} from "../../src/sanity/lib/dhikr-publication-gate";
import {
  requiredWhenDhikrPublished,
  requiredDhikrSourceReferences,
  requiredDhikrBoardApprovals,
} from "../../src/sanity/validation/governance";
import { dhikrItemsPublicEligibleQuery, dhikrItemsInternalPreviewQuery } from "../../src/sanity/lib/queries";
import { FULL_VALID_ITEM, NEGATIVE_CASES } from "./dhikr-eligibility-fixtures";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function testNegativeCaseTable() {
  assert(
    isDhikrItemPubliclyEligible(FULL_VALID_ITEM) === true,
    "Baseline: a fully-complete item with all seven conditions met must be eligible",
  );

  for (const { condition, mutate } of NEGATIVE_CASES) {
    const mutated = mutate(FULL_VALID_ITEM);
    assert(
      isDhikrItemPubliclyEligible(mutated) === false,
      `Negative case failed: removing [${condition}] should make the item ineligible, but isDhikrItemPubliclyEligible still returned true`,
    );
  }

  console.log(
    `✓ table-driven negative cases: baseline is eligible, and each of ${NEGATIVE_CASES.length} conditions independently makes it ineligible when removed`,
  );
}

/* ── Every non-"published" reviewStatus is independently non-public ──────
 *
 * NEGATIVE_CASES above uses "approved" as its stand-in mutation for
 * "reviewStatus is not exactly published". This test checks each of the
 * four non-published stages explicitly and individually — sourced,
 * scholarly-review, editorial-review, approved — with every other
 * eligibility condition (mandatory fields, both board approvals) held
 * fully valid, confirming only "published" can ever satisfy the rule.
 */

function testEachNonPublishedReviewStatusIsIneligible() {
  const nonPublishedStatuses = ["sourced", "scholarly-review", "editorial-review", "approved"] as const;

  for (const status of nonPublishedStatuses) {
    const item: DhikrItemEligibilityInput = { ...FULL_VALID_ITEM, reviewStatus: status };
    assert(
      isDhikrItemPubliclyEligible(item) === false,
      `reviewStatus "${status}" must NOT be publicly eligible, even with every other condition valid`,
    );
  }

  assert(
    isDhikrItemPubliclyEligible(FULL_VALID_ITEM) === true,
    'Only reviewStatus "published" (with every other condition valid) may be publicly eligible',
  );

  console.log(
    '✓ sourced, scholarly-review, editorial-review, and approved are each independently non-public; only "published" satisfies the rule',
  );
}

/* ── Structural equivalence: every TS condition also appears in GROQ ──── */

function testEveryConditionAppearsInGroqFragment() {
  for (const { condition, groqMarker } of NEGATIVE_CASES) {
    assert(
      DHIKR_ELIGIBILITY_GROQ.includes(groqMarker),
      `[static structural check] DHIKR_ELIGIBILITY_GROQ has no clause for condition [${condition}] (expected to find "${groqMarker}") — the GROQ fragment and the TS predicate must test the same conditions`,
    );
  }
  console.log(
    "✓ [static check] every one of the 7 conditions tested by isDhikrItemPubliclyEligible has a corresponding clause in DHIKR_ELIGIBILITY_GROQ (structural equivalence — not a live GROQ execution, since no Sanity dataset exists to run it against)",
  );
}

/* ── Studio validators mirror the same rule (no drift) ──────────── */

function testStudioValidatorsMirrorEligibilityRule() {
  const publishedContext = { document: { reviewStatus: "published" } };
  const sourcedContext = { document: { reviewStatus: "sourced" } };

  const arabicValidator = requiredWhenDhikrPublished("Arabic text is required before publishing.");
  assert(
    arabicValidator(undefined, publishedContext) === "Arabic text is required before publishing.",
    "requiredWhenDhikrPublished must block an empty field when reviewStatus is published",
  );
  assert(
    arabicValidator(undefined, sourcedContext) === true,
    "requiredWhenDhikrPublished must NOT block an empty field pre-publish (reviewStatus sourced)",
  );

  assert(
    requiredDhikrSourceReferences([], publishedContext) !== true,
    "requiredDhikrSourceReferences must block an empty array when published",
  );
  assert(
    requiredDhikrSourceReferences([], sourcedContext) === true,
    "requiredDhikrSourceReferences must not block pre-publish",
  );

  assert(
    requiredDhikrBoardApprovals([{ board: "scholarly", approved: true }], publishedContext) !== true,
    "requiredDhikrBoardApprovals must reject scholarly-only approval when published",
  );
  assert(
    requiredDhikrBoardApprovals(
      [
        { board: "scholarly", approved: true },
        { board: "editorial", approved: true },
      ],
      publishedContext,
    ) === true,
    "requiredDhikrBoardApprovals must accept both approvals present and approved",
  );

  console.log("✓ Studio publish-time validators (governance.ts) enforce the same rule as isDhikrItemPubliclyEligible");
}

/* ── Static shape checks (explicitly labelled — no live dataset/HTTP) ── */

function testPublicQueryUsesCanonicalEligibilityFragment() {
  assert(
    dhikrItemsPublicEligibleQuery.includes(DHIKR_ELIGIBILITY_GROQ),
    "[static query-shape check] dhikrItemsPublicEligibleQuery must interpolate the canonical DHIKR_ELIGIBILITY_GROQ constant, not a hand-copied duplicate",
  );
  console.log("✓ [static check] public query uses the canonical eligibility constant, not a re-typed filter");
}

function testInternalPreviewQueryAppliesNoEligibilityFilter() {
  assert(
    !dhikrItemsInternalPreviewQuery.includes('reviewStatus =='),
    "[static query-shape check] dhikrItemsInternalPreviewQuery must not apply any reviewStatus filter — it is staff-only",
  );
  console.log("✓ [static check] internal preview query applies no reviewStatus filter");
}

function testDhikrReviewRouteIsAuthProtected() {
  const middlewareSource = readFileSync(join(__dirname, "../../middleware.ts"), "utf-8");
  const authBlockMatch = middlewareSource.match(/if \(([\s\S]*?)\)\s*\{\s*return \(authMiddleware/);
  assert(!!authBlockMatch, '[static source-inspection check] could not locate the auth-protected pathname block in middleware.ts');
  assert(
    authBlockMatch![1].includes('pathname.startsWith("/dhikr-review")'),
    '[static source-inspection check] middleware.ts must gate "/dhikr-review" through the same authMiddleware as /handbook, /ops, /intelligence',
  );
  console.log("✓ [static check] /dhikr-review is included in the staff authentication matcher (no dev server used)");
}

function runAll() {
  testNegativeCaseTable();
  testEachNonPublishedReviewStatusIsIneligible();
  testEveryConditionAppearsInGroqFragment();
  testStudioValidatorsMirrorEligibilityRule();
  testPublicQueryUsesCanonicalEligibilityFragment();
  testInternalPreviewQueryAppliesNoEligibilityFilter();
  testDhikrReviewRouteIsAuthProtected();
  console.log("\nAll Dhikr review-status gating tests passed.");
}

runAll();
