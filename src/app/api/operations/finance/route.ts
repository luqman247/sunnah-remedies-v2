/**
 * Phase 8 — Finance API
 *
 * Revenue reports, reconciliation status, accounting exports.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getRevenueReport,
  getReconciliationStatus,
  exportToXeroFormat,
  exportToQuickBooksFormat,
} from "@/operations/finance/exports";

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action") ?? "report";
  const fromStr = request.nextUrl.searchParams.get("from");
  const toStr = request.nextUrl.searchParams.get("to");

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const from = fromStr ? new Date(fromStr) : thirtyDaysAgo;
  const to = toStr ? new Date(toStr) : now;

  switch (action) {
    case "report": {
      const report = await getRevenueReport(from, to);
      return NextResponse.json(report);
    }

    case "reconciliation": {
      const status = await getReconciliationStatus();
      return NextResponse.json(status);
    }

    case "export-xero": {
      const csv = await exportToXeroFormat(from, to);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="sunnah-remedies-xero-${from.toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    case "export-quickbooks": {
      const csv = await exportToQuickBooksFormat(from, to);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="sunnah-remedies-quickbooks-${from.toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
