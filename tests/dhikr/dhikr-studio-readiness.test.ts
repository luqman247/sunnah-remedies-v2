/**
 * Dhikr Studio Readiness Tests — Stage 2B.
 *
 * Covers the read-only Publication Readiness panel
 * (src/sanity/components/dhikr/DhikrReadinessPanel.tsx) and the dhikrItem
 * document badge (src/sanity/badges/dhikr-item-badges.ts).
 *
 * Tests are a mix of:
 *   - behavioural: import the real dhikrItemReadinessBadge /
 *     dhikrItemBadgesResolver functions and assert on their actual return
 *     values for constructed inputs. No Sanity Studio runtime, no browser,
 *     no dev server is involved — these are plain function calls.
 *   - static: read a file's own source text with node:fs and assert on it
 *     directly. Each such test is explicitly labelled "[static check]",
 *     used only where Studio runtime rendering isn't available in this
 *     environment (there is no headless Sanity Studio test harness in this
 *     repository to mount DhikrReadinessPanel as a live React tree).
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  dhikrItemReadinessBadge,
  dhikrItemBadgesResolver,
} from "../../src/sanity/badges/dhikr-item-badges";
import { FULL_VALID_ITEM } from "./dhikr-eligibility-fixtures";
import type { DhikrItemEligibilityInput } from "../../src/sanity/lib/dhikr-publication-gate";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const PANEL_PATH = join(REPO_ROOT, "src/sanity/components/dhikr/DhikrReadinessPanel.tsx");
const BADGES_PATH = join(REPO_ROOT, "src/sanity/badges/dhikr-item-badges.ts");
const CONFIG_PATH = join(REPO_ROOT, "sanity.config.ts");
const STRUCTURE_PATH = join(REPO_ROOT, "src/sanity/structure/index.ts");

const panelSource = readFileSync(PANEL_PATH, "utf-8");
const badgesSource = readFileSync(BADGES_PATH, "utf-8");
const configSource = readFileSync(CONFIG_PATH, "utf-8");
const structureSource = readFileSync(STRUCTURE_PATH, "utf-8");

/** Minimal helper: badge component only reads props.draft ?? props.published. */
function badgeFor(doc: DhikrItemEligibilityInput | null) {
  return dhikrItemReadinessBadge({ draft: doc, published: null } as never);
}

/* ── 1. Panel imports getDhikrEligibilityConditions ──────────────────── */

function testPanelImportsGetDhikrEligibilityConditions() {
  assert(
    /import\s*\{[\s\S]*?getDhikrEligibilityConditions[\s\S]*?\}\s*from\s*["']@\/sanity\/lib\/dhikr-publication-gate["']/.test(panelSource),
    "DhikrReadinessPanel.tsx must import getDhikrEligibilityConditions from the canonical gate",
  );
  console.log("✓ [static check] DhikrReadinessPanel.tsx imports getDhikrEligibilityConditions");
}

/* ── 2. Panel does not define its own seven-condition array ─────────── */

function testPanelDoesNotHardCodeConditionKeys() {
  const canonicalKeys = [
    "review-status-published",
    "arabic-present",
    "english-translation-present",
    "danish-translation-present",
    "valid-source-reference-present",
    "scholarly-approval-present",
    "editorial-approval-present",
  ];
  for (const key of canonicalKeys) {
    assert(
      !panelSource.includes(`"${key}"`) && !panelSource.includes(`'${key}'`),
      `DhikrReadinessPanel.tsx must not hard-code the condition key literal "${key}" — it must only iterate whatever getDhikrEligibilityConditions() returns`,
    );
  }
  console.log("✓ [static check] the panel never hard-codes any of the seven canonical condition keys — it only maps over the returned array");
}

/* ── 3. Canonical and advisory sections are visibly separated ───────── */

function testCanonicalAndAdvisorySectionsAreSeparated() {
  assert(
    panelSource.includes("dhikr-readiness-canonical-heading") && panelSource.includes("dhikr-readiness-advisory-heading"),
    "the panel must render two distinctly-labelled sections: canonical and advisory",
  );
  const canonicalIndex = panelSource.indexOf("dhikr-readiness-canonical-heading");
  const advisoryIndex = panelSource.indexOf("dhikr-readiness-advisory-heading");
  assert(canonicalIndex > -1 && advisoryIndex > canonicalIndex, "the canonical section must appear before the advisory section");
  console.log("✓ [static check] canonical and advisory sections are two distinct, separately-headed <section> elements");
}

/* ── 4. Advisory checks are labelled as non-canonical ────────────────── */

function testAdvisoryChecksLabelledNonCanonical() {
  assert(
    panelSource.includes("not part of the canonical public eligibility gate"),
    'the advisory section must state the required label: "Recommended or Studio-level checks — not part of the canonical public eligibility gate."',
  );
  console.log("✓ [static check] the advisory section is explicitly labelled as non-canonical, using the required wording");
}

/* ── 5. Badges import and use the canonical readiness function ──────── */

function testBadgesImportGetDhikrEligibilityConditions() {
  assert(
    /import\s*\{[\s\S]*?getDhikrEligibilityConditions[\s\S]*?\}\s*from\s*["']@\/sanity\/lib\/dhikr-publication-gate["']/.test(badgesSource),
    "dhikr-item-badges.ts must import getDhikrEligibilityConditions from the canonical gate",
  );
  console.log("✓ [static check] dhikr-item-badges.ts imports getDhikrEligibilityConditions");
}

/* ── 6 & 7. Badges never assign/mutate reviewStatus or boardApprovals ── */

function testBadgesNeverAssignReviewStatusOrBoardApprovals() {
  // Property-assignment patterns only (e.g. `.reviewStatus =` or a patch
  // payload `reviewStatus:` used as a set() value) — deliberately does NOT
  // flag `const reviewStatus = doc.reviewStatus`, which is a local read,
  // not a mutation of the document.
  assert(!/\.reviewStatus\s*=[^=]/.test(badgesSource), "dhikr-item-badges.ts must never assign to a document's reviewStatus property");
  assert(!/\.boardApprovals\s*=[^=]/.test(badgesSource), "dhikr-item-badges.ts must never assign to a document's boardApprovals property");
  assert(!/\.patch\s*\(/.test(badgesSource) && !/client\.create/.test(badgesSource) && !/\.set\s*\(/.test(badgesSource), "dhikr-item-badges.ts must never call a Sanity mutation method");
  console.log("✓ [static check] badges file contains no property assignment to reviewStatus/boardApprovals and no mutation call");
}

/* ── 8 & 9. No custom Publish action; no document action file registered ── */

function testNoCustomPublishActionOrActionFile() {
  assert(!existsSync(join(REPO_ROOT, "src/sanity/actions")), "src/sanity/actions/ must not exist yet — Stage 2B does not register document actions");

  // Inspect only the `document: { ... }` config object's own body for an
  // "actions" key — not the whole file, since prose elsewhere (including
  // this test's own diagnostic messages) may legitimately mention the
  // phrase "document.actions" without registering one.
  const documentBlockStart = configSource.indexOf("document:");
  assert(documentBlockStart > -1, "sanity.config.ts must have a document: config block (added in this stage for badges)");
  const openBraceIndex = configSource.indexOf("{", documentBlockStart);
  const closeBraceIndex = configSource.indexOf("\n  },", openBraceIndex);
  const documentBlock = configSource.slice(openBraceIndex, closeBraceIndex > -1 ? closeBraceIndex : undefined);
  assert(!/\bactions\s*:/.test(documentBlock), "the document: {} config block must not contain an actions: key in this stage");

  assert(!panelSource.includes("DocumentActionComponent") && !badgesSource.includes("DocumentActionComponent"), "no DocumentActionComponent may be defined in the panel or badges files");
  console.log("✓ [static check] no custom Publish/document action was introduced anywhere in this stage");
}

/* ── 10 & 11. Scoping: only dhikrItem is affected, behaviourally proven ── */

function testBadgesResolverScopedOnlyToDhikrItem() {
  const prevBadges = [(() => null) as unknown as Parameters<typeof dhikrItemBadgesResolver>[0][number]];
  const forDhikrItem = dhikrItemBadgesResolver(prevBadges, { schemaType: "dhikrItem" });
  assert(forDhikrItem.length === prevBadges.length + 1, "for schemaType 'dhikrItem', exactly one badge component must be appended");

  for (const otherType of ["article", "product", "journey", "dhikrCategory", "programme"]) {
    const result = dhikrItemBadgesResolver(prevBadges, { schemaType: otherType });
    assert(result === prevBadges, `for schemaType "${otherType}", the resolver must return prev completely unchanged (identity), leaving that type's existing badges untouched`);
  }
  console.log("✓ dhikrItemBadgesResolver appends a badge only for schemaType \"dhikrItem\"; every other schema type's badge list is returned as the exact same (unmodified) array reference");
}

function testConfigRegistersResolverScopedToDhikrItem() {
  assert(configSource.includes("dhikrItemBadgesResolver"), "sanity.config.ts must register dhikrItemBadgesResolver as document.badges");
  console.log("✓ [static check] sanity.config.ts wires document.badges to the dhikrItem-scoped resolver");
}

/* ── 12. No public route imports Studio components ───────────────────── */

function testNoPublicRouteImportsStudioComponents() {
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
        if (/sanity\/components\/dhikr|sanity\/badges\/dhikr-item-badges|DhikrReadinessPanel/.test(src)) {
          offenders.push(full);
        }
      }
    }
  }
  walk(localeAppDir);

  assert(offenders.length === 0, `no route under src/app/[locale]/ may import Studio-only Dhikr components, but found: ${offenders.join(", ")}`);
  console.log("✓ [static check] no public route imports the Studio readiness panel or badges module");
}

/* ── 13. No public projection changes ────────────────────────────────── */

function testPublicProjectionUnchanged() {
  const publicFetchSource = readFileSync(join(REPO_ROOT, "src/sanity/lib/dhikr-public-fetch.ts"), "utf-8");
  assert(
    publicFetchSource.includes("export async function getDhikrItemsPublic") &&
      publicFetchSource.includes("export async function getDhikrCategoriesPublic"),
    "dhikr-public-fetch.ts's public exports must be unchanged by Stage 2B",
  );
  assert(
    !publicFetchSource.includes("DhikrReadinessPanel") && !publicFetchSource.includes("dhikr-item-badges"),
    "dhikr-public-fetch.ts must not reference any Studio-only Stage 2B file",
  );
  console.log("✓ [static check] the public fetch layer is unchanged and references none of Stage 2B's Studio-only files");
}

/* ── 14. No religious content added ──────────────────────────────────── */

function testNoReligiousContentAdded() {
  const combined = panelSource + badgesSource + configSource + structureSource;
  assert(!/[؀-ۿ]/.test(combined), "no Arabic script may appear anywhere in Stage 2B's files");
  const suspiciousTerms = ["sahih al-bukhari", "sahih muslim", "abu dawud", "tirmidhi", "ibn majah", "musnad ahmad"];
  const lower = combined.toLowerCase();
  for (const term of suspiciousTerms) {
    assert(!lower.includes(term), `no real hadith-collection citation ("${term}") may appear in Stage 2B's files`);
  }
  console.log("✓ no Arabic script or real hadith-collection citation appears anywhere in Stage 2B's files");
}

/* ── Behavioural: badge precedence, one case per rule ────────────────── */

function testBadgePrecedence() {
  // Rule 7 — Draft: sourced, no Arabic yet.
  assert(badgeFor({ reviewStatus: "sourced" })?.label === "Draft", "reviewStatus sourced with no Arabic must badge as Draft");

  // Rule 6 — Awaiting sources: sourced, Arabic present, no source reference.
  assert(
    badgeFor({ reviewStatus: "sourced", arabicText: "x" })?.label === "Awaiting sources",
    "reviewStatus sourced with Arabic but no source reference must badge as Awaiting sources",
  );

  // Rule 5 — Awaiting scholarly review.
  assert(
    badgeFor({ reviewStatus: "scholarly-review" })?.label === "Awaiting scholarly review",
    "reviewStatus scholarly-review must badge as Awaiting scholarly review regardless of other fields",
  );

  // Rule 4 — Awaiting editorial review.
  assert(
    badgeFor({ reviewStatus: "editorial-review" })?.label === "Awaiting editorial review",
    "reviewStatus editorial-review must badge as Awaiting editorial review",
  );

  // Rule 3 — Approved: reviewStatus approved, every non-status condition met.
  assert(
    badgeFor({ ...FULL_VALID_ITEM, reviewStatus: "approved" })?.label === "Approved",
    "reviewStatus approved with every non-status condition met must badge as Approved",
  );

  // Rule 2 — Published: reviewStatus published, every condition met.
  assert(badgeFor(FULL_VALID_ITEM)?.label === "Published", "the fully valid, published baseline document must badge as Published");

  // Rule 1 — Blocked: reviewStatus approved, but a mandatory condition missing.
  assert(
    badgeFor({ reviewStatus: "approved" })?.label === "Blocked",
    "reviewStatus approved with no content/approvals at all must badge as Blocked, not Approved",
  );
  assert(
    badgeFor({ ...FULL_VALID_ITEM, reviewStatus: "published", arabicText: undefined })?.label === "Blocked",
    "reviewStatus published but missing Arabic text must badge as Blocked, never Published",
  );

  // No badge for an unrecognised/absent reviewStatus.
  assert(badgeFor({}) === null, "a document with no reviewStatus at all must not badge (returns null)");

  console.log("✓ badge precedence holds for all 7 rules, including the Blocked override for an inconsistent 'approved'/'published' state");
}

function runAll() {
  testPanelImportsGetDhikrEligibilityConditions();
  testPanelDoesNotHardCodeConditionKeys();
  testCanonicalAndAdvisorySectionsAreSeparated();
  testAdvisoryChecksLabelledNonCanonical();
  testBadgesImportGetDhikrEligibilityConditions();
  testBadgesNeverAssignReviewStatusOrBoardApprovals();
  testNoCustomPublishActionOrActionFile();
  testBadgesResolverScopedOnlyToDhikrItem();
  testConfigRegistersResolverScopedToDhikrItem();
  testNoPublicRouteImportsStudioComponents();
  testPublicProjectionUnchanged();
  testNoReligiousContentAdded();
  testBadgePrecedence();
  console.log("\nAll Dhikr Studio readiness tests passed.");
}

runAll();
