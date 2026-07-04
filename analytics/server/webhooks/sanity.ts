/**
 * Sanity webhook analytics — publish triggers.
 *
 * On content publish, triggers:
 *   - Content freshness recalculation
 *   - Schema/internal-link validation crawl
 *   - Knowledge graph update events
 */

interface SanityWebhookPayload {
  _id: string;
  _type: string;
  _rev: string;
  title?: string;
  slug?: { current?: string };
  _updatedAt?: string;
}

export async function processContentPublish(
  payload: Record<string, unknown>
): Promise<void> {
  const doc = payload as unknown as SanityWebhookPayload;

  console.info(
    JSON.stringify({
      _type: "analytics_event",
      event_name: "content_published",
      params: {
        document_id: doc._id,
        document_type: doc._type,
        title: doc.title,
        slug: doc.slug?.current,
      },
      timestamp: new Date().toISOString(),
      source: "webhook",
    })
  );
}

/**
 * Assess content freshness based on last update date.
 */
export function assessFreshness(
  lastUpdated: string,
  reviewIntervalDays = 180
): "fresh" | "due_review" | "stale" {
  const updated = new Date(lastUpdated);
  const now = new Date();
  const daysSinceUpdate = Math.floor(
    (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceUpdate < reviewIntervalDays * 0.75) return "fresh";
  if (daysSinceUpdate < reviewIntervalDays) return "due_review";
  return "stale";
}
