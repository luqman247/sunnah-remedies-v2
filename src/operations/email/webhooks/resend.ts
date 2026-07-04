/**
 * Phase 8 — Resend Webhook Handler
 *
 * Processes bounce and complaint webhooks from Resend.
 * Updates suppression list and CRM flags.
 */

import { NextRequest, NextResponse } from "next/server";
import { emitEvent } from "../../events/emit";
import { logger } from "../../logging";

export async function handleResendWebhook(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const eventType = body.type as string;

  try {
    switch (eventType) {
      case "email.bounced": {
        const email = body.data?.email_address as string;
        const reason = body.data?.bounce?.message as string ?? "unknown";
        const bounceType = body.data?.bounce?.bounce_type === "permanent" ? "hard" : "soft";

        if (email) {
          await emitEvent("email.bounced", {
            emailId: body.data?.email_id ?? "",
            email,
            reason,
            bounceType,
          });
        }
        break;
      }

      case "email.complained": {
        const email = body.data?.email_address as string;
        if (email) {
          await emitEvent("email.complained", {
            emailId: body.data?.email_id ?? "",
            email,
          });
        }
        break;
      }

      case "email.delivered":
      case "email.opened":
      case "email.clicked":
        logger.debug(`Resend webhook: ${eventType}`, { emailId: body.data?.email_id });
        break;

      default:
        logger.info(`Unhandled Resend webhook: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Resend webhook processing error", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
