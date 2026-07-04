/**
 * Phase 8 — Inngest Client
 *
 * Central orchestration engine. All durable workflows register
 * through this client. Events flow in; side effects fan out.
 */

import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "sunnah-remedies",
});
