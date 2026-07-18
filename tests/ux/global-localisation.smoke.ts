/**
 * Phase 2A global localisation smoke — run with:
 * npx tsx tests/ux/global-localisation.smoke.ts
 */
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (p: string) => readFileSync(resolve(root, p), "utf8");
const en = JSON.parse(read("src/messages/en.json"));
const da = JSON.parse(read("src/messages/da.json"));

/* —— Consent messages —— */
assert.ok(en.consent?.bannerHeading);
assert.ok(da.consent?.bannerHeading);
assert.notEqual(en.consent.bannerHeading, da.consent.bannerHeading);
assert.equal(en.consent.accept, "Accept analytics");
assert.equal(da.consent.accept, "Acceptér analyse");
assert.equal(en.consent.reject, "Reject all");
assert.equal(da.consent.reject, "Afvis alle");
assert.ok(en.consent.privacyPolicy);
assert.ok(da.consent.strictlyNecessary);
assert.ok(da.consent.alwaysActive);

const consentBanner = read("analytics/lib/consent-banner.tsx");
assert.match(consentBanner, /useTranslations\("consent"\)/);
assert.match(consentBanner, /CONSENT_STORAGE_KEY/);
assert.match(consentBanner, /sr_consent_v1/);
assert.match(consentBanner, /Escape/);
assert.match(consentBanner, /overflow/);
assert.doesNotMatch(consentBanner, /This institution uses cookies/);
assert.doesNotMatch(consentBanner, /Reject all"/);

/* —— Secondary nav mappings —— */
const navLabels = read("src/lib/i18n/department-nav-labels.ts");
assert.match(navLabels, /\/the-academy\/curriculum/);
assert.match(navLabels, /\/sacred-journeys\/itineraries/);
assert.match(navLabels, /\/knowledge-library\/dua-dhikr/);
assert.match(navLabels, /\/institute/);
assert.match(navLabels, /hijamaDiploma/);
assert.match(navLabels, /umrah/);

const deptNav = read("src/components/ui/DepartmentNav.tsx");
assert.match(deptNav, /tAcademy/);
assert.match(deptNav, /tJourneys/);
assert.match(deptNav, /tInstitution/);

assert.equal(da.academy.curriculum, "Pensum");
assert.equal(da.journeys.itineraries, "Rejseplaner");
assert.equal(da.journeys.umrah, "Umrah");
assert.equal(da.academy.hijamaDiploma, "Hijāma Diplom");
assert.equal(da.institutionNav.theInstitute, "Instituttet");

/* —— System states —— */
assert.ok(da.common.retry);
assert.ok(da.common.returnHome);
assert.ok(da.common.errorTitle);
assert.ok(da.common.sessionExpired);
assert.ok(da.common.preparing);
assert.ok(da.notFound.returnHome);
assert.ok(da.hospitable.heading);

const errorBoundary = read("src/app/[locale]/error.tsx");
assert.match(errorBoundary, /useTranslations\("common"\)/);
assert.match(errorBoundary, /retry/);

/* —— Breadcrumbs —— */
const breadcrumb = read("src/components/ui/Breadcrumb.tsx");
assert.match(breadcrumb, /stripLocalePrefixFromPath/);
assert.match(breadcrumb, /LOCALE_PATH_SEGMENTS/);
assert.match(breadcrumb, /DEPARTMENT_SECTION_MESSAGE_KEYS/);
assert.match(breadcrumb, /ariaLabelNav/);
assert.doesNotMatch(breadcrumb, /formatSlug\(parts\[0\]\)/);
assert.equal(da.breadcrumbs.home, "Hjem");
assert.ok(!Object.values(da.breadcrumbs).some((v) => v === "Dk" || v === "Da"));

/* —— Language switcher —— */
const switcher = read("src/components/chrome/LanguageSwitcher.tsx");
assert.match(switcher, /router\.replace\(pathname/);
assert.match(switcher, /switchTo/);
assert.match(switcher, /route-resolution strategy/i);
assert.doesNotMatch(switcher, /searchParams/);

/* —— Routing protections unchanged —— */
const config = read("next.config.ts");
assert.match(config, /afterFiles:/);
assert.match(config, /\/dk\/:path\*/);
assert.match(config, /destination:\s*"\/en\/:path"/);

/* —— Docs —— */
assert.ok(existsSync(resolve(root, "docs/ux/SR_DANISH_CONTENT_GAP_REGISTER.md")));
assert.ok(existsSync(resolve(root, "docs/ux/SR_GLOBAL_LOCALISATION_PHASE_REPORT.md")));

console.log("global-localisation.smoke.ts: ok");
