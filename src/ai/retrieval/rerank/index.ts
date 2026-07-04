/**
 * Re-ranking — Cross-Encoder Approximation (§5.5).
 *
 * Re-ranks retrieval candidates by query–document relevance.
 * Uses a lightweight scoring heuristic with the architecture
 * ready for a cross-encoder model drop-in.
 */

import type { DocumentChunk, SourceCategory } from "../../evidence-engine/types";
import { AI_CONFIG } from "../../config";

/* ── Re-rank Interface ───────────────────────────────────────────── */

export interface RerankResult {
  chunks: DocumentChunk[];
  scores: Map<string, number>;
}

/* ── Relevance Scoring ───────────────────────────────────────────── */

function computeRelevanceScore(
  query: string,
  chunk: DocumentChunk,
  vectorScore: number
): number {
  let score = vectorScore;

  const queryTerms = query.toLowerCase().split(/\s+/);
  const contentLower = chunk.content.toLowerCase();

  // Term overlap bonus
  const matchedTerms = queryTerms.filter((t) => contentLower.includes(t));
  const termOverlap = matchedTerms.length / Math.max(queryTerms.length, 1);
  score += termOverlap * 0.1;

  // Exact phrase bonus
  if (contentLower.includes(query.toLowerCase())) {
    score += 0.05;
  }

  // Source authority weighting
  const categoryWeights: Partial<Record<SourceCategory, number>> = {
    QURAN: 0.03,
    SUNNAH: 0.03,
    RESEARCH: 0.02,
    CLASSICAL: 0.015,
    CONTEMPORARY: 0.01,
    INSTITUTIONAL: 0.005,
    TRADITION: 0.005,
  };
  score += categoryWeights[chunk.envelope.sourceCategory] ?? 0;

  // Hadith authenticity bonus
  if (chunk.envelope.sourceCategory === "SUNNAH") {
    if (chunk.envelope.authenticityGrade === "sahih") score += 0.02;
    else if (chunk.envelope.authenticityGrade === "hasan") score += 0.01;
    else if (chunk.envelope.authenticityGrade === "daif") score -= 0.05;
  }

  // Content length quality signal (prefer substantial chunks)
  if (chunk.tokenCount > 50 && chunk.tokenCount < 600) {
    score += 0.01;
  }

  return Math.min(score, 1);
}

/* ── Re-rank Pipeline ────────────────────────────────────────────── */

export function rerank(
  query: string,
  chunks: DocumentChunk[],
  vectorScores: Map<string, number>,
  topK: number = AI_CONFIG.vector.rerankedK
): RerankResult {
  const scored = chunks.map((chunk) => ({
    chunk,
    score: computeRelevanceScore(
      query,
      chunk,
      vectorScores.get(chunk.id) ?? 0
    ),
  }));

  scored.sort((a, b) => b.score - a.score);

  const topChunks = scored.slice(0, topK);
  const resultScores = new Map<string, number>();
  for (const item of topChunks) {
    resultScores.set(item.chunk.id, item.score);
  }

  return {
    chunks: topChunks.map((s) => s.chunk),
    scores: resultScores,
  };
}
