/**
 * Consent persistence contract — storage key is language-agnostic.
 * Run: npx tsx tests/ux/consent-localisation.smoke.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const banner = readFileSync(resolve("analytics/lib/consent-banner.tsx"), "utf8");
const consent = readFileSync(resolve("analytics/lib/consent.ts"), "utf8");
const en = JSON.parse(readFileSync(resolve("src/messages/en.json"), "utf8"));
const da = JSON.parse(readFileSync(resolve("src/messages/da.json"), "utf8"));

assert.match(banner, /const CONSENT_STORAGE_KEY = "sr_consent_v1"/);
assert.match(consent, /sr_consent_v1/);

/* Visibility depends only on storage presence — not on locale */
assert.match(banner, /localStorage\.getItem\(CONSENT_STORAGE_KEY\)/);
assert.doesNotMatch(banner, /useLocale/);
assert.doesNotMatch(banner, /pathname.*consent|consent.*pathname/i);

const requiredKeys = [
  "bannerHeading",
  "bannerBody",
  "accept",
  "reject",
  "managePreferences",
  "hidePreferences",
  "savePreferences",
  "preferencesTitle",
  "strictlyNecessary",
  "strictlyNecessaryDesc",
  "alwaysActive",
  "analytics",
  "analyticsDesc",
  "marketing",
  "marketingDesc",
  "privacyPolicy",
  "ariaBanner",
  "ariaPreferences",
  "ariaClose",
  "saved",
  "error",
] as const;

for (const key of requiredKeys) {
  assert.equal(typeof en.consent[key], "string", `en.consent.${key}`);
  assert.equal(typeof da.consent[key], "string", `da.consent.${key}`);
  assert.ok(en.consent[key].length > 0);
  assert.ok(da.consent[key].length > 0);
}

assert.notEqual(en.consent.bannerBody, da.consent.bannerBody);

console.log("consent-localisation.smoke.ts: ok");
