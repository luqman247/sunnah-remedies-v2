/**
 * Breadcrumb + deep-route locale parity — run with:
 * npx tsx tests/ux/breadcrumb-locale.smoke.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { stripLocalePrefixFromPath, LOCALE_PATH_SEGMENTS } from "../../src/lib/i18n/chrome-labels";
import { DEPARTMENT_SECTION_MESSAGE_KEYS } from "../../src/lib/i18n/department-nav-labels";

const en = JSON.parse(readFileSync(resolve("src/messages/en.json"), "utf8"));
const da = JSON.parse(readFileSync(resolve("src/messages/da.json"), "utf8"));

assert.equal(stripLocalePrefixFromPath("/dk/the-apothecary/catalogue"), "/the-apothecary/catalogue");
assert.equal(stripLocalePrefixFromPath("/dk"), "/");
assert.equal(stripLocalePrefixFromPath("/the-academy"), "/the-academy");
assert.equal(stripLocalePrefixFromPath("/da/knowledge-library"), "/knowledge-library");

for (const seg of ["dk", "da", "en", "Dk", "DA"]) {
  assert.ok(LOCALE_PATH_SEGMENTS.has(seg.toLowerCase()));
}

const routes = [
  "/the-apothecary/catalogue",
  "/the-academy/curriculum",
  "/sacred-journeys/itineraries",
  "/knowledge-library/dua-dhikr",
  "/consultations",
  "/institute",
];

for (const href of routes) {
  assert.ok(
    DEPARTMENT_SECTION_MESSAGE_KEYS[href],
    `Missing section message map for ${href}`,
  );
}

function resolveKey(namespace: string, key: string, catalog: Record<string, unknown>): string {
  const parts = key.split(".");
  let cur: unknown = catalog[namespace];
  for (const p of parts) {
    assert.ok(cur && typeof cur === "object", `Missing ${namespace}.${key}`);
    cur = (cur as Record<string, unknown>)[p];
  }
  assert.equal(typeof cur, "string", `${namespace}.${key} must be string`);
  return cur as string;
}

for (const [href, ref] of Object.entries(DEPARTMENT_SECTION_MESSAGE_KEYS)) {
  const enLabel = resolveKey(ref.namespace, ref.key, en);
  const daLabel = resolveKey(ref.namespace, ref.key, da);
  assert.ok(enLabel.length > 0, `EN empty for ${href}`);
  assert.ok(daLabel.length > 0, `DA empty for ${href}`);
  assert.notEqual(enLabel.toLowerCase(), "dk");
  assert.notEqual(daLabel.toLowerCase(), "dk");
}

/* Retained proper names */
assert.equal(en.journeys.umrah, "Umrah");
assert.equal(da.journeys.umrah, "Umrah");
assert.match(en.academy.hijamaDiploma, /Hijāma/);
assert.match(da.academy.hijamaDiploma, /Hijāma/);
assert.match(en.duaDhikr.breadcrumb, /Duʿa/);
assert.match(da.duaDhikr.breadcrumb, /Duʿa/);

console.log("breadcrumb-locale.smoke.ts: ok");
