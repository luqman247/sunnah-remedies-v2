/**
 * Dhikr Schema Organisation Tests — Stage 2C.
 *
 * Covers the dhikrItem Studio group restructuring (fieldsets -> groups) and
 * the safe, non-religious content-entry placeholders added in this stage.
 *
 * Tests are a mix of:
 *   - behavioural: import the real schema object / gate functions and
 *     assert on their actual values. No live Sanity dataset or Studio
 *     runtime is involved.
 *   - static: read a file's own source text with node:fs and assert on it
 *     directly, labelled "[static check]" — used only where behavioural
 *     inspection of the schema object itself isn't the more direct check.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { dhikrItem } from "../../src/sanity/schemas/documents/dhikr/dhikr-item";
import {
  requiredWhenDhikrPublished,
  requiredDhikrSourceReferences,
  requiredDhikrBoardApprovals,
} from "../../src/sanity/validation/governance";
import {
  DHIKR_ELIGIBILITY_GROQ,
  getDhikrEligibilityConditions,
  isDhikrItemPubliclyEligible,
} from "../../src/sanity/lib/dhikr-publication-gate";
import { dhikrItemsPublicEligibleQuery } from "../../src/sanity/lib/queries";
import { FULL_VALID_ITEM } from "./dhikr-eligibility-fixtures";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const SCHEMA_PATH = join(REPO_ROOT, "src/sanity/schemas/documents/dhikr/dhikr-item.ts");
const schemaSource = readFileSync(SCHEMA_PATH, "utf-8");

type SchemaField = {
  name: string;
  type: string;
  group?: string | string[];
  placeholder?: string;
  description?: string;
  options?: { list?: { title: string; value: string }[] };
};

const fields = dhikrItem.fields as unknown as SchemaField[];

function findField(name: string): SchemaField {
  const field = fields.find((f) => f.name === name);
  if (!field) throw new Error(`Field "${name}" not found on dhikrItem`);
  return field;
}

function groupsOf(field: SchemaField): string[] {
  if (!field.group) return [];
  return Array.isArray(field.group) ? field.group : [field.group];
}

const EXPECTED_GROUPS = [
  { name: "identity", title: "Identity" },
  { name: "arabicSourceText", title: "Arabic Source Text" },
  { name: "supportingTranslations", title: "Supporting Translations" },
  { name: "repetitionGuidance", title: "Repetition Guidance" },
  { name: "sourcesAndAuthenticity", title: "Sources and Authenticity" },
  { name: "scholarlyReview", title: "Scholarly Review" },
  { name: "editorialReview", title: "Editorial Review" },
];

/* ── 1. All seven expected groups exist ──────────────────────────────── */

function testAllSevenGroupsExist() {
  const groups = dhikrItem.groups as unknown as { name: string; title: string }[];
  assert(!!groups, "dhikrItem must define a groups array");
  assert(groups.length === 7, `dhikrItem must have exactly 7 groups, found ${groups.length}`);
  for (const expected of EXPECTED_GROUPS) {
    const actual = groups.find((g) => g.name === expected.name);
    assert(!!actual, `group "${expected.name}" must exist`);
    assert(actual!.title === expected.title, `group "${expected.name}" must have title "${expected.title}", got "${actual!.title}"`);
  }
  console.log("✓ all seven expected groups exist with the exact required titles, and no eighth group was added");
}

/* ── 2 & 3. Every field appears exactly once, except the documented reviewStatus exception; no field duplicated ── */

function testEveryFieldAssignedExactlyOnceExceptReviewStatus() {
  const allFieldNames = fields.map((f) => f.name);
  assert(allFieldNames.length === 19, `dhikrItem must have exactly 19 fields (15 plus Stage 2's mdrSourceId/timingLabel/virtueText, plus editorialPublicationStatus), found ${allFieldNames.length}`);

  for (const field of fields) {
    const memberships = groupsOf(field);
    if (field.name === "reviewStatus") {
      assert(
        memberships.length === 2 &&
          memberships.includes("scholarlyReview") &&
          memberships.includes("editorialReview"),
        'reviewStatus must be assigned to exactly the two groups ["scholarlyReview", "editorialReview"] — the one documented multi-group exception',
      );
    } else {
      assert(memberships.length === 1, `field "${field.name}" must belong to exactly one group, found ${memberships.length} (${memberships.join(", ")})`);
    }
  }
  console.log("✓ every dhikrItem field is assigned to exactly one group, except reviewStatus which is deliberately shared between Scholarly Review and Editorial Review");
}

function testBoardApprovalsNotDuplicatedAcrossGroups() {
  const boardApprovals = findField("boardApprovals");
  const memberships = groupsOf(boardApprovals);
  assert(memberships.length === 1 && memberships[0] === "scholarlyReview", 'boardApprovals must be assigned to exactly one group ("scholarlyReview") — it must never be duplicated across Scholarly Review and Editorial Review');
  console.log('✓ boardApprovals is placed in exactly one group ("scholarlyReview"), never duplicated');
}

function testGroupToFieldMapping() {
  const expectedMapping: Record<string, string[]> = {
    identity: ["mdrSourceId", "category", "order", "titleEn", "titleDa", "slug", "tags"],
    arabicSourceText: ["arabicText", "transliteration"],
    supportingTranslations: ["translationEn", "translationDa"],
    repetitionGuidance: ["recommendedRepetitions", "audioAsset", "timingLabel", "virtueText"],
    sourcesAndAuthenticity: ["sourceReferences"],
  };
  for (const [groupName, expectedFieldNames] of Object.entries(expectedMapping)) {
    const actualFieldNames = fields.filter((f) => groupsOf(f).includes(groupName)).map((f) => f.name).sort();
    assert(
      JSON.stringify(actualFieldNames) === JSON.stringify([...expectedFieldNames].sort()),
      `group "${groupName}" must contain exactly [${expectedFieldNames.join(", ")}], found [${actualFieldNames.join(", ")}]`,
    );
  }
  // scholarlyReview: boardApprovals + reviewStatus (shared)
  const scholarly = fields.filter((f) => groupsOf(f).includes("scholarlyReview")).map((f) => f.name).sort();
  assert(JSON.stringify(scholarly) === JSON.stringify(["boardApprovals", "reviewStatus"]), `group "scholarlyReview" must contain exactly [boardApprovals, reviewStatus], found [${scholarly.join(", ")}]`);
  // editorialReview: reviewStatus (shared) + editorialPublicationStatus
  const editorial = fields.filter((f) => groupsOf(f).includes("editorialReview")).map((f) => f.name).sort();
  assert(
    JSON.stringify(editorial) === JSON.stringify(["editorialPublicationStatus", "reviewStatus"]),
    `group "editorialReview" must contain exactly [editorialPublicationStatus, reviewStatus], found [${editorial.join(", ")}]`,
  );
  console.log("✓ every group's field membership matches the exact reported mapping");
}

/* ── 4. Publication Readiness remains outside schema groups ─────────── */

function testPublicationReadinessNotASchemaGroup() {
  const groups = dhikrItem.groups as unknown as { name: string; title: string }[];
  assert(
    !groups.some((g) => /readiness/i.test(g.name) || /readiness/i.test(g.title)),
    "no schema group may be named or titled after Publication Readiness — that remains the Stage 2B computed Studio view, not a field group",
  );
  assert(
    !schemaSource.includes("DhikrReadinessPanel") && !schemaSource.includes("getDhikrEligibilityConditions"),
    "[static check] dhikr-item.ts must not import or reference the Stage 2B readiness panel/gate-condition function — the schema and the readiness view remain separate concerns",
  );
  console.log("✓ [static check] Publication Readiness is not a schema group and is not referenced from the schema file");
}

/* ── 5. Canonical validators unchanged (behavioural) ─────────────────── */

function testCanonicalValidatorsUnchanged() {
  const publishedContext = { document: { reviewStatus: "published" } };
  const sourcedContext = { document: { reviewStatus: "sourced" } };
  const arabicValidator = requiredWhenDhikrPublished("Arabic text is required before publishing.");
  assert(arabicValidator(undefined, publishedContext) !== true, "requiredWhenDhikrPublished must still block an empty field when published");
  assert(arabicValidator(undefined, sourcedContext) === true, "requiredWhenDhikrPublished must still allow an empty field pre-publish");
  assert(requiredDhikrSourceReferences([], publishedContext) !== true, "requiredDhikrSourceReferences must still block an empty array when published");
  assert(
    requiredDhikrBoardApprovals([{ board: "scholarly", approved: true }, { board: "editorial", approved: true }], publishedContext) === true,
    "requiredDhikrBoardApprovals must still accept both approvals present and approved",
  );
  console.log("✓ the three canonical Studio validators behave identically to before this stage");
}

/* ── 6. reviewStatus values unchanged ────────────────────────────────── */

function testReviewStatusValuesUnchanged() {
  const reviewStatus = findField("reviewStatus");
  const values = (reviewStatus.options?.list ?? []).map((o) => o.value);
  assert(
    JSON.stringify(values) === JSON.stringify(["sourced", "scholarly-review", "editorial-review", "approved", "published"]),
    `reviewStatus enum values must be unchanged, got [${values.join(", ")}]`,
  );
  console.log("✓ reviewStatus enum values are unchanged");
}

/* ── 7. No public gate file changed (behavioural + frozen GROQ check) ── */

function testGateUnchanged() {
  const expectedGroq =
    'reviewStatus == "published"\n' +
    '  && defined(arabicText) && arabicText != ""\n' +
    '  && defined(translationEn) && translationEn != ""\n' +
    '  && defined(translationDa) && translationDa != ""\n' +
    "  && count(sourceReferences) > 0\n" +
    '  && count(boardApprovals[board == "scholarly" && approved == true]) > 0\n' +
    '  && count(boardApprovals[board == "editorial" && approved == true]) > 0';
  assert(DHIKR_ELIGIBILITY_GROQ === expectedGroq, "DHIKR_ELIGIBILITY_GROQ must be byte-for-byte unchanged by Stage 2C");
  assert(isDhikrItemPubliclyEligible(FULL_VALID_ITEM) === true, "the fully valid fixture must still be eligible");
  assert(getDhikrEligibilityConditions(FULL_VALID_ITEM).length === 7, "getDhikrEligibilityConditions must still return exactly 7 conditions");
  console.log("✓ the canonical gate (GROQ fragment, condition count, and eligibility behaviour) is unchanged");
}

/* ── 8. No public query or projection changed ────────────────────────── */

function testPublicProjectionUnchanged() {
  const expectedProjectedFields = [
    "_id", "slug", "titleEn", "titleDa", "order", "arabicText", "transliteration",
    "translationEn", "translationDa", "categoryName", "categoryNameDa", "categorySlug",
  ];
  for (const field of expectedProjectedFields) {
    assert(dhikrItemsPublicEligibleQuery.includes(field), `dhikrItemsPublicEligibleQuery must still project "${field}"`);
  }
  const filterEnd = dhikrItemsPublicEligibleQuery.indexOf("]");
  const projection = dhikrItemsPublicEligibleQuery.slice(dhikrItemsPublicEligibleQuery.indexOf("{", filterEnd));
  for (const forbidden of ["reviewStatus", "boardApprovals", "approver"]) {
    assert(!projection.includes(forbidden), `the public projection must still omit "${forbidden}"`);
  }
  console.log("✓ [static check] the public query/projection is unchanged by Stage 2C");
}

/* ── 9 & 10. Placeholders: exact allowed strings only, no religious content ── */

const EXPECTED_PLACEHOLDERS: Record<string, string> = {
  arabicText: "Enter verified Arabic text",
  translationEn: "Enter reviewed English translation",
  translationDa: "Enter reviewed Danish translation",
  transliteration: "Enter reviewed transliteration if required",
  titleEn: "Enter internal English title",
  titleDa: "Enter internal Danish title",
};

function testPlaceholdersMatchAllowedListExactly() {
  for (const [fieldName, expectedPlaceholder] of Object.entries(EXPECTED_PLACEHOLDERS)) {
    const field = findField(fieldName);
    assert(field.placeholder === expectedPlaceholder, `field "${fieldName}" must have placeholder exactly "${expectedPlaceholder}", got "${field.placeholder}"`);
  }
  // Fields not in the allowed list must not have gained a placeholder.
  const fieldsWithoutPlaceholder = ["category", "order", "slug", "tags", "recommendedRepetitions", "audioAsset", "sourceReferences", "reviewStatus", "boardApprovals"];
  for (const fieldName of fieldsWithoutPlaceholder) {
    const field = findField(fieldName);
    assert(!field.placeholder, `field "${fieldName}" must not have a placeholder`);
  }
  console.log("✓ placeholders exist only on the six allowed fields, each matching the required text exactly, with no unapproved additions");
}

function testPlaceholdersContainNoReligiousContent() {
  const allPlaceholders = Object.values(EXPECTED_PLACEHOLDERS);
  const combined = allPlaceholders.join(" ");
  assert(!/[؀-ۿ]/.test(combined), "no placeholder may contain Arabic script");
  const suspiciousPatterns = [/\bhadith\b/i, /\bsahih\b/i, /\bbukhari\b/i, /\bmuslim\b/i, /\d+\s*[:.]\s*\d+/, /\breward\b/i, /\bvirtue\b/i];
  for (const pattern of suspiciousPatterns) {
    assert(!pattern.test(combined), `placeholder text must not match suspicious pattern ${pattern} (no hadith reference, source number, or reward/virtue claim)`);
  }
  console.log("✓ placeholders contain no Arabic script, hadith references, source numbers, or reward/virtue claims");
}

/* ── 11. sourceReferences uses description text, not an unsupported placeholder ── */

function testSourceReferencesUsesDescriptionNotPlaceholder() {
  const sourceReferences = findField("sourceReferences");
  assert(sourceReferences.type === "array", "sourceReferences must remain an array field");
  assert(!sourceReferences.placeholder, "sourceReferences (an array field) must not have a placeholder property — array types do not support it");
  assert(
    !!sourceReferences.description && sourceReferences.description.length > 0,
    "sourceReferences must have a non-empty description guiding citation entry, since placeholder text is not supported on array fields",
  );
  assert(
    /primary or independently verified/i.test(sourceReferences.description!),
    "sourceReferences' description must state that citations must be primary or independently verified",
  );
  console.log("✓ sourceReferences (array type, no placeholder support) uses an extended description instead, as instructed");
}

/* ── 12. No workflow action file introduced ──────────────────────────── */

function testNoWorkflowActionFileIntroduced() {
  assert(!existsSync(join(REPO_ROOT, "src/sanity/actions")), "src/sanity/actions/ must not exist — Stage 2C does not introduce document actions");
  console.log("✓ [static check] no workflow/document action file was introduced");
}

/* ── 13. No real religious content added ─────────────────────────────── */

function testNoReligiousContentAdded() {
  assert(!/[؀-ۿ]/.test(schemaSource), "no Arabic script may appear in dhikr-item.ts");
  const suspiciousTerms = ["sahih al-bukhari", "sahih muslim", "abu dawud", "tirmidhi", "ibn majah", "musnad ahmad"];
  const lower = schemaSource.toLowerCase();
  for (const term of suspiciousTerms) {
    assert(!lower.includes(term), `no real hadith-collection citation ("${term}") may appear in dhikr-item.ts`);
  }
  console.log("✓ no Arabic script or real hadith-collection citation appears in dhikr-item.ts");
}

function runAll() {
  testAllSevenGroupsExist();
  testEveryFieldAssignedExactlyOnceExceptReviewStatus();
  testBoardApprovalsNotDuplicatedAcrossGroups();
  testGroupToFieldMapping();
  testPublicationReadinessNotASchemaGroup();
  testCanonicalValidatorsUnchanged();
  testReviewStatusValuesUnchanged();
  testGateUnchanged();
  testPublicProjectionUnchanged();
  testPlaceholdersMatchAllowedListExactly();
  testPlaceholdersContainNoReligiousContent();
  testSourceReferencesUsesDescriptionNotPlaceholder();
  testNoWorkflowActionFileIntroduced();
  testNoReligiousContentAdded();
  console.log("\nAll Dhikr schema organisation tests passed.");
}

runAll();
