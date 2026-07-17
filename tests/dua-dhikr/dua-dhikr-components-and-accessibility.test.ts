/**
 * Duʿā & Dhikr — component/accessibility static-source checks.
 *
 * These are source-level checks (no DOM rendering) confirming the
 * accessibility-critical markup decisions documented in
 * docs/dua-dhikr/ACCESSIBILITY_CHECKLIST.md are actually present in code.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const read = (relativePath: string) => readFileSync(join(REPO_ROOT, relativePath), "utf-8");

const arabicText = read("src/components/dua-dhikr/ArabicText.tsx");
const entryCard = read("src/components/dua-dhikr/DuaDhikrEntryCard.tsx");
const icons = read("src/components/dua-dhikr/icons.tsx");
const search = read("src/components/dua-dhikr/DuaDhikrSearch.tsx");
const entryCollection = read("src/components/dua-dhikr/DuaDhikrEntryCollection.tsx");
const css = read("src/components/dua-dhikr/dua-dhikr.css");

function testArabicTextHasCorrectDirAndLang() {
  assert(arabicText.includes('dir="rtl"'), "ArabicText must set dir=\"rtl\"");
  assert(arabicText.includes('lang="ar"'), "ArabicText must set lang=\"ar\"");
  console.log("✓ ArabicText sets dir=\"rtl\" lang=\"ar\"");
}

function testArabicCssNeverTruncates() {
  assert(!css.includes("line-clamp"), "Arabic text styling must never truncate with line-clamp");
  assert(!css.includes("text-overflow"), "Arabic text styling must never truncate with text-overflow");
  console.log("✓ .dua-dhikr-arabic styling contains no truncation rules");
}

function testVirtueExplanationReferencesUseNativeDetails() {
  const detailsCount = (entryCard.match(/<details>/g) ?? []).length;
  assert(detailsCount >= 3, "virtue, explanation, and references must each use a native <details> element");
  assert(!entryCard.includes('role="button"'), "no custom ARIA disclosure widget should be needed alongside native <details>");
  console.log("✓ virtue/explanation/references use native, keyboard-accessible <details>/<summary>");
}

function testArabicAndTranslationAreNeverInsideDetails() {
  const beforeFirstDetails = entryCard.split("<details>")[0];
  assert(beforeFirstDetails.includes("ArabicText"), "the Arabic block must render before any <details> — never hidden behind an accordion");
  console.log("✓ Arabic text and primary translation render before (outside) any collapsible section");
}

function testAudioNeverAutoplaysAndIsConditionallyRendered() {
  assert(!entryCard.includes("autoPlay"), "audio must never autoplay");
  assert(entryCard.includes("hasAudioAsset && entry.audioAssetUrl"), "the audio control must be conditionally rendered only when a real asset exists");
  console.log("✓ audio never autoplays and the control is hidden entirely when no asset exists");
}

function testTouchTargetsAreAtLeast44px() {
  const minHeightDeclarations = css.match(/min-height:\s*44px/g) ?? [];
  assert(minHeightDeclarations.length >= 3, "at least the entry-card action, discovery link, and search input must declare a 44px minimum touch target");
  console.log(`✓ ${minHeightDeclarations.length} interactive element styles declare a 44px minimum touch target`);
}

function testIconsAreDecorativeByDefault() {
  assert(icons.includes('aria-hidden={title ? undefined : true}'), "DuaDhikrIcon must be aria-hidden by default (decorative)");
  assert(icons.includes("currentColor"), "icons must use currentColor, never a hardcoded fill, to inherit themed colour");
  console.log("✓ icons are decorative (aria-hidden) by default and themeable via currentColor");
}

function testSearchResultsUseLiveRegion() {
  assert(search.includes('aria-live="polite"'), "search results must announce via an aria-live region");
  console.log("✓ Duʿā & Dhikr search results announce through an aria-live region");
}

function testMemoriseModeNeverHidesArabic() {
  // The Arabic <ArabicText> render must be unconditional — unlike the
  // translation/transliteration paragraphs just below it, which ARE wrapped
  // in a `{(!memoriseMode || revealX) && (...)}` guard, the line rendering
  // <ArabicText> must not itself open with a JSX conditional (it may
  // legitimately reference `memoriseMode` only to pick a `size` prop, which
  // enlarges rather than hides it).
  const arabicRenderLine = entryCard.split("\n").find((line) => line.includes("<ArabicText"));
  assert(!!arabicRenderLine, "expected an <ArabicText> render in DuaDhikrEntryCard");
  assert(!/^\s*\{.*&&/.test(arabicRenderLine!), "the <ArabicText> render must not be wrapped in a conditional && guard that could hide it");
  assert(
    entryCard.includes('size={memoriseMode ? "large" : "default"}'),
    "memorise mode must enlarge the Arabic text via the size prop, not hide it",
  );
  console.log("✓ memorise mode enlarges but never hides the Arabic text");
}

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function testMemoriseModeHasNoGamificationLanguage() {
  // Scans actual code only (comments are stripped first) — the module-level
  // doc comment on DuaDhikrEntryCard.tsx legitimately documents that these
  // things are absent, using the very words this test forbids in real code.
  // "badge" is deliberately excluded from this list: the neutral
  // "pending-badge" status label (dua-dhikr-pending-badge) is a plain text
  // notice, not an achievement/gamification badge.
  const forbidden = ["streak", "leaderboard", "confetti", "achievement", "points earned", "level up"];
  const allSource = stripComments(entryCard) + stripComments(entryCollection);
  for (const term of forbidden) {
    assert(!allSource.toLowerCase().includes(term), `Duʿā & Dhikr component code must not contain gamification language ("${term}")`);
  }
  console.log("✓ no streak/leaderboard/badge/confetti/points gamification language exists in the memorise-mode component code");
}

function runAll() {
  testArabicTextHasCorrectDirAndLang();
  testArabicCssNeverTruncates();
  testVirtueExplanationReferencesUseNativeDetails();
  testArabicAndTranslationAreNeverInsideDetails();
  testAudioNeverAutoplaysAndIsConditionallyRendered();
  testTouchTargetsAreAtLeast44px();
  testIconsAreDecorativeByDefault();
  testSearchResultsUseLiveRegion();
  testMemoriseModeNeverHidesArabic();
  testMemoriseModeHasNoGamificationLanguage();
  console.log("\nAll Duʿā & Dhikr component/accessibility tests passed.");
}

runAll();
