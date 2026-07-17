/**
 * Dhikr Morning/Evening dual-navigation hero tests.
 *
 * Static source and catalogue inspection — no browser required for these
 * assertions. Browser verification remains a separate manual/dev-server step.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import en from "../../src/messages/en.json";
import da from "../../src/messages/da.json";
import { LOCALES } from "../../src/i18n/locales";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const NAV_PATH = join(REPO_ROOT, "src/components/dhikr/DhikrTimeNavigation.tsx");
const NAV_CSS_PATH = join(REPO_ROOT, "src/components/dhikr/dhikr-time-navigation.css");
const MORNING_PAGE = join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/morning/page.tsx");
const EVENING_PAGE = join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/evening/page.tsx");

function testNavComponentExists() {
  assert(existsSync(NAV_PATH), "DhikrTimeNavigation.tsx must exist");
  assert(existsSync(NAV_CSS_PATH), "dhikr-time-navigation.css must exist");
  console.log("✓ DhikrTimeNavigation component and stylesheet exist");
}

function testEveningRouteExists() {
  assert(existsSync(EVENING_PAGE), "Evening Dhikr page must exist at knowledge/dhikr/evening/page.tsx");
  console.log("✓ Evening Dhikr route file exists");
}

function testBothPagesUseSharedNav() {
  const morning = readFileSync(MORNING_PAGE, "utf-8");
  const evening = readFileSync(EVENING_PAGE, "utf-8");
  assert(
    morning.includes('from "@/components/dhikr/DhikrTimeNavigation"'),
    "Morning page must import DhikrTimeNavigation",
  );
  assert(
    evening.includes('from "@/components/dhikr/DhikrTimeNavigation"'),
    "Evening page must import DhikrTimeNavigation",
  );
  assert(morning.includes('activeTime="morning"'), "Morning page must pass activeTime=\"morning\"");
  assert(evening.includes('activeTime="evening"'), "Evening page must pass activeTime=\"evening\"");
  console.log("✓ Morning and Evening pages share DhikrTimeNavigation with correct activeTime");
}

function testNavUsesLocaleAwareLinks() {
  const source = readFileSync(NAV_PATH, "utf-8");
  assert(source.includes('from "@/i18n/navigation"'), "Nav must import Link from @/i18n/navigation");
  assert(source.includes('"/knowledge/dhikr/morning"'), "Nav must link to /knowledge/dhikr/morning");
  assert(source.includes('"/knowledge/dhikr/evening"'), "Nav must link to /knowledge/dhikr/evening");
  assert(source.includes('aria-current={isActive ? "page" : undefined}'), "Active link must set aria-current=\"page\"");
  assert(!/^\s*["']use client["']/.test(source), "DhikrTimeNavigation must remain a Server Component");
  console.log("✓ Nav uses locale-aware Link destinations and aria-current");
}

function testMorningPageNoLongerUsesStaticHeroTitle() {
  const morning = readFileSync(MORNING_PAGE, "utf-8");
  assert(!/title=\{t\("heading"\)\}/.test(morning), "Morning page must not pass the former heading as SectionPage title");
  assert(!/lede=\{t\("lede"\)\}/.test(morning), "Morning page must not pass the former lede as SectionPage lede");
  console.log("✓ Morning page hero is the dual-navigation component, not the former title/lede");
}

function testEnglishCopy() {
  const nav = en.dhikr.timeNavigation;
  assert(nav.eyebrow === "Daily Dhikr", `EN eyebrow, got "${nav.eyebrow}"`);
  assert(nav.morning === "Morning Dhikr", `EN morning, got "${nav.morning}"`);
  assert(nav.evening === "Evening Dhikr", `EN evening, got "${nav.evening}"`);
  assert(
    nav.supporting === "Choose the remembrance collection for the beginning or close of your day",
    `EN supporting, got "${nav.supporting}"`,
  );
  assert(!nav.supporting.endsWith("."), "EN supporting line must not end with a trailing period");

  const evening = en.dhikrEvening;
  assert(evening.breadcrumb === "Evening Dhikr", "EN evening breadcrumb");
  assert(
    evening.emptyState.body ===
      "The Evening Dhikr collection is currently being prepared and reviewed. It will be published here once the wording, sourcing and translations are ready",
    "EN evening empty-state body must match the approved honest copy",
  );
  assert(!/verif/i.test(evening.emptyState.body), "Evening empty state must not claim verification");
  assert(!/approv/i.test(evening.emptyState.body), "Evening empty state must not claim approval");

  assert(en.pages.dhikrEvening.title === "Evening Dhikr | Sunnah Remedies", "EN evening metadata title");
  assert(!/verif/i.test(en.pages.dhikrEvening.description), "EN evening metadata must not claim verification");
  console.log("✓ English time-navigation and Evening copy are present and honest");
}

function testDanishCopy() {
  const nav = da.dhikr.timeNavigation;
  assert(nav.eyebrow === "Daglig dhikr", `DA eyebrow, got "${nav.eyebrow}"`);
  assert(nav.morning === "Morgen-dhikr", `DA morning, got "${nav.morning}"`);
  assert(nav.evening === "Aften-dhikr", `DA evening, got "${nav.evening}"`);
  assert(
    nav.supporting === "Vælg samlingen af dhikr til begyndelsen eller afslutningen på din dag",
    `DA supporting, got "${nav.supporting}"`,
  );

  const evening = da.dhikrEvening;
  assert(evening.breadcrumb === "Aften-dhikr", "DA evening breadcrumb");
  assert(
    evening.emptyState.body ===
      "Samlingen af aften-dhikr er under udarbejdelse og gennemgang. Den offentliggøres her, når ordlyd, kilder og oversættelser er klar",
    "DA evening empty-state body must match the approved honest copy",
  );

  assert(da.pages.dhikrEvening.title === "Aften-dhikr | Sunnah Remedies", "DA evening metadata title");
  console.log("✓ Danish time-navigation and Evening copy are present and honest");
}

function testLocalePrefixConvention() {
  const daLocale = LOCALES.find((l) => l.id === "da");
  const enLocale = LOCALES.find((l) => l.id === "en");
  assert(daLocale?.prefix === "/dk", "Danish public prefix must be /dk");
  assert(enLocale?.prefix === "", "English must remain unprefixed");
  console.log("✓ Locale prefix convention preserved (EN unprefixed, DA /dk)");
}

function testEveningPageDoesNotFabricateContent() {
  const evening = readFileSync(EVENING_PAGE, "utf-8");
  assert(!evening.includes("getMorningDhikrItemsPublic"), "Evening page must not load Morning items");
  assert(!evening.includes("getPendingReferenceCollection"), "Evening page must not project Morning register entries");
  assert(!evening.includes("morning-dhikr-register"), "Evening page must not import the Morning research register");
  assert(!evening.includes("dhikr-fetch"), "Evening page must not import staff dhikr-fetch");
  assert(evening.includes("DhikrTimeNavigation"), "Evening shell must include shared navigation");
  assert(evening.includes("emptyState"), "Evening shell must render an empty state");
  console.log("✓ Evening page is an honest shell — no fabricated or copied Morning content");
}

function testCssAvoidsGenericButtonStyling() {
  const css = readFileSync(NAV_CSS_PATH, "utf-8");
  assert(!css.includes("border-radius: 999"), "Nav CSS must not use pill radii");
  assert(!css.includes("gradient"), "Nav CSS must not use gradients");
  assert(css.includes("var(--sage-deep)"), "Nav CSS must use sage-deep emerald token");
  assert(css.includes("var(--brass)"), "Nav CSS must use brass gold token");
  assert(css.includes(":focus-visible"), "Nav CSS must define focus-visible");
  console.log("✓ Nav CSS follows editorial tokens without pill/gradient styling");
}

async function main() {
  testNavComponentExists();
  testEveningRouteExists();
  testBothPagesUseSharedNav();
  testNavUsesLocaleAwareLinks();
  testMorningPageNoLongerUsesStaticHeroTitle();
  testEnglishCopy();
  testDanishCopy();
  testLocalePrefixConvention();
  testEveningPageDoesNotFabricateContent();
  testCssAvoidsGenericButtonStyling();
  console.log("\nAll dhikr time-navigation tests passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
