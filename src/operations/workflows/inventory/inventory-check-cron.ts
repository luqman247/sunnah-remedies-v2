/**
 * Phase 8 — Inventory Check Cron (Inngest)
 *
 * Daily stock and expiry checks via Inngest scheduling.
 */

import { inngest } from "../../engine/client";
import {
  checkAndEmitLowStockAlerts,
  checkAndEmitExpiryAlerts,
} from "../../inventory/service";
import { logger } from "../../logging";

export const inventoryCheckCron = inngest.createFunction(
  {
    id: "cron-inventory-check",
    name: "Daily Inventory Check",
    retries: 2,
    triggers: [{ cron: "0 6 * * *" }],
  },
  async () => {
    const [lowStockEmitted, expiryEmitted] = await Promise.all([
      checkAndEmitLowStockAlerts(),
      checkAndEmitExpiryAlerts(90),
    ]);

    logger.info("Inventory cron completed", { lowStockEmitted, expiryEmitted });

    return {
      status: "ok",
      lowStockAlerts: lowStockEmitted,
      expiryAlerts: expiryEmitted,
    };
  }
);
