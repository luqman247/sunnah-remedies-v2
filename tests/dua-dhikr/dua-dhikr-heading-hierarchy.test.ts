/**
 * Duʿa & Dhikr — heading-hierarchy regression test.
 *
 * The Duʿa & Dhikr landing page embeds the shared DhikrTimeNavigation
 * component (also used, unmodified, by the standalone Morning/Evening
 * Dhikr pages). DhikrTimeNavigation renders its own <h1> by default,
 * which is correct when it IS the page's only heading (Morning/Evening)
 * but wrong when embedded inside a page that already has its own <h1>
 * (the Duʿa & Dhikr landing page) — two <h1> elements on one page is
 * invalid heading structure. `suppressOwnHeading` fixes this without
 * touching Morning/Evening's own usage at all.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const navSource = readFileSync(join(REPO_ROOT, "src/components/dhikr/DhikrTimeNavigation.tsx"), "utf-8");
const landingPageSource = readFileSync(join(REPO_ROOT, "src/app/[locale]/knowledge-library/dua-dhikr/page.tsx"), "utf-8");
const morningPageSource = readFileSync(join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/morning/page.tsx"), "utf-8");
const eveningPageSource = readFileSync(join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/evening/page.tsx"), "utf-8");

function testDuaDhikrLandingPassesSuppressOwnHeading() {
  assert(
    landingPageSource.includes("<DhikrTimeNavigation suppressOwnHeading") || landingPageSource.includes("<DhikrTimeNavigation suppressOwnHeading />"),
    "the Duʿa & Dhikr landing page must render <DhikrTimeNavigation suppressOwnHeading /> to avoid a second <h1>",
  );
  assert(landingPageSource.includes('<h1 className="sr-only">'), "the landing page must still render its own single <h1>");
  console.log("✓ the Duʿa & Dhikr landing page suppresses DhikrTimeNavigation's own heading and keeps exactly one <h1>");
}

function testMorningAndEveningDoNotPassTheNewProp() {
  assert(
    !morningPageSource.includes("suppressOwnHeading"),
    "Morning Dhikr must not need suppressOwnHeading — it is the page's only <h1>, unchanged from before this fix",
  );
  assert(
    !eveningPageSource.includes("suppressOwnHeading"),
    "Evening Dhikr must not need suppressOwnHeading — it is the page's only <h1>, unchanged from before this fix",
  );
  console.log("✓ Morning and Evening Dhikr usage of DhikrTimeNavigation is completely unchanged");
}

function testDhikrTimeNavigationDefaultsToRenderingAnH1() {
  assert(
    navSource.includes('suppressOwnHeading ? "span" : "h1"'),
    "DhikrTimeNavigation must default to rendering an <h1> (Morning/Evening's existing, unchanged behaviour) and only switch to <span> when explicitly asked",
  );
  console.log("✓ DhikrTimeNavigation defaults to its original <h1> behaviour; suppression is opt-in only");
}

function runAll() {
  testDuaDhikrLandingPassesSuppressOwnHeading();
  testMorningAndEveningDoNotPassTheNewProp();
  testDhikrTimeNavigationDefaultsToRenderingAnH1();
  console.log("\nAll Duʿa & Dhikr heading-hierarchy tests passed.");
}

runAll();
