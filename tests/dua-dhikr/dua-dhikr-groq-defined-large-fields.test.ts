/**
 * Duʿa & Dhikr — regression test for a real GROQ filter-stage bug.
 *
 * `defined(field) && field != ""` was reproducibly, consistently false for
 * long text fields (confirmed against production: arabicText/translationEn
 * over ~1000 characters, e.g. full Qur'anic ayat) at the GROQ FILTER stage,
 * even though the exact same field read correctly via a projection or via
 * length()/string() in that same filter stage. This silently excluded 4 of
 * 425 published, fully-populated duaDhikrEntry documents from every public
 * query and every collection count — not a caching issue, not a duplicate
 * fetch, not a React rendering bug. Diagnostic evidence (repeated runs, all
 * consistent):
 *   defined(arabicText) && defined(translationEn)  -> 0/4 (every run)
 *   length(arabicText) > 0 && length(translationEn) > 0 -> 4/4 (every run)
 *   string(arabicText) != "" && string(translationEn) != "" -> 4/4 (every run)
 *
 * This test guards against the defined()/!= "" pattern being reintroduced.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  DUA_DHIKR_ELIGIBILITY_GROQ,
  DUA_DHIKR_EDITORIAL_ELIGIBILITY_GROQ,
  DUA_DHIKR_OWNER_APPROVED_ENGLISH_ELIGIBILITY_GROQ,
} from "../../src/sanity/lib/dua-dhikr-publication-gate";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const gateSource = readFileSync(join(REPO_ROOT, "src/sanity/lib/dua-dhikr-publication-gate.ts"), "utf-8");

const LONG_TEXT_FIELDS = ["arabicText", "translationEn", "translationDa", "importIdentifier"];

function testNoQueryUsesDefinedForLongTextFields() {
  const queries = {
    DUA_DHIKR_ELIGIBILITY_GROQ,
    DUA_DHIKR_EDITORIAL_ELIGIBILITY_GROQ,
    DUA_DHIKR_OWNER_APPROVED_ENGLISH_ELIGIBILITY_GROQ,
  };
  for (const [name, query] of Object.entries(queries)) {
    for (const field of LONG_TEXT_FIELDS) {
      assert(
        !query.includes(`defined(${field})`),
        `${name} must not use defined(${field}) — GROQ's filter-stage defined() has been confirmed unreliable for long text fields; use length(${field}) > 0 instead`,
      );
    }
  }
  console.log("✓ no eligibility query uses defined() on a long text field");
}

function testAllThreeQueriesUseLengthForContentFields() {
  assert(DUA_DHIKR_ELIGIBILITY_GROQ.includes("length(arabicText) > 0"), "canonical query must use length(arabicText) > 0");
  assert(DUA_DHIKR_ELIGIBILITY_GROQ.includes("length(translationEn) > 0"), "canonical query must use length(translationEn) > 0");
  assert(DUA_DHIKR_ELIGIBILITY_GROQ.includes("length(translationDa) > 0"), "canonical query must use length(translationDa) > 0");

  assert(DUA_DHIKR_EDITORIAL_ELIGIBILITY_GROQ.includes("length(arabicText) > 0"), "editorial query must use length(arabicText) > 0");
  assert(DUA_DHIKR_EDITORIAL_ELIGIBILITY_GROQ.includes("length(translationEn) > 0"), "editorial query must use length(translationEn) > 0");
  assert(DUA_DHIKR_EDITORIAL_ELIGIBILITY_GROQ.includes("length(translationDa) > 0"), "editorial query must use length(translationDa) > 0");

  assert(DUA_DHIKR_OWNER_APPROVED_ENGLISH_ELIGIBILITY_GROQ.includes("length(importIdentifier) > 0"), "owner-approved query must use length(importIdentifier) > 0");
  assert(DUA_DHIKR_OWNER_APPROVED_ENGLISH_ELIGIBILITY_GROQ.includes("length(arabicText) > 0"), "owner-approved query must use length(arabicText) > 0");
  assert(DUA_DHIKR_OWNER_APPROVED_ENGLISH_ELIGIBILITY_GROQ.includes("length(translationEn) > 0"), "owner-approved query must use length(translationEn) > 0");
  // Owner-approved pathway deliberately never checks translationDa — unrelated to this bug fix.
  assert(!DUA_DHIKR_OWNER_APPROVED_ENGLISH_ELIGIBILITY_GROQ.includes("translationDa"), "owner-approved query must still never check translationDa");

  console.log("✓ all three eligibility queries use length() > 0 for their content fields");
}

function testGateSourceExplainsWhy() {
  assert(
    gateSource.toLowerCase().includes("defined()") || gateSource.includes("filter-stage"),
    "the gate file should document why length() is used instead of defined(), so a future edit doesn't silently reintroduce the bug",
  );
  console.log("✓ the gate file documents the reason for length() over defined()");
}

function runAll() {
  testNoQueryUsesDefinedForLongTextFields();
  testAllThreeQueriesUseLengthForContentFields();
  testGateSourceExplainsWhy();
  console.log("\nAll GROQ defined()-on-long-fields regression tests passed.");
}

runAll();
