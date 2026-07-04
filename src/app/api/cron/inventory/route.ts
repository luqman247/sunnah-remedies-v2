/**
 * Phase 8 — Inventory Cron Job
 *
 * Runs daily to check for low stock and expiring batches.
 * Emits inventory.low and inventory.batch_expiring events.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  checkAndEmitLowStockAlerts,
  checkAndEmitExpiryAlerts,
} from "@/operations/inventory/service";
import { logger } from "@/operations/logging";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [lowStockEmitted, expiryEmitted] = await Promise.all([
      checkAndEmitLowStockAlerts(),
      checkAndEmitExpiryAlerts(90),
    ]);

    logger.info("Inventory cron completed", { lowStockEmitted, expiryEmitted });

    return NextResponse.json({
      status: "ok",
      lowStockAlerts: lowStockEmitted,
      expiryAlerts: expiryEmitted,
    });
  } catch (error) {
    logger.error("Inventory cron failed", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
