/**
 * Dhikr Slug Field Tests — Stage 2 (public data layer).
 *
 * Covers the slug-field conditions from the Stage 2 approval:
 *   - dhikrItem and dhikrCategory each have an optional `slug` field
 *     following the repository's existing `type: "slug"` convention
 *     (see src/sanity/schemas/documents/knowledge/article.ts and similar);
 *   - slug is never unconditionally required while the prototype has no
 *     real content — dhikrItem's slug is required only once reviewStatus
 *     reaches "published" (mirrors arabicText/translationEn/translationDa);
 *     dhikrCategory's slug is never required (the type has no reviewStatus
 *     at all);
 *   - a duplicate slug cannot silently create an ambiguous public URL
 *     (isUniqueDhikrSlug, wired via options.isUnique);
 *   - none of this touches src/sanity/lib/dhikr-publication-gate.ts.
 *
 * Static/mechanism checks (schema field wiring, mock Rule/getClient) are
 * explicitly labelled "[static check]" — no live Sanity dataset exists.
 */

import { dhikrItem } from "../../src/sanity/schemas/documents/dhikr/dhikr-item";
import { dhikrCategory } from "../../src/sanity/schemas/documents/dhikr/dhikr-category";
import { isUniqueDhikrSlug } from "../../src/sanity/validation/governance";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

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
  return field as {
    name: string;
    type: string;
    validation?: (rule: unknown) => unknown;
    options?: { source?: string; maxLength?: number; isUnique?: unknown };
  };
}

/* ── Field exists, follows the repo's slug convention ────────────────── */

function testDhikrItemHasSlugFieldFollowingConvention() {
  const field = findField(dhikrItem.fields as Array<{ name: string }>, "slug");
  assert(field.type === "slug", "dhikrItem.slug must be type \"slug\"");
  assert(field.options?.source === "titleEn", "dhikrItem.slug must source from titleEn");
  assert(field.options?.maxLength === 96, "dhikrItem.slug must cap maxLength at 96, matching article.ts/author.ts convention");
  console.log("✓ dhikrItem.slug exists and follows the repository's existing slug-field shape (type, source, maxLength)");
}

function testDhikrCategoryHasSlugFieldFollowingConvention() {
  const field = findField(dhikrCategory.fields as Array<{ name: string }>, "slug");
  assert(field.type === "slug", "dhikrCategory.slug must be type \"slug\"");
  assert(field.options?.source === "nameEn", "dhikrCategory.slug must source from nameEn");
  assert(field.options?.maxLength === 96, "dhikrCategory.slug must cap maxLength at 96");
  console.log("✓ dhikrCategory.slug exists and follows the repository's existing slug-field shape");
}

/* ── Not unconditionally required ─────────────────────────────────────── */

function testDhikrItemSlugNotRequiredPrePublish() {
  const field = findField(dhikrItem.fields as Array<{ name: string }>, "slug");
  const { rule, calls } = createMockRule();
  field.validation!(rule);

  assert(
    !calls.some((c) => c.method === "required"),
    "dhikrItem.slug must NOT call .required() directly — it must not be unconditionally required while the prototype has no real content",
  );
  const customCall = calls.find((c) => c.method === "custom");
  assert(!!customCall, "dhikrItem.slug must gate its requirement via .custom(...), mirroring arabicText/translationEn/translationDa");

  const validator = customCall!.args[0] as (value: unknown, context: { document?: Record<string, unknown> }) => true | string;
  assert(
    validator(undefined, { document: { reviewStatus: "sourced" } }) === true,
    "dhikrItem.slug must NOT be required while reviewStatus is not \"published\"",
  );
  assert(
    validator(undefined, { document: { reviewStatus: "published" } }) !== true,
    "dhikrItem.slug MUST be required once reviewStatus is \"published\"",
  );
  console.log("✓ dhikrItem.slug is optional pre-publish and required only once reviewStatus is \"published\"");
}

function testDhikrCategorySlugNeverRequired() {
  const field = findField(dhikrCategory.fields as Array<{ name: string }>, "slug");
  assert(
    field.validation === undefined,
    "dhikrCategory.slug must carry no validation rule at all — dhikrCategory has no reviewStatus/publish gate to condition on, and it must never be unconditionally required",
  );
  console.log("✓ dhikrCategory.slug carries no required-ness — categories have no publish gate of their own");
}

/* ── Duplicate slugs cannot silently collide ─────────────────────────── */

function testBothSlugFieldsWireIsUniqueDhikrSlug() {
  const itemField = findField(dhikrItem.fields as Array<{ name: string }>, "slug");
  const categoryField = findField(dhikrCategory.fields as Array<{ name: string }>, "slug");
  assert(itemField.options?.isUnique === isUniqueDhikrSlug, "dhikrItem.slug must wire options.isUnique to isUniqueDhikrSlug");
  assert(categoryField.options?.isUnique === isUniqueDhikrSlug, "dhikrCategory.slug must wire options.isUnique to isUniqueDhikrSlug");
  console.log("✓ both slug fields wire the shared isUniqueDhikrSlug check — a duplicate slug cannot be saved");
}

async function testIsUniqueDhikrSlugQueriesExcludingSelf() {
  let capturedQuery = "";
  let capturedParams: Record<string, unknown> = {};
  const fakeClient = {
    fetch: async (query: string, params: Record<string, unknown>) => {
      capturedQuery = query;
      capturedParams = params;
      return true; // "is unique" (no other document found)
    },
  };
  const result = await isUniqueDhikrSlug("morning-remembrance", {
    document: { _id: "abc123", _type: "dhikrItem" },
    getClient: () => fakeClient,
  });

  assert(result === true, "isUniqueDhikrSlug must return true when the query reports no conflicting document");
  assert(capturedQuery.includes('_type == $type'), "isUniqueDhikrSlug's query must scope the uniqueness check to the same _type");
  assert(capturedQuery.includes("slug.current == $slug"), "isUniqueDhikrSlug's query must compare against slug.current");
  assert(
    capturedParams.draft === "drafts.abc123" && capturedParams.published === "abc123",
    "isUniqueDhikrSlug must exclude both the draft and published id of the document being edited from the comparison",
  );
  assert(capturedParams.type === "dhikrItem", "isUniqueDhikrSlug must pass the document's own _type as the scoping param");
  console.log("✓ isUniqueDhikrSlug queries for a conflicting document, scoped by _type, excluding the document's own draft/published id");
}

async function testIsUniqueDhikrSlugRejectsDuplicate() {
  const fakeClient = { fetch: async () => false }; // "not unique" (a conflicting document exists)
  const result = await isUniqueDhikrSlug("morning-remembrance", {
    document: { _id: "abc123", _type: "dhikrItem" },
    getClient: () => fakeClient,
  });
  assert(result === false, "isUniqueDhikrSlug must return false when another document already has this slug");
  console.log("✓ isUniqueDhikrSlug rejects a slug already used by another document of the same type");
}

/* ── The canonical publication gate file is untouched by this work ──── */

function testPublicationGateFileDoesNotMentionSlug() {
  const gateSource = readFileSync(
    join(__dirname, "../../src/sanity/lib/dhikr-publication-gate.ts"),
    "utf-8",
  );
  assert(
    !/\bslug\b/i.test(gateSource),
    "[static check] dhikr-publication-gate.ts must not reference slug at all — the canonical eligibility rule is unchanged by the slug-field addition",
  );
  console.log("✓ [static check] dhikr-publication-gate.ts contains no reference to slug — the canonical gate is unmodified");
}

async function runAll() {
  testDhikrItemHasSlugFieldFollowingConvention();
  testDhikrCategoryHasSlugFieldFollowingConvention();
  testDhikrItemSlugNotRequiredPrePublish();
  testDhikrCategorySlugNeverRequired();
  testBothSlugFieldsWireIsUniqueDhikrSlug();
  await testIsUniqueDhikrSlugQueriesExcludingSelf();
  await testIsUniqueDhikrSlugRejectsDuplicate();
  testPublicationGateFileDoesNotMentionSlug();
  console.log("\nAll Dhikr slug-field tests passed.");
}

runAll();
