/**
 * Explicit editorial setup utility — seed Duʿā & Dhikr homepage highlights.
 *
 * NEVER run automatically during install, build, or deploy.
 * NEVER import from runtime application code.
 *
 * Dry-run (no writes):
 *   npx tsx --env-file=.env.local scripts/seed-homepage-highlights.ts --dry-run
 *
 * Apply (requires explicit dataset confirmation):
 *   CONFIRM_SANITY_DATASET=production \
 *   npx tsx --env-file=.env.local scripts/seed-homepage-highlights.ts
 *
 * Overwrite existing documents (otherwise skips when present):
 *   CONFIRM_SANITY_DATASET=production \
 *   npx tsx --env-file=.env.local scripts/seed-homepage-highlights.ts --force
 */

import { createClient } from "next-sanity";
import {
  getHomepageHighlightSeedPayload,
  type SeedLocale,
} from "./homepage-highlight-seed-data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token =
  process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const confirmedDataset = process.env.CONFIRM_SANITY_DATASET;

if (!projectId || !token) {
  console.error(
    "Missing Sanity credentials. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.",
  );
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

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const LOCALES: SeedLocale[] = ["en", "da"];

async function upsertLocale(locale: SeedLocale) {
  const payload = getHomepageHighlightSeedPayload(locale);
  const existing = await client.fetch<{
    _id: string;
    image?: { asset?: { _ref?: string } } | null;
  } | null>(`*[_id == $id][0]{ _id, image }`, { id: payload.id });

  if (existing && !force) {
    console.log(`↷ skipped ${payload.id} (exists; pass --force to overwrite)`);
    return { id: payload.id, action: "skipped" as const };
  }

  // Copy fields only — never include `image`. Existing editorial photography
  // must survive --force; photography is attached separately in Studio (or a
  // deliberate one-off CMS operation), never via this seed.
  const fields = {
    language: payload.language,
    internalName: payload.internalName,
    enabled: payload.enabled,
    eyebrow: payload.eyebrow,
    title: payload.title,
    summary: payload.summary,
    imageAlt: payload.imageAlt,
    contentArea: payload.contentArea,
    contentAreaLabel: payload.contentAreaLabel,
    destinationType: payload.destinationType,
    pathname: payload.pathname,
    ctaLabel: payload.ctaLabel,
    publishedAt: payload.publishedAt,
    pinned: payload.pinned,
    priority: payload.priority,
    showNewMarker: payload.showNewMarker,
    visualTheme: payload.visualTheme,
  };

  if (dryRun) {
    const preserved = existing?.image?.asset?._ref
      ? "; would preserve existing image"
      : "";
    console.log(
      `○ dry-run ${payload.id} (${locale}) ${existing ? "would patch copy" : "would create"}${preserved}`,
    );
    return {
      id: payload.id,
      action: existing
        ? ("would-overwrite" as const)
        : ("would-create" as const),
    };
  }

  if (existing) {
    await client.patch(payload.id).set(fields).commit();
    console.log(
      `✓ patched ${payload.id} (${locale}) — image field left untouched`,
    );
    return { id: payload.id, action: "overwrote" as const };
  }

  await client.createOrReplace({
    _id: payload.id,
    _type: "homepageHighlight",
    ...fields,
  });
  console.log(`✓ created ${payload.id} (${locale})`);
  return { id: payload.id, action: "created" as const };
}

async function linkTranslations() {
  const metadataId = "translation.metadata.homepageHighlight-dua-dhikr";
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_id == $id][0]{ _id }`,
    { id: metadataId },
  );

  if (existing && !force && !dryRun) {
    console.log(`↷ skipped ${metadataId} (exists; pass --force to overwrite)`);
    return;
  }

  const doc = {
    _id: metadataId,
    _type: "translation.metadata",
    schemaTypes: ["homepageHighlight"],
    translations: [
      {
        _key: "en",
        _type: "internationalizedArrayReferenceValue",
        value: {
          _type: "reference",
          _ref: "homepageHighlight-dua-dhikr",
          _weak: true,
        },
      },
      {
        _key: "da",
        _type: "internationalizedArrayReferenceValue",
        value: {
          _type: "reference",
          _ref: "homepageHighlight-dua-dhikr-da",
          _weak: true,
        },
      },
    ],
  };

  if (dryRun) {
    console.log(
      `○ dry-run ${metadataId} ${existing ? "would overwrite" : "would create"}`,
    );
    return;
  }

  await client.createOrReplace(doc);
  console.log(`✓ linked ${metadataId}`);
}

async function main() {
  console.log(
    JSON.stringify(
      {
        mode: dryRun ? "dry-run" : "write",
        projectId,
        dataset,
        force,
      },
      null,
      2,
    ),
  );

  for (const locale of LOCALES) {
    await upsertLocale(locale);
  }
  await linkTranslations();
  console.log(
    dryRun
      ? "Dry-run complete — no writes performed."
      : "Homepage highlight seed complete.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
