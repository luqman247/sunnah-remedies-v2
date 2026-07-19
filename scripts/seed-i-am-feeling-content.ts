/**
 * Explicit editorial setup utility — seed "I am feeling…" feelingFamily and
 * feelingState documents, plus the (disabled-by-default) homepage
 * highlight promotion.
 *
 * NEVER run automatically during install, build, or deploy.
 * NEVER import from runtime application code.
 *
 * Every feelingState document this script writes has reviewStatus
 * "sourced" — never "published" — regardless of how complete its copy is.
 * Nothing seeded here becomes publicly visible until a human editor
 * completes the real review workflow in Studio (see
 * docs/i-am-feeling/SPEC.md §6, §7, §24 and
 * docs/i-am-feeling/EDITORIAL_POPULATION_RECORD.md for exactly what still
 * needs human review).
 *
 * Dry-run (no writes):
 *   npx tsx --env-file=.env.local scripts/seed-i-am-feeling-content.ts --dry-run
 *
 * Apply (requires explicit dataset confirmation):
 *   CONFIRM_SANITY_DATASET=production \
 *   npx tsx --env-file=.env.local scripts/seed-i-am-feeling-content.ts
 *
 * Overwrite existing documents (otherwise skips when present):
 *   CONFIRM_SANITY_DATASET=production \
 *   npx tsx --env-file=.env.local scripts/seed-i-am-feeling-content.ts --force
 */

import { createClient } from "next-sanity";
import { FEELING_FAMILIES } from "../src/lib/feeling/taxonomy";
import { CANONICAL_FEELING_STATES } from "../src/lib/feeling/taxonomy";
import {
  FEELING_FAMILY_SEEDS,
  FEELING_STATE_SEEDS,
  getIAmFeelingHomepageHighlightSeedPayload,
  type SeedLocale,
} from "./i-am-feeling-content-seed-data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const confirmedDataset = process.env.CONFIRM_SANITY_DATASET;

if (!projectId || !token) {
  console.error("Missing Sanity credentials. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.");
  process.exit(1);
}

if (!dryRun && confirmedDataset !== dataset) {
  console.error(
    [
      "Refusing to write without explicit dataset confirmation.",
      `Expected: CONFIRM_SANITY_DATASET=${dataset}`,
      `Received: CONFIRM_SANITY_DATASET=${confirmedDataset ?? "(unset)"}`,
      "Re-run with --dry-run to inspect, or set CONFIRM_SANITY_DATASET to match NEXT_PUBLIC_SANITY_DATASET.",
    ].join("\n"),
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

function familyDocId(slug: string) {
  return `feelingFamily-${slug}`;
}
function stateDocId(slug: string) {
  return `feelingState-${slug}`;
}

async function upsertFamily(seed: (typeof FEELING_FAMILY_SEEDS)[number]) {
  const taxonomy = FEELING_FAMILIES.find((f) => f.key === seed.slug);
  if (!taxonomy) throw new Error(`No taxonomy entry for family ${seed.slug}`);

  const id = familyDocId(seed.slug);
  const doc = {
    _id: id,
    _type: "feelingFamily",
    internalTitle: taxonomy.titleEn,
    titleEn: taxonomy.titleEn,
    titleDa: taxonomy.titleDa,
    slug: { _type: "slug", current: seed.slug },
    order: seed.order,
  };

  const existing = await client.fetch<{ _id: string } | null>(`*[_id == $id][0]{ _id }`, { id });
  if (existing && !force) {
    console.log(`↷ skipped ${id} (exists; pass --force to overwrite)`);
    return;
  }
  if (dryRun) {
    console.log(`○ dry-run ${id} ${existing ? "would patch" : "would create"}`);
    return;
  }
  await client.createOrReplace(doc);
  console.log(`✓ ${existing ? "patched" : "created"} ${id}`);
}

async function upsertState(seed: (typeof FEELING_STATE_SEEDS)[number]) {
  const taxonomy = CANONICAL_FEELING_STATES.find((s) => s.slug === seed.slug);
  if (!taxonomy) throw new Error(`No taxonomy entry for feeling state ${seed.slug}`);

  const id = stateDocId(seed.slug);
  const doc = {
    _id: id,
    _type: "feelingState" as const,
    internalTitle: taxonomy.labelEn + (seed.editorNote ? ` — EDITOR NOTE: ${seed.editorNote}` : ""),
    labelEn: taxonomy.labelEn,
    labelDa: taxonomy.labelDa,
    slug: { _type: "slug", current: seed.slug },
    family: { _type: "reference", _ref: familyDocId(seed.family) },
    oneLineDescriptionEn: taxonomy.oneLineDescriptionEn,
    oneLineDescriptionDa: taxonomy.oneLineDescriptionDa,
    tone: taxonomy.tone,
    launchStatus: taxonomy.launchStatus,
    safeguardingLevel: taxonomy.safeguardingLevel,
    introductionEn: seed.introductionEn,
    introductionDa: seed.introductionDa,
    practicalNextStepEn: seed.practicalNextStepEn,
    practicalNextStepDa: seed.practicalNextStepDa,
    professionalSupportNoteEn: seed.professionalSupportNoteEn,
    professionalSupportNoteDa: seed.professionalSupportNoteDa,
    // Never higher than "sourced" from this script — see file-level doc comment.
    reviewStatus: "sourced",
    boardApprovals: [],
    featuredEntries: seed.featuredEntryIds.map((f, index) => ({
      _key: `${seed.slug}-featured-${index}`,
      _type: "featuredFeelingEntry",
      entry: { _type: "reference", _ref: f.entryId },
      reflectionEn: f.reflectionEn,
      reflectionDa: f.reflectionDa,
    })),
  };

  const existing = await client.fetch<{ _id: string } | null>(`*[_id == $id][0]{ _id }`, { id });
  if (existing && !force) {
    console.log(`↷ skipped ${id} (exists; pass --force to overwrite)`);
    return;
  }
  if (dryRun) {
    console.log(
      `○ dry-run ${id} ${existing ? "would patch" : "would create"} — ${seed.featuredEntryIds.length} featured entr${seed.featuredEntryIds.length === 1 ? "y" : "ies"}${seed.editorNote ? ` — NEEDS EDITOR: ${seed.editorNote}` : ""}`,
    );
    return;
  }
  await client.createOrReplace(doc);
  console.log(`✓ ${existing ? "patched" : "created"} ${id}`);
}

async function upsertHomepageHighlight(locale: SeedLocale) {
  const payload = getIAmFeelingHomepageHighlightSeedPayload(locale);
  const existing = await client.fetch<{ _id: string } | null>(`*[_id == $id][0]{ _id }`, { id: payload.id });
  if (existing && !force) {
    console.log(`↷ skipped ${payload.id} (exists; pass --force to overwrite)`);
    return;
  }
  const { id, ...fieldsWithoutId } = payload;

  if (dryRun) {
    console.log(`○ dry-run ${id} (${locale}) ${existing ? "would patch" : "would create"} — enabled: ${payload.enabled}`);
    return;
  }
  if (existing) {
    await client.patch(id).set(fieldsWithoutId).commit();
    console.log(`✓ patched ${id} (${locale})`);
    return;
  }
  await client.createOrReplace({ _id: id, _type: "homepageHighlight", ...fieldsWithoutId });
  console.log(`✓ created ${id} (${locale})`);
}

async function main() {
  console.log(JSON.stringify({ mode: dryRun ? "dry-run" : "write", projectId, dataset, force }, null, 2));

  for (const family of FEELING_FAMILY_SEEDS) await upsertFamily(family);
  for (const state of FEELING_STATE_SEEDS) await upsertState(state);
  for (const locale of ["en", "da"] as SeedLocale[]) await upsertHomepageHighlight(locale);

  console.log(dryRun ? "Dry-run complete — no writes performed." : "\"I am feeling…\" content seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
