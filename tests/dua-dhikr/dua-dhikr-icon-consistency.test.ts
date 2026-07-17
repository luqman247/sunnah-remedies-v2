/**
 * Duʿa & Dhikr — icon system consistency tests.
 *
 * The shared <svg> wrapper in DuaDhikrIcon (viewBox, stroke width,
 * linecap/linejoin, currentColor) guarantees structural consistency by
 * construction — every icon renders through the same wrapper, so these
 * tests focus on what construction alone cannot guarantee: every
 * canonical collection has a real icon (not a silent fallback), no path
 * overrides the shared stroke treatment, and no emoji/prohibited
 * character ever enters the icon or taxonomy source.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ICON_KEYS, CANONICAL_COLLECTIONS } from "../../src/lib/dua-dhikr/taxonomy";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const iconsSource = readFileSync(join(REPO_ROOT, "src/components/dua-dhikr/icons.tsx"), "utf-8");

function testSharedSvgWrapperDeclaresOneConsistentTreatment() {
  assert(iconsSource.includes('viewBox="0 0 24 24"'), "the shared SVG wrapper must declare one consistent viewBox");
  assert(iconsSource.includes("strokeWidth={1.5}"), "the shared SVG wrapper must declare one consistent stroke width");
  assert(iconsSource.includes('strokeLinecap="round"') && iconsSource.includes('strokeLinejoin="round"'), "the shared SVG wrapper must declare one consistent corner/cap treatment");
  assert(iconsSource.includes('stroke="currentColor"'), "icons must inherit colour via currentColor, never a hardcoded stroke colour");
  console.log("✓ one shared <svg> wrapper declares viewBox/stroke-width/linecap/linejoin/colour for every icon");
}

function testNoIndividualPathOverridesTheSharedTreatment() {
  // Every <path>/<circle>/<rect>/<ellipse> element in the PATHS map must
  // carry no fill/stroke/style attributes of its own — only geometry
  // (d, cx, cy, r, x, y, width, height, rx). A per-shape override would
  // break the "one consistent optical scale" guarantee.
  const pathsSection = iconsSource.split("const PATHS")[1]?.split("export interface")[0] ?? "";
  const forbiddenAttributes = ['fill="', "fill={", 'stroke="', "stroke={", "strokeWidth=", "style="];
  for (const attr of forbiddenAttributes) {
    assert(!pathsSection.includes(attr), `no individual icon shape may declare "${attr}" — all styling must come from the shared <svg> wrapper`);
  }
  console.log("✓ no individual icon path/shape overrides the shared stroke/fill treatment");
}

function testEveryCanonicalCollectionHasARealIconNotASilentFallback() {
  const pathsSection = iconsSource.split("const PATHS")[1]?.split("export interface")[0] ?? "";
  for (const collection of CANONICAL_COLLECTIONS) {
    const unquotedKey = `${collection.iconKey}:`; // simple identifier keys, e.g. `leaf:`
    const quotedKey = `"${collection.iconKey}":`; // hyphenated keys must be quoted, e.g. `"moon-bedding":`
    assert(
      pathsSection.includes(unquotedKey) || pathsSection.includes(quotedKey),
      `collection "${collection.slug}" references iconKey "${collection.iconKey}", which has no entry in PATHS (would silently fall back to "leaf")`,
    );
  }
  console.log(`✓ all ${CANONICAL_COLLECTIONS.length} canonical collections reference a real, defined icon (no silent fallback)`);
}

function testEveryIconKeyIsUsedByAtLeastOneCollection() {
  const usedKeys = new Set(CANONICAL_COLLECTIONS.map((c) => c.iconKey));
  const unused = ICON_KEYS.filter((key) => key !== "leaf" && !usedKeys.has(key));
  assert(unused.length === 0, `icon key(s) defined but never used by any collection: ${unused.join(", ")} — remove or assign them`);
  console.log("✓ every defined icon key (other than the \"leaf\" fallback) is used by at least one collection");
}

function testNoEmojiAnywhereInIconOrTaxonomySource() {
  const taxonomySource = readFileSync(join(REPO_ROOT, "src/lib/dua-dhikr/taxonomy.ts"), "utf-8");
  // Common emoji ranges. Deliberately excludes the general Arrows block
  // (U+2190–U+21FF) since "→" is used in plain-prose comments throughout
  // this codebase (e.g. "sourced → published") and is not an emoji.
  const emojiPattern = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u;
  assert(!emojiPattern.test(iconsSource), "icons.tsx must contain no emoji characters");
  assert(!emojiPattern.test(taxonomySource), "taxonomy.ts must contain no emoji characters");
  console.log("✓ no emoji characters appear in the icon system or taxonomy source");
}

function testNoIconKeyNamesSuggestFigurativeDepiction() {
  // Names alone cannot prove an SVG's visual content, but every icon key
  // in this system was deliberately named after a geometric/architectural/
  // natural motif — a name suggesting a person, Prophet, Companion, or
  // angel would indicate a design mistake worth catching early.
  const forbiddenNameFragments = ["prophet", "companion", "angel", "person", "face", "figure", "man", "woman", "human"];
  for (const key of ICON_KEYS) {
    for (const fragment of forbiddenNameFragments) {
      assert(!key.toLowerCase().includes(fragment), `icon key "${key}" name suggests figurative/personified content ("${fragment}") — icons must stay geometric/architectural/natural motifs only`);
    }
  }
  console.log("✓ no icon key name suggests a figurative, personified, or sacred-figure depiction");
}

function testIconsAreDecorativeByDefaultAndAcceptAccessibleNaming() {
  assert(iconsSource.includes("aria-hidden={title ? undefined : true}"), "icons must be aria-hidden by default (decorative — adjacent text already names the concept)");
  assert(iconsSource.includes('role={title ? "img" : undefined}') && iconsSource.includes("aria-label={title}"), "icons must accept an optional accessible name for standalone use");
  console.log("✓ icons are decorative by default and support an accessible name when used standalone");
}

function runAll() {
  testSharedSvgWrapperDeclaresOneConsistentTreatment();
  testNoIndividualPathOverridesTheSharedTreatment();
  testEveryCanonicalCollectionHasARealIconNotASilentFallback();
  testEveryIconKeyIsUsedByAtLeastOneCollection();
  testNoEmojiAnywhereInIconOrTaxonomySource();
  testNoIconKeyNamesSuggestFigurativeDepiction();
  testIconsAreDecorativeByDefaultAndAcceptAccessibleNaming();
  console.log("\nAll Duʿa & Dhikr icon-consistency tests passed.");
}

runAll();
