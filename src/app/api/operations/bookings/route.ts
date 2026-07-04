/**
 * Phase 8 — Bookings API
 *
 * Booking operations, waiting lists, cancellations, rescheduling.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getBooking,
  getUpcomingBookings,
  cancelBooking,
  rescheduleBooking,
  addToWaitingList,
  processWaitingList,
} from "@/operations/booking/service";

export async function GET(request: NextRequest) {
  const bookingId = request.nextUrl.searchParams.get("id");
  const type = request.nextUrl.searchParams.get("type");

  if (bookingId) {
    const booking = await getBooking(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ booking });
  }

  const bookings = await getUpcomingBookings({
    type: type ?? undefined,
    limit: 50,
  });

  return NextResponse.json({ bookings });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case "cancel": {
      const { bookingId, reason } = body;
      await cancelBooking(bookingId, reason);
      return NextResponse.json({ status: "cancelled" });
    }

    case "reschedule": {
      const { bookingId, newScheduledAt } = body;
      await rescheduleBooking(bookingId, new Date(newScheduledAt));
      return NextResponse.json({ status: "rescheduled" });
    }

    case "join-waitlist": {
      const { personId, entityType, entityId } = body;
      const waitlistId = await addToWaitingList(personId, entityType, entityId);
      return NextResponse.json({ waitlistId }, { status: 201 });
    }

    case "process-waitlist": {
      const { entityId, spotsAvailable } = body;
      const notified = await processWaitingList(entityId, spotsAvailable);
      return NextResponse.json({ notified });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
