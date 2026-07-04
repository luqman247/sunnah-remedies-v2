/**
 * Phase 8 — Finance Exports
 *
 * Generates accounting exports in Xero- and QuickBooks-ready formats.
 * Revenue reports segmented by stream: course, journey, product, total.
 */

import { db, schema } from "../../db";
import { eq, gte, lte, and, desc, sql, count, sum } from "drizzle-orm";

export interface RevenueReport {
  period: string;
  streams: Record<string, { revenue: number; count: number; vat: number }>;
  total: { revenue: number; count: number; vat: number };
}

export async function getRevenueReport(from: Date, to: Date): Promise<RevenueReport> {
  const entries = await db
    .select()
    .from(schema.financeLedger)
    .where(
      and(
        eq(schema.financeLedger.type, "payment"),
        gte(schema.financeLedger.occurredAt, from),
        lte(schema.financeLedger.occurredAt, to)
      )
    );

  const streams: Record<string, { revenue: number; count: number; vat: number }> = {};
  let totalRevenue = 0;
  let totalCount = 0;
  let totalVat = 0;

  for (const entry of entries) {
    const stream = entry.revenueStream ?? "other";
    if (!streams[stream]) {
      streams[stream] = { revenue: 0, count: 0, vat: 0 };
    }
    const amount = parseFloat(entry.amount);
    const vat = parseFloat(entry.vatAmount ?? "0");
    streams[stream].revenue += amount;
    streams[stream].count += 1;
    streams[stream].vat += vat;
    totalRevenue += amount;
    totalCount += 1;
    totalVat += vat;
  }

  return {
    period: `${from.toISOString().split("T")[0]} to ${to.toISOString().split("T")[0]}`,
    streams,
    total: { revenue: totalRevenue, count: totalCount, vat: totalVat },
  };
}

export async function exportToXeroFormat(from: Date, to: Date): Promise<string> {
  const entries = await db
    .select()
    .from(schema.financeLedger)
    .where(
      and(
        gte(schema.financeLedger.occurredAt, from),
        lte(schema.financeLedger.occurredAt, to)
      )
    )
    .orderBy(schema.financeLedger.occurredAt);

  const headers = [
    "*ContactName", "*InvoiceNumber", "*InvoiceDate", "*DueDate",
    "Description", "*Quantity", "*UnitAmount", "*AccountCode",
    "*TaxType", "TaxAmount", "Currency",
  ].join(",");

  const rows = entries.map((entry) => [
    "Sunnah Remedies",
    entry.id,
    new Date(entry.occurredAt).toLocaleDateString("en-GB"),
    new Date(entry.occurredAt).toLocaleDateString("en-GB"),
    (entry.description ?? "").replace(/,/g, ";"),
    1,
    entry.amount,
    entry.type === "payment" ? "200" : "400",
    "20% (VAT on Income)",
    entry.vatAmount ?? "0",
    entry.currency,
  ].join(","));

  return [headers, ...rows].join("\n");
}

export async function exportToQuickBooksFormat(from: Date, to: Date): Promise<string> {
  const entries = await db
    .select()
    .from(schema.financeLedger)
    .where(
      and(
        gte(schema.financeLedger.occurredAt, from),
        lte(schema.financeLedger.occurredAt, to)
      )
    )
    .orderBy(schema.financeLedger.occurredAt);

  const headers = [
    "TransactionType", "Date", "Amount", "Tax",
    "Account", "Description", "Currency", "Reference",
  ].join(",");

  const rows = entries.map((entry) => [
    entry.type === "payment" ? "Sales Receipt" : "Refund Receipt",
    new Date(entry.occurredAt).toLocaleDateString("en-GB"),
    entry.amount,
    entry.vatAmount ?? "0",
    entry.type === "payment" ? "Sales" : "Refunds",
    (entry.description ?? "").replace(/,/g, ";"),
    entry.currency,
    entry.stripePaymentId ?? "",
  ].join(","));

  return [headers, ...rows].join("\n");
}

export async function getReconciliationStatus() {
  const unreconciledCount = await db
    .select({ c: count() })
    .from(schema.financeLedger)
    .where(eq(schema.financeLedger.reconciled, false));

  const reconciledCount = await db
    .select({ c: count() })
    .from(schema.financeLedger)
    .where(eq(schema.financeLedger.reconciled, true));

  return {
    unreconciled: unreconciledCount[0]?.c ?? 0,
    reconciled: reconciledCount[0]?.c ?? 0,
  };
}
