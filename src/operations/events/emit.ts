/**
 * Phase 8 — Event Emitter
 *
 * Sends events to the Inngest orchestration engine.
 * Events carry references (IDs), never sensitive payloads.
 */

import { inngest } from "../engine/client";
import type { EventName } from "./contract";

export function createEventId(): string {
  return crypto.randomUUID();
}

export function createCorrelationId(): string {
  return crypto.randomUUID();
}

interface EmitOptions {
  correlationId?: string;
  source?: string;
}

export async function emitEvent(
  name: EventName,
  data: Record<string, unknown>,
  options: EmitOptions = {}
): Promise<string> {
  const eventId = createEventId();

  await inngest.send({
    name,
    data,
    id: eventId,
    ts: Date.now(),
  });

  console.info(`[Event] Emitted ${name}`, {
    eventId,
    correlationId: options.correlationId,
    source: options.source ?? "app",
  });

  return eventId;
}

export async function emitBatch(
  events: Array<{ name: EventName; data: Record<string, unknown> }>,
  options: EmitOptions = {}
): Promise<string[]> {
  const ids: string[] = [];

  const batch = events.map((e) => {
    const eventId = createEventId();
    ids.push(eventId);
    return {
      name: e.name,
      data: e.data,
      id: eventId,
      ts: Date.now(),
    };
  });

  await inngest.send(batch);

  console.info(`[Event] Emitted batch of ${batch.length} events`, {
    correlationId: options.correlationId,
    names: events.map((e) => e.name),
  });

  return ids;
}
