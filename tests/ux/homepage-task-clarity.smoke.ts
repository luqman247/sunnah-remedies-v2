/**
 * Homepage task clarity + task-led navigation — Phase 2B smoke.
 * node --import tsx --test tests/ux/homepage-task-clarity.smoke.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

test("homepage-task-clarity.smoke.ts", () => {
  const page = readFileSync(resolve("src/app/[locale]/page.tsx"), "utf8");
  const masthead = readFileSync(resolve("src/components/chrome/Masthead.tsx"), "utf8");
  const mastheadServer = readFileSync(
    resolve("src/components/chrome/MastheadServer.tsx"),
    "utf8",
  );
  const pathways = readFileSync(
    resolve("src/components/arrival/TaskPathways.tsx"),
    "utf8",
  );
  const en = JSON.parse(readFileSync(resolve("src/messages/en.json"), "utf8"));
  const da = JSON.parse(readFileSync(resolve("src/messages/da.json"), "utf8"));

  assert.match(page, /bookConsultation/);
  assert.match(page, /href="\/consultations"/);
  assert.match(page, /TaskPathways/);
  assert.match(page, /exploreRemedies/);
  assert.match(page, /findDuaDhikr/);
  assert.match(page, /trustLine/);
  assert.doesNotMatch(page, /TaskPathways\.tsx.*quarantine/i);

  assert.match(mastheadServer, /bookConsultation/);
  assert.match(mastheadServer, /\/institute/);
  assert.match(masthead, /Escape/);
  assert.match(masthead, /aria-modal/);
  assert.match(masthead, /tasksHeading/);
  assert.match(masthead, /duaDhikr/);
  assert.match(masthead, /focusable/);
  assert.match(masthead, /aria-current/);
  assert.match(masthead, /nav-link--current/);
  assert.match(masthead, /mobile-nav-panel__primary/);
  assert.match(masthead, /document\.body\.style\.overflow/);

  assert.match(pathways, /getAllJourneys/);
  assert.match(pathways, /knowledge-library\/dua-dhikr/);
  assert.match(pathways, /\/consultations/);
  assert.match(pathways, /\/the-apothecary/);
  assert.match(pathways, /\/the-academy/);
  assert.match(pathways, /\/institute/);
  assert.doesNotMatch(pathways, /dev-preview/);
  assert.doesNotMatch(pathways, /registrationOpen/);

  assert.equal(en.nav.bookConsultation, "Book a consultation");
  assert.equal(da.nav.bookConsultation, "Book en konsultation");
  assert.equal(en.homepage.bookConsultation, "Book a consultation");
  assert.equal(da.homepage.bookConsultation, "Book en konsultation");
  assert.equal(en.homepage.tasks.book.action, "Book a consultation");
  assert.equal(da.homepage.tasks.book.action, "Book en konsultation");
  assert.equal(en.nav.duaDhikr, "Duʿa & Dhikr");
  assert.equal(da.nav.duaDhikr, "Duʿa & dhikr");
  assert.ok(en.homepage.tasks.duaDhikr.label.includes("Duʿa"));
  assert.ok(da.homepage.tasks.duaDhikr.label.includes("Duʿa"));
  assert.equal(typeof en.homepage.trustLine, "string");
  assert.equal(typeof da.homepage.trustLine, "string");
  assert.notEqual(en.nav.bookConsultation, en.nav.consultations);
  assert.ok(en.homepage.tasks.journeys);
  assert.ok(da.homepage.tasks.journeys);

  console.log("homepage-task-clarity.smoke.ts: ok");
});
