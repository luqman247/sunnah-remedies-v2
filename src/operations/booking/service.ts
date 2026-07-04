/**
 * Phase 8 — Booking Service (Cal.com Integration)
 *
 * Single booking backbone across consultations, courses, events,
 * Sacred Journeys, workshops, and faculty appointments.
 * Each as a distinct event type with its own availability,
 * intake, duration, capacity, and pricing rules.
 */

import { db, schema } from "../db";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { logger } from "../logging";
import { emitEvent } from "../events/emit";
import { checkRateLimit, rateLimits } from "../queue";

const CALCOM_API_KEY = process.env.CALCOM_API_KEY ?? "";
const CALCOM_API_URL = process.env.CALCOM_API_URL ?? "https://api.cal.com/v2";

/* ── Cal.com API Client ─────────────────────────────────────────── */

async function calcomFetch(path: string, options: RequestInit = {}) {
  const rateCheck = await checkRateLimit(rateLimits.calcom);
  if (!rateCheck.allowed) {
    throw new Error("Cal.com rate limit exceeded");
  }

  const response = await fetch(`${CALCOM_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${CALCOM_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cal.com API error: ${response.status} ${error}`);
  }

  return response.json();
}

/* ── Booking Operations ─────────────────────────────────────────── */

export async function getBooking(bookingId: string) {
  return db
    .select()
    .from(schema.bookings)
    .where(eq(schema.bookings.id, bookingId))
    .limit(1)
    .then((r) => r[0] ?? null);
}

export async function getUpcomingBookings(options?: {
  type?: string;
  practitionerId?: string;
  limit?: number;
}) {
  const conditions = [gte(schema.bookings.scheduledAt, new Date())];

  if (options?.type) {
    conditions.push(eq(schema.bookings.type, options.type));
  }

  return db
    .select()
    .from(schema.bookings)
    .where(and(...conditions))
    .orderBy(schema.bookings.scheduledAt)
    .limit(options?.limit ?? 50);
}

export async function cancelBooking(bookingId: string, reason?: string): Promise<void> {
  await db
    .update(schema.bookings)
    .set({
      status: "cancelled",
      notes: reason,
      updatedAt: new Date(),
    })
    .where(eq(schema.bookings.id, bookingId));

  const booking = await getBooking(bookingId);
  if (booking) {
    await emitEvent("consultation.completed", {
      consultationId: booking.entityId ?? bookingId,
      personId: booking.personId,
      practitionerId: booking.practitionerId ?? "",
    });
  }

  logger.info("Booking cancelled", { bookingId, reason });
}

export async function rescheduleBooking(
  bookingId: string,
  newScheduledAt: Date
): Promise<void> {
  await db
    .update(schema.bookings)
    .set({
      status: "rescheduled",
      scheduledAt: newScheduledAt,
      updatedAt: new Date(),
    })
    .where(eq(schema.bookings.id, bookingId));

  logger.info("Booking rescheduled", { bookingId, newScheduledAt });
}

/* ── Waiting List ───────────────────────────────────────────────── */

export async function addToWaitingList(
  personId: string,
  entityType: string,
  entityId: string
): Promise<string> {
  const existing = await db
    .select()
    .from(schema.waitlists)
    .where(
      and(
        eq(schema.waitlists.personId, personId),
        eq(schema.waitlists.entityId, entityId)
      )
    )
    .limit(1);

  if (existing[0]) return existing[0].id;

  const currentCount = await db
    .select()
    .from(schema.waitlists)
    .where(eq(schema.waitlists.entityId, entityId));

  const result = await db
    .insert(schema.waitlists)
    .values({
      personId,
      entityType,
      entityId,
      position: currentCount.length + 1,
    })
    .returning({ id: schema.waitlists.id });

  return result[0].id;
}

export async function processWaitingList(entityId: string, spotsAvailable: number): Promise<number> {
  const waitlisted = await db
    .select()
    .from(schema.waitlists)
    .where(
      and(
        eq(schema.waitlists.entityId, entityId),
        eq(schema.waitlists.notified, false)
      )
    )
    .orderBy(schema.waitlists.position)
    .limit(spotsAvailable);

  for (const entry of waitlisted) {
    await emitEvent("waitlist.spot_available", {
      waitlistId: entry.id,
      entityType: entry.entityType,
      entityId: entry.entityId,
      personId: entry.personId,
    });

    await db
      .update(schema.waitlists)
      .set({ notified: true, notifiedAt: new Date() })
      .where(eq(schema.waitlists.id, entry.id));
  }

  return waitlisted.length;
}

/* ── Cal.com Webhook Processing ─────────────────────────────────── */

export async function processCalcomWebhook(
  eventType: string,
  payload: Record<string, unknown>
): Promise<void> {
  switch (eventType) {
    case "BOOKING_CREATED": {
      const booking = payload.payload as Record<string, unknown>;
      await emitEvent("consultation.booked", {
        consultationId: (booking.uid as string) ?? "",
        calcomBookingId: (booking.id as string)?.toString() ?? "",
        personId: "",
        practitionerId: "",
        scheduledAt: (booking.startTime as string) ?? "",
        type: (booking.eventType as Record<string, unknown>)?.slug as string ?? "consultation",
      });
      break;
    }

    case "BOOKING_RESCHEDULED": {
      const booking = payload.payload as Record<string, unknown>;
      logger.info("Cal.com booking rescheduled", { bookingId: booking.id });
      break;
    }

    case "BOOKING_CANCELLED": {
      const booking = payload.payload as Record<string, unknown>;
      logger.info("Cal.com booking cancelled", { bookingId: booking.id });
      break;
    }

    default:
      logger.info(`Unhandled Cal.com webhook: ${eventType}`);
  }
}
