/**
 * Danish chrome parity smoke — run with:
 * node --import tsx tests/ux/danish-chrome.smoke.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const layout = readFileSync(resolve("src/app/[locale]/layout.tsx"), "utf8");
const masthead = readFileSync(resolve("src/components/chrome/MastheadServer.tsx"), "utf8");
const footer = readFileSync(resolve("src/components/chrome/FooterServer.tsx"), "utf8");
const breadcrumb = readFileSync(resolve("src/components/ui/Breadcrumb.tsx"), "utf8");
const da = JSON.parse(readFileSync(resolve("src/messages/da.json"), "utf8"));
const en = JSON.parse(readFileSync(resolve("src/messages/en.json"), "utf8"));

assert.match(layout, /getMessages\(\{ locale: appLocale \}\)/);
assert.match(layout, /<MastheadServer locale=\{appLocale\}/);
assert.match(layout, /<FooterServer locale=\{appLocale\}/);
assert.match(layout, /NextIntlClientProvider locale=\{appLocale\} messages=\{messages\}/);

assert.match(masthead, /getTranslations\(\{ locale, namespace: "nav" \}\)/);
assert.match(footer, /getTranslations\(\{ locale, namespace: "footer" \}\)/);
assert.match(breadcrumb, /stripLocalePrefixFromPath/);

assert.equal(da.nav.theApothecary, "Apoteket");
assert.equal(da.footer.requestConsultation, "Anmod om en konsultation");
assert.equal(da.footer.columnPillars, "Søjlerne");
assert.equal(da.homepage.eyebrow.includes("———"), false);
assert.equal(en.homepage.eyebrow.includes("———"), false);
assert.equal(en.nav.theApothecary, "The Apothecary");

console.log("danish-chrome.smoke.ts: ok");
