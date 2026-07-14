/**
 * Shared fixtures for Dhikr eligibility/readiness tests.
 *
 * Extracted from tests/dhikr/dhikr-review-status-gating.test.ts (Stage 2A)
 * so tests/dhikr/dhikr-readiness.test.ts can reuse the exact same baseline
 * document and negative-case table instead of duplicating large fixture
 * objects that could drift apart from each other.
 */

import type { DhikrItemEligibilityInput } from "../../src/sanity/lib/dhikr-publication-gate";

export const FULL_VALID_ITEM: DhikrItemEligibilityInput = {
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

/**
 * Each row mutates exactly ONE of the seven eligibility conditions away
 * from FULL_VALID_ITEM, holding every other condition valid.
 *
 * groqMarker: the substring in DHIKR_ELIGIBILITY_GROQ that expresses the
 * same condition in GROQ (used by dhikr-review-status-gating.test.ts's
 * structural-equivalence check).
 *
 * expectedFailingKeys: which DhikrEligibilityCondition key(s) — see
 * dhikr-publication-gate.ts — must be false for this mutation, and only
 * those. Most cases flip exactly one condition; removing all board
 * approvals flips both approval conditions at once, which is why this is
 * an array rather than a single key.
 */
export interface NegativeCase {
  condition: string;
  mutate: (item: DhikrItemEligibilityInput) => DhikrItemEligibilityInput;
  groqMarker: string;
  expectedFailingKeys: string[];
}

export const NEGATIVE_CASES: NegativeCase[] = [
  {
    condition: "reviewStatus is not exactly 'published' (e.g. 'approved')",
    mutate: (item) => ({ ...item, reviewStatus: "approved" }),
    groqMarker: 'reviewStatus == "published"',
    expectedFailingKeys: ["review-status-published"],
  },
  {
    condition: "arabicText is absent",
    mutate: (item) => ({ ...item, arabicText: undefined }),
    groqMarker: "arabicText",
    expectedFailingKeys: ["arabic-present"],
  },
  {
    condition: "translationEn is absent",
    mutate: (item) => ({ ...item, translationEn: undefined }),
    groqMarker: "translationEn",
    expectedFailingKeys: ["english-translation-present"],
  },
  {
    condition: "translationDa is absent",
    mutate: (item) => ({ ...item, translationDa: undefined }),
    groqMarker: "translationDa",
    expectedFailingKeys: ["danish-translation-present"],
  },
  {
    condition: "no sourceReferences (empty array)",
    mutate: (item) => ({ ...item, sourceReferences: [] }),
    groqMarker: "sourceReferences",
    expectedFailingKeys: ["valid-source-reference-present"],
  },
  {
    condition: "no board approvals at all",
    mutate: (item) => ({ ...item, boardApprovals: [] }),
    groqMarker: "boardApprovals",
    expectedFailingKeys: ["scholarly-approval-present", "editorial-approval-present"],
  },
  {
    condition: "editorial approval present, but no approved scholarly approval (scholarly missing)",
    mutate: (item) => ({ ...item, boardApprovals: [{ board: "editorial", approved: true }] }),
    groqMarker: 'board == "scholarly"',
    expectedFailingKeys: ["scholarly-approval-present"],
  },
  {
    condition: "scholarly approval present, but no approved editorial approval (editorial missing)",
    mutate: (item) => ({ ...item, boardApprovals: [{ board: "scholarly", approved: true }] }),
    groqMarker: 'board == "editorial"',
    expectedFailingKeys: ["editorial-approval-present"],
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
    expectedFailingKeys: ["scholarly-approval-present"],
  },
];
