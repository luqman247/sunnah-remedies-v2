/**
 * Dhikr Readiness Model Tests — Stage 2A.
 *
 * Covers getDhikrEligibilityConditions(), the granular condition breakdown
 * added to src/sanity/lib/dhikr-publication-gate.ts in this stage.
 *
 * Tests are a mix of:
 *   - behavioural: import the real getDhikrEligibilityConditions /
 *     isDhikrItemPubliclyEligible functions and assert on their actual
 *     return values for constructed documents. No live Sanity dataset or
 *     network call is involved.
 *   - static: read a file's own source text with node:fs and assert on it
 *     directly (no dev server, no HTTP request). Each such test is
 *     explicitly labelled "[static check]".
 *
 * Fixtures (FULL_VALID_ITEM, NEGATIVE_CASES) are imported from
 * ./dhikr-eligibility-fixtures.ts rather than redefined here — see that
 * file for why (Stage 2A instruction to reuse rather than duplicate).
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  getDhikrEligibilityConditions,
  isDhikrItemPubliclyEligible,
  DHIKR_ELIGIBILITY_GROQ,
  type DhikrItemEligibilityInput,
} from "../../src/sanity/lib/dhikr-publication-gate";
import { dhikrItemsPublicEligibleQuery } from "../../src/sanity/lib/queries";
import { FULL_VALID_ITEM, NEGATIVE_CASES } from "./dhikr-eligibility-fixtures";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");

const ALL_CONDITION_KEYS = [
  "review-status-published",
  "arabic-present",
  "english-translation-present",
  "danish-translation-present",
  "valid-source-reference-present",
  "scholarly-approval-present",
  "editorial-approval-present",
];

function metMap(doc: DhikrItemEligibilityInput): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const c of getDhikrEligibilityConditions(doc)) map[c.key] = c.met;
  return map;
}

/* ── 1. Fully eligible document passes every condition ───────────────── */

function testFullyEligibleDocumentPassesEveryCondition() {
  const conditions = getDhikrEligibilityConditions(FULL_VALID_ITEM);
  assert(conditions.length === 7, `expected exactly 7 conditions, got ${conditions.length}`);
  const keys = conditions.map((c) => c.key).sort();
  assert(
    JSON.stringify(keys) === JSON.stringify([...ALL_CONDITION_KEYS].sort()),
    `condition keys must be exactly ${ALL_CONDITION_KEYS.join(", ")}, got ${keys.join(", ")}`,
  );
  for (const c of conditions) {
    assert(c.met === true, `condition "${c.key}" must be met on the fully valid baseline document`);
  }
  console.log("✓ a fully eligible document passes every one of the 7 named conditions");
}

/* ── 2. Predicate equals conditions.every(met) — for baseline AND every mutation ── */

function testPredicateEqualsEveryConditionMet() {
  assert(
    isDhikrItemPubliclyEligible(FULL_VALID_ITEM) ===
      getDhikrEligibilityConditions(FULL_VALID_ITEM).every((c) => c.met),
    "isDhikrItemPubliclyEligible must equal conditions.every(met) on the baseline",
  );
  for (const { condition, mutate } of NEGATIVE_CASES) {
    const doc = mutate(FULL_VALID_ITEM);
    assert(
      isDhikrItemPubliclyEligible(doc) === getDhikrEligibilityConditions(doc).every((c) => c.met),
      `isDhikrItemPubliclyEligible must equal conditions.every(met) for mutation [${condition}]`,
    );
  }
  console.log(
    `✓ isDhikrItemPubliclyEligible(doc) === getDhikrEligibilityConditions(doc).every(c => c.met) holds for the baseline and all ${NEGATIVE_CASES.length} mutations`,
  );
}

/* ── 3. Each existing negative case fails exactly its expected condition(s) ── */

function testEachNegativeCaseFailsExpectedNamedCondition() {
  for (const { condition, mutate, expectedFailingKeys } of NEGATIVE_CASES) {
    const doc = mutate(FULL_VALID_ITEM);
    const met = metMap(doc);
    for (const key of expectedFailingKeys) {
      assert(met[key] === false, `mutation [${condition}] must make condition "${key}" false`);
    }
    const actualFailing = Object.entries(met).filter(([, isMet]) => !isMet).map(([key]) => key);
    assert(
      JSON.stringify(actualFailing.sort()) === JSON.stringify([...expectedFailingKeys].sort()),
      `mutation [${condition}] must fail exactly [${expectedFailingKeys.join(", ")}], but failed [${actualFailing.join(", ")}]`,
    );
  }
  console.log(`✓ each of the ${NEGATIVE_CASES.length} existing negative cases fails exactly its expected named condition(s), no more and no fewer`);
}

/* ── 4. Every non-published reviewStatus fails the published-status condition ── */

function testEveryNonPublishedStatusFailsPublishedCondition() {
  const nonPublished = ["sourced", "scholarly-review", "editorial-review", "approved"] as const;
  for (const status of nonPublished) {
    const doc: DhikrItemEligibilityInput = { ...FULL_VALID_ITEM, reviewStatus: status };
    const met = metMap(doc);
    assert(met["review-status-published"] === false, `reviewStatus "${status}" must fail review-status-published`);
    for (const key of ALL_CONDITION_KEYS) {
      if (key === "review-status-published") continue;
      assert(met[key] === true, `reviewStatus "${status}" must not affect unrelated condition "${key}"`);
    }
  }
  console.log("✓ every non-published reviewStatus fails only review-status-published, no other condition");
}

/* ── 5–8. Each missing mandatory field fails only its own condition ─────
 *
 * "Genuinely dependent conditions" check: since each of these four fields
 * is read independently (no condition's `met` expression references
 * another field), removing one must never flip a second condition. These
 * tests assert that explicitly rather than assuming it.
 */

function assertSingleFieldRemovalFailsOnlyOneCondition(fieldLabel: string, doc: DhikrItemEligibilityInput, expectedKey: string) {
  const met = metMap(doc);
  assert(met[expectedKey] === false, `missing ${fieldLabel} must fail "${expectedKey}"`);
  for (const key of ALL_CONDITION_KEYS) {
    if (key === expectedKey) continue;
    assert(met[key] === true, `missing ${fieldLabel} must not also fail unrelated condition "${key}" (no dependent conditions exist for this field)`);
  }
}

function testMissingArabicFailsOnlyArabicCondition() {
  assertSingleFieldRemovalFailsOnlyOneCondition("Arabic text", { ...FULL_VALID_ITEM, arabicText: undefined }, "arabic-present");
  console.log("✓ missing Arabic text fails only arabic-present, with no dependent conditions affected");
}

function testMissingEnglishFailsOnlyEnglishCondition() {
  assertSingleFieldRemovalFailsOnlyOneCondition("English translation", { ...FULL_VALID_ITEM, translationEn: undefined }, "english-translation-present");
  console.log("✓ missing English translation fails only english-translation-present");
}

function testMissingDanishFailsOnlyDanishCondition() {
  assertSingleFieldRemovalFailsOnlyOneCondition("Danish translation", { ...FULL_VALID_ITEM, translationDa: undefined }, "danish-translation-present");
  console.log("✓ missing Danish translation fails only danish-translation-present");
}

function testNoValidSourceFailsOnlySourceCondition() {
  assertSingleFieldRemovalFailsOnlyOneCondition("source references", { ...FULL_VALID_ITEM, sourceReferences: [] }, "valid-source-reference-present");
  console.log("✓ no source references fails only valid-source-reference-present");
}

/* ── 9–10. Missing scholarly/editorial approval fails only its own condition ── */

function testMissingScholarlyApprovalFailsOnlyScholarlyCondition() {
  const doc: DhikrItemEligibilityInput = { ...FULL_VALID_ITEM, boardApprovals: [{ board: "editorial", approved: true }] };
  assertSingleFieldRemovalFailsOnlyOneCondition("scholarly board approval", doc, "scholarly-approval-present");
  console.log("✓ missing scholarly approval (editorial present) fails only scholarly-approval-present");
}

function testMissingEditorialApprovalFailsOnlyEditorialCondition() {
  const doc: DhikrItemEligibilityInput = { ...FULL_VALID_ITEM, boardApprovals: [{ board: "scholarly", approved: true }] };
  assertSingleFieldRemovalFailsOnlyOneCondition("editorial board approval", doc, "editorial-approval-present");
  console.log("✓ missing editorial approval (scholarly present) fails only editorial-approval-present");
}

/* ── 11. DHIKR_ELIGIBILITY_GROQ is byte-for-byte unchanged ──────────────
 *
 * Frozen exact value, captured directly from the constant before this
 * stage's refactor touched anything else in the file — this stage only
 * added getDhikrEligibilityConditions and rewrote
 * isDhikrItemPubliclyEligible's body; DHIKR_ELIGIBILITY_GROQ itself was
 * never edited.
 */

function testGroqFragmentByteForByteUnchanged() {
  const expected =
    'reviewStatus == "published"\n' +
    '  && defined(arabicText) && arabicText != ""\n' +
    '  && defined(translationEn) && translationEn != ""\n' +
    '  && defined(translationDa) && translationDa != ""\n' +
    "  && count(sourceReferences) > 0\n" +
    '  && count(boardApprovals[board == "scholarly" && approved == true]) > 0\n' +
    '  && count(boardApprovals[board == "editorial" && approved == true]) > 0';
  assert(
    DHIKR_ELIGIBILITY_GROQ === expected,
    "DHIKR_ELIGIBILITY_GROQ must be byte-for-byte identical to its pre-Stage-2A value — this stage must not alter the GROQ fragment",
  );
  console.log("✓ DHIKR_ELIGIBILITY_GROQ is byte-for-byte unchanged");
}

/* ── 12. Public projection and public fetch layer are unchanged ─────────
 *
 * [static check] — source-text comparison against the known field set
 * established in Stage 2/3, not a live query.
 */

function testPublicProjectionUnchanged() {
  const expectedProjectedFields = [
    "_id", "slug", "titleEn", "titleDa", "order", "arabicText", "transliteration",
    "translationEn", "translationDa", "categoryName", "categoryNameDa", "categorySlug",
    "sourceReferences", "type", "citation", "hadithCollection", "hadithNumber",
    "hadithGrading", "surah", "ayah", "sourceUrl", "verifiedStatus",
  ];
  for (const field of expectedProjectedFields) {
    assert(
      dhikrItemsPublicEligibleQuery.includes(field),
      `dhikrItemsPublicEligibleQuery must still project "${field}" — Stage 2A must not change the public projection`,
    );
  }
  const forbidden = ["reviewStatus", "boardApprovals", "approver"];
  const filterEnd = dhikrItemsPublicEligibleQuery.indexOf("]");
  const projection = dhikrItemsPublicEligibleQuery.slice(dhikrItemsPublicEligibleQuery.indexOf("{", filterEnd));
  for (const term of forbidden) {
    assert(!projection.includes(term), `dhikrItemsPublicEligibleQuery's projection must still omit "${term}"`);
  }

  const publicFetchPath = join(REPO_ROOT, "src/sanity/lib/dhikr-public-fetch.ts");
  const publicFetchSource = readFileSync(publicFetchPath, "utf-8");
  assert(
    publicFetchSource.includes("export async function getDhikrItemsPublic") &&
      publicFetchSource.includes("export async function getDhikrCategoriesPublic"),
    "dhikr-public-fetch.ts must still export getDhikrItemsPublic and getDhikrCategoriesPublic unchanged",
  );
  console.log("✓ [static check] the public projection (queries.ts) and public fetch layer (dhikr-public-fetch.ts) are unchanged by Stage 2A");
}

/* ── 13. No public route imports anything from this stage's readiness work ── */

function testNoPublicRouteImportsReadinessModel() {
  const localeAppDir = join(REPO_ROOT, "src/app/[locale]");
  const offenders: string[] = [];

  function walk(dir: string) {
    if (!existsSync(dir)) return;
    for (const entry of require("node:fs").readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        const src = readFileSync(full, "utf-8");
        if (/getDhikrEligibilityConditions/.test(src)) offenders.push(full);
      }
    }
  }
  walk(localeAppDir);

  assert(
    offenders.length === 0,
    `[static check] no route under src/app/[locale]/ may import getDhikrEligibilityConditions in this stage (no Studio/staff-preview UI has been wired to it yet), but found: ${offenders.join(", ")}`,
  );
  console.log("✓ [static check] no public route imports the new readiness model (no Studio panel or staff-preview UI exists yet in Stage 2A)");
}

/* ── 14. No religious content added ──────────────────────────────────── */

function testNoReligiousContentAdded() {
  // Scans only the files Stage 2A actually adds/edits with real content
  // (the gate refactor and the fixtures) — deliberately excludes this test
  // file's own source, since its Arabic-detection regex literal itself
  // contains the Arabic Unicode range boundary characters and would
  // otherwise flag itself.
  const gateSource = readFileSync(join(REPO_ROOT, "src/sanity/lib/dhikr-publication-gate.ts"), "utf-8");
  const fixturesSource = readFileSync(join(REPO_ROOT, "tests/dhikr/dhikr-eligibility-fixtures.ts"), "utf-8");
  const combined = gateSource + fixturesSource;
  assert(!/[؀-ۿ]/.test(combined), "no Arabic script may appear anywhere in Stage 2A's files");
  const suspiciousTerms = ["sahih al-bukhari", "sahih muslim", "abu dawud", "tirmidhi", "ibn majah", "musnad ahmad"];
  const lower = combined.toLowerCase();
  for (const term of suspiciousTerms) {
    assert(!lower.includes(term), `no real hadith-collection citation ("${term}") may appear in Stage 2A's files — only the placeholder string "placeholder" is used in fixtures`);
  }
  console.log("✓ no Arabic script or real hadith-collection citation appears anywhere in Stage 2A's files");
}

function runAll() {
  testFullyEligibleDocumentPassesEveryCondition();
  testPredicateEqualsEveryConditionMet();
  testEachNegativeCaseFailsExpectedNamedCondition();
  testEveryNonPublishedStatusFailsPublishedCondition();
  testMissingArabicFailsOnlyArabicCondition();
  testMissingEnglishFailsOnlyEnglishCondition();
  testMissingDanishFailsOnlyDanishCondition();
  testNoValidSourceFailsOnlySourceCondition();
  testMissingScholarlyApprovalFailsOnlyScholarlyCondition();
  testMissingEditorialApprovalFailsOnlyEditorialCondition();
  testGroqFragmentByteForByteUnchanged();
  testPublicProjectionUnchanged();
  testNoPublicRouteImportsReadinessModel();
  testNoReligiousContentAdded();
  console.log("\nAll Dhikr readiness-model tests passed.");
}

runAll();
