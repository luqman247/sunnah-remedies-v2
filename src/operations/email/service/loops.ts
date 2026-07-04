/**
 * Phase 8 — Loops Lifecycle & Marketing Email Service
 *
 * Newsletter, editorial broadcasts, research announcements,
 * nurture sequences. Non-developers can author via Loops UI.
 *
 * Uses separate sending sub-domain (news.) so marketing
 * reputation cannot affect transactional delivery.
 */

import { logger } from "../../logging";

const LOOPS_API_KEY = process.env.LOOPS_API_KEY ?? "";
const LOOPS_API_URL = "https://app.loops.so/api/v1";

interface LoopsContact {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
  userGroup?: string;
  [key: string]: unknown;
}

export async function syncContactToLoops(contact: LoopsContact): Promise<boolean> {
  if (!LOOPS_API_KEY) {
    logger.warn("Loops API key not configured — skipping sync");
    return false;
  }

  try {
    const response = await fetch(`${LOOPS_API_URL}/contacts/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      logger.error("Failed to sync contact to Loops", {
        email: contact.email,
        status: response.status,
      });
      return false;
    }

    logger.info("Contact synced to Loops", { email: contact.email });
    return true;
  } catch (error) {
    logger.error("Loops sync error", {
      email: contact.email,
      error: error instanceof Error ? error.message : "Unknown",
    });
    return false;
  }
}

export async function triggerLoopsEvent(
  email: string,
  eventName: string,
  data?: Record<string, unknown>
): Promise<boolean> {
  if (!LOOPS_API_KEY) {
    logger.warn("Loops API key not configured — skipping event");
    return false;
  }

  try {
    const response = await fetch(`${LOOPS_API_URL}/events/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        eventName,
        eventProperties: data,
      }),
    });

    if (!response.ok) {
      logger.error("Failed to send Loops event", { email, eventName, status: response.status });
      return false;
    }

    logger.info("Loops event sent", { email, eventName });
    return true;
  } catch (error) {
    logger.error("Loops event error", {
      email,
      eventName,
      error: error instanceof Error ? error.message : "Unknown",
    });
    return false;
  }
}

export async function removeContactFromLoops(email: string): Promise<boolean> {
  if (!LOOPS_API_KEY) return false;

  try {
    const response = await fetch(`${LOOPS_API_URL}/contacts/delete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return response.ok;
  } catch {
    return false;
  }
}
