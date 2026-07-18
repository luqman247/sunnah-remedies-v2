/**
 * Duʿa & Dhikr — heading-hierarchy regression test.
 *
 * The shared DhikrTimeNavigation component still powers Morning/Evening
 * stand-alone pages (with its own <h1>). The Duʿā & Dhikr landing hub must
 * NOT embed that typographic menu — collection names live in “Begin here”
 * cards — and must keep exactly one visible <h1> of its own.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const navSource = readFileSync(
  join(REPO_ROOT, "src/components/dhikr/DhikrTimeNavigation.tsx"),
  "utf-8",
);
const landingPageSource = readFileSync(
  join(REPO_ROOT, "src/app/[locale]/knowledge-library/dua-dhikr/page.tsx"),
  "utf-8",
);
const morningPageSource = readFileSync(
  join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/morning/page.tsx"),
  "utf-8",
);
const eveningPageSource = readFileSync(
  join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/evening/page.tsx"),
  "utf-8",
);

function testLandingDoesNotEmbedDhikrTimeNavigation() {
  assert(
    !landingPageSource.includes("DhikrTimeNavigation"),
    "the Duʿā & Dhikr landing hub must not embed DhikrTimeNavigation (giant Morning/Evening hero links)",
  );
  assert(
    landingPageSource.includes('className="dua-dhikr-hero__heading"'),
    "the landing page must render a visible <h1> with the editorial hub heading",
  );
  assert(
    !landingPageSource.includes('<h1 className="sr-only">'),
    "the landing hub heading must be visible, not screen-reader-only",
  );
  console.log(
    "✓ the Duʿā & Dhikr landing hub no longer embeds DhikrTimeNavigation and keeps one visible <h1>",
  );
}

function testMorningAndEveningDoNotPassTheNewProp() {
  assert(
    !morningPageSource.includes("suppressOwnHeading"),
    "Morning Dhikr must not need suppressOwnHeading — it is the page's only <h1>",
  );
  assert(
    !eveningPageSource.includes("suppressOwnHeading"),
    "Evening Dhikr must not need suppressOwnHeading — it is the page's only <h1>",
  );
  console.log(
    "✓ Morning and Evening Dhikr usage of DhikrTimeNavigation is unchanged",
  );
}

function testDhikrTimeNavigationDefaultsToRenderingAnH1() {
  assert(
    navSource.includes('suppressOwnHeading ? "span" : "h1"'),
    "DhikrTimeNavigation must default to rendering an <h1> for Morning/Evening pages",
  );
  console.log(
    "✓ DhikrTimeNavigation defaults to its original <h1> behaviour; suppression remains opt-in",
  );
}

function runAll() {
  testLandingDoesNotEmbedDhikrTimeNavigation();
  testMorningAndEveningDoNotPassTheNewProp();
  testDhikrTimeNavigationDefaultsToRenderingAnH1();
  console.log("\nAll Duʿa & Dhikr heading-hierarchy tests passed.");
}

runAll();
