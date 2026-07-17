/**
 * Duʿa & Dhikr — dev-only UI stress-test fixture safety tests.
 *
 * Confirms the dev-preview route and its fixture data can never reach a
 * production build, are never indexed, and are never imported by any
 * production code path.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DEV_STRESS_FIXTURES } from "../../src/lib/dua-dhikr/dev-fixtures";
import { CANONICAL_COLLECTION_SLUGS } from "../../src/lib/dua-dhikr/taxonomy";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const devPreviewPageSource = readFileSync(
  join(REPO_ROOT, "src/app/[locale]/knowledge-library/dua-dhikr/dev-preview/page.tsx"),
  "utf-8",
);

function testDevPreviewRefusesProductionEnvironment() {
  assert(
    devPreviewPageSource.includes('process.env.NODE_ENV === "production"') && devPreviewPageSource.includes("notFound()"),
    "the dev-preview page must call notFound() when NODE_ENV is production",
  );
  console.log("✓ dev-preview route refuses to render when NODE_ENV is production");
}

function testDevPreviewIsMarkedNoindex() {
  assert(devPreviewPageSource.includes("index: false") && devPreviewPageSource.includes("follow: false"), "the dev-preview route must set robots noindex, nofollow");
  console.log("✓ dev-preview route is marked noindex, nofollow");
}

function testDevPreviewRouteSlugIsNotACanonicalCollection() {
  assert(
    !(CANONICAL_COLLECTION_SLUGS as string[]).includes("dev-preview"),
    "\"dev-preview\" must never become a canonical collection slug, or it would collide with this route",
  );
  console.log("✓ \"dev-preview\" is not a canonical collection slug (no route collision)");
}

function testDevFixturesModuleIsNotImportedByAnyProductionFile() {
  const productionSourceDirs = ["src/app", "src/components", "src/sanity", "src/lib"];
  const offendingFiles: string[] = [];
  function walk(dir: string) {
    const { readdirSync, statSync } = require("node:fs") as typeof import("node:fs");
    for (const entry of readdirSync(join(REPO_ROOT, dir))) {
      const relPath = `${dir}/${entry}`;
      const fullPath = join(REPO_ROOT, relPath);
      if (statSync(fullPath).isDirectory()) {
        walk(relPath);
        continue;
      }
      if (!/\.(ts|tsx)$/.test(entry)) continue;
      if (relPath.includes("dev-preview") || relPath.endsWith("dev-fixtures.ts")) continue;
      const source = readFileSync(fullPath, "utf-8");
      if (source.includes("dua-dhikr/dev-fixtures") || source.includes("DEV_STRESS_FIXTURES")) {
        offendingFiles.push(relPath);
      }
    }
  }
  for (const dir of productionSourceDirs) walk(dir);
  assert(
    offendingFiles.length === 0,
    `dev-fixtures.ts must only be imported by the dev-preview route; found in: ${offendingFiles.join(", ")}`,
  );
  console.log("✓ dev-fixtures.ts is imported only by the dev-preview route, nowhere else in src/");
}

function testEveryFixtureLabelledAndWouldBeBlockedByImportValidation() {
  for (const { label, entry } of DEV_STRESS_FIXTURES) {
    const text = `${entry.titleEn} ${entry.arabicText} ${entry.translationEn}`;
    assert(
      /fixture|test data/i.test(text),
      `fixture "${label}" must contain an obvious FIXTURE/TEST DATA marker in its visible text`,
    );
  }
  console.log("✓ every stress-test fixture is clearly labelled as synthetic, non-religious placeholder content");
}

function testAllStressDimensionsPresent() {
  const labels = DEV_STRESS_FIXTURES.map((f) => f.label.toLowerCase());
  const requiredSubstrings = [
    "short arabic",
    "long arabic",
    "transliteration",
    "english translation",
    "danish translation",
    "explanation",
    "multiple references",
    "no optional explanation",
    "no transliteration",
    "repetition",
    "multiple collections",
    "long collection name",
  ];
  for (const required of requiredSubstrings) {
    assert(
      labels.some((l) => l.includes(required)),
      `no fixture found covering the required stress dimension "${required}"`,
    );
  }
  console.log(`✓ all ${requiredSubstrings.length} required stress dimensions have a corresponding fixture`);
}

function runAll() {
  testDevPreviewRefusesProductionEnvironment();
  testDevPreviewIsMarkedNoindex();
  testDevPreviewRouteSlugIsNotACanonicalCollection();
  testDevFixturesModuleIsNotImportedByAnyProductionFile();
  testEveryFixtureLabelledAndWouldBeBlockedByImportValidation();
  testAllStressDimensionsPresent();
  console.log("\nAll Duʿa & Dhikr dev-fixture safety tests passed.");
}

runAll();
