/**
 * Broken Reference Audit — knowledge-graph integrity check.
 *
 * Reports:
 * - Dangling references (target no longer exists)
 * - Orphan entities (entities with no inbound links)
 * - Missing required fields on medical entities
 *
 * Usage: npx tsx scripts/broken-reference-audit.ts
 * Run in CI to fail on dangling references.
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

interface AuditResult {
  danglingReferences: { documentId: string; documentType: string; targetRef: string }[];
  orphanEntities: { id: string; type: string; title: string }[];
  medicalWithoutReviewer: { id: string; type: string; title: string }[];
}

async function audit(): Promise<AuditResult> {
  console.log("[audit] Starting knowledge-graph integrity audit...");

  const results: AuditResult = {
    danglingReferences: [],
    orphanEntities: [],
    medicalWithoutReviewer: [],
  };

  // 1. Find dangling references in relationship arrays
  const docsWithRelationships = await client.fetch<
    { _id: string; _type: string; relationships: { target: { _ref: string } }[] }[]
  >(`*[defined(relationships)] { _id, _type, relationships[] { target { _ref } } }`);

  const allIds = new Set(
    (await client.fetch<string[]>(`*[]._id`))
  );

  for (const doc of docsWithRelationships) {
    if (!doc.relationships) continue;
    for (const rel of doc.relationships) {
      if (rel.target?._ref && !allIds.has(rel.target._ref)) {
        results.danglingReferences.push({
          documentId: doc._id,
          documentType: doc._type,
          targetRef: rel.target._ref,
        });
      }
    }
  }

  // 2. Find orphan entities (no inbound references)
  const knowledgeEntities = await client.fetch<{ _id: string; _type: string; title: string }[]>(
    `*[_type in ["ingredient", "condition", "bodySystem", "hadith", "quranReferenceDoc", "researchPaper", "scholar"]] {
      _id, _type, "title": coalesce(title, name)
    }`
  );

  for (const entity of knowledgeEntities) {
    const refCount = await client.fetch<number>(
      `count(*[references($id)])`,
      { id: entity._id }
    );
    if (refCount === 0) {
      results.orphanEntities.push({
        id: entity._id,
        type: entity._type,
        title: entity.title,
      });
    }
  }

  // 3. Medical entities without reviewer
  const medicalDocs = await client.fetch<{ _id: string; _type: string; title: string }[]>(
    `*[_type in ["ingredient", "condition"] && !defined(reviewer)] {
      _id, _type, "title": coalesce(title, name)
    }`
  );

  results.medicalWithoutReviewer = medicalDocs.map((d) => ({
    id: d._id,
    type: d._type,
    title: d.title,
  }));

  return results;
}

async function main() {
  const results = await audit();

  console.log("\n═══ AUDIT RESULTS ═══\n");

  if (results.danglingReferences.length > 0) {
    console.log(`❌ DANGLING REFERENCES: ${results.danglingReferences.length}`);
    for (const ref of results.danglingReferences) {
      console.log(`   ${ref.documentType}/${ref.documentId} → missing: ${ref.targetRef}`);
    }
  } else {
    console.log("✓ No dangling references");
  }

  console.log("");

  if (results.orphanEntities.length > 0) {
    console.log(`⚠ ORPHAN ENTITIES: ${results.orphanEntities.length}`);
    for (const entity of results.orphanEntities.slice(0, 20)) {
      console.log(`   ${entity.type}: ${entity.title} (${entity.id})`);
    }
    if (results.orphanEntities.length > 20) {
      console.log(`   ... and ${results.orphanEntities.length - 20} more`);
    }
  } else {
    console.log("✓ No orphan entities");
  }

  console.log("");

  if (results.medicalWithoutReviewer.length > 0) {
    console.log(`⚠ MEDICAL ENTITIES WITHOUT REVIEWER: ${results.medicalWithoutReviewer.length}`);
    for (const doc of results.medicalWithoutReviewer.slice(0, 10)) {
      console.log(`   ${doc.type}: ${doc.title}`);
    }
  } else {
    console.log("✓ All medical entities have reviewers");
  }

  // Fail CI on dangling references
  if (results.danglingReferences.length > 0) {
    console.log("\n❌ Audit FAILED: dangling references detected");
    process.exit(1);
  }

  console.log("\n✓ Audit passed");
}

main().catch((err) => {
  console.error("[audit] Failed:", err);
  process.exit(1);
});
