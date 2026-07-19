/**
 * One-purpose migration utility — copy the ENTIRE duaDhikrEntry +
 * duaDhikrCollection library from `production` (read-only) into a
 * review/staging dataset (write), verbatim, for the unified scholar-review
 * portal (docs/i-am-feeling/SPEC.md's staging workflow).
 *
 * NEVER run automatically during install, build, or deploy.
 * NEVER import from runtime application code.
 * Hard-refuses to write to "production" under any circumstance.
 *
 * Dry-run:  npx tsx --env-file=.env.local scripts/copy-full-dua-dhikr-library-to-staging.ts --dry-run
 * Apply:    npx tsx --env-file=.env.local scripts/copy-full-dua-dhikr-library-to-staging.ts --target=staging
 */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
const dryRun = process.argv.includes("--dry-run");
const targetArg = process.argv.find((a) => a.startsWith("--target="));
const targetDataset = targetArg ? targetArg.split("=")[1] : undefined;

if (!projectId || !token) {
  console.error("Missing Sanity credentials.");
  process.exit(1);
}
if (!dryRun) {
  if (!targetDataset) { console.error("Pass --target=<dataset>."); process.exit(1); }
  if (targetDataset === "production") { console.error("Refusing to write to production."); process.exit(1); }
}

const sourceClient = createClient({ projectId, dataset: "production", apiVersion: "2024-01-01", token, useCdn: false });
const targetClient = dryRun ? null : createClient({ projectId, dataset: targetDataset, apiVersion: "2024-01-01", token, useCdn: false });

async function main() {
  const entries = await sourceClient.fetch<Record<string, unknown>[]>(`*[_type == "duaDhikrEntry"]`);
  const collections = await sourceClient.fetch<Record<string, unknown>[]>(`*[_type == "duaDhikrCollection"]`);
  const audioAssetIds = Array.from(
    new Set(entries.map((e) => (e.audioAsset as { _ref?: string } | undefined)?._ref).filter((id): id is string => !!id)),
  );
  const audioAssets = audioAssetIds.length
    ? await sourceClient.fetch<Record<string, unknown>[]>(`*[_id in $ids]`, { ids: audioAssetIds })
    : [];

  console.log(JSON.stringify({ mode: dryRun ? "dry-run" : "write", entries: entries.length, collections: collections.length, audioAssets: audioAssets.length, target: targetDataset }, null, 2));

  const allDocs = [...collections, ...entries, ...audioAssets];
  if (dryRun) {
    console.log(`Would copy ${allDocs.length} documents.`);
    return;
  }
  let done = 0;
  for (const doc of allDocs) {
    await targetClient!.createOrReplace(doc as { _id: string; _type: string });
    done++;
    if (done % 50 === 0) console.log(`... ${done}/${allDocs.length}`);
  }
  console.log(`Copy complete — ${allDocs.length} documents now present in "${targetDataset}".`);
}

main().catch((error) => { console.error(error); process.exit(1); });
