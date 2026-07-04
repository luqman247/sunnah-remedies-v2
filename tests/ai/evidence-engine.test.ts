/**
 * Evidence Engine Tests — Grounding, Citations, Hadith Integrity.
 *
 * §16 testing checklist: grounding, citation validity, hadith integrity,
 * Evidence Engine classification, category consistency.
 */

import {
  classifyChunks,
  filterByAuthenticityRules,
  requiresWeaknessNotice,
  validateClaims,
  checkCategoryConsistency,
  getConfidenceBand,
  assembleContext,
} from "../../src/ai/evidence-engine";
import type {
  DocumentChunk,
  ProvenanceEnvelope,
  Claim,
} from "../../src/ai/evidence-engine/types";

/* ── Test Helpers ────────────────────────────────────────────────── */

function makeChunk(overrides: Partial<DocumentChunk> & { id: string }): DocumentChunk {
  return {
    content: "Test content",
    envelope: {
      chunkId: overrides.id,
      sourceCategory: "INSTITUTIONAL",
      epistemicAxis: ["doctrinal"],
      citation: { type: "article", title: "Test", slug: "test" },
      language: "en",
      contentType: "article",
      accessLevel: "public",
      sanityDocId: "doc-1",
      sanityRev: "rev-1",
      editorialApproved: true,
      supersedes: null,
      lastVerifiedAt: new Date().toISOString(),
    },
    tokenCount: 10,
    ...overrides,
  };
}

/* ── Tests ────────────────────────────────────────────────────────── */

// Grounding: no answer below low-confidence threshold
function testConfidenceBands() {
  console.assert(
    getConfidenceBand(0.8, { high: 0.75, medium: 0.55 }) === "high",
    "0.8 should be high"
  );
  console.assert(
    getConfidenceBand(0.6, { high: 0.75, medium: 0.55 }) === "medium",
    "0.6 should be medium"
  );
  console.assert(
    getConfidenceBand(0.3, { high: 0.75, medium: 0.55 }) === "low",
    "0.3 should be low"
  );
  console.log("✓ Confidence bands work correctly");
}

// Citation validity: claims must cite retrieved chunks
function testCitationValidation() {
  const retrievedIds = new Set(["chunk-1", "chunk-2", "chunk-3"]);

  const claims: Claim[] = [
    { text: "Valid claim", sourceCategory: "SUNNAH", citations: ["chunk-1"], confidence: 0.9 },
    { text: "Invalid citation", sourceCategory: "RESEARCH", citations: ["chunk-999"], confidence: 0.8 },
    { text: "No citations", sourceCategory: "INSTITUTIONAL", citations: [], confidence: 0.7 },
    { text: "Mixed", sourceCategory: "QURAN", citations: ["chunk-2", "chunk-888"], confidence: 0.85 },
  ];

  const result = validateClaims(claims, retrievedIds);
  console.assert(result.validClaims.length === 2, "Should have 2 valid claims");
  console.assert(result.droppedClaims.length === 2, "Should have 2 dropped claims");
  console.assert(
    result.validClaims[1].citations.length === 1,
    "Mixed claim should keep only valid citation"
  );
  console.log("✓ Citation validation works correctly");
}

// Hadith integrity: daif/mawdu handling
function testHadithIntegrity() {
  const chunks: DocumentChunk[] = [
    makeChunk({
      id: "sahih-1",
      envelope: {
        ...makeChunk({ id: "x" }).envelope,
        sourceCategory: "SUNNAH",
        authenticityGrade: "sahih",
      },
    }),
    makeChunk({
      id: "daif-1",
      envelope: {
        ...makeChunk({ id: "x" }).envelope,
        sourceCategory: "SUNNAH",
        authenticityGrade: "daif",
      },
    }),
    makeChunk({
      id: "mawdu-1",
      envelope: {
        ...makeChunk({ id: "x" }).envelope,
        sourceCategory: "SUNNAH",
        authenticityGrade: "mawdu",
      },
    }),
  ];

  const filtered = filterByAuthenticityRules(chunks);
  console.assert(filtered.length === 2, "Mawdu should be filtered out");
  console.assert(
    filtered.some((c) => c.id === "sahih-1"),
    "Sahih should remain"
  );
  console.assert(
    filtered.some((c) => c.id === "daif-1"),
    "Daif should remain (with weakness notice)"
  );
  console.assert(
    !filtered.some((c) => c.id === "mawdu-1"),
    "Mawdu should be removed"
  );

  const daifChunk = chunks.find((c) => c.id === "daif-1")!;
  console.assert(
    requiresWeaknessNotice(daifChunk.envelope),
    "Daif should require weakness notice"
  );

  console.log("✓ Hadith integrity rules work correctly");
}

// Classification: chunks grouped by category
function testClassification() {
  const chunks: DocumentChunk[] = [
    makeChunk({ id: "q1", envelope: { ...makeChunk({ id: "x" }).envelope, sourceCategory: "QURAN" } }),
    makeChunk({ id: "s1", envelope: { ...makeChunk({ id: "x" }).envelope, sourceCategory: "SUNNAH" } }),
    makeChunk({ id: "r1", envelope: { ...makeChunk({ id: "x" }).envelope, sourceCategory: "RESEARCH" } }),
    makeChunk({ id: "s2", envelope: { ...makeChunk({ id: "x" }).envelope, sourceCategory: "SUNNAH" } }),
  ];

  const grouped = classifyChunks(chunks);
  console.assert(grouped.get("QURAN")?.length === 1, "1 Quran chunk");
  console.assert(grouped.get("SUNNAH")?.length === 2, "2 Sunnah chunks");
  console.assert(grouped.get("RESEARCH")?.length === 1, "1 Research chunk");
  console.log("✓ Classification works correctly");
}

// Category consistency
function testCategoryConsistency() {
  const envelopes = new Map<string, ProvenanceEnvelope>();
  envelopes.set("chunk-1", {
    ...makeChunk({ id: "chunk-1" }).envelope,
    sourceCategory: "SUNNAH",
  });

  const consistentClaim: Claim = {
    text: "Test",
    sourceCategory: "SUNNAH",
    citations: ["chunk-1"],
    confidence: 0.9,
  };

  const inconsistentClaim: Claim = {
    text: "Test",
    sourceCategory: "RESEARCH",
    citations: ["chunk-1"],
    confidence: 0.9,
  };

  console.assert(
    checkCategoryConsistency(consistentClaim, envelopes),
    "Consistent claim should pass"
  );
  console.assert(
    !checkCategoryConsistency(inconsistentClaim, envelopes),
    "Inconsistent claim should fail"
  );
  console.log("✓ Category consistency check works correctly");
}

// Context assembly respects token limits
function testContextAssembly() {
  const chunks = Array.from({ length: 20 }, (_, i) =>
    makeChunk({ id: `chunk-${i}`, content: "A".repeat(200), tokenCount: 50 })
  );

  const context = assembleContext(chunks, 200);
  console.assert(context.chunks.length <= 4, "Should respect token limit");
  console.assert(context.totalTokens <= 200, "Total tokens within limit");
  console.log("✓ Context assembly respects token limits");
}

/* ── Run All Tests ───────────────────────────────────────────────── */

console.log("\n=== Evidence Engine Tests ===\n");
testConfidenceBands();
testCitationValidation();
testHadithIntegrity();
testClassification();
testCategoryConsistency();
testContextAssembly();
console.log("\n=== All Evidence Engine tests passed ===\n");
