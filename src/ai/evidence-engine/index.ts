/**
 * Evidence Engine — Claim Assembler & Provenance Classifier.
 *
 * Sits between retrieval and generation (§3). Classifies retrieved
 * chunks by source category and epistemic axis, assembles context
 * with provenance metadata, and validates claims post-generation.
 */

import type {
  SourceCategory,
  AuthenticityGrade,
  ProvenanceEnvelope,
  Claim,
  StructuredResponse,
  DocumentChunk,
} from "./types";
import { CATEGORY_AXES } from "./types";

/* ── Chunk Classification ────────────────────────────────────────── */

export function classifyChunks(
  chunks: DocumentChunk[]
): Map<SourceCategory, DocumentChunk[]> {
  const grouped = new Map<SourceCategory, DocumentChunk[]>();
  for (const chunk of chunks) {
    const cat = chunk.envelope.sourceCategory;
    const existing = grouped.get(cat) || [];
    existing.push(chunk);
    grouped.set(cat, existing);
  }
  return grouped;
}

/* ── Hadith Safety Filter (§3.3) ─────────────────────────────────── */

export function filterByAuthenticityRules(
  chunks: DocumentChunk[]
): DocumentChunk[] {
  return chunks.filter((chunk) => {
    if (chunk.envelope.sourceCategory !== "SUNNAH") return true;
    const grade = chunk.envelope.authenticityGrade;
    // Mawdu (fabricated) narrations are never surfaced as support
    if (grade === "mawdu") return false;
    return true;
  });
}

export function requiresWeaknessNotice(envelope: ProvenanceEnvelope): boolean {
  return (
    envelope.sourceCategory === "SUNNAH" &&
    envelope.authenticityGrade === "daif"
  );
}

/* ── Context Assembly ────────────────────────────────────────────── */

export interface AssembledContext {
  chunks: DocumentChunk[];
  groupedByCategory: Map<SourceCategory, DocumentChunk[]>;
  contextText: string;
  envelopes: ProvenanceEnvelope[];
  totalTokens: number;
}

export function assembleContext(
  rankedChunks: DocumentChunk[],
  maxTokens: number
): AssembledContext {
  const filtered = filterByAuthenticityRules(rankedChunks);
  const selected: DocumentChunk[] = [];
  let totalTokens = 0;

  for (const chunk of filtered) {
    const content = chunk.parentContent || chunk.content;
    const tokens = chunk.tokenCount;
    if (totalTokens + tokens > maxTokens) break;
    selected.push(chunk);
    totalTokens += tokens;
  }

  const grouped = classifyChunks(selected);

  const contextParts: string[] = [];
  for (const [category, categoryChunks] of grouped) {
    contextParts.push(`\n--- ${category} ---`);
    for (const chunk of categoryChunks) {
      const env = chunk.envelope;
      let header = `[${env.chunkId}] Source: ${category}`;
      if (env.authenticityGrade) {
        header += ` | Grade: ${env.authenticityGrade}`;
      }
      header += ` | Language: ${env.language}`;

      const citationStr = formatCitationForContext(env.citation);
      if (citationStr) header += ` | ${citationStr}`;

      contextParts.push(header);
      contextParts.push(chunk.parentContent || chunk.content);
      contextParts.push("");
    }
  }

  return {
    chunks: selected,
    groupedByCategory: grouped,
    contextText: contextParts.join("\n"),
    envelopes: selected.map((c) => c.envelope),
    totalTokens,
  };
}

function formatCitationForContext(
  citation: ProvenanceEnvelope["citation"]
): string {
  switch (citation.type) {
    case "quran":
      return `Qur'an ${citation.surahName} ${citation.ayah}`;
    case "hadith":
      return `${citation.collection} #${citation.number} (${citation.grade})`;
    case "research":
      return `${citation.authors?.join(", ")} (${citation.year}) — ${citation.title}`;
    case "classical":
      return `${citation.scholar}, ${citation.work}`;
    case "contemporary":
      return `${citation.scholar}${citation.work ? `, ${citation.work}` : ""}`;
    case "product":
      return `Product: ${citation.title}`;
    case "course":
      return `Course: ${citation.courseId}`;
    case "article":
      return `Article: ${citation.title}`;
    case "policy":
      return `Policy: ${citation.policyId}`;
    default:
      return "";
  }
}

/* ── Claim Validation (§5.7) ─────────────────────────────────────── */

export interface ValidationResult {
  valid: boolean;
  validClaims: Claim[];
  droppedClaims: Claim[];
  errors: string[];
}

export function validateClaims(
  claims: Claim[],
  retrievedChunkIds: Set<string>
): ValidationResult {
  const validClaims: Claim[] = [];
  const droppedClaims: Claim[] = [];
  const errors: string[] = [];

  for (const claim of claims) {
    // Every citation must reference a chunk that was actually retrieved
    if (claim.citations.length === 0) {
      droppedClaims.push(claim);
      errors.push(`Claim dropped: no citations — "${claim.text.slice(0, 60)}..."`);
      continue;
    }

    const validCitations = claim.citations.filter((id) =>
      retrievedChunkIds.has(id)
    );

    if (validCitations.length === 0) {
      droppedClaims.push(claim);
      errors.push(
        `Claim dropped: all citations reference non-retrieved chunks — "${claim.text.slice(0, 60)}..."`
      );
      continue;
    }

    validClaims.push({
      ...claim,
      citations: validCitations,
    });
  }

  return {
    valid: droppedClaims.length === 0,
    validClaims,
    droppedClaims,
    errors,
  };
}

/* ── Category Consistency Check (§5.7) ───────────────────────────── */

export function checkCategoryConsistency(
  claim: Claim,
  chunkEnvelopes: Map<string, ProvenanceEnvelope>
): boolean {
  for (const citationId of claim.citations) {
    const envelope = chunkEnvelopes.get(citationId);
    if (!envelope) continue;
    if (envelope.sourceCategory !== claim.sourceCategory) {
      return false;
    }
  }
  return true;
}

/* ── Confidence Band ─────────────────────────────────────────────── */

export function getConfidenceBand(
  score: number,
  thresholds: { high: number; medium: number }
): "high" | "medium" | "low" {
  if (score >= thresholds.high) return "high";
  if (score >= thresholds.medium) return "medium";
  return "low";
}
