/**
 * Migrate static remedy monographs into Sanity product documents.
 *
 * Idempotent: skips documents that already exist for the same slug + language.
 * Creates English products as drafts (status=draft, visibleInApothecary=false)
 * so editors must review and publish deliberately.
 *
 * Usage:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=… \
 *   NEXT_PUBLIC_SANITY_DATASET=production \
 *   SANITY_API_TOKEN=… \
 *   npx tsx scripts/migrate-static-remedies.ts
 *
 * Dry run:
 *   DRY_RUN=1 npx tsx scripts/migrate-static-remedies.ts
 */

import { createClient } from "next-sanity";
import { remedies } from "../src/lib/content/remedies";
import type { Remedy } from "../src/lib/content/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";

if (!projectId || !token) {
  console.error(
    "Missing Sanity credentials. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN.",
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

function productId(slug: string, language: string): string {
  return language === "en" ? `product-${slug}` : `product-${slug}-${language}`;
}

function remedyToSanityDoc(remedy: Remedy, language: "en" | "da") {
  return {
    _id: productId(remedy.slug, language),
    _type: "product",
    language,
    name: remedy.name,
    slug: { _type: "slug", current: remedy.slug },
    transliteration: remedy.transliteration,
    botanicalName: remedy.botanicalName,
    nature: remedy.nature,
    institutionalSummary: remedy.institutionalSummary,
    folio: remedy.folio,
    historicalContext: remedy.historicalContext,
    propheticReferences: remedy.propheticReferences.map((ref, i) => ({
      _key: `ref${i}`,
      ...ref,
    })),
    traditionalScholarship: remedy.traditionalScholarship,
    traditionalUsage: remedy.traditionalUsage,
    evidenceEstablished: remedy.evidence.established,
    evidenceEmerging: remedy.evidence.emerging,
    provenanceOrigin: remedy.provenance.origin,
    provenanceCultivation: remedy.provenance.cultivation,
    provenanceHarvesting: remedy.provenance.harvesting,
    laboratoryVerification: remedy.laboratoryVerification,
    qualityAssurance: remedy.qualityAssurance,
    suggestedUse: remedy.suggestedUse,
    preparation: remedy.preparation,
    storage: remedy.storage,
    contraindications: remedy.contraindications,
    volume: remedy.volume,
    price: remedy.price,
    priceNote: remedy.priceNote,
    inStock: remedy.inStock,
    currency: "GBP" as const,
    status: "draft" as const,
    visibleInApothecary: false,
    featured: false,
    purchaseFraming: "standard" as const,
    stockStatus: remedy.inStock ? ("in-stock" as const) : ("out-of-stock" as const),
    taxBehaviour: "inclusive" as const,
    allowBackorder: false,
    lowStockThreshold: 5,
    faq: remedy.faq.map((item, i) => ({
      _key: `faq${i}`,
      question: item.question,
      answer: item.answer,
    })),
    academyLessons: remedy.academyLessons.map((l, i) => ({
      _key: `ac${i}`,
      label: l.title,
      href: l.href,
    })),
    knowledgeLibrary: remedy.knowledgeLibrary.map((l, i) => ({
      _key: `kl${i}`,
      label: l.title,
      href: l.href,
    })),
    pathways: remedy.pathways.map((p, i) => ({
      _key: `pw${i}`,
      label: p.label,
      href: p.href,
    })),
  };
}

async function exists(id: string): Promise<boolean> {
  const doc = await client.fetch(`*[_id == $id][0]._id`, { id });
  return Boolean(doc);
}

async function main() {
  console.log(
    dryRun
      ? "Dry run — no writes"
      : `Migrating ${remedies.length} remedies → dataset ${dataset}`,
  );

  let created = 0;
  let skipped = 0;

  for (const remedy of remedies) {
    const id = productId(remedy.slug, "en");
    if (await exists(id)) {
      console.log(`skip  ${id} (already exists)`);
      skipped += 1;
      continue;
    }

    const doc = remedyToSanityDoc(remedy, "en");
    if (dryRun) {
      console.log(`would create ${id} — ${remedy.name}`);
      created += 1;
      continue;
    }

    await client.createOrReplace(doc);
    console.log(`create ${id} — ${remedy.name} (draft)`);
    created += 1;
  }

  console.log(`Done. created=${created} skipped=${skipped}`);
  console.log(
    "Next: open Studio → Apothecary → Draft products → review, set Active, Publish.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
