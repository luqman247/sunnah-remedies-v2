/**
 * UX locale rewrite smoke test — run with:
 *   node --import tsx --test tests/ux/locale-routing.smoke.ts
 *
 * Public Danish is `/dk`. Internal App Router / next-intl id remains `da`.
 * Direct `/da` requests must permanently redirect to `/dk` so they are not a
 * second indexable Danish surface.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { localeUrl } from "@/lib/seo/metadata";

test("locale-routing.smoke.ts", () => {
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
  assert.match(
    source,
    /afterFiles:/,
    "English catch-all must use afterFiles so public/ assets are not rewritten",
  );
  assert.match(
    source,
    /beforeFiles:[\s\S]*\/dk/,
    "Danish rewrites must remain in beforeFiles",
  );

  // Public /da must collapse to canonical /dk (permanent).
  assert.match(
    source,
    /source:\s*"\/da"[^]*destination:\s*"\/dk"[^]*permanent:\s*true/,
    "Missing permanent /da → /dk redirect",
  );
  assert.match(
    source,
    /source:\s*"\/da\/:path\*"[^]*destination:\s*"\/dk\/:path\*"[^]*permanent:\s*true/,
    "Missing permanent /da/:path* → /dk/:path* redirect",
  );

  // localeUrl must emit public prefixes, never internal /da.
  assert.equal(localeUrl("en", "/"), "https://www.sunnahremedies.com/");
  assert.equal(localeUrl("da", "/"), "https://www.sunnahremedies.com/dk");
  assert.equal(
    localeUrl("da", "/the-academy"),
    "https://www.sunnahremedies.com/dk/the-academy",
  );
  assert.doesNotMatch(localeUrl("da", "/consultations"), /\/da(\/|$)/);
  assert.match(localeUrl("da", "/consultations"), /\/dk\/consultations$/);

  console.log("locale-routing.smoke.ts: ok");
});
