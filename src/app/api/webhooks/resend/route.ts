/**
 * Phase 8 — Resend Webhook Receiver
 *
 * Processes email delivery events (bounce, complaint, open, click).
 */

import { NextRequest } from "next/server";
import { handleResendWebhook } from "@/operations/email/webhooks/resend";

export async function POST(request: NextRequest) {
  return handleResendWebhook(request);
}
