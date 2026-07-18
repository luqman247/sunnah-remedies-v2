/**
 * Duʿa & Dhikr — dev-preview gate tests.
 *
 * Run: node --import tsx tests/dua-dhikr/dua-dhikr-dev-preview-gate.test.ts
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isDhikrDevPreviewEnabled } from "../../src/lib/dua-dhikr/dev-preview-gate";
import { CANONICAL_COLLECTION_SLUGS } from "../../src/lib/dua-dhikr/taxonomy";

const REPO_ROOT = join(__dirname, "../..");
const pageSource = readFileSync(
  join(REPO_ROOT, "src/app/[locale]/knowledge-library/dua-dhikr/dev-preview/page.tsx"),
  "utf-8",
);

assert.equal(
  isDhikrDevPreviewEnabled({ NODE_ENV: "development" }),
  false,
  "disabled by default in development when flag absent",
);

assert.equal(
  isDhikrDevPreviewEnabled({ NODE_ENV: "development", ENABLE_DHIKR_DEV_PREVIEW: "true" }),
  true,
  "enabled locally only when explicit flag is true",
);

assert.equal(
  isDhikrDevPreviewEnabled({ NODE_ENV: "production", ENABLE_DHIKR_DEV_PREVIEW: "true" }),
  false,
  "never enabled in production even if flag is set",
);

assert.equal(
  isDhikrDevPreviewEnabled({ NODE_ENV: "test", ENABLE_DHIKR_DEV_PREVIEW: "false" }),
  false,
  "explicit false keeps preview disabled",
);

assert.match(pageSource, /isDhikrDevPreviewEnabled/, "page must use the shared gate");
assert.match(pageSource, /notFound\(\)/, "page must call notFound when gate fails");
assert.match(pageSource, /index:\s*false/, "metadata must set robots index false");
assert.match(pageSource, /follow:\s*false/, "metadata must set robots follow false");
assert.ok(
  !(CANONICAL_COLLECTION_SLUGS as string[]).includes("dev-preview"),
  "dev-preview must never be a canonical collection slug",
);

console.log("dua-dhikr-dev-preview-gate.test.ts: ok");
