/**
 * GA4 Measurement Protocol — server-side event emission.
 *
 * Server-truth for commerce, clinical, and AI events. These events
 * bypass ad-blockers and consent suppression, recovering ~15-30%
 * of lost purchase events.
 *
 * Events emitted here are reconciled with client events in the
 * warehouse — never additive.
 */

import type { AnalyticsEventName, EcommerceItem } from "../lib/types";

const GA4_MP_URL = "https://www.google-analytics.com/mp/collect";
const GA4_MP_DEBUG_URL = "https://www.google-analytics.com/debug/mp/collect";

interface MPEvent {
  name: AnalyticsEventName;
  params: Record<string, unknown>;
}

interface MPPayload {
  client_id: string;
  user_id?: string;
  events: MPEvent[];
  user_properties?: Record<string, { value: string | number }>;
  timestamp_micros?: number;
}

/**
 * Send server-side events to GA4 via Measurement Protocol.
 */
export async function sendMeasurementProtocol(
  events: MPEvent[],
  clientId: string,
  userId?: string,
  userProperties?: Record<string, string | number>
): Promise<{ ok: boolean; status: number }> {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_MP_API_SECRET;

  if (!measurementId || !apiSecret) {
    console.warn("[Analytics/MP] Missing GA4_MEASUREMENT_ID or GA4_MP_API_SECRET");
    return { ok: false, status: 0 };
  }

  const payload: MPPayload = {
    client_id: clientId,
    events,
    ...(userId && { user_id: userId }),
    ...(userProperties && {
      user_properties: Object.fromEntries(
        Object.entries(userProperties).map(([k, v]) => [k, { value: v }])
      ),
    }),
    timestamp_micros: Date.now() * 1000,
  };

  const isDebug = process.env.NODE_ENV !== "production";
  const url = `${isDebug ? GA4_MP_DEBUG_URL : GA4_MP_URL}?measurement_id=${measurementId}&api_secret=${apiSecret}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`[Analytics/MP] HTTP ${response.status}: ${await response.text()}`);
    }

    return { ok: response.ok, status: response.status };
  } catch (error) {
    console.error("[Analytics/MP] Network error:", error);
    return { ok: false, status: 0 };
  }
}

/* ── Pre-built server event emitters ───────────────────────────── */

export async function emitServerPurchase(
  clientId: string,
  transactionId: string,
  items: EcommerceItem[],
  value: number,
  currency: string,
  tax?: number,
  shipping?: number,
  coupon?: string
): Promise<void> {
  await sendMeasurementProtocol(
    [
      {
        name: "purchase",
        params: {
          transaction_id: transactionId,
          items,
          value,
          currency,
          ...(tax !== undefined && { tax }),
          ...(shipping !== undefined && { shipping }),
          ...(coupon && { coupon }),
        },
      },
    ],
    clientId
  );
}

export async function emitServerRefund(
  clientId: string,
  transactionId: string,
  items: EcommerceItem[],
  value: number,
  currency: string
): Promise<void> {
  await sendMeasurementProtocol(
    [
      {
        name: "refund",
        params: { transaction_id: transactionId, items, value, currency },
      },
    ],
    clientId
  );
}

export async function emitServerCourseEnrol(
  clientId: string,
  courseId: string,
  courseName: string,
  cohort?: string
): Promise<void> {
  await sendMeasurementProtocol(
    [
      {
        name: "course_enrol",
        params: {
          course_id: courseId,
          course_name: courseName,
          ...(cohort && { cohort }),
          pillar: "academy",
        },
      },
    ],
    clientId
  );
}

export async function emitServerAppointmentBooked(
  clientId: string,
  consultationType: string,
  appointmentDate: string
): Promise<void> {
  await sendMeasurementProtocol(
    [
      {
        name: "appointment_booked",
        params: {
          consultation_type: consultationType,
          appointment_date: appointmentDate,
          pillar: "clinical",
        },
      },
    ],
    clientId
  );
}

export async function emitServerCertificateIssued(
  clientId: string,
  courseId: string,
  courseName: string
): Promise<void> {
  await sendMeasurementProtocol(
    [
      {
        name: "certificate_issued",
        params: {
          course_id: courseId,
          course_name: courseName,
          pillar: "academy",
        },
      },
    ],
    clientId
  );
}

export async function emitServerJourneyDeposit(
  clientId: string,
  journeyId: string,
  programmeId: string,
  value: number,
  currency: string
): Promise<void> {
  await sendMeasurementProtocol(
    [
      {
        name: "journey_deposit",
        params: {
          journey_id: journeyId,
          programme_id: programmeId,
          value,
          currency,
          pillar: "journeys",
        },
      },
    ],
    clientId
  );
}
