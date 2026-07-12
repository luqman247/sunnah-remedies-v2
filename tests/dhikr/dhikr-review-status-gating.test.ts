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

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const FULL_VALID_ITEM: DhikrItemEligibilityInput = {
  reviewStatus: "published",
  arabicText: "placeholder-non-empty",
  translationEn: "placeholder-non-empty",
  translationDa: "placeholder-non-empty",
  sourceReferences: [{ type: "hadith", citation: "placeholder" }],
  boardApprovals: [
    { board: "scholarly", approved: true },
    { board: "editorial", approved: true },
  ],
};

/* ── Table-driven negative cases: each condition removed independently ──
 *
 * Each row mutates exactly ONE of the seven eligibility conditions away
 * from FULL_VALID_ITEM, holding every other condition valid, and asserts
 * eligibility becomes false. groqMarker is the substring in
 * DHIKR_ELIGIBILITY_GROQ that expresses the same condition in GROQ —
 * verified separately below so the TS predicate and the GROQ fragment are
 * proven to test the same conditions, not just colocated in the same file.
 */

interface NegativeCase {
  condition: string;
  mutate: (item: DhikrItemEligibilityInput) => DhikrItemEligibilityInput;
  groqMarker: string;
}

const NEGATIVE_CASES: NegativeCase[] = [
  {
    condition: "reviewStatus is not exactly 'published' (e.g. 'approved')",
    mutate: (item) => ({ ...item, reviewStatus: "approved" }),
    groqMarker: 'reviewStatus == "published"',
  },
  {
    condition: "arabicText is absent",
    mutate: (item) => ({ ...item, arabicText: undefined }),
    groqMarker: "arabicText",
  },
  {
    condition: "translationEn is absent",
    mutate: (item) => ({ ...item, translationEn: undefined }),
    groqMarker: "translationEn",
  },
  {
    condition: "translationDa is absent",
    mutate: (item) => ({ ...item, translationDa: undefined }),
    groqMarker: "translationDa",
  },
  {
    condition: "no sourceReferences (empty array)",
    mutate: (item) => ({ ...item, sourceReferences: [] }),
    groqMarker: "sourceReferences",
  },
  {
    condition: "no board approvals at all",
    mutate: (item) => ({ ...item, boardApprovals: [] }),
    groqMarker: "boardApprovals",
  },
  {
    condition: "editorial approval present, but no approved scholarly approval (scholarly missing)",
    mutate: (item) => ({ ...item, boardApprovals: [{ board: "editorial", approved: true }] }),
    groqMarker: 'board == "scholarly"',
  },
  {
    condition: "scholarly approval present, but no approved editorial approval (editorial missing)",
    mutate: (item) => ({ ...item, boardApprovals: [{ board: "scholarly", approved: true }] }),
    groqMarker: 'board == "editorial"',
  },
  {
    condition: "scholarly board entry exists but approved:false (not just absent)",
    mutate: (item) => ({
      ...item,
      boardApprovals: [
        { board: "scholarly", approved: false },
        { board: "editorial", approved: true },
      ],
    }),
    groqMarker: "approved == true",
  },
];

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
  testEveryConditionAppearsInGroqFragment();
  testStudioValidatorsMirrorEligibilityRule();
  testPublicQueryUsesCanonicalEligibilityFragment();
  testInternalPreviewQueryAppliesNoEligibilityFilter();
  testDhikrReviewRouteIsAuthProtected();
  console.log("\nAll Dhikr review-status gating tests passed.");
}

runAll();
