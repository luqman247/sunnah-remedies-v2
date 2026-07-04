/**
 * Phase 9 — Community Analytics Events
 *
 * Emits domain events to the Phase 7 analytics pipeline.
 * Metrics are computed in the warehouse, never on the operational store.
 */

export type CommunityEventName =
  | "membership_registered"
  | "membership_tier_changed"
  | "membership_status_changed"
  | "role_assigned"
  | "role_revoked"
  | "account_verified"
  | "conduct_acknowledged"
  | "graduation_conferred"
  | "verification_submitted"
  | "verification_decided";

export interface CommunityEventPayload {
  accountId?: string;
  tierKey?: string;
  role?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

export async function emitCommunityEvent(
  event: CommunityEventName,
  payload: CommunityEventPayload
): Promise<void> {
  if (typeof window !== "undefined") return;

  try {
    const analyticsUrl = process.env.ANALYTICS_SERVER_ENDPOINT;
    if (!analyticsUrl) {
      if (process.env.NODE_ENV === "development") {
        console.info("[Community Analytics]", event, payload);
      }
      return;
    }

    await fetch(`${analyticsUrl}/events/community`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ANALYTICS_SERVER_KEY ?? ""}`,
      },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        ...payload,
      }),
    });
  } catch (error) {
    console.error("[Community Analytics] Failed to emit event:", event, error);
  }
}
