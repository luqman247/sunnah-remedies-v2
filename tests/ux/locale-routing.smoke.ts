/**
 * UX locale rewrite smoke test — run with: npx tsx tests/ux/locale-routing.smoke.ts
 * Asserts next.config rewrites preserve as-needed English and /dk Danish prefixes
 * without intercepting public static assets (brand/photography).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const configPath = resolve(process.cwd(), "next.config.ts");
const source = readFileSync(configPath, "utf8");

assert.match(source, /source:\s*"\/dk"/, "Danish homepage rewrite missing");
assert.match(source, /destination:\s*"\/da"/, "Danish homepage destination missing");
assert.match(source, /source:\s*"\/dk\/:path\*"/, "Danish path rewrite missing");
assert.match(
  source,
  /destination:\s*"\/en\/:path"/,
  "English as-needed rewrite missing",
);
assert.match(
  source,
  /source:\s*"\/knowledge\/dhikr\/:path\*"/,
  "Dhikr locale rewrite missing",
);
assert.match(source, /afterFiles:/, "English catch-all must use afterFiles so public/ assets are not rewritten");
assert.match(
  source,
  /beforeFiles:[\s\S]*\/dk/,
  "Danish rewrites must remain in beforeFiles",
);

console.log("locale-routing.smoke.ts: ok");
