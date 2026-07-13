/**
 * Dhikr Schema Shape Tests — Phase 2 prototype.
 *
 * Static schema-shape checks: these inspect the schema definition objects
 * and validation-rule wiring directly. They do NOT run against a live
 * Sanity dataset (none exists for this prototype) and they do NOT invoke
 * Sanity's real validation runtime — they verify that the *mechanism*
 * (e.g. Rule.valid([...])) is wired with the exact expected arguments,
 * which is what makes Sanity's own runtime reject anything else.
 *
 * Risk mapping (see docs/dhikr/20-risk-register.md): R-01 primarily.
 */

import { schemaTypes } from "../../src/sanity/schemas";
import { dhikrItem } from "../../src/sanity/schemas/documents/dhikr/dhikr-item";
import { dhikrCategory } from "../../src/sanity/schemas/documents/dhikr/dhikr-category";
import { DHIKR_V1_PLACEHOLDER_REGISTER } from "../../src/sanity/lib/dhikr-fetch";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

/** Minimal chainable mock of Sanity's Rule builder — records calls, returns itself. */
function createMockRule() {
  const calls: { method: string; args: unknown[] }[] = [];
  const rule: Record<string, (...args: unknown[]) => unknown> = {};
  for (const method of ["required", "valid", "max", "min", "custom"]) {
    rule[method] = (...args: unknown[]) => {
      calls.push({ method, args });
      return rule;
    };
  }
  return { rule, calls };
}

function findField(fields: Array<{ name: string }>, name: string) {
  const field = fields.find((f) => f.name === name);
  if (!field) throw new Error(`Field "${name}" not found on schema`);
  return field as { name: string; validation?: (rule: unknown) => unknown; initialValue?: unknown; type: string; to?: { type: string }[]; of?: { type: string }[] };
}

/* ── Registration ───────────────────────────────────────────────── */

function testDhikrItemRegisteredInSchemaTypes() {
  assert(
    schemaTypes.some((t) => (t as { name?: string }).name === "dhikrItem"),
    "dhikrItem must be registered in schemaTypes",
  );
  assert(
    schemaTypes.some((t) => (t as { name?: string }).name === "dhikrCategory"),
    "dhikrCategory must be registered in schemaTypes",
  );
  console.log("✓ dhikrItem and dhikrCategory are registered");
}

/* ── reviewStatus enum ──────────────────────────────────────────── */

function testReviewStatusAllowedValuesExact() {
  const field = findField(dhikrItem.fields as Array<{ name: string }>, "reviewStatus");
  const { rule, calls } = createMockRule();
  field.validation!(rule);

  const requiredCall = calls.find((c) => c.method === "required");
  assert(!!requiredCall, "reviewStatus must be required");

  const customCall = calls.find((c) => c.method === "custom");
  assert(!!customCall, "reviewStatus validation must call .custom(...) to enforce the enum — options.list alone is a Studio UI hint, not an enforced constraint");

  // Invoke the actual custom-validator function with each expected value (must pass)
  // and one invalid value (must be rejected) — this behaviourally proves enforcement,
  // not just that some validator was attached.
  const validator = customCall!.args[0] as (value: unknown) => true | string;
  const expected = ["sourced", "scholarly-review", "editorial-review", "approved", "published"];
  for (const value of expected) {
    assert(validator(value) === true, `reviewStatus custom validator must accept "${value}"`);
  }
  const rejection = validator("bogus-status");
  assert(rejection !== true, 'reviewStatus custom validator must reject a value outside the enum (e.g. "bogus-status")');

  console.log("✓ reviewStatus enum is exactly the 5 documented values, required, and the custom validator behaviourally rejects an invalid value");
}

function testReviewStatusDefaultIsSourced() {
  const field = findField(dhikrItem.fields as Array<{ name: string }>, "reviewStatus");
  assert(field.initialValue === "sourced", `Default reviewStatus must be "sourced", got "${field.initialValue}"`);
  console.log("✓ reviewStatus defaults to sourced");
}

/* ── Reuse of existing types (not duplicated) ──────────────────── */

function testAudioAssetReferencesExistingType() {
  const field = findField(dhikrItem.fields as Array<{ name: string }>, "audioAsset");
  assert(field.type === "reference", "audioAsset must be a reference field");
  assert(field.to?.[0]?.type === "audioAsset", "audioAsset must reference the existing audioAsset document type, not a new one");
  console.log("✓ audioAsset references the existing audioAsset type");
}

function testSourceReferencesReusesExistingObject() {
  const field = findField(dhikrItem.fields as Array<{ name: string }>, "sourceReferences");
  assert(field.type === "array", "sourceReferences must be an array field");
  assert(field.of?.[0]?.type === "sourceReference", "sourceReferences must reuse the existing sourceReference object, not a bespoke field");
  console.log("✓ sourceReferences reuses the existing sourceReference object");
}

function testBoardApprovalsReusesExistingObject() {
  const field = findField(dhikrItem.fields as Array<{ name: string }>, "boardApprovals");
  assert(field.type === "array", "boardApprovals must be an array field");
  assert(field.of?.[0]?.type === "boardApproval", "boardApprovals must reuse the existing boardApproval object, not a bespoke field");
  console.log("✓ boardApprovals reuses the existing boardApproval object");
}

/* ── No pre-populated content ───────────────────────────────────── */

function testNoContentFieldsPrepopulated() {
  const contentFields = ["arabicText", "transliteration", "translationEn", "translationDa", "sourceReferences", "recommendedRepetitions", "audioAsset"];
  for (const name of contentFields) {
    const field = findField(dhikrItem.fields as Array<{ name: string }>, name);
    assert(
      (field as { initialValue?: unknown }).initialValue === undefined,
      `${name} must not have a pre-populated initialValue in this prototype phase`,
    );
  }
  console.log("✓ no religious-content field is pre-populated");
}

/* ── dhikrCategory has no publication workflow ──────────────────── */

function testDhikrCategoryHasNoReviewStatus() {
  const hasReviewStatus = (dhikrCategory.fields as Array<{ name: string }>).some((f) => f.name === "reviewStatus");
  assert(!hasReviewStatus, "dhikrCategory must not have its own reviewStatus/publication workflow in this phase");
  console.log("✓ dhikrCategory has no separate publication workflow");
}

/* ── Placeholder register contains no prohibited fields ─────────── */

function testPlaceholderRegisterHasNoProhibitedFields() {
  const allowedKeys = new Set(["slotId", "proposedCategory", "reviewStatus", "internalNote"]);
  const prohibitedKeyPatterns = /arabic|translation|hadith|grading|grade|repetition|reward|virtue|source/i;

  for (const entry of DHIKR_V1_PLACEHOLDER_REGISTER) {
    for (const key of Object.keys(entry)) {
      assert(allowedKeys.has(key), `Placeholder register entry ${entry.slotId} has an unexpected key: ${key}`);
      assert(!prohibitedKeyPatterns.test(key), `Placeholder register entry ${entry.slotId} has a prohibited-looking key: ${key}`);
    }
  }

  const serialised = JSON.stringify(DHIKR_V1_PLACEHOLDER_REGISTER);
  assert(!/[؀-ۿ]/.test(serialised), "Placeholder register must contain no Arabic script");
  assert(DHIKR_V1_PLACEHOLDER_REGISTER.length === 12, "Placeholder register should mirror the 12 slots in docs/dhikr/18-v1-content-register.md");

  console.log("✓ placeholder register contains only allowed fields, no Arabic script, 12 slots");
}

function runAll() {
  testDhikrItemRegisteredInSchemaTypes();
  testReviewStatusAllowedValuesExact();
  testReviewStatusDefaultIsSourced();
  testAudioAssetReferencesExistingType();
  testSourceReferencesReusesExistingObject();
  testBoardApprovalsReusesExistingObject();
  testNoContentFieldsPrepopulated();
  testDhikrCategoryHasNoReviewStatus();
  testPlaceholderRegisterHasNoProhibitedFields();
  console.log("\nAll Dhikr schema-shape tests passed.");
}

runAll();
