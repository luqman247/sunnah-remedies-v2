/**
 * One-purpose migration utility — copy the specific duaDhikrEntry documents
 * (and their referenced duaDhikrCollection documents) that
 * scripts/i-am-feeling-content-seed-data.ts references, from `production`
 * (read-only) into a review/staging dataset (write).
 *
 * This exists solely so the `staging` dataset can host real, working
 * feelingState documents whose featuredEntries references actually
 * resolve, without ever writing to `production`. It copies documents
 * VERBATIM (same _id, same fields) — no religious content is altered,
 * summarised, or regenerated.
 *
 * NEVER run automatically during install, build, or deploy.
 * NEVER import from runtime application code.
 * Hard-refuses to write to "production" under any circumstance, regardless
 * of flags — this script has exactly one legitimate target.
 *
 * Dry-run (no writes):
 *   npx tsx --env-file=.env.local scripts/copy-dua-dhikr-entries-to-staging.ts --dry-run
 *
 * Apply:
 *   npx tsx --env-file=.env.local scripts/copy-dua-dhikr-entries-to-staging.ts --target=staging
 */

import { createClient } from "next-sanity";
import { FEELING_STATE_SEEDS } from "./i-am-feeling-content-seed-data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
const dryRun = process.argv.includes("--dry-run");
const targetArg = process.argv.find((a) => a.startsWith("--target="));
const targetDataset = targetArg ? targetArg.split("=")[1] : undefined;

if (!projectId || !token) {
  console.error("Missing Sanity credentials. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.");
  process.exit(1);
}

if (!dryRun) {
  if (!targetDataset) {
    console.error("Refusing to write: pass --target=<dataset> explicitly.");
    process.exit(1);
  }
  if (targetDataset === "production") {
    console.error("Refusing to write to \"production\" — this script has exactly one legitimate purpose: populating a review/staging dataset.");
    process.exit(1);
  }
}

const sourceClient = createClient({ projectId, dataset: "production", apiVersion: "2024-01-01", token, useCdn: false });
const targetClient = dryRun
  ? null
  : createClient({ projectId, dataset: targetDataset, apiVersion: "2024-01-01", token, useCdn: false });

const entryIds = Array.from(
  new Set(FEELING_STATE_SEEDS.flatMap((s) => s.featuredEntryIds.map((e) => e.entryId))),
);

async function main() {
  console.log(JSON.stringify({ mode: dryRun ? "dry-run" : "write", from: "production", to: targetDataset, entryCount: entryIds.length }, null, 2));

  const entries = await sourceClient.fetch<Record<string, unknown>[]>(`*[_id in $ids]`, { ids: entryIds });
  console.log(`Fetched ${entries.length} of ${entryIds.length} requested entries from production.`);
  const missing = entryIds.filter((id) => !entries.some((e) => e._id === id));
  if (missing.length > 0) console.warn("Missing from production (unexpected):", missing);

  const collectionIds = Array.from(
    new Set(
      entries.flatMap((e) => {
        const refs = (e.collections as { _ref?: string }[] | undefined) ?? [];
        return refs.map((r) => r._ref).filter((id): id is string => !!id);
      }),
    ),
  );
  const collections = collectionIds.length
    ? await sourceClient.fetch<Record<string, unknown>[]>(`*[_id in $ids]`, { ids: collectionIds })
    : [];
  console.log(`Fetched ${collections.length} of ${collectionIds.length} referenced collections from production.`);

  const audioAssetIds = Array.from(
    new Set(
      entries
        .map((e) => (e.audioAsset as { _ref?: string } | undefined)?._ref)
        .filter((id): id is string => !!id),
    ),
  );
  const audioAssets = audioAssetIds.length
    ? await sourceClient.fetch<Record<string, unknown>[]>(`*[_id in $ids]`, { ids: audioAssetIds })
    : [];
  if (audioAssets.length) console.log(`Fetched ${audioAssets.length} referenced audioAsset documents.`);

  const allDocs = [...collections, ...entries, ...audioAssets];

  if (dryRun) {
    for (const doc of allDocs) {
      console.log(`○ dry-run would createOrReplace ${doc._id} (${doc._type})`);
    }
    console.log(`\nDry-run complete — no writes performed. Would copy ${allDocs.length} documents to "${targetDataset ?? "(no target given)"}".`);
    return;
  }

  for (const doc of allDocs) {
    await targetClient!.createOrReplace(doc as { _id: string; _type: string });
    console.log(`✓ copied ${doc._id} (${doc._type}) → ${targetDataset}`);
  }
  console.log(`\nCopy complete — ${allDocs.length} documents now present in "${targetDataset}".`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
