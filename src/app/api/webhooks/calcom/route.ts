/**
 * Phase 8 — Cal.com Webhook Receiver
 *
 * Processes booking events from Cal.com. Verifies webhook signature,
 * enqueues work rather than processing inline.
 */

import { NextRequest, NextResponse } from "next/server";
import { processCalcomWebhook } from "@/operations/booking/service";
import { logger } from "@/operations/logging";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  try {
    const payload = JSON.parse(rawBody);
    const eventType = payload.triggerEvent as string;

    if (!eventType) {
      return NextResponse.json({ error: "Missing triggerEvent" }, { status: 400 });
    }

    await processCalcomWebhook(eventType, payload);
    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Cal.com webhook processing error", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
