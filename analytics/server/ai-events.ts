/**
 * AI event ingestion — instruments the Phase 6 AI Institution.
 *
 * Every AI interaction is tracked on the Integrity Ledger.
 * Monitors: queries, confidence, citations, fallbacks, hallucination
 * prevention, recommendations, and user satisfaction.
 *
 * The hallucination-prevention model flags uncited claims touching
 * hadith, Qur'anic verses, or clinical guidance for human review.
 */

import {
  trackServerAIQuery,
  trackServerAIResponse,
  trackServerAICitationShown,
  trackServerAIFallback,
  trackServerAIRecommendation,
} from "./server-events";

interface AIResponseMetrics {
  queryTopic: string;
  pillar?: string;
  confidence: number;
  sources: Array<{
    id: string;
    type: string;
    cited: boolean;
  }>;
  hasUncitedClaims: boolean;
  recommendations?: Array<{
    type: "product" | "course" | "consultation";
    id: string;
    name: string;
  }>;
  isFallback?: boolean;
  fallbackReason?: string;
}

/**
 * Track a complete AI interaction (query + response).
 */
export async function trackAIInteraction(metrics: AIResponseMetrics): Promise<void> {
  await trackServerAIQuery(metrics.queryTopic, metrics.pillar);

  const citationCount = metrics.sources.filter((s) => s.cited).length;

  await trackServerAIResponse(
    metrics.queryTopic,
    metrics.confidence,
    citationCount,
    metrics.hasUncitedClaims
  );

  for (const source of metrics.sources.filter((s) => s.cited)) {
    await trackServerAICitationShown(source.id, source.type);
  }

  if (metrics.isFallback && metrics.fallbackReason) {
    await trackServerAIFallback(metrics.queryTopic, metrics.fallbackReason);
  }

  if (metrics.recommendations) {
    for (const rec of metrics.recommendations) {
      await trackServerAIRecommendation(rec.type, rec.id, rec.name);
    }
  }

  if (metrics.hasUncitedClaims) {
    flagForHumanReview(metrics);
  }
}

/**
 * Flag an AI response with uncited claims for human review.
 * Especially critical for hadith, Qur'anic, and clinical content.
 */
function flagForHumanReview(metrics: AIResponseMetrics): void {
  const sensitiveTypes = ["hadith", "verse", "clinical"];
  const isSensitive = metrics.sources.some(
    (s) => !s.cited && sensitiveTypes.includes(s.type)
  );

  console.warn(
    JSON.stringify({
      _type: "ai_review_flag",
      severity: isSensitive ? "critical" : "standard",
      query_topic: metrics.queryTopic,
      confidence: metrics.confidence,
      uncited_claims: true,
      sensitive_content: isSensitive,
      timestamp: new Date().toISOString(),
    })
  );
}

/**
 * Calculate the AI trust score for the dashboard.
 * Based on citation rate and uncited-claim rate.
 */
export function calculateAITrustScore(
  totalResponses: number,
  responsesWithCitations: number,
  responsesWithUncitedClaims: number
): {
  trustScore: number;
  citationRate: number;
  uncitedClaimRate: number;
} {
  if (totalResponses === 0) {
    return { trustScore: 1, citationRate: 1, uncitedClaimRate: 0 };
  }

  const citationRate = responsesWithCitations / totalResponses;
  const uncitedClaimRate = responsesWithUncitedClaims / totalResponses;

  // Trust score: weighted combination — citation rate matters more
  const trustScore = Math.max(
    0,
    citationRate * 0.7 + (1 - uncitedClaimRate) * 0.3
  );

  return {
    trustScore: Math.round(trustScore * 100) / 100,
    citationRate: Math.round(citationRate * 100) / 100,
    uncitedClaimRate: Math.round(uncitedClaimRate * 100) / 100,
  };
}
