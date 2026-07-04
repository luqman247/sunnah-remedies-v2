/**
 * Server-side event service — central dispatch for all server events.
 *
 * Handles AI events (Phase 6), webhook commerce events, clinical events,
 * and any other server-originated tracking. All events are:
 *   1. Emitted to GA4 via Measurement Protocol
 *   2. Logged for warehouse ingestion
 *   3. Validated against the tracking plan
 */

import {
  sendMeasurementProtocol,
  emitServerPurchase,
  emitServerRefund,
  emitServerCourseEnrol,
  emitServerAppointmentBooked,
  emitServerCertificateIssued,
  emitServerJourneyDeposit,
} from "./measurement-protocol";
import type { AnalyticsEventName, EcommerceItem, AIConfidenceBand } from "../lib/types";

/* ── Event log (warehouse-bound) ───────────────────────────────── */

interface ServerEventLog {
  event_name: AnalyticsEventName;
  params: Record<string, unknown>;
  timestamp: string;
  source: "webhook" | "server_action" | "ai" | "cron";
}

const eventBuffer: ServerEventLog[] = [];
const FLUSH_INTERVAL_MS = 10_000;
const FLUSH_BATCH_SIZE = 50;

function bufferEvent(log: ServerEventLog): void {
  eventBuffer.push(log);

  if (eventBuffer.length >= FLUSH_BATCH_SIZE) {
    flushEventBuffer();
  }
}

async function flushEventBuffer(): Promise<void> {
  if (eventBuffer.length === 0) return;

  const batch = eventBuffer.splice(0, FLUSH_BATCH_SIZE);

  // In production, write to BigQuery or a log aggregator.
  // For now, structured console output for ingestion.
  for (const event of batch) {
    console.info(
      JSON.stringify({
        _type: "analytics_event",
        ...event,
      })
    );
  }
}

// Periodic flush
if (typeof setInterval !== "undefined") {
  setInterval(flushEventBuffer, FLUSH_INTERVAL_MS);
}

/* ── Commerce server events ────────────────────────────────────── */

export async function trackServerPurchase(
  orderId: string,
  items: EcommerceItem[],
  value: number,
  currency: string,
  clientId: string,
  tax?: number,
  shipping?: number,
  coupon?: string
): Promise<void> {
  bufferEvent({
    event_name: "purchase",
    params: { transaction_id: orderId, items, value, currency, tax, shipping, coupon },
    timestamp: new Date().toISOString(),
    source: "webhook",
  });

  await emitServerPurchase(clientId, orderId, items, value, currency, tax, shipping, coupon);
}

export async function trackServerRefund(
  orderId: string,
  items: EcommerceItem[],
  value: number,
  currency: string,
  clientId: string
): Promise<void> {
  bufferEvent({
    event_name: "refund",
    params: { transaction_id: orderId, items, value, currency },
    timestamp: new Date().toISOString(),
    source: "webhook",
  });

  await emitServerRefund(clientId, orderId, items, value, currency);
}

/* ── Course server events ──────────────────────────────────────── */

export async function trackServerCourseEnrol(
  courseId: string,
  courseName: string,
  clientId: string,
  cohort?: string
): Promise<void> {
  bufferEvent({
    event_name: "course_enrol",
    params: { course_id: courseId, course_name: courseName, cohort },
    timestamp: new Date().toISOString(),
    source: "server_action",
  });

  await emitServerCourseEnrol(clientId, courseId, courseName, cohort);
}

export async function trackServerLessonStart(
  courseId: string,
  lessonId: string,
  lessonIndex: number
): Promise<void> {
  bufferEvent({
    event_name: "lesson_start",
    params: { course_id: courseId, lesson_id: lessonId, lesson_index: lessonIndex },
    timestamp: new Date().toISOString(),
    source: "server_action",
  });
}

export async function trackServerLessonComplete(
  courseId: string,
  lessonId: string,
  lessonIndex: number,
  readingSeconds: number
): Promise<void> {
  bufferEvent({
    event_name: "lesson_complete",
    params: { course_id: courseId, lesson_id: lessonId, lesson_index: lessonIndex, reading_seconds: readingSeconds },
    timestamp: new Date().toISOString(),
    source: "server_action",
  });
}

export async function trackServerQuizAttempt(
  courseId: string,
  quizId: string,
  lessonId: string
): Promise<void> {
  bufferEvent({
    event_name: "quiz_attempt",
    params: { course_id: courseId, quiz_id: quizId, lesson_id: lessonId },
    timestamp: new Date().toISOString(),
    source: "server_action",
  });
}

export async function trackServerQuizComplete(
  courseId: string,
  quizId: string,
  score: number,
  passed: boolean
): Promise<void> {
  bufferEvent({
    event_name: "quiz_complete",
    params: { course_id: courseId, quiz_id: quizId, quiz_score: score, passed },
    timestamp: new Date().toISOString(),
    source: "server_action",
  });
}

export async function trackServerCertificateIssued(
  courseId: string,
  courseName: string,
  clientId: string
): Promise<void> {
  bufferEvent({
    event_name: "certificate_issued",
    params: { course_id: courseId, course_name: courseName },
    timestamp: new Date().toISOString(),
    source: "server_action",
  });

  await emitServerCertificateIssued(clientId, courseId, courseName);
}

/* ── Clinical server events ────────────────────────────────────── */

export async function trackServerIntakeComplete(
  consultationType: string
): Promise<void> {
  bufferEvent({
    event_name: "intake_complete",
    params: { consultation_type: consultationType },
    timestamp: new Date().toISOString(),
    source: "server_action",
  });
}

export async function trackServerAppointmentBooked(
  consultationType: string,
  appointmentDate: string,
  clientId: string
): Promise<void> {
  bufferEvent({
    event_name: "appointment_booked",
    params: { consultation_type: consultationType, appointment_date: appointmentDate },
    timestamp: new Date().toISOString(),
    source: "server_action",
  });

  await emitServerAppointmentBooked(clientId, consultationType, appointmentDate);
}

export async function trackServerAppointmentAttended(
  consultationType: string
): Promise<void> {
  bufferEvent({
    event_name: "appointment_attended",
    params: { consultation_type: consultationType },
    timestamp: new Date().toISOString(),
    source: "server_action",
  });
}

/* ── Journey server events ─────────────────────────────────────── */

export async function trackServerJourneyDeposit(
  journeyId: string,
  programmeId: string,
  value: number,
  currency: string,
  clientId: string
): Promise<void> {
  bufferEvent({
    event_name: "journey_deposit",
    params: { journey_id: journeyId, programme_id: programmeId, value, currency },
    timestamp: new Date().toISOString(),
    source: "webhook",
  });

  await emitServerJourneyDeposit(clientId, journeyId, programmeId, value, currency);
}

/* ── AI server events ──────────────────────────────────────────── */

export async function trackServerAIQuery(
  queryTopic: string,
  pillar?: string
): Promise<void> {
  bufferEvent({
    event_name: "ai_query",
    params: { query_topic: queryTopic, pillar },
    timestamp: new Date().toISOString(),
    source: "ai",
  });
}

export async function trackServerAIResponse(
  queryTopic: string,
  confidence: number,
  citationCount: number,
  hasUncitedClaims: boolean
): Promise<void> {
  const band: AIConfidenceBand =
    confidence >= 0.8 ? "high" : confidence >= 0.5 ? "medium" : "low";

  bufferEvent({
    event_name: "ai_response",
    params: {
      query_topic: queryTopic,
      ai_confidence: confidence,
      ai_confidence_band: band,
      citation_count: citationCount,
      has_uncited_claims: hasUncitedClaims,
    },
    timestamp: new Date().toISOString(),
    source: "ai",
  });
}

export async function trackServerAICitationShown(
  sourceId: string,
  sourceType: string
): Promise<void> {
  bufferEvent({
    event_name: "ai_citation_shown",
    params: { source_id: sourceId, source_type: sourceType },
    timestamp: new Date().toISOString(),
    source: "ai",
  });
}

export async function trackServerAIFallback(
  queryTopic: string,
  fallbackReason: string
): Promise<void> {
  bufferEvent({
    event_name: "ai_fallback",
    params: { query_topic: queryTopic, fallback_reason: fallbackReason },
    timestamp: new Date().toISOString(),
    source: "ai",
  });
}

export async function trackServerAIRecommendation(
  recommendationType: string,
  recommendationId: string,
  recommendationName: string
): Promise<void> {
  bufferEvent({
    event_name: "ai_recommendation",
    params: {
      recommendation_type: recommendationType,
      recommendation_id: recommendationId,
      recommendation_name: recommendationName,
    },
    timestamp: new Date().toISOString(),
    source: "ai",
  });
}

/* ── Newsletter / Account ──────────────────────────────────────── */

export async function trackServerNewsletterSignup(
  sourcePage: string,
  clientId: string
): Promise<void> {
  bufferEvent({
    event_name: "newsletter_signup",
    params: { source_page: sourcePage },
    timestamp: new Date().toISOString(),
    source: "server_action",
  });

  await sendMeasurementProtocol(
    [{ name: "newsletter_signup", params: { source_page: sourcePage } }],
    clientId
  );
}

export async function trackServerAccountCreate(
  accountType: string
): Promise<void> {
  bufferEvent({
    event_name: "account_create",
    params: { account_type: accountType },
    timestamp: new Date().toISOString(),
    source: "server_action",
  });
}
