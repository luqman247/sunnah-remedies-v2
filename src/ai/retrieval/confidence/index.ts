/**
 * Confidence Scoring & Thresholds (§5.6).
 *
 * Confidence = f(top re-rank score, score margin, corpus coverage).
 * Three bands: high (≥0.75), medium (0.55–0.75), low (<0.55).
 */

import { AI_CONFIG } from "../../config";
import type { DocumentChunk } from "../../evidence-engine/types";

export type ConfidenceBand = "high" | "medium" | "low";

export interface ConfidenceAssessment {
  score: number;
  band: ConfidenceBand;
  topScore: number;
  scoreMargin: number;
  coverageRatio: number;
  shouldAnswer: boolean;
  partialCoverage: boolean;
}

export function assessConfidence(
  query: string,
  rankedChunks: DocumentChunk[],
  scores: Map<string, number>
): ConfidenceAssessment {
  const thresholds = AI_CONFIG.retrieval.confidenceThresholds;

  if (rankedChunks.length === 0) {
    return {
      score: 0,
      band: "low",
      topScore: 0,
      scoreMargin: 0,
      coverageRatio: 0,
      shouldAnswer: false,
      partialCoverage: false,
    };
  }

  const scoreValues = rankedChunks.map((c) => scores.get(c.id) ?? 0);
  const topScore = Math.max(...scoreValues);
  const secondScore = scoreValues.length > 1 ? scoreValues.sort((a, b) => b - a)[1] : 0;
  const scoreMargin = topScore - secondScore;

  // Corpus coverage: how many query terms appear in retrieved content
  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);
  const allContent = rankedChunks.map((c) => c.content.toLowerCase()).join(" ");
  const coveredTerms = queryTerms.filter((t) => allContent.includes(t));
  const coverageRatio =
    queryTerms.length > 0 ? coveredTerms.length / queryTerms.length : 0;

  // Composite confidence score
  const score =
    topScore * 0.5 +
    scoreMargin * 0.2 +
    coverageRatio * 0.3;

  let band: ConfidenceBand;
  if (score >= thresholds.high) band = "high";
  else if (score >= thresholds.medium) band = "medium";
  else band = "low";

  return {
    score,
    band,
    topScore,
    scoreMargin,
    coverageRatio,
    shouldAnswer: band !== "low",
    partialCoverage: band === "medium",
  };
}

/* ── Fallback Generation (§5.8) ──────────────────────────────────── */

export interface FallbackResponse {
  type: "closest_topics" | "rephrase" | "human_pathway" | "gap_acknowledgement";
  message: string;
  suggestions?: string[];
  humanPathway?: string;
}

export function generateFallback(
  query: string,
  closestChunks: DocumentChunk[]
): FallbackResponse {
  if (closestChunks.length > 0) {
    const topics = [
      ...new Set(
        closestChunks
          .slice(0, 3)
          .map((c) => {
            if (c.headingPath?.length) return c.headingPath[0];
            return c.envelope.contentType;
          })
      ),
    ];

    return {
      type: "closest_topics",
      message:
        "The Institute's knowledge base does not contain sufficient information to answer this question fully. " +
        "However, you may find the following related topics helpful.",
      suggestions: topics,
      humanPathway: "/consultations",
    };
  }

  return {
    type: "gap_acknowledgement",
    message:
      "This question falls outside the current coverage of the Institute's knowledge base. " +
      "We have logged this as a knowledge gap for our editorial team. " +
      "In the meantime, you may wish to consult a qualified practitioner.",
    humanPathway: "/consultations",
  };
}
