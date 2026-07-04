/**
 * AI Analytics — Event Schema & Knowledge Gap Pipeline (§12).
 *
 * Tracks questions, topics, recommendations, failures, knowledge gaps,
 * user satisfaction, citation usage, and performance metrics.
 */

/* ── Event Types ─────────────────────────────────────────────────── */

export interface AiAnalyticsEvent {
  id: string;
  type: AiEventType;
  timestamp: number;
  surface: string;
  language: string;
  sessionId?: string;
  userId?: string;
  data: Record<string, unknown>;
}

export type AiEventType =
  | "query"
  | "response"
  | "fallback"
  | "escalation"
  | "hallucination_detected"
  | "citation_validation_failure"
  | "knowledge_gap"
  | "guardrail_triggered"
  | "cache_hit"
  | "feedback"
  | "error";

/* ── In-Memory Event Store ───────────────────────────────────────── */

const events: AiAnalyticsEvent[] = [];
const knowledgeGaps: KnowledgeGapEntry[] = [];

export interface KnowledgeGapEntry {
  query: string;
  timestamp: number;
  surface: string;
  language: string;
  closestTopics: string[];
  confidence: number;
}

/* ── Event Logging ───────────────────────────────────────────────── */

export function logEvent(event: Omit<AiAnalyticsEvent, "id" | "timestamp">): void {
  const fullEvent: AiAnalyticsEvent = {
    ...event,
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };
  events.push(fullEvent);

  // Knowledge gap tracking
  if (event.type === "fallback" || event.type === "knowledge_gap") {
    knowledgeGaps.push({
      query: (event.data.query as string) || "",
      timestamp: Date.now(),
      surface: event.surface,
      language: event.language,
      closestTopics: (event.data.closestTopics as string[]) || [],
      confidence: (event.data.confidence as number) || 0,
    });
  }

  // Console logging for production monitoring
  if (event.type === "hallucination_detected" || event.type === "error") {
    console.error(`[AI Analytics] ${event.type}:`, event.data);
  }
}

/* ── Knowledge Gap Dashboard Data ────────────────────────────────── */

export function getKnowledgeGaps(limit: number = 50): KnowledgeGapEntry[] {
  return knowledgeGaps
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

export function getTopUnansweredQueries(limit: number = 20): {
  query: string;
  count: number;
  lastAsked: number;
}[] {
  const queryCounts = new Map<string, { count: number; lastAsked: number }>();
  for (const gap of knowledgeGaps) {
    const normalised = gap.query.toLowerCase().trim();
    const existing = queryCounts.get(normalised);
    if (existing) {
      existing.count++;
      existing.lastAsked = Math.max(existing.lastAsked, gap.timestamp);
    } else {
      queryCounts.set(normalised, { count: 1, lastAsked: gap.timestamp });
    }
  }

  return Array.from(queryCounts.entries())
    .map(([query, data]) => ({ query, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/* ── Performance Metrics ─────────────────────────────────────────── */

export function getPerformanceMetrics(): {
  totalQueries: number;
  avgLatencyMs: number;
  cacheHitRate: number;
  escalationRate: number;
  fallbackRate: number;
  guardrailTriggerRate: number;
} {
  const queries = events.filter((e) => e.type === "query");
  const responses = events.filter((e) => e.type === "response");
  const cacheHits = events.filter((e) => e.type === "cache_hit");
  const escalations = events.filter((e) => e.type === "escalation");
  const fallbacks = events.filter((e) => e.type === "fallback");
  const guardrails = events.filter((e) => e.type === "guardrail_triggered");

  const latencies = responses
    .map((e) => e.data.latencyMs as number)
    .filter(Boolean);
  const avgLatency =
    latencies.length > 0
      ? latencies.reduce((a, b) => a + b, 0) / latencies.length
      : 0;

  const total = queries.length || 1;

  return {
    totalQueries: queries.length,
    avgLatencyMs: Math.round(avgLatency),
    cacheHitRate: cacheHits.length / total,
    escalationRate: escalations.length / total,
    fallbackRate: fallbacks.length / total,
    guardrailTriggerRate: guardrails.length / total,
  };
}

/* ── Citation Usage Stats ────────────────────────────────────────── */

export function getMostCitedSources(limit: number = 10): {
  sourceCategory: string;
  count: number;
}[] {
  const categoryCounts = new Map<string, number>();

  for (const event of events) {
    if (event.type === "response" && event.data.claims) {
      for (const claim of event.data.claims as { sourceCategory: string }[]) {
        const count = categoryCounts.get(claim.sourceCategory) || 0;
        categoryCounts.set(claim.sourceCategory, count + 1);
      }
    }
  }

  return Array.from(categoryCounts.entries())
    .map(([sourceCategory, count]) => ({ sourceCategory, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
